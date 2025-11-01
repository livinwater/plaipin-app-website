import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInventorySchema, insertJournalEntrySchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/companion", async (_req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      res.json(companion);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companion" });
    }
  });

  app.post("/api/companion/interact", async (req, res) => {
    try {
      const { action } = req.body;
      const companion = await storage.getDefaultCompanion();
      
      let updates: Partial<typeof companion> = {};
      
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

  app.get("/api/store/items", async (_req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/inventory", async (_req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const inventory = await storage.getInventory(companion.id);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory/purchase", async (req, res) => {
    try {
      const { itemId } = req.body;
      const companion = await storage.getDefaultCompanion();
      
      const parsed = insertInventorySchema.parse({
        companionId: companion.id,
        itemId,
        quantity: 1,
        equipped: 0,
      });
      
      const inventoryItem = await storage.addToInventory(parsed);
      res.json(inventoryItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to purchase item" });
    }
  });

  app.patch("/api/inventory/:id/equip", async (req, res) => {
    try {
      const { id } = req.params;
      const { equipped } = req.body;
      
      const updated = await storage.updateInventoryItem(id, { equipped: equipped ? 1 : 0 });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update inventory item" });
    }
  });

  app.get("/api/journal", async (_req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const entries = await storage.getJournalEntries(companion.id);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal", async (req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const parsed = insertJournalEntrySchema.parse({
        ...req.body,
        companionId: companion.id,
      });
      
      const entry = await storage.createJournalEntry(parsed);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Failed to create journal entry" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const { conversationWith } = req.query;
      const messages = await storage.getMessages(companion.id, conversationWith as string | undefined);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const companion = await storage.getDefaultCompanion();
      const parsed = insertMessageSchema.parse({
        ...req.body,
        companionId: companion.id,
      });
      
      const message = await storage.createMessage(parsed);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Failed to send message" });
    }
  });

  // AgentMail routes
  app.get("/api/agentmail/conversations", async (_req, res) => {
    try {
      const { getUncachableAgentMailClient } = await import("./agentmail-client.js");
      const client = await getUncachableAgentMailClient();
      const emails = await client.inbox.list({ limit: 50 });
      
      // Group emails by sender to create conversations
      const conversationMap = new Map();
      
      for (const email of emails.items) {
        const from = email.from;
        if (!conversationMap.has(from) || new Date(email.receivedAt) > new Date(conversationMap.get(from).lastReceivedAt)) {
          conversationMap.set(from, {
            from,
            lastSubject: email.subject || "(No subject)",
            lastReceivedAt: email.receivedAt,
            unreadCount: 0,
          });
        }
      }
      
      res.json(Array.from(conversationMap.values()));
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/agentmail/messages", async (req, res) => {
    try {
      const { from } = req.query;
      if (!from) {
        return res.status(400).json({ error: "Missing 'from' parameter" });
      }

      const { getUncachableAgentMailClient } = await import("./agentmail-client.js");
      const client = await getUncachableAgentMailClient();
      const emails = await client.inbox.list({ limit: 50 });
      
      const filteredEmails = emails.items
        .filter(email => email.from === from)
        .map(email => ({
          id: email.id,
          from: email.from,
          subject: email.subject || "(No subject)",
          text: email.text || email.html || "",
          receivedAt: email.receivedAt,
        }))
        .sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
      
      res.json(filteredEmails);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/agentmail/send", async (req, res) => {
    try {
      const { to, subject, text } = req.body;
      
      if (!to || !subject || !text) {
        return res.status(400).json({ error: "Missing required fields: to, subject, text" });
      }

      const { getUncachableAgentMailClient } = await import("./agentmail-client.js");
      const client = await getUncachableAgentMailClient();
      
      const result = await client.send.email({
        to,
        subject,
        text,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
