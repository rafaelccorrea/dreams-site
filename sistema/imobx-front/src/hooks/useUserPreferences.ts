/**
 * Hook para gerenciar User Preferences
 * Fornece estado e funções para carregar, atualizar e gerenciar preferências do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { userPreferencesService } from '../services/userPreferencesService';
import type {
  UserPreferences,
  UpdateUserPreferencesRequest,
  HomeScreenType,
  ThemeSettings,
  NotificationSettings,
  LayoutSettings,
} from '../types/user-preferences.types';

interface UseUserPreferencesReturn {
  // Estado
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;

  // Funções principais
  loadPreferences: () => Promise<void>;
  updatePreferences: (
    preferences: UpdateUserPreferencesRequest
  ) => Promise<void>;
  setHomeScreen: (homeScreen: HomeScreenType) => Promise<void>;
  resetPreferences: () => Promise<void>;

  // Funções específicas
  updateThemeSettings: (themeSettings: Partial<ThemeSettings>) => Promise<void>;
  updateNotificationSettings: (
    notificationSettings: Partial<NotificationSettings>
  ) => Promise<void>;
  updateLayoutSettings: (
    layoutSettings: Partial<LayoutSettings>
  ) => Promise<void>;

  // Utilitários
  getDefaultRoute: () => string;
  refreshPreferences: () => Promise<void>;
}

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega as preferências do usuário
   */
  const loadPreferences = useCallback(async () => {
    // Verificar se há Company ID antes de fazer requisição
    const hasCompanyId = !!localStorage.getItem(
      'dream_keys_selected_company_id'
    );
    if (!hasCompanyId) {
      setIsLoading(false);
      return; // Não fazer requisição se não houver Company ID
    }

    try {
      setIsLoading(true);
      setError(null);

      // console.log('🔄 useUserPreferences: Carregando preferências...');
      const userPreferences = await userPreferencesService.getPreferences();

      setPreferences(userPreferences);
      // console.log('✅ useUserPreferences: Preferências carregadas:', userPreferences);
    } catch (err: any) {
      // Silenciosamente ignorar erros relacionados a Company ID
      if (err.message?.includes('Company ID não encontrado')) {
        setIsLoading(false);
        return;
      }
      console.error(
        '❌ useUserPreferences: Erro ao carregar preferências:',
        err
      );
      setError(err.message || 'Erro ao carregar preferências');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza as preferências do usuário
   */
  const updatePreferences = useCallback(
    async (newPreferences: UpdateUserPreferencesRequest) => {
      try {
        setError(null);

        // console.log('🔄 useUserPreferences: Atualizando preferências:', newPreferences);
        const updated =
          await userPreferencesService.updatePreferences(newPreferences);

        setPreferences(updated);
        // console.log('✅ useUserPreferences: Preferências atualizadas:', updated);
      } catch (err: any) {
        console.error(
          '❌ useUserPreferences: Erro ao atualizar preferências:',
          err
        );
        setError(err.message || 'Erro ao atualizar preferências');
        throw err; // Re-throw para que o componente possa tratar
      }
    },
    []
  );

  /**
   * Define a tela inicial padrão
   */
  const setHomeScreen = useCallback(async (homeScreen: HomeScreenType) => {
    try {
      setError(null);

      // console.log('🔄 useUserPreferences: Definindo tela inicial:', homeScreen);
      const updated = await userPreferencesService.setHomeScreen(homeScreen);

      setPreferences(updated);
      // console.log('✅ useUserPreferences: Tela inicial definida:', homeScreen);
    } catch (err: any) {
      console.error(
        '❌ useUserPreferences: Erro ao definir tela inicial:',
        err
      );
      setError(err.message || 'Erro ao definir tela inicial');
      throw err;
    }
  }, []);

  /**
   * Reseta todas as preferências para o padrão
   */
  const resetPreferences = useCallback(async () => {
    try {
      setError(null);

      // console.log('🔄 useUserPreferences: Resetando preferências...');
      await userPreferencesService.resetPreferences();

      // Recarregar preferências após reset
      await loadPreferences();
      // console.log('✅ useUserPreferences: Preferências resetadas');
    } catch (err: any) {
      console.error(
        '❌ useUserPreferences: Erro ao resetar preferências:',
        err
      );
      setError(err.message || 'Erro ao resetar preferências');
      throw err;
    }
  }, [loadPreferences]);

  /**
   * Atualiza configurações de tema
   */
  const updateThemeSettings = useCallback(
    async (themeSettings: Partial<ThemeSettings>) => {
      await updatePreferences({ themeSettings });
    },
    [updatePreferences]
  );

  /**
   * Atualiza configurações de notificação
   */
  const updateNotificationSettings = useCallback(
    async (notificationSettings: Partial<NotificationSettings>) => {
      await updatePreferences({ notificationSettings });
    },
    [updatePreferences]
  );

  /**
   * Atualiza configurações de layout
   */
  const updateLayoutSettings = useCallback(
    async (layoutSettings: Partial<LayoutSettings>) => {
      await updatePreferences({ layoutSettings });
    },
    [updatePreferences]
  );

  /**
   * Obtém a rota padrão baseada na tela inicial configurada
   */
  const getDefaultRoute = useCallback((): string => {
    if (!preferences?.defaultHomeScreen) {
      return '/dashboard'; // Fallback padrão
    }

    const { HOME_SCREEN_ROUTES } = require('../types/user-preferences.types');
    return HOME_SCREEN_ROUTES[preferences.defaultHomeScreen] || '/dashboard';
  }, [preferences?.defaultHomeScreen]);

  /**
   * Recarrega as preferências (alias para loadPreferences)
   */
  const refreshPreferences = useCallback(async () => {
    await loadPreferences();
  }, [loadPreferences]);

  // Carregar preferências na inicialização
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    // Estado
    preferences,
    isLoading,
    error,

    // Funções principais
    loadPreferences,
    updatePreferences,
    setHomeScreen,
    resetPreferences,

    // Funções específicas
    updateThemeSettings,
    updateNotificationSettings,
    updateLayoutSettings,

    // Utilitários
    getDefaultRoute,
    refreshPreferences,
  };
};
