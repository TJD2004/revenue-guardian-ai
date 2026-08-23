import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function RazorpayCheckoutModal({ event, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('upi');
  const [upiId, setUpiId] = useState('rahul.sharma@okicici');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!event) return null;

  const discount = event.discountApplied || 0;
  const finalAmount = Math.round(event.amount * (1 - discount / 100));

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setTimeout(() => {
        onSuccess(finalAmount);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Razorpay Simulated Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white">Razorpay Secure</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 font-medium">TEST MODE</span>
              </div>
              <p className="text-xs text-slate-300">RevenueGuardian Recovery Payment Gateway</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between text-slate-800">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Order #{event.id}</span>
            <span className="text-sm font-semibold text-slate-900">{event.customerName}</span>
          </div>

          <div className="text-right">
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through mr-2">₹{event.amount.toLocaleString('en-IN')}</span>
            )}
            <span className="text-xl font-extrabold text-indigo-700">₹{finalAmount.toLocaleString('en-IN')}</span>
            {discount > 0 && (
              <span className="block text-[10px] text-emerald-600 font-bold">Includes {discount}% Recovery Discount</span>
            )}
          </div>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-lg shadow-emerald-100">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Payment Recovered!</h3>
              <p className="text-xs text-slate-500 mt-1">₹{finalAmount.toLocaleString('en-IN')} captured via Razorpay Gateway</p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-4 rounded-lg font-medium border border-emerald-200 inline-block">
              Immutable Audit Log Entry Created
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('upi')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  activeTab === 'upi'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setActiveTab('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  activeTab === 'card'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setActiveTab('netbanking')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  activeTab === 'netbanking'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* Method Inputs */}
            {activeTab === 'upi' && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">Enter VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 me-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="name@upi"
                />
                <p className="text-[11px] text-slate-400">Supported: GPay, PhonePe, Paytm, BHIM</p>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 8892)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  defaultValue="4532 8901 2345 8892"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/YY" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" defaultValue="12/28" />
                  <input type="text" placeholder="CVV" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" defaultValue="•••" />
                </div>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'State Bank of India'].map((bank) => (
                  <button key={bank} className="p-2 border border-slate-200 rounded-lg text-xs font-medium hover:bg-indigo-50 hover:border-indigo-300 text-left">
                    {bank}
                  </button>
                ))}
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing Razorpay Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{finalAmount.toLocaleString('en-IN')} & Recover</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
