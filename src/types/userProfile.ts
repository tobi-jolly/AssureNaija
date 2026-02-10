// src/types/userProfile.ts
export interface UserProfile {
  // Demographics
  ageRange: string; // "18-25" | "26-35" | "36-45" | "46-55" | "55+"
  location: string; // "Lagos" | "Abuja" | "Port Harcourt" | etc.
  
  // Employment & Income
  employment: string; // "Office/Corporate" | "Self-employed" | "Artisan/Trader" | "Rider/Driver" | "Student"
  incomeRange: string; // "Under ₦50k" | "₦50k-₦150k" | "₦150k-₦300k" | "₦300k-₦500k" | "Above ₦500k"
  
  // Family & Lifestyle
  dependents: string; // "None" | "1-2" | "3-4" | "5+"
  dailyActivities: string; // "Mostly indoors" | "Travel a lot" | "Physical work" | "Mixed activities"
  
  // Health & Assets
  healthStatus: string; // "Healthy, no issues" | "Minor conditions" | "Chronic conditions" | "Prefer not to say"
  ownsCar: boolean;
  ownsProperty: boolean;
  
  // Insurance Goals
  insuranceGoal: string; // "Health coverage" | "Life insurance" | "Asset protection" | "Business cover" | "All-round protection"
  riskTolerance: string; // "Conservative (low risk)" | "Moderate" | "Aggressive (willing to take risks)"
  
  // Budget
  monthlyBudget: string; // "Under ₦2k" | "₦2k-₦5k" | "₦5k-₦10k" | "₦10k-₦20k" | "Above ₦20k"
  
  // Metadata
  completedAt?: string; // ISO date string when the profile was completed
  riskScore?: number;
  riskLevel?: "low" | "medium" | "high";
}

export interface ChatQuestion {
  id: keyof UserProfile;
  question: string;
  questionPidgin: string;
  options: string[];
  category: "demographics" | "employment" | "lifestyle" | "health" | "goals" | "budget";
}

// Structured question flow
export const chatQuestions: ChatQuestion[] = [
  {
    id: "ageRange",
    category: "demographics",
    question: "Let's start with the basics. What's your age range?",
    questionPidgin: "Make we start from the beginning. Wetin be your age range?",
    options: ["18-25", "26-35", "36-45", "46-55", "55+"]
  },
  {
    id: "location",
    category: "demographics",
    question: "Where do you currently live?",
    questionPidgin: "Whereabout you dey stay?",
    options: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Other city"]
  },
  {
    id: "employment",
    category: "employment",
    question: "What type of work do you do?",
    questionPidgin: "Wetin kind work you dey do?",
    options: ["Office/Corporate", "Self-employed/Business", "Artisan/Trader", "Rider/Driver", "Student", "Unemployed"]
  },
  {
    id: "incomeRange",
    category: "employment",
    question: "What's your approximate monthly income?",
    questionPidgin: "How much you dey make monthly (rough estimate)?",
    options: ["Under ₦50k", "₦50k-₦150k", "₦150k-₦300k", "₦300k-₦500k", "Above ₦500k"]
  },
  {
    id: "dependents",
    category: "lifestyle",
    question: "How many people depend on you financially (family members)?",
    questionPidgin: "How many people dey depend on you for money?",
    options: ["None", "1-2 people", "3-4 people", "5 or more"]
  },
  {
    id: "dailyActivities",
    category: "lifestyle",
    question: "What does your typical day look like?",
    questionPidgin: "How your everyday life dey be?",
    options: ["Mostly indoors", "Travel a lot", "Physical work", "Mixed activities"]
  },
  {
    id: "healthStatus",
    category: "health",
    question: "How would you describe your current health status?",
    questionPidgin: "How your body dey for you?",
    options: ["Healthy, no issues", "Minor conditions (e.g., glasses, allergies)", "Chronic conditions (e.g., diabetes, hypertension)", "Prefer not to say"]
  },
  {
    id: "ownsCar",
    category: "health",
    question: "Do you own a car or motorcycle?",
    questionPidgin: "You get motor or okada?",
    options: ["Yes", "No"]
  },
  {
    id: "ownsProperty",
    category: "health",
    question: "Do you own a house, shop, or valuable equipment?",
    questionPidgin: "You get house, shop, or expensive things?",
    options: ["Yes", "No"]
  },
  {
    id: "insuranceGoal",
    category: "goals",
    question: "What's your main reason for looking at insurance?",
    questionPidgin: "Wetin make you wan get insurance?",
    options: ["Health coverage", "Life insurance for family", "Protect my assets (car, property)", "Business protection", "I want everything covered"]
  },
  {
    id: "riskTolerance",
    category: "goals",
    question: "How do you feel about financial risk?",
    questionPidgin: "How you see risk when e come to money?",
    options: ["I avoid risk (conservative)", "Balanced approach", "I can take risks if needed"]
  },
  {
    id: "monthlyBudget",
    category: "budget",
    question: "What's the maximum you can spend on insurance monthly?",
    questionPidgin: "Wetin be the highest money you fit pay for insurance every month?",
    options: ["Under ₦2,000", "₦2,000 - ₦5,000", "₦5,000 - ₦10,000", "₦10,000 - ₦20,000", "Above ₦20,000"]
  }
];