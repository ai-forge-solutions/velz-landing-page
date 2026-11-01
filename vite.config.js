import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readFileSync } from "node:fs";

// Vite's SPA fallback otherwise serves the landing at extensionless MPA URLs.
// Only these exact public documents are rewritten, in local dev/preview only.
function guideDocuments(server, preview = false) {
  const routes = new Set([
    "/guias",
    "/guias/datos-marketing-mix-modeling",
    "/guias/atribucion-mmm-experimentos",
    "/guias/interpretar-resultados-mmm",
  ]);
  const documents = new Set([...routes].map(route => `${route}/index.html`));
  server.middlewares.use((req, res, next) => {
    const url = new URL(req.url, "http://localhost");
    const route = url.pathname.replace(/\/$/, "");
    if (routes.has(route)) req.url = `${route}/index.html${url.search}`;
    else if (url.pathname.startsWith("/guias/") && !documents.has(url.pathname)
      && !["/guias/guides.css", "/guias/404.html"].includes(url.pathname)) {
      const root = preview ? path.resolve(server.config.root, server.config.build.outDir) : server.config.root;
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(readFileSync(path.resolve(root, "guias/404.html")));
      return;
    }
    next();
  });
}

export default defineConfig({
  plugins: [react(), {
    name: "guide-documents",
    configureServer: guideDocuments,
    configurePreviewServer: server => guideDocuments(server, true),
  }],
  build: {
    target: "es2018",
    // Static guide documents: no guide code or CSS enters the landing bundle.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        guides: path.resolve(__dirname, "guias/index.html"),
        mmmGuide: path.resolve(__dirname, "guias/datos-marketing-mix-modeling/index.html"),
        attributionGuide: path.resolve(__dirname, "guias/atribucion-mmm-experimentos/index.html"),
        resultsGuide: path.resolve(__dirname, "guias/interpretar-resultados-mmm/index.html"),
        guidesNotFound: path.resolve(__dirname, "guias/404.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
