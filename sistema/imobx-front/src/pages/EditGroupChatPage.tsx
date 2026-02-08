import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  MdArrowBack,
  MdCheck,
  MdPerson,
  MdEmail,
  MdGroup,
  MdDelete,
  MdImage,
  MdStar,
  MdStarBorder,
  MdClose,
  MdInfoOutline,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useChat } from '../hooks/useChat';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import type { ChatRoom } from '../types/chat';
import styled from 'styled-components';

// Styled Components seguindo o padrão da CreateNotePage
const PageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(-4px);
  }
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 28px;
`;

const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: visible;
  z-index: 1;
`;

const TooltipIcon = styled(MdInfoOutline)`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;
`;

const TooltipContent = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.75rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  z-index: 200000;
  pointer-events: none;

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  padding-left: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const ImageSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImagePreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  border: 2px dashed ${props => props.theme.colors.border};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.backgroundSecondary};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ImageButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 16px;
  background: ${props =>
    props.$variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 1px solid
    ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.primaryDark
        : props.theme.colors.backgroundSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const ParticipantCard = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props =>
    props.$isSelected
      ? props.theme.colors.primary + '15'
      : props.theme.colors.background};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`;

const ParticipantAvatar = styled.div<{ $small?: boolean }>`
  width: ${props => (props.$small ? '32px' : '40px')};
  height: ${props => (props.$small ? '32px' : '40px')};
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => (props.$small ? '0.75rem' : '0.875rem')};
  flex-shrink: 0;
`;

const ParticipantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ParticipantName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ParticipantEmail = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ParticipantActions = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ActionButton = styled.button<{
  $variant?: 'danger' | 'warning' | 'success';
}>`
  padding: 6px 10px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => {
    if (props.$variant === 'danger') return '#ef4444';
    if (props.$variant === 'warning') return '#f59e0b';
    if (props.$variant === 'success') return '#10b981';
    return props.theme.colors.textSecondary;
  }};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.$variant === 'danger') return '#ef444420';
      if (props.$variant === 'warning') return '#f59e0b20';
      if (props.$variant === 'success') return '#10b98120';
      return props.theme.colors.backgroundSecondary;
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedIndicator = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
`;

const Badge = styled.span<{ $type?: 'admin' | 'creator' }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props =>
    props.$type === 'creator' ? '#8b5cf620' : '#f59e0b20'};
  color: ${props => (props.$type === 'creator' ? '#8b5cf6' : '#f59e0b')};
`;

const CreatorInfo = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 24px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  background: ${props =>
    props.$variant === 'primary' ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: 1px solid
    ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.primaryDark
        : props.theme.colors.backgroundSecondary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

const EditGroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const {
    rooms,
    updateRoom,
    uploadGroupImage,
    addParticipants,
    removeParticipant,
    promoteToAdmin,
    removeAdmin,
  } = useChat();
  const { users, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();

  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingParticipants, setRemovingParticipants] = useState<
    Record<string, boolean>
  >({});
  const [promotingUsers, setPromotingUsers] = useState<Record<string, boolean>>(
    {}
  );
  const [removingAdmins, setRemovingAdmins] = useState<Record<string, boolean>>(
    {}
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentUser = getCurrentUser();
  const room = rooms.find(r => r.id === roomId) || null;

  // Verificar se o usuário atual é administrador
  const isCurrentUserAdmin =
    room?.participants.find(p => p.userId === currentUser?.id)?.isAdmin ||
    false;

  // Obter criador do grupo
  const creator = room?.createdBy
    ? users.find(u => u.id === room.createdBy)
    : null;

  useEffect(() => {
    if (room) {
      getUsers({ page: 1, limit: 100 });
      setGroupName(room.name || '');
      setSelectedUserIds(room.participants.map(p => p.userId));
      if (!imagePreview || !imagePreview.startsWith('blob:')) {
        setImagePreview(room.imageUrl || null);
      }
    }
  }, [room?.id, room?.name, room?.participants, getUsers]);

  useEffect(() => {
    if (
      room?.imageUrl &&
      (!imagePreview || !imagePreview.startsWith('blob:'))
    ) {
      setImagePreview(room.imageUrl);
    }
  }, [room?.imageUrl]);

  const handleUpdate = async () => {
    if (!room || !isCurrentUserAdmin) {
      toast.error('Apenas administradores podem editar o grupo');
      return;
    }

    if (!groupName.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    try {
      setUpdating(true);

      const currentParticipantIds = room.participants.map(p => p.userId);
      const usersToAdd = selectedUserIds.filter(
        id => !currentParticipantIds.includes(id)
      );

      if (groupName.trim() !== room.name) {
        await updateRoom(room.id, groupName.trim());
      }

      if (usersToAdd.length > 0) {
        await addParticipants(room.id, usersToAdd);
      }

      toast.success('Grupo atualizado com sucesso!');
      navigate('/chat');
    } catch (error: any) {
      console.error('Erro ao atualizar grupo:', error);
      toast.error(error.message || 'Erro ao atualizar grupo. Tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validImageTypes.includes(file.type)) {
      toast.error(
        'Tipo de arquivo inválido. Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.'
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Imagem muito grande. Tamanho máximo: 5MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleUploadImage = async () => {
    if (!room || !isCurrentUserAdmin) {
      toast.error('Apenas administradores podem fazer upload de imagem');
      return;
    }

    const file = imageInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Selecione uma imagem');
      return;
    }

    try {
      setUploadingImage(true);
      const updatedRoom = await uploadGroupImage(room.id, file);

      if (updatedRoom?.imageUrl) {
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(updatedRoom.imageUrl);
      }

      toast.success('Imagem do grupo atualizada com sucesso!');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload de imagem:', error);
      toast.error(
        error.message || 'Erro ao fazer upload de imagem. Tente novamente.'
      );
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(room?.imageUrl || null);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!room || !isCurrentUserAdmin) {
      toast.error('Apenas administradores podem promover usuários');
      return;
    }

    try {
      setPromotingUsers(prev => ({ ...prev, [userId]: true }));
      await promoteToAdmin(room.id, [userId]);
      toast.success('Usuário promovido a administrador!');
    } catch (error: any) {
      console.error('Erro ao promover usuário:', error);
      toast.error(
        error.message || 'Erro ao promover usuário. Tente novamente.'
      );
    } finally {
      setPromotingUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!room || !isCurrentUserAdmin) {
      toast.error(
        'Apenas administradores podem remover status de administrador'
      );
      return;
    }

    const participant = room?.participants.find(p => p.userId === userId);
    const isAdmin = participant?.isAdmin || false;
    const isCreator = room?.createdBy === userId;

    if (!isAdmin) {
      toast.error('Este usuário não é administrador');
      return;
    }

    if (isCreator) {
      toast.error(
        'Não é possível remover o status de administrador do criador do grupo'
      );
      return;
    }

    const adminCount = room?.participants.filter(p => p.isAdmin).length || 0;
    if (adminCount <= 1) {
      toast.error('Não é possível remover o último administrador do grupo');
      return;
    }

    try {
      setRemovingAdmins(prev => ({ ...prev, [userId]: true }));
      await removeAdmin(room.id, [userId]);
      toast.success('Status de administrador removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover status de administrador:', error);
      toast.error(
        error.message ||
          'Erro ao remover status de administrador. Tente novamente.'
      );
    } finally {
      setRemovingAdmins(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!room) return;

    if (userId === currentUser?.id) {
      toast.error('Você não pode remover a si mesmo do grupo');
      return;
    }

    try {
      setRemovingParticipants(prev => ({ ...prev, [userId]: true }));
      await removeParticipant(room.id, userId);
      toast.success('Participante removido com sucesso!');
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    } catch (error: any) {
      console.error('Erro ao remover participante:', error);
      toast.error(
        error.message || 'Erro ao remover participante. Tente novamente.'
      );
    } finally {
      setRemovingParticipants(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  const filteredUsers = users.filter(user => {
    if (user.id === currentUser?.id) return false;
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const currentParticipants = room?.participants || [];
  const currentParticipantUsers = users.filter(u =>
    currentParticipants.some(p => p.userId === u.id)
  );

  // Se não encontrar a sala, mostrar mensagem de erro
  if (!room) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader>
            <div>
              <PageTitle>Grupo não encontrado</PageTitle>
              <PageSubtitle>
                O grupo solicitado não existe ou você não tem acesso.
              </PageSubtitle>
            </div>
            <BackButton onClick={() => navigate('/chat')}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageHeader>
        </PageContainer>
      </Layout>
    );
  }

  // Se não for administrador, mostrar mensagem
  if (!isCurrentUserAdmin) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader>
            <div>
              <PageTitle>Sem permissão</PageTitle>
              <PageSubtitle>
                Apenas administradores podem editar o grupo.
              </PageSubtitle>
            </div>
            <BackButton onClick={() => navigate('/chat')}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageHeader>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <div>
            <PageTitle>Editar Grupo</PageTitle>
            <PageSubtitle>
              Gerencie as informações e participantes do grupo
            </PageSubtitle>
          </div>
          <BackButton onClick={() => navigate('/chat')}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
        </PageHeader>

        <FormGrid>
          {/* Informações do Criador */}
          {creator && (
            <Section>
              <SectionTitle>
                <MdPerson size={18} />
                Criado por
              </SectionTitle>
              <CreatorInfo>
                <ParticipantAvatar $small>
                  {creator.name.charAt(0).toUpperCase()}
                </ParticipantAvatar>
                {creator.name} ({creator.email})
              </CreatorInfo>
            </Section>
          )}

          {/* Imagem do Grupo */}
          <Section>
            <SectionTitle>
              <MdImage size={18} />
              Imagem do Grupo
            </SectionTitle>
            <ImageSection>
              <ImagePreview>
                {imagePreview ? (
                  <img src={imagePreview} alt='Preview' />
                ) : (
                  <MdGroup size={40} color='var(--theme-text-secondary)' />
                )}
              </ImagePreview>
              <ImageActions>
                <input
                  ref={imageInputRef}
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/gif,image/webp'
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
                <ImageButton
                  $variant='secondary'
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <MdImage size={18} />
                  {imagePreview ? 'Alterar Imagem' : 'Selecionar Imagem'}
                </ImageButton>
                {imageInputRef.current?.files?.[0] && (
                  <ImageButton
                    $variant='primary'
                    onClick={handleUploadImage}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <LoadingSpinner />
                    ) : (
                      <MdCheck size={18} />
                    )}
                    {uploadingImage ? 'Enviando...' : 'Salvar Imagem'}
                  </ImageButton>
                )}
              </ImageActions>
            </ImageSection>
          </Section>

          {/* Nome do Grupo */}
          <Section>
            <SectionTitle>
              <MdGroup size={18} />
              Informações do Grupo
            </SectionTitle>
            <FieldContainer>
              <FieldLabel>
                Nome do Grupo <RequiredMark>*</RequiredMark>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Nome que será exibido para todos os participantes
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabel>
              <Input
                type='text'
                placeholder='Ex: Equipe de Vendas'
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                maxLength={100}
              />
            </FieldContainer>
          </Section>

          {/* Participantes Atuais */}
          <Section>
            <SectionTitle>
              <MdPerson size={18} />
              Participantes Atuais ({currentParticipantUsers.length})
            </SectionTitle>
            <ParticipantsList>
              {currentParticipantUsers.map(user => {
                const isCurrentUser = user.id === currentUser?.id;
                const isRemoving = removingParticipants[user.id];
                const isPromoting = promotingUsers[user.id];
                const isRemovingAdmin = removingAdmins[user.id];
                const participant = room?.participants.find(
                  p => p.userId === user.id
                );
                const isAdmin = participant?.isAdmin || false;
                const isCreator = room?.createdBy === user.id;
                const adminCount =
                  room?.participants.filter(p => p.isAdmin).length || 0;
                const canRemove = !isCurrentUser && !isCreator;
                const canPromote = !isCurrentUser && !isAdmin;
                const canRemoveAdmin =
                  !isCurrentUser && isAdmin && !isCreator && adminCount > 1;

                return (
                  <ParticipantCard
                    key={user.id}
                    style={{ opacity: isRemoving ? 0.5 : 1 }}
                  >
                    <ParticipantAvatar>
                      {user.name.charAt(0).toUpperCase()}
                    </ParticipantAvatar>
                    <ParticipantInfo>
                      <ParticipantName>
                        {user.name}
                        {isCurrentUser && ' (Você)'}
                        {isAdmin && (
                          <MdStar
                            size={16}
                            color='#fbbf24'
                            title='Administrador'
                          />
                        )}
                        {isCreator && <Badge $type='creator'>Criador</Badge>}
                      </ParticipantName>
                      <ParticipantEmail>
                        <MdEmail size={14} />
                        {user.email}
                      </ParticipantEmail>
                    </ParticipantInfo>
                    <ParticipantActions>
                      {canPromote && (
                        <ActionButton
                          onClick={() => handlePromoteToAdmin(user.id)}
                          disabled={isPromoting}
                          $variant='warning'
                          title='Promover a administrador'
                        >
                          <MdStarBorder size={14} />
                          {isPromoting ? 'Promovendo...' : 'Promover'}
                        </ActionButton>
                      )}
                      {canRemoveAdmin && (
                        <ActionButton
                          onClick={() => handleRemoveAdmin(user.id)}
                          disabled={isRemovingAdmin}
                          title='Remover status de administrador'
                        >
                          <MdStar size={14} color='#fbbf24' />
                          {isRemovingAdmin ? 'Removendo...' : 'Remover Admin'}
                        </ActionButton>
                      )}
                      {canRemove && (
                        <ActionButton
                          onClick={() => handleRemoveParticipant(user.id)}
                          disabled={isRemoving}
                          $variant='danger'
                          title='Remover participante'
                        >
                          <MdDelete size={14} />
                        </ActionButton>
                      )}
                    </ParticipantActions>
                  </ParticipantCard>
                );
              })}
            </ParticipantsList>
          </Section>

          {/* Adicionar Participantes */}
          <Section>
            <SectionTitle>
              <MdPerson size={18} />
              Adicionar Participantes
            </SectionTitle>
            <FieldContainer>
              <FieldLabel>Buscar Usuários</FieldLabel>
              <SearchContainer>
                <SearchIcon>
                  <MdPerson size={18} />
                </SearchIcon>
                <SearchInput
                  type='text'
                  placeholder='Digite o nome ou email do usuário...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
            </FieldContainer>
            <ParticipantsList>
              {filteredUsers.filter(
                u => !currentParticipants.some(p => p.userId === u.id)
              ).length === 0 ? (
                <EmptyState>
                  <MdPerson size={48} />
                  <p>
                    {searchTerm
                      ? 'Nenhum usuário encontrado'
                      : 'Digite para buscar usuários'}
                  </p>
                </EmptyState>
              ) : (
                filteredUsers
                  .filter(
                    u => !currentParticipants.some(p => p.userId === u.id)
                  )
                  .map(user => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <ParticipantCard
                        key={user.id}
                        $isSelected={isSelected}
                        onClick={() => handleToggleUser(user.id)}
                      >
                        <ParticipantAvatar>
                          {user.name.charAt(0).toUpperCase()}
                        </ParticipantAvatar>
                        <ParticipantInfo>
                          <ParticipantName>{user.name}</ParticipantName>
                          <ParticipantEmail>
                            <MdEmail size={14} />
                            {user.email}
                          </ParticipantEmail>
                        </ParticipantInfo>
                        {isSelected && <SelectedIndicator>✓</SelectedIndicator>}
                      </ParticipantCard>
                    );
                  })
              )}
            </ParticipantsList>
          </Section>
        </FormGrid>

        <ButtonsRow>
          <Button $variant='secondary' onClick={() => navigate('/chat')}>
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={handleUpdate}
            disabled={!groupName.trim() || updating}
          >
            {updating ? (
              <>
                <LoadingSpinner />
                Salvando...
              </>
            ) : (
              <>
                <MdCheck size={18} />
                Salvar Alterações
              </>
            )}
          </Button>
        </ButtonsRow>
      </PageContainer>
    </Layout>
  );
};

export default EditGroupChatPage;
