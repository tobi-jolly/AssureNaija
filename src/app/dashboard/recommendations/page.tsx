// app/dashboard/recommendations/page.tsx
'use client';

import { useEffect, useState } from "react";
import { Heart, Shield, Smartphone, Briefcase, Car, Check, MessageCircle, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UserProfile } from "@/types/userProfile";
import Link from "next/link";

interface InsurancePlan {
  id: string;
  type: string;
  icon: string;
  description: string;
  whyFitsYou: string; // Dynamically generated
  premiumRange: string;
  features: string[];
  priority: number; // 1-5, higher = more relevant
  matchScore: number; // 0-100
}

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendedPlans, setRecommendedPlans] = useState<InsurancePlan[]>([]);
  const [savedPlans, setSavedPlans] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user profile
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        if (parsed.completedAt) {
          setUserProfile(parsed);
          
          // Generate personalized recommendations
          const plans = generateRecommendations(parsed);
          setRecommendedPlans(plans);
        }
      } catch (err) {
        console.error("Failed to parse user profile", err);
      }
    }

    // Load saved plans
    const savedPlansData = localStorage.getItem("savedPlans");
    if (savedPlansData) {
      try {
        setSavedPlans(JSON.parse(savedPlansData));
      } catch (err) {
        console.error("Failed to parse saved plans", err);
      }
    }

    setLoading(false);
  }, []);

  const handleSavePlan = (planId: string, planType: string) => {
    const newSavedPlans = savedPlans.includes(planId)
      ? savedPlans.filter(id => id !== planId)
      : [...savedPlans, planId];
    
    setSavedPlans(newSavedPlans);
    localStorage.setItem("savedPlans", JSON.stringify(newSavedPlans));
    
    if (newSavedPlans.includes(planId)) {
      toast.success(`${planType} saved to your plans!`, {
        description: "You can review all saved plans below.",
      });
    } else {
      toast.info(`${planType} removed from saved plans.`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground">Loading your recommendations...</p>
      </div>
    );
  }

  if (!userProfile || !userProfile.completedAt) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="bg-card rounded-xl p-8 shadow-card border border-border">
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Recommendations Yet</h2>
          <p className="text-muted-foreground mb-6">
            Complete the chat assessment to get personalized insurance recommendations based on your profile and needs!
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

  const riskLevel = userProfile.riskLevel || "medium";

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-20 lg:pb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Personalized for You
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-2">
            Your Recommended Insurance Plans
          </h2>
          <p className="text-muted-foreground text-sm">
            Based on your <strong className="text-foreground">{riskLevel} risk</strong> profile, 
            <strong className="text-foreground"> {userProfile.employment}</strong> work, and 
            <strong className="text-foreground"> {userProfile.monthlyBudget}</strong> budget.
          </p>
        </div>

        {/* Recommended Plans */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {recommendedPlans.map((plan, index) => {
            const Icon = iconMap[plan.icon] || Shield;
            const colors = colorMap[plan.icon] || { bg: "bg-primary/10", text: "text-primary" };
            const isSaved = savedPlans.includes(plan.id);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-all duration-300 relative"
              >
                {/* Match score badge */}
                {plan.matchScore >= 80 && (
                  <div className="absolute top-4 right-4 bg-success/20 text-success text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {plan.matchScore}% Match
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-card-foreground">{plan.type}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Why it fits */}
                <div className="bg-primary/5 rounded-lg p-3 mb-4 border border-primary/10">
                  <p className="text-xs font-medium text-primary mb-1">Why this fits you:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.whyFitsYou}</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-success shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Premium */}
                <div className="bg-secondary/50 rounded-lg px-4 py-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Estimated Monthly Premium</p>
                  <p className="text-xl font-bold gradient-text">{plan.premiumRange}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant={isSaved ? "heroOutline" : "hero"} 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleSavePlan(plan.id, plan.type)}
                  >
                    {isSaved ? "Saved ✓" : "Save Plan"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Saved Plans Section */}
        {savedPlans.length > 0 && (
          <div className="bg-card rounded-xl p-6 shadow-card border border-border mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Your Saved Plans ({savedPlans.length})
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've saved {savedPlans.length} plan{savedPlans.length > 1 ? 's' : ''}. Ready to talk to an agent?
            </p>
            <AgentContactForm savedPlans={savedPlans.map(id => recommendedPlans.find(p => p.id === id)?.type).filter(Boolean) as string[]} />
          </div>
        )}

        {/* No recommendations */}
        {recommendedPlans.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Unable to generate recommendations. Please complete the chat assessment.</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-8 text-center">
          💡 Premium ranges are estimated and may vary by provider. These recommendations are personalized based on your chat answers.
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// AGENT CONTACT FORM COMPONENT
// ============================================

function AgentContactForm({ savedPlans }: { savedPlans: string[] }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    // Save contact request
    const contactRequest = {
      ...formData,
      plans: savedPlans,
      requestedAt: new Date().toISOString(),
    };

    const existingRequests = JSON.parse(localStorage.getItem("agentRequests") || "[]");
    existingRequests.push(contactRequest);
    localStorage.setItem("agentRequests", JSON.stringify(existingRequests));

    setSubmitted(true);
    toast.success("Request submitted!", {
      description: "An insurance agent will contact you within 24 hours.",
    });
  };

  if (submitted) {
    return (
      <div className="bg-success/10 border border-success/30 rounded-lg p-6 text-center">
        <Check className="w-12 h-12 text-success mx-auto mb-3" />
        <h4 className="font-bold text-success mb-2">Request Submitted!</h4>
        <p className="text-sm text-muted-foreground">
          An insurance agent will contact you within 24 hours to discuss your selected plans: <strong>{savedPlans.join(", ")}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-primary/5 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-medium text-primary mb-1">Selected plans:</p>
        <p>{savedPlans.join(", ")}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone Number *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          placeholder="08012345678"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          placeholder="johndoe@email.com"
          required
        />
      </div>

      <Button type="submit" variant="hero" className="w-full gap-2">
        <MessageCircle className="w-4 h-4" />
        Request Agent Callback
      </Button>
    </form>
  );
}

// ============================================
// RECOMMENDATION ENGINE LOGIC
// ============================================

function generateRecommendations(profile: UserProfile): InsurancePlan[] {
  const allPlans: InsurancePlan[] = [];

  // 1. HEALTH INSURANCE
  const healthPlan = generateHealthPlan(profile);
  if (healthPlan) allPlans.push(healthPlan);

  // 2. LIFE INSURANCE
  const lifePlan = generateLifePlan(profile);
  if (lifePlan) allPlans.push(lifePlan);

  // 3. MOTOR INSURANCE
  if (profile.ownsCar) {
    const motorPlan = generateMotorPlan(profile);
    if (motorPlan) allPlans.push(motorPlan);
  }

  // 4. DEVICE INSURANCE
  const devicePlan = generateDevicePlan(profile);
  if (devicePlan) allPlans.push(devicePlan);

  // 5. BUSINESS INSURANCE
  if (profile.employment === "Self-employed/Business" || profile.employment === "Artisan/Trader") {
    const businessPlan = generateBusinessPlan(profile);
    if (businessPlan) allPlans.push(businessPlan);
  }

  // Sort by priority (higher first)
  allPlans.sort((a, b) => b.priority - a.priority);

  // Return top 4-5 plans
  return allPlans.slice(0, 5);
}

function generateHealthPlan(profile: UserProfile): InsurancePlan {
  let matchScore = 70; // Base score
  let priority = 4;

  // Increase priority based on health status
  if (profile.healthStatus?.includes("Chronic conditions")) {
    matchScore += 30;
    priority = 5;
  } else if (profile.healthStatus?.includes("Minor conditions")) {
    matchScore += 15;
  }

  // Increase priority based on dependents
  if (profile.dependents === "3-4 people" || profile.dependents === "5 or more") {
    matchScore += 10;
    priority += 1;
  }

  // Premium calculation
  let premiumMin = 2500;
  let premiumMax = 8000;

  if (profile.incomeRange === "Under ₦50k" || profile.incomeRange === "₦50k-₦150k") {
    premiumMin = 1500;
    premiumMax = 4000;
  } else if (profile.incomeRange === "Above ₦500k") {
    premiumMin = 5000;
    premiumMax = 15000;
  }

  // Generate personalized "why it fits"
  let whyFits = "";
  if (profile.healthStatus?.includes("Chronic conditions")) {
    whyFits = `Your health condition requires ongoing medical care. This plan covers hospital visits, medication, and specialist consultations.`;
  } else if (profile.dependents !== "None") {
    whyFits = `With ${profile.dependents} depending on you, health coverage protects your family from unexpected medical expenses.`;
  } else {
    whyFits = `Health emergencies can happen anytime. This plan ensures you get quality care without financial stress.`;
  }

  return {
    id: "health",
    type: "Health Insurance",
    icon: "Heart",
    description: "Medical bills, hospital visits, and prescriptions covered",
    whyFitsYou: whyFits,
    premiumRange: `₦${premiumMin.toLocaleString()} - ₦${premiumMax.toLocaleString()}/month`,
    features: ["Hospital visits", "Prescription drugs", "Emergency care", "Dental & optical"],
    priority: Math.min(priority, 5),
    matchScore: Math.min(matchScore, 100),
  };
}

function generateLifePlan(profile: UserProfile): InsurancePlan {
  let matchScore = 60;
  let priority = 3;

  // Higher priority for people with dependents
  if (profile.dependents === "5 or more") {
    matchScore += 40;
    priority = 5;
  } else if (profile.dependents === "3-4 people") {
    matchScore += 30;
    priority = 4;
  } else if (profile.dependents === "1-2 people") {
    matchScore += 20;
    priority = 3;
  }

  // Higher priority for high-risk jobs
  if (profile.employment === "Rider/Driver") {
    matchScore += 20;
    priority += 1;
  }

  let premiumMin = 1500;
  let premiumMax = 5000;

  if (profile.incomeRange === "Above ₦500k") {
    premiumMin = 5000;
    premiumMax = 20000;
  }

  let whyFits = "";
  if (profile.dependents === "5 or more" || profile.dependents === "3-4 people") {
    whyFits = `With ${profile.dependents} depending on you, life insurance ensures they're financially secure if anything happens to you.`;
  } else if (profile.employment === "Rider/Driver") {
    whyFits = `Your ${profile.employment} work carries daily risks. Life insurance protects your loved ones financially.`;
  } else {
    whyFits = `Life insurance gives you peace of mind knowing your family will be taken care of financially.`;
  }

  return {
    id: "life",
    type: "Life Insurance",
    icon: "Shield",
    description: "Financial security for your family",
    whyFitsYou: whyFits,
    premiumRange: `₦${premiumMin.toLocaleString()} - ₦${premiumMax.toLocaleString()}/month`,
    features: ["Death benefit", "Family protection", "Savings component", "Flexible terms"],
    priority: Math.min(priority, 5),
    matchScore: Math.min(matchScore, 100),
  };
}

function generateMotorPlan(profile: UserProfile): InsurancePlan {
  let matchScore = 90; // High since they own a car
  let priority = 4;

  let premiumMin = 5000;
  let premiumMax = 15000;

  if (profile.employment === "Rider/Driver") {
    premiumMin = 8000;
    premiumMax = 25000;
    priority = 5;
  }

  const whyFits = profile.employment === "Rider/Driver"
    ? `As a ${profile.employment}, your vehicle is your livelihood. Comprehensive motor insurance protects against accidents, theft, and third-party liability.`
    : `You own a vehicle, so motor insurance is legally required and protects you against accidents, theft, and third-party claims.`;

  return {
    id: "motor",
    type: "Motor Insurance",
    icon: "Car",
    description: "Third-party and comprehensive vehicle cover",
    whyFitsYou: whyFits,
    premiumRange: `₦${premiumMin.toLocaleString()} - ₦${premiumMax.toLocaleString()}/month`,
    features: ["Third party liability", "Comprehensive cover", "Accident protection", "Roadside assistance"],
    priority,
    matchScore,
  };
}

function generateDevicePlan(profile: UserProfile): InsurancePlan {
  let matchScore = 50;
  let priority = 2;

  // Everyone needs device insurance in 2025
  if (profile.ageRange === "18-25" || profile.ageRange === "26-35") {
    matchScore += 20;
    priority = 3;
  }

  const whyFits = `Your phone and devices are essential for work and communication. This plan covers theft, damage, and screen repairs.`;

  return {
    id: "device",
    type: "Device Insurance",
    icon: "Smartphone",
    description: "Protect your phone, laptop, and gadgets",
    whyFitsYou: whyFits,
    premiumRange: "₦500 - ₦2,000/month",
    features: ["Screen damage", "Theft protection", "Water damage", "Quick replacement"],
    priority,
    matchScore,
  };
}

function generateBusinessPlan(profile: UserProfile): InsurancePlan {
  let matchScore = 85;
  let priority = 4;

  const whyFits = `As a ${profile.employment}, your business is your income source. This plan protects your stock, equipment, and workspace against fire, theft, and liability.`;

  return {
    id: "business",
    type: "Business Insurance",
    icon: "Briefcase",
    description: "Protect your business and income",
    whyFitsYou: whyFits,
    premiumRange: "₦3,000 - ₦10,000/month",
    features: ["Stock protection", "Fire & theft", "Liability cover", "Business interruption"],
    priority,
    matchScore,
  };
}