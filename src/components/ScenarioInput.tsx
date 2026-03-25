import React from 'react';

interface Props {
  scenarioInput: string;
  setScenarioInput: (val: string) => void;
  errorMsg: string;
  setErrorMsg: (val: string) => void;
  isAnalyzing: boolean;
  isProfileComplete: boolean;
  handleAnalyze: () => void;
}

export const ScenarioInput: React.FC<Props> = ({ 
  scenarioInput, setScenarioInput, errorMsg, setErrorMsg, isAnalyzing, isProfileComplete, handleAnalyze 
}) => {
  return (
    <section className="flex flex-col w-full">
      <header className="mb-4">
        <h2 className="text-lg font-bold flex items-center text-slate-800 tracking-tight">
          Scenario Input
        </h2>
      </header>
      
      <div className="flex flex-col w-full relative">
        <textarea 
          className={`w-full min-h-[120px] rounded-md px-4 py-3 text-sm border ${errorMsg ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-slate-50'} text-slate-800 focus:ring-2 focus:ring-blue-500 font-medium outline-none transition-all resize-none shadow-sm leading-relaxed`}
          value={scenarioInput} 
          onChange={e => {
            setScenarioInput(e.target.value);
            if (errorMsg) setErrorMsg(""); 
          }} 
          placeholder="Describe your situation (e.g., asked to work overtime without pay)"
        />
        
        {errorMsg ? (
          <p className="text-red-600 text-xs font-extrabold mt-2 tracking-wide uppercase">
            Please enter a scenario
          </p>
        ) : (
          <p className="text-slate-500 text-xs mt-2 font-medium">
            This system will evaluate risk and suggest safe actions based on your dependency level.
          </p>
        )}
      </div>

      <div className="pt-5 w-full">
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !isProfileComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-md transition-all shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Simulating Decisions...
            </span>
          ) : "Analyze Context"}
        </button>
      </div>
    </section>
  );
};
