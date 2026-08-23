import React, { useState, useEffect } from 'react';
import { Bot, Zap, CheckCircle2, ShieldAlert, Clock, Pause, Play } from 'lucide-react';

const RECENT_ACTIVITIES = [
  { time: 'Just now', text: 'Agent analyzed event #REV-202812 (Rahul Sharma, ₹5,000)', status: 'info' },
  { time: '1s ago', text: 'Policy Guardrail Passed: Max retry count check (1/2)', status: 'success' },
  { time: '3s ago', text: 'Groq Llama 3.3 70B diagnosed: Temporary bank shortage. Selected retry + Hinglish SMS', status: 'info' },
  { time: '6s ago', text: 'Generated Razorpay Payment Link: https://rzp.io/i/rg_812', status: 'success' },
  { time: '9s ago', text: 'Outcome Verified: Customer paid ₹5,000 via UPI! Added to total recovered', status: 'recovered' },
  { time: '12s ago', text: 'Agent inspected B2B Invoice #REV-202901 (Acme India, ₹50,000)', status: 'info' },
  { time: '15s ago', text: 'Policy Guardrail Blocked: Hard decline detected on invalid account', status: 'blocked' }
];

export function AgentActivityTicker() {
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const names = ['Aarav Patel', 'Priya Verma', 'Karan Gupta', 'Neha Singh', 'Siddharth Rao'];
      const types = ['Subscription', 'Checkout', 'Invoice', 'Mandate'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomAmount = Math.floor(1500 + Math.random() * 15000);
      const randomId = Math.floor(202800 + Math.random() * 200);

      const newActivity = {
        time: 'Just now',
        text: `Agent auto-analyzed ${randomType} #${randomId} (${randomName}, ₹${randomAmount.toLocaleString('en-IN')})`,
        status: Math.random() > 0.3 ? 'success' : 'blocked'
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 px-4 py-2 text-xs shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex items-center space-x-1.5 font-bold text-indigo-400 shrink-0">
            <Bot className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Autonomous Ticker:</span>
          </div>

          <div className="flex items-center space-x-2 truncate">
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              activities[0]?.status === 'recovered' ? 'bg-emerald-400 animate-ping' :
              activities[0]?.status === 'blocked' ? 'bg-rose-400' : 'bg-sky-400'
            }`} />
            <span className="font-mono text-slate-200 truncate">{activities[0]?.text}</span>
            <span className="text-[10px] text-slate-400 shrink-0 font-sans">({activities[0]?.time})</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            title={isPlaying ? 'Pause Stream' : 'Resume Stream'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
}
