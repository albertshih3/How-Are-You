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
    // New metadata fields
    location: v.optional(v.string()),
    weather: v.optional(v.string()),
    socialContext: v.optional(v.array(v.string())),
    photoUrl: v.optional(v.string()),
    encryptedImageStorageId: v.optional(v.string()),
    encryptedImageIv: v.optional(v.string()),
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
      // New metadata fields
      location: args.location,
      weather: args.weather,
      socialContext: args.socialContext,
      photoUrl: args.photoUrl,
      encryptedImageStorageId: args.encryptedImageStorageId,
      encryptedImageIv: args.encryptedImageIv,
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

export const updateEntry = mutation({
  args: {
    entryId: v.id("entries"),
    moodType: v.optional(v.string()),
    moodIntensity: v.optional(v.number()),
    encryptedNotes: v.optional(v.string()),
    encryptedTags: v.optional(v.string()),
    iv: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    weather: v.optional(v.string()),
    socialContext: v.optional(v.array(v.string())),
    photoUrl: v.optional(v.string()),
    encryptedImageStorageId: v.optional(v.string()),
    encryptedImageIv: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to updateEntry");
    }

    const userId = getStableUserId(identity);

    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    if (entry.userId !== userId) {
      throw new Error("Unauthorized to update this entry");
    }

    const updates: any = {};
    if (args.moodType !== undefined) updates.moodType = args.moodType;
    if (args.moodIntensity !== undefined) updates.moodIntensity = args.moodIntensity;
    if (args.encryptedNotes !== undefined) updates.encryptedNotes = args.encryptedNotes;
    if (args.encryptedTags !== undefined) updates.encryptedTags = args.encryptedTags;
    if (args.iv !== undefined) updates.iv = args.iv;
    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.location !== undefined) updates.location = args.location;
    if (args.weather !== undefined) updates.weather = args.weather;
    if (args.socialContext !== undefined) updates.socialContext = args.socialContext;
    if (args.photoUrl !== undefined) updates.photoUrl = args.photoUrl;
    if (args.encryptedImageStorageId !== undefined) updates.encryptedImageStorageId = args.encryptedImageStorageId;
    if (args.encryptedImageIv !== undefined) updates.encryptedImageIv = args.encryptedImageIv;

    await ctx.db.patch(args.entryId, updates);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to generateUploadUrl");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
