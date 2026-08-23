import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  MessageSquare,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Play,
  CreditCard,
  Volume2
} from 'lucide-react';
import { api } from '../api/client';
import { ExecutionTraceModal } from '../components/ExecutionTraceModal';
import { RazorpayCheckoutModal } from '../components/RazorpayCheckoutModal';

export function CaseDetailsPage({ eventId, navigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCommTab, setActiveCommTab] = useState('hinglish');
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [voiceScript, setVoiceScript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const res = await api.getEventDetail(eventId);
      setData(res);

      // Generate voice script
      const scriptRes = await api.generateVoiceScript({
        customerName: res.customer?.name || res.event.customerName,
        amount: res.event.amount,
        reason: res.event.failureReason,
        language: 'Hinglish'
      });
      setVoiceScript(scriptRes.script);
    } catch (err) {
      console.error('Error fetching case detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) loadDetail();
  }, [eventId]);

  const handleSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Browser speech synthesis not supported. Simulated audio: ' + text);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Loading case details...
      </div>
    );
  }

  const { event, customer } = data;
  const isRecovered = event.status === 'Recovered';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">

      {/* Top Navigation */}
      <button
        onClick={() => navigate('/recovery')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recovery Opportunities</span>
      </button>

      {/* Case Header Card */}
      <div className="fintech-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              #{event.id}
            </span>
            <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 ${isRecovered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
              {isRecovered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {event.status}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            {event.customerName} — ₹{event.amount.toLocaleString('en-IN')}
          </h1>
          <p className="text-xs text-slate-500">
            Type: <span className="font-semibold text-slate-800">{event.type}</span> • Reason: <span className="font-semibold text-slate-800">{event.failureReason}</span> • Days Overdue: <span className="font-semibold text-slate-800">{event.daysOverdue}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {event.lastExecutionTrace && (
            <button
              onClick={() => setShowTraceModal(true)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition-colors border border-indigo-200"
            >
              <Bot className="w-4 h-4" />
              <span>Inspect Execution Trace</span>
            </button>
          )}

          {!isRecovered && (
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay via Razorpay Link</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Metric Intelligence Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fintech-card p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Risk Intelligence Score</span>
          <p className="text-2xl font-black text-slate-900">{event.riskScore}/100</p>
          <p className="text-[11px] text-slate-500">Failure Classification: <strong className="text-slate-800">{event.failureClassification || 'Recoverable'}</strong></p>
        </div>

        <div className="fintech-card p-5 space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase">Recovery Probability</span>
          <p className="text-2xl font-black text-indigo-700">{Math.round((event.recoveryProbability || 0.8) * 100)}%</p>
          <p className="text-[11px] text-indigo-600">Calculated via Llama-3.3-70B model</p>
        </div>

        <div className="fintech-card p-5 space-y-1 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200">
          <span className="text-xs font-bold text-emerald-600 uppercase">Expected Recovery Value</span>
          <p className="text-2xl font-black text-emerald-700">₹{(event.expectedRecoveryValue || event.amount).toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600">Amount × Recovery Probability</p>
        </div>
      </div>

      {/* Visual Customer Recovery Timeline */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          Customer Recovery Timeline
        </h3>

        <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-2">

          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 border-4 border-white" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900">09:12 AM — Payment Failure Detected</span>
              <p className="text-slate-500">System captured ₹{event.amount.toLocaleString('en-IN')} payment failure ({event.failureReason}).</p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-sky-500 border-4 border-white" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900">09:13 AM — AI Diagnosis & Risk Intelligence</span>
              <p className="text-slate-500">Root cause diagnosed as recoverable temporary shortage. Recovery Prob: {Math.round((event.recoveryProbability || 0.8) * 100)}%.</p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-900">09:14 AM — Agent Strategy & Policy Check Passed</span>
              <p className="text-slate-500">Action: {event.recommendedAction || 'Schedule Retry + Friendly Reminder'}. Policy Guardrails validated.</p>
            </div>
          </div>

          {isRecovered ? (
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-emerald-800">Day 3 — Revenue Recovered! 🎉</span>
                <p className="text-emerald-700 font-medium">₹{event.amount.toLocaleString('en-IN')} payment confirmed via Razorpay. Case closed successfully.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-400 border-4 border-white" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-amber-800">Day 3 — Automated Follow-Up Dispatched</span>
                <p className="text-slate-500">Awaiting customer response to Razorpay short link.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* AI Communication Generator Sandbox */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Multi-Channel Communication Generator
            </h3>
            <p className="text-xs text-slate-500">Context-aware outreach tailored to customer profile</p>
          </div>

          {/* Comm Tabs */}
          <div className="flex items-center space-x-2 text-xs">
            {['hinglish', 'email', 'sms', 'call_script'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCommTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${activeCommTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3 font-mono text-xs border border-slate-800">

          {activeCommTab === 'hinglish' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-indigo-300 font-bold border-b border-slate-800 pb-2">
                <span>Hinglish WhatsApp Outreach</span>
                <span>Tone: Polite & Culturally Aware</span>
              </div>
              <p className="text-slate-200 leading-relaxed pt-1">
                "Namaste {event.customerName} ji, aapka ₹{event.amount.toLocaleString('en-IN')} ka payment pending complete nahi ho paya tha ({event.failureReason}). Aap niche diye gaye Razorpay link par click karke payment instantly complete kar sakte hain: {event.paymentLink || 'https://rzp.io/i/rg_demo'}. Dhanyavaad!"
              </p>
            </div>
          )}

          {activeCommTab === 'email' && (
            <div className="space-y-2">
              <div className="text-indigo-300 font-bold border-b border-slate-800 pb-2">
                Subject: Payment Pending Notice — Quick Action Required (#{event.id})
              </div>
              <p className="text-slate-200 leading-relaxed pt-1">
                Dear {event.customerName},<br /><br />
                We noticed that your recent payment of ₹{event.amount.toLocaleString('en-IN')} for {event.type} was not completed.<br /><br />
                To keep your account active without service interruption, please click the secure link below:<br />
                {event.paymentLink || 'https://rzp.io/i/rg_demo'}<br /><br />
                Regards,<br />
                Revenue Guardian Ops Team
              </p>
            </div>
          )}

          {activeCommTab === 'sms' && (
            <div className="space-y-2">
              <div className="text-indigo-300 font-bold border-b border-slate-800 pb-2">
                SMS Short Reminder (132 chars)
              </div>
              <p className="text-slate-200 leading-relaxed pt-1">
                "RevenueGuardian: Dear {event.customerName}, your payment of ₹{event.amount} is pending. Complete now: {event.paymentLink || 'https://rzp.io/i/rg_demo'}"
              </p>
            </div>
          )}

          {activeCommTab === 'call_script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-indigo-300 font-bold border-b border-slate-800 pb-2">
                <span>AI Voice Agent Call Script</span>
                <button
                  onClick={() => handleSpeech(voiceScript)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-sans text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Stop Audio' : 'Start Voice Simulation'}</span>
                </button>
              </div>
              <p className="text-slate-200 leading-relaxed pt-1">
                {voiceScript}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Execution Trace Modal */}
      {showTraceModal && event.lastExecutionTrace && (
        <ExecutionTraceModal
          trace={event.lastExecutionTrace}
          onClose={() => setShowTraceModal(null)}
        />
      )}

      {/* Razorpay Checkout Modal */}
      {showCheckoutModal && (
        <RazorpayCheckoutModal
          event={event}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setShowCheckoutModal(false);
            loadDetail();
          }}
        />
      )}

    </div>
  );
}
