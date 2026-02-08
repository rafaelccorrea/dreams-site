import { api } from './api';

export interface EmailSequenceStep {
  order: number;
  delayHours: number;
  subject: string;
  message: string;
  recipients: Array<{
    type: 'task_assignee' | 'custom' | 'user' | 'role' | 'team';
    email?: string;
    userId?: string;
    role?: string;
    teamId?: string;
  }>;
}

export interface EmailSequence {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  stopOnReply: boolean;
  stopOnUnsubscribe: boolean;
  steps: EmailSequenceStep[];
  isActive: boolean;
  usageCount: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailSequenceDto {
  name: string;
  description?: string;
  stopOnReply?: boolean;
  stopOnUnsubscribe?: boolean;
  steps: EmailSequenceStep[];
  isActive?: boolean;
}

export interface UpdateEmailSequenceDto {
  name?: string;
  description?: string;
  stopOnReply?: boolean;
  stopOnUnsubscribe?: boolean;
  steps?: EmailSequenceStep[];
  isActive?: boolean;
}

export interface SequenceExecutionStatus {
  status: 'active' | 'paused' | 'completed' | 'stopped' | 'cancelled';
  currentStep: number;
  startedAt: string;
  nextStepAt?: string;
  completedSteps: number;
  totalSteps: number;
}

class KanbanEmailSequencesApiService {
  private baseUrl = '/kanban/email-sequences';

  /**
   * Listar todas as sequências
   */
  async listSequences(params?: {
    isActive?: boolean;
  }): Promise<EmailSequence[]> {
    try {
      const response = await api.get<EmailSequence[]>(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar sequências:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter sequência por ID
   */
  async getSequence(sequenceId: string): Promise<EmailSequence> {
    try {
      const response = await api.get<EmailSequence>(
        `${this.baseUrl}/${sequenceId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar sequência:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Criar sequência
   */
  async createSequence(data: CreateEmailSequenceDto): Promise<EmailSequence> {
    try {
      const response = await api.post<EmailSequence>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar sequência:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar sequência
   */
  async updateSequence(
    sequenceId: string,
    data: UpdateEmailSequenceDto
  ): Promise<EmailSequence> {
    try {
      const response = await api.put<EmailSequence>(
        `${this.baseUrl}/${sequenceId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar sequência:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remover sequência
   */
  async deleteSequence(sequenceId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${sequenceId}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover sequência:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verificar status da execução de uma sequência para uma tarefa
   */
  async getExecutionStatus(
    sequenceId: string,
    taskId: string
  ): Promise<SequenceExecutionStatus> {
    try {
      const response = await api.get<SequenceExecutionStatus>(
        `${this.baseUrl}/${sequenceId}/executions/${taskId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar status de execução:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error(error.message || 'Erro desconhecido');
  }
}

export const kanbanEmailSequencesApi = new KanbanEmailSequencesApiService();
