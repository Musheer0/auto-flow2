"use client";

import React, { createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/auth.server";

export const AuthContext = createContext<Awaited<
  ReturnType<typeof getCurrentUser>
> | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { data, isPending, isError } = useQuery({
    queryKey: ["user-session"],
    queryFn: getCurrentUser,
    retry: 2, // Retry only twice
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/logout");
    }
  }, [isError, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Prevent rendering while redirecting
  if (isError || !data) {
    return null;
  }

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
