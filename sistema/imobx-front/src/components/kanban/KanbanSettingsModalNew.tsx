import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdViewColumn,
  MdViewDay,
  MdFullscreen,
  MdDensityMedium,
  MdNotifications,
  MdAutoAwesome,
  MdSort,
  MdSettings,
  MdZoomIn,
  MdVisibility,
  MdVisibilityOff,
  MdPalette,
  MdTune,
  MdSearch,
  MdFilterList,
  MdBorderAll,
  MdBlurOn,
} from 'react-icons/md';

interface KanbanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: KanbanViewSettings) => void;
  initialSettings?: KanbanViewSettings;
}

export interface KanbanViewSettings {
  // Visualização
  viewMode: 'scroll' | 'fullscreen';
  cardDensity: 'compact' | 'normal' | 'comfortable';
  columnScrollMode: 'scroll' | 'expand';
  zoomLevel: 'small' | 'normal' | 'large';

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
  cardTitleLines: number;
  cardDescriptionLines: number;
  cardBorderStyle: 'none' | 'left' | 'top' | 'full';
  cardShadow: 'none' | 'subtle' | 'medium' | 'strong';

  // Cores e Temas
  columnHeaderStyle: 'simple' | 'gradient' | 'colored';
  cardBackgroundStyle: 'solid' | 'gradient' | 'glass';
  priorityColorStyle: 'minimal' | 'vibrant' | 'pastel';

  // Comportamento
  enableNotifications: boolean;
  autoRefresh: boolean;
  autoRefreshInterval: number;

  // Filtros e Busca
  defaultFilterBy: 'all' | 'assigned' | 'unassigned' | 'overdue' | 'today';
  showSearchBar: boolean;
  enableQuickFilters: boolean;

  // Ordenação
  defaultSortBy: 'position' | 'priority' | 'dueDate' | 'createdAt' | 'title';
  sortDirection: 'asc' | 'desc';
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 100px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(40px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15 0%,
    ${props => props.theme.colors.background} 100%
  );
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.border};
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    transform: rotate(90deg);
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  max-height: calc(85vh - 220px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ViewModeOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ViewModeCard = styled.button<{ $isActive: boolean }>`
  background: ${props =>
    props.$isActive
      ? `linear-gradient(135deg, ${props.theme.colors.primary}20 0%, ${props.theme.colors.primary}10 100%)`
      : props.theme.colors.background};
  border: 2px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.theme.colors.primary}20;
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ViewModeIcon = styled.div<{ $isActive: boolean }>`
  font-size: 32px;
  color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  margin-bottom: 12px;
  transition: all 0.3s ease;
`;

const ViewModeTitle = styled.div<{ $isActive: boolean }>`
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
  margin-bottom: 6px;
`;

const ViewModeDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const ToggleOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}10;
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToggleTitle = styled.div`
  font-size: 0.938rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ToggleDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: ${props => props.theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  background: ${props =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 28px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ToggleSlider = styled.span<{ $isActive: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 28px;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    height: 22px;
    width: 22px;
    left: ${props => (props.$isActive ? '25px' : '3px')};
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const DensityOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const DensityButton = styled.button<{ $isActive: boolean }>`
  padding: 14px;
  background: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.background};
  color: ${props => (props.$isActive ? 'white' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${props =>
        props.$isActive
          ? props.theme.colors.primary
          : props.theme.colors.border}40;
  }
`;

const SelectInput = styled.select`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const NumberInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  width: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const SelectOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}10;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.background};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
      box-shadow: 0 6px 20px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.border};
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

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

export const KanbanSettingsModalNew: React.FC<KanbanSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings = defaultSettings,
}) => {
  const [settings, setSettings] = useState<KanbanViewSettings>(initialSettings);

  useEffect(() => {
    if (isOpen) {
      // console.log('🔧 Modal abrindo com configurações iniciais:', initialSettings);
      setSettings(initialSettings);
    }
  }, [isOpen, initialSettings]);

  // Debug: Monitorar mudanças nas configurações do modal
  useEffect(() => {
    // console.log('🔄 Configurações do modal mudaram:', settings);
  }, [settings]);

  const handleSave = () => {
    // console.log('💾 Modal salvando configurações:', settings);
    onSave(settings);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <HeaderTop>
            <Title>Configurações do Funil de Vendas</Title>
            <CloseButton onClick={onClose}>
              <MdClose size={20} />
            </CloseButton>
          </HeaderTop>
          <Subtitle>
            Personalize a aparência e comportamento do seu quadro
          </Subtitle>
        </ModalHeader>

        <ModalBody>
          {/* Modo de Visualização */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <MdViewColumn />
              </SectionIcon>
              <SectionTitle>Modo de Visualização</SectionTitle>
            </SectionHeader>

            <ViewModeOptions>
              <ViewModeCard
                $isActive={settings.viewMode === 'scroll'}
                onClick={() => setSettings({ ...settings, viewMode: 'scroll' })}
              >
                <ViewModeIcon $isActive={settings.viewMode === 'scroll'}>
                  <MdViewDay />
                </ViewModeIcon>
                <ViewModeTitle $isActive={settings.viewMode === 'scroll'}>
                  Modo Padrão
                </ViewModeTitle>
                <ViewModeDescription>
                  Colunas com largura fixa (320px) e scroll horizontal. Ideal
                  para trabalho normal.
                </ViewModeDescription>
              </ViewModeCard>

              <ViewModeCard
                $isActive={settings.viewMode === 'fullscreen'}
                onClick={() =>
                  setSettings({ ...settings, viewMode: 'fullscreen' })
                }
              >
                <ViewModeIcon $isActive={settings.viewMode === 'fullscreen'}>
                  <MdFullscreen />
                </ViewModeIcon>
                <ViewModeTitle $isActive={settings.viewMode === 'fullscreen'}>
                  Modo Expandido
                </ViewModeTitle>
                <ViewModeDescription>
                  Colunas maiores que expandem para aproveitar a tela. Sempre
                  com scroll horizontal.
                </ViewModeDescription>
              </ViewModeCard>
            </ViewModeOptions>
          </Section>

          {/* Modo de Scroll das Colunas */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <MdViewColumn />
              </SectionIcon>
              <SectionTitle>Comportamento das Colunas</SectionTitle>
            </SectionHeader>

            <ViewModeOptions>
              <ViewModeCard
                $isActive={settings.columnScrollMode === 'scroll'}
                onClick={() =>
                  setSettings({ ...settings, columnScrollMode: 'scroll' })
                }
              >
                <ViewModeIcon
                  $isActive={settings.columnScrollMode === 'scroll'}
                >
                  <MdViewDay />
                </ViewModeIcon>
                <ViewModeTitle
                  $isActive={settings.columnScrollMode === 'scroll'}
                >
                  Colunas com Scroll
                </ViewModeTitle>
                <ViewModeDescription>
                  Cada coluna tem altura máxima e scroll interno. Ideal para
                  muitas negociações.
                </ViewModeDescription>
              </ViewModeCard>

              <ViewModeCard
                $isActive={settings.columnScrollMode === 'expand'}
                onClick={() =>
                  setSettings({ ...settings, columnScrollMode: 'expand' })
                }
              >
                <ViewModeIcon
                  $isActive={settings.columnScrollMode === 'expand'}
                >
                  <MdFullscreen />
                </ViewModeIcon>
                <ViewModeTitle
                  $isActive={settings.columnScrollMode === 'expand'}
                >
                  Colunas Expandidas
                </ViewModeTitle>
                <ViewModeDescription>
                  Cards soltos sem limite de altura. A página inteira tem
                  scroll.
                </ViewModeDescription>
              </ViewModeCard>
            </ViewModeOptions>
          </Section>

          {/* Densidade dos Cards */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <MdDensityMedium />
              </SectionIcon>
              <SectionTitle>Densidade dos Cards</SectionTitle>
            </SectionHeader>

            <DensityOptions>
              <DensityButton
                $isActive={settings.cardDensity === 'compact'}
                onClick={() =>
                  setSettings({ ...settings, cardDensity: 'compact' })
                }
              >
                Compacto
              </DensityButton>
              <DensityButton
                $isActive={settings.cardDensity === 'normal'}
                onClick={() =>
                  setSettings({ ...settings, cardDensity: 'normal' })
                }
              >
                Normal
              </DensityButton>
              <DensityButton
                $isActive={settings.cardDensity === 'comfortable'}
                onClick={() =>
                  setSettings({ ...settings, cardDensity: 'comfortable' })
                }
              >
                Confortável
              </DensityButton>
            </DensityOptions>
          </Section>

          {/* Nível de Zoom */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <MdZoomIn />
              </SectionIcon>
              <SectionTitle>Nível de Zoom</SectionTitle>
            </SectionHeader>

            <DensityOptions>
              <DensityButton
                $isActive={settings.zoomLevel === 'small'}
                onClick={() => setSettings({ ...settings, zoomLevel: 'small' })}
              >
                Pequeno
              </DensityButton>
              <DensityButton
                $isActive={settings.zoomLevel === 'normal'}
                onClick={() =>
                  setSettings({ ...settings, zoomLevel: 'normal' })
                }
              >
                Normal
              </DensityButton>
              <DensityButton
                $isActive={settings.zoomLevel === 'large'}
                onClick={() => setSettings({ ...settings, zoomLevel: 'large' })}
              >
                Grande
              </DensityButton>
            </DensityOptions>
          </Section>

          {/* Opções de Exibição */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <MdAutoAwesome />
              </SectionIcon>
              <SectionTitle>Opções de Exibição</SectionTitle>
            </SectionHeader>

            <OptionGroup>
              <ToggleOption>
                <ToggleLabel>
                  <ToggleTitle>Contador de negociações</ToggleTitle>
                  <ToggleDescription>
                    Mostra o número de negociações em cada coluna
                  </ToggleDescription>
                </ToggleLabel>
                <ToggleSwitch>
                  <ToggleInput
                    type='checkbox'
                    checked={settings.showTaskCount}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        showTaskCount: e.target.checked,
                      })
                    }
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </ToggleOption>

              <ToggleOption>
                <ToggleLabel>
                  <ToggleTitle>Avatares dos responsáveis</ToggleTitle>
                  <ToggleDescription>
                    Exibe a foto do responsável nos cards
                  </ToggleDescription>
                </ToggleLabel>
                <ToggleSwitch>
                  <ToggleInput
                    type='checkbox'
                    checked={settings.showAssigneeAvatars}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        showAssigneeAvatars: e.target.checked,
                      })
                    }
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </ToggleOption>

              <ToggleOption>
                <ToggleLabel>
                  <ToggleTitle>Borda colorida de prioridade</ToggleTitle>
                  <ToggleDescription>
                    Exibe uma borda colorida à esquerda do card conforme a
                    prioridade
                  </ToggleDescription>
                </ToggleLabel>
                <ToggleSwitch>
                  <ToggleInput
                    type='checkbox'
                    checked={settings.showPriorityBorder}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        showPriorityBorder: e.target.checked,
                      })
                    }
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </ToggleOption>

              <ToggleOption>
                <ToggleLabel>
                  <ToggleTitle>Mostrar negociações concluídas</ToggleTitle>
                  <ToggleDescription>
                    Exibe negociações marcadas como concluídas no quadro
                  </ToggleDescription>
                </ToggleLabel>
                <ToggleSwitch>
                  <ToggleInput
                    type='checkbox'
                    checked={settings.showCompletedTasks}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        showCompletedTasks: e.target.checked,
                      })
                    }
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </ToggleOption>
            </OptionGroup>
          </Section>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button $variant='primary' onClick={handleSave}>
            Salvar Configurações
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
