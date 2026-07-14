import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type Credential = RouterOutputs["credentials"]["getByType"][number];
export type CredentialsPage = RouterOutputs["credentials"]["getAll"];
export type CredentialListItem = CredentialsPage["credentials"][number];
