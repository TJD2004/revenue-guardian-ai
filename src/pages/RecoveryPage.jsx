import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  TrendingUp, 
  Bot, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ArrowUpDown,
  ExternalLink,
  Zap,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';
import { ExecutionTraceModal } from '../components/ExecutionTraceModal';
import { PromiseToPayModal } from '../components/PromiseToPayModal';
import { RazorpayCheckoutModal } from '../components/RazorpayCheckoutModal';

export function RecoveryPage({ navigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('expectedValue');

  // Active Modals
  const [traceModalEvent, setTraceModalEvent] = useState(null);
  const [p2pModalEvent, setP2pModalEvent] = useState(null);
  const [checkoutModalEvent, setCheckoutModalEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents({
        type: selectedType,
        status: selectedStatus,
        search,
        sortBy
      });
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch recovery events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedType, selectedStatus, sortBy, search]);

  const handleProcessEvent = async (evtId) => {
    try {
      const res = await api.processEvent(evtId, true);
      fetchEvents();
      if (res.trace) {
        setTraceModalEvent(res.trace);
      }
    } catch (err) {
      alert('Error processing event: ' + err.message);
    }
  };

  const types = ['All', 'Failed Payment', 'Checkout Abandonment', 'Failed Subscription', 'Overdue Invoice', 'Mandate Failure', 'Promise-to-Pay Missed'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recovery Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized agent intervention queue sorted by Expected Recovery Value (Amount × Probability)
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="fintech-card p-4 space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search customer name, email, or event ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-700 bg-white focus:outline-none"
            >
              <option value="expectedValue">Highest Expected Recovery</option>
              <option value="amount">Highest Amount (At Risk)</option>
              <option value="probability">Highest Recovery Probability</option>
              <option value="oldest">Oldest Overdue Case</option>
            </select>
          </div>

        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">Types:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedType === t
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Recovery Table */}
      <div className="fintech-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
            Loading recovery opportunities...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">No matching recovery events found.</p>
            <p className="text-xs">Try adjusting your search query or filter pills.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Revenue At Risk</th>
                  <th className="py-3.5 px-4">Type & Reason</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Recovery Prob</th>
                  <th className="py-3.5 px-4">Expected Value</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => {
                  const isRecovered = evt.status === 'Recovered';
                  const isClosed = evt.isClosed;

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Customer */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/recovery/${evt.id}`)}
                            className="hover:underline hover:text-indigo-600 text-left"
                          >
                            {evt.customerName}
                          </button>
                        </div>
                        <span className="block text-[10px] text-slate-400 font-mono">{evt.id} • {evt.customerEmail || 'No Email'}</span>
                      </td>

                      {/* Revenue At Risk */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ₹{evt.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Issue */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-100">
                          {evt.type}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                          {evt.failureReason}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          evt.riskScore > 70 ? 'bg-rose-100 text-rose-700' : evt.riskScore > 40 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {evt.riskScore}/100
                        </span>
                      </td>

                      {/* Recovery Probability */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-emerald-700">
                          {Math.round((evt.recoveryProbability || 0.8) * 100)}%
                        </span>
                      </td>

                      {/* Expected Recovery Value */}
                      <td className="py-3.5 px-4 font-black text-indigo-700 text-sm">
                        ₹{(evt.expectedRecoveryValue || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                          isRecovered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isClosed
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {isRecovered && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {evt.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Run Agent Process */}
                          {!isRecovered && !isClosed && (
                            <button
                              onClick={() => handleProcessEvent(evt.id)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                              title="Trigger AI Agent Workflow"
                            >
                              <Bot className="w-3 h-3" />
                              <span>Agent</span>
                            </button>
                          )}

                          {/* Razorpay Simulated Pay */}
                          {!isRecovered && !isClosed && (
                            <button
                              onClick={() => setCheckoutModalEvent(evt)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                              title="Simulate Razorpay Payment Link"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Pay</span>
                            </button>
                          )}

                          {/* Record P2P */}
                          {!isRecovered && !isClosed && (
                            <button
                              onClick={() => setP2pModalEvent(evt)}
                              className="p-1 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded"
                              title="Record Promise-to-Pay"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                          )}

                          {/* Details / Trace */}
                          <button
                            onClick={() => navigate(`/recovery/${evt.id}`)}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                            title="View Case Details & Trace"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Execution Trace Modal */}
      {traceModalEvent && (
        <ExecutionTraceModal
          trace={traceModalEvent}
          onClose={() => setTraceModalEvent(null)}
        />
      )}

      {/* Promise to Pay Modal */}
      {p2pModalEvent && (
        <PromiseToPayModal
          event={p2pModalEvent}
          onClose={() => setP2pModalEvent(null)}
          onSubmit={async (data) => {
            setP2pModalEvent(null);
            await api.processEvent(p2pModalEvent.id, false);
            fetchEvents();
          }}
        />
      )}

      {/* Razorpay Simulated Modal */}
      {checkoutModalEvent && (
        <RazorpayCheckoutModal
          event={checkoutModalEvent}
          onClose={() => setCheckoutModalEvent(null)}
          onSuccess={async (recoveredAmt) => {
            setCheckoutModalEvent(null);
            fetchEvents();
          }}
        />
      )}

    </div>
  );
}
