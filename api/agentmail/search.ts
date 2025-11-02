import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Hyperspell } from 'hyperspell';

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
    const { query, maxResults = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Missing 'query' parameter" });
    }

    console.log(`🔍 Search query: "${query}"`);

    const hyperspellToken = process.env.HYPERSPELL_TOKEN;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!hyperspellToken) {
      console.error('❌ HYPERSPELL_TOKEN not found');
      return res.status(500).json({ error: 'Hyperspell not configured' });
    }
    
    console.log('✓ HYPERSPELL_TOKEN found, length:', hyperspellToken.length);
    
    const hyperspell = new Hyperspell({
      apiKey: hyperspellToken,
      openaiApiKey: openaiKey,
    } as any);
    
    // Semantic search over stored emails
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

    console.log(`📊 Found ${response.documents?.length || 0} documents`);
    console.log(`💬 Answer: ${response.answer || '(no answer)'}`);

    return res.json({
      answer: response.answer,
      documents: response.documents,
      query,
    });
    
  } catch (error: any) {
    console.error('❌ Failed to search emails:', error?.message, error?.stack);
    return res.status(500).json({ 
      error: 'Failed to search emails',
      details: error?.message 
    });
  }
}
