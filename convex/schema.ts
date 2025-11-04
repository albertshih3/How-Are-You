import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const users = defineTable({
  userId: v.string(),
  email: v.optional(v.string()),
  fullName: v.optional(v.string()),
  nickname: v.optional(v.string()),
  pronouns: v.optional(v.string()),
  birthday: v.optional(v.string()),
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
  notes: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
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
