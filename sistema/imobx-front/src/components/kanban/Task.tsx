import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdEdit,
  MdDelete,
  MdDragIndicator,
  MdFolder,
  MdPerson,
  MdSchedule,
  MdFlag,
  MdLabel,
  MdAttachMoney,
  MdInfo,
  MdHome,
  MdAttachFile,
  MdComment,
  MdCheckCircle,
  MdCancel,
  MdTrendingUp,
  MdCampaign,
  MdStar,
  MdLocationOn,
} from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { KanbanTask } from '../../types/kanban';
import { TaskDeadlineIndicator } from './TaskDeadlineIndicator';
import { Avatar } from '../common/Avatar';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { Tooltip } from '../ui/Tooltip';
import { formatCurrencyValue } from '../../utils/masks';
import {
  translateClientType,
  translateClientStatus,
  translatePropertyType,
  translatePropertyStatus,
} from '../../utils/translations';

const TaskCard = styled.div<{
  $priority: string;
  $isDragging?: boolean;
  $cardDensity?: string;
  $borderStyle?: 'none' | 'left' | 'top' | 'full';
  $shadow?: 'none' | 'subtle' | 'medium' | 'strong';
  $showPriorityBorder?: boolean;
  $cardBackgroundStyle?: 'solid' | 'gradient' | 'glass';
  $colorRule?: string; // Cor da regra de cor
}>`
  /* Em mobile/tablet, permitir scroll horizontal no card */
  @media (max-width: 1024px) {
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
  }
  /* Configuração de fundo baseada no estilo */
  background: ${props => {
    switch (props.$cardBackgroundStyle) {
      case 'gradient':
        return `linear-gradient(135deg, ${props.theme.colors.cardBackground} 0%, ${props.theme.colors.backgroundSecondary} 100%)`;
      case 'glass':
        return `rgba(255, 255, 255, 0.1)`;
      case 'solid':
      default:
        return props.theme.colors.cardBackground;
    }
  }};

  /* Efeito glass */
  ${props =>
    props.$cardBackgroundStyle === 'glass' &&
    `
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `}

  border: 1px solid ${props => props.theme.colors.border};
  /* Configuração de borda baseada na prioridade ou regra de cor */
  ${props => {
    // Prioridade: regra de cor > prioridade padrão
    const borderColor =
      props.$colorRule ||
      (() => {
        switch (props.$priority) {
          case 'urgent':
            return '#EF4444';
          case 'high':
            return '#F59E0B';
          case 'medium':
            return '#3B82F6';
          case 'low':
            return '#10B981';
          default:
            return props.theme.colors.border;
        }
      })();

    // Se showPriorityBorder está ativo, usa cor da prioridade ou regra
    if (props.$showPriorityBorder !== false) {
      switch (props.$borderStyle) {
        case 'left':
          return `border-left: 4px solid ${borderColor};`;
        case 'top':
          return `border-top: 4px solid ${borderColor};`;
        case 'full':
          return `border: 2px solid ${borderColor};`;
        case 'none':
          return '';
        default:
          return `border-left: 4px solid ${borderColor};`;
      }
    } else {
      // Se showPriorityBorder está desativado, usa borda padrão
      return `border: 1px solid ${props.theme.colors.border};`;
    }
  }}
  border-radius: 8px;
  padding: ${props => {
    switch (props.$cardDensity) {
      case 'compact':
        return '8px';
      case 'comfortable':
        return '14px';
      case 'normal':
      default:
        return '10px';
    }
  }};
  margin-bottom: ${props => {
    switch (props.$cardDensity) {
      case 'compact':
        return '8px';
      case 'comfortable':
        return '12px';
      case 'normal':
      default:
        return '8px';
    }
  }};
  cursor: ${props => (props.$isDragging ? 'grabbing' : 'grab')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Em mobile/tablet, cursor padrão no card (arraste apenas pelo handle) */
  @media (max-width: 1024px) {
    cursor: default;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '8px';
        case 'comfortable':
          return '16px';
        case 'normal':
        default:
          return '11px';
      }
    }};
    margin-bottom: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '6px';
        case 'comfortable':
          return '14px';
        case 'normal':
        default:
          return '9px';
      }
    }};
  }

  @media (max-width: 768px) {
    padding: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '8px';
        case 'comfortable':
          return '14px';
        case 'normal':
        default:
          return '10px';
      }
    }};
    margin-bottom: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '6px';
        case 'comfortable':
          return '12px';
        case 'normal':
        default:
          return '8px';
      }
    }};
  }
  /* Configuração de sombra */
  box-shadow: ${props => {
    if (props.$isDragging) {
      return '0 12px 40px rgba(0, 0, 0, 0.25)';
    }

    switch (props.$shadow) {
      case 'none':
        return 'none';
      case 'subtle':
        return '0 1px 2px rgba(0, 0, 0, 0.05)';
      case 'medium':
        return '0 2px 4px rgba(0, 0, 0, 0.1)';
      case 'strong':
        return '0 4px 8px rgba(0, 0, 0, 0.15)';
      default:
        return '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
  }};
  transform: ${props => (props.$isDragging ? 'scale(0.95)' : 'translateZ(0)')};
  opacity: ${props => (props.$isDragging ? 0.3 : 1)};
  position: relative;
  overflow: visible;
  z-index: 1;
  will-change: transform, z-index;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  min-height: ${props => {
    switch (props.$cardDensity) {
      case 'compact':
        return '120px';
      case 'comfortable':
        return '200px';
      case 'normal':
      default:
        return '160px';
    }
  }};
  max-height: none;
  height: auto;
  display: flex;
  flex-direction: column;

  /* Tablet: ajustes menores */
  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '130px';
        case 'comfortable':
          return '240px';
        case 'normal':
        default:
          return '180px';
      }
    }};
  }

  /* Mobile: cards mais compactos */
  @media (max-width: 768px) {
    min-height: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '120px';
        case 'comfortable':
          return '220px';
        case 'normal':
        default:
          return '160px';
      }
    }};
  }

  /* Efeitos de hover */
  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    border-color: ${props => props.theme.colors.primary}40;
  }

  /* Efeito de gradiente sutil - usar cor da regra se existir, senão usar cor da prioridade */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => {
      // Se tiver cor da regra, usar ela
      if (props.$colorRule) {
        return props.$colorRule;
      }
      // Senão, usar gradiente da prioridade
      const gradient = (() => {
        switch (props.$priority) {
          case 'urgent':
            return 'linear-gradient(90deg, #EF4444, #F59E0B)';
          case 'high':
            return 'linear-gradient(90deg, #F59E0B, #EF4444)';
          case 'medium':
            return 'linear-gradient(90deg, #3B82F6, #60A5FA)';
          case 'low':
            return 'linear-gradient(90deg, #10B981, #34D399)';
          default:
            return 'transparent';
        }
      })();
      return gradient;
    }};
    opacity: ${props => (props.$colorRule ? 1 : 0.6)};
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px) scale(1.01);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
  min-height: 28px;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-bottom: 6px;
    min-height: 24px;
    gap: 4px;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #ef4444;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  pointer-events: none;
  z-index: 100;

  ${TaskCard}:hover & {
    opacity: 1;
    pointer-events: all;
  }

  &:hover {
    background: #fee2e2;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: grab;
  position: relative;
  z-index: 10;
  touch-action: none; /* Prevenir scroll quando tocar no handle */
  -webkit-tap-highlight-color: transparent;

  /* Handle sempre visível e interativo */
  pointer-events: all;
  cursor: grab;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  margin-left: 4px;

  &:active {
    cursor: grabbing;
    opacity: 0.7;
    background: ${props => props.theme.colors.primary}20;
    border-color: ${props => props.theme.colors.primary};
    transform: scale(0.95);
  }

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 768px) {
    min-width: 44px;
    min-height: 44px;
  }
`;

const TaskTitle = styled.h4<{ $titleLines?: number; $cardDensity?: string }>`
  font-size: ${props => {
    switch (props.$cardDensity) {
      case 'compact':
        return '0.8rem';
      case 'comfortable':
        return '0.95rem';
      default:
        return '0.875rem';
    }
  }};

  @media (max-width: 768px) {
    font-size: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '0.75rem';
        case 'comfortable':
          return '0.85rem';
        default:
          return '0.8rem';
      }
    }};
  }
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.3;
  flex: 1;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.$titleLines || 2};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: auto;
  word-break: break-word;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TaskCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 32px;
  min-height: 32px;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 768px) {
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
  }
`;

const AiInsightBadge = styled.span<{ $priority: 'high' | 'medium' | 'low' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 6px;
  width: fit-content;
  ${props => {
    const colors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
    const c = colors[props.$priority];
    return `background: ${c}22; color: ${c}; border: 1px solid ${c}44;`;
  }}
`;

const TaskDescription = styled.p<{
  $descriptionLines?: number;
  $cardDensity?: string;
}>`
  font-size: ${props => {
    switch (props.$cardDensity) {
      case 'compact':
        return '0.7rem';
      case 'comfortable':
        return '0.85rem';
      default:
        return '0.8rem';
    }
  }};

  @media (max-width: 768px) {
    font-size: ${props => {
      switch (props.$cardDensity) {
        case 'compact':
          return '0.65rem';
        case 'comfortable':
          return '0.75rem';
        default:
          return '0.7rem';
      }
    }};
  }
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-wrap: break-word;
  display: block;
  overflow: visible;
  hyphens: auto;
  flex: 0 0 auto;
  min-height: 0;
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: ${props => {
    switch (props.$cardDensity) {
      case 'compact':
        return '6px 8px';
      case 'comfortable':
        return '12px 14px';
      default:
        return '8px 10px';
    }
  }};
  border-radius: 6px;
  border-left: 3px solid ${props => props.theme.colors.primary};
  margin-left: -2px;
  margin-right: -2px;
  word-break: break-word;
  white-space: pre-wrap;
`;

const TaskFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  flex-shrink: 0;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 28px;
  margin-top: 0;

  @media (max-width: 768px) {
    gap: 6px;
    min-height: 24px;
  }
`;

const TaskMetaLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const TaskAssigneeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const InvolvedUsersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
  margin-top: 2px;
`;

const InvolvedAvatar = styled.div<{ $isCount?: boolean }>`
  margin-left: -8px;
  border: 2px solid ${props => props.theme.colors.cardBackground};
  border-radius: 50%;
  transition: transform 0.2s ease;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }

  ${props =>
    props.$isCount &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: ${props.theme.colors.primary};
    color: white;
    font-size: 0.65rem;
    font-weight: 600;
  `}
`;

const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  flex: 1;
  min-width: 0;
  padding: 5px 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.7rem;
    padding: 4px 7px;
    gap: 6px;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 4px 6px;
    gap: 6px;
  }
`;

const AssigneeName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const TaskTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
  min-height: 28px;
  align-items: center;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 6px;
    margin-top: 6px;
    min-height: 24px;
  }

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 6px;
    min-height: 24px;
  }
`;

const TaskDeadlineSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    margin-top: 6px;
    padding-top: 4px;
  }
`;

const TaskTag = styled.span`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15,
    ${props => props.theme.colors.primary}25
  );
  color: ${props => props.theme.colors.primary};
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.primary}30;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;
  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.68rem;
    padding: 3px 8px;
    max-width: 90px;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 8px;
    max-width: 80px;
  }

  &::before {
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
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary}25,
      ${props => props.theme.colors.primary}35
    );
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}30;
    border-color: ${props => props.theme.colors.primary}50;

    &::before {
      left: 100%;
    }
  }
`;

const ProjectBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 3px;
  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.63rem;
    padding: 2px 5px;
    max-width: 90px;
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 2px 5px;
    max-width: 80px;
  }
`;

const ClientBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 3px;
  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.63rem;
    padding: 2px 5px;
    max-width: 90px;
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 2px 5px;
    max-width: 80px;
  }
`;

const PropertyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 3px;
  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.63rem;
    padding: 2px 5px;
    max-width: 90px;
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 2px 5px;
    max-width: 80px;
  }
`;

const PriorityFlag = styled.div<{ priority: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.priority) {
      case 'urgent':
        return 'linear-gradient(135deg, #EF4444, #DC2626)';
      case 'high':
        return 'linear-gradient(135deg, #F59E0B, #D97706)';
      case 'medium':
        return 'linear-gradient(135deg, #3B82F6, #2563EB)';
      case 'low':
        return 'linear-gradient(135deg, #10B981, #059669)';
      default:
        return props.theme.colors.border;
    }
  }};
  border: 2px solid ${props => props.theme.colors.cardBackground};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const TaskInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 6px;
    padding-top: 6px;
  }
`;

const InfoBadge = styled.div<{
  $variant?: 'value' | 'result' | 'campaign' | 'qualification' | 'source';
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$variant) {
      case 'value':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25))';
      case 'result':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25))';
      case 'campaign':
        return 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.25))';
      case 'qualification':
        return 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.25))';
      case 'source':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25))';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'value':
        return '#10B981';
      case 'result':
        return '#10B981';
      case 'campaign':
        return '#8B5CF6';
      case 'qualification':
        return '#F59E0B';
      case 'source':
        return '#3B82F6';
      default:
        return props.theme.colors.text;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$variant) {
        case 'value':
          return 'rgba(16, 185, 129, 0.3)';
        case 'result':
          return 'rgba(16, 185, 129, 0.3)';
        case 'campaign':
          return 'rgba(139, 92, 246, 0.3)';
        case 'qualification':
          return 'rgba(245, 158, 11, 0.3)';
        case 'source':
          return 'rgba(59, 130, 246, 0.3)';
        default:
          return props.theme.colors.border;
      }
    }};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    gap: 3px;
  }
`;

const ResultBadge = styled.div<{ $result: 'won' | 'lost' | 'open' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props => {
    if (props.$result === 'won')
      return 'linear-gradient(135deg, #10B981, #059669)';
    if (props.$result === 'lost')
      return 'linear-gradient(135deg, #EF4444, #DC2626)';
    return props.theme.colors.backgroundSecondary;
  }};
  color: ${props =>
    props.$result === 'open' ? props.theme.colors.textSecondary : 'white'};
  border: 1px solid
    ${props => {
      if (props.$result === 'won') return 'rgba(16, 185, 129, 0.3)';
      if (props.$result === 'lost') return 'rgba(239, 68, 68, 0.3)';
      return props.theme.colors.border;
    }};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    gap: 3px;
  }
`;

const CountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    gap: 3px;
  }
`;

const SubtasksProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    gap: 4px;
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 40px;
  height: 4px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: ${props => {
      if (props.$progress === 100) return '#10B981';
      if (props.$progress >= 50) return '#3B82F6';
      return '#F59E0B';
    }};
    transition: width 0.3s ease;
  }
`;

/** Insight IA: prioridade e sugestão de próxima ação */
export type TaskInsight = {
  aiPriority: 'high' | 'medium' | 'low';
  nextActionSuggestion: string;
  daysSinceUpdate?: number;
};

interface TaskProps {
  task: KanbanTask;
  onEdit?: (task: KanbanTask) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (task: KanbanTask) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canMove?: boolean;
  viewSettings?: any;
  settings?: any;
  taskInsight?: TaskInsight | null;
}

export const Task: React.FC<TaskProps> = ({
  task,
  onEdit,
  onDelete,
  onClick,
  canEdit = false,
  canDelete = false,
  canMove = false,
  viewSettings,
  settings,
  taskInsight,
}) => {
  // console.log('🎯 Task - showAssigneeAvatars:', viewSettings?.showAssigneeAvatars);
  // console.log('🎯 Task - showDueDateIndicators:', settings?.showDueDateIndicators);
  // console.log('🎯 Task - showPriorityIndicators:', settings?.showPriorityIndicators);
  // console.log('🎯 Task - showTaskDescription:', settings?.showTaskDescription);
  // console.log('🎯 Task - showTaskTags:', settings?.showTaskTags);
  // console.log('🎯 Task - cardTitleLines:', settings?.cardTitleLines);
  // console.log('🎯 Task - cardDescriptionLines:', settings?.cardDescriptionLines);
  // console.log('🎯 Task - cardBorderStyle:', settings?.cardBorderStyle);
  // console.log('🎯 Task - cardShadow:', settings?.cardShadow);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      disabled: !canMove,
    });

  // Em desktop: aplicar listeners no card inteiro para drag
  // Em mobile: apenas no handle
  const isMobileOrTablet =
    typeof window !== 'undefined' && window.innerWidth <= 1024;

  const handleListeners = isMobileOrTablet && canMove ? listeners : undefined;
  const handleAttributes = isMobileOrTablet && canMove ? attributes : undefined;

  // Em desktop, aplicar listeners no card inteiro; em mobile, apenas no handle
  const cardListeners = !isMobileOrTablet && canMove ? listeners : undefined;
  const cardAttributes = !isMobileOrTablet && canMove ? attributes : undefined;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? 'opacity 0.2s ease'
      : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
    opacity: isDragging ? 0.5 : 1,
  };

  const hasDraggedRef = useRef(false);
  const mouseDownTimeRef = useRef<number | null>(null);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);

  // Detectar quando o drag começa
  useEffect(() => {
    if (isDragging) {
      hasDraggedRef.current = true;
    }
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Guardar posição e tempo do mouseDown
    mouseDownTimeRef.current = Date.now();
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevenir clique se estiver arrastando
    if (isDragging) {
      return;
    }

    // Se não pode mover, sempre permitir clique
    if (!canMove) {
      e.stopPropagation();
      if (onClick) {
        onClick(task);
      }
      return;
    }

    // Verificar se houve movimento significativo
    if (mouseDownPosRef.current && mouseDownTimeRef.current) {
      const deltaX = Math.abs(e.clientX - mouseDownPosRef.current.x);
      const deltaY = Math.abs(e.clientY - mouseDownPosRef.current.y);
      const deltaTime = Date.now() - mouseDownTimeRef.current;

      // Se moveu mais de 8px ou passou muito tempo, foi um drag
      if (
        deltaX > 8 ||
        deltaY > 8 ||
        deltaTime > 300 ||
        hasDraggedRef.current
      ) {
        mouseDownPosRef.current = null;
        mouseDownTimeRef.current = null;
        hasDraggedRef.current = false;
        return;
      }
    }

    // Foi um clique simples
    e.stopPropagation();
    mouseDownPosRef.current = null;
    mouseDownTimeRef.current = null;
    hasDraggedRef.current = false;

    if (onClick) {
      onClick(task);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && canEdit) {
      onEdit(task);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete && canDelete) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Erro ao deletar negociação:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Verificar se deve mostrar tarefas concluídas
  const shouldShowTask = () => {
    // Se a negociação está concluída e showCompletedTasks está desativado, não mostrar
    if (task.isCompleted && viewSettings?.showCompletedTasks === false) {
      return false;
    }
    return true;
  };

  if (!shouldShowTask()) {
    return null;
  }

  // Labels de prioridade
  const priorityLabels: { [key: string]: string } = {
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  };

  // Função para gerar conteúdo do tooltip
  const getTooltipContent = useMemo(() => {
    const parts: string[] = [];

    // Título completo
    parts.push(`📋 ${task.title}`);

    // Descrição completa (se existir)
    if (task.description) {
      parts.push(`\n📝 ${task.description}`);
    }

    // Cliente
    if (task.client) {
      parts.push(`\n👤 Cliente: ${task.client.name}`);
      if (task.client.email) parts.push(`   Email: ${task.client.email}`);
      if (task.client.phone) parts.push(`   Telefone: ${task.client.phone}`);
      if (task.client.whatsapp && task.client.whatsapp !== task.client.phone)
        parts.push(`   WhatsApp: ${task.client.whatsapp}`);
      if (task.client.secondaryPhone)
        parts.push(`   Telefone Secundário: ${task.client.secondaryPhone}`);
      if (task.client.cpf) parts.push(`   CPF: ${task.client.cpf}`);
      if (task.client.type)
        parts.push(`   Tipo: ${translateClientType(task.client.type)}`);
      if (task.client.status)
        parts.push(`   Status: ${translateClientStatus(task.client.status)}`);
      if (task.client.city) parts.push(`   Cidade: ${task.client.city}`);
      if (task.client.responsibleUserName)
        parts.push(`   Responsável: ${task.client.responsibleUserName}`);
    }

    // Imóvel
    if (task.property) {
      parts.push(`\n🏠 Imóvel: ${task.property.title}`);
      if (task.property.code) parts.push(`   Código: ${task.property.code}`);
      if (task.property.address)
        parts.push(`   Endereço: ${task.property.address}`);
      if (task.property.city && task.property.state)
        parts.push(
          `   Localização: ${task.property.city}/${task.property.state}`
        );
      if (task.property.neighborhood)
        parts.push(`   Bairro: ${task.property.neighborhood}`);
      if (task.property.type)
        parts.push(`   Tipo: ${translatePropertyType(task.property.type)}`);
      if (task.property.status)
        parts.push(
          `   Status: ${translatePropertyStatus(task.property.status)}`
        );
      if (task.property.salePrice)
        parts.push(
          `   Preço de Venda: R$ ${task.property.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        );
      if (task.property.rentPrice)
        parts.push(
          `   Preço de Aluguel: R$ ${task.property.rentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        );
      if (task.property.bedrooms)
        parts.push(`   Quartos: ${task.property.bedrooms}`);
      if (task.property.bathrooms)
        parts.push(`   Banheiros: ${task.property.bathrooms}`);
      if (task.property.parkingSpaces)
        parts.push(`   Vagas: ${task.property.parkingSpaces}`);
      if (task.property.totalArea)
        parts.push(`   Área Total: ${task.property.totalArea}m²`);
      if (task.property.builtArea)
        parts.push(`   Área Construída: ${task.property.builtArea}m²`);
      if (task.property.responsibleUserName)
        parts.push(`   Responsável: ${task.property.responsibleUserName}`);
    }

    // Responsável
    if (task.assignedTo) {
      parts.push(`\n👤 Responsável: ${task.assignedTo.name}`);
    }

    // Pessoas envolvidas
    if (task.involvedUsers && task.involvedUsers.length > 0) {
      const involvedNames = task.involvedUsers.map(u => u.name).join(', ');
      parts.push(
        `\n👥 Envolvidos (${task.involvedUsers.length}): ${involvedNames}`
      );
    }

    // Prioridade
    const priorityEmoji = {
      urgent: '🔴',
      high: '🟠',
      medium: '🔵',
      low: '🟢',
    };
    const priority = task.priority || 'low';
    parts.push(
      `\n${priorityEmoji[priority as keyof typeof priorityEmoji] || '🟢'} Prioridade: ${priorityLabels[priority] || 'Baixa'}`
    );

    // Prazo
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const formattedDate = format(dueDate, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
      const isOverdue = dueDate < new Date();
      parts.push(`\n${isOverdue ? '⚠️' : '📅'} Prazo: ${formattedDate}`);
    }

    // Funil
    if (task.project) {
      parts.push(`\n📁 Funil: ${task.project.name}`);
    }

    // Tags
    if (task.tags && task.tags.length > 0) {
      parts.push(`\n🏷️ Tags: ${task.tags.join(', ')}`);
    }

    // Valor (se houver)
    if (task.totalValue) {
      parts.push(`\n💰 Valor: ${formatCurrencyValue(task.totalValue)}`);
    }

    // Origem
    if (task.source) {
      parts.push(`\n📍 Origem: ${task.source}`);
    }

    // Campanha
    if (task.campaign && task.campaign !== 'V') {
      parts.push(`\n📢 Campanha: ${task.campaign}`);
    }

    // Qualificação
    if (task.qualification) {
      parts.push(`\n⭐ Qualificação: ${task.qualification}`);
    }

    // Previsão de fechamento
    if (task.closingForecast) {
      const forecastDate = new Date(task.closingForecast);
      const formattedForecast = format(forecastDate, 'dd/MM/yyyy', {
        locale: ptBR,
      });
      parts.push(`\n📊 Previsão: ${formattedForecast}`);
    }

    // Resultado
    if (task.result) {
      const resultLabel = task.result === 'won' ? '✅ Ganha' : '❌ Perdida';
      parts.push(`\n${resultLabel}`);
      if (task.resultDate) {
        const resultDate = new Date(task.resultDate);
        const formattedResult = format(resultDate, 'dd/MM/yyyy', {
          locale: ptBR,
        });
        parts.push(` em ${formattedResult}`);
      }
    }

    // Data de criação
    if (task.createdAt) {
      const createdDate = new Date(task.createdAt);
      const formattedCreated = format(createdDate, 'dd/MM/yyyy', {
        locale: ptBR,
      });
      parts.push(`\n🕐 Criada em: ${formattedCreated}`);
    }

    return parts.join('');
  }, [task]);

  return (
    <>
      <TaskCard
        ref={setNodeRef}
        style={style}
        $priority={task.priority || 'low'}
        $isDragging={isDragging}
        $cardDensity={viewSettings?.cardDensity || 'normal'}
        $borderStyle={settings?.cardBorderStyle || 'left'}
        $shadow={settings?.cardShadow || 'medium'}
        $showPriorityBorder={viewSettings?.showPriorityBorder !== false}
        $cardBackgroundStyle={settings?.cardBackgroundStyle || 'solid'}
        $colorRule={task.color} // Aplicar cor da regra de cor se disponível
        data-card-density={viewSettings?.cardDensity || 'normal'}
        className='task-card'
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        title={getTooltipContent}
        {...(cardListeners || {})}
        {...(cardAttributes || {})}
      >
        <TaskHeader>
          <TaskTitle
            $titleLines={settings?.cardTitleLines}
            $cardDensity={viewSettings?.cardDensity}
          >
            {task.title}
          </TaskTitle>

          <TaskActions>
            {canDelete && (
              <DeleteButton
                onClick={handleDeleteClick}
                title='Excluir negociação'
              >
                <MdDelete size={16} />
              </DeleteButton>
            )}
            {canMove && (
              <DragHandle
                {...(handleListeners || {})}
                {...(handleAttributes || {})}
                onClick={e => {
                  // Sempre prevenir que o click no handle abra a página de detalhes
                  e.stopPropagation();
                }}
                onTouchStart={e => {
                  // Prevenir que o touch no handle abra a página de detalhes
                  e.stopPropagation();
                }}
                title='Arrastar negociação'
              >
                <MdDragIndicator size={16} />
              </DragHandle>
            )}
            {canEdit && (
              <ActionButton onClick={handleEdit} title='Editar negociação'>
                <MdEdit size={14} />
              </ActionButton>
            )}
          </TaskActions>
        </TaskHeader>

        {taskInsight && (
          <AiInsightBadge
            $priority={taskInsight.aiPriority}
            title={
              taskInsight.nextActionSuggestion +
              (taskInsight.daysSinceUpdate != null &&
              taskInsight.daysSinceUpdate > 0
                ? ` · ${taskInsight.daysSinceUpdate}d sem atualização`
                : '')
            }
          >
            {taskInsight.aiPriority === 'high'
              ? 'Alta prioridade'
              : taskInsight.aiPriority === 'medium'
                ? 'Follow-up'
                : 'IA'}
            {taskInsight.daysSinceUpdate != null &&
              taskInsight.daysSinceUpdate > 0 &&
              ` · ${taskInsight.daysSinceUpdate}d`}
          </AiInsightBadge>
        )}

        {task.description &&
          (settings?.showTaskDescription === true ||
            settings?.showTaskDescription === undefined) && (
            <TaskDescription
              $descriptionLines={settings?.cardDescriptionLines}
              $cardDensity={viewSettings?.cardDensity}
            >
              {task.description.length > 120
                ? `${task.description.substring(0, 120).trim()}...`
                : task.description}
            </TaskDescription>
          )}

        <TaskFooter>
          <TaskMeta>
            <TaskMetaLeft>
              <TaskAssigneeRow>
                {/* Mostrar responsável apenas se configurado */}
                {(viewSettings?.showAssigneeAvatars === true ||
                  viewSettings?.showAssigneeAvatars === undefined) &&
                  (task.assignedTo ? (
                    <Tooltip
                      content={`Responsável: ${task.assignedTo.name}${task.assignedTo.email ? `\nEmail: ${task.assignedTo.email}` : ''}`}
                      placement='top'
                      delay={300}
                    >
                      <TaskAssignee>
                        <Avatar
                          name={task.assignedTo.name}
                          image={task.assignedTo.avatar}
                          size={20}
                        />
                        <AssigneeName>{task.assignedTo.name}</AssigneeName>
                      </TaskAssignee>
                    </Tooltip>
                  ) : null)}

                {/* Mostrar prioridade apenas se configurado */}
                {(settings?.showPriorityIndicators === true ||
                  settings?.showPriorityIndicators === undefined) && (
                  <Tooltip
                    content={`Prioridade: ${priorityLabels[task.priority || 'low'] || 'Baixa'}`}
                    placement='top'
                    delay={300}
                  >
                    <PriorityFlag priority={task.priority || 'low'} />
                  </Tooltip>
                )}
              </TaskAssigneeRow>

              {/* Mostrar pessoas envolvidas abaixo do responsável, sobrepostas */}
              {(() => {
                const hasInvolvedUsers =
                  task.involvedUsers && task.involvedUsers.length > 0;
                if (hasInvolvedUsers) {
                  console.log('👥 Task - Renderizando pessoas envolvidas:', {
                    taskId: task.id,
                    taskTitle: task.title,
                    involvedUsers: task.involvedUsers,
                    count: task.involvedUsers.length,
                  });
                }
                return hasInvolvedUsers ? (
                  <InvolvedUsersContainer>
                    {task.involvedUsers!.slice(0, 4).map((user, index) => (
                      <Tooltip
                        key={user.id}
                        content={`${user.name}${user.email ? `\n${user.email}` : ''}`}
                        placement='top'
                        delay={300}
                      >
                        <InvolvedAvatar style={{ zIndex: 10 - index }}>
                          <Avatar
                            name={user.name}
                            image={user.avatar}
                            size={20}
                            title={user.name}
                          />
                        </InvolvedAvatar>
                      </Tooltip>
                    ))}
                    {task.involvedUsers!.length > 4 && (
                      <Tooltip
                        content={`${task
                          .involvedUsers!.slice(4)
                          .map(u => u.name)
                          .join(', ')}`}
                        placement='top'
                        delay={300}
                      >
                        <InvolvedAvatar $isCount={true} style={{ zIndex: 1 }}>
                          +{task.involvedUsers!.length - 4}
                        </InvolvedAvatar>
                      </Tooltip>
                    )}
                  </InvolvedUsersContainer>
                ) : null;
              })()}
            </TaskMetaLeft>
          </TaskMeta>

          {task.tags &&
            task.tags.length > 0 &&
            (settings?.showTaskTags === true ||
              settings?.showTaskTags === undefined) && (
              <TaskTags>
                {task.tags.slice(0, 3).map((tag, index) => (
                  <TaskTag key={index} title={tag}>
                    {tag}
                  </TaskTag>
                ))}
                {task.tags.length > 3 && (
                  <TaskTag title={`${task.tags.length - 3} tags adicionais`}>
                    +{task.tags.length - 3}
                  </TaskTag>
                )}
              </TaskTags>
            )}

          {/* Badge do projeto */}
          {task.project && (
            <ProjectBadge title={task.project.name}>
              <MdFolder size={12} />
              {task.project.name}
            </ProjectBadge>
          )}

          {/* Badge do cliente */}
          {task.client && (
            <ClientBadge
              title={(() => {
                const parts = [`Cliente: ${task.client.name}`];
                if (task.client.email)
                  parts.push(`Email: ${task.client.email}`);
                if (task.client.phone)
                  parts.push(`Telefone: ${task.client.phone}`);
                if (
                  task.client.whatsapp &&
                  task.client.whatsapp !== task.client.phone
                )
                  parts.push(`WhatsApp: ${task.client.whatsapp}`);
                if (task.client.cpf) parts.push(`CPF: ${task.client.cpf}`);
                if (task.client.city) parts.push(`Cidade: ${task.client.city}`);
                if (task.client.type)
                  parts.push(`Tipo: ${translateClientType(task.client.type)}`);
                if (task.client.status)
                  parts.push(
                    `Status: ${translateClientStatus(task.client.status)}`
                  );
                return parts.join(' | ');
              })()}
            >
              <MdPerson size={12} />
              {task.client.name}
            </ClientBadge>
          )}

          {/* Badge do imóvel */}
          {task.property && (
            <PropertyBadge
              title={(() => {
                const parts = [`Imóvel: ${task.property.title}`];
                if (task.property.code)
                  parts.push(`Código: ${task.property.code}`);
                if (task.property.address)
                  parts.push(`Endereço: ${task.property.address}`);
                if (task.property.city && task.property.state)
                  parts.push(
                    `Localização: ${task.property.city}/${task.property.state}`
                  );
                if (task.property.salePrice)
                  parts.push(
                    `Venda: R$ ${task.property.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  );
                if (task.property.rentPrice)
                  parts.push(
                    `Aluguel: R$ ${task.property.rentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  );
                if (task.property.type)
                  parts.push(
                    `Tipo: ${translatePropertyType(task.property.type)}`
                  );
                if (task.property.status)
                  parts.push(
                    `Status: ${translatePropertyStatus(task.property.status)}`
                  );
                return parts.join(' | ');
              })()}
            >
              <MdHome size={12} />
              {task.property.title}
            </PropertyBadge>
          )}

          {/* Informações adicionais: Valor, Resultado, Anexos, Comentários, Subtarefas */}
          {(() => {
            const hasValue = task.totalValue && task.totalValue > 0;
            const hasResult = task.result && task.result !== 'open';
            const hasAttachments =
              (task.attachmentsCount !== undefined &&
                task.attachmentsCount > 0) ||
              (task.attachments && task.attachments.length > 0);
            const hasComments =
              (task.commentsCount !== undefined && task.commentsCount > 0) ||
              (task.comments && task.comments.length > 0);
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const hasCampaign = task.campaign && task.campaign.trim() !== '';
            const hasQualification =
              task.qualification && task.qualification.trim() !== '';
            const hasSource = task.source && task.source.trim() !== '';
            const hasLastActivity = !!task.lastActivityAt;
            const hasContacts =
              task.contactSnapshot && task.contactSnapshot.length > 0;

            // Só renderizar a linha se houver pelo menos uma informação
            if (
              !hasValue &&
              !hasResult &&
              !hasAttachments &&
              !hasComments &&
              !hasSubtasks &&
              !hasCampaign &&
              !hasQualification &&
              !hasSource &&
              !hasLastActivity &&
              !hasContacts
            ) {
              return null;
            }

            return (
              <TaskInfoRow>
                {/* Valor da negociação */}
                {hasValue && (
                  <InfoBadge
                    $variant='value'
                    title={`Valor da negociação: ${formatCurrencyValue(task.totalValue!)}`}
                  >
                    <MdAttachMoney size={14} />
                    {formatCurrencyValue(task.totalValue!)}
                  </InfoBadge>
                )}

                {/* Resultado */}
                {hasResult && (
                  <ResultBadge
                    $result={task.result as 'won' | 'lost'}
                    title={
                      task.result === 'won'
                        ? 'Negociação ganha'
                        : 'Negociação perdida'
                    }
                  >
                    {task.result === 'won' ? (
                      <MdCheckCircle size={14} />
                    ) : (
                      <MdCancel size={14} />
                    )}
                    {task.result === 'won' ? 'Ganha' : 'Perdida'}
                  </ResultBadge>
                )}

                {/* Contagem de anexos */}
                {hasAttachments && (
                  <CountBadge
                    title={`${task.attachmentsCount || task.attachments?.length || 0} arquivo(s) anexado(s)`}
                  >
                    <MdAttachFile size={14} />
                    {task.attachmentsCount || task.attachments?.length || 0}
                  </CountBadge>
                )}

                {/* Contagem de comentários */}
                {hasComments && (
                  <CountBadge
                    title={`${task.commentsCount || task.comments?.length || 0} comentário(s)`}
                  >
                    <MdComment size={14} />
                    {task.commentsCount || task.comments?.length || 0}
                  </CountBadge>
                )}

                {/* Progresso de subtarefas */}
                {hasSubtasks && (
                  <SubtasksProgress
                    title={`${task.subtasks!.filter(st => st.isCompleted).length} de ${task.subtasks!.length} subtarefas concluídas`}
                  >
                    <MdCheckCircle size={14} />
                    <span>
                      {task.subtasks!.filter(st => st.isCompleted).length}/
                      {task.subtasks!.length}
                    </span>
                    <ProgressBar
                      $progress={Math.round(
                        (task.subtasks!.filter(st => st.isCompleted).length /
                          task.subtasks!.length) *
                          100
                      )}
                    />
                  </SubtasksProgress>
                )}

                {/* Campanha */}
                {hasCampaign && (
                  <InfoBadge
                    $variant='campaign'
                    title={`Campanha: ${task.campaign}`}
                  >
                    <MdCampaign size={14} />
                    {task.campaign}
                  </InfoBadge>
                )}

                {/* Qualificação */}
                {hasQualification && (
                  <InfoBadge
                    $variant='qualification'
                    title={`Qualificação: ${task.qualification}`}
                  >
                    <MdStar size={14} />
                    {task.qualification}
                  </InfoBadge>
                )}

                {/* Origem */}
                {hasSource && (
                  <InfoBadge $variant='source' title={`Origem: ${task.source}`}>
                    <MdLocationOn size={14} />
                    {task.source}
                  </InfoBadge>
                )}

                {/* Última atividade (dados da origem) */}
                {hasLastActivity && task.lastActivityAt && (
                  <InfoBadge
                    $variant='source'
                    title={`Última atividade: ${format(new Date(task.lastActivityAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
                  >
                    <MdSchedule size={14} />
                    {formatDistanceToNow(new Date(task.lastActivityAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </InfoBadge>
                )}

                {/* Contatos da origem */}
                {hasContacts && (
                  <InfoBadge
                    $variant='campaign'
                    title={`${task.contactSnapshot!.length} contato(s) da origem`}
                  >
                    <MdPerson size={14} />
                    {task.contactSnapshot!.length} contato(s)
                  </InfoBadge>
                )}
              </TaskInfoRow>
            );
          })()}

          {/* Indicador de prazo no final do card */}
          {(settings?.showDueDateIndicators === true ||
            settings?.showDueDateIndicators === undefined) &&
            task.dueDate && (
              <TaskDeadlineSection>
                <TaskDeadlineIndicator task={task} />
              </TaskDeadlineSection>
            )}
        </TaskFooter>
      </TaskCard>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title='Excluir Negociação'
        message='Esta negociação será excluída permanentemente e não poderá ser recuperada.'
        itemName={task.title}
        isLoading={isDeleting}
      />
    </>
  );
};
