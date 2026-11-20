import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ScenarioSimulator({ mode, transactions, accounts }) {
  const [revenueChange, setRevenueChange] = useState(0); // -40% to +40%
  const [expenseCut, setExpenseCut] = useState(0); // 0% to 40%
  const [oneTimeExpense, setOneTimeExpense] = useState(0); // 0 to $20,000

  // Baseline calculations
  const baselineIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const baselineExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const liquidCash = accounts
    .filter(a => a.type === 'Checking' || a.type === 'Savings' || a.type === 'Treasury')
    .reduce((acc, a) => acc + Math.max(0, a.balance), 0);

  // Simulated calculations
  const simulatedIncome = baselineIncome * (1 + revenueChange / 100);
  const simulatedExpenses = baselineExpenses * (1 - expenseCut / 100);
  const simulatedLiquidCash = Math.max(0, liquidCash - oneTimeExpense);
  
  const baselineMargin = baselineIncome - baselineExpenses;
  const simulatedMargin = simulatedIncome - simulatedExpenses;

  const baselineRunway = baselineExpenses > 0 ? (liquidCash / Math.max(1, (baselineExpenses - baselineIncome) || baselineExpenses)).toFixed(1) : 12;
  const simulatedNetBurn = Math.max(1, simulatedExpenses - simulatedIncome);
  const simulatedRunway = simulatedMargin > 0 ? 'Infinite (Profitable)' : (simulatedLiquidCash / simulatedNetBurn).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Strategic Decision Modeling</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Financial Scenario Simulator
        </h2>
        <p className="text-slate-400 text-xs max-w-2xl mt-1">
          Test "What-If" hypotheses before making hiring, lifestyle, or capital decisions. 
          Instantly observe the impact on net burn, savings velocity, and operating runway.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Scenario Parameters
          </h3>

          {/* 1. Revenue / Income Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                {mode === 'business' ? 'SaaS Revenue / Client Retainer' : 'Monthly Take-Home Salary'}
              </span>
              <span className={`font-bold ${revenueChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="5"
              value={revenueChange}
              onChange={(e) => setRevenueChange(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-40% Shock</span>
              <span>Baseline</span>
              <span>+40% Growth</span>
            </div>
          </div>

          {/* 2. Discretionary Cut */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                {mode === 'business' ? 'Cut SaaS & Marketing Spend' : 'Discretionary Spending Reduction'}
              </span>
              <span className="font-bold text-emerald-400">
                -{expenseCut}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={expenseCut}
              onChange={(e) => setExpenseCut(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (No change)</span>
              <span>-20% Optimization</span>
              <span>-40% Aggressive Cut</span>
            </div>
          </div>

          {/* 3. One-Time Purchase */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                {mode === 'business' ? 'Capital Equipment / Server Purchase' : 'Major Purchase (Car / Vacation)'}
              </span>
              <span className="font-bold text-amber-400">
                ${oneTimeExpense.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="1000"
              value={oneTimeExpense}
              onChange={(e) => setOneTimeExpense(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$0</span>
              <span>$10,000</span>
              <span>$20,000</span>
            </div>
          </div>

          <button
            onClick={() => {
              setRevenueChange(0);
              setExpenseCut(0);
              setOneTimeExpense(0);
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Reset to Baseline
          </button>
        </div>

        {/* Results & Comparison Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metric Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Net Monthly Margin */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Simulated Net Monthly Cashflow
              </span>
              <div className="text-2xl font-bold mt-2">
                <span className={simulatedMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {simulatedMargin >= 0 ? `+$${simulatedMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `-$${Math.abs(simulatedMargin).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </span>
                <span className="text-xs text-slate-500 font-normal ml-2">/ month</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Baseline: ${baselineMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className={`font-semibold ${simulatedMargin >= baselineMargin ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulatedMargin >= baselineMargin ? '▲ Improved' : '▼ Decreased'}
                </span>
              </div>
            </div>

            {/* Simulated Runway / Cushion */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {mode === 'business' ? 'Simulated Cash Runway' : 'Emergency Fund Cushion'}
              </span>
              <div className="text-2xl font-bold text-white mt-2">
                {mode === 'business' ? (
                  <span>{simulatedRunway} <span className="text-sm font-normal text-slate-400">{typeof simulatedRunway === 'string' ? '' : 'Months'}</span></span>
                ) : (
                  <span>{(simulatedLiquidCash / Math.max(1, simulatedExpenses)).toFixed(1)} <span className="text-sm font-normal text-slate-400">Months of Expenses</span></span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>Adjusted Cash: ${simulatedLiquidCash.toLocaleString()}</span>
                <span className="text-indigo-400 font-semibold">Stress tested</span>
              </div>
            </div>

          </div>

          {/* Visual Comparison Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-white">
              Baseline vs Simulated Cashflow Comparison
            </h4>

            {/* Income Bar Comparison */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Inflow / Revenue</span>
                <span>${simulatedIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs ${baselineIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, Math.round((simulatedIncome / Math.max(simulatedIncome, baselineIncome, 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Outflow Bar Comparison */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Burn / Expenses</span>
                <span>${simulatedExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs ${baselineExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-rose-500 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, Math.round((simulatedExpenses / Math.max(simulatedExpenses, baselineExpenses, 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* AI Strategic Assessment */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Scenario Diagnosis</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {simulatedMargin > baselineMargin 
                  ? `This scenario expands your capital cushion by +$${Math.round(simulatedMargin - baselineMargin).toLocaleString()}/month. Your liquid runway expands, providing maximum safety for future strategic hires or investments.`
                  : `Under these parameters, your monthly margin contracts by -$${Math.round(baselineMargin - simulatedMargin).toLocaleString()}/month. Consider pairing this with a 15% reduction in non-essential software or dining expenses to restore equilibrium.`}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
