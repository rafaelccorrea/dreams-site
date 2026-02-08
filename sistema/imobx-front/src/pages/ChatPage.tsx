import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ParticipantsListModal } from '../components/modals/ParticipantsListModal';
import { GroupHistoryModal } from '../components/modals/GroupHistoryModal';
import {
  ChatPageContainer,
  ChatSidebar,
  ChatSidebarHeader,
  ChatSidebarTitle,
  NewChatButton,
  ChatSearchContainer,
  ChatSearchWrapper,
  ChatSearchInput,
  ChatRoomsList,
  ChatRoomItem,
  ChatRoomHeader,
  ChatRoomAvatar,
  ChatRoomInfo,
  ChatRoomName,
  ChatRoomLastMessage,
  ChatRoomMeta,
  ChatRoomTime,
  ChatRoomUnread,
  ChatSectionTitle,
  ChatUsersList,
  ChatUserItem,
  ChatUserAvatar,
  ChatUserInfo,
  ChatUserName,
  ChatUserRole,
  ChatMainArea,
  ChatHeader,
  ChatHeaderInfo,
  ChatHeaderAvatar,
  ChatHeaderName,
  ChatHeaderParticipants,
  ChatHeaderActions,
  ChatHeaderButton,
  ChatMessagesArea,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageWrapper,
  ChatMessageContent,
  ChatMessageInfo,
  ChatMessageSender,
  ChatMessageTime,
  ChatMessageStatus,
  ChatMessageTimeWrapper,
  ChatInputArea,
  ChatInputContainer,
  ChatInput,
  ChatSendButton,
  ImagePreviewContainer,
  ImagePreview,
  RemoveImageButton,
  DocumentPreviewContainer,
  DocumentPreviewIcon,
  DocumentPreviewInfo,
  DocumentPreviewName,
  DocumentPreviewSize,
  RemoveDocumentButton,
  ImageInputWrapper,
  ImageAttachButton,
  ChatEmptyState,
  ChatEmptyIcon,
  ChatEmptyTitle,
  ChatEmptyMessage,
  ChatLoadingState,
  ChatErrorState,
  ChatConnectionStatus,
  ChatBackButton,
  GroupIcon,
  PersonIcon,
  SupportIcon,
  SendIcon,
  AddIcon,
  ChatMessageFile,
  ChatMessageFileIcon,
  ChatMessageFileInfo,
  ChatMessageFileName,
  ChatMessageFileSize,
  ChatMessageFileActions,
  ChatMessageFileButton,
  ChatMessageImageContainer,
  ChatMessageImageDownloadButton,
  ChatSystemMessage,
} from '../styles/pages/ChatPageStyles';
import type {
  ChatRoom,
  ChatMessage as ChatMessageType,
  CompanyUser,
} from '../types/chat';
import { CreateDirectChatModal } from '../components/modals/CreateDirectChatModal';
import { CreateGroupChatModal } from '../components/modals/CreateGroupChatModal';
import { EmojiPicker } from '../components/chat/EmojiPicker';
import { chatApi } from '../services/chatApi';
import { translateUserRole } from '../utils/roleTranslations';
import { useArchivedMessages } from '../hooks/useArchivedMessages';
import {
  MdGroup,
  MdClose as MdCloseIcon,
  MdOpenInNew,
  MdCheckCircle,
  MdArrowBack,
  MdDownload,
  MdPictureAsPdf,
  MdInsertDriveFile,
  MdImage,
  MdDescription,
  MdDelete,
  MdCode,
  MdEdit,
  MdArchive,
  MdHistory,
  MdUnarchive,
} from 'react-icons/md';

const getRoomDisplayName = (room: ChatRoom, currentUserId?: string): string => {
  if (room.name) {
    return room.name;
  }

  if (room.type === 'support') {
    return 'Suporte';
  }

  if (room.type === 'direct') {
    const otherParticipant = room.participants.find(
      p => p.userId !== currentUserId
    );
    return otherParticipant?.userName || 'Usuário';
  }

  return 'Chat';
};

const getRoomIcon = (type: 'direct' | 'group' | 'support') => {
  switch (type) {
    case 'group':
      return <GroupIcon />;
    case 'support':
      return <SupportIcon />;
    default:
      return <PersonIcon />;
  }
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

const formatMessageTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
  } catch {
    return '';
  }
};

const formatMessageTimeShort = (date: Date | string): string => {
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

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    rooms,
    archivedRooms,
    messages,
    currentRoom,
    loading,
    loadingMessages,
    error,
    connected,
    createOrGetRoom,
    joinRoom,
    sendMessage,
    markAsRead,
    deleteMessage,
    archiveRoom,
    unarchiveRoom,
    removeParticipant,
    leaveRoom,
    setCurrentRoom,
    getRoomHistory,
  } = useChat();

  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const {
    archiveMessage,
    unarchiveMessage,
    isMessageArchived,
    getArchivedCount,
    filterArchivedMessages,
    getArchivedMessages,
  } = useArchivedMessages();

  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [openingWindow, setOpeningWindow] = useState<string | null>(null); // Track which room is opening in window
  const [showSidebar, setShowSidebar] = useState(true); // Control sidebar visibility on mobile
  const [hoveringMessageId, setHoveringMessageId] = useState<string | null>(
    null
  ); // Track which message is being hovered
  const [showArchivedMessages, setShowArchivedMessages] = useState(false); // Control showing archived messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesLoadingRef = useRef<Record<string, boolean>>({});
  const previousMessagesCountRef = useRef<number>(0); // Rastrear contagem anterior de mensagens

  // Carregar usuários da empresa
  const loadCompanyUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const users = await chatApi.getCompanyUsers();
      // Ordenar: online primeiro, depois por nome
      const sortedUsers = users.sort((a, b) => {
        if (a.isOnline !== b.isOnline) {
          return a.isOnline ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      setCompanyUsers(sortedUsers);
    } catch (err) {
      console.error('Erro ao carregar usuários da empresa:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Filtrar e ordenar salas (suporte sempre primeiro)
  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    // Aplicar filtro de busca se houver
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = rooms.filter(room => {
        const name = getRoomDisplayName(room, currentUser?.id).toLowerCase();
        const lastMessage = room.lastMessage?.toLowerCase() || '';
        return name.includes(query) || lastMessage.includes(query);
      });
    }

    // Ordenar: suporte sempre primeiro, depois por última mensagem (mais recente primeiro)
    return filtered.sort((a, b) => {
      // Suporte sempre primeiro
      if (a.type === 'support' && b.type !== 'support') return -1;
      if (a.type !== 'support' && b.type === 'support') return 1;

      // Se ambos são suporte ou nenhum é, ordenar por última mensagem
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime; // Mais recente primeiro
    });
  }, [rooms, searchQuery, currentUser?.id]);

  // Verificar se existe sala de suporte
  const hasSupportRoom = useMemo(() => {
    return rooms.some(room => room.type === 'support');
  }, [rooms]);

  // Selecionar sala
  const handleSelectRoom = useCallback(
    async (roomId: string) => {
      if (roomId === currentRoom) {
        return;
      }

      try {
        console.log('🔵 [ChatPage] Selecionando sala:', roomId);
        // Não aguardar - joinRoom agora abre o chat imediatamente e carrega mensagens em background
        joinRoom(roomId).catch(err => {
          console.error('❌ [ChatPage] Erro ao entrar na sala:', err);
          toast.error('Erro ao abrir conversa');
        });
        console.log(
          '✅ [ChatPage] Sala selecionada (carregando mensagens em background)'
        );

        // Em mobile, esconder sidebar e mostrar área de mensagens
        if (window.innerWidth <= 1024) {
          setShowSidebar(false);
        }
      } catch (err) {
        console.error('❌ [ChatPage] Erro ao selecionar sala:', err);
        toast.error('Erro ao abrir conversa');
      }
    },
    [currentRoom, joinRoom]
  );

  // Criar ou abrir chat de suporte
  const handleOpenSupport = useCallback(async () => {
    try {
      // Verificar se já existe sala de suporte
      const supportRoom = rooms.find(room => room.type === 'support');

      if (supportRoom) {
        // Se existe, apenas abrir
        await handleSelectRoom(supportRoom.id);
      } else {
        // Se não existe, criar
        const room = await createOrGetRoom({
          type: 'support',
        });
        await handleSelectRoom(room.id);
      }
    } catch (err) {
      console.error('Erro ao abrir suporte:', err);
      toast.error('Erro ao abrir chat de suporte');
    }
  }, [rooms, createOrGetRoom, handleSelectRoom]);

  // Filtrar usuários por busca
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return companyUsers;
    }

    const query = searchQuery.toLowerCase();
    return companyUsers.filter(user => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [companyUsers, searchQuery]);

  // Obter sala atual
  const currentRoomData = useMemo(() => {
    return rooms.find(r => r.id === currentRoom);
  }, [rooms, currentRoom]);

  // Verificar se o usuário atual é participante ativo do grupo
  const isCurrentUserActiveParticipant = useMemo(() => {
    if (!currentRoomData || !currentUser?.id) return true; // Se não houver sala ou usuário, permitir (pode ser suporte)

    // Para grupos, verificar se o usuário é participante ativo
    if (currentRoomData.type === 'group') {
      const participant = currentRoomData.participants.find(
        p => p.userId === currentUser.id
      );
      return participant?.isActive ?? false;
    }

    // Para chat direto e suporte, sempre permitir
    return true;
  }, [currentRoomData, currentUser?.id]);

  // Obter mensagens da sala atual (filtrar arquivadas se não estiver visualizando)
  const currentMessages = useMemo(() => {
    if (!currentRoom) return [];
    const roomMessages = messages[currentRoom] || [];

    if (showArchivedMessages) {
      // Mostrar apenas mensagens arquivadas
      return getArchivedMessages(currentRoom, roomMessages);
    } else {
      // Filtrar mensagens arquivadas (mostrar apenas não arquivadas)
      return filterArchivedMessages(currentRoom, roomMessages);
    }
  }, [
    messages,
    currentRoom,
    showArchivedMessages,
    filterArchivedMessages,
    getArchivedMessages,
  ]);

  // Contar mensagens arquivadas na sala atual
  const archivedCount = useMemo(() => {
    return currentRoom ? getArchivedCount(currentRoom) : 0;
  }, [currentRoom, getArchivedCount]);

  // Contar mensagens não lidas por sala
  const getUnreadCount = (room: ChatRoom): number => {
    const roomMessages = messages[room.id] || [];
    return roomMessages.filter(
      msg => msg.senderId !== currentUser?.id && msg.status !== 'read'
    ).length;
  };

  // Scroll para o final das mensagens (considerando área de input fixa)
  const scrollToBottom = useCallback(() => {
    const ref = messagesEndRef.current;
    if (ref) {
      // Usar scrollIntoView com block: 'end' para garantir que fique na parte inferior
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, []);

  // Ler roomId da URL (pode vir de params ou query)
  const { roomId: roomIdFromParams } = useParams<{ roomId?: string }>();
  const [searchParams] = useSearchParams();
  const roomIdFromQuery = searchParams.get('roomId');

  // Carregar usuários ao montar (salas já são carregadas pelo useChat)
  useEffect(() => {
    loadCompanyUsers();
  }, [loadCompanyUsers]);

  // Selecionar sala quando roomId estiver na URL (params ou query)
  useEffect(() => {
    const roomId = roomIdFromParams || roomIdFromQuery;
    if (roomId && rooms.length > 0 && roomId !== currentRoom) {
      const roomExists = rooms.some(r => r.id === roomId);
      if (roomExists) {
        handleSelectRoom(roomId);
        // Limpar o query param após selecionar (se veio de query)
        if (roomIdFromQuery) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('roomId');
          window.history.replaceState(
            {},
            '',
            `/chat${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`
          );
        }
      }
    }
  }, [
    roomIdFromParams,
    roomIdFromQuery,
    rooms,
    currentRoom,
    handleSelectRoom,
    searchParams,
  ]);

  // Ajustar visibilidade da sidebar baseado na seleção de conversa e tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        // Desktop: sempre mostrar ambos
        setShowSidebar(true);
      } else {
        // Mobile/Tablet: mostrar sidebar apenas se não houver conversa selecionada
        setShowSidebar(!currentRoom);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentRoom]);

  // Ajustar sidebar quando currentRoom mudar
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setShowSidebar(!currentRoom);
    }
  }, [currentRoom]);

  // Verificar se o chat está em foco na página
  const isChatInFocus = useCallback(() => {
    // Verificar se está na página de chat
    const isOnChatPage =
      window.location.pathname === '/chat' ||
      window.location.pathname.startsWith('/chat/');
    if (!isOnChatPage) return false;

    // Verificar se a página está visível
    const isPageVisible = document.visibilityState === 'visible';
    if (!isPageVisible) return false;

    // Verificar se a janela está em foco
    const isWindowFocused = document.hasFocus();
    if (!isWindowFocused) return false;

    // Verificar se a área de mensagens está visível (pelo menos parcialmente)
    const messagesArea = messagesAreaRef.current;
    if (!messagesArea) return false;

    const rect = messagesArea.getBoundingClientRect();
    const isVisible =
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth;

    return isVisible;
  }, []);

  // Scroll automático quando entrar em um chat (quando currentRoom muda)
  useEffect(() => {
    if (currentRoom && currentMessages.length > 0) {
      // Aguardar um pouco para garantir que o DOM foi atualizado
      const timeoutId = setTimeout(() => {
        console.log(
          '📜 [ChatPage] Entrando no chat, fazendo scroll até o final...'
        );
        scrollToBottom();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [currentRoom]); // Apenas quando currentRoom muda (entra em um novo chat)

  // Scroll quando uma NOVA mensagem chegar (apenas se não estiver em foco)
  useEffect(() => {
    if (currentRoom) {
      const previousCount = previousMessagesCountRef.current;
      const currentCount = currentMessages.length;

      // Verificar se uma nova mensagem chegou (contagem aumentou)
      const newMessageArrived = currentCount > previousCount;

      if (newMessageArrived) {
        // Verificar se o chat não está em foco
        const chatInFocus = isChatInFocus();

        // Se não estiver em foco, fazer scroll automático
        if (!chatInFocus) {
          console.log(
            '📜 [ChatPage] Nova mensagem chegou e chat não está em foco, fazendo scroll automático...'
          );
          scrollToBottom();
        }

        // Atualizar contagem anterior
        previousMessagesCountRef.current = currentCount;
      } else if (currentCount > 0) {
        // Atualizar contagem mesmo se não houver nova mensagem (para evitar scroll desnecessário)
        previousMessagesCountRef.current = currentCount;
      }

      // Marcar como lido quando necessário
      if (currentCount > 0) {
        markAsRead(currentRoom);
      }
    } else {
      // Resetar contagem quando não há sala selecionada
      previousMessagesCountRef.current = 0;
    }
  }, [
    currentMessages.length,
    currentRoom,
    markAsRead,
    scrollToBottom,
    isChatInFocus,
    currentMessages,
  ]);

  // Auto-resize do textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!currentRoom) {
      console.warn('⚠️ [ChatPage] Tentativa de enviar sem sala');
      return;
    }

    const content = messageInput.trim() || '';
    const fileToSend = selectedImage || selectedFile; // Priorizar imagem se ambas existirem

    if (!content && !fileToSend) {
      console.warn('⚠️ [ChatPage] Tentativa de enviar sem conteúdo ou arquivo');
      return;
    }

    if (content.length > 5000) {
      toast.error('Mensagem muito longa. Máximo de 5000 caracteres.');
      return;
    }

    if (!connected && !fileToSend) {
      toast.error('Não conectado ao chat. Aguarde a conexão...');
      console.error('❌ [ChatPage] Tentativa de enviar sem conexão WebSocket');
      return;
    }

    console.log('📤 [ChatPage] Enviando mensagem:', {
      roomId: currentRoom,
      contentLength: content.length,
      hasImage: !!selectedImage,
      hasFile: !!selectedFile,
      connected,
    });

    // Guardar referências antes do envio para garantir limpeza
    const previewToRevoke = imagePreview;

    try {
      await sendMessage(
        currentRoom,
        content || (selectedImage ? '📷' : selectedFile ? '📎' : ''),
        fileToSend || undefined
      );

      // Limpar inputs após envio bem-sucedido
      setMessageInput('');

      // Limpar arquivo selecionado e preview
      if (previewToRevoke) {
        URL.revokeObjectURL(previewToRevoke);
      }
      setSelectedImage(null);
      setSelectedFile(null);
      setImagePreview(null);

      // Limpar inputs de arquivo
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      const textarea = document.querySelector(
        'textarea'
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    } catch (err) {
      console.error('❌ [ChatPage] Erro ao enviar mensagem:', err);
      toast.error('Erro ao enviar mensagem. Tente novamente.');

      // Mesmo em caso de erro, limpar o arquivo se foi enviado
      // (o arquivo pode ter sido enviado mas a resposta falhou)
      if (previewToRevoke) {
        URL.revokeObjectURL(previewToRevoke);
      }
      setSelectedImage(null);
      setSelectedFile(null);
      setImagePreview(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Selecionar imagem
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error(
        'Tipo de arquivo inválido. Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.'
      );
      return;
    }

    if (isEmptyOrGenericType && !hasValidExtension) {
      toast.error(
        'Tipo de arquivo inválido. Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.'
      );
      return;
    }

    // Validar tamanho (5MB para imagens)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Imagem muito grande. Tamanho máximo: 5MB.');
      return;
    }

    // Criar preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSelectedImage(file);
  };

  // Selecionar documento
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Não permitir imagens aqui
    if (file.type.startsWith('image/')) {
      toast.error('Use o botão de imagem para anexar imagens.');
      return;
    }

    const isEmptyOrGenericType =
      !file.type ||
      file.type === 'application/octet-stream' ||
      file.type === '';

    if (
      !isEmptyOrGenericType &&
      !validDocumentTypes.includes(file.type) &&
      !hasValidExtension
    ) {
      toast.error(
        'Tipo de arquivo inválido. Apenas PDF, CSV, XLSX, XML, DOC, DOCX e TXT são permitidos.'
      );
      return;
    }

    if (isEmptyOrGenericType && !hasValidExtension) {
      toast.error(
        'Tipo de arquivo inválido. Apenas PDF, CSV, XLSX, XML, DOC, DOCX e TXT são permitidos.'
      );
      return;
    }

    // Validar tamanho (10MB para documentos)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Tamanho máximo: 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  // Remover imagem selecionada
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Remover documento selecionado
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  // Verificar se mensagem pode ser deletada (máximo 5 minutos)
  const canDeleteMessage = (message: ChatMessageType): boolean => {
    if (message.senderId !== currentUser?.id) {
      return false; // Apenas o autor pode deletar
    }

    const messageDate = new Date(message.createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - messageDate.getTime()) / (1000 * 60);

    return diffInMinutes <= 5; // Apenas mensagens com até 5 minutos
  };

  // Deletar mensagem
  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Buscar a mensagem para validar
      const message = currentMessages.find(m => m.id === messageId);
      if (!message) {
        toast.error('Mensagem não encontrada');
        return;
      }

      // Validar se pode deletar (já é validado no useChat, mas verificar aqui também)
      if (!canDeleteMessage(message)) {
        toast.error(
          'Mensagens só podem ser deletadas dentro de 5 minutos após o envio'
        );
        return;
      }

      await deleteMessage(messageId);
      toast.success('Mensagem deletada com sucesso');
    } catch (err: any) {
      console.error('Erro ao deletar mensagem:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao deletar mensagem';
      if (errorMessage.includes('5 minutos')) {
        toast.error(
          'Mensagens só podem ser deletadas dentro de 5 minutos após o envio'
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Adicionar emoji ao input
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  // Enviar com Enter (sem Shift)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Estados para modais
  const [showDirectChatModal, setShowDirectChatModal] = useState(false);
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showArchivedRooms, setShowArchivedRooms] = useState(false);

  // Resetar visualização de arquivadas quando não houver mais conversas arquivadas
  useEffect(() => {
    if (archivedRooms.length === 0 && showArchivedRooms) {
      setShowArchivedRooms(false);
    }
  }, [archivedRooms.length, showArchivedRooms]);

  // Resetar visualização de mensagens arquivadas quando mudar de sala
  useEffect(() => {
    setShowArchivedMessages(false);
  }, [currentRoom]);

  // Resetar visualização de mensagens arquivadas quando não houver mais mensagens arquivadas
  useEffect(() => {
    if (archivedCount === 0 && showArchivedMessages) {
      setShowArchivedMessages(false);
    }
  }, [archivedCount, showArchivedMessages]);

  // Criar novo chat direto
  const handleNewDirectChat = async (userId: string) => {
    try {
      const room = await createOrGetRoom({
        type: 'direct',
        userId,
      });

      // Entrar na sala criada
      await joinRoom(room.id);
      setShowDirectChatModal(false);
    } catch (error: any) {
      console.error('Erro ao criar chat direto:', error);
      throw error;
    }
  };

  // Criar novo grupo
  const handleNewGroupChat = async (name: string, userIds: string[]) => {
    try {
      const room = await createOrGetRoom({
        type: 'group',
        name,
        userIds,
      });

      // Entrar na sala criada
      await joinRoom(room.id);
      setShowGroupChatModal(false);
    } catch (error: any) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }
  };

  // Iniciar conversa com usuário
  const handleStartChatWithUser = async (userId: string) => {
    try {
      // Verificar se já existe uma sala direta com este usuário
      const existingRoom = rooms.find(
        room =>
          room.type === 'direct' &&
          room.participants.some(p => p.userId === userId)
      );

      if (existingRoom) {
        // Se já existe, apenas entrar na sala
        await joinRoom(existingRoom.id);
      } else {
        // Criar nova sala direta
        const room = await createOrGetRoom({
          type: 'direct',
          userId,
        });
        await joinRoom(room.id);
      }

      // Limpar busca
      setSearchQuery('');
    } catch (err) {
      console.error('Erro ao iniciar conversa:', err);
      toast.error('Erro ao iniciar conversa');
    }
  };

  // Carregar mais mensagens (lazy loading)
  const handleLoadMoreMessages = useCallback(async () => {
    if (!currentRoom || messagesLoadingRef.current[currentRoom]) {
      return;
    }

    try {
      messagesLoadingRef.current[currentRoom] = true;
      const currentMessages = messages[currentRoom] || [];
      const offset = currentMessages.length;

      const newMessages = await chatApi.getMessages(currentRoom, {
        limit: 50,
        offset,
      });

      if (newMessages.length > 0) {
        // Recarregar todas as mensagens (o hook useChat precisa ser atualizado para suportar paginação)
        await joinRoom(currentRoom);
      }
    } catch (err) {
      console.error('Erro ao carregar mais mensagens:', err);
    } finally {
      messagesLoadingRef.current[currentRoom] = false;
    }
  }, [currentRoom, messages, joinRoom]);

  // Handler de scroll para carregar mais mensagens
  useEffect(() => {
    const messagesArea = messagesAreaRef.current;
    if (!messagesArea || !currentRoom) return;

    const handleScroll = () => {
      // Se estiver próximo do topo (50px), carregar mais mensagens
      if (
        messagesArea.scrollTop < 50 &&
        !messagesLoadingRef.current[currentRoom]
      ) {
        handleLoadMoreMessages();
      }
    };

    messagesArea.addEventListener('scroll', handleScroll);
    return () => {
      messagesArea.removeEventListener('scroll', handleScroll);
    };
  }, [currentRoom, handleLoadMoreMessages]);

  return (
    <Layout>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          width: '100%',
        }}
      >
        <ChatPageContainer>
          {/* Sidebar com lista de salas */}
          <ChatSidebar $isVisible={showSidebar}>
            <ChatSidebarHeader>
              <ChatSidebarTitle>Chat</ChatSidebarTitle>
              <div style={{ display: 'flex', gap: '8px' }}>
                <NewChatButton
                  onClick={() => setShowGroupChatModal(true)}
                  title='Novo grupo'
                >
                  <MdGroup size={20} />
                </NewChatButton>
                <NewChatButton
                  onClick={() => setShowDirectChatModal(true)}
                  title='Nova conversa'
                >
                  <AddIcon size={20} />
                </NewChatButton>
              </div>
            </ChatSidebarHeader>

            <ChatSearchContainer>
              <ChatSearchWrapper>
                <ChatSearchInput
                  type='text'
                  placeholder='Buscar conversas e usuários...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </ChatSearchWrapper>
            </ChatSearchContainer>

            <ChatRoomsList>
              {/* Seção de Conversas */}
              {loading && rooms.length === 0 ? (
                <ChatLoadingState>Carregando conversas...</ChatLoadingState>
              ) : (
                <>
                  {/* Botão de Arquivadas (acima do suporte) - só aparece se houver conversas arquivadas */}
                  {!searchQuery && archivedRooms.length > 0 && (
                    <ChatRoomItem
                      $active={showArchivedRooms}
                      onClick={() => setShowArchivedRooms(!showArchivedRooms)}
                      style={{
                        background: showArchivedRooms
                          ? 'var(--theme-primary)15'
                          : 'transparent',
                        border: '1px solid var(--theme-border)',
                        marginBottom: '8px',
                      }}
                    >
                      <ChatRoomHeader>
                        <ChatRoomAvatar
                          $type='direct'
                          style={{ background: 'var(--theme-text-secondary)' }}
                        >
                          <MdArchive size={18} />
                        </ChatRoomAvatar>
                        <ChatRoomInfo>
                          <ChatRoomName>
                            Arquivadas ({archivedRooms.length})
                          </ChatRoomName>
                          <ChatRoomLastMessage>
                            {showArchivedRooms
                              ? 'Clique para voltar'
                              : 'Ver conversas arquivadas'}
                          </ChatRoomLastMessage>
                        </ChatRoomInfo>
                      </ChatRoomHeader>
                    </ChatRoomItem>
                  )}

                  {/* Botão de Suporte fixo no topo (apenas quando não há busca) */}
                  {!searchQuery && !showArchivedRooms && (
                    <ChatRoomItem
                      $active={
                        !!(
                          currentRoom &&
                          rooms.find(r => r.id === currentRoom)?.type ===
                            'support'
                        )
                      }
                      onClick={handleOpenSupport}
                      style={{
                        background: hasSupportRoom
                          ? currentRoom &&
                            rooms.find(r => r.id === currentRoom)?.type ===
                              'support'
                            ? 'var(--theme-primary)15'
                            : 'transparent'
                          : 'var(--theme-primary)10',
                        border: hasSupportRoom
                          ? 'none'
                          : '1px dashed var(--theme-primary)',
                        marginBottom: '8px',
                      }}
                    >
                      <ChatRoomHeader>
                        <ChatRoomAvatar $type='support'>
                          <SupportIcon />
                        </ChatRoomAvatar>
                        <ChatRoomInfo>
                          <ChatRoomName>Suporte</ChatRoomName>
                          <ChatRoomLastMessage>
                            {hasSupportRoom
                              ? 'Clique para abrir'
                              : 'Clique para iniciar conversa'}
                          </ChatRoomLastMessage>
                        </ChatRoomInfo>
                      </ChatRoomHeader>
                    </ChatRoomItem>
                  )}

                  {!showArchivedRooms && filteredRooms.length > 0 && (
                    <>
                      <ChatSectionTitle>Conversas</ChatSectionTitle>
                      {filteredRooms.map(room => {
                        const unreadCount = getUnreadCount(room);
                        const displayName = getRoomDisplayName(
                          room,
                          currentUser?.id
                        );

                        return (
                          <ChatRoomItem
                            key={room.id}
                            $active={room.id === currentRoom}
                            onClick={() => handleSelectRoom(room.id)}
                            style={{ position: 'relative' }}
                          >
                            <ChatRoomHeader>
                              <ChatRoomAvatar
                                $type={room.type}
                                $hasImage={
                                  !!(
                                    room.imageUrl ||
                                    getRoomAvatar(room, currentUser?.id)
                                  )
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
                              </ChatRoomAvatar>
                              <ChatRoomInfo>
                                <ChatRoomName>{displayName}</ChatRoomName>
                                <ChatRoomLastMessage>
                                  {room.lastMessage || 'Nenhuma mensagem ainda'}
                                </ChatRoomLastMessage>
                                {room.lastMessageAt && (
                                  <ChatRoomTime>
                                    {formatMessageTime(room.lastMessageAt)}
                                  </ChatRoomTime>
                                )}
                              </ChatRoomInfo>
                              <ChatRoomMeta>
                                {unreadCount > 0 && (
                                  <ChatRoomUnread $hasUnread={unreadCount > 0}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                  </ChatRoomUnread>
                                )}
                                {room.type !== 'support' && (
                                  <button
                                    onClick={async e => {
                                      e.stopPropagation();
                                      try {
                                        await archiveRoom(room.id);
                                        toast.success(
                                          'Conversa arquivada! Acesse pelo botão "Arquivadas".'
                                        );
                                      } catch (err: any) {
                                        toast.error(
                                          err.message ||
                                            'Erro ao arquivar conversa'
                                        );
                                      }
                                    }}
                                    style={{
                                      padding: '6px',
                                      background: 'transparent',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      color: 'var(--theme-text-secondary)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      opacity: 0.6,
                                      transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.opacity = '1';
                                      e.currentTarget.style.background =
                                        'var(--theme-background-secondary)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.opacity = '0.6';
                                      e.currentTarget.style.background =
                                        'transparent';
                                    }}
                                    title='Arquivar conversa'
                                  >
                                    <MdArchive size={16} />
                                  </button>
                                )}
                              </ChatRoomMeta>
                            </ChatRoomHeader>
                          </ChatRoomItem>
                        );
                      })}
                    </>
                  )}

                  {/* Seção de Conversas Arquivadas */}
                  {showArchivedRooms && (
                    <>
                      <ChatSectionTitle>
                        Conversas Arquivadas ({archivedRooms.length})
                      </ChatSectionTitle>
                      {archivedRooms.length === 0 ? (
                        <div
                          style={{
                            padding: '32px 16px',
                            textAlign: 'center',
                            color: 'var(--theme-text-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          <MdArchive
                            size={40}
                            style={{ marginBottom: '12px', opacity: 0.5 }}
                          />
                          <p style={{ margin: 0 }}>
                            Nenhuma conversa arquivada.
                          </p>
                        </div>
                      ) : (
                        archivedRooms.map(room => {
                          const displayName = getRoomDisplayName(
                            room,
                            currentUser?.id
                          );
                          return (
                            <ChatRoomItem
                              key={room.id}
                              $active={false}
                              style={{ position: 'relative', opacity: 0.85 }}
                            >
                              <ChatRoomHeader>
                                <ChatRoomAvatar
                                  $type={room.type}
                                  $hasImage={
                                    !!(
                                      room.imageUrl ||
                                      getRoomAvatar(room, currentUser?.id)
                                    )
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
                                      src={
                                        getRoomAvatar(room, currentUser?.id)!
                                      }
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
                                </ChatRoomAvatar>
                                <ChatRoomInfo>
                                  <ChatRoomName>{displayName}</ChatRoomName>
                                  <ChatRoomLastMessage>
                                    {room.lastMessage || 'Arquivada'}
                                  </ChatRoomLastMessage>
                                </ChatRoomInfo>
                                <ChatRoomMeta>
                                  <button
                                    onClick={async e => {
                                      e.stopPropagation();
                                      try {
                                        await unarchiveRoom(room.id);
                                        toast.success('Conversa desarquivada!');
                                        // Se não houver mais conversas arquivadas, voltar para lista normal
                                        if (archivedRooms.length <= 1) {
                                          setShowArchivedRooms(false);
                                        }
                                      } catch (err: any) {
                                        toast.error(
                                          err.message ||
                                            'Erro ao desarquivar conversa'
                                        );
                                      }
                                    }}
                                    style={{
                                      padding: '8px 12px',
                                      background: 'var(--theme-primary)',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      color: 'white',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                      transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.transform =
                                        'scale(1.05)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.transform =
                                        'scale(1)';
                                    }}
                                    title='Desarquivar conversa'
                                  >
                                    <MdArchive size={14} />
                                    Desarquivar
                                  </button>
                                </ChatRoomMeta>
                              </ChatRoomHeader>
                            </ChatRoomItem>
                          );
                        })
                      )}
                    </>
                  )}

                  {/* Seção de Usuários */}
                  {!searchQuery && !showArchivedRooms && (
                    <>
                      <ChatSectionTitle>Usuários</ChatSectionTitle>
                      <ChatUsersList>
                        {loadingUsers ? (
                          <ChatLoadingState>
                            Carregando usuários...
                          </ChatLoadingState>
                        ) : (
                          (() => {
                            const availableUsers = filteredUsers.filter(
                              user => user.id !== currentUser?.id
                            );
                            return availableUsers.length === 0 ? (
                              <ChatEmptyState>
                                <ChatEmptyMessage>
                                  {companyUsers.length === 0
                                    ? 'Nenhum usuário disponível na empresa ainda. Convide seus colegas para começar a conversar! 👥'
                                    : 'Nenhum usuário encontrado'}
                                </ChatEmptyMessage>
                              </ChatEmptyState>
                            ) : (
                              availableUsers.map(user => {
                                const getUserInitials = (name: string) => {
                                  return name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);
                                };

                                return (
                                  <ChatUserItem
                                    key={user.id}
                                    onClick={() =>
                                      handleStartChatWithUser(user.id)
                                    }
                                  >
                                    <ChatUserAvatar $isOnline={user.isOnline}>
                                      {user.avatar ? (
                                        <img
                                          src={user.avatar}
                                          alt={user.name}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                          }}
                                        />
                                      ) : (
                                        getUserInitials(user.name)
                                      )}
                                    </ChatUserAvatar>
                                    <ChatUserInfo>
                                      <ChatUserName>{user.name}</ChatUserName>
                                      <ChatUserRole>
                                        {translateUserRole(user.role)}
                                      </ChatUserRole>
                                    </ChatUserInfo>
                                  </ChatUserItem>
                                );
                              })
                            );
                          })()
                        )}
                      </ChatUsersList>
                    </>
                  )}

                  {/* Mostrar usuários na busca também */}
                  {searchQuery &&
                    !showArchivedRooms &&
                    filteredUsers.length > 0 && (
                      <>
                        <ChatSectionTitle>Usuários</ChatSectionTitle>
                        <ChatUsersList>
                          {filteredUsers
                            .filter(user => user.id !== currentUser?.id)
                            .map(user => {
                              const getUserInitials = (name: string) => {
                                return name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2);
                              };

                              return (
                                <ChatUserItem
                                  key={user.id}
                                  onClick={() =>
                                    handleStartChatWithUser(user.id)
                                  }
                                >
                                  <ChatUserAvatar $isOnline={user.isOnline}>
                                    {user.avatar ? (
                                      <img
                                        src={user.avatar}
                                        alt={user.name}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          borderRadius: '50%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    ) : (
                                      getUserInitials(user.name)
                                    )}
                                  </ChatUserAvatar>
                                  <ChatUserInfo>
                                    <ChatUserName>{user.name}</ChatUserName>
                                    <ChatUserRole>
                                      {translateUserRole(user.role)}
                                    </ChatUserRole>
                                  </ChatUserInfo>
                                </ChatUserItem>
                              );
                            })}
                        </ChatUsersList>
                      </>
                    )}

                  {/* Mensagem quando não há resultados na busca */}
                  {searchQuery &&
                    filteredRooms.length === 0 &&
                    filteredUsers.length === 0 && (
                      <ChatEmptyState>
                        <ChatEmptyMessage>
                          Nenhum resultado encontrado
                        </ChatEmptyMessage>
                      </ChatEmptyState>
                    )}
                </>
              )}
            </ChatRoomsList>
          </ChatSidebar>

          {/* Área principal de mensagens */}
          <ChatMainArea $isVisible={!!currentRoom}>
            {!currentRoom ? (
              <ChatEmptyState>
                <ChatEmptyIcon>
                  <PersonIcon size={40} />
                </ChatEmptyIcon>
                <ChatEmptyTitle>Selecione uma conversa</ChatEmptyTitle>
                <ChatEmptyMessage>
                  Escolha uma conversa da lista para começar a conversar
                </ChatEmptyMessage>
              </ChatEmptyState>
            ) : error ? (
              <ChatErrorState>
                <ChatEmptyTitle>Erro</ChatEmptyTitle>
                <ChatEmptyMessage>{error}</ChatEmptyMessage>
              </ChatErrorState>
            ) : (
              <>
                <ChatHeader>
                  <ChatHeaderInfo>
                    <ChatBackButton
                      onClick={() => {
                        setShowSidebar(true);
                      }}
                      title='Voltar para lista de conversas'
                    >
                      <MdArrowBack size={20} />
                    </ChatBackButton>
                    <ChatHeaderAvatar
                      $type={currentRoomData?.type}
                      $hasImage={
                        !!(
                          currentRoomData?.imageUrl ||
                          (currentRoomData &&
                            getRoomAvatar(currentRoomData, currentUser?.id))
                        )
                      }
                    >
                      {currentRoomData?.imageUrl ? (
                        <img
                          src={currentRoomData.imageUrl}
                          alt={getRoomDisplayName(
                            currentRoomData,
                            currentUser?.id
                          )}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : currentRoomData &&
                        getRoomAvatar(currentRoomData, currentUser?.id) ? (
                        <img
                          src={getRoomAvatar(currentRoomData, currentUser?.id)!}
                          alt={getRoomDisplayName(
                            currentRoomData,
                            currentUser?.id
                          )}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : currentRoomData?.type === 'direct' ? (
                        getUserInitials(
                          getRoomDisplayName(currentRoomData, currentUser?.id)
                        )
                      ) : (
                        currentRoomData && getRoomIcon(currentRoomData.type)
                      )}
                    </ChatHeaderAvatar>
                    <div>
                      <ChatHeaderName>
                        {currentRoomData
                          ? getRoomDisplayName(currentRoomData, currentUser?.id)
                          : 'Chat'}
                      </ChatHeaderName>
                      {currentRoomData && currentRoomData.type === 'group' && (
                        <ChatHeaderParticipants
                          onClick={() => setShowParticipantsModal(true)}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                          title='Ver lista de participantes'
                        >
                          {currentRoomData.participants.length} participantes
                        </ChatHeaderParticipants>
                      )}
                    </div>
                  </ChatHeaderInfo>
                  <ChatHeaderActions>
                    {currentRoomData?.type === 'group' && (
                      <>
                        <ChatHeaderButton
                          onClick={() => setShowHistoryModal(true)}
                          title='Ver histórico do grupo'
                        >
                          <MdHistory size={20} />
                        </ChatHeaderButton>
                        {(() => {
                          const currentUserParticipant =
                            currentRoomData.participants.find(
                              p => p.userId === currentUser?.id
                            );
                          const isAdmin =
                            currentUserParticipant?.isAdmin || false;

                          return isAdmin ? (
                            <ChatHeaderButton
                              onClick={() =>
                                navigate(
                                  `/chat/edit-group/${currentRoomData.id}`
                                )
                              }
                              title='Editar grupo'
                            >
                              <MdEdit size={20} />
                            </ChatHeaderButton>
                          ) : null;
                        })()}
                      </>
                    )}
                    {/* Botão de Mensagens Arquivadas */}
                    {archivedCount > 0 && (
                      <ChatHeaderButton
                        onClick={() => {
                          setShowArchivedMessages(!showArchivedMessages);
                        }}
                        title={
                          showArchivedMessages
                            ? 'Ver mensagens ativas'
                            : `Ver mensagens arquivadas (${archivedCount})`
                        }
                        style={{
                          background: showArchivedMessages
                            ? 'var(--theme-primary)15'
                            : 'transparent',
                          color: showArchivedMessages
                            ? 'var(--theme-primary)'
                            : 'inherit',
                        }}
                      >
                        <MdArchive size={20} />
                      </ChatHeaderButton>
                    )}
                    <ChatHeaderButton
                      $isProcessing={openingWindow === currentRoom}
                      onClick={() => {
                        if (!currentRoom) return;

                        // Mostrar feedback visual
                        setOpeningWindow(currentRoom);

                        // Abrir conversa em window flutuante (forçar abertura mesmo na página de chat)
                        window.dispatchEvent(
                          new CustomEvent('open-chat', {
                            detail: { roomId: currentRoom, forceOpen: true },
                          })
                        );

                        // Remover feedback após um tempo
                        setTimeout(() => {
                          setOpeningWindow(null);
                        }, 1500);
                      }}
                      title='Abrir em janela flutuante (máximo 3 janelas, visíveis apenas fora da tela de chat)'
                    >
                      {openingWindow === currentRoom ? (
                        <MdCheckCircle size={20} />
                      ) : (
                        <MdOpenInNew size={20} />
                      )}
                    </ChatHeaderButton>
                    <ChatConnectionStatus $connected={connected}>
                      {connected ? '● Conectado' : '● Desconectado'}
                    </ChatConnectionStatus>
                  </ChatHeaderActions>
                </ChatHeader>

                <ChatMessagesArea ref={messagesAreaRef}>
                  {/* Indicador de visualização de arquivadas */}
                  {showArchivedMessages && archivedCount > 0 && (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'var(--theme-primary)10',
                        border: '1px solid var(--theme-primary)',
                        borderRadius: '8px',
                        margin: '8px 16px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.875rem',
                        color: 'var(--theme-primary)',
                      }}
                    >
                      <MdArchive size={18} />
                      <span>
                        Visualizando {archivedCount} mensagem(ns) arquivada(s)
                      </span>
                      <button
                        onClick={() => setShowArchivedMessages(false)}
                        style={{
                          marginLeft: '8px',
                          padding: '4px 8px',
                          background: 'transparent',
                          border: '1px solid var(--theme-primary)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: 'var(--theme-primary)',
                          fontSize: '0.75rem',
                        }}
                      >
                        Voltar
                      </button>
                    </div>
                  )}
                  {loadingMessages[currentRoom || ''] &&
                  currentMessages.length === 0 ? (
                    <ChatLoadingState>Carregando mensagens...</ChatLoadingState>
                  ) : currentMessages.length === 0 ? (
                    <ChatEmptyState>
                      <ChatEmptyMessage>
                        {showArchivedMessages
                          ? 'Nenhuma mensagem arquivada.'
                          : 'Nenhuma mensagem ainda. Comece a conversar!'}
                      </ChatEmptyMessage>
                    </ChatEmptyState>
                  ) : (
                    currentMessages.map((message: ChatMessageType) => {
                      const isOwn = message.senderId === currentUser?.id;
                      const isGroup = currentRoomData?.type === 'group';
                      const showAvatar = isGroup && !isOwn;
                      const isSystemMessage = message.isSystemMessage || false;

                      // Renderizar mensagem do sistema de forma diferente
                      if (isSystemMessage) {
                        return (
                          <ChatMessage key={message.id} $isSystem={true}>
                            <ChatSystemMessage>
                              {message.content}
                            </ChatSystemMessage>
                          </ChatMessage>
                        );
                      }

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
                                setHoveringMessageId(message.id)
                              }
                              onMouseLeave={() => setHoveringMessageId(null)}
                              style={{ position: 'relative' }}
                            >
                              {/* Botões de ação (deletar e arquivar) */}
                              {hoveringMessageId === message.id && (
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
                                        handleDeleteMessage(message.id);
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
                                  {currentRoom && (
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        if (showArchivedMessages) {
                                          unarchiveMessage(
                                            currentRoom,
                                            message.id
                                          );
                                        } else {
                                          archiveMessage(
                                            currentRoom,
                                            message.id
                                          );
                                        }
                                      }}
                                      style={{
                                        background: showArchivedMessages
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
                                        showArchivedMessages
                                          ? 'Desarquivar mensagem'
                                          : 'Arquivar mensagem'
                                      }
                                    >
                                      {showArchivedMessages ? (
                                        <MdUnarchive size={14} />
                                      ) : (
                                        <MdArchive size={14} />
                                      )}
                                    </button>
                                  )}
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
                                      <img
                                        src={
                                          message.documentUrl ||
                                          message.fileUrl ||
                                          message.imageUrl
                                        }
                                        alt='Imagem anexada'
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '300px',
                                          borderRadius: '8px',
                                          marginBottom: '4px',
                                          cursor: 'pointer',
                                          objectFit: 'contain',
                                          display: 'block',
                                        }}
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
                            <ChatMessageInfo $isOwn={isOwn}>
                              <ChatMessageTime>
                                {formatMessageTimeShort(message.createdAt)}
                              </ChatMessageTime>
                              {isOwn && (
                                <ChatMessageStatus
                                  $status={
                                    message.status as
                                      | 'sending'
                                      | 'sent'
                                      | 'delivered'
                                      | 'read'
                                  }
                                >
                                  {message.status === 'sending' ? (
                                    <span style={{ opacity: 0.5 }}>⏳</span>
                                  ) : message.status === 'read' ? (
                                    '✓✓'
                                  ) : message.status === 'delivered' ? (
                                    '✓✓'
                                  ) : (
                                    '✓'
                                  )}
                                </ChatMessageStatus>
                              )}
                            </ChatMessageInfo>
                          </ChatMessageWrapper>
                        </ChatMessage>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </ChatMessagesArea>

                <ChatInputArea data-input-area>
                  {/* Preview de imagem */}
                  {imagePreview && (
                    <ImagePreviewContainer>
                      <ImagePreview src={imagePreview} alt='Preview' />
                      <RemoveImageButton onClick={handleRemoveImage}>
                        <MdCloseIcon size={16} />
                      </RemoveImageButton>
                    </ImagePreviewContainer>
                  )}

                  {/* Preview de documento */}
                  {selectedFile && !imagePreview && (
                    <DocumentPreviewContainer>
                      <DocumentPreviewIcon>
                        {getDocumentIcon(selectedFile.name, selectedFile.type)}
                      </DocumentPreviewIcon>
                      <DocumentPreviewInfo>
                        <DocumentPreviewName>
                          {selectedFile.name}
                        </DocumentPreviewName>
                        <DocumentPreviewSize>
                          {formatFileSize(selectedFile.size)}
                        </DocumentPreviewSize>
                      </DocumentPreviewInfo>
                      <RemoveDocumentButton onClick={handleRemoveFile}>
                        <MdCloseIcon size={16} />
                      </RemoveDocumentButton>
                    </DocumentPreviewContainer>
                  )}

                  <ChatInputContainer>
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />

                    {/* Botão para anexar imagens */}
                    <ImageInputWrapper>
                      <input
                        ref={imageInputRef}
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={handleImageSelect}
                      />
                      <ImageAttachButton
                        onClick={() => imageInputRef.current?.click()}
                        title='Anexar imagem'
                        type='button'
                        disabled={!isCurrentUserActiveParticipant}
                      >
                        <MdImage size={20} />
                      </ImageAttachButton>
                    </ImageInputWrapper>

                    {/* Botão para anexar documentos */}
                    <ImageInputWrapper>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='.pdf,.csv,.xlsx,.xls,.xml,.doc,.docx,.txt'
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        disabled={!isCurrentUserActiveParticipant}
                      />
                      <ImageAttachButton
                        onClick={() => fileInputRef.current?.click()}
                        title='Anexar documento'
                        type='button'
                        disabled={!isCurrentUserActiveParticipant}
                      >
                        <MdDescription size={20} />
                      </ImageAttachButton>
                    </ImageInputWrapper>

                    <ChatInput
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isCurrentUserActiveParticipant
                          ? 'Digite sua mensagem...'
                          : 'Você foi removido deste grupo'
                      }
                      rows={1}
                      maxLength={5000}
                      disabled={!isCurrentUserActiveParticipant}
                    />
                    <ChatSendButton
                      onClick={handleSendMessage}
                      disabled={
                        !isCurrentUserActiveParticipant ||
                        (!messageInput.trim() &&
                          !selectedImage &&
                          !selectedFile) ||
                        (!connected && !selectedImage && !selectedFile)
                      }
                      title={
                        isCurrentUserActiveParticipant
                          ? 'Enviar mensagem'
                          : 'Você foi removido deste grupo'
                      }
                    >
                      <SendIcon size={20} />
                    </ChatSendButton>
                  </ChatInputContainer>
                </ChatInputArea>
              </>
            )}
          </ChatMainArea>
        </ChatPageContainer>

        {/* Modais */}
        <CreateDirectChatModal
          isOpen={showDirectChatModal}
          onClose={() => setShowDirectChatModal(false)}
          onCreateChat={handleNewDirectChat}
        />
        <CreateGroupChatModal
          isOpen={showGroupChatModal}
          onClose={() => setShowGroupChatModal(false)}
          onCreateGroup={handleNewGroupChat}
        />
        <ParticipantsListModal
          isOpen={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
          room={currentRoomData || null}
          onLeaveGroup={async () => {
            if (!currentRoomData) return;

            // Verificar se é o último administrador antes de tentar sair
            const currentUserParticipant = currentRoomData.participants.find(
              p => p.userId === currentUser?.id
            );
            const isCurrentUserAdmin = currentUserParticipant?.isAdmin || false;

            if (isCurrentUserAdmin) {
              const adminCount =
                currentRoomData.participants.filter(p => p.isAdmin).length || 0;
              if (adminCount <= 1) {
                toast.error(
                  'Não é possível sair do grupo se você for o último administrador. Promova outro usuário a administrador primeiro.'
                );
                return;
              }
            }

            // Validação já foi feita no modal, apenas executar a ação

            try {
              await leaveRoom(currentRoomData.id);
              // Voltar para a lista de conversas após sair
              if (currentRoom === currentRoomData.id) {
                setCurrentRoom(null);
              }
              toast.success('Você saiu do grupo com sucesso!');
            } catch (error: any) {
              // Se o erro for sobre ser o último admin, mostrar mensagem específica
              if (
                error.message?.includes('último administrador') ||
                error.message?.includes('last admin') ||
                error.response?.data?.message?.includes(
                  'último administrador'
                ) ||
                error.response?.data?.message?.includes('last admin')
              ) {
                toast.error(
                  'Não é possível sair do grupo se você for o último administrador. Promova outro usuário a administrador primeiro.'
                );
              } else {
                toast.error(
                  error.message || 'Erro ao sair do grupo. Tente novamente.'
                );
              }
            }
          }}
          onRemoveParticipant={async (userId: string) => {
            if (!currentRoomData) return;
            try {
              await removeParticipant(currentRoomData.id, userId);
              toast.success('Participante removido do grupo com sucesso!');
            } catch (error: any) {
              // Se o erro for de operação cancelada, não mostrar toast (já foi cancelado)
              if (error.message && error.message !== 'Operação cancelada') {
                toast.error(
                  error.message ||
                    'Erro ao remover participante. Tente novamente.'
                );
              }
              throw error;
            }
          }}
        />
        <GroupHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          roomId={currentRoomData?.id || null}
          onGetHistory={async (roomId: string) => {
            return await getRoomHistory(roomId);
          }}
        />
      </div>
    </Layout>
  );
};

export default ChatPage;
