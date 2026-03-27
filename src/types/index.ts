export interface UserProfile {
  visaType: 'employer' | 'family';
  dependencyLevel: 'high' | 'medium' | 'low';
  financialPressure: 'high' | 'medium' | 'low';
}

export interface Scenario {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  intent: string;
  sourceType?: 'text' | 'pdf' | 'image';
  tags?: string[];
  confidence?: number;
  originalLanguage?: string;
}

export interface RiskOutput {
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  reasons: string[];
  shortTermRisk?: 'high' | 'medium' | 'low';
  longTermRisk?: 'high' | 'medium' | 'low';
  reasonRisky?: string;
  reasonSafe?: string;
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
