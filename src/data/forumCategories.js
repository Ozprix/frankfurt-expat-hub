export const forumCategoryPages = [
  {
    slug: 'anmeldung',
    name: 'Anmeldung',
    title: 'Frankfurt Anmeldung Forum | Frankfurt Expat Services',
    description:
      'Ask and read community questions about Anmeldung appointments, landlord confirmation, address registration, and first paperwork in Frankfurt.',
    keywords: ['anmeldung', 'registration', 'bürgeramt', 'wohnungsgeberbestätigung'],
  },
  {
    slug: 'housing',
    name: 'Housing',
    title: 'Frankfurt Housing Forum | Frankfurt Expat Services',
    description:
      'Community discussions about Frankfurt apartment searches, viewings, Schufa, rental documents, neighborhoods, and landlord questions.',
    keywords: ['housing', 'apartment', 'rent', 'schufa', 'landlord'],
  },
  {
    slug: 'tax',
    name: 'Tax',
    title: 'Frankfurt Expat Tax Forum | Frankfurt Expat Services',
    description:
      'Ask community questions about tax class, Steuer-ID, payroll, tax returns, and working with English-speaking tax advisors in Frankfurt.',
    keywords: ['tax', 'steuer', 'steuer-id', 'tax class', 'payroll'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    title: 'Frankfurt Healthcare Forum | Frankfurt Expat Services',
    description:
      'Community questions about health insurance, English-speaking doctors, dentists, therapy, and healthcare setup in Frankfurt.',
    keywords: ['healthcare', 'insurance', 'doctor', 'hausarzt', 'dentist'],
  },
  {
    slug: 'banking',
    name: 'Banking',
    title: 'Frankfurt Banking Forum | Frankfurt Expat Services',
    description:
      'Ask about German bank accounts, IBAN setup, salary payments, cards, and everyday finance as a Frankfurt newcomer.',
    keywords: ['banking', 'bank account', 'iban', 'finance'],
  },
  {
    slug: 'visa',
    name: 'Visa',
    title: 'Frankfurt Visa Forum | Frankfurt Expat Services',
    description:
      'Community discussion for Blue Card, work permit, residence permit, family reunification, and Frankfurt immigration appointment questions.',
    keywords: ['visa', 'blue card', 'residence permit', 'immigration', 'ausländerbehörde'],
  },
];

export const getForumCategoryBySlug = (slug) =>
  forumCategoryPages.find((category) => category.slug === slug);

export const forumCategorySlugForName = (name = '') => {
  const normalized = name.toLowerCase();
  return (
    forumCategoryPages.find((category) =>
      category.keywords.some((keyword) => normalized.includes(keyword))
    )?.slug || 'anmeldung'
  );
};
