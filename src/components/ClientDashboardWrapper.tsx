// components/ClientDashboardWrapper.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
// ... all your lucide icons, cn, etc.

export default function ClientDashboardWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      {/* your full sidebar, header, mobile nav, etc. */}
      <aside>...</aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header>...</header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      {/* mobile bottom nav */}
    </div>
  );
}