import { AgentMailClient } from 'agentmail';

async function getCredentials() {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  
  if (!apiKey) {
    throw new Error('AGENTMAIL_API_KEY not found in environment variables');
  }
  
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
