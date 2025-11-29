import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

// Create a response to a post
export const createResponse = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to createResponse");
    }

    const userId = getStableUserId(identity);
    const user = await getUserProfile(ctx, userId);

    if (!user) {
      throw new Error("User profile not found");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Validate content length
    if (args.content.length < 20) {
      throw new Error("Response must be at least 20 characters");
    }
    if (args.content.length > 1000) {
      throw new Error("Response must be less than 1000 characters");
    }

    const authorDisplayName = args.isAnonymous
      ? "Anonymous"
      : user.nickname || user.fullName || "User";

    // Create the response
    const responseId = await ctx.db.insert("postResponses", {
      postId: args.postId,
      userId,
      authorDisplayName,
      isAnonymous: args.isAnonymous,
      content: args.content,
      createdAt: Date.now(),
    });

    // Increment the response count on the post
    await ctx.db.patch(args.postId, {
      responseCount: post.responseCount + 1,
    });

    return responseId;
  },
});

// Get all responses for a post
export const getPostResponses = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("postResponses")
      .withIndex("by_postId_createdAt", (q) => q.eq("postId", args.postId))
      .order("asc") // Oldest first, like a conversation thread
      .collect();

    return responses;
  },
});

// Delete a response
export const deleteResponse = mutation({
  args: {
    responseId: v.id("postResponses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to deleteResponse");
    }

    const userId = getStableUserId(identity);
    const response = await ctx.db.get(args.responseId);

    if (!response) {
      throw new Error("Response not found");
    }

    if (response.userId !== userId) {
      throw new Error("You can only delete your own responses");
    }

    const post = await ctx.db.get(response.postId);

    // Delete the response
    await ctx.db.delete(args.responseId);

    // Decrement the response count on the post
    if (post) {
      await ctx.db.patch(response.postId, {
        responseCount: Math.max(0, post.responseCount - 1),
      });
    }
  },
});

// Get user's own responses
export const getUserResponses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = getStableUserId(identity);

    const responses = await ctx.db
      .query("postResponses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return responses;
  },
});
