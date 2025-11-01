import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get messages for a companion, optionally filtered by conversation
export const getByCompanion = query({
  args: {
    companionId: v.id("companions"),
    conversationWith: v.optional(v.string()),
  },
  handler: async (ctx, { companionId, conversationWith }) => {
    let messagesQuery = ctx.db
      .query("messages")
      .withIndex("by_companion", (q) => q.eq("companionId", companionId));

    const messages = await messagesQuery.collect();

    // Filter by conversation if specified
    const filtered = conversationWith
      ? messages.filter((msg) => msg.conversationWith === conversationWith)
      : messages;

    // Sort by creation time
    return filtered.sort((a, b) => a._creationTime - b._creationTime);
  },
});

// Create new message
export const create = mutation({
  args: {
    companionId: v.id("companions"),
    conversationWith: v.string(),
    senderName: v.string(),
    text: v.string(),
    isOwn: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      ...args,
      isOwn: args.isOwn ?? 0,
    });
    return await ctx.db.get(id);
  },
});
