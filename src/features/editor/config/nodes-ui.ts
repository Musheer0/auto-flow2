import React from "react"
import { GlobeIcon, LucideIcon, MailIcon, MouseIcon, PlaneIcon, WebhookIcon } from "lucide-react"
import { NodeAction, type NodeType } from "@/generated/prisma/enums"



type nodeUidata =  {
    name:string 
    description:string
    icon:LucideIcon|string|React.ComponentType<{className?:string}>,
    type:NodeAction
}
type nodesUi =Record<NodeType,nodeUidata>

export const nodesUi:nodesUi = {
    MANUAL_TRIGGER:{
        type:NodeAction.TRIGGER,
        description:"Trigger workflow Manually mainly used for testing",
        icon:MouseIcon,
        name:"Manual Trigger"
    },
    HTTP_REQUEST:{
            type:NodeAction.EXECUTOR,
        description:"Send a http request",
        icon:GlobeIcon,
        name:"Http Request"
    },
    SEND_TELEGRAM_MESSAGE:{
            type:NodeAction.EXECUTOR,
        description:"Send a telegram message via telegram bot",
        icon:PlaneIcon,
        name:"Send Telegram Message"
    },
    WEBHOOK:{
            type:NodeAction.TRIGGER,
        description:"Trigger workflow via webhook ",
        icon:WebhookIcon,
        name:"Webhook Trigger"
    },
    SEND_EMAIL:{
            type:NodeAction.EXECUTOR,
        description:"Send an email via SMTP",
        icon:MailIcon,
        name:"Send Email"
    },
    SEND_DISCORD_MESSAGE:{
            type:NodeAction.EXECUTOR,
        description:"Send a message via Discord webhook",
        icon:"/discord.png",
        name:"Send Discord Message"
    },
    GROQ_AI:{
        type:NodeAction.EXECUTOR,
        description:"generate  plain text content with groq",
        icon:"/groq.png",
        name:"Generate Groq AI content"
    },
    PUBSUBHUBBUB:{
        type:NodeAction.TRIGGER,
        description:"trigger an event when selected channel uploads videos on youtube",
        name:"Youtube PubSubHubHub",
        icon:"/pubsubhubhub.png"
    },
    GOOGLE_FORMS:{
        type:NodeAction.TRIGGER,
        description:"trigger an event when a google form is submitted ",
        name:"Google Forms",
        icon:"/gforms.png"
    }
}
