import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdCheckCircle,
  MdSchedule,
  MdCancel,
  MdFilterList,
  MdSearch,
  MdClear,
  MdArrowBack,
  MdPerson,
  MdAttachMoney,
  MdPlayArrow,
  MdStop,
  MdWarning,
  MdMoreVert,
} from 'react-icons/md';
import { useInspectionList, useInspection } from '@/hooks/useVistoria';
import { useInspectionApproval } from '@/hooks/useInspectionApproval';
import { useProperties } from '@/hooks/useProperties';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { usePermissionsContextOptional } from '@/contexts/PermissionsContext';
import { Layout } from '@/components/layout/Layout';
import { PermissionButton } from '@/components/common/PermissionButton';
import { FilterDrawer } from '@/components/common/FilterDrawer';
import DataScopeFilter from '@/components/common/DataScopeFilter';
import { Tooltip } from '@/components/ui/Tooltip';
import { DraggableContainer } from '@/components/common/DraggableContainer';
import { toast } from 'react-toastify';
import type { Inspection, InspectionFilter } from '@/types/vistoria-types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InspectionListShimmer } from '@/components/shimmer/InspectionListShimmer';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { StatusConfirmationModal } from '@/components/modals/StatusConfirmationModal';
import styled from 'styled-components';
import * as S from './VistoriaPage.styles';

export const VistoriaPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<
    InspectionFilter & { onlyMyData?: boolean }
  >({
    page: 1,
    limit: 20,
    status: undefined,
    type: undefined,
    propertyId: undefined,
    inspectorId: undefined,
    startDate: undefined,
    endDate: undefined,
    title: '',
    onlyMyData: false,
  });
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState<
    InspectionFilter & { onlyMyData?: boolean }
  >({
    page: 1,
    limit: 20,
    status: undefined,
    type: undefined,
    propertyId: undefined,
    inspectorId: undefined,
    startDate: undefined,
    endDate: undefined,
    title: '',
    onlyMyData: false,
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters(filters);
    }
  }, [showFiltersModal]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inspectionToDelete, setInspectionToDelete] =
    useState<Inspection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, loading, error, refetch } = useInspectionList(filters);
  const { deleteInspection, updateInspection } = useInspection();
  const { requestApproval } = useInspectionApproval();
  const { properties, getProperties } = useProperties();
  const { users, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();
  const { hasPermission } = usePermissions();

  const currentUser = getCurrentUser();
  const [pendingApprovals, setPendingApprovals] = useState<
    Record<string, boolean>
  >({});
  const [requestingApproval, setRequestingApproval] = useState<string | null>(
    null
  );
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{
    inspection: Inspection;
    newStatus: string;
  } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Verifica se alguma ação está em execução
  const isAnyActionProcessing =
    requestingApproval !== null || updatingStatus !== null || isDeleting;

  // Carregar propriedades e usuários para os filtros
  useEffect(() => {
    getProperties({}, { page: 1, limit: 100 });
    getUsers({ page: 1, limit: 100 });
  }, [getProperties, getUsers]);

  const handleCreate = () => {
    navigate('/inspection/new');
  };

  const handleView = (id: string) => {
    navigate(`/inspection/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/inspection/${id}/edit`);
  };

  const handleDelete = (inspection: Inspection) => {
    setInspectionToDelete(inspection);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!inspectionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteInspection(inspectionToDelete.id);
      toast.success('Vistoria excluída com sucesso!');
      setDeleteModalOpen(false);
      setInspectionToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao excluir vistoria');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setInspectionToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Agendada',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada',
      pending_approval: 'Aguardando Aprovação',
      approved: 'Aprovada',
      rejected: 'Rejeitada',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      scheduled: <MdSchedule size={16} />,
      in_progress: <MdSchedule size={16} />,
      completed: <MdCheckCircle size={16} />,
      cancelled: <MdCancel size={16} />,
      pending_approval: <MdSchedule size={16} />,
      approved: <MdCheckCircle size={16} />,
      rejected: <MdCancel size={16} />,
    };
    return icons[status] || <MdSchedule size={16} />;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      entry: 'Entrada',
      exit: 'Saída',
      maintenance: 'Manutenção',
      sale: 'Venda',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleUpdateStatusClick = (
    inspection: Inspection,
    newStatus: string
  ) => {
    setActionToConfirm({ inspection, newStatus });
    setConfirmModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!actionToConfirm) return;

    const { inspection, newStatus } = actionToConfirm;
    setUpdatingStatus(inspection.id);
    try {
      const updateData: any = { status: newStatus };

      // Adicionar data de início quando marcar como em andamento
      if (newStatus === 'in_progress' && !inspection.startDate) {
        updateData.startDate = new Date().toISOString();
      }

      // Adicionar data de conclusão quando marcar como concluída
      if (newStatus === 'completed' && !inspection.completionDate) {
        updateData.completionDate = new Date().toISOString();
      }

      await updateInspection(inspection.id, updateData);
      toast.success(
        `Vistoria ${getStatusLabel(newStatus).toLowerCase()} com sucesso!`
      );
      setConfirmModalOpen(false);
      setActionToConfirm(null);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar status da vistoria'
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCloseConfirmModal = () => {
    if (updatingStatus) return; // Não permitir fechar durante o carregamento
    setConfirmModalOpen(false);
    setActionToConfirm(null);
  };

  const handleRequestApproval = async (inspection: Inspection) => {
    if (!inspection.value || inspection.value <= 0) {
      toast.warning(
        'Vistoria precisa ter um valor para solicitar aprovação financeira'
      );
      return;
    }

    if (inspection.hasFinancialApproval) {
      toast.info('Esta vistoria já possui uma aprovação financeira solicitada');
      return;
    }

    setRequestingApproval(inspection.id);
    try {
      await requestApproval({
        inspectionId: inspection.id,
        amount: inspection.value,
        notes: `Aprovação financeira para vistoria: ${inspection.title}`,
      });
      toast.success('Solicitação de aprovação financeira enviada com sucesso!');
      // Recarregar dados para obter os novos campos hasFinancialApproval, approvalId, approvalStatus
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Erro ao solicitar aprovação financeira'
      );
    } finally {
      setRequestingApproval(null);
    }
  };

  const inspectors =
    users?.filter(
      user =>
        user.role === 'inspector' ||
        user.role === 'admin' ||
        user.role === 'master'
    ) || [];

  const getInspectorName = (inspectorId: string | undefined) => {
    if (!inspectorId) return 'Não informado';
    const inspector = inspectors.find(u => u.id === inspectorId);
    return inspector?.name || 'Não informado';
  };

  const handleToggleMenu = (inspectionId: string) => {
    setOpenMenuId(openMenuId === inspectionId ? null : inspectionId);
  };

  const handleMenuAction = (
    inspection: Inspection,
    action: string,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Fechar menu primeiro
    setOpenMenuId(null);

    // Executar ação imediatamente
    switch (action) {
      case 'view':
        handleView(inspection.id);
        break;
      case 'edit':
        handleEdit(inspection.id);
        break;
      case 'delete':
        handleDelete(inspection);
        break;
      case 'start':
        handleUpdateStatusClick(inspection, 'in_progress');
        break;
      case 'complete':
        handleUpdateStatusClick(inspection, 'completed');
        break;
      case 'cancel':
        handleUpdateStatusClick(inspection, 'cancelled');
        break;
      case 'request_approval':
        handleRequestApproval(inspection);
        break;
    }
  };

  // Fechar menu ao clicar fora
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(menuRefs.current).forEach(inspectionId => {
        const ref = menuRefs.current[inspectionId];
        if (ref && !ref.contains(event.target as Node)) {
          // Pequeno delay para permitir que ações do menu sejam executadas primeiro
          setTimeout(() => {
            setOpenMenuId(prev => (prev === inspectionId ? null : prev));
          }, 150);
        }
      });
    };

    if (openMenuId) {
      // Usar 'click' ao invés de 'mousedown' para dar tempo da ação ser executada
      document.addEventListener('click', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [openMenuId]);

  if (loading && !data) {
    return (
      <Layout>
        <InspectionListShimmer />
      </Layout>
    );
  }

  // CORREÇÃO: Não mostrar erro genérico se for erro de módulo não disponível
  // O modal será exibido para esse caso específico
  if (error && error !== 'MODULE_NOT_AVAILABLE') {
    return (
      <Layout>
        <S.PageContainer>
          <S.EmptyState>
            <S.EmptyIcon>⚠️</S.EmptyIcon>
            <S.EmptyText>Erro ao carregar vistorias</S.EmptyText>
            <S.EmptyDescription>{error}</S.EmptyDescription>
          </S.EmptyState>
        </S.PageContainer>
      </Layout>
    );
  }

  const inspections = data?.inspections || [];
  const total = data?.total || 0;
  const currentPage = data?.page || 1;
  const totalPages = data?.totalPages || 1;

  return (
    <Layout>
      <S.PageContainer>
        <S.PageHeader>
          <S.PageTitle>
            Vistorias
            <span
              style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280' }}
            >
              ({total})
            </span>
            <S.BackButton onClick={() => navigate(-1)}>
              <MdArrowBack size={20} />
              Voltar
            </S.BackButton>
          </S.PageTitle>
        </S.PageHeader>

        <S.Controls>
          <S.SearchBox>
            <S.SearchIcon />
            <S.SearchInput
              type='text'
              placeholder='Buscar por título ou propriedade...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </S.SearchBox>

          <S.ButtonsGroup>
            <FilterButton
              onClick={() => setShowFiltersModal(true)}
              $active={Object.values(filters).some(
                value => value !== undefined && value !== '' && value !== false
              )}
            >
              <MdFilterList size={16} />
              Filtros
              {Object.values(filters).some(
                value => value !== undefined && value !== '' && value !== false
              ) && (
                <FilterCount>
                  {
                    Object.values(filters).filter(
                      value =>
                        value !== undefined && value !== '' && value !== false
                    ).length
                  }
                </FilterCount>
              )}
            </FilterButton>

            <PermissionButton
              permission='inspection:create'
              variant='primary'
              size='medium'
              onClick={handleCreate}
            >
              <MdAdd size={20} />
              Nova Vistoria
            </PermissionButton>
          </S.ButtonsGroup>
        </S.Controls>

        {inspections.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>📋</S.EmptyIcon>
            <S.EmptyText>Nenhuma vistoria encontrada</S.EmptyText>
            <S.EmptyDescription>
              Não há vistorias cadastradas no momento. Use o botão acima para
              criar uma nova vistoria.
            </S.EmptyDescription>
            <PermissionButton
              permission='inspection:create'
              variant='primary'
              size='medium'
              onClick={handleCreate}
            >
              <MdAdd size={20} />
              Criar Primeira Vistoria
            </PermissionButton>
          </S.EmptyState>
        ) : (
          <>
            <DraggableContainer>
              <S.TableContainer>
                <S.Table>
                  <S.TableHead>
                    <tr>
                      <S.TableHeader>Título</S.TableHeader>
                      <S.TableHeader>Tipo</S.TableHeader>
                      <S.TableHeader>Propriedade</S.TableHeader>
                      <S.TableHeader>Inspetor</S.TableHeader>
                      <S.TableHeader>Valor</S.TableHeader>
                      <S.TableHeader>Data Agendada</S.TableHeader>
                      <S.TableHeader>Status</S.TableHeader>
                      <S.TableHeader style={{ textAlign: 'center' }}>
                        Ações
                      </S.TableHeader>
                    </tr>
                  </S.TableHead>
                  <tbody>
                    {inspections.map(inspection => (
                      <S.TableRow key={inspection.id}>
                        <S.TableCell>
                          <S.TitleInfo>
                            <Tooltip
                              content={
                                inspection.title.length > 30
                                  ? inspection.title
                                  : ''
                              }
                              placement='top'
                            >
                              <S.PropertyTitle>
                                {inspection.title.length > 30
                                  ? `${inspection.title.substring(0, 30)}...`
                                  : inspection.title}
                              </S.PropertyTitle>
                            </Tooltip>
                            {inspection.description && (
                              <S.PropertySubtitle>
                                {inspection.description.substring(0, 60)}...
                              </S.PropertySubtitle>
                            )}
                          </S.TitleInfo>
                        </S.TableCell>
                        <S.TableCell>
                          <S.TypeBadge $type={inspection.type}>
                            {getTypeLabel(inspection.type)}
                          </S.TypeBadge>
                        </S.TableCell>
                        <S.TableCell>
                          <S.PropertyInfo>
                            <S.PropertyAvatar>
                              {inspection.property?.mainImage?.url ||
                              inspection.property?.images?.[0]?.url ? (
                                <S.PropertyImage
                                  src={
                                    inspection.property?.mainImage?.url ||
                                    inspection.property?.images?.[0]?.url
                                  }
                                  alt={
                                    inspection.property?.title || 'Propriedade'
                                  }
                                  onError={e => {
                                    e.currentTarget.style.display = 'none';
                                    const placeholder = e.currentTarget
                                      .nextElementSibling as HTMLElement;
                                    if (placeholder)
                                      placeholder.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <S.PropertyPlaceholder
                                style={{
                                  display:
                                    inspection.property?.mainImage?.url ||
                                    inspection.property?.images?.[0]?.url
                                      ? 'none'
                                      : 'flex',
                                }}
                              >
                                🏠
                              </S.PropertyPlaceholder>
                            </S.PropertyAvatar>
                            <S.PropertyDetails>
                              <S.PropertyTitle>
                                {inspection.property?.title || 'N/A'}
                              </S.PropertyTitle>
                              <S.PropertySubtitle>
                                {inspection.property?.code || 'Sem código'}
                              </S.PropertySubtitle>
                            </S.PropertyDetails>
                          </S.PropertyInfo>
                        </S.TableCell>
                        <S.TableCell>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <MdPerson
                              size={16}
                              style={{
                                color: 'var(--color-text-secondary)',
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: '0.875rem',
                                color: 'var(--color-text)',
                              }}
                            >
                              {getInspectorName(inspection.inspectorId)}
                            </span>
                          </div>
                        </S.TableCell>
                        <S.TableCell>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <MdAttachMoney
                              size={16}
                              style={{
                                color: 'var(--color-primary)',
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                              }}
                            >
                              {formatCurrency(inspection.value)}
                            </span>
                          </div>
                        </S.TableCell>
                        <S.TableCell>
                          {formatDate(inspection.scheduledDate)}
                        </S.TableCell>
                        <S.TableCell>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                            }}
                          >
                            <S.StatusBadge $status={inspection.status}>
                              {getStatusIcon(inspection.status)}
                              {getStatusLabel(inspection.status)}
                            </S.StatusBadge>
                            {(inspection.hasFinancialApproval ||
                              pendingApprovals[inspection.id]) && (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.75rem',
                                  color:
                                    inspection.approvalStatus === 'pending'
                                      ? '#f59e0b'
                                      : inspection.approvalStatus === 'approved'
                                        ? '#10b981'
                                        : inspection.approvalStatus ===
                                            'rejected'
                                          ? '#ef4444'
                                          : '#f59e0b',
                                  marginTop: '4px',
                                }}
                              >
                                <MdWarning size={12} />
                                <span>
                                  {inspection.approvalStatus === 'pending' &&
                                    'Aprovação pendente'}
                                  {inspection.approvalStatus === 'approved' &&
                                    'Aprovada'}
                                  {inspection.approvalStatus === 'rejected' &&
                                    'Aprovação rejeitada'}
                                  {!inspection.approvalStatus &&
                                    'Aprovação pendente'}
                                </span>
                              </div>
                            )}
                          </div>
                        </S.TableCell>
                        <S.ActionsCell>
                          <S.ActionsMenuContainer
                            ref={el => (menuRefs.current[inspection.id] = el)}
                          >
                            <S.MenuButton
                              onClick={() => handleToggleMenu(inspection.id)}
                              $isOpen={openMenuId === inspection.id}
                            >
                              <MdMoreVert size={20} />
                            </S.MenuButton>
                            {openMenuId === inspection.id && (
                              <S.MenuDropdown
                                onClick={e => e.stopPropagation()}
                              >
                                <PermissionMenuItem
                                  permission='inspection:view'
                                  onClick={e =>
                                    handleMenuAction(inspection, 'view', e)
                                  }
                                >
                                  <MdVisibility size={18} />
                                  <span>Visualizar</span>
                                </PermissionMenuItem>

                                {/* Ações baseadas no status */}
                                {inspection.status === 'scheduled' && (
                                  <>
                                    {/* Só pode marcar como em andamento se não tem valor OU já tem aprovação APROVADA (não pendente) */}
                                    {(!inspection.value ||
                                      inspection.value <= 0 ||
                                      (inspection.hasFinancialApproval &&
                                        inspection.approvalStatus ===
                                          'approved')) &&
                                      !pendingApprovals[inspection.id] &&
                                      !(
                                        inspection.hasFinancialApproval &&
                                        inspection.approvalStatus === 'pending'
                                      ) && (
                                        <PermissionMenuItem
                                          permission='inspection:update'
                                          onClick={e =>
                                            handleMenuAction(
                                              inspection,
                                              'start',
                                              e
                                            )
                                          }
                                          disabled={
                                            isAnyActionProcessing ||
                                            updatingStatus === inspection.id
                                          }
                                        >
                                          <MdPlayArrow size={18} />
                                          <span>Marcar como em andamento</span>
                                        </PermissionMenuItem>
                                      )}

                                    <PermissionMenuItem
                                      permission='inspection:update'
                                      onClick={e =>
                                        handleMenuAction(
                                          inspection,
                                          'cancel',
                                          e
                                        )
                                      }
                                      disabled={
                                        isAnyActionProcessing ||
                                        updatingStatus === inspection.id
                                      }
                                    >
                                      <MdCancel size={18} />
                                      <span>Cancelar vistoria</span>
                                    </PermissionMenuItem>

                                    {/* Se tem valor e não tem aprovação, mostra botão de solicitar aprovação */}
                                    {inspection.value &&
                                      inspection.value > 0 &&
                                      !inspection.hasFinancialApproval &&
                                      !pendingApprovals[inspection.id] && (
                                        <PermissionMenuItem
                                          permission='inspection:update'
                                          onClick={e =>
                                            handleMenuAction(
                                              inspection,
                                              'request_approval',
                                              e
                                            )
                                          }
                                          disabled={
                                            isAnyActionProcessing ||
                                            requestingApproval === inspection.id
                                          }
                                        >
                                          <MdAttachMoney size={18} />
                                          <span>
                                            Solicitar aprovação financeira
                                          </span>
                                        </PermissionMenuItem>
                                      )}

                                    {/* Só pode editar se não tem aprovação */}
                                    {!inspection.hasFinancialApproval &&
                                      !pendingApprovals[inspection.id] && (
                                        <>
                                          <S.MenuDivider />
                                          <PermissionMenuItem
                                            permission='inspection:update'
                                            onClick={e =>
                                              handleMenuAction(
                                                inspection,
                                                'edit',
                                                e
                                              )
                                            }
                                            disabled={isAnyActionProcessing}
                                          >
                                            <MdEdit size={18} />
                                            <span>Editar</span>
                                          </PermissionMenuItem>
                                        </>
                                      )}
                                  </>
                                )}

                                {/* Se está em andamento */}
                                {inspection.status === 'in_progress' && (
                                  <>
                                    <PermissionMenuItem
                                      permission='inspection:update'
                                      onClick={e =>
                                        handleMenuAction(
                                          inspection,
                                          'complete',
                                          e
                                        )
                                      }
                                      disabled={
                                        isAnyActionProcessing ||
                                        updatingStatus === inspection.id
                                      }
                                    >
                                      <MdCheckCircle size={18} />
                                      <span>Marcar como concluída</span>
                                    </PermissionMenuItem>

                                    <PermissionMenuItem
                                      permission='inspection:update'
                                      onClick={e =>
                                        handleMenuAction(
                                          inspection,
                                          'cancel',
                                          e
                                        )
                                      }
                                      disabled={
                                        isAnyActionProcessing ||
                                        updatingStatus === inspection.id
                                      }
                                    >
                                      <MdCancel size={18} />
                                      <span>Cancelar vistoria</span>
                                    </PermissionMenuItem>
                                  </>
                                )}

                                {/* Divider antes de ações destrutivas */}
                                {(inspection.status === 'scheduled' ||
                                  inspection.status === 'in_progress' ||
                                  inspection.status === 'completed' ||
                                  (inspection.hasFinancialApproval &&
                                    inspection.approvalStatus === 'pending') ||
                                  pendingApprovals[inspection.id]) && (
                                  <S.MenuDivider />
                                )}

                                {/* Excluir - disponível em vários status */}
                                {(inspection.status === 'scheduled' ||
                                  inspection.status === 'in_progress' ||
                                  inspection.status === 'completed' ||
                                  (inspection.hasFinancialApproval &&
                                    inspection.approvalStatus === 'pending') ||
                                  pendingApprovals[inspection.id]) && (
                                  <PermissionMenuItem
                                    permission='inspection:delete'
                                    onClick={e =>
                                      handleMenuAction(inspection, 'delete', e)
                                    }
                                    disabled={isAnyActionProcessing}
                                    $danger
                                  >
                                    <MdDelete size={18} />
                                    <span>Excluir</span>
                                  </PermissionMenuItem>
                                )}
                              </S.MenuDropdown>
                            )}
                          </S.ActionsMenuContainer>
                        </S.ActionsCell>
                      </S.TableRow>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableContainer>
              <S.ScrollIndicator>← Deslize para ver mais →</S.ScrollIndicator>
            </DraggableContainer>

            {totalPages > 1 && (
              <S.Pagination>
                <S.PaginationInfo>
                  Página {currentPage} de {totalPages} • Total: {total}{' '}
                  vistorias
                </S.PaginationInfo>
                <S.PaginationButtons>
                  <S.PaginationButton
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </S.PaginationButton>
                  <S.PaginationButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </S.PaginationButton>
                </S.PaginationButtons>
              </S.Pagination>
            )}
          </>
        )}
      </S.PageContainer>

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title='Excluir Vistoria'
        message='Tem certeza que deseja excluir a vistoria:'
        itemName={inspectionToDelete?.title || ''}
        isLoading={isDeleting}
      />

      {/* Modal de confirmação de mudança de status */}
      <StatusConfirmationModal
        isOpen={confirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleUpdateStatus}
        inspection={actionToConfirm?.inspection || null}
        newStatus={actionToConfirm?.newStatus || ''}
        isLoading={
          !!updatingStatus && updatingStatus === actionToConfirm?.inspection?.id
        }
      />

      {/* Modal de Filtros */}
      <FilterDrawer
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        title='Filtros de Vistorias'
        footer={
          <>
            {Object.entries(localFilters).some(([key, value]) => {
              if (key === 'page' || key === 'limit') return false;
              return value !== undefined && value !== '' && value !== false;
            }) && (
              <ClearButton
                onClick={() => {
                  const cleared: InspectionFilter & { onlyMyData?: boolean } = {
                    page: 1,
                    limit: 20,
                    status: undefined,
                    type: undefined,
                    propertyId: undefined,
                    inspectorId: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    title: '',
                    onlyMyData: false,
                  };
                  setLocalFilters(cleared);
                  setFilters(cleared);
                  setShowFiltersModal(false);
                }}
              >
                <MdClear size={16} />
                Limpar Filtros
              </ClearButton>
            )}
            <ApplyButton
              onClick={() => {
                setFilters({ ...localFilters, page: 1 });
                setShowFiltersModal(false);
              }}
            >
              <MdFilterList size={16} />
              Aplicar Filtros
            </ApplyButton>
          </>
        }
      >
        <FiltersContainer>
          <FilterSection>
            <FilterSectionTitle>
              <MdSearch size={20} />
              Busca por Texto
            </FilterSectionTitle>

            <FilterSearchContainer>
              <SearchIcon>
                <MdSearch size={18} />
              </SearchIcon>
              <SearchInput
                type='text'
                placeholder='Buscar por título...'
                value={localFilters.title || ''}
                onChange={e =>
                  setLocalFilters(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </FilterSearchContainer>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>📋 Filtros por Categoria</FilterSectionTitle>

            <FilterGrid>
              <FilterGroup>
                <FilterLabel>Status</FilterLabel>
                <FilterSelect
                  value={localFilters.status || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      status: e.target.value || undefined,
                    }))
                  }
                >
                  <option value=''>Todos os status</option>
                  <option value='scheduled'>Agendada</option>
                  <option value='in_progress'>Em Andamento</option>
                  <option value='completed'>Concluída</option>
                  <option value='cancelled'>Cancelada</option>
                  <option value='pending_approval'>Aguardando Aprovação</option>
                  <option value='approved'>Aprovada</option>
                  <option value='rejected'>Rejeitada</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Tipo</FilterLabel>
                <FilterSelect
                  value={localFilters.type || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      type: e.target.value || undefined,
                    }))
                  }
                >
                  <option value=''>Todos os tipos</option>
                  <option value='entry'>Entrada</option>
                  <option value='exit'>Saída</option>
                  <option value='maintenance'>Manutenção</option>
                  <option value='sale'>Venda</option>
                </FilterSelect>
              </FilterGroup>

              {properties.length > 0 && (
                <FilterGroup>
                  <FilterLabel>Propriedade</FilterLabel>
                  <FilterSelect
                    value={localFilters.propertyId || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        propertyId: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value=''>Todas as propriedades</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.title} {property.code && `(${property.code})`}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
              )}

              {inspectors.length > 0 && (
                <FilterGroup>
                  <FilterLabel>Inspetor</FilterLabel>
                  <FilterSelect
                    value={localFilters.inspectorId || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        inspectorId: e.target.value || undefined,
                      }))
                    }
                  >
                    <option value=''>Todos os inspetores</option>
                    {inspectors.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>
                        {inspector.name}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
              )}
            </FilterGrid>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>📅 Filtro por Data</FilterSectionTitle>

            <FilterGrid>
              <FilterGroup>
                <FilterLabel>Data Inicial</FilterLabel>
                <FilterInput
                  type='date'
                  value={localFilters.startDate || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      startDate: e.target.value || undefined,
                    }))
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Data Final</FilterLabel>
                <FilterInput
                  type='date'
                  value={localFilters.endDate || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      endDate: e.target.value || undefined,
                    }))
                  }
                />
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>🔒 Escopo de Dados</FilterSectionTitle>

            <DataScopeFilter
              onlyMyData={localFilters.onlyMyData || false}
              onChange={value =>
                setLocalFilters(prev => ({ ...prev, onlyMyData: value }))
              }
              label='Mostrar apenas minhas vistorias'
              description='Quando marcado, mostra apenas vistorias que você criou, ignorando hierarquia de usuários.'
            />
          </FilterSection>

          {Object.entries(localFilters).some(([key, value]) => {
            if (key === 'page' || key === 'limit') return false;
            return value !== undefined && value !== '' && value !== false;
          }) && (
            <FilterStats>
              <span>Filtros ativos aplicados</span>
            </FilterStats>
          )}
        </FiltersContainer>
      </FilterDrawer>
    </Layout>
  );
};

// Componente para item de menu com verificação de permissão
const PermissionMenuItem: React.FC<{
  permission: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  $danger?: boolean;
  disabled?: boolean;
}> = ({ permission, onClick, children, $danger, disabled }) => {
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission(permission) ?? true;

  if (!hasPermission) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!disabled) {
      onClick(e);
    }
  };

  return (
    <S.MenuItem onClick={handleClick} $danger={$danger} disabled={disabled}>
      {children}
    </S.MenuItem>
  );
};

// Styled Components para FilterDrawer
const FilterButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  min-height: 40px;
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryHover || props.theme.colors.primary
        : props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}20;
  }

  &:active {
    transform: translateY(0);
  }
`;

const FilterCount = styled.span`
  background: ${props => props.theme.colors.danger};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const FiltersContainer = styled.div`
  padding: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const FilterSearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const SearchInput = styled(FilterInput)`
  padding-left: 40px;
`;

const FilterStats = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default VistoriaPage;
