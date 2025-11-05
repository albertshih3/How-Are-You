import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const users = defineTable({
  userId: v.string(),
  email: v.optional(v.string()),
  fullName: v.optional(v.string()),
  nickname: v.optional(v.string()),
  pronouns: v.optional(v.string()),
  birthday: v.optional(v.string()),
  // Encryption fields
  encryptedKey: v.optional(v.string()), // Base64 wrapped DEK
  keySalt: v.optional(v.string()), // Base64 salt for PBKDF2
  keyIv: v.optional(v.string()), // Base64 IV used for key wrapping
  keyIterations: v.optional(v.number()), // PBKDF2 iteration count (e.g., 100000)
})
  .index("by_userId", ["userId"])
  .searchIndex("search_by_nickname", {
    searchField: "nickname",
  });

const entries = defineTable({
  userId: v.string(),
  timestamp: v.number(),
  moodType: v.string(),
  moodIntensity: v.number(),
  // Encrypted fields (new)
  encryptedNotes: v.optional(v.string()), // Base64 ciphertext
  encryptedTags: v.optional(v.string()), // Base64 encrypted JSON array
  iv: v.optional(v.string()), // Base64 IV for this entry
  // Legacy plaintext fields (DEPRECATED - kept for backward compatibility during migration)
  notes: v.optional(v.string()), // DEPRECATED - will be removed after migration
  tags: v.optional(v.array(v.string())), // DEPRECATED - will become v.optional() after migration
})
  .index("by_userId", ["userId"])
  .index("by_userId_and_timestamp", ["userId", "timestamp"]);

const articles = defineTable({
  title: v.string(),
  description: v.string(),
  imageUrl: v.optional(v.string()),
  externalLink: v.string(),
  tags: v.array(v.string()),
  category: v.string(),
})
  .index("by_category", ["category"]);

export default defineSchema({
  users,
  entries,
  articles,
});
