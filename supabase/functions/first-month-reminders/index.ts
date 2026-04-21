import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type ReminderRow = {
  id: string;
  user_id: string;
  subject: string;
  reminder_type: string;
  scheduled_for: string;
};

type UserRow = {
  id: string;
  email?: string;
  raw_user_meta_data?: {
    full_name?: string;
    name?: string;
  };
};

type EmailResult =
  | { skipped: true; reason: string }
  | { skipped: false; providerMessageId: string | null };

const jsonHeaders = { 'Content-Type': 'application/json' };

const reminderText = (name: string) => [
  `Hi ${name},`,
  '',
  'Your Frankfurt setup checklist is waiting in your dashboard.',
  '',
  'Recommended next steps:',
  '- Confirm Anmeldung paperwork and mailbox name',
  '- Check your tax ID follow-up timing',
  '- Review health insurance and banking setup',
  '- Ask the forum if your situation is specific',
  '',
  'Open your dashboard: https://frankfurtexpatservices.com/dashboard',
  '',
  'You can change reminder preferences in your account at any time.',
].join('\n');

const sendEmail = async (to: string, subject: string, text: string): Promise<EmailResult> => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('REMINDER_FROM_EMAIL') || Deno.env.get('CONTACT_FROM_EMAIL');

  if (!resendApiKey || !from) {
    return { skipped: true, reason: 'RESEND_API_KEY or REMINDER_FROM_EMAIL is not configured' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(JSON.stringify(body));
  }

  return { skipped: false, providerMessageId: body?.id || null };
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ message: 'Missing Supabase service configuration' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const nowIso = new Date().toISOString();
  const { data: dueEvents, error: dueError } = await supabase
    .from('reminder_email_events')
    .select('id,user_id,subject,reminder_type,scheduled_for')
    .eq('status', 'queued')
    .lte('scheduled_for', nowIso)
    .order('scheduled_for', { ascending: true })
    .limit(25);

  if (dueError) {
    console.error('reminder fetch error:', dueError);
    return new Response(JSON.stringify({ message: 'Failed to fetch reminders' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const results = [];

  for (const event of (dueEvents || []) as ReminderRow[]) {
    try {
      const { data: preference } = await supabase
        .from('notification_preferences')
        .select('first_month_reminders,reminder_unsubscribed_at')
        .eq('user_id', event.user_id)
        .single();

      if (!preference?.first_month_reminders || preference?.reminder_unsubscribed_at) {
        await supabase
          .from('reminder_email_events')
          .update({ status: 'skipped', updated_at: nowIso, error_message: 'User is not opted in' })
          .eq('id', event.id);
        results.push({ id: event.id, status: 'skipped' });
        continue;
      }

      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(event.user_id);
      if (userError) throw userError;

      const user = userData.user as UserRow | null;
      if (!user?.email) {
        throw new Error('User has no email address');
      }

      const displayName = user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.name || 'there';
      const emailResult = await sendEmail(user.email, event.subject, reminderText(displayName));

      await supabase
        .from('reminder_email_events')
        .update({
          status: emailResult.skipped ? 'skipped' : 'sent',
          provider: emailResult.skipped ? null : 'resend',
          provider_message_id: emailResult.providerMessageId || null,
          error_message: emailResult.skipped ? emailResult.reason : null,
          sent_at: emailResult.skipped ? null : nowIso,
          updated_at: nowIso,
        })
        .eq('id', event.id);

      results.push({ id: event.id, status: emailResult.skipped ? 'skipped' : 'sent' });
    } catch (error) {
      console.error('reminder send error:', error);
      await supabase
        .from('reminder_email_events')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : String(error),
          updated_at: nowIso,
        })
        .eq('id', event.id);
      results.push({ id: event.id, status: 'failed' });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    status: 200,
    headers: jsonHeaders,
  });
});
