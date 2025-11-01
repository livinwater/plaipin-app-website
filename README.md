# PlaiPin - Your Physical AI Companion

PlaiPin is a physical AI companion platform that brings joy and connection to your daily life. It combines IoT hardware with cloud services to create an interactive experience where your AI companion can detect nearby devices, exchange messages, and build a rich social graph of your real-world encounters.

![PlaiPin Banner](attached_assets/plaipin-banner.png)

## 🌟 Overview

PlaiPin is more than just an app - it's a complete ecosystem that bridges the physical and digital worlds. Your AI companion lives in a physical device that can:

- 📍 **Detect nearby PlaiPin devices** using ESP-NOW proximity detection
- 📧 **Send and receive emails** with device location metadata via AgentMail
- 🔍 **Search your encounter history** using semantic search powered by Hyperspell
- 📝 **Keep a journal** of your companion's experiences
- 🛍️ **Customize your companion** with items from the store
- 🗺️ **Build a social graph** of real-world connections

## 🏗️ Architecture

### Web Application (This Repository)

A full-stack TypeScript application built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: Convex (real-time serverless database)
- **Real-time**: Convex subscriptions for live updates

### Hardware Components

The PlaiPin ecosystem includes three hardware repositories:

#### 1. [AgentMail ESP32](https://github.com/OpenDive/agentmail_esp32)
ESP32 firmware for sending emails with device metadata (location, device ID, user info) through the AgentMail service.

#### 2. [PlaiPin ESP-NOW](https://github.com/OpenDive/plaipin_espnow)
ESP32 firmware implementing ESP-NOW protocol for device-to-device communication and proximity detection.

#### 3. [PlaiPin Proximity](https://github.com/OpenDive/plaipin_proximity)
Advanced proximity detection system that enables PlaiPin devices to discover and communicate with nearby devices.

## 🛠️ Services & Integrations

### [AgentMail](https://agentmail.to)
Email infrastructure for IoT devices. PlaiPin uses AgentMail to:
- Send encounter notifications with location metadata
- Manage inbox conversations
- Receive messages from other PlaiPin devices
- Store rich metadata (GPS coordinates, device info, topics of interest)

### [Hyperspell](https://hyperspell.ai)
Semantic search and RAG (Retrieval Augmented Generation) engine. Powers:
- Natural language search over encounter history
- AI-generated answers to questions about your network
- Vector-based similarity search
- Memory storage with metadata

### [OpenAI](https://openai.com)
Powers the AI reasoning and natural language understanding:
- GPT-4o for semantic search answers
- Context-aware responses about encounters
- Intelligent query understanding

### [Convex](https://convex.dev)
Real-time serverless backend platform:
- Real-time database for companions, journal entries, and messages
- Reactive queries that update instantly
- Type-safe database operations
- Serverless functions for business logic

### [Replit](https://replit.com)
Cloud development and hosting platform:
- One-click deployment
- Integrated development environment
- Automatic HTTPS and domain management
- Built-in secrets management

### [Livekit](https://livekit.io)
Real-time communication infrastructure (planned/future integration):
- Voice chat capabilities
- Real-time audio streaming
- WebRTC infrastructure

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- A Convex account
- API keys for AgentMail, Hyperspell, and OpenAI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plaipin-app-website.git
   cd plaipin-app-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```bash
   # Convex
   CONVEX_DEPLOYMENT=your-convex-deployment-id
   VITE_CONVEX_URL=https://your-project.convex.cloud

   # AgentMail
   AGENTMAIL_API_KEY=your-agentmail-api-key
   INBOX=your-inbox@agentmail.to

   # Hyperspell
   HYPERSPELL_TOKEN=your-hyperspell-token

   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5001`

### Building for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
plaipin-app-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Home, Inbox, Search, etc.)
│   │   ├── lib/          # Utilities and helpers
│   │   └── main.tsx      # Application entry point
│   └── public/           # Static assets
├── server/                # Express backend
│   ├── routes.ts         # API routes
│   ├── storage.ts        # In-memory storage layer
│   ├── hyperspell-client.ts  # Hyperspell SDK wrapper
│   └── index.ts          # Server entry point
├── convex/               # Convex backend functions
│   ├── schema.ts         # Database schema
│   ├── searchHistory.ts  # Search history queries/mutations
│   ├── journal.ts        # Journal entries
│   └── messages.ts       # Message handling
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle ORM schemas
├── attached_assets/      # Project assets
└── dist/                 # Build output
```

## 🎯 Key Features

### 1. **Inbox & Messaging**
- View all email conversations from nearby PlaiPin encounters
- Rich metadata display (device info, location, coordinates)
- Reply to messages directly from the app
- Real-time message synchronization

### 2. **Semantic Search**
- Natural language queries: "Who did I meet at Blue Bottle Coffee?"
- AI-powered answers using GPT-4o
- Search history tracking
- Vector similarity search over encounters

### 3. **Journal**
- Record your companion's daily experiences
- Mood tracking and timestamps
- Rich text content support

### 4. **Social Graph** (Coming Soon)
- Visualize your network of real-world connections
- See encounter patterns and locations
- Track device interactions over time

### 5. **Companion Management**
- Customize your AI companion
- Track energy, happiness, and level
- Purchase items from the store
- Manage inventory and equipped items

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

### Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Wouter (routing)
- TanStack Query (data fetching)
- Shadcn/ui (UI components)

**Backend:**
- Express.js
- TypeScript
- AgentMail SDK
- Hyperspell SDK
- Convex SDK

**Database:**
- Convex (serverless real-time database)
- Drizzle ORM (type-safe schemas)

## 🌐 Deployment

### Deploy to Vercel

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

Quick start:
```bash
vercel --prod
```

### Deploy to Replit

1. Import the repository to Replit
2. Uncomment Replit plugins in `vite.config.ts`
3. Set environment variables in Replit Secrets
4. Click "Run"

See comments in `vite.config.ts` for switching between Vercel and Replit modes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [AgentMail](https://agentmail.to) - Email infrastructure for IoT devices
- [Hyperspell](https://hyperspell.ai) - Semantic search and RAG engine
- [Convex](https://convex.dev) - Real-time serverless backend
- [OpenAI](https://openai.com) - AI language models
- [Shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Replit](https://replit.com) - Cloud development platform

## 📞 Support

For questions or support, please open an issue on GitHub or visit our [documentation](https://docs.plaipin.app).

---

Built with ❤️ by the PlaiPin team
