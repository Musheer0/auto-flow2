# AutoFlow

A self-hosted workflow automation platform with AI-powered workflow generation. Build visual workflows from composable nodes, trigger them via webhooks or manual actions, and let an AI assistant generate and modify workflows from natural language descriptions.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, shadcn/ui, Tailwind CSS v4, Framer Motion |
| Visual Editor | React Flow (`@xyflow/react` v12) |
| State Management | Zustand, React Query (TanStack Query v5) |
| API | tRPC v11, Next.js Route Handlers |
| Database | PostgreSQL (Prisma 7 with driver adapter) |
| Cache | Upstash Redis |
| Workflow Engine | Inngest v4 |
| AI | Vercel AI SDK + Groq (`openai/gpt-oss-120b`) |
| Payments | DodoPayments |
| Auth | Google OAuth2, JWT sessions |
| Linting | Biome v2 |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Upstash Redis instance
- Google Cloud project (OAuth credentials)
- Groq API key
- DodoPayments account (optional, for credit purchases)

### Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Auth
JWT_SECRET="your-256-bit-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CLIENT_REDIRECT="http://localhost:3000/api/auth/callback/google"

# AI
GROQ_API_KEY="..."

# Credentials encryption
CREDENTIALS_KEY="exactly-32-bytes-for-aes256!!"

# Payments (optional)
DODO_PAYMENTS_API_KEY="..."
DODO_PAYMENTS_WEBHOOK_SECRET="..."
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client + production build (Turbopack) |
| `npm run start` | Start production server |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run build:tsc` | Type-check without emitting |

## Architecture

```
src/
├── app/                  # Next.js App Router (pages + API routes)
├── components/           # Shared UI components (sidebar, theme, auth)
├── constants/            # App-wide constants
├── db/                   # Database clients (Prisma, Redis)
├── features/             # Domain-driven feature modules
│   ├── ai/               # AI chat + workflow generation
│   ├── credentials/      # Secret/API key management
│   ├── editor/           # Visual workflow editor (React Flow)
│   ├── google-oauth/     # Google OAuth2 client
│   ├── nodes/            # Workflow node executors (runtime)
│   ├── payment/          # Credits/billing system
│   └── workflows/        # Workflow CRUD + detail views
├── generated/            # Prisma generated client
├── hooks/                # Shared React hooks
├── inngest/              # Inngest client + workflow execution
├── lib/                  # Shared libraries (auth, crypto, utils)
├── stores/               # Zustand stores
├── trpc/                 # tRPC setup, routers, client
└── type/                 # Shared TypeScript types
```

## Feature Modules

### AI (`src/features/ai/`)

AI-powered workflow generation using Groq via the Vercel AI SDK. Users interact with a chat sidebar that sends natural language prompts to a server action (`generateWorkflow`), which calls the LLM with a detailed system prompt containing all node schemas, outputs, and topology rules. The AI returns structured workflow data (nodes + edges + summary) that is sanitized, persisted, and loaded into the visual editor.

**Key files:**
- `agent.ts` — Server action calling `generateObject()` with Groq
- `prompt.ts` — ~400-line system prompt with all workflow generation rules
- `schema.ts` — Zod schemas for AI output validation
- `sanitize-ai-response.ts` — Remaps AI-generated IDs to fresh CUID2s

**Components:** `AISidebar`, `AIMessageInput`, `MessageList`, message type renderers (user, AI, workflow)

**Hooks:** `useSendMessage`, `useMessagesInfinite`

### Editor (`src/features/editor/`)

The core visual workflow editor built on React Flow. Provides the drag-and-drop canvas, node configuration forms, sidebar for adding nodes, and save/trigger actions.

**Sub-modules:**
- `config/` — Node type mappings, UI metadata, Zod schemas, form components, output documentation
- `schemas/` — Validation schemas per node type (HTTP, email, Telegram, Discord, Groq AI, YouTube PubSub, workflow)
- `store/` — Zustand store (`useEditorStore`) managing nodes, edges, and all graph operations
- `components/` — Canvas, node sidebar, save/trigger buttons, node components (BaseTrigger, BaseExecutor, PubSubTrigger), configuration forms
- `hooks/` — `useSaveWorkflow`, `useTriggerWorkflow`, `useSubscribePubSubHub`
- `lib/` — Data transformation between React Flow and server format, YouTube PubSub subscription

### Workflows (`src/features/workflows/`)

Workflow lifecycle management: listing, creating, reading, updating, deleting. The detail page composes the editor + AI sidebar + payment widget.

**Hooks:** `useWorkflowsInfinite`, `useCreateWorkflow`, `useWorkflowById` (hydrates editor store), `useUpdateWorkflow`, `useDeleteWorkflow`

**Components:** `WorkflowList`, `WorkflowCard`, `WorkflowDetail`, `CreateWorkflowDialog`, `WorkflowEditDialog`

### Credentials (`src/features/credentials/`)

CRUD management for user secrets (API keys, tokens, passwords). Credentials are AES-256-CBC encrypted at rest and typed by `NodeType`.

**Hooks:** `useCredentialsInfinite`, `useCredentialsByType`, `useCreateCredential`, `useUpdateCredential`, `useDeleteCredential` — all with optimistic cache updates

**Components:** `CredentialList`, `CredentialCard`, `SelectCredentials` (reusable dropdown for node forms), `CreateCredentialDialog`, `EditCredentialDialog`

### Nodes (`src/features/nodes/`)

Server-side execution logic for each workflow node type. Executors resolve credentials, apply Handlebars template interpolation (`{{node_name.property}}`), and perform actions.

| Node Type | Executor | Action |
|---|---|---|
| `HTTP_REQUEST` | `executeHttpNode` | Sends HTTP requests (GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS) |
| `SEND_EMAIL` | `executeSendEmailNode` | Sends emails via Gmail SMTP (nodemailer) |
| `SEND_TELEGRAM_MESSAGE` | `executeTelegramSendMessageNode` | Sends Telegram messages via Bot API |
| `SEND_DISCORD_MESSAGE` | `executeSendDiscordMessageNode` | Sends Discord webhook messages |
| `GROQ_AI` | `executeGroqAiNode` | Calls Groq chat completions API |
| `MANUAL_TRIGGER` | — | Initiator only (no executor) |
| `WEBHOOK` | — | Initiator only |
| `PUBSUBHUBBUB` | — | Initiator only (YouTube) |
| `GOOGLE_FORMS` | — | Initiator only |

### Payment (`src/features/payment/`)

Credit-based billing via DodoPayments. Users receive 10,000 credits on signup. AI usage consumes credits (~2,000 minimum to send a message). When exhausted, users can purchase more via checkout.

**Components:** `UsageCard` (sidebar credit bar), `UpgradeButton`

### Google OAuth (`src/features/google-oauth/`)

Configured Google OAuth2 client instance for Google APIs.

## API

### tRPC (`/api/trpc/[...trpc]`)

Type-safe API layer with 5 routers and 20+ procedures. All procedures are protected (require authentication).

#### `workflows.*`

| Procedure | Type | Description |
|---|---|---|
| `create` | mutation | Create a new workflow |
| `update` | mutation | Rename a workflow |
| `delete` | mutation | Delete a workflow |
| `getById` | query | Fetch workflow by ID (Redis-cached) |
| `getAll` | query | Paginated list (cursor-based, 10/page) |
| `runWorkflowManually` | mutation | Trigger workflow execution via Inngest |
| `generateWorkflow` | mutation | Generate workflow from AI prompt |

#### `credentials.*`

| Procedure | Type | Description |
|---|---|---|
| `create` | mutation | Create encrypted credential |
| `getById` | query | Fetch credential by ID |
| `update` | mutation | Update credential (re-encrypts) |
| `delete` | mutation | Delete credential |
| `getByType` | query | Fetch credentials filtered by NodeType |
| `getAll` | query | Paginated list (excludes encrypted data) |

#### `editor.*`

| Procedure | Type | Description |
|---|---|---|
| `save` | mutation | Save workflow graph (nodes + edges) |

#### `messages.*`

| Procedure | Type | Description |
|---|---|---|
| `getAll` | query | Paginated messages for a workflow (50/page) |
| `send` | mutation | Send message + get AI response (requires >2,000 credits) |

#### `aiUsage.*`

| Procedure | Type | Description |
|---|---|---|
| `getUsage` | query | Get current credit usage |
| `upgradeUsage` | mutation | Create DodoPayments checkout session |

### REST API Routes

#### Authentication

| Route | Method | Description |
|---|---|---|
| `/api/auth/google/sign-in` | GET | Redirect to Google OAuth consent screen |
| `/api/auth/callback/google` | GET | OAuth callback — exchanges code, creates session, sets cookie |
| `/api/auth/logout` | GET | Delete session, clear cookie, redirect to `/login` |

#### Workflow Triggers

| Route | Method | Description |
|---|---|---|
| `/api/workflows/:id/webhook/:nodeId` | POST | Generic webhook trigger (validates `x-webhook-secret`) |
| `/api/workflows/:id/webhook/:nodeId/pubsub` | GET+POST | YouTube PubSubHubbub (verification + notifications) |
| `/api/webhooks/triggers/google-form` | POST | Google Forms trigger (`?workflow=:id`) |

#### Integrations

| Route | Method | Description |
|---|---|---|
| `/api/dodo/webhooks` | POST | DodoPayments webhook (`credit.added` events) |
| `/api/inngest` | GET+POST+PUT | Inngest SDK serve endpoint |
| `/api/trpc/[...trpc]` | GET+POST | tRPC HTTP handler |

## Workflow Execution Engine

Inngest handles asynchronous workflow execution. When a workflow is triggered (manually, via webhook, Google Forms, or YouTube PubSub), an `app/workflow.started` event is dispatched.

The `processTask` function in `src/inngest/functions.ts`:

1. Parses the workflow graph (nodes + edges) from the database
2. Builds a directed graph with adjacency lists and in-degree counts
3. Seeds context with the trigger node's payload
4. Executes nodes in topological order (BFS/Kahn's algorithm):
   - Nodes at the same depth run in parallel (`Promise.all`)
   - Each node runs via `step.run()` for Inngest checkpointing/retries
   - Node outputs are stored in context, available as `{{node_name.property}}` to downstream nodes
5. Throws `NonRetriableError` on failure (no automatic retries for node errors)

## Data Flow

```
User creates workflow in editor
        │
        ▼
Save via tRPC (editor.save)
  → Validates with Zod (workflowSchema)
  → Stores JSON in PostgreSQL (workflow.data)
  → Caches in Redis (1hr TTL)
        │
        ▼
Trigger (manual/webhook/PubSub/Google Forms)
  → Sends Inngest event: app/workflow.started
        │
        ▼
Inngest processTask function
  → Parses workflow graph
  → Topological sort → sequential execution
  → Each executor: resolve credentials → Handlebars interpolation → perform action
  → Context flows between connected nodes
        │
        ▼
Results stored in context (available to downstream nodes)
```

## Database Schema

### Models

| Model | Purpose |
|---|---|
| `user` | User accounts (Google OAuth) |
| `account` | OAuth account tokens (refresh tokens, scopes) |
| `session` | Active sessions (IP, user agent, expiry) |
| `workflow` | Workflow definitions (JSON data, name) |
| `credential` | Encrypted API keys/tokens (typed by NodeType) |
| `ai_usage` | Credit tracking (alloted vs used) |
| `message` | AI chat messages (user, AI, workflow types) |

### Enums

| Enum | Values |
|---|---|
| `NodeType` | MANUAL_TRIGGER, WEBHOOK, HTTP_REQUEST, SEND_TELEGRAM_MESSAGE, SEND_EMAIL, SEND_DISCORD_MESSAGE, GROQ_AI, PUBSUBHUBBUB, GOOGLE_FORMS |
| `NodeAction` | EXECUTOR, TRIGGER |
| `MessageType` | USER, AI, WORKFLOW |
| `account_type` | GOOGLE |

## Caching Strategy

All frequently accessed data is cached in Redis with 1-hour TTLs:

| Key Pattern | Purpose |
|---|---|
| `session:{sessionId}:user:{userId}` | Session + user object (24hr for auth) |
| `workflow:{workflowId}:user:{userId}` | Individual workflow |
| `workflow:{workflowId}` | Workflow for execution (not user-scoped) |
| `credential:{id}:user:{userId}` | Individual credential |
| `credential:type:{type}:user:{userId}` | Credentials filtered by type |
| `ai-usage:{userId}` | AI credit usage |

Write operations invalidate or update the relevant cache entries.

## Node Types

### Triggers (initiate workflow execution)

| Node | Description |
|---|---|
| **Manual Trigger** | Execute workflow from the editor UI |
| **Webhook** | Receive HTTP POST at a generated URL (optional secret validation) |
| **YouTube PubSubHubbub** | Subscribe to YouTube channel uploads (HMAC-SHA1 verified) |
| **Google Forms** | Receive Google Form submissions via Apps Script webhook |

### Actions (execute within workflow)

| Node | Configuration |
|---|---|
| **HTTP Request** | Method, URL, headers (with credential refs), JSON body |
| **Send Email** | Gmail address credential, app password credential, to, subject, body |
| **Send Telegram Message** | Bot token credential, chat ID, message |
| **Send Discord Message** | Webhook URL credential, message |
| **Groq AI** | API key credential, model selection (13 models), system prompt, user prompt |

### Data Flow Between Nodes

Nodes communicate via Handlebars template variables. Any output from an upstream node can be referenced in a downstream node's configuration using `{{node_name.property}}` syntax. For example, an HTTP request node named "fetch_data" can have its response used in a Telegram message node as `{{fetch_data.data}}`.

## AI Workflow Generation

The AI agent uses a detailed system prompt (~400 lines) that defines:

- Valid node types and their schemas
- Edge connection rules (source handles, target handles)
- Topology constraints (parallel branches vs chains)
- Handlebars variable reference rules
- Node positioning guidelines
- Summary generation requirements

When a user sends a message in the AI sidebar:
1. The message is sent to `messages.send` tRPC mutation
2. Credit balance is verified (>2,000 remaining)
3. The `generateWorkflow` server action is called
4. Groq returns structured output (nodes + edges + summary)
5. AI-generated IDs are remapped to fresh CUID2s
6. The workflow is persisted to the database
7. The updated workflow is loaded into the visual editor

## Payments

DodoPayments handles credit purchases:
- Users start with 10,000 credits
- AI usage consumes credits based on token count
- When credits drop below 2,000, sending messages is blocked
- Users can purchase more credits via DodoPayments checkout
- Webhook at `/api/dodo/webhooks` processes `credit.added` events

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration files
│   └── prisma.config.ts       # Prisma configuration
├── src/
│   ├── app/                   # Next.js routes
│   │   ├── (root)/            # Authenticated dashboard
│   │   │   ├── workflows/     # Workflow list + detail pages
│   │   │   └── credentials/   # Credentials management page
│   │   ├── login/             # Login page
│   │   ├── checkout/          # Payment checkout page
│   │   ├── docs/              # Documentation pages (Google Forms, PubSub)
│   │   └── api/               # API route handlers
│   ├── features/              # Domain modules (see above)
│   ├── trpc/                  # tRPC setup + routers
│   ├── inngest/               # Inngest client + functions
│   ├── lib/                   # Shared utilities
│   ├── components/            # Shared UI components
│   ├── db/                    # Database clients
│   ├── stores/                # Zustand stores
│   └── type/                  # TypeScript types
├── components.json            # shadcn/ui configuration
├── biome.json                 # Biome linter/formatter config
├── postcss.config.mjs         # PostCSS (Tailwind CSS v4)
└── tsconfig.json              # TypeScript configuration
```

## License

MIT
