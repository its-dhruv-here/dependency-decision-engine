import React, { useState } from 'react';
import { callLLMForExplanation, callLLMForFollowup } from '../utils/llm';

interface Props {
  context: string;
}

export const ExplainChat: React.FC<Props> = ({ context }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleExplain = async () => {
    setIsLoadingMain(true);
    const result = await callLLMForExplanation(context);
    setExplanation(result);
    setIsLoadingMain(false);
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setChatHistory((prev) => [...prev, { role: 'user', text: userQ }]);
    setQuestion('');
    setIsAsking(true);

    const fullContext = `Situation: ${context}\nPrior explanation: ${explanation}`;
    const answer = await callLLMForFollowup(userQ, fullContext);

    setChatHistory((prev) => [...prev, { role: 'assistant', text: answer }]);
    setIsAsking(false);
  };

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">5. Situation Explanation (Optional)</h3>

      {!explanation && !isLoadingMain ? (
        <button
          onClick={handleExplain}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-lg transition border border-slate-300 shadow-sm"
        >
          Explain this situation objectively
        </button>
      ) : isLoadingMain ? (
        <div className="animate-pulse text-slate-500 font-medium text-sm">Generating objective breakdown...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg text-slate-800 text-sm leading-relaxed shadow-inner">
            <strong className="block text-blue-800 mb-2 uppercase tracking-wide text-xs">Objective Analysis</strong>
            {explanation}
          </div>

          <div className="bg-white border text-sm border-slate-200 p-5 rounded-lg flex flex-col gap-4 shadow-sm">
            <h4 className="font-bold text-slate-800 text-base">Ask a follow-up question</h4>

            {(chatHistory.length > 0 || isAsking) && (
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto p-2">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 rounded-xl max-w-[90%] ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white self-end ml-auto'
                        : 'bg-slate-50 self-start mr-auto border border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="font-bold text-[9px] block uppercase mb-1.5 tracking-wider opacity-70">
                      {msg.role}
                    </span>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
                {isAsking && (
                  <div className="text-slate-400 italic text-xs animate-pulse px-2">Analyzing inquiry...</div>
                )}
              </div>
            )}

            <form onSubmit={handleAsk} className="flex gap-2 mt-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., What are the legal risks here?"
                className="flex-1 border border-slate-300 rounded-md px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder-slate-400"
                disabled={isAsking}
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-bold disabled:opacity-50 transition-colors shadow-sm"
              >
                Ask
              </button>
            </form>
            <span className="text-[11px] font-medium text-slate-400 text-center block mt-1 tracking-wide uppercase">
              LLM provides explanations only — decisions are made by the rule engine.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
