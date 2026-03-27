import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ProfileForm } from '../components/ProfileForm';
import { ScenarioInput } from '../components/ScenarioInput';
import { DecisionMatrix } from '../components/DecisionMatrix';
import { useAppContext } from '../state/AppContext';

export const Simulator: React.FC = () => {
  const state = useAppContext();
  
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 1. HERO / INPUT SECTION: Fade in + slight upward motion on page load
    gsap.from('.hero-element', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.1
    });

    gsap.from('.hero-mockup', {
      x: 40,
      opacity: 0,
      rotateY: -20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.4
    });
  }, { scope: heroRef });

  const handleSampleCase = () => {
    state.setScenarioInput("My employer is asking me to work overtime without pay and threatening to fire me if I refuse.");
    state.setInputSourceType('text');
    
    setTimeout(() => {
      document.getElementById('scenario-input-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <main className="pt-32 px-8 max-w-[1440px] mx-auto pb-24">
      {/* Hero Section */}
      <section ref={heroRef} className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-16 items-center mb-16">
        <div className="space-y-8">
          <h1 className="hero-element text-[3.5rem] leading-[1.1] font-bold tracking-tight text-primary">
            Understand your situation.<br />Decide safely.
          </h1>
          <p className="hero-element text-lg text-on-surface-variant max-w-[520px] leading-relaxed">
            This tool helps you evaluate workplace situations and choose safe actions based on your dependency and risk.
          </p>
          <div className="hero-element flex gap-4 pt-4">
            <button 
              onClick={handleSampleCase}
              className="bg-surface-container-low text-primary px-8 py-4 rounded-full font-bold hover:bg-surface-container-high transition-colors hover:shadow-sm active:scale-[0.98]">
              View Sample Case
            </button>
          </div>
        </div>
        <div className="hero-mockup relative h-[450px] hidden lg:block perspective-lg">
          {/* 3D Layered Mockup */}
          <div className="absolute top-0 right-0 w-80 h-[400px] bg-white rounded-2xl shadow-2xl rotate-y-12 z-30 overflow-hidden">
            <img className="w-full h-full object-cover opacity-90" alt="clean minimal UI dashboard with supportive icons" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC32ukLtwmWE9xrQj54dyGUKuLkkcs9X0VkKGPbK2CNi-uOpBc0NFTaBJjTesu6gIgyCB0oBfbAg-Fn-NTTDXDidPEDoO07XLBj-rz9o6-5hm1b3jbaRdU8dyRBv3gw0ccV4M8F0Z9Qu6WGYclIRF_ts8iOWhblPt5DtxPuVfBEiUwFtd7ahPKyPscycqyXVJkIEVkVkXfk_crw5DIhKNwCrCzC2B7Ip16BJnnI83vz-_FDwKQKTcfVUmgWsa7Hzmz0388QySr_P5E" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">SAFE ACTION</p>
              <p className="text-xl font-bold">Ask Politely</p>
            </div>
          </div>
          <div className="absolute top-12 -left-12 w-64 h-48 bg-secondary-container/90 backdrop-blur-xl rounded-2xl shadow-xl -rotate-6 z-40 p-6 flex flex-col justify-between">
            <span className="material-symbols-outlined text-on-secondary-container text-4xl">verified_user</span>
            <div>
              <p className="text-on-secondary-container font-bold text-lg">Safest Path</p>
              <p className="text-on-secondary-container/70 text-xs">Evaluated Choice</p>
            </div>
          </div>
          <div className="absolute bottom-8 -left-4 w-72 h-40 bg-white rounded-2xl shadow-lg rotate-3 z-20 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container"></div>
              <div className="space-y-1">
                <div className="h-2 w-24 bg-surface-container rounded-full"></div>
                <div className="h-2 w-16 bg-surface-container-high rounded-full"></div>
              </div>
            </div>
            <div className="h-3 w-full bg-surface-container-low rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main App Interface */}
      <div id="scenario-input-section" className="flex flex-col lg:flex-row items-start gap-12">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-8 h-auto">
          <ProfileForm />
          
          <div className="pt-2 border-t border-outline-variant/20">
            <div className="bg-primary-fixed/30 p-5 rounded-3xl flex gap-3">
              <span className="material-symbols-outlined text-primary text-xl">lightbulb</span>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Simulator Tip</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  "Keeping written records is your strongest defense." Always follow up verbal requests with an email.
                </p>
              </div>
            </div>
          </div>
          </aside>

        {/* Right Panel */}
        <section className="flex-1 flex flex-col gap-8 w-full min-w-0">
          {/* Top UX Flow: Scenario Input */}
          <div className="bg-white border border-surface-container rounded-3xl p-8 shadow-[0_8px_32px_rgba(26,26,46,0.04)] transition-all duration-300">
            <h2 className="text-primary font-bold text-2xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">edit_note</span>
              What's happening?
            </h2>
            <ScenarioInput />
          </div>

          {/* Results Area */}
          <div className="w-full flex flex-col gap-6">
            <DecisionMatrix
              hasAnalyzed={state.hasAnalyzed}
              isAnalyzing={state.isAnalyzing}
              resultState={state.resultState}
              profile={state.profile}
            />
          </div>
        </section>
      </div>
    </main>
  );
};
