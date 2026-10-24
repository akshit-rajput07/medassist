import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The service worker precaches every built file (JS, CSS, HTML, icons), so after the
// first visit MedAssist loads and runs with no network at all.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'MedAssist: Offline Symptom Checker',
        short_name: 'MedAssist',
        description: 'Offline-first symptom checker that sorts symptoms into emergency, see-a-doctor or self-care guidance.',
        lang: 'en-IN',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#0d5c54',
        background_color: '#f1f4f2',
        categories: ['medical', 'health'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
