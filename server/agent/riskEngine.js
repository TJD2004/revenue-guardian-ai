/**
 * Risk Engine for RevenueGuardian AI
 */

export function classifyFailure(reason, type) {
  const r = (reason || '').toLowerCase();
  
  if (r.includes('invalid_account') || r.includes('closed_account') || r.includes('fraud') || r.includes('permanently') || r.includes('stolen') || r.includes('blocked_card')) {
    return 'hard_failure';
  }
  
  if (r.includes('timeout') || r.includes('network') || r.includes('bank_down') || r.includes('gateway_error') || r.includes('temporary') || r.includes('processing')) {
    return 'temporary';
  }

  return 'recoverable';
}

export function calculateRiskScore(event, customer = {}) {
  let score = 30;

  const classification = classifyFailure(event.failureReason, event.type);
  if (classification === 'hard_failure') score += 45;
  if (classification === 'recoverable') score += 20;
  if (classification === 'temporary') score += 5;

  const amount = Number(event.amount) || 0;
  if (amount > 50000) score += 20;
  else if (amount > 10000) score += 10;
  else if (amount > 5000) score += 5;

  const daysOverdue = Number(event.daysOverdue || 0);
  if (daysOverdue > 30) score += 25;
  else if (daysOverdue > 14) score += 15;
  else if (daysOverdue > 7) score += 10;

  const attempts = Number(event.retryCount || 0) + Number(event.reminderCount || 0);
  score += attempts * 5;

  if (customer.successfulPaymentsCount > 5) score -= 15;
  if (customer.creditScore > 750) score -= 10;

  return Math.min(Math.max(Math.round(score), 5), 98);
}

export function calculateRecoveryProbability(event, customer = {}) {
  const classification = classifyFailure(event.failureReason, event.type);

  if (classification === 'hard_failure') {
    return 0.05;
  }

  let probability = 0.75;

  if (classification === 'temporary') {
    probability = 0.92;
  } else if (classification === 'recoverable') {
    if ((event.failureReason || '').includes('insufficient_funds')) {
      probability = 0.78;
    } else if ((event.failureReason || '').includes('expired_card')) {
      probability = 0.85;
    } else if ((event.failureReason || '').includes('forgot')) {
      probability = 0.88;
    }
  }

  const days = Number(event.daysOverdue || 0);
  if (days > 30) probability -= 0.35;
  else if (days > 14) probability -= 0.20;
  else if (days > 7) probability -= 0.10;

  if (customer.successfulPaymentsCount > 3) probability += 0.08;
  if (customer.isVIP) probability += 0.05;

  const attempts = (event.retryCount || 0) + (event.reminderCount || 0);
  probability -= attempts * 0.08;

  return Math.min(Math.max(Math.round(probability * 100) / 100, 0.05), 0.98);
}

export function calculateExpectedRecoveryValue(amount, probability) {
  const amt = Number(amount) || 0;
  const prob = Number(probability) || 0;
  return Math.round(amt * prob);
}

export function determinePriority(expectedValue, amount, riskScore) {
  if (expectedValue >= 15000 || amount >= 30000 || riskScore >= 75) {
    return 'High';
  }
  if (expectedValue >= 5000 || amount >= 10000 || riskScore >= 50) {
    return 'Medium';
  }
  return 'Low';
}

export function analyzeEventRisk(event, customer = {}) {
  const failureClassification = classifyFailure(event.failureReason, event.type);
  const riskScore = calculateRiskScore(event, customer);
  const recoveryProbability = calculateRecoveryProbability(event, customer);
  const expectedRecoveryValue = calculateExpectedRecoveryValue(event.amount, recoveryProbability);
  const priority = determinePriority(expectedRecoveryValue, event.amount, riskScore);

  return {
    failureClassification,
    riskScore,
    recoveryProbability,
    recoveryProbabilityPercent: Math.round(recoveryProbability * 100),
    expectedRecoveryValue,
    priority
  };
}
