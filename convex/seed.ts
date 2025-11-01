import { mutation } from "./_generated/server";

// Run this once to populate your database with initial data
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingCompanion = await ctx.db.query("companions").first();
    if (existingCompanion) {
      return { message: "Database already seeded" };
    }

    // Create default companion
    const companionId = await ctx.db.insert("companions", {
      name: "Buddy",
      mood: "Happy",
      energy: 85,
      happiness: 92,
      level: 12,
    });

    // Create store items
    const item1 = await ctx.db.insert("items", {
      name: "Rainbow Ball",
      price: 150,
      category: "Toys",
      color: "bg-gradient-to-br from-red-400 to-purple-400",
    });

    const item2 = await ctx.db.insert("items", {
      name: "Cozy Bed",
      price: 300,
      category: "Furniture",
      color: "bg-gradient-to-br from-blue-400 to-cyan-400",
    });

    const item3 = await ctx.db.insert("items", {
      name: "Party Hat",
      price: 100,
      category: "Accessories",
      color: "bg-gradient-to-br from-yellow-400 to-orange-400",
    });

    const item4 = await ctx.db.insert("items", {
      name: "Training Guide",
      price: 200,
      category: "Books",
      color: "bg-gradient-to-br from-green-400 to-emerald-400",
    });

    const item5 = await ctx.db.insert("items", {
      name: "Friendship Bracelet",
      price: 120,
      category: "Accessories",
      color: "bg-gradient-to-br from-pink-400 to-rose-400",
    });

    const item6 = await ctx.db.insert("items", {
      name: "Energy Drink",
      price: 80,
      category: "Consumables",
      color: "bg-gradient-to-br from-purple-400 to-indigo-400",
    });

    // Add some items to inventory
    await ctx.db.insert("inventory", {
      companionId,
      itemId: item1,
      quantity: 2,
      equipped: 1,
    });

    await ctx.db.insert("inventory", {
      companionId,
      itemId: item2,
      quantity: 1,
      equipped: 1,
    });

    await ctx.db.insert("inventory", {
      companionId,
      itemId: item3,
      quantity: 3,
      equipped: 0,
    });

    // Create journal entries
    await ctx.db.insert("journalEntries", {
      companionId,
      title: "A wonderful day at the park",
      content:
        "Today Buddy and I went to the park. We met Luna and had so much fun playing together...",
      mood: "Happy",
    });

    await ctx.db.insert("journalEntries", {
      companionId,
      title: "Halloween adventures",
      content:
        "What a fun Halloween! Buddy dressed up and we went trick-or-treating with friends...",
      mood: "Excited",
    });

    // Create messages
    await ctx.db.insert("messages", {
      companionId,
      conversationWith: "Luna",
      senderName: "Luna",
      text: "Hey Buddy! How are you today?",
      isOwn: 0,
    });

    await ctx.db.insert("messages", {
      companionId,
      conversationWith: "Luna",
      senderName: "Buddy",
      text: "I'm doing great! Just finished training.",
      isOwn: 1,
    });

    await ctx.db.insert("messages", {
      companionId,
      conversationWith: "Luna",
      senderName: "Luna",
      text: "Let's play together!",
      isOwn: 0,
    });

    return { message: "Database seeded successfully!" };
  },
});
