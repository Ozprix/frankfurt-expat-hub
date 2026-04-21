import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Download, Lock, Mail } from '@/lib/icons';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { first30DaysChecklist } from '@/data/first30DaysChecklist';
import { downloadPDF } from '@/utils/pdfGenerator';
import { schemaBreadcrumb, schemaHowTo } from '@/utils/structuredData';
import { useRetentionState } from '@/hooks/useRetentionState';
import { trackConversionEvent } from '@/utils/conversionTracking';
import { supabaseClient } from '@/config/supabaseClient';
import InlinePartnerCallout from '@/components/InlinePartnerCallout';
import { findChecklistPartnerSlug } from '@/utils/partnerReferrals';

const ChecklistItem = ({ item, index, partner }) => (
  <article className="rounded-xl border border-[#dbe1d8] bg-white p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-black text-white">
        {index + 1}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{item.dayRange}</p>
        <h2 className="mt-1 text-xl font-black text-[#0f172a]">{item.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">{item.description}</p>
        <Link
          to={item.cta.to}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f766e] transition hover:text-[#115e59]"
        >
          {item.cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {partner && (
          <InlinePartnerCallout
            partner={partner}
            sourcePage="/frankfurt-first-30-days-checklist"
          />
        )}
      </div>
    </div>
  </article>
);

const First30DaysChecklistPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveChecklist, syncError } = useRetentionState();
  const checklistSlug = 'frankfurt-first-30-days';
  const [partners, setPartners] = React.useState([]);

  React.useEffect(() => {
    let cancelled = false;

    const loadPartners = async () => {
      const { data, error } = await supabaseClient
        .from('partner_referrals')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Checklist partner fetch error:', error);
        setPartners([]);
      } else {
        setPartners(data || []);
      }
    };

    loadPartners();

    return () => {
      cancelled = true;
    };
  }, []);

  const partnersBySlug = React.useMemo(() => {
    return partners.reduce((map, partner) => {
      map[partner.slug] = partner;
      return map;
    }, {});
  }, [partners]);

  const exportChecklist = () => {
    downloadPDF({
      title: 'Frankfurt First 30 Days Checklist',
      category: 'Relocation',
      description:
        'A practical step-by-step guide to the most important tasks in your first 30 days in Frankfurt. Work through these in order for the smoothest possible start.',
      tasks: first30DaysChecklist.map((item) => ({
        title: `${item.title} (${item.dayRange})`,
        description: item.description,
      })),
    });
  };

  const handleGatedAction = (action) => {
    if (!isAuthenticated) {
      toast({
        title: 'Create a free account',
        description: `Sign up to ${action === 'save' ? 'save this checklist' : 'download the PDF'} and keep your Frankfurt setup progress in your dashboard.`,
      });
      return;
    }

    if (action === 'save') {
      saveChecklist();
      trackConversionEvent('checklist_save', { checklist: 'frankfurt-first-30-days' }, { userId: user?.id });
      toast({
        title: 'Checklist saved',
        description: syncError
          ? 'Saved locally for now. Cross-device sync will retry when the database is available.'
          : 'Your First 30 Days checklist is available from your dashboard on signed-in devices.',
      });
      return;
    }

    exportChecklist();
    trackConversionEvent('checklist_export', { checklist: 'frankfurt-first-30-days' }, { userId: user?.id });

    toast({
      title: 'Checklist exported',
      description: 'Your PDF download has started.',
    });
  };

  const handleEmailRequest = async () => {
    if (!isAuthenticated) {
      navigate(`/signup?next=/frankfurt-first-30-days-checklist&request=checklist-email&checklist=${checklistSlug}`);
      return;
    }

    const { error } = await supabaseClient.functions.invoke('send-checklist', {
      body: { checklist_slug: checklistSlug },
    });

    if (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    trackConversionEvent('checklist_email_request', { checklist: checklistSlug }, { userId: user?.id });
    toast({
      title: 'Checklist sent',
      description: 'Check your inbox for the Frankfurt First 30 Days Checklist.',
    });
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Frankfurt First 30 Days Checklist', path: '/frankfurt-first-30-days-checklist' },
  ];

  return (
    <>
      <SEOHead
        title="Frankfurt First 30 Days Checklist | Frankfurt Expat Services"
        description="A practical first-month checklist for Frankfurt newcomers covering Anmeldung, health insurance, banking, tax ID, housing documents, and local setup."
        canonical="/frankfurt-first-30-days-checklist"
      >
        <script type="application/ld+json">
          {JSON.stringify(schemaBreadcrumb(breadcrumbs))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(schemaHowTo({
            name: 'Frankfurt First 30 Days Checklist',
            description: 'First-month setup checklist for international residents moving to Frankfurt.',
            path: '/frankfurt-first-30-days-checklist',
            steps: first30DaysChecklist,
          }))}
        </script>
      </SEOHead>

      <main className="bg-[#f3f4ef] text-[#0f172a]">
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Free Checklist</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                Frankfurt First 30 Days Checklist
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
                A practical first-month plan for Anmeldung, health insurance, banking, tax ID, rental documents,
                and local setup after moving to Frankfurt.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleGatedAction('save')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
                >
                  <CheckCircle className="h-4 w-4" />
                  Save to dashboard
                </button>
                <button
                  type="button"
                  onClick={() => handleGatedAction('export')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#0f766e] bg-white px-5 py-3 text-sm font-bold text-[#0f766e] transition hover:bg-[#ecfdf5]"
                >
                  <Download className="h-4 w-4" />
                  Export checklist
                </button>
                <button
                  type="button"
                  onClick={handleEmailRequest}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#dbe1d8] bg-white px-5 py-3 text-sm font-bold text-[#334155] transition hover:bg-[#f8faf8]"
                >
                  <Mail className="h-4 w-4" />
                  Email me this checklist
                </button>
              </div>
            </div>

            <aside className="rounded-xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
              <Lock className="h-6 w-6 text-[#0f766e]" />
              <h2 className="mt-4 text-xl font-black">Save progress with a free account</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Browse the checklist publicly. Create an account to save completed steps, receive reminders,
                and keep your Frankfurt setup organized.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#115e59]"
                >
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-[#dbe1d8] px-4 py-2 text-sm font-bold text-[#334155] transition hover:bg-[#f8faf8]"
                >
                  Log in
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-y border-[#d7ddd3] bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            {first30DaysChecklist.map((item, index) => {
              const partnerSlug = findChecklistPartnerSlug(item);
              return (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  index={index}
                  partner={partnerSlug ? partnersBySlug[partnerSlug] : null}
                />
              );
            })}
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-xl border border-[#dbe1d8] bg-[#0c2622] p-8 text-white">
            <Mail className="h-6 w-6 text-[#5eead4]" />
            <h2 className="mt-4 text-2xl font-black">Want reminders for the first month?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#cbd5e1]">
              Create a free account and opt into setup reminders so Anmeldung, insurance, tax ID,
              and rental paperwork do not slip through the cracks.
            </p>
            <Link
              to="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9488]"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default First30DaysChecklistPage;
