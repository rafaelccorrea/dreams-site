import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdRefresh,
} from 'react-icons/md';
import { WhatsAppMessageCard } from './WhatsAppMessageCard';
import { WhatsAppFilters } from './WhatsAppFilters';
import { AnalyzeMessageButton } from './AnalyzeMessageButton';
import { WhatsAppShimmer } from '../shimmer/WhatsAppShimmer';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { whatsappApi } from '../../services/whatsappApi';
import { toast } from 'react-toastify';
import { showSuccess, showError } from '../../utils/notifications';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { PermissionRoute } from '../PermissionRoute';
import { Tooltip } from '../ui/Tooltip';
import type {
  WhatsAppMessage,
  WhatsAppMessagesQueryParams,
  NotificationConfig,
  TimeStatus,
} from '../../types/whatsapp';
import {
  formatPhoneDisplay,
  calculateMessageTimeStatus,
} from '../../utils/whatsappUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-bottom: 0;
  gap: 12px;
  padding: 16px 20px 16px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 12px 16px 12px 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 10px 12px 10px 10px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const FiltersContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0; /* Permite que o container encolha se necessário */
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white || '#fff'};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}30;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 9px 14px;
    font-size: 0.875rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    min-height: 48px;
    font-size: 0.875rem;
    gap: 4px;
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 9px 14px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    min-height: 48px;
    font-size: 0.875rem;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 12px 16px;

  @media (max-width: 768px) {
    padding: 10px 12px 10px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px 8px 10px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const EmptyStateText = styled.p`
  font-size: 0.9375rem;
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0 0;
  padding-right: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 12px 0 0 0;
    padding-right: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px 0 0 0;
    padding-right: 10px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PaginationButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props =>
    props.$disabled
      ? props.theme.colors.backgroundSecondary
      : props.theme.colors.cardBackground};
  color: ${props =>
    props.$disabled
      ? props.theme.colors.textSecondary
      : props.theme.colors.text};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

interface Conversation {
  phoneNumber: string;
  contactName?: string;
  lastMessage: WhatsAppMessage;
  unreadCount: number;
  messageCount: number;
}

interface WhatsAppMessagesListProps {
  onMessageClick?: (message: WhatsAppMessage) => void;
  onViewConversation?: (phoneNumber: string, contactName?: string) => void;
  selectedPhoneNumber?: string | null;
  /** Se false, criação de tarefa fica desabilitada (é obrigatório ter funil configurado nas config do WhatsApp) */
  hasFunnelConfigured?: boolean;
}

export const WhatsAppMessagesList: React.FC<WhatsAppMessagesListProps> = ({
  onMessageClick,
  onViewConversation,
  selectedPhoneNumber,
  hasFunnelConfigured = true,
}) => {
  const permissionsContext = usePermissionsContextOptional();
  const { messages, loading, loadMessages, total } = useWhatsApp({
    autoRefresh: true, // Habilitado para atualizações automáticas
    refreshInterval: 5000, // Atualizar a cada 5 segundos
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<WhatsAppMessagesQueryParams>({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Conversas por página
  const [isCreateTaskConfirmOpen, setIsCreateTaskConfirmOpen] = useState(false);
  const [messageIdToCreate, setMessageIdToCreate] = useState<string | null>(
    null
  );
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreateTaskSuccessOpen, setIsCreateTaskSuccessOpen] = useState(false);
  const [createTaskRedirect, setCreateTaskRedirect] = useState<{
    teamId: string;
    projectId: string;
  } | null>(null);
  const [notificationConfig, setNotificationConfig] =
    useState<NotificationConfig | null>(null);

  // Verificar permissões
  const canViewMessages =
    permissionsContext?.hasPermission('whatsapp:view_messages') ?? false;
  const canSendMessages =
    permissionsContext?.hasPermission('whatsapp:send') ?? false;
  const canCreateTask =
    permissionsContext?.hasPermission('whatsapp:create_task') ?? false;

  // Carregar configuração de notificações
  useEffect(() => {
    const loadNotificationConfig = async () => {
      try {
        const config = await whatsappApi.getNotificationConfig();
        setNotificationConfig(config);
      } catch (error: any) {
        // Se não houver configuração, usa valores padrão
        if (error.response?.status !== 404) {
          console.error(
            'Erro ao carregar configuração de notificações:',
            error
          );
        }
        // Usa valores padrão se não encontrar configuração
        setNotificationConfig({
          id: '',
          companyId: '',
          onTimeMinutes: 15,
          delayedMinutes: 30,
          criticalMinutes: 60,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    };
    loadNotificationConfig();
  }, []);

  useEffect(() => {
    const load = async () => {
      await loadMessagesWithFilters();
      if (initialLoad) {
        setInitialLoad(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchTerm]);

  const loadMessagesWithFilters = async () => {
    const params: WhatsAppMessagesQueryParams = {
      ...filters,
      search: searchTerm || undefined,
      limit: 1000, // Carregar mais mensagens para agrupamento
    };
    await loadMessages(params);
    setCurrentPage(1); // Resetar página ao filtrar
  };

  const handleRefresh = async () => {
    await loadMessagesWithFilters();
  };

  // Agrupar mensagens por número de telefone (conversas)
  const conversations = useMemo(() => {
    const conversationMap = new Map<string, Conversation>();

    messages.forEach(message => {
      const phoneNumber = message.phoneNumber;
      const existing = conversationMap.get(phoneNumber);

      if (!existing) {
        // Primeira mensagem desta conversa
        conversationMap.set(phoneNumber, {
          phoneNumber,
          contactName: message.contactName,
          lastMessage: message,
          unreadCount:
            !message.readAt && message.direction === 'inbound' ? 1 : 0,
          messageCount: 1,
        });
      } else {
        // Atualizar conversa existente
        const messageTime = new Date(message.createdAt).getTime();
        const lastMessageTime = new Date(
          existing.lastMessage.createdAt
        ).getTime();

        // Atualizar última mensagem se for mais recente
        if (messageTime > lastMessageTime) {
          existing.lastMessage = message;
          existing.contactName = message.contactName || existing.contactName;
        }

        // Incrementar contadores
        existing.messageCount++;
        if (!message.readAt && message.direction === 'inbound') {
          existing.unreadCount++;
        }
      }
    });

    // Converter para array e ordenar por última mensagem (mais recente primeiro)
    return Array.from(conversationMap.values()).sort((a, b) => {
      const timeA = new Date(a.lastMessage.createdAt).getTime();
      const timeB = new Date(b.lastMessage.createdAt).getTime();
      return timeB - timeA; // Mais recente primeiro
    });
  }, [messages]);

  // Paginação de conversas
  const paginatedConversations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return conversations.slice(startIndex, endIndex);
  }, [conversations, currentPage, pageSize]);

  const totalPages = Math.ceil(conversations.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltersChange = (newFilters: WhatsAppMessagesQueryParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleMessageClick = (message: WhatsAppMessage) => {
    if (onMessageClick) {
      onMessageClick(message);
    } else if (!message.kanbanTaskId && canCreateTask) {
      if (!hasFunnelConfigured) {
        showError(
          'Configure um funil de vendas nas configurações do WhatsApp (Integrações) para poder criar tarefas a partir das mensagens.'
        );
        return;
      }
      setMessageIdToCreate(message.id);
      setIsCreateTaskConfirmOpen(true);
    }
  };

  /**
   * Criar tarefa a partir de mensagem WhatsApp
   *
   * ⚠️ IMPORTANTE (v1.8+):
   * - O sistema SEMPRE usa o projeto padrão configurado (defaultProjectId)
   * - O sistema SEMPRE usa a primeira coluna ativa do projeto (menor posição)
   * - Não é necessário fornecer projectId ou columnId - o backend faz isso automaticamente
   * - É OBRIGATÓRIO ter um projeto padrão configurado antes de criar tarefas
   * - Se não houver projeto padrão, retornará erro 400
   */
  const handleCreateTask = async () => {
    if (!messageIdToCreate) return;

    if (!canCreateTask) {
      showError(
        'Você não tem permissão para criar tarefas a partir de mensagens WhatsApp.'
      );
      setIsCreateTaskConfirmOpen(false);
      return;
    }

    setIsCreateTaskConfirmOpen(false);
    setIsCreatingTask(true);
    const mid = messageIdToCreate;
    const promise = whatsappApi.createTaskFromMessage(mid, {}).then(res => {
      if (res.warning) showError(res.warning);
      return res;
    });
    let response:
      | Awaited<ReturnType<typeof whatsappApi.createTaskFromMessage>>
      | undefined;
    try {
      response = await toast.promise(
        promise,
        {
          pending: {
            render: () => 'Criando tarefa...',
            icon: true,
          },
          success: {
            render: () => 'Tarefa criada!',
            type: 'success',
            icon: '✓',
          },
          error: {
            render({ data }: { data?: any }) {
              const msg =
                data?.response?.data?.message ||
                data?.message ||
                'Erro ao criar tarefa';
              return msg;
            },
            type: 'error',
            icon: true,
          },
        },
        {
          position: 'top-right',
          hideProgressBar: false,
          autoClose: 3000,
        }
      );
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      if (error.response?.status === 403) {
        showError('Você não tem permissão para realizar esta ação.');
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Erro ao criar tarefa';
        showError(errorMessage);
      }
    } finally {
      setIsCreatingTask(false);
      setMessageIdToCreate(null);
    }
    if (response) {
      loadMessages();
      if (response.teamId && response.projectId) {
        setCreateTaskRedirect({
          teamId: response.teamId,
          projectId: response.projectId,
        });
        setIsCreateTaskSuccessOpen(true);
      }
    }
  };

  const handleGoToFunnel = () => {
    if (createTaskRedirect) {
      window.location.href = `/sistema/kanban?teamId=${createTaskRedirect.teamId}&projectId=${createTaskRedirect.projectId}`;
    }
    setIsCreateTaskSuccessOpen(false);
    setCreateTaskRedirect(null);
  };

  if (!canViewMessages) {
    return (
      <Container>
        <EmptyState>
          <EmptyStateTitle>Acesso Negado</EmptyStateTitle>
          <EmptyStateText>
            Você não tem permissão para acessar esta funcionalidade.
            <br />
            Entre em contato com o administrador do sistema para solicitar
            acesso.
          </EmptyStateText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTop>
          <Title>Conversas WhatsApp ({conversations.length})</Title>
        </HeaderTop>
        <SearchInput
          type='text'
          placeholder='Buscar por número, nome ou mensagem...'
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
        <Controls>
          <FiltersContainer>
            <WhatsAppFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </FiltersContainer>
          <Tooltip content='Atualizar conversas' placement='right'>
            <RefreshButton onClick={handleRefresh} disabled={loading}>
              <MdRefresh
                size={18}
                style={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  transform: loading ? 'rotate(360deg)' : 'none',
                }}
              />
              Atualizar
            </RefreshButton>
          </Tooltip>
        </Controls>
      </Header>

      <MessagesContainer data-messages-container>
        {loading && initialLoad ? (
          <WhatsAppShimmer listOnly />
        ) : conversations.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>Nenhuma conversa encontrada</EmptyStateTitle>
            <EmptyStateText>
              {searchTerm || Object.keys(filters).length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'As conversas recebidas via WhatsApp aparecerão aqui'}
            </EmptyStateText>
          </EmptyState>
        ) : (
          <>
            {paginatedConversations.map(conversation => (
              <WhatsAppMessageCard
                key={conversation.phoneNumber}
                message={conversation.lastMessage}
                onCardClick={handleMessageClick}
                showConversation={!!onViewConversation}
                onViewConversation={onViewConversation}
                isSelected={conversation.phoneNumber === selectedPhoneNumber}
                unreadCount={conversation.unreadCount}
                timeStatus={
                  notificationConfig
                    ? calculateMessageTimeStatus(
                        conversation.lastMessage,
                        notificationConfig
                      )
                    : null
                }
              />
            ))}
          </>
        )}
      </MessagesContainer>

      {conversations.length > 0 && totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            Mostrando {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, conversations.length)} de{' '}
            {conversations.length} conversas
          </PaginationInfo>
          <PaginationButtons>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <MdChevronLeft size={18} />
              Anterior
            </PaginationButton>
            <PaginationInfo style={{ margin: '0 8px' }}>
              Página {currentPage} de {totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
              <MdChevronRight size={18} />
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      )}

      {canCreateTask && (
        <>
          <ConfirmDeleteModal
            isOpen={isCreateTaskConfirmOpen}
            onClose={() => {
              setIsCreateTaskConfirmOpen(false);
              setMessageIdToCreate(null);
            }}
            onConfirm={handleCreateTask}
            title='Criar Tarefa'
            message='Deseja criar uma tarefa no Kanban a partir desta mensagem do WhatsApp? A tarefa será criada no projeto padrão configurado.'
            isLoading={isCreatingTask}
            variant='mark-as-sold'
            confirmLabel='Criar Tarefa'
            loadingLabel='Criando...'
          />
          <ConfirmDeleteModal
            isOpen={isCreateTaskSuccessOpen}
            onClose={() => {
              setIsCreateTaskSuccessOpen(false);
              setCreateTaskRedirect(null);
            }}
            onConfirm={handleGoToFunnel}
            title='Tarefa criada!'
            message='A tarefa foi criada com sucesso. Deseja ir para o funil agora?'
            variant='mark-as-sold'
            confirmLabel='Sim, ir para o funil'
            cancelLabel='Ficar aqui'
          />
        </>
      )}
    </Container>
  );
};
