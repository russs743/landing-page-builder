# AI Landing Page Builder

A Next.js (App Router) application that allows users to generate and modify landing pages via conversational AI. Built as a full-stack technical test demonstrating AI integration, database design, and product engineering judgment.

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Copy `.env.example` to `.env` and fill in your credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string (Supabase/Neon, port 5432 for Session Pooler).
   - `GEMINI_API_KEY`: Your Google Gemini API key for the AI model.
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Clerk authentication keys.

3. Push the database schema:
   ```bash
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Run automated tests:
   ```bash
   npm test
   ```

## Architecture

This project uses a **Server-Driven, Patch-Based Architecture**:

- **Framework**: Next.js 16 App Router (React Server Components + Server Actions).
- **Database**: PostgreSQL (Supabase) via Prisma ORM.
- **AI Integration**: Google Gemini (via OpenAI-compatible SDK) with structured Tool Calling.
- **Auth**: Clerk for user authentication and session management.
- **Styling**: Tailwind CSS v4 + Framer Motion for animations.

### Key Layers

| Layer | Path | Responsibility |
|---|---|---|
| AI Engine | `app/api/chat/route.ts` | Handles prompts, calls Gemini, applies JSON patches |
| Prop Normalization | `lib/utils/normalizeProps.ts` | Sanitizes & auto-fills AI-generated props |
| Component Registry | `components/registry.ts` | Maps JSON type strings → React components |
| Section Library | `components/sections/` | 11 predefined reusable UI sections |
| DB Actions | `lib/db/actions.ts` | Server actions for CRUD operations |

## AI Integration Approach — Partial Revision (Patching)

Instead of regenerating the entire page JSON on every change (slow, token-expensive), the AI uses an `apply_page_changes` tool with patch semantics:

- **`add`** — insert a new section at an optional index
- **`update`** — modify props of an existing section by ID
- **`remove`** — delete a section by ID
- **`clear`** — wipe all sections (reset)

The AI receives the current page state as JSON, emits minimal diffs, and the backend applies them. This keeps responses fast and eliminates hallucinated HTML.

A `normalizeProps` layer sits between the AI output and the database to:
- Fix prop alias mistakes (`brandName` → `logoText`)
- Auto-fill missing required props with sensible defaults
- Extract hex color codes from the raw user message when the AI misses them

## Important Technical Decisions

1. **Structured Outputs (Tool Calling)**: By forcing the AI to always call `apply_page_changes`, every output is guaranteed to be parseable JSON. Free-form text responses are impossible, eliminating XSS vectors.

2. **Component Registry**: The AI only outputs a `type` string (e.g. `"Hero"`). The frontend looks it up in the registry. This prevents the AI from injecting arbitrary components or custom HTML.

3. **Zod-like prop schemas in the system prompt**: Detailed prop schemas are included in the system prompt so the AI knows exactly what fields are valid per component — constraining the output space.

4. **`normalizeProps` as a separate utility**: Extracted from the API route so it can be independently unit-tested without spinning up a server or database.

5. **Clerk for Auth**: Chosen over Supabase Auth for its polished Next.js App Router integration and built-in UI components.

## Non-Chatbot Editing

Users can edit the page without the chatbot via:
- **Move Up / Move Down** buttons on hover overlay for each section
- **Delete** button on hover overlay per section  
- **1-Click Theme Presets** — applies a coordinated color palette across all sections (Obsidian Dark, Deep Navy, Warm Coffee, etc.)

## Automated Tests

Tests are located in `__tests__/` and use **Jest** + **ts-jest**.

```bash
npm test          # run all tests
npm run test:watch  # watch mode
```

| Test File | What It Tests |
|---|---|
| `registry.test.ts` | All 11 sections are registered, every value is a callable component |
| `normalizeProps.test.ts` | Alias fixes, color extraction, auto-fill fallbacks, array enforcement, null safety |

## Tradeoffs & Known Limitations

- **No streaming**: AI tool calls wait for full completion before the UI updates. Streaming JSON patches would give a real-time editing feel but requires a more complex state machine.
- **Context window**: The chat history is truncated to the last 6 messages. Very long conversations may lose earlier context.
- **Single conversation per project**: Each project has exactly one conversation thread. Multiple branches or conversation history browsing is not implemented.
- **No drag-and-drop**: Sections can be reordered via up/down buttons only. A full DnD editor was explicitly listed as optional in the spec.
- **No version history / undo**: Once a change is applied, it is persisted immediately. Rolling back requires re-prompting the AI.

## Section Library & Layout Variants

Supported sections and layout configurations:

| Section Type | Available Variants | Description |
|---|---|---|
| **Navbar** | Standard | Logo, nav links, CTA button |
| **Hero** | `centered`, `split`, `minimal`, `bold` | Glowing centered, 2-col stats, editorial typography, dark full-bleed |
| **Features** | `grid`, `alternating`, `list` | 3-column cards, zig-zag row layout, numbered process steps |
| **Pricing** | `cards`, `compact` | Vertical plan cards, horizontal feature comparison table |
| **Testimonials**| `grid`, `masonry`, `marquee` | Balanced cards, featured quote layout, infinite auto-scroll |
| **FAQ** | Accordion | Interactive Q&A list |
| **CTA** | `contained`, `banner`, `minimal` | High contrast box, full-width inline banner, typographic |
| **Footer** | Standard | Brand, links, copyright |

## Export Options

Users can export their created landing pages via the header dropdown:
- **Download HTML**: Single standalone `.html` file with Tailwind CDN & Google Fonts (zero build step needed).
- **Export JSX (.zip)**: Complete **Vite + React + Tailwind CSS v4** project ready for development (`npm install && npm run dev`).

## Improvements With More Time

1. **Streaming AI responses** — Use the Vercel AI SDK with `streamObject` to stream JSON patches in real time.

2. **Drag-and-drop reordering** — Integrate `@dnd-kit/core` for a mouse-based section reordering experience.

3. **Per-section inline editing** — Click any text in the preview to edit it directly in place.

4. **Version history / undo** — Store every patch as a versioned snapshot for time-travel undo/redo.

5. **Deployment-aware schema migrations** — Switch from `prisma db push` to `prisma migrate deploy` for production database deployments.

