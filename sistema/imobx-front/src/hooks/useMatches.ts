/**
 * Hook para gerenciar matches
 */

import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { matchApi } from '../services/matchApi';
import { CompanyContext } from '../contexts/CompanyContextDefinition';
import type {
  Match,
  MatchStatus,
  MatchListResponse,
  MatchSummary,
} from '../types/match';

export interface UseMatchesParams {
  status?: MatchStatus;
  page?: number;
  limit?: number;
  propertyId?: string;
  clientId?: string;
  autoFetch?: boolean;
}

export function useMatches(params?: UseMatchesParams) {
  // Sempre chamar useContext primeiro, na mesma ordem
  const companyContext = useContext(CompanyContext);

  // Sempre chamar todos os useState na mesma ordem, sem condicionais
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Extrair selectedCompany após todos os useState
  const selectedCompany = companyContext?.selectedCompany || null;

  // Sempre chamar useMemo na mesma ordem
  const shouldAutoFetch = useMemo(() => {
    if (!params) return true;
    if (params.autoFetch === false) return false;
    if (params.propertyId !== undefined && !params.propertyId) return false;
    if (params.clientId !== undefined && !params.clientId) return false;
    return true;
  }, [params?.autoFetch, params?.propertyId, params?.clientId]);

  // Sempre chamar useCallback na mesma ordem
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: MatchListResponse = await matchApi.getMyMatches({
        status: params?.status,
        page: params?.page || 1,
        limit: params?.limit || 50,
        propertyId: params?.propertyId,
        clientId: params?.clientId,
      });

      setMatches(response.matches);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao carregar matches:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [
    params?.status,
    params?.page,
    params?.limit,
    params?.propertyId,
    params?.clientId,
  ]);

  // Sempre chamar useEffect por último, na mesma ordem
  useEffect(() => {
    if (!shouldAutoFetch) {
      setLoading(false);
      return;
    }

    load();
  }, [shouldAutoFetch, load, selectedCompany?.id]);

  const refetch = () => {
    load();
  };

  return {
    matches,
    loading,
    error,
    total,
    totalPages,
    refetch,
  };
}

interface MatchSummaryWithRecent extends MatchSummary {
  recent: Match[];
}

export function useMatchesSummary() {
  // Sempre chamar useContext na mesma ordem
  const companyContext = useContext(CompanyContext);

  // Sempre chamar todos os useState na mesma ordem
  const [summary, setSummary] = useState<MatchSummaryWithRecent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Extrair selectedCompany após todos os useState
  const selectedCompany = companyContext?.selectedCompany || null;

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar todos os matches para calcular o resumo
      const response: MatchListResponse = await matchApi.getMyMatches({
        page: 1,
        limit: 100,
      });

      const matches = response.matches;

      // Calcular resumo
      const pending = matches.filter(m => m.status === 'pending').length;
      const accepted = matches.filter(m => m.status === 'accepted').length;
      const ignored = matches.filter(m => m.status === 'ignored').length;
      const highScore = matches.filter(m => m.matchScore >= 80).length;

      // Pegar os 5 matches mais recentes
      const recent = matches
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      setSummary({
        total: matches.length,
        pending,
        accepted,
        ignored,
        highScore,
        recent,
      });
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao carregar resumo de matches:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedCompany?.id]);

  const refetch = () => {
    load();
  };

  return {
    summary,
    loading,
    error,
    refetch,
  };
}
