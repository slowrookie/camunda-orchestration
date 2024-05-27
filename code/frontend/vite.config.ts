import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  // resolve: {
  //   alias: {
  //     'react': 'preact/compat',
  //     'react-dom': 'preact/compat',
  //   },
  // },
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '')
      }
    }
  }
})
