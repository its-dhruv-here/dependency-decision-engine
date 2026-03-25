import { UserProfile, Scenario, RiskOutput } from '../types';

export function analyzeRisk(profile: Partial<UserProfile> = {}, scenario: Partial<Scenario> = {}): RiskOutput {
  const type = scenario?.type || 'unclear_instruction';
  const severity = scenario?.severity || 'medium';
  const dep = profile?.dependencyLevel || 'medium';
  const fin = profile?.financialPressure || 'low';

  const reasons: string[] = [];

  // ── Severity-driven risk ──────────────────────────────────────────
  if (severity === 'high') {
    reasons.push('LLM assessed this situation as HIGH severity');
  }

  // ── Type-driven risk ──────────────────────────────────────────────
  if (type === 'harassment' || type === 'abuse') {
    reasons.push(`${type} scenarios carry inherent personal and legal risks`);
    return { riskLevel: 'high', reasons };
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

  // ── Compute final risk level ──────────────────────────────────────
  let riskLevel: 'high' | 'medium' | 'low' = 'medium';

  if (severity === 'high' || dep === 'high') {
    riskLevel = 'high';
  } else if (severity === 'low' && dep === 'low' && fin === 'low') {
    riskLevel = 'low';
  }

  if (reasons.length === 0) {
    reasons.push('Standard risk assessment based on provided context');
  }

  return { riskLevel, reasons };
}
