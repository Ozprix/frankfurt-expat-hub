
export const budgetTemplatesData = [
  {
    id: 'template-student',
    name: 'Student Budget',
    total_budget: 1200,
    description: 'Optimized for students living in shared flats (WG).',
    categories: [
      { name: 'Housing (WG Room)', amount: 550, icon: '🏠' },
      { name: 'Groceries', amount: 250, icon: '🛒' },
      { name: 'Health Insurance', amount: 120, icon: '⚕️' },
      { name: 'Transport (Semesterticket)', amount: 0, icon: '🚆' },
      { name: 'Leisure & Going Out', amount: 150, icon: '🍻' },
      { name: 'Mobile & Internet', amount: 30, icon: '📱' },
      { name: 'Misc / Savings', amount: 100, icon: '💰' }
    ]
  },
  {
    id: 'template-professional',
    name: 'Young Professional',
    total_budget: 2500,
    description: 'Comfortable living for a single working professional.',
    categories: [
      { name: 'Housing (1-2 Room)', amount: 1100, icon: '🏠' },
      { name: 'Groceries', amount: 350, icon: '🛒' },
      { name: 'Health Insurance (Public)', amount: 0, icon: '⚕️' }, // Deducted from salary usually
      { name: 'Transport', amount: 49, icon: '🚆' },
      { name: 'Eating Out & Leisure', amount: 400, icon: '🍽️' },
      { name: 'Subscriptions & Internet', amount: 60, icon: '💻' },
      { name: 'Savings / Travel', amount: 541, icon: '✈️' }
    ]
  },
  {
    id: 'template-family',
    name: 'Family of 4',
    total_budget: 4500,
    description: 'Budget for a family with two children living in Frankfurt.',
    categories: [
      { name: 'Housing (3-4 Room)', amount: 2200, icon: '🏠' },
      { name: 'Groceries & Household', amount: 900, icon: '🛒' },
      { name: 'Transport (Car + Public)', amount: 300, icon: '🚗' },
      { name: 'Kids Activities/School', amount: 400, icon: '🧸' },
      { name: 'Leisure & Dining', amount: 400, icon: '🍕' },
      { name: 'Utilities & Internet', amount: 300, icon: '💡' }
    ]
  },
  {
    id: 'template-minimal',
    name: 'Minimalist / Frugal',
    total_budget: 1000,
    description: 'Strict budget for maximum savings.',
    categories: [
      { name: 'Housing (Small WG)', amount: 500, icon: '🏠' },
      { name: 'Groceries (Discounter)', amount: 200, icon: '🛒' },
      { name: 'Transport', amount: 49, icon: '🚆' },
      { name: 'Health Insurance', amount: 120, icon: '⚕️' },
      { name: 'Leisure', amount: 50, icon: '🌳' },
      { name: 'Misc', amount: 81, icon: '❓' }
    ]
  },
  {
    id: 'template-comfortable',
    name: 'Comfortable Couple',
    total_budget: 3500,
    description: 'Shared budget for a couple enjoying the city life.',
    categories: [
      { name: 'Housing (2-3 Room)', amount: 1600, icon: '🏠' },
      { name: 'Groceries', amount: 500, icon: '🛒' },
      { name: 'Dining Out', amount: 400, icon: '🍷' },
      { name: 'Transport', amount: 100, icon: '🚆' },
      { name: 'Travel Fund', amount: 500, icon: '✈️' },
      { name: 'Utilities & Subscriptions', amount: 250, icon: '💡' },
      { name: 'Misc', amount: 150, icon: '🛍️' }
    ]
  }
];
