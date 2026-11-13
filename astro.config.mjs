import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://exampath-lab.deepaksheoran172.workers.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
