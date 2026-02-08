import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ============================================
// CONFIGURAÇÃO DE BASE PATH
// ============================================
// Para subpasta: '/sistema' (ex: dreamkeys.com.br/sistema)
// Para raiz/subdomínio: '' (deixe vazio)
// ============================================
const BASE_PATH = '/sistema' // 👈 ALTERE AQUI conforme necessário

// Plugin para substituir %BASE_URL% no HTML
const baseUrlPlugin = () => {
  // Garantir que BASE_PATH tenha barra final se não for vazio
  const baseUrl = BASE_PATH && !BASE_PATH.endsWith('/') ? `${BASE_PATH}/` : BASE_PATH || '/'
  return {
    name: 'base-url-replace',
    transformIndexHtml(html: string) {
      return html.replace(/%BASE_URL%/g, baseUrl)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), baseUrlPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'styled-components']
  },
  server: {
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    emptyOutDir: true, // Limpar diretório de saída antes do build
    sourcemap: false, // Desabilitar sourcemap em produção para melhor performance
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries em chunks separados
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // Chart.js - usando registro manual em vez de chart.js/auto para evitar
          // problemas de ordem de carregamento com code splitting
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['styled-components', 'react-icons'],
          utils: ['date-fns', 'react-toastify']
        }
      }
    },
    // Otimizações de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log em produção
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'styled-components',
      'react-icons',
      'date-fns',
      'chart.js',
      'react-chartjs-2'
    ],
    exclude: []
  }
})
