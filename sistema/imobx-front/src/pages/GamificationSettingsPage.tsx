import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { gamificationService } from '@/services/gamification.service';
import type { GamificationConfig } from '@/types/gamification.types';
import styled from 'styled-components';
import {
  MdSave,
  MdToggleOn,
  MdToggleOff,
  MdAttachMoney,
  MdPeople,
  MdCheckCircle,
  MdVisibility,
  MdNotifications,
  MdMessage,
  MdArrowBack,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { SettingsShimmer } from '@/components/shimmer/SettingsShimmer';

export const GamificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<GamificationConfig | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await gamificationService.getConfig();
      setConfig(data);
    } catch (error) {
      toast.error('Erro ao carregar configuração');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      await gamificationService.updateConfig(config);
      toast.success('Configuração salva com sucesso!');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao salvar configuração'
      );
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof GamificationConfig, value: any) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  if (loading || !config) {
    return (
      <Layout>
        <SettingsShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <TitleSection>
            <TitleRow>
              <Title>Configuração de Gamificação</Title>
              <BackButton onClick={() => navigate('/gamification')}>
                <MdArrowBack />
                Voltar
              </BackButton>
            </TitleRow>
            <Subtitle>
              Configure o sistema de gamificação para sua empresa
            </Subtitle>
          </TitleSection>
        </Header>

        {/* Ativação */}
        <Card>
          <SectionTitle>
            {config.isEnabled ? <MdToggleOn /> : <MdToggleOff />}
            Status da Gamificação
          </SectionTitle>
          <ToggleContainer>
            <ToggleSwitch
              $active={config.isEnabled}
              onClick={() => updateConfig('isEnabled', !config.isEnabled)}
            >
              <ToggleSlider $active={config.isEnabled} />
            </ToggleSwitch>
            <ToggleLabel>
              {config.isEnabled ? (
                <EnabledText>✅ Gamificação Ativada</EnabledText>
              ) : (
                <DisabledText>❌ Gamificação Desativada</DisabledText>
              )}
            </ToggleLabel>
          </ToggleContainer>
          {!config.isEnabled && (
            <Warning>
              ⚠️ Quando desativado, os usuários não poderão acessar a página de
              gamificação
            </Warning>
          )}
        </Card>

        {/* Pontos de Vendas */}
        <Card>
          <SectionTitle>
            <MdAttachMoney />
            Pontos de Vendas
          </SectionTitle>
          <Grid>
            <FormGroup>
              <Label>Venda de Imóvel</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsPropertySale}
                  onChange={e =>
                    updateConfig('pointsPropertySale', Number(e.target.value))
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Aluguel Criado</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsRentalCreated}
                  onChange={e =>
                    updateConfig('pointsRentalCreated', Number(e.target.value))
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Multiplicador de Comissão</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  step='0.01'
                  value={config.pointsCommissionMultiplier}
                  onChange={e =>
                    updateConfig(
                      'pointsCommissionMultiplier',
                      Number(e.target.value)
                    )
                  }
                />
                <InputSuffix>pts/R$</InputSuffix>
              </InputGroup>
              <HintText>Pontos por cada R$ 1 de comissão</HintText>
            </FormGroup>
          </Grid>
        </Card>

        {/* Pontos de Relacionamento */}
        <Card>
          <SectionTitle>
            <MdPeople />
            Pontos de Relacionamento
          </SectionTitle>
          <Grid>
            <FormGroup>
              <Label>Novo Cliente</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsNewClient}
                  onChange={e =>
                    updateConfig('pointsNewClient', Number(e.target.value))
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Contato com Cliente</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsClientContact}
                  onChange={e =>
                    updateConfig('pointsClientContact', Number(e.target.value))
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Reunião Agendada</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsMeetingScheduled}
                  onChange={e =>
                    updateConfig(
                      'pointsMeetingScheduled',
                      Number(e.target.value)
                    )
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>
          </Grid>
        </Card>

        {/* Pontos de Atividade */}
        <Card>
          <SectionTitle>
            <MdCheckCircle />
            Pontos de Atividade
          </SectionTitle>
          <Grid>
            <FormGroup>
              <Label>Imóvel Cadastrado</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsPropertyCreated}
                  onChange={e =>
                    updateConfig(
                      'pointsPropertyCreated',
                      Number(e.target.value)
                    )
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Vistoria Concluída</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsInspectionCompleted}
                  onChange={e =>
                    updateConfig(
                      'pointsInspectionCompleted',
                      Number(e.target.value)
                    )
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Tarefa Completada</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsTaskCompleted}
                  onChange={e =>
                    updateConfig('pointsTaskCompleted', Number(e.target.value))
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Chave Entregue</Label>
              <InputGroup>
                <Input
                  type='number'
                  min='0'
                  value={config.pointsKeyDelivered}
                  onChange={e =>
                    updateConfig('pointsKeyDelivered', Number(e.target.value))
                  }
                />
                <InputSuffix>pontos</InputSuffix>
              </InputGroup>
            </FormGroup>
          </Grid>
        </Card>

        {/* Visibilidade */}
        <Card>
          <SectionTitle>
            <MdVisibility />
            Configurações de Visibilidade
          </SectionTitle>
          <CheckboxGrid>
            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.showIndividualRanking}
                onChange={e =>
                  updateConfig('showIndividualRanking', e.target.checked)
                }
              />
              Mostrar Ranking Individual
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.showTeamRanking}
                onChange={e =>
                  updateConfig('showTeamRanking', e.target.checked)
                }
              />
              Mostrar Ranking de Equipes
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.showAchievements}
                onChange={e =>
                  updateConfig('showAchievements', e.target.checked)
                }
              />
              Mostrar Conquistas
            </CheckboxLabel>
          </CheckboxGrid>
        </Card>

        {/* Mensagens Personalizadas */}
        <Card>
          <SectionTitle>
            <MdMessage />
            Mensagens Personalizadas
          </SectionTitle>
          <FormGroup>
            <Label>Mensagem de Boas-vindas</Label>
            <TextArea
              rows={3}
              placeholder='Mensagem exibida no topo da página de gamificação...'
              value={config.welcomeMessage || ''}
              onChange={e => updateConfig('welcomeMessage', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Mensagem no Ranking</Label>
            <TextArea
              rows={2}
              placeholder='Mensagem exibida no topo do ranking...'
              value={config.rankingMessage || ''}
              onChange={e => updateConfig('rankingMessage', e.target.value)}
            />
          </FormGroup>
        </Card>

        {/* Notificações */}
        <Card>
          <SectionTitle>
            <MdNotifications />
            Notificações
          </SectionTitle>
          <CheckboxGrid>
            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.notifyNewAchievement}
                onChange={e =>
                  updateConfig('notifyNewAchievement', e.target.checked)
                }
              />
              Notificar ao desbloquear conquista
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.notifyRankChange}
                onChange={e =>
                  updateConfig('notifyRankChange', e.target.checked)
                }
              />
              Notificar mudança de posição no ranking
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.notifyWeeklySummary}
                onChange={e =>
                  updateConfig('notifyWeeklySummary', e.target.checked)
                }
              />
              Enviar resumo semanal
            </CheckboxLabel>
          </CheckboxGrid>
        </Card>

        {/* Botão Salvar */}
        <SaveButton onClick={handleSave} disabled={saving}>
          <MdSave />
          {saving ? 'Salvando...' : 'Salvar Configuração'}
        </SaveButton>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateX(-2px);

    svg {
      transform: translateX(-3px);
    }
  }

  &:active {
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 0.875rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 20px;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ToggleSwitch = styled.button<{ $active: boolean }>`
  position: relative;
  width: 60px;
  height: 32px;
  background: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleSlider = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 3px;
  left: ${props => (props.$active ? 'calc(100% - 29px)' : '3px')};
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ToggleLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
`;

const EnabledText = styled.span`
  color: ${props => props.theme.colors.success};
`;

const DisabledText = styled.span`
  color: ${props => props.theme.colors.error};
`;

const Warning = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}30;
  border-radius: 8px;
  color: ${props => props.theme.colors.error};
  font-size: 0.9375rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    margin-top: 12px;
    padding: 10px 12px;
    font-size: 0.875rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:hover {
    border-color: ${props => props.theme.colors.border}cc;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: none;
  font-size: 0.9375rem;
  font-family: inherit;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const InputSuffix = styled.span`
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 600;
  border-left: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.8125rem;
  }
`;

const HintText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const CheckboxGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const TextArea = styled.textarea`
  padding: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  line-height: 1.5;

  &:hover {
    border-color: ${props => props.theme.colors.border}cc;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}30;
  margin-top: 8px;

  svg {
    font-size: 1.5rem;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}40;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
  }
`;

export default GamificationSettingsPage;
