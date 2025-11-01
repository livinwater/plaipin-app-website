import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  companions: defineTable({
    name: v.string(),
    mood: v.string(),
    energy: v.number(),
    happiness: v.number(),
    level: v.number(),
  }),

  items: defineTable({
    name: v.string(),
    category: v.string(),
    price: v.number(),
    color: v.string(),
  }),

  inventory: defineTable({
    companionId: v.id("companions"),
    itemId: v.id("items"),
    quantity: v.number(),
    equipped: v.number(), // 0 or 1 (boolean as int)
  })
    .index("by_companion", ["companionId"])
    .index("by_companion_and_item", ["companionId", "itemId"]),

  journalEntries: defineTable({
    companionId: v.id("companions"),
    title: v.string(),
    content: v.string(),
    mood: v.string(),
  }).index("by_companion", ["companionId"]),

  messages: defineTable({
    companionId: v.id("companions"),
    conversationWith: v.string(),
    senderName: v.string(),
    text: v.string(),
    isOwn: v.number(), // 0 or 1 (boolean as int)
  })
    .index("by_companion", ["companionId"])
    .index("by_conversation", ["companionId", "conversationWith"]),
});
