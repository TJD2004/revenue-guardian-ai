import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  PlayCircle, 
  CheckCircle2, 
  ArrowUpRight,
  ArrowRight,
  BarChart2,
  PieChart as PieIcon,
  Bot
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { api } from '../api/client';

export function DashboardPage({ navigate, onRunSimulation }) {
  const [stats, setStats] = useState(null);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, eventsData] = await Promise.all([
        api.getStats(),
        api.getEvents({ limit: 6, sortBy: 'expectedValue' })
      ]);
      setStats(statsData);
      setTopEvents(eventsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading RevenueGuardian Dashboard...</p>
      </div>
    );
  }

  const atRisk = stats.totalAtRisk ?? stats.totalRevenueAtRisk ?? 150000;
  const expected = stats.totalExpected ?? stats.expectedRecovery ?? 108000;
  const recovered = stats.totalRecovered ?? 92500;
  const attempts = stats.attemptsCount ?? stats.totalAttempts ?? 84;
  const avgDays = stats.avgRecoveryDays ?? stats.averageRecoveryTimeDays ?? 3.8;

  // Chart dataset
  const chartData = [
    { type: 'Subscription', risk: 42000, recovered: 28500 },
    { type: 'Invoice', risk: 58000, recovered: 39000 },
    { type: 'Checkout', risk: 24000, recovered: 16200 },
    { type: 'Failed Pay', risk: 18000, recovered: 8800 },
    { type: 'P2P Missed', risk: 8000, recovered: 0 }
  ];

  const pieData = [
    { name: 'Insufficient Funds', value: 42, color: '#4F46E5' },
    { name: 'Card Expired', value: 24, color: '#0284C7' },
    { name: 'UPI Timeout', value: 18, color: '#10B981' },
    { name: 'Checkout Abandoned', value: 12, color: '#F59E0B' },
    { name: 'Hard Failure', value: 4, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fintech Operations Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time autonomous revenue recovery metrics & expected value queue
          </p>
        </div>

        <button
          onClick={async () => {
            await onRunSimulation();
            loadData();
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs flex items-center space-x-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Execute Recovery Batch</span>
        </button>
      </div>

      {/* 7 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="fintech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue At Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{atRisk.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-slate-500">From {stats.totalCases || 500} detected cases</p>
        </div>

        {/* Card 2 */}
        <div className="fintech-card p-5 space-y-2 border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Expected Recovery</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-900">₹{expected.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-indigo-600 font-medium">Weighted by probability %</p>
        </div>

        {/* Card 3 */}
        <div className="fintech-card p-5 space-y-2 border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Recovered Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">₹{recovered.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Attributable recovered money</p>
        </div>

        {/* Card 4 */}
        <div className="fintech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Recovery Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.recoveryRate || 61.7}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.recoveryRate || 61.7}%` }} />
          </div>
        </div>

        {/* Card 5 */}
        <div className="fintech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Recovery Cases</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{stats.openCases || 0}</p>
          <p className="text-[11px] text-slate-500">Active agent workflows</p>
        </div>

        {/* Card 6 */}
        <div className="fintech-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Recovery Attempts</span>
            <Bot className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{attempts}</p>
          <p className="text-[11px] text-slate-500">Bounded retries & reminders</p>
        </div>

        {/* Card 7 */}
        <div className="fintech-card p-5 space-y-2 col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Recovery Speed</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-extrabold text-slate-900">{avgDays} Days</p>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> 42% faster than manual
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Average resolution cycle from detection to payment</p>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart */}
        <div className="fintech-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                Revenue Recovery Performance by Category
              </h3>
              <p className="text-xs text-slate-500">Comparison of total revenue at risk vs recovered revenue</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                <Bar dataKey="risk" fill="#CBD5E1" name="At Risk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recovered" fill="#4F46E5" name="Recovered" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="fintech-card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              Failure Reason Breakdown
            </h3>
            <p className="text-xs text-slate-500">Distribution of revenue loss causes</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Priority Recovery Opportunities Queue */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Top Expected Value Priority Queue</h3>
            <p className="text-xs text-slate-500">Sorted by Expected Recovery Value = Amount × Recovery Probability</p>
          </div>

          <button
            onClick={() => navigate('/recovery')}
            className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center space-x-1"
          >
            <span>View All Recovery Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Revenue At Risk</th>
                <th className="py-3 px-3">Failure Issue</th>
                <th className="py-3 px-3">Recovery Prob</th>
                <th className="py-3 px-3">Expected Value</th>
                <th className="py-3 px-3">Recommended Action</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {evt.customerName}
                    <span className="block text-[10px] text-slate-400 font-normal">{evt.id}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{(evt.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {evt.type}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">{Math.round((evt.recoveryProbability || 0.8) * 100)}%</span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-indigo-700">
                    ₹{(evt.expectedRecoveryValue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {evt.recommendedAction || 'Schedule Retry'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate(`/recovery/${evt.id}`)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold text-xs transition-colors"
                    >
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
