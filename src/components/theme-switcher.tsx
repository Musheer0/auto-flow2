"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full gap-1 p-2">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => setTheme(value)}
          className={cn(
            "flex-1 gap-1.5 text-xs",
            theme === value &&
              "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
        >
          <Icon className="size-3.5" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
