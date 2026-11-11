import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const marker = 'data-fes-ga-loader';
const loader = `<script ${marker}>
(() => {
  const id = 'G-1V4T4RGBME';
  let active = false;
  const consent = () => { try { return JSON.parse(localStorage.getItem('fes_cookie_consent'))?.analytics === true; } catch { return false; } };
  const removeCookies = () => ['_ga', '_ga_1V4T4RGBME'].forEach((name) => ['', '; domain=' + location.hostname, '; domain=.' + location.hostname].forEach((scope) => { document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + scope; }));
  const pageView = () => window.gtag?.('event', 'page_view', { page_location: location.href, page_path: location.pathname + location.search, page_title: document.title, send_to: id });
  const sync = () => {
    if (!consent()) { window['ga-disable-' + id] = true; if (active) removeCookies(); active = false; return; }
    if (active) return;
    active = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
    if (!document.getElementById('fes-ga-script')) { const script = document.createElement('script'); script.id = 'fes-ga-script'; script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id; document.head.appendChild(script); }
    pageView();
  };
  const wrap = (method) => { const original = history[method]; history[method] = function () { const result = original.apply(this, arguments); pageView(); return result; }; };
  wrap('pushState'); wrap('replaceState'); addEventListener('popstate', pageView); sync(); setInterval(sync, 1000);
})();
</script>`;

const htmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? htmlFiles(path.join(directory, entry.name))
    : entry.name.endsWith('.html') ? [path.join(directory, entry.name)] : []));
  return nested.flat();
};

const files = await htmlFiles(dist);
await Promise.all(files.map(async (file) => {
  const html = await readFile(file, 'utf8');
  if (html.includes(marker)) return;
  await writeFile(file, html.replace('</head>', `${loader}\n</head>`));
}));
console.log(`Added the consent-gated GA loader to ${files.length} HTML files.`);
