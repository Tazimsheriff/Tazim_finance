import { describe, it, expect } from 'vitest';
import { predictCategory } from './aiCategorizer';

describe('AI Categorizer Service', () => {
  it('correctly categorizes salary and wage income', () => {
    const result = predictCategory('Bi-Weekly Acme Corp Payroll Deposit', 4000, 'personal');
    expect(result.category).toBe('Salary & Wages');
    expect(result.type).toBe('income');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('correctly categorizes SaaS cloud infrastructure expenses', () => {
    const result = predictCategory('Amazon Web Services AWS Cloud EMEA', 350, 'business');
    expect(result.category).toBe('Cloud Infrastructure');
    expect(result.type).toBe('expense');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('correctly classifies grocery purchases', () => {
    const result = predictCategory('Whole Foods Market Groceries #102', 125.40, 'personal');
    expect(result.category).toBe('Groceries');
    expect(result.type).toBe('expense');
  });

  it('correctly classifies streaming subscriptions', () => {
    const result = predictCategory('Netflix.com monthly subscription', 24.99, 'personal');
    expect(result.category).toBe('Streaming & Subscriptions');
    expect(result.type).toBe('expense');
  });

  it('correctly classifies restaurant dining', () => {
    const result = predictCategory('Joe’s Pizza Greenwich Village', 28.50, 'personal');
    expect(result.category).toBe('Dining & Nightlife');
    expect(result.type).toBe('expense');
  });

  it('provides safe fallback for unknown inputs', () => {
    const result = predictCategory('XYZ Random Unrecognized String 998', 50, 'personal');
    expect(result.category).toBe('Shopping & Retail');
    expect(result.confidence).toBeLessThanOrEqual(0.5);
  });
});
