import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInventorySchema, insertJournalEntrySchema, insertMessageSchema } from "@shared/schema";
import { getUncachableAgentMailClient } from "./agentmail-client";
import { getHyperspellClient } from "./hyperspell-client";

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
    // Prevent caching for fresh data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('ETag', 'false');
    
    try {
      console.log("🔍 Starting conversations fetch...");
      const client = await getUncachableAgentMailClient();
      console.log("✓ AgentMail client initialized");
      
      // Get all inboxes
      console.log("📬 Fetching inboxes...");
      const inboxesResponse = await client.inboxes.list();
      console.log(`✓ Got ${inboxesResponse.inboxes?.length || 0} inboxes`);
      
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        console.log("⚠️ No inboxes found");
        return res.json([]);
      }

      // Aggregate threads from ALL inboxes
      const allConversations: any[] = [];

      for (const inbox of inboxesResponse.inboxes) {
        try {
          console.log(`📨 Fetching threads for inbox: ${inbox.inboxId}`);
          const threadsResponse = await client.inboxes.threads.list(inbox.inboxId, { limit: 50 });
          console.log(`✓ Got ${threadsResponse.threads?.length || 0} threads from ${inbox.inboxId}`);
          
          const conversations = (threadsResponse.threads || []).map((thread: any) => ({
            from: thread.senders?.[0] || "Unknown",
            lastSubject: thread.subject || "(No subject)",
            lastReceivedAt: thread.receivedTimestamp || thread.timestamp,
            unreadCount: 0,
            threadId: thread.threadId,
            inboxId: inbox.inboxId, // Track which inbox this conversation is from
          }));
          allConversations.push(...conversations);
        } catch (error: any) {
          console.error(`❌ Failed to fetch threads from inbox ${inbox.inboxId}:`, error);
          console.error("Error details:", error?.message, error?.statusCode);
        }
      }

      // Sort by most recent
      allConversations.sort((a, b) =>
        new Date(b.lastReceivedAt).getTime() - new Date(a.lastReceivedAt).getTime()
      );

      console.log(`✅ Returning ${allConversations.length} conversations`);
      res.json(allConversations);
    } catch (error: any) {
      console.error("❌ FATAL: Failed to fetch conversations:", error);
      console.error("Error stack:", error?.stack);
      console.error("Error message:", error?.message);
      console.error("Error name:", error?.name);
      console.error("Error statusCode:", error?.statusCode);
      res.status(500).json({ error: "Failed to fetch conversations", details: error?.message, name: error?.name });
    }
  });

  app.get("/api/agentmail/messages", async (req, res) => {
    // Prevent caching so Hyperspell storage always runs
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('ETag', 'false'); // Disable ETag to prevent 304 responses

    try {
      const { from } = req.query;
      console.log(`🔍 Starting messages fetch... (from filter: ${from || 'none'})`);

      const client = await getUncachableAgentMailClient();
      console.log("✓ AgentMail client initialized");

      // Get all inboxes
      console.log("📬 Fetching inboxes...");
      const inboxesResponse = await client.inboxes.list();
      console.log(`✓ Got ${inboxesResponse.inboxes?.length || 0} inboxes`);
      
      if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
        console.log("⚠️ No inboxes found");
        return res.json([]);
      }

      // Get ALL messages from ALL inboxes
      let matchingMessages: any[] = [];

      for (const inbox of inboxesResponse.inboxes) {
        try {
          console.log(`📩 Fetching messages for inbox: ${inbox.inboxId}`);
          const messagesResponse = await client.inboxes.messages.list(inbox.inboxId, { limit: 100 });
          console.log(`✓ Got ${messagesResponse.messages?.length || 0} messages from ${inbox.inboxId}`);
          
          const messages = (messagesResponse.messages || [])
            .filter((message: any) => {
              // If 'from' parameter provided, filter by sender
              if (from) {
                const sender = message.from?.address || message.from;
                return sender.includes(from as string);
              }
              // Otherwise return all messages
              return true;
            })
            .map((message: any) => ({
              ...message,
              _inboxId: inbox.inboxId, // Track which inbox this message is from
            }));
          matchingMessages.push(...messages);
        } catch (error: any) {
          console.error(`❌ Failed to fetch messages from inbox ${inbox.inboxId}:`, error);
          console.error("Error details:", error?.message, error?.statusCode);
        }
      }
      
      console.log(`📝 Processing ${matchingMessages.length} messages...`);
      
      // Fetch full message content for each message
      const filteredEmails = await Promise.all(
        matchingMessages.map(async (message: any) => {
          try {
            // Fetch the full message to get the body (use the inbox ID we stored with the message)
            const fullMessage = await client.inboxes.messages.get(message._inboxId, message.messageId);
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
      
      // Store emails in Hyperspell for semantic search (with deduplication)
      console.log(`📝 Attempting to store ${filteredEmails.length} emails in Hyperspell...`);
      try {
        const hyperspell = getHyperspellClient();
        console.log(`✓ Hyperspell client initialized`);

        // Store each email in Hyperspell using message ID as unique identifier
        for (const email of filteredEmails) {
          // Create rich text representation for semantic search
          const metadata = email.metadata as any;
          // Extract sender name from email (e.g., "Joy <plaipina@agentmail.to>" -> "Joy")
          const senderName = email.from.match(/^([^<]+)/)?.[1]?.trim() || email.from;

          const emailContent = `
ENCOUNTER WITH ${senderName} at ${metadata?.locationName || 'Unknown location'}

I met ${senderName} at ${metadata?.locationName || 'an unknown location'} on ${new Date(email.receivedAt).toLocaleDateString()}.

${senderName} was physically present at ${metadata?.locationName || 'this location'} and sent me a message:

"${email.text}"

WHO I MET: ${senderName}
WHERE WE MET: ${metadata?.locationName || 'Unknown location'}
WHEN: ${new Date(email.receivedAt).toLocaleString()}
THEIR DEVICE: ${metadata?.deviceName || 'N/A'} (${metadata?.deviceId || 'N/A'})
THEIR INTERESTS: ${metadata?.topics?.join(', ') || 'N/A'}
GPS LOCATION: ${metadata?.latitude || 'N/A'}, ${metadata?.longitude || 'N/A'}

IMPORTANT: This is a record of an encounter. ${senderName} was at ${metadata?.locationName || 'this location'} and I met them there.
          `.trim();

          // Add to Hyperspell vault with metadata for tracking
          const result = await hyperspell.memories.add({
            text: emailContent,
            collection: "agentmail_emails",
            metadata: {
              email_id: email.id, // Track email ID to identify duplicates later
              from: email.from,
              subject: email.subject,
            },
          } as any);
          console.log(`✓ Stored email ${email.id} in Hyperspell:`, result?.resource_id || 'success');
        }
        console.log(`✅ Successfully stored all ${filteredEmails.length} emails in Hyperspell`);
      } catch (hyperspellError: any) {
        // Log but don't fail the request if Hyperspell storage fails
        console.error("❌ Failed to store emails in Hyperspell:", hyperspellError);
        console.error("Error details:", hyperspellError?.message || hyperspellError);
        console.error("Error stack:", hyperspellError?.stack);
      }
      
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

  // Semantic search over AgentMail emails stored in Hyperspell
  app.post("/api/agentmail/search", async (req, res) => {
    try {
      const { query, maxResults = 10 } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Missing 'query' parameter" });
      }

      const hyperspell = getHyperspellClient();
      
      // Semantic search over stored emails
      // Using 'as any' because Hyperspell SDK types may not include all API parameters
      const response = await (hyperspell.memories.search as any)({
        query,
        sources: ["vault"],
        options: {
          vault: {
            collection: "agentmail_emails",
          },
          max_results: maxResults,
        },
        answer: true, // Get AI-generated answer
        answer_model: "gpt-4o", // Use OpenAI GPT-4o
      });

      console.log(`🔍 Search query: "${query}"`);
      console.log(`📊 Found ${response.documents?.length || 0} documents`);
      console.log(`💬 Answer: ${response.answer || '(no answer)'}`);
      console.log(`📦 Full response:`, JSON.stringify(response, null, 2));

      // Save to search history
      try {
        await storage.createSearchHistory({
          query,
          answer: response.answer || "No answer provided",
          documents: response.documents ? JSON.stringify(response.documents) : undefined,
        });
        console.log(`💾 Saved search to history`);
      } catch (historyError) {
        console.error("Failed to save search history:", historyError);
        // Don't fail the request if history save fails
      }

      res.json({
        answer: response.answer,
        documents: response.documents,
        query,
      });
    } catch (error) {
      console.error("Failed to search emails:", error);
      res.status(500).json({ error: "Failed to search emails" });
    }
  });

  // Get search history
  app.get("/api/search-history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const history = await storage.getSearchHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("Failed to fetch search history:", error);
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });

  // AgentMail Webhook - Automatically store new messages in Hyperspell
  app.post("/api/webhooks/agentmail", async (req, res) => {
    try {
      const webhookData = req.body;
      
      console.log("📬 AgentMail webhook received:", JSON.stringify(webhookData, null, 2));
      
      // Extract message data from webhook payload
      const { event, message, inbox } = webhookData;
      
      if (event === "message.received" && message) {
        // Store in Hyperspell
        try {
          const hyperspell = getHyperspellClient();
          
          // Parse metadata if present
          let metadata: any = {};
          const text = message.text || message.html || "";
          const metadataMatch = text.match(/---\s*PLAIPIN METADATA\s*---\s*({[\s\S]*?})\s*---/);
          if (metadataMatch) {
            try {
              metadata = JSON.parse(metadataMatch[1]);
            } catch (e) {
              console.error("Failed to parse metadata:", e);
            }
          }
          
          // Extract sender info
          const fromAddress = message.from?.address || message.from || 'Unknown';
          const senderName = fromAddress.match(/^([^<]+)/)?.[1]?.trim() || fromAddress;
          const receivedDate = new Date(message.receivedTimestamp || message.timestamp || new Date());

          // Create rich text representation for Hyperspell
          const emailContent = `
ENCOUNTER WITH ${senderName} at ${metadata?.locationName || 'Unknown location'}

I met ${senderName} at ${metadata?.locationName || 'an unknown location'} on ${receivedDate.toLocaleDateString()}.

${senderName} was physically present at ${metadata?.locationName || 'this location'} and sent me a message:

"${text}"

WHO I MET: ${senderName}
WHERE WE MET: ${metadata?.locationName || 'Unknown location'}
WHEN: ${receivedDate.toLocaleString()}
THEIR DEVICE: ${metadata?.deviceName || 'N/A'} (${metadata?.deviceId || 'N/A'})
THEIR INTERESTS: ${metadata?.topics?.join(', ') || 'N/A'}
GPS LOCATION: ${metadata?.latitude || 'N/A'}, ${metadata?.longitude || 'N/A'}

IMPORTANT: This is a record of an encounter. ${senderName} was at ${metadata?.locationName || 'this location'} and I met them there.
          `.trim();
          
          // Add to Hyperspell vault
          const result = await hyperspell.memories.add({
            text: emailContent,
            collection: "agentmail_emails",
          });
          
          console.log("✅ Stored in Hyperspell:", result.resource_id);
        } catch (hyperspellError) {
          console.error("❌ Failed to store in Hyperspell:", hyperspellError);
        }
      }
      
      // Always return 200 to acknowledge receipt
      res.status(200).json({ success: true, received: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      // Still return 200 to prevent webhook retries
      res.status(200).json({ success: false, error: "Processing failed" });
    }
  });

  // Debug endpoint to check environment variables (DO NOT expose actual values)
  app.get("/api/debug/env", async (_req, res) => {
    res.json({
      hasAgentMailKey: !!process.env.AGENTMAIL_API_KEY,
      hasHyperspellToken: !!process.env.HYPERSPELL_TOKEN,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasConvexDeployment: !!process.env.CONVEX_DEPLOYMENT,
      hasConvexUrl: !!process.env.VITE_CONVEX_URL,
      agentMailKeyLength: process.env.AGENTMAIL_API_KEY?.length || 0,
      hyperspellTokenLength: process.env.HYPERSPELL_TOKEN?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
