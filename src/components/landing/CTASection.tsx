// components/landing/CTASection.tsx
'use client';

import { GraduationCap, MapPin, Users, FileX, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const differentiators = [
  {
    icon: GraduationCap,
    title: "Education + Underwriting Combined",
    description: "Learn about insurance AND get assessed at the same time. No separate processes.",
  },
  {
    icon: MapPin,
    title: "Built for Nigeria",
    description: "Designed for Nigerian realities — Pidgin support, local pricing, and plans that make sense here.",
  },
  {
    icon: Users,
    title: "Works for Informal Workers",
    description: "Whether you're a trader in Onitsha or a rider in Lagos, InsureBuddy covers you.",
  },
  {
    icon: FileX,
    title: "No Complex Forms",
    description: "Just chat. No 20-page forms, no office visits, no waiting for weeks.",
  },
  {
    icon: Zap,
    title: "Fast and Friendly",
    description: "Get your risk profile and recommendations in under 3 minutes.",
  },
];

export default function CTASection() {
  return (
    <>
      <section id="why-different" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4 text-foreground">
              Why InsureBuddy is <span className="gradient-text">Different</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're not just another insurance platform. We're building something that actually works for real people.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto gradient-primary rounded-3xl p-10 sm:p-14 text-center shadow-glow"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4 text-primary-foreground">
              Ready to understand insurance the easy way?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              No signup needed. Just start chatting with InsureBuddy and discover the right insurance for you.
            </p>
            <Link href="/dashboard/chat">
              <Button
                variant="secondary"
                size="xl"
                className="gap-2 font-bold text-primary py-3 hover:bg-secondary/90"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}