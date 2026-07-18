import { Edge, Node } from "@xyflow/react";
import { workflowSchema } from "../schemas/workflow-schema";

export const transformReactFlowToServerData =(nodes:Node[], edges:Edge[],workflowId:string)=>{
    const data = workflowSchema.parse({nodes,edges,workflowId})
    return data
}