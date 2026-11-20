import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  HelpCircle, 
  AlertTriangle, 
  ExternalLink,
  RotateCcw,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function AnomalyDetector({ 
  anomalies, 
  onResolveAnomaly, 
  onDisputeAnomaly,
  onResetAnomalies 
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'resolved'
  const [sensitivity, setSensitivity] = useState(2.8); // Z-score threshold

  const filtered = anomalies.filter(item => {
    if (filterSeverity !== 'ALL' && item.severity.toUpperCase() !== filterSeverity) return false;
    return true;
  });

  const totalAtRisk = anomalies.reduce((acc, a) => acc + a.transaction.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Real-Time Anomaly & Fraud Defense</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              AI Transaction Sentinel
            </h2>
            <p className="text-slate-400 text-xs max-w-2xl mt-1">
              Statistical deviation analysis (Z-Score &gt; {sensitivity}σ), high-frequency duplicate detection, and merchant location drift monitoring.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total At-Risk Volume</span>
              <span className="text-lg font-bold text-rose-400">
                ${totalAtRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Flags</span>
              <span className="text-lg font-bold text-amber-400">{anomalies.length} Transactions</span>
            </div>
          </div>
        </div>

        {/* Controls & Sensitivity Slider */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Filter Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  filterSeverity === sev
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sensitivity: <strong>{sensitivity}σ Z-Score</strong></span>
            <input
              type="range"
              min="1.5"
              max="4.0"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Anomaly Cards List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">All Clear! No Flagged Anomalies</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            All recent transactions adhere to your normal expenditure bounds and vendor patterns.
          </p>
          {onResetAnomalies && (
            <button
              onClick={onResetAnomalies}
              className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
            >
              Reset Demo Flags
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => {
            const tx = item.transaction;
            const isCritical = item.severity === 'Critical';
            const isHigh = item.severity === 'High';

            return (
              <div 
                key={item.transactionId}
                className={`bg-slate-900 rounded-2xl border p-5 shadow-sm transition ${
                  isCritical 
                    ? 'border-rose-700/80 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900' 
                    : isHigh
                    ? 'border-amber-700/60 bg-gradient-to-r from-amber-950/15 via-slate-900 to-slate-900'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Metadata & Risk Meter */}
                  <div className="flex items-start space-x-4">
                    {/* Risk Score Circle */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Risk Score</span>
                      <span className={`text-xl font-black ${
                        isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-yellow-400'
                      }`}>
                        {item.riskScore}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">/ 100</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          isHigh ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                        }`}>
                          {item.severity} Severity
                        </span>
                        <span className="text-xs text-slate-400">
                          {tx.date}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-medium">{tx.category}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-1">
                        {tx.merchant}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {tx.description}
                      </p>

                      {/* Explainability Callout */}
                      <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 max-w-2xl">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-semibold text-slate-200">AI Diagnosis: </span>
                            <span className="text-slate-300">{item.reason}</span>
                            <div className="text-[11px] text-indigo-300 mt-1 font-medium">
                              💡 <strong>Recommended Action:</strong> {item.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Action Buttons */}
                  <div className="flex flex-col items-end justify-between self-stretch md:min-w-[200px]">
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-400">
                        ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Payment via Card
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => onDisputeAnomaly(item.transactionId)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center space-x-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Dispute / Block</span>
                      </button>

                      <button
                        onClick={() => onResolveAnomaly(item.transactionId)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center space-x-1.5 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Legit</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
