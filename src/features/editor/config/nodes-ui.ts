import { NodeAction, NodeType } from "@/generated/prisma/enums"
import { GlobeIcon, LucideIcon, MouseIcon, PlaneIcon, WebhookIcon } from "lucide-react"

type nodeUidata =  {
    name:string 
    description:string
    icon:LucideIcon|string,
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
    }
}
