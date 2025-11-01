import { Hyperspell } from 'hyperspell';

function getCredentials() {
  const apiKey = process.env.HYPERSPELL_TOKEN;
  
  if (!apiKey) {
    throw new Error('HYPERSPELL_TOKEN not found in environment variables');
  }
  
  return { apiKey };
}

/**
 * Get a Hyperspell client instance.
 * Creates a new client each time to ensure fresh credentials.
 * Note: Pass apiKey directly to bypass HYPERSPELL_TOKEN env var check
 */
export function getHyperspellClient() {
  const { apiKey } = getCredentials();
  return new Hyperspell({ apiKey });
}
