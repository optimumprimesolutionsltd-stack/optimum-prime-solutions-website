import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers middleware
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Caching headers for static assets
const cachingHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable', // 1 year for hashed assets
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    headers: securityHeaders,
  },
  preview: {
    headers: securityHeaders,
  },
  build: {
    // Minify in production with esbuild (default and fast)
    minify: 'esbuild',
    // Enable source maps in production for error tracking
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Optimize images and assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
});
