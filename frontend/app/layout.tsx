/**
 * Root Layout with Providers
 */

import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ToastProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boutique Shop - Premium Fashion Online',
  description: 'Shop elegant dresses, sarees, and accessories for every occasion',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Header />
          <main className="min-h-screen animate-fade-in">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
