import { Hyperspell } from 'hyperspell';
import * as dotenv from 'dotenv';

dotenv.config();

async function testSearch() {
  const apiKey = process.env.HYPERSPELL_TOKEN;
  if (!apiKey) {
    console.error('❌ HYPERSPELL_TOKEN not found');
    process.exit(1);
  }

  try {
    const hyperspell = new Hyperspell({ apiKey });

    const query = "Who passed me at the coffee shop?";
    console.log(`🔍 Searching: "${query}"\n`);

    const response = await (hyperspell.memories.search as any)({
      query,
      sources: ['vault'],
      options: {
        vault: {
          collection: 'agentmail_emails',
        },
        max_results: 10,
      },
      answer: true,
      answer_model: 'deepseek-r1',
    });

    console.log(`Found ${response.documents?.length || 0} documents`);
    console.log(`\n📝 Answer: ${response.answer}\n`);

    if (response.documents && response.documents.length > 0) {
      console.log('Top 3 documents:');
      response.documents.slice(0, 3).forEach((doc: any, idx: number) => {
        console.log(`\n${idx + 1}. Score: ${doc.score?.toFixed(4)}`);
        console.log(`   Status: ${doc.metadata?.status || 'unknown'}`);
        console.log(`   Summary: ${doc.summary?.substring(0, 150)}...`);
      });
    }

    // Try alternate queries
    const queries = [
      "device 742",
      "Blue Bottle Coffee",
      "Plaipin at coffee shop",
      "who was at Blue Bottle",
    ];

    for (const q of queries) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔍 "${q}"`);
      const res = await (hyperspell.memories.search as any)({
        query: q,
        sources: ['vault'],
        options: {
          vault: {
            collection: 'agentmail_emails',
          },
          max_results: 3,
        },
        answer: true,
        answer_model: 'deepseek-r1',
      });
      console.log(`   Docs: ${res.documents?.length || 0}`);
      console.log(`   Answer: ${res.answer?.substring(0, 200) || 'No answer'}`);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSearch();
