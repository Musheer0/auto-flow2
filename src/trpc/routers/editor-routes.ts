import { workflowSchema } from "@/features/editor/schemas/workflow-schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/db";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";

export const editorRouter = createTRPCRouter({
    save:protectedProcedure
    .input(workflowSchema)
    .mutation(async({ctx,input})=>{
        const userId = ctx.session.user.id
        const updated_workflow = await prisma.workflow.update({
            where:{
                id:input.workflowId,
                user_id:userId
            },
            data:{
                data:JSON.stringify({nodes:input.nodes,edges:input.edges})
            }
        });
              await redis.set(redisKeys.WORKFLOW(userId, updated_workflow.id), updated_workflow, { ex: 60 * 60 });
        
              await redis.set(redisKeys.WORKFLOW_RUN( updated_workflow.id), updated_workflow, { ex: 60 * 60 });
    })
})