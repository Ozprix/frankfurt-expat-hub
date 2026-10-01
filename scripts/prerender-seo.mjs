// Real prerendering: boot the built app, visit every sitemap route in headless
// Chrome, and save what actually rendered (title/meta/canonical come from each
// page's own <SEOHead> via react-helmet — no hand-maintained copy here).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const cleanPath = (pathname) => (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));

const sitemap = await readFile(path.join(root, 'public/sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/frankfurtexpatservices\.com([^<]*)<\/loc>/g)]
  .map((match) => cleanPath(match[1] || '/'));

const server = await preview({ root, preview: { port: 4173, strictPort: true } });
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, '');

// One page/tab reused across routes, visited one at a time: running several
// headless Chrome tabs concurrently made some pages' async data fetches (and
// the Helmet tag update that follows) finish late and get snapshotted early.
// 99 routes take ~2 minutes sequentially — fine for a once-per-deploy step.
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
let ok = 0;
const failed = [];

for (const route of routes) {
  try {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    // Helmet sets the canonical tag on every page; wait for it rather than a
    // blind delay, since render time varies per route.
    await page.waitForSelector('link[rel="canonical"]', { timeout: 20000 });
    const html = `<!doctype html>\n${await page.evaluate(() => document.documentElement.outerHTML)}`;
    const output = path.join(dist, route === '/' ? '' : route.slice(1), 'index.html');
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
    ok += 1;
  } catch (error) {
    failed.push(`${route} (${error.message})`);
  }
}

await browser.close();
await server.httpServer.close();

console.log(`Prerendered ${ok}/${routes.length} sitemap routes.`);
if (failed.length) {
  console.warn(`Skipped (kept SPA shell), check these:\n  ${failed.join('\n  ')}`);
}
