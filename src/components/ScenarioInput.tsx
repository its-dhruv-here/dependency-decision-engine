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
    <div className="space-y-4">
      <span className="text-xs font-black tracking-widest text-on-primary-container uppercase">Describe your situation</span>
      <div className="relative">
        <textarea
          className={`w-full p-6 rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary/10 text-sm resize-none transition-shadow border-none ${errorMsg ? 'ring-2 ring-error/50 bg-error-container/20' : ''}`}
          placeholder="Example: My boss is asking me to work overtime without pay"
          rows={5}
          value={scenarioInput}
          onChange={e => {
            setScenarioInput(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
        />
        {errorMsg && (
          <p className="absolute -bottom-6 left-2 text-error text-[10px] font-bold uppercase tracking-wider">{errorMsg}</p>
        )}
      </div>
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !isProfileComplete}
        className={`w-full text-white py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
          isAnalyzing || !isProfileComplete 
            ? 'bg-surface-container-highest cursor-not-allowed opacity-70' 
            : 'gradient-primary shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95'
        }`}
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing...
          </>
        ) : 'Analyze Situation'}
      </button>
    </div>
  );
};
