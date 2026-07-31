# AI Landing Page Builder

A Next.js (App Router) application that allows users to generate and modify landing pages via conversational AI.

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Copy `.env.example` to `.env` and fill in your credentials:
   - `DATABASE_URL`: Your Supabase connection string (use port 5432 for Session Pooler).
   - `OPENROUTER_API_KEY`: Your OpenRouter API key for the AI model.

3. Push the database schema:
   ```bash
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture

This project uses a **Server-Driven Architecture**:
- **Framework**: Next.js App Router (React Server Components + Server Actions).
- **Database**: PostgreSQL (Supabase) + Prisma ORM.
- **AI Integration**: OpenRouter (using OpenAI SDK) with Structured Output (Tool Calling).
- **Styling**: Tailwind CSS + Framer Motion.

The application separates concerns strictly:
- **`app/api/chat`**: The isolated AI engine that handles prompts and tool execution.
- **`components/sections/`**: The predefined React components that are allowed to be rendered.
- **`components/registry.ts`**: The bridge that maps JSON type strings to actual React components.
- **`lib/db/actions.ts`**: Server actions for database operations.

## AI Integration Approach (Partial Revision / Patching)

Instead of forcing the AI to regenerate the entire HTML or JSON for every modification (which is slow and token-expensive), the AI is equipped with a `apply_page_changes` tool. 

The AI receives the current state of the page (as JSON array) and can emit "patch" instructions:
- `add` (insert a new component)
- `update` (modify props of an existing component by ID)
- `remove` (delete a component by ID)
- `reorder` (change the order of components)

This ensures fast iterations and zero hallucination of unsupported HTML tags.

## Important Technical Decisions

1. **Structured Outputs (Zod)**: By defining strict interfaces for `Hero`, `Pricing`, etc., the AI is constrained to only output data that matches our frontend schema.
2. **Component Registry**: The AI only outputs a string `type` (e.g. "Navbar"). The frontend registry looks up the actual React component. This prevents XSS and ensures design consistency.
3. **Database Schema**: Centralized around a `Project`. Each project has one `LandingPage` (storing the JSON) and many `Conversations` (storing the chat history) to maintain context across sessions.

## Tradeoffs & Known Limitations

- **Streaming JSON**: Currently, the AI tool calls wait for completion before updating the UI. A future enhancement would be streaming the JSON patch for a real-time typing effect on the landing page preview.
- **Context Limit**: For very large landing pages or extremely long conversations, the token limit of the LLM might be reached. A rolling window of the chat history would be needed for production.
- **Authentication**: Currently omitted (single-tenant mode) for simplicity of the technical test, but easily expandable using Supabase Auth or Clerk.
