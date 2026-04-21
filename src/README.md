# 🇩🇪 Frankfurt Expat Services - Project Documentation

## 1. Project Overview

**Frankfurt Expat Services** is a comprehensive, AI-powered relocation platform designed to simplify the complex process of moving to Frankfurt, Germany. It serves as a digital companion for expats, students, and professionals, guiding them through every step of their journey—from visa applications to finding housing and settling in.

### 🎯 Target Users
- **Expats:** Professionals relocating for work.
- **Students:** International students enrolling in Frankfurt universities.
- **Digital Nomads:** Remote workers choosing Frankfurt as their base.
- **Families:** Households moving together requiring school and healthcare guidance.

### ⭐ Key Features
- **Smart Planning:** AI-generated personalized relocation plans.
- **Task Management:** Integrated to-do lists with deadline tracking.
- **Calendar Sync:** Seamless integration with Google and Outlook calendars.
- **Gamification:** Progress tracking with streaks, badges, and rewards.
- **Document Hub:** Ready-to-use templates for German bureaucracy.

---

## 2. Features Section

The platform is built around 8 core pillars to ensure a smooth transition:

1.  **Subscription Management:**
    - tiered access (Free, Pro, Move-In Pack) managed via Stripe.
    - Automatic billing and access control.

2.  **Plan Generation (AI-Powered):**
    - Users input their arrival date and visa type.
    - System generates a custom timeline of tasks (e.g., "Apply for Visa", "Register Residence").

3.  **Task Management:**
    - Detailed task tracking with status (Todo, In Progress, Done).
    - Importance flagging and notes.

4.  **Email Notifications (Resend):**
    - Automated reminders 24h before task deadlines.
    - Weekly progress digests.
    - Payment confirmation emails.

5.  **Document Templates:**
    - Library of 8 essential checklists/templates (Visa, Housing, Banking, Healthcare, Utilities, Social, Tax, Moving).
    - PDF export functionality.

6.  **Progress Tracking:**
    - Visual dashboard with circular progress indicators.
    - Streak counters (days active).
    - Achievement badges (e.g., "Housing Hero", "Visa Victor").

7.  **Calendar Integration:**
    - OAuth2 integration with Google Calendar and Microsoft Outlook.
    - Two-way sync status indicators.

8.  **Stripe Payments:**
    - Secure checkout for Pro subscriptions and one-time template packs.
    - Customer portal for subscription management.

---

## 3. Tech Stack

### Frontend
-   **Framework:** React 18.2.0
-   **Build Tool:** Vite
-   **Language:** JavaScript (ES6+)
-   **Styling:** TailwindCSS 3.3.2
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
-   **Hosting:** Vercel (recommended)

---

## 4. Project Structure