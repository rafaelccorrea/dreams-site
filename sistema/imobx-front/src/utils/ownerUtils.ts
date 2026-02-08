/**
 * Utilitários para verificação e manipulação do campo owner
 * Campo owner identifica o proprietário real da empresa (cadastrado por fora)
 */

/**
 * Verifica se o usuário é proprietário via token JWT
 * @param token - Token JWT do usuário
 * @returns boolean - true se for proprietário, false caso contrário
 */
export function isOwnerFromToken(token: string): boolean {
  try {
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.owner === true;
  } catch (error) {
    console.error('Erro ao decodificar token para verificar owner:', error);
    return false;
  }
}

/**
 * Verifica se o usuário é proprietário via objeto de usuário
 * @param user - Objeto do usuário
 * @returns boolean - true se for proprietário, false caso contrário
 */
export function isOwnerFromUser(user: any): boolean {
  return user && user.owner === true;
}

/**
 * Verifica se o usuário é proprietário via resposta da API
 * @param response - Resposta da API de autenticação
 * @returns boolean - true se for proprietário, false caso contrário
 */
export function isOwnerFromResponse(response: any): boolean {
  return response && response.user && response.user.owner === true;
}

/**
 * Extrai informações do proprietário do token JWT
 * @param token - Token JWT do usuário
 * @returns objeto com informações do proprietário ou null
 */
export function getOwnerInfoFromToken(
  token: string
): { owner: boolean; role: string } | null {
  try {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      owner: payload.owner === true,
      role: payload.role || 'USER',
    };
  } catch (error) {
    console.error(
      'Erro ao extrair informações do proprietário do token:',
      error
    );
    return null;
  }
}

/**
 * Valida se o campo owner está presente e é válido
 * @param owner - Valor do campo owner
 * @returns boolean - true se válido, false caso contrário
 */
export function isValidOwnerField(owner: any): boolean {
  return typeof owner === 'boolean';
}

/**
 * Retorna o label apropriado para o tipo de usuário
 * @param owner - Valor do campo owner
 * @returns string - Label do tipo de usuário
 */
export function getOwnerLabel(owner: boolean): string {
  return owner ? 'Proprietário Real' : 'Administrador';
}

/**
 * Retorna o ícone apropriado para o tipo de usuário
 * @param owner - Valor do campo owner
 * @returns string - Ícone do tipo de usuário
 */
export function getOwnerIcon(owner: boolean): string {
  return owner ? '👑' : '👤';
}

/**
 * Retorna a cor apropriada para o tipo de usuário
 * @param owner - Valor do campo owner
 * @returns string - Cor do tipo de usuário
 */
export function getOwnerColor(owner: boolean): string {
  return owner ? '#FFD700' : '#6B7280'; // Dourado para proprietário, cinza para admin
}

/**
 * Constantes relacionadas ao campo owner
 */
export const OWNER_CONSTANTS = {
  ROLES: {
    OWNER: 'owner',
    ADMIN: 'admin',
  },
  LABELS: {
    true: 'Proprietário Real',
    false: 'Administrador',
  },
  ICONS: {
    true: '👑',
    false: '👤',
  },
  COLORS: {
    true: '#FFD700',
    false: '#6B7280',
  },
} as const;
