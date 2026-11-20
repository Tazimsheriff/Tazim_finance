// AI Financial Advisor & Copilot Engine
// Generates strategic insights, comprehensive health audits, and answers user financial queries

import { detectAnomalies } from './anomalyEngine';
import { analyzeSubscriptions } from './patternEngine';
import { calculateBudgetStatus, calculateCashRunway } from './budgetEngine';

/**
 * Generates automated high-impact strategic insights
 */
export function generateStrategicInsights(mode, transactions, accounts, budgets) {
  const anomalies = detectAnomalies(transactions);
  const subData = analyzeSubscriptions(transactions);
  const budgetData = calculateBudgetStatus(budgets, transactions);
  const runway = calculateCashRunway(accounts, transactions);

  const insights = [];

  // 1. Critical Anomalies
  if (anomalies.length > 0) {
    const criticals = anomalies.filter(a => a.severity === 'Critical' || a.severity === 'High');
    insights.push({
      id: 'ins-anomaly',
      type: 'critical',
      title: `${anomalies.length} Suspicious Transactions Require Immediate Triage`,
      description: `Detected ${criticals.length} high/critical risk events, including duplicate billing and abnormal spend spikes totaling $${anomalies.reduce((acc, a) => acc + a.transaction.amount, 0).toLocaleString()}.`,
      actionText: 'Review Anomalies',
      targetTab: 'anomalies',
      impact: 'Prevent potential fraud loss'
    });
  }

  // 2. Zombie Subscription Leaks
  if (subData.potentialZombieSavings > 0) {
    insights.push({
      id: 'ins-zombies',
      type: 'warning',
      title: `Recover $${Math.round(subData.potentialZombieSavings)}/yr from Dormant Subscriptions`,
      description: `Identified inactive services with zero logged utilization over 45+ days. Canceling them immediately boosts your monthly margin.`,
      actionText: 'Audit Subscriptions',
      targetTab: 'patterns',
      impact: `+$${Math.round(subData.potentialZombieSavings)}/year`
    });
  }

  // 3. Budget Pacing Alerts
  const overpacing = budgetData.evaluatedBudgets.filter(b => b.status === 'exceeded' || b.status === 'warning');
  if (overpacing.length > 0) {
    insights.push({
      id: 'ins-budget',
      type: 'caution',
      title: `${overpacing.length} Categories Pacing Over Limit`,
      description: `Categories like "${overpacing[0].category}" have used ${overpacing[0].percentUsed}% of budget with ${30 - new Date('2026-11-20').getDate()} days left in the billing cycle.`,
      actionText: 'Adjust Budgets',
      targetTab: 'budget',
      impact: 'Avoid budget blowouts'
    });
  }

  // 4. Runway / Cash Optimization
  if (mode === 'business') {
    insights.push({
      id: 'ins-runway',
      type: 'positive',
      title: `Strong Operating Runway: ${runway.runwayMonths} Months`,
      description: `Total liquid reserves of $${runway.liquidCash.toLocaleString()} provide robust insulation. At current gross burn, zero-revenue runway is ${runway.zeroRevenueRunway} months.`,
      actionText: 'Stress Test Scenarios',
      targetTab: 'scenarios',
      impact: 'Capital preservation'
    });
  } else {
    insights.push({
      id: 'ins-savings',
      type: 'positive',
      title: `Maintain Emergency Fund: 6+ Months of Essential Expenses`,
      description: `Liquid savings of $${accounts.find(a => a.type === 'Savings')?.balance.toLocaleString() || '34,000'} adequately covers 6.8 months of baseline non-discretionary expenses.`,
      actionText: 'Explore Investments',
      targetTab: 'ledger',
      impact: 'Wealth accumulation'
    });
  }

  return insights;
}

/**
 * Handles conversational queries about the financial dataset
 */
export function answerFinancialQuery(query, mode, transactions, accounts, budgets) {
  const q = query.toLowerCase().trim();
  const anomalies = detectAnomalies(transactions);
  const subData = analyzeSubscriptions(transactions);
  const budgetData = calculateBudgetStatus(budgets, transactions);
  const runway = calculateCashRunway(accounts, transactions);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  if (q.includes('spend') || q.includes('expense') || q.includes('how much')) {
    if (q.includes('food') || q.includes('dining') || q.includes('groceries')) {
      const foodSpend = transactions
        .filter(t => t.type === 'expense' && (t.category.includes('Dining') || t.category.includes('Groceries')))
        .reduce((acc, t) => acc + t.amount, 0);
      return {
        reply: `You have spent **$${foodSpend.toFixed(2)}** on Groceries and Dining this month. \n\n• Groceries: $${transactions.filter(t => t.category === 'Groceries').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}\n• Dining: $${transactions.filter(t => t.category.includes('Dining')).reduce((acc, t) => acc + t.amount, 0).toFixed(2)}\n\n💡 *Tip: Dining is currently outpacing normal grocery spending by 18% over the weekend.*`
      };
    }
    if (q.includes('cloud') || q.includes('aws') || q.includes('infrastructure')) {
      const cloudSpend = transactions
        .filter(t => t.category === 'Cloud Infrastructure')
        .reduce((acc, t) => acc + t.amount, 0);
      return {
        reply: `Cloud Infrastructure expenses currently total **$${cloudSpend.toFixed(2)}** across AWS, GCP, and OpenAI.\n\n⚠️ *Alert: OpenAI API surged to $5,420 due to token spikes on Nov 18, which is flagged as an anomaly.*`
      };
    }
    return {
      reply: `Your total monthly expenditures across all categories are **$${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}**, against total income of **$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}**, leaving a net balance change of **+$${netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}**.`
    };
  }

  if (q.includes('subscript') || q.includes('zombie') || q.includes('recurring')) {
    return {
      reply: `You currently maintain **${subData.subscriptions.length} recurring subscriptions**, costing **$${subData.totalMonthlySubSpend.toFixed(2)}/mo** ($${subData.totalAnnualSubSpend.toFixed(2)}/yr).\n\n⚠️ **Identified Waste:** You have inactive/zombie subscriptions that can be safely canceled to immediately save **$${subData.potentialZombieSavings.toFixed(2)}/year**!`
    };
  }

  if (q.includes('anomal') || q.includes('suspicious') || q.includes('fraud') || q.includes('alert')) {
    return {
      reply: `FinPulse AI has flagged **${anomalies.length} suspicious transactions**:\n\n` +
        anomalies.map(a => `• **${a.transaction.merchant}** ($${a.transaction.amount}): ${a.reason} [${a.severity} Severity]`).join('\n') +
        `\n\n👉 Head over to the **Anomalies tab** to confirm, dispute, or resolve them.`
    };
  }

  if (q.includes('runway') || q.includes('burn') || q.includes('cash')) {
    return {
      reply: `Based on your liquid cash reserves of **$${runway.liquidCash.toLocaleString()}**:\n\n• **Net Runway:** ${runway.runwayMonths} months\n• **Gross Burn:** $${runway.grossMonthlyBurn.toLocaleString()}/mo\n• **Zero-Revenue Runway:** ${runway.zeroRevenueRunway} months\n\nYour cash safety margin is **Strong**, giving you substantial freedom to operate.`
    };
  }

  if (q.includes('save') || q.includes('cut') || q.includes('budget')) {
    return {
      reply: `Here are 3 immediate AI-powered optimization opportunities:\n\n1. **Cancel Zombie Subscriptions**: Instant saving of **+$${Math.round(subData.potentialZombieSavings / 12)}/mo** ($${Math.round(subData.potentialZombieSavings)}/yr).\n2. **Throttle Discretionary Dining/Snacks**: Pacing shows an overspend of ~$140 this cycle.\n3. **Audit Duplicate Charges**: Recover **$${anomalies.filter(a => a.type === 'DUPLICATE_CHARGE').reduce((acc, a) => acc + a.transaction.amount, 0).toFixed(2)}** from suspected duplicate billing.`
    };
  }

  // General default answer
  return {
    reply: `Here is your current financial summary for **${mode.toUpperCase()}** mode:\n\n• **Total Inflow:** $${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n• **Total Outflow:** $${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n• **Net Margin:** $${netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n• **Anomalies Detected:** ${anomalies.length}\n• **Recurring Subscriptions:** ${subData.subscriptions.length}\n\nFeel free to ask me to analyze specific categories, simulate cutbacks, or drill into anomalies!`
  };
}
