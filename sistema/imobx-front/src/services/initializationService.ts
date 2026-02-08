import { authStorage } from './authStorage';
import { permissionsCache } from './permissionsCache';

export interface InitializationResult {
  userPermissions: any;
  isInitialized: boolean;
  error?: string;
}

/**
 * Serviço responsável por inicializar a aplicação de forma sequencial
 * Garante que as permissões sejam carregadas PRIMEIRO antes de qualquer outra operação
 */
class InitializationService {
  private isInitialized = false;
  private initializationPromise: Promise<InitializationResult> | null = null;
  private userPermissions: any = null;

  /**
   * Inicializa a aplicação de forma sequencial
   * 1. Primeiro: carrega permissões do usuário (my-permissions)
   * 2. Depois: permite que outras APIs sejam chamadas
   */
  async initialize(): Promise<InitializationResult> {
    // Se já está inicializado, retorna o resultado anterior
    if (this.isInitialized && this.userPermissions) {
      return {
        userPermissions: this.userPermissions,
        isInitialized: true,
      };
    }

    // Se já existe uma inicialização em andamento, aguarda ela
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Criar nova promessa de inicialização
    this.initializationPromise = this.performInitialization();

    try {
      const result = await this.initializationPromise;
      this.isInitialized = true;
      return result;
    } catch (error) {
      // Em caso de erro, permitir nova tentativa
      this.initializationPromise = null;
      this.isInitialized = false;
      throw error;
    }
  }

  private async performInitialization(): Promise<InitializationResult> {
    try {
      // console.log('🚀 Iniciando sequência de inicialização...');
      // Verificar se está autenticado
      const isAuthenticated = authStorage.isAuthenticated();
      if (!isAuthenticated) {
        throw new Error('Usuário não autenticado');
      }

      // ETAPA 1: Verificar cache de permissões primeiro
      // console.log('🔐 Etapa 1: Verificando cache de permissões...');
      // Verificar se há cache válido
      const cached = permissionsCache.getCache();
      let userPermissions;

      if (cached && permissionsCache.isCacheValid()) {
        // console.log('✅ Usando cache válido de permissões');
        userPermissions = {
          userId: authStorage.getUserData()?.id || '',
          userName: authStorage.getUserData()?.name || '',
          userEmail: authStorage.getUserData()?.email || '',
          permissions: [],
          permissionNames: cached.permissions,
        };
      } else {
        // console.log('🔄 Cache inválido, carregando permissões da API...');
        const { permissionsApi } = await import('./permissionsApi');
        userPermissions = await permissionsApi.getMyPermissions();

        // Salvar no cache
        const user = authStorage.getUserData();
        if (user) {
          permissionsCache.setCache(
            userPermissions.permissionNames,
            user.role,
            localStorage.getItem('dream_keys_selected_company_id') || '',
            user.id
          );
        }
      }

      // Armazenar permissões para uso posterior
      this.userPermissions = userPermissions;

      // console.log('🎉 Inicialização concluída com sucesso!');
      return {
        userPermissions,
        isInitialized: true,
      };
    } catch (error: any) {
      console.error('❌ Erro durante inicialização:', error);

      return {
        userPermissions: null,
        isInitialized: false,
        error: error.message || 'Erro desconhecido durante inicialização',
      };
    }
  }

  /**
   * Verifica se a aplicação já foi inicializada
   */
  isAppInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Retorna as permissões do usuário (se já foram carregadas)
   */
  getUserPermissions(): any {
    return this.userPermissions;
  }

  /**
   * Reseta o estado de inicialização (útil para logout)
   */
  reset(): void {
    // console.log('🔄 Resetando serviço de inicialização...');
    this.isInitialized = false;
    this.initializationPromise = null;
    this.userPermissions = null;
  }

  /**
   * Aguarda a inicialização estar completa antes de prosseguir
   * Útil para outras APIs que precisam aguardar as permissões
   */
  async waitForInitialization(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      await this.initializationPromise;
    } else {
      await this.initialize();
    }
  }
}

// Instância singleton do serviço
export const initializationService = new InitializationService();
