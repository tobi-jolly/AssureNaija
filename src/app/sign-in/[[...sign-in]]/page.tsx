// app/sign-in/[[...sign-in]]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (remove or adjust in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // adjust time or remove if not needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-background via-muted/30 to-background/80">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-8">
        <div className="relative w-full max-w-lg aspect-square">
          <Image
            src="/assets/banner.png"           // ← your image (same as sign-up or different)
            alt="AssureNaija - Secure your future with smart insurance"
            fill
            className="object-contain drop-shadow-2xl"
            priority
            quality={90}
          />

          {/* Floating text overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md px-8 py-6 rounded-2xl max-w-md">
              <h2 className="text-3xl font-bold text-white mb-4">
                Secure Your Future Today
              </h2>
              <p className="text-white/90 text-lg">
                Join thousands of Nigerians getting clear, personalized insurance advice — no agents, no stress.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign In form / Skeleton */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header above form */}
          <div className="text-center">
            <img src="/logo.png" alt="AssureNaija" className="h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue chatting with your insurance buddy
            </p>
          </div>

          {isLoading ? (
            // Skeleton loading state (matches sign-up style)
            <Card className="bg-card/95 backdrop-blur-lg shadow-2xl border border-border/50 rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                {/* Skeleton header */}
                <div className="space-y-2 text-center">
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>

                {/* Skeleton form fields */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </div>

                {/* Skeleton button */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Skeleton footer links */}
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ) : (
            // Real Clerk SignIn component
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-card/95 backdrop-blur-lg shadow-2xl border border-border/50 rounded-2xl',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-6',
                  formFieldInput: 'bg-background border-input text-foreground rounded-lg focus:ring-primary',
                  footerActionLink: 'text-primary hover:text-primary/80',
                  socialButtonsIconButton: 'border-border hover:bg-muted',
                },
                layout: {
                  socialButtonsVariant: 'iconButton',
                  termsPageUrl: '/terms',
                  privacyPageUrl: '/privacy',
                },
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/dashboard/chat"
              afterSignUpUrl="/dashboard/chat"
            />
          )}
        </div>
      </div>
    </div>
  );
}