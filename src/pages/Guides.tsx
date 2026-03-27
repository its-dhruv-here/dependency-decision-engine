import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Guides: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 4. SCROLL ANIMATIONS (GUIDES PAGE)
    const elements = gsap.utils.toArray('.guide-reveal');
    
    elements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="guide-reveal mb-16">
        <span className="font-['Inter'] text-xs font-semibold uppercase tracking-widest text-primary/60 mb-4 block">Knowledge Base</span>
        <h1 className="text-5xl md:text-6xl font-['Inter'] font-bold tracking-tighter text-primary mb-6">Guides & Support</h1>
        <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          Empowering you with the knowledge to navigate complex workplace dynamics with confidence, legal awareness, and professional poise.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-20">
          
          {/* Section 1: Understanding Your Rights */}
          <section className="guide-reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined text-secondary text-3xl">gavel</span>
              <h2 className="text-2xl font-['Inter'] font-semibold text-primary">Understanding Your Rights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="hover-lift bg-white p-8 rounded-2xl shadow-[0_8px_32px_rgba(26,26,46,0.04)] border border-outline-variant/10 flex flex-col justify-between cursor-default transition-all duration-300">
                <div>
                  <h3 className="text-xl font-['Inter'] font-bold text-primary mb-4">Workplace Harassment</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">You have the right to a safe, respectful environment. Harassment includes unwelcome conduct based on protected characteristics like race, gender, or religion.</p>
                </div>
                <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-secondary-container bg-secondary/10 px-3 py-1 rounded-full self-start">Legal Framework</span>
              </div>
              
              <div className="hover-lift bg-white p-8 rounded-2xl shadow-[0_8px_32px_rgba(26,26,46,0.04)] border border-outline-variant/10 flex flex-col justify-between cursor-default transition-all duration-300">
                <div>
                  <h3 className="text-xl font-['Inter'] font-bold text-primary mb-4">Unpaid Overtime</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Labor laws strictly govern compensation for extra hours. If you're non-exempt and working beyond 40 hours, you are entitled to proper time-and-a-half pay.</p>
                </div>
                <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-secondary-container bg-secondary/10 px-3 py-1 rounded-full self-start">Compensation</span>
              </div>
              
              <div className="hover-lift bg-white p-8 rounded-2xl shadow-[0_8px_32px_rgba(26,26,46,0.04)] border border-outline-variant/10 flex flex-col justify-between md:col-span-2 cursor-default transition-all duration-300">
                <div>
                  <h3 className="text-xl font-['Inter'] font-bold text-primary mb-4">Salary Delays</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Timely payment is a contractual and legal obligation. Understanding your local labor board's rules on late payments is critical for protecting your financial stability.</p>
                </div>
                <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-wider text-secondary-container bg-secondary/10 px-3 py-1 rounded-full self-start">Contractual Rights</span>
              </div>
            </div>
          </section>

          {/* Section 2: What You Can Do */}
          <section className="guide-reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
              <h2 className="text-2xl font-['Inter'] font-semibold text-primary">What You Can Do</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group hover-lift bg-surface-container-high/40 hover:bg-primary p-8 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-primary">
                <span className="material-symbols-outlined text-primary group-hover:text-white mb-6 block text-4xl transition-colors duration-300">shield</span>
                <h3 className="text-lg font-['Inter'] font-bold text-primary group-hover:text-white mb-3 transition-colors duration-300">How to respond safely</h3>
                <p className="text-on-surface-variant group-hover:text-white/80 text-xs leading-relaxed transition-colors duration-300">Prioritize your psychological safety and de-escalate whenever possible before seeking external mediation.</p>
              </div>
              
              <div className="group hover-lift bg-surface-container-high/40 hover:bg-primary p-8 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-primary">
                <span className="material-symbols-outlined text-primary group-hover:text-white mb-6 block text-4xl transition-colors duration-300">inventory_2</span>
                <h3 className="text-lg font-['Inter'] font-bold text-primary group-hover:text-white mb-3 transition-colors duration-300">How to document issues</h3>
                <p className="text-on-surface-variant group-hover:text-white/80 text-xs leading-relaxed transition-colors duration-300">Maintain a timestamped log of events, communications, and witnesses to build a solid factual foundation.</p>
              </div>
              
              <div className="group hover-lift bg-surface-container-high/40 hover:bg-primary p-8 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-primary">
                <span className="material-symbols-outlined text-primary group-hover:text-white mb-6 block text-4xl transition-colors duration-300">forum</span>
                <h3 className="text-lg font-['Inter'] font-bold text-primary group-hover:text-white mb-3 transition-colors duration-300">Communicate professionally</h3>
                <p className="text-on-surface-variant group-hover:text-white/80 text-xs leading-relaxed transition-colors duration-300">Use "I" statements and focus on objective business impacts rather than emotional accusations.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Contextual Quick Tips & Support */}
        <aside className="lg:col-span-4 space-y-12 guide-reveal">
          <div className="bg-white p-10 rounded-3xl sticky top-32 shadow-[0_8px_32px_rgba(26,26,46,0.04)] border border-surface-container">
            <h3 className="text-xs font-['Inter'] font-bold uppercase tracking-widest text-primary/40 mb-8">Quick Tips</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
                <span className="text-sm font-medium text-on-surface leading-snug">Keep written records of all meaningful interactions.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
                <span className="text-sm font-medium text-on-surface leading-snug">Avoid verbal-only agreements; follow up with an email.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
                <span className="text-sm font-medium text-on-surface leading-snug">Stay calm and professional even in heated moments.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</div>
                <span className="text-sm font-medium text-on-surface leading-snug">Ask for clarity in writing whenever instructions are vague.</span>
              </li>
            </ul>
            
            <div className="mt-12 pt-12 border-t border-outline-variant/20">
              <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/10">
                <h4 className="font-['Inter'] font-bold mb-2">Need Direct Support?</h4>
                <p className="text-xs text-white/70 mb-6 leading-relaxed">Contact our human-centered support team for confidential guidance.</p>
                <button 
                  onClick={() => alert("Consultation starting: Let's gather your legal risk profile.")}
                  className="w-full bg-white text-primary font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-200 active:scale-95">
                  Start Consultation
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
