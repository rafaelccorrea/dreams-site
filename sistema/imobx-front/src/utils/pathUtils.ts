/**
 * Retorna o base URL com barra final, garantindo formato correto
 */
export const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Se não terminar com / e não for vazio, adicionar /
  if (baseUrl && !baseUrl.endsWith('/')) {
    return `${baseUrl}/`;
  }
  return baseUrl || '/';
};

/**
 * Retorna o base path sem barra final (ex: '/sistema' ou '')
 */
export const getBasePath = (): string => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remover barra final se existir
  if (baseUrl === '/') return '';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

/**
 * Constrói um caminho de asset usando o base URL
 * @param path - Caminho do asset (ex: 'logo.png' ou '/logo.png')
 * @returns Caminho completo com base URL
 */
export const getAssetPath = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Remover barra inicial do path se existir para evitar duplicação
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Constrói uma URL completa para navegação considerando o base path
 * @param path - Caminho da rota (ex: '/dashboard' ou '/login')
 * @returns URL completa com base path (ex: '/sistema/dashboard')
 */
export const getNavigationUrl = (path: string): string => {
  const basePath = getBasePath();
  // Garantir que o path comece com /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return basePath ? `${basePath}${cleanPath}` : cleanPath;
};
