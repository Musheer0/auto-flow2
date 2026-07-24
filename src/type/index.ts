type YouTubeFeedEntry = {
  "yt:videoId": string;
  "yt:channelId": string;
  title: string;
  link?: {
    "@_href"?: string;
    "@_rel"?: string;
  };
  published: string;
  updated: string;
  "at:deleted-entry"?: unknown;
};