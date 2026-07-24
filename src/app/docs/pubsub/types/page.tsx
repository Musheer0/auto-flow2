import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

type FieldDoc = {
  field: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
};

const fields: FieldDoc[] = [
  {
    field: "videoId",
    type: "string",
    required: true,
    description: "YouTube's unique ID for the video that was uploaded or updated.",
    example: "dQw4w9WgXcQ",
  },
  {
    field: "channelId",
    type: "string",
    required: true,
    description: "The channel that owns the video. Matches the channel_id you subscribed with.",
    example: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
  },
  {
    field: "title",
    type: "string",
    required: true,
    description: "The video's current title at the time the notification was sent.",
    example: "How webhooks actually work",
  },
  {
    field: "link",
    type: "string (URL)",
    required: false,
    description:
      "Direct link to the video on YouTube. Missing if the feed entry didn't include an alternate link.",
    example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    field: "published",
    type: "string (ISO 8601)",
    required: true,
    description: "When the video was originally published.",
    example: "2026-07-20T14:03:00+00:00",
  },
  {
    field: "updated",
    type: "string (ISO 8601)",
    required: true,
    description: "When this specific version of the video (metadata) was last changed. This is what actually triggers a new notification, not just new uploads.",
    example: "2026-07-24T09:12:31+00:00",
  },
];

export default function WebhookDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="space-y-2">
        <Badge variant="secondary">Webhook reference</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">
          YouTube video notification payload
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Every time a subscribed channel publishes or edits a video, YouTube's
          PubSubHubbub hub sends a signed POST request to your callback URL.
          After the signature is verified, the XML body is parsed down into
          the fields below.
        </p>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Fields</CardTitle>
          <CardDescription>
            Shape of the object your workflow receives as trigger data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((f) => (
                <TableRow key={f.field}>
                  <TableCell className="font-mono text-sm">{f.field}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {f.type}
                  </TableCell>
                  <TableCell>
                    {f.required ? (
                      <Badge>required</Badge>
                    ) : (
                      <Badge variant="outline">optional</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm leading-relaxed">
                    {f.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {fields.map((f) => (
          <Card key={f.field}>
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-base">{f.field}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm">{f.description}</p>
              <p className="text-muted-foreground font-mono text-xs">
                e.g. {f.example}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Not included in this payload</CardTitle>
          <CardDescription>
            These arrive as deleted-entry notifications instead of a normal
            entry, and are handled separately before the fields above are
            ever built.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}