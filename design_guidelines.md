# Plaipin Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from the provided screenshot, creating a soft, playful companion management interface with pastel aesthetics. The design combines the friendly accessibility of Duolingo with the clean organization of productivity apps like Notion.

## Core Design Principles
1. **Friendly & Approachable**: Rounded corners, soft shadows, and gentle transitions create a welcoming environment
2. **Playful Professionalism**: Balance whimsy with functional clarity
3. **Character-Centric**: The AI companion "Buddy" is the emotional anchor of the interface
4. **Clear Hierarchy**: Visual weight guides users through features without overwhelming

## Typography System
- **Primary Font**: DM Sans (Google Fonts) - modern, friendly, highly legible
- **Headings**: 
  - Page Titles: text-2xl font-bold (24px)
  - Section Headers: text-xl font-semibold (20px)
  - Card Titles: text-lg font-medium (18px)
- **Body Text**: text-base (16px) with regular weight
- **Labels/Meta**: text-sm (14px) font-medium

## Layout System
**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistency
- **Navigation Width**: w-64 (256px) fixed left sidebar
- **Main Content**: Fluid with max-w-6xl container, px-8 py-6
- **Card Spacing**: gap-6 between grid items, p-6 internal padding
- **Section Spacing**: mb-8 between major sections

**Grid Structure**:
- Feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats/Metrics: grid-cols-2 lg:grid-cols-4
- Content lists: Single column with max-w-3xl

## Navigation Component
**Left Sidebar Navigation**:
- Fixed position with subtle shadow (shadow-lg)
- Icons + text labels in vertical stack
- 8 navigation items with consistent spacing (space-y-1)
- Active state: Filled background with rounded corners (rounded-lg)
- Hover state: Light background tint
- Icons: 24px from Heroicons (outline style for inactive, solid for active)
- Logo/Brand at top with companion character element
- Bottom section for user profile/settings

## Component Library

### Status Badges
- Rounded-full with px-4 py-1.5
- Small text with medium weight
- Emoji + text combination (e.g., "😊 Happy")
- Soft background with border

### Cards
- Rounded-2xl with subtle shadow (shadow-md)
- White background with p-6 padding
- Hover: Slight elevation increase (hover:shadow-lg)
- Border: 1px subtle outline

### Companion Display (Home Screen)
- Large circular avatar (w-48 h-48) with gradient border
- Character illustration centered
- Status badge positioned below avatar
- Stats row underneath (grid-cols-3)
- Quick action buttons in rounded-lg containers

### Feature Sections
- Icon in rounded-xl container (w-12 h-12)
- Title + description vertical stack
- Consistent spacing between elements (space-y-2)

### Input Fields
- Rounded-lg borders
- py-3 px-4 padding
- Focus ring with offset
- Placeholder text in muted tone

### Buttons
- **Primary**: Rounded-full, px-6 py-3, font-medium
- **Secondary**: Rounded-lg with border, px-4 py-2
- **Icon Buttons**: Rounded-lg, w-10 h-10, centered icon
- All buttons: Smooth transitions (transition-all duration-200)

### Inventory/Store Items
- Image thumbnail in rounded-lg container
- Title + price/description below
- Grid layout with gap-4
- Hover: Scale transform (hover:scale-105)

### Social Graph Nodes
- Circular avatars with connection lines
- Name labels below circles
- Interactive zoom/pan canvas
- Relationship indicators with icons

### Journal Entries
- Timeline layout with date markers
- Entry cards with rounded-xl borders
- Mood indicators with emoji
- Expandable content areas

## Screen-Specific Layouts

### Home Screen
- Hero section with companion display centered
- Status dashboard in grid-cols-3 below
- Recent activity feed in single column
- Quick actions in grid-cols-2

### Settings Screen
- Grouped sections with category headers
- Toggle switches, sliders, and select dropdowns
- Two-column layout on desktop (form left, preview right)

### Nearby Screen
- Map view or list view toggle
- Companion cards in grid showing nearby AI friends
- Distance indicators and status badges

### Inbox Screen
- Conversation list sidebar (1/3 width)
- Message thread main area (2/3 width)
- Message bubbles with timestamps
- Input bar at bottom with rounded-full container

### Journal Screen
- Calendar view option at top
- Chronological entry list
- Filter/search bar
- Entry cards with preview text

### Store Screen
- Category tabs/filters at top
- Product grid with images
- "Add to cart" buttons
- Shopping cart icon in header

### Inventory Screen
- Filter/sort controls
- Item cards with quantity indicators
- Equipped/owned status badges
- Grid layout with item details

### Social Graph Screen
- Interactive network visualization
- Legend/controls in corner
- Node click reveals detail panel
- Relationship strength indicators

## Visual Effects
- **Shadows**: Use sparingly - subtle on cards (shadow-md), elevated on hover (shadow-lg)
- **Transitions**: All interactive elements use duration-200
- **Hover States**: Subtle scale (hover:scale-102) or background changes
- **Focus States**: Ring with offset for accessibility

## Accessibility
- All interactive elements have visible focus states
- Icon-only buttons include aria-labels
- Color contrast meets WCAG AA standards
- Keyboard navigation fully supported

## Images
Include character illustrations for the companion "Buddy" in various states/moods on the Home screen. Use soft, rounded illustrative style matching the playful aesthetic. No large hero image needed - the companion character serves as the visual anchor.