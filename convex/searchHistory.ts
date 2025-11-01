import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all search history entries (newest first)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db
      .query("searchHistory")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100); // Limit to most recent 100 searches

    return entries;
  },
});

// Create new search history entry
export const save = mutation({
  args: {
    query: v.string(),
    answer: v.string(),
    documents: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("searchHistory", {
      ...args,
      timestamp: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

// Delete old search history (keep only last N days)
export const cleanup = mutation({
  args: {
    daysToKeep: v.number(),
  },
  handler: async (ctx, { daysToKeep }) => {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    const oldEntries = await ctx.db
      .query("searchHistory")
      .withIndex("by_timestamp")
      .filter((q) => q.lt(q.field("timestamp"), cutoffTime))
      .collect();

    for (const entry of oldEntries) {
      await ctx.db.delete(entry._id);
    }

    return { deleted: oldEntries.length };
  },
});
