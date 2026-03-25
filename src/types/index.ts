export interface UserProfile {
  visaType: 'employer' | 'family';
  dependencyLevel: 'high' | 'medium' | 'low';
  financialPressure: 'high' | 'low';
}

export interface Scenario {
  type: string;
  description: string;
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

export interface AppState {
  profile: UserProfile;
  scenarioInput: string;
  resultState: {
    scenario: Scenario | null;
    riskOutput: RiskOutput | null;
    decisions: Decisions | null;
  };
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  errorMsg: string;
}
