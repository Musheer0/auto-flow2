"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const HIDDEN_PATTERNS = [/^\/workflows\/[^/]+$/];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = HIDDEN_PATTERNS.some((pattern) => pattern.test(pathname));

  if (hideSidebar) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
