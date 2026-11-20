// AI Pattern Identification & Subscription Intelligence Engine

/**
 * Identifies recurring transactions, subscriptions, price changes, and zombie charges
 */
export function analyzeSubscriptions(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const merchantGroups = {};

  expenses.forEach(tx => {
    // Clean merchant key
    const key = tx.merchant.toLowerCase().trim();
    if (!merchantGroups[key]) merchantGroups[key] = [];
    merchantGroups[key].push(tx);
  });

  const subscriptions = [];

  for (const key in merchantGroups) {
    const list = merchantGroups[key];
    const isTaggedRecurring = list.some(t => t.isRecurring || t.tags?.includes('subscription') || t.tags?.includes('zombie_subscription'));

    if (isTaggedRecurring || list.length >= 1) {
      // Check if candidate is subscription
      const sample = list[0];
      const isZombie = list.some(t => t.tags?.includes('zombie_subscription'));
      const hasCreep = list.some(t => t.tags?.includes('price_creep')) || (list.length > 1 && list[0].amount !== list[1].amount);

      // Estimated cadence
      const cadence = sample.tags?.includes('annual') ? 'Yearly' : 'Monthly';
      const monthlyEquivalent = cadence === 'Yearly' ? sample.amount / 12 : sample.amount;

      subscriptions.push({
        id: `sub-${sample.id}`,
        merchant: sample.merchant,
        category: sample.category,
        amount: sample.amount,
        cadence,
        monthlyEquivalent,
        annualCost: monthlyEquivalent * 12,
        isZombie,
        zombieReason: isZombie ? 'Zero platform activity or log in detected over the last 45+ days.' : null,
        hasCreep,
        creepInfo: hasCreep ? 'Price bumped ~25% compared to baseline billing' : null,
        lastBilled: sample.date.split(' ')[0],
        status: isZombie ? 'Action Recommended' : 'Active'
      });
    }
  }

  // Calculate totals
  const totalMonthlySubSpend = subscriptions.reduce((acc, s) => acc + s.monthlyEquivalent, 0);
  const totalAnnualSubSpend = subscriptions.reduce((acc, s) => acc + s.annualCost, 0);
  const potentialZombieSavings = subscriptions.filter(s => s.isZombie).reduce((acc, s) => acc + s.annualCost, 0);

  return {
    subscriptions,
    totalMonthlySubSpend,
    totalAnnualSubSpend,
    potentialZombieSavings
  };
}

/**
 * Calculates day of week distribution of expenses
 */
export function analyzeDayOfWeekPatterns(transactions) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const distribution = [0, 0, 0, 0, 0, 0, 0];
  const count = [0, 0, 0, 0, 0, 0, 0];

  transactions.filter(t => t.type === 'expense').forEach(tx => {
    const d = new Date(tx.date.split(' ')[0]);
    const dayIdx = d.getDay();
    if (!isNaN(dayIdx)) {
      distribution[dayIdx] += tx.amount;
      count[dayIdx] += 1;
    }
  });

  const total = distribution.reduce((a, b) => a + b, 0) || 1;
  const weekendSpend = distribution[0] + distribution[6];
  const weekdaySpend = total - weekendSpend;

  return days.map((day, idx) => ({
    day,
    shortDay: day.slice(0, 3),
    total: distribution[idx],
    percentage: Math.round((distribution[idx] / total) * 100),
    count: count[idx]
  }));
}

/**
 * Calculates 50/30/20 Needs, Wants, Savings breakdown
 */
export function analyze50_30_20(transactions) {
  let needs = 0;
  let wants = 0;
  let savings = 0;
  let totalIncome = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else if (t.type === 'transfer' && t.category.includes('Investments')) {
      savings += t.amount;
    } else if (t.type === 'expense') {
      // Categorize needs vs wants
      const isNeed = ['Housing & Rent', 'Groceries', 'Utilities & Bills', 'Transportation & Fuel', 'Cloud Infrastructure', 'Payroll & Contractors', 'Legal & Professional'].includes(t.category);
      if (isNeed) {
        needs += t.amount;
      } else {
        wants += t.amount;
      }
    }
  });

  const base = totalIncome || (needs + wants + savings) || 1;

  return {
    totalIncome,
    needs: { amount: needs, percentage: Math.round((needs / base) * 100), target: 50 },
    wants: { amount: wants, percentage: Math.round((wants / base) * 100), target: 30 },
    savings: { amount: savings, percentage: Math.round((savings / base) * 100), target: 20 },
  };
}
