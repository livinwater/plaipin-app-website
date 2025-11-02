import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AgentMailClient } from 'agentmail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔍 Starting conversations fetch...');
    
    const apiKey = process.env.AGENTMAIL_API_KEY;
    if (!apiKey) {
      console.error('❌ AGENTMAIL_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    console.log('✓ API key found, length:', apiKey.length);
    
    const client = new AgentMailClient({ apiKey });
    console.log('✓ AgentMail client initialized');
    
    const inboxesResponse = await client.inboxes.list();
    console.log(`✓ Got ${inboxesResponse.inboxes?.length || 0} inboxes`);
    
    if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
      return res.json([]);
    }

    const allConversations: any[] = [];

    for (const inbox of inboxesResponse.inboxes) {
      try {
        console.log(`📨 Fetching threads for inbox: ${inbox.inboxId}`);
        const threadsResponse = await client.inboxes.threads.list(inbox.inboxId, { limit: 50 });
        console.log(`✓ Got ${threadsResponse.threads?.length || 0} threads`);
        
        const conversations = (threadsResponse.threads || []).map((thread: any) => ({
          from: thread.senders?.[0] || "Unknown",
          lastSubject: thread.subject || "(No subject)",
          lastReceivedAt: thread.receivedTimestamp || thread.timestamp,
          unreadCount: 0,
          threadId: thread.threadId,
          inboxId: inbox.inboxId,
        }));
        allConversations.push(...conversations);
      } catch (error: any) {
        console.error(`❌ Failed to fetch threads from inbox ${inbox.inboxId}:`, error?.message);
      }
    }

    allConversations.sort((a, b) =>
      new Date(b.lastReceivedAt).getTime() - new Date(a.lastReceivedAt).getTime()
    );

    console.log(`✅ Returning ${allConversations.length} conversations`);
    return res.json(allConversations);
    
  } catch (error: any) {
    console.error('❌ FATAL:', error?.message, error?.stack);
    return res.status(500).json({ 
      error: 'Failed to fetch conversations', 
      details: error?.message 
    });
  }
}
