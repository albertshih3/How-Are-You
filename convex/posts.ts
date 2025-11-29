import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

type Identity = {
  tokenIdentifier: string;
  subject?: string;
  name?: string;
  email?: string;
};

function getStableUserId(identity: Identity) {
  return identity.subject ?? identity.tokenIdentifier;
}

// Get current user's profile for display name
async function getUserProfile(ctx: any, userId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .unique();
}

// Check if user is in cooldown period
export const checkPostCooldown = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { canPost: false, minutesRemaining: 0 };
    }

    const userId = getStableUserId(identity);
    const user = await getUserProfile(ctx, userId);

    if (!user || !user.lastPostAt) {
      return { canPost: true, minutesRemaining: 0 };
    }

    const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
    const now = Date.now();
    const timeSinceLastPost = now - user.lastPostAt;

    if (timeSinceLastPost >= COOLDOWN_MS) {
      return { canPost: true, minutesRemaining: 0 };
    }

    const minutesRemaining = Math.ceil((COOLDOWN_MS - timeSinceLastPost) / 60000);
    return { canPost: false, minutesRemaining };
  },
});

// Create a new post
export const createPost = mutation({
  args: {
    category: v.union(
      v.literal("wins"),
      v.literal("support"),
      v.literal("coping"),
      v.literal("resources"),
      v.literal("questions"),
      v.literal("reflections")
    ),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    isAnonymous: v.boolean(),
    contentWarning: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to createPost");
    }

    const userId = getStableUserId(identity);
    const user = await getUserProfile(ctx, userId);

    if (!user) {
      throw new Error("User profile not found");
    }

    // Check cooldown for published posts only
    if (args.status !== "draft") {
      if (user.lastPostAt) {
        const COOLDOWN_MS = 30 * 60 * 1000;
        const timeSinceLastPost = Date.now() - user.lastPostAt;
        if (timeSinceLastPost < COOLDOWN_MS) {
          throw new Error("Please wait before posting again");
        }
      }
    }

    // Validate content length
    if (args.content.length < 50) {
      throw new Error("Post content must be at least 50 characters");
    }
    if (args.content.length > 2000) {
      throw new Error("Post content must be less than 2000 characters");
    }

    // Validate title length
    if (args.title.length < 5) {
      throw new Error("Title must be at least 5 characters");
    }
    if (args.title.length > 100) {
      throw new Error("Title must be less than 100 characters");
    }

    const authorDisplayName = args.isAnonymous
      ? "Anonymous"
      : user.nickname || user.fullName || "User";

    const now = Date.now();
    const status = args.status || "published";

    const postId = await ctx.db.insert("posts", {
      userId,
      authorDisplayName,
      isAnonymous: args.isAnonymous,
      category: args.category,
      title: args.title,
      content: args.content,
      tags: args.tags,
      contentWarning: args.contentWarning,
      status,
      supportCount: 0,
      responseCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Update user's lastPostAt only for published posts
    if (status === "published") {
      await ctx.db.patch(user._id, { lastPostAt: now });
    }

    return postId;
  },
});

// Update an existing post
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    contentWarning: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to updatePost");
    }

    const userId = getStableUserId(identity);
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("You can only edit your own posts");
    }

    // Validate content length if provided
    if (args.content !== undefined) {
      if (args.content.length < 50) {
        throw new Error("Post content must be at least 50 characters");
      }
      if (args.content.length > 2000) {
        throw new Error("Post content must be less than 2000 characters");
      }
    }

    // Validate title length if provided
    if (args.title !== undefined) {
      if (args.title.length < 5) {
        throw new Error("Title must be at least 5 characters");
      }
      if (args.title.length > 100) {
        throw new Error("Title must be less than 100 characters");
      }
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.contentWarning !== undefined) updates.contentWarning = args.contentWarning;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.postId, updates);

    return args.postId;
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to deletePost");
    }

    const userId = getStableUserId(identity);
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("You can only delete your own posts");
    }

    // Delete all responses to this post
    const responses = await ctx.db
      .query("postResponses")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const response of responses) {
      await ctx.db.delete(response._id);
    }

    // Delete the post
    await ctx.db.delete(args.postId);
  },
});

// Get a single post by ID
export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }

    // Only return published posts or user's own drafts
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity ? getStableUserId(identity) : null;

    if (post.status === "draft" && post.userId !== userId) {
      return null;
    }

    return post;
  },
});

// Get community posts with pagination and filtering
export const getCommunityPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(
      v.union(
        v.literal("wins"),
        v.literal("support"),
        v.literal("coping"),
        v.literal("resources"),
        v.literal("questions"),
        v.literal("reflections")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query;

    if (args.category) {
      // Filter by category
      query = ctx.db
        .query("posts")
        .withIndex("by_category_status_createdAt", (q) =>
          q.eq("category", args.category!).eq("status", "published")
        )
        .order("desc");
    } else {
      // All published posts
      query = ctx.db
        .query("posts")
        .withIndex("by_status_createdAt", (q) => q.eq("status", "published"))
        .order("desc");
    }

    return await query.paginate(args.paginationOpts);
  },
});

// Get user's own posts
export const getUserPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = getStableUserId(identity);

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return posts;
  },
});

// Toggle support on a post
export const toggleSupport = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to toggleSupport");
    }

    const userId = getStableUserId(identity);
    const user = await getUserProfile(ctx, userId);
    const post = await ctx.db.get(args.postId);

    if (!user) {
      throw new Error("User profile not found");
    }

    if (!post) {
      throw new Error("Post not found");
    }

    const supportedPosts = user.supportedPosts || [];
    const isCurrentlySupported = supportedPosts.includes(args.postId);

    if (isCurrentlySupported) {
      // Remove support
      const newSupportedPosts = supportedPosts.filter((id: string) => id !== args.postId);
      await ctx.db.patch(user._id, { supportedPosts: newSupportedPosts });
      await ctx.db.patch(args.postId, {
        supportCount: Math.max(0, post.supportCount - 1),
      });
      return false;
    } else {
      // Add support
      const newSupportedPosts = [...supportedPosts, args.postId];
      await ctx.db.patch(user._id, { supportedPosts: newSupportedPosts });
      await ctx.db.patch(args.postId, {
        supportCount: post.supportCount + 1,
      });
      return true;
    }
  },
});

// Check if current user has supported a post
export const hasSupported = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const userId = getStableUserId(identity);
    const user = await getUserProfile(ctx, userId);

    if (!user) {
      return false;
    }

    const supportedPosts = user.supportedPosts || [];
    return supportedPosts.includes(args.postId);
  },
});

// Get recent posts for dashboard highlights (limited to 3)
export const getRecentHighlights = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(3);

    return posts;
  },
});
