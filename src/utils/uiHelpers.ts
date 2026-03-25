export const getRiskBadgeColor = (risk: string) => {
  if (risk === 'high') return 'bg-red-100 text-red-800 border-red-200';
  if (risk === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-emerald-100 text-emerald-800 border-emerald-200';
};

export const getCardStyle = (type: string) => {
  if (type === 'accept') return 'border-emerald-200 bg-emerald-50';
  if (type === 'ask') return 'border-amber-200 bg-amber-50';
  return 'border-red-200 bg-red-50';
};

export const getDependencyExplanation = (dependencyLevel: string) => {
  const safeDep = dependencyLevel || 'medium';
  if (safeDep === 'high') {
    return "Because dependency is HIGH, refusing carries a significantly higher risk to job stability.";
  } else if (safeDep === 'medium') {
    return "With MEDIUM dependency, refusal carries moderate risk depending on the employer's response.";
  } else {
    return "With LOW dependency, refusal becomes far safer due to your independent flexibility.";
  }
};
