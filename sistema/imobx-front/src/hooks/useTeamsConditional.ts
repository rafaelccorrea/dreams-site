import { useTeams } from './useTeams';

/**
 * Hook condicional que só carrega useTeams quando necessário
 * Evita chamadas desnecessárias de API em componentes que não precisam de teams
 */
export const useTeamsConditional = (shouldLoad: boolean = true) => {
  const teamsHook = useTeams();

  // Se não deve carregar, retornar valores padrão
  if (!shouldLoad) {
    return {
      teams: [],
      selectedTeam: null,
      selectTeam: () => {},
      loading: false,
      error: null,
      reloadTeams: async () => {},
      refreshTeams: async () => {},
      createTeam: async () => ({}) as any,
      updateTeam: async () => ({}) as any,
      deleteTeam: async () => {},
      getTeamsWithFilters: async () => ({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }),
      getTeamMembers: async () => [],
      addTeamMember: async () => ({}) as any,
      removeTeamMember: async () => {},
      updateTeamMemberRole: async () => ({}) as any,
    };
  }

  return teamsHook;
};
