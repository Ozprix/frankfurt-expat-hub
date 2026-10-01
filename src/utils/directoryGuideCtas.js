const categoryByKeyword = [
  { categoryId: 'tax', label: 'Compare English-speaking tax advisors', terms: ['tax', 'steuer', 'freelancer'] },
  { categoryId: 'housing', label: 'Find housing and relocation help', terms: ['apartment', 'housing', 'rent', 'miet'] },
  { categoryId: 'legal', label: 'Find English-speaking visa support', terms: ['visa', 'blue card', 'residence', 'immigration', 'anmeldung'] },
  { categoryId: 'insurance', label: 'Compare English-speaking insurance brokers', terms: ['insurance', 'haftpflicht', 'health'] },
  { categoryId: 'banking', label: 'Find financial planning support', terms: ['bank', 'pension', 'invest'] },
];

export const getDirectoryCtaForPost = (post) => {
  const searchable = [post.title, post.description, post.category, post.slug].filter(Boolean).join(' ').toLowerCase();
  const match = categoryByKeyword.find(({ terms }) => terms.some((term) => searchable.includes(term)));
  if (!match) return null;
  return { ...match, href: `/directory?category=${match.categoryId}` };
};
