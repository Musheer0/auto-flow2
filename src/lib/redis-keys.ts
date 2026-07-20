export const redisKeys = {
    SESSION:(userId:string,sessionId:string)=>`session:${sessionId}:user:${userId}`,
    WORKFLOW:(userId:string,workflowId:string)=>`workflow:${workflowId}:user:${userId}`,
    CREDENTIAL_BY_TYPE:(userId:string,type:string)=>`credential:type:${type}:user:${userId}`,
    WORKFLOW_RUN:(workflowId:string)=>`workflow:${workflowId}`,
    CREDENTIAL:(userId:string ,id:string)=>`credential:${id}:user:${userId}`

}