import { useState, useCallback } from 'react';
import { propertyApi } from '../services/propertyApi';
import type {
  IntelligentSearchFilters,
  IntelligentSearchResponse,
  IntelligentSearchResult,
} from '../types/property';

interface UseIntelligentPropertySearchReturn {
  results: IntelligentSearchResult[];
  stats: IntelligentSearchResponse['searchStats'] | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  search: (filters: IntelligentSearchFilters) => Promise<void>;
  clearResults: () => void;
}

export const useIntelligentPropertySearch =
  (): UseIntelligentPropertySearchReturn => {
    const [results, setResults] = useState<IntelligentSearchResult[]>([]);
    const [stats, setStats] = useState<
      IntelligentSearchResponse['searchStats'] | null
    >(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const search = useCallback(async (filters: IntelligentSearchFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await propertyApi.intelligentSearch(filters);

        setResults(response.results);
        setStats(response.searchStats);
        setTotal(response.total);
        setPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao realizar busca inteligente';
        console.error('❌ Erro na busca inteligente:', errorMessage);
        setError(errorMessage);
        setResults([]);
        setStats(null);
        setTotal(0);
        setPage(1);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const clearResults = useCallback(() => {
      setResults([]);
      setStats(null);
      setError(null);
      setTotal(0);
      setPage(1);
      setTotalPages(0);
    }, []);

    return {
      results,
      stats,
      isLoading,
      error,
      total,
      page,
      totalPages,
      search,
      clearResults,
    };
  };
