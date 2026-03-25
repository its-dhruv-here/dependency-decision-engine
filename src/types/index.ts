export interface UserProfile {
  visaType: 'employer' | 'family';
  dependencyLevel: 'high' | 'medium' | 'low';
  financialPressure: 'high' | 'low';
}

export interface Scenario {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  intent: string;
}

export interface RiskOutput {
  riskLevel: 'high' | 'medium' | 'low';
  reasons: string[];
}

export interface Decision {
  risk: 'high' | 'medium' | 'low';
  outcome: string;
  reply: string;
  dependencyImpact: string;
}

export interface Decisions {
  accept: Decision;
  ask: Decision;
  refuse: Decision;
}

export interface SafetyAction {
  label: string;
  priority: 'critical' | 'recommended' | 'optional';
}

export interface AnalysisResult {
  scenario: Scenario;
  riskOutput: RiskOutput;
  decisions: Decisions;
  safety: SafetyAction[];
}
