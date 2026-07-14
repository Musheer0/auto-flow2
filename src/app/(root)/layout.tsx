import AuthProvider from '@/components/auth-provider';
import ReactQueryClientProvider from '@/components/query-client-provider';
import { TRPCReactProvider } from '@/trpc/client';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import {Toaster} from 'sonner'
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
   <ReactQueryClientProvider>
    <AuthProvider>
       <TRPCReactProvider>
         <NuqsAdapter>
          {children}
          <Toaster/>
         </NuqsAdapter>
       </TRPCReactProvider>
    </AuthProvider>
   </ReactQueryClientProvider>
  );
};

export default Layout;