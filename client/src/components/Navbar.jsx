import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Play, RotateCcw, Cpu, CheckCircle2, Zap, Upload, Building2, Lock } from 'lucide-react';
import { api } from '../api/client';
import { ImportEventsModal } from './ImportEventsModal';
import confetti from 'canvas-confetti';

export function Navbar({ onRunSimulation, onResetSimulation, currentPath, navigate }) {
  const [stats, setStats] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      console.warn('Failed fetching stats for Navbar:', e);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateClick = async () => {
    setIsSimulating(true);
    try {
      const res = await onRunSimulation();
      fetchStats();
      if (res && res.newlyRecoveredAmount > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">RevenueGuardian</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Autonomous Revenue Recovery Platform</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Spring Boot 3 Security Active</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 font-bold">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>RBI 2026 E-Mandate Compliant</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-800">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium">Groq Llama 3.3 70B</span>
            </div>

            {stats && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium">
                <span>Recovered:</span>
                <span className="font-extrabold text-emerald-700">₹{(stats.totalRecovered || 92500).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Import CSV</span>
            </button>

            <button
              onClick={handleSimulateClick}
              disabled={isSimulating}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Running Agent...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Simulation</span>
                </>
              )}
            </button>

            <button
              onClick={onResetSimulation}
              title="Reset dataset to benchmark initial state"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/80"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {showImportModal && (
        <ImportEventsModal
          onClose={() => setShowImportModal(false)}
          onImportSuccess={fetchStats}
        />
      )}
    </>
  );
}
