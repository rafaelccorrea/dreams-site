import { useState, useEffect, useCallback } from 'react';

export interface KanbanViewSettings {
  // Visualização
  viewMode: 'scroll' | 'fullscreen';
  cardDensity: 'compact' | 'normal' | 'comfortable';
  columnScrollMode: 'scroll' | 'expand'; // scroll = colunas com scroll, expand = colunas expandem livremente
  zoomLevel: 'small' | 'normal' | 'large'; // zoom = pequeno, normal, grande

  // Exibição
  showTaskCount: boolean;
  showAssigneeAvatars: boolean;
  showCompletedTasks: boolean;
  showPriorityBorder: boolean;
  showTaskDescription: boolean;
  showTaskTags: boolean;
  showDueDateIndicators: boolean;
  showPriorityIndicators: boolean;

  // Layout dos Cards
  cardTitleLines: number; // número de linhas para título (1-4)
  cardDescriptionLines: number; // número de linhas para descrição (1-5)
  cardBorderStyle: 'none' | 'left' | 'top' | 'full'; // estilo da borda
  cardShadow: 'none' | 'subtle' | 'medium' | 'strong'; // intensidade da sombra

  // Cores e Temas
  columnHeaderStyle: 'simple' | 'gradient' | 'colored'; // estilo do cabeçalho da coluna
  cardBackgroundStyle: 'solid' | 'gradient' | 'glass'; // estilo do fundo do card
  priorityColorStyle: 'minimal' | 'vibrant' | 'pastel'; // estilo das cores de prioridade

  // Comportamento
  enableNotifications: boolean;
  autoRefresh: boolean;
  autoRefreshInterval: number; // em segundos

  // Filtros e Busca
  defaultFilterBy: 'all' | 'assigned' | 'unassigned' | 'overdue' | 'today';
  showSearchBar: boolean;
  enableQuickFilters: boolean;

  // Ordenação
  defaultSortBy: 'position' | 'priority' | 'dueDate' | 'createdAt' | 'title';
  sortDirection: 'asc' | 'desc';
}

const STORAGE_KEY = 'kanban-view-settings';

const defaultSettings: KanbanViewSettings = {
  // Visualização
  viewMode: 'scroll',
  cardDensity: 'normal',
  columnScrollMode: 'scroll',
  zoomLevel: 'normal',

  // Exibição
  showTaskCount: true,
  showAssigneeAvatars: true,
  showCompletedTasks: true,
  showPriorityBorder: true,
  showTaskDescription: true,
  showTaskTags: true,
  showDueDateIndicators: true,
  showPriorityIndicators: true,

  // Layout dos Cards
  cardTitleLines: 3,
  cardDescriptionLines: 3,
  cardBorderStyle: 'left',
  cardShadow: 'medium',

  // Cores e Temas
  columnHeaderStyle: 'gradient',
  cardBackgroundStyle: 'solid',
  priorityColorStyle: 'vibrant',

  // Comportamento
  enableNotifications: true,
  autoRefresh: false,
  autoRefreshInterval: 30,

  // Filtros e Busca
  defaultFilterBy: 'all',
  showSearchBar: true,
  enableQuickFilters: true,

  // Ordenação
  defaultSortBy: 'position',
  sortDirection: 'asc',
};

export const useKanbanViewSettings = () => {
  const [settings, setSettings] = useState<KanbanViewSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Função para carregar configurações
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const mergedSettings = { ...defaultSettings, ...parsed };
        setSettings(mergedSettings);
        return mergedSettings;
      } else {
        setSettings(defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error(
        '❌ Erro ao carregar configurações de visualização:',
        error
      );
      setSettings(defaultSettings);
      return defaultSettings;
    }
  }, []);

  // Carregar configurações do localStorage
  useEffect(() => {
    loadSettings();
    setLoading(false);
  }, [loadSettings]);

  // Escutar mudanças no localStorage de outras abas/componentes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const mergedSettings = { ...defaultSettings, ...parsed };
          setSettings(mergedSettings);
        } catch (error) {
          console.error('❌ Erro ao processar mudança no localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Também escutar mudanças customizadas (para mesma aba)
    const handleCustomStorageChange = () => {
      loadSettings();
    };

    window.addEventListener(
      'kanban-settings-updated',
      handleCustomStorageChange
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'kanban-settings-updated',
        handleCustomStorageChange
      );
    };
  }, [loadSettings]);

  // Debug: Monitorar mudanças nas configurações
  useEffect(() => {
    // console.log('🔄 Configurações de visualização mudaram:', settings);
  }, [settings]);

  // Salvar configurações no localStorage
  const saveSettings = useCallback((newSettings: KanbanViewSettings) => {
    try {
      console.log('💾 useKanbanViewSettings - Salvando:', newSettings);
      console.log(
        '💾 useKanbanViewSettings - cardDensity:',
        newSettings.cardDensity
      );
      console.log(
        '💾 useKanbanViewSettings - zoomLevel:',
        newSettings.zoomLevel
      );

      // Criar novo objeto para forçar atualização do React
      const updatedSettings = { ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));

      // Disparar evento customizado para atualizar outros componentes na mesma aba
      window.dispatchEvent(new Event('kanban-settings-updated'));

      console.log(
        '✅ useKanbanViewSettings - Configurações salvas e evento disparado'
      );
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      throw error;
    }
  }, []);

  // Resetar para configurações padrão
  const resetSettings = useCallback(() => {
    try {
      setSettings(defaultSettings);
      localStorage.removeItem(STORAGE_KEY);
      // console.log('🔄 Configurações resetadas');
    } catch (error) {
      console.error('❌ Erro ao resetar configurações:', error);
      throw error;
    }
  }, []);

  return {
    settings,
    loading,
    saveSettings,
    resetSettings,
  };
};
