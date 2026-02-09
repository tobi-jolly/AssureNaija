// app/dashboard/risk/page.tsx
'use client';

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Info, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { calculateRiskLevel, getRiskExplanation } from "@/data/mockData"; // your mockData file

export default function DashboardRiskPage() {
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

  if (!hasData) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-muted-foreground mb-6">
          You haven't completed the chat yet. Finish answering the questions in the chat to see your risk profile!
        </p>
        <Link href="/dashboard/chat">
          <Button>Go to Chat</Button>
        </Link>
      </div>
    );
  }

  const riskConfig = {
    low: {
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
      icon: CheckCircle,
      label: "Low Risk",
      description: getRiskExplanation("low", answers),
      factors: [
        "Younger age group with lower risk exposure",
        "Indoor/low-risk daily activities",
        "No significant health concerns",
        "Stable work environment",
      ],
    },
    medium: {
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: AlertTriangle,
      label: "Medium Risk",
      description: getRiskExplanation("medium", answers),
      factors: [
        "Active work that involves some physical risks",
        "Regular commuting or travel",
        "Growing financial responsibilities",
        "Some valuable assets to protect",
      ],
    },
    high: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: AlertTriangle,
      label: "High Risk",
      description: getRiskExplanation("high", answers),
      factors: [
        "High-exposure work environment",
        "Frequent travel or physical activities",
        "Pre-existing health considerations",
        "Multiple assets requiring protection",
      ],
    },
  };

  const config = riskConfig[riskLevel];
  const RiskIcon = config.icon;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto pb-20 lg:pb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Risk Badge */}
        <div className={`${config.bg} ${config.border} border rounded-2xl p-8 text-center mb-6`}>
          <div className={`w-20 h-20 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-4`}>
            <RiskIcon className={`w-10 h-10 ${config.color}`} />
          </div>
          <h2 className={`text-3xl font-bold font-display ${config.color} mb-2`}>{config.label}</h2>
          <p className="text-muted-foreground text-sm">Your Insurance Risk Level</p>
        </div>

        {/* Explanation */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <h3 className="font-bold text-card-foreground">What This Means</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{config.description}</p>
        </div>

        {/* Risk Factors */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 border border-border">
          <h3 className="font-bold text-card-foreground mb-4">Key Risk Factors</h3>
          <ul className="space-y-3">
            {config.factors.map((factor, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${config.bg} shrink-0 mt-1.5 border ${config.border}`} />
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/recommendations">
            <Button variant="hero" className="gap-2">
              <Shield className="w-4 h-4" />
              View Recommendations
            </Button>
          </Link>
          <Link href="/dashboard/chat">
            <Button variant="heroOutline" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat Again
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          💡 This risk assessment is based on your answers from the chat. Results are for guidance only.
        </p>
      </motion.div>
    </div>
  );
}