import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  ChevronRight, 
  DollarSign, 
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';
import { answerFinancialQuery } from '../services/aiAdvisorEngine';

export default function AICopilotDrawer({ 
  isOpen, 
  onClose, 
  mode, 
  transactions, 
  accounts, 
  budgets 
}) {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello! I am your **FinPulse AI Financial Strategist**. I have real-time access to your transactions, subscriptions, and liquidity bounds.\n\nAsk me anything or select a prompt below to begin!`
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Where can I cut $300 this month?',
    'What subscriptions am I paying for?',
    'Show suspicious flagged transactions',
    'What is my business cash runway?',
    'How much did I spend on food and dining?'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { id: `m-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Compute AI reply
    setTimeout(() => {
      const response = answerFinancialQuery(query, mode, transactions, accounts, budgets);
      const aiMsg = { id: `m-${Date.now() + 1}`, sender: 'assistant', text: response.reply };
      setMessages(prev => [...prev, aiMsg]);
    }, 300);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>FinPulse AI Advisor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <span className="text-[10px] text-slate-400">Context: {mode.toUpperCase()} Profile</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts Chips & Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/70 space-y-3">
        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask about spending, runway, or savings..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
