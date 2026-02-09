// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { ClientProviders } from '@/components/Providers';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AssureNaija – Smart Insurance for Nigerians',
  description: 'Chat with AI to understand insurance easily, get your risk profile and personalized recommendations — no agents, no stress.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}