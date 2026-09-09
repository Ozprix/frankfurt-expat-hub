export const taxPrepCategories = {
  salary: {
    label: 'Salary and payroll',
    description: 'Income records from employment and payroll setup.',
  },
  insurance: {
    label: 'Insurance and care',
    description: 'Health, long-term care, and other insurance documents.',
  },
  deductions: {
    label: 'Deductions and expenses',
    description: 'Costs that may be relevant for a German tax return.',
  },
  family: {
    label: 'Family and household',
    description: 'Documents for married couples, children, and household status.',
  },
  freelance: {
    label: 'Freelance and side income',
    description: 'Self-employment records for expats with additional income.',
  },
};

export const taxPrepDocuments = [
  {
    id: 'salary-payslips',
    name: 'Annual payslips',
    category: 'salary',
    priority: 'essential',
    description: 'Monthly payslips and the annual Lohnsteuerbescheinigung from your employer.',
  },
  {
    id: 'tax-id',
    name: 'Tax ID and Finanzamt letters',
    category: 'salary',
    priority: 'essential',
    description: 'Your Steuer-ID, Steuernummer if issued, and relevant Finanzamt correspondence.',
  },
  {
    id: 'health-insurance',
    name: 'Health insurance statements',
    category: 'insurance',
    priority: 'essential',
    description: 'Annual contribution confirmations from statutory or private health insurance.',
  },
  {
    id: 'pension-insurance',
    name: 'Pension and social insurance',
    category: 'insurance',
    priority: 'recommended',
    description: 'Pension, unemployment, and long-term care contribution records if available.',
  },
  {
    id: 'relocation-costs',
    name: 'Relocation and moving costs',
    category: 'deductions',
    priority: 'recommended',
    description: 'Moving invoices, temporary housing, travel, shipment, storage, or broker cost records.',
  },
  {
    id: 'work-expenses',
    name: 'Work-related expenses',
    category: 'deductions',
    priority: 'recommended',
    description: 'Home office, professional equipment, commute, training, and work travel receipts.',
  },
  {
    id: 'donations-services',
    name: 'Donations and household services',
    category: 'deductions',
    priority: 'optional',
    description: 'Donation receipts, childcare, cleaning, repairs, and household service invoices.',
  },
  {
    id: 'family-status',
    name: 'Marriage and child documents',
    category: 'family',
    priority: 'conditional',
    description: 'Marriage certificate, child benefit records, childcare invoices, or partner income details.',
  },
  {
    id: 'freelance-income',
    name: 'Freelance income and invoices',
    category: 'freelance',
    priority: 'conditional',
    description: 'Outgoing invoices, business expense receipts, VAT records, and payment statements.',
  },
];

export const taxPrepStorageKey = (userId) => `tax_prep_documents_${userId}`;

export const namespaceTaxPrepDocumentId = (documentId) => `taxprep-${documentId}`;

export const denamespaceTaxPrepDocumentId = (documentId) =>
  String(documentId || '').replace(/^taxprep-/, '');

export const mergeTaxPrepDocuments = (rows = []) =>
  taxPrepDocuments.map((document) => {
    const namespacedId = namespaceTaxPrepDocumentId(document.id);
    const match = rows.find((row) =>
      row.id === document.id ||
      row.document_id === namespacedId ||
      denamespaceTaxPrepDocumentId(row.document_id) === document.id
    );

    return match
      ? {
          ...document,
          name: match.name || document.name,
          description: match.description || document.description,
          ready: Boolean(match.ready),
          notes: match.notes || '',
        }
      : { ...document, ready: false, notes: '' };
  });

export const buildTaxPrepSummary = (documents = []) => {
  const totalCount = documents.length;
  const readyCount = documents.filter((document) => document.ready).length;
  const categories = Object.fromEntries(
    Object.keys(taxPrepCategories).map((category) => [
      category,
      { ready: 0, total: 0 },
    ])
  );

  documents.forEach((document) => {
    if (!categories[document.category]) {
      categories[document.category] = { ready: 0, total: 0 };
    }
    categories[document.category].total += 1;
    if (document.ready) categories[document.category].ready += 1;
  });

  return {
    readyCount,
    totalCount,
    progress: totalCount ? Math.round((readyCount / totalCount) * 100) : 0,
    categories,
  };
};

const escapeCsvCell = (value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const buildTaxPrepCsv = (documents = []) => {
  const header = ['Category', 'Document', 'Priority', 'Status', 'Description', 'Notes'];
  const rows = documents.map((document) => [
    document.category,
    document.name,
    document.priority,
    document.ready ? 'Ready' : 'Missing',
    document.description,
    document.notes || '',
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
};
