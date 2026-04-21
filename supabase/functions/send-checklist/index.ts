import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ChecklistPayload = {
  checklist_slug?: string;
};

type ChecklistItem = {
  dayRange: string;
  title: string;
  description: string;
  category: string;
  ctaLabel: string;
  ctaUrl: string;
};

const SITE = 'https://frankfurtexpatservices.com';

const checklists: Record<string, { title: string; path: string; items: ChecklistItem[] }> = {
  'frankfurt-first-30-days': {
    title: 'Frankfurt First 30 Days Checklist',
    path: '/frankfurt-first-30-days-checklist',
    items: [
      {
        dayRange: 'Days 1–3',
        title: 'Confirm your address and mailbox name',
        description: 'Make sure your temporary or permanent address is usable for official mail and that your surname is visible on the mailbox.',
        category: 'Housing',
        ctaLabel: 'Browse housing help',
        ctaUrl: `${SITE}/directory/housing-relocation-frankfurt`,
      },
      {
        dayRange: 'Days 1–14',
        title: 'Book or complete Anmeldung',
        description: 'Register your Frankfurt address with your passport, registration form, and landlord confirmation. This unlocks your tax ID and most official processes.',
        category: 'Registration',
        ctaLabel: 'Read Anmeldung guide',
        ctaUrl: `${SITE}/blog/anmeldung-frankfurt-checklist`,
      },
      {
        dayRange: 'Week 1',
        title: 'Confirm German health insurance',
        description: 'Choose public (gesetzlich) or private (privat) cover, share proof with your employer if needed, and save the membership confirmation.',
        category: 'Healthcare',
        ctaLabel: 'Find insurance brokers',
        ctaUrl: `${SITE}/directory/insurance-brokers-frankfurt`,
      },
      {
        dayRange: 'Week 1–2',
        title: 'Open a German bank account',
        description: 'Set up a Girokonto for salary, rent, insurance, and recurring payments. Keep your IBAN ready for employers and landlords.',
        category: 'Finance',
        ctaLabel: 'Find banking advisors',
        ctaUrl: `${SITE}/directory/banking-financial-advisors-frankfurt`,
      },
      {
        dayRange: 'Week 2–4',
        title: 'Track your tax ID and payroll setup',
        description: 'Your Steuer-ID usually arrives by post 2–4 weeks after Anmeldung. Check your payslip once payroll starts to confirm the correct tax class.',
        category: 'Tax',
        ctaLabel: 'Use free tax calculator',
        ctaUrl: `${SITE}/tools/german-tax-calculator-frankfurt`,
      },
      {
        dayRange: 'Week 2–4',
        title: 'Prepare your renter document packet',
        description: 'Collect proof of income, work contract, ID copy, Schufa report (if available), and a short applicant introduction letter.',
        category: 'Housing',
        ctaLabel: 'Read housing guide',
        ctaUrl: `${SITE}/blog/frankfurt-apartment-search-first-month`,
      },
      {
        dayRange: 'Week 3–4',
        title: 'Set up liability insurance',
        description: 'Private liability insurance (Privathaftpflicht) is inexpensive and often expected by landlords and employers. Covers accidental damage to others.',
        category: 'Insurance',
        ctaLabel: 'Compare insurance help',
        ctaUrl: `${SITE}/directory/insurance-brokers-frankfurt`,
      },
      {
        dayRange: 'Any time',
        title: 'Ask one Frankfurt-specific question',
        description: 'Use the community forum for details that change quickly — appointment timing, landlord expectations, or neighbourhood tradeoffs.',
        category: 'Community',
        ctaLabel: 'Ask the forum',
        ctaUrl: `${SITE}/forum/create`,
      },
    ],
  },
};

const buildHtmlEmail = (title: string, path: string, items: ChecklistItem[]): string => {
  const itemRows = items.map((item, i) => `
    <tr>
      <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="36" valign="top" style="padding-right:16px;">
              <div style="width:36px;height:36px;border-radius:50%;background:#0f766e;color:#fff;font-size:14px;font-weight:900;text-align:center;line-height:36px;">${i + 1}</div>
            </td>
            <td valign="top">
              <p style="margin:0 0 2px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#0f766e;">${item.dayRange} · ${item.category}</p>
              <p style="margin:0 0 6px;font-size:16px;font-weight:800;color:#0f172a;">${item.title}</p>
              <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#475569;">${item.description}</p>
              <a href="${item.ctaUrl}" style="font-size:13px;font-weight:700;color:#0f766e;text-decoration:none;">${item.ctaLabel} →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4ef;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #dbe1d8;">

          <!-- Header -->
          <tr>
            <td style="background:#0f766e;padding:28px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#99f6e4;">Frankfurt Expat Services</p>
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;line-height:1.2;">${title}</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#ccfbf1;">Your 8-step guide to the first 30 days in Frankfurt.</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:20px 24px 4px;border-bottom:1px solid #e2e8f0;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                Here is everything you need to get settled in Frankfurt, in the right order. Bookmark this email or visit the
                <a href="${SITE}${path}" style="color:#0f766e;font-weight:700;text-decoration:none;">full interactive checklist</a>
                to track your progress in your dashboard.
              </p>
            </td>
          </tr>

          <!-- Checklist items -->
          ${itemRows}

          <!-- CTA -->
          <tr>
            <td style="padding:24px;background:#f8faf9;text-align:center;">
              <p style="margin:0 0 16px;font-size:14px;color:#475569;">Track your progress and save your checklist in your free account.</p>
              <a href="${SITE}${path}" style="display:inline-block;padding:12px 28px;background:#0f766e;color:#fff;font-size:14px;font-weight:800;border-radius:8px;text-decoration:none;">Open Full Checklist →</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Frankfurt Expat Services · <a href="${SITE}" style="color:#94a3b8;">frankfurtexpatservices.com</a><br>
                You received this because you requested it. This is not a marketing list.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const buildTextEmail = (title: string, path: string, items: ChecklistItem[]): string => [
  `Your ${title}`,
  '='.repeat(50),
  '',
  ...items.map((item, i) =>
    [`${i + 1}. ${item.title}`, `   ${item.dayRange} · ${item.category}`, `   ${item.description}`, `   ${item.ctaLabel}: ${item.ctaUrl}`, ''].join('\n')
  ),
  '-'.repeat(50),
  `Open the full interactive checklist: ${SITE}${path}`,
  '',
  'You received this because you requested it from Frankfurt Expat Services.',
].join('\n');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ message: 'Missing Supabase configuration' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization') || '';
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user?.email) {
    return new Response(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = (await req.json().catch(() => ({}))) as ChecklistPayload;
  const checklistSlug = String(payload.checklist_slug || '').trim();
  const checklist = checklists[checklistSlug];

  if (!checklist) {
    return new Response(JSON.stringify({ message: 'Checklist not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const nowIso = new Date().toISOString();
  const { data: requestRow, error: insertError } = await serviceClient
    .from('checklist_delivery_requests')
    .insert({
      user_id: userData.user.id,
      checklist_slug: checklistSlug,
      email: userData.user.email,
      status: 'queued',
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('send-checklist insert error:', insertError);
    return new Response(JSON.stringify({ message: 'Could not store checklist request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('CHECKLIST_FROM_EMAIL') || Deno.env.get('REMINDER_FROM_EMAIL') || Deno.env.get('CONTACT_FROM_EMAIL');

  if (!resendApiKey || !from) {
    await serviceClient
      .from('checklist_delivery_requests')
      .update({ status: 'failed', error_message: 'RESEND_API_KEY or FROM email not configured', updated_at: nowIso })
      .eq('id', requestRow.id);

    return new Response(JSON.stringify({ message: 'Email provider is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [userData.user.email],
      subject: `Your ${checklist.title}`,
      html: buildHtmlEmail(checklist.title, checklist.path, checklist.items),
      text: buildTextEmail(checklist.title, checklist.path, checklist.items),
    }),
  });

  const resendBody = await resendResponse.json().catch(() => ({}));

  if (!resendResponse.ok) {
    await serviceClient
      .from('checklist_delivery_requests')
      .update({ status: 'failed', provider: 'resend', error_message: JSON.stringify(resendBody), updated_at: nowIso })
      .eq('id', requestRow.id);

    return new Response(JSON.stringify({ message: 'Checklist email could not be sent' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  await serviceClient
    .from('checklist_delivery_requests')
    .update({ status: 'sent', provider: 'resend', provider_message_id: resendBody?.id || null, sent_at: nowIso, updated_at: nowIso })
    .eq('id', requestRow.id);

  return new Response(JSON.stringify({ message: 'Checklist sent' }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
