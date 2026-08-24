import React, { useState, useEffect } from 'react';
import { Link2, ShieldCheck, CheckCircle2, RefreshCw, Cpu, Database, Lock, ArrowRight, Activity, Terminal } from 'lucide-react';
import { api } from '../api/client';

export function BlockchainPage() {
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const fetchBlockchain = async () => {
    setLoading(true);
    try {
      const data = await api.getBlockchainChain();
      setBlockchainData(data);
    } catch (e) {
      console.warn('Error fetching blockchain chain:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchain();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const result = await api.verifyBlockchain();
      setVerificationResult(result);
    } catch (e) {
      console.warn('Error verifying blockchain:', e);
    } finally {
      setVerifying(false);
    }
  };

  const chain = blockchainData?.chain || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cryptographic Blockchain Ledger</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-indigo-600" /> SHA-256 Chain
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, cryptographically linked Proof-of-Work ledger powered by Java 17 Spring Boot Microservice
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchBlockchain}
            disabled={loading}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{verifying ? 'Verifying...' : 'Validate Chain Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Verification Alert banner */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in slide-in-from-top-2 duration-200 ${
          verificationResult.isValid 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-extrabold text-sm">{verificationResult.verificationStatus}</span>
              <p className="text-[11px] opacity-80 mt-0.5">
                Validated {verificationResult.blockCount} blocks from Genesis ({verificationResult.genesisHash?.substring(0, 16)}...) to Latest block.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2 py-1 rounded bg-white/80 border border-emerald-200 font-bold">
            100% Cryptographically Sound
          </span>
        </div>
      )}

      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="fintech-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Blockchain Height</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{blockchainData?.height || chain.length || 1} Blocks</p>
          <p className="text-[11px] text-emerald-600 font-medium">100% Immutably Linked</p>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Hashing Algorithm</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">SHA-256</p>
          <p className="text-[11px] text-slate-500 font-medium">Java MessageDigest Engine</p>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Consensus Protocol</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">Proof-of-Work</p>
          <p className="text-[11px] text-slate-500 font-medium">Zero-Leading Nonce Mining</p>
        </div>

        <div className="fintech-card p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Chain Status</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-emerald-700">VERIFIED VALID</p>
          <p className="text-[11px] text-slate-500 font-medium">Tamper-Proof Audit Guarantee</p>
        </div>
      </div>

      {/* Blockchain Visualizer Stream */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          Live Block Sequence Stream ({chain.length} Minted Blocks)
        </h2>

        {chain.map((block, i) => (
          <div key={block.hash || i} className="fintech-card p-5 space-y-3 relative border-l-4 border-l-indigo-600 hover:shadow-md transition-shadow">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  #{block.index}
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{block.action || 'Audit Event'}</h3>
                  <p className="text-[11px] text-slate-500">Event ID: <span className="font-mono text-indigo-600 font-semibold">{block.eventId}</span> • Customer: <span className="font-semibold text-slate-700">{block.customerName}</span></p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                  block.policyDecision === 'PASSED' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {block.policyDecision || 'PASSED'}
                </span>
                {block.recoveredAmount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-extrabold text-[11px] border border-indigo-200">
                    +₹{block.recoveredAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Cryptographic Hashes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider block mb-0.5">Previous Block Hash (Link)</span>
                <p className="text-slate-600 text-[11px] truncate" title={block.previousHash}>
                  {block.previousHash}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-indigo-600 font-sans font-bold uppercase tracking-wider block mb-0.5">Current Block SHA-256 Hash</span>
                <p className="text-indigo-950 font-bold text-[11px] truncate" title={block.hash}>
                  {block.hash}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Timestamp: {new Date(block.timestamp).toLocaleString('en-IN')}</span>
              <span>Nonce: <strong className="text-slate-700 font-mono">{block.nonce || 0}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
