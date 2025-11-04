/**
 * Configurações da aplicação
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Site Geral',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 30000,
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
  dateFormat: {
    display: 'DD/MM/YYYY',
    api: 'YYYY-MM-DD',
  },
  currency: {
    locale: 'pt-BR',
    currency: 'BRL',
  },
} as const

// Validação de variáveis de ambiente obrigatórias em produção
if (import.meta.env.PROD) {
  const requiredEnvVars: string[] = []
  
  requiredEnvVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
      throw new Error(`Variável de ambiente obrigatória não definida: ${varName}`)
    }
  })
}



