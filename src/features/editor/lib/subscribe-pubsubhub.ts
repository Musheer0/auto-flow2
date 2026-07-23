import { toast } from "sonner";

type SubscribeOptions = {
  topic: string;
  callback: string;
  secret: string;
  onSuccess?: (response: Response) => void;
};
function getYouTubeTopicUrl(channelId: string) {
  return `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`;
}
export async function subscribeToYouTubeWebhook({
  topic,
  callback,
  secret,
  onSuccess,
}: SubscribeOptions) {
  try {
    const response = await fetch(
      "https://pubsubhubbub.appspot.com/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "hub.callback": callback,
          "hub.mode": "subscribe",
          "hub.topic": getYouTubeTopicUrl(topic),
          "hub.verify": "async",
          "hub.secret": secret,
          "hub.lease_seconds": "864000", // 10 days
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to subscribe: ${response.status} ${response.statusText}`
      );
    }

    toast.success("Subscribed to YouTube webhook successfully");
    onSuccess?.(response);

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to subscribe to webhook";

    toast.error(message);
    throw error;
  }
}