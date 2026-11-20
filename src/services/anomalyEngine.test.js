import { describe, it, expect } from 'vitest';
import { detectAnomalies } from './anomalyEngine';

describe('AI Anomaly & Fraud Sentinel Engine', () => {
  it('detects duplicate charges occurring within 72 hours', () => {
    const transactions = [
      {
        id: 'tx-1',
        merchant: 'Apple Store Online',
        description: 'AirPods Pro',
        amount: 249.00,
        type: 'expense',
        category: 'Shopping & Retail',
        date: '2026-11-17 10:00'
      },
      {
        id: 'tx-2',
        merchant: 'Apple Store Online',
        description: 'AirPods Pro (Duplicate)',
        amount: 249.00,
        type: 'expense',
        category: 'Shopping & Retail',
        date: '2026-11-17 10:05'
      }
    ];

    const anomalies = detectAnomalies(transactions);
    expect(anomalies.length).toBeGreaterThanOrEqual(1);
    const duplicate = anomalies.find(a => a.type === 'DUPLICATE_CHARGE');
    expect(duplicate).toBeDefined();
    expect(duplicate.severity).toBe('High');
    expect(duplicate.transactionId).toBe('tx-2');
  });

  it('detects extreme statistical expenditure outliers', () => {
    const baseline = [
      { id: 'b1', merchant: 'Coffee Shop', amount: 5, type: 'expense', category: 'Dining & Nightlife', date: '2026-11-01' },
      { id: 'b2', merchant: 'Lunch Diner', amount: 15, type: 'expense', category: 'Dining & Nightlife', date: '2026-11-02' },
      { id: 'b3', merchant: 'Casual Food', amount: 18, type: 'expense', category: 'Dining & Nightlife', date: '2026-11-03' },
      { id: 'b4', merchant: 'Bakery', amount: 8, type: 'expense', category: 'Dining & Nightlife', date: '2026-11-04' },
      { id: 'b5', merchant: 'Sandwiches', amount: 12, type: 'expense', category: 'Dining & Nightlife', date: '2026-11-05' },
      // Extreme outlier
      { id: 'spike-1', merchant: 'VIP Banquet', amount: 2800, type: 'expense', category: 'Dining & Nightlife', date: '2026-11-06' }
    ];

    const anomalies = detectAnomalies(baseline);
    const spike = anomalies.find(a => a.transactionId === 'spike-1');
    expect(spike).toBeDefined();
    expect(spike.type).toBe('STATISTICAL_OUTLIER');
    expect(spike.severity).toBe('High');
  });

  it('handles empty or income-only lists cleanly without error', () => {
    expect(detectAnomalies([])).toEqual([]);
    expect(detectAnomalies([{ id: 'inc-1', merchant: 'Employer', amount: 5000, type: 'income', date: '2026-11-01' }])).toEqual([]);
  });
});
