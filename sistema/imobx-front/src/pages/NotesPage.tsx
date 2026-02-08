import React, { useState, useEffect, useMemo } from 'react';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDelete,
  MdArchive,
  MdPin,
  MdPinDrop,
  MdSchedule,
  MdPerson,
  MdImage,
  MdClose,
  MdCheck,
  MdError,
  MdViewModule,
  MdViewList,
  MdDescription,
  MdUnarchive,
  MdClear,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { NotesShimmer } from '../components/common/Shimmer';
import { useNotes } from '../hooks/useNotes';
import { PermissionButton } from '../components/common/PermissionButton';
import { Tooltip } from '../components/ui/Tooltip';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatPhoneDisplay } from '../utils/masks';
import {
  ClickableEmail,
  ClickablePhone,
} from '../components/common/ClickableContact';
import { useCompany } from '../hooks/useCompany';
import { FilterDrawer } from '../components/common/FilterDrawer';
import styled from 'styled-components';
import {
  NotesPageContainer,
  NotesHeader,
  NotesControls,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterToggle,
  NotesTitle,
  CreateNoteButton,
  NotesGrid,
  NotesList,
  NoteListItem,
  NoteListIcon,
  NoteListContent,
  NoteListHeader,
  NoteListTitle,
  NoteListMeta,
  NoteListActions,
  NoteCard,
  NoteCardHeader,
  NoteType,
  NotePriority,
  NoteContent,
  NoteMeta,
  NoteActions,
  ActionButton,
  EmptyState,
  EmptyTitle,
  EmptyMessage,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormContent,
  ModalActions,
  Button,
  Tag,
  TagContainer,
  ImageContainer,
  ClientInfo,
  ReminderInfo,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ToastContainer,
  ToastIcon,
  ToastMessage,
} from '../styles/pages/NotesPageStyles';
import { type Note } from '../services/notesApi';

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const typeLabels = {
  basic: 'Básica',
  advanced: 'Avançada',
};

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notes,
    isLoading,
    error,
    deleteNote,
    archiveNote,
    restoreNote,
    togglePin,
    getNotes,
    stats,
    getStats,
  } = useNotes();
  const { selectedCompany } = useCompany();

  // Estados do modal
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Estado de visualização (lista por padrão)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [processingNotes, setProcessingNotes] = useState<Set<string>>(
    new Set()
  );
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isLoadingArchived, setIsLoadingArchived] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    status: 'active',
    isPinned: false,
    hasReminder: false,
  });
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState({
    type: '',
    priority: '',
    status: 'active',
    isPinned: false,
    hasReminder: false,
    search: '',
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  // Estados de feedback
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Carregar estatísticas e notas
  useEffect(() => {
    if (selectedCompany) {
      getStats();
      getNotes({ status: showArchived ? 'archived' : 'active' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  // Handler para alternar entre arquivadas/ativas
  const handleToggleArchived = async () => {
    if (isLoadingArchived) return; // Evitar múltiplos cliques

    const newShowArchived = !showArchived;
    setIsLoadingArchived(true);

    try {
      await getNotes({ status: newShowArchived ? 'archived' : 'active' });
      setShowArchived(newShowArchived);
    } catch {
      toast.error('Erro ao carregar anotações');
    } finally {
      setIsLoadingArchived(false);
    }
  };

  // Filtrar anotações
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filtro por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        note =>
          note.title.toLowerCase().includes(search) ||
          note.content?.toLowerCase().includes(search) ||
          note.clientName?.toLowerCase().includes(search)
      );
    }

    // Filtros específicos
    if (filters.type) {
      filtered = filtered.filter(note => note.type === filters.type);
    }

    if (filters.priority) {
      filtered = filtered.filter(note => note.priority === filters.priority);
    }

    if (filters.isPinned) {
      filtered = filtered.filter(note => note.isPinned);
    }

    if (filters.hasReminder) {
      filtered = filtered.filter(note => note.hasReminder);
    }

    // Ordenar: fixadas primeiro, depois por data de criação
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes, searchTerm, filters]);

  // Navegar para página de criação
  const handleCreateNote = () => {
    navigate('/notes/create');
  };

  // Navegar para página de edição
  const handleEditNote = (note: Note) => {
    navigate(`/notes/edit/${note.id}`);
  };

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters({
        type: filters.type,
        priority: filters.priority,
        status: filters.status,
        isPinned: filters.isPinned,
        hasReminder: filters.hasReminder,
        search: '',
        startDate: undefined,
        endDate: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFiltersModal]);

  // Funções de filtros
  const handleApplyFilters = () => {
    setFilters({
      type: localFilters.type,
      priority: localFilters.priority,
      status: localFilters.status,
      isPinned: localFilters.isPinned,
      hasReminder: localFilters.hasReminder,
    });
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      type: '',
      priority: '',
      status: 'active',
      isPinned: false,
      hasReminder: false,
      search: '',
      startDate: undefined,
      endDate: undefined,
    };
    setLocalFilters(cleared);
    setFilters({
      type: cleared.type,
      priority: cleared.priority,
      status: cleared.status,
      isPinned: cleared.isPinned,
      hasReminder: cleared.hasReminder,
    });
    setShowFiltersModal(false);
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (note: Note) => {
    setNoteToDelete({ id: note.id, title: note.title });
    setShowDeleteModal(true);
  };

  // Confirmar exclusão
  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    const noteId = noteToDelete.id;

    // Evitar múltiplos cliques
    if (processingNotes.has(noteId)) return;

    setProcessingNotes(prev => new Set(prev).add(noteId));

    // Fechar modal imediatamente (atualização otimista)
    setShowDeleteModal(false);
    setNoteToDelete(null);

    try {
      // Atualização otimista já aconteceu, apenas chamar API
      await deleteNote(noteId);
      toast.success('Anotação excluída com sucesso!');
    } catch {
      // Rollback já foi feito no hook, apenas mostrar erro
      toast.error('Erro ao excluir anotação');
    } finally {
      setProcessingNotes(prev => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
    }
  };

  // Cancelar exclusão
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  // Arquivar anotação
  const handleArchive = async (id: string) => {
    // Evitar múltiplos cliques
    if (processingNotes.has(id)) return;

    setProcessingNotes(prev => new Set(prev).add(id));
    try {
      // Atualização otimista já aconteceu, apenas chamar API
      await archiveNote(id);
      setToastMessage('Anotação arquivada com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch {
      // Rollback já foi feito no hook, apenas mostrar erro
      setToastMessage('Erro ao arquivar anotação');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setProcessingNotes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Restaurar anotação
  const handleRestore = async (id: string) => {
    setIsRestoring(id);
    try {
      await restoreNote(id);
      setToastMessage('Anotação restaurada com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      // Recarregar apenas as notas arquivadas para evitar duplicação
      await getNotes({ status: 'archived' });
    } catch {
      setToastMessage('Erro ao restaurar anotação');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsRestoring(null);
    }
  };

  // Toggle pin
  const handleTogglePin = async (id: string) => {
    // Evitar múltiplos cliques
    if (processingNotes.has(id)) return;

    setProcessingNotes(prev => new Set(prev).add(id));
    try {
      // Atualização otimista já acontece dentro do hook
      await togglePin(id);
      // Sucesso silencioso - já foi atualizado otimisticamente
    } catch {
      // Rollback já foi feito no hook, apenas mostrar erro
      setToastMessage('Erro ao fixar/desfixar anotação');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setProcessingNotes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Renderizar prioridade
  const renderPriority = (priority: string) => (
    <NotePriority $priority={priority}>
      {priorityLabels[priority as keyof typeof priorityLabels]}
    </NotePriority>
  );

  // Renderizar tipo
  const renderType = (type: string) => (
    <NoteType $type={type}>
      {typeLabels[type as keyof typeof typeLabels]}
    </NoteType>
  );

  // Renderizar conteúdo da anotação
  const renderNoteContent = (note: Note) => {
    const hasClient = note.clientName || note.clientPhone || note.clientEmail;
    const hasImages = note.images && note.images.length > 0;
    const hasTags = note.tags && note.tags.length > 0;

    return (
      <NoteContent>
        <div>{note.content}</div>

        {hasClient && (
          <ClientInfo>
            <MdPerson size={16} />
            <span>{note.clientName}</span>
            {note.clientPhone && (
              <>
                <span style={{ margin: '0 4px' }}>•</span>
                <ClickablePhone phone={note.clientPhone} showIcon={false}>
                  {formatPhoneDisplay(note.clientPhone)}
                </ClickablePhone>
              </>
            )}
            {note.clientEmail && (
              <>
                <span style={{ margin: '0 4px' }}>•</span>
                <ClickableEmail email={note.clientEmail} showIcon={false}>
                  {note.clientEmail}
                </ClickableEmail>
              </>
            )}
          </ClientInfo>
        )}

        {note.hasReminder && note.reminderDate && (
          <ReminderInfo>
            <MdSchedule size={16} />
            <span>
              Lembrete:{' '}
              {new Date(note.reminderDate).toLocaleDateString('pt-BR')}
            </span>
          </ReminderInfo>
        )}

        {hasImages && (
          <ImageContainer>
            <MdImage size={16} />
            <span>{note.images!.length} imagem(ns)</span>
          </ImageContainer>
        )}

        {hasTags && (
          <TagContainer>
            {note.tags!.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagContainer>
        )}
      </NoteContent>
    );
  };

  // Loading state
  if (isLoading && notes.length === 0) {
    return (
      <Layout>
        <NotesPageContainer>
          <NotesShimmer />
        </NotesPageContainer>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <NotesPageContainer>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar anotações</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={() => getNotes()}>
              Tentar novamente
            </RetryButton>
          </ErrorContainer>
        </NotesPageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <NotesPageContainer>
        <NotesHeader>
          <NotesTitle>
            <h1>{showArchived ? 'Anotações Arquivadas' : 'Anotações'}</h1>
            <p>
              {showArchived
                ? 'Visualize e restaure suas anotações arquivadas'
                : 'Organize e gerencie suas anotações pessoais e profissionais'}
            </p>
            {stats && (
              <StatsContainer>
                <StatCard $type='total'>
                  <StatValue $type='total'>{stats.total}</StatValue>
                  <StatLabel>Total de Anotações</StatLabel>
                </StatCard>
                <StatCard $type='recent'>
                  <StatValue $type='recent'>{stats.basic}</StatValue>
                  <StatLabel>Básicas</StatLabel>
                </StatCard>
                <StatCard $type='pinned'>
                  <StatValue $type='pinned'>{stats.advanced}</StatValue>
                  <StatLabel>Avançadas</StatLabel>
                </StatCard>
                <StatCard $type='archived'>
                  <StatValue $type='archived'>{stats.pinned}</StatValue>
                  <StatLabel>Fixadas</StatLabel>
                </StatCard>
              </StatsContainer>
            )}
          </NotesTitle>
          <PermissionButton
            permission='note:create'
            onClick={handleCreateNote}
            variant='primary'
            size='medium'
          >
            <MdAdd size={18} />
            Nova Anotação
          </PermissionButton>
        </NotesHeader>

        <NotesControls>
          <SearchContainer>
            <SearchInput
              type='text'
              placeholder='Buscar anotações...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </SearchContainer>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            <FilterToggle
              $hasActiveFilters={showArchived}
              onClick={handleToggleArchived}
              disabled={isLoadingArchived}
              title={
                showArchived
                  ? 'Ver anotações ativas'
                  : 'Ver anotações arquivadas'
              }
            >
              {isLoadingArchived ? (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid currentColor',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : showArchived ? (
                <MdUnarchive size={18} />
              ) : (
                <MdArchive size={18} />
              )}
              {isLoadingArchived
                ? 'Carregando...'
                : showArchived
                  ? 'Ativas'
                  : 'Arquivadas'}
            </FilterToggle>
            <FilterToggle
              $hasActiveFilters={false}
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              title={
                viewMode === 'list'
                  ? 'Visualizar em cards'
                  : 'Visualizar em lista'
              }
            >
              {viewMode === 'list' ? (
                <MdViewModule size={18} />
              ) : (
                <MdViewList size={18} />
              )}
              {viewMode === 'list' ? 'Cards' : 'Lista'}
            </FilterToggle>
            <FilterToggle
              $hasActiveFilters={Object.keys(filters).some(
                key =>
                  filters[key as keyof typeof filters] &&
                  filters[key as keyof typeof filters] !== 'active'
              )}
              onClick={() => setShowFiltersModal(true)}
            >
              <MdFilterList size={18} />
              Filtros
            </FilterToggle>
          </div>
        </NotesControls>

        {filteredNotes.length === 0 ? (
          <EmptyState>
            <EmptyTitle>Nenhuma anotação encontrada</EmptyTitle>
            <EmptyMessage>
              {searchTerm || Object.values(filters).some(f => f)
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira anotação'}
            </EmptyMessage>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <CreateNoteButton onClick={handleCreateNote}>
                <MdAdd size={18} />
                Nova Anotação
              </CreateNoteButton>
            )}
          </EmptyState>
        ) : viewMode === 'list' ? (
          <NotesList>
            {filteredNotes.map(note => (
              <NoteListItem
                key={note.id}
                $color={note.color}
                $isPinned={note.isPinned}
              >
                <NoteListIcon $color={note.color}>
                  {note.hasReminder && <MdSchedule size={24} />}
                  {!note.hasReminder &&
                    (note.clientName ||
                      note.clientPhone ||
                      note.clientEmail) && <MdPerson size={24} />}
                  {!note.hasReminder &&
                    !(
                      note.clientName ||
                      note.clientPhone ||
                      note.clientEmail
                    ) && <MdDescription size={24} />}
                </NoteListIcon>

                <NoteListContent>
                  <NoteListHeader>
                    <NoteListTitle>{note.title}</NoteListTitle>
                    {note.isPinned && <MdPin size={18} color={note.color} />}
                    {renderPriority(note.priority)}
                  </NoteListHeader>

                  <NoteListMeta>
                    <span>{renderType(note.type)}</span>
                    <span>•</span>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    {note.tags && note.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{note.tags.length} tag(s)</span>
                      </>
                    )}
                  </NoteListMeta>
                </NoteListContent>

                <NoteListActions>
                  {!showArchived && (
                    <Tooltip
                      content={
                        note.isPinned ? 'Desfixar anotação' : 'Fixar anotação'
                      }
                      placement='top'
                    >
                      <ActionButton
                        onClick={() => handleTogglePin(note.id)}
                        title={
                          note.isPinned ? 'Desfixar anotação' : 'Fixar anotação'
                        }
                      >
                        {note.isPinned ? (
                          <MdPinDrop size={16} />
                        ) : (
                          <MdPin size={16} />
                        )}
                      </ActionButton>
                    </Tooltip>
                  )}
                  <Tooltip content='Editar anotação' placement='top'>
                    <PermissionButton
                      permission='note:update'
                      onClick={() => handleEditNote(note)}
                      variant='secondary'
                      size='small'
                      tooltip='Editar anotação'
                    >
                      <MdEdit size={16} />
                    </PermissionButton>
                  </Tooltip>
                  {showArchived ? (
                    <Tooltip content='Restaurar anotação' placement='top'>
                      <PermissionButton
                        permission='note:update'
                        onClick={() => handleRestore(note.id)}
                        variant='primary'
                        size='small'
                        disabled={isRestoring === note.id}
                        tooltip='Restaurar anotação'
                      >
                        {isRestoring === note.id ? (
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid #ccc',
                              borderTop: '2px solid #10b981',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                        ) : (
                          <MdUnarchive size={16} />
                        )}
                      </PermissionButton>
                    </Tooltip>
                  ) : (
                    <Tooltip content='Arquivar anotação' placement='top'>
                      <PermissionButton
                        permission='note:update'
                        onClick={() => handleArchive(note.id)}
                        variant='secondary'
                        size='small'
                        disabled={processingNotes.has(note.id)}
                        tooltip='Arquivar anotação'
                      >
                        <MdArchive size={16} />
                      </PermissionButton>
                    </Tooltip>
                  )}
                  <Tooltip content='Excluir anotação' placement='top'>
                    <PermissionButton
                      permission='note:delete'
                      onClick={() => handleDeleteClick(note)}
                      variant='danger'
                      size='small'
                      disabled={processingNotes.has(note.id)}
                      tooltip='Excluir anotação'
                    >
                      <MdDelete size={16} />
                    </PermissionButton>
                  </Tooltip>
                </NoteListActions>
              </NoteListItem>
            ))}
          </NotesList>
        ) : (
          <NotesGrid>
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                $color={note.color}
                $isPinned={note.isPinned}
              >
                <NoteCardHeader>
                  <div>
                    <h3>{note.title}</h3>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      {renderType(note.type)}
                      {renderPriority(note.priority)}
                    </div>
                  </div>
                  <NoteActions>
                    {!showArchived && (
                      <Tooltip
                        content={
                          note.isPinned ? 'Desfixar anotação' : 'Fixar anotação'
                        }
                        placement='top'
                      >
                        <ActionButton
                          onClick={() => handleTogglePin(note.id)}
                          title={
                            note.isPinned
                              ? 'Desfixar anotação'
                              : 'Fixar anotação'
                          }
                        >
                          {note.isPinned ? (
                            <MdPinDrop size={16} />
                          ) : (
                            <MdPin size={16} />
                          )}
                        </ActionButton>
                      </Tooltip>
                    )}
                    <Tooltip content='Editar anotação' placement='top'>
                      <PermissionButton
                        permission='note:update'
                        onClick={() => handleEditNote(note)}
                        variant='secondary'
                        size='small'
                        tooltip='Editar anotação'
                      >
                        <MdEdit size={16} />
                      </PermissionButton>
                    </Tooltip>
                    {showArchived ? (
                      <Tooltip content='Restaurar anotação' placement='top'>
                        <PermissionButton
                          permission='note:update'
                          onClick={() => handleRestore(note.id)}
                          variant='primary'
                          size='small'
                          disabled={isRestoring === note.id}
                          tooltip='Restaurar anotação'
                        >
                          {isRestoring === note.id ? (
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #ccc',
                                borderTop: '2px solid #10b981',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                              }}
                            />
                          ) : (
                            <MdUnarchive size={16} />
                          )}
                        </PermissionButton>
                      </Tooltip>
                    ) : (
                      <Tooltip content='Arquivar anotação' placement='top'>
                        <PermissionButton
                          permission='note:update'
                          onClick={() => handleArchive(note.id)}
                          variant='secondary'
                          size='small'
                          disabled={processingNotes.has(note.id)}
                          tooltip='Arquivar anotação'
                        >
                          <MdArchive size={16} />
                        </PermissionButton>
                      </Tooltip>
                    )}
                    <Tooltip content='Excluir anotação' placement='top'>
                      <PermissionButton
                        permission='note:delete'
                        onClick={() => handleDeleteClick(note)}
                        variant='danger'
                        size='small'
                        disabled={processingNotes.has(note.id)}
                        tooltip='Excluir anotação'
                      >
                        <MdDelete size={16} />
                      </PermissionButton>
                    </Tooltip>
                  </NoteActions>
                </NoteCardHeader>
                {renderNoteContent(note)}
                <NoteMeta>
                  <span>
                    Criado em{' '}
                    {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  {note.updatedAt !== note.createdAt && (
                    <span>
                      • Atualizado em{' '}
                      {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </NoteMeta>
              </NoteCard>
            ))}
          </NotesGrid>
        )}

        {/* Toast de Sucesso */}
        {showSuccessToast && (
          <ToastContainer $type='success'>
            <ToastIcon>
              <MdCheck size={20} />
            </ToastIcon>
            <ToastMessage>{toastMessage}</ToastMessage>
          </ToastContainer>
        )}

        {/* Toast de Erro */}
        {showErrorToast && (
          <ToastContainer $type='error'>
            <ToastIcon>
              <MdError size={20} />
            </ToastIcon>
            <ToastMessage>{toastMessage}</ToastMessage>
          </ToastContainer>
        )}

        {/* Modal de Filtros */}
        <FilterDrawer
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title='Filtros de Anotações'
          footer={
            <>
              {Object.values(filters).some(
                value => value !== undefined && value !== '' && value !== false
              ) && (
                <ClearButton onClick={handleClearFilters}>
                  <MdClear size={16} />
                  Limpar Filtros
                </ClearButton>
              )}
              <ApplyButton onClick={handleApplyFilters}>
                <MdFilterList size={16} />
                Aplicar Filtros
              </ApplyButton>
            </>
          }
        >
          <FiltersContainer>
            <FilterSection>
              <FilterSectionTitle>
                <MdSearch size={20} />
                Busca por Texto
              </FilterSectionTitle>

              <FilterSearchContainer>
                <FilterSearchIcon>
                  <MdSearch size={18} />
                </FilterSearchIcon>
                <FilterSearchInput
                  type='text'
                  placeholder='Buscar por título ou conteúdo...'
                  value={localFilters.search || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                />
              </FilterSearchContainer>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>
                <MdDescription size={20} />
                Filtros por Categoria
              </FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Tipo</FilterLabel>
                  <FilterSelect
                    value={localFilters.type || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        type: e.target.value || '',
                      }))
                    }
                  >
                    <option value=''>Todos os tipos</option>
                    <option value='basic'>Básica</option>
                    <option value='advanced'>Avançada</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Prioridade</FilterLabel>
                  <FilterSelect
                    value={localFilters.priority || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        priority: e.target.value || '',
                      }))
                    }
                  >
                    <option value=''>Todas as prioridades</option>
                    <option value='low'>Baixa</option>
                    <option value='medium'>Média</option>
                    <option value='high'>Alta</option>
                    <option value='urgent'>Urgente</option>
                  </FilterSelect>
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>📅 Filtro por Data</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Data Inicial</FilterLabel>
                  <FilterInput
                    type='date'
                    value={localFilters.startDate || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        startDate: e.target.value || undefined,
                      }))
                    }
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Data Final</FilterLabel>
                  <FilterInput
                    type='date'
                    value={localFilters.endDate || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        endDate: e.target.value || undefined,
                      }))
                    }
                  />
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            {Object.values(localFilters).some(
              value => value !== undefined && value !== '' && value !== false
            ) && (
              <FilterStats>
                <span>Filtros ativos aplicados</span>
              </FilterStats>
            )}
          </FiltersContainer>
        </FilterDrawer>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && noteToDelete && (
          <ModalOverlay $isOpen={true} onClick={handleDeleteCancel}>
            <ModalContent
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '500px' }}
            >
              <ModalHeader>
                <ModalTitle>Confirmar Exclusão</ModalTitle>
                <CloseButton onClick={handleDeleteCancel}>
                  <MdClose size={20} />
                </CloseButton>
              </ModalHeader>

              <FormContent>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#FEF2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      border: '2px solid #FECACA',
                    }}
                  >
                    <MdError size={32} color='#EF4444' />
                  </div>
                  <h3
                    style={{
                      margin: '0 0 8px',
                      color: 'var(--color-text)',
                      fontSize: '18px',
                    }}
                  >
                    Tem certeza que deseja excluir esta anotação?
                  </h3>
                  <p
                    style={{
                      margin: '0 0 16px',
                      color: 'var(--color-text-secondary)',
                      fontSize: '14px',
                    }}
                  >
                    <strong>"{noteToDelete.title}"</strong>
                  </p>
                  <p
                    style={{
                      margin: '0',
                      color: 'var(--color-text-secondary)',
                      fontSize: '12px',
                    }}
                  >
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </FormContent>

              <ModalActions>
                <Button
                  $variant='secondary'
                  onClick={handleDeleteCancel}
                  disabled={
                    noteToDelete && processingNotes.has(noteToDelete.id)
                  }
                >
                  Cancelar
                </Button>
                <Button
                  $variant='danger'
                  onClick={handleDeleteConfirm}
                  disabled={
                    noteToDelete && processingNotes.has(noteToDelete.id)
                  }
                >
                  Excluir Anotação
                </Button>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </NotesPageContainer>
    </Layout>
  );
};

// Styled Components para FilterDrawer
const FiltersContainer = styled.div`
  padding: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const FilterSearchContainer = styled.div`
  position: relative;
`;

const FilterSearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const FilterSearchInput = styled(FilterInput)`
  padding-left: 40px;
`;

const FilterStats = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default NotesPage;
