# Stripe + Supabase Integration for Frankfurt Expat Services

> Status: shelved. Stripe checkout, customer portal, and webhook deployment are paused for the current growth phase. Do not treat this as a launch blocker until paid products are intentionally reintroduced.

## Overview
Frankfurt Expat Services uses Stripe for handling subscription payments for "Bureaucracy Pro" and "Move-In Pack" tiers. The integration leverages Supabase Edge Functions to securely communicate with Stripe API and handle webhooks.

## Configuration

### Webhook Endpoint
**URL:** `https://frankfurtexpatservices.supabase.co/functions/v1/stripe-webhook`

### Configured Webhook Events
The following events must be enabled in the Stripe Dashboard for this endpoint:
- `customer.subscription.created` - Triggered when a new subscription starts
- `customer.subscription.updated` - Triggered when a plan changes, renews, or status updates
- `customer.subscription.deleted` - Triggered when a subscription is canceled
- `invoice.payment_succeeded` - Logged for audit trails
- `invoice.payment_failed` - Logged for debugging payment issues

### Required Secrets
These secrets are stored in Supabase Project Settings > Edge Functions > Secrets:
- **STRIPE_SECRET_KEY**: `sk_live_or_test_replace_me`
  *(Used to authenticate API requests from Edge Functions)*
  
- **STRIPE_WEBHOOK_SECRET**: `whsec_replace_me`
  *(Used to verify that incoming webhooks are legitimately from Stripe)*
  
- **STRIPE_PUBLISHABLE_KEY**: `pk_live_or_test_replace_me`
  *(Used in frontend `src/config/stripeConfig.js`)*
- **STRIPE_PRICE_PRO_MONTHLY**
- **STRIPE_PRICE_PRO_ANNUAL**
- **STRIPE_PRICE_MOVE_IN_PACK_MONTHLY**
- **STRIPE_PRICE_MOVE_IN_PACK_ANNUAL**
  *(Used by the checkout Edge Function to validate allowed prices and attach tier metadata.)*

## Payment Flow

1.  **Initiation**:
    - User clicks "Upgrade" or "Get Move-In Pack" on the `PricingPage`.
    - Frontend calls the `create-checkout-session` Edge Function with `price_id`, `user_id`, and `billing_period`.

2.  **Checkout**:
    - `create-checkout-session` Edge Function creates a Stripe Checkout Session.
    - It attaches `metadata: { user_id }` to the session/customer to link payments to users later.
    - Frontend redirects the user to the returned Stripe URL.

3.  **Processing**:
    - User enters payment details and confirms purchase on Stripe.
    - Stripe processes the payment and creates a subscription.

4.  **Fulfillment (Webhook)**:
    - Stripe sends a `customer.subscription.created` webhook event to `stripe-webhook` Edge Function.
    - Edge Function verifies the signature using `STRIPE_WEBHOOK_SECRET`.
    - Edge Function extracts `user_id` from metadata or looks up the customer ID.
    - Edge Function inserts/updates the record in the `subscriptions` table in Supabase.
    - Edge Function logs the event in `subscription_logs` table.

5.  **Access**:
    - Frontend detects the updated subscription state (via `useSubscription` hook polling or real-time).
    - User is granted access to Pro features immediately.

## Testing
To verify the integration without real payments:
1. Go to **Stripe Dashboard > Developers > Webhooks**.
2. Select the configured endpoint.
3. Click **"Test in a local environment"** or **"Send test event"**.
4. Select `customer.subscription.created`.
5. Verify that the Edge Function returns `200 OK` and a new log appears in the Supabase `subscription_logs` table.
