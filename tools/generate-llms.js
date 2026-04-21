#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { blogPosts } from '../src/data/blogPosts.js';
import { directoryCategories } from '../src/data/directoryCategories.js';
import { toolLandingPages } from '../src/data/toolLandingPages.js';

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

  return [...corePages, ...directoryPages, ...toolPages, ...blogPages, ...legalPages];
}

function writeLlmsTxt(pages) {
  const priorityGroups = [
    {
      heading: 'Core Pages',
      pages: pages.filter((page) => ['/', '/frankfurt-first-30-days-checklist', '/directory', '/tools', '/partners', '/blog', '/forum', '/apartments'].includes(page.path)),
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
      ...group.pages.map((page) => `- [${page.title}](${page.path}): ${page.description}`),
      '',
    ]),
  ].join('\n');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'llms.txt'), content, 'utf8');
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

  writeLlmsTxt(pages);
  writeSitemap(pages);

  console.log(`Generated llms.txt and sitemap.xml for ${pages.length} public pages.`);
}

main();
