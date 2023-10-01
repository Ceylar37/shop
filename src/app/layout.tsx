'use client';

import AuthProvider from '@/client/components/AuthProvider/AuthProvider';
import LoaderProvider from '@/client/components/LoaderProvider';
import Header from '@/client/components/Navigation';
import {Layout} from 'antd';
import {Montserrat} from 'next/font/google';
import {PropsWithChildren} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import './globals.css';

const inter = Montserrat({subsets: ['latin']});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="ru">
      {/* <head
        dangerouslySetInnerHTML={{
          __html: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-RTZ4MFGKDZ"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_G_TAG}');
        </script> `,
        }}></head> */}
      <body className={inter.className}>
        <LoaderProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Layout style={{height: '100vh'}}>
                <Header />
                <Layout.Content>{children}</Layout.Content>
              </Layout>
            </AuthProvider>
          </QueryClientProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
