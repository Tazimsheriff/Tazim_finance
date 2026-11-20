import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ChevronRight,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { analyze50_30_20 } from '../services/patternEngine';

export default function DashboardOverview({
  mode,
  insights,
  transactions,
  accounts,
  setActiveTab,
  onOpenAddModal
}) {
  const allocation = analyze50_30_20(transactions);

  // Group current expenses by category
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0) || 1;

  const categoryTotals = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Aggregate daily expenses for a smooth mini sparkline
  const daySpends = [
    { day: 'Nov 1', amt: 2150 },
    { day: 'Nov 3', amt: 142 },
    { day: 'Nov 5', amt: 320 },
    { day: 'Nov 7', amt: 360 },
    { day: 'Nov 9', amt: 92 },
    { day: 'Nov 12', amt: 185 },
    { day: 'Nov 14', amt: 14 },
    { day: 'Nov 16', amt: 284 },
    { day: 'Nov 17', amt: 498 },
    { day: 'Nov 18', amt: mode === 'business' ? 5420 : 3850 },
  ];

  const maxSpend = Math.max(...daySpends.map(d => d.amt));

  return (
    <div className="space-y-6">
      
      {/* 1. Strategic AI Advisory Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI Strategic Financial Assessment</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {mode === 'business' 
            ? 'Enterprise Operating Health: Strong Liquidity with 2 Actionable Cost Leakages' 
            : 'Personal Wealth Velocity: On Track with 6.8 Months of Emergency Reserves'}
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl mb-4 leading-relaxed">
          FinPulse AI synthesized your transaction flows, subscription baselines, and burn volatility. 
          Resolving detected duplicate charges and dormant subscriptions will immediately save your account capital.
        </p>

        {/* Dynamic Insight Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.slice(0, 3).map(ins => (
            <div 
              key={ins.id}
              onClick={() => ins.targetTab && setActiveTab(ins.targetTab)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3.5 hover:border-indigo-400/60 cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    ins.type === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    ins.type === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {ins.type}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {ins.impact}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                  {ins.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                  {ins.description}
                </p>
              </div>
              <div className="mt-3 flex items-center text-[11px] font-medium text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                <span>{ins.actionText}</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Visual Graphs & Category Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spending Velocity Area Chart (SVG) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Daily Spending Velocity & Spikes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoring expenditure momentum and high-volatility anomalies over time
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              November 2026
            </span>
          </div>

          {/* SVG Bar Chart with Spike Indicator */}
          <div className="h-56 flex items-end justify-between space-x-2 pt-6 pb-2 px-2 border-b border-slate-800">
            {daySpends.map((item, idx) => {
              const heightPct = Math.max(12, Math.round((item.amt / maxSpend) * 100));
              const isSpike = item.amt > 3000;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 text-white text-[11px] font-semibold py-1 px-2 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    ${item.amt.toLocaleString()}
                  </div>
                  
                  {isSpike && (
                    <span className="text-[9px] font-bold text-rose-400 mb-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-0.5" /> Spike
                    </span>
                  )}

                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      isSpike 
                        ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-md shadow-rose-500/20' 
                        : 'bg-gradient-to-t from-indigo-700 to-indigo-500 hover:from-indigo-600 hover:to-indigo-400'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium truncate w-full text-center">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5" />
                Normal Discretionary / Fixed
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5" />
                AI Outlier / Surge Anomaly
              </span>
            </div>
            <button 
              onClick={() => setActiveTab('anomalies')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Analyze Spike Root Cause →
            </button>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <PieChartIcon className="w-4 h-4 text-purple-400" />
                <span>Top Expenditure Categories</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">By Share</span>
            </div>

            <div className="space-y-4">
              {sortedCategories.map(([category, amount]) => {
                const pct = Math.round((amount / totalExpense) * 100);
                const catMeta = CATEGORIES[category] || { color: '#6366f1' };
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium truncate max-w-[170px]">
                        {category}
                      </span>
                      <span className="font-semibold text-white">
                        ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-slate-500 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, pct)}%`, backgroundColor: catMeta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 50/30/20 Rule Box */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-300">
              <span>50/30/20 Capital Allocation</span>
              <span className="text-indigo-400 font-bold">{allocation.savings.percentage}% Saved</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block">Needs (50%)</span>
                <span className="font-bold text-white text-xs">{allocation.needs.percentage}%</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block">Wants (30%)</span>
                <span className="font-bold text-white text-xs">{allocation.wants.percentage}%</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block">Savings (20%)</span>
                <span className="font-bold text-emerald-400 text-xs">{allocation.savings.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Recent Transactions Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Transactions & AI Classification</h3>
            <p className="text-xs text-slate-400">Continuous NLP categorization and threat scanning</p>
          </div>
          <button
            onClick={() => setActiveTab('ledger')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center"
          >
            <span>View Full Ledger</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">AI Threat & Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.slice(0, 6).map(tx => {
                const isFlagged = tx.tags?.includes('anomaly') || tx.tags?.includes('duplicate_suspect') || tx.tags?.includes('high_risk');
                const isIncome = tx.type === 'income';

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {tx.date.split(' ')[0]}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{tx.merchant}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 font-medium">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-bold ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isFlagged ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
