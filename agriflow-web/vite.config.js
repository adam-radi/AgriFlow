import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const reactAriaSSR = path.resolve(process.cwd(), 'node_modules/react-aria/dist/exports/SSRProvider.js')
const reactAriaPrivateSSR = path.resolve(process.cwd(), 'node_modules/react-aria/dist/exports/private/ssr/SSRProvider.js')

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-redux', 'react-router-dom'],
    alias: [
      { find: 'react-aria/SSRProvider', replacement: reactAriaSSR },
      { find: 'react-aria/private/ssr/SSRProvider', replacement: reactAriaPrivateSSR },
    ],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux', 'react-bootstrap'],
  },
})
