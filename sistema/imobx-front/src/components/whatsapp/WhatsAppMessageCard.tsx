import React from 'react';
import styled from 'styled-components';
import {
  MdCheckCircle,
  MdSchedule,
  MdImage,
  MdVideoLibrary,
  MdInsertDriveFile,
  MdLocationOn,
  MdPerson,
  MdChat,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { PermissionRoute } from '../PermissionRoute';
import type { WhatsAppMessage } from '../../types/whatsapp';
import {
  formatPhoneDisplay,
  formatMessageTime,
} from '../../utils/whatsappUtils';
import type { TimeStatus } from '../../types/whatsapp';

const MessageCard = styled.div<{
  $isUnread?: boolean;
  $isSelected?: boolean;
  $timeStatus?: TimeStatus | null;
}>`
  background: ${props => {
    if (props.$isSelected) {
      return props.theme.mode === 'dark'
        ? `linear-gradient(135deg, ${props.theme.colors.primary}15 0%, ${props.theme.colors.primary}08 100%)`
        : props.theme.colors.primary + '10';
    }

    // Aplicar cores baseadas no status de tempo
    if (props.$timeStatus === 'critical') {
      return props.theme.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)'
        : 'rgba(239, 68, 68, 0.08)';
    }
    if (props.$timeStatus === 'delayed') {
      return props.theme.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)'
        : 'rgba(245, 158, 11, 0.08)';
    }
    if (props.$timeStatus === 'on_time') {
      return props.theme.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.05) 100%)'
        : 'rgba(16, 185, 129, 0.08)';
    }

    return props.theme.colors.cardBackground;
  }};
  border: ${props => {
    if (props.$isSelected) {
      return `2px solid ${props.theme.colors.primary}`;
    }

    // Aplicar bordas coloridas baseadas no status de tempo
    if (props.$timeStatus === 'critical') {
      return `1px solid ${props.theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`;
    }
    if (props.$timeStatus === 'delayed') {
      return `1px solid ${props.theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`;
    }
    if (props.$timeStatus === 'on_time') {
      return `1px solid ${props.theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`;
    }

    return `1px solid ${props.theme.colors.border}`;
  }};
  border-radius: 16px;
  padding: 20px 24px;
  margin: 0 12px 12px 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: ${props => {
    if (props.$isSelected) {
      return props.theme.mode === 'dark'
        ? `0 4px 16px ${props.theme.colors.primary}40`
        : `0 4px 12px ${props.theme.colors.primary}25`;
    }

    // Aplicar sombras coloridas baseadas no status de tempo
    if (props.$timeStatus === 'critical') {
      return props.theme.mode === 'dark'
        ? '0 2px 8px rgba(239, 68, 68, 0.2)'
        : '0 2px 8px rgba(239, 68, 68, 0.15)';
    }
    if (props.$timeStatus === 'delayed') {
      return props.theme.mode === 'dark'
        ? '0 2px 8px rgba(245, 158, 11, 0.2)'
        : '0 2px 8px rgba(245, 158, 11, 0.15)';
    }
    if (props.$timeStatus === 'on_time') {
      return props.theme.mode === 'dark'
        ? '0 2px 8px rgba(16, 185, 129, 0.15)'
        : '0 2px 8px rgba(16, 185, 129, 0.1)';
    }

    return '0 2px 8px rgba(0, 0, 0, 0.04)';
  }};

  ${props =>
    props.$isUnread &&
    !props.$isSelected &&
    !props.$timeStatus &&
    `
    background: ${
      props.theme.mode === 'dark'
        ? `linear-gradient(135deg, ${props.theme.colors.primary}12 0%, ${props.theme.colors.primary}05 100%)`
        : props.theme.colors.primary + '08'
    };
    box-shadow: 0 2px 8px ${props.theme.colors.primary}15;
  `}

  ${props =>
    props.$isSelected &&
    `
    border-left: 4px solid ${props.theme.colors.primary};
    transform: translateX(-2px);
  `}
  
  ${props =>
    props.$timeStatus &&
    !props.$isSelected &&
    `
    border-left: 3px solid ${
      props.$timeStatus === 'critical'
        ? props.theme.mode === 'dark'
          ? 'rgba(239, 68, 68, 0.6)'
          : '#EF4444'
        : props.$timeStatus === 'delayed'
          ? props.theme.mode === 'dark'
            ? 'rgba(245, 158, 11, 0.6)'
            : '#F59E0B'
          : props.$timeStatus === 'on_time'
            ? props.theme.mode === 'dark'
              ? 'rgba(16, 185, 129, 0.6)'
              : '#10B981'
            : props.theme.colors.border
    };
  `}

  &:hover {
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 6px 20px rgba(0, 0, 0, 0.3)'
        : '0 6px 20px rgba(0, 0, 0, 0.12)'};
    transform: ${props =>
      props.$isSelected
        ? 'translateX(-2px)'
        : 'translateY(-3px) translateX(-2px)'};
    border-color: ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.primary + '60'};
  }

  &:active {
    transform: ${props =>
      props.$isSelected
        ? 'translateX(-1px)'
        : 'translateY(-1px) translateX(-1px)'};
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    margin: 0 8px 10px 0;
    border-radius: 12px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;
`;

const ContactName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  white-space: nowrap;
`;

const SecondRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`;

const PhoneNumber = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;

  ${props => {
    switch (props.$status) {
      case 'read':
        return `background: #10B98120; color: #10B981;`;
      case 'delivered':
        return `background: #3B82F620; color: #3B82F6;`;
      case 'sent':
        return `background: #6B728020; color: #6B7280;`;
      case 'failed':
        return `background: #EF444420; color: #EF4444;`;
      default:
        return `background: #6B728020; color: #6B7280;`;
    }
  }}
`;

const TimeStatusBadge = styled.span<{
  $timeStatus: 'on_time' | 'delayed' | 'critical';
}>`
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  ${props => {
    switch (props.$timeStatus) {
      case 'critical':
        return `
          background: ${props.theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)'};
          color: #EF4444;
          border: 1px solid ${props.theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)'};
        `;
      case 'delayed':
        return `
          background: ${props.theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)'};
          color: #F59E0B;
          border: 1px solid ${props.theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.3)'};
        `;
      case 'on_time':
        return `
          background: ${props.theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'};
          color: #10B981;
          border: 1px solid ${props.theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'};
        `;
      default:
        return '';
    }
  }}
`;

const MessageContent = styled.div`
  margin-bottom: 12px;
`;

const MessageText = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue',
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
`;

const MediaPreview = styled.div`
  margin-top: 8px;
  padding: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
`;

const SourceBadge = styled.span`
  font-size: 0.75rem;
  padding: 6px 10px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

const TaskLink = styled.a`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const DirectionIndicator = styled.div<{ $direction: 'inbound' | 'outbound' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props =>
    props.$direction === 'inbound'
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-weight: 500;
`;

const ConversationLink = styled.a`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary}08;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.primary}15;
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

interface WhatsAppMessageCardProps {
  message: WhatsAppMessage;
  onCardClick?: (message: WhatsAppMessage) => void;
  showConversation?: boolean;
  onViewConversation?: (phoneNumber: string, contactName?: string) => void;
  isSelected?: boolean;
  unreadCount?: number; // Contagem de mensagens não lidas na conversa
  timeStatus?: TimeStatus | null; // Status de tempo: 'on_time', 'delayed', 'critical'
}

export const WhatsAppMessageCard: React.FC<WhatsAppMessageCardProps> = ({
  message,
  onCardClick,
  showConversation = true,
  onViewConversation,
  isSelected = false,
  unreadCount = 0,
  timeStatus = null,
}) => {
  const navigate = useNavigate();
  const isUnread =
    unreadCount > 0 || (!message.readAt && message.direction === 'inbound');

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(message);
    }
  };

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (message.kanbanTaskId) {
      // Construir URL com teamId se disponível (necessário para navegação correta)
      const params = new URLSearchParams();
      if (message.teamId) {
        params.append('teamId', message.teamId);
      }
      const queryString = params.toString();
      navigate(
        `/kanban/task/${message.kanbanTaskId}${queryString ? `?${queryString}` : ''}`
      );
    }
  };

  const getMediaIcon = () => {
    switch (message.messageType) {
      case 'image':
        return <MdImage size={18} />;
      case 'video':
        return <MdVideoLibrary size={18} />;
      case 'audio':
        return '🎵';
      case 'voice':
        return '🎤';
      case 'document':
        return <MdInsertDriveFile size={18} />;
      case 'sticker':
        return '🎭';
      case 'location':
        return <MdLocationOn size={18} />;
      case 'contact':
        return <MdPerson size={18} />;
      default:
        return <MdChat size={18} />;
    }
  };

  const getMediaLabel = () => {
    switch (message.messageType) {
      case 'image':
        return 'Imagem';
      case 'video':
        return 'Vídeo';
      case 'audio':
        return 'Áudio';
      case 'voice':
        return 'Nota de voz';
      case 'document':
        return message.mediaFileName || 'Documento';
      case 'sticker':
        return 'Sticker';
      case 'location':
        return 'Localização';
      case 'contact':
        return 'Contato';
      default:
        return 'Mensagem';
    }
  };

  return (
    <MessageCard
      $isUnread={isUnread}
      $isSelected={isSelected}
      $timeStatus={timeStatus}
      onClick={handleCardClick}
    >
      {/* Linha 1: Nome do usuário e tempo */}
      <TopRow>
        <ContactName>
          <span style={{ flex: 1, minWidth: 0 }}>
            {message.contactName || 'Sem nome'}
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                background: '#EF4444',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
                minWidth: '24px',
                textAlign: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </ContactName>
        <MessageTime>
          <MdSchedule size={14} />
          {formatMessageTime(message.createdAt)}
        </MessageTime>
      </TopRow>

      {/* Linha 2: Número de contato e status */}
      <SecondRow>
        <PhoneNumber>
          <FaWhatsapp size={14} color='#25D366' />
          {formatPhoneDisplay(message.phoneNumber)}
          {message.assignedTo && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: '0.75rem',
                color: '#6B7280',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              • Atribuído a: {message.assignedTo.name}
            </span>
          )}
          {timeStatus && (
            <TimeStatusBadge
              $timeStatus={timeStatus}
              style={{ marginLeft: '8px' }}
            >
              {timeStatus === 'critical' && '🚨 Crítica'}
              {timeStatus === 'delayed' && '⚠️ Atrasada'}
              {timeStatus === 'on_time' && '✅ Em Dia'}
            </TimeStatusBadge>
          )}
        </PhoneNumber>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {message.direction === 'inbound' && (
            <DirectionIndicator $direction='inbound'>
              <FaWhatsapp size={12} />
              Recebida
            </DirectionIndicator>
          )}
          {message.direction === 'outbound' && (
            <>
              <DirectionIndicator $direction='outbound'>
                Enviada
              </DirectionIndicator>
              <span
                style={{
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  marginLeft: '4px',
                }}
              >
                {message.status === 'read' && (
                  <>
                    <span style={{ color: '#3B82F6' }}>✓</span>
                    <span style={{ color: '#3B82F6', marginLeft: '-2px' }}>
                      ✓
                    </span>
                  </>
                )}
                {message.status === 'delivered' && (
                  <span style={{ color: '#3B82F6' }}>✓</span>
                )}
                {message.status === 'sent' && (
                  <span style={{ color: '#6B7280' }}>✓</span>
                )}
                {message.status === 'failed' && (
                  <span style={{ color: '#EF4444' }}>✗</span>
                )}
                {message.status === 'pending' && (
                  <span style={{ color: '#6B7280', opacity: 0.6 }}>⏳</span>
                )}
              </span>
            </>
          )}
        </div>
      </SecondRow>

      {/* Linha 3: Mensagem */}
      <MessageContent>
        {/* Mensagem de Texto */}
        {message.messageType === 'text' && message.message && (
          <MessageText>{message.message}</MessageText>
        )}

        {/* Mensagem de Imagem com Preview */}
        {message.messageType === 'image' && message.mediaUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img
              src={message.mediaUrl}
              alt='Imagem'
              loading='lazy'
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
              onError={e => {
                // Fallback se imagem não carregar
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {message.message && (
              <MessageText style={{ marginTop: '8px' }}>
                {message.message}
              </MessageText>
            )}
          </div>
        )}

        {/* Outros tipos de mídia */}
        {message.messageType !== 'text' && message.messageType !== 'image' && (
          <MediaPreview>
            {getMediaIcon()}
            <span>{getMediaLabel()}</span>
            {message.mediaFileName && (
              <span style={{ opacity: 0.7 }}>• {message.mediaFileName}</span>
            )}
          </MediaPreview>
        )}
      </MessageContent>

      {/* Linha 4: Ações (Ver Tarefa) */}
      {(message.kanbanTaskId || message.detectedSource) && (
        <ActionRow>
          {message.detectedSource && (
            <SourceBadge>{message.detectedSource}</SourceBadge>
          )}
          {message.kanbanTaskId && (
            <TaskLink
              to={`/kanban/task/${message.kanbanTaskId}${message.teamId ? `?teamId=${message.teamId}` : ''}`}
              onClick={handleTaskClick}
            >
              <MdCheckCircle size={16} />
              Ver Tarefa
            </TaskLink>
          )}
        </ActionRow>
      )}
    </MessageCard>
  );
};
