import { oauth2googleClient } from "@/features/google-oauth/client"
import { NextResponse } from "next/server"

export const GET = async()=>{
    const url = oauth2googleClient.generateAuthUrl({
          access_type: "offline",
  scope: [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
    })
    return NextResponse.redirect(url)
}