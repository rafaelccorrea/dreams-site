import { useState, useCallback } from 'react';
import { checklistService } from '../services/checklist.service';
import type {
  ChecklistResponseDto,
  CreateChecklistDto,
  UpdateChecklistDto,
  UpdateItemStatusDto,
  ChecklistFilter,
} from '../types/checklist.types';
import { toast } from 'react-toastify';

export const useChecklists = () => {
  const [checklists, setChecklists] = useState<ChecklistResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar todos os checklists com filtros opcionais
   */
  const fetchChecklists = useCallback(async (filters?: ChecklistFilter) => {
    try {
      setLoading(true);
      setError(null);
      const data = await checklistService.getAll(filters);
      setChecklists(data);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar checklists';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar checklist por ID
   */
  const fetchChecklistById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await checklistService.getById(id);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar checklist';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Criar novo checklist
   */
  const createChecklist = useCallback(
    async (data: CreateChecklistDto): Promise<ChecklistResponseDto | null> => {
      try {
        setLoading(true);
        setError(null);
        const checklist = await checklistService.create(data);
        toast.success('Checklist criado com sucesso!');
        // Atualizar lista após criação
        await fetchChecklists();
        return checklist;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao criar checklist';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchChecklists]
  );

  /**
   * Atualizar checklist completo
   */
  const updateChecklist = useCallback(
    async (
      id: string,
      data: UpdateChecklistDto
    ): Promise<ChecklistResponseDto | null> => {
      try {
        setLoading(true);
        setError(null);
        const checklist = await checklistService.update(id, data);
        toast.success('Checklist atualizado com sucesso!');
        // Atualizar lista após atualização
        await fetchChecklists();
        return checklist;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao atualizar checklist';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchChecklists]
  );

  /**
   * Atualizar status de um item específico
   */
  const updateItemStatus = useCallback(
    async (
      checklistId: string,
      itemId: string,
      status: UpdateItemStatusDto['status'],
      notes?: string
    ): Promise<ChecklistResponseDto | null> => {
      try {
        setLoading(true);
        setError(null);
        const checklist = await checklistService.updateItemStatus(checklistId, {
          itemId,
          status,
          notes,
        });
        toast.success('Status do item atualizado!');
        return checklist;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao atualizar status do item';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Remover checklist
   */
  const deleteChecklist = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await checklistService.delete(id);
        toast.success('Checklist removido com sucesso!');
        // Atualizar lista após remoção
        await fetchChecklists();
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao remover checklist';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchChecklists]
  );

  return {
    checklists,
    loading,
    error,
    fetchChecklists,
    fetchChecklistById,
    createChecklist,
    updateChecklist,
    updateItemStatus,
    deleteChecklist,
  };
};
