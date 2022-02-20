import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
import icons from './icons.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'WordleTR',
        short_name: 'WordleTR',
        description: 'Endless Turkish Wordle Game',
        background_color: '#282c34',
        icons: icons,
        lang: 'tr-TR',
        orientation: 'portrait',
        theme_color: '#282c34',
        display: 'fullscreen'
      },
    })
  ]
})
