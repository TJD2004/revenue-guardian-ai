import React, { useState } from 'react';
import { Cpu, Code, CheckCircle2, Copy, Sparkles, Layers, Terminal } from 'lucide-react';
import { AGENT_TOOLS_DEFINITIONS } from '../../server/agent/toolRegistry.js';

export function McpPage() {
  const [selectedTool, setSelectedTool] = useState('generate_payment_link');
  const [copied, setCopied] = useState(false);

  const activeToolDef = AGENT_TOOLS_DEFINITIONS.find(t => t.name === selectedTool) || AGENT_TOOLS_DEFINITIONS[0];

  const mcpDeclaration = {
    mcpVersion: "1.0",
    protocol: "Model Context Protocol / Agentic Payments API",
    provider: "Razorpay RevenueGuardian Agent",
    tool: activeToolDef
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpDeclaration, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Razorpay Agentic MCP Tool Registry</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200">
              MCP API Protocol Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Model Context Protocol (MCP) JSON schemas for Razorpay's agentic payment tools & financial operations
          </p>
        </div>
      </div>

      {/* Tool Selector & JSON Schema Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Tool List */}
        <div className="fintech-card p-4 space-y-2">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-2">Registered MCP Tools (14)</p>
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {AGENT_TOOLS_DEFINITIONS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => setSelectedTool(tool.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                  selectedTool === tool.name
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{tool.name}</span>
                {selectedTool === tool.name && <Sparkles className="w-3 h-3 text-amber-300" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right JSON Schema Viewer */}
        <div className="fintech-card p-6 lg:col-span-2 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs font-mono">
                <Terminal className="w-4 h-4" />
                <span>mcp://razorpay/agentic-tools/{activeToolDef.name}</span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-sans flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied JSON!' : 'Copy Schema'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto">
              <pre>{JSON.stringify(mcpDeclaration, null, 2)}</pre>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex items-center justify-between">
            <span>Tool Execution Model: <strong>Groq Llama-3.3-70B Function Calling</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Backend Validated
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
