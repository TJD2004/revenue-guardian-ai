/**
 * Agent Planner for RevenueGuardian AI
 */

import { aiService } from '../services/aiService.js';
import { analyzeEventRisk } from './riskEngine.js';

export async function planRecoveryStrategy(event, customer, options = {}) {
  const riskAnalysis = analyzeEventRisk(event, customer);
  const { failureClassification, riskScore, recoveryProbability, expectedRecoveryValue } = riskAnalysis;

  if (aiService.isConfigured() && !options.forceRuleEngine) {
    const systemPrompt = `You are RevenueGuardian AI, an autonomous revenue recovery agent.
Analyze the customer & revenue event details, diagnose the root cause, determine the optimal recovery strategy, and select exact tool calls.
Return JSON with this schema:
{
  "diagnosis": "string explanation",
  "recommendedStrategy": "string title",
  "toolSequence": ["tool_name_1", "tool_name_2"],
  "reasoning": "step-by-step reasoning",
  "outreachConfig": {
    "tone": "friendly|urgent|formal|incentive",
    "discountPercent": 0,
    "delayDays": 0
  }
}`;

    const prompt = `Revenue Event Details:
Customer: ${customer.name} (${customer.id})
Amount: ₹${event.amount}
Type: ${event.type}
Failure Reason: ${event.failureReason}
Days Overdue: ${event.daysOverdue}
Risk Score: ${riskScore}/100
Recovery Probability: ${Math.round(recoveryProbability * 100)}%
Expected Recovery: ₹${expectedRecoveryValue}

Determine bounded recovery plan.`;

    const aiRes = await aiService.generateCompletion({ systemPrompt, prompt, jsonMode: true });

    if (aiRes.success && aiRes.data) {
      return {
        mode: 'AI (Groq Llama 3.3 70B)',
        diagnosis: aiRes.data.diagnosis,
        recommendedStrategy: aiRes.data.recommendedStrategy,
        toolSequence: aiRes.data.toolSequence || [],
        reasoning: aiRes.data.reasoning,
        outreachConfig: aiRes.data.outreachConfig || {},
        riskAnalysis
      };
    }
  }

  let diagnosis = '';
  let recommendedStrategy = '';
  let toolSequence = [];
  let reasoning = '';
  let outreachConfig = { tone: 'friendly', discountPercent: 0, delayDays: 1 };

  const reasonLower = (event.failureReason || '').toLowerCase();
  const typeLower = (event.type || '').toLowerCase();

  if (failureClassification === 'hard_failure') {
    diagnosis = 'Hard decline or unrecoverable account failure detected.';
    recommendedStrategy = 'Close Case - Recovery Exhausted';
    toolSequence = ['close_case'];
    reasoning = 'Customer payment method is invalid or blocked. Policy blocks automated retries to protect sender reputation.';
  } else if (typeLower.includes('checkout') || reasonLower.includes('abandoned')) {
    diagnosis = 'Checkout abandoned prior to payment completion.';
    recommendedStrategy = 'Checkout Recovery Engine: Dynamic Link + 5% Incentive';
    toolSequence = ['generate_payment_link', 'generate_sms', 'generate_hinglish_message'];
    reasoning = 'Customer demonstrated high purchase intent. High conversion expected with instant payment link and 5% discount.';
    outreachConfig = { tone: 'incentive', discountPercent: 5, delayDays: 0 };
  } else if (typeLower.includes('subscription') || reasonLower.includes('subscription')) {
    diagnosis = 'Automated recurring subscription mandate failed.';
    recommendedStrategy = 'Subscription Rescue Engine: Smart Retry Schedule';
    toolSequence = ['schedule_payment_retry', 'generate_email', 'generate_hinglish_message'];
    reasoning = 'Failure caused by temporary bank shortage or gateway timeout. Retry scheduled after 3 days with friendly reminder.';
    outreachConfig = { tone: 'friendly', discountPercent: 0, delayDays: 3 };
  } else if (typeLower.includes('invoice') || reasonLower.includes('invoice') || event.daysOverdue > 14) {
    diagnosis = 'B2B Invoice payment overdue beyond payment terms.';
    recommendedStrategy = 'B2B Escalating Outreach & Promise-to-Pay Request';
    toolSequence = ['generate_email', 'create_followup'];
    reasoning = 'Formal invoice reminder with Promise-to-Pay capture. Prepares escalation if unpaid within 5 business days.';
    outreachConfig = { tone: 'formal', discountPercent: 0, delayDays: 2 };
  } else if (reasonLower.includes('insufficient_funds')) {
    diagnosis = 'Temporary balance shortage on customer account.';
    recommendedStrategy = 'Salary Date Retry + Friendly Hinglish Reminder';
    toolSequence = ['schedule_payment_retry', 'generate_hinglish_message'];
    reasoning = 'Customer historically completes payments after salary credit. Retry scheduled after 3 days.';
    outreachConfig = { tone: 'friendly', discountPercent: 0, delayDays: 3 };
  } else {
    diagnosis = 'Temporary gateway processing delay or UPI timeout.';
    recommendedStrategy = 'Instant Razorpay Payment Link Generation';
    toolSequence = ['generate_payment_link', 'generate_sms'];
    reasoning = 'Network drop during transaction. Direct payment link offers smooth recovery path.';
    outreachConfig = { tone: 'friendly', discountPercent: 0, delayDays: 0 };
  }

  return {
    mode: 'Rule Engine Mode (Deterministic Fallback)',
    diagnosis,
    recommendedStrategy,
    toolSequence,
    reasoning,
    outreachConfig,
    riskAnalysis
  };
}
