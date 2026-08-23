import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, PhoneCall, CheckCircle2, Play, Square } from 'lucide-react';
import { api } from '../api/client';

export function VoiceRecoveryPage() {
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [amount, setAmount] = useState(5000);
  const [reason, setReason] = useState('Subscription auto-debit failure due to temporary bank shortage');
  const [language, setLanguage] = useState('Hinglish');
  const [script, setScript] = useState(
    'Namaste Rahul ji, main RevenueGuardian AI Voice Assistant bol raha hoon. Aapka ₹5,000 ka payment pending chal raha hai (Subscription auto-debit failure due to temporary bank shortage). Aap razorpay payment link par click karke instant complete kar sakte hain. Kya aap drop-down payment attempt try karna chahenge? Dhanyavaad!'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await api.generateVoiceScript({
        customerName,
        amount: Number(amount),
        reason,
        language
      });
      setScript(res.script);
    } catch (err) {
      alert('Script generation failed: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Web Speech Synthesis API is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voice Recovery Agent Sandbox</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200">
              Browser Voice Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate AI recovery call scripts in Hinglish, Hindi, or English and simulate interactive voice calls via browser audio synthesis
          </p>
        </div>
      </div>

      {/* Generator Form & Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Form */}
        <div className="fintech-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Voice Call Parameter Configurator
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pending Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Hinglish">Hinglish (Recommended)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Failure Reason Context</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating AI Script...' : 'Generate Voice Call Script'}</span>
            </button>
          </form>
        </div>

        {/* Right Voice Player Card */}
        <div className="fintech-card p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <Mic className="w-4 h-4" />
                <span>AI Voice Script Output ({language})</span>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Synthesis Ready
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed min-h-[140px]">
              {script}
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="space-y-3 pt-2">
            <button
              onClick={toggleSpeech}
              className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                isSpeaking
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/30'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Voice Call Simulation</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Start Voice Simulation (Play Audio)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Uses built-in Web SpeechSynthesis API. No Twilio or external telecom API required.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
