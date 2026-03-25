import { Scenario } from '../types';

export const PREDEFINED_SCENARIOS: Record<string, Scenario> = {
  overtime: {
    type: "overtime",
    description: "Working extra hours without compensation"
  },
  salary_delay: {
    type: "salary_delay",
    description: "Delay in receiving salary"
  },
  unclear_instruction: {
    type: "unclear_instruction",
    description: "Task instructions are unclear"
  }
};

export function getScenario(input: string): Scenario {
  if (!input || typeof input !== 'string' || input.trim() === '') {
    return PREDEFINED_SCENARIOS.unclear_instruction;
  }

  if (PREDEFINED_SCENARIOS[input]) {
    return PREDEFINED_SCENARIOS[input];
  }

  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("salary") || lowerInput.includes("pay")) {
    return PREDEFINED_SCENARIOS.salary_delay;
  }

  if (lowerInput.includes("hours") || lowerInput.includes("overtime")) {
    return PREDEFINED_SCENARIOS.overtime;
  }

  return PREDEFINED_SCENARIOS.unclear_instruction;
}
