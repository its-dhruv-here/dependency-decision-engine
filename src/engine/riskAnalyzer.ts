import { UserProfile, Scenario, RiskOutput } from '../types';

export function analyzeRisk(profile: Partial<UserProfile> = {}, scenario: Partial<Scenario> = {}): RiskOutput {
  const type = scenario?.type || 'unclear_instruction';
  const severity = scenario?.severity || 'medium';
  const dep = profile?.dependencyLevel || 'medium';
  const fin = profile?.financialPressure || 'low';

  const reasons: string[] = [];

  // ── Numeric risk score calculation ────────────────────────────────
  const severityScores: Record<string, number> = { low: 25, medium: 50, high: 80 };
  const depWeights: Record<string, number> = { low: 3, medium: 8, high: 18 };
  const finWeights: Record<string, number> = { low: 2, medium: 7, high: 14 };
  // Abuse/harassment types get a type penalty
  const typePenalties: Record<string, number> = { harassment: 15, abuse: 20, salary_delay: 5, overtime: 3, workplace_pressure: 4 };

  let riskScore = (severityScores[severity] || 50)
    + (depWeights[dep] || 8)
    + (finWeights[fin] || 2)
    + (typePenalties[type] || 0);
  riskScore = Math.max(0, Math.min(100, riskScore));

  // ── Severity-driven risk ──────────────────────────────────────────
  if (severity === 'high') {
    reasons.push('LLM assessed this situation as HIGH severity');
  }

  // ── Type-driven risk ──────────────────────────────────────────────
  if (type === 'harassment' || type === 'abuse') {
    reasons.push(`${type} scenarios carry inherent personal and legal risks`);
    return { riskLevel: 'high', riskScore: Math.max(riskScore, 75), reasons, shortTermRisk: 'high', longTermRisk: dep === 'high' ? 'high' : 'medium',
      reasonRisky: `${type === 'abuse' ? 'Abuse' : 'Harassment'} situations pose severe personal, psychological, and legal risks regardless of other factors.`,
      reasonSafe: 'Document everything immediately and seek external support. Your safety is the absolute priority.',
    };
  }

  if (type === 'salary_delay') {
    reasons.push('Delayed compensation creates financial vulnerability');
  }

  if (type === 'overtime') {
    reasons.push('Extended work without compensation may indicate exploitation');
  }

  if (type === 'workplace_pressure') {
    reasons.push('Sustained workplace pressure can escalate into unsafe conditions');
  }

  // ── Dependency-driven risk ────────────────────────────────────────
  if (dep === 'high') {
    reasons.push('High dependency on employer reduces negotiation leverage');
  } else if (dep === 'medium') {
    reasons.push('Moderate dependency introduces some constraints');
  }

  if (fin === 'high') {
    reasons.push('Financial pressure limits safe exit options');
  }

  // ── Compute final risk level from score ────────────────────────────
  let riskLevel: 'high' | 'medium' | 'low';
  if (riskScore >= 65) {
    riskLevel = 'high';
  } else if (riskScore >= 35) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  let shortTermRisk: 'high' | 'medium' | 'low' = 'medium';
  let longTermRisk: 'high' | 'medium' | 'low' = 'medium';

  // Short term risk is primarily driven by current severity and immediate type
  if (severity === 'high' || type === 'abuse' || type === 'harassment') {
    shortTermRisk = 'high';
  } else if (severity === 'low') {
    shortTermRisk = 'low';
  }

  // Long term risk is heavily weighted by dependent constraints and financial lock-in
  if (dep === 'high' || fin === 'high') {
    longTermRisk = 'high';
  } else if (dep === 'low' && fin === 'low') {
    longTermRisk = 'low';
  }
  
  if (reasons.length === 0) {
    reasons.push('Standard risk assessment based on provided context');
  }

  // Cast scenario payload if extended properties exist from LLM Engine
  const extScenario = scenario as Scenario & { reasonRisky?: string; reasonSafe?: string };

  // ── Generate contextual reason strings ─────────────────────────────
  const defaultRisky = riskLevel === 'high'
    ? `This ${type.replace(/_/g, ' ')} situation combined with your ${dep} dependency and ${fin} financial pressure creates significant vulnerability.`
    : riskLevel === 'medium'
    ? `While not immediately dangerous, the mix of ${severity} severity and your current profile means careful action is needed.`
    : `The severity is low and your profile gives you flexibility to handle this safely.`;

  const defaultSafe = riskLevel === 'high'
    ? 'Prioritize documentation and seek external support before taking action. Your safety comes first.'
    : riskLevel === 'medium'
    ? 'A balanced approach—asking politely while documenting—tends to protect your position without escalation.'
    : 'You have the flexibility to set clear boundaries. Document the interaction for your records.';

  return { 
    riskLevel, 
    riskScore,
    reasons,
    shortTermRisk,
    longTermRisk,
    reasonRisky: extScenario.reasonRisky || defaultRisky,
    reasonSafe: extScenario.reasonSafe || defaultSafe,
  };
}
