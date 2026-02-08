import { useState, useEffect, useCallback } from 'react';
import type { KanbanSettings } from '../types/kanban';

const STORAGE_KEY = 'kanban-settings';

const defaultSettings: KanbanSettings = {
  // Tags e Prioridades
  tags: [
    { id: '1', name: 'Emergência', color: '#DC2626' },
    { id: '2', name: 'Sem Prioridade', color: '#6B7280' },
    { id: '3', name: 'Reunião', color: '#3B82F6' },
    { id: '4', name: 'Documentação', color: '#10B981' },
  ],
  priorities: [
    { value: 'low', label: 'Baixa', color: '#10B981' },
    { value: 'medium', label: 'Média', color: '#F59E0B' },
    { value: 'high', label: 'Alta', color: '#EF4444' },
    { value: 'urgent', label: 'Urgente', color: '#DC2626' },
  ],

  // Configurações Visuais
  theme: 'auto',
  cardDensity: 'normal',
  showTaskCount: true,
  showAssigneeAvatars: true,
  showPriorityIndicators: true,
  showDueDateIndicators: true,
  defaultColumnColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],

  // Configurações de Comportamento
  autoSave: true,
  autoSaveInterval: 30,
  allowTaskReordering: true,
  allowTaskDuplication: true,
  allowTaskArchiving: true,
  autoArchiveCompleted: false,
  autoArchiveAfterDays: 30,

  // Configurações de Notificações
  enableNotifications: true,
  notifyOnTaskAssignment: true,
  notifyOnDueDateApproaching: true,
  notifyOnDueDateOverdue: true,
  dueDateWarningDays: 3,

  // Configurações de Colunas
  allowColumnCreation: true,
  allowColumnDeletion: true,
  allowColumnReordering: true,
  maxColumnsPerBoard: 10,
  defaultColumnLimit: 50,

  // Configurações de Tarefas
  defaultTaskPriority: 'medium',
  requireTaskDescription: false,
  allowTaskComments: true,
  allowTaskAttachments: true,
  maxTaskTitleLength: 100,
  maxTaskDescriptionLength: 1000,

  // Configurações de Filtros
  enableAdvancedFilters: true,
  saveFilterPresets: true,
  defaultFilterView: 'all',

  // Configurações de Exportação
  allowExport: true,
  exportFormats: ['pdf', 'excel', 'csv'],
  includeCompletedTasks: true,
  includeTaskHistory: false,

  // Configurações de Integração
  enableWebhooks: false,
  syncWithCalendar: false,

  // Configurações de Performance
  enableVirtualization: true,
  maxTasksPerColumn: 100,
  enableLazyLoading: true,
  cacheExpirationTime: 15,
};

export const useKanbanSettings = () => {
  const [settings, setSettings] = useState<KanbanSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do Kanban:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = useCallback((newSettings: KanbanSettings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      // console.log('✅ Configurações do Kanban salvas');
    } catch (error) {
      console.error('❌ Erro ao salvar configurações do Kanban:', error);
      throw error;
    }
  }, []);

  // Resetar para configurações padrão
  const resetSettings = useCallback(() => {
    try {
      setSettings(defaultSettings);
      localStorage.removeItem(STORAGE_KEY);
      // console.log('🔄 Configurações do Kanban resetadas');
    } catch (error) {
      console.error('❌ Erro ao resetar configurações do Kanban:', error);
      throw error;
    }
  }, []);

  // Obter tag por ID
  const getTagById = useCallback(
    (tagId: string) => {
      return settings.tags.find(tag => tag.id === tagId);
    },
    [settings.tags]
  );

  // Obter prioridade por valor
  const getPriorityByValue = useCallback(
    (priorityValue: string) => {
      return settings.priorities.find(
        priority => priority.value === priorityValue
      );
    },
    [settings.priorities]
  );

  // Verificar se uma funcionalidade está habilitada
  const isFeatureEnabled = useCallback(
    (feature: keyof KanbanSettings) => {
      return Boolean(settings[feature]);
    },
    [settings]
  );

  return {
    settings,
    loading,
    saveSettings,
    resetSettings,
    getTagById,
    getPriorityByValue,
    isFeatureEnabled,
  };
};
