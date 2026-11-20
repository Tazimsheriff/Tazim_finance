import React from 'react';
import { 
  Building2, 
  User, 
  PlusCircle, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  Bot, 
  PieChart, 
  Layers, 
  Compass, 
  SlidersHorizontal,
  Wallet
} from 'lucide-react';

export default function Navbar({ 
  mode, 
  setMode, 
  activeTab, 
  setActiveTab, 
  anomalyCount, 
  onOpenAddModal, 
  onOpenImportModal, 
  onToggleCopilot 
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'anomalies', label: 'Anomaly Hub', icon: ShieldAlert, badge: anomalyCount },
    { id: 'patterns', label: 'Patterns & Subs', icon: Compass },
    { id: 'budget', label: 'Budgets & Runway', icon: Layers },
    { id: 'scenarios', label: 'Scenario Simulator', icon: SlidersHorizontal },
    { id: 'ledger', label: 'Transactions', icon: Wallet },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Mode Switcher */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  FinPulse AI
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Tazim Finance Intelligence
                </span>
              </div>
            </div>

            {/* Persona Switcher Pill */}
            <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setMode('personal')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'personal'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal Wealth</span>
              </button>
              <button
                onClick={() => setMode('business')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'business'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Business & Startup</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Add New Transaction with AI Auto-Categorization"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Import CSV Statement"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Import CSV</span>
            </button>

            <button
              onClick={onToggleCopilot}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
