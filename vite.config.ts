import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Removed viteSingleFile() to allow proper multi-page SSG output
    // prerender.mjs will generate individual HTML files per route after build
  ],
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
    chunkSizeWarningLimit: 600,
    // Optimize images and assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    // Disable single file output - we need separate files for SSG
    rollupOptions: {
      output: {
        // Split vendor libraries into separate cacheable chunks.
        // react + react-dom + scheduler must be in the SAME chunk to avoid circular dependency.
        manualChunks(id) {
          // Firebase — all subpackages (firebase/app, firebase/auth, firebase/database, etc.)
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) return 'vendor-firebase';
          if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
          // React core, DOM, and scheduler together to avoid circular chunk warning
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) return 'vendor-react';
          if (id.includes('node_modules/react-router')) return 'vendor-router';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          // Markdown stack — only needed on blog post pages (lazy loaded)
          if (
            id.includes('node_modules/react-markdown') ||
            id.includes('node_modules/remark') ||
            id.includes('node_modules/rehype') ||
            id.includes('node_modules/unified') ||
            id.includes('node_modules/micromark') ||
            id.includes('node_modules/mdast') ||
            id.includes('node_modules/hast') ||
            id.includes('node_modules/vfile') ||
            id.includes('node_modules/unist')
          ) return 'vendor-markdown';
          if (id.includes('node_modules')) return 'vendor-misc';
        },
      },
    },
  },
});
