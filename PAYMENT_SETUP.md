# Stripe Payment Setup Guide

> Status: shelved. Paid checkout is not part of the current launch path. Keep this document as an implementation note for a later monetization phase, but do not deploy payment functions or promote paid plans while the project focuses on traffic, free tools, directory growth, and community adoption.

This project uses **Stripe Checkout** for payments and Stripe Billing for subscription management. Follow these steps to configure the payment system.

## 1. Stripe Account Setup

1.  Go to [stripe.com](https://stripe.com) and create an account.
2.  Set up your business profile, default currency, tax settings, and customer billing portal.

## 2. Create Products

You need to create two products matching the application tiers:

### **Product A: Bureaucracy Pro**
*   **Type:** Subscription
*   **Price:** €9 / month
*   **Name:** Bureaucracy Pro

### **Product B: Move-In Pack**
*   **Type:** Subscription
*   **Price:** €15 / month
*   **Name:** Move-In Pack

## 3. Get API Credentials

1.  **Publishable key:** Put this in `VITE_STRIPE_PUBLISHABLE_KEY`.
2.  **Secret key:** Put this in Supabase Edge Function secrets as `STRIPE_SECRET_KEY`.
3.  **Webhook signing secret:** Put this in Supabase Edge Function secrets as `STRIPE_WEBHOOK_SECRET`.
4.  **Price IDs:** Copy the Stripe price IDs into `src/config/stripePrices.js`.

## 4. Configuration

1.  Rename `.env.example` to `.env` (if not done).
2.  Fill in the frontend values.
3.  Deploy the checkout, portal, and webhook Edge Functions before accepting live payments.
