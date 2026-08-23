import React from 'react';
import { Shield, Play, Bot, ArrowRight, Zap, TrendingUp, CheckCircle2, Lock, Cpu, Sparkles, Layers } from 'lucide-react';

export function LandingPage({ navigate, onRunSimulation }) {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Razorpay Buildathon 2026 — Track 03: AI Revenue Recovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Don't just detect lost revenue. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Recover it.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl font-normal">
            An autonomous AI agent that finds revenue at risk, diagnoses failure root causes, chooses bounded intervention workflows, enforces strict financial policy guardrails, and measures actual recovered money.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onRunSimulation()}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run Recovery Simulation</span>
            </button>

            <button
              onClick={() => navigate('/agent')}
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl flex items-center space-x-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>View Agent Activity</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3.5 text-slate-300 hover:text-white font-medium text-sm flex items-center space-x-1"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight KPI Overlay */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400">Revenue At Risk</p>
            <p className="text-2xl font-extrabold text-white mt-1">₹1,50,000</p>
            <p className="text-[11px] text-slate-400 mt-1">500+ Synthetic Events Analyzed</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400">Revenue Recovered</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹92,500</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Attributable Money Recovered</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <p className="text-xs font-medium text-slate-400">Recovery Rate</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">61.7%</p>
            <p className="text-[11px] text-indigo-300/80 mt-1">Autonomous Strategy Success</p>
          </div>
        </div>
      </div>

      {/* Core Loop Architecture Diagram */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Autonomous Core Architecture</h2>
          <p className="text-xs text-slate-500">Every revenue event flows through bounded decision guardrails</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 pt-2">
          {[
            { step: '1. DETECT', desc: 'Identify lost revenue event', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
            { step: '2. DIAGNOSE', desc: 'Analyze failure root cause', color: 'bg-sky-50 border-sky-200 text-sky-800' },
            { step: '3. DECIDE', desc: 'Select recovery strategy', color: 'bg-violet-50 border-violet-200 text-violet-800' },
            { step: '4. ACT', desc: 'Execute bounded tool', color: 'bg-amber-50 border-amber-200 text-amber-800' },
            { step: '5. RECOVER', desc: 'Razorpay Payment Link', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
            { step: '6. VERIFY', desc: 'Confirm payment status', color: 'bg-teal-50 border-teal-200 text-teal-800' },
            { step: '7. AUDIT', desc: 'Immutable audit entry', color: 'bg-slate-100 border-slate-300 text-slate-800' }
          ].map((item, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between space-y-2 shadow-xs`}>
              <span className="font-bold text-xs tracking-tight">{item.step}</span>
              <p className="text-[11px] font-medium leading-tight opacity-90">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Minute Judge Demo Guide Card */}
      <div className="fintech-card p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-900 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
            3M
          </div>
          <div>
            <h3 className="font-bold text-base text-white">3-Minute Hackathon Judge Demo Walkthrough</h3>
            <p className="text-xs text-slate-300">Follow these simple steps to verify full autonomous recovery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
            <span className="font-bold text-indigo-300">Step 1: Check Baseline</span>
            <p>View total revenue at risk (₹1.5L) on the Dashboard or Recovery Table.</p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
            <span className="font-bold text-indigo-300">Step 2: Run Recovery Simulation</span>
            <p>Click "Run Recovery Simulation" to process events with Groq AI & bounded policies.</p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
            <span className="font-bold text-indigo-300">Step 3: Inspect Execution Trace</span>
            <p>Open the AI Agent Panel or Audit Trail to verify step-by-step reasoning & guardrails.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
