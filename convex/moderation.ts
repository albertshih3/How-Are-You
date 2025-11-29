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

// Report a post or response
export const reportContent = mutation({
  args: {
    postId: v.optional(v.id("posts")),
    responseId: v.optional(v.id("postResponses")),
    reason: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to reportContent");
    }

    const userId = getStableUserId(identity);

    // Validate that either postId or responseId is provided, but not both
    if ((!args.postId && !args.responseId) || (args.postId && args.responseId)) {
      throw new Error("Must report either a post or a response, not both or neither");
    }

    // Verify the content exists
    if (args.postId) {
      const post = await ctx.db.get(args.postId);
      if (!post) {
        throw new Error("Post not found");
      }
    }

    if (args.responseId) {
      const response = await ctx.db.get(args.responseId);
      if (!response) {
        throw new Error("Response not found");
      }
    }

    // Validate description
    if (args.description.length < 10) {
      throw new Error("Please provide a more detailed description");
    }

    const reportId = await ctx.db.insert("postReports", {
      postId: args.postId,
      responseId: args.responseId,
      reportedBy: userId,
      reason: args.reason,
      description: args.description,
      status: "pending",
      createdAt: Date.now(),
    });

    return reportId;
  },
});

// Get pending reports (admin only - for future use)
export const getPendingReports = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to getPendingReports");
    }

    // TODO: Add admin role check when admin system is implemented
    // For now, this is a placeholder for future moderation dashboard

    const reports = await ctx.db
      .query("postReports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();

    return reports;
  },
});

// Update report status (admin only - for future use)
export const updateReportStatus = mutation({
  args: {
    reportId: v.id("postReports"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("actioned")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to updateReportStatus");
    }

    // TODO: Add admin role check when admin system is implemented

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
    });

    return args.reportId;
  },
});

// Get all reports (admin only - for future use)
export const getAllReports = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to getAllReports");
    }

    // TODO: Add admin role check when admin system is implemented

    const reports = await ctx.db
      .query("postReports")
      .order("desc")
      .collect();

    return reports;
  },
});
