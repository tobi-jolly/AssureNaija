// app/dashboard/risk/page.tsx
'use client';

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Info, MessageCircle, Shield, TrendingUp, Users, Briefcase, Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/userProfile";

export default function DashboardRiskPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        if (parsed.completedAt && parsed.riskScore !== undefined) {
          setUserProfile(parsed);
        }
      } catch (err) {
        console.error("Failed to parse user profile", err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-muted-foreground">Loading your risk profile...</p>
      </div>
    );
  }

  if (!userProfile || !userProfile.riskScore) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <div className="bg-card rounded-xl p-8 shadow-card border border-border">
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Risk Profile Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't completed the chat assessment yet. Answer the questions in the chat to see your personalized risk profile!
          </p>
          <Link href="/dashboard/chat">
            <Button variant="hero" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Go to Chat
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const riskScore = userProfile.riskScore;
  const riskLevel = userProfile.riskLevel || "medium";

  const riskConfig = {
    low: {
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
      icon: CheckCircle,
      label: "Low Risk",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    medium: {
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: AlertTriangle,
      label: "Medium Risk",
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    high: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: AlertTriangle,
      label: "High Risk",
      gradient: "from-red-500/20 to-rose-500/20",
    },
  };

  const config = riskConfig[riskLevel];
  const RiskIcon = config.icon;

  // Generate personalized risk factors based on actual user data
  const riskFactors = generateRiskFactors(userProfile);
  const explanation = generateExplanation(userProfile);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto pb-20 lg:pb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Risk Score Card */}
        <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-8 text-center mb-6 border ${config.border} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/5" />
          
          <div className={`w-24 h-24 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-4 relative z-10 border-4 ${config.border}`}>
            <RiskIcon className={`w-12 h-12 ${config.color}`} />
          </div>
          
          <h2 className={`text-4xl font-bold font-display ${config.color} mb-2 relative z-10`}>{config.label}</h2>
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground mb-3">Your Insurance Risk Score</p>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-5xl font-bold ${config.color}`}>{riskScore}</span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>
          </div>
        </div>

        {/* Risk Score Breakdown */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 border border-border">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Score Breakdown
          </h3>
          
          <div className="space-y-3">
            <ScoreBar label="Age & Life Stage" value={getAgeScore(userProfile)} max={15} />
            <ScoreBar label="Employment Risk" value={getEmploymentScore(userProfile)} max={20} />
            <ScoreBar label="Income Stability" value={getIncomeScore(userProfile)} max={15} />
            <ScoreBar label="Family Dependents" value={getDependentsScore(userProfile)} max={15} />
            <ScoreBar label="Daily Activities" value={getActivitiesScore(userProfile)} max={15} />
            <ScoreBar label="Health Status" value={getHealthScore(userProfile)} max={10} />
            <ScoreBar label="Assets to Protect" value={getAssetsScore(userProfile)} max={10} />
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <h3 className="font-bold text-card-foreground">What This Means for You</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
        </div>

        {/* Key Risk Factors */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 border border-border">
          <h3 className="font-bold text-card-foreground mb-4">Key Risk Factors</h3>
          <ul className="space-y-3">
            {riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${config.bg} shrink-0 mt-1.5 border ${config.border}`} />
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {/* User Profile Summary */}
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 border border-border">
          <h3 className="font-bold text-card-foreground mb-4">Your Profile</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <ProfileItem icon={Users} label="Age" value={userProfile.ageRange} />
            <ProfileItem icon={Briefcase} label="Employment" value={userProfile.employment} />
            <ProfileItem icon={Home} label="Location" value={userProfile.location} />
            <ProfileItem icon={Users} label="Dependents" value={userProfile.dependents} />
            <ProfileItem icon={Heart} label="Health" value={userProfile.healthStatus?.split("(")[0].trim()} />
            <ProfileItem icon={Shield} label="Goal" value={userProfile.insuranceGoal} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/recommendations">
            <Button variant="hero" className="gap-2">
              <Shield className="w-4 h-4" />
              View Personalized Plans
            </Button>
          </Link>
          <Link href="/dashboard/chat">
            <Button variant="heroOutline" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Update Answers
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          💡 This risk assessment is based on your answers and is for guidance only. Actual insurance terms may vary by provider.
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS & FUNCTIONS
// ============================================

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = (value / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}/{max}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
      <Icon className="w-5 h-5 text-primary shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value || "N/A"}</p>
      </div>
    </div>
  );
}

// ============================================
// SCORING LOGIC (Matches chat calculation)
// ============================================

function getAgeScore(profile: UserProfile): number {
  if (profile.ageRange === "18-25") return 5;
  if (profile.ageRange === "26-35") return 8;
  if (profile.ageRange === "36-45") return 10;
  if (profile.ageRange === "46-55") return 12;
  if (profile.ageRange === "55+") return 15;
  return 0;
}

function getEmploymentScore(profile: UserProfile): number {
  if (profile.employment === "Rider/Driver") return 20;
  if (profile.employment === "Artisan/Trader") return 15;
  if (profile.employment === "Self-employed/Business") return 12;
  if (profile.employment === "Office/Corporate") return 8;
  if (profile.employment === "Student") return 5;
  return 0;
}

function getIncomeScore(profile: UserProfile): number {
  if (profile.incomeRange === "Under ₦50k") return 15;
  if (profile.incomeRange === "₦50k-₦150k") return 12;
  if (profile.incomeRange === "₦150k-₦300k") return 8;
  if (profile.incomeRange === "₦300k-₦500k") return 5;
  if (profile.incomeRange === "Above ₦500k") return 3;
  return 0;
}

function getDependentsScore(profile: UserProfile): number {
  if (profile.dependents === "5 or more") return 15;
  if (profile.dependents === "3-4 people") return 12;
  if (profile.dependents === "1-2 people") return 8;
  if (profile.dependents === "None") return 3;
  return 0;
}

function getActivitiesScore(profile: UserProfile): number {
  if (profile.dailyActivities === "Physical work") return 15;
  if (profile.dailyActivities === "Travel a lot") return 12;
  if (profile.dailyActivities === "Mixed activities") return 8;
  if (profile.dailyActivities === "Mostly indoors") return 5;
  return 0;
}

function getHealthScore(profile: UserProfile): number {
  if (profile.healthStatus?.includes("Chronic conditions")) return 10;
  if (profile.healthStatus?.includes("Minor conditions")) return 6;
  if (profile.healthStatus?.includes("Healthy")) return 2;
  return 0;
}

function getAssetsScore(profile: UserProfile): number {
  let score = 0;
  if (profile.ownsCar) score += 5;
  if (profile.ownsProperty) score += 5;
  return score;
}

function generateRiskFactors(profile: UserProfile): string[] {
  const factors: string[] = [];

  // Employment
  if (profile.employment === "Rider/Driver") {
    factors.push("High-risk occupation with daily road exposure and accident potential");
  } else if (profile.employment === "Artisan/Trader") {
    factors.push("Physical work with potential injury risks and income volatility");
  } else if (profile.employment === "Self-employed/Business") {
    factors.push("Business income can be unpredictable, requiring financial protection");
  }

  // Dependents
  if (profile.dependents !== "None") {
    factors.push(`Financial responsibility for ${profile.dependents} — family protection is critical`);
  }

  // Activities
  if (profile.dailyActivities === "Travel a lot") {
    factors.push("Frequent travel increases exposure to accidents and health risks");
  } else if (profile.dailyActivities === "Physical work") {
    factors.push("Physical labor increases likelihood of workplace injuries");
  }

  // Health
  if (profile.healthStatus?.includes("Chronic conditions")) {
    factors.push("Pre-existing health conditions require comprehensive medical coverage");
  }

  // Assets
  if (profile.ownsCar || profile.ownsProperty) {
    factors.push("Valuable assets (vehicle/property) need protection against loss or damage");
  }

  // Income
  if (profile.incomeRange === "Under ₦50k" || profile.incomeRange === "₦50k-₦150k") {
    factors.push("Limited income means less financial buffer for emergencies");
  }

  // If no specific factors, add general ones
  if (factors.length === 0) {
    factors.push("Standard risk factors apply based on age and lifestyle");
    factors.push("Insurance provides financial security against unexpected events");
  }

  return factors;
}

function generateExplanation(profile: UserProfile): string {
  const riskLevel = profile.riskLevel || "medium";
  const score = profile.riskScore || 0;

  let explanation = "";

  if (riskLevel === "low") {
    explanation = `Your risk score of ${score}/100 indicates a LOW risk profile. This is good news!\n\n`;
    explanation += `Based on your answers:\n`;
    explanation += `• Your ${profile.employment} work has relatively low physical risk\n`;
    explanation += `• Your ${profile.dailyActivities?.toLowerCase()} lifestyle is generally safe\n`;
    
    if (profile.dependents === "None" || profile.dependents === "1-2 people") {
      explanation += `• You have manageable financial responsibilities\n`;
    }
    
    explanation += `\nWhat this means: Basic insurance coverage should be sufficient for your needs. You don't need expensive comprehensive plans, but having health and basic life coverage is still wise to protect against unexpected events.`;
    
  } else if (riskLevel === "medium") {
    explanation = `Your risk score of ${score}/100 indicates a MEDIUM risk profile.\n\n`;
    explanation += `Key factors affecting your score:\n`;
    
    if (profile.employment === "Self-employed/Business" || profile.employment === "Artisan/Trader") {
      explanation += `• Your ${profile.employment} work involves some risk and income variability\n`;
    }
    
    if (profile.dependents === "3-4 people" || profile.dependents === "5 or more") {
      explanation += `• You support ${profile.dependents}, making financial protection important\n`;
    }
    
    if (profile.ownsCar || profile.ownsProperty) {
      explanation += `• You have assets that need protection\n`;
    }
    
    explanation += `\nWhat this means: You should consider comprehensive insurance coverage that includes health, life, and asset protection. Your circumstances make insurance a smart investment to avoid financial stress from unexpected events.`;
    
  } else {
    explanation = `Your risk score of ${score}/100 indicates a HIGH risk profile. This doesn't mean anything is wrong — it just means insurance is especially important for you!\n\n`;
    explanation += `Factors contributing to higher risk:\n`;
    
    if (profile.employment === "Rider/Driver") {
      explanation += `• Your ${profile.employment} work involves significant daily road risks\n`;
    }
    
    if (profile.dependents === "5 or more" || profile.dependents === "3-4 people") {
      explanation += `• You support ${profile.dependents}, making financial protection critical\n`;
    }
    
    if (profile.healthStatus?.includes("Chronic conditions")) {
      explanation += `• Your health situation requires ongoing medical coverage\n`;
    }
    
    if (profile.dailyActivities === "Physical work" || profile.dailyActivities === "Travel a lot") {
      explanation += `• Your ${profile.dailyActivities?.toLowerCase()} lifestyle increases risk exposure\n`;
    }
    
    explanation += `\nWhat this means: Comprehensive insurance coverage is strongly recommended. The right insurance can save you from major financial hardship. Focus on health, life, and income protection plans that fit your budget.`;
  }

  return explanation;
}