// components/landing/HeroSection.tsx
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Insurance for Nigeria 🇳🇬
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-display text-foreground">
              Insurance,{" "}
              <span className="gradient-text">Explained Like a Human.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Chat with an AI that helps you understand insurance, checks your risk,
              and recommends the right cover — no agents, no stress.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard/chat">
                <Button variant="hero" size="xl" className="gap-2 py-2">
                  <MessageCircle className="w-5 h-5" />
                  Talk to Insurance Buddy
                </Button>
              </Link>
              <Link href="#how-it-works" scroll={true}>
                <Button variant="heroOutline" size="xl" className="gap-2 py-2">
                  <ArrowDown className="w-5 h-5" />
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                No agents needed
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success text-xs">✓</span>
                Pidgin friendly
              </div>
            </div>
          </motion.div>

          {/* Right side - Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative w-full aspect-[4/3] md:aspect-[5/4] lg:aspect-square xl:aspect-[4/3]">
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 scale-105" />

              <Image
                src="/assets/hero-illustration.png"  // ← direct public path
                alt="InsureBuddy AI assistant helping a Nigerian user understand insurance through friendly chat"
                fill
                className="object-contain lg:object-cover rounded-3xl shadow-elevated relative z-10"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}