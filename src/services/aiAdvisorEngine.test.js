import { describe, it, expect } from 'vitest';
import { generateStrategicInsights, answerFinancialQuery } from './aiAdvisorEngine';
import { INITIAL_ACCOUNTS, INITIAL_BUDGETS, INITIAL_TRANSACTIONS } from '../data/mockData';

describe('AI Financial Advisor & Copilot Engine', () => {
  it('generates high-impact strategic insights from transaction data', () => {
    const personalTxs = INITIAL_TRANSACTIONS.filter(t => t.mode === 'personal');
    const insights = generateStrategicInsights('personal', personalTxs, INITIAL_ACCOUNTS.personal, INITIAL_BUDGETS.personal);
    
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights.some(i => i.type === 'critical' || i.type === 'warning')).toBe(true);
  });

  it('answers conversational natural language financial queries accurately', () => {
    const personalTxs = INITIAL_TRANSACTIONS.filter(t => t.mode === 'personal');

    const foodReply = answerFinancialQuery('How much did I spend on food and dining?', 'personal', personalTxs, INITIAL_ACCOUNTS.personal, INITIAL_BUDGETS.personal);
    expect(foodReply.reply).toContain('Groceries');
    expect(foodReply.reply).toContain('Dining');

    const subReply = answerFinancialQuery('What subscriptions am I paying for?', 'personal', personalTxs, INITIAL_ACCOUNTS.personal, INITIAL_BUDGETS.personal);
    expect(subReply.reply).toContain('subscriptions');

    const fraudReply = answerFinancialQuery('Show me suspicious transactions', 'personal', personalTxs, INITIAL_ACCOUNTS.personal, INITIAL_BUDGETS.personal);
    expect(fraudReply.reply).toContain('FinPulse AI has flagged');
  });
});
