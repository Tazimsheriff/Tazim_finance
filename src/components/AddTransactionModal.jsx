import React, { useState, useEffect } from 'react';
import { X, Sparkles, PlusCircle, CheckCircle2 } from 'lucide-react';
import { predictCategory } from '../services/aiCategorizer';
import { CATEGORIES } from '../data/mockData';

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  onAddTransaction,
  mode 
}) {
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState(mode === 'business' ? 'bacc-1' : 'acc-1');
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Live AI Categorization as user types
  useEffect(() => {
    const combinedText = `${merchant} ${description}`;
    if (combinedText.trim().length > 2) {
      const pred = predictCategory(combinedText, parseFloat(amount) || 0, mode);
      setAiSuggestion(pred);
      if (!category) {
        setCategory(pred.category);
        setType(pred.type);
      }
    } else {
      setAiSuggestion(null);
    }
  }, [merchant, description, amount, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const newTx = {
      id: `tx-custom-${Date.now()}`,
      mode,
      date: new Date().toISOString().slice(0, 10),
      merchant,
      description: description || merchant,
      amount: parseFloat(amount),
      type,
      category: category || (mode === 'business' ? 'SaaS Tools & Software' : 'Shopping & Retail'),
      account,
      status: 'completed',
      tags: ['user_added', type]
    };

    onAddTransaction(newTx);
    onClose();
    // Reset form
    setMerchant('');
    setDescription('');
    setAmount('');
    setCategory('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Real-Time AI Auto-Classification</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">
          Add New Transaction
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Merchant / Payee Name *
            </label>
            <input
              type="text"
              placeholder="e.g. AWS Cloud, Sweetgreen, Stripe Payout..."
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Memo
            </label>
            <input
              type="text"
              placeholder="e.g. Team lunch, monthly server usage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transaction Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>

          {/* AI Suggestion Pill */}
          {aiSuggestion && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <div className="text-xs">
                  <span className="text-slate-300">Suggested Category: </span>
                  <strong className="text-indigo-300">{aiSuggestion.category}</strong>
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    ({Math.round(aiSuggestion.confidence * 100)}% confidence)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCategory(aiSuggestion.category);
                  setType(aiSuggestion.type);
                }}
                className="px-2 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
              >
                Accept
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Category...</option>
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
