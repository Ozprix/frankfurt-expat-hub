import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const creatorRecordTypes = {
  income: { label: 'Cash income', tone: 'emerald' },
  sample: { label: 'Sample or benefit', tone: 'amber' },
  expense: { label: 'Business expense', tone: 'blue' },
};

export const creatorCategories = [
  'Platform payout', 'Affiliate income', 'Brand collaboration', 'Creator sample',
  'Possible equipment', 'Testing / consumable', 'Software / subscription',
  'Travel / production', 'Phone / internet', 'Other / advisor review',
];

export const dispositionOptions = [
  'Not applicable', 'Unknown', 'Retained', 'Returned', 'Used in content', 'Consumed / used up', 'Donated', 'Disposed',
];

export const createRecordId = () => `cr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
export const contentFingerprint = (text) => {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) hash = ((hash * 33) ^ text.charCodeAt(index)) >>> 0;
  return hash.toString(36);
};
const recordFingerprint = (record) => [record.record_type, record.received_date, record.source, record.title, record.displayed_value || record.paid_amount].map((value) => String(value || '').trim().toLowerCase()).join('|');
export const dedupeImportedRecords = (incoming, existing) => {
  const seen = new Set(existing.map((record) => record.import_key || recordFingerprint(record)));
  const unique = []; let duplicates = 0;
  incoming.forEach((record) => {
    const key = record.import_key || recordFingerprint(record);
    if (seen.has(key)) duplicates += 1;
    else { seen.add(key); unique.push(record); }
  });
  return { unique, duplicates };
};

export const csvRows = (text) => {
  const rows = []; let row = []; let value = ''; let quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"' && input[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(value.trim()); value = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && input[index + 1] === '\n') index += 1;
      row.push(value.trim()); if (row.some(Boolean)) rows.push(row); row = []; value = '';
    } else value += char;
  }
  row.push(value.trim()); if (row.some(Boolean)) rows.push(row);
  const headerIndex = rows.findIndex((candidate) => candidate.some((cell) => /transaction id|type of earnings|tax reference amount|order type/i.test(cell)));
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex].map((cell) => cell.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return rows.slice(headerIndex + 1).filter((candidate) => candidate.length > 1).map((candidate) => headers.reduce((item, header, index) => ({ ...item, [header]: candidate[index] || '' }), {}));
};

const valueFrom = (row, keys) => keys.map((key) => row[key]).find(Boolean) || '';
const numberFrom = (value) => {
  const parsed = Number(String(value).replace(/[^0-9,.-]/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const tikTokDate = (value) => /^\d{8}$/.test(value || '') ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value || null;
export const normaliseImportedRows = (rows, taxYear, sourceFingerprint = '') => rows.map((row, index) => {
  const paidAmount = numberFrom(valueFrom(row, ['paid', 'amountpaid', 'outofpocket', 'copay', 'expense']));
  const displayedValue = numberFrom(valueFrom(row, ['income', 'transactionprice', 'value', 'amount', 'retailvalue', 'price']));
  const earningsType = valueFrom(row, ['typeofearnings']);
  const typeRaw = valueFrom(row, ['type', 'ordertype', 'recordtype', 'typeofearnings']).toLowerCase();
  const isTikTokSample = Boolean(valueFrom(row, ['taxreferenceamount', 'approvaldate', 'deliverydate'])) && Boolean(valueFrom(row, ['ordertype']));
  const sampleReference = numberFrom(valueFrom(row, ['taxreferenceamount']));
  const recordType = isTikTokSample ? 'sample' : earningsType || typeRaw.includes('income') || typeRaw.includes('commission') || typeRaw.includes('payout') ? 'income' : typeRaw.includes('expense') ? 'expense' : 'sample';
  const category = recordType === 'income'
    ? (typeRaw.includes('affiliate') ? 'Affiliate income' : 'Platform payout')
    : recordType === 'expense' ? 'Other / advisor review' : 'Creator sample';
  return {
    id: createRecordId(), tax_year: taxYear, record_type: recordType,
    title: earningsType ? `TikTok ${earningsType}` : valueFrom(row, ['productname', 'product', 'description', 'title', 'name']) || 'Imported record',
    source: valueFrom(row, ['payer', 'shopname', 'merchant', 'brand', 'platform', 'shop']),
    received_date: tikTokDate(valueFrom(row, ['deliverydate', 'dateutc0', 'date', 'orderdate', 'receiveddate'])),
    displayed_value: isTikTokSample ? sampleReference || null : displayedValue || null, paid_amount: isTikTokSample ? numberFrom(valueFrom(row, ['amountpaid'])) || null : paidAmount || null,
    category, disposition: isTikTokSample && valueFrom(row, ['refunddate']) ? 'Returned' : recordType === 'sample' ? 'Unknown' : 'Not applicable',
    import_key: valueFrom(row, ['transactionid']) ? `tiktok:${valueFrom(row, ['transactionid'])}` : isTikTokSample && sourceFingerprint ? `tiktok-sample:${sourceFingerprint}:${index}` : null,
    notes: isTikTokSample ? `Imported from TikTok sample export • ${valueFrom(row, ['ordertype'])} • Approval: ${tikTokDate(valueFrom(row, ['approvaldate'])) || 'not supplied'} • Transaction price: ${valueFrom(row, ['transactionpriceincltaxshipping']) || 'not supplied'} • Voucher: ${valueFrom(row, ['voucherdeduction']) || '0'} • Listed price: ${valueFrom(row, ['listedpricelocalcurrency']) || 'not supplied'} • Quantity: ${valueFrom(row, ['quantity']) || '1'}${valueFrom(row, ['refunddate']) ? ` • Refund: ${tikTokDate(valueFrom(row, ['refunddate']))}` : ''}` : earningsType ? `Imported from TikTok earnings report${valueFrom(row, ['transactionid']) ? ` • Transaction ID: ${valueFrom(row, ['transactionid'])}` : ''}` : 'Imported from CSV — please confirm the category and evidence.',
  };
});

export const euro = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(value || 0));

export const recordSummary = (records, evidence) => {
  const totals = records.reduce((summary, record) => {
    summary[record.record_type] += Number(record.displayed_value || record.paid_amount || 0);
    return summary;
  }, { income: 0, sample: 0, expense: 0 });
  const evidenceByRecord = new Set(evidence.map((item) => item.creator_record_id));
  const needsReview = records.filter((record) => record.disposition === 'Unknown' || !record.category || (record.record_type === 'sample' && !evidenceByRecord.has(record.id)));
  const indicativeActivityBalance = totals.income + totals.sample - totals.expense;
  const groups = Object.values(records.reduce((all, record) => {
    const key = `${record.record_type}:${record.category || 'Uncategorised'}`;
    const group = all[key] || { label: record.category || 'Uncategorised', type: record.record_type, count: 0, amount: 0 };
    group.count += 1; group.amount += Number(record.displayed_value || record.paid_amount || 0); all[key] = group;
    return all;
  }, {}));
  return { totals, evidenceByRecord, needsReview, indicativeActivityBalance, groups };
};

export const exportCreatorRecordsCsv = (records, evidence) => {
  const countEvidence = (id) => evidence.filter((item) => item.creator_record_id === id).length;
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [
    ['Record type', 'Date', 'Title', 'Source', 'Category', 'Displayed value (EUR)', 'Paid amount (EUR)', 'Disposition', 'Evidence files', 'Notes'],
    ...records.map((record) => [creatorRecordTypes[record.record_type]?.label, record.received_date, record.title, record.source, record.category, record.displayed_value, record.paid_amount, record.disposition, countEvidence(record.id), record.notes]),
  ].map((row) => row.map(quote).join(',')).join('\n');
};

export const downloadCreatorPdf = ({ profile, records, evidence }) => {
  const doc = new jsPDF();
  const summary = recordSummary(records, evidence);
  const year = profile?.tax_year || new Date().getFullYear();
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(21); doc.text('Creator Records Summary', 14, 20);
  doc.setFontSize(10); doc.text(`Tax year ${year} • Prepared ${new Date().toLocaleDateString('de-DE')}`, 14, 29);
  doc.setTextColor(30, 41, 59); doc.setFontSize(9);
  const disclaimer = 'Organisational summary of user-provided records. It is not tax advice, a tax assessment, or a tax filing. A qualified Steuerberater should review the records and their treatment.';
  doc.text(doc.splitTextToSize(disclaimer, 178), 14, 52);
  autoTable(doc, { startY: 67, head: [['Preparation summary', 'Recorded amount']], body: [
    ['Cash income reported by platforms / brands', euro(summary.totals.income)], ['Sample reference values recorded', euro(summary.totals.sample)], ['Business expenses recorded', euro(summary.totals.expense)], ['Indicative creator activity balance*', euro(summary.indicativeActivityBalance)], ['Records needing attention', String(summary.needsReview.length)],
  ], headStyles: { fillColor: [15, 118, 110] }, styles: { fontSize: 9 } });
  const nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(13); doc.text('Breakdown by record category', 14, nextY);
  autoTable(doc, { startY: nextY + 5, head: [['Type', 'Category', 'Records', 'Recorded amount']], body: summary.groups.map((group) => [creatorRecordTypes[group.type]?.label || group.type, group.label, String(group.count), euro(group.amount)]), headStyles: { fillColor: [30, 41, 59] }, styles: { fontSize: 8 } });
  const noteY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(8); doc.text(doc.splitTextToSize('*Indicative activity balance is a simple organisational subtotal: cash income + sample reference values - recorded expenses. It is not taxable profit, a VAT calculation, or a tax assessment. Check treatment and eligibility with official guidance, tax software, or a qualified Steuerberater. The detailed transaction ledger is supplied separately as CSV.', 180), 14, noteY);
  doc.save(`creator-records-summary-${year}.pdf`);
};
