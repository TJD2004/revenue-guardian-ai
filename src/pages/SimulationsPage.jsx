import React, { useState } from 'react';
import { Play, RotateCcw, Zap, Sparkles, Send, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import confetti from 'canvas-confetti';

export function SimulationsPage({ onRunSimulation, onResetSimulation }) {
  const [batchSize, setBatchSize] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Webhook Simulator State
  const [webhookEvent, setWebhookEvent] = useState('payment.failed');
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [amount, setAmount] = useState(5000);
  const [failureReason, setFailureReason] = useState('insufficient_funds');
  const [webhookResponse, setWebhookResponse] = useState(null);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const handleRunBatch = async () => {
    setIsRunning(true);
    try {
      const res = await api.runBatchSimulation(batchSize);
      setLastResult(res);
      if (res.newlyRecoveredAmount > 0) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDispatchWebhook = async (e) => {
    e.preventDefault();
    setIsSendingWebhook(true);
    try {
      const res = await api.triggerWebhook({
        event: webhookEvent,
        customerName,
        amount,
        failureReason,
        type: webhookEvent === 'subscription.halted' ? 'Failed Subscription' :
              webhookEvent === 'order.abandoned' ? 'Checkout Abandonment' :
              webhookEvent === 'invoice.overdue' ? 'Overdue Invoice' : 'Failed Payment'
      });
      setWebhookResponse(res);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (err) {
      alert('Error dispatching webhook: ' + err.message);
    } finally {
      setIsSendingWebhook(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Simulation & Webhook Sandbox</h1>
          <p className="text-xs text-slate-500 mt-1">
            Test real-time Razorpay Webhook events & batch recovery simulations
          </p>
        </div>
      </div>

      {/* Grid: Webhook Dispatcher & Batch Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Live Webhook Event Dispatcher */}
        <div className="fintech-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Send className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Live Razorpay Webhook Simulator</h3>
              <p className="text-xs text-slate-500">Dispatch live HTTP webhook payloads to trigger autonomous AI agent processing</p>
            </div>
          </div>

          <form onSubmit={handleDispatchWebhook} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Webhook Event Type</label>
              <select
                value={webhookEvent}
                onChange={(e) => setWebhookEvent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none"
              >
                <option value="payment.failed">payment.failed (Failed Payment)</option>
                <option value="subscription.halted">subscription.halted (Failed Subscription)</option>
                <option value="order.abandoned">order.abandoned (Checkout Abandonment)</option>
                <option value="invoice.overdue">invoice.overdue (Overdue Invoice)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Failure Reason Code</label>
              <select
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
              >
                <option value="insufficient_funds">insufficient_funds</option>
                <option value="upi_timeout">upi_timeout</option>
                <option value="bank_server_down">bank_server_down</option>
                <option value="card_expired">card_expired</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSendingWebhook}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {isSendingWebhook ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Dispatching Webhook...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Webhook to Agent</span>
                </>
              )}
            </button>
          </form>

          {webhookResponse && (
            <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs font-mono space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1">
                <span>Webhook Ingested & Agent Executed!</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-indigo-300">Created Event ID: {webhookResponse.createdEvent.id}</p>
              <p className="text-slate-300">Strategy Executed: {webhookResponse.agentResult.recommendedStrategy}</p>
              <p className="text-emerald-400 font-bold">Money Recovered: ₹{webhookResponse.agentResult.recoveredAmount.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>

        {/* Right: Batch Simulation Runner */}
        <div className="fintech-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Batch Recovery Simulator</h3>
              <p className="text-xs text-slate-500">Run parallel agent recovery executions across open benchmark cases</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batch Size (Cases)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleRunBatch}
                disabled={isRunning}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Batch Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={onResetSimulation}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200"
                title="Reset dataset to initial 500 cases"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {lastResult && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800">Batch Simulation Results:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Processed Cases: <strong>{lastResult.processedCount}</strong></div>
                  <div>Successful Recoveries: <strong className="text-emerald-600">{lastResult.recoveredCount}</strong></div>
                  <div>Newly Recovered: <strong className="text-emerald-700">₹{(lastResult.newlyRecoveredAmount || 0).toLocaleString('en-IN')}</strong></div>
                  <div>Policy Blocks: <strong className="text-rose-600">{lastResult.blockedCount || 0}</strong></div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
