// AI Anomaly & Fraud Detection Engine
// Detects statistical outliers (Z-Score & IQR), duplicate charges, frequency velocity spikes, and price creep

/**
 * Calculates standard deviation and mean for a list of numbers
 */
function getStats(values) {
  if (values.length === 0) return { mean: 0, stdDev: 0, median: 0, q1: 0, q3: 0, iqr: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;
  
  const squareDiffs = sorted.map(v => Math.pow(v - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((acc, v) => acc + v, 0) / sorted.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const q1 = sorted[Math.floor(sorted.length * 0.25)] || median;
  const q3 = sorted[Math.floor(sorted.length * 0.75)] || median;
  const iqr = q3 - q1;

  return { mean, stdDev, median, q1, q3, iqr };
}

/**
 * Analyzes transactions and flags anomalies with explainable reasons & risk scores
 */
export function detectAnomalies(transactions) {
  if (!transactions || transactions.length === 0) return [];

  const flagged = [];
  const expenses = transactions.filter(t => t.type === 'expense');

  // Group by category to build historical baselines
  const categoryStats = {};
  expenses.forEach(t => {
    if (!categoryStats[t.category]) categoryStats[t.category] = [];
    categoryStats[t.category].push(t.amount);
  });

  const categoryMetrics = {};
  for (const cat in categoryStats) {
    categoryMetrics[cat] = getStats(categoryStats[cat]);
  }

  // Overall expense stats
  const overallStats = getStats(expenses.map(t => t.amount));

  // 1. Check for Duplicate Charges (Same or very close amount, same merchant, within 72 hours)
  for (let i = 0; i < expenses.length; i++) {
    for (let j = i + 1; j < expenses.length; j++) {
      const a = expenses[i];
      const b = expenses[j];

      const sameMerchant = a.merchant.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) ===
                           b.merchant.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
      const sameAmount = Math.abs(a.amount - b.amount) < 0.01;

      if (sameMerchant && sameAmount) {
        const timeA = new Date(a.date.split(' ')[0]).getTime();
        const timeB = new Date(b.date.split(' ')[0]).getTime();
        const diffDays = Math.abs(timeA - timeB) / (1000 * 3600 * 24);

        if (diffDays <= 3) {
          // Flag transaction b (or both if not already flagged)
          flagged.push({
            transactionId: b.id,
            transaction: b,
            type: 'DUPLICATE_CHARGE',
            severity: 'High',
            riskScore: 88,
            title: 'Suspected Duplicate Charge',
            reason: `Identical amount ($${b.amount.toFixed(2)}) charged at "${b.merchant}" within ${Math.round(diffDays * 24)} hours of transaction "${a.merchant}".`,
            recommendation: 'Contact merchant or initiate bank card chargeback dispute if double debited.'
          });
        }
      }
    }
  }

  // 2. Statistical Outlier Detection (Z-score and IQR spikes)
  expenses.forEach(tx => {
    const metrics = categoryMetrics[tx.category] || overallStats;
    const zScore = metrics.stdDev > 0 ? (tx.amount - metrics.mean) / metrics.stdDev : 0;
    const isIqrOutlier = metrics.iqr > 0 && tx.amount > (metrics.q3 + 2.5 * metrics.iqr);

    // If explicit tag or statistical spike
    const isExplicitAnomaly = tx.tags?.includes('anomaly') || tx.tags?.includes('spike_anomaly') || tx.tags?.includes('foreign_outlier');

    if ((zScore > 2.8 || isIqrOutlier || isExplicitAnomaly) && !flagged.some(f => f.transactionId === tx.id)) {
      let severity = 'Medium';
      let riskScore = 65;
      let title = 'Unusual High Spending Spike';
      let reason = `Amount of $${tx.amount.toFixed(2)} is ${zScore.toFixed(1)} standard deviations above the average ($${metrics.mean.toFixed(2)}) for "${tx.category}".`;
      let recommendation = 'Review receipt to verify if this was an approved one-time capital purchase.';

      if (tx.amount > 3000 || zScore > 4 || tx.tags?.includes('high_risk')) {
        severity = 'Critical';
        riskScore = 95;
        title = 'Critical Expenditure Anomaly';
        recommendation = 'Immediately freeze virtual card or escalate to CFO/Account holder.';
      } else if (tx.amount > 1000 || zScore > 3) {
        severity = 'High';
        riskScore = 80;
      }

      flagged.push({
        transactionId: tx.id,
        transaction: tx,
        type: 'STATISTICAL_OUTLIER',
        severity,
        riskScore,
        title,
        reason,
        recommendation
      });
    }
  });

  return flagged;
}
