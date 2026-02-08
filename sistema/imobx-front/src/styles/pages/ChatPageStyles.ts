import styled, { keyframes, css } from 'styled-components';
import {
  MdSend,
  MdSearch,
  MdAdd,
  MdGroup,
  MdPerson,
  MdSupport,
} from 'react-icons/md';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

export const ChatPageContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background: ${props => props.theme.colors.background};
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const ChatSidebar = styled.div<{ $isVisible?: boolean }>`
  width: 350px;
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.cardBackground};
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.3s ease;

  @media (max-width: 1024px) {
    width: 100%;
    height: 100%;
    border-right: none;
    border-bottom: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    transform: ${props =>
      props.$isVisible ? 'translateX(0)' : 'translateX(-100%)'};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ChatSidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ChatSidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ChatSearchContainer = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 10px 16px;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

export const ChatSearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 1024px) {
    padding: 9px 11px 9px 38px;
    font-size: 0.875rem;
    border-radius: 7px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px 10px 36px;
    font-size: 16px; /* Evita zoom automático no iOS */
    border-radius: 8px;
    min-height: 44px; /* Tamanho mínimo recomendado para touch */
  }

  @media (max-width: 480px) {
    padding: 8px 10px 8px 34px;
    font-size: 16px;
    min-height: 42px;
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-size: inherit;
  }

  /* Evitar zoom no iOS */
  @supports (-webkit-touch-callout: none) {
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

export const ChatSearchIcon = styled(MdSearch)`
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  pointer-events: none;
  z-index: 1;

  @media (max-width: 1024px) {
    left: 30px;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    left: 28px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    left: 26px;
    font-size: 0.95rem;
  }
`;

export const ChatSearchWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

export const ChatRoomsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

export const ChatSectionTitle = styled.div`
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textSecondary};
  letter-spacing: 0.5px;
  margin-top: 8px;
`;

export const ChatUsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
`;

export const ChatUserItem = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;

  &:hover {
    background: ${props => props.theme.colors.border + '40'};
  }
`;

export const ChatUserAvatar = styled.div<{ $isOnline?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 600;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => (props.$isOnline ? '#10B981' : '#9CA3AF')};
    border: 2px solid ${props => props.theme.colors.cardBackground};
  }
`;

export const ChatUserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatUserName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatUserRole = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatRoomItem = styled.div<{ $active?: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
  background: ${props =>
    props.$active ? props.theme.colors.primary + '15' : 'transparent'};
  width: 100%;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primary + '20'
        : props.theme.colors.border + '40'};
  }

  &:active {
    transform: scale(0.98);
  }

  border-left: 3px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};

  * {
    pointer-events: none;
  }
`;

export const ChatRoomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

export const ChatRoomAvatar = styled.div<{
  $type?: 'direct' | 'group' | 'support';
  $hasImage?: boolean;
}>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.$hasImage) return 'transparent';
    if (props.$type === 'group') return props.theme.colors.primary + '20';
    if (props.$type === 'support') return '#10B981' + '20';
    return props.theme.colors.border;
  }};
  color: ${props => {
    if (props.$hasImage) return 'transparent';
    if (props.$type === 'group') return props.theme.colors.primary;
    if (props.$type === 'support') return '#10B981';
    return props.theme.colors.textSecondary;
  }};
  font-size: 1.2rem;
  flex-shrink: 0;
  overflow: hidden;
  font-weight: 600;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const ChatRoomInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ChatRoomName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatRoomLastMessage = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatRoomMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
`;

export const ChatRoomTime = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

export const ChatRoomUnread = styled.div<{ $hasUnread?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: ${props => (props.$hasUnread ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

export const ChatMainArea = styled.div<{ $isVisible?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background};
  height: 100%;
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${props => (props.$isVisible ? 20 : 5)};
    transform: ${props =>
      props.$isVisible ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
  }
`;

export const ChatHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.cardBackground};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

export const ChatHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    gap: 6px;
  }
`;

export const ChatBackButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;

  @media (max-width: 1024px) {
    display: flex;
  }

  &:hover {
    background: ${props => props.theme.colors.border + '40'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ChatHeaderButton = styled.button<{ $isProcessing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: ${props =>
    props.$isProcessing ? props.theme.colors.primary + '20' : 'transparent'};
  color: ${props =>
    props.$isProcessing
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${props =>
      props.$isProcessing
        ? props.theme.colors.primary + '30'
        : props.theme.colors.border + '40'};
    color: ${props =>
      props.$isProcessing
        ? props.theme.colors.primary
        : props.theme.colors.text};
    transform: ${props => (props.$isProcessing ? 'scale(1.1)' : 'scale(1.05)')};
  }

  &:active {
    transform: scale(0.95);
  }

  ${props =>
    props.$isProcessing &&
    css`
      animation: ${pulse} 1s ease-in-out infinite;
    `}
`;

export const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ChatHeaderAvatar = styled.div<{
  $type?: 'direct' | 'group' | 'support';
  $hasImage?: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.$hasImage) return 'transparent';
    if (props.$type === 'group') return props.theme.colors.primary + '20';
    if (props.$type === 'support') return '#10B981' + '20';
    return props.theme.colors.border;
  }};
  color: ${props => {
    if (props.$hasImage) return 'transparent';
    if (props.$type === 'group') return props.theme.colors.primary;
    if (props.$type === 'support') return '#10B981';
    return props.theme.colors.textSecondary;
  }};
  font-size: 1rem;
  flex-shrink: 0;
  overflow: hidden;
  font-weight: 600;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const ChatHeaderName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 150px;
  }

  @media (max-width: 480px) {
    max-width: 120px;
  }
`;

export const ChatHeaderParticipants = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

export const ChatMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 24px 8px 24px; /* padding bottom mínimo */
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  /* Garantir que o scroll funcione corretamente no mobile */
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 16px 12px 8px 12px;
    gap: 6px;
    /* Adicionar padding bottom extra para garantir espaço para o input */
    padding-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 10px 8px 10px;
    padding-bottom: 10px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

export const ChatMessage = styled.div<{
  $isOwn?: boolean;
  $isGroup?: boolean;
  $isSystem?: boolean;
}>`
  display: flex;
  flex-direction: ${props =>
    props.$isSystem ? 'column' : props.$isOwn ? 'column' : 'row'};
  align-items: ${props =>
    props.$isSystem ? 'center' : props.$isOwn ? 'flex-end' : 'flex-start'};
  gap: ${props =>
    props.$isGroup && !props.$isOwn && !props.$isSystem ? '12px' : '0'};
  margin-bottom: ${props => (props.$isSystem ? '8px' : '16px')};
  width: 100%;

  @media (max-width: 768px) {
    gap: ${props =>
      props.$isGroup && !props.$isOwn && !props.$isSystem ? '8px' : '0'};
  }
`;

export const ChatSystemMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin: 0 auto;
  max-width: 80%;
  text-align: center;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 12px;
    max-width: 90%;
  }
`;

export const ChatMessageAvatar = styled.div<{ $hasImage?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.$hasImage ? 'transparent' : props.theme.colors.primary + '20'};
  color: ${props =>
    props.$hasImage ? 'transparent' : props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }
`;

export const ChatMessageWrapper = styled.div<{
  $isOwn?: boolean;
  $hasAvatar?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.$isOwn ? 'flex-end' : 'flex-start')};
  flex: 1;
  min-width: 0;
  max-width: ${props =>
    props.$hasAvatar
      ? 'calc(100% - 52px)'
      : '70%'}; /* Espaço para avatar + gap quando há avatar */

  @media (max-width: 768px) {
    max-width: ${props =>
      props.$hasAvatar
        ? 'calc(100% - 44px)'
        : '85%'}; /* Espaço para avatar menor + gap menor quando há avatar */
  }
`;

export const ChatMessageContent = styled.div<{ $isOwn?: boolean }>`
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  max-width: 100%;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const ChatMessageInfo = styled.div<{ $isOwn?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 0;
  justify-content: ${props => (props.$isOwn ? 'flex-end' : 'flex-start')};
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const ChatMessageSender = styled.span`
  font-weight: 600;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  display: block;
`;

export const ChatMessageTimeWrapper = styled.div<{ $isOwn?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  justify-content: ${props => (props.$isOwn ? 'flex-end' : 'flex-start')};
`;

export const ChatMessageTime = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ChatMessageStatus = styled.span<{
  $status?: 'sending' | 'sent' | 'delivered' | 'read';
}>`
  color: ${props => {
    if (props.$status === 'read') return props.theme.colors.primary;
    return props.theme.colors.textSecondary;
  }};
`;

export const ChatInputArea = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  flex-shrink: 0;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 10px 12px;
    /* Garantir que o input area seja sempre visível no mobile */
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

export const ImagePreviewContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

export const DocumentPreviewContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DocumentPreviewIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

export const DocumentPreviewInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DocumentPreviewName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`;

export const DocumentPreviewSize = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const RemoveDocumentButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

export const ImageInputWrapper = styled.div`
  position: relative;
`;

export const ImageAttachButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  touch-action: manipulation;
  min-width: 40px;
  min-height: 40px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    padding: 6px;
    min-width: 36px;
    min-height: 36px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    padding: 5px;
    min-width: 32px;
    min-height: 32px;
  }

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 100%;
    height: 100%;
    max-width: 20px;
    max-height: 20px;

    @media (max-width: 480px) {
      max-width: 18px;
      max-height: 18px;
    }
  }
`;

export const ChatInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  width: 100%;
  min-width: 0; /* Permite que os elementos filhos encolham */

  @media (max-width: 768px) {
    gap: 6px;
    /* Garantir que todos os elementos sejam visíveis */
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 44px;
  max-height: 120px;
  transition: all 0.2s;
  min-width: 0; /* Permite que o textarea encolha */
  width: 100%;

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 16px; /* Evita zoom automático no iOS */
    min-height: 40px;
    max-height: 100px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 16px;
    min-height: 36px;
    max-height: 80px;
    border-radius: 8px;
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  /* Evitar zoom no iOS */
  @supports (-webkit-touch-callout: none) {
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

export const ChatSendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  touch-action: manipulation;
  min-width: 40px;
  min-height: 40px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    min-width: 36px;
    min-height: 36px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    min-width: 32px;
    min-height: 32px;
  }

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryHover};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 100%;
    height: 100%;
    max-width: 20px;
    max-height: 20px;

    @media (max-width: 480px) {
      max-width: 18px;
      max-height: 18px;
    }
  }
`;

export const ChatEmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

export const ChatEmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

export const ChatEmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ChatEmptyMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const ChatLoadingState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ChatErrorState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: ${props => props.theme.colors.error || '#EF4444'};
`;

export const ChatConnectionStatus = styled.div<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: ${props =>
    props.$connected ? '#10B981' : props.theme.colors.error || '#EF4444'};
  padding: 4px 8px;
  border-radius: 4px;
  background: ${props =>
    props.$connected
      ? '#10B981' + '20'
      : (props.theme.colors.error || '#EF4444') + '20'};
`;

export const GroupIcon = styled(MdGroup)``;
export const PersonIcon = styled(MdPerson)``;
export const SupportIcon = styled(MdSupport)``;
export const SendIcon = styled(MdSend)``;
export const AddIcon = styled(MdAdd)``;

export const ChatMessageFile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }

  &:hover {
    background: ${props => props.theme.colors.border + '20'};
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const ChatMessageFileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary + '15'};
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

export const ChatMessageFileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ChatMessageFileName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatMessageFileSize = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ChatMessageFileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const ChatMessageFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.border + '30'};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

export const ChatMessageImageContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 4px;
  margin-bottom: 4px;
  max-width: 100%;

  @media (max-width: 768px) {
    margin-top: 3px;
    margin-bottom: 3px;
  }
`;

export const ChatMessageImageDownloadButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  z-index: 10;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    top: 6px;
    right: 6px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
