import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get inventory for a companion with item details
export const getByCompanion = query({
  args: { companionId: v.id("companions") },
  handler: async (ctx, { companionId }) => {
    const inventoryItems = await ctx.db
      .query("inventory")
      .withIndex("by_companion", (q) => q.eq("companionId", companionId))
      .collect();

    // Fetch item details for each inventory item, filtering out null items
    const itemsWithDetails = await Promise.all(
      inventoryItems.map(async (invItem) => {
        const item = await ctx.db.get(invItem.itemId);
        if (!item) return null;
        return {
          ...invItem,
          item,
        };
      })
    );

    // Filter out null entries
    return itemsWithDetails.filter((item): item is NonNullable<typeof item> => item !== null);
  },
});

// Add item to inventory (purchase)
export const addItem = mutation({
  args: {
    companionId: v.id("companions"),
    itemId: v.id("items"),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, { companionId, itemId, quantity = 1 }) => {
    // Check if item already exists in inventory
    const existing = await ctx.db
      .query("inventory")
      .withIndex("by_companion_and_item", (q) =>
        q.eq("companionId", companionId).eq("itemId", itemId)
      )
      .first();

    if (existing) {
      // Update quantity
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + quantity,
      });
      return await ctx.db.get(existing._id);
    } else {
      // Create new inventory item
      const id = await ctx.db.insert("inventory", {
        companionId,
        itemId,
        quantity,
        equipped: 0,
      });
      return await ctx.db.get(id);
    }
  },
});

// Update inventory item (equip/unequip)
export const updateItem = mutation({
  args: {
    id: v.id("inventory"),
    equipped: v.optional(v.number()),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});
