"use server"
import { groq } from "@ai-sdk/groq";
import { generateObject, tool } from "ai";
import { generateWorkflowPrompt } from "./prompt";
import { generatedOutPutSchema } from "./schema";
import { sanitizeAiResponse } from "./sanitize-ai-response";
import prisma from "@/db";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";
export const generateWorkflow = async(prompt:string,workflowId:string,prev:any='{}')=>{
    const result = await generateObject({
        model:groq("openai/gpt-oss-120b"),
        system:generateWorkflowPrompt,
        schema:generatedOutPutSchema,
        prompt:`
        current workflow state -:
        data :${JSON.stringify(prev||"{}")}

        user request:${prompt}
        `,
    })
    const data =  result.object
    const sanitized_data = sanitizeAiResponse(data)
     const updated_workflow = await prisma.workflow.update({
            where:{
                id:workflowId,
            },
            data:{
                data:JSON.stringify(sanitized_data)
            }
        });
              await redis.set(redisKeys.WORKFLOW(updated_workflow.user_id, updated_workflow.id), updated_workflow, { ex: 60 * 60 });
        
              await redis.set(redisKeys.WORKFLOW_RUN( updated_workflow.id), updated_workflow, { ex: 60 * 60 });
            return updated_workflow
}