/**
 * Recovery Engine for RevenueGuardian AI
 */

import { validatePolicy, checkStoppingRules } from './policyEngine.js';
import { auditLogger } from './auditLogger.js';

export function executeRecoveryTool(toolName, args, event, customer, options = {}) {
  const policyCheck = validatePolicy(toolName, event, args);

  if (!policyCheck.allowed) {
    auditLogger.log({
      customerId: event.customerId,
      eventId: event.id,
      customerName: customer.name,
      agentDecision: `Attempted tool call: ${toolName}`,
      toolCalled: toolName,
      toolArguments: args,
      policyDecision: 'BLOCKED',
      policyReason: policyCheck.reason,
      action: `Blocked ${toolName}`,
      result: `Blocked by Policy Guardrails: ${policyCheck.reason}`,
      recoveredAmount: 0
    });

    return {
      success: false,
      blocked: true,
      policyReason: policyCheck.reason,
      message: policyCheck.reason
    };
  }

  let resultData = {};
  let actionDescription = '';
  let recoveredAmount = 0;

  switch (toolName) {
    case 'generate_payment_link':
      const discount = args.discountPercent || 0;
      const finalAmount = Math.round(event.amount * (1 - discount / 100));
      const payLink = `https://rzp.io/i/rg_${event.id.slice(-6)}_${Date.now().toString().slice(-4)}`;
      event.paymentLink = payLink;
      event.discountApplied = discount;
      event.reminderCount = (event.reminderCount || 0) + 1;
      actionDescription = `Generated Razorpay Link (${payLink}) with ${discount}% discount.`;
      resultData = { paymentLink: payLink, finalAmount };
      break;

    case 'schedule_payment_retry':
      event.retryCount = (event.retryCount || 0) + 1;
      event.nextRetryDate = new Date(Date.now() + (args.delayDays || 1) * 86400000).toISOString().split('T')[0];
      actionDescription = `Scheduled Payment Retry #${event.retryCount} for ${event.nextRetryDate}.`;
      resultData = { retryCount: event.retryCount, nextRetryDate: event.nextRetryDate };
      break;

    case 'generate_email':
      event.reminderCount = (event.reminderCount || 0) + 1;
      actionDescription = `Sent personalized recovery email to ${customer.email || 'customer'}.`;
      resultData = {
        subject: `Payment Pending – Quick Action Required (Ref: ${event.id})`,
        body: `Dear ${customer.name},\n\nWe noticed your payment of ₹${event.amount} for ${event.type} was not completed. Click here to complete payment: ${event.paymentLink || 'https://rzp.io/i/rg_demo'}`
      };
      break;

    case 'generate_sms':
      event.reminderCount = (event.reminderCount || 0) + 1;
      actionDescription = `Sent SMS payment reminder to ${customer.phone || customer.name}.`;
      resultData = {
        smsText: `RevenueGuardian Alert: Dear ${customer.name}, payment of ₹${event.amount} is pending. Pay now: ${event.paymentLink || 'https://rzp.io/i/rg_demo'}`
      };
      break;

    case 'generate_hinglish_message':
      event.reminderCount = (event.reminderCount || 0) + 1;
      actionDescription = `Sent Hinglish WhatsApp message to ${customer.name}.`;
      resultData = {
        message: `Namaste ${customer.name} ji, aapka ₹${event.amount} ka payment complete nahi ho paya tha. Complete quickly via: ${event.paymentLink || 'https://rzp.io/i/rg_demo'}`
      };
      break;

    case 'create_followup':
      event.promiseToPayDate = args.promiseDate;
      event.status = 'Promise-to-Pay Scheduled';
      actionDescription = `Recorded Promise-to-Pay for ${args.promiseDate}.`;
      resultData = { promiseDate: args.promiseDate };
      break;

    case 'mark_payment_recovered':
      recoveredAmount = args.recoveredAmount || event.amount;
      event.status = 'Recovered';
      event.recoveredAmount = recoveredAmount;
      event.recoveredAt = new Date().toISOString();
      event.isClosed = true;
      actionDescription = `Successfully recovered ₹${recoveredAmount.toLocaleString('en-IN')}.`;
      resultData = { recoveredAmount, status: 'Recovered' };
      break;

    case 'escalate_case':
      event.escalationCount = (event.escalationCount || 0) + 1;
      event.status = 'Escalated to Finance';
      actionDescription = `Escalated case to Finance. Reason: ${args.reason || 'Overdue limits'}`;
      resultData = { escalationReason: args.reason };
      break;

    case 'close_case':
      event.status = event.status === 'Recovered' ? 'Recovered' : 'Closed (Recovery Exhausted)';
      event.isClosed = true;
      actionDescription = `Case closed. Reason: ${args.reason || 'Workflow completed'}`;
      resultData = { isClosed: true, reason: args.reason };
      break;

    default:
      actionDescription = `Executed tool ${toolName}`;
      resultData = { status: 'Executed' };
  }

  const stoppingCheck = checkStoppingRules(event);
  if (stoppingCheck.shouldClose && !event.isClosed) {
    event.status = stoppingCheck.finalStatus;
    event.isClosed = true;
    actionDescription += ` [Stopping Rule Triggered: ${stoppingCheck.reason}]`;
  }

  auditLogger.log({
    customerId: event.customerId,
    eventId: event.id,
    customerName: customer.name,
    agentDecision: `Executed ${toolName}`,
    toolCalled: toolName,
    toolArguments: args,
    policyDecision: 'PASSED',
    action: actionDescription,
    result: JSON.stringify(resultData),
    recoveredAmount
  });

  return {
    success: true,
    actionDescription,
    resultData,
    recoveredAmount,
    eventState: event
  };
}
