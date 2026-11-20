import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { predictCategory } from '../services/aiCategorizer';

export default function StatementImportModal({ 
  isOpen, 
  onClose, 
  onBatchImport, 
  mode 
}) {
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Load a quick sample statement
  const handleLoadSample = () => {
    const sample = mode === 'business' 
      ? `Date,Merchant,Amount,Type\n2026-11-19,Vercel Hosting Pro,40.00,expense\n2026-11-19,Retool Enterprise,500.00,expense\n2026-11-20,Stripe Recurring Inflow,4200.00,income\n2026-11-20,OpenAI API Tokens,450.00,expense`
      : `Date,Merchant,Amount,Type\n2026-11-19,Sweetgreen Salad Bowl,18.50,expense\n2026-11-19,Chevron Gas Station,45.20,expense\n2026-11-20,Freelance Client Retainer,1200.00,income\n2026-11-20,Spotify Family Plan,16.99,expense`;
    
    setCsvText(sample);
    processCSV(sample);
  };

  const processCSV = (raw) => {
    try {
      const lines = raw.trim().split('\n');
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const dateIdx = headers.findIndex(h => h.includes('date'));
      const merchantIdx = headers.findIndex(h => h.includes('merchant') || h.includes('desc') || h.includes('payee'));
      const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('cost'));
      const typeIdx = headers.findIndex(h => h.includes('type'));

      const results = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(r => r.trim());
        if (row.length >= 2) {
          const merchant = row[merchantIdx >= 0 ? merchantIdx : 1] || 'Imported Payee';
          const amount = parseFloat(row[amountIdx >= 0 ? amountIdx : 2]) || 0;
          const date = row[dateIdx >= 0 ? dateIdx : 0] || new Date().toISOString().slice(0, 10);
          const rawType = (row[typeIdx >= 0 ? typeIdx : 3] || 'expense').toLowerCase();

          // AI categorizes row on the fly
          const aiClass = predictCategory(merchant, amount, mode);

          results.push({
            id: `tx-import-${Date.now()}-${i}`,
            mode,
            date,
            merchant,
            description: `Imported via Statement Batch: ${merchant}`,
            amount: Math.abs(amount),
            type: rawType.includes('inc') ? 'income' : 'expense',
            category: aiClass.category,
            account: mode === 'business' ? 'bacc-1' : 'acc-1',
            status: 'completed',
            tags: ['csv_imported', aiClass.category.toLowerCase().replace(/\s+/g, '_')]
          });
        }
      }
      setParsedRows(results);
    } catch (err) {
      console.error('Failed to parse CSV', err);
    }
  };

  const handleImport = () => {
    if (parsedRows.length > 0) {
      onBatchImport(parsedRows);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Upload className="w-4 h-4" />
          <span>Automated Statement Importer</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Import Bank or Card Statement
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Paste CSV statement text or load our sample dataset. FinPulse AI automatically maps columns and assigns categories.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Paste CSV Statement Content
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Sample Statement</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                processCSV(e.target.value);
              }}
              placeholder="Date,Merchant,Amount,Type&#10;2026-11-19,Sweetgreen,18.50,expense&#10;2026-11-20,Client Wire,3500.00,income"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Parsed Preview */}
          {parsedRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                <span>AI Parsed & Categorized ({parsedRows.length} transactions)</span>
                <span className="text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready to Import
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-800 rounded-xl p-2 bg-slate-950/60">
                {parsedRows.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 font-mono">{row.date}</span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{row.merchant}</span>
                    <span className="text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">{row.category}</span>
                    <span className="font-bold text-white">${row.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={parsedRows.length === 0}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {parsedRows.length} Transactions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
