import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  preview: {
    cors: true,
    https: {
      key: './localhost.key',
      cert: './localhost.cert'
    },
  },
  plugins: [react(), basicSsl()],
})
