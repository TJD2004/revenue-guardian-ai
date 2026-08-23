/**
 * Audit Logger for RevenueGuardian AI
 * Maintains an immutable log of all agent decisions, policy checks, tool invocations, and outcomes.
 */

class AuditLogger {
  constructor() {
    this.logs = [];
    this.sequence = 1;
  }

  log({
    customerId,
    eventId,
    customerName,
    agentDecision,
    toolCalled = null,
    toolArguments = null,
    policyDecision = 'PASSED',
    policyReason = null,
    action,
    result,
    recoveredAmount = 0
  }) {
    const entry = {
      id: `AUD-${Date.now()}-${this.sequence++}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      customerId,
      eventId,
      customerName: customerName || customerId,
      agentDecision,
      toolCalled,
      toolArguments: toolArguments ? JSON.stringify(toolArguments) : null,
      policyDecision,
      policyReason,
      action,
      result,
      recoveredAmount: Number(recoveredAmount) || 0
    };

    this.logs.unshift(entry);
    return entry;
  }

  getLogs(filters = {}) {
    let result = [...this.logs];

    if (filters.customerId) {
      result = result.filter(l => l.customerId === filters.customerId);
    }
    if (filters.eventId) {
      result = result.filter(l => l.eventId === filters.eventId);
    }
    if (filters.policyDecision) {
      result = result.filter(l => l.policyDecision === filters.policyDecision);
    }
    if (filters.action) {
      result = result.filter(l => l.action.toLowerCase().includes(filters.action.toLowerCase()));
    }
    if (filters.onlyRecovered) {
      result = result.filter(l => l.recoveredAmount > 0);
    }

    return result;
  }

  clear() {
    this.logs = [];
    this.sequence = 1;
  }
}

export const auditLogger = new AuditLogger();
