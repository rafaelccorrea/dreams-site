import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';
import {
  MdArrowBack,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdCancel,
  MdAttachMoney,
  MdPerson,
  MdLocationOn,
  MdCameraAlt,
  MdCloudUpload,
  MdDelete as MdDeleteIcon,
  MdPlayArrow,
  MdImage,
  MdHistory,
  MdAdd,
  MdClose,
} from 'react-icons/md';
import { Layout } from '@/components/layout/Layout';
import { PermissionButton } from '@/components/common/PermissionButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { StatusConfirmationModal } from '@/components/modals/StatusConfirmationModal';
import { useInspectionById, useInspection } from '@/hooks/useVistoria';
import { inspectionApi } from '@/services/vistoriaApi';
import type { InspectionHistoryEntry } from '@/types/vistoria-types';
import { useInspectionApproval } from '@/hooks/useInspectionApproval';
import { usePermissions } from '@/hooks/usePermissions';
import { InspectionDetailShimmer } from '@/components/shimmer/InspectionDetailShimmer';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Inspection } from '@/types/vistoria-types';
import styled from 'styled-components';
import { formatPhoneDisplay, maskCPF, maskCNPJ } from '@/utils/masks';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;

  /* Estilizar scrollbar horizontal azul */
  &::-webkit-scrollbar:horizontal {
    height: 8px;
  }

  &::-webkit-scrollbar-track:horizontal {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb:horizontal {
    background: #2196f3;
    border-radius: 4px;

    &:hover {
      background: #1976d2;
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #2196f3 ${props => props.theme.colors.background};
`;

const PageHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px;
  margin-bottom: 32px;
`;

const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 8px 0 0 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const PageContent = styled.div`
  padding: 0 24px 32px;
  width: 100%;

  /* Estilizar scrollbar horizontal azul */
  &::-webkit-scrollbar:horizontal {
    height: 8px;
  }

  &::-webkit-scrollbar-track:horizontal {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb:horizontal {
    background: #2196f3;
    border-radius: 4px;

    &:hover {
      background: #1976d2;
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #2196f3 ${props => props.theme.colors.background};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  /* Estilizar scrollbar horizontal azul */
  &::-webkit-scrollbar:horizontal {
    height: 8px;
  }

  &::-webkit-scrollbar-track:horizontal {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb:horizontal {
    background: #2196f3;
    border-radius: 4px;

    &:hover {
      background: #1976d2;
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #2196f3 ${props => props.theme.colors.background};
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'scheduled':
        return '#e0e7ff';
      case 'in_progress':
        return '#fff7ed';
      case 'completed':
        return '#d1fae5';
      case 'cancelled':
        return '#fee2e2';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'scheduled':
        return '#4f46e5';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return props.theme.colors.text;
    }
  }};
`;

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoDeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${PhotoCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #dc2626;
  }
`;

const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.backgroundSecondary};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 12px;
`;

const UploadText = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const UploadSubtext = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const ChecklistItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ChecklistLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: block;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const ChecklistValue = styled.span<{ $value?: string }>`
  font-size: 1rem;
  color: ${props => {
    const value = props.$value?.toLowerCase() || '';
    if (value === 'excelente' || value === 'excellent') return '#10b981';
    if (value === 'bom' || value === 'good') return '#3b82f6';
    if (value === 'regular') return '#f59e0b';
    if (
      value === 'precisa_manutencao' ||
      value === 'precisa manutenção' ||
      value === 'needs_maintenance' ||
      value === 'needs maintenance' ||
      value === 'precisa reparo' ||
      value === 'needs repair'
    )
      return '#ef4444';
    if (value === 'ruim' || value === 'poor') return '#dc2626';
    return props.theme.colors.text;
  }};
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

// Estilos para o histórico
const HistoryFormContainer = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const HistoryTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HistoryFormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
`;

const CharacterCount = styled.span<{
  $isNearLimit: boolean;
  $isOverLimit: boolean;
}>`
  font-size: 0.75rem;
  color: ${props =>
    props.$isOverLimit
      ? props.theme.colors.error || '#ef4444'
      : props.$isNearLimit
        ? '#f59e0b'
        : props.theme.colors.textSecondary};
  font-weight: ${props =>
    props.$isOverLimit || props.$isNearLimit ? 600 : 400};
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const HistoryEntry = styled.div`
  padding: 16px 0;
`;

const HistoryEntryHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const HistoryEntryUser = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const HistoryEntryAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.theme.colors.border};
`;

const HistoryEntryAvatarPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  border: 2px solid ${props => props.theme.colors.primary}40;
`;

const HistoryEntryUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HistoryEntryUserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HistoryEntryDate = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const HistoryEntryDescription = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
  margin: 0;
  padding-left: 52px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const HistoryEntryDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 16px 0;
`;

const HistoryDeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.error}15;
    opacity: 1;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const VistoriaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{
    inspection: Inspection;
    newStatus: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState<string | null>(null);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [history, setHistory] = useState<InspectionHistoryEntry[]>([]);
  const [addingHistoryEntry, setAddingHistoryEntry] = useState(false);
  const [removingHistoryEntry, setRemovingHistoryEntry] = useState<
    string | null
  >(null);
  const [newHistoryDescription, setNewHistoryDescription] = useState('');
  const [showAddHistoryForm, setShowAddHistoryForm] = useState(false);

  // Verifica se alguma ação está em execução
  const isAnyActionProcessing =
    updatingStatus ||
    isDeleting ||
    uploadingPhoto ||
    removingPhoto !== null ||
    requestingApproval ||
    addingHistoryEntry ||
    removingHistoryEntry !== null;

  const { inspection, loading, error, refetch } = useInspectionById(id || null);

  // Funções do histórico
  const loadHistory = useCallback(async () => {
    if (!inspection?.id) return;
    try {
      const historyData = await inspectionApi.getHistory(inspection.id);
      setHistory(historyData);
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, [inspection?.id]);

  // Se o histórico já vem na vistoria, usar ele, senão carregar
  useEffect(() => {
    if (inspection?.id) {
      if (inspection.history && inspection.history.length > 0) {
        // Se já vem no objeto, usar ele
        setHistory(inspection.history);
      } else {
        // Senão, carregar do endpoint
        loadHistory();
      }
    }
  }, [inspection?.id, inspection?.history, loadHistory]);

  const { deleteInspection, updateInspection, uploadPhoto, removePhoto } =
    useInspection();
  const { requestApproval } = useInspectionApproval();
  const { hasPermission } = usePermissions();

  // Função para construir a URL completa da foto
  const getPhotoUrl = (photoPath: string): string => {
    if (!photoPath) return '';
    // Se já for uma URL completa (http:// ou https://), retornar como está
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    // Se começar com /, adicionar baseURL
    if (photoPath.startsWith('/')) {
      return `${API_BASE_URL}${photoPath}`;
    }
    // Caso contrário, tratar como caminho relativo
    return `${API_BASE_URL}/${photoPath}`;
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      entry: 'Entrada',
      exit: 'Saída',
      maintenance: 'Manutenção',
      sale: 'Venda',
    };
    return labels[type] || type;
  };

  const translateChecklistValue = (value: string): string => {
    const translations: Record<string, string> = {
      excellent: 'Excelente',
      excelente: 'Excelente',
      good: 'Bom',
      bom: 'Bom',
      regular: 'Regular',
      needs_maintenance: 'Precisa Manutenção',
      precisa_manutencao: 'Precisa Manutenção',
      'needs repair': 'Precisa Manutenção',
      'precisa reparo': 'Precisa Manutenção',
      poor: 'Ruim',
      ruim: 'Ruim',
      ok: 'OK',
      yes: 'Sim',
      sim: 'Sim',
      no: 'Não',
      nao: 'Não',
      não: 'Não',
    };
    return translations[value.toLowerCase()] || value;
  };

  const translateChecklistKey = (key: string): string => {
    const translations: Record<string, string> = {
      walls: 'Paredes',
      paredes: 'Paredes',
      doors: 'Portas',
      portas: 'Portas',
      windows: 'Janelas',
      janelas: 'Janelas',
      floor: 'Piso',
      piso: 'Piso',
      ceiling: 'Teto',
      teto: 'Teto',
      plumbing: 'Encanamento',
      encanamento: 'Encanamento',
      electrical: 'Elétrica',
      eletrica: 'Elétrica',
      painting: 'Pintura',
      pintura: 'Pintura',
      kitchen: 'Cozinha',
      cozinha: 'Cozinha',
      bathroom: 'Banheiro',
      banheiro: 'Banheiro',
      bedroom: 'Quarto',
      quarto: 'Quarto',
      living_room: 'Sala',
      sala: 'Sala',
      garage: 'Garagem',
      garagem: 'Garagem',
      yard: 'Quintal',
      quintal: 'Quintal',
      external_area: 'Área Externa',
      area_externa: 'Área Externa',
    };
    const translated = translations[key.toLowerCase()];
    return (
      translated ||
      key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    );
  };

  const formatDateValue = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para formatar documento (CPF ou CNPJ)
  const formatDocument = (document?: string): string => {
    if (!document) return 'Não informado';

    // Remove caracteres não alfanuméricos para verificar o tamanho
    const cleanDocument = document.replace(/[^A-Z0-9]/gi, '');

    // Se tem 11 dígitos, é CPF
    if (cleanDocument.length === 11 && /^\d+$/.test(cleanDocument)) {
      return maskCPF(document);
    }

    // Se tem 14 caracteres (pode ser alfanumérico), é CNPJ
    if (cleanDocument.length === 14) {
      return maskCNPJ(document);
    }

    // Se não se encaixa em nenhum formato conhecido, retorna como está
    return document;
  };

  // Função para formatar telefone
  const formatPhone = (phone?: string): string => {
    if (!phone) return 'Não informado';
    return formatPhoneDisplay(phone);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!inspection) return;

    setIsDeleting(true);
    try {
      await deleteInspection(inspection.id);
      toast.success('Vistoria excluída com sucesso!');
      navigate('/inspection');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao excluir vistoria');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleUpdateStatusClick = (newStatus: string) => {
    if (!inspection) return;
    setActionToConfirm({ inspection, newStatus });
    setConfirmModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!actionToConfirm || !inspection) return;

    setUpdatingStatus(true);
    try {
      const updateData: any = { status: actionToConfirm.newStatus };

      // Adicionar data de início quando marcar como em andamento
      if (
        actionToConfirm.newStatus === 'in_progress' &&
        !inspection.startDate
      ) {
        updateData.startDate = new Date().toISOString();
      }

      // Adicionar data de conclusão quando marcar como concluída
      if (
        actionToConfirm.newStatus === 'completed' &&
        !inspection.completionDate
      ) {
        updateData.completionDate = new Date().toISOString();
      }

      await updateInspection(inspection.id, updateData);
      toast.success(
        `Vistoria ${getStatusLabel(actionToConfirm.newStatus).toLowerCase()} com sucesso!`
      );
      setConfirmModalOpen(false);
      setActionToConfirm(null);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar status da vistoria'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCloseConfirmModal = () => {
    if (updatingStatus) return;
    setConfirmModalOpen(false);
    setActionToConfirm(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inspection) return;

    // Verificar limite de 12 imagens
    const currentPhotosCount = inspection.photos?.length || 0;
    if (currentPhotosCount >= 12) {
      toast.warning(
        'Limite de 12 imagens atingido. Remova uma foto antes de adicionar outra.'
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setUploadingPhoto(true);
    try {
      await uploadPhoto(inspection.id, file);
      toast.success('Foto adicionada com sucesso!');
      refetch();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao fazer upload da foto'
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    if (!inspection) return;

    setRemovingPhoto(photoUrl);
    try {
      await removePhoto(inspection.id, photoUrl);
      toast.success('Foto removida com sucesso!');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao remover foto');
    } finally {
      setRemovingPhoto(null);
    }
  };

  const handleRequestApproval = async () => {
    if (!inspection || !inspection.value || inspection.value <= 0) {
      toast.warning(
        'Vistoria precisa ter um valor para solicitar aprovação financeira'
      );
      return;
    }

    if (inspection.hasFinancialApproval) {
      toast.info('Esta vistoria já possui uma aprovação financeira solicitada');
      return;
    }

    setRequestingApproval(true);
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
      setRequestingApproval(false);
    }
  };

  const handleAddHistoryEntry = async () => {
    if (!inspection?.id || !newHistoryDescription.trim()) {
      toast.warning('Por favor, preencha a descrição do registro');
      return;
    }

    if (newHistoryDescription.length > 500) {
      toast.error('A descrição não pode exceder 500 caracteres');
      return;
    }

    setAddingHistoryEntry(true);
    try {
      const newEntry = await inspectionApi.addHistoryEntry(
        inspection.id,
        newHistoryDescription.trim()
      );
      setHistory(prev => [...prev, newEntry]);
      setNewHistoryDescription('');
      setShowAddHistoryForm(false);
      toast.success('Registro adicionado ao histórico!');
      // Recarregar vistoria para obter histórico atualizado
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Erro ao adicionar registro ao histórico'
      );
    } finally {
      setAddingHistoryEntry(false);
    }
  };

  const handleRemoveHistoryEntry = async (historyId: string) => {
    if (!inspection?.id) return;

    setRemovingHistoryEntry(historyId);
    try {
      await inspectionApi.removeHistoryEntry(inspection.id, historyId);
      setHistory(prev => prev.filter(entry => entry.id !== historyId));
      toast.success('Registro removido do histórico!');
      // Recarregar vistoria para obter histórico atualizado
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Erro ao remover registro do histórico'
      );
    } finally {
      setRemovingHistoryEntry(null);
    }
  };

  // Estilizar scrollbar horizontal global em azul
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body::-webkit-scrollbar:horizontal,
      html::-webkit-scrollbar:horizontal {
        height: 8px;
      }
      
      body::-webkit-scrollbar-track:horizontal,
      html::-webkit-scrollbar-track:horizontal {
        background: ${document.documentElement.style.getPropertyValue('--background-color') || '#f5f5f5'};
      }
      
      body::-webkit-scrollbar-thumb:horizontal,
      html::-webkit-scrollbar-thumb:horizontal {
        background: #2196F3;
        border-radius: 4px;
      }
      
      body::-webkit-scrollbar-thumb:horizontal:hover,
      html::-webkit-scrollbar-thumb:horizontal:hover {
        background: #1976D2;
      }
      
      body {
        scrollbar-width: thin;
        scrollbar-color: #2196F3 transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (loading) {
    return (
      <Layout>
        <InspectionDetailShimmer />
      </Layout>
    );
  }

  if (!loading && (error || !inspection)) {
    return (
      <Layout>
        <PageContainer>
          <Card>
            <EmptyState>
              <h2>Erro ao carregar vistoria</h2>
              <p>{error || 'Vistoria não encontrada'}</p>
              <BackButton onClick={() => navigate('/inspection')}>
                <MdArrowBack size={20} />
                Voltar para Vistorias
              </BackButton>
            </EmptyState>
          </Card>
        </PageContainer>
      </Layout>
    );
  }

  if (!inspection) {
    return null;
  }

  const canEdit = hasPermission('inspection:update');

  // Type narrowing: após a verificação acima, inspection não pode ser null
  // Usar non-null assertion onde necessário

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitleContainer>
            <div>
              <PageTitle>{inspection.title}</PageTitle>
              <PageSubtitle>
                {inspection.description || 'Sem descrição'}
              </PageSubtitle>
            </div>
            <BackButton onClick={() => navigate('/inspection')}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageTitleContainer>

          <ActionsContainer>
            {/* Ações - só aparecem se status = scheduled */}
            {inspection.status === 'scheduled' && (
              <>
                {/* Só pode marcar como em andamento se não tem valor OU já tem aprovação APROVADA (não pendente) */}
                {(!inspection.value ||
                  inspection.value <= 0 ||
                  (inspection.hasFinancialApproval &&
                    inspection.approvalStatus === 'approved')) &&
                  !(
                    inspection.hasFinancialApproval &&
                    inspection.approvalStatus === 'pending'
                  ) && (
                    <Tooltip content='Marcar como em andamento' placement='top'>
                      <PermissionButton
                        permission='inspection:update'
                        variant='secondary'
                        size='medium'
                        onClick={() => handleUpdateStatusClick('in_progress')}
                        disabled={isAnyActionProcessing}
                      >
                        <MdPlayArrow size={20} />
                        Iniciar
                      </PermissionButton>
                    </Tooltip>
                  )}

                <Tooltip content='Cancelar vistoria' placement='top'>
                  <PermissionButton
                    permission='inspection:update'
                    variant='secondary'
                    size='medium'
                    onClick={() => handleUpdateStatusClick('cancelled')}
                    disabled={isAnyActionProcessing}
                  >
                    <MdCancel size={20} />
                    Cancelar
                  </PermissionButton>
                </Tooltip>

                {/* Se tem valor e não tem aprovação, mostra botão de solicitar aprovação */}
                {inspection.value &&
                  inspection.value > 0 &&
                  !inspection.hasFinancialApproval && (
                    <Tooltip
                      content='Solicitar aprovação financeira'
                      placement='top'
                    >
                      <PermissionButton
                        permission='inspection:update'
                        variant='secondary'
                        size='medium'
                        onClick={handleRequestApproval}
                        disabled={isAnyActionProcessing || requestingApproval}
                      >
                        <MdAttachMoney size={20} />
                        {requestingApproval
                          ? 'Solicitando...'
                          : 'Solicitar Aprovação'}
                      </PermissionButton>
                    </Tooltip>
                  )}
              </>
            )}

            {/* Se está em andamento - pode cancelar, marcar como concluída ou deletar */}
            {inspection.status === 'in_progress' && (
              <>
                <Tooltip content='Marcar como concluída' placement='top'>
                  <PermissionButton
                    permission='inspection:update'
                    variant='primary'
                    size='medium'
                    onClick={() => handleUpdateStatusClick('completed')}
                    disabled={isAnyActionProcessing}
                  >
                    <MdCheckCircle size={20} />
                    Concluir
                  </PermissionButton>
                </Tooltip>

                <Tooltip content='Cancelar vistoria' placement='top'>
                  <PermissionButton
                    permission='inspection:update'
                    variant='secondary'
                    size='medium'
                    onClick={() => handleUpdateStatusClick('cancelled')}
                    disabled={isAnyActionProcessing}
                  >
                    <MdCancel size={20} />
                    Cancelar
                  </PermissionButton>
                </Tooltip>
              </>
            )}

            {/* Botão de editar - só aparece se status = scheduled e não tem aprovação */}
            {inspection.status === 'scheduled' &&
              !inspection.hasFinancialApproval &&
              !(
                inspection.hasFinancialApproval &&
                inspection.approvalStatus === 'pending'
              ) && (
                <Tooltip content='Editar vistoria' placement='top'>
                  <PermissionButton
                    permission='inspection:update'
                    variant='secondary'
                    size='medium'
                    onClick={() =>
                      navigate(`/inspection/${inspection.id}/edit`)
                    }
                    disabled={isAnyActionProcessing}
                  >
                    <MdEdit size={20} />
                    Editar
                  </PermissionButton>
                </Tooltip>
              )}

            {/* Badge de aprovação pendente */}
            {inspection.hasFinancialApproval && (
              <Tooltip
                content={
                  inspection.approvalStatus === 'pending'
                    ? 'Aprovação financeira pendente'
                    : inspection.approvalStatus === 'approved'
                      ? 'Aprovação financeira concedida'
                      : inspection.approvalStatus === 'rejected'
                        ? 'Aprovação financeira rejeitada'
                        : 'Aprovação financeira solicitada'
                }
                placement='top'
              >
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor:
                      inspection.approvalStatus === 'pending'
                        ? '#fff7ed'
                        : inspection.approvalStatus === 'approved'
                          ? '#d1fae5'
                          : inspection.approvalStatus === 'rejected'
                            ? '#fee2e2'
                            : '#fff7ed',
                    color:
                      inspection.approvalStatus === 'pending'
                        ? '#f59e0b'
                        : inspection.approvalStatus === 'approved'
                          ? '#10b981'
                          : inspection.approvalStatus === 'rejected'
                            ? '#ef4444'
                            : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <MdAttachMoney size={20} />
                  {inspection.approvalStatus === 'pending' &&
                    'Aprovação Pendente'}
                  {inspection.approvalStatus === 'approved' && 'Aprovada'}
                  {inspection.approvalStatus === 'rejected' &&
                    'Aprovação Rejeitada'}
                  {!inspection.approvalStatus && 'Aprovação Solicitada'}
                </div>
              </Tooltip>
            )}

            {/* Botão de excluir - aparece sempre */}
            <Tooltip content='Excluir vistoria' placement='top'>
              <PermissionButton
                permission='inspection:delete'
                variant='danger'
                size='medium'
                onClick={handleDelete}
                disabled={isAnyActionProcessing}
              >
                <MdDelete size={20} />
                Excluir
              </PermissionButton>
            </Tooltip>
          </ActionsContainer>
        </PageHeader>

        <PageContent>
          <ContentGrid>
            <div>
              {/* Informações Principais */}
              <Card style={{ marginBottom: 24 }}>
                <CardHeader>
                  <CardTitle>📋 Informações da Vistoria</CardTitle>
                </CardHeader>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <StatusBadge $status={inspection.status}>
                      {getStatusLabel(inspection.status)}
                    </StatusBadge>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Tipo</InfoLabel>
                    <TypeBadge $type={inspection.type}>
                      {getTypeLabel(inspection.type)}
                    </TypeBadge>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Data Agendada</InfoLabel>
                    <InfoValue>
                      {formatDateValue(inspection.scheduledDate)}
                    </InfoValue>
                  </InfoItem>
                  {inspection.startDate && (
                    <InfoItem>
                      <InfoLabel>Data de Início</InfoLabel>
                      <InfoValue>
                        {formatDateValue(inspection.startDate)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {inspection.completionDate && (
                    <InfoItem>
                      <InfoLabel>Data de Conclusão</InfoLabel>
                      <InfoValue>
                        {formatDateValue(inspection.completionDate)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  <InfoItem>
                    <InfoLabel>Valor</InfoLabel>
                    <InfoValue>{formatCurrency(inspection.value)}</InfoValue>
                  </InfoItem>
                  {inspection.hasFinancialApproval && (
                    <>
                      <InfoItem>
                        <InfoLabel>Status da Aprovação Financeira</InfoLabel>
                        <StatusBadge
                          $status={
                            inspection.approvalStatus === 'pending'
                              ? 'scheduled'
                              : inspection.approvalStatus === 'approved'
                                ? 'completed'
                                : inspection.approvalStatus === 'rejected'
                                  ? 'cancelled'
                                  : 'scheduled'
                          }
                        >
                          {inspection.approvalStatus === 'pending' &&
                            '⏳ Pendente'}
                          {inspection.approvalStatus === 'approved' &&
                            '✅ Aprovada'}
                          {inspection.approvalStatus === 'rejected' &&
                            '❌ Rejeitada'}
                          {!inspection.approvalStatus && '⏳ Pendente'}
                        </StatusBadge>
                      </InfoItem>
                      {inspection.approvalId && (
                        <InfoItem>
                          <InfoLabel>ID da Aprovação</InfoLabel>
                          <InfoValue
                            style={{
                              fontSize: '0.875rem',
                              fontFamily: 'monospace',
                            }}
                          >
                            {inspection.approvalId}
                          </InfoValue>
                        </InfoItem>
                      )}
                    </>
                  )}
                </InfoGrid>
              </Card>

              {/* Fotos */}
              <Card style={{ marginBottom: 24 }}>
                <CardHeader>
                  <CardTitle>
                    <MdCameraAlt size={20} />
                    Fotos ({inspection.photos?.length || 0})
                  </CardTitle>
                </CardHeader>
                {canEdit && (
                  <UploadArea
                    htmlFor='photo-upload'
                    style={{
                      marginBottom: 20,
                      opacity: (inspection.photos?.length || 0) >= 12 ? 0.5 : 1,
                      cursor:
                        (inspection.photos?.length || 0) >= 12
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    <HiddenInput
                      ref={fileInputRef}
                      id='photo-upload'
                      type='file'
                      accept='image/*'
                      onChange={handlePhotoUpload}
                      disabled={
                        uploadingPhoto || (inspection.photos?.length || 0) >= 12
                      }
                    />
                    <UploadIcon>
                      <MdCloudUpload />
                    </UploadIcon>
                    <UploadText>
                      {uploadingPhoto
                        ? 'Enviando foto...'
                        : (inspection.photos?.length || 0) >= 12
                          ? 'Limite de 12 imagens atingido'
                          : 'Clique para adicionar foto'}
                    </UploadText>
                    <UploadSubtext>
                      PNG, JPG, WEBP (máx. 5MB) •{' '}
                      {inspection.photos?.length || 0}/12 imagens
                    </UploadSubtext>
                  </UploadArea>
                )}
                {inspection.photos && inspection.photos.length > 0 ? (
                  <PhotosGrid>
                    {inspection.photos.map((photo, index) => {
                      const photoUrl = getPhotoUrl(photo);
                      return (
                        <PhotoCard key={index}>
                          <PhotoImage
                            src={photoUrl}
                            alt={`Foto ${index + 1}`}
                            onError={e => {
                              console.error('Erro ao carregar foto:', photoUrl);
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                          {canEdit && (
                            <PhotoDeleteButton
                              onClick={() => handleRemovePhoto(photo)}
                              disabled={removingPhoto === photo}
                              title='Remover foto'
                            >
                              <MdDeleteIcon size={16} />
                            </PhotoDeleteButton>
                          )}
                        </PhotoCard>
                      );
                    })}
                  </PhotosGrid>
                ) : (
                  <EmptyState>
                    <MdImage
                      size={48}
                      style={{ marginBottom: 16, opacity: 0.3 }}
                    />
                    <p>Nenhuma foto adicionada</p>
                  </EmptyState>
                )}
              </Card>

              {/* Checklist */}
              {inspection.checklist &&
                Object.keys(inspection.checklist).length > 0 && (
                  <Card style={{ marginBottom: 24 }}>
                    <CardHeader>
                      <CardTitle>✅ Checklist</CardTitle>
                    </CardHeader>
                    <ChecklistGrid>
                      {Object.entries(inspection.checklist).map(
                        ([key, value]) => {
                          const translatedKey = translateChecklistKey(key);
                          const translatedValue = translateChecklistValue(
                            String(value)
                          );
                          return (
                            <ChecklistItem key={key}>
                              <ChecklistLabel>{translatedKey}</ChecklistLabel>
                              <ChecklistValue
                                $value={String(value).toLowerCase()}
                              >
                                {translatedValue}
                              </ChecklistValue>
                            </ChecklistItem>
                          );
                        }
                      )}
                    </ChecklistGrid>
                  </Card>
                )}

              {/* Histórico */}
              <Card style={{ marginBottom: 24 }}>
                <CardHeader>
                  <CardTitle>
                    <MdHistory size={20} />
                    Histórico ({history.length})
                  </CardTitle>
                  {canEdit && (
                    <PermissionButton
                      permission='inspection:update'
                      variant='secondary'
                      size='small'
                      onClick={() => setShowAddHistoryForm(!showAddHistoryForm)}
                      disabled={isAnyActionProcessing}
                      style={{ marginLeft: 'auto' }}
                    >
                      {showAddHistoryForm ? (
                        <>
                          <MdClose size={16} />
                          Cancelar
                        </>
                      ) : (
                        <>
                          <MdAdd size={16} />
                          Adicionar Registro
                        </>
                      )}
                    </PermissionButton>
                  )}
                </CardHeader>

                {/* Formulário para adicionar registro */}
                {showAddHistoryForm && canEdit && (
                  <HistoryFormContainer>
                    <HistoryTextArea
                      placeholder='Descreva o que aconteceu na vistoria...'
                      value={newHistoryDescription}
                      onChange={e => {
                        const value = e.target.value;
                        if (value.length <= 500) {
                          setNewHistoryDescription(value);
                        }
                      }}
                      disabled={addingHistoryEntry}
                      rows={3}
                      maxLength={500}
                    />
                    <HistoryFormActions>
                      <CharacterCount
                        $isNearLimit={newHistoryDescription.length >= 450}
                        $isOverLimit={newHistoryDescription.length > 500}
                      >
                        {newHistoryDescription.length}/500 caracteres
                      </CharacterCount>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <PermissionButton
                          permission='inspection:update'
                          variant='primary'
                          size='small'
                          onClick={handleAddHistoryEntry}
                          disabled={
                            addingHistoryEntry ||
                            !newHistoryDescription.trim() ||
                            newHistoryDescription.length > 500
                          }
                        >
                          {addingHistoryEntry ? 'Adicionando...' : 'Adicionar'}
                        </PermissionButton>
                        <PermissionButton
                          permission='inspection:update'
                          variant='secondary'
                          size='small'
                          onClick={() => {
                            setShowAddHistoryForm(false);
                            setNewHistoryDescription('');
                          }}
                          disabled={addingHistoryEntry}
                        >
                          Cancelar
                        </PermissionButton>
                      </div>
                    </HistoryFormActions>
                  </HistoryFormContainer>
                )}

                {/* Lista de registros */}
                {history.length > 0 ? (
                  <HistoryList>
                    {history.map((entry, index) => (
                      <HistoryEntry key={entry.id}>
                        <HistoryEntryHeader>
                          <HistoryEntryUser>
                            {entry.user?.avatar ? (
                              <HistoryEntryAvatar
                                src={entry.user.avatar}
                                alt={entry.user.name}
                              />
                            ) : (
                              <HistoryEntryAvatarPlaceholder>
                                {entry.user?.name?.charAt(0).toUpperCase() ||
                                  '?'}
                              </HistoryEntryAvatarPlaceholder>
                            )}
                            <HistoryEntryUserInfo>
                              <HistoryEntryUserName>
                                {entry.user?.name || 'Usuário desconhecido'}
                              </HistoryEntryUserName>
                              <HistoryEntryDate>
                                {formatDateValue(entry.createdAt)}
                              </HistoryEntryDate>
                            </HistoryEntryUserInfo>
                          </HistoryEntryUser>
                          {canEdit && (
                            <Tooltip content='Remover registro' placement='top'>
                              <HistoryDeleteButton
                                onClick={() =>
                                  handleRemoveHistoryEntry(entry.id)
                                }
                                disabled={removingHistoryEntry === entry.id}
                              >
                                {removingHistoryEntry === entry.id ? (
                                  '...'
                                ) : (
                                  <MdDeleteIcon size={16} />
                                )}
                              </HistoryDeleteButton>
                            </Tooltip>
                          )}
                        </HistoryEntryHeader>
                        <HistoryEntryDescription>
                          {entry.description}
                        </HistoryEntryDescription>
                        {index < history.length - 1 && <HistoryEntryDivider />}
                      </HistoryEntry>
                    ))}
                  </HistoryList>
                ) : (
                  <EmptyState>
                    <MdHistory
                      size={48}
                      style={{ marginBottom: 16, opacity: 0.3 }}
                    />
                    <p>Nenhum registro no histórico</p>
                    {canEdit && (
                      <p style={{ fontSize: '0.875rem', marginTop: 8 }}>
                        Clique em "Adicionar Registro" para começar
                      </p>
                    )}
                  </EmptyState>
                )}
              </Card>

              {/* Observações */}
              {inspection.observations && (
                <Card>
                  <CardHeader>
                    <CardTitle>📝 Observações</CardTitle>
                  </CardHeader>
                  <TextArea readOnly value={inspection.observations} />
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Propriedade */}
              {inspection.property && (
                <Card style={{ marginBottom: 24 }}>
                  <CardHeader>
                    <CardTitle>
                      <MdLocationOn size={20} />
                      Propriedade
                    </CardTitle>
                  </CardHeader>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>Título</InfoLabel>
                      <InfoValue>{inspection.property.title}</InfoValue>
                    </InfoItem>
                    {inspection.property.code && (
                      <InfoItem>
                        <InfoLabel>Código</InfoLabel>
                        <InfoValue>{inspection.property.code}</InfoValue>
                      </InfoItem>
                    )}
                    <InfoItem>
                      <InfoLabel>Endereço</InfoLabel>
                      <InfoValue>{inspection.property.address}</InfoValue>
                    </InfoItem>
                  </InfoGrid>
                </Card>
              )}

              {/* Inspector */}
              {inspection.inspector && (
                <Card style={{ marginBottom: 24 }}>
                  <CardHeader>
                    <CardTitle>
                      <MdPerson size={20} />
                      Inspetor Responsável
                    </CardTitle>
                  </CardHeader>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>Nome</InfoLabel>
                      <InfoValue>{inspection.inspector.name}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Email</InfoLabel>
                      <InfoValue>{inspection.inspector.email}</InfoValue>
                    </InfoItem>
                  </InfoGrid>
                </Card>
              )}

              {/* Responsável */}
              {(inspection.responsibleName ||
                inspection.responsibleDocument ||
                inspection.responsiblePhone) && (
                <Card style={{ marginBottom: 24 }}>
                  <CardHeader>
                    <CardTitle>
                      <MdPerson size={20} />
                      Responsável pela Vistoria
                    </CardTitle>
                  </CardHeader>
                  <InfoGrid>
                    {inspection.responsibleName && (
                      <InfoItem>
                        <InfoLabel>Nome</InfoLabel>
                        <InfoValue>{inspection.responsibleName}</InfoValue>
                      </InfoItem>
                    )}
                    {inspection.responsibleDocument && (
                      <InfoItem>
                        <InfoLabel>Documento</InfoLabel>
                        <InfoValue>
                          {formatDocument(inspection.responsibleDocument)}
                        </InfoValue>
                      </InfoItem>
                    )}
                    {inspection.responsiblePhone && (
                      <InfoItem>
                        <InfoLabel>Telefone</InfoLabel>
                        <InfoValue>
                          {formatPhone(inspection.responsiblePhone)}
                        </InfoValue>
                      </InfoItem>
                    )}
                  </InfoGrid>
                </Card>
              )}

              {/* Informações do Sistema */}
              <Card>
                <CardHeader>
                  <CardTitle>ℹ️ Informações do Sistema</CardTitle>
                </CardHeader>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Criado em</InfoLabel>
                    <InfoValue>
                      {formatDateValue(inspection.createdAt)}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Atualizado em</InfoLabel>
                    <InfoValue>
                      {formatDateValue(inspection.updatedAt)}
                    </InfoValue>
                  </InfoItem>
                  {inspection.user && (
                    <InfoItem>
                      <InfoLabel>Criado por</InfoLabel>
                      <InfoValue>{inspection.user.name}</InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </Card>
            </div>
          </ContentGrid>
        </PageContent>

        {/* Modals */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title='Excluir Vistoria'
          message='Tem certeza que deseja excluir a vistoria:'
          itemName={inspection.title}
          isLoading={isDeleting}
        />

        <StatusConfirmationModal
          isOpen={confirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleUpdateStatus}
          inspection={actionToConfirm?.inspection || null}
          newStatus={actionToConfirm?.newStatus || ''}
          isLoading={updatingStatus}
        />
      </PageContainer>
    </Layout>
  );
};

export default VistoriaDetailPage;
