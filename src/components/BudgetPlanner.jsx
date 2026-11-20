import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Shuffle, 
  DollarSign, 
  Activity,
  Sliders
} from 'lucide-react';
import { calculateBudgetStatus, calculateCashRunway } from '../services/budgetEngine';

export default function BudgetPlanner({ 
  mode, 
  budgets, 
  transactions, 
  accounts,
  onUpdateBudget 
}) {
  const [stressFactor, setStressFactor] = useState(0); // 0% to 50% revenue stress
  const budgetData = calculateBudgetStatus(budgets, transactions);
  const runway = calculateCashRunway(accounts, transactions, stressFactor);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Predictive Budgeting & Dynamic Rebalancing</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Smart Budget & Capital Runway
            </h2>
            <p className="text-slate-400 text-xs max-w-2xl mt-1">
              Pacing algorithms project month-end overspends before they occur and automatically balance surplus allocations across envelopes.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Monthly Budget</span>
              <span className="text-lg font-bold text-white">
                ${budgetData.totalBudget.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Spent So Far</span>
              <span className="text-lg font-bold text-indigo-400">
                ${budgetData.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cycle Progress</span>
              <span className="text-lg font-bold text-slate-300">
                Day 20 (67%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic AI Rebalancing Alert */}
      {budgetData.rebalancingSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>AI Auto-Rebalancing Opportunity</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Recommended
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {budgetData.rebalancingSuggestions[0].reason}
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Dynamic budget rebalancing applied successfully!')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap shadow transition"
          >
            Apply Rebalance
          </button>
        </div>
      )}

      {/* 3. Category Budgets & Pacing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetData.evaluatedBudgets.map(b => {
          const isOver = b.status === 'exceeded';
          const isWarning = b.status === 'warning';
          const isCaution = b.status === 'caution';

          return (
            <div 
              key={b.category}
              className={`bg-slate-900 rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                isOver ? 'border-rose-600/70 bg-gradient-to-b from-rose-950/20 to-slate-900' :
                isWarning ? 'border-amber-600/60 bg-gradient-to-b from-amber-950/15 to-slate-900' :
                isCaution ? 'border-yellow-600/40' :
                'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white truncate max-w-[180px]">
                    {b.category}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    isOver ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    isWarning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    isCaution ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {b.statusLabel}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-3 mb-1.5">
                  <span className="text-xl font-bold text-white">
                    ${b.spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-slate-400">
                    of ${b.limit.toLocaleString()} limit
                  </span>
                </div>

                {/* Progress Bar with Expected Day Pacing Marker */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 relative overflow-hidden my-2">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isCaution ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentUsed)}%` }}
                  />
                  {/* Expected Day Marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                    style={{ left: `${b.expectedPacingPercent}%` }}
                    title={`Day 20 Expected Pace (${b.expectedPacingPercent}%)`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{b.percentUsed}% consumed</span>
                  <span>${b.remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })} left</span>
                </div>
              </div>

              {/* Pacing Forecast Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Projected Month-End:</span>
                <span className={`font-semibold ${b.projectedPercent > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${Math.round(b.projectedMonthEnd).toLocaleString()} ({b.projectedPercent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Cash Runway Stress-Tester (Especially critical for Business & Freelancers) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Capital Runway & Revenue Stress-Testing</span>
            </h3>
            <p className="text-xs text-slate-400">Simulate how macroeconomic volatility or contract loss impacts runway</p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Revenue Shock: -{stressFactor}%</span>
              <input 
                type="range"
                min="0"
                max="50"
                step="5"
                value={stressFactor}
                onChange={(e) => setStressFactor(parseInt(e.target.value))}
                className="w-32 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Liquid Reserves</span>
            <div className="text-xl font-bold text-white mt-1">
              ${runway.liquidCash.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">Checking + Savings + Treasury</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Monthly Burn</span>
            <div className="text-xl font-bold text-amber-400 mt-1">
              ${runway.netMonthlyBurn.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
            </div>
            <span className="text-[11px] text-slate-500">Expenses minus adjusted revenue</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Runway Under Shock</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {runway.runwayMonths} Months
            </div>
            <span className="text-[11px] text-slate-500">Zero revenue worst-case: {runway.zeroRevenueRunway} mo</span>
          </div>
        </div>
      </div>

    </div>
  );
}
