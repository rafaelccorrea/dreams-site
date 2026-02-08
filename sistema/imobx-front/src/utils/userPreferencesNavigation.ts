/**
 * Utilitários para navegação baseada em User Preferences
 */

import {
  HOME_SCREEN_ROUTES,
  type HomeScreenType,
} from '../types/user-preferences.types';
import { userPreferencesService } from '../services/userPreferencesService';

/**
 * Obtém a rota padrão baseada nas preferências do usuário
 * @returns Promise<string> - A rota para onde o usuário deve ser redirecionado
 */
export const getDefaultRoute = async (): Promise<string> => {
  try {
    // console.log('🧭 userPreferencesNavigation: Obtendo rota padrão...');
    const { defaultHomeScreen } = await userPreferencesService.getHomeScreen();

    if (!defaultHomeScreen) {
      // console.log('🧭 userPreferencesNavigation: Nenhuma tela inicial configurada, usando dashboard');
      return '/dashboard';
    }

    const route = HOME_SCREEN_ROUTES[defaultHomeScreen];

    if (!route) {
      console.warn(
        '🧭 userPreferencesNavigation: Tela inicial inválida:',
        defaultHomeScreen
      );
      return '/dashboard';
    }

    // console.log('🧭 userPreferencesNavigation: Rota padrão obtida:', route);
    return route;
  } catch (error) {
    console.error(
      '❌ userPreferencesNavigation: Erro ao obter rota padrão:',
      error
    );
    // Fallback para dashboard em caso de erro
    return '/dashboard';
  }
};

/**
 * Obtém a rota padrão de forma síncrona (usando cache local se disponível)
 * @param cachedHomeScreen - Tela inicial em cache (opcional)
 * @returns string - A rota para onde o usuário deve ser redirecionado
 */
export const getDefaultRouteSync = (
  cachedHomeScreen?: HomeScreenType
): string => {
  if (!cachedHomeScreen) {
    return '/dashboard';
  }

  const route = HOME_SCREEN_ROUTES[cachedHomeScreen];
  return route || '/dashboard';
};

/**
 * Verifica se uma rota é válida para ser definida como tela inicial
 * @param route - A rota a ser verificada
 * @returns boolean - Se a rota é válida
 */
export const isValidHomeScreenRoute = (route: string): boolean => {
  return Object.values(HOME_SCREEN_ROUTES).includes(route);
};

/**
 * Obtém a tela inicial baseada em uma rota
 * @param route - A rota atual
 * @returns HomeScreenType | null - A tela inicial correspondente ou null
 */
export const getHomeScreenFromRoute = (
  route: string
): HomeScreenType | null => {
  const entry = Object.entries(HOME_SCREEN_ROUTES).find(
    ([_, routePath]) => routePath === route
  );
  return entry ? (entry[0] as HomeScreenType) : null;
};

/**
 * Redireciona o usuário para sua tela inicial preferida
 * @param navigate - Função de navegação do React Router
 * @param fallbackRoute - Rota de fallback caso não seja possível obter a preferência
 */
export const redirectToUserHomeScreen = async (
  navigate: (path: string) => void,
  fallbackRoute: string = '/dashboard'
) => {
  try {
    const defaultRoute = await getDefaultRoute();
    // console.log('🧭 userPreferencesNavigation: Redirecionando para:', defaultRoute);
    navigate(defaultRoute);
  } catch (error) {
    console.error(
      '❌ userPreferencesNavigation: Erro ao redirecionar, usando fallback:',
      error
    );
    navigate(fallbackRoute);
  }
};

/**
 * Hook personalizado para navegação baseada em preferências
 * (Para uso em componentes que não podem ser assíncronos)
 */
export const useUserPreferencesNavigation = () => {
  return {
    getDefaultRoute,
    getDefaultRouteSync,
    isValidHomeScreenRoute,
    getHomeScreenFromRoute,
    redirectToUserHomeScreen,
  };
};
