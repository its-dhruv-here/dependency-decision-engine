import React, { useRef, useState } from 'react';
import { useAppContext } from '../state/AppContext';
import { extractTextFromImage, extractTextFromPDF } from '../utils/fileParser';

export const ScenarioInput: React.FC = () => {
  const {
    scenarioInput, setScenarioInput,
    errorMsg, setErrorMsg,
    isAnalyzing, isProfileComplete, handleAnalyze,
    setInputSourceType, inputSourceType
  } = useAppContext();

  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          className={`w-full p-6 ${selectedFileName && inputSourceType !== 'text' ? 'pt-16' : ''} text-primary rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary/10 text-sm resize-none transition-shadow border-none ${errorMsg ? 'ring-2 ring-error/50 bg-error-container/20' : ''}`}
          placeholder="Example: My boss is asking me to work overtime without pay... Or upload a document using the button above to extract the scenario."
          rows={5}
          value={scenarioInput}
          onChange={e => {
            setScenarioInput(e.target.value);
            // If user types, we revert to text, but we don't necessarily clear the filename unless they want to. 
            // The prompt says "Allow user to edit extracted text". So we want to keep it as "from a document" until they clear it!
            if (errorMsg) setErrorMsg('');
          }}
        />
        {errorMsg && (
          <p className="absolute -bottom-6 left-2 text-error text-[10px] font-bold uppercase tracking-wider">{errorMsg}</p>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || isExtracting || !isProfileComplete}
        className={`w-full text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
          isAnalyzing || isExtracting || !isProfileComplete 
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
