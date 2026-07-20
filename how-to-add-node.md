# How to Add a Node

A complete guide to adding a new node type to auto-flow. There are 8 steps across 8 files. After step 1, always run `npx prisma generate`.

---

## Step 1 — Add the enum variant

**File:** `prisma/schema.prisma`

Add your new node to the `NodeType` enum:

```prisma
enum NodeType {
  MANUAL_TRIGGER
  WEBHOOK
  HTTP_REQUEST
  SEND_TELEGRAM_MESSAGE
  YOUR_NEW_NODE  // <-- add here
}
```

Then run:

```bash
npx prisma generate
```

This regenerates the TypeScript enums at `src/generated/prisma/enums.ts`.

---

## Step 2 — Register UI metadata

**File:** `src/features/editor/config/nodes-ui.ts`

Every `NodeType` variant **must** have an entry in the `nodesUi` record. This controls the display name, description, icon, and category:

```typescript
YOUR_NEW_NODE: {
  type: NodeAction.EXECUTOR,   // or NodeAction.TRIGGER
  description: "What this node does",
  icon: YourLucideIcon,        // import from lucide-react
  name: "Your New Node"
},
```

---

## Step 3 — Map the node visual component

**File:** `src/features/editor/config/node-types.ts`

Map your node to one of the two generic React Flow components:

- **`BaseTrigger`** — for trigger nodes (output handle only, no input)
- **`BaseExecutor`** — for executor nodes (both input and output handles)

```typescript
YOUR_NEW_NODE: BaseExecutor,  // or BaseTrigger
```

If you need a completely custom node UI, create a component in `src/features/editor/components/nodes/` and reference it here instead. Look at `base-executor.tsx` and `base-trigger.tsx` for the pattern.

---

## Step 4 — Create a Zod schema

**File:** `src/features/editor/schemas/<your-node>.schema.ts`

Create a Zod schema for your node's `user_data`. This validates the form input:

```typescript
import { z } from "zod";

export const yourNewNodeSchema = z.object({
  // your fields here
});

export type YourNewNodeFormData = z.infer<typeof yourNewNodeSchema>;
```

Re-export it from `src/features/editor/schemas/index.ts`.

---

## Step 5 — Create the form component

**File:** `src/features/editor/components/forms/<your-node>-form.tsx`

Create a form that lets users configure the node. Follow the pattern in `http-form.tsx`:

- Use `"use client"` directive
- Accept `NodeProps & { children: React.ReactNode }` as props
- Use `react-hook-form` with `zodResolver` for validation
- Read current data from `props.data` (typed as `NodeData<YourSchemaType>`)
- Write changes via `useEditorStore().updateNode(props.id, updater)`
- Render inside a `Dialog` with a `DialogTrigger` wrapping the `children` prop (the gear button)
- On submit, call `updateNode` with updated `config.name` and `user_data`

If no configuration is needed (like `MANUAL_TRIGGER`), skip this and the next step.

---

## Step 6 — Register the form

**File:** `src/features/editor/config/node-forms.ts`

Add your form component (or `null` if no configuration is needed):

```typescript
YOUR_NEW_NODE: YourNewNodeForm,  // or null
```

---

## Step 7 — Create the executor

**File:** `src/features/nodes/executors/execute-<your-node>-node.ts`

Create the server-side executor function. Follow the pattern in `execute-http-node.ts`:

```typescript
export async function executeYourNewNode(
  userId: string,
  node_data: any,
  context: any
): Promise<any> {
  // 1. Validate node_data with your Zod schema (.safeParse)
  // 2. Throw NonRetriableError (from inngest) on validation errors
  // 3. Template-interpolate values using handlebars.compile(value)(context)
  // 4. Resolve credential references (prefix "credential-") if needed
  // 5. Do the work and return a result
}
```

If your node is a trigger, skip this step.

---

## Step 8 — Register the executor

**File:** `src/features/nodes/config.ts`

Add your executor to the config (or `null` for triggers):

```typescript
YOUR_NEW_NODE: executeYourNewNode,  // or null
```

---

## Quick Reference

| Step | File | Action |
|------|------|--------|
| 1 | `prisma/schema.prisma` | Add enum variant, run `prisma generate` |
| 2 | `src/features/editor/config/nodes-ui.ts` | Add UI metadata (name, icon, type) |
| 3 | `src/features/editor/config/node-types.ts` | Map to `BaseTrigger` or `BaseExecutor` |
| 4 | `src/features/editor/schemas/<name>.schema.ts` | Create Zod schema |
| 5 | `src/features/editor/components/forms/<name>-form.tsx` | Create form component |
| 6 | `src/features/editor/config/node-forms.ts` | Register form (or `null`) |
| 7 | `src/features/nodes/executors/execute-<name>-node.ts` | Create executor function |
| 8 | `src/features/nodes/config.ts` | Register executor (or `null`) |

## Key Types

```typescript
// Node data shape passed to forms
type NodeData<T> = {
  config: { name: string };
  user_data: T;
};

// Executor signature
type NodeExecutor = (
  userId: string,
  node_data: any,
  context: any
) => Promise<any>;
```
