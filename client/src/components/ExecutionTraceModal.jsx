import React from 'react';
import { X, CheckCircle2, ShieldAlert, Cpu, ArrowRight, Activity, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export function ExecutionTraceModal({ trace, onClose }) {
  if (!trace) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-white">AI Agent Execution Trace</h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  Event #{trace.eventId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customer: <span className="text-white font-medium">{trace.customerName}</span> ({trace.customerId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trace Metadata Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(trace.timestamp).toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Latency: {trace.executionTimeMs || 142} ms
            </span>
          </div>
          {trace.totalRecovered > 0 && (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 border border-emerald-200">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Recovered: ₹{trace.totalRecovered.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Trace Steps Stream */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {trace.steps && trace.steps.map((step, idx) => {
            const isBlocked = step.status === 'blocked';
            const isSuccess = step.status === 'success';

            return (
              <div key={idx} className="relative flex items-start space-x-4">
                {idx < trace.steps.length - 1 && (
                  <div className="absolute left-4 top-8 -bottom-4 w-0.5 bg-slate-200" />
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    isBlocked
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : isSuccess
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  }`}
                >
                  {step.stepIndex}
                </div>

                <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      {step.title}
                      {isBlocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                          POLICY BLOCKED
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400">{step.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-slate-200/80">
                    {step.details}
                  </p>

                  {step.data && (
                    <div className="pt-1 text-[11px] text-slate-500 font-mono flex flex-wrap gap-2">
                      {Object.entries(step.data).map(([key, val]) => {
                        if (typeof val === 'object' || val === null) return null;
                        return (
                          <span key={key} className="bg-slate-200/60 px-2 py-0.5 rounded text-slate-700">
                            {key}: <strong className="text-slate-900">{String(val)}</strong>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors"
          >
            Close Execution Trace
          </button>
        </div>

      </div>
    </div>
  );
}
