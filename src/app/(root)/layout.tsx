import AuthProvider from '@/components/auth-provider';
import ReactQueryClientProvider from '@/components/query-client-provider';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
   <ReactQueryClientProvider>
    <AuthProvider>
        {children}
    </AuthProvider>
   </ReactQueryClientProvider>
  );
};

export default Layout;