"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import React, { useLayoutEffect, useState } from "react";

const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMounted, setIsMounted] = useState(false)
  useLayoutEffect(()=>{setIsMounted(true)},[])
  if(isMounted)
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryClientProvider;
