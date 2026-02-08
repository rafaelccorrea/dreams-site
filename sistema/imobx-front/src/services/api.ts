import axios from 'axios';
import { authStorage } from './authStorage';
import { API_BASE_URL } from '../config/apiConfig';
import { getNavigationUrl } from '../utils/pathUtils';

// Flag para evitar múltiplos refreshes simultâneos
let isRefreshing = false;
// Flag para evitar múltiplos logouts simultâneos
let isLoggingOut = false;
// Flag para evitar múltiplos redirecionamentos simultâneos
let isRedirecting = false;
// Contador de 401s consecutivos para evitar loops infinitos
let consecutive401Count = 0;
const MAX_CONSECUTIVE_401 = 3; // Após 3 401s consecutivos, fazer logout forçado

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configurações para CORS
  withCredentials: false, // Se o backend usar cookies, mudar para true
  timeout: 30000, // Timeout de 30 segundos
});

// Interceptor para adicionar token de autenticação e empresa selecionada
api.interceptors.request.use(
  async config => {
    // Se já está fazendo logout, cancelar todas as requisições
    if (isLoggingOut) {
      return Promise.reject(new Error('Logout em andamento'));
    }
    // Se for FormData, remover Content-Type para deixar o navegador definir com boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Não fazer refresh proativo em rotas de autenticação
    const isAuthRoute = config.url?.includes('/auth/');

    // Verificar se o token está próximo do vencimento e fazer refresh proativo
    const token = authStorage.getToken();
    const refreshToken = authStorage.getRefreshToken();

    if (token && refreshToken && !isAuthRoute && !isRefreshing) {
      try {
        const decodedToken = authStorage.getDecodedToken();
        if (decodedToken) {
          const currentTime = Date.now() / 1000;
          const timeUntilExpiry = decodedToken.exp - currentTime;

          // Se o token expira em menos de 2 minutos, fazer refresh proativo
          if (timeUntilExpiry < 120 && timeUntilExpiry > 0) {
            isRefreshing = true;
            // console.log('🔄 Token próximo do vencimento, fazendo refresh proativo...');
            try {
              const response = await api.post('/auth/refresh', {
                refresh_token: refreshToken,
              });

              // Salvar novos tokens
              authStorage.saveAuthData(
                response.data,
                authStorage.shouldRememberUser()
              );

              // console.log('✅ Refresh proativo realizado com sucesso');
              // Usar o novo token na requisição atual
              config.headers.Authorization = `Bearer ${response.data.access_token}`;
            } catch (refreshError) {
              // console.log('❌ Erro no refresh proativo:', refreshError);
              // Se o refresh falhar, continuar com o token atual
              config.headers.Authorization = `Bearer ${token}`;
            } finally {
              isRefreshing = false;
            }
          } else {
            // Token ainda válido por tempo suficiente
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          // Se não conseguir decodificar o token, usar o token original
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Se houver erro, usar o token original
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (token) {
      // Se não tem refresh token, usar o token atual
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar empresa selecionada no header se disponível
    // NÃO enviar em rotas de autenticação (login, register, refresh, forgot-password, reset-password)
    // Reutilizar a variável isAuthRoute já declarada acima (linha 20)
    const isPublicRoute = config.url?.includes('/public/');
    const isMyPermissionsRoute = config.url?.includes(
      '/permissions/my-permissions'
    );
    const isCompaniesListRoute =
      config.url === '/companies' || config.url?.endsWith('/companies');
    const isSubscriptionRoute =
      config.url?.includes('/subscriptions/') || config.url?.includes('/plans');
    const isNotificationsRoute = config.url?.includes('/notifications');
    const isTeamsRoute = config.url?.includes('/teams'); // CORREÇÃO: Permitir /teams sem Company ID inicialmente
    const isAutentiqueRoute = config.url?.includes('/autentique'); // Proxy Autentique (assinaturas) – Company ID opcional

    if (
      !isAuthRoute &&
      !isPublicRoute &&
      !isMyPermissionsRoute &&
      !isCompaniesListRoute &&
      !isSubscriptionRoute &&
      !isNotificationsRoute &&
      !isTeamsRoute &&
      !isAutentiqueRoute
    ) {
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );

      // Debug: verificar estado do localStorage
      // console.log('🔍 DEBUG API Interceptor:');
      // console.log('  - URL:', config.url);
      // console.log('  - selectedCompanyId no localStorage:', selectedCompanyId);
      // console.log('  - localStorage keys:', Object.keys(localStorage).filter(k => k.includes('dream_keys')));
      // GOALS: Log específico para depuração
      if (config.url?.includes('/goals')) {
        // console.log('🎯 GOALS API - Company ID:', selectedCompanyId);
        // console.log('🎯 GOALS API - Headers antes:', config.headers);
      }

      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
        // console.log('🏢 Enviando Company ID no header:', selectedCompanyId, 'para URL:', config.url);
        // GOALS: Confirmar que foi adicionado
        if (config.url?.includes('/goals')) {
          // console.log('🎯 GOALS API - Headers depois:', config.headers);
        }
      } else {
        // CORREÇÃO: Verificar se é uma requisição de dashboard durante inicialização
        // Se o usuário está autenticado mas ainda não tem Company ID, pode estar em processo de carregamento
        const user = authStorage.getUserData();
        const token = authStorage.getToken();

        // Se tem token e usuário autenticado, pode ser que o Company ID esteja sendo carregado
        // Verificar se a URL é de dashboard (que pode ser carregada antes do Company ID estar disponível)
        const isDashboardRoute = config.url?.includes('/dashboard/');

        if (token && user && isDashboardRoute) {
          // CORREÇÃO: Em vez de bloquear imediatamente, aguardar um pouco
          // para ver se o Company ID será carregado (useAuth pode estar processando)
          console.warn(
            '⚠️ API Interceptor: Dashboard sem Company ID, mas usuário autenticado. Aguardando carregamento...'
          );

          // Aguardar até 500ms para ver se o Company ID aparece
          let waitedCompanyId = selectedCompanyId;
          const maxWait = 500; // 500ms
          const checkInterval = 50; // Verificar a cada 50ms
          const startTime = Date.now();

          while (!waitedCompanyId && Date.now() - startTime < maxWait) {
            await new Promise(resolve => setTimeout(resolve, checkInterval));
            waitedCompanyId = localStorage.getItem(
              'dream_keys_selected_company_id'
            );
          }

          if (waitedCompanyId) {
            console.log(
              '✅ API Interceptor: Company ID encontrado após aguardar:',
              waitedCompanyId
            );
            config.headers['X-Company-ID'] = waitedCompanyId;
          } else {
            // Se ainda não tem após aguardar, bloquear a requisição
            // Não redirecionar aqui - deixar o CompanyRequiredGuard fazer isso
            return Promise.reject(
              new Error('Company ID não encontrado. Requisição bloqueada.')
            );
          }
        } else {
          // Para rotas não-dashboard ou usuário não autenticado, bloquear imediatamente
          // Não redirecionar aqui - deixar o CompanyRequiredGuard fazer isso
          return Promise.reject(
            new Error('Company ID não encontrado. Requisição bloqueada.')
          );
        }
      }
    } else if (isAuthRoute || isPublicRoute) {
      // console.log('🔐 Rota pública/autenticação detectada, não exigindo Company ID:', config.url);
    } else if (isMyPermissionsRoute) {
      // Para my-permissions, enviar Company ID se disponível, mas não bloquear se não tiver
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
        // console.log('🏢 Enviando Company ID no header (opcional):', selectedCompanyId, 'para URL:', config.url);
      } else {
        // console.log('⚠️ my-permissions: Company ID não disponível, mas permitindo requisição');
      }
    } else if (isCompaniesListRoute) {
      // CORREÇÃO: /companies NUNCA deve exigir Company ID - é usada para OBTER o Company ID
      // Permitir sempre, com ou sem Company ID
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
        console.log(
          '🏢 /companies: Enviando Company ID no header (opcional):',
          selectedCompanyId
        );
      } else {
        console.log(
          '✅ /companies: Company ID não disponível - isso é esperado durante login. Permitindo requisição.'
        );
      }
      // NÃO bloquear esta rota - ela é usada para carregar companies e definir Company ID
    } else if (isSubscriptionRoute) {
      // Para rotas de subscription/plans, enviar Company ID se disponível, mas não bloquear se não tiver
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
        // console.log('💳 Enviando Company ID no header (opcional):', selectedCompanyId, 'para URL:', config.url);
      } else {
        // console.log('⚠️ subscription/plans: Company ID não disponível, mas permitindo requisição para verificar assinatura');
      }
    } else if (isNotificationsRoute) {
      // Para rotas de notificações, enviar Company ID se disponível, mas não bloquear se não tiver
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
        // console.log('🔔 Enviando Company ID no header (opcional):', selectedCompanyId, 'para URL:', config.url);
      } else {
        // console.log('⚠️ notifications: Company ID não disponível, mas permitindo requisição para notificações');
      }
    } else if (isTeamsRoute) {
      // Para rotas de teams, enviar Company ID se disponível, mas não bloquear se não tiver
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
        // console.log('👥 Enviando Company ID no header (opcional):', selectedCompanyId, 'para URL:', config.url);
      } else {
        // console.log('⚠️ teams: Company ID não disponível, mas permitindo requisição para teams');
      }
    } else if (isAutentiqueRoute) {
      // Autentique (assinaturas de proposta) – Company ID opcional
      const selectedCompanyId = localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      if (selectedCompanyId) {
        config.headers['X-Company-ID'] = selectedCompanyId;
      }
    }

    // Remover onlyMyData quando não for true em qualquer requisição com params
    if (
      config.params &&
      Object.prototype.hasOwnProperty.call(config.params, 'onlyMyData')
    ) {
      if (config.params.onlyMyData !== true) {
        delete (config.params as any).onlyMyData;
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas de erro e refresh token automático
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // NÃO interceptar 401 dos endpoints de autenticação em fluxos esperados:
    // - /auth/login com 2FA_REQUIRED (deve ser tratado pelo fluxo de login)
    // - /auth/verify-2fa com INVALID_2FA_CODE (deve ser exibido ao usuário)
    try {
      const url = originalRequest?.url || '';
      const isAuthLogin = url.includes('/auth/login');
      const isAuthVerify2FA = url.includes('/auth/verify-2fa');
      const errorCode = error?.response?.data?.errorCode;
      if (
        (isAuthLogin &&
          error?.response?.status === 401 &&
          errorCode === '2FA_REQUIRED') ||
        (isAuthVerify2FA && error?.response?.status === 401)
      ) {
        // Deixar o consumidor tratar esse 401 específico
        return Promise.reject(error);
      }
    } catch {
      // noop: se falhar, segue fluxo padrão abaixo
    }

    if (error.response?.status === 401) {
      // Incrementar contador de 401s consecutivos
      consecutive401Count++;

      // Se já está fazendo logout, não processar mais 401s
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      // CORREÇÃO CRÍTICA: Se recebeu muitos 401s consecutivos, fazer logout forçado
      // Isso evita loops infinitos
      if (consecutive401Count >= MAX_CONSECUTIVE_401) {
        console.error(
          '❌ Interceptor: Muitos 401s consecutivos detectados, fazendo logout forçado para evitar loop...'
        );
        isLoggingOut = true;
        consecutive401Count = 0; // Resetar contador
        authStorage.clearAllAuthData();
        // Usar replace para evitar histórico de navegação
        window.location.replace(getNavigationUrl('/login'));
        return Promise.reject(error);
      }

      // Se já tentou refresh uma vez e ainda recebeu 401, fazer logout imediatamente
      if (originalRequest._retry) {
        console.error(
          '❌ Interceptor: Refresh token falhou ou token inválido, fazendo logout...'
        );
        isLoggingOut = true;
        consecutive401Count = 0; // Resetar contador
        authStorage.clearAllAuthData();
        // Usar replace para evitar histórico de navegação
        window.location.replace(getNavigationUrl('/login'));
        return Promise.reject(error);
      }

      // Marcar como tentado
      originalRequest._retry = true;

      const refreshToken = authStorage.getRefreshToken();

      if (refreshToken) {
        // Evitar múltiplos refreshes simultâneos
        if (isRefreshing) {
          // Se já está fazendo refresh, aguardar um pouco e rejeitar
          // Mas incrementar contador para detectar loops
          return Promise.reject(error);
        }

        isRefreshing = true;
        try {
          const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          // Salvar novos tokens
          authStorage.saveAuthData(
            response.data,
            authStorage.shouldRememberUser()
          );

          // Resetar flags e contador após sucesso
          isRefreshing = false;
          consecutive401Count = 0;

          // Repetir requisição original com novo token
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError: any) {
          isRefreshing = false;
          console.error('❌ Interceptor: Erro no refresh token:', refreshError);

          // Se o refresh falhou com 401, fazer logout imediatamente
          if (refreshError?.response?.status === 401 || !refreshToken) {
            isLoggingOut = true;
            consecutive401Count = 0; // Resetar contador
            authStorage.clearAllAuthData();
            // Usar replace para evitar histórico de navegação
            window.location.replace(getNavigationUrl('/login'));
          }
          return Promise.reject(refreshError);
        }
      } else {
        console.error(
          '❌ Interceptor: Nenhum refresh token disponível, fazendo logout...'
        );
        isLoggingOut = true;
        consecutive401Count = 0; // Resetar contador
        authStorage.clearAllAuthData();
        // Usar replace para evitar histórico de navegação
        window.location.replace(getNavigationUrl('/login'));
        return Promise.reject(error);
      }
    }

    // Resetar contador se não for 401
    if (error.response?.status !== 401) {
      consecutive401Count = 0;
    }

    if (error.response?.status === 400) {
      // ✅ CORREÇÃO: Verificar se é erro de validação do kanban antes de qualquer tratamento
      const requestUrl = error.config?.url || '';
      const errorPath = error?.response?.data?.path || '';
      const errorMessage = error?.response?.data?.message || '';

      // Verificar se é erro de validação do kanban pela URL ou pela mensagem
      const isKanbanValidationError =
        requestUrl?.includes('/kanban/tasks/move') ||
        errorPath?.includes('/kanban/tasks/move') ||
        errorPath?.includes('/kanban/tasks') ||
        error?.response?.data?.failedValidations ||
        error?.response?.data?.blocked ||
        errorMessage?.toLowerCase().includes('obrigatório') ||
        errorMessage?.toLowerCase().includes('relacionamento') ||
        errorMessage?.toLowerCase().includes('validação') ||
        error?._skipGlobalHandlers ||
        error?._isValidationError ||
        error?._handled;

      if (isKanbanValidationError) {
        console.log(
          '✅ Erro de validação do kanban detectado (400) - não processando no interceptor',
          {
            requestUrl,
            errorPath,
            errorMessage,
            hasSkipFlag: error?._skipGlobalHandlers,
            hasValidationFlag: error?._isValidationError,
          }
        );

        // Marcar o erro para evitar processamento em outros lugares
        error._skipGlobalHandlers = true;
        error._isValidationError = true;
        error._handled = true;

        // Não processar erro de validação do kanban no interceptor
        // Deixar o componente tratar
        return Promise.reject(error);
      }
      // Se não for erro de validação do kanban, seguir com tratamento normal
      return Promise.reject(error);
    } else if (error.response?.status === 403) {
      // Erro de acesso negado - pode ser por assinatura, empresa ou permissões
      const user = authStorage.getUserData();
      const requestUrl = error.config?.url || '';

      // Verificar se o erro é relacionado a empresa (não assinatura)
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      const isCompanyError =
        errorMessage.includes('empresa') ||
        errorMessage.includes('company') ||
        errorMessage.includes('usuário deve estar associado');

      // Verificar se o erro é relacionado a permissões
      const isPermissionError =
        errorMessage.includes('permiss') ||
        errorMessage.includes('forbidden') ||
        errorMessage.includes('você não tem permissão');

      // Verificar se é um erro específico de módulo/permissão (não crítico)
      const isModulePermissionError =
        requestUrl.includes('/teams') ||
        requestUrl.includes('/kanban') ||
        requestUrl.includes('/reports') ||
        requestUrl.includes('/inspections') ||
        requestUrl.includes('/appointment-invites');

      // CORREÇÃO: Verificar se é erro de módulo não incluído no plano
      const isModulePlanError = errorMessage.includes(
        'plano não inclui acesso ao módulo'
      );

      // CORREÇÃO: Verificar se é rota de criação/edição de usuários (não deve fazer logout em 403)
      const isUserManagementRoute =
        requestUrl.includes('/admin/users') ||
        requestUrl.includes('/users') ||
        (requestUrl.includes('/user') &&
          ['POST', 'PUT', 'PATCH'].includes(
            error.config?.method?.toUpperCase() || ''
          ));

      // DEBUG: Log detalhado para identificar qual API está causando o problema
      if (isPermissionError || isModulePermissionError || isModulePlanError) {
        console.warn('⚠️ ERRO DE PERMISSÃO/MÓDULO DETECTADO (não crítico):', {
          url: requestUrl,
          method: error.config?.method,
          status: error.response?.status,
          errorMessage,
          userRole: user?.role,
          isModulePermissionError,
          isModulePlanError,
        });
      }

      // CORREÇÃO: Adicionar flag para identificar erro de módulo no plano e disparar evento global
      if (isModulePlanError) {
        error.isModuleNotAvailable = true;
        error.moduleErrorMessage = errorMessage;
        // console.log('🔒 Módulo não disponível no plano - disparando evento global');
        // Extrair nome do módulo da mensagem de erro
        const moduleMatch = errorMessage.match(/módulo (\w+)/i);
        const moduleName = moduleMatch ? moduleMatch[1] : 'este módulo';

        // Disparar evento customizado global para mostrar modal
        window.dispatchEvent(
          new CustomEvent('module-not-available', {
            detail: {
              moduleName:
                moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
              errorMessage,
            },
          })
        );
      }

      // Verificar se é erro específico de assinatura
      const isSubscriptionError =
        errorMessage.includes('assinatura') ||
        errorMessage.includes('subscription') ||
        errorMessage.includes('plano expirado') ||
        errorMessage.includes('plano inativo');

      // Verificar se é erro de plano PRO para MCMV
      const isMCMVPlanError =
        requestUrl.includes('/mcmv') &&
        (errorMessage.includes('plano pro') ||
          errorMessage.includes('mcmv está disponível apenas'));

      // Se for erro de módulo/permissão específico ou rota de gerenciamento de usuários, não redirecionar
      if (
        isModulePermissionError ||
        isModulePlanError ||
        isUserManagementRoute
      ) {
        // console.log('🔒 Erro de permissão de módulo ou gerenciamento de usuários - não redirecionando, deixando componente tratar');
        // Não fazer redirecionamento, deixar o componente tratar o erro
      } else if (isMCMVPlanError) {
        // Erro de plano PRO para MCMV - tratar como erro de assinatura
        error.isMCMVPlanError = true;
        if (user?.role === 'admin') {
          console.warn(
            '🚫 Erro de plano PRO para MCMV - redirecionando para /subscription-management'
          );
          window.location.href = getNavigationUrl('/subscription-management');
        } else {
          window.location.href = getNavigationUrl('/system-unavailable');
        }
      } else if (isCompanyError && user?.role === 'admin') {
        // Erro relacionado a empresa - redirecionar para verificação de acesso
        window.location.href = getNavigationUrl('/verifying-access');
      } else if (user?.role === 'admin' && isSubscriptionError) {
        // ✅ CORREÇÃO: Apenas redirecionar para subscription-plans se for erro de assinatura
        console.warn(
          '🚫 Erro de assinatura detectado - redirecionando para /subscription-management'
        );
        window.location.href = getNavigationUrl('/subscription-management');
      } else if (user?.role === 'admin' && isPermissionError) {
        // ✅ CORREÇÃO: Se for apenas erro de permissão, não redirecionar
        console.warn(
          '⚠️ Erro de permissão detectado para admin - não redirecionando'
        );
      } else if (user?.role === 'user' && isPermissionError) {
        // ✅ CORREÇÃO: Verificar se é erro de validação do kanban antes de redirecionar
        const errorPath = error?.response?.data?.path || '';
        const isKanbanValidationError =
          error?.response?.data?.failedValidations ||
          error?.response?.data?.blocked ||
          error?._skipGlobalHandlers ||
          error?._isValidationError ||
          error?._handled ||
          requestUrl?.includes('/kanban/tasks/move') ||
          errorPath?.includes('/kanban/tasks/move');

        if (!isKanbanValidationError) {
          // Usuário sem permissões - redirecionar para dashboard
          window.location.href = getNavigationUrl('/dashboard');
        } else {
          console.log(
            '✅ Erro de validação do kanban detectado - não redirecionando'
          );
        }
      } else if (user?.role === 'user' && !isSubscriptionError) {
        // User vai para página de sistema indisponível (assinatura)
        // Mas apenas se não for erro de assinatura (que já foi tratado acima)
        window.location.href = getNavigationUrl('/system-unavailable');
      } else if (
        !isPermissionError &&
        !isModulePermissionError &&
        !isModulePlanError &&
        !isUserManagementRoute
      ) {
        // Fallback para login - apenas se não for erro de permissão simples
        // Se for erro de permissão simples, apenas mostrar o erro sem deslogar
        console.warn('⚠️ Erro 403 não tratado - deixando componente tratar', {
          url: requestUrl,
          method: error.config?.method,
          errorMessage,
        });
      }
    }

    // Tratamento de erro 429 (Too Many Requests - Rate Limit)
    if (error.response?.status === 429) {
      // Adicionar informações ao erro para que componentes possam tratá-lo se necessário
      error.isRateLimit = true;

      // NÃO mostrar toast de rate limit - apenas marcar o erro
      // Os componentes devem tratar o erro silenciosamente usando cache ou estados vazios

      // Não quebrar a página - retornar erro tratado
      // Os componentes que chamam a API devem verificar error.isRateLimit
      // e mostrar estados vazios ou mensagens apropriadas
      console.warn('⚠️ Rate Limit (429) detectado (silencioso):', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        message: error.response?.data?.message || 'Muitas requisições',
      });
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  registerWithConfirmation: async (userData: any) => {
    const response = await api.post(
      '/auth/register-with-confirmation',
      userData
    );
    return response.data;
  },

  confirmRegistration: async (token: string) => {
    const response = await api.post('/auth/confirm-registration', { token });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: {
    name: string;
    phone: string;
    tagIds?: string[];
  }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Funções para reset de senha
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  verifyResetToken: async (token: string) => {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  // Funções para gerenciamento de sessões
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  logoutOthers: async () => {
    const response = await api.post('/auth/logout-others');
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  // Funções para administradores
  getUserLastLogin: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/last-login`);
    return response.data;
  },

  getAllUsersLastLogins: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(
      `/admin/users/last-logins?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getUserSessions: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/sessions`);
    return response.data;
  },

  forceLogoutUser: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/force-logout`);
    return response.data;
  },

  getAllActiveSessions: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(
      `/admin/sessions/active?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
