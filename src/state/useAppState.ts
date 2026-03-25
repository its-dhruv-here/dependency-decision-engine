import { useState, useEffect } from 'react';
import { UserProfile, RiskOutput, Decisions, Scenario } from '../types';
import { getScenario } from '../engine/scenarioEngine';
import { analyzeRisk } from '../engine/riskAnalyzer';
import { simulateDecisions } from '../engine/decisionSimulator';

export function useAppState() {
  const [profile, setProfile] = useState<UserProfile>({
    visaType: 'employer',
    dependencyLevel: 'high',
    financialPressure: 'high'
  });

  const [scenarioInput, setScenarioInput] = useState<string>('');
  
  const [resultState, setResultState] = useState<{
    scenario: Scenario | null;
    riskOutput: RiskOutput | null;
    decisions: Decisions | null;
  }>({
    scenario: null,
    riskOutput: null,
    decisions: null
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isProfileComplete = !!(profile?.visaType && profile?.dependencyLevel && profile?.financialPressure);

  const handleAnalyze = () => {
    if (!scenarioInput || scenarioInput.trim() === '') {
      setErrorMsg("Please enter a scenario");
      return;
    }
    setErrorMsg("");
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1000);
  };

  useEffect(() => {
    const safeInput = scenarioInput || "";
    const scenario = getScenario(safeInput);

    // DEBUG LOG (TEMPORARY)
    console.log("Profile:", profile);
    console.log("Scenario:", scenario);

    if (hasAnalyzed && scenarioInput && scenarioInput.trim() !== '') {
      const risk = analyzeRisk(profile, scenario);
      const decisions = simulateDecisions(profile, scenario);

      setResultState({
        scenario: scenario,
        riskOutput: risk,
        decisions: decisions
      });
    }
  }, [profile, scenarioInput, hasAnalyzed]);

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
    handleAnalyze
  };
}
