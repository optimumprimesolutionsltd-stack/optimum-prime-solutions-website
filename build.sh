#!/bin/bash
# If running on Vercel CI and dist/ already has prerendered content, skip vite build
if [ "$VERCEL" = "1" ] && grep -q "<main" dist/index.html 2>/dev/null; then
  echo "Pre-built SSG dist/ detected, skipping vite build"
  # Just copy public assets
  cp public/sitemap.xml dist/ 2>/dev/null
  cp public/robots.txt dist/ 2>/dev/null
  cp public/3fd67103052cd75b3b1146cf0670b20e.txt dist/ 2>/dev/null
  cp public/manifest.json dist/ 2>/dev/null
  echo "Pre-built SSG ready"
else
  # Local build
  npm run build
fi
