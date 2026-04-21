/**
 * toolLandingPages.js
 * Public SEO content for each tool landing page.
 * These pages explain the tool, show example output, answer FAQs,
 * and CTA into signup — so search users get value before registering.
 */

export const toolLandingPages = [
  {
    slug: 'german-tax-calculator-frankfurt',
    toolId: 'tax',         // maps to the anchor/section in /tools
    title: 'German Tax Calculator Frankfurt | Frankfurt Expat Services',
    heading: 'German Income Tax Calculator for Frankfurt Expats',
    tagline: 'Estimate your net salary in Germany — including income tax, solidarity surcharge, and social insurance — before signing your contract.',
    metaDescription:
      'Free German income tax calculator for Frankfurt expats. Estimate net salary after Lohnsteuer, Solidaritätszuschlag, and social insurance. Useful for salary negotiations and budget planning.',
    icon: '🧮',
    questions: [
      {
        heading: 'What affects your net salary in Germany?',
        body: 'German payroll deductions fall into two categories: taxes and social insurance. Taxes include income tax (Lohnsteuer) and solidarity surcharge (Solidaritätszuschlag). Social insurance includes health, pension, unemployment, and long-term care contributions. Together these typically reduce gross pay by 35–45% depending on income level and tax class.',
      },
      {
        heading: 'What are German tax classes and which applies to you?',
        body: 'Germany assigns workers to one of six Steuerklassen (tax classes). Class 1 is for single employees — the most common starting point for expats. Class 3 applies to married couples where one partner earns significantly more; the higher earner gets Class 3 and the lower earner Class 5. Tax class affects monthly payroll deductions but not your total annual liability — the Steuererklärung reconciles the difference.',
      },
      {
        heading: 'How do Frankfurt newcomers estimate monthly take-home pay?',
        body: 'A reliable estimate starts with your gross annual salary and applies the relevant tax class, church tax choice (Kirchensteuer), and 2025 social insurance rates. Our calculator models all of these. As a rough rule: in tax class 1, expect to net around 60–65% of gross at mid-level salaries (€50,000–80,000/year), rising slightly at higher levels.',
      },
      {
        heading: 'When should Frankfurt expats speak to a tax advisor?',
        body: 'If you have freelance income alongside employment, investments, cross-border income (US, UK, or other countries), or if your employer handles relocation packages or stock grants, a qualified Steuerberater experienced with expats will likely recover their fee several times over. The calculator is useful for planning — but not a substitute for professional advice in complex situations.',
      },
    ],
    faqs: [
      {
        question: 'Is the German salary calculator accurate?',
        answer: 'It uses simplified 2025 rate assumptions for income tax, solidarity surcharge, and social insurance contributions. It is reliable for planning and salary negotiations, but should not be used as definitive payroll or tax advice. Actual deductions depend on individual circumstances, additional income sources, and employer-specific payroll settings.',
      },
      {
        question: 'Does church tax affect my German salary?',
        answer: 'If you are registered with a recognised church (Catholic, Protestant, and some others), church tax (Kirchensteuer) is automatically deducted from payroll at 8–9% of your income tax amount. If you are not a member, or if you deregister, it does not apply. The calculator includes a Kirchensteuer toggle.',
      },
      {
        question: 'What is the solidarity surcharge in 2025?',
        answer: 'The Solidaritätszuschlag (Soli) was significantly reduced from 2021. In 2025, most employees with incomes below roughly €18,000/year in income tax pay no Soli. Above certain thresholds, a partial or full 5.5% Soli applies to the income tax amount. The calculator applies the correct 2025 rules.',
      },
      {
        question: 'Are social insurance contributions fixed in Germany?',
        answer: 'Rates are set annually by the government and differ slightly year to year. In 2025, total employee social insurance contributions are approximately 20–21% of gross salary (health ~7.3%, pension 9.3%, unemployment 1.3%, care 1.7–2.0%). Contributions are capped at the Beitragsbemessungsgrenze (assessment ceiling).',
      },
      {
        question: 'How is the tax different for freelancers vs employees in Germany?',
        answer: 'Freelancers (Freiberufler or Selbständige) do not have payroll deductions — instead they pay quarterly estimated taxes and file a full annual income tax return. They also pay trade tax (Gewerbesteuer) if operating as a business. Our calculator is designed for employed workers; freelancer tax planning requires separate modelling.',
      },
    ],
    ctaHeading: 'Save and personalise your estimate',
    ctaBody: 'Create a free account to run multiple salary scenarios, save your results, and access the full relocation budget planner.',
    relatedDirectory: { label: 'Find a tax advisor', path: '/directory/tax-advisors-frankfurt' },
    relatedBlog: [
      { label: 'German tax class basics for expats', slug: 'german-tax-class-frankfurt-expats' },
      { label: 'Freelancer tax basics in Frankfurt', slug: 'freelancer-tax-basics-frankfurt' },
      { label: 'Tax return deadlines in Germany', slug: 'german-tax-return-deadlines' },
    ],
  },

  {
    slug: 'currency-converter-frankfurt',
    toolId: 'currency',
    title: 'Currency Converter Frankfurt Expats | Frankfurt Expat Services',
    heading: 'Currency Converter for Frankfurt Expats',
	    tagline: 'Convert your home currency to euros at live reference rates with a free account.',
    metaDescription:
      'Free currency converter for Frankfurt expats using live ECB reference rates. Convert GBP, USD, CHF, and other currencies to EUR for salary comparisons, rent budgeting, and cost planning.',
    icon: '💱',
    questions: [
      {
        heading: 'Why use ECB rates rather than bank rates?',
        body: 'The European Central Bank publishes daily reference exchange rates used as an objective benchmark. Bank and card exchange rates include a markup of 0.5–3% above this rate. Knowing the ECB rate gives you a fair baseline to judge the cost of any currency exchange or international transfer.',
      },
      {
        heading: 'How should Frankfurt newcomers think about salary in euros?',
        body: 'When comparing a Frankfurt offer to a home-country salary, factor in: net salary after German taxes (not gross), rent (typically €1,200–2,200/month for a one-bedroom), mandatory health insurance, and the EUR value of any savings targets. Our tax calculator and currency converter together give you a useful starting picture.',
      },
      {
        heading: 'What are the best ways to move money internationally as an expat?',
        body: 'International wire transfers from regular banks typically carry 1–3% currency fees plus fixed fees per transfer. Specialist services like Wise (formerly TransferWise), Revolut, and similar platforms typically offer rates much closer to the ECB rate. The converter helps you see what you should expect to receive before choosing a transfer method.',
      },
      {
        heading: 'Does the EUR/GBP or EUR/USD rate affect Frankfurt expat daily life?',
        body: 'For ongoing day-to-day expenses once settled, currency rates matter less — your euro salary and euro expenses are aligned. Rates matter most for: one-time transfers when you arrive or leave, sending money home, international investments, and any home-country financial obligations (mortgage, pension, loan) still denominated in another currency.',
      },
    ],
    faqs: [
      {
        question: 'How often are the exchange rates updated?',
        answer: 'The converter uses ECB reference rates updated on each working day, typically around 16:00 CET. Weekend and holiday rates reflect the last available working day rate.',
      },
      {
        question: 'Which currencies does the converter support?',
        answer: 'All currencies published in the ECB\'s daily reference rate data — this includes USD, GBP, CHF, JPY, AUD, CAD, SEK, NOK, DKK, PLN, HUF, CZK, RON, and many others. The full list covers all major expat source currencies.',
      },
      {
        question: 'Can I use this converter for tax or accounting purposes?',
        answer: 'ECB rates are widely accepted as reference rates for accounting and reporting. However, for official tax purposes, confirm the specific rate source required by your tax advisor or the German Finanzamt.',
      },
    ],
    ctaHeading: 'Track your relocation budget in euros',
    ctaBody: 'Create a free account to build a full Frankfurt cost-of-living budget with rent, insurance, transport, and savings targets — all in euros.',
    relatedDirectory: { label: 'Find a financial advisor', path: '/directory/banking-financial-advisors-frankfurt' },
    relatedBlog: [
      { label: 'Open a German bank account in Frankfurt', slug: 'open-german-bank-account-frankfurt-expats' },
      { label: 'Frankfurt apartment search: first month', slug: 'frankfurt-apartment-search-first-month' },
    ],
  },

  {
    slug: 'qr-code-generator',
    toolId: 'qr',
    title: 'Free QR Code Generator | Frankfurt Expat Services',
    heading: 'Free QR Code Generator',
	    tagline: 'Generate a QR code for any URL, contact, or text in seconds with a free account.',
    metaDescription:
      'Free browser-based QR code generator for signed-in users. Create QR codes for URLs, contact cards, and text with no watermarks. Useful for Frankfurt expats sharing contact details and links.',
    icon: '📱',
    questions: [
      {
        heading: 'What can you use a QR code for as a Frankfurt expat?',
        body: 'Frankfurt\'s professional culture makes QR codes a practical tool for networking. Common uses include: sharing your professional contact details without handing over a paper card, linking to your LinkedIn profile at events, sharing your rental listing URL with apartment-hunting services, and linking to shared documents during bureaucratic processes.',
      },
      {
        heading: 'Are QR codes used widely in Germany?',
        body: 'Yes. QR codes are used across restaurants (menus), events (tickets), official documents (travel passes), and professional networking contexts. A QR code linking to your contact card is more reliable than exchanging phone numbers in noisy or rushed environments.',
      },
    ],
    faqs: [
      {
        question: 'Is the QR code generator really free with no watermarks?',
        answer: 'Yes. It is free after creating an account, and the generated QR code image contains no watermarks.',
      },
      {
        question: 'What formats can I download the QR code in?',
        answer: 'The generator produces a PNG image suitable for printing, digital sharing, and presentation use.',
      },
      {
        question: 'Are the QR codes generated here permanent?',
        answer: 'Yes, because the data is encoded directly in the QR code pattern itself — there is no hosted redirect link that could expire. The code will work as long as the destination URL remains live.',
      },
    ],
    ctaHeading: 'More free tools for Frankfurt expats',
	    ctaBody: 'Create a free account to try the German salary calculator, currency converter, QR generator, and checklist tools.',
    relatedDirectory: null,
    relatedBlog: [],
  },

  {
    slug: 'password-generator',
    toolId: 'password',
    title: 'Secure Password Generator | Frankfurt Expat Services',
    heading: 'Secure Password Generator',
    tagline: 'Generate strong, random passwords for your German accounts — Elster, bank, health insurance portal, and more.',
    metaDescription:
      'Free secure password generator. Create strong random passwords for German government portals, banking, and insurance accounts. Runs entirely in your browser — no data sent to servers.',
    icon: '🔐',
    questions: [
      {
        heading: 'Why do Frankfurt expats need strong passwords for German accounts?',
        body: 'Setting up in Germany involves registering with multiple official portals: ELSTER (tax), your Krankenkasse (health insurer) online portal, online banking, the Federal Employment Agency (Bundesagentur für Arbeit), and various city services. Using a unique strong password for each — and storing them in a password manager — significantly reduces your risk if any one portal is compromised.',
      },
      {
        heading: 'What makes a password strong for German government portals?',
        body: 'Most German portals accept passwords of 12–20 characters using a mix of uppercase, lowercase, numbers, and symbols. ELSTER in particular has specific character requirements. The generator here lets you configure length and character types to match any portal\'s rules.',
      },
    ],
    faqs: [
      {
        question: 'Is the password generator secure?',
        answer: 'Yes. All password generation happens in your browser using the Web Crypto API. No passwords are transmitted to our servers, logged, or stored anywhere outside your browser session.',
      },
      {
        question: 'Should I use a password manager with these passwords?',
        answer: 'Strongly recommended. A password manager like Bitwarden, 1Password, or Proton Pass stores your passwords securely and fills them in automatically. This is the most practical way to maintain unique strong passwords across the many German accounts expats need to create.',
      },
    ],
	    ctaHeading: 'All expat tools with a free account',
	    ctaBody: 'The salary calculator, currency converter, QR generator, and password generator are free after signup.',
    relatedDirectory: null,
    relatedBlog: [],
  },
];

export const getToolPageBySlug = (slug) =>
  toolLandingPages.find((t) => t.slug === slug) || null;
