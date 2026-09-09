#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { blogPosts } from '../src/data/blogPosts.js';
import { directoryCategories } from '../src/data/directoryCategories.js';
import { toolLandingPages } from '../src/data/toolLandingPages.js';
import { reviewedKnowledgePages } from '../src/data/knowledgeTopics.js';

const BASE_URL = 'https://frankfurtexpatservices.com';
const OUTPUT_DIR = path.join(process.cwd(), 'public');
const TODAY = new Date().toISOString().slice(0, 10);

const corePages = [
  {
    path: '/',
    title: 'Frankfurt Expat Services',
    description: 'Free Frankfurt relocation tools, checklists, guides, forum access, and curated English-speaking service providers.',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/frankfurt-first-30-days-checklist',
    title: 'Frankfurt First 30 Days Checklist',
    description: 'A practical first-month setup checklist for Anmeldung, tax ID, bank account, health insurance, housing, and everyday Frankfurt tasks.',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/directory',
    title: 'Frankfurt Expat Service Directory',
    description: 'Curated English-speaking tax, housing, banking, immigration, insurance, and healthcare providers for Frankfurt newcomers.',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/tools',
    title: 'Free Frankfurt Expat Tools',
    description: 'Free account tools for Frankfurt newcomers: tax calculator, currency converter, QR code generator, password generator, and checklist access.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/partners',
    title: 'Recommended Frankfurt Expat Partner Offers',
    description: 'Clearly labelled referral partner offers for banking and investing services that may help Frankfurt expats during setup.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/apartments',
    title: 'Frankfurt Apartment Finder',
    description: 'A housing search hub with original portal links, neighborhood notes, and scam checks without copying third-party listings.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/forum',
    title: 'Frankfurt Expat Forum',
    description: 'Public Frankfurt expat discussions with signup required to post or reply.',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/blog',
    title: 'Frankfurt Expat Guides',
    description: 'Practical relocation guides for Anmeldung, housing, tax, health insurance, banking, visa, and first-month setup.',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/answers',
    title: 'Verified Frankfurt Answers',
    description: 'Source-linked Frankfurt relocation answers with visible review dates and correction paths.',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/answers/methodology',
    title: 'How Frankfurt Answers Are Verified',
    description: 'Our sourcing, review dates, corrections process, and partner-independence standards for Frankfurt answer pages.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/pricing',
    title: 'Pricing',
    description: 'Free account access while Frankfurt Expat Services grows its tools, directory, forum, and guide library.',
    changefreq: 'monthly',
    priority: '0.4',
  },
  {
    path: '/faq',
    title: 'FAQ',
    description: 'Answers about free account tools, directory review, provider listings, data privacy, and Frankfurt newcomer support.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/about',
    title: 'About Frankfurt Expat Services',
    description: 'Why Frankfurt Expat Services exists and how it helps international residents settle with less confusion.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Contact Frankfurt Expat Services for provider submissions, feedback, corrections, and partnership questions.',
    changefreq: 'yearly',
    priority: '0.4',
  },
  {
    path: '/features',
    title: 'Features',
    description: 'Overview of Frankfurt Expat Services tools, forum, directory, apartment search hub, and dashboard features.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/tutorials',
    title: 'Frankfurt Expat Tutorials',
    description: 'Tutorial resources for Frankfurt bureaucracy, housing, health insurance, and relocation planning.',
    changefreq: 'monthly',
    priority: '0.5',
  },
];

const legalPages = [
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'Privacy information for Frankfurt Expat Services, including account data, cookies, processors, and user rights.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/terms',
    title: 'Terms',
    description: 'Terms for using Frankfurt Expat Services, including forum moderation and user-submitted content.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/imprint',
    title: 'Imprint',
    description: 'German legal notice for Frankfurt Expat Services.',
    changefreq: 'yearly',
    priority: '0.3',
  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(value) {
  return escapeXml(value);
}

function normalizePath(urlPath) {
  return urlPath === '/' ? '/' : `/${urlPath.replace(/^\/+|\/+$/g, '')}`;
}

function toAbsoluteUrl(urlPath) {
  const normalized = normalizePath(urlPath);
  return normalized === '/' ? `${BASE_URL}/` : `${BASE_URL}${normalized}`;
}

function getPublicPages() {
  const directoryPages = directoryCategories.map((category) => ({
    path: `/directory/${category.slug}`,
    title: category.heading || category.title,
    description: category.metaDescription || category.description,
    changefreq: 'weekly',
    priority: category.id === 'tax' || category.id === 'housing' || category.id === 'legal' ? '0.9' : '0.8',
  }));

  const toolPages = toolLandingPages.map((tool) => ({
    path: `/tools/${tool.slug}`,
    title: tool.heading || tool.title,
    description: tool.metaDescription || tool.tagline,
    changefreq: 'monthly',
    priority: tool.toolId === 'tax' ? '0.9' : '0.7',
  }));

  const blogPages = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    changefreq: 'monthly',
    priority: ['Bureaucracy', 'Housing', 'Tax', 'Healthcare', 'Visa', 'Banking'].includes(post.category) ? '0.8' : '0.7',
    lastmod: post.date,
  }));

  // A knowledge topic does not appear here until an editor has explicitly
  // reviewed it. This prevents the sitemap and llms.txt from promoting a
  // research backlog as authoritative public information.
  const answerPages = reviewedKnowledgePages.map((topic) => ({
    path: `/answers/${topic.id}`,
    title: topic.title,
    description: topic.description || `A source-linked Frankfurt answer about ${topic.title}.`,
    // sitemaps.org allows only a fixed set of changefreq values; a topic
    // cadence like 'quarterly' is invalid and Search Console rejects it.
    changefreq: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(topic.cadence)
      ? topic.cadence
      : 'monthly',
    priority: '0.8',
    lastmod: topic.lastVerified || TODAY,
    answer: topic,
  }));

  return [...corePages, ...directoryPages, ...toolPages, ...blogPages, ...answerPages, ...legalPages];
}

function writeLlmsTxt(pages) {
  const priorityGroups = [
    {
      heading: 'Core Pages',
      pages: pages.filter((page) => ['/', '/frankfurt-first-30-days-checklist', '/directory', '/tools', '/partners', '/blog', '/answers', '/forum', '/apartments'].includes(page.path)),
    },
    {
      heading: 'Directory Categories',
      pages: pages.filter((page) => page.path.startsWith('/directory/')),
    },
    {
      heading: 'Tool Landing Pages',
      pages: pages.filter((page) => page.path.startsWith('/tools/')),
    },
    {
      heading: 'Guides',
      pages: pages.filter((page) => page.path.startsWith('/blog/')),
    },
    {
      heading: 'Verified Frankfurt Answers',
      pages: pages.filter((page) => page.path.startsWith('/answers/')),
    },
    {
      heading: 'Legal',
      pages: pages.filter((page) => ['/privacy-policy', '/terms', '/imprint'].includes(page.path)),
    },
  ];

  const content = [
    '# Frankfurt Expat Services',
    '',
    'Frankfurt Expat Services helps international residents settle in Frankfurt with practical guides, free account tools, a curated provider directory, a public-read forum, and clearly labelled partner offers.',
    '',
    ...priorityGroups.flatMap((group) => [
      `## ${group.heading}`,
      ...group.pages.map((page) => `- [${page.title}](${toAbsoluteUrl(page.path)}): ${page.description}`),
      '',
    ]),
  ].join('\n');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'llms.txt'), content, 'utf8');
}

function writeAnswerPages(pages) {
  const answerPages = pages.filter((page) => page.answer);

  const styles = `
    :root { color: #172033; background: #f3f4ef; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    body { margin: 0; line-height: 1.65; }
    main { max-width: 760px; margin: 0 auto; padding: 48px 24px 72px; }
    a { color: #0f766e; } .eyebrow { color: #0f766e; font-size: .85rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { font-size: clamp(2rem, 6vw, 3.4rem); line-height: 1.05; margin: .5rem 0 1.25rem; } h2 { margin-top: 2.25rem; }
    .card { background: #fff; border: 1px solid #dbe1d8; border-radius: 16px; padding: 24px; margin: 20px 0; }
    .meta { color: #526071; font-size: .92rem; } .notice { border-left: 4px solid #d97706; background: #fffbeb; padding: 14px 16px; }
    .cta { display: inline-block; background: #0f766e; color: white; border-radius: 10px; font-weight: 800; padding: 12px 16px; text-decoration: none; }
  `;

  const indexItems = answerPages.map((page) => (
    `<li><a href="${escapeHtml(page.path)}">${escapeHtml(page.title)}</a><br><span>${escapeHtml(page.description)}</span></li>`
  )).join('');
  const libraryHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verified Frankfurt Answers | Frankfurt Expat Services</title><meta name="description" content="Source-linked, reviewed Frankfurt relocation answers."><link rel="canonical" href="${BASE_URL}/answers/"><style>${styles}</style></head>
<body><main><p class="eyebrow">Frankfurt Answer Library</p><h1>Verified Frankfurt answers</h1><p>Practical answers with official sources, a visible review date, and a correction path. These are general guides, not individual professional advice.</p><div class="card"><ul>${indexItems}</ul></div><p><a href="/answers/methodology">How we verify Frankfurt answers</a></p><p class="meta">Last library build: ${TODAY}. <a href="/contact">Report a correction</a>.</p></main></body></html>`;
  const libraryDirectory = path.join(OUTPUT_DIR, 'answers');
  fs.mkdirSync(libraryDirectory, { recursive: true });
  fs.writeFileSync(path.join(libraryDirectory, 'index.html'), libraryHtml, 'utf8');

  const methodologyDirectory = path.join(libraryDirectory, 'methodology');
  const methodologyHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>How Frankfurt Answers Are Verified | Frankfurt Expat Services</title><meta name="description" content="How Frankfurt Expat Services sources, reviews, corrects, and monetises its answer library."><link rel="canonical" href="${BASE_URL}/answers/methodology"><style>${styles}</style></head>
<body><main><p class="eyebrow"><a href="/answers/">Frankfurt Answer Library</a></p><h1>How we verify Frankfurt answers</h1><p>Frankfurt relocation information changes. We publish only source-linked answers that have a visible review date and a scheduled next review.</p>
<div class="card"><h2>Source order</h2><ol><li>Government offices, laws, and statutory sources.</li><li>Official forms, PDFs, and service portals.</li><li>Written provider confirmation, clearly labelled as such.</li><li>Dated community experience, never presented as an official rule.</li></ol></div>
<div class="card"><h2>What we publish</h2><p>Every answer must show its scope, official sources, last-verified date, and next review. Appointment availability, office hours, processing observations, and other volatile facts are reviewed more frequently.</p></div>
<div class="card"><h2>Corrections and commercial independence</h2><p>Readers can report an error through our contact page. Partner or referral relationships are labelled; payment does not change factual claims, editorial inclusion, or organic ordering.</p></div>
<div class="notice"><strong>Important:</strong> Our guides are general information, not individual legal, tax, insurance, or medical advice. Where a situation needs professional judgment, we say so.</div>
<p class="meta"><a href="/contact">Report a correction or source change</a>.</p></main></body></html>`;
  fs.mkdirSync(methodologyDirectory, { recursive: true });
  fs.writeFileSync(path.join(methodologyDirectory, 'index.html'), methodologyHtml, 'utf8');

  answerPages.forEach((page) => {
    const answer = page.answer;
    const directory = path.join(OUTPUT_DIR, 'answers', answer.id);
    const canonical = toAbsoluteUrl(page.path);
    const sourceLinks = (answer.sources || []).map((source) => (
      `<li><a href="${escapeHtml(source.url)}" rel="noopener noreferrer">${escapeHtml(source.title || source.url)}</a></li>`
    )).join('');
    const steps = (answer.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('');
    const documents = (answer.documents || []).map((document) => `<li>${escapeHtml(document)}</li>`).join('');
    const trackingPath = answer.cta
      ? `${answer.cta.path}${answer.cta.path.includes('?') ? '&' : '?'}source=answer_library&topic=${encodeURIComponent(answer.id)}&cta=${encodeURIComponent(answer.primaryCta || 'next_step')}`
      : null;
    const cta = answer.cta
      ? `<div class="card"><h2>Next step</h2><p>Use the related Frankfurt Expat Services resource when you are ready.</p><a class="cta" href="${escapeHtml(trackingPath)}">${escapeHtml(answer.cta.label)}</a></div>`
      : '';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: answer.title,
      description: page.description,
      url: canonical,
      dateModified: page.lastmod,
      author: { '@type': 'Organization', name: 'Frankfurt Expat Services' },
    };

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)} | Frankfurt Expat Services</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <link rel="canonical" href="${canonical}">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <style>${styles}</style>
  </head>
  <body>
    <main>
      <p class="eyebrow"><a href="/answers/">Frankfurt Answer Library</a></p>
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(answer.answer || page.description)}</p>
      <div class="notice"><strong>Scope:</strong> ${escapeHtml(answer.scope || 'General guidance; check the official source for your case.')}</div>
      <div class="card"><p class="meta"><strong>Last verified:</strong> ${escapeHtml(answer.lastVerified || page.lastmod)} &nbsp; <strong>Next review:</strong> ${escapeHtml(answer.nextReview || 'Scheduled editorial review')}</p></div>
      <h2>What to do</h2><ol>${steps}</ol>
      <h2>Documents and terms</h2><ul>${documents}</ul>
      ${cta}
      <h2>Official sources</h2>
      <ul>${sourceLinks}</ul>
      <p class="meta">This information is general guidance, not individual legal, tax, insurance, or medical advice. <a href="/contact">Report a correction</a>.</p>
    </main>
  </body>
</html>`;

    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'index.html'), html, 'utf8');
  });
}

function writeSitemap(pages) {
  const urlEntries = pages.map((page) => {
    const lastmod = page.lastmod || TODAY;
    return [
      '  <url>',
      `    <loc>${escapeXml(toAbsoluteUrl(page.path))}</loc>`,
      `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
      `    <changefreq>${escapeXml(page.changefreq)}</changefreq>`,
      `    <priority>${escapeXml(page.priority)}</priority>`,
      '  </url>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xml, 'utf8');
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const pages = getPublicPages();

  writeAnswerPages(pages);
  writeLlmsTxt(pages);
  writeSitemap(pages);

  console.log(`Generated llms.txt and sitemap.xml for ${pages.length} public pages.`);
}

main();
