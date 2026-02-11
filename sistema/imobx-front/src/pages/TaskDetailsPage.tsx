import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  MdArrowBack,
  MdPerson,
  MdSchedule,
  MdFlag,
  MdEdit,
  MdDelete,
  MdLabel,
  MdAdd,
  MdPersonOff,
  MdClear,
  MdSend,
  MdAttachFile,
  MdCheckCircle,
  MdSave,
  MdAttachMoney,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBadge,
  MdBusiness,
  MdHome,
  MdSwapHoriz,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Layout } from '../components/layout/Layout';
import type {
  KanbanTask,
  KanbanTaskComment,
  TaskHistoryEntry,
  KanbanTaskClient,
  KanbanTaskProperty,
} from '../types/kanban';
import { Avatar } from '../components/common/Avatar';
import { kanbanApi } from '../services/kanbanApi';
import { useKanban } from '../hooks/useKanban';
import { showError, showSuccess } from '../utils/notifications';
import { useAuth } from '../hooks/useAuth';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { useKanbanValidationHistory } from '../hooks/useKanbanValidations';
import { buildKanbanUrl } from '../utils/kanbanState';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { SubTaskManager } from '../components/kanban/SubTaskManager';

/** Exibir seção Sub-Negociação na página de detalhes da tarefa (desativado por padrão - não utilizado) */
const SHOW_SUB_NEGOCIACAO = false;
import { CustomFieldsManager } from '../components/kanban/CustomFieldsManager';
import { ResultBadge } from '../components/kanban/ResultBadge';
import { TaskAdditionalFields } from '../components/kanban/TaskAdditionalFields';
import { InvolvedUsersManager } from '../components/kanban/InvolvedUsersManager';
import { HistoryTimeline } from '../components/kanban/HistoryTimeline';
import { TaskMetricsCard } from '../components/kanban/TaskMetricsCard';
import {
  formatCurrencyValue,
  formatCurrency,
  getNumericValue,
  maskCPF,
  maskPhoneAuto,
} from '../utils/masks';
import { formatCurrency as formatCurrencyNumber } from '../utils/formatNumbers';
import {
  translateClientType,
  translateClientStatus,
  translatePropertyType,
  translatePropertyStatus,
} from '../utils/translations';
import { ClientSelect } from '../components/kanban/ClientSelect';
import { PropertySelect } from '../components/kanban/PropertySelect';
import { TaskAttachmentsManager } from '../components/kanban/TaskAttachmentsManager';
import { TransferTaskModal } from '../components/kanban/TransferTaskModal';
import { TransferHistory } from '../components/kanban/TransferHistory';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.background};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Header = styled.div`
  padding: 20px 36px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 18px 28px 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const HeaderMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    order: 3;
  }
`;

const HeaderActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
  border-left: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding-left: 0;
    border-left: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

const LeftPanel = styled.div`
  width: 380px;
  min-width: 280px;
  max-width: 100%;
  padding: 24px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-right: 1px solid ${props => props.theme.colors.border};
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 1200px) and (min-width: 993px) {
    width: 340px;
    padding: 20px 18px;
  }

  @media (max-width: 992px) {
    width: 100%;
    min-width: 0;
    max-height: none;
    padding: 20px 16px;
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
  }

  @media (max-width: 480px) {
    padding: 14px 10px;
  }
`;

/** Agrupa as seções da lateral com espaçamento uniforme e distribuição responsiva */
const LeftPanelInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  @media (max-width: 992px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 18px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyStateImage = styled.div`
  width: 200px;
  height: 200px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    opacity: 0.9;
    color: white;
    transform: translateY(-1px);
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.border};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

const TitleContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 0;
  margin: -4px 0;
  border-radius: 8px;
  transition: background 0.2s ease;
  max-width: 100%;

  &:hover {
    background: ${props => props.theme.colors.background};

    .edit-icon {
      opacity: 1;
    }
  }
`;

const PageTitle = styled.h2`
  font-size: 1.75rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  user-select: text;
  line-height: 1.3;
  word-break: break-word;

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const EditTitleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.primary};
  }
`;

const TitleInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  width: 100%;
`;

const TitleInput = styled.input`
  font-size: 1.75rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  border: 2px solid ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.background};
  padding: 8px 12px;
  border-radius: 8px;
  flex: 1;
  outline: none;
  box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  min-width: 0;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 1.5rem;
    padding: 6px 10px;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 8px 10px;
  }
`;

const SaveTitleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.primary};
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  border: 1px solid ${props => props.$color || props.theme.colors.primary}40;
  line-height: 1;

  svg {
    flex-shrink: 0;
    vertical-align: middle;
  }
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.$variant === 'danger'
        ? props.theme.colors.error
        : props.$variant === 'success'
          ? '#10B981'
          : props.theme.colors.border};
  background: ${props =>
    props.$variant === 'danger'
      ? props.theme.colors.error
      : props.$variant === 'success'
        ? '#10B981'
        : props.theme.colors.error};
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props =>
      props.$variant === 'danger'
        ? props.theme.colors.error
        : props.$variant === 'success'
          ? '#10B981'
          : props.theme.colors.error};
    opacity: 0.9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    order: 3;
  }
`;

const Section = styled.div`
  margin-bottom: 0;
  min-width: 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    margin-bottom: 10px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    margin-bottom: 8px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  min-width: 0;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const SectionIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const ClientInfoCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  min-width: 0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px;
    margin-top: 10px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ClientInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ClientInfoName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

const ClientInfoBadge = styled.span<{ $type?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    if (props.$type === 'buyer') return 'rgba(59, 130, 246, 0.1)';
    if (props.$type === 'seller') return 'rgba(239, 68, 68, 0.1)';
    if (props.$type === 'renter') return 'rgba(16, 185, 129, 0.1)';
    if (props.$type === 'lessor') return 'rgba(245, 158, 11, 0.1)';
    if (props.$type === 'investor') return 'rgba(139, 92, 246, 0.1)';
    return 'rgba(107, 114, 128, 0.1)';
  }};
  color: ${props => {
    if (props.$type === 'buyer') return '#3B82F6';
    if (props.$type === 'seller') return '#EF4444';
    if (props.$type === 'renter') return '#10B981';
    if (props.$type === 'lessor') return '#F59E0B';
    if (props.$type === 'investor') return '#8B5CF6';
    return '#6B7280';
  }};
`;

const ClientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: 12px 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ClientInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ClientInfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ClientInfoValue = styled.span`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;
`;

const PropertyInfoCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  min-width: 0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px;
    margin-top: 10px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PropertyInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PropertyInfoTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

const PropertyInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
  gap: 12px 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const PropertyInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PropertyInfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PropertyInfoValue = styled.span`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;
`;

const Description = styled.p`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
  margin: 0;
`;

const EditableSection = styled.div`
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  border: 2px dashed transparent;
  transition: all 0.2s ease;
  margin: -12px;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.border};
  }
`;

const EditableDescription = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  font-family: inherit;
  line-height: 1.7;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const InfoCard = styled.div<{ $hasDropdownOpen?: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: ${props => (props.$hasDropdownOpen ? 'visible' : 'hidden')};
  z-index: ${props => (props.$hasDropdownOpen ? 1 : 'auto')};
  min-width: 0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 10px;

    &:hover {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const AssigneeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  min-width: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}20;

    .assignee-actions {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 10px;
    border-width: 1px;
    border-radius: 10px;

    .assignee-actions {
      opacity: 1;
    }
  }
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const AssigneeTextBlock = styled.div`
  min-width: 0;
  overflow: hidden;
`;

const AssigneeName = styled.span`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const AssigneeEmail = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-top: 1px;
  }
`;

const AssigneeActions = styled.div`
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const RemoveAssigneeButton = styled.button`
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}40;
  color: ${props => props.theme.colors.error};
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}25;
    border-color: ${props => props.theme.colors.error}60;
    transform: scale(1.1);
    color: ${props => props.theme.colors.error};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.813rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.75rem;
    gap: 6px;
  }
  background: ${props => {
    switch (props.priority) {
      case 'urgent':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.25))';
      case 'high':
        return 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.25))';
      case 'medium':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25))';
      case 'low':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25))';
      default:
        return props.theme.colors.border;
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return '#3B82F6';
      case 'low':
        return '#10B981';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.priority) {
        case 'urgent':
          return 'rgba(239, 68, 68, 0.3)';
        case 'high':
          return 'rgba(245, 158, 11, 0.3)';
        case 'medium':
          return 'rgba(59, 130, 246, 0.3)';
        case 'low':
          return 'rgba(16, 185, 129, 0.3)';
        default:
          return props.theme.colors.border;
      }
    }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &::after {
      left: 100%;
    }
  }
`;

const RemoveTagIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}40;
  }
`;

const AddTagButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.75rem;
    border-radius: 12px;
  }
`;

const TagSelectorContainer = styled.div`
  position: relative;
  width: 100%;
`;

const TagDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const TagOption = styled.div<{ isNew?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;

  ${props =>
    props.isNew &&
    `
    color: ${props.theme.colors.primary};
    font-weight: 600;
    border-top: 1px solid ${props.theme.colors.border};
  `}

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const TagSearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const AssigneeDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground} !important;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 0 0 1px ${props => props.theme.colors.cardBackground};
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 9999 !important;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  opacity: 1 !important;
  isolation: isolate;

  /* Garantir que todos os elementos filhos tenham background opaco */
  & > * {
    position: relative;
    z-index: 1;
    background: ${props => props.theme.colors.cardBackground};
  }

  /* Camada de fundo completamente opaca para cobrir qualquer conteúdo atrás */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: ${props => props.theme.colors.cardBackground};
    border-radius: 12px;
    z-index: 0;
    pointer-events: none;
  }

  /* Garantir que o scrollbar também tenha background opaco */
  &::-webkit-scrollbar {
    background: ${props => props.theme.colors.cardBackground};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 6px;
  }
`;

const AssigneeOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.text};
  background: transparent;
  border-radius: 8px;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary}20;
  }
`;

const PrioritySelector = styled.div`
  position: relative;
  width: 100%;
`;

const PriorityDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const PriorityOption = styled.div<{ priority: string }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => {
      switch (props.priority) {
        case 'urgent':
          return '#EF4444';
        case 'high':
          return '#F59E0B';
        case 'medium':
          return '#3B82F6';
        case 'low':
          return '#10B981';
        default:
          return '#6B7280';
      }
    }};
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const ValueDisplay = styled.div`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  display: flex;
  align-items: center;
  min-height: 44px;
`;

const ValueInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.cardBackground};
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const ValueAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
`;

const EmptyValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: ${props => props.theme.colors.background};

  @media (max-width: 992px) {
    min-height: 400px;
  }
`;

const CreateSubTaskButtonContainer = styled.div`
  padding: 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 16px 24px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const CreateSubTaskButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    opacity: 0.9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}40`};
  }

  &:active {
    transform: translateY(0);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding: 0 32px;
  background: ${props => props.theme.colors.background};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 0 24px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 0;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 16px 24px;
  background: transparent;
  border: none;
  color: ${props =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid
    ${props => (props.active ? props.theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  min-height: 44px;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}05;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 14px 20px;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.875rem;
    min-height: 48px;
  }
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${props => (props.active ? 'flex' : 'none')};
  flex-direction: column;
  padding: 20px 28px 28px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  align-self: flex-start;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 18px 20px 24px;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding: 14px 12px 20px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 12px 10px 16px;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
`;

const HistoryItem = styled.div`
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

const HistoryAvatarSection = styled.div`
  flex-shrink: 0;
`;

const HistoryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const HistoryAction = styled.div`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
  font-weight: 500;

  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const HistoryTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SourceHistoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  width: 100%;
`;

const LoadingHistory = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

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
        ? props.theme.colors.border
        : props.theme.colors.primary};
    opacity: ${props => (props.$variant === 'secondary' ? 1 : 0.9)};
    color: ${props =>
      props.$variant === 'secondary' ? props.theme.colors.text : 'white'};
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
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
    background: ${props => props.theme.colors.error};
    opacity: 0.9;
    color: white;
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
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  color: ${props => props.theme.colors.primary};
  font-size: 1.4rem;
`;

const CommentAttachmentInfo = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CommentAttachmentName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CommentAttachmentMeta = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DeleteCommentButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${props => props.theme.colors.error}40;
  background: ${props => props.theme.colors.error}10;
  color: ${props => props.theme.colors.error};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}20;
    border-color: ${props => props.theme.colors.error}60;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyComments = styled.div`
  text-align: center;
  padding: 40px 24px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 16px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CommentError = styled.div`
  font-size: 0.813rem;
  color: ${props => props.theme.colors.error};
  font-weight: 500;
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
    ${props => props.theme.colors.cardBackground} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.cardBackground} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ShimmerHeader = styled.div`
  padding: 24px 36px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 20px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ShimmerContentWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const ShimmerLeftPanel = styled.div`
  width: 380px;
  min-width: 280px;
  padding: 24px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-right: 1px solid ${props => props.theme.colors.border};
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;

  @media (max-width: 1200px) and (min-width: 993px) {
    width: 340px;
    padding: 20px 18px;
  }

  @media (max-width: 992px) {
    width: 100%;
    min-width: 0;
    padding: 20px 16px;
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    gap: 20px;
  }
`;

const ShimmerMainContent = styled.div`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ShimmerTabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

// Interfaces

type CommentSelectedFile = {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
};

const MAX_COMMENT_FILES = 10;

const createCommentSelectedFile = (file: File): CommentSelectedFile => ({
  id:
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  file,
  previewUrl: URL.createObjectURL(file),
  isImage: file.type.startsWith('image/'),
});

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente',
  };
  return labels[priority] || priority;
};

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const permissionsContext = usePermissionsContextOptional();
  const { isMaster } = useRoleAccess();
  const hasPermission = permissionsContext?.hasPermission || (() => false);

  // Limpar flag de navegação de validação após carregar a página
  useEffect(() => {
    // Se estamos nesta página devido a erro de validação, limpar a flag após um delay
    const isKanbanValidationNavigation =
      sessionStorage.getItem('_kanban_validation_navigation') === 'true';
    if (isKanbanValidationNavigation) {
      // Limpar flag após um delay para garantir que todos os hooks já processaram
      const timer = setTimeout(() => {
        sessionStorage.removeItem('_kanban_validation_navigation');
        sessionStorage.removeItem('_kanban_validation_target');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Limpar flag de navegação de validação após carregar a página
  useEffect(() => {
    // Se estamos nesta página devido a erro de validação, limpar a flag após um delay
    const isKanbanValidationNavigation =
      sessionStorage.getItem('_kanban_validation_navigation') === 'true';
    if (isKanbanValidationNavigation) {
      // Limpar flag após um delay para garantir que todos os hooks já processaram
      const timer = setTimeout(() => {
        sessionStorage.removeItem('_kanban_validation_navigation');
        sessionStorage.removeItem('_kanban_validation_target');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Obter teamId e projectId da URL (opcionais: dá para abrir detalhes só com taskId)
  const teamId = searchParams.get('teamId');
  const projectId = searchParams.get('projectId');

  // Função auxiliar para validar projectId
  const isValidProjectId = (id: string | null | undefined): id is string => {
    if (!id) return false;
    if (typeof id !== 'string') return false;
    if (id === 'undefined' || id === 'null') return false;
    if (id.trim() === '') return false;
    // Validar formato UUID básico
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Usar useKanban para acessar funções de atualização e board
  const { updateTask, deleteTask: handleDeleteTask, board } = useKanban();

  const [task, setTask] = useState<KanbanTask | null>(null);
  // Quando a página foi aberta só com taskId (ex.: link da análise de leads), teamId vem da tarefa
  const effectiveTeamId = teamId || (task?.teamId ?? null);

  // Buscar coluna do board usando columnId
  const taskColumn = React.useMemo(() => {
    if (!task || !board) return null;
    return board.columns.find(col => col.id === task.columnId) || null;
  }, [task, board]);
  const [loading, setLoading] = useState(true);
  // Verificar permissões para visualizar métricas
  const canViewMetrics = React.useCallback(() => {
    if (!currentUser) return false;

    // Master sempre pode visualizar métricas
    if (isMaster()) return true;

    // Admin sempre pode visualizar métricas
    if (currentUser.role === 'admin') return true;

    // User precisa ter permissão específica
    if (currentUser.role === 'user') {
      return hasPermission('kanban:view_analytics');
    }

    return false;
  }, [currentUser, isMaster, hasPermission]);

  const [activeTab, setActiveTab] = useState<
    'history' | 'comments' | 'files' | 'metrics' | 'transfers'
  >('history');
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Redirecionar da tab de métricas se o usuário não tiver permissão
  useEffect(() => {
    if (activeTab === 'metrics' && !canViewMetrics()) {
      setActiveTab('history');
    }
  }, [activeTab, canViewMetrics]);

  const {
    validationHistory,
    actionHistory,
    loading: loadingValidationHistory,
    loadAllHistory: loadValidationHistory,
  } = useKanbanValidationHistory(taskId || '');

  const [comments, setComments] = useState<KanbanTaskComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentMessage, setCommentMessage] = useState('');
  const [commentSelectedFiles, setCommentSelectedFiles] = useState<
    CommentSelectedFile[]
  >([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentErrorMessage, setCommentErrorMessage] = useState<string | null>(
    null
  );
  const [deletingComments, setDeletingComments] = useState<Set<string>>(
    new Set()
  );
  const commentFileInputRef = useRef<HTMLInputElement | null>(null);
  const saveValueTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estado para modal de confirmação de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Estado para modal de transferência
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Estados para edição inline
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  // Estados para salvamento de cliente e imóvel
  const clientSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const propertySaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [isSavingProperty, setIsSavingProperty] = useState(false);
  const isLoadingClientRef = useRef(false);
  const isLoadingPropertyRef = useRef(false);
  const lastClientIdRef = useRef<string | null>(null);
  const lastPropertyIdRef = useRef<string | null>(null);

  // Refs para debounce de campos personalizados
  const customFieldsPendingChangesRef = useRef<{ [key: string]: any }>({});
  const customFieldsSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingCustomFieldsRef = useRef<boolean>(false);

  // Estados para tags
  const [tags, setTags] = useState<string[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [availableTags, setAvailableTags] = useState<
    Array<{ id: string; name: string; color?: string }>
  >([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // Estados para dropdowns
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [currentAssignee, setCurrentAssignee] =
    useState<KanbanTask['assignedTo']>(undefined);
  const [currentPriority, setCurrentPriority] = useState<string>('');
  const [currentDueDate, setCurrentDueDate] = useState<string>('');
  const [currentTotalValue, setCurrentTotalValue] = useState<string>('');

  // Carregar task: por board (com teamId) ou direto por taskId (quem tem o link não precisa estar no funil)
  useEffect(() => {
    const isKanbanValidationNavigation =
      sessionStorage.getItem('_kanban_validation_navigation') === 'true';
    if (!taskId) return;

    // Abertura só com taskId (ex.: link da análise de leads) — não exige funil
    if (!teamId && !isKanbanValidationNavigation) {
      const loadByTaskId = async () => {
        try {
          setLoading(true);
          const foundTask = await kanbanApi.getTaskById(taskId);
          if (
            foundTask.clientId &&
            !foundTask.client &&
            isValidProjectId(foundTask.projectId ?? undefined)
          ) {
            try {
              const clients = await kanbanApi.getProjectClients(
                foundTask.projectId!
              );
              const clientData = clients.find(
                (c: any) => c.id === foundTask.clientId
              );
              if (clientData) foundTask.client = clientData;
            } catch (_) {}
          }
          if (
            foundTask.propertyId &&
            !foundTask.property &&
            isValidProjectId(foundTask.projectId ?? undefined)
          ) {
            try {
              const properties = await kanbanApi.getProjectProperties(
                foundTask.projectId!
              );
              const propertyData = properties.find(
                (p: any) => p.id === foundTask.propertyId
              );
              if (propertyData) foundTask.property = propertyData;
            } catch (_) {}
          }
          if (foundTask.clientId) lastClientIdRef.current = foundTask.clientId;
          if (foundTask.propertyId)
            lastPropertyIdRef.current = foundTask.propertyId;
          setTask(foundTask);
        } catch (error: any) {
          showError(error?.message || 'Negociação não encontrada');
          navigate(-1);
        } finally {
          setLoading(false);
        }
      };
      loadByTaskId();
      return;
    }

    if (isKanbanValidationNavigation && !teamId) return;
    if (!teamId) {
      showError('ID da equipe é necessário');
      navigate(-1);
      return;
    }

    const loadTask = async () => {
      try {
        setLoading(true);
        const boardData = await kanbanApi.getBoard(teamId, {
          projectId: projectId || undefined,
        });
        const foundTask = boardData.tasks.find(t => t.id === taskId);
        if (foundTask) {
          if (
            foundTask.clientId &&
            !foundTask.client &&
            isValidProjectId(foundTask.projectId || projectId)
          ) {
            try {
              const clients = await kanbanApi.getProjectClients(
                foundTask.projectId || projectId!
              );
              const clientData = clients.find(c => c.id === foundTask.clientId);
              if (clientData) foundTask.client = clientData;
            } catch (_) {}
          }
          if (
            foundTask.propertyId &&
            !foundTask.property &&
            isValidProjectId(foundTask.projectId || projectId)
          ) {
            try {
              const properties = await kanbanApi.getProjectProperties(
                foundTask.projectId || projectId!
              );
              const propertyData = properties.find(
                p => p.id === foundTask.propertyId
              );
              if (propertyData) foundTask.property = propertyData;
            } catch (_) {}
          }
          if (foundTask.clientId) lastClientIdRef.current = foundTask.clientId;
          if (foundTask.propertyId)
            lastPropertyIdRef.current = foundTask.propertyId;
          setTask(foundTask);
        } else {
          showError('Negociação não encontrada');
          navigate(-1);
        }
      } catch (error: any) {
        showError(error?.message || 'Erro ao carregar detalhes da negociação');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId, teamId, projectId, navigate]);

  // Ref para rastrear se já inicializamos os estados
  const initializedRef = useRef<string | null>(null);

  // Inicializar estados quando task for carregada (apenas uma vez por task.id)
  useEffect(() => {
    if (task && task.id && initializedRef.current !== task.id) {
      console.log(
        '🔄 [TaskDetailsPage] Inicializando estados para task:',
        task.id
      );
      initializedRef.current = task.id;
      setTags(task.tags || []);
      setCurrentAssignee(task.assignedTo || undefined);
      setCurrentPriority(task.priority || '');
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
      setCurrentDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      );
      setCurrentTotalValue(
        task.totalValue
          ? formatCurrencyValue(task.totalValue).replace('R$ ', '').trim()
          : ''
      );
    }
  }, [task?.id]); // Apenas quando task.id mudar

  // useEffect DESABILITADO - estava causando múltiplos disparos e piscar
  // Agora confiamos apenas nos handlers handleClientChange e handlePropertyChange para buscar dados
  // Isso elimina o problema do piscar e das múltiplas atualizações
  // useEffect(() => {
  //   // Código comentado para evitar buscas automáticas que causavam piscar
  // }, [task?.clientId, task?.propertyId, task?.projectId, projectId, isSavingClient, isSavingProperty]);

  // Carregar histórico
  const loadTaskHistory = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoadingHistory(true);
      const historyData = await kanbanApi.getTaskHistory(taskId);
      setHistory(historyData);
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [taskId]);

  // Carregar comentários
  const loadTaskComments = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoadingComments(true);
      const commentsData = await kanbanApi.getTaskComments(taskId);
      setComments(commentsData);
    } catch (error: any) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      loadTaskHistory();
      loadTaskComments();
      if (activeTab === 'history') {
        loadValidationHistory();
      }
    }
  }, [
    taskId,
    loadTaskHistory,
    loadTaskComments,
    loadValidationHistory,
    activeTab,
  ]);

  // Carregar tags disponíveis
  const loadAvailableTags = useCallback(async () => {
    if (!effectiveTeamId) return;
    try {
      const tagsData = await kanbanApi.getAvailableTags(effectiveTeamId);
      const formattedTags = Array.isArray(tagsData)
        ? tagsData.map(tag =>
            typeof tag === 'string' ? { id: tag, name: tag } : tag
          )
        : [];
      setAvailableTags(formattedTags);
    } catch (error: any) {
      console.error('Erro ao carregar tags:', error);
      setAvailableTags([]);
    }
  }, [effectiveTeamId]);

  // Carregar membros da equipe
  const loadTeamMembers = useCallback(async () => {
    if (!task) return;
    try {
      const currentProjectId = task.projectId || projectId;

      if (!currentProjectId) {
        // Se não há projectId, usar membros da empresa
        const storedTeamId = sessionStorage.getItem('selectedTeamId');
        if (storedTeamId) {
          const { companyMembersApi } = await import(
            '../services/companyMembersApi'
          );
          const response = await companyMembersApi.getMembers({ limit: 100 });
          setTeamMembers(response.data);
        }
        return;
      }

      // Verificar se é projeto de equipe
      let project = task.project;
      if (!project && currentProjectId) {
        try {
          const { projectsApi } = await import('../services/projectsApi');
          project = await projectsApi.getProjectById(currentProjectId);
        } catch {
          console.warn('Não foi possível buscar projeto');
        }
      }

      const isTeamProject = !project || !project.isPersonal;

      if (isTeamProject && currentProjectId) {
        try {
          const members = await kanbanApi.getProjectMembers(currentProjectId);
          setTeamMembers(
            members.map(m => ({
              id: m.user.id,
              name: m.user.name,
              email: m.user.email,
              avatar: undefined,
              role: m.role,
            }))
          );
          return;
        } catch (apiError: any) {
          console.error('Erro ao buscar membros do projeto:', apiError);
        }
      }

      // Fallback para membros da empresa
      const storedTeamId = sessionStorage.getItem('selectedTeamId');
      if (storedTeamId) {
        const { companyMembersApi } = await import(
          '../services/companyMembersApi'
        );
        const response = await companyMembersApi.getMembers({ limit: 100 });
        setTeamMembers(response.data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar membros:', error);
      // Fallback
      try {
        const storedTeamId = sessionStorage.getItem('selectedTeamId');
        if (storedTeamId) {
          const { companyMembersApi } = await import(
            '../services/companyMembersApi'
          );
          const response = await companyMembersApi.getMembers({ limit: 100 });
          setTeamMembers(response.data);
        }
      } catch (fallbackError: any) {
        console.error('Erro ao carregar membros (fallback):', fallbackError);
      }
    }
  }, [task, projectId]);

  // Carregar tags e membros quando task for carregada (effectiveTeamId vem da URL ou da tarefa)
  useEffect(() => {
    if (task && effectiveTeamId) {
      loadAvailableTags();
      loadTeamMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, effectiveTeamId]);

  // Recarregar membros quando dropdown for aberto
  useEffect(() => {
    if (isAssigneeDropdownOpen) {
      loadTeamMembers();
    }
  }, [isAssigneeDropdownOpen, loadTeamMembers]);

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

  // Handlers de edição
  const handleSaveTitle = useCallback(async () => {
    if (!task) return;
    setIsEditingTitle(false);

    if (editedTitle.trim() === '' || editedTitle === task.title) {
      setEditedTitle(task.title);
      return;
    }

    // Salvar estado anterior para rollback
    const previousTitle = task.title;
    const previousTask = { ...task };

    // Update otimista IMEDIATO
    const newTitle = editedTitle.trim();
    setTask(prev =>
      prev
        ? {
            ...prev,
            title: newTitle,
            clientId: prev.clientId,
            client: prev.client,
            propertyId: prev.propertyId,
            property: prev.property,
          }
        : null
    );

    try {
      await updateTask(task.id, { title: newTitle });
      // Não atualizar o estado - já foi atualizado otimisticamente
    } catch (error: any) {
      console.error('Erro ao salvar título:', error);
      // Rollback - reverter para estado anterior
      setTask(previousTask);
      setEditedTitle(previousTitle);
      showError(error?.message || 'Erro ao salvar título');
    }
  }, [task, editedTitle, updateTask]);

  const handleSaveDescription = useCallback(async () => {
    if (!task) return;
    setIsEditingDescription(false);

    if (editedDescription === task.description) {
      return;
    }

    // Salvar estado anterior para rollback
    const previousDescription = task.description || '';
    const previousTask = { ...task };

    // Update otimista IMEDIATO
    setTask(prev =>
      prev
        ? {
            ...prev,
            description: editedDescription,
            clientId: prev.clientId,
            client: prev.client,
            propertyId: prev.propertyId,
            property: prev.property,
          }
        : null
    );

    try {
      await updateTask(task.id, { description: editedDescription });
      // Não atualizar o estado - já foi atualizado otimisticamente
    } catch (error: any) {
      console.error('Erro ao salvar descrição:', error);
      // Rollback - reverter para estado anterior
      setTask(previousTask);
      setEditedDescription(previousDescription);
      showError(error?.message || 'Erro ao salvar descrição');
    }
  }, [task, editedDescription, updateTask]);

  const handleChangeAssignee = useCallback(
    async (userId: string | null) => {
      if (!task) return;
      setIsAssigneeDropdownOpen(false);

      const previousAssignee = currentAssignee;
      const previousTask = { ...task };
      const newAssignee = userId
        ? teamMembers.find(m => m.id === userId)
        : undefined;

      // Update otimista IMEDIATO
      setCurrentAssignee(newAssignee);
      setTask(prev =>
        prev
          ? {
              ...prev,
              assignedTo: newAssignee || undefined,
              clientId: prev.clientId,
              client: prev.client,
              propertyId: prev.propertyId,
              property: prev.property,
            }
          : null
      );

      try {
        await updateTask(task.id, { assignedToId: userId || undefined });
        // Não atualizar o estado - já foi atualizado otimisticamente
      } catch (error: any) {
        console.error('Erro ao alterar responsável:', error);
        // Rollback - reverter para estado anterior
        setCurrentAssignee(previousAssignee);
        setTask(previousTask);
        showError(error?.message || 'Erro ao alterar responsável');
      }
    },
    [task, currentAssignee, teamMembers, updateTask]
  );

  const handleChangePriority = useCallback(
    async (priority: string) => {
      if (!task) return;
      setIsPriorityDropdownOpen(false);

      const previousPriority = currentPriority;
      const previousTask = { ...task };

      // Update otimista IMEDIATO
      setCurrentPriority(priority);
      setTask(prev =>
        prev
          ? {
              ...prev,
              priority,
              clientId: prev.clientId,
              client: prev.client,
              propertyId: prev.propertyId,
              property: prev.property,
            }
          : null
      );

      try {
        await updateTask(task.id, { priority });
        // Não atualizar o estado - já foi atualizado otimisticamente
      } catch (error: any) {
        console.error('Erro ao alterar prioridade:', error);
        // Rollback - reverter para estado anterior
        setCurrentPriority(previousPriority);
        setTask(previousTask);
        showError(error?.message || 'Erro ao alterar prioridade');
      }
    },
    [task, currentPriority, updateTask]
  );

  const handleChangeDueDate = useCallback(
    async (date: string) => {
      if (!task) return;
      const previousDate = currentDueDate;
      const previousTask = { ...task };

      // Update otimista IMEDIATO
      setCurrentDueDate(date);
      const dueDate = date ? new Date(date) : undefined;
      setTask(prev =>
        prev
          ? {
              ...prev,
              dueDate,
              clientId: prev.clientId,
              client: prev.client,
              propertyId: prev.propertyId,
              property: prev.property,
            }
          : null
      );

      try {
        await updateTask(task.id, { dueDate });
        // Não atualizar o estado - já foi atualizado otimisticamente
      } catch (error: any) {
        console.error('Erro ao alterar prazo:', error);
        // Rollback - reverter para estado anterior
        setCurrentDueDate(previousDate);
        setTask(previousTask);
        showError(error?.message || 'Erro ao alterar prazo');
      }
    },
    [task, currentDueDate, updateTask]
  );

  const handleChangeTotalValue = useCallback(
    async (value: string) => {
      if (!task) return;
      const numericValue = value ? getNumericValue(value) : undefined;
      const currentNumeric = task.totalValue ?? undefined;
      // Só chamar API se o valor realmente mudou (evita histórico fantasma)
      if (numericValue === currentNumeric) return;
      if (
        numericValue != null &&
        currentNumeric != null &&
        Math.abs(numericValue - currentNumeric) < 0.01
      )
        return;

      const previousValue = currentTotalValue;
      const previousTask = { ...task };

      setTask(prev =>
        prev
          ? {
              ...prev,
              totalValue: numericValue,
              clientId: prev.clientId,
              client: prev.client,
              propertyId: prev.propertyId,
              property: prev.property,
            }
          : null
      );

      try {
        await kanbanApi.updateTaskFields(task.id, { totalValue: numericValue });
      } catch (error: any) {
        console.error('Erro ao alterar valor:', error);
        setCurrentTotalValue(previousValue);
        setTask(previousTask);
        showError(error?.message || 'Erro ao alterar valor');
      }
    },
    [task, currentTotalValue]
  );

  // Ref para manter referência atualizada da task sem causar re-renders
  const taskRef = useRef<KanbanTask | null>(task);
  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  // Handler para mudanças em campos personalizados com debounce
  // NÃO salva imediatamente, apenas aguarda inatividade
  const handleCustomFieldChange = useCallback((key: string, value: any) => {
    console.log('🔵 [handleCustomFieldChange] Chamado', {
      key,
      value,
      timestamp: new Date().toISOString(),
    });

    const currentTask = taskRef.current;
    if (!currentTask) {
      console.log('❌ [handleCustomFieldChange] Task não existe, retornando');
      return;
    }

    // Verificar se o valor realmente mudou
    const currentValue = currentTask.customFields?.[key];
    const currentValueStr = JSON.stringify(currentValue);
    const newValueStr = JSON.stringify(value);

    console.log('🔍 [handleCustomFieldChange] Comparando valores', {
      key,
      currentValue,
      newValue: value,
      currentValueStr,
      newValueStr,
      isEqual: currentValueStr === newValueStr,
    });

    if (currentValueStr === newValueStr) {
      console.log('⏭️ [handleCustomFieldChange] Valor não mudou, ignorando');
      return;
    }

    console.log('✅ [handleCustomFieldChange] Valor mudou, processando...');

    // Optimistic update - atualizar imediatamente apenas na UI
    // Usar função de atualização que compara antes de atualizar
    setTask(prev => {
      if (!prev) {
        console.log('⚠️ [handleCustomFieldChange] setTask - prev é null');
        return prev;
      }
      // Verificar novamente se o valor mudou para evitar atualizações desnecessárias
      const prevValue = prev.customFields?.[key];
      if (JSON.stringify(prevValue) === newValueStr) {
        console.log(
          '⏭️ [handleCustomFieldChange] setTask - valor já está atualizado no estado'
        );
        return prev; // Retornar mesma referência para evitar re-render
      }
      console.log('🔄 [handleCustomFieldChange] setTask - atualizando estado');
      const updatedFields = {
        ...(prev.customFields || {}),
        [key]: value,
      };
      // Atualizar ref também para manter sincronizado
      taskRef.current = {
        ...prev,
        customFields: updatedFields,
      };
      return taskRef.current;
    });

    // Guardar mudança pendente apenas se realmente mudou
    customFieldsPendingChangesRef.current[key] = value;
    console.log('💾 [handleCustomFieldChange] Mudança pendente salva', {
      key,
      value,
      pendingChanges: { ...customFieldsPendingChangesRef.current },
    });

    // Limpar timeout anterior
    if (customFieldsSaveTimeoutRef.current) {
      console.log('⏹️ [handleCustomFieldChange] Limpando timeout anterior');
      clearTimeout(customFieldsSaveTimeoutRef.current);
    }

    // Agendar salvamento após 3 segundos de inatividade (sem digitar)
    console.log(
      '⏰ [handleCustomFieldChange] Agendando salvamento em 3 segundos...'
    );
    customFieldsSaveTimeoutRef.current = setTimeout(async () => {
      // Verificar se já está salvando
      if (isSavingCustomFieldsRef.current) {
        console.log(
          '⏸️ [handleCustomFieldChange] Já está salvando, ignorando esta chamada'
        );
        return;
      }

      console.log(
        '⏰ [handleCustomFieldChange] Timeout executado - iniciando salvamento'
      );
      const changes = { ...customFieldsPendingChangesRef.current };
      console.log('📦 [handleCustomFieldChange] Mudanças pendentes:', changes);

      if (Object.keys(changes).length === 0) {
        console.log(
          '⏭️ [handleCustomFieldChange] Nenhuma mudança pendente, retornando'
        );
        return;
      }

      // Obter task atual do ref
      const taskToSave = taskRef.current;
      if (!taskToSave) {
        console.log(
          '❌ [handleCustomFieldChange] Task não existe no ref, retornando'
        );
        return;
      }

      console.log(
        '🔍 [handleCustomFieldChange] Verificando se há mudanças reais...'
      );
      // Verificar se ainda há mudanças para salvar (pode ter sido salvo por outra chamada)
      const hasChanges = Object.keys(changes).some(changeKey => {
        const currentValue = taskToSave.customFields?.[changeKey];
        const isDifferent =
          JSON.stringify(currentValue) !== JSON.stringify(changes[changeKey]);
        console.log(
          `  - Campo ${changeKey}: atual=${JSON.stringify(currentValue)}, pendente=${JSON.stringify(changes[changeKey])}, diferente=${isDifferent}`
        );
        return isDifferent;
      });

      if (!hasChanges) {
        console.log(
          '⏭️ [handleCustomFieldChange] Não há mudanças reais, limpando e retornando'
        );
        customFieldsPendingChangesRef.current = {};
        return;
      }

      console.log(
        '✅ [handleCustomFieldChange] Há mudanças reais, salvando na API...'
      );

      // Marcar como salvando
      isSavingCustomFieldsRef.current = true;

      // Salvar estado atual da task para rollback
      const currentTaskState = { ...taskToSave };

      // Limpar mudanças pendentes ANTES de salvar para evitar que novas mudanças sejam perdidas
      customFieldsPendingChangesRef.current = {};

      // Criar objeto de campos atualizados com todas as mudanças pendentes
      const allUpdatedFields = {
        ...(taskToSave.customFields || {}),
        ...changes,
      };

      console.log('📤 [handleCustomFieldChange] Enviando para API', {
        taskId: taskToSave.id,
        customFields: allUpdatedFields,
      });

      try {
        const updatedTask = await kanbanApi.updateTaskFields(taskToSave.id, {
          customFields: allUpdatedFields,
        });
        console.log(
          '✅ [handleCustomFieldChange] API respondeu com sucesso',
          updatedTask
        );

        // Verificar se há novas mudanças pendentes enquanto salvava
        const newPendingChanges = customFieldsPendingChangesRef.current;
        if (Object.keys(newPendingChanges).length > 0) {
          console.log(
            '🔄 [handleCustomFieldChange] Há novas mudanças pendentes, mesclando...',
            newPendingChanges
          );
          // Mesclar novas mudanças com a resposta da API
          updatedTask.customFields = {
            ...(updatedTask.customFields || {}),
            ...newPendingChanges,
          };
        }

        // NÃO sobrescrever o estado - já foi atualizado otimisticamente
        // Apenas atualizar o ref para manter sincronizado
        // Só atualizar o estado se houver diferenças significativas que precisem ser sincronizadas
        setTask(prev => {
          if (!prev) return updatedTask;
          // Se os customFields já estão iguais, não atualizar (evitar re-render desnecessário)
          const prevFieldsStr = JSON.stringify(prev.customFields || {});
          const newFieldsStr = JSON.stringify(updatedTask.customFields || {});
          if (prevFieldsStr === newFieldsStr) {
            console.log(
              '⏭️ [handleCustomFieldChange] Campos já estão sincronizados, não atualizando'
            );
            return prev;
          }
          // Mesclar apenas os campos que mudaram, preservando o resto do estado
          return {
            ...prev,
            customFields: updatedTask.customFields,
          };
        });
        taskRef.current = updatedTask;
      } catch (error: any) {
        console.error(
          '❌ [handleCustomFieldChange] Erro ao atualizar campo personalizado:',
          error
        );
        // Rollback - reverter para estado anterior
        taskRef.current = currentTaskState;
        setTask(currentTaskState);
        showError('Erro ao atualizar campo personalizado');
      } finally {
        // Liberar flag de salvamento
        isSavingCustomFieldsRef.current = false;
        console.log('🔓 [handleCustomFieldChange] Flag de salvamento liberada');
      }
    }, 3000); // 3 segundos de inatividade
  }, []); // Sem dependências para evitar recriação

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (customFieldsSaveTimeoutRef.current) {
        clearTimeout(customFieldsSaveTimeoutRef.current);
      }
      // Salvar mudanças pendentes ao desmontar
      const taskToSave = taskRef.current;
      if (
        Object.keys(customFieldsPendingChangesRef.current).length > 0 &&
        taskToSave
      ) {
        const changes = { ...customFieldsPendingChangesRef.current };
        customFieldsPendingChangesRef.current = {};
        const allUpdatedFields = {
          ...(taskToSave.customFields || {}),
          ...changes,
        };
        kanbanApi
          .updateTaskFields(taskToSave.id, {
            customFields: allUpdatedFields,
          })
          .catch(error => {
            console.error(
              'Erro ao salvar campos personalizados ao desmontar:',
              error
            );
          });
      }
    };
  }, []); // Sem dependências - só executa ao desmontar

  // Função para salvar cliente com debounce e busca de dados completos
  const handleClientChange = useCallback(
    async (clientId: string | null) => {
      console.log('🔵 [handleClientChange] Iniciado', {
        clientId,
        currentClientId: task?.clientId,
        hasClient: !!task?.client,
        isSaving: isSavingClient,
      });

      if (!task) {
        console.log('🔴 [handleClientChange] Task não existe, retornando');
        return;
      }

      // Se o clientId não mudou, não fazer nada
      if (clientId === task.clientId) {
        console.log('🟡 [handleClientChange] ClientId não mudou, retornando');
        return;
      }

      // Limpar timeout anterior
      if (clientSaveTimeoutRef.current) {
        console.log('🟡 [handleClientChange] Limpando timeout anterior');
        clearTimeout(clientSaveTimeoutRef.current);
      }

      // Atualizar ref imediatamente para evitar que useEffect busque
      lastClientIdRef.current = clientId;
      console.log(
        '🟢 [handleClientChange] Atualizado lastClientIdRef:',
        clientId
      );

      // Se clientId é null, remover cliente imediatamente
      if (!clientId) {
        console.log('🔴 [handleClientChange] REMOVENDO CLIENTE', {
          previousClientId: task.clientId,
          previousClientName: task.client?.name,
          hasClient: !!task.client,
        });
        const previousTask = { ...task };
        // Atualizar estado imediatamente - sem piscar
        setTask(prev => {
          console.log('🟢 [handleClientChange] setTask - removendo cliente', {
            prevClientId: prev?.clientId,
            prevClientName: prev?.client?.name,
            newClientId: null,
            newClient: null,
          });
          return prev ? { ...prev, clientId: null, client: null } : null;
        });

        // Salvar IMEDIATAMENTE (sem debounce para remoção)
        setIsSavingClient(true);
        lastClientIdRef.current = null;

        // Limpar timeout anterior se existir
        if (clientSaveTimeoutRef.current) {
          clearTimeout(clientSaveTimeoutRef.current);
        }

        // Salvar na API em background (não bloquear a UI)
        (async () => {
          console.log(
            '💾 [handleClientChange] Salvando remoção de cliente IMEDIATAMENTE (background)'
          );
          try {
            await kanbanApi.updateTask(task.id, {
              clientId: null,
            });
            console.log(
              '✅ [handleClientChange] Cliente removido com sucesso da API'
            );
            // NÃO atualizar o estado com a resposta da API - já foi atualizado imediatamente acima
            // Apenas garantir que ainda está null (não foi alterado por outro processo)
            setTask(prev => {
              if (!prev) return null;
              // Se ainda está null, manter null (já está correto)
              if (prev.clientId === null && prev.client === null) {
                return prev; // Já está correto, não fazer nada
              }
              // Se por algum motivo mudou (ex: outra atualização), garantir que está null
              if (prev.clientId !== null || prev.client !== null) {
                console.log(
                  '⚠️ [handleClientChange] Estado foi alterado durante salvamento, corrigindo para null'
                );
                return { ...prev, clientId: null, client: null };
              }
              return prev;
            });
          } catch (error: any) {
            console.error(
              '❌ [handleClientChange] Erro ao remover cliente:',
              error
            );
            // Em caso de erro, reverter para o estado anterior (com os dados do cliente)
            console.log(
              '🔄 [handleClientChange] Revertendo para estado anterior devido ao erro',
              {
                previousClientId: previousTask.clientId,
                previousClientName: previousTask.client?.name,
              }
            );
            setTask(previousTask);
            showError('Erro ao remover cliente. Os dados foram restaurados.');
          } finally {
            setIsSavingClient(false);
          }
        })();
        return;
      }

      // Buscar dados do cliente ANTES de atualizar o estado
      const currentProjectId = task.projectId || projectId;
      console.log('🔍 [handleClientChange] Buscando dados do cliente', {
        currentProjectId,
        isValid: isValidProjectId(currentProjectId),
      });

      let clientData: KanbanTaskClient | null = null;

      // Verificar se já temos dados do mesmo cliente
      const hasClientData = task.client && task.client.id === clientId;
      console.log('🔍 [handleClientChange] Verificando dados existentes', {
        hasClientData,
        clientId,
        existingClientId: task.client?.id,
      });

      if (hasClientData) {
        // Se já temos dados, usar os existentes
        clientData = task.client || null;
        console.log(
          '✅ [handleClientChange] Usando dados existentes do cliente',
          clientData
        );
      } else if (isValidProjectId(currentProjectId)) {
        // Buscar dados do cliente imediatamente (SEM setar isSavingClient ainda)
        console.log('🔍 [handleClientChange] Buscando dados do cliente da API');
        try {
          const clients = await kanbanApi.getProjectClients(currentProjectId);
          console.log(
            '📦 [handleClientChange] Clientes recebidos da API',
            clients.length
          );
          clientData = clients.find(c => c.id === clientId) || null;
          console.log(
            '✅ [handleClientChange] Dados do cliente encontrados',
            clientData
          );
        } catch (error) {
          console.error(
            '❌ [handleClientChange] Erro ao buscar dados do cliente:',
            error
          );
          clientData = null;
        }
      } else {
        console.log(
          '⚠️ [handleClientChange] ProjectId inválido, não buscando dados'
        );
      }

      // IMPORTANTE: Salvar estado anterior ANTES de qualquer alteração (deep copy do cliente)
      const previousTask = {
        ...task,
        clientId: task.clientId,
        client: task.client ? { ...task.client } : null,
      };
      console.log('🟢 [handleClientChange] ADICIONANDO CLIENTE', {
        clientId,
        clientName: clientData?.name,
        hasClientData: !!clientData,
        clientDataKeys: clientData ? Object.keys(clientData) : [],
        previousClientId: task.clientId,
        previousClientName: task.client?.name,
      });

      // Atualizar estado de forma otimizada - sempre atualizar quando clientId mudar
      setTask(prev => {
        if (!prev) return null;
        // Se o clientId mudou, sempre atualizar (mesmo que client ainda não esteja disponível)
        if (prev.clientId !== clientId) {
          const newTask = {
            ...prev,
            clientId: clientId,
            client: clientData, // Pode ser null se ainda não foi carregado
          };
          console.log(
            '🟢 [handleClientChange] setTask executado - ADICIONANDO',
            {
              prevClientId: prev?.clientId,
              prevClientName: prev?.client?.name,
              newClientId: newTask?.clientId,
              newClientName: newTask?.client?.name,
              hasNewClient: !!newTask?.client,
            }
          );
          return newTask;
        }
        // Se clientId não mudou mas client mudou (dados foram carregados), atualizar
        if (clientData && prev.client?.id !== clientData.id) {
          const newTask = {
            ...prev,
            client: clientData,
          };
          console.log(
            '🟢 [handleClientChange] setTask - atualizando dados do cliente',
            {
              hasNewClient: !!newTask?.client,
            }
          );
          return newTask;
        }
        // Se já tem os mesmos dados, não atualizar
        console.log(
          '🟡 [handleClientChange] Dados já estão atualizados, pulando setTask'
        );
        return prev;
      });

      // Salvar após 1 segundo de inatividade
      setIsSavingClient(true);
      console.log('⏱️ [handleClientChange] Agendando salvamento em 1 segundo');
      clientSaveTimeoutRef.current = setTimeout(async () => {
        console.log('💾 [handleClientChange] Executando salvamento');
        try {
          const updatedTask = await kanbanApi.updateTask(task.id, {
            clientId: clientId,
          });
          console.log('📦 [handleClientChange] Tarefa atualizada da API', {
            taskId: updatedTask.id,
            clientId: updatedTask.clientId,
            hasClient: !!updatedTask.client,
            clientName: updatedTask.client?.name,
          });

          // CRÍTICO: A API pode retornar a task sem os dados completos do cliente
          // Sempre usar os dados que já buscamos (clientData) se disponíveis
          let finalClientData = clientData;

          if (
            !finalClientData &&
            clientId &&
            isValidProjectId(currentProjectId)
          ) {
            // Se por algum motivo não temos clientData, buscar novamente
            console.log(
              '⚠️ [handleClientChange] Não temos clientData, buscando novamente'
            );
            try {
              const clients =
                await kanbanApi.getProjectClients(currentProjectId);
              finalClientData = clients.find(c => c.id === clientId) || null;
              if (finalClientData) {
                console.log(
                  '✅ [handleClientChange] Dados encontrados na segunda busca',
                  {
                    clientName: finalClientData.name,
                  }
                );
              }
            } catch (fetchError) {
              console.error(
                '❌ [handleClientChange] Erro ao buscar dados completos do cliente após salvar:',
                fetchError
              );
            }
          }

          console.log(
            '🟢 [handleClientChange] Dados finais do cliente preparados',
            {
              hasClientData: !!finalClientData,
              clientName: finalClientData?.name,
              clientKeys: finalClientData ? Object.keys(finalClientData) : [],
            }
          );

          // Atualizar a ref ANTES de setar o task
          if (updatedTask.clientId) {
            lastClientIdRef.current = updatedTask.clientId;
          } else {
            lastClientIdRef.current = null;
          }

          // CRÍTICO: Preservar os dados completos do cliente que já buscamos
          // A API pode retornar a task sem os dados completos do cliente
          const finalTask = {
            ...updatedTask,
            clientId: clientId, // Garantir que o clientId está correto
            client: finalClientData || updatedTask.client || null, // Priorizar finalClientData que já buscamos
          };

          console.log('🟢 [handleClientChange] Estado final preparado', {
            clientId: finalTask.clientId,
            clientName: finalTask.client?.name,
            hasClient: !!finalTask.client,
            clientKeys: finalTask.client ? Object.keys(finalTask.client) : [],
          });

          // Só atualizar se realmente mudou (evitar renderização desnecessária)
          setTask(prev => {
            if (!prev) return finalTask;
            // Se os dados já estão iguais, não atualizar
            if (
              prev.clientId === finalTask.clientId &&
              prev.client?.id === finalTask.client?.id &&
              prev.client?.name === finalTask.client?.name
            ) {
              console.log(
                '🟡 [handleClientChange] Dados já sincronizados, pulando atualização',
                {
                  prevClientName: prev.client?.name,
                  finalClientName: finalTask.client?.name,
                }
              );
              return prev;
            }
            console.log(
              '🟢 [handleClientChange] Atualizando estado final com dados completos',
              {
                prevClientId: prev.clientId,
                prevClientName: prev.client?.name,
                newClientId: finalTask.clientId,
                newClientName: finalTask.client?.name,
              }
            );
            return finalTask;
          });
        } catch (error: any) {
          console.error(
            '❌ [handleClientChange] Erro ao atualizar cliente:',
            error
          );
          // Em caso de erro, reverter para o estado anterior (com todos os dados do cliente)
          console.log(
            '🔄 [handleClientChange] Revertendo para estado anterior devido ao erro',
            {
              previousClientId: previousTask.clientId,
              previousClientName: previousTask.client?.name,
              hasPreviousClient: !!previousTask.client,
            }
          );
          setTask(previousTask);
          showError('Erro ao atualizar cliente. Os dados foram restaurados.');
        } finally {
          setIsSavingClient(false);
          console.log('✅ [handleClientChange] Salvamento concluído');
        }
      }, 1000);
    },
    [task, projectId, isSavingClient]
  );

  // Função para salvar imóvel com debounce e busca de dados completos
  const handlePropertyChange = useCallback(
    async (propertyId: string | null) => {
      console.log('🟣 [handlePropertyChange] Iniciado', {
        propertyId,
        currentPropertyId: task?.propertyId,
        hasProperty: !!task?.property,
        isSaving: isSavingProperty,
      });

      if (!task) {
        console.log('🔴 [handlePropertyChange] Task não existe, retornando');
        return;
      }

      // Se o propertyId não mudou, não fazer nada
      if (propertyId === task.propertyId) {
        console.log(
          '🟡 [handlePropertyChange] PropertyId não mudou, retornando'
        );
        return;
      }

      // Limpar timeout anterior
      if (propertySaveTimeoutRef.current) {
        console.log('🟡 [handlePropertyChange] Limpando timeout anterior');
        clearTimeout(propertySaveTimeoutRef.current);
      }

      // Atualizar ref imediatamente para evitar que useEffect busque
      lastPropertyIdRef.current = propertyId;
      console.log(
        '🟢 [handlePropertyChange] Atualizado lastPropertyIdRef:',
        propertyId
      );

      // Se propertyId é null, remover imóvel imediatamente
      if (!propertyId) {
        console.log('🔴 [handlePropertyChange] Removendo imóvel');
        // IMPORTANTE: Salvar estado anterior ANTES de qualquer alteração (deep copy do imóvel)
        const previousTask = {
          ...task,
          propertyId: task.propertyId,
          property: task.property ? { ...task.property } : null,
        };
        // Atualizar estado imediatamente - sem piscar
        setTask(prev => {
          console.log('🟢 [handlePropertyChange] setTask - removendo imóvel');
          return prev ? { ...prev, propertyId: null, property: null } : null;
        });

        // Salvar IMEDIATAMENTE (sem debounce para remoção)
        setIsSavingProperty(true);
        lastPropertyIdRef.current = null;

        // Limpar timeout anterior se existir
        if (propertySaveTimeoutRef.current) {
          clearTimeout(propertySaveTimeoutRef.current);
        }

        // Salvar na API em background (não bloquear a UI)
        (async () => {
          console.log(
            '💾 [handlePropertyChange] Salvando remoção de imóvel IMEDIATAMENTE (background)'
          );
          try {
            await kanbanApi.updateTask(task.id, {
              propertyId: null,
            });
            console.log(
              '✅ [handlePropertyChange] Imóvel removido com sucesso da API'
            );
            // NÃO atualizar o estado com a resposta da API - já foi atualizado imediatamente acima
            // Apenas garantir que ainda está null (não foi alterado por outro processo)
            setTask(prev => {
              if (!prev) return null;
              // Se ainda está null, manter null (já está correto)
              if (prev.propertyId === null && prev.property === null) {
                return prev; // Já está correto, não fazer nada
              }
              // Se por algum motivo mudou (ex: outra atualização), garantir que está null
              if (prev.propertyId !== null || prev.property !== null) {
                console.log(
                  '⚠️ [handlePropertyChange] Estado foi alterado durante salvamento, corrigindo para null'
                );
                return { ...prev, propertyId: null, property: null };
              }
              return prev;
            });
          } catch (error: any) {
            console.error(
              '❌ [handlePropertyChange] Erro ao remover imóvel:',
              error
            );
            // Em caso de erro, reverter para o estado anterior
            setTask(previousTask);
            showError('Erro ao remover imóvel. Os dados foram restaurados.');
          } finally {
            setIsSavingProperty(false);
          }
        })();
        return;
      }

      // Buscar dados do imóvel ANTES de atualizar o estado
      const currentProjectId = task.projectId || projectId;
      console.log('🔍 [handlePropertyChange] Buscando dados do imóvel', {
        currentProjectId,
        isValid: isValidProjectId(currentProjectId),
      });

      let propertyData: KanbanTaskProperty | null = null;

      // Verificar se já temos dados do mesmo imóvel
      const hasPropertyData = task.property && task.property.id === propertyId;
      console.log('🔍 [handlePropertyChange] Verificando dados existentes', {
        hasPropertyData,
        propertyId,
        existingPropertyId: task.property?.id,
      });

      if (hasPropertyData && task.property) {
        // Se já temos dados, usar os existentes
        propertyData = task.property;
        console.log(
          '✅ [handlePropertyChange] Usando dados existentes do imóvel',
          propertyData
        );
      } else if (isValidProjectId(currentProjectId)) {
        // Buscar dados do imóvel imediatamente (SEM setar isSavingProperty ainda)
        console.log(
          '🔍 [handlePropertyChange] Buscando dados do imóvel da API'
        );
        try {
          const properties =
            await kanbanApi.getProjectProperties(currentProjectId);
          console.log(
            '📦 [handlePropertyChange] Imóveis recebidos da API',
            properties.length
          );
          propertyData = properties.find(p => p.id === propertyId) || null;
          console.log(
            '✅ [handlePropertyChange] Dados do imóvel encontrados',
            propertyData
          );
        } catch (error) {
          console.error(
            '❌ [handlePropertyChange] Erro ao buscar dados do imóvel:',
            error
          );
          propertyData = null;
        }
      } else {
        console.log(
          '⚠️ [handlePropertyChange] ProjectId inválido, não buscando dados'
        );
      }

      // IMPORTANTE: Salvar estado anterior ANTES de qualquer alteração
      const previousTask = {
        ...task,
        propertyId: task.propertyId,
        property: task.property ? { ...task.property } : null,
      };
      console.log('🟢 [handlePropertyChange] Atualizando estado com dados', {
        propertyId,
        hasPropertyData: !!propertyData,
        propertyDataKeys: propertyData ? Object.keys(propertyData) : [],
      });

      // Atualizar estado de forma otimizada - sempre atualizar quando propertyId mudar
      setTask(prev => {
        if (!prev) return null;
        // Se o propertyId mudou, sempre atualizar (mesmo que property ainda não esteja disponível)
        if (prev.propertyId !== propertyId) {
          const newTask = {
            ...prev,
            propertyId: propertyId,
            property: propertyData, // Pode ser null se ainda não foi carregado
          };
          console.log('🟢 [handlePropertyChange] setTask executado', {
            newPropertyId: newTask?.propertyId,
            hasNewProperty: !!newTask?.property,
          });
          return newTask;
        }
        // Se propertyId não mudou mas property mudou (dados foram carregados), atualizar
        if (propertyData && prev.property?.id !== propertyData.id) {
          const newTask = {
            ...prev,
            property: propertyData,
          };
          console.log(
            '🟢 [handlePropertyChange] setTask - atualizando dados do imóvel',
            {
              hasNewProperty: !!newTask?.property,
            }
          );
          return newTask;
        }
        // Se já tem os mesmos dados, não atualizar
        console.log(
          '🟡 [handlePropertyChange] Dados já estão atualizados, pulando setTask'
        );
        return prev;
      });

      // Salvar após 1 segundo de inatividade
      setIsSavingProperty(true);
      console.log(
        '⏱️ [handlePropertyChange] Agendando salvamento em 1 segundo'
      );
      propertySaveTimeoutRef.current = setTimeout(async () => {
        console.log('💾 [handlePropertyChange] Executando salvamento');
        try {
          const updatedTask = await kanbanApi.updateTask(task.id, {
            propertyId: propertyId,
          });
          console.log('📦 [handlePropertyChange] Tarefa atualizada da API', {
            taskId: updatedTask.id,
            propertyId: updatedTask.propertyId,
            hasProperty: !!updatedTask.property,
            propertyTitle: updatedTask.property?.title,
          });

          // CRÍTICO: A API pode retornar a task sem os dados completos do imóvel
          // Sempre usar os dados que já buscamos (propertyData) se disponíveis
          let finalPropertyData = propertyData;

          if (
            !finalPropertyData &&
            propertyId &&
            isValidProjectId(currentProjectId)
          ) {
            // Se por algum motivo não temos propertyData, buscar novamente
            console.log(
              '⚠️ [handlePropertyChange] Não temos propertyData, buscando novamente'
            );
            try {
              const properties =
                await kanbanApi.getProjectProperties(currentProjectId);
              finalPropertyData =
                properties.find(p => p.id === propertyId) || null;
              if (finalPropertyData) {
                console.log(
                  '✅ [handlePropertyChange] Dados encontrados na segunda busca',
                  {
                    propertyTitle: finalPropertyData.title,
                  }
                );
              }
            } catch (fetchError) {
              console.error(
                '❌ [handlePropertyChange] Erro ao buscar dados completos do imóvel após salvar:',
                fetchError
              );
            }
          }

          console.log(
            '🟢 [handlePropertyChange] Dados finais do imóvel preparados',
            {
              hasPropertyData: !!finalPropertyData,
              propertyTitle: finalPropertyData?.title,
              propertyKeys: finalPropertyData
                ? Object.keys(finalPropertyData)
                : [],
            }
          );

          // Atualizar a ref ANTES de setar o task
          if (updatedTask.propertyId) {
            lastPropertyIdRef.current = updatedTask.propertyId;
          } else {
            lastPropertyIdRef.current = null;
          }

          // CRÍTICO: Preservar os dados completos do imóvel que já buscamos
          // A API pode retornar a task sem os dados completos do imóvel
          const finalTask = {
            ...updatedTask,
            propertyId: propertyId, // Garantir que o propertyId está correto
            property: finalPropertyData || updatedTask.property || null, // Priorizar finalPropertyData que já buscamos
          };

          console.log('🟢 [handlePropertyChange] Estado final preparado', {
            propertyId: finalTask.propertyId,
            propertyTitle: finalTask.property?.title,
            hasProperty: !!finalTask.property,
            propertyKeys: finalTask.property
              ? Object.keys(finalTask.property)
              : [],
          });

          // Só atualizar se realmente mudou (evitar renderização desnecessária)
          setTask(prev => {
            if (!prev) return finalTask;
            // Se os dados já estão iguais, não atualizar
            if (
              prev.propertyId === finalTask.propertyId &&
              prev.property?.id === finalTask.property?.id &&
              prev.property?.title === finalTask.property?.title
            ) {
              console.log(
                '🟡 [handlePropertyChange] Dados já sincronizados, pulando atualização',
                {
                  prevPropertyTitle: prev.property?.title,
                  finalPropertyTitle: finalTask.property?.title,
                }
              );
              return prev;
            }
            console.log(
              '🟢 [handlePropertyChange] Atualizando estado final com dados completos',
              {
                prevPropertyId: prev.propertyId,
                prevPropertyTitle: prev.property?.title,
                newPropertyId: finalTask.propertyId,
                newPropertyTitle: finalTask.property?.title,
              }
            );
            return finalTask;
          });
        } catch (error: any) {
          console.error(
            '❌ [handlePropertyChange] Erro ao atualizar imóvel:',
            error
          );
          // Em caso de erro, reverter para o estado anterior (com todos os dados do imóvel)
          console.log(
            '🔄 [handlePropertyChange] Revertendo para estado anterior devido ao erro',
            {
              previousPropertyId: previousTask.propertyId,
              previousPropertyTitle: previousTask.property?.title,
              hasPreviousProperty: !!previousTask.property,
            }
          );
          setTask(previousTask);
          showError('Erro ao atualizar imóvel. Os dados foram restaurados.');
        } finally {
          setIsSavingProperty(false);
          console.log('✅ [handlePropertyChange] Salvamento concluído');
        }
      }, 1000);
    },
    [task, projectId, isSavingProperty]
  );

  // Limpar timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (clientSaveTimeoutRef.current) {
        clearTimeout(clientSaveTimeoutRef.current);
      }
      if (propertySaveTimeoutRef.current) {
        clearTimeout(propertySaveTimeoutRef.current);
      }
    };
  }, []);

  // Salvar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (clientSaveTimeoutRef.current && task) {
        clearTimeout(clientSaveTimeoutRef.current);
        kanbanApi
          .updateTask(task.id, {
            clientId: task.clientId || null,
          })
          .catch(console.error);
      }
      if (propertySaveTimeoutRef.current && task) {
        clearTimeout(propertySaveTimeoutRef.current);
        kanbanApi
          .updateTask(task.id, {
            propertyId: task.propertyId || null,
          })
          .catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [task]);

  const scheduleValueSave = useCallback(
    (value: string) => {
      if (saveValueTimeoutRef.current) {
        clearTimeout(saveValueTimeoutRef.current);
      }
      saveValueTimeoutRef.current = setTimeout(() => {
        if (value) {
          handleChangeTotalValue(value);
        } else {
          handleChangeTotalValue('');
        }
      }, 1000); // Salva após 1 segundo de inatividade
    },
    [handleChangeTotalValue]
  );

  // Limpar timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (saveValueTimeoutRef.current) {
        clearTimeout(saveValueTimeoutRef.current);
      }
      if (clientSaveTimeoutRef.current) {
        clearTimeout(clientSaveTimeoutRef.current);
      }
      if (propertySaveTimeoutRef.current) {
        clearTimeout(propertySaveTimeoutRef.current);
      }
    };
  }, []);

  // Salvar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (clientSaveTimeoutRef.current && task) {
        clearTimeout(clientSaveTimeoutRef.current);
        kanbanApi
          .updateTask(task.id, {
            clientId: task.clientId || null,
          })
          .catch(console.error);
      }
      if (propertySaveTimeoutRef.current && task) {
        clearTimeout(propertySaveTimeoutRef.current);
        kanbanApi
          .updateTask(task.id, {
            propertyId: task.propertyId || null,
          })
          .catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [task]);

  const handleSelectTag = useCallback(
    async (tag: string) => {
      if (!task) return;
      if (tags.includes(tag)) {
        setIsTagDropdownOpen(false);
        setTagSearch('');
        return;
      }

      const previousTags = [...tags];
      const previousTask = { ...task };
      const updatedTags = [...tags, tag];

      // Update otimista IMEDIATO
      setTags(updatedTags);
      setIsTagDropdownOpen(false);
      setTagSearch('');
      setTask(prev =>
        prev
          ? {
              ...prev,
              tags: updatedTags,
              clientId: prev.clientId,
              client: prev.client,
              propertyId: prev.propertyId,
              property: prev.property,
            }
          : null
      );

      try {
        await updateTask(task.id, { tags: updatedTags });
        // Não atualizar o estado - já foi atualizado otimisticamente
      } catch (error: any) {
        console.error('Erro ao adicionar tag:', error);
        // Rollback - reverter para estado anterior
        setTags(previousTags);
        setTask(previousTask);
        showError(error?.message || 'Erro ao adicionar tag');
      }
    },
    [task, tags, updateTask]
  );

  const handleRemoveTag = useCallback(
    async (tagToRemove: string) => {
      if (!task) return;
      const previousTags = [...tags];
      const previousTask = { ...task };
      const updatedTags = tags.filter(t => t !== tagToRemove);

      // Update otimista IMEDIATO
      setTags(updatedTags);
      setTask(prev =>
        prev
          ? {
              ...prev,
              tags: updatedTags,
              clientId: prev.clientId,
              client: prev.client,
              propertyId: prev.propertyId,
              property: prev.property,
            }
          : null
      );

      try {
        await updateTask(task.id, { tags: updatedTags });
        // Não atualizar o estado - já foi atualizado otimisticamente
      } catch (error: any) {
        console.error('Erro ao remover tag:', error);
        // Rollback - reverter para estado anterior
        setTags(previousTags);
        setTask(previousTask);
        showError(error?.message || 'Erro ao remover tag');
      }
    },
    [task, tags, updateTask]
  );

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
      if (!task) return;
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

        await kanbanApi.createTaskComment(task.id, formData);
        setCommentMessage('');
        clearCommentSelectedFiles();
        await loadTaskComments();
      } catch (error: any) {
        console.error('Erro ao adicionar comentário:', error);
        setCommentErrorMessage(
          error?.message || 'Erro ao adicionar comentário'
        );
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [
      task,
      commentMessage,
      commentSelectedFiles,
      loadTaskComments,
      clearCommentSelectedFiles,
    ]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!task) return;
      setDeletingComments(prev => {
        const next = new Set(prev);
        next.add(commentId);
        return next;
      });

      try {
        await kanbanApi.deleteTaskComment(task.id, commentId);
        await loadTaskComments();
      } catch (error: any) {
        console.error('Erro ao deletar comentário:', error);
        showError(error?.message || 'Erro ao deletar comentário');
      } finally {
        setDeletingComments(prev => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    },
    [task, loadTaskComments]
  );

  const handleBack = () => {
    const projectIdParam = searchParams.get('projectId');
    const workspace = searchParams.get('workspace');
    const kanbanUrl = buildKanbanUrl({
      projectId: projectIdParam || task?.projectId || undefined,
      teamId: effectiveTeamId || undefined,
      workspace: workspace || undefined,
    });
    navigate(kanbanUrl);
  };

  const handleCreateSubTask = () => {
    if (!task) return;

    const params = new URLSearchParams();
    if (effectiveTeamId) params.set('teamId', effectiveTeamId);
    if (task.projectId) params.set('projectId', task.projectId);
    const queryString = params.toString();
    navigate(
      `/kanban/tasks/${task.id}/subtasks/new${queryString ? `?${queryString}` : ''}`
    );
  };

  if (loading || !task) {
    return (
      <Layout>
        <PageContainer>
          <ShimmerHeader>
            <ShimmerBox $width='40px' $height='40px' $borderRadius='8px' />
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <ShimmerBox $width='60%' $height='28px' $borderRadius='8px' />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <ShimmerBox $width='80px' $height='24px' $borderRadius='12px' />
                <ShimmerBox
                  $width='100px'
                  $height='24px'
                  $borderRadius='12px'
                />
                <ShimmerBox $width='70px' $height='24px' $borderRadius='12px' />
              </div>
            </div>
            <ShimmerBox $width='40px' $height='40px' $borderRadius='8px' />
          </ShimmerHeader>
          <ShimmerContentWrapper>
            <ShimmerLeftPanel>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <ShimmerBox $width='100px' $height='20px' $borderRadius='4px' />
                <ShimmerBox $width='100%' $height='80px' $borderRadius='8px' />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <ShimmerBox $width='120px' $height='20px' $borderRadius='4px' />
                <ShimmerBox $width='100%' $height='60px' $borderRadius='8px' />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <ShimmerBox $width='100px' $height='20px' $borderRadius='4px' />
                <ShimmerBox $width='100%' $height='40px' $borderRadius='8px' />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <ShimmerBox $width='80px' $height='20px' $borderRadius='4px' />
                <ShimmerBox $width='100%' $height='40px' $borderRadius='8px' />
              </div>
            </ShimmerLeftPanel>
            <ShimmerMainContent>
              <ShimmerTabsContainer>
                <ShimmerBox $width='150px' $height='44px' $borderRadius='0' />
                <ShimmerBox $width='120px' $height='44px' $borderRadius='0' />
                <ShimmerBox $width='130px' $height='44px' $borderRadius='0' />
                <ShimmerBox $width='100px' $height='44px' $borderRadius='0' />
              </ShimmerTabsContainer>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <ShimmerBox
                  $width='100%'
                  $height='200px'
                  $borderRadius='12px'
                />
                <ShimmerBox
                  $width='100%'
                  $height='150px'
                  $borderRadius='12px'
                />
                <ShimmerBox $width='80%' $height='120px' $borderRadius='12px' />
              </div>
            </ShimmerMainContent>
          </ShimmerContentWrapper>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <Header>
          <HeaderRow>
            <BackButton onClick={handleBack} title='Voltar'>
              <MdArrowBack size={20} />
            </BackButton>

            <HeaderMain>
              <HeaderTitleRow>
                {isEditingTitle ? (
                  <TitleInputContainer style={{ flex: 1, minWidth: 0 }}>
                    <TitleInput
                      type='text'
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveTitle();
                        else if (e.key === 'Escape') {
                          setIsEditingTitle(false);
                          setEditedTitle(task.title);
                        }
                      }}
                      autoFocus
                    />
                    <SaveTitleButton
                      onClick={handleSaveTitle}
                      title='Salvar título'
                    >
                      <MdSave size={20} />
                    </SaveTitleButton>
                  </TitleInputContainer>
                ) : (
                  <TitleContainer>
                    <PageTitle
                      onClick={() => setIsEditingTitle(true)}
                      title='Clique para editar'
                    >
                      {task.title}
                    </PageTitle>
                    <EditTitleButton
                      type='button'
                      onClick={e => {
                        e.stopPropagation();
                        setIsEditingTitle(true);
                      }}
                      title='Editar título'
                      className='edit-icon'
                    >
                      <MdEdit size={18} style={{ opacity: 0.7 }} />
                    </EditTitleButton>
                  </TitleContainer>
                )}
              </HeaderTitleRow>
              <TagsContainer>
                {currentPriority && (
                  <PriorityBadge priority={currentPriority}>
                    <MdFlag size={14} />
                    {getPriorityLabel(currentPriority)}
                  </PriorityBadge>
                )}
                {taskColumn && (
                  <Tag $color={taskColumn.color || '#6B7280'}>
                    {taskColumn.title}
                  </Tag>
                )}
                {tags.map(tag => (
                  <Tag key={tag} $color='#6B7280'>
                    {tag}
                  </Tag>
                ))}
                {task.isCompleted && (
                  <Tag $color='#10B981'>
                    <MdCheckCircle size={14} />
                    Concluída
                  </Tag>
                )}
              </TagsContainer>
            </HeaderMain>

            <HeaderActions>
              <ResultBadge
                task={task}
                onUpdate={updatedTask => {
                  setTask(prev => {
                    if (!prev) return updatedTask;
                    const relevantFields: (keyof KanbanTask)[] = [
                      'result',
                      'resultDate',
                      'resultNotes',
                      'lossReason',
                    ];
                    const hasChanges = relevantFields.some(
                      field =>
                        JSON.stringify(prev[field]) !==
                        JSON.stringify(updatedTask[field])
                    );
                    if (!hasChanges) return prev;
                    const updates = relevantFields.reduce((acc, field) => {
                      if (
                        Object.prototype.hasOwnProperty.call(updatedTask, field)
                      ) {
                        acc[field] = updatedTask[field];
                      }
                      return acc;
                    }, {} as Partial<KanbanTask>);
                    return { ...prev, ...updates };
                  });
                }}
              />
              <HeaderActionsGroup>
                <ActionButton
                  onClick={() => setIsTransferModalOpen(true)}
                  title='Transferir para outro projeto'
                  style={{ background: '#3B82F6', borderColor: '#3B82F6' }}
                >
                  <MdSwapHoriz size={20} />
                </ActionButton>
                <ActionButton
                  onClick={() => setIsDeleteModalOpen(true)}
                  title='Excluir negociação'
                >
                  <MdDelete size={20} />
                </ActionButton>
              </HeaderActionsGroup>
            </HeaderActions>
          </HeaderRow>
        </Header>

        <ContentWrapper>
          <LeftPanel>
            <LeftPanelInner>
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdEdit size={18} />
                </SectionIcon>
                <SectionTitle>Descrição</SectionTitle>
              </SectionHeader>
              {isEditingDescription ? (
                <EditableDescription
                  value={editedDescription}
                  onChange={e => setEditedDescription(e.target.value)}
                  onBlur={handleSaveDescription}
                  placeholder='Adicione uma descrição...'
                  autoFocus
                />
              ) : (
                <EditableSection onClick={() => setIsEditingDescription(true)}>
                  {editedDescription ? (
                    <Description>{editedDescription}</Description>
                  ) : (
                    <EmptyDescription>
                      Clique para adicionar uma descrição...
                    </EmptyDescription>
                  )}
                </EditableSection>
              )}
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPerson size={18} />
                </SectionIcon>
                <SectionTitle>Responsável</SectionTitle>
              </SectionHeader>
              {loading ? (
                <ShimmerBox $width='100%' $height='60px' $borderRadius='16px' />
              ) : (
                <InfoCard $hasDropdownOpen={isAssigneeDropdownOpen}>
                  {currentAssignee ? (
                    <AssigneeCard
                      data-assignee-trigger
                      onClick={() =>
                        setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)
                      }
                    >
                      <AssigneeInfo>
                        <Avatar
                          name={currentAssignee.name}
                          image={currentAssignee.avatar}
                          size={40}
                        />
                        <AssigneeTextBlock>
                          <AssigneeName>{currentAssignee.name}</AssigneeName>
                          {currentAssignee.email && (
                            <AssigneeEmail>
                              {currentAssignee.email}
                            </AssigneeEmail>
                          )}
                        </AssigneeTextBlock>
                      </AssigneeInfo>
                      <AssigneeActions className='assignee-actions'>
                        <RemoveAssigneeButton
                          onClick={e => {
                            e.stopPropagation();
                            handleChangeAssignee(null);
                          }}
                        >
                          <MdPersonOff size={16} />
                        </RemoveAssigneeButton>
                      </AssigneeActions>
                    </AssigneeCard>
                  ) : (
                    <AssigneeOption
                      data-assignee-trigger
                      onClick={() => setIsAssigneeDropdownOpen(true)}
                    >
                      <MdAdd size={20} />
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
              )}
            </Section>

            {/* Pessoas Envolvidas */}
            {task && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdPerson size={18} />
                  </SectionIcon>
                  <SectionTitle>Pessoas Envolvidas</SectionTitle>
                </SectionHeader>
                <InvolvedUsersManager
                  task={task}
                  teamMembers={teamMembers}
                  onUpdate={updatedTask => {
                    console.log(
                      '🔄 TaskDetailsPage - Negociação atualizada pelo InvolvedUsersManager:',
                      {
                        taskId: updatedTask.id,
                        involvedUsers: updatedTask.involvedUsers,
                        count: updatedTask.involvedUsers?.length || 0,
                      }
                    );
                    setTask(updatedTask);
                    // Recarregar o board para garantir sincronização
                    if (effectiveTeamId) {
                      kanbanApi
                        .getBoard(effectiveTeamId, {
                          projectId: task.projectId || undefined,
                        })
                        .then(boardData => {
                          const refreshedTask = boardData.tasks.find(
                            t => t.id === task.id
                          );
                          if (refreshedTask) {
                            setTask(refreshedTask);
                          }
                        })
                        .catch(err => {
                          console.error('Erro ao recarregar board:', err);
                        });
                    }
                  }}
                  loadCompanyMembers={true}
                />
              </Section>
            )}

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdFlag size={18} />
                </SectionIcon>
                <SectionTitle>Prioridade</SectionTitle>
              </SectionHeader>
              {loading ? (
                <ShimmerBox $width='100%' $height='40px' $borderRadius='20px' />
              ) : (
                <PrioritySelector>
                  <PriorityBadge
                    priority={currentPriority}
                    onClick={() =>
                      setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <MdFlag size={14} />
                    {currentPriority
                      ? getPriorityLabel(currentPriority)
                      : 'Sem prioridade'}
                  </PriorityBadge>
                  {isPriorityDropdownOpen && (
                    <PriorityDropdown isOpen={true}>
                      <PriorityOption
                        priority='low'
                        onClick={() => handleChangePriority('low')}
                      >
                        Baixa
                      </PriorityOption>
                      <PriorityOption
                        priority='medium'
                        onClick={() => handleChangePriority('medium')}
                      >
                        Média
                      </PriorityOption>
                      <PriorityOption
                        priority='high'
                        onClick={() => handleChangePriority('high')}
                      >
                        Alta
                      </PriorityOption>
                      <PriorityOption
                        priority='urgent'
                        onClick={() => handleChangePriority('urgent')}
                      >
                        Urgente
                      </PriorityOption>
                    </PriorityDropdown>
                  )}
                </PrioritySelector>
              )}
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdSchedule size={18} />
                </SectionIcon>
                <SectionTitle>Prazo</SectionTitle>
              </SectionHeader>
              {loading ? (
                <ShimmerBox $width='100%' $height='44px' $borderRadius='8px' />
              ) : (
                <DateInput
                  type='date'
                  value={currentDueDate}
                  onChange={e => handleChangeDueDate(e.target.value)}
                />
              )}
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdAttachMoney size={18} />
                </SectionIcon>
                <SectionTitle>Valor da Negociação</SectionTitle>
              </SectionHeader>
              {loading ? (
                <ShimmerBox $width='100%' $height='44px' $borderRadius='8px' />
              ) : (
                <ValueInput
                  type='text'
                  value={currentTotalValue}
                  onChange={e => {
                    const inputValue = e.target.value;

                    // Se estiver vazio, limpar
                    if (inputValue === '') {
                      setCurrentTotalValue('');
                      return;
                    }

                    // Remove tudo que não é dígito
                    const rawValue = inputValue.replace(/\D/g, '');

                    // Se não há dígitos, limpar
                    if (rawValue === '') {
                      setCurrentTotalValue('');
                      return;
                    }

                    // Formatar manualmente sem remover zeros
                    let formatted = rawValue;

                    // Adicionar vírgula para centavos (últimos 2 dígitos)
                    if (formatted.length > 2) {
                      const integerPart = formatted.slice(0, -2);
                      const decimalPart = formatted.slice(-2);
                      formatted = integerPart + ',' + decimalPart;
                    } else if (formatted.length === 2) {
                      formatted = '0,' + formatted;
                    } else if (formatted.length === 1) {
                      formatted = '0,0' + formatted;
                    }

                    // Adicionar pontos para separar milhares apenas na parte inteira
                    const parts = formatted.split(',');
                    if (parts[0] && parts[0].length > 3) {
                      // Remove zeros à esquerda antes de formatar
                      const cleanInteger = parts[0].replace(/^0+/, '') || '0';
                      parts[0] = cleanInteger.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        '.'
                      );
                      formatted = parts.join(',');
                    } else if (
                      parts[0] &&
                      parts[0].startsWith('0') &&
                      parts[0].length > 1
                    ) {
                      // Remove zeros à esquerda
                      parts[0] = parts[0].replace(/^0+/, '') || '0';
                      formatted = parts.join(',');
                    }

                    setCurrentTotalValue(formatted);
                    scheduleValueSave(formatted);
                  }}
                  onBlur={() => {
                    if (saveValueTimeoutRef.current) {
                      clearTimeout(saveValueTimeoutRef.current);
                    }
                    const valueToSave = currentTotalValue;
                    if (valueToSave) {
                      handleChangeTotalValue(valueToSave);
                    } else {
                      handleChangeTotalValue('');
                    }
                  }}
                  placeholder='0,00'
                  maxLength={20}
                />
              )}
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdLabel size={18} />
                </SectionIcon>
                <SectionTitle>Tags</SectionTitle>
              </SectionHeader>
              <TagsContainer>
                {tags.map(tag => (
                  <Tag key={tag} $color='#6B7280'>
                    {tag}
                    <RemoveTagIcon onClick={() => handleRemoveTag(tag)}>
                      <MdClear size={14} />
                    </RemoveTagIcon>
                  </Tag>
                ))}
                {isAddingTag ? (
                  <TagSelectorContainer>
                    <TagSearchInput
                      type='text'
                      value={tagSearch}
                      onChange={e => setTagSearch(e.target.value)}
                      onFocus={() => setIsTagDropdownOpen(true)}
                      placeholder='Buscar ou criar tag...'
                      autoFocus
                    />
                    {isTagDropdownOpen && (
                      <TagDropdown isOpen={true}>
                        {availableTags
                          .filter(tag =>
                            tag.name
                              .toLowerCase()
                              .includes(tagSearch.toLowerCase())
                          )
                          .map(tag => (
                            <TagOption
                              key={tag.id}
                              onClick={() => handleSelectTag(tag.name)}
                            >
                              {tag.name}
                            </TagOption>
                          ))}
                        {tagSearch.trim() &&
                          !availableTags.some(
                            t =>
                              t.name.toLowerCase() === tagSearch.toLowerCase()
                          ) && (
                            <TagOption
                              isNew
                              onClick={() => handleSelectTag(tagSearch.trim())}
                            >
                              <MdAdd size={16} />
                              Criar "{tagSearch.trim()}"
                            </TagOption>
                          )}
                      </TagDropdown>
                    )}
                  </TagSelectorContainer>
                ) : (
                  <AddTagButton onClick={() => setIsAddingTag(true)}>
                    <MdAdd size={16} />
                    Adicionar tag
                  </AddTagButton>
                )}
              </TagsContainer>
            </Section>

            {/* Sub-negociações (oculto por padrão - ative SHOW_SUB_NEGOCIACAO se precisar) */}
            {SHOW_SUB_NEGOCIACAO && task?.id && (
              <Section>
                <SubTaskManager
                  taskId={task.id}
                  projectId={task.projectId}
                  onUpdate={async () => {
                    if (effectiveTeamId) {
                      const boardData = await kanbanApi.getBoard(
                        effectiveTeamId,
                        {
                          projectId: task.projectId || undefined,
                        }
                      );
                      const updatedTask = boardData.tasks.find(
                        t => t.id === task.id
                      );
                      if (updatedTask) {
                        setTask(updatedTask);
                      }
                    }
                  }}
                />
              </Section>
            )}

            {/* Cliente e Imóvel - apenas se houver projeto */}
            {(() => {
              const currentProjectId = task?.projectId || projectId;
              if (!isValidProjectId(currentProjectId)) return null;

              return (
                <Section>
                  <SectionHeader>
                    <SectionIcon>
                      <MdPerson size={18} />
                    </SectionIcon>
                    <SectionTitle>Cliente e Imóvel</SectionTitle>
                  </SectionHeader>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '8px',
                          color: 'inherit',
                        }}
                      >
                        Cliente
                        {isSavingClient && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontStyle: 'italic',
                            }}
                          >
                            Salvando...
                          </span>
                        )}
                      </label>
                      {isValidProjectId(currentProjectId) && (
                        <ClientSelect
                          key={`client-${task?.clientId || 'none'}-${task?.client?.id || 'none'}`}
                          projectId={currentProjectId}
                          value={task?.clientId || null}
                          client={task?.client || null}
                          onChange={handleClientChange}
                          disabled={isSavingClient}
                        />
                      )}
                      {task?.clientId && task?.client && (
                        <ClientInfoCard>
                          <ClientInfoHeader>
                            <ClientInfoName>{task.client.name}</ClientInfoName>
                            {task.client.type && (
                              <ClientInfoBadge $type={task.client.type}>
                                {translateClientType(task.client.type)}
                              </ClientInfoBadge>
                            )}
                            {task.client.status && (
                              <ClientInfoBadge>
                                {translateClientStatus(task.client.status)}
                              </ClientInfoBadge>
                            )}
                          </ClientInfoHeader>
                          <ClientInfoGrid>
                            {task.client.email && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdEmail size={14} />
                                  Email
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {task.client.email}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                            {task.client.phone && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdPhone size={14} />
                                  Telefone
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {maskPhoneAuto(task.client.phone)}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                            {task.client.whatsapp &&
                              task.client.whatsapp !== task.client.phone && (
                                <ClientInfoItem>
                                  <ClientInfoLabel>
                                    <MdPhone size={14} />
                                    WhatsApp
                                  </ClientInfoLabel>
                                  <ClientInfoValue>
                                    {maskPhoneAuto(task.client.whatsapp)}
                                  </ClientInfoValue>
                                </ClientInfoItem>
                              )}
                            {task.client.secondaryPhone && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdPhone size={14} />
                                  Telefone Secundário
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {maskPhoneAuto(task.client.secondaryPhone)}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                            {task.client.cpf && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdBadge size={14} />
                                  CPF
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {maskCPF(task.client.cpf)}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                            {task.client.city && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdLocationOn size={14} />
                                  Cidade
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {task.client.city}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                            {task.client.responsibleUserName && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdPerson size={14} />
                                  Responsável
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {task.client.responsibleUserName}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                            {task.client.createdAt && (
                              <ClientInfoItem>
                                <ClientInfoLabel>
                                  <MdSchedule size={14} />
                                  Criado em
                                </ClientInfoLabel>
                                <ClientInfoValue>
                                  {format(
                                    new Date(task.client.createdAt),
                                    "dd 'de' MMMM 'de' yyyy",
                                    { locale: ptBR }
                                  )}
                                </ClientInfoValue>
                              </ClientInfoItem>
                            )}
                          </ClientInfoGrid>
                        </ClientInfoCard>
                      )}
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '8px',
                          color: 'inherit',
                        }}
                      >
                        Imóvel
                        {isSavingProperty && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontStyle: 'italic',
                            }}
                          >
                            Salvando...
                          </span>
                        )}
                      </label>
                      {isValidProjectId(currentProjectId) && (
                        <PropertySelect
                          key={`property-${task?.propertyId || 'none'}-${task?.property?.id || 'none'}`}
                          projectId={currentProjectId}
                          value={task?.propertyId || null}
                          property={task?.property || null}
                          onChange={handlePropertyChange}
                          disabled={isSavingProperty}
                        />
                      )}
                      {task?.propertyId && task?.property && (
                        <PropertyInfoCard>
                          <PropertyInfoHeader>
                            <PropertyInfoTitle>
                              {task.property.title}
                            </PropertyInfoTitle>
                            {task.property.code && (
                              <ClientInfoBadge>
                                Código: {task.property.code}
                              </ClientInfoBadge>
                            )}
                            {task.property.type && (
                              <ClientInfoBadge>
                                {translatePropertyType(task.property.type)}
                              </ClientInfoBadge>
                            )}
                            {task.property.status && (
                              <ClientInfoBadge>
                                {translatePropertyStatus(task.property.status)}
                              </ClientInfoBadge>
                            )}
                          </PropertyInfoHeader>
                          <PropertyInfoGrid>
                            {task.property.address && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdLocationOn size={14} />
                                  Endereço
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.address}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.city && task.property.state && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdLocationOn size={14} />
                                  Localização
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.city}/{task.property.state}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.neighborhood && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdLocationOn size={14} />
                                  Bairro
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.neighborhood}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.salePrice && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdAttachMoney size={14} />
                                  Preço de Venda
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {formatCurrencyNumber(
                                    task.property.salePrice ?? null
                                  )}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.rentPrice && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdAttachMoney size={14} />
                                  Preço de Aluguel
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {formatCurrencyNumber(
                                    task.property.rentPrice ?? null
                                  )}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.bedrooms && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdHome size={14} />
                                  Quartos
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.bedrooms}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.bathrooms && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdHome size={14} />
                                  Banheiros
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.bathrooms}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.parkingSpaces && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdHome size={14} />
                                  Vagas
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.parkingSpaces}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.totalArea && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdHome size={14} />
                                  Área Total
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.totalArea}m²
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.builtArea && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdHome size={14} />
                                  Área Construída
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.builtArea}m²
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.responsibleUserName && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdPerson size={14} />
                                  Responsável
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {task.property.responsibleUserName}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                            {task.property.createdAt && (
                              <PropertyInfoItem>
                                <PropertyInfoLabel>
                                  <MdSchedule size={14} />
                                  Criado em
                                </PropertyInfoLabel>
                                <PropertyInfoValue>
                                  {format(
                                    new Date(task.property.createdAt),
                                    "dd 'de' MMMM 'de' yyyy",
                                    { locale: ptBR }
                                  )}
                                </PropertyInfoValue>
                              </PropertyInfoItem>
                            )}
                          </PropertyInfoGrid>
                        </PropertyInfoCard>
                      )}
                    </div>
                  </div>
                </Section>
              );
            })()}

            {/* Campos Adicionais */}
            {task && (
              <Section>
                <TaskAdditionalFields
                  task={task}
                  onUpdate={updatedTask => {
                    // Update otimista - já foi atualizado no TaskAdditionalFields
                    // Não sobrescrever com a resposta da API, apenas sincronizar se necessário
                    setTask(prev => {
                      if (!prev) return updatedTask;
                      // Verificar se realmente mudou algo relevante
                      const relevantFields: (keyof KanbanTask)[] = [
                        'qualification',
                        'totalValue',
                        'closingForecast',
                        'source',
                        'campaign',
                        'preService',
                        'vgc',
                        'transferDate',
                        'sector',
                      ];
                      const hasChanges = relevantFields.some(field => {
                        return (
                          JSON.stringify(prev[field]) !==
                          JSON.stringify(updatedTask[field])
                        );
                      });
                      if (!hasChanges) {
                        return prev; // Não mudou, não atualizar
                      }
                      // Mesclar apenas os campos relevantes, preservando o resto
                      return {
                        ...prev,
                        ...relevantFields.reduce((acc, field) => {
                          if (updatedTask[field] !== undefined) {
                            acc[field] = updatedTask[field];
                          }
                          return acc;
                        }, {} as Partial<KanbanTask>),
                      };
                    });
                  }}
                />
              </Section>
            )}

            {/* Campos Personalizados */}
            {task && effectiveTeamId && (
              <Section>
                <CustomFieldsManager
                  teamId={effectiveTeamId}
                  projectId={task.projectId}
                  taskCustomFields={task.customFields || {}}
                  onFieldChange={handleCustomFieldChange}
                />
              </Section>
            )}
            </LeftPanelInner>
          </LeftPanel>

          <MainContent>
            {SHOW_SUB_NEGOCIACAO && (
              <CreateSubTaskButtonContainer>
                <CreateSubTaskButton onClick={handleCreateSubTask}>
                  <MdAdd size={18} />
                  Criar Sub-negociação
                </CreateSubTaskButton>
              </CreateSubTaskButtonContainer>
            )}
            <TabsContainer>
              <Tab
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              >
                Histórico
              </Tab>
              <Tab
                active={activeTab === 'comments'}
                onClick={() => setActiveTab('comments')}
              >
                Comentários
              </Tab>
              <Tab
                active={activeTab === 'files'}
                onClick={() => setActiveTab('files')}
              >
                Arquivos
              </Tab>
              {task?.id && (
                <Tab
                  active={activeTab === 'transfers'}
                  onClick={() => setActiveTab('transfers')}
                >
                  Transferências
                </Tab>
              )}
              {task?.id && canViewMetrics() && (
                <Tab
                  active={activeTab === 'metrics'}
                  onClick={() => setActiveTab('metrics')}
                >
                  Métricas
                </Tab>
              )}
            </TabsContainer>

            <TabContent
              active={
                activeTab === 'history' ||
                activeTab === 'comments' ||
                activeTab === 'files' ||
                activeTab === 'transfers' ||
                activeTab === 'metrics'
              }
            >
              {activeTab === 'history' && (
                <>
                  {loadingHistory || loadingValidationHistory ? (
                    <LoadingHistory>Carregando histórico...</LoadingHistory>
                  ) : history.length === 0 &&
                    (!validationHistory?.executions ||
                      validationHistory.executions.length === 0) &&
                    (!actionHistory?.executions ||
                      actionHistory.executions.length === 0) &&
                    !(task?.sourceHistory && task.sourceHistory.length > 0) ? (
                    <EmptyHistory>Nenhum histórico disponível</EmptyHistory>
                  ) : (
                    <>
                      {task?.sourceHistory && task.sourceHistory.length > 0 && (
                        <>
                          <SourceHistoryTitle>Histórico da origem</SourceHistoryTitle>
                          <HistoryList style={{ marginBottom: '20px' }}>
                            {[...task.sourceHistory]
                              .sort(
                                (a, b) =>
                                  new Date(b.at || 0).getTime() -
                                  new Date(a.at || 0).getTime()
                              )
                              .map((entry, index) => (
                                <HistoryItem key={`source-${index}`}>
                                  <HistoryAvatarSection>
                                    <Avatar
                                      name={entry.userName || 'Origem'}
                                      size={40}
                                    />
                                  </HistoryAvatarSection>
                                  <HistoryContent>
                                    <HistoryAction>
                                      {entry.text || '(sem descrição)'}
                                    </HistoryAction>
                                    {entry.userName && (
                                      <HistoryAction>
                                        <strong>{entry.userName}</strong>
                                      </HistoryAction>
                                    )}
                                    <HistoryTime>
                                      <MdSchedule size={14} />
                                      {entry.at
                                        ? format(
                                            new Date(entry.at),
                                            "dd/MM/yyyy 'às' HH:mm",
                                            { locale: ptBR }
                                          )
                                        : ''}
                                    </HistoryTime>
                                  </HistoryContent>
                                </HistoryItem>
                              ))}
                          </HistoryList>
                        </>
                      )}
                      <HistoryTimeline
                        history={history}
                        loading={loadingHistory}
                      />
                      {validationHistory?.executions &&
                        validationHistory.executions.length > 0 && (
                          <HistoryList style={{ marginTop: '20px' }}>
                            {validationHistory.executions.map(
                              (validation, index) => (
                                <HistoryItem key={`validation-${index}`}>
                                  <HistoryAvatarSection>
                                    <Avatar name='Sistema' size={40} />
                                  </HistoryAvatarSection>
                                  <HistoryContent>
                                    <HistoryAction>
                                      <strong>Validação executada:</strong>{' '}
                                      {validation.validation?.message ||
                                        'Validação'}
                                    </HistoryAction>
                                    <HistoryTime>
                                      <MdSchedule size={14} />
                                      {format(
                                        new Date(validation.executedAt),
                                        "dd/MM/yyyy 'às' HH:mm",
                                        { locale: ptBR }
                                      )}
                                    </HistoryTime>
                                  </HistoryContent>
                                </HistoryItem>
                              )
                            )}
                          </HistoryList>
                        )}
                      {actionHistory?.executions &&
                        actionHistory.executions.length > 0 && (
                          <HistoryList style={{ marginTop: '20px' }}>
                            {actionHistory.executions.map((action, index) => (
                              <HistoryItem key={`action-${index}`}>
                                <HistoryAvatarSection>
                                  <Avatar name='Sistema' size={40} />
                                </HistoryAvatarSection>
                                <HistoryContent>
                                  <HistoryAction>
                                    <strong>Ação executada:</strong>{' '}
                                    {action.action?.type || 'Ação'}
                                  </HistoryAction>
                                  <HistoryTime>
                                    <MdSchedule size={14} />
                                    {format(
                                      new Date(action.executedAt),
                                      "dd/MM/yyyy 'às' HH:mm",
                                      { locale: ptBR }
                                    )}
                                  </HistoryTime>
                                </HistoryContent>
                              </HistoryItem>
                            ))}
                          </HistoryList>
                        )}
                    </>
                  )}
                </>
              )}

              {activeTab === 'comments' && (
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
                          disabled={
                            isSubmittingComment || !commentMessage.trim()
                          }
                        >
                          <MdSend size={18} />
                          {isSubmittingComment ? 'Enviando...' : 'Enviar'}
                        </CommentButton>
                      </div>
                    </CommentFooter>
                  </CommentForm>

                  {loadingComments ? (
                    <LoadingHistory>Carregando comentários...</LoadingHistory>
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
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
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
                                  {comment.attachments.map(
                                    (attachment, index) => (
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
                                    )
                                  )}
                                </CommentAttachmentGrid>
                              )}
                          </CommentContent>
                        </CommentCard>
                      ))}
                    </CommentsList>
                  )}
                </CommentsContainer>
              )}

              {activeTab === 'files' && task && (
                <TaskAttachmentsManager
                  taskId={task.id}
                  canEdit={true}
                  onUpdate={async () => {
                    // Recarregar a tarefa para atualizar anexos
                    if (effectiveTeamId) {
                      try {
                        const boardData = await kanbanApi.getBoard(
                          effectiveTeamId,
                          {
                            projectId: task.projectId || undefined,
                          }
                        );
                        const updatedTask = boardData.tasks.find(
                          t => t.id === task.id
                        );
                        if (updatedTask) {
                          setTask(updatedTask);
                        }
                      } catch (error) {
                        console.error('Erro ao recarregar tarefa:', error);
                      }
                    }
                  }}
                />
              )}

              {activeTab === 'transfers' && task?.id && (
                <TransferHistory taskId={task.id} />
              )}

              {activeTab === 'metrics' && task?.id && canViewMetrics() && (
                <TaskMetricsCard taskId={task.id} />
              )}
            </TabContent>
          </MainContent>
        </ContentWrapper>
      </PageContainer>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!task || !handleDeleteTask) return;

          setIsDeletingTask(true);
          try {
            await handleDeleteTask(task.id);
            setIsDeleteModalOpen(false);
            handleBack();
          } catch (error: any) {
            console.error('Erro ao excluir negociação:', error);
            showError('Erro ao excluir negociação. Tente novamente.');
          } finally {
            setIsDeletingTask(false);
          }
        }}
        title='Excluir Negociação'
        message='Tem certeza que deseja excluir esta negociação?'
        itemName={task?.title}
        isLoading={isDeletingTask}
        variant='delete'
        confirmLabel='Excluir Negociação'
        loadingLabel='Excluindo...'
      />

      <TransferTaskModal
        isOpen={isTransferModalOpen}
        taskId={task.id}
        currentProjectId={task.projectId}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={() => {
          setIsTransferModalOpen(false);
          // Toast já é mostrado no modal, não precisa duplicar aqui
        }}
      />
    </Layout>
  );
};

export default TaskDetailsPage;
