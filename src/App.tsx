import React from 'react';
import { useAppState } from './state/useAppState';
import { ProfileForm } from './components/ProfileForm';
import { ScenarioInput } from './components/ScenarioInput';
import { DecisionMatrix } from './components/DecisionMatrix';

function App() {
  const state = useAppState();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 break-words flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <header className="text-center md:text-left pb-4 border-b border-slate-200 w-full mt-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Dependency-Aware <span className="text-blue-600">Decision Engine</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mt-2">
            Evaluate structural workplace risk and model safe decision paths.
          </p>
        </header>
        
        {/* INPUTS - Vertical Stack */}
        <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <ProfileForm 
            profile={state.profile} 
            setProfile={state.setProfile} 
          />
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <ScenarioInput 
            scenarioInput={state.scenarioInput}
            setScenarioInput={state.setScenarioInput}
            errorMsg={state.errorMsg}
            setErrorMsg={state.setErrorMsg}
            isAnalyzing={state.isAnalyzing}
            isProfileComplete={state.isProfileComplete}
            handleAnalyze={state.handleAnalyze}
          />
        </div>

        {/* TRANSITION HEADING */}
        {state.hasAnalyzed && !state.isAnalyzing && (
          <div className="text-center py-2 w-full animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">Simulation Results</h2>
            <div className="h-1 w-16 bg-blue-500 mx-auto mt-3 rounded-full"></div>
          </div>
        )}

        {/* OUTPUT - Vertical Stack */}
        <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <DecisionMatrix 
            hasAnalyzed={state.hasAnalyzed}
            isAnalyzing={state.isAnalyzing}
            resultState={state.resultState}
            profile={state.profile}
          />
        </div>

      </div>
    </div>
  );
}

export default App;
