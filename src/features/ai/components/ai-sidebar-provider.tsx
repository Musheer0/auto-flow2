"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AISidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const AISidebarContext = createContext<AISidebarContextType | null>(null);

export function AISidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((prev) => !prev),
      openSidebar: () => setOpen(true),
      closeSidebar: () => setOpen(false),
    }),
    [open]
  );

  return (
    <AISidebarContext.Provider value={value}>
      {children}
    </AISidebarContext.Provider>
  );
}

export function useAISidebar() {
  const context = useContext(AISidebarContext);

  if (!context) {
    throw new Error(
      "useAISidebar must be used within an AISidebarProvider"
    );
  }

  return context;
}