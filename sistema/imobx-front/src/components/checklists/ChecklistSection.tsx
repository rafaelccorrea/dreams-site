import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdSchedule,
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdArrowForward,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useChecklists } from '../../hooks/useChecklists';
import type {
  ChecklistResponseDto,
  ChecklistType,
  ItemStatus,
} from '../../types/checklist.types';
import {
  ChecklistStatusLabels,
  ChecklistStatusColors,
  ChecklistTypeLabels,
  ItemStatusLabels,
  ItemStatusColors,
} from '../../types/checklist.types';
import { Spinner } from '../common/Spinner';
import { useModuleAccess } from '../../hooks/useModuleAccess';
import { format as formatDateFns } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SectionContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;

const ChecklistCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ChecklistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
`;

const ChecklistInfo = styled.div`
  flex: 1;
`;

const ChecklistTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const ChecklistMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
`;

const ChecklistBadge = styled.span<{ $type: ChecklistType }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props =>
    props.$type === 'sale'
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(59, 130, 246, 0.1)'};
  color: ${props => (props.$type === 'sale' ? '#ef4444' : '#3b82f6')};
`;

// Função auxiliar para converter hex para rgba
const hexToRgba = (hex: string, alpha: number = 0.1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    const statusColor =
      ChecklistStatusColors[
        props.$status as keyof typeof ChecklistStatusColors
      ] || ChecklistStatusColors.pending;
    return hexToRgba(statusColor, 0.1);
  }};
  color: ${props => {
    return (
      ChecklistStatusColors[
        props.$status as keyof typeof ChecklistStatusColors
      ] || ChecklistStatusColors.pending
    );
  }};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ChecklistActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionButton = styled.button<{
  $variant?: 'primary' | 'danger' | 'secondary';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => {
    if (props.$variant === 'danger') return 'rgba(239, 68, 68, 0.1)';
    if (props.$variant === 'primary') return props.theme.colors.primary;
    return props.theme.colors.surface;
  }};
  color: ${props => {
    if (props.$variant === 'danger') return '#ef4444';
    if (props.$variant === 'primary') return 'white';
    return props.theme.colors.text;
  }};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => {
      if (props.$variant === 'danger') return 'rgba(239, 68, 68, 0.2)';
      if (props.$variant === 'primary') return props.theme.colors.primaryDark;
      return props.theme.colors.border;
    }};
    transform: translateY(-1px);
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

interface ChecklistSectionProps {
  propertyId?: string;
  clientId?: string;
  showCreateButton?: boolean;
  limit?: number;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  propertyId,
  clientId,
  showCreateButton = true,
  limit,
}) => {
  const navigate = useNavigate();
  const { checklists, loading, fetchChecklists, deleteChecklist } =
    useChecklists();
  const {
    isModuleAvailableForCompany,
    companyModules,
    isLoading: modulesLoading,
  } = useModuleAccess();
  const [filteredChecklists, setFilteredChecklists] = useState<
    ChecklistResponseDto[]
  >([]);

  // Verificar se o módulo de checklist está disponível para a empresa
  // Aguardar o carregamento dos módulos antes de verificar
  // Verificação direta também para garantir que funciona
  const canAccessChecklists =
    !modulesLoading &&
    (isModuleAvailableForCompany('checklist_management') ||
      companyModules.some(
        m => String(m).toLowerCase() === 'checklist_management'
      ));

  useEffect(() => {
    const loadChecklists = async () => {
      const filters: any = {};
      if (propertyId) filters.propertyId = propertyId;
      if (clientId) filters.clientId = clientId;

      await fetchChecklists(filters);
    };

    loadChecklists();
  }, [propertyId, clientId, fetchChecklists]);

  useEffect(() => {
    let filtered = checklists;
    if (limit) {
      filtered = checklists.slice(0, limit);
    }
    setFilteredChecklists(filtered);
  }, [checklists, limit]);

  const handleCreateChecklist = () => {
    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (clientId) params.append('clientId', clientId);
    navigate(
      `/checklists/new${params.toString() ? `?${params.toString()}` : ''}`
    );
  };

  const handleViewChecklist = (checklistId: string) => {
    navigate(`/checklists/${checklistId}`);
  };

  const handleEditChecklist = (checklistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/checklists/${checklistId}/edit`);
  };

  const handleDeleteChecklist = async (
    checklistId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja remover este checklist?')) {
      const success = await deleteChecklist(checklistId);
      if (success) {
        // Recarregar checklists após deletar
        const filters: any = {};
        if (propertyId) filters.propertyId = propertyId;
        if (clientId) filters.clientId = clientId;
        await fetchChecklists(filters);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return formatDateFns(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  // Se não tem acesso, não renderizar nada
  if (!canAccessChecklists) {
    return null;
  }

  if (loading) {
    return (
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>📋 Checklists</SectionTitle>
        </SectionHeader>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}
        >
          <Spinner />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>📋 Checklists</SectionTitle>
        <SectionActions>
          {showCreateButton && (propertyId || clientId) && (
            <CreateButton onClick={handleCreateChecklist}>
              <MdAdd />
              Novo Checklist
            </CreateButton>
          )}
          {filteredChecklists.length > 0 && (
            <ActionButton onClick={() => navigate('/checklists')}>
              Ver Todos
              <MdArrowForward style={{ marginLeft: '4px' }} />
            </ActionButton>
          )}
        </SectionActions>
      </SectionHeader>

      {filteredChecklists.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>Nenhum checklist encontrado</EmptyTitle>
          <EmptyDescription>
            {propertyId || clientId
              ? 'Crie um checklist para acompanhar o processo de venda ou aluguel.'
              : 'Não há checklists para exibir.'}
          </EmptyDescription>
          {showCreateButton && (propertyId || clientId) && (
            <CreateButton onClick={handleCreateChecklist}>
              <MdAdd />
              Criar Checklist
            </CreateButton>
          )}
        </EmptyState>
      ) : (
        <>
          {filteredChecklists.map(checklist => (
            <ChecklistCard
              key={checklist.id}
              onClick={() => handleViewChecklist(checklist.id)}
            >
              <ChecklistHeader>
                <ChecklistInfo>
                  <ChecklistTitle>
                    {checklist.property?.title ||
                      'Propriedade não especificada'}
                  </ChecklistTitle>
                  <ChecklistMeta>
                    <span>
                      <strong>Cliente:</strong>{' '}
                      {checklist.client?.name || 'Não especificado'}
                    </span>
                    <ChecklistBadge $type={checklist.type}>
                      {ChecklistTypeLabels[checklist.type]}
                    </ChecklistBadge>
                    <StatusBadge $status={checklist.status}>
                      {ChecklistStatusLabels[checklist.status]}
                    </StatusBadge>
                  </ChecklistMeta>
                </ChecklistInfo>
                <ChecklistActions onClick={e => e.stopPropagation()}>
                  <ActionButton
                    onClick={() => handleViewChecklist(checklist.id)}
                    title='Ver detalhes'
                  >
                    <MdVisibility />
                  </ActionButton>
                  <ActionButton
                    $variant='primary'
                    onClick={e => handleEditChecklist(checklist.id, e)}
                    title='Editar checklist'
                  >
                    <MdEdit />
                  </ActionButton>
                  <ActionButton
                    $variant='danger'
                    onClick={e => handleDeleteChecklist(checklist.id, e)}
                    title='Deletar checklist'
                  >
                    <MdDelete />
                  </ActionButton>
                </ChecklistActions>
              </ChecklistHeader>

              <ProgressBar>
                <ProgressFill
                  $percentage={checklist.statistics.completionPercentage}
                />
              </ProgressBar>
              <ProgressText>
                <span>
                  {checklist.statistics.completedItems} de{' '}
                  {checklist.statistics.totalItems} itens concluídos
                </span>
                <span>{checklist.statistics.completionPercentage}%</span>
              </ProgressText>

              {checklist.startedAt && (
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Iniciado em: {formatDate(checklist.startedAt)}
                </div>
              )}
            </ChecklistCard>
          ))}
        </>
      )}
    </SectionContainer>
  );
};
