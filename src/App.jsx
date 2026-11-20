import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import DashboardOverview from './components/DashboardOverview';
import AnomalyDetector from './components/AnomalyDetector';
import PatternAnalyzer from './components/PatternAnalyzer';
import BudgetPlanner from './components/BudgetPlanner';
import ScenarioSimulator from './components/ScenarioSimulator';
import TransactionLedger from './components/TransactionLedger';
import AddTransactionModal from './components/AddTransactionModal';
import StatementImportModal from './components/StatementImportModal';
import AICopilotDrawer from './components/AICopilotDrawer';

import { INITIAL_ACCOUNTS, INITIAL_BUDGETS, INITIAL_TRANSACTIONS } from './data/mockData';
import { detectAnomalies } from './services/anomalyEngine';
import { calculateCashRunway } from './services/budgetEngine';
import { generateStrategicInsights } from './services/aiAdvisorEngine';

export default function App() {
  const [mode, setMode] = useState('personal'); // 'personal' | 'business'
  const [activeTab, setActiveTab] = useState('overview');
  
  // All transactions state
  const [allTransactions, setAllTransactions] = useState(INITIAL_TRANSACTIONS);
  const [resolvedAnomalyIds, setResolvedAnomalyIds] = useState([]);
  const [disputedAnomalyIds, setDisputedAnomalyIds] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Filter current mode transactions
  const currentTransactions = useMemo(() => {
    return allTransactions.filter(t => t.mode === mode);
  }, [allTransactions, mode]);

  const currentAccounts = INITIAL_ACCOUNTS[mode] || [];
  const currentBudgets = INITIAL_BUDGETS[mode] || [];

  // Detect anomalies and filter out resolved/disputed
  const rawAnomalies = useMemo(() => {
    return detectAnomalies(currentTransactions);
  }, [currentTransactions]);

  const activeAnomalies = useMemo(() => {
    return rawAnomalies.filter(
      a => !resolvedAnomalyIds.includes(a.transactionId) && !disputedAnomalyIds.includes(a.transactionId)
    );
  }, [rawAnomalies, resolvedAnomalyIds, disputedAnomalyIds]);

  // Financial Runway calculation
  const runway = useMemo(() => {
    return calculateCashRunway(currentAccounts, currentTransactions);
  }, [currentAccounts, currentTransactions]);

  // Strategic AI Insights
  const insights = useMemo(() => {
    return generateStrategicInsights(mode, currentTransactions, currentAccounts, currentBudgets);
  }, [mode, currentTransactions, currentAccounts, currentBudgets]);

  // Handlers
  const handleAddTransaction = (newTx) => {
    setAllTransactions(prev => [newTx, ...prev]);
  };

  const handleBatchImport = (importedList) => {
    setAllTransactions(prev => [...importedList, ...prev]);
  };

  const handleResolveAnomaly = (txId) => {
    setResolvedAnomalyIds(prev => [...prev, txId]);
    // Also update transaction status in state
    setAllTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'verified', tags: t.tags?.filter(tag => tag !== 'anomaly') } : t));
  };

  const handleDisputeAnomaly = (txId) => {
    setDisputedAnomalyIds(prev => [...prev, txId]);
    setAllTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'disputed', tags: [...(t.tags || []), 'disputed_fraud'] } : t));
  };

  const handleResetAnomalies = () => {
    setResolvedAnomalyIds([]);
    setDisputedAnomalyIds([]);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        anomalyCount={activeAnomalies.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Executive KPI Metric Cards */}
        <KPICards
          mode={mode}
          accounts={currentAccounts}
          transactions={currentTransactions}
          anomalies={activeAnomalies}
          runway={runway}
          onViewAnomalies={() => setActiveTab('anomalies')}
        />

        {/* Tab Routing */}
        {activeTab === 'overview' && (
          <DashboardOverview
            mode={mode}
            insights={insights}
            transactions={currentTransactions}
            accounts={currentAccounts}
            setActiveTab={setActiveTab}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyDetector
            anomalies={activeAnomalies}
            onResolveAnomaly={handleResolveAnomaly}
            onDisputeAnomaly={handleDisputeAnomaly}
            onResetAnomalies={handleResetAnomalies}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternAnalyzer
            transactions={currentTransactions}
            onCancelSubscription={(id) => alert(`Subscription ${id} cancel request logged.`)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            mode={mode}
            budgets={currentBudgets}
            transactions={currentTransactions}
            accounts={currentAccounts}
            onUpdateBudget={() => {}}
          />
        )}

        {activeTab === 'scenarios' && (
          <ScenarioSimulator
            mode={mode}
            transactions={currentTransactions}
            accounts={currentAccounts}
          />
        )}

        {activeTab === 'ledger' && (
          <TransactionLedger
            transactions={currentTransactions}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">FinPulse AI</span>
            <span>•</span>
            <span>Tazim Financial Intelligence OS</span>
          </div>
          <div>
            Powered by Automated NLP Categorization, Statistical Outlier Detection & Dynamic Budget Pacing
          </div>
        </div>
      </footer>

      {/* Modals & Slide-out Assistant */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        mode={mode}
      />

      <StatementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onBatchImport={handleBatchImport}
        mode={mode}
      />

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        mode={mode}
        transactions={currentTransactions}
        accounts={currentAccounts}
        budgets={currentBudgets}
      />

    </div>
  );
}
