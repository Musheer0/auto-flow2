async function getChannelIdFromHandle(handle: string, ) {
    const apiKey = process.env.YT!
  // handle should include the @ , e.g. "@mkbhd"
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "id");
  url.searchParams.set("forHandle", handle);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to resolve handle: ${res.status}`);

  const data = await res.json();
  const channelId = data.items?.[0]?.id;

  if (!channelId) throw new Error(`No channel found for handle "${handle}"`);
  return channelId as string;
}