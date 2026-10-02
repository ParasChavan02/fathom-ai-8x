# Relay — meeting intelligence

Relay is a focused AI meeting workspace built around a simple workflow: **Meeting → Understand → Decide → Act**. It turns recorded conversations into a readable brief, decisions, owned follow-ups, searchable context, and timestamped answers.

## What works

- A populated dashboard with eight realistic meetings, upcoming conversations, and action-item metrics.
- A meeting workspace with summary, decisions, interactive transcript, highlights, action items, and a sharing flow.
- Transcript search across meeting titles, summaries, and individual moments. Results deep-link into the appropriate meeting and selected timestamp.
- Action completion and highlights persist in the browser using `localStorage`.
- Grounded meeting Q&A: the API validates requests with Zod and returns a deterministic, explicitly labelled transcript-grounded fallback. Source timestamps take the user back to the transcript.
- Global search indexes meeting titles, summaries, transcript moments, decisions, and action items. Every result opens the matching meeting and focuses its source moment.
- Highlights store complete meeting/moment metadata locally, can be removed, and remain available after refresh.
- Public read-only meeting and clip views are available at `/share/:meetingId` and `/share/:meetingId?clip=:segmentId`; the share dialog generates and copies these URLs.
- Meetings, Search, and Action items pages include a consistent back-to-overview arrow for simpler navigation.
- The sidebar profile control opens an accessible profile popover that closes on outside click or Escape.
- Responsive layouts, empty states, focus states, and error responses for the Q&A endpoint.

## Architecture

```
src/app        Next.js pages, styles, and API routes
src/lib        domain types, seeded repository data, validation, AI fallback
src/db         Drizzle/PostgreSQL schema for production persistence
```

The browser-local repository makes the assignment deployable and immediately usable with no credentials. The included Drizzle schema (`meetings`, `transcriptSegments`, and `actionItems`) is the production persistence boundary; extending it with `users`, `participants`, `decisions`, `highlights`, and `shared_links` follows the same relational pattern.

## Stack

Next.js 16, TypeScript, React 19, CSS designed with shadcn-style composable primitives, Zod, Drizzle ORM, and PostgreSQL-ready schema.

## AI design

`POST /api/ask` validates the meeting ID and question, sends the selected meeting transcript directly to OpenAI when `OPENAI_API_KEY` is configured, and requires structured source IDs in the provider response. Requests are time-bounded and provider failures fall back to a clearly labelled deterministic transcript answer with source excerpts/timestamps. This avoids presenting fabricated AI as live output when a key is absent or a provider fails.

## Local setup

1. Copy `.env.example` to `.env.local` and optionally provide `DATABASE_URL` and `OPENAI_API_KEY`.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

Validate with `npm run typecheck`, `npm run lint`, and `npm run build`.

## Deployment

Deploy to Vercel or any Node-compatible HTTPS host. Add `DATABASE_URL` for managed Postgres and `OPENAI_API_KEY` only if the provider adapter is enabled. The seeded/local mode requires no secret and works immediately for reviewers.

## Deliberate product decisions

Recording bots, calendar OAuth, integrations, billing, and RBAC are stubbed instead of implemented. They require provider credentials, webhooks, consent flows, and significant security surface area; they do not improve the reviewer's ability to understand Relay's core intelligence workflow. The product therefore prioritizes the post-meeting experience.

## Known limitations and next steps

Local persistence is per browser. Public links use seeded demo meeting data, so they are independently viewable but do not yet carry browser-created highlights or support server-backed revocation. Next I would add Drizzle migrations and repository services, authenticated users and server-backed share scopes, recording ingestion, streaming provider-backed RAG with citations, and calendar connection/status flows.
