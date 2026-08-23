import React, { useState } from 'react';
import { 
  ShoppingCart, 
  RotateCcw, 
  FileText, 
  Mic, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play,
  Zap
} from 'lucide-react';
import { api } from '../api/client';
import confetti from 'canvas-confetti';

export function EnginesPage({ navigate }) {
  const [activeEngine, setActiveEngine] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunEngine = async (type) => {
    setIsProcessing(true);
    setActiveEngine(type);

    try {
      const events = await api.getEvents({ type, limit: 1 });
      if (events[0]) {
        await api.processEvent(events[0].id, true);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        await api.runBatchSimulation(1);
      }
    } catch (err) {
      console.error('Engine error:', err);
    } finally {
      setIsProcessing(false);
      setActiveEngine(null);
    }
  };

  const engines = [
    {
      id: 'Checkout Abandonment',
      title: 'Checkout Drop-Off Recovery Engine',
      icon: ShoppingCart,
      color: 'from-amber-500 to-amber-600',
      badge: 'High Intent Conversion',
      desc: 'Detects abandoned carts, generates dynamic 5% policy discount links, and dispatches multi-channel short links to recover lost checkout revenue.',
      metrics: '₹24,000 Risk • 88% Recovery Prob'
    },
    {
      id: 'Failed Subscription',
      title: 'Mandate Retry Sequencer & Dunning Engine',
      icon: RotateCcw,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Auto-Debit Dunning',
      desc: 'Schedules smart auto-debit retries based on salary credit cycles (1st/5th) and dispatches polite Hinglish reminders to prevent churn.',
      metrics: '₹42,000 Risk • 82% Recovery Prob'
    },
    {
      id: 'Overdue Invoice',
      title: 'B2B Receivables Escalating Chaser',
      icon: FileText,
      color: 'from-sky-500 to-sky-600',
      badge: 'Structured Escalation',
      desc: 'Orchestrates formal invoice follow-up sequences (Friendly -> Professional -> Formal Legal Notice) with Promise-to-Pay capture.',
      metrics: '₹58,000 Risk • 75% Recovery Prob'
    },
    {
      id: 'Voice Recovery',
      title: 'Hinglish Voice Recovery Studio',
      icon: Mic,
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Browser Audio Ready',
      desc: 'Generates context-aware Hinglish, Hindi, and English recovery call scripts and plays interactive voice calls using browser audio synthesis.',
      metrics: 'SpeechSynthesis API Enabled'
    },
    {
      id: 'Promise-to-Pay Missed',
      title: 'Promise-to-Pay (P2P) Commitment Tracker',
      icon: Calendar,
      color: 'from-violet-500 to-violet-600',
      badge: 'Breach Auto-Followup',
      desc: 'Records promised payment dates, monitors payment status, and automatically triggers next-step recovery actions if promised dates are missed.',
      metrics: 'Auto-Breach Monitoring'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Specialized Recovery Engines</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200">
              Track 03 Directions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            5 specialized AI revenue recovery modules designed for Razorpay Buildathon 2026
          </p>
        </div>
      </div>

      {/* Engine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engines.map((eng) => {
          const Icon = eng.icon;
          const isCurrent = activeEngine === eng.id;

          return (
            <div key={eng.id} className="fintech-card p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300">
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${eng.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    {eng.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{eng.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{eng.desc}</p>
                </div>

              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 font-mono">{eng.metrics}</span>
                
                {eng.id === 'Voice Recovery' ? (
                  <button
                    onClick={() => navigate('/voice')}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Open Voice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRunEngine(eng.id)}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    {isCurrent ? (
                      <>
                        <Zap className="w-3.5 h-3.5 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Run Engine</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
