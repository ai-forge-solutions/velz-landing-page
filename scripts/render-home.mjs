import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const start = '<!--velz-home-ssr:start-->';
const end = '<!--velz-home-ssr:end-->';

const legalPaths = ['/privacidad', '/aviso-legal'];
const escapeAttribute = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function legalShell(shell, page) {
  // Keep built asset links and shared branding, not homepage-specific SEO claims.
  const metadata = [
    ['name', 'description', page.description],
    ['property', 'og:title', page.title],
    ['property', 'og:description', page.description],
    ['property', 'og:url', page.canonical],
    ['name', 'twitter:title', page.title],
    ['name', 'twitter:description', page.description],
  ];
  let html = shell.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, () => `<title>${escapeAttribute(page.title)}</title>`)
    .replace(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  for (const [attribute, key, value] of metadata) {
    const tag = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${key}["'][^>]*>`, 'gi');
    html = html.replace(tag, () => `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`);
  }
  return html.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi,
    () => `<link rel="canonical" href="${escapeAttribute(page.canonical)}" />`);
}

/** Render only the homepage and two exact legal documents, never tool/token paths. */
export async function renderHome({ root = projectRoot, outDir = path.join(root, 'dist'), mode = 'production' } = {}) {
  const index = path.join(outDir, 'index.html');
  const shell = await readFile(index, 'utf8');
  const slot = /(<div\b[^>]*\bid=["']root["'][^>]*>)(\s*|<!--velz-home-ssr:start-->[\s\S]*?<!--velz-home-ssr:end-->)(<\/div>)/g;
  if ([...shell.matchAll(slot)].length !== 1) {
    throw new Error('Home SSR requires exactly one empty #root (or previously rendered home) in the built index.html.');
  }
  const cache = path.join(root, 'node_modules/.cache');
  await mkdir(cache, { recursive: true });
  const temporary = await mkdtemp(path.join(cache, 'home-ssr-'));
  try {
    const entry = path.join(root, 'src/entry-server.jsx');
    await build({
      root,
      mode,
      logLevel: 'warn',
      publicDir: false,
      plugins: [{
        name: 'home-ssr-required-form-id',
        configResolved(config) {
          if (!config.env.VITE_FORMSPREE_FORM_ID?.trim()) {
            throw new Error('Home SSR requires VITE_FORMSPREE_FORM_ID. Set the same real form ID used by the client build.');
          }
        },
      }],
      build: {
        ssr: entry,
        outDir: temporary,
        emptyOutDir: true,
        copyPublicDir: false,
        manifest: false,
        ssrManifest: false,
        sourcemap: false,
        // Explicitly replace the client MPA inputs, never inherit HTML entries.
        rollupOptions: { input: entry, output: { format: 'es', entryFileNames: 'entry-server.mjs' } },
      },
    });
    const { render, getPageConfig } = await import(pathToFileURL(path.join(temporary, 'entry-server.mjs')).href);
    const documents = ['/', ...legalPaths].map(pathname => {
      const markup = render(pathname);
      if (!markup || !/<h1\b/.test(markup)) throw new Error(`SSR produced no heading for ${pathname}.`);
      const documentShell = pathname === '/' ? shell : legalShell(shell, getPageConfig(pathname));
      // A replacer function keeps literal dollar sequences in React output intact.
      const html = documentShell.replace(slot, (_match, open, _old, close) => `${open}${start}${markup}${end}${close}`);
      const file = pathname === '/' ? index : path.join(outDir, `${pathname.slice(1)}.html`);
      return { pathname, file, html, markupBytes: Buffer.byteLength(markup) };
    });
    for (const document of documents) await writeFile(document.file, document.html);
    return { file: index, markupBytes: documents[0].markupBytes,
      legal: documents.slice(1).map(({ pathname, file, markupBytes }) => ({ pathname, file, markupBytes })) };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  renderHome().then(({ markupBytes, legal }) => {
    console.log(`Home SSR: rendered / (${markupBytes} bytes); existing head and client assets preserved. Legal SSR: ${legal.map(page => page.pathname).join(', ')}.`);
  }).catch(error => {
    console.error('Home SSR failed:', error);
    process.exitCode = 1;
  });
}
