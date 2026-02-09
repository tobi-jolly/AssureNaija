// components/landing/LandingNav.tsx
'use client';

import { Menu, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleStartChatting = () => {
    if (isSignedIn) {
      router.push('/dashboard/chat');
    } else {
      router.push('/sign-in?redirect_url=/dashboard/chat');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="AssureNaija Logo" className="h-9 w-auto object-contain" />
          <span className="text-xl font-bold font-display text-foreground">
            Assure<span className="text-primary">Naija</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#why-different" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Why Us
          </Link>

          {isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-9 h-9 border-2 border-primary/30',
                }
              }}
            />
          ) : (
            <Button variant="hero" size="sm" className="gap-2" onClick={handleStartChatting}>
              <MessageCircle className="w-4 h-4" />
              Start Chatting
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-3 animate-fade-in">
          <Link href="#how-it-works" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
            How It Works
          </Link>
          <Link href="#why-different" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
            Why Us
          </Link>

          {isSignedIn ? (
            <div className="pt-2 flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Button variant="hero" className="w-full gap-2" onClick={() => {
              setMobileOpen(false);
              handleStartChatting();
            }}>
              <MessageCircle className="w-4 h-4" />
              Start Chatting
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}