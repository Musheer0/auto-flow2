import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { workflowsRouer } from "./workflow-routes";
import { credentialsRouter } from "./credentials-routes";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouer,
  credentials: credentialsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
