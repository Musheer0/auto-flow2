import AuthProvider from '@/components/auth-provider';
import ReactQueryClientProvider from '@/components/query-client-provider';
import { TRPCReactProvider } from '@/trpc/client';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
   <ReactQueryClientProvider>
    <AuthProvider>
       <TRPCReactProvider>
         {children}
       </TRPCReactProvider>
    </AuthProvider>
   </ReactQueryClientProvider>
  );
};

export default Layout;