import { tasksRegistry } from '@/data/tasksRegistry';

/**
 * Evaluates a single condition against the user profile.
 */
const evaluateCondition = (profile, condition) => {
  const { field, operator, value } = condition;
  const userValue = profile[field];

  switch (operator) {
    case '==':
      return userValue === value;
    case '!=':
      return userValue !== value;
    case 'includes':
      return Array.isArray(userValue) && userValue.includes(value);
    case '>':
      return userValue > value;
    case '<':
      return userValue < value;
    case 'exists':
      return userValue !== undefined && userValue !== null && userValue !== '';
    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
};

/**
 * Checks if a task is applicable for a given user profile.
 * Returns true if ALL conditions match.
 */
export const evaluateConditions = (profile, conditions) => {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every(condition => evaluateCondition(profile, condition));
};

/**
 * Calculates a due date based on arrival date and task priority/estimated days.
 */
export const calculateDueDate = (task, profile) => {
  const arrivalDate = new Date(profile.arrivalDate || new Date());
  
  // Base offset logic (could be more complex in future)
  let dayOffset = 7; // Default 1 week
  
  if (task.priority === 'high') dayOffset = 3;
  if (task.priority === 'medium') dayOffset = 14;
  if (task.priority === 'low') dayOffset = 30;

  // Specific overrides based on dependencies could go here
  if (task.id === 'anmeldung') dayOffset = 14; // Legal requirement
  
  const dueDate = new Date(arrivalDate);
  dueDate.setDate(dueDate.getDate() + dayOffset);
  
  return dueDate.toISOString();
};

/**
 * Topologically sorts tasks based on dependencies.
 * Ensures that if A depends on B, B comes before A in the list.
 */
export const sortTasksByDependencies = (tasks) => {
  const visited = new Set();
  const sorted = [];
  const temp = new Set();

  const visit = (task) => {
    if (temp.has(task.id)) return; // Cycle detected or already processing
    if (visited.has(task.id)) return;

    temp.add(task.id);

    // Visit dependencies first
    if (task.dependsOn && task.dependsOn.length > 0) {
      task.dependsOn.forEach(depId => {
        const depTask = tasks.find(t => t.id === depId);
        if (depTask) {
          visit(depTask);
        }
      });
    }

    temp.delete(task.id);
    visited.add(task.id);
    sorted.push(task);
  };

  tasks.forEach(task => visit(task));
  return sorted;
};

/**
 * Main function to generate a personalized plan.
 */
export const generatePlan = (userProfile) => {
  if (!userProfile) return [];

  // 1. Filter tasks based on conditions
  const applicableTasks = tasksRegistry.filter(task => 
    evaluateConditions(userProfile, task.conditions)
  );

  // 2. Hydrate tasks with dynamic data (due dates, status)
  const hydratedTasks = applicableTasks.map(task => ({
    ...task,
    status: 'pending',
    dueDate: calculateDueDate(task, userProfile),
    createdAt: new Date().toISOString(),
    // We keep dependency info for the UI to use
  }));

  // 3. Sort by dependencies
  return sortTasksByDependencies(hydratedTasks);
};

// --- Legacy Support Helper Functions ---

export const getProgressPercentage = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export const getNextDueTask = (tasks) => {
  if (!tasks) return null;
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  if (pendingTasks.length === 0) return null;
  
  return pendingTasks.reduce((earliest, task) => {
    return new Date(task.dueDate) < new Date(earliest.dueDate) ? task : earliest;
  });
};