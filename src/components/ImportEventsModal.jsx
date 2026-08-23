import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2, Sparkles, Plus, AlertCircle } from 'lucide-react';

export function ImportEventsModal({ onClose, onImportSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [revenueType, setRevenueType] = useState('Failed Subscription');
  const [failureReason, setFailureReason] = useState('insufficient_funds');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    simulateImport();
  };

  const simulateImport = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onImportSuccess();
      onClose();
    }, 1200);
  };

  const handleAddManual = (e) => {
    e.preventDefault();
    simulateImport();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Import Revenue Events</h3>
              <p className="text-xs text-slate-500">Upload CSV or add custom lost revenue cases</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3 animate-in zoom-in duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Revenue Events Imported!</h4>
            <p className="text-xs text-slate-500">AI Risk Intelligence is analyzing imported cases...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={simulateImport}
              className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-600 bg-indigo-50/80'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">Drag & Drop Revenue CSV File</p>
              <p className="text-[11px] text-slate-400 mt-1">Supports columns: Customer, Email, Amount, Type, Failure Reason, Due Date</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded text-[11px]">
                Or click to upload sample CSV
              </span>
            </div>

            <div className="relative flex items-center justify-center text-xs text-slate-400">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-slate-400 font-semibold uppercase text-[10px] shrink-0">Or Add Single Case</span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Manual Form */}
            <form onSubmit={handleAddManual} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Revenue Type</label>
                  <select
                    value={revenueType}
                    onChange={(e) => setRevenueType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Failed Subscription">Failed Subscription</option>
                    <option value="Checkout Abandonment">Checkout Abandonment</option>
                    <option value="Failed Payment">Failed Payment</option>
                    <option value="Overdue Invoice">Overdue Invoice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Failure Reason</label>
                  <select
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="insufficient_funds">Insufficient Funds</option>
                    <option value="upi_timeout">UPI Timeout</option>
                    <option value="card_expired">Card Expired</option>
                    <option value="checkout_abandonment">Checkout Abandoned</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-colors pt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event & Run Agent</span>
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
