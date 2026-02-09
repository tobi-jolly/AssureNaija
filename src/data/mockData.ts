export interface InsurancePlan {
  id: number;
  type: string;
  icon: string;
  description: string;
  whyFits: string;
  premiumRange: string;
  features: string[];
}

export const insurancePlans: InsurancePlan[] = [
  {
    id: 1,
    type: "Health Insurance",
    icon: "Heart",
    description: "Cover your medical bills and hospital visits",
    whyFits: "Based on your profile, health coverage is essential for protecting you and your family against unexpected medical expenses.",
    premiumRange: "₦2,500 - ₦8,000/month",
    features: ["Hospital visits", "Prescription drugs", "Emergency care", "Dental & optical"],
  },
  {
    id: 2,
    type: "Life Insurance",
    icon: "Shield",
    description: "Protect your family's future",
    whyFits: "Life insurance ensures your loved ones are financially secure, even if something unexpected happens.",
    premiumRange: "₦1,500 - ₦5,000/month",
    features: ["Death benefit", "Family protection", "Savings component", "Flexible terms"],
  },
  {
    id: 3,
    type: "Device Insurance",
    icon: "Smartphone",
    description: "Protect your phone and gadgets",
    whyFits: "Your devices are essential for work and communication. Device insurance covers theft, damage, and screen repairs.",
    premiumRange: "₦500 - ₦2,000/month",
    features: ["Screen damage", "Theft protection", "Water damage", "Quick replacement"],
  },
  {
    id: 4,
    type: "Business Insurance",
    icon: "Briefcase",
    description: "Secure your hustle",
    whyFits: "Whether you're running a shop or doing freelance work, business insurance protects your income and assets.",
    premiumRange: "₦3,000 - ₦10,000/month",
    features: ["Stock protection", "Fire & theft", "Liability cover", "Business interruption"],
  },
  {
    id: 5,
    type: "Motor Insurance",
    icon: "Car",
    description: "Third-party and comprehensive vehicle cover",
    whyFits: "If you own or drive a vehicle, motor insurance is legally required and protects against accidents and theft.",
    premiumRange: "₦5,000 - ₦15,000/month",
    features: ["Third party", "Comprehensive", "Accident cover", "Roadside assist"],
  },
];

export interface ChatStep {
  id: string;
  aiMessage: string;
  quickReplies?: string[];
}

export const chatFlow: ChatStep[] = [
  {
    id: "greeting",
    aiMessage: "Hey there! 👋 I'm InsureBuddy, your friendly insurance assistant. I dey here to help you understand insurance well-well and find the right cover for you.\n\nNo wahala, no complex grammar — just simple talk. Ready to start?",
    quickReplies: ["Yes, let's go! 🚀", "Tell me more first"],
  },
  {
    id: "age",
    aiMessage: "Nice one! 🎉 Let me ask you a few quick questions so I can recommend the best insurance for you.\n\nFirst — what's your age range?",
    quickReplies: ["18-25", "26-35", "36-45", "46-55", "55+"],
  },
  {
    id: "location",
    aiMessage: "Got it! Now, where do you stay? This helps me understand your environment and local risks. 🏙️",
    quickReplies: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Other city"],
  },
  {
    id: "job",
    aiMessage: "What kind of work do you do? No judgment — whether na formal or informal, we dey cover everybody! 💪",
    quickReplies: ["Office/Corporate", "Self-employed/Business", "Artisan/Trader", "Rider/Driver", "Student"],
  },
  {
    id: "activities",
    aiMessage: "What does your typical day look like? This helps me understand what risks you might face daily. 🌅",
    quickReplies: ["Mostly indoors", "Travel a lot", "Physical work", "Mixed activities"],
  },
  {
    id: "health",
    aiMessage: "Last question! Do you have any existing health conditions or own valuable assets (car, equipment, etc)? 🏥",
    quickReplies: ["Healthy, no major assets", "Healthy, own vehicle/equipment", "Some health concerns", "Health concerns + assets"],
  },
];

export function calculateRiskLevel(answers: Record<string, string>): "low" | "medium" | "high" {
  let score = 0;

  if (answers.age === "18-25" || answers.age === "55+") score += 2;
  else if (answers.age === "36-45" || answers.age === "46-55") score += 1;

  if (answers.job === "Rider/Driver" || answers.job === "Artisan/Trader") score += 2;
  else if (answers.job === "Self-employed/Business") score += 1;

  if (answers.activities === "Physical work" || answers.activities === "Travel a lot") score += 2;
  else if (answers.activities === "Mixed activities") score += 1;

  if (answers.health?.includes("Health concerns")) score += 2;
  else if (answers.health?.includes("vehicle")) score += 1;

  if (score <= 2) return "low";
  if (score <= 5) return "medium";
  return "high";
}

export function getRiskExplanation(risk: "low" | "medium" | "high", answers: Record<string, string>): string {
  const explanations = {
    low: `Based on your answers, your insurance risk is low. Your ${answers.job || "work"} and ${answers.activities || "daily routine"} suggest minimal exposure to common risks. Basic coverage should serve you well!`,
    medium: `Based on your answers, your insurance risk is medium. Factors like your ${answers.job || "work type"} and ${answers.activities || "daily activities"} mean you should consider more comprehensive coverage. The good news? There are affordable plans that fit!`,
    high: `Based on your answers, your insurance risk is high. Don't worry — this just means insurance is even more important for you! With your ${answers.job || "work type"} and ${answers.activities || "lifestyle"}, having proper coverage can save you from major financial stress.`,
  };
  return explanations[risk];
}

export function getRecommendedPlans(risk: "low" | "medium" | "high", answers: Record<string, string>): InsurancePlan[] {
  const plans = [...insurancePlans];

  if (risk === "low") return plans.slice(0, 3);
  if (risk === "medium") return plans.slice(0, 4);
  return plans;
}
