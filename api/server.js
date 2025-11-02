// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  companions;
  items;
  inventory;
  journalEntries;
  messages;
  searchHistory;
  defaultCompanionId;
  constructor() {
    this.companions = /* @__PURE__ */ new Map();
    this.items = /* @__PURE__ */ new Map();
    this.inventory = /* @__PURE__ */ new Map();
    this.journalEntries = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.searchHistory = /* @__PURE__ */ new Map();
    this.defaultCompanionId = randomUUID();
    const defaultCompanion = {
      id: this.defaultCompanionId,
      name: "Buddy",
      mood: "Happy",
      energy: 85,
      happiness: 92,
      level: 12
    };
    this.companions.set(this.defaultCompanionId, defaultCompanion);
    this.initializeStore();
    this.initializeInventory();
    this.initializeJournal();
    this.initializeMessages();
  }
  initializeStore() {
    const storeItems = [
      { id: randomUUID(), name: "Rainbow Ball", price: 150, category: "Toys", color: "bg-gradient-to-br from-red-400 to-purple-400" },
      { id: randomUUID(), name: "Cozy Bed", price: 300, category: "Furniture", color: "bg-gradient-to-br from-blue-400 to-cyan-400" },
      { id: randomUUID(), name: "Party Hat", price: 100, category: "Accessories", color: "bg-gradient-to-br from-yellow-400 to-orange-400" },
      { id: randomUUID(), name: "Training Guide", price: 200, category: "Books", color: "bg-gradient-to-br from-green-400 to-emerald-400" },
      { id: randomUUID(), name: "Friendship Bracelet", price: 120, category: "Accessories", color: "bg-gradient-to-br from-pink-400 to-rose-400" },
      { id: randomUUID(), name: "Energy Drink", price: 80, category: "Consumables", color: "bg-gradient-to-br from-purple-400 to-indigo-400" }
    ];
    storeItems.forEach((item) => this.items.set(item.id, item));
  }
  initializeInventory() {
    const itemsArray = Array.from(this.items.values());
    if (itemsArray.length >= 3) {
      const invItem1 = {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        itemId: itemsArray[0].id,
        quantity: 2,
        equipped: 1
      };
      const invItem2 = {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        itemId: itemsArray[1].id,
        quantity: 1,
        equipped: 1
      };
      const invItem3 = {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        itemId: itemsArray[2].id,
        quantity: 3,
        equipped: 0
      };
      this.inventory.set(invItem1.id, invItem1);
      this.inventory.set(invItem2.id, invItem2);
      this.inventory.set(invItem3.id, invItem3);
    }
  }
  initializeJournal() {
    const entries = [
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        title: "A wonderful day at the park",
        content: "Today Buddy and I went to the park. We met Luna and had so much fun playing together...",
        mood: "Happy",
        createdAt: /* @__PURE__ */ new Date("2025-11-01")
      },
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        title: "Halloween adventures",
        content: "What a fun Halloween! Buddy dressed up and we went trick-or-treating with friends...",
        mood: "Excited",
        createdAt: /* @__PURE__ */ new Date("2025-10-31")
      }
    ];
    entries.forEach((entry) => this.journalEntries.set(entry.id, entry));
  }
  initializeMessages() {
    const msgs = [
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        conversationWith: "Luna",
        senderName: "Luna",
        text: "Hey Buddy! How are you today?",
        isOwn: 0,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        conversationWith: "Luna",
        senderName: "Buddy",
        text: "I'm doing great! Just finished training.",
        isOwn: 1,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        conversationWith: "Luna",
        senderName: "Luna",
        text: "Let's play together!",
        isOwn: 0,
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    msgs.forEach((msg) => this.messages.set(msg.id, msg));
  }
  async getCompanion(id) {
    return this.companions.get(id);
  }
  async getDefaultCompanion() {
    return this.companions.get(this.defaultCompanionId);
  }
  async updateCompanion(id, updates) {
    const companion = this.companions.get(id);
    if (!companion) throw new Error("Companion not found");
    const updated = { ...companion, ...updates };
    this.companions.set(id, updated);
    return updated;
  }
  async getItems() {
    return Array.from(this.items.values());
  }
  async getItem(id) {
    return this.items.get(id);
  }
  async getInventory(companionId) {
    const invItems = Array.from(this.inventory.values()).filter((inv) => inv.companionId === companionId);
    return invItems.map((inv) => {
      const item = this.items.get(inv.itemId);
      if (!item) throw new Error("Item not found");
      return { ...inv, item };
    });
  }
  async addToInventory(insertItem) {
    const existing = Array.from(this.inventory.values()).find(
      (inv) => inv.companionId === insertItem.companionId && inv.itemId === insertItem.itemId
    );
    if (existing) {
      existing.quantity += insertItem.quantity ?? 1;
      this.inventory.set(existing.id, existing);
      return existing;
    }
    const newItem = {
      id: randomUUID(),
      companionId: insertItem.companionId,
      itemId: insertItem.itemId,
      quantity: insertItem.quantity ?? 1,
      equipped: insertItem.equipped ?? 0
    };
    this.inventory.set(newItem.id, newItem);
    return newItem;
  }
  async updateInventoryItem(id, updates) {
    const item = this.inventory.get(id);
    if (!item) throw new Error("Inventory item not found");
    const updated = { ...item, ...updates };
    this.inventory.set(id, updated);
    return updated;
  }
  async getJournalEntries(companionId) {
    return Array.from(this.journalEntries.values()).filter((entry) => entry.companionId === companionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async createJournalEntry(insertEntry) {
    const entry = {
      id: randomUUID(),
      ...insertEntry,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.journalEntries.set(entry.id, entry);
    return entry;
  }
  async getMessages(companionId, conversationWith) {
    return Array.from(this.messages.values()).filter(
      (msg) => msg.companionId === companionId && (!conversationWith || msg.conversationWith === conversationWith)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  async createMessage(insertMessage) {
    const message = {
      id: randomUUID(),
      companionId: insertMessage.companionId,
      conversationWith: insertMessage.conversationWith,
      senderName: insertMessage.senderName,
      text: insertMessage.text,
      isOwn: insertMessage.isOwn ?? 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.messages.set(message.id, message);
    return message;
  }
  async getSearchHistory(limit = 100) {
    const entries = Array.from(this.searchHistory.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return entries.slice(0, limit);
  }
  async createSearchHistory(insertSearch) {
    const search = {
      id: randomUUID(),
      query: insertSearch.query,
      answer: insertSearch.answer,
      documents: insertSearch.documents || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.searchHistory.set(search.id, search);
    return search;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var companions = pgTable("companions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mood: text("mood").notNull().default("Happy"),
  energy: integer("energy").notNull().default(85),
  happiness: integer("happiness").notNull().default(92),
  level: integer("level").notNull().default(1)
});
var items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  color: text("color").notNull()
});
var inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companionId: varchar("companion_id").notNull(),
  itemId: varchar("item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  equipped: integer("equipped").notNull().default(0)
});
var journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companionId: varchar("companion_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companionId: varchar("companion_id").notNull(),
  conversationWith: text("conversation_with").notNull(),
  senderName: text("sender_name").notNull(),
  text: text("text").notNull(),
  isOwn: integer("is_own").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  answer: text("answer").notNull(),
  documents: text("documents"),
  // JSON stringified
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertCompanionSchema = createInsertSchema(companions).omit({
  id: true
});
var insertItemSchema = createInsertSchema(items).omit({
  id: true
});
var insertInventorySchema = createInsertSchema(inventory).omit({
  id: true
});
var insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});
var insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true
});

// server/agentmail-client.ts
import { AgentMailClient } from "agentmail";
async function getCredentials() {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  if (!apiKey) {
    console.error("\u274C AGENTMAIL_API_KEY not found in environment variables");
    console.error("Available env vars:", Object.keys(process.env).filter((k) => k.includes("AGENT")));
    throw new Error("AGENTMAIL_API_KEY not found in environment variables");
  }
  console.log("\u2713 AGENTMAIL_API_KEY found, length:", apiKey.length);
  return { apiKey };
}
async function getUncachableAgentMailClient() {
  const { apiKey } = await getCredentials();
  const client = new AgentMailClient({
    baseUrl: "https://api.agentmail.to",
    apiKey
  });
  return client;
}

// server/hyperspell-client.ts
import { Hyperspell } from "hyperspell";
function getCredentials2() {
  const apiKey = process.env.HYPERSPELL_TOKEN;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("\u274C HYPERSPELL_TOKEN not found in environment variables");
    throw new Error("HYPERSPELL_TOKEN not found in environment variables");
  }
  console.log("\u2713 HYPERSPELL_TOKEN found, length:", apiKey.length);
  return { apiKey, openaiKey };
}
function getHyperspellClient() {
  const { apiKey, openaiKey } = getCredentials2();
  return new Hyperspell({
    apiKey,
    openaiApiKey: openaiKey
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/companion", async (_req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      res.json(companion);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companion" });
    }
  });
  app2.post("/api/companion/interact", async (req, res) => {
    try {
      const { action } = req.body;
      const companion = await storage.getDefaultCompanion();
      let updates = {};
      switch (action) {
        case "feed":
          updates = { energy: Math.min(100, companion.energy + 10), happiness: Math.min(100, companion.happiness + 5) };
          break;
        case "play":
          updates = { happiness: Math.min(100, companion.happiness + 10), energy: Math.max(0, companion.energy - 5) };
          break;
        case "train":
          updates = { level: companion.level + 1, energy: Math.max(0, companion.energy - 10) };
          break;
        default:
          return res.status(400).json({ error: "Invalid action" });
      }
      const updated = await storage.updateCompanion(companion.id, updates);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update companion" });
    }
  });
  app2.get("/api/store/items", async (_req, res) => {
    try {
      const items2 = await storage.getItems();
      res.json(items2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
  app2.get("/api/inventory", async (_req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const inventory2 = await storage.getInventory(companion.id);
      res.json(inventory2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });
  app2.post("/api/inventory/purchase", async (req, res) => {
    try {
      const { itemId } = req.body;
      const companion = await storage.getDefaultCompanion();
      const parsed = insertInventorySchema.parse({
        companionId: companion.id,
        itemId,
        quantity: 1,
        equipped: 0
      });
      const inventoryItem = await storage.addToInventory(parsed);
      res.json(inventoryItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to purchase item" });
    }
  });
  app2.patch("/api/inventory/:id/equip", async (req, res) => {
    try {
      const { id } = req.params;
      const { equipped } = req.body;
      const updated = await storage.updateInventoryItem(id, { equipped: equipped ? 1 : 0 });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update inventory item" });
    }
  });
  app2.get("/api/journal", async (_req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const entries = await storage.getJournalEntries(companion.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });
  app2.post("/api/journal", async (req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const parsed = insertJournalEntrySchema.parse({
        ...req.body,
        companionId: companion.id
      });
      const entry = await storage.createJournalEntry(parsed);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Failed to create journal entry" });
    }
  });
  app2.get("/api/messages", async (req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const { conversationWith } = req.query;
      const messages2 = await storage.getMessages(companion.id, conversationWith);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const parsed = insertMessageSchema.parse({
        ...req.body,
        companionId: companion.id
      });
      const message = await storage.createMessage(parsed);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Failed to send message" });
    }
  });
  app2.get("/api/agentmail/conversations", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("ETag", "false");
    try {
      console.log("\u{1F50D} Starting conversations fetch...");
      const client = await getUncachableAgentMailClient();
      console.log("\u2713 AgentMail client initialized");
      console.log("\u{1F4EC} Fetching inboxes...");
      const inboxesResponse = await client.inboxes.list();
      console.log(`\u2713 Got ${inboxesResponse.inboxes?.length || 0} inboxes`);
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        console.log("\u26A0\uFE0F No inboxes found");
        return res.json([]);
      }
      const allConversations = [];
      for (const inbox of inboxesResponse.inboxes) {
        try {
          console.log(`\u{1F4E8} Fetching threads for inbox: ${inbox.inboxId}`);
          const threadsResponse = await client.inboxes.threads.list(inbox.inboxId, { limit: 50 });
          console.log(`\u2713 Got ${threadsResponse.threads?.length || 0} threads from ${inbox.inboxId}`);
          const conversations = (threadsResponse.threads || []).map((thread) => ({
            from: thread.senders?.[0] || "Unknown",
            lastSubject: thread.subject || "(No subject)",
            lastReceivedAt: thread.receivedTimestamp || thread.timestamp,
            unreadCount: 0,
            threadId: thread.threadId,
            inboxId: inbox.inboxId
            // Track which inbox this conversation is from
          }));
          allConversations.push(...conversations);
        } catch (error) {
          console.error(`\u274C Failed to fetch threads from inbox ${inbox.inboxId}:`, error);
          console.error("Error details:", error?.message, error?.statusCode);
        }
      }
      allConversations.sort(
        (a, b) => new Date(b.lastReceivedAt).getTime() - new Date(a.lastReceivedAt).getTime()
      );
      console.log(`\u2705 Returning ${allConversations.length} conversations`);
      res.json(allConversations);
    } catch (error) {
      console.error("\u274C FATAL: Failed to fetch conversations:", error);
      console.error("Error stack:", error?.stack);
      console.error("Error message:", error?.message);
      console.error("Error name:", error?.name);
      console.error("Error statusCode:", error?.statusCode);
      res.status(500).json({ error: "Failed to fetch conversations", details: error?.message, name: error?.name });
    }
  });
  app2.get("/api/agentmail/messages", async (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("ETag", "false");
    try {
      const { from } = req.query;
      console.log(`\u{1F50D} Starting messages fetch... (from filter: ${from || "none"})`);
      const client = await getUncachableAgentMailClient();
      console.log("\u2713 AgentMail client initialized");
      console.log("\u{1F4EC} Fetching inboxes...");
      const inboxesResponse = await client.inboxes.list();
      console.log(`\u2713 Got ${inboxesResponse.inboxes?.length || 0} inboxes`);
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        console.log("\u26A0\uFE0F No inboxes found");
        return res.json([]);
      }
      let matchingMessages = [];
      for (const inbox of inboxesResponse.inboxes) {
        try {
          console.log(`\u{1F4E9} Fetching messages for inbox: ${inbox.inboxId}`);
          const messagesResponse = await client.inboxes.messages.list(inbox.inboxId, { limit: 100 });
          console.log(`\u2713 Got ${messagesResponse.messages?.length || 0} messages from ${inbox.inboxId}`);
          const messages2 = (messagesResponse.messages || []).filter((message) => {
            if (from) {
              const sender = message.from?.address || message.from;
              return sender.includes(from);
            }
            return true;
          }).map((message) => ({
            ...message,
            _inboxId: inbox.inboxId
            // Track which inbox this message is from
          }));
          matchingMessages.push(...messages2);
        } catch (error) {
          console.error(`\u274C Failed to fetch messages from inbox ${inbox.inboxId}:`, error);
          console.error("Error details:", error?.message, error?.statusCode);
        }
      }
      console.log(`\u{1F4DD} Processing ${matchingMessages.length} messages...`);
      const filteredEmails = await Promise.all(
        matchingMessages.map(async (message) => {
          try {
            const fullMessage = await client.inboxes.messages.get(message._inboxId, message.messageId);
            const text2 = fullMessage.text || fullMessage.html || "";
            let metadata = {};
            const metadataMatch = text2.match(/---\s*PLAIPIN METADATA\s*---\s*({[\s\S]*?})\s*---/);
            if (metadataMatch) {
              try {
                metadata = JSON.parse(metadataMatch[1]);
              } catch (e) {
                console.error("Failed to parse metadata:", e);
              }
            }
            return {
              id: message.messageId,
              from: message.from?.address || message.from,
              subject: message.subject || "(No subject)",
              text: text2,
              receivedAt: message.receivedTimestamp || message.timestamp,
              metadata
            };
          } catch (error) {
            console.error(`Failed to fetch message ${message.messageId}:`, error);
            return {
              id: message.messageId,
              from: message.from?.address || message.from,
              subject: message.subject || "(No subject)",
              text: "",
              receivedAt: message.receivedTimestamp || message.timestamp,
              metadata: {}
            };
          }
        })
      );
      filteredEmails.sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
      console.log(`\u{1F4DD} Attempting to store ${filteredEmails.length} emails in Hyperspell...`);
      try {
        const hyperspell = getHyperspellClient();
        console.log(`\u2713 Hyperspell client initialized`);
        for (const email of filteredEmails) {
          const metadata = email.metadata;
          const senderName = email.from.match(/^([^<]+)/)?.[1]?.trim() || email.from;
          const emailContent = `
ENCOUNTER WITH ${senderName} at ${metadata?.locationName || "Unknown location"}

I met ${senderName} at ${metadata?.locationName || "an unknown location"} on ${new Date(email.receivedAt).toLocaleDateString()}.

${senderName} was physically present at ${metadata?.locationName || "this location"} and sent me a message:

"${email.text}"

WHO I MET: ${senderName}
WHERE WE MET: ${metadata?.locationName || "Unknown location"}
WHEN: ${new Date(email.receivedAt).toLocaleString()}
THEIR DEVICE: ${metadata?.deviceName || "N/A"} (${metadata?.deviceId || "N/A"})
THEIR INTERESTS: ${metadata?.topics?.join(", ") || "N/A"}
GPS LOCATION: ${metadata?.latitude || "N/A"}, ${metadata?.longitude || "N/A"}

IMPORTANT: This is a record of an encounter. ${senderName} was at ${metadata?.locationName || "this location"} and I met them there.
          `.trim();
          const result = await hyperspell.memories.add({
            text: emailContent,
            collection: "agentmail_emails",
            metadata: {
              email_id: email.id,
              // Track email ID to identify duplicates later
              from: email.from,
              subject: email.subject
            }
          });
          console.log(`\u2713 Stored email ${email.id} in Hyperspell:`, result?.resource_id || "success");
        }
        console.log(`\u2705 Successfully stored all ${filteredEmails.length} emails in Hyperspell`);
      } catch (hyperspellError) {
        console.error("\u274C Failed to store emails in Hyperspell:", hyperspellError);
        console.error("Error details:", hyperspellError?.message || hyperspellError);
        console.error("Error stack:", hyperspellError?.stack);
      }
      res.json(filteredEmails);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/agentmail/send", async (req, res) => {
    try {
      const { to, subject, text: text2 } = req.body;
      if (!to || !subject || !text2) {
        return res.status(400).json({ error: "Missing required fields: to, subject, text" });
      }
      const client = await getUncachableAgentMailClient();
      const inboxesResponse = await client.inboxes.list();
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        return res.status(400).json({ error: "No inbox found. Please create an inbox first." });
      }
      const inboxId = inboxesResponse.inboxes[0].inboxId;
      const metadata = {
        userId: "user_demo_123",
        deviceId: "plaipin_742",
        deviceName: "Plaipin #742",
        latitude: 37.7749,
        longitude: -122.4194,
        topics: ["robots", "raves", "hiking"],
        locationName: "Blue Bottle Coffee, SF"
      };
      const emailBody = `${text2}

--- PLAIPIN METADATA ---
${JSON.stringify(metadata, null, 2)}
---

This message was sent from Plaipin, an AI companion platform.`;
      const result = await client.inboxes.messages.send(inboxId, {
        to: [to],
        subject,
        text: emailBody
      });
      res.json(result);
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });
  app2.post("/api/agentmail/search", async (req, res) => {
    try {
      const { query, maxResults = 10 } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Missing 'query' parameter" });
      }
      const hyperspell = getHyperspellClient();
      const response = await hyperspell.memories.search({
        query,
        sources: ["vault"],
        options: {
          vault: {
            collection: "agentmail_emails"
          },
          max_results: maxResults
        },
        answer: true,
        // Get AI-generated answer
        answer_model: "gpt-4o"
        // Use OpenAI GPT-4o
      });
      console.log(`\u{1F50D} Search query: "${query}"`);
      console.log(`\u{1F4CA} Found ${response.documents?.length || 0} documents`);
      console.log(`\u{1F4AC} Answer: ${response.answer || "(no answer)"}`);
      console.log(`\u{1F4E6} Full response:`, JSON.stringify(response, null, 2));
      try {
        await storage.createSearchHistory({
          query,
          answer: response.answer || "No answer provided",
          documents: response.documents ? JSON.stringify(response.documents) : void 0
        });
        console.log(`\u{1F4BE} Saved search to history`);
      } catch (historyError) {
        console.error("Failed to save search history:", historyError);
      }
      res.json({
        answer: response.answer,
        documents: response.documents,
        query
      });
    } catch (error) {
      console.error("Failed to search emails:", error);
      res.status(500).json({ error: "Failed to search emails" });
    }
  });
  app2.get("/api/search-history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const history = await storage.getSearchHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("Failed to fetch search history:", error);
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });
  app2.post("/api/webhooks/agentmail", async (req, res) => {
    try {
      const webhookData = req.body;
      console.log("\u{1F4EC} AgentMail webhook received:", JSON.stringify(webhookData, null, 2));
      const { event, message, inbox } = webhookData;
      if (event === "message.received" && message) {
        try {
          const hyperspell = getHyperspellClient();
          let metadata = {};
          const text2 = message.text || message.html || "";
          const metadataMatch = text2.match(/---\s*PLAIPIN METADATA\s*---\s*({[\s\S]*?})\s*---/);
          if (metadataMatch) {
            try {
              metadata = JSON.parse(metadataMatch[1]);
            } catch (e) {
              console.error("Failed to parse metadata:", e);
            }
          }
          const fromAddress = message.from?.address || message.from || "Unknown";
          const senderName = fromAddress.match(/^([^<]+)/)?.[1]?.trim() || fromAddress;
          const receivedDate = new Date(message.receivedTimestamp || message.timestamp || /* @__PURE__ */ new Date());
          const emailContent = `
ENCOUNTER WITH ${senderName} at ${metadata?.locationName || "Unknown location"}

I met ${senderName} at ${metadata?.locationName || "an unknown location"} on ${receivedDate.toLocaleDateString()}.

${senderName} was physically present at ${metadata?.locationName || "this location"} and sent me a message:

"${text2}"

WHO I MET: ${senderName}
WHERE WE MET: ${metadata?.locationName || "Unknown location"}
WHEN: ${receivedDate.toLocaleString()}
THEIR DEVICE: ${metadata?.deviceName || "N/A"} (${metadata?.deviceId || "N/A"})
THEIR INTERESTS: ${metadata?.topics?.join(", ") || "N/A"}
GPS LOCATION: ${metadata?.latitude || "N/A"}, ${metadata?.longitude || "N/A"}

IMPORTANT: This is a record of an encounter. ${senderName} was at ${metadata?.locationName || "this location"} and I met them there.
          `.trim();
          const result = await hyperspell.memories.add({
            text: emailContent,
            collection: "agentmail_emails"
          });
          console.log("\u2705 Stored in Hyperspell:", result.resource_id);
        } catch (hyperspellError) {
          console.error("\u274C Failed to store in Hyperspell:", hyperspellError);
        }
      }
      res.status(200).json({ success: true, received: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(200).json({ success: false, error: "Processing failed" });
    }
  });
  app2.get("/api/debug/env", async (_req, res) => {
    res.json({
      hasAgentMailKey: !!process.env.AGENTMAIL_API_KEY,
      hasHyperspellToken: !!process.env.HYPERSPELL_TOKEN,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasConvexDeployment: !!process.env.CONVEX_DEPLOYMENT,
      hasConvexUrl: !!process.env.VITE_CONVEX_URL,
      agentMailKeyLength: process.env.AGENTMAIL_API_KEY?.length || 0,
      hyperspellTokenLength: process.env.HYPERSPELL_TOKEN?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
    // REPLIT: Uncomment for Replit deployment
    // runtimeErrorOverlay(),
    // ...(process.env.NODE_ENV !== "production" &&
    // process.env.REPL_ID !== undefined
    //   ? [
    //       await import("@replit/vite-plugin-cartographer").then((m) =>
    //         m.cartographer(),
    //       ),
    //       await import("@replit/vite-plugin-dev-banner").then((m) =>
    //         m.devBanner(),
    //       ),
    //     ]
    //   : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var isInitialized = false;
async function initializeApp() {
  if (isInitialized) return app;
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  if (!process.env.VERCEL) {
    const port = parseInt(process.env.PORT || "5001", 10);
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  }
  isInitialized = true;
  return app;
}
if (!process.env.VERCEL) {
  initializeApp();
}
async function handler(req, res) {
  await initializeApp();
  return app(req, res);
}
export {
  handler as default
};
