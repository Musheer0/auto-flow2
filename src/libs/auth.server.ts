"use server"
import { cookie_name } from "@/constants"
import { cookies } from "next/headers"
import { verifyJwt } from "./jwt"
import prisma from "@/db"

export const getCurrentUser = async()=>{

    const c = await cookies()
    const token = c.get(cookie_name)
    if(!token?.value) return null
    const jwt = verifyJwt(token.value)
    if(!jwt.sessionId) return null
    const sessionWithUser = await prisma.session.findFirst({
        where:{
            id:jwt.sessionId,
        },
        select:{
            id:true,
            user:true,
            expires_at:true,
        }
    });
    
    return sessionWithUser
}