import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildTaxPrepSummary,
  buildTaxPrepCsv,
  mergeTaxPrepDocuments,
  taxPrepDocuments,
} from './taxPrep.js';

test('buildTaxPrepSummary counts ready tax documents by category', () => {
  const documents = taxPrepDocuments.map((doc) => ({
    ...doc,
    ready: ['salary-payslips', 'health-insurance', 'relocation-costs'].includes(doc.id),
  }));

  const summary = buildTaxPrepSummary(documents);

  assert.equal(summary.readyCount, 3);
  assert.equal(summary.totalCount, taxPrepDocuments.length);
  assert.equal(summary.progress, Math.round((3 / taxPrepDocuments.length) * 100));
  assert.equal(summary.categories.salary.ready, 1);
  assert.equal(summary.categories.insurance.ready, 1);
  assert.equal(summary.categories.deductions.ready, 1);
});

test('buildTaxPrepCsv exports advisor-ready checklist rows with escaped notes', () => {
  const csv = buildTaxPrepCsv([
    {
      id: 'salary-payslips',
      name: 'Payslips',
      category: 'salary',
      priority: 'essential',
      description: 'Monthly payslips',
      ready: true,
      notes: 'January, February',
    },
  ]);

  assert.match(csv, /^Category,Document,Priority,Status,Description,Notes\n/);
  assert.match(csv, /salary,Payslips,essential,Ready,Monthly payslips,"January, February"/);
});

test('mergeTaxPrepDocuments accepts locally stored documents and Supabase rows', () => {
  const merged = mergeTaxPrepDocuments([
    {
      id: 'salary-payslips',
      ready: true,
      notes: 'Saved locally',
    },
    {
      document_id: 'taxprep-health-insurance',
      ready: true,
      notes: 'Synced remotely',
    },
  ]);

  assert.equal(merged.find((doc) => doc.id === 'salary-payslips').notes, 'Saved locally');
  assert.equal(merged.find((doc) => doc.id === 'health-insurance').notes, 'Synced remotely');
});
