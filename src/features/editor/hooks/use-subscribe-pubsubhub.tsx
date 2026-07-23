import { useMutation } from "@tanstack/react-query"
import { subscribeToYouTubeWebhook } from "../lib/subscribe-pubsubhub"

export const useSubscribePubSubHub = ()=>{
    return useMutation({
        mutationKey:["subscribe"],
        mutationFn:subscribeToYouTubeWebhook
    })
}