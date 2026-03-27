import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../state/AppContext';

export const TopNavBar: React.FC = () => {
  const { resetNewCase } = useAppContext();
  const navigate = useNavigate();

  const handleNewCase = () => {
    resetNewCase();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(26,26,46,0.06)] font-['Inter'] antialiased tracking-tight transition-all duration-300">
      <div className="flex justify-between items-center w-full px-8 h-20 max-w-full mx-auto">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-lg font-bold text-slate-900 flex items-center gap-2 after:content-['Worker_Support'] after:text-[10px] after:font-black after:uppercase after:tracking-widest after:bg-slate-100 after:px-2 after:py-1 after:rounded-full">
              Workplace Decision Simulator
          </NavLink>
        </div>
        <div className="hidden md:flex gap-8 items-center h-full">
          <NavLink to="/" className={({ isActive }) => `uppercase text-[0.75rem] h-full flex items-center transition-colors ${isActive ? 'text-slate-900 font-bold border-b-2 border-slate-900' : 'text-slate-500 font-medium hover:text-slate-900'}` }>Simulator</NavLink>
          <NavLink to="/history" className={({ isActive }) => `uppercase text-[0.75rem] h-full flex items-center transition-colors ${isActive ? 'text-slate-900 font-bold border-b-2 border-slate-900' : 'text-slate-500 font-medium hover:text-slate-900'}` }>History</NavLink>
          <NavLink to="/guides" className={({ isActive }) => `uppercase text-[0.75rem] h-full flex items-center transition-colors ${isActive ? 'text-slate-900 font-bold border-b-2 border-slate-900' : 'text-slate-500 font-medium hover:text-slate-900'}` }>Guides</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `uppercase text-[0.75rem] h-full flex items-center transition-colors ${isActive ? 'text-slate-900 font-bold border-b-2 border-slate-900' : 'text-slate-500 font-medium hover:text-slate-900'}` }>Profile</NavLink>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden lg:block text-[0.75rem] font-bold uppercase tracking-wider text-slate-500">Safe Decision Support</span>
          <button 
            onClick={handleNewCase}
            className="gradient-primary text-white px-6 py-2.5 rounded-full text-[0.75rem] uppercase tracking-widest font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/10">
              New Case
          </button>
        </div>
      </div>
    </nav>
  );
};
