import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdViewColumn,
  MdViewDay,
  MdFullscreen,
  MdDensityMedium,
  MdZoomIn,
  MdAutoAwesome,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import {
  useKanbanViewSettings,
  type KanbanViewSettings,
} from '../hooks/useKanbanViewSettings';

const PageContainer = styled.div`
  padding: 20px 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0;
  gap: 24px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: ${props => props.theme.colors.primary}20;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
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

const ToggleOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

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
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: ${props => props.theme.colors.primary};
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
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: ${props =>
      props.$isActive ? 'translateX(24px)' : 'translateX(0)'};
  }
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PageFooter = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

const KanbanSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings: initialSettings, saveSettings } = useKanbanViewSettings();
  const [settings, setSettings] = useState<KanbanViewSettings>(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = () => {
    console.log('💾 Salvando configurações:', settings);
    console.log('💾 cardDensity:', settings.cardDensity);
    console.log('💾 zoomLevel:', settings.zoomLevel);
    saveSettings(settings);
    // Pequeno delay para garantir que o localStorage foi atualizado
    setTimeout(() => {
      navigate(-1); // Volta para a página anterior
    }, 100);
  };

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <HeaderLeft>
              <TitleSection>
                <Title>Configurações do Funil de Vendas</Title>
                <Subtitle>
                  Personalize a aparência e comportamento do seu quadro
                </Subtitle>
              </TitleSection>
            </HeaderLeft>
            <HeaderRight>
              <BackButton onClick={handleCancel} title='Voltar'>
                <MdArrowBack size={18} />
                <span>Voltar</span>
              </BackButton>
            </HeaderRight>
          </HeaderTop>
        </PageHeader>

        <PageBody>
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
                  <ToggleSlider $isActive={settings.showTaskCount} />
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
                  <ToggleSlider $isActive={settings.showAssigneeAvatars} />
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
                  <ToggleSlider $isActive={settings.showPriorityBorder} />
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
                  <ToggleSlider $isActive={settings.showCompletedTasks} />
                </ToggleSwitch>
              </ToggleOption>
            </OptionGroup>
          </Section>
        </PageBody>

        <PageFooter>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button $variant='primary' onClick={handleSave}>
            Salvar Configurações
          </Button>
        </PageFooter>
      </PageContainer>
    </Layout>
  );
};

export default KanbanSettingsPage;
