import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import setupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: 'src/auto-import.d.ts',
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      resolvers: [
        ElementPlusResolver()
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver()
      ]
    }),
    setupExtend()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      components: resolve(__dirname, 'src/components')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
  },
  server: {
    port: 13012,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:13011',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  }
})
