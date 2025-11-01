import { Hyperspell } from 'hyperspell';

function getCredentials() {
  const apiKey = process.env.HYPERSPELL_TOKEN;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ HYPERSPELL_TOKEN not found in environment variables');
    throw new Error('HYPERSPELL_TOKEN not found in environment variables');
  }
  
  console.log('✓ HYPERSPELL_TOKEN found, length:', apiKey.length);
  return { apiKey, openaiKey };
}

/**
 * Get a Hyperspell client instance.
 * Creates a new client each time to ensure fresh credentials.
 * Note: Pass apiKey directly to bypass HYPERSPELL_TOKEN env var check
 */
export function getHyperspellClient() {
  const { apiKey, openaiKey } = getCredentials();
  return new Hyperspell({
    apiKey,
    openaiApiKey: openaiKey,
  } as any);
}
