import React from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

export const ProfileForm: React.FC<Props> = ({ profile, setProfile }) => {
  return (
    <section className="flex flex-col w-full">
      <header className="mb-4">
        <h2 className="text-lg font-bold flex items-center text-slate-800 tracking-tight">
          User Profile
        </h2>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Visa Type</label>
          <select 
            className="w-full border border-slate-300 rounded-md px-4 py-2 bg-slate-50 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium"
            value={profile.visaType} 
            onChange={e => setProfile({...profile, visaType: e.target.value as 'employer' | 'family'})}
          >
            <option value="employer">Employer Sponsored</option>
            <option value="family">Family Sponsored</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Dependency Level</label>
          <select 
            className="w-full border border-slate-300 rounded-md px-4 py-2 bg-slate-50 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium"
            value={profile.dependencyLevel} 
            onChange={e => setProfile({...profile, dependencyLevel: e.target.value as 'high' | 'medium' | 'low'})}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Financial Pressure</label>
          <select 
            className="w-full border border-slate-300 rounded-md px-4 py-2 bg-slate-50 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer font-medium"
            value={profile.financialPressure} 
            onChange={e => setProfile({...profile, financialPressure: e.target.value as 'high' | 'low'})}
          >
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </section>
  );
};
