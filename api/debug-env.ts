import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    hasAgentMailKey: !!process.env.AGENTMAIL_API_KEY,
    hasHyperspellToken: !!process.env.HYPERSPELL_TOKEN,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasConvexDeployment: !!process.env.CONVEX_DEPLOYMENT,
    hasConvexUrl: !!process.env.VITE_CONVEX_URL,
    agentMailKeyLength: process.env.AGENTMAIL_API_KEY?.length || 0,
    hyperspellTokenLength: process.env.HYPERSPELL_TOKEN?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL,
  });
}
