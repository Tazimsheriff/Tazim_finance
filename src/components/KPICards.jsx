import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign
} from 'lucide-react';

export default function KPICards({ 
  mode, 
  accounts, 
  transactions, 
  anomalies, 
  runway, 
  onViewAnomalies 
}) {
  const liquidCash = accounts
    .filter(a => a.type === 'Checking' || a.type === 'Savings' || a.type === 'Treasury')
    .reduce((acc, a) => acc + Math.max(0, a.balance), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Liquid Balance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {mode === 'business' ? 'Operating Cash Reserves' : 'Total Liquid Balance'}
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">
            ${liquidCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            <span className="text-emerald-400 flex items-center font-medium mr-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
            vs last month baseline
          </div>
        </div>
      </div>

      {/* 2. Monthly Inflow & Outflow */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Monthly Inflow vs Outflow
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400">
              +${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-sm font-medium text-slate-500">
              / -${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className={`font-semibold mr-1.5 ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netCashFlow >= 0 ? `Net Surplus: +$${netCashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `Net Deficit: -$${Math.abs(netCashFlow).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Runway or Savings Rate */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {mode === 'business' ? 'Cash Runway Forecast' : 'Savings Velocity Rate'}
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">
            {mode === 'business' ? (
              <span>{runway.runwayMonths} <span className="text-sm font-normal text-slate-400">Months</span></span>
            ) : (
              <span>{savingsRate}% <span className="text-sm font-normal text-slate-400">of Inflow</span></span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center">
            {mode === 'business' ? (
              <span className="text-slate-300">
                Zero revenue runway: <strong className="text-purple-400">{runway.zeroRevenueRunway} mo</strong>
              </span>
            ) : (
              <span className="text-slate-300">
                Target benchmark: <strong className="text-purple-400">20% (50/30/20)</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. AI Anomaly Alert Card */}
      <div 
        onClick={onViewAnomalies}
        className={`rounded-2xl p-5 border cursor-pointer transition shadow-sm ${
          anomalies.length > 0
            ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-800/60 hover:border-rose-600'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            AI Anomaly Guardian
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>{anomalies.length} Flagged</span>
            {anomalies.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                Review Required
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Duplicates & Spikes detected</span>
            <span className="text-rose-400 font-semibold hover:underline">View details →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
