import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  MdArrowBack,
  MdPerson,
  MdSchedule,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdPersonOff,
  MdSend,
  MdAttachFile,
  MdAdd,
  MdClear,
  MdComment,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Layout } from '../components/layout/Layout';
import type {
  KanbanSubTask,
  TaskHistoryEntry,
  KanbanTaskComment,
} from '../types/kanban';
import { Avatar } from '../components/common/Avatar';
import { kanbanSubtasksApi } from '../services/kanbanSubtasksApi';
import { showError, showSuccess } from '../utils/notifications';
import { useAuth } from '../hooks/useAuth';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { HistoryTimeline } from '../components/kanban/HistoryTimeline';
import { companyMembersApi } from '../services/companyMembersApi';
import { SubTaskDetailsShimmer } from '../components/shimmer/SubTaskDetailsShimmer';
import { getKanbanState, buildKanbanUrl } from '../utils/kanbanState';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Header = styled.div`
  padding: 24px 36px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background},
    ${props => props.theme.colors.backgroundSecondary}
  );
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-bottom: 12px;
`;

const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$variant === 'danger'
      ? props.theme.colors.error
      : props.$variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.backgroundSecondary};
  color: ${props =>
    props.$variant === 'danger' || props.$variant === 'primary'
      ? '#fff'
      : props.theme.colors.text};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${props =>
        props.$variant === 'danger'
          ? `${props.theme.colors.error}40`
          : props.$variant === 'primary'
            ? `${props.theme.colors.primary}40`
            : 'rgba(0, 0, 0, 0.1)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 32px 36px;
  overflow-y: auto;
  min-height: 0;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const DetailsSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
  position: relative;
  overflow: visible;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const InfoLabel = styled.strong`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  min-width: 120px;
  display: flex;
  align-items: center;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const StatusBadge = styled.span<{ $completed: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.813rem;
  font-weight: 500;
  background: ${props =>
    props.$completed
      ? `${props.theme.colors.success}20`
      : `${props.theme.colors.warning}20`};
  color: ${props =>
    props.$completed ? props.theme.colors.success : props.theme.colors.warning};
`;

const Description = styled.div`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.7;
  margin-top: 12px;
  padding: 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}05;
  }
`;

const TabContent = styled.div<{ $active: boolean }>`
  display: ${props => (props.$active ? 'block' : 'none')};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
`;

// Estilos para dropdown de responsável
const AssigneeDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
  min-width: 250px;
`;

const AssigneeOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const InfoCard = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
`;

// Estilos para comentários
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const CommentError = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  padding: 8px 12px;
  background: ${props => props.theme.colors.error}10;
  border-radius: 8px;
`;

const CommentFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CommentButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$variant === 'secondary'
      ? props.theme.colors.border
      : props.theme.colors.primary};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.text : 'white'};

  &:hover {
    background: ${props =>
      props.$variant === 'secondary'
        ? props.theme.colors.border + 'dd'
        : props.theme.colors.primary + 'dd'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CommentCharCounter = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CommentFilePreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const CommentFilePreviewItem = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CommentFilePreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CommentFilePreviewFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  width: 100%;
  height: 100%;
  padding: 8px;
  text-align: center;
`;

const CommentFilePreviewOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 4px 6px;
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CommentFilePreviewName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CommentFilePreviewMeta = styled.span`
  opacity: 0.85;
`;

const CommentFileRemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: ${props => props.theme.colors.error};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => props.theme.colors.error}dd;
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const CommentContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const CommentAuthor = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CommentTimestamp = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommentBody = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 10px;
`;

const CommentAttachmentGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const CommentAttachmentItem = styled.a`
  display: flex;
  flex-direction: column;
  width: 120px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  text-decoration: none;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CommentAttachmentPreview = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const CommentAttachmentImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CommentAttachmentIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommentAttachmentInfo = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CommentAttachmentName = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CommentAttachmentMeta = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DeleteCommentButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme.colors.error}15;
  color: ${props => props.theme.colors.error};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}25;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyComments = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

// Shimmer Components
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const ShimmerBox = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
`;

const HistoryShimmerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryShimmerItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CommentsShimmerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentShimmerItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SubTaskDetailsPage: React.FC = () => {
  const { subTaskId } = useParams<{ subTaskId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const [subTask, setSubTask] = useState<KanbanSubTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'history' | 'comments'
  >('details');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Estados para comentários
  const [comments, setComments] = useState<KanbanTaskComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentErrorMessage, setCommentErrorMessage] = useState<string | null>(
    null
  );
  const [deletingComments, setDeletingComments] = useState<Set<string>>(
    new Set()
  );
  const [commentSelectedFiles, setCommentSelectedFiles] = useState<
    Array<{
      id: string;
      file: File;
      previewUrl: string;
      isImage: boolean;
    }>
  >([]);
  const commentFileInputRef = React.useRef<HTMLInputElement>(null);

  // Estados para atribuir responsável
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const taskId = searchParams.get('taskId');
  const projectId = searchParams.get('projectId');
  const teamId = searchParams.get('teamId');

  // Carregar subtarefa
  useEffect(() => {
    if (!subTaskId) {
      showError('ID da subtarefa é necessário');
      navigate(-1);
      return;
    }

    loadSubTask();
  }, [subTaskId]);

  // Carregar histórico quando a aba de histórico for ativada
  useEffect(() => {
    if (
      activeTab === 'history' &&
      subTaskId &&
      history.length === 0 &&
      !loadingHistory
    ) {
      loadHistory();
    }
  }, [activeTab, subTaskId]);

  // Carregar comentários quando a aba de comentários for ativada
  useEffect(() => {
    if (
      activeTab === 'comments' &&
      subTaskId &&
      comments.length === 0 &&
      !loadingComments
    ) {
      loadComments();
    }
  }, [activeTab, subTaskId]);

  const loadSubTask = async () => {
    if (!subTaskId) return;

    try {
      setLoading(true);
      const data = await kanbanSubtasksApi.getSubTask(subTaskId);
      setSubTask(data);
    } catch (error: any) {
      console.error('Erro ao carregar subtarefa:', error);
      showError(error?.message || 'Erro ao carregar detalhes da subtarefa');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!subTaskId) return;

    try {
      setLoadingHistory(true);
      const historyData = await kanbanSubtasksApi.getSubTaskHistory(subTaskId);
      setHistory(historyData);
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      showError('Erro ao carregar histórico da subtarefa');
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadTeamMembers = useCallback(async () => {
    try {
      const response = await companyMembersApi.getMembers({ limit: 100 });
      setTeamMembers(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar membros:', error);
    }
  }, []);

  const loadComments = async () => {
    if (!subTaskId) return;

    try {
      setLoadingComments(true);
      const commentsData =
        await kanbanSubtasksApi.getSubTaskComments(subTaskId);
      setComments(commentsData);
    } catch (error: any) {
      console.error('Erro ao carregar comentários:', error);
      showError('Erro ao carregar comentários da subtarefa');
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  const handleToggleComplete = async () => {
    if (!subTaskId || !subTask) return;

    try {
      const updated = await kanbanSubtasksApi.toggleSubTask(subTaskId);
      setSubTask(updated);
      showSuccess(
        updated.isCompleted ? 'Subtarefa concluída!' : 'Subtarefa reaberta!'
      );
    } catch (error: any) {
      console.error('Erro ao alternar status:', error);
      showError(error?.message || 'Erro ao atualizar status da subtarefa');
    }
  };

  const handleEdit = () => {
    if (!subTaskId) return;

    const params = new URLSearchParams();
    if (taskId) params.append('taskId', taskId);
    if (projectId) params.append('projectId', projectId);
    if (teamId) params.append('teamId', teamId);

    navigate(`/kanban/subtasks/${subTaskId}/edit?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!subTaskId) return;

    try {
      setIsDeleting(true);
      await kanbanSubtasksApi.deleteSubTask(subTaskId);
      showSuccess('Subtarefa excluída com sucesso!');

      // Voltar para a página da tarefa ou kanban
      if (taskId) {
        const params = new URLSearchParams();
        if (projectId) params.append('projectId', projectId);
        // teamId não é obrigatório
        if (teamId) params.append('teamId', teamId);
        navigate(`/kanban/task/${taskId}?${params.toString()}`);
      } else {
        // Se não tem taskId, tentar voltar para o kanban
        const storedTeamId = sessionStorage.getItem('selectedTeamId');
        if (
          storedTeamId &&
          storedTeamId !== 'undefined' &&
          storedTeamId !== 'null'
        ) {
          const params = new URLSearchParams();
          if (projectId) params.append('projectId', projectId);
          params.append('teamId', storedTeamId);
          navigate(`/kanban?${params.toString()}`);
        } else {
          navigate(-1);
        }
      }
    } catch (error: any) {
      console.error('Erro ao deletar subtarefa:', error);
      showError(error?.message || 'Erro ao excluir subtarefa');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleChangeAssignee = useCallback(
    async (userId: string | null) => {
      if (!subTaskId || !subTask) return;
      setIsAssigneeDropdownOpen(false);

      const previousAssignee = subTask.assignedTo;

      try {
        const updated = userId
          ? await kanbanSubtasksApi.assignSubTask(subTaskId, userId)
          : await kanbanSubtasksApi.unassignSubTask(subTaskId);

        setSubTask(updated);
        showSuccess(
          userId
            ? 'Responsável atribuído com sucesso!'
            : 'Responsável removido com sucesso!'
        );

        // Recarregar histórico para mostrar a mudança
        if (activeTab === 'history') {
          await loadHistory();
        }
      } catch (error: any) {
        console.error('Erro ao alterar responsável:', error);
        showError(error?.message || 'Erro ao alterar responsável');
      }
    },
    [subTaskId, subTask, activeTab]
  );

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isAssigneeDropdownOpen &&
        !target.closest('[data-assignee-dropdown]') &&
        !target.closest('[data-assignee-trigger]')
      ) {
        setIsAssigneeDropdownOpen(false);
      }
    };

    if (isAssigneeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isAssigneeDropdownOpen]);

  const MAX_COMMENT_FILES = 5;

  const createCommentSelectedFile = (file: File) => {
    const id = `${Date.now()}-${Math.random()}`;
    const previewUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    return { id, file, previewUrl, isImage };
  };

  const clearCommentSelectedFiles = useCallback(() => {
    setCommentSelectedFiles(prev => {
      prev.forEach(item => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    return () => {
      commentSelectedFiles.forEach(item =>
        URL.revokeObjectURL(item.previewUrl)
      );
    };
  }, [commentSelectedFiles]);

  const handleCommentFilesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) {
        return;
      }

      const newFiles = files
        .slice(0, MAX_COMMENT_FILES - commentSelectedFiles.length)
        .map(createCommentSelectedFile);
      setCommentSelectedFiles(prev => [...prev, ...newFiles]);

      if (commentFileInputRef.current) {
        commentFileInputRef.current.value = '';
      }
    },
    [commentSelectedFiles.length]
  );

  const handleRemoveCommentFile = useCallback((id: string) => {
    setCommentSelectedFiles(prev => {
      const target = prev.find(item => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const handleSubmitComment = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (!subTaskId) return;
      event.preventDefault();

      const trimmedMessage = commentMessage.trim();

      if (!trimmedMessage) {
        setCommentErrorMessage('O comentário não pode estar vazio');
        return;
      }

      if (commentSelectedFiles.length > MAX_COMMENT_FILES) {
        setCommentErrorMessage(
          `Máximo de ${MAX_COMMENT_FILES} arquivos permitidos`
        );
        return;
      }

      setIsSubmittingComment(true);
      setCommentErrorMessage(null);

      try {
        const formData = new FormData();
        formData.append('message', trimmedMessage);
        commentSelectedFiles.forEach(file => {
          formData.append('files', file.file);
        });

        const newComment = await kanbanSubtasksApi.createSubTaskComment(
          subTaskId,
          formData
        );
        setComments(prev => [newComment, ...prev]);
        setCommentMessage('');
        clearCommentSelectedFiles();
        showSuccess('Comentário adicionado com sucesso!');
      } catch (error: any) {
        console.error('Erro ao criar comentário:', error);
        setCommentErrorMessage(
          error?.message || 'Erro ao adicionar comentário'
        );
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [subTaskId, commentMessage, commentSelectedFiles, clearCommentSelectedFiles]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!subTaskId) return;

      setDeletingComments(prev => new Set(prev).add(commentId));

      try {
        await kanbanSubtasksApi.deleteSubTaskComment(subTaskId, commentId);
        setComments(prev => prev.filter(c => c.id !== commentId));
        showSuccess('Comentário excluído com sucesso!');
      } catch (error: any) {
        console.error('Erro ao deletar comentário:', error);
        showError(error?.message || 'Erro ao excluir comentário');
      } finally {
        setDeletingComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    },
    [subTaskId]
  );

  const handleBack = () => {
    // Tentar buscar teamId de várias fontes usando a mesma lógica do KanbanPage
    let finalTeamId: string | null | undefined = teamId;

    // Validar se teamId da URL é válido
    const isValidTeamId =
      finalTeamId && finalTeamId !== 'undefined' && finalTeamId !== 'null';

    if (!isValidTeamId) {
      // Tentar do estado salvo do kanban
      const savedState = getKanbanState(currentUser?.id);
      const isValidSavedTeamId =
        savedState?.teamId &&
        savedState.teamId !== 'undefined' &&
        savedState.teamId !== 'null' &&
        savedState.teamId.trim() !== '';

      if (isValidSavedTeamId) {
        finalTeamId = savedState.teamId || null;
      } else {
        // Tentar do sessionStorage como último recurso
        const storedTeamId = sessionStorage.getItem('selectedTeamId');
        if (
          storedTeamId &&
          storedTeamId !== 'undefined' &&
          storedTeamId !== 'null'
        ) {
          finalTeamId = storedTeamId;
        }
      }
    }

    if (taskId) {
      // Navegar para TaskDetailsPage
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      // Incluir teamId apenas se encontrado e válido
      if (
        finalTeamId &&
        finalTeamId !== 'undefined' &&
        finalTeamId !== 'null'
      ) {
        params.append('teamId', finalTeamId);
      }
      navigate(`/kanban/task/${taskId}?${params.toString()}`);
    } else {
      // Se não tem taskId, usar buildKanbanUrl para garantir URL correta
      const kanbanUrl = buildKanbanUrl(
        {
          projectId: projectId || undefined,
          teamId:
            finalTeamId && finalTeamId !== 'undefined' && finalTeamId !== 'null'
              ? finalTeamId
              : undefined,
        },
        currentUser?.id
      );
      navigate(kanbanUrl);
    }
  };

  if (loading) {
    return (
      <Layout>
        <SubTaskDetailsShimmer />
      </Layout>
    );
  }

  if (!subTask) {
    return (
      <Layout>
        <PageContainer>
          <ErrorState>Subtarefa não encontrada</ErrorState>
        </PageContainer>
      </Layout>
    );
  }

  const assignedUser = teamMembers.find(m => m.id === subTask.assignedToId);

  return (
    <Layout>
      <PageContainer>
        <Header>
          <HeaderContent>
            <HeaderTop>
              <BackButton onClick={handleBack}>
                <MdArrowBack size={20} />
              </BackButton>
              <Title>
                {subTask.title}
                <StatusBadge $completed={subTask.isCompleted}>
                  {subTask.isCompleted ? (
                    <>
                      <MdCheckCircle size={16} />
                      Concluída
                    </>
                  ) : (
                    <>
                      <MdRadioButtonUnchecked size={16} />
                      Pendente
                    </>
                  )}
                </StatusBadge>
              </Title>
            </HeaderTop>
            <HeaderBottom>
              <div style={{ flex: 1 }} />
              <HeaderActions>
                <ActionButton onClick={handleToggleComplete}>
                  {subTask.isCompleted ? (
                    <>
                      <MdRadioButtonUnchecked size={16} />
                      Reabrir
                    </>
                  ) : (
                    <>
                      <MdCheckCircle size={16} />
                      Concluir
                    </>
                  )}
                </ActionButton>
                <ActionButton $variant='primary' onClick={handleEdit}>
                  <MdEdit size={16} />
                  Editar
                </ActionButton>
                <ActionButton
                  $variant='danger'
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <MdDelete size={16} />
                  Excluir
                </ActionButton>
              </HeaderActions>
            </HeaderBottom>
          </HeaderContent>
        </Header>

        <Content>
          <TabsContainer>
            <Tab
              $active={activeTab === 'details'}
              onClick={() => setActiveTab('details')}
            >
              Detalhes
            </Tab>
            <Tab
              $active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
            >
              Histórico
            </Tab>
            <Tab
              $active={activeTab === 'comments'}
              onClick={() => setActiveTab('comments')}
            >
              <MdComment size={18} style={{ marginRight: '8px' }} />
              Comentários {comments.length > 0 && `(${comments.length})`}
            </Tab>
          </TabsContainer>

          <TabContent $active={activeTab === 'details'}>
            <DetailsSection>
              <SectionTitle>Informações</SectionTitle>

              <InfoRow>
                <InfoLabel>Status:</InfoLabel>
                <InfoValue>
                  <StatusBadge $completed={subTask.isCompleted}>
                    {subTask.isCompleted ? (
                      <>
                        <MdCheckCircle size={16} />
                        Concluída
                      </>
                    ) : (
                      <>
                        <MdRadioButtonUnchecked size={16} />
                        Pendente
                      </>
                    )}
                  </StatusBadge>
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Responsável:</InfoLabel>
                <InfoValue>
                  <InfoCard>
                    {subTask.assignedTo ? (
                      <AssigneeOption
                        data-assignee-trigger
                        onClick={() =>
                          setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)
                        }
                        style={{
                          cursor: 'pointer',
                          padding: '8px 12px',
                          borderRadius: '8px',
                        }}
                      >
                        <Avatar
                          name={subTask.assignedTo.name}
                          image={subTask.assignedTo.avatar}
                          size={24}
                        />
                        <span>{subTask.assignedTo.name}</span>
                      </AssigneeOption>
                    ) : (
                      <AssigneeOption
                        data-assignee-trigger
                        onClick={() =>
                          setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)
                        }
                        style={{
                          cursor: 'pointer',
                          padding: '8px 12px',
                          borderRadius: '8px',
                        }}
                      >
                        <MdPersonOff size={16} />
                        <span>Adicionar responsável</span>
                      </AssigneeOption>
                    )}
                    {isAssigneeDropdownOpen && (
                      <AssigneeDropdown
                        isOpen={true}
                        data-assignee-dropdown
                        onClick={e => e.stopPropagation()}
                      >
                        <AssigneeOption
                          onClick={() => handleChangeAssignee(null)}
                        >
                          <MdClear size={20} />
                          <span>Remover responsável</span>
                        </AssigneeOption>
                        {teamMembers.map(member => (
                          <AssigneeOption
                            key={member.id}
                            onClick={() => handleChangeAssignee(member.id)}
                          >
                            <Avatar
                              name={member.name}
                              image={member.avatar}
                              size={32}
                            />
                            <div>
                              <div>{member.name}</div>
                              {member.email && (
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                  }}
                                >
                                  {member.email}
                                </div>
                              )}
                            </div>
                          </AssigneeOption>
                        ))}
                      </AssigneeDropdown>
                    )}
                  </InfoCard>
                </InfoValue>
              </InfoRow>

              {subTask.dueDate && (
                <InfoRow>
                  <InfoLabel>Prazo:</InfoLabel>
                  <InfoValue>
                    <MdSchedule size={16} />
                    {format(
                      new Date(subTask.dueDate),
                      "dd 'de' MMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </InfoValue>
                </InfoRow>
              )}

              {subTask.completedAt && (
                <InfoRow>
                  <InfoLabel>Concluída em:</InfoLabel>
                  <InfoValue>
                    <MdSchedule size={16} />
                    {format(
                      new Date(subTask.completedAt),
                      "dd 'de' MMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </InfoValue>
                </InfoRow>
              )}

              {subTask.createdBy && (
                <InfoRow>
                  <InfoLabel>Criado por:</InfoLabel>
                  <InfoValue>
                    <Avatar
                      name={subTask.createdBy.name}
                      image={subTask.createdBy.avatar}
                      size={24}
                    />
                    {subTask.createdBy.name}
                  </InfoValue>
                </InfoRow>
              )}

              <InfoRow>
                <InfoLabel>Criado em:</InfoLabel>
                <InfoValue>
                  <MdSchedule size={16} />
                  {format(
                    new Date(subTask.createdAt),
                    "dd 'de' MMM 'de' yyyy 'às' HH:mm",
                    { locale: ptBR }
                  )}
                </InfoValue>
              </InfoRow>

              {subTask.description && (
                <>
                  <SectionTitle
                    style={{ marginTop: '32px', marginBottom: '20px' }}
                  >
                    Descrição
                  </SectionTitle>
                  <Description>{subTask.description}</Description>
                </>
              )}
            </DetailsSection>
          </TabContent>

          <TabContent $active={activeTab === 'history'}>
            {loadingHistory ? (
              <HistoryShimmerContainer>
                {Array.from({ length: 3 }).map((_, index) => (
                  <HistoryShimmerItem key={index}>
                    <ShimmerBox
                      $width='40px'
                      $height='40px'
                      $borderRadius='50%'
                    />
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <ShimmerBox $width='60%' $height='16px' />
                      <ShimmerBox $width='80%' $height='14px' />
                      <ShimmerBox $width='40%' $height='12px' />
                    </div>
                  </HistoryShimmerItem>
                ))}
              </HistoryShimmerContainer>
            ) : (
              <HistoryTimeline history={history} loading={false} />
            )}
          </TabContent>

          <TabContent $active={activeTab === 'comments'}>
            <CommentsContainer>
              <CommentForm onSubmit={handleSubmitComment}>
                <CommentTextarea
                  value={commentMessage}
                  onChange={e => {
                    setCommentMessage(e.target.value);
                    setCommentErrorMessage(null);
                  }}
                  placeholder='Adicione um comentário...'
                  rows={4}
                />
                {commentErrorMessage && (
                  <CommentError>{commentErrorMessage}</CommentError>
                )}
                {commentSelectedFiles.length > 0 && (
                  <CommentFilePreviewGrid>
                    {commentSelectedFiles.map(file => (
                      <CommentFilePreviewItem key={file.id}>
                        {file.isImage ? (
                          <CommentFilePreviewImage
                            src={file.previewUrl}
                            alt={file.file.name}
                          />
                        ) : (
                          <CommentFilePreviewFallback>
                            <MdAttachFile size={32} />
                            <span>{file.file.name}</span>
                          </CommentFilePreviewFallback>
                        )}
                        <CommentFilePreviewOverlay>
                          <CommentFilePreviewName>
                            {file.file.name}
                          </CommentFilePreviewName>
                          <CommentFilePreviewMeta>
                            {(file.file.size / 1024).toFixed(1)} KB
                          </CommentFilePreviewMeta>
                        </CommentFilePreviewOverlay>
                        <CommentFileRemoveButton
                          onClick={() => handleRemoveCommentFile(file.id)}
                        >
                          <MdClear size={14} />
                        </CommentFileRemoveButton>
                      </CommentFilePreviewItem>
                    ))}
                  </CommentFilePreviewGrid>
                )}
                <CommentFooter>
                  <CommentActions>
                    <CommentButton
                      type='button'
                      $variant='secondary'
                      onClick={() => commentFileInputRef.current?.click()}
                    >
                      <MdAttachFile size={18} />
                      Anexar
                    </CommentButton>
                    <HiddenFileInput
                      ref={commentFileInputRef}
                      type='file'
                      multiple
                      onChange={handleCommentFilesChange}
                      accept='image/*,.pdf,.doc,.docx,.xls,.xlsx'
                    />
                  </CommentActions>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <CommentCharCounter>
                      {commentMessage.length}/1000
                    </CommentCharCounter>
                    <CommentButton
                      type='submit'
                      disabled={isSubmittingComment || !commentMessage.trim()}
                    >
                      <MdSend size={18} />
                      {isSubmittingComment ? 'Enviando...' : 'Enviar'}
                    </CommentButton>
                  </div>
                </CommentFooter>
              </CommentForm>

              {loadingComments ? (
                <CommentsShimmerContainer>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CommentShimmerItem key={index}>
                      <ShimmerBox
                        $width='40px'
                        $height='40px'
                        $borderRadius='50%'
                      />
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <ShimmerBox $width='120px' $height='16px' />
                          <ShimmerBox $width='80px' $height='14px' />
                        </div>
                        <ShimmerBox $width='100%' $height='60px' />
                        <ShimmerBox $width='40%' $height='12px' />
                      </div>
                    </CommentShimmerItem>
                  ))}
                </CommentsShimmerContainer>
              ) : comments.length === 0 ? (
                <EmptyComments>
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </EmptyComments>
              ) : (
                <CommentsList>
                  {comments.map(comment => (
                    <CommentCard key={comment.id}>
                      <Avatar
                        name={comment.user.name}
                        image={comment.user.avatar}
                        size={40}
                      />
                      <CommentContent>
                        <CommentHeader>
                          <CommentAuthor>{comment.user.name}</CommentAuthor>
                          <CommentTimestamp>
                            {format(
                              new Date(comment.createdAt),
                              "dd/MM/yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </CommentTimestamp>
                          {comment.user.id === currentUser?.id && (
                            <DeleteCommentButton
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deletingComments.has(comment.id)}
                            >
                              <MdDelete size={14} />
                              {deletingComments.has(comment.id)
                                ? 'Excluindo...'
                                : 'Excluir'}
                            </DeleteCommentButton>
                          )}
                        </CommentHeader>
                        <CommentBody>{comment.message}</CommentBody>
                        {comment.attachments &&
                          comment.attachments.length > 0 && (
                            <CommentAttachmentGrid>
                              {comment.attachments.map((attachment, index) => (
                                <CommentAttachmentItem
                                  key={index}
                                  href={attachment.url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  <CommentAttachmentPreview>
                                    {attachment.contentType?.startsWith(
                                      'image/'
                                    ) ? (
                                      <CommentAttachmentImage
                                        src={attachment.url}
                                        alt={attachment.name || 'Anexo'}
                                      />
                                    ) : (
                                      <CommentAttachmentIcon>
                                        <MdAttachFile size={32} />
                                      </CommentAttachmentIcon>
                                    )}
                                  </CommentAttachmentPreview>
                                  <CommentAttachmentInfo>
                                    <CommentAttachmentName>
                                      {attachment.name}
                                    </CommentAttachmentName>
                                    <CommentAttachmentMeta>
                                      {attachment.size
                                        ? `${(attachment.size / 1024).toFixed(1)} KB`
                                        : ''}
                                    </CommentAttachmentMeta>
                                  </CommentAttachmentInfo>
                                </CommentAttachmentItem>
                              ))}
                            </CommentAttachmentGrid>
                          )}
                      </CommentContent>
                    </CommentCard>
                  ))}
                </CommentsList>
              )}
            </CommentsContainer>
          </TabContent>
        </Content>

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title='Excluir Subtarefa'
          message={`Tem certeza que deseja excluir a subtarefa "${subTask.title}"? Esta ação não pode ser desfeita.`}
          confirmText='Excluir'
          cancelText='Cancelar'
          isLoading={isDeleting}
        />
      </PageContainer>
    </Layout>
  );
};

export default SubTaskDetailsPage;
