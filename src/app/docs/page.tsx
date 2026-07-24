import { FileText, Webhook } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const docPages = [
  {
    title: "Google Forms Trigger",
    description:
      "Set up a Google Form to trigger your workflows using Apps Script.",
    href: "/docs/gforms/how-to",
    icon: FileText,
    badge: "Trigger",
  },
  {
    title: "YouTube PubSub Payload",
    description:
      "Reference for the webhook payload sent by YouTube when a subscribed channel publishes a video.",
    href: "/docs/pubsub/types",
    icon: Webhook,
    badge: "Webhook",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Introduction</h1>
        <p className="text-muted-foreground leading-relaxed">
          Welcome to the AutoFlow documentation. AutoFlow is a self-hosted,
          open-source workflow automation platform with an AI copilot that
          builds flows for you.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This documentation covers triggers, webhook payloads, and integration
          guides to help you get started.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">All Pages</h2>
        <div className="grid gap-4">
          {docPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.href} href={page.href}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {page.title}
                        </CardTitle>
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {page.badge}
                        </span>
                      </div>
                      <CardDescription className="mt-1">
                        {page.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
