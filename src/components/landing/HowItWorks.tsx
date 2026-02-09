// components/landing/HowItWorks.tsx
'use client';

import { MessageCircle, BookOpen, ClipboardList, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Chat with the AI",
    description: "Start a conversation with InsureBuddy. Just say hi — no signup needed to explore.",
  },
  {
    icon: BookOpen,
    number: "02",
    title: "Learn Insurance Simply",
    description: "The AI explains what insurance is, why you need it, and how it works — in plain English or Pidgin.",
  },
  {
    icon: ClipboardList,
    number: "03",
    title: "Answer a Few Questions",
    description: "Tell us about your age, work, lifestyle, and health. It takes less than 2 minutes.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Get Your Risk Profile",
    description: "See your risk level (Low, Medium, or High) with a clear explanation of what it means.",
  },
  {
    icon: Shield,
    number: "05",
    title: "Receive Recommendations",
    description: "Get personalized insurance plans with estimated premium ranges that fit your budget.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Five simple steps to understanding and getting the right insurance cover.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-5 items-start bg-card rounded-xl p-6 shadow-card"
            >
              <div className="flex flex-col items-center shrink-0">
                <span className="text-xs font-bold gradient-text">{step.number}</span>
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mt-1">
                  <step.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-6 bg-border mt-2" />
                )}
              </div>
              <div className="pt-4">
                <h3 className="font-bold text-lg mb-1 text-card-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}