
import { forumPostsData } from '@/data/forumPostsData';
import { videosData } from '@/data/videosData';
import { apartmentsData } from '@/data/apartmentsData';
import { budgetTemplatesData } from '@/data/budgetTemplatesData';

export const generateMockForumPost = (categoryId) => {
  const templates = [
    { title: 'Question about...', content: 'I was wondering if anyone knows...' },
    { title: 'Help needed with...', content: 'I am stuck with this bureaucracy issue...' },
    { title: 'Recommendation for...', content: 'Looking for the best place to...' }
  ];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return {
    id: `mock-post-${Date.now()}`,
    categoryId,
    title: `${template.title} ${categoryId}`,
    content: template.content,
    author: 'TestUser',
    upvotes: Math.floor(Math.random() * 50),
    replies: Math.floor(Math.random() * 10),
    created_at: new Date().toISOString()
  };
};

export const generateMockBudgetItem = (categoryId) => {
  return {
    id: `mock-item-${Date.now()}`,
    category_id: categoryId,
    name: 'Test Expense Item',
    estimated_cost: Math.floor(Math.random() * 500) + 50,
    actual_cost: 0
  };
};

export const seedDemoData = async () => {
  console.log('Seeding demo data...');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  localStorage.setItem('demo_forum_posts', JSON.stringify(forumPostsData));
  localStorage.setItem('demo_videos', JSON.stringify(videosData));
  localStorage.setItem('demo_apartments', JSON.stringify(apartmentsData));
  localStorage.setItem('demo_budgets', JSON.stringify(budgetTemplatesData));
  
  return true;
};

export const clearDemoData = async () => {
  console.log('Clearing demo data...');
  await new Promise(resolve => setTimeout(resolve, 800));
  
  localStorage.removeItem('demo_forum_posts');
  localStorage.removeItem('demo_videos');
  localStorage.removeItem('demo_apartments');
  localStorage.removeItem('demo_budgets');
  
  return true;
};
