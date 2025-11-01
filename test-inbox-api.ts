import { AgentMailClient } from 'agentmail';
import * as dotenv from 'dotenv';

dotenv.config();

async function testInboxAPI() {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  if (!apiKey) {
    console.error('❌ AGENTMAIL_API_KEY not found');
    process.exit(1);
  }

  try {
    const client = new AgentMailClient({
      baseUrl: "https://api.agentmail.to",
      apiKey: apiKey
    });

    console.log('✅ AgentMail client created\n');

    // Get inboxes
    const inboxesResponse = await client.inboxes.list();
    console.log('📬 Inboxes:', inboxesResponse);

    if (!inboxesResponse.inboxes || inboxesResponse.inboxes.length === 0) {
      console.error('❌ No inboxes found');
      process.exit(1);
    }

    const inboxId = inboxesResponse.inboxes[0].inboxId;
    console.log(`\n✅ Using inbox: ${inboxId}\n`);

    // Get threads
    console.log('💬 Fetching threads...');
    const threadsResponse = await client.inboxes.threads.list(inboxId, { limit: 50 });
    console.log('Threads response:', JSON.stringify(threadsResponse, null, 2));

    console.log(`\n📊 Total threads: ${threadsResponse.threads?.length || 0}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testInboxAPI();
