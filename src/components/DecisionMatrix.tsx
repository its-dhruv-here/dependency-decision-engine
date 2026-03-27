import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { UserProfile, RiskOutput, Decisions, Scenario, SafetyAction } from '../types';
import { ExplainChat } from './ExplainChat';

interface Props {
  hasAnalyzed: boolean;
  isAnalyzing: boolean;
  resultState: {
    scenario: Scenario | null;
    riskOutput: RiskOutput | null;
    decisions: Decisions | null;
    safety: SafetyAction[];
  };
  profile: UserProfile;
}

export const DecisionMatrix: React.FC<Props> = ({ hasAnalyzed, isAnalyzing, resultState }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const matrixRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (resultState.scenario) {
      // Stagger the Detected Situation block first
      gsap.from('.stagger-intro', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
      // Then stagger the decision cards
      gsap.from('.stagger-card', {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });
      // Then Safe Steps and Chat
      gsap.from('.stagger-post', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.4
      });
    }
  }, { scope: matrixRef, dependencies: [resultState.scenario] });

  if (!hasAnalyzed && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-center p-10 bg-white/50 rounded-3xl border border-dashed border-surface-container animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-outline text-3xl">psychology</span>
        </div>
        <h3 className="text-xl font-bold text-on-background mb-3 tracking-tight">Awaiting Analysis</h3>
        <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
          Describe a workplace situation and click "Analyze" to see dependency-aware decision paths tailored to your profile.
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-center p-10 bg-white/50 rounded-3xl border border-surface-container animate-fade-in-up">
        <div className="w-12 h-12 border-4 border-surface-container border-t-primary rounded-full animate-spin mb-6 drop-shadow-md" />
        <h3 className="text-xl font-bold text-on-background mb-2 tracking-tight">Evaluating Situation</h3>
        <p className="text-sm text-on-surface-variant font-medium">Running risk analysis models...</p>
      </div>
    );
  }

  if (!resultState.scenario || !resultState.decisions || !resultState.riskOutput) return null;

  const { scenario, riskOutput, decisions, safety } = resultState;

  // Helpers for dynamic styling
  const isHighRisk = riskOutput.riskLevel === 'high';
  const riskColor = isHighRisk ? 'text-error' : riskOutput.riskLevel === 'medium' ? 'text-secondary' : 'text-primary';
  const riskBg = isHighRisk ? 'from-secondary to-error' : riskOutput.riskLevel === 'medium' ? 'from-primary to-secondary' : 'from-surface-container-high to-primary';
  const riskPercent = isHighRisk ? '85%' : riskOutput.riskLevel === 'medium' ? '65%' : '20%';

  return (
    <div ref={matrixRef} className="space-y-12">
      {/* 1. Detected Situation Card */}
      <div className="stagger-intro bg-white rounded-3xl p-10 shadow-[0_8px_32px_rgba(26,26,46,0.06)] relative overflow-hidden border border-surface-container">
        <div className="absolute top-0 right-0 p-8">
          <span className={`${isHighRisk ? 'bg-error' : 'bg-primary'} text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg ${isHighRisk ? 'shadow-error/20' : 'shadow-primary/20'}`}>
            {riskOutput.riskLevel} Risk
          </span>
        </div>
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold tracking-tight">Detected Situation</h3>
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              {scenario.type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-lg">
            {scenario.description}
          </p>

          <div className="pt-8 flex items-center gap-8">
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black text-on-primary-container uppercase">
                <span>Detailed Risk Level</span>
                <span className={`${riskColor} font-black uppercase`}>{riskOutput.riskLevel} ({riskPercent})</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${riskBg}`} style={{ width: riskPercent }}></div>
              </div>
              <ul className="text-[10px] text-on-surface-variant space-y-1 pt-2">
                {riskOutput.reasons.map((r, i) => (
                  <li key={i} className="flex gap-2"><span>•</span> {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Decision Matrix */}
      <div className="space-y-6">
        <div className="stagger-intro flex items-center justify-between">
          <h4 className="text-xs font-black tracking-[0.2em] text-on-primary-container uppercase">Available Actions</h4>
          <button className="text-[10px] font-bold text-primary flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all">
            VIEW DETAILS <span className="material-symbols-outlined text-sm">info</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['accept', 'ask', 'refuse'] as const).map((type) => {
            const dec = decisions[type];
            if (!dec) return null;
            const isExpanded = expandedCard === type;

            const baseCardClass = "stagger-card group bg-white p-8 rounded-3xl transition-all duration-200 cursor-pointer relative";
            const iconMap = { accept: 'check_circle', ask: 'chat', refuse: 'block' };
            const titleMap = { accept: 'Accept for now', ask: 'Ask Politely', refuse: 'Refuse' };
            
            // Dynamic styling based on Risk of the specific action
            let cardStyle = "";
            let iconContainer = "";
            let badge = "";
            let badgeText = "";
            let hoverBg = "";

            if (dec.risk === 'low') {
              cardStyle = "shadow-[0_8px_32px_rgba(26,26,46,0.04)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(26,26,46,0.1)] border border-transparent";
              iconContainer = "bg-surface-container text-primary group-hover:bg-primary group-hover:text-white";
              badge = "bg-surface-container-high text-on-surface-variant";
              badgeText = "LOW FRICTION";
            } else if (dec.risk === 'medium') {
              cardStyle = "shadow-[0_16px_48px_rgba(26,26,46,0.12)] border-2 border-secondary ring-4 ring-secondary/5 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,110,45,0.15)]";
              iconContainer = "bg-secondary text-white";
              badge = "bg-secondary-container text-on-secondary-container";
              badgeText = "BALANCED PATH";
            } else {
              cardStyle = "shadow-[0_8px_32px_rgba(26,26,46,0.04)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(26,26,46,0.1)] border border-transparent";
              iconContainer = "bg-surface-container text-primary group-hover:bg-error group-hover:text-white";
              badge = "bg-error-container text-on-error-container";
              badgeText = "HIGH RISK";
            }

            return (
              <div key={type} className={`${baseCardClass} ${cardStyle}`} onClick={() => setExpandedCard(isExpanded ? null : type)}>
                {dec.risk === 'medium' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                    Recommended
                  </div>
                )}
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200 ${iconContainer}`}>
                    <span className="material-symbols-outlined" style={dec.risk === 'medium' ? { fontVariationSettings: "'FILL' 1" } : {}}>{iconMap[type]}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${badge}`}>{badgeText}</span>
                </div>
                <h5 className="text-lg font-bold mb-3">{titleMap[type]}</h5>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {dec.outcome}
                </p>

                {isExpanded && (
                  <div className="animate-fade-in-up mt-6 pt-6 border-t border-outline-variant/20 space-y-4 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="bg-surface-container-low p-4 rounded-xl">
                      <span className="text-[9px] font-black text-on-primary-container tracking-widest uppercase mb-1 block">Suggested Reply</span>
                      <p className="text-sm font-medium italic text-primary">"{dec.reply}"</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-on-primary-container tracking-widest uppercase mb-1 block">Why this?</span>
                      <p className="text-xs text-on-surface-variant">{dec.dependencyImpact}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Safe Next Steps */}
      {safety && safety.length > 0 && (
        <div className="stagger-post bg-surface-container-low rounded-3xl p-10 flex flex-col md:flex-row gap-12 items-start border border-surface-container">
          <div className="space-y-4 max-w-sm">
            <h4 className="text-xl font-bold">Safe Next Steps</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Practical actions to help you manage this situation safely.</p>
            {isHighRisk && (
              <p className="text-xs text-error font-bold">Because your dependency is high, some actions may carry more risk.</p>
            )}
          </div>
          <div className="flex-1 space-y-4 w-full">
            {safety.map((action, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-surface-container shadow-sm hover:translate-x-1 hover:shadow-md transition-all duration-300">
                <span className={`w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm ${action.priority === 'critical' ? 'bg-error' : 'bg-primary'}`}>
                  0{i + 1}
                </span>
                <p className="text-sm font-medium">{action.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Explanation Section via existing ExplainChat */}
      <div className="stagger-post border-t border-outline-variant/30 pt-10 pb-8">
        <h4 className="text-xs font-black tracking-[0.2em] text-on-primary-container uppercase mb-8">Understand this situation dynamically</h4>
        <ExplainChat context={scenario.description} />
      </div>

    </div>
  );
};
