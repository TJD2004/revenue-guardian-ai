import React, { useState, useEffect } from 'react';
import { Users, Search, Star, CreditCard, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Profiles & Payment Histories</h1>
          <p className="text-xs text-slate-500 mt-1">
            Historical transaction reliability and VIP risk intelligence profiles
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="fintech-card p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search customer name, email, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="fintech-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
            Loading customer profiles...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Credit Score</th>
                  <th className="py-3.5 px-4">Successful Past Txns</th>
                  <th className="py-3.5 px-4">VIP Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.name}
                      <span className="block text-[10px] text-slate-400 font-mono">{c.id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {c.email}
                      <span className="block text-[10px] text-slate-400">{c.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-extrabold ${c.creditScore > 750 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {c.creditScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.successfulPaymentsCount} Txns
                    </td>
                    <td className="py-3.5 px-4">
                      {c.isVIP ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200 inline-flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-600 fill-amber-500" /> VIP
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
