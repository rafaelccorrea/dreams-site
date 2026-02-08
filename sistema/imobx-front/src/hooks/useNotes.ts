import { useState, useCallback, useEffect } from 'react';
import {
  notesApi,
  type Note,
  type CreateNoteData,
  type UpdateNoteData,
  type NoteQueryParams,
  type NotesResponse,
  type NoteStats,
} from '../services/notesApi';
import { useCompany } from './useCompany';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';

interface UseNotesReturn {
  // Estados
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  stats: NoteStats | null;

  // Métodos de anotações
  getNotes: (params?: NoteQueryParams) => Promise<void>;
  getNote: (id: string) => Promise<Note>;
  createNote: (data: CreateNoteData) => Promise<Note>;
  updateNote: (id: string, data: UpdateNoteData) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<Note>;
  restoreNote: (id: string) => Promise<Note>;
  togglePin: (id: string) => Promise<Note>;
  shareNote: (id: string, userIds: string[]) => Promise<Note>;
  unshareNote: (id: string, userId: string) => Promise<Note>;
  getReminders: () => Promise<Note[]>;
  getStats: () => Promise<NoteStats>;

  // Métodos utilitários
  clearError: () => void;
  setCurrentNote: (note: Note | null) => void;
  refreshNotes: () => Promise<void>;
}

export const useNotes = (): UseNotesReturn => {
  // Estados principais
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState<NoteStats | null>(null);

  // Hook da empresa para detectar mudanças
  const { selectedCompany } = useCompany();

  // Buscar anotações
  const getNotes = useCallback(
    async (params: NoteQueryParams = {}): Promise<void> => {
      if (!selectedCompany) {
        setError('Nenhuma empresa selecionada');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response: NotesResponse = await notesApi.getNotes({
          ...params,
          companyId: selectedCompany.id,
        });

        setNotes(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao buscar anotações';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompany?.id]
  );

  // Recarregar anotações quando a empresa mudar
  useEffect(() => {
    if (selectedCompany) {
      // Limpar dados anteriores
      setNotes([]);
      setCurrentNote(null);
      setError(null);
      setStats(null);
      // Recarregar anotações da nova empresa
      getNotes({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  // Buscar anotação por ID
  const getNote = useCallback(async (id: string): Promise<Note> => {
    setIsLoading(true);
    setError(null);

    try {
      const note = await notesApi.getNote(id);
      setCurrentNote(note);
      return note;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Erro ao buscar anotação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar anotação
  const createNote = useCallback(
    async (data: CreateNoteData): Promise<Note> => {
      if (!selectedCompany) {
        throw new Error('Nenhuma empresa selecionada');
      }

      setIsLoading(true);
      setError(null);

      try {
        const newNote = await notesApi.createNote({
          ...data,
          companyId: selectedCompany.id,
        });

        // Adicionar à lista local
        setNotes(prev => [newNote, ...prev]);
        setTotal(prev => prev + 1);

        // Atualizar stats se disponível
        if (stats) {
          setStats(prev =>
            prev
              ? {
                  ...prev,
                  total: prev.total + 1,
                  [newNote.type]: prev[newNote.type] + 1,
                  ...(newNote.isPinned && { pinned: prev.pinned + 1 }),
                  ...(newNote.hasReminder && {
                    withReminders: prev.withReminders + 1,
                  }),
                }
              : null
          );
        }

        return newNote;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao criar anotação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCompany, stats]
  );

  // Atualizar anotação
  const updateNote = useCallback(
    async (id: string, data: UpdateNoteData): Promise<Note> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedNote = await notesApi.updateNote(id, data);

        // Atualizar na lista local
        setNotes(prev =>
          prev.map(note => (note.id === id ? updatedNote : note))
        );

        // Atualizar anotação atual se for a mesma
        if (currentNote?.id === id) {
          setCurrentNote(updatedNote);
        }

        return updatedNote;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao atualizar anotação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentNote?.id]
  );

  // Excluir anotação
  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      setError(null);

      // Encontrar a anotação atual
      const noteToDelete = notes.find(note => note.id === id);
      if (!noteToDelete) {
        throw new Error('Anotação não encontrada');
      }

      // Atualização otimista: remover imediatamente da lista
      setNotes(prev => prev.filter(note => note.id !== id));
      setTotal(prev => prev - 1);

      // Limpar anotação atual se for a mesma
      const previousCurrentNote = currentNote;
      if (currentNote?.id === id) {
        setCurrentNote(null);
      }

      // Atualizar stats otimisticamente
      if (stats) {
        setStats(prev =>
          prev
            ? {
                ...prev,
                total: prev.total - 1,
                [noteToDelete.type]: prev[noteToDelete.type] - 1,
                ...(noteToDelete.isPinned && { pinned: prev.pinned - 1 }),
                ...(noteToDelete.hasReminder && {
                  withReminders: prev.withReminders - 1,
                }),
              }
            : null
        );
      }

      try {
        // Fazer a chamada à API
        await notesApi.deleteNote(id);
      } catch (err: any) {
        // Rollback: restaurar anotação na lista
        setNotes(prev => {
          // Encontrar posição original ou adicionar ao final
          const index = prev.findIndex(
            note => note.createdAt > noteToDelete.createdAt
          );
          if (index === -1) {
            return [...prev, noteToDelete];
          }
          const newNotes = [...prev];
          newNotes.splice(index, 0, noteToDelete);
          return newNotes;
        });
        setTotal(prev => prev + 1);

        // Rollback anotação atual
        if (previousCurrentNote?.id === id) {
          setCurrentNote(previousCurrentNote);
        }

        // Rollback stats
        if (stats) {
          setStats(prev =>
            prev
              ? {
                  ...prev,
                  total: prev.total + 1,
                  [noteToDelete.type]: prev[noteToDelete.type] + 1,
                  ...(noteToDelete.isPinned && { pinned: prev.pinned + 1 }),
                  ...(noteToDelete.hasReminder && {
                    withReminders: prev.withReminders + 1,
                  }),
                }
              : null
          );
        }

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao excluir anotação';
        setError(errorMessage);
        throw err;
      }
    },
    [currentNote?.id, stats, notes]
  );

  // Arquivar anotação
  const archiveNote = useCallback(
    async (id: string): Promise<Note> => {
      setError(null);

      // Encontrar a anotação atual
      const noteToArchive = notes.find(note => note.id === id);
      if (!noteToArchive) {
        throw new Error('Anotação não encontrada');
      }

      // Atualização otimista: remover imediatamente da lista
      setNotes(prev => prev.filter(note => note.id !== id));
      setTotal(prev => prev - 1);

      // Atualizar stats otimisticamente
      if (stats) {
        setStats(prev =>
          prev
            ? {
                ...prev,
                total: prev.total - 1,
                [noteToArchive.type]: prev[noteToArchive.type] - 1,
                ...(noteToArchive.isPinned && { pinned: prev.pinned - 1 }),
                ...(noteToArchive.hasReminder && {
                  withReminders: prev.withReminders - 1,
                }),
              }
            : null
        );
      }

      try {
        // Fazer a chamada à API
        const archivedNote = await notesApi.archiveNote(id);
        return archivedNote;
      } catch (err: any) {
        // Rollback: restaurar anotação na lista
        setNotes(prev => {
          // Encontrar posição original ou adicionar ao final
          const index = prev.findIndex(
            note => note.createdAt > noteToArchive.createdAt
          );
          if (index === -1) {
            return [...prev, noteToArchive];
          }
          const newNotes = [...prev];
          newNotes.splice(index, 0, noteToArchive);
          return newNotes;
        });
        setTotal(prev => prev + 1);

        // Rollback stats
        if (stats) {
          setStats(prev =>
            prev
              ? {
                  ...prev,
                  total: prev.total + 1,
                  [noteToArchive.type]: prev[noteToArchive.type] + 1,
                  ...(noteToArchive.isPinned && { pinned: prev.pinned + 1 }),
                  ...(noteToArchive.hasReminder && {
                    withReminders: prev.withReminders + 1,
                  }),
                }
              : null
          );
        }

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao arquivar anotação';
        setError(errorMessage);
        throw err;
      }
    },
    [notes, stats]
  );

  // Restaurar anotação
  const restoreNote = useCallback(async (id: string): Promise<Note> => {
    setIsLoading(true);
    setError(null);

    try {
      const restoredNote = await notesApi.restoreNote(id);

      // Adicionar de volta à lista local
      setNotes(prev => [restoredNote, ...prev]);
      setTotal(prev => prev + 1);

      return restoredNote;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao restaurar anotação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle pin
  const togglePin = useCallback(
    async (id: string): Promise<Note> => {
      setError(null);

      // Encontrar a anotação atual
      const currentNoteData = notes.find(note => note.id === id);
      if (!currentNoteData) {
        throw new Error('Anotação não encontrada');
      }

      // Atualização otimista: atualizar imediatamente
      const optimisticNote = {
        ...currentNoteData,
        isPinned: !currentNoteData.isPinned,
      };

      setNotes(prev =>
        prev.map(note => (note.id === id ? optimisticNote : note))
      );

      // Atualizar anotação atual se for a mesma
      if (currentNote?.id === id) {
        setCurrentNote(optimisticNote);
      }

      // Atualizar stats otimisticamente
      if (stats) {
        setStats(prev =>
          prev
            ? {
                ...prev,
                pinned: optimisticNote.isPinned
                  ? prev.pinned + 1
                  : prev.pinned - 1,
              }
            : null
        );
      }

      try {
        // Fazer a chamada à API
        const updatedNote = await notesApi.togglePin(id);

        // Atualizar com dados reais da API
        setNotes(prev =>
          prev.map(note => (note.id === id ? updatedNote : note))
        );

        // Atualizar anotação atual se for a mesma
        if (currentNote?.id === id) {
          setCurrentNote(updatedNote);
        }

        return updatedNote;
      } catch (err: any) {
        // Rollback: reverter para estado anterior
        setNotes(prev =>
          prev.map(note => (note.id === id ? currentNoteData : note))
        );

        // Rollback anotação atual
        if (currentNote?.id === id) {
          setCurrentNote(currentNoteData);
        }

        // Rollback stats
        if (stats) {
          setStats(prev =>
            prev
              ? {
                  ...prev,
                  pinned: currentNoteData.isPinned
                    ? prev.pinned + 1
                    : prev.pinned - 1,
                }
              : null
          );
        }

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao fixar/desfixar anotação';
        setError(errorMessage);
        throw err;
      }
    },
    [currentNote?.id, notes, stats]
  );

  // Buscar lembretes
  const getReminders = useCallback(async (): Promise<Note[]> => {
    try {
      return await notesApi.getReminders();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao buscar lembretes';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Compartilhar anotação
  const shareNote = useCallback(
    async (id: string, userIds: string[]): Promise<Note> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedNote = await notesApi.shareNote(id, userIds);

        // Atualizar na lista local
        setNotes(prev =>
          prev.map(note => (note.id === id ? updatedNote : note))
        );

        // Atualizar anotação atual se for a mesma
        if (currentNote?.id === id) {
          setCurrentNote(updatedNote);
        }

        return updatedNote;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao compartilhar anotação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentNote?.id]
  );

  // Parar de compartilhar anotação
  const unshareNote = useCallback(
    async (id: string, userId: string): Promise<Note> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedNote = await notesApi.unshareNote(id, userId);

        // Atualizar na lista local
        setNotes(prev =>
          prev.map(note => (note.id === id ? updatedNote : note))
        );

        // Atualizar anotação atual se for a mesma
        if (currentNote?.id === id) {
          setCurrentNote(updatedNote);
        }

        return updatedNote;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Erro ao parar de compartilhar anotação';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentNote?.id]
  );

  // Buscar estatísticas
  const getStats = useCallback(async (): Promise<NoteStats> => {
    try {
      const statsData = await notesApi.getStats();
      setStats(statsData);
      return statsData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao buscar estatísticas';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Recarregar anotações
  const refreshNotes = useCallback(async (): Promise<void> => {
    await getNotes({ page: currentPage });
  }, [getNotes, currentPage]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Função estável para recarregar notas (sem dependências para evitar loop)
  const reloadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Recarregar notas
      const response = await notesApi.getNotes({ page: 1, limit: 20 });
      setNotes(response.data || []);
      setTotal(response.total || 0);
      setCurrentPage(response.page || 1);
      setTotalPages(response.totalPages || 1);

      // Recarregar estatísticas
      const statsData = await notesApi.getStats();
      setStats(statsData);

      // console.log('✅ Notas recarregadas após mudança de empresa');
    } catch (error: any) {
      console.error(
        '❌ Erro ao recarregar notas após mudança de empresa:',
        error
      );
      setError(error.response?.data?.message || 'Erro ao recarregar notas');
    } finally {
      setIsLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar notas automaticamente
  useAutoReloadOnCompanyChange(reloadNotes);

  return {
    // Estados
    notes,
    currentNote,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,
    stats,

    // Métodos
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    restoreNote,
    togglePin,
    shareNote,
    unshareNote,
    getReminders,
    getStats,
    clearError,
    setCurrentNote,
    refreshNotes,
  };
};
