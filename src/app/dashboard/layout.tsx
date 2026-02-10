// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle, BarChart3, Shield, Menu, X, Home, Globe, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserButton, useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// ============================================
// FIX #5: RADIX HYDRATION ISSUE
// ============================================
// Import DropdownMenu dynamically with SSR disabled
// This prevents server/client ID mismatch
const DropdownMenu = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenu),
  { ssr: false }
);

const DropdownMenuTrigger = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuTrigger),
  { ssr: false }
);

const DropdownMenuContent = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuContent),
  { ssr: false }
);

const DropdownMenuItem = dynamic(
  () => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenuItem),
  { ssr: false }
);

const navItems = [
  { title: 'Chat with AI', path: '/dashboard/chat', icon: MessageCircle },
  { title: 'Risk Profile', path: '/dashboard/risk', icon: BarChart3 },
  { title: 'Recommendations', path: '/dashboard/recommendations', icon: Shield },
];

type Language = 'english' | 'pidgin';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('pidgin');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Fix #5: Client-only rendering flag
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  // Fix #5: Ensure client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loader on navigation
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    // Optionally: Save to localStorage or context
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', lang);
    }
  };

  const handleNavClick = (path: string) => {
    if (path === pathname) return;
    setIsNavigating(true);
    setSidebarOpen(false);
    router.push(path);
  };

  const handleBackToHome = async () => {
    setIsNavigating(true);
    setSidebarOpen(false);
    await signOut({ redirectUrl: '/' });
    setTimeout(() => setIsNavigating(false), 800);
  };

  return (
    <>
      {/* Full-screen centered spinner overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-16 h-16 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen bg-background">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-72 bg-sidebar shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0',
            'lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-72 lg:shadow-none lg:transition-none',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo / Brand */}
            <div className="p-6 border-b border-sidebar-border relative">
              <Link href="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <img src="/logo.png" alt="AssureNaija Logo" className="h-10 w-auto object-contain rounded-lg" />
                <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
                  Assure<span className="text-primary">Naija</span>
                </span>
              </Link>

              <button
                className="absolute right-5 top-6 lg:hidden p-2 rounded-full hover:bg-sidebar-accent/50 transition-colors"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-sidebar-foreground" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-5 space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const isChat = item.path === '/dashboard/chat';

                return (
                  <div key={item.path} className="relative">
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={cn(
                        'w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-200 text-left',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary shadow-sm font-semibold'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {item.title}
                    </button>

                    {/* Fix #5: Only render dropdown after mount (client-only) */}
                    {isChat && isMounted && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-sidebar-accent/50 transition-colors"
                            aria-label="Select AI language"
                          >
                            <Globe className="w-4 h-4 text-sidebar-foreground/70" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-sidebar border-sidebar-border">
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleLanguageChange('pidgin')}
                          >
                            <span>Pidgin English</span>
                            {selectedLanguage === 'pidgin' && <Check className="w-4 h-4 ml-auto text-primary" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleLanguageChange('english')}
                          >
                            <span>English</span>
                            {selectedLanguage === 'english' && <Check className="w-4 h-4 ml-auto text-primary" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Back to Home */}
            <div className="p-5 border-t border-sidebar-border mt-auto">
              <button
                onClick={handleBackToHome}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors text-left"
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                Back to Home
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-72">
          {/* Header with UserButton */}
          <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-secondary mr-3 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-foreground" />
              </button>

              <h1 className="text-base font-semibold text-foreground truncate">
                {navItems.find((i) => i.path === pathname)?.title || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9 border-2 border-primary/30',
                    userButtonPopoverCard: 'bg-card border-border shadow-lg',
                  },
                }}
              />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </>
  );
}