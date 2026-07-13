import { oauth2googleClient } from "@/features/google-oauth/client"
import { NextResponse } from "next/server"

export const GET = async()=>{
    const url = oauth2googleClient.generateAuthUrl()
    return NextResponse.redirect(url)
}