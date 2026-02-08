import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  companyId?: string;
  iat: number;
  exp: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  document: string;
  avatar: string | null;
  phone: string | null;
  role: string;
  owner?: boolean;
  companyId?: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserData;
}

class AuthStorageService {
  private readonly TOKEN_KEY = 'dream_keys_access_token';
  private readonly REFRESH_TOKEN_KEY = 'dream_keys_refresh_token';
  private readonly USER_KEY = 'dream_keys_user_data';
  private readonly REMEMBER_KEY = 'dream_keys_remember_me';
  private readonly SAVED_EMAIL_KEY = 'dream_keys_saved_email'; // Novo: email salvo para "lembrar de mim"

  // Salvar dados de autenticação
  saveAuthData(authData: AuthResponse, rememberMe: boolean = false): void {
    try {
      // Decodificar o token para obter informações do usuário
      const decodedToken = jwtDecode<DecodedToken>(authData.access_token);

      // Salvar preferência "Lembrar de mim" primeiro
      localStorage.setItem(this.REMEMBER_KEY, rememberMe.toString());

      if (rememberMe) {
        // Se "Lembrar de mim" está ativado, usar localStorage (persistente)
        localStorage.setItem(this.TOKEN_KEY, authData.access_token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refresh_token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
        // Salvar email separadamente para recuperar após logout
        localStorage.setItem(this.SAVED_EMAIL_KEY, authData.user.email);
      } else {
        // Se "Lembrar de mim" está desativado, usar sessionStorage (temporário)
        sessionStorage.setItem(this.TOKEN_KEY, authData.access_token);
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refresh_token);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
        // Remover email salvo se desativar "lembrar de mim"
        localStorage.removeItem(this.SAVED_EMAIL_KEY);
      }

      // Disparar evento para notificar que os dados foram salvos
      window.dispatchEvent(new CustomEvent('localStorageChange'));
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error);
    }
  }

  // Obter token
  getToken(): string | null {
    // Primeiro tenta localStorage, depois sessionStorage
    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  // Obter refresh token
  getRefreshToken(): string | null {
    // Primeiro tenta localStorage, depois sessionStorage
    return (
      localStorage.getItem(this.REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
    );
  }

  // Obter dados do usuário
  getUserData(): UserData | null {
    try {
      // Primeiro tenta localStorage, depois sessionStorage
      const userData =
        localStorage.getItem(this.USER_KEY) ||
        sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  // Verificar se deve lembrar do usuário
  shouldRememberUser(): boolean {
    return localStorage.getItem(this.REMEMBER_KEY) === 'true';
  }

  // Obter estado inicial do checkbox "Lembrar de mim"
  getRememberMeState(): boolean {
    return this.shouldRememberUser();
  }

  // Obter email salvo (para "lembrar de mim")
  getSavedEmail(): string {
    return localStorage.getItem(this.SAVED_EMAIL_KEY) || '';
  }

  // Verificar se o token é válido
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decodedToken.exp - currentTime;

      // Verificar se o token não expirou
      const isValid = decodedToken.exp > currentTime;

      if (!isValid) {
        // Token expirado
      }

      return isValid;
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return false;
    }
  }

  // Obter informações do token decodificado
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Limpar dados específicos do usuário (mantém configurações globais)
  private clearUserSpecificData(): void {
    // Dados de autenticação e empresa
    localStorage.removeItem('dream_keys_selected_company_id');

    // CORREÇÃO: Limpar também dados de empresas que podem estar em cache
    // Isso evita que empresas de outros usuários sejam exibidas
    const companyRelatedKeys = [
      'dream_keys_companies_cache',
      'dream_keys_last_companies_user_id',
      'dream_keys_companies_data',
    ];
    companyRelatedKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Dados de permissões e equipes específicos do usuário
    localStorage.removeItem('dream_keys_last_permissions_user_id');
    localStorage.removeItem('dream_keys_last_teams_user_id');
    localStorage.removeItem('dream_keys_permissions_cache');

    // Dados específicos do usuário que devem ser limpos
    const userSpecificKeys = [
      'kanban-deadline-alerts',
      'dashboardConfig', // Configuração específica do dashboard do usuário
    ];

    // Remover chaves específicas conhecidas
    userSpecificKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Dados de dashboard específicos do usuário (com UUIDs)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('dashboard-overview-') ||
          key.startsWith('dashboard-') ||
          key.includes('user-preferences') ||
          key.includes('user-settings') ||
          key.includes('user-cache') ||
          key.includes('user-dashboard') ||
          key.includes('user-kanban') ||
          key.includes('user-properties') ||
          key.includes('user-rentals') ||
          key.includes('user-clients') ||
          // Padrões com UUIDs que são específicos do usuário
          /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
            key
          ) ||
          /dashboard.*[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/.test(
            key
          ))
      ) {
        keysToRemove.push(key);
      }
    }

    // Remover todas as chaves identificadas
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Disparar evento para limpar estado do CompanyContext
    window.dispatchEvent(new CustomEvent('auth-logout'));

    // console.log('🧹 clearUserSpecificData: Dados específicos do usuário removidos');
  }

  // Limpar dados de autenticação (logout normal)
  clearAuthData(): void {
    // Verificar se deve preservar informações de "lembrar de mim"
    const shouldRemember = this.shouldRememberUser();

    // Sempre limpar tokens e dados do usuário
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);

    // CORREÇÃO: Limpar dados específicos do usuário no logout
    this.clearUserSpecificData();

    // PRESERVAR REMEMBER_KEY e SAVED_EMAIL_KEY se "lembrar de mim" estava ativo
    // Isso permite que o email seja preenchido automaticamente no próximo login
    if (!shouldRemember) {
      localStorage.removeItem(this.REMEMBER_KEY);
      localStorage.removeItem(this.SAVED_EMAIL_KEY);
    }

    // console.log('🔐 clearAuthData: Dados limpos, preservando "lembrar de mim":', shouldRemember);
  }

  // Limpar dados temporários (apenas sessionStorage)
  clearSessionData(): void {
    const shouldRemember = this.shouldRememberUser();

    if (shouldRemember) {
      // Se "Lembrar de mim" está ativo, manter os dados no localStorage
      // Apenas limpar sessionStorage para evitar conflitos
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    } else {
      // Se "Lembrar de mim" está desativo, limpar tudo
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REMEMBER_KEY);
      localStorage.removeItem(this.SAVED_EMAIL_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);

      // CORREÇÃO: Limpar dados específicos do usuário quando não há "lembrar de mim"
      this.clearUserSpecificData();
    }
  }

  // Limpar completamente todos os dados (forçar logout)
  clearAllAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    localStorage.removeItem(this.SAVED_EMAIL_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);

    // CORREÇÃO: Limpar dados específicos do usuário no logout forçado
    this.clearUserSpecificData();

    // console.log('🔐 clearAllAuthData: Todos os dados limpos completamente');
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    const userData = this.getUserData();
    const refreshToken = this.getRefreshToken();

    if (!token || !userData) {
      return false;
    }

    // CORREÇÃO: Se tem token e refresh token, considerar autenticado
    // O interceptor da API fará o refresh automático se necessário
    if (refreshToken) {
      return true;
    }

    // Se não tem refresh token, verificar se o token é válido
    const isValid = this.isTokenValid();

    // Se não é válido e não tem refresh token
    if (!isValid) {
      // NÃO limpar dados se "Lembrar de mim" estiver ativo
      if (!this.shouldRememberUser()) {
        this.clearAllAuthData();
      }
      return false;
    }

    return isValid;
  }

  // Obter dados completos de autenticação
  getAuthData(): {
    token: string | null;
    user: UserData | null;
    decodedToken: DecodedToken | null;
  } {
    return {
      token: this.getToken(),
      user: this.getUserData(),
      decodedToken: this.getDecodedToken(),
    };
  }
}

export const authStorage = new AuthStorageService();
