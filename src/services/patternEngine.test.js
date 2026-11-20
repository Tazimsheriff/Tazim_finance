import { describe, it, expect } from 'vitest';
import { analyzeSubscriptions, analyzeDayOfWeekPatterns, analyze50_30_20 } from './patternEngine';

describe('AI Pattern & Subscription Analytics Engine', () => {
  it('correctly aggregates subscriptions and flags zombie services', () => {
    const transactions = [
      {
        id: 'sub-1',
        merchant: 'Netflix Premium',
        amount: 24.99,
        type: 'expense',
        category: 'Streaming & Subscriptions',
        date: '2026-11-05',
        isRecurring: true
      },
      {
        id: 'sub-2',
        merchant: 'Unused Gym Pass',
        amount: 150.00,
        type: 'expense',
        category: 'Health & Fitness',
        date: '2026-11-06',
        tags: ['zombie_subscription'],
        isRecurring: true
      }
    ];

    const result = analyzeSubscriptions(transactions);
    expect(result.subscriptions.length).toBe(2);
    expect(result.totalMonthlySubSpend).toBeCloseTo(174.99, 2);
    expect(result.potentialZombieSavings).toBe(1800); // $150 * 12
    const zombie = result.subscriptions.find(s => s.isZombie);
    expect(zombie).toBeDefined();
    expect(zombie.merchant).toBe('Unused Gym Pass');
  });

  it('calculates 50/30/20 budget allocations accurately', () => {
    const transactions = [
      { id: 'inc-1', amount: 10000, type: 'income', category: 'Salary & Wages' },
      { id: 'exp-1', amount: 4500, type: 'expense', category: 'Housing & Rent' }, // Need
      { id: 'exp-2', amount: 2000, type: 'expense', category: 'Dining & Nightlife' }, // Want
      { id: 'sav-1', amount: 2500, type: 'transfer', category: 'Investments & Savings' } // Savings
    ];

    const allocation = analyze50_30_20(transactions);
    expect(allocation.needs.percentage).toBe(45);
    expect(allocation.wants.percentage).toBe(20);
    expect(allocation.savings.percentage).toBe(25);
  });

  it('analyzes day-of-week spending distribution', () => {
    const transactions = [
      { id: 't1', amount: 100, type: 'expense', date: '2026-11-20' }, // Friday
      { id: 't2', amount: 200, type: 'expense', date: '2026-11-21' }  // Saturday
    ];

    const dayPatterns = analyzeDayOfWeekPatterns(transactions);
    expect(dayPatterns.length).toBe(7);
    const fri = dayPatterns.find(d => d.day === 'Friday');
    const sat = dayPatterns.find(d => d.day === 'Saturday');
    expect(fri.total).toBe(100);
    expect(sat.total).toBe(200);
  });
});
