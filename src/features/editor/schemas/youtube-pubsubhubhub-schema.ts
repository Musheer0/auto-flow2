import z from "zod";

export const YoutubePubSubSchema = z.object({
    channel_id:z.string(),
    verify_secret:z.string().describe("if your an ai agent then  generate a 16 bit hex secret"),
    has_subscribed:z.boolean().describe("if your an ai model keep the value false cuz only user should manually trigger it ")
})