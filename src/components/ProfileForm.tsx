import React from 'react';
import { useAppContext } from '../state/AppContext';

export const ProfileForm: React.FC = () => {
  const { profile, saveProfile } = useAppContext();

  // Dynamic Calculation: Dependency Impact
  // Base weights for Dependency Level (Max 60)
  const depWeighing = { high: 60, medium: 35, low: 10 };
  // Additional weights for Financial Pressure (Max 40)
  const finWeighing = { high: 40, low: 10 };

  const impactScore = (depWeighing[profile.dependencyLevel] || 10) + (finWeighing[profile.financialPressure] || 10);
  
  // Color Mapping based on Score
  const isHighRisk = impactScore >= 75;
  const isMediumRisk = impactScore >= 45 && impactScore < 75;
  
  const barColor = isHighRisk ? 'bg-error' : isMediumRisk ? 'bg-secondary' : 'bg-primary';
  const textColor = isHighRisk ? 'text-error' : isMediumRisk ? 'text-secondary' : 'text-primary';
  const impactLabel = isHighRisk ? 'Critical Risk' : isMediumRisk ? 'Moderate' : 'Low Impact';

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_32px_rgba(26,26,46,0.04)] space-y-8 border border-surface-container">
      <div className="flex flex-col">
        <span className="text-xs font-black tracking-widest text-on-primary-container mb-4 uppercase">Worker Profile</span>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden shadow-sm">
            <img className="w-full h-full object-cover" alt="portrait of a professional worker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqmSWYs95RfyeWKxSY_9YYRTch1yT8qdqSe_X6hfwX6plDaVe4AviYyOi7o0WbolmQW1d7J7vncAvRQcqjeL2gVlMrOyIW-OGZZTcIiBWz_8jT6EinuVHf08UKLga2dyD_Y1pW7JSXBROfbDTqmc9fc57wqgEINPrnECfvX20B7Cl6eS7eZnwG0aKUSmQ91OnY1HKgTBuuEeeUZzTH8cuHiPkjQUIuSh370mXfRdJjQ9Vfpc6CZj-xD8HVUEbhgbMXOlOvDgsjSKI" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">Current Status</p>
            <p className="text-sm text-on-surface-variant">Active Evaluation</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="group border-b border-outline-variant/30 pb-2 flex flex-col">
          <label className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Visa Type</label>
          <select
            className="text-sm font-semibold bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
            value={profile.visaType}
            onChange={e => saveProfile({ ...profile, visaType: e.target.value as 'employer' | 'family' })}
          >
            <option value="employer">Employer Sponsored</option>
            <option value="family">Family Sponsored</option>
          </select>
        </div>
        
        <div className="group border-b border-outline-variant/30 pb-2 flex flex-col">
          <label className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Dependency Level</label>
          <select
            className="text-sm font-semibold bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
            value={profile.dependencyLevel}
            onChange={e => saveProfile({ ...profile, dependencyLevel: e.target.value as 'high' | 'medium' | 'low' })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="group border-b border-outline-variant/30 pb-2 flex flex-col">
          <label className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Financial Pressure</label>
          <select
            className="text-sm font-semibold bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
            value={profile.financialPressure}
            onChange={e => saveProfile({ ...profile, financialPressure: e.target.value as 'high' | 'low' })}
          >
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider">Dependency Impact</label>
            <div className="flex flex-col items-end">
              <span className={`text-sm font-bold ${textColor}`}>
                {impactLabel}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant">{impactScore}% Score</span>
            </div>
          </div>
          <div className="w-full h-1 bg-surface-container rounded-lg relative overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${barColor}`} 
              style={{ width: `${impactScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
