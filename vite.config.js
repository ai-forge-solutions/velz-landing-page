import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readFileSync, existsSync, statSync } from "node:fs";

// Vite's SPA fallback otherwise serves the landing at extensionless MPA URLs.
// Only these exact public documents are rewritten, in local dev/preview only.
function guideDocuments(server, preview = false) {
  const routes = new Set([
    "/guias",
    "/guias/datos-marketing-mix-modeling",
    "/guias/atribucion-mmm-experimentos",
    "/guias/interpretar-resultados-mmm",
    "/guias/test-incrementalidad-geo-lift-holdout",
    "/guias/meridian-vs-robyn-vs-pymc-marketing",
    "/guias/proveedor-marketing-mix-modeling-precio",
    "/guias/rentabilidad-promociones-descuentos-ecommerce",
  ]);
  const documents = new Set([...routes].map(route => `${route}/index.html`));
  const toolSlugs = ["stockout-leak-score", "discount-depth-analyzer"];
  const toolHomes = new Set(toolSlugs.map(slug => `/tools/${slug}`));
  const privateTools = /^\/tools\/(stockout-leak-score|discount-depth-analyzer)\/[^/]+\/?$/;
  server.middlewares.use((req, res, next) => {
    const url = new URL(req.url, "http://localhost");
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(url.pathname);
    } catch {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex");
      const root = preview ? path.resolve(server.config.root, server.config.build.outDir) : server.config.root;
      res.end(readFileSync(path.resolve(root, "404.html")));
      return;
    }
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
    else if (toolHomes.has(route.replace(/\/index.html$/, ""))) req.url = `${route.replace(/\/index.html$/, "")}/index.html${url.search}`;
    else if (privateTools.test(url.pathname)) req.url = `/diagnostico.html${url.search}`;
    else {
      const root = preview ? path.resolve(server.config.root, server.config.build.outDir) : server.config.root;
      const file = path.resolve(root, `.${decodedPath}`);
      const publicFile = path.resolve(server.config.publicDir, `.${decodedPath}`);
      const internal = !preview && /^(\/@|\/src\/|\/node_modules\/)/.test(url.pathname);
      const allowed = ["/", "/index.html", "/aviso-legal", "/privacidad"].includes(url.pathname)
        || internal || (file.startsWith(root + path.sep) && existsSync(file) && statSync(file).isFile())
        || (!preview && publicFile.startsWith(server.config.publicDir + path.sep) && existsSync(publicFile) && statSync(publicFile).isFile());
      if (!allowed && !url.pathname.startsWith('/api/')) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-Robots-Tag", "noindex");
        res.end(readFileSync(path.resolve(root, "404.html")));
        return;
      }
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
        notFound: path.resolve(__dirname, "404.html"),
        stockoutTool: path.resolve(__dirname, "tools/stockout-leak-score/index.html"),
        discountTool: path.resolve(__dirname, "tools/discount-depth-analyzer/index.html"),
        privateDiagnostic: path.resolve(__dirname, "diagnostico.html"),
        guides: path.resolve(__dirname, "guias/index.html"),
        mmmGuide: path.resolve(__dirname, "guias/datos-marketing-mix-modeling/index.html"),
        attributionGuide: path.resolve(__dirname, "guias/atribucion-mmm-experimentos/index.html"),
        resultsGuide: path.resolve(__dirname, "guias/interpretar-resultados-mmm/index.html"),
        w46Guide0: path.resolve(__dirname, "guias/test-incrementalidad-geo-lift-holdout/index.html"),
        w46Guide1: path.resolve(__dirname, "guias/meridian-vs-robyn-vs-pymc-marketing/index.html"),
        w46Guide2: path.resolve(__dirname, "guias/proveedor-marketing-mix-modeling-precio/index.html"),
        w46Guide3: path.resolve(__dirname, "guias/rentabilidad-promociones-descuentos-ecommerce/index.html"),
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
