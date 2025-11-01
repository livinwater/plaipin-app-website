import { v } from "convex/values";
import { query } from "./_generated/server";

// Get all store items
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("items").collect();
  },
});

// Get item by ID
export const get = query({
  args: { id: v.id("items") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
