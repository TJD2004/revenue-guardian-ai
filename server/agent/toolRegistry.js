/**
 * Tool Registry for RevenueGuardian AI Agent
 */

import { analyzeEventRisk } from './riskEngine.js';

export const AGENT_TOOLS_DEFINITIONS = [
  {
    name: 'get_customer_profile',
    description: 'Retrieve full customer profile, VIP status, contact details, and historical payment reliability.',
    parameters: { type: 'object', properties: { customerId: { type: 'string' } }, required: ['customerId'] }
  },
  {
    name: 'get_customer_payment_history',
    description: 'Retrieve customer past successful transactions, failure history, and credit score.',
    parameters: { type: 'object', properties: { customerId: { type: 'string' } }, required: ['customerId'] }
  },
  {
    name: 'get_revenue_event',
    description: 'Get details of a specific lost/failed revenue event.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' } }, required: ['eventId'] }
  },
  {
    name: 'calculate_recovery_probability',
    description: 'Calculate statistical probability (0-1.0) of recovering this revenue event.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' } }, required: ['eventId'] }
  },
  {
    name: 'calculate_expected_recovery_value',
    description: 'Calculate Expected Recovery Value = Amount * Recovery Probability.',
    parameters: { type: 'object', properties: { amount: { type: 'number' }, probability: { type: 'number' } }, required: ['amount', 'probability'] }
  },
  {
    name: 'generate_payment_link',
    description: 'Generate a secure Razorpay payment link for the customer with an optional discount incentive.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, discountPercent: { type: 'number' } }, required: ['eventId'] }
  },
  {
    name: 'schedule_payment_retry',
    description: 'Schedule an automated payment retry after a specified delay.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, delayDays: { type: 'number' } }, required: ['eventId', 'delayDays'] }
  },
  {
    name: 'generate_email',
    description: 'Draft a dynamic, personalized recovery email for the customer.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, tone: { type: 'string' } }, required: ['eventId'] }
  },
  {
    name: 'generate_sms',
    description: 'Draft a short, actionable SMS reminder with a payment link.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' } }, required: ['eventId'] }
  },
  {
    name: 'generate_hinglish_message',
    description: 'Draft a culturally relevant Hinglish/Hindi reminder for Indian customers.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' } }, required: ['eventId'] }
  },
  {
    name: 'create_followup',
    description: 'Create a scheduled follow-up reminder for a Promise-to-Pay date.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, promiseDate: { type: 'string' } }, required: ['eventId', 'promiseDate'] }
  },
  {
    name: 'mark_payment_recovered',
    description: 'Mark the revenue event as successfully recovered.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, recoveredAmount: { type: 'number' } }, required: ['eventId', 'recoveredAmount'] }
  },
  {
    name: 'escalate_case',
    description: 'Escalate an overdue case to senior finance/accounts team.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, reason: { type: 'string' } }, required: ['eventId', 'reason'] }
  },
  {
    name: 'close_case',
    description: 'Close the case when recovery is completed or stopping rules are reached.',
    parameters: { type: 'object', properties: { eventId: { type: 'string' }, reason: { type: 'string' } }, required: ['eventId', 'reason'] }
  }
];

class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.initTools();
  }

  initTools() {
    AGENT_TOOLS_DEFINITIONS.forEach(def => {
      this.tools.set(def.name, def);
    });
  }

  getTool(name) {
    return this.tools.get(name);
  }

  getDefinitions() {
    return AGENT_TOOLS_DEFINITIONS;
  }

  validateArgs(toolName, args) {
    const def = this.getTool(toolName);
    if (!def) {
      return { valid: false, error: `Tool '${toolName}' not found in registry.` };
    }

    const required = def.parameters.required || [];
    for (const req of required) {
      if (args[req] === undefined || args[req] === null) {
        return { valid: false, error: `Missing required argument '${req}' for tool '${toolName}'.` };
      }
    }

    return { valid: true };
  }
}

export const toolRegistry = new ToolRegistry();
