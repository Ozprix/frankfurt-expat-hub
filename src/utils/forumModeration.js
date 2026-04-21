const BLOCKED_PATTERNS = [
  /\bcasino\b/i,
  /\bcrypto\s*(profit|guarantee|signal)\b/i,
  /\bforex\s*(signal|profit)\b/i,
  /\bloan\s*offer\b/i,
  /\bwhatsapp\s*\+?\d{6,}/i,
];

const URL_PATTERN = /(https?:\/\/|www\.)/gi;

export const validateForumPost = ({ title, content }) => {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const combined = `${trimmedTitle}\n${trimmedContent}`;
  const linkCount = (combined.match(URL_PATTERN) || []).length;

  if (trimmedTitle.length < 12) {
    return 'Use a more specific title so other Frankfurt expats can understand the question.';
  }

  if (trimmedContent.length < 80) {
    return 'Add more context: what you tried, where in Frankfurt this applies, and what answer you need.';
  }

  if (linkCount > 2) {
    return 'Limit links to two or fewer. Posts with many links are held back to reduce spam.';
  }

  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(combined))) {
    return 'This post looks promotional or spam-like. Please rewrite it as a genuine Frankfurt relocation question.';
  }

  return '';
};

export const forumPostCooldownActive = () => {
  const lastPostAt = Number(window.localStorage.getItem('fes:last-forum-post-at') || 0);
  return Date.now() - lastPostAt < 60 * 1000;
};

export const recordForumPostAttempt = () => {
  window.localStorage.setItem('fes:last-forum-post-at', String(Date.now()));
};
