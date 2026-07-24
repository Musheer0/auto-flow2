import { BookOpen, FileText, Webhook } from "lucide-react";
import Link from "next/link";

const docSections = [
  {
    title: "Getting Started",
    items: [{ label: "Introduction", href: "/docs", icon: BookOpen }],
  },
  {
    title: "Triggers",
    items: [
      { label: "Google Forms", href: "/docs/gforms/how-to", icon: FileText },
    ],
  },
  {
    title: "Webhooks",
    items: [
      { label: "YouTube PubSub", href: "/docs/pubsub/types", icon: Webhook },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <BookOpen className="size-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight">Docs</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {docSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h4 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Icon className="size-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-border px-6 py-3">
          <p className="text-xs text-muted-foreground">AutoFlow v1.0</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-12">{children}</div>
      </main>
    </div>
  );
}
