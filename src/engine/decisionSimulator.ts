import { UserProfile, Scenario, Decisions, Decision } from '../types';

export function simulateDecisions(profile: Partial<UserProfile> = {}, scenario: Partial<Scenario> = {}): Decisions {
  const safeType = scenario?.type || "unclear_instruction";
  const safeDep = profile?.dependencyLevel || "medium";
  const safeFin = profile?.financialPressure || "low";

  let baseReply = "Could we discuss the current situation to align expectations?";
  
  if (safeType === "overtime") {
    baseReply = "Could we discuss compensation for the additional working hours?";
  } else if (safeType === "unclear_instruction") {
    baseReply = "Could you please clarify the task details and expectations?";
  } else if (safeType === "salary_delay") {
    baseReply = "Could we review the status of the pending salary payment?";
  }

  const accept: Decision = {
    risk: "low",
    outcome: safeFin === "high" 
             ? "Financial pressure makes accepting safer in short term" 
             : "Immediate safety but possible long-term disadvantage",
    reply: baseReply,
    dependencyImpact: "Safe action regardless of dependency"
  };

  const ask: Decision = {
    risk: "medium",
    outcome: "Balanced approach with moderate safety",
    reply: baseReply,
    dependencyImpact: "Neutral impact"
  };

  let refuseRisk: "high" | "medium" | "low" = "medium";
  let refuseOutcome = "Some risk depending on employer response";
  let refuseDependency = "Moderate dependency affects decision flexibility";

  if (safeDep === "high") {
    refuseRisk = "high";
    refuseOutcome = "May risk job stability due to dependency";
    refuseDependency = "High dependency increases risk of refusal";
  } else if (safeDep === "medium") {
    refuseRisk = "medium";
    refuseOutcome = "Some risk depending on employer response";
    refuseDependency = "Moderate dependency affects decision flexibility";
  } else if (safeDep === "low") {
    refuseRisk = "low";
    refuseOutcome = "Lower risk due to greater independence";
    refuseDependency = "Low dependency allows more flexibility";
  }

  const refuse: Decision = {
    risk: refuseRisk, 
    outcome: refuseOutcome,
    reply: baseReply,
    dependencyImpact: refuseDependency
  };

  return { accept, ask, refuse };
}
