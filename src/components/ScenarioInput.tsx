import React, { useRef, useState } from 'react';
import { useAppContext } from '../state/AppContext';
import { extractTextFromImage, extractTextFromPDF } from '../utils/fileParser';

export const ScenarioInput: React.FC = () => {
  const {
    scenarioInput, setScenarioInput,
    isPrivateMode, setPrivateMode,
    errorMsg, setErrorMsg,
    isAnalyzing, isProfileComplete, handleAnalyze,
    setInputSourceType, inputSourceType
  } = useAppContext();

  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "My employer is asking me to work unpaid overtime...",
    "My salary has been delayed for 2 months, how do I ask for it?",
    "I'm feeling pressured to sign a document I don't understand...",
    "My boss is yelling at me in front of others and I feel unsafe...",
    "They are threatening to cancel my visa if I don't work extra hours..."
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInputTooShort = scenarioInput.trim().length > 0 && scenarioInput.trim().length < 15;
  const canAnalyze = isProfileComplete && scenarioInput.trim().length >= 15 && !isAnalyzing && !isExtracting;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isPDF && !isImage) {
      setErrorMsg('Unsupported file type. Please upload a PDF or an image.');
      if (event.target) event.target.value = '';
      return;
    }

    const type = isPDF ? 'pdf' : 'image';

    setIsExtracting(true);
    setErrorMsg('');
    try {
      let text = '';
      if (type === 'pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromImage(file);
      }
      setScenarioInput(text);
      setInputSourceType(type);
      setSelectedFileName(file.name);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract text from file.');
    } finally {
      setIsExtracting(false);
      if (event.target) event.target.value = '';
    }
  };

  const clearFile = () => {
    setSelectedFileName(null);
    setInputSourceType('text');
    setScenarioInput('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-black tracking-widest text-on-primary-container uppercase">Describe your situation</span>
        
        <div className="flex gap-2">
          {/* Universal File Upload */}
          <input 
            type="file" 
            accept="application/pdf, image/png, image/jpeg, image/jpg" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtracting || isAnalyzing}
            className="text-[10px] font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
            title="Upload Document"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Upload Document
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap pb-2">
        {['Unpaid Overtime', 'Harassment', 'Salary Delay', 'Job Threat'].map((action) => (
          <button
            key={action}
            onClick={() => {
              setScenarioInput(`I am experiencing ${action.toLowerCase()} at my current workplace...`);
              setInputSourceType('text');
            }}
            disabled={isExtracting || isAnalyzing}
            className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-low hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-full text-on-surface-variant border border-outline-variant/30 active:scale-95"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="relative">
        {selectedFileName && inputSourceType !== 'text' && (
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center bg-white/90 backdrop-blur-sm border border-outline-variant/30 px-3 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-primary text-sm shrink-0">
                {inputSourceType === 'pdf' ? 'picture_as_pdf' : 'image'}
              </span>
              <span className="text-xs font-bold text-on-surface truncate">{selectedFileName}</span>
            </div>
            <button 
              onClick={clearFile}
              className="text-on-surface-variant hover:text-error transition-colors shrink-0 flex items-center"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {isExtracting && (
          <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-fade-in-up">
            <div className="w-8 h-8 border-4 border-surface-container border-t-primary rounded-full animate-spin mb-3 drop-shadow-sm" />
            <p className="text-xs font-bold text-primary tracking-wide">Extracting text from document...</p>
          </div>
        )}
        
        <textarea
          className={`w-full p-6 ${selectedFileName && inputSourceType !== 'text' ? 'pt-16' : ''} text-primary rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary/10 text-sm resize-none transition-shadow border-none ${errorMsg || isInputTooShort ? 'ring-2 ring-error/50 bg-error-container/20' : ''}`}
          placeholder={placeholders[placeholderIndex]}
          rows={5}
          value={scenarioInput}
          disabled={isAnalyzing || isExtracting}
          onChange={e => {
            setScenarioInput(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
        />
        <div className="flex justify-between items-center mt-2 px-1">
          {isInputTooShort ? (
            <p className="text-error text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Please add more details for a better result
            </p>
          ) : (
            <p className="text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-wider">
              {scenarioInput.length > 0 ? "Be specific for better results" : "Your privacy is protected"}
            </p>
          )}
          {errorMsg && (
            <p className="text-error text-[10px] font-bold uppercase tracking-wider">{errorMsg}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 pb-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isPrivateMode}
            onChange={(e) => setPrivateMode(e.target.checked)}
            disabled={isAnalyzing || isExtracting}
            className="w-4 h-4 rounded text-primary border-outline-variant/30 focus:ring-primary/20 transition-all bg-surface-container cursor-pointer disabled:opacity-50"
          />
          Do not save this case
        </label>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        className={`w-full text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
          !canAnalyze 
            ? 'bg-surface-container-highest cursor-not-allowed opacity-70 shadow-none' 
            : 'gradient-primary shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95'
        }`}
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing Situation...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">psychology</span>
            Analyze Situation
          </>
        )}
      </button>
    </div>
  );
};
