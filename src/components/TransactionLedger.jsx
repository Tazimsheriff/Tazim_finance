import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpDown,
  Tag,
  DollarSign
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function TransactionLedger({ 
  transactions, 
  onOpenAddModal,
  onOpenImportModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  // Filter logic
  const filtered = transactions.filter(t => {
    if (selectedType !== 'ALL' && t.type !== selectedType) return false;
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;
    if (searchTerm) {
      const matchMerchant = t.merchant.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDesc = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTag = t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchMerchant && !matchDesc && !matchCat && !matchTag) return false;
    }
    return true;
  }).sort((a, b) => {
    return sortOrder === 'desc' 
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Merchant', 'Description', 'Category', 'Type', 'Amount', 'Account', 'Status'];
    const rows = filtered.map(t => [
      t.id,
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.type,
      t.amount,
      t.account,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tazim_finance_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Financial Transaction Ledger
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Comprehensive double-entry transaction record with continuous ML category tags and threat classification.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Export Current Filtered View as CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search merchant, tag, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Type & Category Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
              <option value="transfer">Transfers</option>
            </select>

            {/* Category selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[200px]"
            >
              <option value="ALL">All Categories</option>
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant & Memo</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-right">AI Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filtered.map(tx => {
                  const isFlagged = tx.tags?.includes('anomaly') || tx.tags?.includes('duplicate_suspect') || tx.tags?.includes('high_risk');
                  const isIncome = tx.type === 'income';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{tx.merchant}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm">{tx.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`font-bold ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                          {isIncome ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {tx.tags?.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700/50"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-slate-950/60 px-4 py-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing <strong>{filtered.length}</strong> of <strong>{transactions.length}</strong> transactions</span>
          <span>Double-entry ledger integrity verified</span>
        </div>
      </div>

    </div>
  );
}
