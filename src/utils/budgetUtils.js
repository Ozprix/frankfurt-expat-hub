
export const calculateCategoryTotal = (items, categoryId) => {
  if (!items) return 0;
  return items
    .filter(item => item.category_id === categoryId)
    .reduce((sum, item) => sum + (Number(item.actual_cost) || Number(item.estimated_cost) || 0), 0);
};

export const calculateBudgetTotal = (items) => {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + (Number(item.actual_cost) || Number(item.estimated_cost) || 0), 0);
};

export const calculatePercentageUsed = (spent, total) => {
  if (!total || total === 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
};

export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateDifference = (estimated, actual) => {
  return (Number(estimated) || 0) - (Number(actual) || 0);
};

export const getStatusColor = (percentage) => {
  if (percentage >= 100) return 'text-red-600 bg-red-50 border-red-200';
  if (percentage >= 85) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-green-600 bg-green-50 border-green-200';
};

export const getBudgetStatus = (items, totalBudget) => {
  const currentTotal = calculateBudgetTotal(items);
  const percentage = calculatePercentageUsed(currentTotal, totalBudget);
  
  if (percentage > 100) return { status: 'Over Budget', color: 'red' };
  if (percentage > 90) return { status: 'At Risk', color: 'orange' };
  return { status: 'On Track', color: 'green' };
};

export const validateBudgetItem = (item) => {
  const errors = {};
  if (!item.name?.trim()) errors.name = "Item name is required";
  if (!item.category_id) errors.category_id = "Category is required";
  if (item.estimated_cost < 0) errors.estimated_cost = "Cost cannot be negative";
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateBudgetPDF = async (budget, items, categories) => {
  const [{ default: jsPDF }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text(`Budget Report: ${budget.name}`, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Summary
  const totalSpent = calculateBudgetTotal(items);
  const percentage = calculatePercentageUsed(totalSpent, budget.total_monthly_budget);
  
  doc.autoTable({
    startY: 40,
    head: [['Total Budget', 'Estimated/Actual Total', 'Status']],
    body: [[
      formatCurrency(budget.total_monthly_budget, budget.currency),
      formatCurrency(totalSpent, budget.currency),
      `${percentage}% Used`
    ]],
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136] } // teal-600
  });
  
  // Items Table
  const tableData = items.map(item => {
    const categoryName = categories.find(c => c.id === item.category_id)?.name || 'Uncategorized';
    return [
      categoryName,
      item.name,
      formatCurrency(item.estimated_cost, budget.currency),
      formatCurrency(item.actual_cost || 0, budget.currency),
      formatCurrency((item.estimated_cost || 0) - (item.actual_cost || 0), budget.currency)
    ];
  });

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Category', 'Item', 'Estimated', 'Actual', 'Difference']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [55, 65, 81] } // gray-700
  });
  
  doc.save(`${budget.name.replace(/\s+/g, '_')}_budget.pdf`);
};
