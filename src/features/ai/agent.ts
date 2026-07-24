"use server"
import { groq } from "@ai-sdk/groq";
import { generateObject, tool } from "ai";
import { generateWorkflowPrompt } from "./prompt";
import { generatedOutPutSchema } from "./schema";
import { sanitizeAiResponse } from "./sanitize-ai-response";
import prisma from "@/db";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
import { getTokensUsed } from "./lib/utils";
import { getCurrentUser } from "@/lib/auth.server";

export const generateWorkflow = async(prompt:string,workflowId:string,prev:any='{}',memory?:string)=>{
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            user_id: user.user.id,
        },
    });
    if (!workflow) {
        throw new Error("Workflow not found");
    }

    const result = await generateObject({
        model:groq("openai/gpt-oss-120b",),
        system:generateWorkflowPrompt,
        schema:generatedOutPutSchema,
        prompt:`
        memory :${memory}
        current workflow state -:
        data :${JSON.stringify(prev||"{}")}
        user request:${prompt}
        `,
        
    })
    const tokens_used =  getTokensUsed(result.usage)
    const data =  result.object
    const sanitized_data = sanitizeAiResponse(data)
     const updated_workflow = await prisma.workflow.update({
            where:{
                id:workflowId,
                user_id: user.user.id,
            },
            data:{
                data:JSON.stringify(sanitized_data)
            }
        });
              await redis.set(redisKeys.WORKFLOW(updated_workflow.user_id, updated_workflow.id), updated_workflow, { ex: 60 * 60 });
        
              await redis.set(redisKeys.WORKFLOW_RUN( updated_workflow.id), updated_workflow, { ex: 60 * 60 });
            return {updated_workflow, summary:data.summary,tokens_used}
}