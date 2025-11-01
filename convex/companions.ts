import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get default companion (first one in database)
export const getDefault = query({
  args: {},
  handler: async (ctx) => {
    const companion = await ctx.db.query("companions").first();
    if (!companion) {
      throw new Error("No companion found");
    }
    return companion;
  },
});

// Get companion by ID
export const get = query({
  args: { id: v.id("companions") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Update companion
export const update = mutation({
  args: {
    id: v.id("companions"),
    name: v.optional(v.string()),
    mood: v.optional(v.string()),
    energy: v.optional(v.number()),
    happiness: v.optional(v.number()),
    level: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

// Interact with companion (feed, play, train)
export const interact = mutation({
  args: {
    action: v.union(v.literal("feed"), v.literal("play"), v.literal("train")),
  },
  handler: async (ctx, { action }) => {
    const companion = await ctx.db.query("companions").first();
    if (!companion) {
      throw new Error("No companion found");
    }

    let updates: { energy?: number; happiness?: number; level?: number } = {};

    switch (action) {
      case "feed":
        updates = {
          energy: Math.min(100, companion.energy + 10),
          happiness: Math.min(100, companion.happiness + 5),
        };
        break;
      case "play":
        updates = {
          happiness: Math.min(100, companion.happiness + 10),
          energy: Math.max(0, companion.energy - 5),
        };
        break;
      case "train":
        updates = {
          level: companion.level + 1,
          energy: Math.max(0, companion.energy - 10),
        };
        break;
    }

    await ctx.db.patch(companion._id, updates);
    return await ctx.db.get(companion._id);
  },
});
