// components/landing/SolutionSection.tsx
'use client';

import { MessageSquare, Globe, Brain, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: MessageSquare,
    title: "AI Explains Insurance Simply",
    description: "No more jargon. InsureBuddy breaks down complex insurance concepts into everyday language you can actually understand.",
  },
  {
    icon: Globe,
    title: "English & Pidgin Supported",
    description: "We speak your language — literally. Get explanations in proper English or comfortable Nigerian Pidgin.",
  },
  {
    icon: Brain,
    title: "Smart Risk Assessment",
    description: "Answer a few simple questions about your lifestyle, and our AI builds your risk profile in seconds — no paperwork.",
  },
  {
    icon: FileCheck,
    title: "Personalized Recommendations",
    description: "Get insurance plans that actually fit your life, your budget, and your needs. No more one-size-fits-all policies.",
  },
];

export default function SolutionSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            The Solution
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4 text-foreground">
            Meet <span className="gradient-text">InsureBuddy</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your AI insurance assistant that makes understanding and getting insurance as easy as chatting with a friend.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4 bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <solution.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-card-foreground">{solution.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}