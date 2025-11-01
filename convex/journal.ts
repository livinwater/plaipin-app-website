import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all journal entries for a companion
export const getByCompanion = query({
  args: { companionId: v.id("companions") },
  handler: async (ctx, { companionId }) => {
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("by_companion", (q) => q.eq("companionId", companionId))
      .collect();

    // Sort by creation time (newest first)
    return entries.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Create new journal entry
export const create = mutation({
  args: {
    companionId: v.id("companions"),
    title: v.string(),
    content: v.string(),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("journalEntries", args);
    return await ctx.db.get(id);
  },
});
