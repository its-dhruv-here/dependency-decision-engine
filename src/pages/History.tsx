import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppContext, HistoryItem } from '../state/AppContext';

// Lightweight inline confirmation modal
const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, message, confirmLabel, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-xl">warning</span>
          </div>
          <h3 className="text-lg font-bold text-on-background tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end pt-2">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-error hover:bg-error/90 transition-colors shadow-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export const History: React.FC = () => {
  const { history, loadHistoryItem, deleteHistoryItem, clearHistory } = useAppContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', confirmLabel: '', onConfirm: () => {} });

  const closeDialog = () => setConfirmDialog(prev => ({ ...prev, open: false }));

  const handleDeleteItem = useCallback((e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation(); // Don't trigger the card click (load)
    setConfirmDialog({
      open: true,
      title: 'Delete this case?',
      message: `This will permanently remove the "${item.resultState.scenario?.intent?.replace(/_/g, ' ') || 'scenario'}" analysis from your history.`,
      confirmLabel: 'Delete',
      onConfirm: () => {
        // Animate out then remove
        const cardEl = document.getElementById(`history-card-${item.id}`);
        if (cardEl) {
          gsap.to(cardEl, {
            opacity: 0,
            x: -30,
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginBottom: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              deleteHistoryItem(item.id);
              closeDialog();
            }
          });
        } else {
          deleteHistoryItem(item.id);
          closeDialog();
        }
      },
    });
  }, [deleteHistoryItem]);

  const handleClearAll = useCallback(() => {
    setConfirmDialog({
      open: true,
      title: 'Clear all history?',
      message: 'This will permanently remove all stored scenario analyses. This action cannot be undone.',
      confirmLabel: 'Clear All',
      onConfirm: () => {
        clearHistory();
        closeDialog();
      },
    });
  }, [clearHistory]);

  const allTags = Array.from(new Set(history.flatMap(h => h.resultState.scenario?.tags || []))).sort();

  const filteredHistory = history.filter(item => {
    const searchMatch = item.scenarioInput.toLowerCase().includes(search.toLowerCase()) || 
      (item.resultState.scenario?.intent || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.resultState.scenario?.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const level = item.resultState.riskOutput?.riskLevel || 'medium';
    if (riskFilter === 'High Risk' && level !== 'high') return false;
    if (riskFilter === 'Moderate Risk' && level !== 'medium') return false;
    if (riskFilter === 'Safe Path' && level !== 'low') return false;
    
    if (tagFilter !== 'All' && !(item.resultState.scenario?.tags || []).includes(tagFilter)) return false;

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

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.history-sidebar', 
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', immediateRender: true }
    );
    
    gsap.fromTo('.history-header', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', immediateRender: true }
    );

    gsap.fromTo('.history-card', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15, immediateRender: true }
    );
  }, { scope: containerRef, dependencies: [filteredHistory.length] });

  return (
    <>
    <ConfirmDialog
      open={confirmDialog.open}
      title={confirmDialog.title}
      message={confirmDialog.message}
      confirmLabel={confirmDialog.confirmLabel}
      onConfirm={confirmDialog.onConfirm}
      onCancel={closeDialog}
    />
    <div ref={containerRef} className="flex pt-20 min-h-screen">
      {/* Contextual Sidebar: Insights & Analytics */}
      <aside className="history-sidebar hidden lg:flex flex-col p-8 space-y-6 h-[calc(100vh-5rem)] w-72 border-r border-slate-100 bg-slate-50/50 fixed left-0">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Insight Status</h2>
          <div className="space-y-8">

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
                  <p className="text-sm font-bold text-slate-900">Total Cases</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{history.length} scenario{history.length !== 1 ? 's' : ''} analyzed and stored.</p>
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
        <header className="history-header max-w-5xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="font-['Inter'] font-semibold text-[0.75rem] uppercase tracking-[0.2em] text-secondary">Chronicle</span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight">Your Past Scenarios</h1>
              <p className="text-on-primary-container text-lg max-w-xl">Review and analyze the legal impact of your historical workplace decisions.</p>
            </div>
            {history.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-error border border-error/20 bg-error-container/10 hover:bg-error-container/30 transition-all duration-300 shrink-0 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Clear All History
              </button>
            )}
          </div>
        </header>

        <section className="history-header max-w-5xl mx-auto mb-12">
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
            
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <div className="relative flex items-center min-w-[140px]">
                <select 
                  value={tagFilter}
                  onChange={e => setTagFilter(e.target.value)}
                  className="appearance-none w-full bg-white border-none rounded-xl py-4 pl-4 pr-10 text-xs font-bold uppercase tracking-widest text-on-surface-variant focus:ring-2 focus:ring-primary/5 cursor-pointer transition-all duration-300 h-full"
                >
                  <option value="All">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>#{tag.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 pointer-events-none text-slate-400">expand_more</span>
              </div>

              <div className="relative flex items-center min-w-[160px]">
                <select 
                  value={riskFilter}
                  onChange={e => setRiskFilter(e.target.value)}
                  className="appearance-none w-full bg-white border-none rounded-xl py-4 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/5 cursor-pointer transition-all duration-300 h-full"
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
            <div className="flex flex-col items-center justify-center py-24 px-10 bg-white/50 rounded-3xl border border-dashed border-surface-container text-center">
              <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center mb-8 shadow-sm">
                <span className="material-symbols-outlined text-outline text-4xl opacity-40">
                  {history.length === 0 ? 'history_edu' : 'filter_list_off'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-on-background mb-3 tracking-tight">
                {history.length === 0 ? 'No past scenarios yet' : 'No matching results'}
              </h3>
              <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed mb-10">
                {history.length === 0 
                  ? "You haven't analyzed any workplace scenarios yet. Start your first analysis to build a chronicle of your dependency-aware decisions."
                  : "Try adjusting your search or filters to find what you're looking for."
                }
              </p>
              {history.length === 0 && (
                <button 
                  onClick={() => navigate('/')}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Start First Analysis
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const riskLevel = item.resultState.riskOutput?.riskLevel;
              const title = item.resultState.scenario?.intent.replace(/_/g, ' ') || 'Evaluation';
              const label = getRiskLabel(riskLevel);
              const colorClass = getRiskColorClass(riskLevel);

              return (
                <div 
                  id={`history-card-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    loadHistoryItem(item);
                    navigate('/');
                  }}
                  className={`history-card group bg-white rounded-lg p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden border-l-[4px] cursor-pointer transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(26,26,46,0.1)] ${colorClass}`}
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
                    
                    {item.resultState.scenario?.tags && item.resultState.scenario.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-2">
                        {item.resultState.scenario.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-surface-container-low text-on-surface-variant px-3 py-1.5 rounded-lg border border-outline-variant/30">
                            #{tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-500 pt-4">
                      <span className="material-symbols-outlined text-[18px]">category</span>
                      <span className="text-xs font-bold uppercase tracking-widest">{item.resultState.scenario?.type?.replace(/_/g, ' ')}</span>
                    </div>
                    {item.resultState.scenario?.sourceType && item.resultState.scenario.sourceType !== 'text' && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-lg max-w-fit">
                        <span className="material-symbols-outlined text-xs text-primary">
                          {item.resultState.scenario.sourceType === 'pdf' ? 'picture_as_pdf' : 'image'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          {item.resultState.scenario.sourceType} Upload
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button 
                      className="p-4 rounded-xl border border-slate-100 text-primary hover:bg-slate-50 transition-all duration-300 shadow-sm group-hover:shadow group-hover:bg-slate-50"
                      title="Re-analyze this case"
                    >
                      <span className="material-symbols-outlined">rocket_launch</span>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteItem(e, item)}
                      className="p-4 rounded-xl border border-slate-100 text-slate-400 hover:text-error hover:bg-error-container/20 hover:border-error/20 transition-all duration-300 shadow-sm"
                      title="Delete this case"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
    </>
  );
};
