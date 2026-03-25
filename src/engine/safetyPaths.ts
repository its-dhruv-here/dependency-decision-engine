import { SafetyAction } from '../types';

export function getSafetyActions(type: string, severity: string): SafetyAction[] {
  const actions: SafetyAction[] = [];

  // ── Type-specific safety paths ────────────────────────────────────
  if (type === 'harassment' || type === 'abuse') {
    actions.push(
      { label: 'Document the incident with date, time, and details', priority: 'critical' },
      { label: 'Avoid isolated interactions with the person involved', priority: 'critical' },
      { label: 'Keep all written communication as proof', priority: 'critical' },
      { label: 'Contact HR, a support organization, or legal counsel', priority: 'recommended' },
      { label: 'Inform a trusted colleague about the situation', priority: 'recommended' }
    );
  }

  if (type === 'salary_delay') {
    actions.push(
      { label: 'Request a written timeline for pending payment', priority: 'critical' },
      { label: 'Keep records of all salary receipts and delays', priority: 'critical' },
      { label: 'Check employment contract for payment terms', priority: 'recommended' },
      { label: 'File a complaint with the labor authority if delays persist', priority: 'recommended' }
    );
  }

  if (type === 'overtime') {
    actions.push(
      { label: 'Clarify compensation and overtime terms in writing', priority: 'critical' },
      { label: 'Track all extra hours worked with timestamps', priority: 'critical' },
      { label: 'Reference your contract terms for scheduled hours', priority: 'recommended' },
      { label: 'Report unpaid overtime to the labor office if needed', priority: 'optional' }
    );
  }

  if (type === 'workplace_pressure') {
    actions.push(
      { label: 'Document specific instances of excessive demands', priority: 'critical' },
      { label: 'Request a meeting to discuss workload priorities', priority: 'recommended' },
      { label: 'Set clear boundaries on availability and capacity', priority: 'recommended' },
      { label: 'Seek support if pressure includes threats or coercion', priority: 'optional' }
    );
  }

  if (type === 'unclear_instruction') {
    actions.push(
      { label: 'Request written clarification of task requirements', priority: 'recommended' },
      { label: 'Confirm understanding via email before proceeding', priority: 'recommended' },
      { label: 'Document any conflicting instructions received', priority: 'optional' }
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
