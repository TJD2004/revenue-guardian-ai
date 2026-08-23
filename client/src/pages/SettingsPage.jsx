import React, { useState } from 'react';
import { ShieldCheck, Lock, Bell, Cpu, Building2, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('gsk_************************************');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agent Settings & Regulatory Guardrails</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure Groq AI model parameters, RBI 2026 E-Mandate compliance rules, and payment guardrails
        </p>
      </div>

      {/* RBI 2026 Compliance Card */}
      <div className="fintech-card p-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl border border-emerald-800/60 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
            <Building2 className="w-5 h-5" />
            <span>RBI 2026 E-Mandate Compliance Framework</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            Active & Verified
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          RevenueGuardian AI automatically operates in accordance with Reserve Bank of India (RBI) circulars on recurring e-mandates, consumer protection, and auto-debit dunning limits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
            <span className="text-emerald-400 font-bold">24-Hour Pre-Debit Safeguard</span>
            <p className="text-[11px] text-slate-300">Requires 24-hour advance SMS/Email notification prior to mandate retry execution.</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
            <span className="text-emerald-400 font-bold">Max 2 Mandate Retry Cap</span>
            <p className="text-[11px] text-slate-300">Enforces RBI 2-retry cap per billing cycle to prevent consumer account depletion.</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
            <span className="text-emerald-400 font-bold">Opt-Out & Revocation Check</span>
            <p className="text-[11px] text-slate-300">Immediately halts retry sequences if e-mandate is revoked by customer bank.</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
            <span className="text-emerald-400 font-bold">Immutable Audit Trail</span>
            <p className="text-[11px] text-slate-300">Logs every mandate check with PASSED vs BLOCKED BY POLICY compliance status.</p>
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <form onSubmit={handleSave} className="fintech-card p-6 space-y-5">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          Groq AI Model Settings
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Groq API Key</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Read from GROQ_API_KEY environment variable</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Configured Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
              <option value="llama3-70b-8192">llama3-70b-8192</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-emerald-600 font-semibold">
            {saved ? '✓ Settings Saved & Fallback Engine Synced!' : ''}
          </span>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>

    </div>
  );
}
