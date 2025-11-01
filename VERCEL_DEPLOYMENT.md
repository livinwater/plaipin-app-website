# Vercel Deployment Guide

This guide explains how to deploy the PlaiPin app to Vercel.

## Prerequisites

- A Vercel account
- The Vercel CLI installed (`npm i -g vercel`)
- All required API keys (see Environment Variables below)

## Environment Variables

You need to set the following environment variables in your Vercel project settings:

### Required Variables

```bash
# Convex
CONVEX_DEPLOYMENT=your-convex-deployment-id
VITE_CONVEX_URL=https://your-convex-url.convex.cloud

# AgentMail
AGENTMAIL_API_KEY=your-agentmail-api-key
INBOX=your-inbox@agentmail.to

# Hyperspell
HYPERSPELL_TOKEN=your-hyperspell-token

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Vercel Environment (REQUIRED for proper serverless function routing)
VERCEL=1

# Node Environment
NODE_ENV=production
```

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Link Your Project

```bash
vercel link
```

### 3. Set Environment Variables

You can set environment variables in two ways:

**Option A: Via Vercel Dashboard**
1. Go to your project settings on vercel.com
2. Navigate to "Environment Variables"
3. Add all the required variables listed above

**Option B: Via CLI**
```bash
vercel env add CONVEX_DEPLOYMENT
vercel env add VITE_CONVEX_URL
vercel env add AGENTMAIL_API_KEY
vercel env add INBOX
vercel env add HYPERSPELL_TOKEN
vercel env add OPENAI_API_KEY
```

### 4. Deploy

**Production Deployment:**
```bash
vercel --prod
```

**Preview Deployment:**
```bash
vercel
```

## Build Configuration

The project is configured with:
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public` (for static files)
- **API Routes**: Handled by `dist/index.js` (Express server as serverless function)

## Troubleshooting

### Build Failures

If the build fails, check:
1. All environment variables are set correctly
2. Dependencies are installed properly
3. TypeScript compilation succeeds (`npm run check`)

### API Routes Returning 404 (MOST COMMON ISSUE)

If you see errors like:
```
Failed to load resource: the server responded with a status of 404 ()
api/agentmail/messages:1
api/agentmail/conversations:1
```

**Solution:**
1. **CRITICAL**: Set `VERCEL=1` environment variable in your Vercel project settings
2. Verify all other environment variables are set (especially `AGENTMAIL_API_KEY`)
3. Redeploy your application: `vercel --prod`
4. Check Vercel Function logs in your dashboard for any initialization errors
5. Ensure `dist/index.js` and `api/index.js` exist after build

The `VERCEL=1` environment variable tells the server to run in serverless mode instead of trying to start a traditional HTTP server.

### Static Files Not Loading

If the frontend doesn't load:
1. Check that `dist/public` contains your built files
2. Verify the build output directory in vercel.json matches
3. Look for errors in the browser console

## Switching Between Replit and Vercel

### To Enable Replit Mode

In `vite.config.ts`, uncomment the Replit-specific plugins:

```typescript
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  // ... rest of config
});
```

### To Enable Vercel Mode (Current)

The Replit plugins are already commented out for Vercel deployment. No changes needed.

## Local Development

For local development, use:

```bash
npm run dev
```

This will start both the Express server and Vite dev server on port 5001.

## Support

- Vercel Docs: https://vercel.com/docs
- Convex Docs: https://docs.convex.dev
- AgentMail Docs: https://docs.agentmail.to
- Hyperspell Docs: https://docs.hyperspell.ai
