import React from 'react';
import { TopNavBar } from './TopNavBar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-background selection:bg-primary-fixed selection:text-on-primary-fixed font-['Inter'] antialiased tracking-tight min-h-screen">
      <TopNavBar />
      {/* Mobile Bottom Navigation could go here if needed in the future */}
      {children}
    </div>
  );
};
