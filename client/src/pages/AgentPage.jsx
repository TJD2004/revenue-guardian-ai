import React, { useState, useEffect } from 'react';
import { Bot, Cpu, CheckCircle2, ShieldAlert, Activity, Play, Zap, ArrowRight } from 'lucide-react';
import { api } from '../api/client';
import { ExecutionTraceModal } from '../components/ExecutionTraceModal';

export function AgentPage({ navigate, onRunSimulation }) {
  const [stats, setStats] = useState(null);
  const [recentTraces, setRecentTraces] = useState([]);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, eventsData] = await Promise.all([
        api.getStats(),
        api.getEvents({ limit: 10, sortBy: 'expectedValue' })
      ]);
      setStats(statsData);

      const traces = eventsData
        .filter(e => e.lastExecutionTrace)
        .map(e => e.lastExecutionTrace);
      setRecentTraces(traces);
    } catch (err) {
      console.error('Failed to load agent page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Loading AI Recovery Agent Status...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Recovery Agent Control Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600" /> Active & Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous decision engine orchestrating bounded recovery actions & audit logging
          </p>
        </div>

        <button
          onClick={async () => {
            await onRunSimulation();
            loadData();
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Trigger Agent Batch Run</span>
        </button>
      </div>

      {/* Agent Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="fintech-card p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Agent Status</span>
          <p className="text-lg font-black text-emerald-600 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Active
          </p>
          <p className="text-[10px] text-slate-500">Groq Llama-3.3-70B</p>
        </div>

        <div className="fintech-card p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cases Analyzed</span>
          <p className="text-xl font-extrabold text-slate-900">{stats.totalCases}</p>
          <p className="text-[10px] text-slate-500">100% Risk Assessed</p>
        </div>

        <div className="fintech-card p-5 space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 uppercase">Opportunities</span>
          <p className="text-xl font-extrabold text-indigo-700">{stats.openCases}</p>
          <p className="text-[10px] text-indigo-600 font-medium">In Active Workflow</p>
        </div>

        <div className="fintech-card p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Actions Executed</span>
          <p className="text-xl font-extrabold text-slate-900">{stats.totalAttempts}</p>
          <p className="text-[10px] text-slate-500">Tools Dispatched</p>
        </div>

        <div className="fintech-card p-5 space-y-1 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200 col-span-2 md:col-span-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Revenue Recovered</span>
          <p className="text-xl font-extrabold text-emerald-700">₹{stats.totalRecovered.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-emerald-600 font-bold">{stats.recoveryRate}% Success Rate</p>
        </div>
      </div>

      {/* Execution Trace Inspector List */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              Live Agent Execution Traces
            </h3>
            <p className="text-xs text-slate-500">Click any execution trace to inspect full step-by-step LLM reasoning & policy validation</p>
          </div>
        </div>

        {recentTraces.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-slate-200">
            No execution traces captured yet. Click "Trigger Agent Batch Run" above to run decisions and generate traces.
          </div>
        ) : (
          <div className="space-y-3">
            {recentTraces.map((tr, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTrace(tr)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/40 hover:border-indigo-200 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    #{tr.steps?.length || 4}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{tr.customerName}</span>
                      <span className="text-xs text-slate-400">({tr.eventId})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tr.steps?.[1]?.details || 'Risk intelligence & recovery plan executed.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  {tr.totalRecovered > 0 && (
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                      +₹{tr.totalRecovered.toLocaleString('en-IN')}
                    </span>
                  )}
                  <button className="px-3 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded font-medium text-slate-700 transition-colors">
                    Inspect Trace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Execution Trace Modal */}
      {selectedTrace && (
        <ExecutionTraceModal
          trace={selectedTrace}
          onClose={() => setSelectedTrace(null)}
        />
      )}

    </div>
  );
}
