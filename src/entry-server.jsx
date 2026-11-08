import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
export { getPageConfig } from './App';

const staticPaths = new Set(['/', '/privacidad', '/aviso-legal']);

// Never render tool/token routes or silently turn unknown paths into the homepage.
export function render(pathname = '/') {
  if (!staticPaths.has(pathname)) throw new Error(`Unsupported SSR pathname (outside allowlist): ${pathname}`);
  return renderToString(<React.StrictMode><App initialPathname={pathname} /></React.StrictMode>);
}
