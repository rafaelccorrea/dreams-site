import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSave,
  MdTag,
  MdFlag,
  MdVisibility,
  MdSettings,
  MdNotifications,
  MdViewColumn,
  MdTask,
  MdFilterList,
  MdFileDownload,
  MdExtension,
  MdSpeed,
} from 'react-icons/md';
import type {
  KanbanSettings,
  KanbanTag,
  KanbanPriority,
} from '../../types/kanban';

interface KanbanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: KanbanSettings) => void;
  initialSettings?: KanbanSettings;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SaveButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TagList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const TagColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid ${props => props.theme.colors.surface};
`;

const TagName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const TagActions = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const AddTagForm = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TagInput = styled.input`
  flex: 1;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const PriorityList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
`;

const PriorityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const PriorityInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const SettingLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ToggleSwitch = styled.input`
  width: 44px;
  height: 24px;
  background: ${props => props.theme.colors.border};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;

  &:checked {
    background: ${props => props.theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.cardBackground};
    top: 2px;
    left: 2px;
    transition: all 0.2s ease;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

const SelectInput = styled.select`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const NumberInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  width: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.colors.primary};
`;

const SettingDescription = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  cursor: pointer;
  border-bottom: 2px solid
    ${props => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

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

  // Configurações de Negociações
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

export const KanbanSettingsModal: React.FC<KanbanSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings = defaultSettings,
}) => {
  const [settings, setSettings] = useState<KanbanSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState('visual');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [editingPriority, setEditingPriority] = useState<string | null>(null);
  const [editingPriorityLabel, setEditingPriorityLabel] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(initialSettings);
    }
  }, [isOpen, initialSettings]);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const newTag: KanbanTag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: newTagColor,
    };

    setSettings(prev => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));

    setNewTagName('');
    setNewTagColor('#3B82F6');
  };

  const handleDeleteTag = (tagId: string) => {
    setSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId),
    }));
  };

  const handleEditTag = (tagId: string) => {
    const tag = settings.tags.find(t => t.id === tagId);
    if (tag) {
      setEditingTag(tagId);
      setEditingTagName(tag.name);
    }
  };

  const handleSaveTagEdit = (tagId: string) => {
    if (!editingTagName.trim()) return;

    setSettings(prev => ({
      ...prev,
      tags: prev.tags.map(tag =>
        tag.id === tagId ? { ...tag, name: editingTagName.trim() } : tag
      ),
    }));

    setEditingTag(null);
    setEditingTagName('');
  };

  const handleEditPriority = (priorityValue: string) => {
    const priority = settings.priorities.find(p => p.value === priorityValue);
    if (priority) {
      setEditingPriority(priorityValue);
      setEditingPriorityLabel(priority.label);
    }
  };

  const handleSavePriorityEdit = (priorityValue: string) => {
    if (!editingPriorityLabel.trim()) return;

    setSettings(prev => ({
      ...prev,
      priorities: prev.priorities.map(priority =>
        priority.value === priorityValue
          ? { ...priority, label: editingPriorityLabel.trim() }
          : priority
      ),
    }));

    setEditingPriority(null);
    setEditingPriorityLabel('');
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Configurações do Funil de Vendas</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <TabContainer>
            <Tab
              $isActive={activeTab === 'visual'}
              onClick={() => setActiveTab('visual')}
            >
              <MdVisibility size={16} />
              Visual
            </Tab>
            <Tab
              $isActive={activeTab === 'behavior'}
              onClick={() => setActiveTab('behavior')}
            >
              <MdSettings size={16} />
              Comportamento
            </Tab>
            <Tab
              $isActive={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            >
              <MdNotifications size={16} />
              Notificações
            </Tab>
            <Tab
              $isActive={activeTab === 'columns'}
              onClick={() => setActiveTab('columns')}
            >
              <MdViewColumn size={16} />
              Colunas
            </Tab>
            <Tab
              $isActive={activeTab === 'tasks'}
              onClick={() => setActiveTab('tasks')}
            >
              <MdTask size={16} />
              Negociações
            </Tab>
            <Tab
              $isActive={activeTab === 'filters'}
              onClick={() => setActiveTab('filters')}
            >
              <MdFilterList size={16} />
              Filtros
            </Tab>
            <Tab
              $isActive={activeTab === 'export'}
              onClick={() => setActiveTab('export')}
            >
              <MdFileDownload size={16} />
              Exportação
            </Tab>
            <Tab
              $isActive={activeTab === 'integration'}
              onClick={() => setActiveTab('integration')}
            >
              <MdExtension size={16} />
              Integração
            </Tab>
            <Tab
              $isActive={activeTab === 'performance'}
              onClick={() => setActiveTab('performance')}
            >
              <MdSpeed size={16} />
              Performance
            </Tab>
            <Tab
              $isActive={activeTab === 'tags'}
              onClick={() => setActiveTab('tags')}
            >
              <MdTag size={16} />
              Tags & Prioridades
            </Tab>
          </TabContainer>

          {/* Visual Settings */}
          {activeTab === 'visual' && (
            <Section>
              <SectionTitle>
                <MdVisibility size={20} />
                Configurações Visuais
              </SectionTitle>

              <SettingsGrid>
                <SettingItem>
                  <SettingLabel htmlFor='theme'>Tema</SettingLabel>
                  <SelectInput
                    id='theme'
                    value={settings.theme}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        theme: e.target.value as 'light' | 'dark' | 'auto',
                      }))
                    }
                  >
                    <option value='auto'>Automático</option>
                    <option value='light'>Claro</option>
                    <option value='dark'>Escuro</option>
                  </SelectInput>
                  <SettingDescription>
                    Define o tema visual do kanban
                  </SettingDescription>
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='cardDensity'>
                    Densidade dos Cards
                  </SettingLabel>
                  <SelectInput
                    id='cardDensity'
                    value={settings.cardDensity}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        cardDensity: e.target.value as
                          | 'compact'
                          | 'normal'
                          | 'comfortable',
                      }))
                    }
                  >
                    <option value='compact'>Compacto</option>
                    <option value='normal'>Normal</option>
                    <option value='comfortable'>Confortável</option>
                  </SelectInput>
                  <SettingDescription>
                    Controla o espaçamento entre os cards
                  </SettingDescription>
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='showTaskCount'>
                    Mostrar contador de negociações
                  </SettingLabel>
                  <ToggleSwitch
                    id='showTaskCount'
                    type='checkbox'
                    checked={settings.showTaskCount}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        showTaskCount: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='showAssigneeAvatars'>
                    Mostrar avatares dos responsáveis
                  </SettingLabel>
                  <ToggleSwitch
                    id='showAssigneeAvatars'
                    type='checkbox'
                    checked={settings.showAssigneeAvatars}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        showAssigneeAvatars: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='showPriorityIndicators'>
                    Mostrar indicadores de prioridade
                  </SettingLabel>
                  <ToggleSwitch
                    id='showPriorityIndicators'
                    type='checkbox'
                    checked={settings.showPriorityIndicators}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        showPriorityIndicators: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='showDueDateIndicators'>
                    Mostrar indicadores de prazo
                  </SettingLabel>
                  <ToggleSwitch
                    id='showDueDateIndicators'
                    type='checkbox'
                    checked={settings.showDueDateIndicators}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        showDueDateIndicators: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>
              </SettingsGrid>
            </Section>
          )}

          {/* Behavior Settings */}
          {activeTab === 'behavior' && (
            <Section>
              <SectionTitle>
                <MdSettings size={20} />
                Configurações de Comportamento
              </SectionTitle>

              <SettingsGrid>
                <SettingItem>
                  <SettingLabel htmlFor='autoSave'>Auto-save</SettingLabel>
                  <ToggleSwitch
                    id='autoSave'
                    type='checkbox'
                    checked={settings.autoSave}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        autoSave: e.target.checked,
                      }))
                    }
                  />
                  <SettingDescription>
                    Salva automaticamente as alterações
                  </SettingDescription>
                </SettingItem>

                {settings.autoSave && (
                  <SettingItem>
                    <SettingLabel htmlFor='autoSaveInterval'>
                      Intervalo de auto-save (segundos)
                    </SettingLabel>
                    <NumberInput
                      id='autoSaveInterval'
                      type='number'
                      min='5'
                      max='300'
                      value={settings.autoSaveInterval}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          autoSaveInterval: parseInt(e.target.value) || 30,
                        }))
                      }
                    />
                  </SettingItem>
                )}

                <SettingItem>
                  <SettingLabel htmlFor='allowTaskReordering'>
                    Permitir reordenação de negociações
                  </SettingLabel>
                  <ToggleSwitch
                    id='allowTaskReordering'
                    type='checkbox'
                    checked={settings.allowTaskReordering}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        allowTaskReordering: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='allowTaskDuplication'>
                    Permitir duplicação de negociações
                  </SettingLabel>
                  <ToggleSwitch
                    id='allowTaskDuplication'
                    type='checkbox'
                    checked={settings.allowTaskDuplication}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        allowTaskDuplication: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='allowTaskArchiving'>
                    Permitir arquivamento de negociações
                  </SettingLabel>
                  <ToggleSwitch
                    id='allowTaskArchiving'
                    type='checkbox'
                    checked={settings.allowTaskArchiving}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        allowTaskArchiving: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                <SettingItem>
                  <SettingLabel htmlFor='autoArchiveCompleted'>
                    Arquivar negociações concluídas automaticamente
                  </SettingLabel>
                  <ToggleSwitch
                    id='autoArchiveCompleted'
                    type='checkbox'
                    checked={settings.autoArchiveCompleted}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        autoArchiveCompleted: e.target.checked,
                      }))
                    }
                  />
                </SettingItem>

                {settings.autoArchiveCompleted && (
                  <SettingItem>
                    <SettingLabel htmlFor='autoArchiveAfterDays'>
                      Arquivar após (dias)
                    </SettingLabel>
                    <NumberInput
                      id='autoArchiveAfterDays'
                      type='number'
                      min='1'
                      max='365'
                      value={settings.autoArchiveAfterDays}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          autoArchiveAfterDays: parseInt(e.target.value) || 30,
                        }))
                      }
                    />
                  </SettingItem>
                )}
              </SettingsGrid>
            </Section>
          )}

          {/* Tags & Priorities */}
          {activeTab === 'tags' && (
            <>
              <Section>
                <SectionTitle>
                  <MdTag size={20} />
                  Tags Personalizadas
                </SectionTitle>

                <TagList>
                  {settings.tags.map(tag => (
                    <TagItem key={tag.id}>
                      <TagColor color={tag.color} />
                      {editingTag === tag.id ? (
                        <TagInput
                          value={editingTagName}
                          onChange={e => setEditingTagName(e.target.value)}
                          onBlur={() => handleSaveTagEdit(tag.id)}
                          onKeyPress={e =>
                            e.key === 'Enter' && handleSaveTagEdit(tag.id)
                          }
                          autoFocus
                        />
                      ) : (
                        <TagName onClick={() => handleEditTag(tag.id)}>
                          {tag.name}
                        </TagName>
                      )}
                      <TagActions>
                        <ActionButton onClick={() => handleEditTag(tag.id)}>
                          <MdEdit size={16} />
                        </ActionButton>
                        <ActionButton onClick={() => handleDeleteTag(tag.id)}>
                          <MdDelete size={16} />
                        </ActionButton>
                      </TagActions>
                    </TagItem>
                  ))}
                </TagList>

                <AddTagForm>
                  <TagInput
                    placeholder='Nome da tag...'
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                  />
                  <ColorInput
                    type='color'
                    value={newTagColor}
                    onChange={e => setNewTagColor(e.target.value)}
                  />
                  <AddButton onClick={handleAddTag}>
                    <MdAdd size={16} />
                    Adicionar
                  </AddButton>
                </AddTagForm>
              </Section>

              <Section>
                <SectionTitle>
                  <MdFlag size={20} />
                  Prioridades
                </SectionTitle>

                <PriorityList>
                  {settings.priorities.map(priority => (
                    <PriorityItem key={priority.value}>
                      <TagColor color={priority.color} />
                      {editingPriority === priority.value ? (
                        <PriorityInput
                          value={editingPriorityLabel}
                          onChange={e =>
                            setEditingPriorityLabel(e.target.value)
                          }
                          onBlur={() => handleSavePriorityEdit(priority.value)}
                          onKeyPress={e =>
                            e.key === 'Enter' &&
                            handleSavePriorityEdit(priority.value)
                          }
                          autoFocus
                        />
                      ) : (
                        <PriorityInput
                          value={priority.label}
                          readOnly
                          onClick={() => handleEditPriority(priority.value)}
                        />
                      )}
                      <ActionButton
                        onClick={() => handleEditPriority(priority.value)}
                      >
                        <MdEdit size={16} />
                      </ActionButton>
                    </PriorityItem>
                  ))}
                </PriorityList>
              </Section>
            </>
          )}
        </ModalContent>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SaveButton onClick={handleSave}>
            <MdSave size={16} />
            Salvar Configurações
          </SaveButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default KanbanSettingsModal;
