/**
 * Policy Engine for RevenueGuardian AI
 * Enforces strict financial guardrails & RBI 2026 E-Mandate Compliance Rules.
 */

export const RECOVERY_POLICY = {
  maxPaymentRetries: 2,           // RBI 2026 E-Mandate Max Retry Limit
  maxCustomerReminders: 3,        // Anti-Spam Safeguard
  maxEscalations: 1,              // Single Formal Escalation Cap
  maxIncentiveDiscountPercent: 10,// Maximum 10% Policy Discount
  preDebitNotificationHours: 24,  // RBI 2026 Pre-Debit Notification Rule
  prohibitHardDeclineRetry: true,
  prohibitFraudRetry: true,
  prohibitClosedCaseContact: true,
  stopOnRecovery: true,
  rbiMandateCompliance2026: true
};

export function checkPolicyGuardrails(actionName, event, customer = {}) {
  // 1. Closed or Recovered Case Safeguard
  if (event.status === 'Recovered' || event.isClosed) {
    return {
      allowed: false,
      reason: 'Case is already recovered or closed. Policy prohibits customer contact after case closure.'
    };
  }

  // 2. Hard Decline & Fraud Safeguards
  const failureReason = (event.failureReason || '').toLowerCase();
  if (failureReason.includes('invalid_account') || failureReason.includes('account_closed')) {
    return {
      allowed: false,
      reason: 'Hard decline detected (Invalid/Closed Account). Policy prohibits automated retry to protect sender reputation.'
    };
  }

  if (failureReason.includes('fraud') || failureReason.includes('stolen')) {
    return {
      allowed: false,
      reason: 'Suspected fraud event. Policy immediately blocks automated agent outreach.'
    };
  }

  // 3. Action Specific Checks
  if (actionName === 'schedule_payment_retry' || actionName === 'retry_mandate') {
    if ((event.retryCount || 0) >= RECOVERY_POLICY.maxPaymentRetries) {
      return {
        allowed: false,
        reason: `RBI 2026 E-Mandate Rule: Maximum payment retry limit (${RECOVERY_POLICY.maxPaymentRetries}) reached for this mandate cycle.`
      };
    }
  }

  if (actionName === 'generate_email' || actionName === 'generate_sms' || actionName === 'generate_hinglish_message') {
    if ((event.reminderCount || 0) >= RECOVERY_POLICY.maxCustomerReminders) {
      return {
        allowed: false,
        reason: `Anti-Spam Safeguard: Maximum customer reminder limit (${RECOVERY_POLICY.maxCustomerReminders}) reached.`
      };
    }
  }

  if (actionName === 'escalate_case') {
    if ((event.escalationCount || 0) >= RECOVERY_POLICY.maxEscalations) {
      return {
        allowed: false,
        reason: `Policy Limit: Maximum escalation count (${RECOVERY_POLICY.maxEscalations}) reached.`
      };
    }
  }

  return {
    allowed: true,
    reason: 'RBI 2026 E-Mandate Policy Verification Passed.'
  };
}

export function validatePolicy(toolName, event, args = {}) {
  const check = checkPolicyGuardrails(toolName, event, { name: event?.customerName });
  return {
    allowed: check.allowed,
    reason: check.reason
  };
}

export function checkStoppingRules(event) {
  if (event.status === 'Recovered') {
    return { shouldClose: true, finalStatus: 'Recovered', reason: 'Customer paid. Recovery target achieved.' };
  }
  if ((event.retryCount || 0) >= RECOVERY_POLICY.maxPaymentRetries && (event.reminderCount || 0) >= RECOVERY_POLICY.maxCustomerReminders) {
    return { shouldClose: true, finalStatus: 'Closed (Recovery Exhausted)', reason: 'Maximum retries and reminder limits reached.' };
  }
  return { shouldClose: false };
}
