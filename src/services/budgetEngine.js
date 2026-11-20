// Smart Budget & Runway Engine

export function calculateBudgetStatus(budgets, transactions, currentDate = new Date('2026-11-20')) {
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const expectedPacingPercent = (currentDay / daysInMonth) * 100;

  // Aggregate current month spend per category
  const categorySpend = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
    });

  const evaluatedBudgets = budgets.map(b => {
    const spent = categorySpend[b.category] || 0;
    const remaining = Math.max(0, b.limit - spent);
    const percentUsed = Math.round((spent / b.limit) * 100);
    const projectedMonthEnd = (spent / Math.max(1, currentDay)) * daysInMonth;
    const projectedPercent = Math.round((projectedMonthEnd / b.limit) * 100);

    let status = 'healthy';
    let statusLabel = 'On Track';

    if (spent > b.limit) {
      status = 'exceeded';
      statusLabel = 'Exceeded Limit';
    } else if (projectedPercent > 115) {
      status = 'warning';
      statusLabel = 'Pacing to Overspend';
    } else if (percentUsed > 80) {
      status = 'caution';
      statusLabel = 'Near Limit';
    }

    return {
      category: b.category,
      limit: b.limit,
      spent,
      remaining,
      percentUsed,
      projectedMonthEnd,
      projectedPercent,
      expectedPacingPercent: Math.round(expectedPacingPercent),
      status,
      statusLabel
    };
  });

  // Calculate dynamic rebalancing suggestions
  const overspent = evaluatedBudgets.filter(b => b.spent > b.limit || b.projectedPercent > 115);
  const underspent = evaluatedBudgets.filter(b => b.projectedPercent < 80 && (b.limit - b.projectedMonthEnd) > 50);

  const rebalancingSuggestions = [];
  if (overspent.length > 0 && underspent.length > 0) {
    const donor = underspent[0];
    const receiver = overspent[0];
    const surplus = donor.limit - donor.projectedMonthEnd;
    const deficit = receiver.projectedMonthEnd - receiver.limit;
    const transferAmount = Math.min(surplus, deficit);

    if (transferAmount > 20) {
      rebalancingSuggestions.push({
        from: donor.category,
        to: receiver.category,
        amount: Math.round(transferAmount),
        reason: `Reallocate $${Math.round(transferAmount)} of projected surplus in "${donor.category}" to cover pacing deficit in "${receiver.category}".`
      });
    }
  }

  return {
    evaluatedBudgets,
    rebalancingSuggestions,
    totalBudget: budgets.reduce((acc, b) => acc + b.limit, 0),
    totalSpent: evaluatedBudgets.reduce((acc, b) => acc + b.spent, 0),
  };
}

/**
 * Calculates Cash Runway and Burn for Business/Freelance
 */
export function calculateCashRunway(accounts, transactions, stressFactor = 0) {
  const liquidCash = accounts
    .filter(a => a.type === 'Checking' || a.type === 'Savings' || a.type === 'Treasury')
    .reduce((acc, a) => acc + Math.max(0, a.balance), 0);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  // Apply stress factor (e.g. -20% revenue drop)
  const adjustedIncome = totalIncome * (1 - stressFactor / 100);
  const netMonthlyBurn = Math.max(0, totalExpenses - adjustedIncome);
  const grossMonthlyBurn = totalExpenses;

  const runwayMonths = netMonthlyBurn > 0 ? (liquidCash / netMonthlyBurn).toFixed(1) : 'Infinite (Profitable)';
  const zeroRevenueRunway = (liquidCash / Math.max(1, grossMonthlyBurn)).toFixed(1);

  return {
    liquidCash,
    totalIncome: adjustedIncome,
    totalExpenses,
    netMonthlyBurn,
    grossMonthlyBurn,
    runwayMonths,
    zeroRevenueRunway,
    status: (typeof runwayMonths === 'string') ? 'healthy' : (parseFloat(runwayMonths) < 6 ? 'critical' : parseFloat(runwayMonths) < 12 ? 'warning' : 'healthy')
  };
}
