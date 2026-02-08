/**
 * Configuração centralizada da API
 *
 * Este arquivo centraliza todas as configurações relacionadas à URL da API,
 * facilitando manutenção e garantindo consistência em todo o projeto.
 */

/**
 * URL base da API
 *
 * Prioridade:
 * 1. Variável de ambiente VITE_API_URL (se definida)
 * 2. URL padrão de produção: https://api.dreamkeys.com.br
 */
// export const API_BASE_URL = 'http://localhost:3000';
export const API_BASE_URL = 'https://api.dreamkeys.com.br';

/**
 * Função helper para obter a URL completa de um endpoint
 * @param endpoint - Endpoint da API (ex: '/auth/login')
 * @returns URL completa (ex: 'https://api.dreamkeys.com.br/auth/login')
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove barra inicial se existir para evitar duplicação
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Remove barra final da base URL se existir
  const cleanBaseUrl = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

/**
 * Exporta também como constante para compatibilidade com código existente
 */
export default API_BASE_URL;
