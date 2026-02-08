import { useState, useCallback } from 'react';
import { aiApi } from '../services/aiApi';
import type {
  GenerateDescriptionRequest,
  GeneratedDescription,
} from '../types/ai';

interface UseGenerateDescriptionReturn {
  generate: (
    data: GenerateDescriptionRequest
  ) => Promise<GeneratedDescription | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useGenerateDescription(): UseGenerateDescriptionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const generate = useCallback(async (data: GenerateDescriptionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiApi.generatePropertyDescription(data);
      return result;
    } catch (err: any) {
      const message = err?.message || 'Erro ao gerar descrição';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error, clearError };
}
