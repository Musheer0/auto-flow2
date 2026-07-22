import z from "zod";
import { generatedOutPutSchema } from "./schema";
import {createId} from '@paralleldrive/cuid2'
export const sanitizeAiResponse = (data:z.infer<typeof generatedOutPutSchema >)=>{
    const idMaps  =new Map<string ,string>()
    const sanitized_nodes = data.nodes.map((n)=>{
        const id = createId()
        idMaps.set(n.id, id)
       return {
        ...n,
        id
       }
    })
    const sanitized_edges = data.edges.map((e)=>{
        const source = idMaps.get(e.source) ||e.source
        const target = idMaps.get(e.target) || e.target
        return {
            ...e,
            source,
            target,
            id: source+"-"+ target
        }
    })
    return {nodes:sanitized_nodes,edges:sanitized_edges}
}