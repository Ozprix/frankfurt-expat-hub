# Frankfurt Expat Services - App Documentation

## 1. Project Overview

**Frankfurt Expat Services** is a relocation platform for English-speaking newcomers moving to Frankfurt, Germany. It combines practical setup guides, free tools, account-based checklists, a provider directory, and community support.

### 🎯 Target Users
- **Expats:** Professionals relocating for work.
- **Students:** International students enrolling in Frankfurt universities.
- **Digital Nomads:** Remote workers choosing Frankfurt as their base.
- **Families:** Households moving together requiring school and healthcare guidance.

### Key Features
- **Free Tools:** German wage tax estimator, currency converter, QR generator, password generator, and public SEO landing pages.
- **First 30 Days Checklist:** Frankfurt setup tracker with optional reminder state.
- **Dashboard:** Account overview, setup progress, shortcuts, activity, and profile access.
- **Document Tracker:** Relocation paperwork checklist with notes and PDF export.
- **Tax Prep Hub:** Protected workflow for organizing salary, insurance, deduction, family, and freelance records before advisor review.
- **Directory:** English-speaking provider categories, including tax advisors, insurance brokers, relocation agents, and legal support.
- **Forum:** Community Q&A around housing, tax, registration, and daily setup.

---

## 2. Features Section

The platform is built around these core pillars:

1.  **Free Account Tools:**
    - Protected dashboard, checklist, documents, budget planner, and Tax Prep Hub.
    - User state is stored in Supabase with local fallbacks where useful.

2.  **Setup Planning:**
    - Users work through first-month actions such as Anmeldung, insurance, banking, tax ID, and rental documents.
    - Dashboard shortcuts point users toward the next relevant guide, tool, forum, or directory category.

3.  **Task Management:**
    - Detailed task tracking with status (Todo, In Progress, Done).
    - Importance flagging and notes.

4.  **Email Notifications (Resend):**
    - Automated reminders 24h before task deadlines.
    - Weekly progress digests.
    - Checklist delivery and reminder emails for the free-growth phase.

5.  **Documents and Tax Prep:**
    - Relocation document tracker for core Frankfurt setup paperwork.
    - Tax Prep Hub for advisor-ready tax document organization and CSV export.
    - PDF export support for selected checklists.

6.  **Progress Tracking:**
    - Visual dashboard with circular progress indicators.
    - Streak counters (days active).
    - Achievement badges (e.g., "Housing Hero", "Visa Victor").

7.  **Calendar Integration:**
    - OAuth2 integration with Google Calendar and Microsoft Outlook.
    - Two-way sync status indicators.

8.  **Payments (Shelved):**
    - Stripe code and setup notes exist.
    - Paid checkout is intentionally paused while the project focuses on traffic, free tools, directory growth, and community adoption.

---

## 3. Tech Stack

### Frontend
-   **Framework:** React 18
-   **Build Tool:** Vite
-   **Language:** JavaScript (ES6+)
-   **Styling:** TailwindCSS
-   **UI Components:** shadcn/ui (Radix UI primitives)
-   **Icons:** Lucide React
-   **Animations:** Framer Motion
-   **Routing:** React Router 6.16.0

### Backend (Serverless)
-   **Platform:** Supabase
-   **Database:** PostgreSQL
-   **Auth:** Supabase Auth (Email/Password, Social)
-   **Logic:** Supabase Edge Functions (Deno)
-   **Storage:** Supabase Storage (for document assets)

### Third-Party Services
-   **Payments:** Stripe
-   **Email:** Resend
-   **Calendars:** Google Calendar API, Microsoft Graph API
-   **Hosting:** Netlify

---

## 4. Tax Prep Hub

The Tax Prep Hub lives at `/tax-prep` and is protected by `ProtectedRoute`.

### Purpose

Help expats prepare for a German tax return consultation by tracking:

- salary and payroll records
- Steuer-ID and Finanzamt letters
- health and pension insurance statements
- relocation and work-related expenses
- donations and household services
- marriage, child, and household documents
- freelance income and side-business records

### Implementation

- UI: `src/pages/TaxPrepPage.jsx`
- State hook: `src/hooks/useTaxPrepDocuments.js`
- Data/export helpers: `src/utils/taxPrep.js`
- Tests: `src/utils/taxPrep.test.js`

The MVP reuses `public.user_document_checklist` with `taxprep-` prefixed `document_id` values. This avoids a new migration while keeping tax-prep rows separate from relocation document rows.

### Verification

```bash
node --test src/utils/taxPrep.test.js
npm run lint
npm run build
```

---

## 5. Project Structure

- `src/pages`: route-level React pages.
- `src/components`: shared UI, layout, profile, admin, and feature components.
- `src/hooks`: Supabase-backed state hooks and feature workflows.
- `src/data`: static content for guides, directory categories, tools, videos, apartments, and checklist data.
- `src/utils`: calculators, export helpers, structured data, and pure utility modules.
- `src/database`: SQL schema and launch migration files.
- `supabase/functions`: Supabase Edge Functions.
- `docs`: deploy, migration, SEO, and launch operations notes.
