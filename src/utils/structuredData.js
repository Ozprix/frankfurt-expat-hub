/**
 * structuredData.js
 * JSON-LD schema.org helpers for Frankfurt Expat Services.
 *
 * Usage — inject via react-helmet or SEOHead's children prop:
 *
 *   import { schemaWebSite } from '@/utils/structuredData';
 *
 *   <SEOHead title="..." description="...">
 *     <script type="application/ld+json">
 *       {JSON.stringify(schemaWebSite())}
 *     </script>
 *   </SEOHead>
 */

const BASE_URL  = 'https://frankfurtexpatservices.com';
const ORG_NAME  = 'Frankfurt Expat Services';

/* ── 1. WebSite ────────────────────────────────────────────────────────── */
export const schemaWebSite = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: ORG_NAME,
  url: BASE_URL,
  description:
    'Free browser-based tools and a vetted English-speaking service directory for expats settling in Frankfurt, Germany.',
});

/* ── 2. Organization ───────────────────────────────────────────────────── */
export const schemaOrganization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME,
  url: BASE_URL,
  email: 'hello@frankfurtexpatservices.com',
  description:
    'Helping international residents navigate Frankfurt bureaucracy with free tools, document guides, and a curated directory of English-speaking service providers.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Frankfurt am Main',
    addressRegion: 'Hessen',
    addressCountry: 'DE',
  },
  areaServed: {
    '@type': 'City',
    name: 'Frankfurt am Main',
  },
  sameAs: [],
});

/* ── 3. FAQPage ─────────────────────────────────────────────────────────── */
/**
 * @param {Array<{question: string, answer: string}>} items
 */
export const schemaFAQ = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
});

/* ── 4. BreadcrumbList ──────────────────────────────────────────────────── */
/**
 * @param {Array<{name: string, path: string}>} crumbs
 * Example: [{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }]
 */
export const schemaBreadcrumb = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(({ name, path }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: `${BASE_URL}${path}`,
  })),
});

/* ── 5. Article / BlogPost ──────────────────────────────────────────────── */
/**
 * @param {{ title: string, description: string, slug: string, datePublished: string, dateModified?: string, image?: string }} post
 */
export const schemaArticle = ({ title, description, slug, datePublished, dateModified, image }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  url: `${BASE_URL}/blog/${slug}`,
  datePublished,
  dateModified: dateModified || datePublished,
  image: image || `${BASE_URL}/og-image.jpg`,
  author: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: BASE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/android-chrome-512x512.png`,
    },
  },
});

/* ── 6. Service (for Directory categories) ──────────────────────────────── */
/**
 * @param {{ name: string, description: string, path: string }} service
 */
export const schemaService = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: `${BASE_URL}${path}`,
  provider: {
    '@type': 'Organization',
    name: ORG_NAME,
    url: BASE_URL,
  },
  areaServed: {
    '@type': 'City',
    name: 'Frankfurt am Main',
  },
});

/* ── 7. SoftwareApplication (for the tools page) ────────────────────────── */
export const schemaSoftwareApp = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: `${ORG_NAME} — Free Expat Tools`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: `${BASE_URL}/tools`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  description:
    'Free browser-based tools for Frankfurt expats: German income tax calculator, EUR currency converter, QR code generator, and secure password generator.',
});

/* ── 8. HowTo (for public checklists) ───────────────────────────────────── */
/**
 * @param {{ name: string, description: string, path: string, steps: Array<{ title: string, description: string }> }} howTo
 */
export const schemaHowTo = ({ name, description, path, steps }) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  url: `${BASE_URL}${path}`,
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
});
