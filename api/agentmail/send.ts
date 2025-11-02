import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AgentMailClient } from 'agentmail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, text } = req.body;
    console.log(`📤 Sending email to: ${to}`);
    
    const apiKey = process.env.AGENTMAIL_API_KEY;
    const inboxEmail = process.env.INBOX;
    
    if (!apiKey || !inboxEmail) {
      console.error('❌ Missing API key or inbox email');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const client = new AgentMailClient({ apiKey });
    const inboxesResponse = await client.inboxes.list();
    
    if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
      return res.status(500).json({ error: 'No inbox found' });
    }

    const inbox = inboxesResponse.inboxes[0];
    
    await client.inboxes.messages.send(inbox.inboxId, {
      to: [to],
      subject,
      text,
    });
    
    console.log(`✅ Email sent successfully to ${to}`);
    return res.json({ success: true });
    
  } catch (error: any) {
    console.error('❌ Failed to send email:', error?.message);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error?.message 
    });
  }
}
