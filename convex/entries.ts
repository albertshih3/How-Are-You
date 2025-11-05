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

export const createEntry = mutation({
  args: {
    moodType: v.string(),
    moodIntensity: v.number(),
    // New encrypted fields
    encryptedNotes: v.optional(v.string()),
    encryptedTags: v.optional(v.string()),
    iv: v.optional(v.string()),
    // Legacy plaintext fields (kept for backward compatibility)
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to createEntry");
    }

    const userId = getStableUserId(identity);

    const entry = {
      userId,
      timestamp: Date.now(),
      moodType: args.moodType,
      moodIntensity: args.moodIntensity,
      // Store encrypted fields if provided
      encryptedNotes: args.encryptedNotes,
      encryptedTags: args.encryptedTags,
      iv: args.iv,
      // Fallback to plaintext fields for backward compatibility
      notes: args.notes,
      tags: args.tags ?? [],
    };

    return ctx.db.insert("entries", entry);
  },
});

export const getRecentEntries = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = getStableUserId(identity);
    const limit = args.limit ?? 5;

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return entries;
  },
});

export const getAllUserEntries = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = getStableUserId(identity);

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return entries;
  },
});

export const getEntriesByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = getStableUserId(identity);

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_userId_and_timestamp", (q) =>
        q.eq("userId", userId).gte("timestamp", args.startDate).lte("timestamp", args.endDate)
      )
      .collect();

    return entries;
  },
});

export const deleteEntry = mutation({
  args: {
    entryId: v.id("entries"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to deleteEntry");
    }

    const userId = getStableUserId(identity);

    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    if (entry.userId !== userId) {
      throw new Error("Unauthorized to delete this entry");
    }

    await ctx.db.delete(args.entryId);
  },
});

/**
 * Update an entry to add encrypted fields and clear plaintext fields.
 * Used during migration from plaintext to encrypted storage.
 */
export const updateEntryEncryption = mutation({
  args: {
    entryId: v.id("entries"),
    encryptedNotes: v.string(),
    encryptedTags: v.string(),
    iv: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to updateEntryEncryption");
    }

    const userId = getStableUserId(identity);

    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    if (entry.userId !== userId) {
      throw new Error("Unauthorized to update this entry");
    }

    // Update with encrypted fields and clear plaintext fields
    await ctx.db.patch(args.entryId, {
      encryptedNotes: args.encryptedNotes,
      encryptedTags: args.encryptedTags,
      iv: args.iv,
      notes: undefined, // Clear plaintext
      tags: [], // Clear plaintext
    });
  },
});
