import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AgentMailClient } from 'agentmail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { from } = req.query;
    console.log(`🔍 Starting messages fetch... (from filter: ${from || 'none'})`);
    
    const apiKey = process.env.AGENTMAIL_API_KEY;
    if (!apiKey) {
      console.error('❌ AGENTMAIL_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    const client = new AgentMailClient({ apiKey });
    console.log('✓ AgentMail client initialized');
    
    const inboxesResponse = await client.inboxes.list();
    console.log(`✓ Got ${inboxesResponse.inboxes?.length || 0} inboxes`);
    
    if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
      return res.json([]);
    }

    let matchingMessages: any[] = [];

    for (const inbox of inboxesResponse.inboxes) {
      try {
        console.log(`📩 Fetching messages for inbox: ${inbox.inboxId}`);
        const messagesResponse = await client.inboxes.messages.list(inbox.inboxId, { limit: 100 });
        console.log(`✓ Got ${messagesResponse.messages?.length || 0} messages`);
        
        const messages = (messagesResponse.messages || [])
          .filter((message: any) => {
            if (from) {
              const sender = message.from?.address || message.from;
              return sender.includes(from as string);
            }
            return true;
          })
          .map((message: any) => ({
            ...message,
            _inboxId: inbox.inboxId,
          }));
        matchingMessages.push(...messages);
      } catch (error: any) {
        console.error(`❌ Failed to fetch messages from inbox ${inbox.inboxId}:`, error?.message);
      }
    }
    
    console.log(`📝 Processing ${matchingMessages.length} messages...`);
    
    const filteredEmails = await Promise.all(
      matchingMessages.map(async (message: any) => {
        try {
          const fullMessage = await client.inboxes.messages.get(message._inboxId, message.messageId);
          const text = fullMessage.text || fullMessage.html || "";
          let metadata = {};
          
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
            receivedAt: message.receivedAt || message.timestamp,
            metadata,
          };
        } catch (error: any) {
          console.error(`Failed to fetch full message ${message.messageId}:`, error?.message);
          return null;
        }
      })
    );

    const validEmails = filteredEmails.filter((email) => email !== null);
    validEmails.sort((a: any, b: any) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );

    console.log(`✅ Returning ${validEmails.length} messages`);
    return res.json(validEmails);
    
  } catch (error: any) {
    console.error('❌ FATAL:', error?.message, error?.stack);
    return res.status(500).json({ 
      error: 'Failed to fetch messages', 
      details: error?.message 
    });
  }
}
