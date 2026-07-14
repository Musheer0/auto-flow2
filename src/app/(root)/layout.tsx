import AuthProvider from "@/components/auth-provider";
import ReactQueryClientProvider from "@/components/query-client-provider";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <AuthProvider>
        <TRPCReactProvider>
          <NuqsAdapter>
            <DashboardLayout>{children}</DashboardLayout>
            <Toaster />
          </NuqsAdapter>
        </TRPCReactProvider>
      </AuthProvider>
    </ReactQueryClientProvider>
  );
};

export default Layout;
