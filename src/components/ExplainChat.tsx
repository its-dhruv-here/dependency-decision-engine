import React, { useState } from 'react';
import { callLLMForExplanation, callLLMForFollowup } from '../utils/llm';
import { UserProfile } from '../types';

interface Props {
  context: string;
  profile: UserProfile;
}

export const ExplainChat: React.FC<Props> = ({ context, profile }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleExplain = async () => {
    if (isLoadingMain) return;
    setIsLoadingMain(true);
    try {
      const result = await callLLMForExplanation(context);
      setExplanation(result || 'This situation involves a workplace concern that may need careful handling.');
    } catch {
      setExplanation('This situation involves a workplace concern. Use the decision options above for guidance.');
    } finally {
      setIsLoadingMain(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;
    if (question.trim().length < 3) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: 'Please describe your question in more detail.' }]);
      return;
    }

    const userQ = question.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userQ }]);
    setQuestion('');
    setIsAsking(true);

    try {
      const answer = await callLLMForFollowup(userQ, `Situation: ${context}\nExplanation: ${explanation}`, profile);
      setChatHistory(prev => [...prev, { role: 'assistant', text: answer || 'Unable to fetch explanation, please try again.' }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', text: 'Unable to fetch explanation, please try again.' }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>Situation Explanation</h3>

      {!explanation && !isLoadingMain ? (
        <button
          onClick={handleExplain}
          disabled={isLoadingMain}
          style={{
            background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
            padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: '#374151',
            cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          }}
        >
          Explain this situation objectively
        </button>
      ) : isLoadingMain ? (
        <div className="animate-pulse" style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, padding: '8px 0' }}>
          Generating objective analysis...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Explanation Box */}
          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>
              Objective Analysis
            </span>
            <p style={{ fontSize: '13px', color: '#1f2937', lineHeight: '1.7', fontWeight: 500 }}>{explanation}</p>
          </div>

          {/* Follow-up Chat */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px', background: '#ffffff' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>Ask a follow-up</h4>

            {(chatHistory.length > 0 || isAsking) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', padding: '4px' }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', borderRadius: '10px', maxWidth: '85%', fontSize: '12px', lineHeight: '1.6', fontWeight: 500,
                    ...(msg.role === 'user'
                      ? { background: '#2563eb', color: '#ffffff', alignSelf: 'flex-end', marginLeft: 'auto' }
                      : { background: '#f3f4f6', color: '#374151', alignSelf: 'flex-start', border: '1px solid #e5e7eb' }
                    ),
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, display: 'block', marginBottom: '4px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {msg.role === 'user' ? 'You' : 'Analyst'}
                    </span>
                    {msg.text}
                  </div>
                ))}
                {isAsking && (
                  <div className="animate-pulse" style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic', padding: '4px' }}>
                    Thinking...
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleAsk} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="E.g., What are the legal risks here?"
                disabled={isAsking}
                style={{
                  flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px',
                  padding: '8px 12px', fontSize: '12px', fontWeight: 500,
                  color: '#374151', background: '#f9fafb',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                style={{
                  background: '#2563eb', color: '#ffffff', border: 'none',
                  borderRadius: '8px', padding: '8px 16px', fontSize: '12px',
                  fontWeight: 700, cursor: isAsking || !question.trim() ? 'not-allowed' : 'pointer',
                  opacity: isAsking || !question.trim() ? 0.5 : 1,
                }}
              >
                {isAsking ? '...' : 'Ask'}
              </button>
            </form>
            <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
              Explanations only — decisions are made by the rule engine.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
