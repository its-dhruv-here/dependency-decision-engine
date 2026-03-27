import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { useAppContext } from '../state/AppContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Profile: React.FC = () => {
  const { profile: globalProfile, saveProfile, resetProfile } = useAppContext();
  
  // Local state for editing before saving
  const [localProfile, setLocalProfile] = useState<UserProfile>(globalProfile);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Sync if global changes (e.g. reset)
  useEffect(() => {
    setLocalProfile(globalProfile);
  }, [globalProfile]);

  const handleDependencyChange = (val: string) => {
    const map: Record<string, 'low' | 'medium' | 'high'> = { '1': 'low', '2': 'medium', '3': 'high' };
    setLocalProfile({ ...localProfile, dependencyLevel: map[val] || 'medium' });
  };

  const handleSave = () => {
    saveProfile(localProfile);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const handleReset = () => {
    resetProfile();
    setSavedStatus('reset');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const dependencyValue = localProfile.dependencyLevel === 'low' ? '1' : localProfile.dependencyLevel === 'medium' ? '2' : '3';

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal sidebar
    gsap.fromTo('.profile-sidebar', 
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
    
    // Reveal header elements
    gsap.fromTo('.profile-header', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );

    // Reveal form sections
    gsap.fromTo('.profile-section', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} className="flex min-h-screen pt-20">
      {/* Profile Overview Sidebar Context */}
      <aside className="profile-sidebar hidden lg:flex flex-col p-8 space-y-10 h-full w-72 border-r border-slate-100 bg-white fixed left-0 top-20 bottom-0">
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400 font-black mb-6">Profile Overview</div>
          <div className="space-y-8">
            <div className="group">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <span className="material-symbols-outlined text-xl">analytics</span>
                <span className="text-xs font-bold uppercase tracking-wider">Risk Profile</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                <div className="text-lg font-bold text-primary">Balanced</div>
                <div className="text-[0.7rem] text-outline mt-1 font-medium">Moderate risk tolerance with focus on long-term growth.</div>
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <span className="material-symbols-outlined text-xl">center_focus_strong</span>
                <span className="text-xs font-bold uppercase tracking-wider">Current Focus</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                <div className="text-lg font-bold text-primary">Stability</div>
                <div className="text-[0.7rem] text-outline mt-1 font-medium">Prioritizing job security and consistent income streams.</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-5 rounded-2xl bg-primary-container/5 border border-primary-container/10">
          <span className="material-symbols-outlined text-primary mb-3 text-2xl">lightbulb</span>
          <h4 className="text-xs font-bold mb-2 text-primary uppercase tracking-wide">Did you know?</h4>
          <p className="text-[0.7rem] text-on-surface-variant leading-relaxed opacity-80">
            Your <b>Dependency Level</b> directly modulates the penalty for risky decisions in the simulator, ensuring family stability is always weighed.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-8 md:p-12 lg:p-20 bg-background">
        <div className="max-w-4xl mx-auto">
          <header className="profile-header mb-16">
            <span className="text-[0.75rem] font-bold tracking-[0.15em] text-on-primary-container uppercase mb-4 block">Personal Calibration</span>
            <h1 className="text-[3.5rem] font-bold tracking-[-0.03em] leading-tight text-primary mb-6">Your Profile</h1>
            
            <div className="flex items-center gap-4 p-4 mb-8 bg-secondary-container/20 border border-secondary-container/30 rounded-2xl">
              <span className="material-symbols-outlined text-secondary">verified_user</span>
              <p className="text-on-secondary-container font-medium text-sm">
                Your current settings provide a <span className="font-bold underline decoration-secondary/30">Balanced Risk Profile</span>.
              </p>
            </div>
            <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
              Adjust your fundamental variables. These parameters influence the simulation engine's risk calculation and outcome generation for all workspace scenarios.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Profile Form Section */}
            <section className="lg:col-span-8 space-y-12">
              
              {/* Visa Type Field */}
              <div className="profile-section group">
                <label className="text-[0.75rem] font-bold tracking-[0.05em] text-primary uppercase mb-4 block">Visa Type</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-background focus:ring-0 appearance-none cursor-pointer transition-all duration-300"
                    value={localProfile.visaType}
                    onChange={(e) => setLocalProfile({ ...localProfile, visaType: e.target.value as 'employer' | 'family' })}
                  >
                    <option value="employer">Work Visa (Employer Sponsored)</option>
                    <option value="family">Family Sponsored Visa</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">expand_more</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary group-focus-within:w-full transition-all duration-500"></div>
                </div>
                <p className="mt-3 text-sm text-outline">Visa status affects job security weights and relocation risk factors.</p>
              </div>

              {/* Dependency Level Field */}
              <div className="profile-section group">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[0.75rem] font-bold tracking-[0.05em] text-primary uppercase">Dependency Level</label>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[0.7rem] font-bold rounded-full uppercase">
                    CURRENT: {localProfile.dependencyLevel}
                  </span>
                </div>
                <div className="relative px-2">
                  <input 
                    className="w-full accent-primary h-2 bg-surface-container rounded-full appearance-none cursor-pointer" 
                    max="3" min="1" step="1" type="range" 
                    value={dependencyValue}
                    onChange={(e) => handleDependencyChange(e.target.value)}
                  />
                  <div className="flex justify-between mt-4 text-[0.65rem] font-black text-outline uppercase tracking-widest">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-outline leading-relaxed italic border-l-2 border-surface-container-highest pl-4">
                  Determines how much your career decisions impact dependents (family, children, elderly).
                </p>
              </div>

              {/* Financial Pressure Field */}
              <div className="profile-section group">
                <label className="text-[0.75rem] font-bold tracking-[0.05em] text-primary uppercase mb-6 block">Financial Pressure</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setLocalProfile({ ...localProfile, financialPressure: 'low' })}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                      localProfile.financialPressure === 'low' 
                        ? 'bg-primary text-on-primary shadow-xl scale-[1.02] border-2 border-primary' 
                        : 'bg-white border border-outline-variant/30 hover:bg-surface-container-low text-on-background'
                    }`}
                  >
                    <span className={`material-symbols-outlined mb-3 ${localProfile.financialPressure === 'low' ? '' : 'text-outline'}`}>savings</span>
                    <span className="text-sm font-semibold">Low / Moderate</span>
                  </button>
                  <button 
                    onClick={() => setLocalProfile({ ...localProfile, financialPressure: 'high' })}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                      localProfile.financialPressure === 'high' 
                        ? 'bg-primary text-on-primary shadow-xl scale-[1.02] border-2 border-primary' 
                        : 'bg-white border border-outline-variant/30 hover:bg-surface-container-low text-on-background'
                    }`}
                  >
                    <span className={`material-symbols-outlined mb-3 ${localProfile.financialPressure === 'high' ? '' : 'text-outline hover:text-error'}`}>warning</span>
                    <span className="text-sm font-semibold">High</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-section flex flex-col sm:flex-row items-center gap-6 pt-12 relative">
                <button 
                  onClick={handleSave}
                  className="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-sm tracking-tight hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2">
                  {savedStatus === 'saved' && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                  Save Preferences
                </button>
                <button 
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-transparent text-primary border border-outline-variant/30 px-10 py-4 rounded-full font-bold text-sm tracking-tight hover:bg-surface-container transition-all duration-300 active:opacity-80">
                  Reset Profile
                </button>

                {savedStatus && (
                  <div className="absolute -top-10 left-0 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest animate-fade-in-up flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">
                      {savedStatus === 'saved' ? 'verified' : 'restart_alt'}
                    </span>
                    Profile {savedStatus === 'saved' ? 'Saved Successfully' : 'Reset to Defaults'}
                  </div>
                )}
              </div>
            </section>

            {/* Profile Sidebar Information */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="profile-section bg-white p-8 rounded-2xl shadow-[0_8px_32px_rgba(26,26,46,0.04)] border border-outline-variant/10">
                <h3 className="text-sm font-bold tracking-tight text-primary mb-6">Simulator Impact</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Your current settings provide a <span className="font-bold text-primary">Balanced Risk Profile</span>.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 rounded-full bg-primary-container mt-1.5 shrink-0"></div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Financial outcomes are weighted for <span className="font-bold text-primary">Stability</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="profile-section relative h-64 rounded-2xl overflow-hidden group shadow-lg">
                <img alt="Executive Workspace" className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWel7RUbU1S7bWkMQ-HklUOFWSi3j_YqJMY9UMgnQfg_9ImKRBGXStxLDpbS4-vOoq8IPTBQJK9weZrn0kw8T9y9iBpX09PRkZWXLRBUubB2QrJl_8g5t0S2xyQPfdvsZAcxqLevpLwQNs9bIecDpiSSNaL4PuJRYrHWTruswz5FHXOew0rXaX21QtRCjw5vlV8ZEn-Dx0zLeIhzTY9e22swSwlLDhZ8PfqUUb9VmdXozvrsnVnZSZBVX4Y0SrxH4xgYIychhwbRM" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end p-6">
                  <div>
                    <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-1">Current Focus</p>
                    <p className="text-white text-xl font-bold">Workspace Stability</p>
                  </div>
                </div>
              </div>

              <div className="profile-section p-8 rounded-2xl bg-surface-container border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary mb-4">auto_awesome</span>
                <h4 className="text-sm font-bold mb-2">Insight Panel</h4>
                <p className="text-xs text-outline leading-relaxed">
                  Adjusting your Dependency Level unlocks unique "Family-First" decision nodes in the simulator that prioritize work-life balance over raw compensation.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};
