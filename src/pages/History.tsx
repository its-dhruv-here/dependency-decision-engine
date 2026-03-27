import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, HistoryItem } from '../state/AppContext';

export const History: React.FC = () => {
  const { history, loadHistoryItem } = useAppContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredHistory = history.filter(item => {
    // Search match
    const searchMatch = item.scenarioInput.toLowerCase().includes(search.toLowerCase()) || 
      (item.resultState.scenario?.intent || '').toLowerCase().includes(search.toLowerCase());
    
    // Risk match
    const level = item.resultState.riskOutput?.riskLevel || 'medium';
    if (riskFilter === 'High Risk' && level !== 'high') return false;
    if (riskFilter === 'Moderate Risk' && level !== 'medium') return false;
    if (riskFilter === 'Safe Path' && level !== 'low') return false;
    
    return searchMatch;
  });

  const getRiskColorClass = (level?: string) => {
    if (level === 'high') return 'border-error group-hover:shadow-[0_20px_40px_rgba(186,26,26,0.1)]';
    if (level === 'medium') return 'border-amber-400 group-hover:shadow-[0_20px_40px_rgba(251,191,36,0.1)]';
    return 'border-secondary group-hover:shadow-[0_20px_40px_rgba(0,110,45,0.1)]';
  };

  const getRiskLabel = (level?: string) => {
    if (level === 'high') return { text: 'High Risk', class: 'bg-error-container text-on-error-container' };
    if (level === 'medium') return { text: 'Moderate Risk', class: 'bg-amber-100 text-amber-800' };
    return { text: 'Safe Path', class: 'bg-secondary-container text-on-secondary-container' };
  };

  const highRiskAvoided = history.filter(h => h.resultState.riskOutput?.riskLevel === 'high').length;

  return (
    <div className="flex pt-20 min-h-screen">
      {/* Contextual Sidebar: Insights & Analytics */}
      <aside className="hidden lg:flex flex-col p-8 space-y-6 h-[calc(100vh-5rem)] w-72 border-r border-slate-100 bg-slate-50/50 fixed left-0">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Insight Status</h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
              <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly Accuracy</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">84%</span>
                <span className="text-secondary text-xs font-bold flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  12%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-secondary h-full rounded-full w-[84%]"></div>
              </div>
            </div>
            <div className="space-y-4 px-2">
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-secondary-container/30 text-secondary">
                  <span className="material-symbols-outlined text-lg">verified</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">High Risk Processed</p>
                  <p className="text-xs text-slate-500 leading-relaxed">You've successfully analyzed {highRiskAvoided} high-risk scenarios.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                  <span className="material-symbols-outlined text-lg">lightbulb</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Next Lesson</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Consider reviewing 'Contractor Misclassification' guides.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <div className="p-5 rounded-2xl bg-primary text-white space-y-3 shadow-xl shadow-primary/10">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-60">Status: Active</p>
            <p className="text-xs leading-relaxed font-medium">Your analytical profile is currently benchmarking against legal standards.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-72 p-8 md:p-12 lg:p-16">
        <header className="max-w-5xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="font-['Inter'] font-semibold text-[0.75rem] uppercase tracking-[0.2em] text-secondary">Chronicle</span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight">Your Past Scenarios</h1>
              <p className="text-on-primary-container text-lg max-w-xl">Review and analyze the legal impact of your historical workplace decisions.</p>
            </div>
          </div>
        </header>

        <section className="max-w-5xl mx-auto mb-12">
          <div className="bg-surface-container-low p-2 rounded-2xl flex flex-col md:flex-row gap-2 transition-all duration-300">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/5 transition-all duration-300 outline-none" 
                placeholder="Search scenarios, roles, or keywords..." 
                type="text" 
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex items-center">
                <select 
                  value={riskFilter}
                  onChange={e => setRiskFilter(e.target.value)}
                  className="appearance-none bg-white border-none rounded-xl py-4 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/5 cursor-pointer transition-all duration-300 h-full"
                >
                  <option value="All">Risk: All Levels</option>
                  <option value="High Risk">High Risk</option>
                  <option value="Moderate Risk">Moderate Risk</option>
                  <option value="Safe Path">Safe Path</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 pointer-events-none text-slate-400">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto space-y-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">history</span>
              <h3 className="text-xl font-bold">No Scenarios Found</h3>
              <p className="text-sm mt-2">Try adjusting your filters or generate a new case from the Simulator.</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const riskLevel = item.resultState.riskOutput?.riskLevel;
              const title = item.resultState.scenario?.intent.replace(/_/g, ' ') || 'Evaluation';
              const label = getRiskLabel(riskLevel);
              const colorClass = getRiskColorClass(riskLevel);

              return (
                <div 
                  key={item.id}
                  onClick={() => {
                    loadHistoryItem(item);
                    navigate('/');
                  }}
                  className={`group card-hover bg-white hover:shadow-[0_20px_40px_rgba(26,26,46,0.1)] rounded-lg p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden border-l-[4px] cursor-pointer transition-all duration-300 ${colorClass}`}
                >
                  <div className="flex-grow space-y-6 w-full">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-wider px-3 py-1 rounded-full ${label.class}`}>
                        {label.text}
                      </span>
                      <span className="font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-wider text-slate-400">
                        {new Date(item.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-primary capitalize">{title}</h3>
                    <p className="text-on-primary-container text-lg leading-relaxed line-clamp-3">"{item.scenarioInput}"</p>
                    <div className="flex items-center gap-2 text-slate-500 pt-4">
                      <span className="material-symbols-outlined text-[18px]">category</span>
                      <span className="text-xs font-bold uppercase tracking-widest">{item.resultState.scenario?.type?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0">
                    <button className="p-4 rounded-xl border border-slate-100 text-primary hover:bg-slate-50 transition-all duration-300 shadow-sm group-hover:shadow group-hover:bg-slate-50">
                      <span className="material-symbols-outlined">rocket_launch</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};
