import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { workflowsRouer } from "./workflow-routes";
import { credentialsRouter } from "./credentials-routes";
import { editorRouter } from "./editor-routes";
import { messagesRouter } from "./message-routes";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouer,
  credentials: credentialsRouter,
  editor: editorRouter,
  messages: messagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
