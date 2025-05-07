import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/report': {
        target: 'http://localhost:3303/api/report',
        changeOrigin: true,
        rewriteWsOrigin: true,
        rewrite: (path)=> path.replace(/\/api\/report/,'')
      },
      '/api/manage': {
        target: 'http://localhost:3302/api/manage',
        changeOrigin: true,
        rewriteWsOrigin: true,
        rewrite: (path)=> path.replace(/\/api\/manage/,'')
      },
    }
  },
  plugins: [react(), basicSsl()],
})
