import { useState, useEffect, useCallback } from 'react';
import { tagsApi, type Tag } from '../services/tagsApi';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load all tags
  const loadTags = useCallback(async () => {
    if (loading || hasLoaded) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await tagsApi.getAll();
      setTags(data);
      setHasLoaded(true);
    } catch (err: any) {
      setError('Erro ao carregar tags');
      console.error('Error loading tags:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasLoaded]);

  // Create new tag
  const createTag = useCallback(
    async (data: { name: string; description?: string; color?: string }) => {
      try {
        setError(null);
        const newTag = await tagsApi.create(data);
        setTags(prev => [...prev, newTag]);
        return newTag;
      } catch (err: any) {
        setError('Erro ao criar tag');
        console.error('Error creating tag:', err);
        throw err;
      }
    },
    []
  );

  // Update tag
  const updateTag = useCallback(
    async (
      id: string,
      data: { name?: string; description?: string; color?: string }
    ) => {
      try {
        setError(null);
        const updatedTag = await tagsApi.update(id, data);
        setTags(prev => prev.map(tag => (tag.id === id ? updatedTag : tag)));
        return updatedTag;
      } catch (err: any) {
        setError('Erro ao atualizar tag');
        console.error('Error updating tag:', err);
        throw err;
      }
    },
    []
  );

  // Delete tag
  const deleteTag = useCallback(async (id: string) => {
    try {
      setError(null);
      await tagsApi.delete(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err: any) {
      setError('Erro ao deletar tag');
      console.error('Error deleting tag:', err);
      throw err;
    }
  }, []);

  // Get user tags
  const getUserTags = useCallback(async (userId: string): Promise<Tag[]> => {
    try {
      setError(null);
      return await tagsApi.getUserTags(userId);
    } catch (err: any) {
      setError('Erro ao carregar tags do usuário');
      console.error('Error loading user tags:', err);
      throw err;
    }
  }, []);

  // Set user tags
  const setUserTags = useCallback(async (userId: string, tagIds: string[]) => {
    try {
      setError(null);
      await tagsApi.setUserTags(userId, tagIds);
    } catch (err: any) {
      setError('Erro ao definir tags do usuário');
      console.error('Error setting user tags:', err);
      throw err;
    }
  }, []);

  // Load tags on mount
  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removido loadTags das dependências para evitar loop infinito

  return {
    tags,
    loading,
    error,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    getUserTags,
    setUserTags,
  };
};
