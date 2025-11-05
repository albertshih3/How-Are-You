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

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to ensureUser");
    }

    const userId = getStableUserId(identity);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const document: {
      userId: string;
      email?: string;
      fullName?: string;
      nickname?: string;
      pronouns?: string;
      birthday?: string;
    } = {
      userId,
    };

    if (identity.email) {
      document.email = identity.email;
    }

    if (identity.name) {
      document.fullName = identity.name;
    }

    return ctx.db.insert("users", document);
  },
});

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = getStableUserId(identity);

    return ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const updateProfile = mutation({
  args: {
    nickname: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    birthday: v.optional(v.string()),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to updateProfile");
    }

    const userId = getStableUserId(identity);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!existing) {
      throw new Error("Profile not found");
    }

    const updates: Record<string, string | undefined> = {};

    if (args.nickname !== undefined) {
      updates.nickname = args.nickname.trim() === "" ? undefined : args.nickname;
    }

    if (args.pronouns !== undefined) {
      updates.pronouns = args.pronouns.trim() === "" ? undefined : args.pronouns;
    }

    if (args.birthday !== undefined) {
      updates.birthday = args.birthday.trim() === "" ? undefined : args.birthday;
    }

    if (args.fullName !== undefined) {
      updates.fullName = args.fullName.trim() === "" ? undefined : args.fullName;
    }

    return ctx.db.patch(existing._id, updates);
  },
});

export const deleteProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to deleteProfile");
    }

    const userId = getStableUserId(identity);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!existing) {
      return;
    }

    await ctx.db.delete(existing._id);
  },
});

// --- Encryption Key Management ---

/**
 * Store the user's wrapped encryption key and related metadata.
 * This is called during initial encryption setup.
 */
export const storeEncryptionKey = mutation({
  args: {
    encryptedKey: v.string(),
    salt: v.string(),
    iv: v.string(),
    iterations: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = getStableUserId(identity);

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      encryptedKey: args.encryptedKey,
      keySalt: args.salt,
      keyIv: args.iv,
      keyIterations: args.iterations,
    });
  },
});

/**
 * Get the user's wrapped encryption key and related metadata.
 * This is called when unlocking encryption with a passphrase.
 */
export const getEncryptionKey = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = getStableUserId(identity);

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user) {
      return null;
    }

    return {
      encryptedKey: user.encryptedKey,
      salt: user.keySalt,
      iv: user.keyIv,
      iterations: user.keyIterations,
    };
  },
});

/**
 * Check if the user has encryption set up.
 * This is used to determine if we should show setup vs unlock dialog.
 */
export const hasEncryptionSetup = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const userId = getStableUserId(identity);

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return !!(user?.encryptedKey);
  },
});
