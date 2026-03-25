import { UserProfile, Scenario, Decisions, Decision } from '../types';

export function simulateDecisions(profile: Partial<UserProfile> = {}, scenario: Partial<Scenario> = {}): Decisions {
  const type = scenario?.type || 'unclear_instruction';
  const dep = profile?.dependencyLevel || 'medium';
  const fin = profile?.financialPressure || 'low';

  // ── Context-aware reply templates ─────────────────────────────────
  const REPLIES: Record<string, { accept: string; ask: string; refuse: string }> = {
    harassment: {
      accept: 'I understand, but I want to note this interaction for my records.',
      ask: 'I need to formally document this incident as it affects my workplace safety.',
      refuse: 'This behavior is unacceptable and I am documenting it for further action.',
    },
    abuse: {
      accept: 'I acknowledge the situation but I am keeping a personal record of this event.',
      ask: 'I need this to be officially documented as it constitutes a serious workplace violation.',
      refuse: 'I cannot accept this treatment. I will be reporting this through proper channels.',
    },
    overtime: {
      accept: 'I can work the additional hours. Could we confirm the compensation arrangement?',
      ask: 'I am willing to help, but could we discuss compensation for the extra hours first?',
      refuse: 'My contract specifies my working hours. I would prefer to stick to the agreed schedule.',
    },
    salary_delay: {
      accept: 'I understand there may be processing delays. Could I get a written timeline?',
      ask: 'Could we review the status of my pending salary and get a confirmed payment date?',
      refuse: 'My salary is overdue. I need the payment processed as per our agreement.',
    },
    workplace_pressure: {
      accept: 'I will do my best with the current workload.',
      ask: 'Could we review my current tasks and prioritize what is most urgent?',
      refuse: 'The current workload is unsustainable. I need us to realign expectations.',
    },
    unclear_instruction: {
      accept: 'I will proceed with my best understanding of the task.',
      ask: 'Could you clarify the specific deliverables and timeline for this task?',
      refuse: 'I cannot proceed without clearer instructions to avoid errors.',
    },
  };

  const replies = REPLIES[type] || REPLIES.unclear_instruction;

  // ── ACCEPT ────────────────────────────────────────────────────────
  let accept: Decision;
  if (type === 'harassment' || type === 'abuse') {
    accept = {
      risk: 'high',
      outcome: 'Enduring severe misconduct presents high personal and psychological risk.',
      reply: replies.accept,
      dependencyImpact: fin === 'high'
        ? 'Financial pressure forces compliance despite unsafe conditions.'
        : 'Dependency creates pressure to tolerate unacceptable behavior.',
    };
  } else {
    accept = {
      risk: 'low',
      outcome: fin === 'high'
        ? 'Financial pressure makes short-term acceptance the safer option.'
        : 'Compliance maintains stability but may enable further boundary pushing.',
      reply: replies.accept,
      dependencyImpact: dep === 'high'
        ? 'High dependency makes acceptance the path of least resistance.'
        : 'Lower dependency gives room to evaluate alternatives.',
    };
  }

  // ── ASK ───────────────────────────────────────────────────────────
  let ask: Decision;
  if (type === 'harassment' || type === 'abuse') {
    ask = {
      risk: 'medium',
      outcome: 'Requesting formal documentation creates a protective paper trail.',
      reply: replies.ask,
      dependencyImpact: 'A crucial step to build leverage regardless of dependency level.',
    };
  } else {
    ask = {
      risk: 'medium',
      outcome: 'A balanced approach that establishes professional boundaries.',
      reply: replies.ask,
      dependencyImpact: dep === 'high'
        ? 'Asking politely is generally safe even under high dependency.'
        : 'Moderate dependency allows room for negotiation.',
    };
  }

  // ── REFUSE ────────────────────────────────────────────────────────
  let refuseRisk: 'high' | 'medium' | 'low';
  let refuseOutcome: string;
  let refuseDependency: string;

  if (type === 'harassment' || type === 'abuse') {
    refuseRisk = dep === 'high' ? 'high' : 'medium';
    refuseOutcome = dep === 'high'
      ? 'Refusal carries high risk when employment depends on the perpetrator.'
      : 'Refusal is risky but necessary to protect personal safety.';
    refuseDependency = dep === 'high'
      ? 'High dependency makes refusal dangerous without external support.'
      : 'Lower dependency provides more room to take a stand.';
  } else if (dep === 'high') {
    refuseRisk = 'high';
    refuseOutcome = 'Refusal may risk job stability due to employer power imbalance.';
    refuseDependency = 'High dependency significantly increases risk of retaliation.';
  } else if (dep === 'low') {
    refuseRisk = 'low';
    refuseOutcome = 'Lower dependency allows more flexibility to refuse.';
    refuseDependency = 'Low dependency provides substantial negotiation room.';
  } else {
    refuseRisk = 'medium';
    refuseOutcome = 'Some risk depending on employer response and relationship.';
    refuseDependency = 'Moderate dependency requires careful approach to refusal.';
  }

  const refuse: Decision = {
    risk: refuseRisk,
    outcome: refuseOutcome,
    reply: replies.refuse,
    dependencyImpact: refuseDependency,
  };

  return { accept, ask, refuse };
}
