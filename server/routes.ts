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
      
      // Get all inboxes
      const inboxesResponse = await client.inboxes.list();
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        return res.json([]);
      }
      
      // Use the first inbox
      const inboxId = inboxesResponse.inboxes[0].inboxId;
      
      // List threads (conversations)
      const threadsResponse = await client.inboxes.threads.list(inboxId, { limit: 50 });
      
      // Transform threads to conversations format
      const conversations = (threadsResponse.threads || []).map((thread: any) => ({
        from: thread.senders?.[0] || "Unknown",
        lastSubject: thread.subject || "(No subject)",
        lastReceivedAt: thread.receivedTimestamp || thread.timestamp,
        unreadCount: 0,
        threadId: thread.threadId,
      }));
      
      res.json(conversations);
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
      
      // Get all inboxes
      const inboxesResponse = await client.inboxes.list();
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        return res.json([]);
      }
      
      // Use the first inbox
      const inboxId = inboxesResponse.inboxes[0].inboxId;
      
      // List all messages
      const messagesResponse = await client.inboxes.messages.list(inboxId, { limit: 100 });
      
      // Filter messages by sender first
      const matchingMessages = (messagesResponse.messages || [])
        .filter((message: any) => {
          const sender = message.from?.address || message.from;
          return sender.includes(from as string);
        });
      
      // Fetch full message content for each message
      const filteredEmails = await Promise.all(
        matchingMessages.map(async (message: any) => {
          try {
            // Fetch the full message to get the body
            const fullMessage = await client.inboxes.messages.get(inboxId, message.messageId);
            const text = fullMessage.text || fullMessage.html || "";
            let metadata = {};
            
            // Look for JSON metadata block in email body
            const metadataMatch = text.match(/---\s*PLAIPIN METADATA\s*---\s*({[\s\S]*?})\s*---/);
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
              text: text,
              receivedAt: message.receivedTimestamp || message.timestamp,
              metadata,
            };
          } catch (error) {
            console.error(`Failed to fetch message ${message.messageId}:`, error);
            return {
              id: message.messageId,
              from: message.from?.address || message.from,
              subject: message.subject || "(No subject)",
              text: "",
              receivedAt: message.receivedTimestamp || message.timestamp,
              metadata: {},
            };
          }
        })
      );
      
      // Sort by timestamp
      filteredEmails.sort((a: any, b: any) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
      
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
      
      // Get all inboxes
      const inboxesResponse = await client.inboxes.list();
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        return res.status(400).json({ error: "No inbox found. Please create an inbox first." });
      }
      
      // Use the first inbox
      const inboxId = inboxesResponse.inboxes[0].inboxId;
      
      // Add Plaipin metadata as a structured JSON block in the email body
      // This makes it easy for LLMs to parse and summarize
      const metadata = {
        userId: "user_demo_123",
        deviceId: "plaipin_742",
        deviceName: "Plaipin #742",
        latitude: 37.7749,
        longitude: -122.4194,
        topics: ["robots", "raves", "hiking"],
        locationName: "Blue Bottle Coffee, SF"
      };
      
      // Format email with metadata for easy LLM parsing
      const emailBody = `${text}

--- PLAIPIN METADATA ---
${JSON.stringify(metadata, null, 2)}
---

This message was sent from Plaipin, an AI companion platform.`;
      
      const result = await client.inboxes.messages.send(inboxId, {
        to: [to],
        subject,
        text: emailBody,
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
