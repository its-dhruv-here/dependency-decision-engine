import { Scenario } from '../types';
import { callLLMForParsing } from '../utils/llm';

// ── Predefined scenario descriptions ────────────────────────────────
const SCENARIO_DESCRIPTIONS: Record<string, string> = {
  harassment: 'Workplace harassment or severe misconduct',
  abuse: 'Verbal or physical workplace abuse',
  overtime: 'Working extra hours without compensation',
  salary_delay: 'Delay in receiving salary',
  workplace_pressure: 'Excessive stress or undue pressure',
  unclear_instruction: 'Task instructions are unclear or confusing',
};

// ── Default fallback (only used when LLM completely fails) ──────────
const FALLBACK_SCENARIO: Scenario = {
  type: 'unclear_instruction',
  description: 'Task instructions are unclear or confusing',
  severity: 'medium',
  intent: 'confusion',
};

// ── Main async parser ───────────────────────────────────────────────
export async function parseScenarioWithLLM(input: string): Promise<Scenario> {
  if (!input || input.trim() === '') {
    return FALLBACK_SCENARIO;
  }

  const llmResult = await callLLMForParsing(input);

  if (llmResult) {
    return {
      type: llmResult.type,
      description: SCENARIO_DESCRIPTIONS[llmResult.type] || input,
      severity: llmResult.severity,
      intent: llmResult.intent,
    };
  }

  // Deterministic fallback — only reached if LLM returns null
  const lower = input.toLowerCase();
  if (lower.includes('harass') || lower.includes('sexual')) {
    return { type: 'harassment', description: SCENARIO_DESCRIPTIONS.harassment, severity: 'high', intent: 'reporting_issue' };
  }
  if (lower.includes('abuse') || lower.includes('hit') || lower.includes('passport')) {
    return { type: 'abuse', description: SCENARIO_DESCRIPTIONS.abuse, severity: 'high', intent: 'reporting_issue' };
  }
  if (lower.includes('overtime') || lower.includes('extra hours') || lower.includes('forced')) {
    return { type: 'overtime', description: SCENARIO_DESCRIPTIONS.overtime, severity: 'medium', intent: 'asking_help' };
  }
  if (lower.includes('salary') || lower.includes('pay') || lower.includes('wage')) {
    return { type: 'salary_delay', description: SCENARIO_DESCRIPTIONS.salary_delay, severity: 'medium', intent: 'asking_help' };
  }
  if (lower.includes('pressure') || lower.includes('stress') || lower.includes('threat')) {
    return { type: 'workplace_pressure', description: SCENARIO_DESCRIPTIONS.workplace_pressure, severity: 'medium', intent: 'escalation' };
  }

  return FALLBACK_SCENARIO;
}
