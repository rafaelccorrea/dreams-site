import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdAdd,
  MdEdit,
  MdDelete,
  MdDragIndicator,
  MdColorLens,
  MdCheck,
  MdClose,
  MdInfo,
  MdSave,
  MdCancel,
  MdTrendingUp,
  MdTrendingDown,
  MdEqualizer,
  MdCompareArrows,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { colorRulesApi } from '../services/colorRulesApi';
import { ColorRulesShimmer } from '../components/shimmer/ColorRulesShimmer';
import type {
  KanbanColorRule,
  CreateColorRuleDto,
  UpdateColorRuleDto,
  ColorRuleOperator,
} from '../types/kanban';
import { showSuccess, showError } from '../utils/notifications';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { ProjectSelect } from '../components/projects/ProjectSelect';
import { useTeamsConditional } from '../hooks/useTeamsConditional';

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
  margin-bottom: 16px;
  gap: 24px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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
  flex: 1;
  min-width: 0;
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

const AddButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const TeamProjectSelector = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SelectorLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RuleCard = styled.div<{ $isActive: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
  opacity: ${props => (props.$isActive ? 1 : 0.6)};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ColorPreview = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.$color};
  border: 2px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RuleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RuleName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const RuleDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 8px 0;
`;

const RuleDetails = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RuleDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RuleActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 36px;
  min-height: 36px;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ToggleButton = styled.button<{ $isActive: boolean; disabled?: boolean }>`
  background: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  border: 1px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  color: ${props => (props.$isActive ? 'white' : props.theme.colors.text)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: scale(1.05);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyMessage = styled.p`
  font-size: 0.875rem;
  margin: 0 0 24px 0;
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.primary}10;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
`;

const InfoIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 20px;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
`;

// Modal de criação/edição
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 48px 20px 20px 20px;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-top: 60px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.4;
`;

const HelperText = styled.small`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
  line-height: 1.4;
`;

const LoadingSpinner = styled.div<{ $size?: string; $borderWidth?: string }>`
  width: ${props => props.$size || '16px'};
  height: ${props => props.$size || '16px'};
  border: ${props => props.$borderWidth || '2px'} solid rgba(255, 255, 255, 0.3);
  border-top: ${props => props.$borderWidth || '2px'} solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinnerDark = styled.div<{
  $size?: string;
  $borderWidth?: string;
}>`
  width: ${props => props.$size || '16px'};
  height: ${props => props.$size || '16px'};
  border: ${props => props.$borderWidth || '2px'} solid
    ${props => props.theme.colors.border};
  border-top: ${props => props.$borderWidth || '2px'} solid
    ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const ColorInputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ColorInput = styled.input`
  width: 80px;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`;

const ColorHexInput = styled(Input)`
  flex: 1;
  font-family: monospace;
  text-transform: uppercase;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $disabled?: boolean;
}>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${props => (props.$disabled ? 0.6 : 1)};

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryHover || props.theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 6px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.backgroundSecondary};
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const operatorLabels: Record<ColorRuleOperator, string> = {
  greater_than: 'Mais de',
  greater_than_or_equal: 'Mais ou igual a',
  less_than: 'Menos de',
  less_than_or_equal: 'Menos ou igual a',
  equal: 'Exatamente',
  between: 'Entre',
};

const getOperatorDescription = (
  operator: ColorRuleOperator,
  days: number,
  daysTo?: number | null
): string => {
  switch (operator) {
    case 'greater_than':
      return `Mais de ${days} dias`;
    case 'greater_than_or_equal':
      return `${days} dias ou mais`;
    case 'less_than':
      return `Menos de ${days} dias`;
    case 'less_than_or_equal':
      return `${days} dias ou menos`;
    case 'equal':
      return `Exatamente ${days} dias`;
    case 'between':
      return `Entre ${days} e ${daysTo || 0} dias`;
    default:
      return '';
  }
};

const ColorRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamIdFromUrl = searchParams.get('teamId');
  const projectIdFromUrl = searchParams.get('projectId');

  const {
    teams,
    selectedTeam,
    selectTeam,
    loading: teamsLoading,
  } = useTeamsConditional(!teamIdFromUrl);

  const [rules, setRules] = useState<KanbanColorRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    teamIdFromUrl || null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projectIdFromUrl || null
  );
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  ); // undefined = todas, true = ativas, false = inativas
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<KanbanColorRule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<KanbanColorRule | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingRuleId, setTogglingRuleId] = useState<string | null>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Estado geral para verificar se qualquer ação está em andamento
  const isAnyActionInProgress =
    isSaving || isDeleting || togglingRuleId !== null || editingRuleId !== null;

  // Form state
  const [formData, setFormData] = useState<CreateColorRuleDto>({
    teamId: selectedTeamId || '',
    projectId: selectedProjectId,
    name: '',
    description: '',
    operator: 'greater_than',
    days: 7,
    daysTo: null,
    color: '#FF0000',
    order: 0,
    isActive: true,
  });

  // Determinar teamId final
  const finalTeamId = selectedTeamId || selectedTeam?.id || null;

  // Carregar regras quando teamId, projectId ou filtro mudar
  useEffect(() => {
    if (finalTeamId && selectedProjectId) {
      loadRules();
    }
  }, [finalTeamId, selectedProjectId, filterActive]);

  // Atualizar teamId quando selectedTeam mudar
  useEffect(() => {
    if (selectedTeam && !selectedTeamId) {
      setSelectedTeamId(selectedTeam.id);
    }
  }, [selectedTeam, selectedTeamId]);

  const loadRules = async () => {
    if (!finalTeamId || !selectedProjectId) return;

    setLoading(true);
    try {
      const data = await colorRulesApi.getColorRules(
        finalTeamId,
        selectedProjectId,
        filterActive
      );
      setRules(data.sort((a, b) => a.order - b.order));
    } catch (error: any) {
      showError(error.message || 'Erro ao carregar regras de cor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (isAnyActionInProgress) return; // Prevenir ação se outra estiver em andamento

    if (!finalTeamId) {
      showError('Selecione uma equipe primeiro');
      return;
    }
    if (!selectedProjectId) {
      showError('Selecione um projeto primeiro');
      return;
    }
    setFormData({
      teamId: finalTeamId,
      projectId: selectedProjectId,
      name: '',
      description: '',
      operator: 'greater_than',
      days: 7,
      daysTo: null,
      color: '#FF0000',
      order: rules.length,
      isActive: true,
    });
    setEditingRule(null);
    setEditingRuleId(null);
    setIsSaving(false); // Resetar estado de loading
    setShowModal(true);
  };

  const handleEdit = (rule: KanbanColorRule) => {
    if (isAnyActionInProgress) return; // Prevenir ação se outra estiver em andamento

    setEditingRule(rule);
    setEditingRuleId(rule.id);
    setFormData({
      teamId: rule.teamId,
      projectId: rule.projectId || undefined,
      name: rule.name,
      description: rule.description || '',
      operator: rule.operator,
      days: rule.days,
      daysTo: rule.daysTo || undefined,
      color: rule.color,
      order: rule.order,
      isActive: rule.isActive,
    });
    setIsSaving(false); // Resetar estado de loading
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!finalTeamId) {
      showError('Selecione uma equipe primeiro');
      return;
    }
    if (!selectedProjectId) {
      showError('Selecione um projeto primeiro');
      return;
    }

    if (isSaving) {
      return; // Prevenir múltiplos cliques
    }

    setIsSaving(true);
    try {
      if (editingRule) {
        const updateData: UpdateColorRuleDto = {
          name: formData.name,
          description: formData.description,
          operator: formData.operator,
          days: formData.days,
          daysTo: formData.daysTo,
          color: formData.color,
          order: formData.order,
          isActive: formData.isActive,
        };
        await colorRulesApi.updateColorRule(editingRule.id, updateData);
        showSuccess('Regra de cor atualizada com sucesso!');
      } else {
        await colorRulesApi.createColorRule({
          ...formData,
          teamId: finalTeamId,
          projectId: selectedProjectId,
        });
        showSuccess('Regra de cor criada com sucesso!');
      }
      setShowModal(false);
      setEditingRule(null);
      setEditingRuleId(null);
      await loadRules();
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar regra de cor');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (rule: KanbanColorRule) => {
    if (isAnyActionInProgress) return; // Prevenir ação se outra estiver em andamento

    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;

    setIsDeleting(true);
    try {
      await colorRulesApi.deleteColorRule(ruleToDelete.id);
      showSuccess('Regra de cor removida com sucesso!');
      setShowDeleteModal(false);
      setRuleToDelete(null);
      loadRules();
    } catch (error: any) {
      showError(error.message || 'Erro ao remover regra de cor');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (rule: KanbanColorRule) => {
    if (isAnyActionInProgress || togglingRuleId === rule.id) {
      return; // Prevenir múltiplos cliques
    }

    setTogglingRuleId(rule.id);
    try {
      await colorRulesApi.updateColorRule(rule.id, {
        isActive: !rule.isActive,
      });
      showSuccess(
        `Regra ${!rule.isActive ? 'ativada' : 'desativada'} com sucesso!`
      );
      await loadRules();
    } catch (error: any) {
      showError(error.message || 'Erro ao atualizar regra de cor');
    } finally {
      setTogglingRuleId(null);
    }
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedProjectId(null);
    if (selectTeam) {
      selectTeam(teamId);
    }
  };

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProjectId(projectId);
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <HeaderLeft>
              <BackButton onClick={() => navigate(-1)}>
                <MdArrowBack size={20} />
                Voltar
              </BackButton>
              <TitleSection>
                <Title>Regras de Cor do Funil de Vendas</Title>
                <Subtitle>
                  Configure regras para colorir automaticamente os cards baseado
                  no tempo desde a última atualização
                </Subtitle>
              </TitleSection>
            </HeaderLeft>
            <HeaderRight>
              <AddButton
                onClick={handleCreate}
                disabled={!finalTeamId || !selectedProjectId}
              >
                <MdAdd size={20} />
                Nova Regra
              </AddButton>
            </HeaderRight>
          </HeaderTop>

          <TeamProjectSelector>
            <SelectorLabel>
              Equipe:
              {teams && teams.length > 0 && (
                <Select
                  value={finalTeamId || ''}
                  onChange={e => handleTeamChange(e.target.value)}
                  disabled={teamsLoading}
                >
                  <option value=''>Selecione uma equipe</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              )}
              {!teams && finalTeamId && (
                <span>{selectedTeam?.name || 'Equipe selecionada'}</span>
              )}
            </SelectorLabel>
            {finalTeamId && (
              <SelectorLabel>
                Projeto *:
                <ProjectSelect
                  teamId={finalTeamId}
                  selectedProjectId={selectedProjectId}
                  onProjectChange={handleProjectChange}
                  placeholder='Selecione um projeto'
                />
              </SelectorLabel>
            )}
            {finalTeamId && selectedProjectId && (
              <SelectorLabel>
                Filtrar:
                <Select
                  value={
                    filterActive === undefined
                      ? 'all'
                      : filterActive
                        ? 'active'
                        : 'inactive'
                  }
                  onChange={e => {
                    const value = e.target.value;
                    setFilterActive(
                      value === 'all' ? undefined : value === 'active'
                    );
                  }}
                >
                  <option value='all'>Todas as regras</option>
                  <option value='active'>Apenas ativas</option>
                  <option value='inactive'>Apenas inativas</option>
                </Select>
              </SelectorLabel>
            )}
          </TeamProjectSelector>
        </PageHeader>

        <InfoBox>
          <InfoIcon>
            <MdInfo size={20} />
          </InfoIcon>
          <InfoText>
            <strong>Como funciona:</strong> As regras são avaliadas em ordem de
            prioridade (menor número = maior prioridade). A primeira regra que
            corresponder ao tempo desde a última atualização define a cor do
            card. Se nenhuma regra corresponder, o card não terá cor especial.
          </InfoText>
        </InfoBox>

        {loading ? (
          <ColorRulesShimmer />
        ) : rules.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <MdColorLens size={64} />
            </EmptyIcon>
            <EmptyTitle>Nenhuma regra de cor configurada</EmptyTitle>
            <EmptyMessage>
              {!finalTeamId
                ? 'Selecione uma equipe e um projeto para começar a configurar regras de cor.'
                : !selectedProjectId
                  ? 'Selecione um projeto para começar a configurar regras de cor.'
                  : 'Crie sua primeira regra de cor para começar a colorir os cards automaticamente.'}
            </EmptyMessage>
            {finalTeamId && selectedProjectId && (
              <AddButton onClick={handleCreate}>
                <MdAdd size={20} />
                Criar Primeira Regra
              </AddButton>
            )}
          </EmptyState>
        ) : (
          <RulesList>
            {rules.map(rule => (
              <RuleCard key={rule.id} $isActive={rule.isActive}>
                <ColorPreview $color={rule.color} />
                <RuleInfo>
                  <RuleName>{rule.name}</RuleName>
                  {rule.description && (
                    <RuleDescription>{rule.description}</RuleDescription>
                  )}
                  <RuleDetails>
                    <RuleDetail>
                      <strong>Operador:</strong> {operatorLabels[rule.operator]}
                    </RuleDetail>
                    <RuleDetail>
                      <strong>Condição:</strong>{' '}
                      {getOperatorDescription(
                        rule.operator,
                        rule.days,
                        rule.daysTo
                      )}
                    </RuleDetail>
                    <RuleDetail>
                      <strong>Prioridade:</strong> {rule.order}
                    </RuleDetail>
                    <RuleDetail>
                      <strong>Cor:</strong> {rule.color}
                    </RuleDetail>
                  </RuleDetails>
                </RuleInfo>
                <RuleActions>
                  <ToggleButton
                    $isActive={rule.isActive}
                    onClick={() => handleToggleActive(rule)}
                    title={rule.isActive ? 'Desativar regra' : 'Ativar regra'}
                    disabled={
                      isAnyActionInProgress || togglingRuleId === rule.id
                    }
                  >
                    {togglingRuleId === rule.id ? (
                      <>
                        <LoadingSpinner $size='14px' $borderWidth='2px' />
                        {rule.isActive ? 'Desativando...' : 'Ativando...'}
                      </>
                    ) : (
                      <>
                        {rule.isActive ? (
                          <MdCheck size={16} />
                        ) : (
                          <MdClose size={16} />
                        )}
                        {rule.isActive ? 'Ativa' : 'Inativa'}
                      </>
                    )}
                  </ToggleButton>
                  <ActionButton
                    onClick={() => handleEdit(rule)}
                    title='Editar regra'
                    disabled={
                      isAnyActionInProgress || editingRuleId === rule.id
                    }
                  >
                    {editingRuleId === rule.id ? (
                      <LoadingSpinnerDark $size='14px' $borderWidth='2px' />
                    ) : (
                      <MdEdit size={18} />
                    )}
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleDeleteClick(rule)}
                    title='Remover regra'
                    disabled={isAnyActionInProgress || isDeleting}
                  >
                    {isDeleting && ruleToDelete?.id === rule.id ? (
                      <LoadingSpinnerDark $size='14px' $borderWidth='2px' />
                    ) : (
                      <MdDelete size={18} />
                    )}
                  </ActionButton>
                </RuleActions>
              </RuleCard>
            ))}
          </RulesList>
        )}

        {/* Modal de criação/edição */}
        {showModal && (
          <ModalOverlay
            $isOpen={showModal}
            onClick={() => {
              setShowModal(false);
              setIsSaving(false);
              setEditingRuleId(null);
            }}
          >
            <ModalContainer onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  {editingRule ? 'Editar Regra de Cor' : 'Nova Regra de Cor'}
                </ModalTitle>
                <CloseButton
                  onClick={() => {
                    setShowModal(false);
                    setIsSaving(false);
                    setEditingRuleId(null);
                  }}
                >
                  <MdClose size={20} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Nome da Regra *</Label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='Ex: Sem atualização há mais de 7 dias'
                />
              </FormGroup>

              <FormGroup>
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder='Descrição opcional da regra'
                  style={{ minHeight: '60px' }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Quando aplicar esta cor? *</Label>
                <Select
                  value={formData.operator}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      operator: e.target.value as ColorRuleOperator,
                      daysTo:
                        e.target.value === 'between' ? formData.daysTo : null,
                    })
                  }
                >
                  <option value='greater_than'>
                    📅 Mais de X dias sem atualização (ex: mais de 7 dias)
                  </option>
                  <option value='greater_than_or_equal'>
                    📅 X dias ou mais sem atualização (ex: 7 dias ou mais)
                  </option>
                  <option value='less_than'>
                    📅 Menos de X dias sem atualização (ex: menos de 3 dias)
                  </option>
                  <option value='less_than_or_equal'>
                    📅 X dias ou menos sem atualização (ex: 3 dias ou menos)
                  </option>
                  <option value='equal'>
                    📅 Exatamente X dias sem atualização (ex: exatamente 5 dias)
                  </option>
                  <option value='between'>
                    📅 Entre X e Y dias sem atualização (ex: entre 2 e 5 dias)
                  </option>
                </Select>
                <HelperText>
                  Escolha quando esta cor deve ser aplicada baseado no tempo
                  desde a última atualização do card
                </HelperText>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>Quantos dias? *</Label>
                  <Input
                    type='number'
                    min='0'
                    value={formData.days}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        days: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder='Ex: 7'
                  />
                  <HelperText>
                    Número de dias desde a última atualização
                  </HelperText>
                </FormGroup>

                {formData.operator === 'between' && (
                  <FormGroup>
                    <Label>Até quantos dias? *</Label>
                    <Input
                      type='number'
                      min='0'
                      value={formData.daysTo || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          daysTo: parseInt(e.target.value) || null,
                        })
                      }
                      placeholder='Ex: 10'
                    />
                    <HelperText>
                      Número máximo de dias (ex: se "Dias" for 2 e "Até" for 5,
                      aplica entre 2 e 5 dias)
                    </HelperText>
                  </FormGroup>
                )}
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Cor *</Label>
                  <ColorInputWrapper>
                    <ColorInput
                      type='color'
                      value={formData.color}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          color: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <ColorHexInput
                      type='text'
                      value={formData.color}
                      onChange={e => {
                        const value = e.target.value.replace(
                          /[^0-9A-Fa-f#]/g,
                          ''
                        );
                        if (value.startsWith('#')) {
                          setFormData({
                            ...formData,
                            color: value.toUpperCase(),
                          });
                        } else if (value.length > 0) {
                          setFormData({
                            ...formData,
                            color: '#' + value.toUpperCase(),
                          });
                        }
                      }}
                      placeholder='#FF0000'
                      maxLength={7}
                    />
                  </ColorInputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>Prioridade (ordem) *</Label>
                  <Input
                    type='number'
                    min='0'
                    value={formData.order}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <small
                    style={{
                      color: '#666',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
                    Menor número = maior prioridade
                  </small>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>
                  <input
                    type='checkbox'
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    style={{ marginRight: '8px' }}
                  />
                  Regra ativa
                </Label>
              </FormGroup>

              <ModalActions>
                <Button
                  $variant='secondary'
                  onClick={() => {
                    setShowModal(false);
                    setIsSaving(false);
                    setEditingRuleId(null); // Resetar estado ao fechar
                  }}
                  title='Cancelar e fechar'
                  disabled={isSaving}
                >
                  <MdCancel size={18} />
                  Cancelar
                </Button>
                <Button
                  $variant='primary'
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    !formData.name ||
                    !formData.color ||
                    (formData.operator === 'between' && !formData.daysTo)
                  }
                  title={
                    editingRule
                      ? 'Salvar alterações'
                      : 'Criar nova regra de cor'
                  }
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner />
                      {editingRule ? 'Salvando...' : 'Criando...'}
                    </>
                  ) : (
                    <>
                      <MdSave size={18} />
                      {editingRule ? 'Salvar Alterações' : 'Criar Regra'}
                    </>
                  )}
                </Button>
              </ModalActions>
            </ModalContainer>
          </ModalOverlay>
        )}

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setRuleToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title='Remover Regra de Cor'
          message='Esta regra será removida permanentemente. Os cards que usavam esta cor voltarão ao padrão.'
          itemName={ruleToDelete?.name || ''}
          isLoading={isDeleting}
        />
      </PageContainer>
    </Layout>
  );
};

export default ColorRulesPage;
