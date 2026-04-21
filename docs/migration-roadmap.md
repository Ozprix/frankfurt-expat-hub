# Frankfurt Expat Services Migration Roadmap

## Objective
Migrate from the current static-site setup into the React app while preserving SEO equity, current messaging, and lead capture flows.

## Current State
- Static production pages exist in repository root (`index.html`, `about.html`, `contact.html`, `faq.html`, `privacy-policy.html`, `terms.html`).
- New React app is extracted in `frankfurt/horizons-export` and now acts as migration target.
- Critical blockers (auth contract mismatch, broken admin routes, embedded live key fallbacks) have been resolved.
- Paid checkout is intentionally shelved while the site focuses on traffic, free tools, directory supply, and community adoption.

## Phase 1 - Foundation (Done)
- Align auth API between context and consuming components.
- Align admin navigation with registered routes.
- Remove/replace hardcoded live Stripe key references in app config and docs.

## Phase 2 - Content and Route Parity (In Progress)
- Build route-by-route migration matrix from static pages to React pages.
- Preserve slugs and canonical tags for equivalent pages.
- Ensure legal pages in React include all mandatory sections from current static pages.

### Route Parity Matrix
| Current URL | Static Source | React Target | Status |
|---|---|---|---|
| `/` | `index.html` | `src/pages/HomePage.jsx` | In progress - toolkit, beta, and directory CTAs fused |
| `/tools` | `index.html` tool modals + `assets/js/scripts.js` | `src/pages/ToolsPage.jsx` | Added |
| `/directory` | `index.html` service directory + listing form | `src/pages/DirectoryPage.jsx` | Added |
| `/about` | `about.html` | `src/pages/AboutPage.jsx` | Added |
| `/contact` | `contact.html` | `src/pages/ContactPage.jsx` | Added |
| `/faq` | `faq.html` | `src/pages/FAQPage.jsx` | Added |
| `/privacy-policy` | `privacy-policy.html` | `src/pages/PrivacyPolicyPage.jsx` | Added |
| `/terms` | `terms.html` | `src/pages/TermsPage.jsx` | Added - pending legal copy review |

## Phase 3 - UX Revamp
- Establish a single visual language across marketing pages (typography, color tokens, spacing, interaction states).
- Remove template-like defaults and enforce a clear brand direction.
- Add consistent mobile behavior and section-level performance budget.

## Phase 4 - Functional Migration
- Move directory inquiry forms and lead capture workflows into React forms.
- Reconnect analytics events currently fired from static JS forms.
- Ensure every feature CTA from homepage has a working route target.

## Phase 5 - Launch Hardening
- Generate redirects from old static paths to new SPA routes where needed.
- Add metadata, Open Graph, and schema markup per marketing page.
- Run final QA on mobile, tablet, and desktop breakpoints.
- Deploy with rollback plan and monitor conversion + bounce metrics.

## Immediate Next Tasks
1. Finish the live Supabase setup: apply launch SQL, deploy `contact-form`, `send-checklist`, and `first-month-reminders`, configure Resend secrets, and smoke test signup, contact, checklist delivery, and reminder queueing.
2. Seed production data for forum categories/posts, video tutorials, apartment listings, and starter directory categories.
3. Refactor `HowItWorksPage` and `PricingPage` to match the new homepage/tools/directory design system.
4. Run legal review on privacy-policy, terms, and imprint copy before production launch.
5. Publish the first solo-operator traffic clusters around Anmeldung, housing, tax ID, health insurance, and English-speaking provider categories.
