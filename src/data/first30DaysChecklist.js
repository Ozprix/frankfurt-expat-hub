export const first30DaysChecklist = [
  {
    id: 'arrival-address',
    dayRange: 'Days 1-3',
    title: 'Confirm your address and mailbox name',
    description:
      'Make sure your temporary or permanent address is usable for official mail and that your surname is visible on the mailbox.',
    category: 'Housing',
    cta: { label: 'Browse housing help', to: '/directory/housing-relocation-frankfurt' },
  },
  {
    id: 'anmeldung',
    dayRange: 'Days 1-14',
    title: 'Book or complete Anmeldung',
    description:
      'Register your Frankfurt address with your passport, registration form, and landlord confirmation.',
    category: 'Registration',
    cta: { label: 'Read Anmeldung guide', to: '/blog/anmeldung-frankfurt-checklist' },
  },
  {
    id: 'health-insurance',
    dayRange: 'Week 1',
    title: 'Confirm German health insurance',
    description:
      'Choose public or private cover, share proof with your employer if needed, and save the membership confirmation.',
    category: 'Healthcare',
    cta: { label: 'Find insurance brokers', to: '/directory/insurance-brokers-frankfurt' },
  },
  {
    id: 'bank-account',
    dayRange: 'Week 1-2',
    title: 'Open a German bank account',
    description:
      'Set up a Girokonto for salary, rent, insurance, and recurring payments. Keep IBAN details ready for employers and landlords.',
    category: 'Finance',
    cta: { label: 'Find banking advisors', to: '/directory/banking-financial-advisors-frankfurt' },
  },
  {
    id: 'tax-id',
    dayRange: 'Week 2-4',
    title: 'Track your tax ID and payroll setup',
    description:
      'Your Steuer-ID usually arrives by post after Anmeldung. Check your payslip once payroll starts.',
    category: 'Tax',
    cta: { label: 'Use tax calculator', to: '/tools/german-tax-calculator-frankfurt' },
  },
  {
    id: 'rental-documents',
    dayRange: 'Week 2-4',
    title: 'Prepare your renter document packet',
    description:
      'Collect proof of income, work contract, ID copy, Schufa if available, and a short applicant introduction.',
    category: 'Housing',
    cta: { label: 'Read housing guide', to: '/blog/frankfurt-apartment-search-first-month' },
  },
  {
    id: 'liability-insurance',
    dayRange: 'Week 3-4',
    title: 'Set up liability insurance',
    description:
      'Private liability insurance is inexpensive and often expected by landlords, employers, and relocation advisors.',
    category: 'Insurance',
    cta: { label: 'Compare insurance help', to: '/directory/insurance-brokers-frankfurt' },
  },
  {
    id: 'ask-community',
    dayRange: 'Any time',
    title: 'Ask one Frankfurt-specific question',
    description:
      'Use the forum for details that change quickly, such as appointment timing, landlord expectations, or neighborhood tradeoffs.',
    category: 'Community',
    cta: { label: 'Ask the forum', to: '/forum/create' },
  },
];

export const dashboardStarterTasks = first30DaysChecklist.slice(0, 5);

export const checklistProgressLabel = (completed, total) => {
  if (completed === 0) return 'Start with Anmeldung and insurance.';
  if (completed < total) return 'Keep going. The first month gets easier with each step.';
  return 'Core first-month setup complete.';
};
