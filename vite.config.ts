import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // relative base so the build works on GitHub Pages / any subpath
  base: './',
  plugins: [react()],
  // MapLibre v6 ships an ES-module worker next to its main file and resolves it
  // via import.meta.url. Pre-bundling breaks that path, so keep it out.
  optimizeDeps: { exclude: ['maplibre-gl'] },
  // the MapLibre worker is an ES module; bundle it as one
  worker: { format: 'es' },
})
