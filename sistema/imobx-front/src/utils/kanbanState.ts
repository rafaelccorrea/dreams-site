/**
 * Utilitário para gerenciar o estado do Kanban no localStorage
 * Garante que sempre possamos voltar para o quadro Kanban correto
 * Salva o estado por usuário para manter o último projeto acessado após logout/login
 */

const KANBAN_STATE_KEY_PREFIX = 'kanban-last-state-';

export interface KanbanState {
  projectId?: string | null;
  teamId?: string | null;
  workspace?: string | null;
  userId?: string | null; // ID do usuário que salvou o estado
  timestamp?: number;
}

/**
 * Obtém a chave do localStorage baseada no userId
 */
const getStateKey = (userId?: string | null): string => {
  if (userId) {
    return `${KANBAN_STATE_KEY_PREFIX}${userId}`;
  }
  // Fallback para chave genérica se não tiver userId
  return `${KANBAN_STATE_KEY_PREFIX}default`;
};

/**
 * Salva o estado atual do Kanban no localStorage
 * O estado é salvo por usuário (usando userId como parte da chave)
 */
export const saveKanbanState = (state: KanbanState): void => {
  try {
    if (!state.userId) {
      console.warn('⚠️ [kanbanState] Tentando salvar estado sem userId');
      return;
    }

    const stateToSave: KanbanState = {
      ...state,
      userId: state.userId, // Garantir que userId está presente
      timestamp: Date.now(),
    };

    const key = getStateKey(state.userId);
    localStorage.setItem(key, JSON.stringify(stateToSave));
    console.log('✅ [kanbanState] Estado salvo para usuário:', state.userId);
  } catch (error) {
    console.error('Erro ao salvar estado do kanban:', error);
  }
};

/**
 * Recupera o estado salvo do Kanban do localStorage para um usuário específico
 * @param userId - ID do usuário para recuperar o estado
 */
export const getKanbanState = (userId?: string | null): KanbanState | null => {
  try {
    if (!userId) {
      // Se não tiver userId, tentar buscar de todas as chaves possíveis
      // (para compatibilidade com estados antigos)
      const keys = Object.keys(localStorage);
      const kanbanKeys = keys.filter(key =>
        key.startsWith(KANBAN_STATE_KEY_PREFIX)
      );

      if (kanbanKeys.length > 0) {
        // Pegar o mais recente baseado no timestamp
        let latestState: KanbanState | null = null;
        let latestTimestamp = 0;

        for (const key of kanbanKeys) {
          try {
            const saved = localStorage.getItem(key);
            if (saved) {
              const state = JSON.parse(saved) as KanbanState;
              if (state.timestamp && state.timestamp > latestTimestamp) {
                latestTimestamp = state.timestamp;
                latestState = state;
              }
            }
          } catch (e) {
            // Ignorar erros de parse
          }
        }

        return latestState;
      }

      return null;
    }

    const key = getStateKey(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      const state = JSON.parse(saved) as KanbanState;
      console.log('✅ [kanbanState] Estado recuperado para usuário:', userId);
      return state;
    }
  } catch (error) {
    console.error('Erro ao recuperar estado do kanban:', error);
  }
  return null;
};

/**
 * Limpa o estado salvo do Kanban para um usuário específico
 * @param userId - ID do usuário para limpar o estado (opcional, se não fornecido limpa todos)
 */
export const clearKanbanState = (userId?: string | null): void => {
  try {
    if (userId) {
      const key = getStateKey(userId);
      localStorage.removeItem(key);
      console.log('✅ [kanbanState] Estado limpo para usuário:', userId);
    } else {
      // Limpar todos os estados salvos
      const keys = Object.keys(localStorage);
      const kanbanKeys = keys.filter(key =>
        key.startsWith(KANBAN_STATE_KEY_PREFIX)
      );
      kanbanKeys.forEach(key => localStorage.removeItem(key));
      console.log('✅ [kanbanState] Todos os estados limpos');
    }
  } catch (error) {
    console.error('Erro ao limpar estado do kanban:', error);
  }
};

/**
 * Constrói a URL do Kanban com base no estado fornecido ou salvo
 * Sempre retorna uma URL válida para o Kanban, nunca para seleção de projeto
 * @param state - Estado opcional para usar
 * @param userId - ID do usuário para recuperar estado salvo
 */
export const buildKanbanUrl = (
  state?: Partial<KanbanState>,
  userId?: string | null
): string => {
  const basePath = '/kanban';
  const queryParams = new URLSearchParams();

  // Priorizar estado fornecido, depois estado salvo do usuário
  const savedState = getKanbanState(userId);
  const finalState: KanbanState = {
    ...savedState,
    ...state,
  };

  // Adicionar projectId se existir
  if (
    finalState.projectId &&
    finalState.projectId !== 'undefined' &&
    finalState.projectId !== 'null'
  ) {
    queryParams.append('projectId', finalState.projectId);
  }

  // Adicionar workspace
  if (finalState.workspace === 'personal') {
    queryParams.append('workspace', 'personal');
  } else if (
    finalState.workspace &&
    finalState.workspace !== 'undefined' &&
    finalState.workspace !== 'null'
  ) {
    queryParams.append('workspace', finalState.workspace);
  }

  // Adicionar teamId se não for workspace pessoal
  if (
    finalState.teamId &&
    finalState.teamId !== 'undefined' &&
    finalState.teamId !== 'null' &&
    finalState.workspace !== 'personal'
  ) {
    queryParams.append('teamId', finalState.teamId);
  }

  // Sempre retornar URL do Kanban, mesmo sem parâmetros
  return queryParams.toString()
    ? `${basePath}?${queryParams.toString()}`
    : basePath;
};
