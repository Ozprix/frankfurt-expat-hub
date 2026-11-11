-- Supports the contact-form email rate-limit lookup:
-- WHERE email = ? AND created_at >= ?
CREATE INDEX IF NOT EXISTS idx_contact_messages_email_created
  ON public.contact_messages (email, created_at DESC);
