import { useState, useCallback, useEffect } from 'react';
import { kanbanValidationsApi } from '../services/kanbanValidationsApi';
import type {
  ColumnValidation,
  ColumnAction,
  CreateValidationDto,
  UpdateValidationDto,
  CreateActionDto,
  UpdateActionDto,
  ValidationHistoryResponse,
  ActionHistoryResponse,
} from '../types/kanbanValidations';
import { toast } from 'react-toastify';

export const useKanbanValidations = (columnId?: string) => {
  const [validations, setValidations] = useState<ColumnValidation[]>([]);
  const [actions, setActions] = useState<ColumnAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar validações
  const loadValidations = useCallback(async () => {
    if (!columnId) {
      setValidations([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await kanbanValidationsApi.getValidations(columnId);
      setValidations(data);
    } catch (err: any) {
      console.error('Erro ao carregar validações:', err);
      setError(err.message || 'Erro ao carregar validações');
      toast.error(err.message || 'Erro ao carregar validações');
    } finally {
      setLoading(false);
    }
  }, [columnId]);

  // Carregar ações
  const loadActions = useCallback(
    async (trigger?: string) => {
      if (!columnId) {
        setActions([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await kanbanValidationsApi.getActions(columnId, trigger);
        setActions(data);
      } catch (err: any) {
        console.error('Erro ao carregar ações:', err);
        setError(err.message || 'Erro ao carregar ações');
        toast.error(err.message || 'Erro ao carregar ações');
      } finally {
        setLoading(false);
      }
    },
    [columnId]
  );

  // Carregar tudo
  const loadAll = useCallback(async () => {
    await Promise.all([loadValidations(), loadActions()]);
  }, [loadValidations, loadActions]);

  // Criar validação
  const createValidation = useCallback(
    async (data: CreateValidationDto): Promise<ColumnValidation> => {
      if (!columnId) {
        throw new Error('ID da coluna é obrigatório');
      }

      setLoading(true);
      setError(null);
      try {
        const validation = await kanbanValidationsApi.createValidation(
          columnId,
          data
        );
        setValidations(prev => [...prev, validation]);
        toast.success('Validação criada com sucesso');
        return validation;
      } catch (err: any) {
        console.error('Erro ao criar validação:', err);
        setError(err.message || 'Erro ao criar validação');
        toast.error(err.message || 'Erro ao criar validação');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [columnId]
  );

  // Atualizar validação
  const updateValidation = useCallback(
    async (
      validationId: string,
      data: UpdateValidationDto
    ): Promise<ColumnValidation> => {
      setLoading(true);
      setError(null);
      try {
        const validation = await kanbanValidationsApi.updateValidation(
          validationId,
          data
        );
        setValidations(prev =>
          prev.map(v => (v.id === validationId ? validation : v))
        );
        toast.success('Validação atualizada com sucesso');
        return validation;
      } catch (err: any) {
        console.error('Erro ao atualizar validação:', err);
        setError(err.message || 'Erro ao atualizar validação');
        toast.error(err.message || 'Erro ao atualizar validação');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Deletar validação
  const deleteValidation = useCallback(
    async (validationId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await kanbanValidationsApi.deleteValidation(validationId);
        setValidations(prev => prev.filter(v => v.id !== validationId));
        toast.success('Validação deletada com sucesso');
      } catch (err: any) {
        console.error('Erro ao deletar validação:', err);
        setError(err.message || 'Erro ao deletar validação');
        toast.error(err.message || 'Erro ao deletar validação');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reordenar validações
  const reorderValidations = useCallback(
    async (validationIds: string[]): Promise<void> => {
      if (!columnId) {
        throw new Error('ID da coluna é obrigatório');
      }

      setLoading(true);
      setError(null);
      try {
        await kanbanValidationsApi.reorderValidations(columnId, validationIds);
        // Atualizar ordem localmente
        setValidations(prev => {
          const ordered = validationIds.map(id => prev.find(v => v.id === id));
          return ordered.filter(Boolean) as ColumnValidation[];
        });
        toast.success('Validações reordenadas com sucesso');
      } catch (err: any) {
        console.error('Erro ao reordenar validações:', err);
        setError(err.message || 'Erro ao reordenar validações');
        toast.error(err.message || 'Erro ao reordenar validações');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [columnId]
  );

  // Criar ação
  const createAction = useCallback(
    async (data: CreateActionDto): Promise<ColumnAction> => {
      if (!columnId) {
        throw new Error('ID da coluna é obrigatório');
      }

      setLoading(true);
      setError(null);
      try {
        const action = await kanbanValidationsApi.createAction(columnId, data);
        setActions(prev => [...prev, action]);
        toast.success('Ação criada com sucesso');
        return action;
      } catch (err: any) {
        console.error('Erro ao criar ação:', err);
        setError(err.message || 'Erro ao criar ação');
        toast.error(err.message || 'Erro ao criar ação');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [columnId]
  );

  // Atualizar ação
  const updateAction = useCallback(
    async (actionId: string, data: UpdateActionDto): Promise<ColumnAction> => {
      setLoading(true);
      setError(null);
      try {
        const action = await kanbanValidationsApi.updateAction(actionId, data);
        setActions(prev => prev.map(a => (a.id === actionId ? action : a)));
        toast.success('Ação atualizada com sucesso');
        return action;
      } catch (err: any) {
        console.error('Erro ao atualizar ação:', err);
        setError(err.message || 'Erro ao atualizar ação');
        toast.error(err.message || 'Erro ao atualizar ação');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Deletar ação
  const deleteAction = useCallback(async (actionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await kanbanValidationsApi.deleteAction(actionId);
      setActions(prev => prev.filter(a => a.id !== actionId));
      toast.success('Ação deletada com sucesso');
    } catch (err: any) {
      console.error('Erro ao deletar ação:', err);
      setError(err.message || 'Erro ao deletar ação');
      toast.error(err.message || 'Erro ao deletar ação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reordenar ações
  const reorderActions = useCallback(
    async (actionIds: string[]): Promise<void> => {
      if (!columnId) {
        throw new Error('ID da coluna é obrigatório');
      }

      setLoading(true);
      setError(null);
      try {
        await kanbanValidationsApi.reorderActions(columnId, actionIds);
        // Atualizar ordem localmente
        setActions(prev => {
          const ordered = actionIds.map(id => prev.find(a => a.id === id));
          return ordered.filter(Boolean) as ColumnAction[];
        });
        toast.success('Ações reordenadas com sucesso');
      } catch (err: any) {
        console.error('Erro ao reordenar ações:', err);
        setError(err.message || 'Erro ao reordenar ações');
        toast.error(err.message || 'Erro ao reordenar ações');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [columnId]
  );

  // Carregar ao mudar columnId
  useEffect(() => {
    if (columnId) {
      loadAll();
    }
  }, [columnId, loadAll]);

  return {
    validations,
    actions,
    loading,
    error,
    loadValidations,
    loadActions,
    loadAll,
    createValidation,
    updateValidation,
    deleteValidation,
    reorderValidations,
    createAction,
    updateAction,
    deleteAction,
    reorderActions,
  };
};

// Hook para histórico
export const useKanbanValidationHistory = (taskId?: string) => {
  const [validationHistory, setValidationHistory] =
    useState<ValidationHistoryResponse | null>(null);
  const [actionHistory, setActionHistory] =
    useState<ActionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadValidationHistory = useCallback(
    async (params?: {
      columnId?: string;
      validationId?: string;
      passed?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      if (!taskId) {
        setValidationHistory(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await kanbanValidationsApi.getValidationHistory(
          taskId,
          params
        );
        setValidationHistory(data);
      } catch (err: any) {
        console.error('Erro ao carregar histórico de validações:', err);
        setError(err.message || 'Erro ao carregar histórico');
      } finally {
        setLoading(false);
      }
    },
    [taskId]
  );

  const loadActionHistory = useCallback(
    async (params?: {
      columnId?: string;
      actionId?: string;
      success?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      if (!taskId) {
        setActionHistory(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await kanbanValidationsApi.getActionHistory(
          taskId,
          params
        );
        setActionHistory(data);
      } catch (err: any) {
        console.error('Erro ao carregar histórico de ações:', err);
        setError(err.message || 'Erro ao carregar histórico');
      } finally {
        setLoading(false);
      }
    },
    [taskId]
  );

  const loadAllHistory = useCallback(async () => {
    await Promise.all([loadValidationHistory(), loadActionHistory()]);
  }, [loadValidationHistory, loadActionHistory]);

  return {
    validationHistory,
    actionHistory,
    loading,
    error,
    loadValidationHistory,
    loadActionHistory,
    loadAllHistory,
  };
};
