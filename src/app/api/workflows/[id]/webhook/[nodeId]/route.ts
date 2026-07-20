import { workflowDataSchema } from "@/features/editor/schemas/workflow-schema";
import { NodeData, WebhookData } from "@/features/editor/types";
import { inngest } from "@/inngest/client";
import { decrypt } from "@/lib/encrypt-decrypt";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";
import { getWorkflowByid } from "@/trpc/utils/get-workflow-by-id";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const  POST  = async(req:NextRequest,{params}:{params:Promise<{id:string , nodeId:string}>})=>{
    const header = req.headers
    const wh_secret = header.get("x-webhook-secret")||""
    const {id,nodeId} = await params
    const workflow = await getWorkflowByid(id)
    if(!workflow) return NextResponse.json({},{status:404})
    const workflow_data = workflowDataSchema.safeParse(JSON.parse(workflow.data))
    if(workflow_data.error) return NextResponse.json({...workflow_data.error},{status:400})
    const nodes = workflow_data.data.nodes
    const webhook_node = nodes.find((n)=>n.type==="WEBHOOK" && n.id==nodeId)
    if(!webhook_node)return NextResponse.json({error:"node not found"},{status:400})
    
    const node_data = ( webhook_node.data as NodeData<WebhookData>)
    const webhook_secret =( webhook_node.data as NodeData<WebhookData>)?.user_data.webhook_secret
    if(!node_data?.config?.name)  return NextResponse.json({error:"node not configured missing name"},{status:400})

    if(webhook_secret){

        const credential = await getCredentialById(workflow.user_id,webhook_secret)
        if(!credential) return NextResponse.json(null,{status:403})
        if(wh_secret!==decrypt(credential.data)) return NextResponse.json({},{status:403})
    }
    const getbody =async()=>{
        try{
             const b = await req.json()
             return b
        }
    catch (error) {
        return {}
    }
    }
    const body = await getbody()
     await inngest.send({
              name:"app/workflow.started",
              data:{
                workflow,
                triggerNodeId:webhook_node.id,
                body
            }
          })
}