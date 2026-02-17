import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-Process 진입점
        entry: 'electron/main.ts',
      },
      {
        // Preload-Scripts 진입점
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload() // Preload 스크립트 변경 시 리로드
        },
      },
    ]),
    renderer(),
  ],
})