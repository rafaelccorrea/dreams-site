import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { useChatUnreadCount } from '../../hooks/useChatUnreadCount';
import { useAuth } from '../../hooks/useAuth';
import { useModuleAccess } from '../../hooks/useModuleAccess';
import { chatSocketService } from '../../services/chatSocketService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styled from 'styled-components';
import {
  MdClose,
  MdMinimize,
  MdMaximize,
  MdSend,
  MdExpandMore,
  MdExpandLess,
  MdAttachFile,
  MdClose as MdCloseIcon,
  MdRefresh,
  MdWifiOff,
  MdWifi,
  MdDownload,
  MdPictureAsPdf,
  MdImage,
  MdInsertDriveFile,
  MdDescription,
  MdDelete,
  MdCode,
  MdArchive,
  MdUnarchive,
} from 'react-icons/md';
import { EmojiPicker } from './EmojiPicker';
import type { ChatRoom, ChatMessage } from '../../types/chat';
import { useArchivedMessages } from '../../hooks/useArchivedMessages';

const MAX_OPEN_CHATS = 3;

// Animação global para o botão de reconexão
const spinKeyframes = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Injetar keyframes no documento
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinKeyframes;
  if (!document.head.querySelector('style[data-chat-spin]')) {
    style.setAttribute('data-chat-spin', 'true');
    document.head.appendChild(style);
  }
}

const ChatWindowsContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 16px 0;
  z-index: 1000;
  pointer-events: none;
  max-width: calc(100vw - 32px);

  @media (max-width: 1024px) {
    padding: 0 8px 8px 0;
    gap: 6px;
    flex-direction: column;
    max-width: calc(100vw - 16px);
  }

  @media (max-width: 768px) {
    padding: 0 4px 4px 0;
    gap: 4px;
    max-width: calc(100vw - 8px);
  }

  @media (max-width: 480px) {
    padding: 0 2px 2px 0;
    gap: 3px;
  }
`;

const ChatWindow = styled.div<{ $isMinimized: boolean; $zIndex: number }>`
  width: ${props => (props.$isMinimized ? '320px' : '380px')};
  height: ${props => (props.$isMinimized ? '48px' : '500px')};
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => (props.$isMinimized ? '8px' : '12px 12px 0 0')};
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  pointer-events: all;
  z-index: ${props => props.$zIndex};
  touch-action: pan-y;

  @media (max-width: 1024px) {
    width: ${props => (props.$isMinimized ? '280px' : 'calc(100vw - 16px)')};
    height: ${props => (props.$isMinimized ? '48px' : 'min(70vh, 600px)')};
    max-width: 400px;
    border-radius: ${props => (props.$isMinimized ? '8px' : '12px 12px 0 0')};
  }

  @media (max-width: 768px) {
    width: ${props =>
      props.$isMinimized ? 'calc(100vw - 8px)' : 'calc(100vw - 8px)'};
    height: ${props => (props.$isMinimized ? '48px' : 'min(85vh, 700px)')};
    max-width: none;
    border-radius: ${props => (props.$isMinimized ? '8px' : '16px 16px 0 0')};
  }

  @media (max-width: 480px) {
    width: ${props =>
      props.$isMinimized ? 'calc(100vw - 4px)' : 'calc(100vw - 4px)'};
    height: ${props => (props.$isMinimized ? '44px' : 'min(90vh, 750px)')};
    border-radius: ${props => (props.$isMinimized ? '8px' : '12px 12px 0 0')};
  }
`;

const ChatWindowHeader = styled.div<{ $hasUnread: boolean }>`
  padding: 12px 16px;
  background: ${props =>
    props.$hasUnread
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.$hasUnread ? 'white' : props.theme.colors.text)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  border-bottom: ${props =>
    props.$hasUnread ? 'none' : `1px solid ${props.theme.colors.border}`};
  transition: background 0.2s;

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

const ChatWindowHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  cursor: pointer;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ChatWindowAvatar = styled.div<{
  $type?: 'direct' | 'group' | 'support';
  $hasImage?: boolean;
}>`
  width: 32px;
  height: 32px;
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
  font-size: 0.9rem;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
`;

const ChatWindowHeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatWindowTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    max-width: 120px;
  }

  @media (max-width: 480px) {
    max-width: 100px;
  }
`;

const ChatWindowSubtitle = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    max-width: 120px;
  }

  @media (max-width: 480px) {
    max-width: 100px;
  }
`;

const ChatWindowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const ConnectionStatus = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: ${props => (props.$connected ? '#10B981' : '#EF4444')};
  margin-right: 4px;
`;

const ReconnectButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
  opacity: 0.8;
  min-width: 24px;
  min-height: 24px;

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.1);
    opacity: 1;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    transition: transform 0.3s;
  }
`;

const ChatWindowButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
  opacity: 0.8;
  min-width: 32px;
  min-height: 32px;
  touch-action: manipulation;

  @media (max-width: 768px) {
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ChatWindowContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ChatMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 16px 8px 16px; /* padding bottom mínimo */
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${props => props.theme.colors.background};
  min-height: 0;
  /* Garantir que o scroll funcione corretamente no mobile */
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 12px 12px 8px 12px;
    gap: 6px;
    /* Adicionar padding bottom extra para garantir espaço para o input */
    padding-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px 10px 8px 10px;
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
  }
`;

const ChatMessage = styled.div<{ $isOwn?: boolean; $isGroup?: boolean }>`
  display: flex;
  flex-direction: ${props => (props.$isOwn ? 'column' : 'row')};
  align-items: ${props => (props.$isOwn ? 'flex-end' : 'flex-start')};
  gap: ${props => (props.$isGroup && !props.$isOwn ? '8px' : '0')};
  margin-bottom: 12px;
  width: 100%;

  @media (max-width: 768px) {
    gap: ${props => (props.$isGroup && !props.$isOwn ? '6px' : '0')};
  }
`;

const ChatMessageAvatar = styled.div<{ $hasImage?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.$hasImage ? 'transparent' : props.theme.colors.primary + '20'};
  color: ${props =>
    props.$hasImage ? 'transparent' : props.theme.colors.primary};
  font-size: 0.75rem;
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
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
`;

const ChatMessageWrapper = styled.div<{
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
      ? 'calc(100% - 40px)'
      : '70%'}; /* Espaço para avatar + gap quando há avatar */

  @media (max-width: 768px) {
    max-width: ${props =>
      props.$hasAvatar
        ? 'calc(100% - 34px)'
        : '85%'}; /* Espaço para avatar menor + gap menor quando há avatar */
  }
`;

const ChatMessageSender = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  display: block;
`;

const ChatMessageContent = styled.div<{ $isOwn?: boolean }>`
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  max-width: 100%;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const ChatMessageTime = styled.div<{ $isOwn?: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: ${props => (props.$isOwn ? 'flex-end' : 'flex-start')};
  max-width: 70%;

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const ChatMessageImageContainer = styled.div`
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

const ChatMessageImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: contain;
  transition: transform 0.2s;
  display: block;

  @media (max-width: 768px) {
    max-height: 200px;
    border-radius: 6px;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ChatMessageImageDownloadButton = styled.button`
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

const ChatMessageFile = styled.div`
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

const ChatMessageFileIcon = styled.div`
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

const ChatMessageFileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChatMessageFileName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMessageFileSize = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ChatMessageFileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const ChatMessageFileButton = styled.button`
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

const ImagePreviewContainer = styled.div`
  position: relative;
  margin-bottom: 8px;
  padding: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;

  @media (max-width: 768px) {
    margin-bottom: 6px;
    padding: 6px;
    border-radius: 6px;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  border-radius: 8px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-height: 120px;
    border-radius: 6px;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  touch-action: manipulation;
  min-width: 28px;
  min-height: 28px;

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

const DocumentPreviewContainer = styled.div`
  position: relative;
  margin-bottom: 8px;
  padding: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    margin-bottom: 6px;
    padding: 6px;
    border-radius: 6px;
    gap: 6px;
  }
`;

const DocumentPreviewIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const DocumentPreviewInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocumentPreviewName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const DocumentPreviewSize = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const RemoveDocumentButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  touch-action: manipulation;
  min-width: 28px;
  min-height: 28px;
  flex-shrink: 0;

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

const ImageInputWrapper = styled.div`
  position: relative;
`;

const ImageAttachButton = styled.button`
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
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  touch-action: manipulation;
  min-width: 36px;
  min-height: 36px;

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

const ChatInputArea = styled.div`
  padding: 12px;
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

const ChatInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
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

const ChatInput = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 36px;
  max-height: 80px;
  transition: all 0.2s;
  min-width: 0; /* Permite que o textarea encolha */
  width: 100%;

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 16px; /* Evita zoom automático no iOS */
    min-height: 36px;
    max-height: 70px;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 16px;
    min-height: 32px;
    max-height: 60px;
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
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

const ChatSendButton = styled.button`
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
  flex-shrink: 0;
  touch-action: manipulation;
  min-width: 36px;
  min-height: 36px;

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
    max-width: 18px;
    max-height: 18px;

    @media (max-width: 480px) {
      max-width: 16px;
      max-height: 16px;
    }
  }
`;

const UnreadBadge = styled.div`
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 0.65rem;
    margin-left: 6px;
  }
`;

interface OpenChat {
  roomId: string;
  isMinimized: boolean;
  lastOpened: number;
}

const getRoomDisplayName = (room: ChatRoom, currentUserId?: string): string => {
  if (room.name) return room.name;
  if (room.type === 'support') return 'Suporte';
  if (room.type === 'direct') {
    const otherParticipant = room.participants.find(
      p => p.userId !== currentUserId
    );
    return otherParticipant?.userName || 'Usuário';
  }
  return 'Chat';
};

const getRoomAvatar = (
  room: ChatRoom,
  currentUserId?: string
): string | null => {
  // Para grupos, usar imageUrl se disponível
  if (room.type === 'group' && room.imageUrl) {
    return room.imageUrl;
  }

  if (room.type === 'direct') {
    const otherParticipant = room.participants.find(
      p => p.userId !== currentUserId
    );
    return otherParticipant?.userAvatar || null;
  }
  return null;
};

const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoomIcon = (type: 'direct' | 'group' | 'support') => {
  switch (type) {
    case 'group':
      return '👥';
    case 'support':
      return '💬';
    default:
      return '👤';
  }
};

const formatMessageTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch {
    return '';
  }
};

export const ChatWindows: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const moduleAccess = useModuleAccess();
  const hasChatModule = moduleAccess.isModuleAvailableForCompany('chat');
  const {
    rooms,
    messages,
    joinRoom,
    sendMessage,
    markAsRead,
    loadRooms,
    connected,
    deleteMessage,
    createOrGetRoom,
  } = useChat();
  const unreadCount = useChatUnreadCount();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const {
    archiveMessage,
    unarchiveMessage,
    filterArchivedMessages,
    getArchivedMessages,
    getArchivedCount,
  } = useArchivedMessages();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showArchivedMessages, setShowArchivedMessages] = useState<
    Record<string, boolean>
  >({}); // Por sala

  // Não mostrar cards flutuantes quando estiver na tela de chat dedicada
  const isOnChatPage =
    location.pathname === '/chat' || location.pathname.startsWith('/chat/');

  const [openChats, setOpenChats] = useState<OpenChat[]>([]);
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>(
    {}
  );
  const [selectedImages, setSelectedImages] = useState<Record<string, File>>(
    {}
  );
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );
  const [hoveringMessageIds, setHoveringMessageIds] = useState<
    Record<string, string>
  >({}); // Track which message is being hovered per room
  const messagesEndRefs = useRef<Record<string, HTMLDivElement>>({});
  const imageInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const previousMessagesCount = useRef<Record<string, number>>({}); // Rastrear contagem anterior de mensagens

  // Scroll para o final das mensagens (considerando área de input fixa)
  const scrollToBottom = useCallback((roomId: string) => {
    // Encontrar o elemento de referência do final das mensagens
    const ref = messagesEndRefs.current[roomId];
    if (ref) {
      // Usar scrollIntoView com block: 'end' para garantir que fique na parte inferior
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, []);

  // Expor função para abrir chat via contexto/evento
  const handleOpenChat = useCallback(
    async (roomId: string) => {
      let isNewChat = false;

      // Usar função de atualização para garantir estado mais recente
      setOpenChats(prev => {
        // Verificar se já está aberto (verificação mais robusta)
        const isAlreadyOpen = prev.some(chat => chat.roomId === roomId);

        if (isAlreadyOpen) {
          // Se já está aberto, apenas restaurar/maximizar
          return prev.map(chat =>
            chat.roomId === roomId
              ? { ...chat, isMinimized: false, lastOpened: Date.now() }
              : chat
          );
        }

        // É um novo chat
        isNewChat = true;

        // Validar limite de 3 janelas
        if (prev.length >= MAX_OPEN_CHATS) {
          // Substituir o chat mais antigo
          const sortedChats = [...prev].sort(
            (a, b) => a.lastOpened - b.lastOpened
          );
          const oldestChat = sortedChats[0];

          return prev
            .filter(chat => chat.roomId !== oldestChat.roomId)
            .concat({
              roomId,
              isMinimized: false,
              lastOpened: Date.now(),
            });
        }

        // Se há espaço, abrir normalmente
        return [
          ...prev,
          {
            roomId,
            isMinimized: false,
            lastOpened: Date.now(),
          },
        ];
      });

      // Entrar na sala após atualizar o estado (fora do setState para evitar problemas)
      try {
        await joinRoom(roomId);

        // Fazer scroll após abrir o chat (aguardar um pouco para garantir que as mensagens foram carregadas)
        if (isNewChat) {
          setTimeout(() => {
            console.log(
              '📜 [ChatWindows] Chat aberto, fazendo scroll até o final...'
            );
            scrollToBottom(roomId);
          }, 500);
        }
      } catch (error) {
        console.error('Erro ao entrar na sala:', error);
      }
    },
    [joinRoom, scrollToBottom]
  );

  // Escutar eventos para abrir chat (incl. "Falar com suporte" com initialMessage para master)
  useEffect(() => {
    let isProcessing = false;

    const handleOpenChatEvent = (event: CustomEvent) => {
      if (isProcessing) return;
      isProcessing = true;

      const { roomId, forceOpen, initialMessage } = event.detail || {};

      console.log('📬 [ChatWindows] Evento open-chat recebido:', {
        roomId,
        forceOpen,
        initialMessage: !!initialMessage,
        isOnChatPage,
        roomsCount: rooms.length,
      });

      if (isOnChatPage && !forceOpen) {
        setTimeout(() => { isProcessing = false; }, 100);
        return;
      }

      const run = async () => {
        try {
          let roomToOpen: string | null = roomId || null;

          // Mensagem para suporte: abrir sala de suporte (criar se não existir), inclusive para master
          if (initialMessage && typeof initialMessage === 'string' && !roomId) {
            let supportRoom = rooms.find((r: ChatRoom) => r.type === 'support');
            if (!supportRoom) {
              try {
                supportRoom = await createOrGetRoom({ type: 'support' });
              } catch (err) {
                console.error('❌ [ChatWindows] Erro ao criar sala de suporte:', err);
              }
            }
            if (supportRoom) roomToOpen = supportRoom.id;
          }

          if (!roomToOpen && rooms.length > 0) roomToOpen = rooms[0].id;

          if (roomToOpen) {
            await handleOpenChat(roomToOpen);
            if (initialMessage && typeof initialMessage === 'string') {
              setMessageInputs(prev => ({ ...prev, [roomToOpen!]: initialMessage }));
            }
          } else {
            console.warn('⚠️ [ChatWindows] Nenhuma sala disponível para abrir');
          }
        } catch (error) {
          console.error('❌ [ChatWindows] Erro ao abrir chat:', error);
        } finally {
          setTimeout(() => { isProcessing = false; }, 100);
        }
      };

      run();
    };

    window.addEventListener('open-chat', handleOpenChatEvent as EventListener);

    return () => {
      window.removeEventListener(
        'open-chat',
        handleOpenChatEvent as EventListener
      );
    };
  }, [handleOpenChat, isOnChatPage, rooms, createOrGetRoom]);

  // Salas já são carregadas pelo useChat, não precisa carregar aqui novamente

  // Removido: useEffect que abria chats automaticamente - agora é feito via handleNewMessage no useChat

  // Obter dados da sala
  const getRoomData = (roomId: string) => {
    return rooms.find(r => r.id === roomId);
  };

  // Obter mensagens da sala (filtrar arquivadas se não estiver visualizando)
  const getRoomMessages = (roomId: string) => {
    const roomMessages = messages[roomId] || [];
    const isViewingArchived = showArchivedMessages[roomId] || false;

    if (isViewingArchived) {
      // Mostrar apenas mensagens arquivadas
      return getArchivedMessages(roomId, roomMessages);
    } else {
      // Filtrar mensagens arquivadas (mostrar apenas não arquivadas)
      return filterArchivedMessages(roomId, roomMessages);
    }
  };

  // Obter contagem de mensagens arquivadas por sala
  const getArchivedCountForRoom = (roomId: string) => {
    return getArchivedCount(roomId);
  };

  // Contar mensagens não lidas
  const getUnreadCount = (roomId: string) => {
    if (!currentUser?.id) return 0;
    const roomMessages = messages[roomId] || [];
    return roomMessages.filter(
      msg => msg.senderId !== currentUser.id && msg.status !== 'read'
    ).length;
  };

  // Verificar se um chat window está em foco (não minimizado, visível e com foco)
  const isChatWindowInFocus = useCallback((roomId: string) => {
    // Verificar se a página está visível e em foco primeiro
    const isPageVisible = document.visibilityState === 'visible';
    const isWindowFocused = document.hasFocus();

    if (!isPageVisible || !isWindowFocused) {
      return false; // Se a página não está visível ou em foco, o chat não está em foco
    }

    const chatWindow = document.querySelector(
      `[data-chat-room-id="${roomId}"]`
    ) as HTMLElement;
    if (!chatWindow) return false;

    // Verificar se não está minimizado (altura maior que 100px)
    const isNotMinimized = chatWindow.offsetHeight > 100;
    if (!isNotMinimized) return false;

    // Verificar se está visível na tela (pelo menos parcialmente)
    const rect = chatWindow.getBoundingClientRect();
    const isVisible =
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth;

    if (!isVisible) return false;

    // Verificar se tem o maior z-index (está por cima dos outros)
    const allChatWindows = document.querySelectorAll(
      '[data-chat-room-id]'
    ) as NodeListOf<HTMLElement>;
    let maxZIndex = 0;
    let focusedRoomId: string | null = null;
    allChatWindows.forEach(el => {
      const zIndex = parseInt(window.getComputedStyle(el).zIndex) || 0;
      if (zIndex > maxZIndex && el.offsetHeight > 100) {
        maxZIndex = zIndex;
        focusedRoomId = el.getAttribute('data-chat-room-id');
      }
    });

    // O chat está em foco se for o chat com maior z-index
    return focusedRoomId === roomId;
  }, []);

  // Scroll automático quando uma janela de chat é aberta ou quando as mensagens são carregadas
  useEffect(() => {
    if (!hasChatModule) return;

    openChats.forEach(openChat => {
      const roomMessages = getRoomMessages(openChat.roomId);
      const currentCount = roomMessages.length;

      // Se há mensagens e ainda não foi feito scroll inicial para este chat
      if (currentCount > 0 && !previousMessagesCount.current[openChat.roomId]) {
        // Primeira vez que este chat tem mensagens - fazer scroll
        setTimeout(() => {
          console.log(
            `📜 [ChatWindows] Mensagens carregadas para chat ${openChat.roomId}, fazendo scroll até o final...`
          );
          scrollToBottom(openChat.roomId);
        }, 300);
        previousMessagesCount.current[openChat.roomId] = currentCount;
      }
    });
  }, [messages, openChats, hasChatModule]);

  // Scroll automático quando uma NOVA mensagem chegar (apenas se não estiver em foco)
  useEffect(() => {
    if (!hasChatModule) return;

    openChats.forEach(openChat => {
      const roomMessages = getRoomMessages(openChat.roomId);
      const previousCount = previousMessagesCount.current[openChat.roomId] || 0;
      const currentCount = roomMessages.length;

      // Verificar se uma nova mensagem chegou (contagem aumentou)
      const newMessageArrived = currentCount > previousCount;

      if (newMessageArrived && currentCount > 0) {
        // Verificar se o chat não está em foco
        const chatInFocus = isChatWindowInFocus(openChat.roomId);

        // Se não estiver em foco, fazer scroll automático
        if (!chatInFocus) {
          console.log(
            '📜 [ChatWindows] Nova mensagem chegou e chat não está em foco, fazendo scroll automático...'
          );
          setTimeout(() => scrollToBottom(openChat.roomId), 100);
        }

        // Atualizar contagem anterior
        previousMessagesCount.current[openChat.roomId] = currentCount;

        // Marcar como lido quando houver mensagens
        markAsRead(openChat.roomId).catch(console.error);
      } else if (currentCount > 0) {
        // Atualizar contagem mesmo se não houver nova mensagem (para evitar scroll desnecessário)
        previousMessagesCount.current[openChat.roomId] = currentCount;
      }
    });
  }, [messages, openChats, markAsRead, hasChatModule, isChatWindowInFocus]);

  // Fechar chat
  const handleCloseChat = useCallback(
    (roomId: string, event?: React.MouseEvent) => {
      // Prevenir propagação do evento se fornecido
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      setOpenChats(prev => {
        // Garantir que apenas remove a janela específica
        const filtered = prev.filter(chat => chat.roomId !== roomId);
        console.log(
          `🗑️ [ChatWindows] Fechando janela: ${roomId}, restam ${filtered.length} janela(s)`
        );

        // Disparar evento para o FloatingChatButton saber que uma janela foi fechada
        if (filtered.length === 0) {
          window.dispatchEvent(new CustomEvent('all-chat-windows-closed'));
        }

        return filtered;
      });

      setMessageInputs(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
      // Limpar preview de imagem se existir
      if (imagePreviews[roomId]) {
        URL.revokeObjectURL(imagePreviews[roomId]);
      }
      setSelectedImages(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
      setSelectedFiles(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
      setImagePreviews(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
      // Limpar estado de visualização de arquivadas
      setShowArchivedMessages(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
    },
    [imagePreviews]
  );

  // Minimizar/Maximizar chat
  const handleToggleMinimize = (roomId: string) => {
    setOpenChats(prev =>
      prev.map(chat =>
        chat.roomId === roomId
          ? { ...chat, isMinimized: !chat.isMinimized, lastOpened: Date.now() }
          : chat
      )
    );
  };

  // Enviar mensagem
  const handleSendMessage = async (roomId: string) => {
    const content = messageInputs[roomId]?.trim() || '';
    const image = selectedImages[roomId];
    const file = selectedFiles[roomId];
    const fileToSend = image || file; // Priorizar imagem se ambas existirem

    // Deve ter conteúdo ou arquivo
    if (!content && !fileToSend) return;

    if (content.length > 5000) {
      return;
    }

    console.log('📤 [ChatWindows] Enviando mensagem:', {
      roomId,
      contentLength: content.length,
      hasImage: !!image,
      hasFile: !!file,
    });

    // Guardar referências antes do envio para garantir limpeza
    const previewToRevoke = imagePreviews[roomId];

    try {
      await sendMessage(
        roomId,
        content || (image ? '📷' : file ? '📎' : ''),
        fileToSend
      );

      // Limpar inputs após envio bem-sucedido
      setMessageInputs(prev => ({ ...prev, [roomId]: '' }));

      // Limpar arquivo selecionado e preview
      if (fileToSend && previewToRevoke) {
        URL.revokeObjectURL(previewToRevoke);
      }

      // Sempre limpar, mesmo se não houver preview
      setSelectedImages(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
      setSelectedFiles(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });
      setImagePreviews(prev => {
        const updated = { ...prev };
        delete updated[roomId];
        return updated;
      });

      // Limpar inputs de arquivo
      if (imageInputRefs.current[roomId]) {
        imageInputRefs.current[roomId].value = '';
      }
      if (fileInputRefs.current[roomId]) {
        fileInputRefs.current[roomId].value = '';
      }

      // Auto-resize textarea
      const textarea = document.querySelector(
        `textarea[data-room-id="${roomId}"]`
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }

      // Scroll para o final após enviar
      setTimeout(() => scrollToBottom(roomId), 100);
    } catch (error) {
      console.error('❌ [ChatWindows] Erro ao enviar mensagem:', error);

      // Mesmo em caso de erro, limpar o arquivo se foi enviado
      // (o arquivo pode ter sido enviado mas a resposta falhou)
      if (fileToSend) {
        if (previewToRevoke) {
          URL.revokeObjectURL(previewToRevoke);
        }
        setSelectedImages(prev => {
          const updated = { ...prev };
          delete updated[roomId];
          return updated;
        });
        setSelectedFiles(prev => {
          const updated = { ...prev };
          delete updated[roomId];
          return updated;
        });
        setImagePreviews(prev => {
          const updated = { ...prev };
          delete updated[roomId];
          return updated;
        });
        if (imageInputRefs.current[roomId]) {
          imageInputRefs.current[roomId].value = '';
        }
        if (fileInputRefs.current[roomId]) {
          fileInputRefs.current[roomId].value = '';
        }
      }
    }
  };

  // Selecionar imagem
  const handleImageSelect = (
    roomId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar apenas imagens
    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const fileName = file.name.toLowerCase();
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = validImageExtensions.some(ext =>
      fileName.endsWith(ext)
    );

    const isEmptyOrGenericType =
      !file.type ||
      file.type === 'application/octet-stream' ||
      file.type === '';

    if (
      !isEmptyOrGenericType &&
      !validImageTypes.includes(file.type) &&
      !hasValidExtension
    ) {
      alert(
        'Tipo de arquivo inválido. Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.'
      );
      return;
    }

    if (isEmptyOrGenericType && !hasValidExtension) {
      alert(
        'Tipo de arquivo inválido. Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.'
      );
      return;
    }

    // Validar tamanho (5MB para imagens)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Imagem muito grande. Tamanho máximo: 5MB.');
      return;
    }

    // Criar preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({ ...prev, [roomId]: previewUrl }));
    setSelectedImages(prev => ({ ...prev, [roomId]: file }));

    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (imageInputRefs.current[roomId]) {
      imageInputRefs.current[roomId].value = '';
    }
  };

  // Selecionar documento
  const handleFileSelect = (
    roomId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar apenas documentos (não imagens)
    const validDocumentTypes = [
      'application/pdf', // PDF
      'text/csv', // CSV
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'application/vnd.ms-excel', // XLS
      'application/xml', // XML
      'text/xml', // XML
      'application/msword', // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'text/plain', // TXT
    ];

    // Não permitir imagens aqui
    if (file.type.startsWith('image/')) {
      alert('Use o botão de imagem para anexar imagens.');
      return;
    }

    const fileName = file.name.toLowerCase();
    const validDocumentExtensions = [
      '.pdf',
      '.csv',
      '.xlsx',
      '.xls',
      '.xml',
      '.doc',
      '.docx',
      '.txt',
    ];
    const hasValidExtension = validDocumentExtensions.some(ext =>
      fileName.endsWith(ext)
    );

    const isEmptyOrGenericType =
      !file.type ||
      file.type === 'application/octet-stream' ||
      file.type === '';

    if (
      !isEmptyOrGenericType &&
      !validDocumentTypes.includes(file.type) &&
      !hasValidExtension
    ) {
      alert(
        'Tipo de arquivo inválido. Apenas PDF, CSV, XLSX, XML, DOC, DOCX e TXT são permitidos.'
      );
      return;
    }

    if (isEmptyOrGenericType && !hasValidExtension) {
      alert(
        'Tipo de arquivo inválido. Apenas PDF, CSV, XLSX, XML, DOC, DOCX e TXT são permitidos.'
      );
      return;
    }

    // Validar tamanho (10MB para documentos)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB.');
      return;
    }

    // Salvar documento (sem preview de imagem)
    setSelectedFiles(prev => ({ ...prev, [roomId]: file }));

    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRefs.current[roomId]) {
      fileInputRefs.current[roomId].value = '';
    }
  };

  // Remover imagem selecionada
  const handleRemoveImage = (roomId: string) => {
    if (imagePreviews[roomId]) {
      URL.revokeObjectURL(imagePreviews[roomId]);
    }
    setSelectedImages(prev => {
      const updated = { ...prev };
      delete updated[roomId];
      return updated;
    });
    setImagePreviews(prev => {
      const updated = { ...prev };
      delete updated[roomId];
      return updated;
    });
    if (imageInputRefs.current[roomId]) {
      imageInputRefs.current[roomId].value = '';
    }
  };

  // Remover documento selecionado
  const handleRemoveFile = (roomId: string) => {
    setSelectedFiles(prev => {
      const updated = { ...prev };
      delete updated[roomId];
      return updated;
    });
    if (fileInputRefs.current[roomId]) {
      fileInputRefs.current[roomId].value = '';
    }
  };

  // Formatar tamanho de arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Obter ícone do documento
  const getDocumentIcon = (fileName: string, fileType?: string) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.pdf') || fileType === 'application/pdf') {
      return <MdPictureAsPdf size={24} />;
    }
    if (lowerName.endsWith('.csv') || fileType === 'text/csv') {
      return <MdDescription size={24} />;
    }
    if (lowerName.endsWith('.xml') || fileType?.includes('xml')) {
      return <MdCode size={24} />;
    }
    if (
      lowerName.endsWith('.doc') ||
      lowerName.endsWith('.docx') ||
      fileType?.includes('word')
    ) {
      return <MdDescription size={24} />;
    }
    if (
      lowerName.endsWith('.xls') ||
      lowerName.endsWith('.xlsx') ||
      fileType?.includes('excel') ||
      fileType?.includes('spreadsheet')
    ) {
      return <MdInsertDriveFile size={24} />;
    }
    if (lowerName.endsWith('.txt') || fileType === 'text/plain') {
      return <MdDescription size={24} />;
    }
    return <MdInsertDriveFile size={24} />;
  };

  // Adicionar emoji ao input
  const handleEmojiSelect = (roomId: string, emoji: string) => {
    setMessageInputs(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || '') + emoji,
    }));
  };

  // Auto-resize textarea
  const handleInputChange = (roomId: string, value: string) => {
    setMessageInputs(prev => ({ ...prev, [roomId]: value }));
    const textarea = document.querySelector(
      `textarea[data-room-id="${roomId}"]`
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
    }
  };

  // Navegar para a página de chat específica
  const handleNavigateToChat = useCallback(
    (roomId: string) => {
      // Navegar para a página de chat com roomId na URL
      navigate(`/chat/${roomId}`);
    },
    [navigate]
  );

  // Verificar se mensagem pode ser deletada (máximo 5 minutos)
  const canDeleteMessage = useCallback(
    (message: ChatMessage): boolean => {
      if (message.senderId !== currentUser?.id) {
        return false; // Apenas o autor pode deletar
      }

      const messageDate = new Date(message.createdAt);
      const now = new Date();
      const diffInMinutes =
        (now.getTime() - messageDate.getTime()) / (1000 * 60);

      return diffInMinutes <= 5; // Apenas mensagens com até 5 minutos
    },
    [currentUser?.id]
  );

  // Deletar mensagem
  const handleDeleteMessage = useCallback(
    async (roomId: string, messageId: string) => {
      try {
        // Buscar a mensagem para validar
        const roomMessages = messages[roomId] || [];
        const message = roomMessages.find(m => m.id === messageId);
        if (!message) {
          console.error('Mensagem não encontrada');
          return;
        }

        // Validar se pode deletar (já é validado no useChat, mas verificar aqui também)
        if (!canDeleteMessage(message)) {
          alert(
            'Mensagens só podem ser deletadas dentro de 5 minutos após o envio'
          );
          return;
        }

        await deleteMessage(messageId);
        console.log('Mensagem deletada com sucesso');
      } catch (err: any) {
        console.error('Erro ao deletar mensagem:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao deletar mensagem';
        if (errorMessage.includes('5 minutos')) {
          alert(
            'Mensagens só podem ser deletadas dentro de 5 minutos após o envio'
          );
        } else {
          alert(errorMessage);
        }
      }
    },
    [messages, canDeleteMessage, deleteMessage]
  );

  // Reconectar manualmente
  const handleReconnect = useCallback(async () => {
    if (isReconnecting) return;

    setIsReconnecting(true);
    try {
      // Desconectar e reconectar
      chatSocketService.disconnect();
      await new Promise(resolve => setTimeout(resolve, 500));

      const companyId = localStorage.getItem('dream_keys_selected_company_id');
      if (companyId) {
        chatSocketService.connect(companyId);
      }
    } catch (error) {
      console.error('❌ [ChatWindows] Erro ao reconectar:', error);
    } finally {
      setTimeout(() => setIsReconnecting(false), 2000);
    }
  }, [isReconnecting]);

  // REMOVIDO: Lógica de reconexão automática
  // A reconexão agora é gerenciada exclusivamente pelo chatSocketService
  // para evitar loops de reconexão e múltiplas tentativas simultâneas

  // Verificar se o módulo de chat está disponível - DEVE SER DEPOIS DE TODOS OS HOOKS
  if (!hasChatModule) {
    return null;
  }

  // Não renderizar cards flutuantes quando estiver na tela de chat dedicada
  if (isOnChatPage) {
    return null;
  }

  // Ordenar chats: minimizados primeiro, depois por último aberto
  const sortedChats = [...openChats].sort((a, b) => {
    if (a.isMinimized !== b.isMinimized) {
      return a.isMinimized ? -1 : 1;
    }
    return b.lastOpened - a.lastOpened;
  });

  // Em mobile, mostrar apenas a janela mais recente não minimizada + todas minimizadas
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const displayChats =
    isMobile && sortedChats.length > 1
      ? sortedChats
          .filter(chat => !chat.isMinimized)
          .slice(0, 1)
          .concat(sortedChats.filter(chat => chat.isMinimized))
      : sortedChats;

  // Função helper para verificar se o usuário é participante ativo
  const isUserActiveParticipant = (room: ChatRoom | null): boolean => {
    if (!room || !currentUser?.id) return true; // Se não houver sala ou usuário, permitir (pode ser suporte)

    // Para grupos, verificar se o usuário é participante ativo
    if (room.type === 'group') {
      const participant = room.participants.find(
        p => p.userId === currentUser.id
      );
      return participant?.isActive ?? false;
    }

    // Para chat direto e suporte, sempre permitir
    return true;
  };

  return (
    <ChatWindowsContainer>
      {displayChats.map((openChat, index) => {
        const room = getRoomData(openChat.roomId);
        if (!room) return null;

        const roomMessages = getRoomMessages(openChat.roomId);
        const unread = getUnreadCount(openChat.roomId);
        const displayName = getRoomDisplayName(room, currentUser?.id);
        const isActiveParticipant = isUserActiveParticipant(room);

        return (
          <ChatWindow
            key={openChat.roomId}
            $isMinimized={openChat.isMinimized}
            $zIndex={1000 + index}
            data-chat-room-id={openChat.roomId}
          >
            <ChatWindowHeader
              $hasUnread={unread > 0}
              onClick={() => {
                if (openChat.isMinimized) {
                  // Se está minimizado, maximizar e remover notificação
                  handleToggleMinimize(openChat.roomId);
                } else {
                  handleToggleMinimize(openChat.roomId);
                }
              }}
            >
              <ChatWindowHeaderInfo
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleNavigateToChat(openChat.roomId);
                }}
                title='Clique para abrir na página de chat'
                style={{ cursor: 'pointer' }}
              >
                <ChatWindowAvatar
                  $type={room.type}
                  $hasImage={
                    !!(room.imageUrl || getRoomAvatar(room, currentUser?.id))
                  }
                >
                  {room.imageUrl ? (
                    <img
                      src={room.imageUrl}
                      alt={displayName}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : getRoomAvatar(room, currentUser?.id) ? (
                    <img
                      src={getRoomAvatar(room, currentUser?.id)!}
                      alt={displayName}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : room.type === 'direct' ? (
                    getUserInitials(displayName)
                  ) : (
                    getRoomIcon(room.type)
                  )}
                </ChatWindowAvatar>
                <ChatWindowHeaderText>
                  <ChatWindowTitle>{displayName}</ChatWindowTitle>
                  {openChat.isMinimized && room.lastMessage && (
                    <ChatWindowSubtitle>{room.lastMessage}</ChatWindowSubtitle>
                  )}
                </ChatWindowHeaderText>
                {unread > 0 && (
                  <UnreadBadge>{unread > 99 ? '99+' : unread}</UnreadBadge>
                )}
              </ChatWindowHeaderInfo>
              <ChatWindowActions onClick={e => e.stopPropagation()}>
                <ConnectionStatus $connected={connected}>
                  {connected ? <MdWifi size={14} /> : <MdWifiOff size={14} />}
                </ConnectionStatus>
                {!connected && (
                  <ReconnectButton
                    onClick={handleReconnect}
                    title='Reconectar'
                    disabled={isReconnecting}
                  >
                    <MdRefresh
                      size={16}
                      style={
                        isReconnecting
                          ? {
                              animation: 'spin 1s linear infinite',
                            }
                          : {}
                      }
                    />
                  </ReconnectButton>
                )}
                {/* Botão de Mensagens Arquivadas */}
                {getArchivedCountForRoom(openChat.roomId) > 0 && (
                  <ChatWindowButton
                    onClick={e => {
                      e.stopPropagation();
                      setShowArchivedMessages(prev => ({
                        ...prev,
                        [openChat.roomId]: !prev[openChat.roomId],
                      }));
                    }}
                    title={
                      showArchivedMessages[openChat.roomId]
                        ? 'Ver mensagens ativas'
                        : `Ver mensagens arquivadas (${getArchivedCountForRoom(openChat.roomId)})`
                    }
                    style={{
                      background: showArchivedMessages[openChat.roomId]
                        ? 'rgba(0, 0, 0, 0.2)'
                        : 'transparent',
                      opacity: showArchivedMessages[openChat.roomId] ? 1 : 0.8,
                    }}
                  >
                    <MdArchive size={18} />
                  </ChatWindowButton>
                )}
                <ChatWindowButton
                  onClick={() => {
                    handleToggleMinimize(openChat.roomId);
                  }}
                  title={openChat.isMinimized ? 'Maximizar' : 'Minimizar'}
                >
                  {openChat.isMinimized ? (
                    <MdExpandLess size={18} />
                  ) : (
                    <MdExpandMore size={18} />
                  )}
                </ChatWindowButton>
                <ChatWindowButton
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleCloseChat(openChat.roomId, e);
                  }}
                  title='Fechar'
                >
                  <MdClose size={18} />
                </ChatWindowButton>
              </ChatWindowActions>
            </ChatWindowHeader>

            {!openChat.isMinimized && (
              <ChatWindowContent>
                <ChatMessagesArea>
                  {/* Indicador de visualização de arquivadas */}
                  {showArchivedMessages[openChat.roomId] &&
                    getArchivedCountForRoom(openChat.roomId) > 0 && (
                      <div
                        style={{
                          padding: '8px 12px',
                          background: 'var(--theme-primary)10',
                          border: '1px solid var(--theme-primary)',
                          borderRadius: '6px',
                          margin: '8px 12px',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          color: 'var(--theme-primary)',
                        }}
                      >
                        <MdArchive size={14} />
                        <span>
                          Visualizando{' '}
                          {getArchivedCountForRoom(openChat.roomId)}{' '}
                          arquivada(s)
                        </span>
                        <button
                          onClick={() =>
                            setShowArchivedMessages(prev => ({
                              ...prev,
                              [openChat.roomId]: false,
                            }))
                          }
                          style={{
                            marginLeft: '6px',
                            padding: '2px 6px',
                            background: 'transparent',
                            border: '1px solid var(--theme-primary)',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            color: 'var(--theme-primary)',
                            fontSize: '0.7rem',
                          }}
                        >
                          Voltar
                        </button>
                      </div>
                    )}
                  {roomMessages.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'var(--theme-text-secondary)',
                        padding: '20px',
                        fontSize: '0.875rem',
                      }}
                    >
                      {showArchivedMessages[openChat.roomId]
                        ? 'Nenhuma mensagem arquivada.'
                        : 'Nenhuma mensagem ainda. Comece a conversar!'}
                    </div>
                  ) : (
                    roomMessages.map((message: ChatMessage) => {
                      const isOwn = message.senderId === currentUser?.id;
                      const isGroup = room.type === 'group';
                      const showAvatar = isGroup && !isOwn;

                      return (
                        <ChatMessage
                          key={message.id}
                          $isOwn={isOwn}
                          $isGroup={isGroup}
                        >
                          {showAvatar && (
                            <ChatMessageAvatar
                              $hasImage={!!message.senderAvatar}
                            >
                              {message.senderAvatar ? (
                                <img
                                  src={message.senderAvatar}
                                  alt={message.senderName}
                                />
                              ) : (
                                getUserInitials(message.senderName)
                              )}
                            </ChatMessageAvatar>
                          )}
                          <ChatMessageWrapper
                            $isOwn={isOwn}
                            $hasAvatar={showAvatar}
                          >
                            {!isOwn && (
                              <ChatMessageSender>
                                {message.senderName}
                              </ChatMessageSender>
                            )}
                            <ChatMessageContent
                              $isOwn={isOwn}
                              onMouseEnter={() =>
                                setHoveringMessageIds(prev => ({
                                  ...prev,
                                  [openChat.roomId]: message.id,
                                }))
                              }
                              onMouseLeave={() =>
                                setHoveringMessageIds(prev => {
                                  const updated = { ...prev };
                                  if (updated[openChat.roomId] === message.id) {
                                    delete updated[openChat.roomId];
                                  }
                                  return updated;
                                })
                              }
                              style={{ position: 'relative' }}
                            >
                              {/* Botões de ação (deletar e arquivar) */}
                              {hoveringMessageIds[openChat.roomId] ===
                                message.id && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    display: 'flex',
                                    gap: '4px',
                                    zIndex: 10,
                                  }}
                                >
                                  {/* Botão de deletar (apenas para mensagens próprias e dentro de 5 minutos) */}
                                  {isOwn && canDeleteMessage(message) && (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleDeleteMessage(
                                          openChat.roomId,
                                          message.id
                                        );
                                      }}
                                      style={{
                                        background: 'rgba(220, 38, 38, 0.9)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                      title='Deletar mensagem (apenas até 5 minutos após o envio)'
                                    >
                                      <MdDelete size={14} />
                                    </button>
                                  )}
                                  {/* Botão de arquivar/desarquivar */}
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      const isViewingArchived =
                                        showArchivedMessages[openChat.roomId] ||
                                        false;
                                      if (isViewingArchived) {
                                        unarchiveMessage(
                                          openChat.roomId,
                                          message.id
                                        );
                                      } else {
                                        archiveMessage(
                                          openChat.roomId,
                                          message.id
                                        );
                                      }
                                    }}
                                    style={{
                                      background:
                                        showArchivedMessages[openChat.roomId] ||
                                        false
                                          ? 'rgba(34, 197, 94, 0.9)'
                                          : 'rgba(107, 114, 128, 0.9)',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      color: 'white',
                                      fontSize: '12px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                    title={
                                      showArchivedMessages[openChat.roomId] ||
                                      false
                                        ? 'Desarquivar mensagem'
                                        : 'Arquivar mensagem'
                                    }
                                  >
                                    {showArchivedMessages[openChat.roomId] ||
                                    false ? (
                                      <MdUnarchive size={14} />
                                    ) : (
                                      <MdArchive size={14} />
                                    )}
                                  </button>
                                </div>
                              )}

                              {/* Exibir imagem anexada */}
                              {(message.documentUrl ||
                                message.fileUrl ||
                                message.imageUrl) && (
                                <>
                                  {message.documentMimeType?.startsWith(
                                    'image/'
                                  ) ||
                                  message.fileType?.startsWith('image/') ||
                                  message.imageUrl ? (
                                    <ChatMessageImageContainer>
                                      <ChatMessageImage
                                        src={
                                          message.documentUrl ||
                                          message.fileUrl ||
                                          message.imageUrl
                                        }
                                        alt='Imagem anexada'
                                        onClick={() =>
                                          window.open(
                                            message.documentUrl ||
                                              message.fileUrl ||
                                              message.imageUrl,
                                            '_blank'
                                          )
                                        }
                                      />
                                      <ChatMessageImageDownloadButton
                                        onClick={e => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          const url =
                                            message.documentUrl ||
                                            message.fileUrl ||
                                            message.imageUrl;
                                          if (url) {
                                            const link =
                                              document.createElement('a');
                                            link.href = url;
                                            link.download =
                                              message.documentName ||
                                              message.fileName ||
                                              'imagem';
                                            link.style.display = 'none';
                                            document.body.appendChild(link);
                                            link.click();
                                            setTimeout(() => {
                                              document.body.removeChild(link);
                                            }, 100);
                                          }
                                        }}
                                        title='Baixar imagem'
                                      >
                                        <MdDownload size={18} />
                                      </ChatMessageImageDownloadButton>
                                    </ChatMessageImageContainer>
                                  ) : (
                                    /* Exibir documento anexado */
                                    <ChatMessageFile
                                      onClick={() =>
                                        window.open(
                                          message.documentUrl ||
                                            message.fileUrl ||
                                            message.imageUrl,
                                          '_blank'
                                        )
                                      }
                                    >
                                      <ChatMessageFileIcon>
                                        {message.documentMimeType ===
                                          'application/pdf' ||
                                        message.fileType ===
                                          'application/pdf' ? (
                                          <MdPictureAsPdf size={24} />
                                        ) : message.documentMimeType?.includes(
                                            'excel'
                                          ) ||
                                          message.documentMimeType?.includes(
                                            'spreadsheet'
                                          ) ||
                                          message.fileType?.includes('excel') ||
                                          message.fileType?.includes(
                                            'spreadsheet'
                                          ) ? (
                                          <MdInsertDriveFile size={24} />
                                        ) : message.documentMimeType?.includes(
                                            'csv'
                                          ) ||
                                          message.fileType?.includes('csv') ? (
                                          <MdDescription size={24} />
                                        ) : message.documentMimeType?.includes(
                                            'xml'
                                          ) ||
                                          message.fileType?.includes('xml') ? (
                                          <MdCode size={24} />
                                        ) : (
                                          <MdInsertDriveFile size={24} />
                                        )}
                                      </ChatMessageFileIcon>
                                      <ChatMessageFileInfo>
                                        <ChatMessageFileName>
                                          {message.documentName ||
                                            message.fileName ||
                                            'Arquivo anexado'}
                                        </ChatMessageFileName>
                                        {(message.documentMimeType ||
                                          message.fileType) && (
                                          <ChatMessageFileSize>
                                            {(
                                              message.documentMimeType ||
                                              message.fileType
                                            )
                                              ?.split('/')[1]
                                              ?.toUpperCase() || 'Arquivo'}
                                          </ChatMessageFileSize>
                                        )}
                                      </ChatMessageFileInfo>
                                      <ChatMessageFileActions>
                                        <ChatMessageFileButton
                                          onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const url =
                                              message.documentUrl ||
                                              message.fileUrl ||
                                              message.imageUrl;
                                            if (url) {
                                              const link =
                                                document.createElement('a');
                                              link.href = url;
                                              link.download =
                                                message.documentName ||
                                                message.fileName ||
                                                'arquivo';
                                              link.style.display = 'none';
                                              document.body.appendChild(link);
                                              link.click();
                                              setTimeout(() => {
                                                document.body.removeChild(link);
                                              }, 100);
                                            }
                                          }}
                                          title='Baixar arquivo'
                                        >
                                          <MdDownload size={20} />
                                        </ChatMessageFileButton>
                                      </ChatMessageFileActions>
                                    </ChatMessageFile>
                                  )}
                                </>
                              )}
                              {message.content && <div>{message.content}</div>}
                            </ChatMessageContent>
                            <ChatMessageTime $isOwn={isOwn}>
                              {formatMessageTime(message.createdAt)}
                              {isOwn && (
                                <span
                                  style={{
                                    marginLeft: '4px',
                                    opacity: 0.7,
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  {message.status === 'sending'
                                    ? '⏳'
                                    : message.status === 'read'
                                      ? '✓✓'
                                      : message.status === 'delivered'
                                        ? '✓✓'
                                        : '✓'}
                                </span>
                              )}
                            </ChatMessageTime>
                          </ChatMessageWrapper>
                        </ChatMessage>
                      );
                    })
                  )}
                  <div
                    ref={el => {
                      if (el) messagesEndRefs.current[openChat.roomId] = el;
                    }}
                  />
                </ChatMessagesArea>

                <ChatInputArea data-input-area>
                  {/* Preview de imagem */}
                  {imagePreviews[openChat.roomId] && (
                    <ImagePreviewContainer>
                      <ImagePreview
                        src={imagePreviews[openChat.roomId]}
                        alt='Preview'
                      />
                      <RemoveImageButton
                        onClick={() => handleRemoveImage(openChat.roomId)}
                      >
                        <MdCloseIcon size={16} />
                      </RemoveImageButton>
                    </ImagePreviewContainer>
                  )}

                  {/* Preview de documento */}
                  {selectedFiles[openChat.roomId] &&
                    !imagePreviews[openChat.roomId] && (
                      <DocumentPreviewContainer>
                        <DocumentPreviewIcon>
                          {getDocumentIcon(
                            selectedFiles[openChat.roomId].name,
                            selectedFiles[openChat.roomId].type
                          )}
                        </DocumentPreviewIcon>
                        <DocumentPreviewInfo>
                          <DocumentPreviewName>
                            {selectedFiles[openChat.roomId].name}
                          </DocumentPreviewName>
                          <DocumentPreviewSize>
                            {formatFileSize(
                              selectedFiles[openChat.roomId].size
                            )}
                          </DocumentPreviewSize>
                        </DocumentPreviewInfo>
                        <RemoveDocumentButton
                          onClick={() => handleRemoveFile(openChat.roomId)}
                        >
                          <MdCloseIcon size={14} />
                        </RemoveDocumentButton>
                      </DocumentPreviewContainer>
                    )}

                  <ChatInputContainer>
                    <EmojiPicker
                      onEmojiSelect={emoji =>
                        handleEmojiSelect(openChat.roomId, emoji)
                      }
                    />

                    {/* Botão para anexar imagens */}
                    <ImageInputWrapper>
                      <input
                        ref={el => {
                          if (el) imageInputRefs.current[openChat.roomId] = el;
                        }}
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={e => handleImageSelect(openChat.roomId, e)}
                      />
                      <ImageAttachButton
                        onClick={() =>
                          imageInputRefs.current[openChat.roomId]?.click()
                        }
                        title='Anexar imagem'
                        type='button'
                        disabled={!isActiveParticipant}
                      >
                        <MdImage size={20} />
                      </ImageAttachButton>
                    </ImageInputWrapper>

                    {/* Botão para anexar documentos */}
                    <ImageInputWrapper>
                      <input
                        ref={el => {
                          if (el) fileInputRefs.current[openChat.roomId] = el;
                        }}
                        type='file'
                        accept='.pdf,.csv,.xlsx,.xls,.xml,.doc,.docx,.txt'
                        style={{ display: 'none' }}
                        onChange={e => handleFileSelect(openChat.roomId, e)}
                        disabled={!isActiveParticipant}
                      />
                      <ImageAttachButton
                        onClick={() =>
                          fileInputRefs.current[openChat.roomId]?.click()
                        }
                        title='Anexar documento'
                        type='button'
                        disabled={!isActiveParticipant}
                      >
                        <MdDescription size={20} />
                      </ImageAttachButton>
                    </ImageInputWrapper>

                    <ChatInput
                      data-room-id={openChat.roomId}
                      value={messageInputs[openChat.roomId] || ''}
                      onChange={e =>
                        handleInputChange(openChat.roomId, e.target.value)
                      }
                      onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(openChat.roomId);
                        }
                      }}
                      placeholder={
                        isActiveParticipant
                          ? 'Digite sua mensagem...'
                          : 'Você foi removido deste grupo'
                      }
                      rows={1}
                      maxLength={5000}
                      disabled={!isActiveParticipant}
                    />
                    <ChatSendButton
                      onClick={() => handleSendMessage(openChat.roomId)}
                      disabled={
                        !isActiveParticipant ||
                        (!messageInputs[openChat.roomId]?.trim() &&
                          !selectedImages[openChat.roomId] &&
                          !selectedFiles[openChat.roomId])
                      }
                      title={
                        isActiveParticipant
                          ? 'Enviar mensagem'
                          : 'Você foi removido deste grupo'
                      }
                    >
                      <MdSend size={18} />
                    </ChatSendButton>
                  </ChatInputContainer>
                </ChatInputArea>
              </ChatWindowContent>
            )}
          </ChatWindow>
        );
      })}
    </ChatWindowsContainer>
  );
};
