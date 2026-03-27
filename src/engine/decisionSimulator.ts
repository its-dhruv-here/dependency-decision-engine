import { UserProfile, Scenario, Decisions, Decision } from '../types';

export function simulateDecisions(profile: Partial<UserProfile> = {}, scenario: Partial<Scenario> = {}): Decisions {
  const type = scenario?.type || 'unclear_instruction';
  const dep = profile?.dependencyLevel || 'medium';
  const fin = profile?.financialPressure || 'low';

  // ── Context-aware reply templates ─────────────────────────────────
  const REPLIES: Record<string, { accept: string; ask: string; refuse: string }> = {
    harassment: {
      accept: 'I understand, but I need to make a note of this for my personal records.',
      ask: 'I am concerned about this interaction. Can we document what just happened?',
      refuse: 'This makes me uncomfortable. I must ask you to stop this immediately.',
    },
    abuse: {
      accept: 'I hear you, but I need to record this interaction for safety.',
      ask: 'This treatment is not acceptable. Can we discuss this with a witness?',
      refuse: 'I cannot continue this conversation while being treated this way. I am leaving.',
    },
    overtime: {
      accept: 'I can help this time. Will these extra hours be compensated as per the contract?',
      ask: 'I am happy to support the team, but can we clarify how this overtime will be recorded?',
      refuse: 'I have personal commitments tonight. I need to leave at my scheduled time.',
    },
    salary_delay: {
      accept: 'I understand business is slow. When exactly can I expect the payment in my account?',
      ask: 'I am depending on this payment for my bills. Can we get a firm date for the transfer?',
      refuse: 'My contract requires timely payment. I cannot continue working if my salary is not processed.',
    },
    workplace_pressure: {
      accept: 'I will try to manage this, but I am worried about the quality of work under this timeline.',
      ask: 'This is a lot of pressure. Can we look at the list together and prioritize what is truly urgent?',
      refuse: 'I cannot meet this deadline without more support. We need to reset these expectations.',
    },
    unclear_instruction: {
      accept: 'I will start on this, but I might need more help as I go.',
      ask: 'I want to do a good job. Could you explain the specific steps you expect me to take?',
      refuse: 'I am worried about making a mistake. I cannot start until I have a clear brief.',
    },
  };

  const replies = REPLIES[type] || REPLIES.unclear_instruction;

  // ── ACCEPT ────────────────────────────────────────────────────────
  let accept: Decision;
  if (type === 'harassment' || type === 'abuse') {
    accept = {
      risk: 'high',
      outcome: 'Choosing to endure this treatment is incredibly difficult. While it might feel like the only option to keep your job, it poses a severe risk to your safety and mental health.',
      reply: replies.accept,
      dependencyImpact: fin === 'high'
        ? 'Your current financial pressure makes it feel impossible to speak up. This is a common but dangerous situation where economic need forces a compromise on safety.'
        : 'Even without immediate financial pressure, your dependency on this role is being used to keep you silent.',
    };
  } else {
    accept = {
      risk: 'low',
      outcome: 'Agreeing to the request maintains short-term peace, but it may set a precedent that you are always available for extra, undocumented demands.',
      reply: replies.accept,
      dependencyImpact: dep === 'high'
        ? 'Because your visa or livelihood depends heavily on this employer, you are choosing the path of least resistance to ensure stability for now.'
        : 'With lower dependency, you have more freedom to evaluate if this acceptance is truly in your best interest.',
    };
  }

  // ── ASK ───────────────────────────────────────────────────────────
  let ask: Decision;
  if (type === 'harassment' || type === 'abuse') {
    ask = {
      risk: 'medium',
      outcome: 'By asking to document the situation, you are starting a "paper trail." This is a brave step that builds evidence for your protection in the future.',
      reply: replies.ask,
      dependencyImpact: 'Taking this step creates leverage. Regardless of your dependency, having things in writing is your strongest tool.',
    };
  } else {
    ask = {
      risk: 'medium',
      outcome: 'This is a balanced, professional way to stand your ground. It shows you are willing to work but also that you understand your rights and value your time.',
      reply: replies.ask,
      dependencyImpact: dep === 'high'
        ? 'Even with high dependency, asking for clarification or documentation is usually seen as professional and carries lower risk than flat refusal.'
        : 'Your moderate dependency gives you a solid foundation to negotiate better terms for this request.',
    };
  }

  // ── REFUSE ────────────────────────────────────────────────────────
  let refuseRisk: 'high' | 'medium' | 'low';
  let refuseOutcome: string;
  let refuseDependency: string;

  if (type === 'harassment' || type === 'abuse') {
    refuseRisk = dep === 'high' ? 'high' : 'medium';
    refuseOutcome = dep === 'high'
      ? 'Directly refusing in a high-dependency situation can lead to immediate retaliation. You need a safety plan before taking this stand.'
      : 'Refusing is necessary for your safety. Since you have more options (lower dependency), you are in a stronger position to say no to mistreatment.';
    refuseDependency = dep === 'high'
      ? 'Your high dependency makes a direct "No" very risky. We recommend focusing on documentation first while looking for exit options.'
      : 'You have enough independence to prioritize your safety over this specific role.';
  } else if (dep === 'high') {
    refuseRisk = 'high';
    refuseOutcome = 'A flat refusal could be used as an excuse for termination. In a high-dependency situation, this could jeopardize your visa or primary income.';
    refuseDependency = 'High dependency significantly increases the power of the employer to retaliate if you refuse their demands.';
  } else if (dep === 'low') {
    refuseRisk = 'low';
    refuseOutcome = 'You are in a strong position. Refusing shows that you are a professional who respects contract boundaries, and you have the fallback options to sustain this choice.';
    refuseDependency = 'Your low dependency means you are not "locked in." This freedom is your greatest asset in saying no.';
  } else {
    refuseRisk = 'medium';
    refuseOutcome = 'Refusing carries some risk of tension with your manager, but it is often necessary to prevent burnout or exploitation.';
    refuseDependency = 'Since you have some dependency, consider a "Soft Refusal" (e.g., "I can do it tomorrow, but not tonight") to maintain the relationship.';
  }

  const refuse: Decision = {
    risk: refuseRisk,
    outcome: refuseOutcome,
    reply: replies.refuse,
    dependencyImpact: refuseDependency,
  };

  return { accept, ask, refuse };
}
