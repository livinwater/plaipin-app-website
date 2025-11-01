import { AgentMailClient } from 'agentmail';

async function getCredentials() {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  
  if (!apiKey) {
    console.error('❌ AGENTMAIL_API_KEY not found in environment variables');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('AGENT')));
    throw new Error('AGENTMAIL_API_KEY not found in environment variables');
  }
  
  console.log('✓ AGENTMAIL_API_KEY found, length:', apiKey.length);
  return { apiKey };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableAgentMailClient() {
  const { apiKey } = await getCredentials();
  const client = new AgentMailClient({
    baseUrl: "https://api.agentmail.to",
    apiKey: apiKey
  });
  return client;
}
