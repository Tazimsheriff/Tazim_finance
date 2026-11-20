import React, { useState } from 'react';
import { 
  Compass, 
  Tv, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Check, 
  Trash2, 
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { analyzeSubscriptions, analyzeDayOfWeekPatterns } from '../services/patternEngine';

export default function PatternAnalyzer({ transactions, onCancelSubscription }) {
  const subData = analyzeSubscriptions(transactions);
  const dayPatterns = analyzeDayOfWeekPatterns(transactions);
  const [canceledSubs, setCanceledSubs] = useState([]);

  const handleCancel = (subId) => {
    setCanceledSubs(prev => [...prev, subId]);
  };

  const activeSubs = subData.subscriptions.filter(s => !canceledSubs.includes(s.id));
  const recoveredSavings = canceledSubs.length * 180; // Estimated aggregate

  return (
    <div className="space-y-6">
      
      {/* 1. Header Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Recurring Intelligence & Behavior Analytics</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Pattern & Subscription Vault
            </h2>
            <p className="text-slate-400 text-xs max-w-2xl mt-1">
              Automated cadence detection uncovers recurring billing, unmasks silent price creep, and flags dormant "zombie" subscriptions.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Subscriptions</span>
              <span className="text-lg font-bold text-white">
                ${subData.totalMonthlySubSpend.toFixed(2)}/mo
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Annual Projection</span>
              <span className="text-lg font-bold text-indigo-400">
                ${subData.totalAnnualSubSpend.toFixed(2)}/yr
              </span>
            </div>
            {subData.potentialZombieSavings > 0 && (
              <>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">Zombie Leakage</span>
                  <span className="text-lg font-bold text-emerald-400">
                    -${Math.round(subData.potentialZombieSavings)}/yr
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Subscriptions & Zombie Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Tv className="w-4 h-4 text-pink-400" />
              <span>Active Subscriptions & Recurring Retainers</span>
            </h3>
            <p className="text-xs text-slate-400">AI monitors renewal cycles and usage activity</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {activeSubs.length} Active Services
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Service / Merchant</th>
                <th className="py-3 px-4">Cadence</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Annual Cost</th>
                <th className="py-3 px-4">AI Health & Zombie Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeSubs.map(sub => {
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{sub.merchant}</div>
                      <div className="text-[11px] text-slate-400">{sub.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {sub.cadence}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-white">
                        ${sub.amount.toFixed(2)}
                      </span>
                      {sub.hasCreep && (
                        <span className="ml-2 text-[10px] text-amber-400 font-medium" title={sub.creepInfo}>
                          ▲ Price Crept
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      ${sub.annualCost.toFixed(2)}/yr
                    </td>
                    <td className="py-3 px-4">
                      {sub.isZombie ? (
                        <div className="flex items-center space-x-1.5 text-rose-400 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Zombie (0 Visits / 45d)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>Healthy Utilization</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {sub.isZombie ? (
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold transition"
                        >
                          Cancel & Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Day of the Week Spending Pattern */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Day of Week Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Spending by Day of Week</span>
              </h3>
              <p className="text-xs text-slate-400">Discover temporal impulse & bill clustering habits</p>
            </div>
          </div>

          <div className="space-y-3">
            {dayPatterns.map(d => {
              const isPeak = d.percentage > 20;
              return (
                <div key={d.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{d.day}</span>
                    <span className="font-bold text-white">
                      ${d.total.toFixed(0)} <span className="text-slate-500 font-normal">({d.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isPeak ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.max(4, d.percentage * 2.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral AI Takeaway */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Behavioral Pattern Insights</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Weekend Discretionary Surge Identified
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed space-y-2">
              Friday and Saturday account for over <strong>38%</strong> of your discretionary restaurant and entertainment expenses.
              <br /><br />
              Meanwhile, fixed bills cluster on the <strong>1st through 5th</strong> of each month. Setting an automated sweep of $500 to savings on the 2nd ensures capital is protected before discretionary weekends arrive.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <div className="font-semibold text-emerald-400 mb-1">
              ✨ Recommended Rule Adjustment
            </div>
            Set a weekend micro-budget cap of $120 for dining out to increase annual savings by ~$1,440.
          </div>
        </div>

      </div>

    </div>
  );
}
