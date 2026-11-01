import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite's SPA fallback otherwise serves the landing at extensionless MPA URLs.
// Only these exact public documents are rewritten, in local dev/preview only.
function guideDocuments(server) {
  const routes = new Set(["/guias", "/guias/datos-marketing-mix-modeling"]);
  server.middlewares.use((req, _res, next) => {
    const url = new URL(req.url, "http://localhost");
    if (routes.has(url.pathname)) req.url = `${url.pathname}/index.html${url.search}`;
    next();
  });
}

export default defineConfig({
  plugins: [react(), {
    name: "guide-documents",
    configureServer: guideDocuments,
    configurePreviewServer: guideDocuments,
  }],
  build: {
    target: "es2018",
    // Static guide documents: no guide code or CSS enters the landing bundle.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        guides: path.resolve(__dirname, "guias/index.html"),
        mmmGuide: path.resolve(__dirname, "guias/datos-marketing-mix-modeling/index.html"),
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
