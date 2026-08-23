import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, DollarSign, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { api } from '../api/client';
import confetti from 'canvas-confetti';

export function DemoScenariosBar({ onScenarioComplete }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runScenario = async (scenarioId) => {
    setIsRunning(true);
    setActiveScenario(scenarioId);

    try {
      if (scenarioId === 'sub') {
        // Scenario 1: Failed Subscription (₹2,500)
        const events = await api.getEvents({ type: 'Failed Subscription', limit: 1 });
        if (events[0]) {
          await api.processEvent(events[0].id, true);
        }
      } else if (scenarioId === 'checkout') {
        // Scenario 2: Abandoned Checkout (₹1,200)
        const events = await api.getEvents({ type: 'Checkout Abandonment', limit: 1 });
        if (events[0]) {
          await api.processEvent(events[0].id, true);
        }
      } else if (scenarioId === 'invoice') {
        // Scenario 3: Overdue B2B Invoice (₹50,000)
        const events = await api.getEvents({ type: 'Overdue Invoice', limit: 1 });
        if (events[0]) {
          await api.processEvent(events[0].id, true);
        }
      } else if (scenarioId === 'all') {
        // Run Full 3-Step Demo Sequence
        await api.runBatchSimulation(3);
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onScenarioComplete) onScenarioComplete();
    } catch (err) {
      console.error('Error running demo scenario:', err);
    } finally {
      setIsRunning(false);
      setActiveScenario(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/60 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Title */}
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">Judge Demo Controller:</span>
          <span className="text-slate-300 hidden md:inline">Test 1-Click Autonomous Recovery Scenarios</span>
        </div>

        {/* 3 Scenario Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          
          <button
            onClick={() => runScenario('sub')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg border font-semibold text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeScenario === 'sub'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span>🔄 Mandate Retry (₹2.5K)</span>
          </button>

          <button
            onClick={() => runScenario('checkout')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg border font-semibold text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeScenario === 'checkout'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span>🛒 Cart Incentive (₹1.2K)</span>
          </button>

          <button
            onClick={() => runScenario('invoice')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg border font-semibold text-[11px] whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeScenario === 'invoice'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span>💼 B2B Chaser (₹50K)</span>
          </button>

          <button
            onClick={() => runScenario('all')}
            disabled={isRunning}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-extrabold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Run All 3</span>
          </button>

        </div>

      </div>
    </div>
  );
}
