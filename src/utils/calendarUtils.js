export const formatTaskForCalendar = (task) => {
  return {
    title: task.title,
    description: task.description || 'No description',
    dueDate: task.dueDate
  };
};

export const getCalendarEventTitle = (task) => {
  return `Task: ${task.title}`;
};

export const getCalendarEventDescription = (task) => {
  return `${task.description || ''}\n\nManaged by Frankfurt Expat Services`;
};

export const getCalendarEventTime = (dueDate) => {
  // Returns simple ISO date for all-day events
  // or datetime if needed. Using date-only for checklists usually fits better.
  return new Date(dueDate).toISOString().split('T')[0];
};

export const formatSyncTime = (timestamp) => {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return date.toLocaleDateString();
};