// src/data/mockData.ts
// This file is kept for backwards compatibility but is no longer used
// All logic has been moved to individual page components

export interface InsurancePlan {
  id: number;
  type: string;
  icon: string;
  description: string;
  whyFits: string;
  premiumRange: string;
  features: string[];
}

// Legacy data - not used in new implementation
export const insurancePlans: InsurancePlan[] = [];

export interface ChatStep {
  id: string;
  aiMessage: string;
  quickReplies?: string[];
}

// Legacy data - replaced by chatQuestions in userProfile.ts
export const chatFlow: ChatStep[] = [];

// Legacy function - kept for compatibility
export function calculateRiskLevel(answers: Record<string, string>): "low" | "medium" | "high" {
  // This function is no longer used
  // Risk calculation is now done in the chat page using the full UserProfile
  return "medium";
}

// Legacy function - kept for compatibility
export function getRiskExplanation(risk: "low" | "medium" | "high", answers: Record<string, string>): string {
  return "";
}

// Legacy function - kept for compatibility
export function getRecommendedPlans(risk: "low" | "medium" | "high", answers: Record<string, string>): InsurancePlan[] {
  return [];
}