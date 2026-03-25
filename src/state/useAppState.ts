import { useState } from 'react';
import { UserProfile, Scenario, RiskOutput, Decisions, SafetyAction } from '../types';
import { parseScenarioWithLLM } from '../engine/scenarioEngine';
import { analyzeRisk } from '../engine/riskAnalyzer';
import { simulateDecisions } from '../engine/decisionSimulator';
import { getSafetyActions } from '../engine/safetyPaths';

export function useAppState() {
  const [profile, setProfile] = useState<UserProfile>({
    visaType: 'employer',
    dependencyLevel: 'high',
    financialPressure: 'high',
  });

  const [scenarioInput, setScenarioInput] = useState('');

  const [resultState, setResultState] = useState<{
    scenario: Scenario | null;
    riskOutput: RiskOutput | null;
    decisions: Decisions | null;
    safety: SafetyAction[];
  }>({
    scenario: null,
    riskOutput: null,
    decisions: null,
    safety: [],
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isProfileComplete = !!(profile?.visaType && profile?.dependencyLevel && profile?.financialPressure);

  const handleAnalyze = async () => {
    if (!scenarioInput || scenarioInput.trim() === '') {
      setErrorMsg('Please enter a scenario');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setHasAnalyzed(false);

    try {
      // Step 1: LLM parses input into structured scenario
      const structured = await parseScenarioWithLLM(scenarioInput);
      console.log('[STATE] Structured scenario:', structured);

      // Step 2: Rule engine computes risk
      const risk = analyzeRisk(profile, structured);
      console.log('[STATE] Risk output:', risk);

      // Step 3: Rule engine simulates decisions
      const decisions = simulateDecisions(profile, structured);
      console.log('[STATE] Decisions:', decisions);

      // Step 4: Safety layer computes actions
      const safety = getSafetyActions(structured.type, structured.severity);
      console.log('[STATE] Safety actions:', safety);

      // Step 5: Single atomic state update
      setResultState({
        scenario: structured,
        riskOutput: risk,
        decisions: decisions,
        safety: safety,
      });
    } catch (err) {
      console.error('[STATE] Analysis pipeline failed:', err);
      setErrorMsg('Analysis failed. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }
  };

  return {
    profile,
    setProfile,
    scenarioInput,
    setScenarioInput,
    resultState,
    isAnalyzing,
    hasAnalyzed,
    errorMsg,
    setErrorMsg,
    isProfileComplete,
    handleAnalyze,
  };
}
