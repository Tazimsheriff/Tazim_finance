import { describe, it, expect } from 'vitest';
import { calculateBudgetStatus, calculateCashRunway } from './budgetEngine';

describe('Smart Budget & Runway Calculation Engine', () => {
  const mockBudgets = [
    { category: 'Groceries', limit: 500, period: 'monthly' },
    { category: 'Dining & Nightlife', limit: 300, period: 'monthly' },
    { category: 'Utilities & Bills', limit: 200, period: 'monthly' }
  ];

  it('evaluates budget pacing and flags overspending', () => {
    const transactions = [
      { id: '1', amount: 450, type: 'expense', category: 'Dining & Nightlife' }, // 150% used
      { id: '2', amount: 100, type: 'expense', category: 'Groceries' },          // 20% used
    ];

    const result = calculateBudgetStatus(mockBudgets, transactions, new Date('2026-11-20'));
    expect(result.totalBudget).toBe(1000);
    expect(result.totalSpent).toBe(550);

    const dining = result.evaluatedBudgets.find(b => b.category === 'Dining & Nightlife');
    expect(dining.status).toBe('exceeded');
    expect(dining.percentUsed).toBe(150);

    const groceries = result.evaluatedBudgets.find(b => b.category === 'Groceries');
    expect(groceries.status).toBe('healthy');
  });

  it('suggests algorithmic rebalancing between surplus and deficit envelopes', () => {
    const transactions = [
      { id: '1', amount: 280, type: 'expense', category: 'Dining & Nightlife' }, // pacing over limit
      { id: '2', amount: 50, type: 'expense', category: 'Groceries' }           // huge surplus
    ];

    const result = calculateBudgetStatus(mockBudgets, transactions, new Date('2026-11-20'));
    expect(result.rebalancingSuggestions.length).toBeGreaterThanOrEqual(1);
    const suggestion = result.rebalancingSuggestions[0];
    expect(suggestion.from).toBe('Groceries');
    expect(suggestion.to).toBe('Dining & Nightlife');
  });

  it('calculates cash runway under normal and stressed macro conditions', () => {
    const accounts = [
      { id: 'acc-1', type: 'Checking', balance: 50000 },
      { id: 'acc-2', type: 'Savings', balance: 50000 }
    ];

    const transactions = [
      { id: 'inc-1', amount: 15000, type: 'income' },
      { id: 'exp-1', amount: 25000, type: 'expense' }
    ];

    // Net burn = $10,000 / month; Liquid cash = $100,000 -> Runway = 10 months
    const baselineRunway = calculateCashRunway(accounts, transactions, 0);
    expect(baselineRunway.liquidCash).toBe(100000);
    expect(baselineRunway.netMonthlyBurn).toBe(10000);
    expect(baselineRunway.runwayMonths).toBe('10.0');

    // Stressed with 50% revenue drop -> Income becomes $7,500, net burn becomes $17,500
    const stressedRunway = calculateCashRunway(accounts, transactions, 50);
    expect(stressedRunway.netMonthlyBurn).toBe(17500);
    expect(parseFloat(stressedRunway.runwayMonths)).toBeLessThan(10);
  });
});
