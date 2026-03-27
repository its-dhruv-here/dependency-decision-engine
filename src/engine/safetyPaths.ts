import { SafetyAction } from '../types';

export function getSafetyActions(type: string, severity: string): SafetyAction[] {
  const actions: SafetyAction[] = [];

  // ── Type-specific safety paths ────────────────────────────────────
  if (type === 'harassment' || type === 'abuse') {
    actions.push(
      { label: 'Document the exact date, time, and details of the incident immediately', priority: 'critical' },
      { label: 'Avoid being alone with the person involved; stay in public or shared areas', priority: 'critical' },
      { label: 'Save all screen captures, emails, or texts as physical and digital proof', priority: 'critical' },
      { label: 'Notify a trusted support organization or legal representative about the situation', priority: 'recommended' },
      { label: 'Share the details with a colleague you trust to ensure someone else is aware', priority: 'recommended' }
    );
  }

  if (type === 'salary_delay') {
    actions.push(
      { label: 'Send a formal email requesting a specific payment date for your pending salary', priority: 'critical' },
      { label: 'Download and save all recent pay slips and bank statements showing missing payments', priority: 'critical' },
      { label: 'Review your employment contract specifically for late payment clauses', priority: 'recommended' },
      { label: 'Contact the local labor authority to file an official wage claim if delays persist', priority: 'recommended' }
    );
  }

  if (type === 'overtime') {
    actions.push(
      { label: 'Request written confirmation of how extra hours will be compensated before working them', priority: 'critical' },
      { label: 'Maintain a personal log of all extra hours worked with start and end timestamps', priority: 'critical' },
      { label: 'Print a copy of your contract terms regarding scheduled working hours', priority: 'recommended' },
      { label: 'Submit a formal grievance if unpaid overtime becomes a recurring issue', priority: 'optional' }
    );
  }

  if (type === 'workplace_pressure') {
    actions.push(
      { label: 'List every instance where unreasonable demands or threats were made', priority: 'critical' },
      { label: 'Schedule a formal meeting to discuss and prioritize your current workload', priority: 'recommended' },
      { label: 'Communicate your capacity limits clearly in writing to your manager', priority: 'recommended' },
      { label: 'Escalate the issue to a higher authority if pressure includes illegal threats', priority: 'optional' }
    );
  }

  if (type === 'unclear_instruction') {
    actions.push(
      { label: 'Ask for task requirements to be sent via email to avoid misunderstandings', priority: 'recommended' },
      { label: 'Reply to verbal instructions with a summary email to confirm your understanding', priority: 'recommended' },
      { label: 'Note down any conflicting instructions and ask for a single point of truth', priority: 'optional' }
    );
  }

  // ── Severity escalation ───────────────────────────────────────────
  if (severity === 'high' && !actions.some(a => a.label.includes('legal'))) {
    actions.push(
      { label: 'Consider consulting with a legal advisor', priority: 'recommended' }
    );
  }

  return actions;
}
