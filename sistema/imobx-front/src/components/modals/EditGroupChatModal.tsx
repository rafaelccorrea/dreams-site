import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  MdPerson,
  MdEmail,
  MdClose,
  MdGroup,
  MdDelete,
  MdImage,
  MdStar,
  MdStarBorder,
} from 'react-icons/md';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import type { ChatRoom } from '../../types/chat';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  SearchContainer,
  SearchInput,
  SearchIcon,
  UsersList,
  UserCard,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  SelectedIndicator,
  EmptyState,
  EmptyText,
  SelectedUsersContainer,
  SelectedUserTag,
  RemoveUserButton,
  ModalFooter,
  CancelButton,
  CreateButton,
} from '../../styles/components/CreateChatModalStyles';

interface EditGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ChatRoom | null;
  onUpdateGroup: (
    roomId: string,
    name?: string,
    imageUrl?: string
  ) => Promise<void>;
  onUploadGroupImage: (roomId: string, imageFile: File) => Promise<ChatRoom>;
  onAddParticipants: (roomId: string, userIds: string[]) => Promise<void>;
  onRemoveParticipant: (roomId: string, userId: string) => Promise<void>;
  onPromoteToAdmin: (roomId: string, userIds: string[]) => Promise<void>;
  onRemoveAdmin?: (roomId: string, userIds: string[]) => Promise<void>;
  onArchiveRoom?: (roomId: string) => Promise<void>;
}

export const EditGroupChatModal: React.FC<EditGroupChatModalProps> = ({
  isOpen,
  onClose,
  room,
  onUpdateGroup,
  onUploadGroupImage,
  onAddParticipants,
  onRemoveParticipant,
  onPromoteToAdmin,
  onRemoveAdmin,
  onArchiveRoom,
}) => {
  const { users, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();
  const [groupName, setGroupName] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const currentUser = getCurrentUser();

  // Verificar se o usuário atual é administrador
  const isCurrentUserAdmin =
    room?.participants.find(p => p.userId === currentUser?.id)?.isAdmin ||
    false;

  // Obter criador do grupo
  const creator = room?.createdBy
    ? users.find(u => u.id === room.createdBy)
    : null;

  useEffect(() => {
    if (isOpen && room) {
      getUsers({ page: 1, limit: 100 });
      setGroupName(room.name || '');
      setSelectedUserIds(room.participants.map(p => p.userId));
      // Atualizar preview com imageUrl do room, mas não sobrescrever preview local (blob)
      if (!imagePreview || !imagePreview.startsWith('blob:')) {
        setImagePreview(room.imageUrl || null);
      }
    }
  }, [isOpen, room?.id, room?.name, room?.participants, getUsers]);

  // Atualizar preview quando imageUrl do room mudar (após upload)
  useEffect(() => {
    if (
      room?.imageUrl &&
      (!imagePreview || !imagePreview.startsWith('blob:'))
    ) {
      setImagePreview(room.imageUrl);
    }
  }, [room?.imageUrl]);

  const handleClose = () => {
    setGroupName('');
    setSelectedUserIds([]);
    setSearchTerm('');
    setUpdating(false);
    setUploadingImage(false);
    setRemovingParticipants({});
    setPromotingUsers({});
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    onClose();
  };

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

      // Obter participantes atuais do grupo
      const currentParticipantIds = room.participants.map(p => p.userId);

      // Calcular usuários a adicionar (estão em selectedUserIds mas não em currentParticipantIds)
      const usersToAdd = selectedUserIds.filter(
        id => !currentParticipantIds.includes(id)
      );

      // Atualizar nome do grupo (se mudou)
      if (groupName.trim() !== room.name) {
        await onUpdateGroup(room.id, groupName.trim());
      }

      // Adicionar novos participantes se houver
      if (usersToAdd.length > 0) {
        await onAddParticipants(room.id, usersToAdd);
      }

      handleClose();
      toast.success('Grupo atualizado com sucesso!');
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

    // Validar apenas imagens
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

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Imagem muito grande. Tamanho máximo: 5MB.');
      return;
    }

    // Criar preview
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
      const updatedRoom = await onUploadGroupImage(room.id, file);

      // Atualizar preview com a nova URL da imagem
      if (updatedRoom?.imageUrl) {
        // Se houver preview local, revogar
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
        // Usar a URL retornada do backend
        setImagePreview(updatedRoom.imageUrl);
      }

      toast.success('Imagem do grupo atualizada com sucesso!');
      // Limpar o input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload de imagem:', error);
      toast.error(
        error.message || 'Erro ao fazer upload de imagem. Tente novamente.'
      );
      // Se houver erro, manter o preview anterior ou limpar se for local
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
      await onPromoteToAdmin(room.id, [userId]);
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

    if (!onRemoveAdmin) {
      toast.error('Função de remover administrador não disponível');
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

    // Verificar se é o último administrador
    const adminCount = room?.participants.filter(p => p.isAdmin).length || 0;
    if (adminCount <= 1) {
      toast.error('Não é possível remover o último administrador do grupo');
      return;
    }

    try {
      setRemovingAdmins(prev => ({ ...prev, [userId]: true }));
      await onRemoveAdmin(room.id, [userId]);
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

  const handleRemoveUser = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!room) return;

    // Não permitir remover o usuário atual
    if (userId === currentUser?.id) {
      toast.error('Você não pode remover a si mesmo do grupo');
      return;
    }

    try {
      setRemovingParticipants(prev => ({ ...prev, [userId]: true }));
      await onRemoveParticipant(room.id, userId);
      toast.success('Participante removido com sucesso!');
      // Remover da lista selecionada também
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

  const handleArchive = async () => {
    if (!room || !onArchiveRoom) return;

    if (!window.confirm('Tem certeza que deseja arquivar esta conversa?')) {
      return;
    }

    try {
      await onArchiveRoom(room.id);
      toast.success('Conversa arquivada com sucesso!');
      handleClose();
    } catch (error: any) {
      console.error('Erro ao arquivar conversa:', error);
      toast.error(
        error.message || 'Erro ao arquivar conversa. Tente novamente.'
      );
    }
  };

  const filteredUsers = users.filter(user => {
    // Filtrar o usuário atual
    if (user.id === currentUser?.id) {
      return false;
    }

    // Filtrar por termo de busca
    if (!searchTerm.trim()) {
      return true;
    }

    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));
  const currentParticipants = room?.participants || [];
  const currentParticipantUsers = users.filter(u =>
    currentParticipants.some(p => p.userId === u.id)
  );

  if (!isOpen || !room) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdGroup size={20} style={{ marginRight: '8px' }} />
            Editar Grupo
          </ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <MdClose size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Informações do criador */}
          {creator && (
            <FormGroup>
              <Label>Criado por</Label>
              <div
                style={{
                  padding: '8px 12px',
                  background: 'var(--theme-background-secondary)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                {creator.name} ({creator.email})
              </div>
            </FormGroup>
          )}

          {/* Imagem do grupo */}
          <FormGroup>
            <Label>Imagem do Grupo</Label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt='Preview'
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid var(--theme-border)',
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <input
                  ref={imageInputRef}
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/gif,image/webp'
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
                <button
                  type='button'
                  onClick={() => imageInputRef.current?.click()}
                  disabled={!isCurrentUserAdmin || uploadingImage}
                  style={{
                    padding: '8px 16px',
                    background: isCurrentUserAdmin
                      ? 'var(--theme-primary)'
                      : 'var(--theme-border)',
                    color: isCurrentUserAdmin
                      ? 'white'
                      : 'var(--theme-text-secondary)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isCurrentUserAdmin ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  title={
                    !isCurrentUserAdmin
                      ? 'Apenas administradores podem alterar a imagem'
                      : 'Selecionar imagem'
                  }
                >
                  <MdImage size={18} />
                  {imagePreview ? 'Alterar Imagem' : 'Adicionar Imagem'}
                </button>
                {imageInputRef.current?.files?.[0] && (
                  <button
                    type='button'
                    onClick={handleUploadImage}
                    disabled={uploadingImage}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: 'var(--theme-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: uploadingImage ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {uploadingImage ? 'Enviando...' : 'Salvar Imagem'}
                  </button>
                )}
              </div>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>Nome do Grupo *</Label>
            <Input
              type='text'
              placeholder='Ex: Equipe de Vendas'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              maxLength={100}
              disabled={!isCurrentUserAdmin}
              title={
                !isCurrentUserAdmin
                  ? 'Apenas administradores podem editar o nome'
                  : ''
              }
            />
          </FormGroup>

          {/* Participantes atuais */}
          {currentParticipantUsers.length > 0 && (
            <FormGroup>
              <Label>
                Participantes Atuais ({currentParticipantUsers.length})
              </Label>
              <UsersList>
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
                  const canRemove =
                    isCurrentUserAdmin && !isCurrentUser && !isCreator;
                  const canPromote =
                    isCurrentUserAdmin && !isCurrentUser && !isAdmin;
                  const canRemoveAdmin =
                    isCurrentUserAdmin &&
                    !isCurrentUser &&
                    isAdmin &&
                    !isCreator &&
                    adminCount > 1 &&
                    !!onRemoveAdmin;

                  return (
                    <UserCard
                      key={user.id}
                      $isSelected={false}
                      style={{ opacity: isRemoving ? 0.5 : 1 }}
                    >
                      <UserAvatar>
                        {user.name.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <UserInfo style={{ flex: 1 }}>
                        <UserName
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {user.name}
                          {isCurrentUser && ' (Você)'}
                          {isAdmin && (
                            <MdStar
                              size={16}
                              style={{ color: '#fbbf24' }}
                              title='Administrador'
                            />
                          )}
                          {isCreator && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--theme-text-secondary)',
                                fontStyle: 'italic',
                              }}
                            >
                              (Criador)
                            </span>
                          )}
                        </UserName>
                        <UserEmail>
                          <MdEmail size={14} />
                          {user.email}
                        </UserEmail>
                      </UserInfo>
                      <div
                        style={{
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center',
                        }}
                      >
                        {canPromote && (
                          <button
                            onClick={() => handlePromoteToAdmin(user.id)}
                            type='button'
                            disabled={isPromoting}
                            style={{
                              padding: '4px 8px',
                              background: 'transparent',
                              border: '1px solid var(--theme-border)',
                              borderRadius: '4px',
                              cursor: isPromoting ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              color: 'var(--theme-text-secondary)',
                            }}
                            title='Promover a administrador'
                          >
                            <MdStarBorder size={14} />
                            {isPromoting ? 'Promovendo...' : 'Promover'}
                          </button>
                        )}
                        {canRemoveAdmin && (
                          <button
                            onClick={() => handleRemoveAdmin(user.id)}
                            type='button'
                            disabled={isRemovingAdmin}
                            style={{
                              padding: '4px 8px',
                              background: 'transparent',
                              border: '1px solid var(--theme-border)',
                              borderRadius: '4px',
                              cursor: isRemovingAdmin
                                ? 'not-allowed'
                                : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              color: 'var(--theme-text-secondary)',
                            }}
                            title='Remover status de administrador'
                          >
                            <MdStar size={14} style={{ color: '#fbbf24' }} />
                            {isRemovingAdmin ? 'Removendo...' : 'Remover Admin'}
                          </button>
                        )}
                        {canRemove && (
                          <RemoveUserButton
                            onClick={() => handleRemoveParticipant(user.id)}
                            type='button'
                            disabled={isRemoving}
                            style={{ marginLeft: '8px' }}
                            title='Remover participante'
                          >
                            <MdDelete size={16} />
                          </RemoveUserButton>
                        )}
                      </div>
                    </UserCard>
                  );
                })}
              </UsersList>
            </FormGroup>
          )}

          {selectedUsers.filter(
            u => !currentParticipants.some(p => p.userId === u.id)
          ).length > 0 && (
            <FormGroup>
              <Label>
                Novos Participantes (
                {
                  selectedUsers.filter(
                    u => !currentParticipants.some(p => p.userId === u.id)
                  ).length
                }
                )
              </Label>
              <SelectedUsersContainer>
                {selectedUsers
                  .filter(
                    u => !currentParticipants.some(p => p.userId === u.id)
                  )
                  .map(user => (
                    <SelectedUserTag key={user.id}>
                      <UserAvatar $small>
                        {user.name.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <span>{user.name}</span>
                      <RemoveUserButton
                        onClick={() => handleRemoveUser(user.id)}
                        type='button'
                      >
                        <MdClose size={14} />
                      </RemoveUserButton>
                    </SelectedUserTag>
                  ))}
              </SelectedUsersContainer>
            </FormGroup>
          )}

          <FormGroup>
            <Label>Buscar Participantes para Adicionar</Label>
            <SearchContainer>
              <SearchInput
                type='text'
                placeholder='Digite o nome ou email do usuário...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <SearchIcon>
                <MdPerson size={18} />
              </SearchIcon>
            </SearchContainer>
          </FormGroup>

          <FormGroup>
            <Label>Adicionar Participantes</Label>
            <UsersList>
              {filteredUsers.filter(
                u => !currentParticipants.some(p => p.userId === u.id)
              ).length === 0 ? (
                <EmptyState>
                  <MdPerson size={48} />
                  <EmptyText>
                    {searchTerm
                      ? 'Nenhum usuário encontrado'
                      : 'Digite para buscar usuários'}
                  </EmptyText>
                </EmptyState>
              ) : (
                filteredUsers
                  .filter(
                    u => !currentParticipants.some(p => p.userId === u.id)
                  )
                  .map(user => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <UserCard
                        key={user.id}
                        $isSelected={isSelected}
                        onClick={() => handleToggleUser(user.id)}
                      >
                        <UserAvatar>
                          {user.name.charAt(0).toUpperCase()}
                        </UserAvatar>
                        <UserInfo>
                          <UserName>{user.name}</UserName>
                          <UserEmail>
                            <MdEmail size={14} />
                            {user.email}
                          </UserEmail>
                        </UserInfo>
                        {isSelected && <SelectedIndicator>✓</SelectedIndicator>}
                      </UserCard>
                    );
                  })
              )}
            </UsersList>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          {onArchiveRoom && (
            <button
              onClick={handleArchive}
              style={{
                marginRight: 'auto',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--theme-border)',
                borderRadius: '6px',
                color: 'var(--theme-text-secondary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
              title='Arquivar conversa'
            >
              Arquivar Conversa
            </button>
          )}
          <CancelButton onClick={handleClose} disabled={updating}>
            Cancelar
          </CancelButton>
          <CreateButton
            onClick={handleUpdate}
            disabled={!groupName.trim() || updating || !isCurrentUserAdmin}
            title={
              !isCurrentUserAdmin
                ? 'Apenas administradores podem editar o grupo'
                : ''
            }
          >
            {updating ? 'Salvando...' : 'Salvar Alterações'}
          </CreateButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
