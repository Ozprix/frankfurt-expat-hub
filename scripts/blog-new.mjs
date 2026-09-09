#!/usr/bin/env node
/**
 * blog-new.mjs — file a blog-post draft into src/data/blogPosts.js.
 *
 * No API key. Claude (in a Claude Code session, on your Pro plan) writes the
 * draft JSON; this script validates it and appends it in the exact shape the
 * site already uses. You then review the git diff and commit — merging to main
 * deploys via Netlify. Nothing publishes without you.
 *
 * Usage:
 *   node scripts/blog-new.mjs --file draft.json      # file a draft
 *   cat draft.json | node scripts/blog-new.mjs       # or from stdin
 *   node scripts/blog-new.mjs --schema               # print the draft schema
 *   node scripts/blog-new.mjs --selftest             # run internal checks
 *
 * Draft JSON shape (Claude fills this in):
 *   { title, description, category, imageAlt,
 *     sections: [{ heading, body }, ...4-6],
 *     links: [{ label, href }, ...2-3] }
 * Script fills the rest (slug, date, readingTime, imageUrl).
 *
 * ponytail: no CMS, no cron, no SDK, no key — just files the JSON you ship.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert';

const FILE = new URL('../src/data/blogPosts.js', import.meta.url);
const CATEGORIES = ['Bureaucracy', 'Housing', 'Banking', 'Tax', 'Healthcare', 'Insurance', 'Visa'];

// Reused, known-good hero images already live on the site — guarantees the post
// renders. ponytail: placeholder per category; swap for a bespoke shot in review.
const IMAGES = {
  Bureaucracy: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80',
  Housing:     'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
  Banking:     'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1400&q=80',
  Tax:         'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1400&q=80',
  Healthcare:  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=80',
  Insurance:   'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80',
  Visa:        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
};

// Internal link targets a draft may cite (anything else is dropped as unsafe).
const LINK_MENU = [
  '/frankfurt-first-30-days-checklist', '/apartments', '/cost-calculator',
  '/directory', '/forum', '/faq', '/how-it-works', '/pricing', '/contact',
];

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

const readingTime = (sections) => {
  const words = sections.reduce((n, s) => n + s.body.trim().split(/\s+/).length, 0);
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

const uniqueSlug = (base, src) => {
  let slug = base, i = 2;
  while (src.includes(`slug: '${slug}'`) || src.includes(`slug: "${slug}"`)) slug = `${base}-${i++}`;
  return slug;
};

// Insert a serialized post object as the new last element of the array.
const MARKER = '];\n\nexport const getBlogPostBySlug';
function insertPost(src, post) {
  assert(src.includes(MARKER), 'blogPosts.js: array-end marker not found');
  const body = JSON.stringify(post, null, 2).split('\n').map((l) => '  ' + l).join('\n');
  return src.replace(MARKER, `${body},\n${MARKER}`);
}

function validate(p) {
  for (const f of ['title', 'description', 'category', 'imageAlt', 'sections']) {
    if (!p[f]) throw new Error(`Draft missing field: ${f}`);
  }
  if (!CATEGORIES.includes(p.category)) throw new Error(`Bad category "${p.category}" — use one of ${CATEGORIES.join(', ')}`);
  if (!Array.isArray(p.sections) || p.sections.length < 3) throw new Error('Need at least 3 sections');
  for (const s of p.sections) if (!s.heading || !s.body) throw new Error('Each section needs heading + body');
}

function readDraft() {
  const fileArg = process.argv.indexOf('--file');
  const raw = fileArg !== -1
    ? readFileSync(process.argv[fileArg + 1], 'utf8')
    : readFileSync(0, 'utf8'); // stdin
  if (!raw.trim()) throw new Error('No draft JSON provided (use --file <path> or pipe via stdin)');
  return JSON.parse(raw);
}

function main() {
  const draft = readDraft();
  validate(draft);

  const src = readFileSync(FILE, 'utf8');
  const post = {
    slug: uniqueSlug(slugify(draft.title), src),
    title: draft.title,
    description: draft.description,
    category: draft.category,
    date: new Date().toISOString().slice(0, 10),
    readingTime: readingTime(draft.sections),
    imageUrl: IMAGES[draft.category],
    imageAlt: draft.imageAlt,
    sections: draft.sections,
    links: Array.isArray(draft.links) ? draft.links.filter((l) => LINK_MENU.includes(l.href)) : [],
  };

  writeFileSync(FILE, insertPost(src, post));
  console.log(`\n✓ Filed "${post.title}"  (/blog/${post.slug}, ${post.category}, ${post.readingTime})`);
  console.log('\nReview it:');
  console.log('  git diff src/data/blogPosts.js');
  console.log('  npm run lint -- --fix   # normalize quote style if needed');
  console.log('  npm run dev             # preview at /blog\n');
}

function schema() {
  console.log(JSON.stringify({
    title: 'string', description: 'string ~160 chars',
    category: `one of ${CATEGORIES.join(' | ')}`,
    imageAlt: 'string',
    sections: '[{ heading, body }] ×4-6, bodies 2-4 factual sentences',
    links: `[{ label, href }] ×2-3, href ∈ ${LINK_MENU.join(' , ')}`,
  }, null, 2));
}

function selftest() {
  assert.equal(slugify("Tax-ID: what's next?"), 'tax-id-what-s-next');
  assert.equal(readingTime([{ body: 'word '.repeat(400) }]), '2 min read');
  const src = "export const blogPosts = [\n  { slug: 'a' },\n];\n\nexport const getBlogPostBySlug = 1;\n";
  const out = insertPost(src, { slug: 'b' });
  assert.ok(out.includes('"slug": "b"') && out.indexOf("slug: 'a'") < out.indexOf('"slug": "b"'));
  assert.equal(uniqueSlug('a', src), 'a-2');
  assert.throws(() => validate({ title: 't', description: 'd', category: 'Nope', imageAlt: 'a', sections: [] }));
  console.log('selftest ok');
}

if (process.argv.includes('--selftest')) selftest();
else if (process.argv.includes('--schema')) schema();
else main();
