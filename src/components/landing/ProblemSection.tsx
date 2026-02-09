// components/landing/ProblemSection.tsx
'use client';

import { HelpCircle, UserX, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: HelpCircle,
    title: "Insurance is Confusing",
    description: "Big grammar, complex terms, and fine print make insurance feel like a puzzle nobody can solve.",
  },
  {
    icon: UserX,
    title: "Agents are Unreliable",
    description: "You call, they don't pick up. You pay, they disappear. Trust is broken across the industry.",
  },
  {
    icon: Users,
    title: "Informal Workers Excluded",
    description: "Millions of Nigerians — traders, drivers, artisans — can't access insurance because the system wasn't built for them.",
  },
  {
    icon: Clock,
    title: "Underwriting is Slow",
    description: "Too much paperwork, too many office visits, and weeks of waiting just to know if you qualify.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4 text-foreground">
            Why Insurance No Dey Work for Most Nigerians
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The insurance industry in Nigeria has real problems. We're here to fix them.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-card-foreground">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}