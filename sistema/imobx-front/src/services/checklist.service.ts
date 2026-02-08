import { api } from './api';
import type {
  ChecklistResponseDto,
  CreateChecklistDto,
  UpdateChecklistDto,
  UpdateItemStatusDto,
  ChecklistFilter,
} from '../types/checklist.types';

class ChecklistService {
  /**
   * Criar um novo checklist
   */
  async create(data: CreateChecklistDto): Promise<ChecklistResponseDto> {
    const response = await api.post<ChecklistResponseDto>(
      '/sale-checklists',
      data
    );
    return response.data;
  }

  /**
   * Listar todos os checklists com filtros opcionais
   */
  async getAll(filters?: ChecklistFilter): Promise<ChecklistResponseDto[]> {
    const response = await api.get<ChecklistResponseDto[]>('/sale-checklists', {
      params: filters,
    });
    return response.data;
  }

  /**
   * Buscar checklist por ID
   */
  async getById(id: string): Promise<ChecklistResponseDto> {
    const response = await api.get<ChecklistResponseDto>(
      `/sale-checklists/${id}`
    );
    return response.data;
  }

  /**
   * Atualizar checklist completo
   */
  async update(
    id: string,
    data: UpdateChecklistDto
  ): Promise<ChecklistResponseDto> {
    const response = await api.patch<ChecklistResponseDto>(
      `/sale-checklists/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Atualizar status de um item específico
   */
  async updateItemStatus(
    id: string,
    data: UpdateItemStatusDto
  ): Promise<ChecklistResponseDto> {
    const response = await api.patch<ChecklistResponseDto>(
      `/sale-checklists/${id}/item-status`,
      data
    );
    return response.data;
  }

  /**
   * Remover checklist (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/sale-checklists/${id}`);
  }
}

export const checklistService = new ChecklistService();
