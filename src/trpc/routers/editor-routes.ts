import { workflowSchema } from "@/features/editor/schemas/workflow-schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/db";

export const editorRouter = createTRPCRouter({
    save:protectedProcedure
    .input(workflowSchema)
    .mutation(async({ctx,input})=>{
        const userId = ctx.session.user.id
        await prisma.workflow.update({
            where:{
                id:input.workflowId,
                user_id:userId
            },
            data:{
                data:JSON.stringify({nodes:input.nodes,edges:input.edges})
            }
        })
    })
})