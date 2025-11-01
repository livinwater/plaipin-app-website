import { AgentMailClient } from 'agentmail';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkEmails() {
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

    // Get inbox
    const inboxesResponse = await client.inboxes.list();
    const inboxId = inboxesResponse.inboxes![0].inboxId;

    // Get messages
    const messagesResponse = await client.inboxes.messages.list(inboxId, { limit: 10 });

    console.log(`\n📧 Found ${messagesResponse.messages?.length || 0} messages\n`);

    // Fetch and display full content of each message
    for (const msg of messagesResponse.messages || []) {
      console.log('━'.repeat(80));
      console.log(`From: ${msg.from?.address || msg.from}`);
      console.log(`Subject: ${msg.subject}`);

      try {
        const fullMessage = await client.inboxes.messages.get(inboxId, msg.messageId);
        const text = fullMessage.text || fullMessage.html || "";

        console.log(`\nContent (${text.length} chars):`);
        console.log(text.substring(0, 500));
        if (text.length > 500) console.log('...');

        // Check for metadata
        const metadataMatch = text.match(/---\s*PLAIPIN METADATA\s*---\s*({[\s\S]*?})\s*---/);
        if (metadataMatch) {
          console.log(`\n✅ Has Plaipin metadata`);
          const metadata = JSON.parse(metadataMatch[1]);
          console.log(`  Device: ${metadata.deviceName} (${metadata.deviceId})`);
          console.log(`  Location: ${metadata.locationName}`);
          console.log(`  Topics: ${metadata.topics?.join(', ')}`);
        } else {
          console.log(`\n⚠️  No Plaipin metadata found`);
        }
      } catch (e) {
        console.log('Error fetching full message:', e);
      }
      console.log('');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkEmails();
