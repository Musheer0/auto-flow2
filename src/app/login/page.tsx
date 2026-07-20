"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function WorkflowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="6" height="6" />
      <rect x="15" y="3" width="6" height="6" />
      <rect x="9" y="15" width="6" height="6" />
      <path d="M6 9v3a3 3 0 0 0 3 3h0" />
      <path d="M18 9v3a3 3 0 0 1-3 3h0" />
      <path d="M12 12v3" />
    </svg>
  );
}

function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    window.location.href = "/api/auth/google/sign-in";
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className="
        group flex h-11 w-full items-center justify-center gap-3
        rounded-sm border border-border bg-background
        text-sm font-medium
        transition-all duration-200
        hover:border-primary/40 hover:bg-accent
        hover:shadow-md
        active:scale-[0.99]
        disabled:pointer-events-none
        disabled:opacity-60
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2
      "
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <GoogleIcon className="size-[18px] transition-transform duration-200 group-hover:scale-105" />
      )}

      <span>
        {loading ? "Redirecting..." : "Continue with Google"}
      </span>
    </button>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Grid */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)]
            bg-[size:40px_40px]
            [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]
          "
        />

        {/* Blur gradients */}
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md rounded-sm border-border/60 bg-background/80 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-6 text-center">
       
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-border bg-primary text-primary-foreground shadow-lg">
            <WorkflowIcon className="size-7" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Welcome to AutoFlow
            </CardTitle>

            <CardDescription className="text-sm leading-6">
              Build, automate and monitor workflows from a single dashboard.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <GoogleSignInButton />

         


          <p className="text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to sign in using your Google account.
            Your password is never shared with AutoFlow.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}