import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert, CheckCircle2, Filter, Search, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

export function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [policyFilter, setPolicyFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs({
        policyDecision: policyFilter !== 'All' ? policyFilter : undefined,
        search
      });
      setLogs(data);
    } catch (err) {
      console.error('Failed fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [policyFilter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Immutable Compliance & Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of every AI agent decision, policy guardrail validation, tool call, and recovered financial outcome
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fintech-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search action or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Policy Filter:</span>
          {['All', 'PASSED', 'BLOCKED'].map((p) => (
            <button
              key={p}
              onClick={() => setPolicyFilter(p)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                policyFilter === p
                  ? p === 'BLOCKED'
                    ? 'bg-rose-600 text-white'
                    : 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p === 'BLOCKED' ? 'Blocked Guardrails' : p}
            </button>
          ))}
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="fintech-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
            Loading immutable audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No audit records found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Customer & Event</th>
                  <th className="py-3.5 px-4">Policy Status</th>
                  <th className="py-3.5 px-4">Tool Called</th>
                  <th className="py-3.5 px-4">Action Summary</th>
                  <th className="py-3.5 px-4 text-right">Recovered ₹</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {logs.map((log, idx) => {
                  const isBlocked = log.policyDecision === 'BLOCKED';

                  return (
                    <tr key={`${log.id}-${idx}`} className={`hover:bg-slate-50 transition-colors ${isBlocked ? 'bg-rose-50/30' : ''}`}>
                      
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                        <span className="block text-[9px] text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </td>

                      <td className="py-3.5 px-4 font-sans font-semibold text-slate-900">
                        {log.customerName}
                        <span className="block text-[10px] text-slate-400 font-mono">{log.eventId}</span>
                      </td>

                      <td className="py-3.5 px-4 font-sans">
                        {isBlocked ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200 inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            BLOCKED BY POLICY
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PASSED
                          </span>
                        )}
                        {log.policyReason && (
                          <span className="block text-[10px] text-rose-700 font-sans mt-0.5 max-w-xs leading-tight">
                            {log.policyReason}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-indigo-700 font-bold">
                        {log.toolCalled || 'agent_planner'}
                      </td>

                      <td className="py-3.5 px-4 font-sans text-slate-700 max-w-md">
                        {log.action}
                      </td>

                      <td className="py-3.5 px-4 text-right font-sans font-extrabold text-emerald-700">
                        {log.recoveredAmount > 0 ? `+₹${log.recoveredAmount.toLocaleString('en-IN')}` : '—'}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
