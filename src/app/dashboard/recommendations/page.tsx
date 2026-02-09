// app/dashboard/recommendations/page.tsx
'use client';

import { useEffect, useState } from "react";
import { Heart, Shield, Smartphone, Briefcase, Car, Check, MessageCircle, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { insurancePlans, getRecommendedPlans, calculateRiskLevel } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Shield,
  Smartphone,
  Briefcase,
  Car,
};

const colorMap: Record<string, { bg: string; text: string }> = {
  Heart: { bg: "bg-success/10", text: "text-success" },
  Shield: { bg: "bg-primary/10", text: "text-primary" },
  Smartphone: { bg: "bg-accent/10", text: "text-accent" },
  Briefcase: { bg: "bg-warning/10", text: "text-warning" },
  Car: { bg: "bg-destructive/10", text: "text-destructive" },
};

export default function DashboardRecommendationsPage() {
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("chatAnswers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        const computed = calculateRiskLevel(parsed);
        setRiskLevel(computed);
        setHasData(true);
      } catch (err) {
        console.error("Failed to parse saved answers", err);
      }
    }
  }, []);

  const recommendedPlans = getRecommendedPlans(riskLevel, answers);

  const handleSavePlan = (planType: string) => {
    toast.success(`${planType} saved to your plans!`, {
      description: "An agent will reach out to you shortly.",
    });
  };

  if (!hasData) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground mb-6">
          You haven't completed the chat yet. Finish answering the questions to see your personalized recommendations!
        </p>
        <Link href="/dashboard/chat">
          <Button>Go to Chat</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-20 lg:pb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-display text-foreground mb-2">
            Recommended Insurance Plans
          </h2>
          <p className="text-muted-foreground text-sm">
            Based on your <strong>{riskLevel}</strong> risk profile and lifestyle answers, here are the plans that best fit your needs and budget.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {recommendedPlans.map((plan, index) => {
            const Icon = iconMap[plan.icon] || Shield;
            const colors = colorMap[plan.icon] || { bg: "bg-primary/10", text: "text-primary" };

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-card-foreground">{plan.type}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{plan.whyFits}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-success shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/50 rounded-lg px-4 py-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Estimated Monthly Premium</p>
                  <p className="text-xl font-bold gradient-text">{plan.premiumRange}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1 gap-1.5" onClick={() => handleSavePlan(plan.type)}>
                    <MessageCircle className="w-4 h-4" />
                    Talk to Agent
                  </Button>
                  <Button variant="heroOutline" size="sm" className="flex-1" onClick={() => handleSavePlan(plan.type)}>
                    Save Plan
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {recommendedPlans.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No recommendations yet — finish the chat first!
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-8 text-center">
          💡 Premium ranges are estimated and may vary based on specific provider terms. These are personalized based on your chat answers.
        </p>
      </motion.div>
    </div>
  );
}