import { UserProfile, Scenario, RiskOutput } from '../types';

export function analyzeRisk(profile: Partial<UserProfile> = {}, scenario: Partial<Scenario> = {}): RiskOutput {
  let riskLevel: 'high' | 'medium' | 'low' = "low";
  let reasons: string[] = [];

  const safeType = scenario?.type || "unclear_instruction";
  const safeDep = profile?.dependencyLevel || "medium";
  const safeFin = profile?.financialPressure || "low";

  // BASE RULES
  if (safeType === "overtime") {
    riskLevel = "high";
  } else if (safeType === "salary_delay") {
    riskLevel = "high";
  } else if (safeType === "unclear_instruction") {
    riskLevel = "medium";
  } else {
    riskLevel = "medium"; 
  }

  // DEPENDENCY EFFECT
  if (safeDep === "high") {
    reasons.push("High dependency increases difficulty in challenging the situation");
  } else if (safeDep === "low") {
    if (riskLevel === "high") {
      riskLevel = "medium";
    } else if (riskLevel === "medium") {
      riskLevel = "low";
    }
  }

  if (safeFin === "high") {
    reasons.push("Financial pressure increases impact of this situation");
  }

  if (reasons.length === 0) {
    reasons.push("Standard workplace consideration required");
  }

  return {
    riskLevel,
    reasons
  };
}
