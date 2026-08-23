import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Bot, 
  FileText, 
  Mic, 
  PlayCircle, 
  Settings, 
  Home,
  ShieldCheck,
  Zap,
  Layers,
  DollarSign,
  Terminal
} from 'lucide-react';

export function Sidebar({ currentPath, navigate }) {
  const navItems = [
    { label: 'Overview Pitch', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Recovery Opportunities', path: '/recovery', icon: TrendingUp },
    { label: 'Specialized Engines', path: '/engines', icon: Layers, highlight: true },
    { label: 'AI Agent Panel', path: '/agent', icon: Bot, highlight: true },
    { label: 'Audit Trail', path: '/audit', icon: FileText },
    { label: 'Voice Recovery', path: '/voice', icon: Mic },
    { label: 'ROI & Attribution', path: '/attribution', icon: DollarSign },
    { label: 'Agentic MCP Tools', path: '/mcp', icon: Terminal },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Simulations', path: '/simulations', icon: PlayCircle },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden md:block">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Navigation</p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.highlight && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-4 text-white space-y-2 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Razorpay Buildathon 2026</span>
        </div>
        <p className="text-xs text-slate-300 font-medium">Track 03: AI Revenue Recovery</p>
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Agent Status</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Autonomous
          </span>
        </div>
      </div>
    </aside>
  );
}
