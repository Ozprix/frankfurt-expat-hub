
export const formatMarkdown = (content) => {
  if (!content) return '';
  // Basic markdown replacement for demo purposes. 
  // In production, use a library like 'marked' or 'react-markdown'
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-2">$1</h2>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br />');
};

export const calculateReputation = (posts = 0, replies = 0, helpful = 0) => {
  return (posts * 5) + (replies * 2) + (helpful * 10);
};

export const getReputationBadge = (score) => {
  if (score > 1000) return { label: 'Legend', color: 'bg-purple-100 text-purple-800' };
  if (score > 500) return { label: 'Expert', color: 'bg-indigo-100 text-indigo-800' };
  if (score > 100) return { label: 'Regular', color: 'bg-blue-100 text-blue-800' };
  if (score > 50) return { label: 'Contributor', color: 'bg-green-100 text-green-800' };
  return { label: 'Newcomer', color: 'bg-gray-100 text-gray-800' };
};

export const truncateContent = (content, length = 100) => {
  if (!content) return '';
  if (content.length <= length) return content;
  return content.substring(0, length) + '...';
};
