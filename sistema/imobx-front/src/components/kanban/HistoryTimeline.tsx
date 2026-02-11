import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MdSchedule } from 'react-icons/md';
import { Avatar } from '../common/Avatar';
import type { TaskHistoryEntry } from '../../types/kanban';
import { TaskHistoryActionType } from '../../types/kanban';
import { companyMembersApi } from '../../services/companyMembersApi';
import { formatCurrencyValue, getNumericValue } from '../../utils/masks';

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 14px 18px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    gap: 12px;
  }
`;

const TimelineAvatarSection = styled.div`
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  font-size: 0.938rem;
`;

const ActionLabel = styled.span`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const TimelineDescription = styled.div`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  line-height: 1.5;
`;

const ColumnMovement = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  background: ${props =>
    props.theme.colors.infoBackground ||
    props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  border-left: 3px solid
    ${props => props.theme.colors.info || props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FromColumn = styled.span`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.text};

  strong {
    color: ${props => props.theme.colors.error};
  }
`;

const Arrow = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.813rem;
`;

const ToColumn = styled.span`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.text};

  strong {
    color: ${props => props.theme.colors.success};
  }
`;

const ValueChange = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const OldValue = styled.div`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    color: ${props => props.theme.colors.error};
  }
`;

const NewValue = styled.div`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.success};
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    color: ${props => props.theme.colors.success};
  }
`;

const UserValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimelineDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const PaginationWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  width: 100%;
`;

const LoadMoreButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.$variant === 'secondary'
        ? props.theme.colors.border
        : props.theme.colors.primary};
  background: ${props =>
    props.$variant === 'secondary'
      ? 'transparent'
      : props.theme.colors.primary};
  color: ${props =>
    props.$variant === 'secondary'
      ? props.theme.colors.textSecondary
      : 'white'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    ${props =>
      props.$variant === 'secondary' &&
      `
      background: ${props.theme.colors.backgroundSecondary};
      color: ${props.theme.colors.text};
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const PaginationInfo = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

interface HistoryTimelineProps {
  history: TaskHistoryEntry[];
  loading?: boolean;
  /** Quantidade de itens por página (padrão 20) */
  pageSize?: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Mapeamento de ações para labels em português
const getActionLabel = (action: TaskHistoryActionType): string => {
  const labels: Record<TaskHistoryActionType, string> = {
    [TaskHistoryActionType.CREATED]: 'criou',
    [TaskHistoryActionType.MOVED]: 'moveu',
    [TaskHistoryActionType.UPDATED]: 'atualizou',
    [TaskHistoryActionType.TITLE_CHANGED]: 'alterou o título',
    [TaskHistoryActionType.DESCRIPTION_CHANGED]: 'alterou a descrição',
    [TaskHistoryActionType.PRIORITY_CHANGED]: 'alterou a prioridade',
    [TaskHistoryActionType.DUE_DATE_CHANGED]: 'alterou a data de vencimento',
    [TaskHistoryActionType.TAGS_CHANGED]: 'alterou as tags',
    [TaskHistoryActionType.ASSIGNED]: 'atribuiu',
    [TaskHistoryActionType.UNASSIGNED]: 'removeu atribuição',
    [TaskHistoryActionType.COMPLETED]: 'concluiu',
    [TaskHistoryActionType.REOPENED]: 'reabriu',
    [TaskHistoryActionType.RESULT_CHANGED]: 'alterou o resultado',
    [TaskHistoryActionType.SUBTASK_CREATED]: 'criou uma subtarefa',
    [TaskHistoryActionType.SUBTASK_UPDATED]: 'atualizou uma subtarefa',
    [TaskHistoryActionType.SUBTASK_DELETED]: 'deletou uma subtarefa',
    [TaskHistoryActionType.SUBTASK_COMPLETED]: 'concluiu uma subtarefa',
    [TaskHistoryActionType.SUBTASK_REOPENED]: 'reabriu uma subtarefa',
    [TaskHistoryActionType.SUBTASK_ASSIGNED]: 'atribuiu uma subtarefa',
    [TaskHistoryActionType.SUBTASK_UNASSIGNED]:
      'removeu atribuição de subtarefa',
    [TaskHistoryActionType.SUBTASK_TITLE_CHANGED]:
      'alterou o título de uma subtarefa',
    [TaskHistoryActionType.SUBTASK_DESCRIPTION_CHANGED]:
      'alterou a descrição de uma subtarefa',
    [TaskHistoryActionType.SUBTASK_DUE_DATE_CHANGED]:
      'alterou a data de vencimento de uma subtarefa',
    [TaskHistoryActionType.QUALIFICATION_CHANGED]: 'alterou a qualificação',
    [TaskHistoryActionType.TOTAL_VALUE_CHANGED]: 'alterou o valor total',
    [TaskHistoryActionType.CLOSING_FORECAST_CHANGED]:
      'alterou a previsão de fechamento',
    [TaskHistoryActionType.SOURCE_CHANGED]: 'alterou a origem',
    [TaskHistoryActionType.CAMPAIGN_CHANGED]: 'alterou a campanha',
    [TaskHistoryActionType.PRESERVICE_CHANGED]: 'alterou o pré-serviço',
    [TaskHistoryActionType.VGC_CHANGED]: 'alterou o VGC',
    [TaskHistoryActionType.TRANSFER_DATE_CHANGED]:
      'alterou a data de transferência',
    [TaskHistoryActionType.SECTOR_CHANGED]: 'alterou o setor',
    [TaskHistoryActionType.CUSTOM_FIELDS_CHANGED]:
      'alterou campos personalizados',
    [TaskHistoryActionType.INVOLVED_USER_ADDED]: 'adicionou pessoa envolvida',
    [TaskHistoryActionType.INVOLVED_USER_REMOVED]: 'removeu pessoa envolvida',
    [TaskHistoryActionType.TRANSFERRED]: 'transferiu a tarefa',
    [TaskHistoryActionType.RECEIVED_FROM_TRANSFER]:
      'recebeu tarefa transferida',
  };

  return labels[action] || action;
};

// Formatar data relativa ou absoluta
const formatHistoryDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return format(date, "dd 'de' MMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

const HISTORY_PAGE_SIZE = 20;

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  history,
  loading = false,
  pageSize = HISTORY_PAGE_SIZE,
}) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Resetar paginação quando a lista de histórico mudar
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [history?.length, pageSize]);

  // Carregar lista de usuários para resolver IDs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await companyMembersApi.getMembers({ limit: 200 });
        setUsers(
          response.data.map(member => ({
            id: member.id,
            name: member.name,
            email: member.email,
            avatar: member.avatar,
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar usuários para histórico:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // Função para obter nome do usuário por ID
  const getUserName = (userId: string | undefined): string => {
    if (!userId) return '';
    const user = users.find(u => u.id === userId);
    return user?.name || userId;
  };

  // Função para obter dados completos do usuário por ID
  const getUser = (userId: string | undefined): UserInfo | null => {
    if (!userId) return null;
    const user = users.find(u => u.id === userId);
    return user || null;
  };

  // Função para verificar se um valor é um ID de usuário (UUID)
  const isUserId = (value: string | undefined): boolean => {
    if (!value) return false;
    // UUID pattern: 8-4-4-4-12 hex characters
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(value);
  };

  // Função para formatar valores (substituir IDs por nomes quando possível)
  const formatValue = (
    value: string | undefined,
    action: TaskHistoryActionType
  ): string => {
    if (!value) return '';

    // Se for uma ação relacionada a usuários e o valor for um ID, buscar o nome
    if (
      (action === TaskHistoryActionType.ASSIGNED ||
        action === TaskHistoryActionType.UNASSIGNED ||
        action === TaskHistoryActionType.SUBTASK_ASSIGNED ||
        action === TaskHistoryActionType.SUBTASK_UNASSIGNED ||
        action === TaskHistoryActionType.INVOLVED_USER_ADDED ||
        action === TaskHistoryActionType.INVOLVED_USER_REMOVED) &&
      isUserId(value)
    ) {
      return getUserName(value);
    }

    // Se for alteração de valor monetário, formatar como moeda
    if (
      action === TaskHistoryActionType.TOTAL_VALUE_CHANGED ||
      action === TaskHistoryActionType.CLOSING_FORECAST_CHANGED ||
      action === TaskHistoryActionType.VGC_CHANGED
    ) {
      // Tentar converter para número de diferentes formas
      let numericValue: number;

      // Se já é um número (string numérica simples)
      if (/^-?\d+(\.\d+)?$/.test(value.trim())) {
        numericValue = parseFloat(value);
      } else {
        // Se tem formatação (R$, pontos, vírgulas), usar getNumericValue
        numericValue = getNumericValue(value);
      }

      // Verificar se é um número válido
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        return formatCurrencyValue(numericValue);
      }
    }

    return value;
  };

  // Função para formatar descrição com valores monetários
  const formatDescription = (
    description: string | undefined,
    action: TaskHistoryActionType
  ): string => {
    if (!description) return '';

    // Se for alteração de valor monetário, formatar números na descrição
    if (
      action === TaskHistoryActionType.TOTAL_VALUE_CHANGED ||
      action === TaskHistoryActionType.CLOSING_FORECAST_CHANGED ||
      action === TaskHistoryActionType.VGC_CHANGED
    ) {
      // Padrão para encontrar números (inteiros ou decimais) na descrição
      // Ex: "de 120000.00 para 120000" ou "de 120000 para 120000.00"
      return description.replace(/(\d+(?:\.\d+)?)/g, match => {
        const numericValue = parseFloat(match);
        if (!isNaN(numericValue) && isFinite(numericValue)) {
          return formatCurrencyValue(numericValue);
        }
        return match;
      });
    }

    return description;
  };

  // Função para verificar se deve exibir avatar (quando o valor é um ID de usuário)
  const shouldShowAvatar = (
    value: string | undefined,
    action: TaskHistoryActionType
  ): boolean => {
    if (!value) return false;
    return (
      (action === TaskHistoryActionType.ASSIGNED ||
        action === TaskHistoryActionType.UNASSIGNED ||
        action === TaskHistoryActionType.SUBTASK_ASSIGNED ||
        action === TaskHistoryActionType.SUBTASK_UNASSIGNED ||
        action === TaskHistoryActionType.INVOLVED_USER_ADDED ||
        action === TaskHistoryActionType.INVOLVED_USER_REMOVED) &&
      isUserId(value)
    );
  };

  if (loading) {
    return <LoadingState>Carregando histórico...</LoadingState>;
  }

  if (!history || history.length === 0) {
    return <EmptyState>Nenhum histórico disponível</EmptyState>;
  }

  const visibleHistory = history.slice(0, visibleCount);
  const hasMore = history.length > visibleCount;
  const total = history.length;

  return (
    <TimelineContainer>
      {visibleHistory.map(entry => {
        const formattedOldValue = formatValue(entry.oldValue, entry.action);
        const formattedNewValue = formatValue(entry.newValue, entry.action);
        const showOldAvatar = shouldShowAvatar(entry.oldValue, entry.action);
        const showNewAvatar = shouldShowAvatar(entry.newValue, entry.action);
        const oldUser = getUser(entry.oldValue);
        const newUser = getUser(entry.newValue);

        return (
          <TimelineItem key={entry.id}>
            <TimelineAvatarSection>
              <Avatar
                name={entry.user?.name || 'Usuário removido'}
                image={entry.user?.avatar}
                size={40}
              />
            </TimelineAvatarSection>
            <TimelineContent>
              <TimelineHeader>
                <UserName>{entry.user?.name || 'Usuário removido'}</UserName>
                <ActionLabel>{getActionLabel(entry.action)}</ActionLabel>
              </TimelineHeader>

              {entry.description && (
                <TimelineDescription>
                  {formatDescription(entry.description, entry.action)}
                </TimelineDescription>
              )}

              {entry.fromColumn && entry.toColumn && (
                <ColumnMovement>
                  <FromColumn>
                    De: <strong>{entry.fromColumn.title}</strong>
                  </FromColumn>
                  <Arrow>→</Arrow>
                  <ToColumn>
                    Para: <strong>{entry.toColumn.title}</strong>
                  </ToColumn>
                </ColumnMovement>
              )}

              {formattedOldValue && formattedNewValue && (
                <ValueChange>
                  <OldValue>
                    De:{' '}
                    {showOldAvatar && oldUser ? (
                      <UserValue>
                        <Avatar
                          name={oldUser.name}
                          image={oldUser.avatar}
                          size={20}
                        />
                        <strong>{formattedOldValue}</strong>
                      </UserValue>
                    ) : (
                      <strong>{formattedOldValue}</strong>
                    )}
                  </OldValue>
                  <NewValue>
                    Para:{' '}
                    {showNewAvatar && newUser ? (
                      <UserValue>
                        <Avatar
                          name={newUser.name}
                          image={newUser.avatar}
                          size={20}
                        />
                        <strong>{formattedNewValue}</strong>
                      </UserValue>
                    ) : (
                      <strong>{formattedNewValue}</strong>
                    )}
                  </NewValue>
                </ValueChange>
              )}

              <TimelineDate>
                <MdSchedule size={14} />
                {formatHistoryDate(entry.createdAt)}
              </TimelineDate>
            </TimelineContent>
          </TimelineItem>
        );
      })}
      {hasMore && (
        <PaginationWrap>
          <PaginationInfo>
            Exibindo {visibleCount} de {total} registros
          </PaginationInfo>
          <LoadMoreButton
            type="button"
            onClick={() =>
              setVisibleCount(prev => Math.min(prev + pageSize, total))
            }
          >
            Carregar mais
          </LoadMoreButton>
        </PaginationWrap>
      )}
      {visibleCount > pageSize && visibleCount >= total && total > pageSize && (
        <PaginationWrap>
          <LoadMoreButton
            type="button"
            $variant="secondary"
            onClick={() => setVisibleCount(pageSize)}
          >
            Ver menos
          </LoadMoreButton>
        </PaginationWrap>
      )}
    </TimelineContainer>
  );
};
