import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  source?: string;
  website?: string;
};

const clean = (value: unknown) => String(value ?? '').trim();
const envInt = (key: string, fallback: number) => {
  const raw = Deno.env.get(key);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

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

  try {
    const payload = (await req.json()) as ContactPayload;

    if (clean(payload.website)) {
      return new Response(JSON.stringify({ message: 'Message received' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const name = clean(payload.name);
    const email = clean(payload.email).toLowerCase();
    const subject = clean(payload.subject);
    const message = clean(payload.message);
    const source = clean(payload.source) || 'contact-page';

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (name.length > 120 || email.length > 255 || subject.length > 160 || message.length > 5000) {
      return new Response(JSON.stringify({ message: 'One or more fields exceed max length' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return new Response(JSON.stringify({ message: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ message: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0]?.trim() || null;

    const windowMinutes = envInt('CONTACT_RATE_LIMIT_WINDOW_MINUTES', 10);
    const maxPerIp = envInt('CONTACT_RATE_LIMIT_MAX_PER_IP', 5);
    const maxPerEmail = envInt('CONTACT_RATE_LIMIT_MAX_PER_EMAIL', 3);
    const sinceIso = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    if (ipAddress) {
      const { count: ipCount, error: ipError } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('ip_address', ipAddress)
        .gte('created_at', sinceIso);

      if (ipError) {
        console.error('contact-form ip rate-limit check error:', ipError);
        return new Response(JSON.stringify({ message: 'Rate limit check failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if ((ipCount ?? 0) >= maxPerIp) {
        return new Response(JSON.stringify({ message: 'Too many submissions. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const { count: emailCount, error: emailError } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', sinceIso);

    if (emailError) {
      console.error('contact-form email rate-limit check error:', emailError);
      return new Response(JSON.stringify({ message: 'Rate limit check failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if ((emailCount ?? 0) >= maxPerEmail) {
      return new Response(JSON.stringify({ message: 'Too many submissions. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: insertError } = await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      source,
      ip_address: ipAddress,
    });

    if (insertError) {
      console.error('contact-form insert error:', insertError);
      return new Response(JSON.stringify({ message: 'Failed to store message' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const contactToEmail = Deno.env.get('CONTACT_TO_EMAIL') || 'hello@frankfurtexpatservices.com';
    const contactFromEmail = Deno.env.get('CONTACT_FROM_EMAIL') || '';

    if (resendApiKey && contactFromEmail) {
      const isGuideSignup = source === 'guide-updates';

      // 1. Notify admin
      const adminNotify = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: contactFromEmail,
          to: [contactToEmail],
          reply_to: email,
          subject: `[Contact] ${subject}`,
          text: [`Name: ${name}`, `Email: ${email}`, `Source: ${source}`, `IP: ${ipAddress ?? 'n/a'}`, '', message].join('\n'),
        }),
      });

      // 2. Auto-reply to user
      const userReplyBody = isGuideSignup
        ? {
            from: contactFromEmail,
            to: [email],
            subject: 'Welcome — Frankfurt guides incoming',
            html: `<!DOCTYPE html><html><body style="margin:0;padding:32px 16px;background:#f3f4ef;font-family:Inter,Arial,sans-serif;">
<table width="600" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #dbe1d8;">
  <tr><td style="background:#0f766e;padding:24px;">
    <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#99f6e4;">Frankfurt Expat Services</p>
    <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">You're on the list.</h1>
  </td></tr>
  <tr><td style="padding:24px;">
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#475569;">Hi ${name},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#475569;">Thanks for signing up. We'll send you practical Frankfurt guides — covering topics like Anmeldung, tax setup, housing, and banking — as we publish them.</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#475569;">While you wait, start with our free First 30 Days Checklist and the tools below:</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
        <a href="https://frankfurtexpatservices.com/frankfurt-first-30-days-checklist" style="font-size:14px;font-weight:700;color:#0f766e;text-decoration:none;">→ First 30 Days Checklist</a>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
        <a href="https://frankfurtexpatservices.com/tools" style="font-size:14px;font-weight:700;color:#0f766e;text-decoration:none;">→ Free Tools (Tax Calculator, Currency Converter)</a>
      </td></tr>
      <tr><td style="padding:8px 0;">
        <a href="https://frankfurtexpatservices.com/directory" style="font-size:14px;font-weight:700;color:#0f766e;text-decoration:none;">→ Vetted English-Speaking Service Directory</a>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Frankfurt Expat Services · <a href="https://frankfurtexpatservices.com" style="color:#94a3b8;">frankfurtexpatservices.com</a></p>
  </td></tr>
</table></body></html>`,
            text: `Hi ${name},\n\nThanks for signing up. We'll send you practical Frankfurt guides as we publish them.\n\nIn the meantime:\n- First 30 Days Checklist: https://frankfurtexpatservices.com/frankfurt-first-30-days-checklist\n- Free Tools: https://frankfurtexpatservices.com/tools\n- Service Directory: https://frankfurtexpatservices.com/directory\n\n— Frankfurt Expat Services`,
          }
        : {
            from: contactFromEmail,
            to: [email],
            reply_to: contactToEmail,
            subject: `We received your message — ${subject}`,
            html: `<!DOCTYPE html><html><body style="margin:0;padding:32px 16px;background:#f3f4ef;font-family:Inter,Arial,sans-serif;">
<table width="600" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #dbe1d8;">
  <tr><td style="background:#0f766e;padding:24px;">
    <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#99f6e4;">Frankfurt Expat Services</p>
    <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">Message received.</h1>
  </td></tr>
  <tr><td style="padding:24px;">
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#475569;">Hi ${name},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#475569;">Thanks for reaching out. We've received your message and will get back to you within 24–48 business hours.</p>
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;">Your message</p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;border-left:3px solid #0f766e;padding-left:12px;">${message.replace(/\n/g, '<br>')}</p>
  </td></tr>
  <tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">Frankfurt Expat Services · <a href="https://frankfurtexpatservices.com" style="color:#94a3b8;">frankfurtexpatservices.com</a></p>
  </td></tr>
</table></body></html>`,
            text: `Hi ${name},\n\nThanks for reaching out. We've received your message and will respond within 24–48 business hours.\n\nYour message:\n${message}\n\n— Frankfurt Expat Services`,
          };

      const userReply = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(userReplyBody),
      });

      // Fire both in parallel, don't block response on either
      const [adminRes, userRes] = await Promise.allSettled([adminNotify, userReply]);
      if (adminRes.status === 'fulfilled' && !adminRes.value.ok) {
        console.error('contact-form admin notify error:', await adminRes.value.text().catch(() => ''));
      }
      if (userRes.status === 'fulfilled' && !userRes.value.ok) {
        console.error('contact-form user reply error:', await userRes.value.text().catch(() => ''));
      }
    }

    return new Response(JSON.stringify({ message: 'Message received' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('contact-form request error:', error);
    return new Response(JSON.stringify({ message: 'Invalid request payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
