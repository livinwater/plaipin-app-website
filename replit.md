# Plaipin - AI Companion Platform

## Overview

Plaipin is a web application for managing physical AI companions. The platform provides an interactive interface for users to care for their AI companion "Buddy", manage inventory, connect with other companions nearby, maintain a journal, purchase items from a store, and visualize their companion's social network. The application emphasizes a friendly, playful design with pastel aesthetics and soft interactions.

## Recent Changes (November 2025)

### Home Page Enhancements
- **3D Model Integration**: Replaced static Buddy image with interactive 3D GLB model using @google/model-viewer
  - Model auto-rotates continuously
  - Users can interact with the model (rotate, zoom with mouse/touch)
  - Component located at `client/src/components/BuddyModel.tsx`

- **Whimsical Thought Bubbles**: Replaced stats display with rotating thought bubble system
  - Displays playful, random thoughts that change every 5 seconds
  - 10 unique thought messages about coffee, clouds, adventures, etc.
  - Creates a more personality-driven experience

- **Social Status Controls**: Added social connectivity toggle system
  - Three status modes: "Open to Connect", "Do Not Disturb", "Invisible Mode"
  - Radio-style selection with visual feedback
  - Removed previous Feed/Play/Train interaction buttons

### AgentMail Email Integration
- **Inbox Page**: Fully integrated with AgentMail API for real email communication
  - Lists email conversations/threads from AgentMail inbox
  - Displays messages with sender, subject, timestamp
  - Extracts and displays structured metadata from email bodies

- **Metadata Format**: Emails include structured JSON metadata for LLM parsing
  - Embedded as a clearly marked JSON block in email body
  - Includes: userId, deviceId, deviceName, latitude, longitude, topics, locationName
  - Format: `--- PLAIPIN METADATA --- {json} ---`
  - Easy for AI agents and LLMs to extract and summarize

- **Email Sending**: Backend automatically enriches outgoing emails with Plaipin metadata
  - Uses AgentMailClient SDK
  - Formats metadata as readable JSON in email body
  - Maintains compatibility with standard email clients

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Wouter is used for client-side routing, providing a lightweight alternative to React Router. Routes are defined in `App.tsx` and include pages for home, nearby companions, inbox, journal, store, inventory, social graph, and settings.

**UI Components**: The application uses shadcn/ui component library (New York style variant) built on Radix UI primitives. Components are styled with Tailwind CSS and follow a consistent design system with custom CSS variables for theming.

**State Management**: TanStack Query (React Query) handles server state management, caching, and data synchronization. No global state management library is used - component state is local where possible.

**Form Handling**: React Hook Form with Zod validation resolvers for type-safe form management.

**Design System**: 
- Custom color palette using HSL color space with CSS variables for light/dark mode support
- Typography using DM Sans as the primary font family
- Consistent spacing scale and component styling through Tailwind utilities
- Soft, rounded corners and subtle shadows for a friendly aesthetic
- Hover and active state animations using custom CSS classes (`hover-elevate`, `active-elevate-2`)

### Backend Architecture

**Runtime**: Node.js with Express.js server framework.

**API Design**: RESTful API endpoints following conventional HTTP methods:
- GET `/api/companion` - Fetch default companion data
- POST `/api/companion/interact` - Update companion state through interactions (feed, play, train)
- GET `/api/store/items` - Fetch available store items
- GET `/api/inventory` - Fetch companion's inventory
- POST `/api/inventory/purchase` - Purchase items
- PATCH `/api/inventory/:id/equip` - Equip/unequip items
- GET `/api/journal` - Fetch journal entries
- POST `/api/journal` - Create new journal entry
- GET `/api/messages` - Fetch messages for a conversation
- POST `/api/messages` - Send a new message
- GET `/api/agentmail/conversations` - List email conversations/threads via AgentMail
- GET `/api/agentmail/messages?from={email}` - List messages from a specific sender
- POST `/api/agentmail/send` - Send email with structured Plaipin metadata

**Data Storage Strategy**: The application uses an in-memory storage implementation (`MemStorage` class) that simulates database operations. This provides a clean interface (`IStorage`) that can be swapped for a real database implementation without changing business logic.

**Development Workflow**: Vite development server with middleware mode integration in Express for hot module replacement during development. Production builds serve static assets from the `dist/public` directory.

### Database Schema

**ORM**: Drizzle ORM configured for PostgreSQL dialect with schema defined in TypeScript.

**Tables**:
- `companions`: Stores companion data (name, mood, energy, happiness, level)
- `items`: Store inventory items (name, category, price, color)
- `inventory`: Junction table linking companions to items with quantity and equipped status
- `journal_entries`: Companion journal entries with title, content, mood, and timestamp
- `messages`: Chat messages between companions with conversation tracking

**Type Safety**: Drizzle-Zod integration generates runtime validation schemas from database schema definitions, ensuring consistency between database structure and application types.

**Migration Strategy**: Drizzle Kit handles schema migrations with output to `./migrations` directory. The `db:push` script syncs schema changes to the database.

### External Dependencies

**UI Library**: shadcn/ui components provide pre-built, accessible UI primitives built on Radix UI with Tailwind CSS styling.

**3D Model Viewer**: @google/model-viewer for displaying and interacting with the 3D Buddy model (GLB format).

**Database Provider**: Neon serverless PostgreSQL configured through `@neondatabase/serverless` package. Connection configured via `DATABASE_URL` environment variable.

**Email Service**: AgentMail integration via `agentmail` npm package for AI companion email communication. The integration:
- Uses AgentMailClient to interact with the AgentMail API
- Lists email threads/conversations from inbox
- Sends and receives emails with structured JSON metadata
- Embeds Plaipin-specific metadata (userId, deviceId, deviceName, location, topics) as formatted JSON blocks in email bodies
- Makes metadata easily parseable by LLMs for summarization and analysis

**Development Tools**:
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner
- ESBuild for production server bundling
- PostCSS with Autoprefixer for CSS processing

**Icon Library**: Lucide React for consistent iconography throughout the application.

**Date Handling**: date-fns for date formatting and manipulation.

**Fonts**: Google Fonts integration for DM Sans, Architects Daughter, Fira Code, and Geist Mono typefaces.