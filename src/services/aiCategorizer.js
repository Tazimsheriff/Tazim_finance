// Intelligent AI Categorizer Service
// Matches transaction descriptions, merchants, and amounts to categories using NLP keyword weights, heuristics, and pattern matching

const KEYWORD_RULES = [
  // Income
  { keywords: ['payroll', 'salary', 'wages', 'direct dep', 'employer'], category: 'Salary & Wages', type: 'income', confidence: 0.98 },
  { keywords: ['freelance', 'upwork', 'fiverr', 'contract', 'consulting', 'retainer', 'client fee'], category: 'Freelance & Side Hustle', type: 'income', confidence: 0.95 },
  { keywords: ['stripe', 'mrr', 'paddle', 'lemon squeezy', 'shopify', 'subscription revenue'], category: 'SaaS Subscription Revenue', type: 'income', confidence: 0.97 },

  // Business Expenses
  { keywords: ['aws', 'amazon web', 'gcp', 'google cloud', 'azure', 'digitalocean', 'ovh', 'cloudflare', 'openai', 'anthropic', 'gpu'], category: 'Cloud Infrastructure', type: 'expense', confidence: 0.96 },
  { keywords: ['gusto', 'deel', 'rippling', 'adp', 'payroll', 'contractor', 'bonus'], category: 'Payroll & Contractors', type: 'expense', confidence: 0.94 },
  { keywords: ['slack', 'figma', 'github', 'gitlab', 'linear', 'jira', 'notion', 'miro', 'zoom', 'atlassian', 'hubspot'], category: 'SaaS Tools & Software', type: 'expense', confidence: 0.95 },
  { keywords: ['google ads', 'meta ads', 'facebook ads', 'twitter ads', 'linkedin ads', 'tiktok ads', 'sponsorship'], category: 'Marketing & Advertising', type: 'expense', confidence: 0.93 },
  { keywords: ['wework', 'regus', 'coworking', 'office rent', 'real estate lease'], category: 'Office & Co-Working', type: 'expense', confidence: 0.95 },
  { keywords: ['legal', 'attorney', 'cpa', 'accounting', 'tax service', 'delaware'], category: 'Legal & Professional', type: 'expense', confidence: 0.91 },

  // Personal Expenses
  { keywords: ['rent', 'lease', 'apartment', 'mortgage', 'avalon', 'equity residential'], category: 'Housing & Rent', type: 'expense', confidence: 0.99 },
  { keywords: ['whole foods', 'trader joe', 'costco', 'safeway', 'kroger', 'grocer', 'supermarket', 'market', 'aldi'], category: 'Groceries', type: 'expense', confidence: 0.96 },
  { keywords: ['restaurant', 'pizza', 'sushi', 'cafe', 'coffee', 'starbucks', 'diner', 'bistro', 'burger', 'bar', 'grill', 'ubereats', 'doordash'], category: 'Dining & Nightlife', type: 'expense', confidence: 0.95 },
  { keywords: ['conedison', 'electric', 'gas bill', 'water bill', 'verizon', 'at&t', 't-mobile', 'comcast', 'internet', 'utility'], category: 'Utilities & Bills', type: 'expense', confidence: 0.97 },
  { keywords: ['netflix', 'spotify', 'hulu', 'disney', 'hbo', 'apple music', 'youtube premium', 'audible', 'blinkist', 'sub'], category: 'Streaming & Subscriptions', type: 'expense', confidence: 0.98 },
  { keywords: ['uber', 'lyft', 'chevron', 'shell', 'exxon', 'mobil', 'parking', 'transit', 'subway', 'metro', 'toll'], category: 'Transportation & Fuel', type: 'expense', confidence: 0.92 },
  { keywords: ['gym', 'equinox', 'fitness', 'planet fitness', 'yoga', 'crossfit', 'pharmacy', 'cvs', 'walgreens', 'doctor'], category: 'Health & Fitness', type: 'expense', confidence: 0.94 },
  { keywords: ['apple store', 'amazon', 'target', 'walmart', 'best buy', 'zara', 'nike', 'sephora', 'retail'], category: 'Shopping & Retail', type: 'expense', confidence: 0.90 },
  { keywords: ['airline', 'delta', 'united', 'american air', 'hotel', 'airbnb', 'marriott', 'hilton', 'booking.com', 'flight'], category: 'Travel & Vacation', type: 'expense', confidence: 0.96 },
  { keywords: ['vanguard', 'fidelity', 'charles schwab', 'robinhood', 'marcus', 'etf', 'index fund', 'crypto', 'coinbase'], category: 'Investments & Savings', type: 'transfer', confidence: 0.97 },
];

/**
 * Predicts the most likely category, type, and confidence score for a given transaction text.
 */
export function predictCategory(text, amount = 0, currentMode = 'personal') {
  if (!text) return { category: currentMode === 'business' ? 'SaaS Tools & Software' : 'Shopping & Retail', confidence: 0.40, type: 'expense' };

  const clean = text.toLowerCase();
  
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (clean.includes(kw)) {
        return {
          category: rule.category,
          type: rule.type,
          confidence: rule.confidence,
          matchedKeyword: kw
        };
      }
    }
  }

  // Fallbacks based on mode
  if (currentMode === 'business') {
    return { category: 'SaaS Tools & Software', confidence: 0.50, type: amount > 0 ? 'expense' : 'income' };
  }
  return { category: 'Shopping & Retail', confidence: 0.50, type: amount > 0 ? 'expense' : 'income' };
}
