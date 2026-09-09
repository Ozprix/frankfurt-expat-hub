import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  Circle,
  Download,
  FileCheck,
  MessageSquare,
  ShieldCheck,
} from '@/lib/icons';
import { useTaxPrepDocuments } from '@/hooks/useTaxPrepDocuments';
import { useToast } from '@/components/ui/use-toast';
import {
  buildTaxPrepCsv,
  buildTaxPrepSummary,
  taxPrepCategories,
} from '@/utils/taxPrep';

const categoryOptions = [
  { id: 'all', label: 'All documents' },
  ...Object.entries(taxPrepCategories).map(([id, category]) => ({ id, label: category.label })),
];

const priorityStyles = {
  essential: 'bg-red-50 text-red-700 border-red-100',
  recommended: 'bg-amber-50 text-amber-700 border-amber-100',
  conditional: 'bg-blue-50 text-blue-700 border-blue-100',
  optional: 'bg-gray-50 text-gray-600 border-gray-100',
};

const downloadCsv = (documents) => {
  const blob = new Blob([buildTaxPrepCsv(documents)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `frankfurt-tax-prep-${new Date().getFullYear()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const TaxPrepPage = () => {
  const { documents, loading, syncError, toggleDocumentReady, updateDocument } = useTaxPrepDocuments();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const summary = useMemo(() => buildTaxPrepSummary(documents), [documents]);
  const visibleDocuments = useMemo(
    () => documents.filter((document) => selectedCategory === 'all' || document.category === selectedCategory),
    [documents, selectedCategory]
  );

  const handleExport = () => {
    downloadCsv(documents);
    toast({
      title: 'Tax prep CSV exported',
      description: 'Your advisor-ready checklist has been downloaded.',
    });
  };

  return (
    <>
      <Helmet>
        <title>Tax Prep Hub | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="Organize German tax return documents, salary records, insurance statements, and deductible expenses before working with a tax advisor."
        />
      </Helmet>

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">Tax Prep Hub</h1>
                    <p className="mt-1 text-sm text-gray-600">Organize your Steuererklaerung documents before advisor review.</p>
                  </div>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600">
                  Track income records, insurance statements, deductible expenses, and conditional documents in one place.
                  Export the checklist when you are ready to brief a Steuerberater.
                </p>
                {syncError && (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                    Cross-device sync is temporarily unavailable. Your latest changes are kept on this device and will retry later.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Checklist Progress</p>
                    <p className="mt-2 text-4xl font-black text-gray-900">{summary.progress}%</p>
                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      {summary.readyCount} of {summary.totalCount} documents ready
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </button>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${summary.progress}%` }} />
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedCategory(option.id)}
                    className={`whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-bold transition ${
                      selectedCategory === option.id
                        ? 'border-teal-700 bg-teal-700 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-teal-200 hover:text-teal-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm font-semibold text-gray-500">
                  Loading tax prep checklist...
                </div>
              ) : (
                <div className="grid gap-4">
                  {visibleDocuments.map((document) => {
                    const category = taxPrepCategories[document.category];
                    return (
                      <article key={document.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <button
                            type="button"
                            onClick={() => toggleDocumentReady(document.id)}
                            className="flex min-w-0 flex-1 items-start gap-3 text-left"
                          >
                            {document.ready ? (
                              <CheckCircle className="mt-0.5 h-7 w-7 flex-shrink-0 fill-teal-600 text-teal-600" />
                            ) : (
                              <Circle className="mt-0.5 h-7 w-7 flex-shrink-0 text-gray-300 transition hover:text-teal-600" />
                            )}
                            <span className="min-w-0">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="text-lg font-black text-gray-900">{document.name}</span>
                                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black uppercase tracking-wide ${priorityStyles[document.priority] || priorityStyles.optional}`}>
                                  {document.priority}
                                </span>
                              </span>
                              <span className="mt-1 block text-sm font-semibold text-teal-700">{category?.label}</span>
                              <span className="mt-2 block text-sm leading-relaxed text-gray-600">{document.description}</span>
                            </span>
                          </button>

                          <span className={`rounded-lg px-3 py-1 text-xs font-bold ${document.ready ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                            {document.ready ? 'Ready' : 'Missing'}
                          </span>
                        </div>

                        <label className="mt-4 block">
                          <span className="mb-2 block text-sm font-bold text-gray-800">Notes for your advisor</span>
                          <textarea
                            value={document.notes}
                            onChange={(event) => updateDocument(document.id, { notes: event.target.value })}
                            rows="2"
                            placeholder="Add dates, amounts, provider names, or questions to ask..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                          />
                        </label>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <aside className="space-y-4">
              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-teal-700" />
                <h2 className="mt-3 text-lg font-black text-gray-900">Need professional review?</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Use the directory when your situation includes cross-border income, freelance work, stock grants, or multiple tax residencies.
                </p>
                <Link
                  to="/directory/tax-advisors-frankfurt"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  Find tax advisors
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <Calculator className="h-5 w-5 text-teal-700" />
                <h2 className="mt-3 text-lg font-black text-gray-900">Check payroll assumptions</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Compare gross and net salary scenarios before reviewing your annual return.
                </p>
                <Link
                  to="/tools#tax"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
                >
                  Open tax calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <MessageSquare className="h-5 w-5 text-teal-700" />
                <h2 className="mt-3 text-lg font-black text-gray-900">Ask a community question</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  For non-private questions about tax class, Steuer-ID timing, or advisor selection, use the tax forum.
                </p>
                <Link
                  to="/forum/tax"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
                >
                  Open tax forum
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default TaxPrepPage;
