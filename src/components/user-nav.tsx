"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function UserNav() {
  const session = useContext(AuthContext);
  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex items-center gap-2 w-full">
      <Avatar size="sm">
        <AvatarImage
          src={user?.picture ?? undefined}
          alt={user?.name ?? "User"}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium truncate">
          {user?.name ?? "User"}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {user?.email}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => {
          window.location.href = "/api/auth/logout";
        }}
        title="Logout"
      >
        <LogOut className="size-3.5" />
      </Button>
    </div>
  );
}
