import React from 'react';
import { UserProfile, RiskOutput, Decisions, Scenario } from '../types';
import { getRiskBadgeColor, getCardStyle, getDependencyExplanation } from '../utils/uiHelpers';

interface Props {
  hasAnalyzed: boolean;
  isAnalyzing: boolean;
  resultState: {
    scenario: Scenario | null;
    riskOutput: RiskOutput | null;
    decisions: Decisions | null;
  };
  profile: UserProfile;
}

export const DecisionMatrix: React.FC<Props> = ({ hasAnalyzed, isAnalyzing, resultState, profile }) => {
  if (!hasAnalyzed && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center w-full h-full min-h-[250px]">
        <h3 className="text-xl font-bold text-slate-300 mb-2">No data yet</h3>
        <p className="text-slate-400 text-sm font-medium">Enter a workplace situation to safely assess risk.</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
       <div className="flex flex-col items-center justify-center p-8 text-center w-full h-full min-h-[250px] animate-pulse">
         <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-blue-600 animate-spin mb-4"></div>
         <p className="text-slate-500 text-sm font-bold tracking-wider">EVALUATING RISK...</p>
       </div>
    );
  }

  if (!resultState.scenario || !resultState.decisions || !resultState.riskOutput) {
    return <div className="flex flex-col items-center justify-center p-8 text-center w-full h-full"><h3 className="text-lg font-bold text-slate-600">No data yet</h3></div>;
  }

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in slide-in-from-bottom-2 break-words">
      
      {/* 1 & 2 - Top Info section */}
      <div className="flex flex-col md:flex-row gap-5 w-full">
        {/* Scenario Summary */}
        <div className="w-full md:w-1/2 p-5 bg-slate-50 rounded-md border border-slate-200 shadow-inner">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">1. Scenario Summary</h3>
          <span className="inline-block mb-2 px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-extrabold rounded-md uppercase tracking-wider shadow-sm">
            {resultState.scenario.type.replace('_', ' ')}
          </span>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed border-l-2 border-blue-200 pl-3 mt-1">
            "{resultState.scenario.description}"
          </p>
        </div>
        
        {/* Risk Level + Reasons */}
        <div className="w-full md:w-1/2 p-5 bg-slate-50 rounded-md border border-slate-200 shadow-inner">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">2. Base Risk Assessment</h3>
          <span className={`inline-block mb-3 px-3 py-1 text-[11px] font-bold rounded-md uppercase border shadow-sm tracking-wider ${getRiskBadgeColor(resultState.riskOutput.riskLevel)}`}>
            {resultState.riskOutput.riskLevel} RISK
          </span>
          <ul className="text-sm text-slate-700 space-y-2 font-medium ml-1">
             {resultState.riskOutput.reasons.map((r, i) => (
               <li key={i} className="flex gap-2.5 items-start">
                 <span className="text-slate-400 mt-1 shrink-0">•</span>
                 <span className="leading-snug">{r}</span>
               </li>
             ))}
          </ul>
        </div>
      </div>

      {/* 3 - Decision Cards Header */}
      <div className="flex flex-col gap-3 w-full mt-4 border-t border-slate-100 pt-6">
         <div className="flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-800">3. Decision Matrix</h3>
         </div>
      </div>
      
      {/* Cards (Main Focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        {(['accept', 'ask', 'refuse'] as const).map((type) => {
          const dec = resultState.decisions![type];
          if (!dec) return null;
          
          const titles = { accept: 'Accept', ask: 'Ask Politely', refuse: 'Refuse' };
          
          return (
            <div key={type} className={`border rounded-xl px-5 py-6 w-full flex flex-col gap-4 shadow-sm hover:shadow-md transition-all ${getCardStyle(type)}`}>
              {/* Header */}
              <div className="flex justify-between items-center mb-1 border-b border-black/10 pb-3">
                <h4 className="text-base font-extrabold uppercase text-slate-800 tracking-tight">
                  {titles[type]}
                </h4>
                <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase border shadow-sm tracking-wider ${getRiskBadgeColor(dec.risk)}`}>
                  {dec.risk}
                </span>
              </div>
              
              {/* Outcome */}
              <p className="text-sm text-slate-800 leading-relaxed font-semibold opacity-95 h-10 flex items-start">
                {dec.outcome}
              </p>
              
              {/* Impact highlights */}
              <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-black/5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Dependency Impact</span>
                <p className="text-xs text-slate-800 leading-snug font-semibold">{dec.dependencyImpact}</p>
              </div>
              
              {/* Reply */}
              <div className="bg-white/80 p-3.5 rounded-lg border border-black/5 mt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 tracking-wider">Suggested Reply</span>
                <p className="text-sm italic text-slate-900 leading-relaxed font-medium">"{dec.reply}"</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
