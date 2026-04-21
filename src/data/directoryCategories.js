/**
 * directoryCategories.js
 * Single source of truth for all directory category data.
 * Used by DirectoryPage (overview) and DirectoryCategoryPage (individual landing pages).
 */

export const directoryCategories = [
  {
    id: 'tax',
    slug: 'tax-advisors-frankfurt',
    title: 'Tax & Accounting',
    pageTitle: 'English-Speaking Tax Advisors Frankfurt | Frankfurt Expat Services',
    heading: 'English-Speaking Tax Advisors in Frankfurt',
    tagline: 'Find vetted tax consultants who work with international employees, freelancers, and dual-filers.',
    metaDescription:
      'Find vetted English-speaking tax advisors and Steuerberater in Frankfurt for expats. Specialists in income tax returns, tax class advice, US/UK dual filing, and cross-border obligations.',
    color: 'text-[#0f766e] bg-[#ecfdf5]',
    borderColor: 'border-[#0f766e]',
    iconBg: 'bg-[#ecfdf5]',
    iconColor: 'text-[#0f766e]',
    status: 'Accepting applications',
    description:
      'English-speaking tax advisors for international employees, freelancers, and dual-filers navigating German and cross-border obligations.',
    longDescription:
      'German tax obligations are complex for international residents. Between tax classes, Steuererklärung deadlines, cross-border income, and employer payroll rules, most Frankfurt expats benefit from working with a qualified Steuerberater who speaks English and understands international situations. Our listed advisors have been verified for language proficiency, expat client experience, transparent pricing, and responsiveness.',
    features: ['German income tax returns', 'Expat tax class advice', 'US/UK dual-filer support', 'Annual Steuererklärung'],
    relatedTools: [{ label: 'German Tax Calculator', path: '/tools/german-tax-calculator-frankfurt' }],
    relatedBlog: [
      { label: 'German tax class basics for expats', slug: 'german-tax-class-frankfurt-expats' },
      { label: 'Freelancer tax basics in Frankfurt', slug: 'freelancer-tax-basics-frankfurt' },
    ],
    faqs: [
      {
        question: 'Do I need a Steuerberater as a Frankfurt expat?',
        answer:
          'Not always, but most expats with complex situations — cross-border income, multiple employers, freelance income, or US/UK tax obligations — benefit significantly from professional advice. A qualified Steuerberater typically recovers their fee through deductions and correct filing.',
      },
      {
        question: 'How does the German tax class system work for expats?',
        answer:
          'Germany uses six tax classes (Steuerklassen). Class 1 applies to most single employees; Class 3 and 5 apply to married couples. Your class affects monthly payroll deductions but not your total annual tax liability — the annual return (Steuererklärung) evens out any difference.',
      },
      {
        question: 'When is the German tax return deadline?',
        answer:
          'If you file yourself, the Steuererklärung deadline is typically July 31 of the following year. With a registered Steuerberater, the deadline extends to the end of February of the year after that.',
      },
      {
        question: 'Can Frankfurt tax advisors help with US expat filings?',
        answer:
          'Yes. Some advisors in our directory specialize in dual-filing for US citizens, including FBAR, FATCA reporting, and applying the US-Germany tax treaty to avoid double taxation.',
      },
      {
        question: 'What does a tax return consultation typically cost in Frankfurt?',
        answer:
          'Fees vary by complexity. Straightforward returns with one employer and no investments typically start around €150–350. Cross-border or investment returns can range from €350–800 or more. Many advisors offer a free initial call.',
      },
    ],
    schema: {
      serviceType: 'Tax Consulting',
      keywords: ['English speaking tax advisor Frankfurt', 'Steuerberater Frankfurt expat', 'German tax return expat', 'Frankfurt tax consultant English'],
    },
  },

  {
    id: 'housing',
    slug: 'housing-relocation-frankfurt',
    title: 'Housing & Relocation',
    pageTitle: 'Relocation Agents & Housing Help Frankfurt | Frankfurt Expat Services',
    heading: 'Relocation Agents & Housing Support in Frankfurt',
    tagline: 'Navigate Frankfurt\'s competitive rental market with specialists who work with international newcomers.',
    metaDescription:
      'Find English-speaking relocation agents and housing support services in Frankfurt. Specialists in apartment sourcing, Mietvertrag review, landlord negotiations, and temporary housing for expats.',
    color: 'text-[#c2410c] bg-[#fff7ed]',
    borderColor: 'border-[#c2410c]',
    iconBg: 'bg-[#fff7ed]',
    iconColor: 'text-[#c2410c]',
    status: 'Accepting applications',
    description:
      'Real estate agents, relocation managers, and temporary housing providers experienced with Frankfurt\'s competitive rental market.',
    longDescription:
      'Frankfurt\'s rental market is competitive and document-heavy. Landlords often require a full renter packet — Schufa, income proof, work contract, and sometimes a personal introduction letter. Relocation specialists know how to present international applicants effectively, can review Mietvertrag clauses in English, and often have access to listings before they go public. Our listed agents have experience working with corporate relocations, Blue Card holders, and individual movers.',
    features: ['Apartment sourcing', 'Landlord negotiations', 'Mietvertrag review', 'Short-term furnished stays'],
    relatedTools: [{ label: 'Frankfurt Apartment Finder', path: '/apartments' }],
    relatedBlog: [
      { label: 'Finding an apartment in your first month', slug: 'frankfurt-apartment-search-first-month' },
      { label: 'Frankfurt apartment viewing checklist', slug: 'frankfurt-apartment-viewing-checklist' },
      { label: 'Warm rent vs cold rent explained', slug: 'warm-rent-cold-rent-germany' },
    ],
    faqs: [
      {
        question: 'What documents do Frankfurt landlords typically require?',
        answer:
          'Most landlords ask for: Schufa credit report (or alternative), last three payslips, employment contract, passport copy, and sometimes a formal letter of intent. Corporate relocations may also require a company letter of guarantee.',
      },
      {
        question: 'What is the difference between warm rent and cold rent?',
        answer:
          'Cold rent (Kaltmiete) covers the base apartment cost only. Warm rent (Warmmiete) includes heating, water, and sometimes other shared building costs (Nebenkosten). Always confirm what is included before signing.',
      },
      {
        question: 'What is Schufa and do I need it as an expat?',
        answer:
          'Schufa is Germany\'s main credit reference system. As a new arrival, you won\'t have a German Schufa history. Relocation agents can help you present alternative creditworthiness proof — such as an employer letter or international bank statements.',
      },
      {
        question: 'How competitive is the Frankfurt rental market?',
        answer:
          'Frankfurt is one of Germany\'s most competitive rental cities. Popular apartments in Sachsenhausen, Nordend, and Westend can receive 50–100+ applications. Working with a relocation specialist gives you faster access and a stronger application.',
      },
      {
        question: 'What is a Wohnungsgeberbestätigung?',
        answer:
          'It\'s a landlord confirmation form required for your Anmeldung (residence registration). The landlord completes it after your lease is signed, confirming you live at the address. Without it, you cannot register your address.',
      },
    ],
    schema: {
      serviceType: 'Relocation Services',
      keywords: ['relocation agent Frankfurt expat', 'apartment finder Frankfurt English', 'Frankfurt housing help international', 'expat real estate Frankfurt'],
    },
  },

  {
    id: 'banking',
    slug: 'banking-financial-advisors-frankfurt',
    title: 'Banking & Financial Planning',
    pageTitle: 'Financial Advisors Frankfurt Expats | Frankfurt Expat Services',
    heading: 'Banking & Financial Advisors for Frankfurt Expats',
    tagline: 'Independent advisors for cross-border planning, pensions, investments, and Germany\'s banking landscape.',
    metaDescription:
      'Find English-speaking independent financial advisors in Frankfurt for expats. Specialists in cross-border pension planning, ETF investments, German bank account setup, and insurance gap analysis.',
    color: 'text-[#1d4ed8] bg-[#eff6ff]',
    borderColor: 'border-[#1d4ed8]',
    iconBg: 'bg-[#eff6ff]',
    iconColor: 'text-[#1d4ed8]',
    status: 'Accepting applications',
    description:
      'Independent financial advisors for cross-border pension planning, ETF investments, and navigating Germany\'s banking system as a newcomer.',
    longDescription:
      'Financial planning in Germany as an expat involves navigating pension portability, Riester and Rürup savings, investment account rules, and understanding how German banking differs from other countries. Independent advisors — rather than bank-tied advisors — give objective guidance on building long-term financial stability while managing cross-border complexity. Listed advisors have been verified for English proficiency, independence (not commission-only), and direct expat experience.',
    features: ['German bank account setup', 'Pension & retirement planning', 'Cross-border investments', 'Insurance gap analysis'],
    relatedTools: [
      { label: 'Partner banking offers', path: '/partners' },
      { label: 'German Tax Calculator', path: '/tools/german-tax-calculator-frankfurt' },
    ],
    relatedBlog: [
      { label: 'Open a German bank account as a Frankfurt expat', slug: 'open-german-bank-account-frankfurt-expats' },
      { label: 'Haftpflicht insurance explained', slug: 'haftpflicht-insurance-germany' },
      { label: 'Public vs private health insurance in Germany', slug: 'public-vs-private-health-insurance-germany' },
    ],
    faqs: [
      {
        question: 'Can I open a German bank account as a new expat?',
        answer:
          'Yes, though some banks require proof of address (Anmeldung) first. N26 and DKB offer online accounts that are easier to open before Anmeldung. Traditional banks like Deutsche Bank and Commerzbank offer expat-friendly services at most Frankfurt branches.',
      },
      {
        question: 'What happens to my home-country pension when I move to Germany?',
        answer:
          'This depends on your home country\'s pension rules and any bilateral social security agreement with Germany. Some contributions are portable; others need active decisions before or after moving. An independent advisor can review your specific situation.',
      },
      {
        question: 'Should I use a bank-employed advisor or an independent one?',
        answer:
          'Independent advisors (Honorarberater) typically charge a transparent fee rather than earning product commissions, which often leads to more objective advice. Our directory only lists fee-transparent advisors.',
      },
      {
        question: 'What is the best way to invest in Germany as an expat?',
        answer:
          'This varies by timeline, tax status, and home country. ETF-based investing via German brokers is common, but US citizens face PFIC restrictions. An advisor experienced with your specific situation is essential before making investment decisions.',
      },
    ],
    schema: {
      serviceType: 'Financial Planning',
      keywords: ['financial advisor Frankfurt expat English', 'independent financial advisor Frankfurt', 'cross-border pension Germany', 'expat banking Frankfurt'],
    },
  },

  {
    id: 'legal',
    slug: 'immigration-lawyers-frankfurt',
    title: 'Legal & Visa Support',
    pageTitle: 'Immigration Lawyers Frankfurt | Frankfurt Expat Services',
    heading: 'Immigration Lawyers & Visa Support in Frankfurt',
    tagline: 'Blue Card applications, family reunification, Niederlassungserlaubnis, and document legalisation in English.',
    metaDescription:
      'Find English-speaking immigration lawyers in Frankfurt for expats. Specialists in Blue Card applications, family reunification, Niederlassungserlaubnis, work permits, and document legalisation.',
    color: 'text-[#7c3aed] bg-[#f5f3ff]',
    borderColor: 'border-[#7c3aed]',
    iconBg: 'bg-[#f5f3ff]',
    iconColor: 'text-[#7c3aed]',
    status: 'Accepting applications',
    description:
      'Immigration lawyers and document specialists handling Blue Card applications, family reunification, and business visas.',
    longDescription:
      'German immigration law is detailed and deadline-sensitive. Whether you\'re applying for the EU Blue Card, bringing family members to Frankfurt, transitioning from a job-seeker visa, or working toward permanent residence, the paperwork and appointment timing matters. Listed legal specialists have experience with international client situations, communicate in English, and have a track record with Frankfurt\'s Ausländerbehörde.',
    features: ['Blue Card & work permits', 'Family reunification', 'Niederlassungserlaubnis', 'Document legalisation'],
    relatedTools: [],
    relatedBlog: [
      { label: 'EU Blue Card Frankfurt guide', slug: 'eu-blue-card-frankfurt-guide' },
      { label: 'Residence permit appointment preparation', slug: 'residence-permit-appointment-frankfurt' },
      { label: 'Family reunification basics', slug: 'family-reunification-germany-basics' },
    ],
    faqs: [
      {
        question: 'What is the EU Blue Card and who qualifies?',
        answer:
          'The EU Blue Card is a residence and work permit for highly qualified non-EU nationals. You need a German university-equivalent degree and a job offer meeting a minimum salary threshold (currently around €43,800–56,400/year depending on field). Frankfurt is one of Germany\'s primary Blue Card cities.',
      },
      {
        question: 'How long does a Blue Card application take in Frankfurt?',
        answer:
          'Most Blue Card applications at Frankfurt\'s Ausländerbehörde are processed in 4–12 weeks, depending on documentation completeness and appointment availability. An immigration lawyer can help reduce delays by ensuring your application is complete.',
      },
      {
        question: 'What is Niederlassungserlaubnis?',
        answer:
          'Niederlassungserlaubnis is Germany\'s permanent residence permit. After 33 months with a Blue Card (or 21 months if German B1 is demonstrated), you may apply. It is an important milestone for long-term expat stability.',
      },
      {
        question: 'Can immigration lawyers help with family reunification?',
        answer:
          'Yes. Bringing a spouse or children to Frankfurt involves separate visa applications, income proof, housing size requirements, and sometimes language requirements. A specialist can coordinate all applications and timelines.',
      },
      {
        question: 'Do I need a lawyer for my first visa or just renewals?',
        answer:
          'A lawyer is most valuable for first applications, complex situations, or when things go wrong. Straightforward renewals with unchanged circumstances are often manageable independently, but a consultation is worth the cost for peace of mind.',
      },
    ],
    schema: {
      serviceType: 'Immigration Law',
      keywords: ['immigration lawyer Frankfurt English', 'Blue Card application Frankfurt', 'Ausländerbehörde Frankfurt help', 'residence permit Frankfurt expat'],
    },
  },

  {
    id: 'insurance',
    slug: 'insurance-brokers-frankfurt',
    title: 'Insurance',
    pageTitle: 'Insurance Brokers Frankfurt Expats | Frankfurt Expat Services',
    heading: 'English-Speaking Insurance Brokers in Frankfurt',
    tagline: 'Brokers who explain health, liability, and household cover in plain English — and help you choose the right plan.',
    metaDescription:
      'Find English-speaking insurance brokers in Frankfurt for expats. Specialists in private vs statutory health insurance, Haftpflicht liability, Hausrat contents cover, and life insurance.',
    color: 'text-[#0891b2] bg-[#ecfeff]',
    borderColor: 'border-[#0891b2]',
    iconBg: 'bg-[#ecfeff]',
    iconColor: 'text-[#0891b2]',
    status: 'Active listings',
    description:
      'Brokers who explain German health insurance, liability, and household coverage in plain English — and help you pick the right plan.',
    longDescription:
      'German insurance is mandatory in several areas and strongly recommended in others. Health insurance is legally required for all residents. Haftpflicht (personal liability) is essential and inexpensive. Hausrat (household contents) protects belongings from theft and water damage. Many expats arrive without knowing what is required, what is optional, and what their employment contract already covers. Our listed brokers give independent advice in English across multiple insurance providers.',
    features: ['Private vs. statutory health', 'Haftpflicht (liability)', 'Hausrat (contents cover)', 'Life & disability'],
    relatedTools: [],
    relatedBlog: [
      { label: 'Public vs private health insurance in Germany', slug: 'public-vs-private-health-insurance-germany' },
      { label: 'Haftpflicht insurance explained', slug: 'haftpflicht-insurance-germany' },
    ],
    faqs: [
      {
        question: 'Is health insurance mandatory in Germany?',
        answer:
          'Yes. Everyone legally residing in Germany must have health insurance — either statutory (gesetzliche Krankenversicherung, GKV) or private (private Krankenversicherung, PKV). Choosing between them depends on income, employment type, and personal situation.',
      },
      {
        question: 'Should I choose public or private health insurance as an expat?',
        answer:
          'Public insurance (TK, AOK, Barmer etc.) is simpler to manage and covers dependents automatically. Private insurance offers potentially better coverage but is income-linked, has no dependent cover, and can become expensive with age or health changes. A broker can model both for your specific situation.',
      },
      {
        question: 'What is Haftpflicht and why do expats need it?',
        answer:
          'Haftpflicht is personal liability insurance. It covers damage you accidentally cause to other people or property — including neighbours\' flooding, borrowed items, or minor accidents. It costs around €3–8/month and is considered essential in Germany.',
      },
      {
        question: 'What does Hausrat insurance cover?',
        answer:
          'Hausrat covers your household contents against theft, fire, water damage, and storms. It is particularly important in cities like Frankfurt where break-ins and water leaks can be costly. Coverage typically costs €3–15/month depending on apartment size and coverage level.',
      },
      {
        question: 'Can my employer\'s insurance replace all individual policies?',
        answer:
          'Some employers include group health coverage or supplemental insurance, but they rarely cover all mandatory and recommended policies. Always check what your employment contract includes, then close the gaps with individual policies.',
      },
    ],
    schema: {
      serviceType: 'Insurance Brokerage',
      keywords: ['insurance broker Frankfurt English', 'Haftpflicht Frankfurt expat', 'health insurance broker Germany', 'private vs public health insurance Germany expat'],
    },
  },

  {
    id: 'healthcare',
    slug: 'english-speaking-doctors-frankfurt',
    title: 'Healthcare & Wellbeing',
    pageTitle: 'English-Speaking Doctors Frankfurt | Frankfurt Expat Services',
    heading: 'English-Speaking Doctors & Healthcare in Frankfurt',
    tagline: 'GPs, dentists, therapists, and specialists familiar with international patients and insurance billing.',
    metaDescription:
      'Find English-speaking GPs, dentists, therapists, and specialists in Frankfurt. Healthcare providers experienced with international patients, expat insurance, and multilingual consultations.',
    color: 'text-[#be185d] bg-[#fdf2f8]',
    borderColor: 'border-[#be185d]',
    iconBg: 'bg-[#fdf2f8]',
    iconColor: 'text-[#be185d]',
    status: 'Active listings',
    description:
      'English-speaking GPs, dentists, therapists, and specialists familiar with international patients and insurance billing.',
    longDescription:
      'Accessing healthcare in a foreign language adds stress to an already difficult experience. Frankfurt has a growing network of English-speaking doctors, dentists, and therapists — but they\'re not always easy to find. Our listed healthcare providers have confirmed English consultation capability, experience with both GKV and PKV billing, and a practice approach suited to international patients.',
    features: ['English-speaking GPs', 'Mental health support', 'Dentistry', 'Specialist referrals'],
    relatedTools: [],
    relatedBlog: [
      { label: 'Public vs private health insurance in Germany', slug: 'public-vs-private-health-insurance-germany' },
      { label: 'Mental health support for expats in Frankfurt', slug: 'mental-health-support-expats-frankfurt' },
      { label: 'How to use your health insurance card in Germany', slug: 'how-to-use-health-insurance-card-germany' },
    ],
    faqs: [
      {
        question: 'How do I find an English-speaking GP in Frankfurt?',
        answer:
          'Our directory lists GPs who have confirmed English consultation capability. You can also search the Kassenärztliche Vereinigung Hessen (KVH) doctor finder and filter by language. University Hospital Frankfurt (Universitätsklinikum Frankfurt) also has English-capable staff.',
      },
      {
        question: 'Do I need a referral to see a specialist in Germany?',
        answer:
          'For GKV (public insurance) patients, a GP referral (Überweisung) is usually needed to see a specialist and avoid an out-of-pocket Praxisgebühr. PKV patients can typically self-refer. Emergency cases always bypass this.',
      },
      {
        question: 'Can I access mental health support as an expat in Frankfurt?',
        answer:
          'Yes. Frankfurt has English-speaking therapists and counsellors experienced with expat transitions, culture adjustment, and international life challenges. Waiting times for GKV-covered therapy can be long; private therapy is more immediately accessible.',
      },
      {
        question: 'Is my home-country insurance valid for emergencies in Germany?',
        answer:
          'EU/EEA residents with a European Health Insurance Card (EHIC) can access emergency public healthcare. For non-EU nationals or longer stays, you need German statutory or private insurance.',
      },
      {
        question: 'How does dental care work in Germany?',
        answer:
          'Public insurance covers basic dental care including check-ups and simple fillings. More complex treatments (crowns, implants, advanced work) require either supplemental dental insurance or out-of-pocket payment. Private dentists in Frankfurt often have English-speaking staff and more flexible appointment availability.',
      },
    ],
    schema: {
      serviceType: 'Healthcare',
      keywords: ['English speaking doctor Frankfurt', 'GP Frankfurt expat', 'dentist Frankfurt English', 'therapist Frankfurt English speaking', 'mental health Frankfurt expat'],
    },
  },
];

/** Quick lookup: category slug → category object */
export const getCategoryBySlug = (slug) =>
  directoryCategories.find((c) => c.slug === slug) || null;

/** Quick lookup: category id → category object */
export const getCategoryById = (id) =>
  directoryCategories.find((c) => c.id === id) || null;
