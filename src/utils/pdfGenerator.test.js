import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDocumentChecklistTemplate } from './pdfGenerator.js';

test('buildDocumentChecklistTemplate converts document tracker items into PDF tasks', () => {
  const template = buildDocumentChecklistTemplate([
    {
      name: 'Passport',
      description: 'Valid travel document',
      ready: true,
      notes: 'Expires in 2029',
    },
    {
      name: 'Rental Contract',
      description: 'Needed for Anmeldung',
      ready: false,
      notes: '',
    },
  ]);

  assert.equal(template.title, 'Frankfurt Document Checklist');
  assert.equal(template.category, 'documents');
  assert.match(template.description, /1 of 2 documents ready/);
  assert.deepEqual(template.tasks, [
    {
      title: 'Passport',
      description: 'Ready - Valid travel document Notes: Expires in 2029',
    },
    {
      title: 'Rental Contract',
      description: 'Not ready - Needed for Anmeldung',
    },
  ]);
});
