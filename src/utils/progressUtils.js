export const calculateCompletionPercentage = (totalTasks, completedTasks) => {
  if (!totalTasks || totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

export const getMotivationalMessage = (streak) => {
  if (streak >= 30) return "Unstoppable!";
  if (streak >= 14) return "You're on fire!";
  if (streak >= 7) return "Amazing!";
  if (streak >= 4) return "Great job!";
  if (streak >= 1) return "Keep it up!";
  return "Start your streak today!";
};

export const getStreakEmoji = (streak) => {
  if (streak >= 7) return "🔥";
  if (streak >= 3) return "⭐";
  return "💪";
};

export const formatLastUpdated = (dateString) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "Yesterday";
  return date.toLocaleDateString();
};