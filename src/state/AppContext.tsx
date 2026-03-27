import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Scenario, RiskOutput, Decisions, SafetyAction } from '../types';
import { parseScenarioWithLLM } from '../engine/scenarioEngine';
import { analyzeRisk } from '../engine/riskAnalyzer';
import { simulateDecisions } from '../engine/decisionSimulator';
import { getSafetyActions } from '../engine/safetyPaths';

export interface HistoryItem {
  id: string;
  timestamp: string;
  scenarioInput: string;
  resultState: {
    scenario: Scenario | null;
    riskOutput: RiskOutput | null;
    decisions: Decisions | null;
    safety: SafetyAction[];
  };
}

interface AppContextType {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  saveProfile: (p: UserProfile) => void;
  resetProfile: () => void;
  scenarioInput: string;
  setScenarioInput: (v: string) => void;
  resultState: HistoryItem['resultState'];
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
  isProfileComplete: boolean;
  handleAnalyze: () => Promise<void>;
  history: HistoryItem[];
  resetNewCase: () => void;
  loadHistoryItem: (item: HistoryItem) => void;
  weeklyAccuracy: number | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  visaType: 'employer',
  dependencyLevel: 'high',
  financialPressure: 'high',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('socio_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('socio_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [scenarioInput, setScenarioInput] = useState('');
  const [resultState, setResultState] = useState<HistoryItem['resultState']>({
    scenario: null,
    riskOutput: null,
    decisions: null,
    safety: [],
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isProfileComplete = !!(profile?.visaType && profile?.dependencyLevel && profile?.financialPressure);

  // Auto-sync history to localStorage
  useEffect(() => {
    localStorage.setItem('socio_history', JSON.stringify(history));
  }, [history]);

  const [weeklyAccuracy, setWeeklyAccuracy] = useState<number | null>(null);

  // Compute Weekly Accuracy
  useEffect(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let safeCount = 0;
    let totalCount = 0;

    history.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (itemDate >= sevenDaysAgo && item.resultState.riskOutput) {
        totalCount++;
        if (item.resultState.riskOutput.riskLevel !== 'high') {
          safeCount++;
        }
      }
    });

    if (totalCount > 0) {
      setWeeklyAccuracy(Math.round((safeCount / totalCount) * 100));
    } else {
      setWeeklyAccuracy(null);
    }
  }, [history]);

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('socio_profile', JSON.stringify(p));
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('socio_profile');
  };

  const handleAnalyze = async () => {
    if (!scenarioInput || scenarioInput.trim() === '') {
      setErrorMsg('Please enter a scenario');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setHasAnalyzed(false);

    try {
      const structured = await parseScenarioWithLLM(scenarioInput);
      if (!structured) throw new Error('Failed to parse scenario');
      
      const risk = analyzeRisk(profile, structured);
      const decisions = simulateDecisions(profile, structured);
      const safety = getSafetyActions(structured.type, structured.severity);

      const newResultState = {
        scenario: structured,
        riskOutput: risk,
        decisions: decisions,
        safety: safety,
      };

      setResultState(newResultState);
      
      // Save to History
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        scenarioInput,
        resultState: newResultState,
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err) {
      console.error('[STATE] Analysis pipeline failed:', err);
      setErrorMsg('Analysis failed. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }
  };

  const resetNewCase = () => {
    setScenarioInput('');
    setResultState({ scenario: null, riskOutput: null, decisions: null, safety: [] });
    setHasAnalyzed(false);
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setScenarioInput(item.scenarioInput);
    setResultState(item.resultState);
    setHasAnalyzed(true);
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        saveProfile,
        resetProfile,
        scenarioInput,
        setScenarioInput,
        resultState,
        isAnalyzing,
        hasAnalyzed,
        errorMsg,
        setErrorMsg,
        isProfileComplete,
        handleAnalyze,
        history,
        resetNewCase,
        loadHistoryItem,
        weeklyAccuracy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
