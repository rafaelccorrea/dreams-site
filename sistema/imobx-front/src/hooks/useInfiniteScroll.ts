import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type CollectionKeys =
  | 'data'
  | 'items'
  | 'properties'
  | 'documents'
  | 'assets'
  | 'subscriptions'
  | 'images';

export interface PaginatedBackendResponse<T> {
  [key: string]: any;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
  };
}

export interface UseInfiniteScrollParams<
  T,
  Q extends Record<string, any> = Record<string, any>,
> {
  fetchPage: (
    query: Q & { page: number; limit: number }
  ) => Promise<PaginatedBackendResponse<T>>;
  initialQuery?: Q;
  pageSize?: number; // default 50
  collectionKey?: CollectionKeys; // default auto
  mergeStrategy?: 'append' | 'replace'; // default append
  rootMargin?: string; // default '200px'
}

export interface UseInfiniteScrollReturn<T, Q> {
  items: T[];
  page: number;
  limit: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  setQuery: (updater: (prev: Q) => Q) => void;
  reset: () => void;
  loadMore: () => Promise<void>;
  loadInitial: () => Promise<void>;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  stats: { total: number; totalPages: number } | null;
}

function extractCollection<T>(
  response: PaginatedBackendResponse<T>,
  preferred?: CollectionKeys
): T[] {
  if (preferred && Array.isArray(response[preferred]))
    return response[preferred] as T[];
  const candidates: CollectionKeys[] = [
    'data',
    'items',
    'properties',
    'documents',
    'assets',
    'subscriptions',
    'images',
  ];
  for (const key of candidates) {
    if (Array.isArray(response[key])) return response[key] as T[];
  }
  // fallback: tentar primeira propriedade array
  for (const key of Object.keys(response)) {
    const val = response[key];
    if (Array.isArray(val)) return val as T[];
  }
  return [] as T[];
}

function deriveTotals(
  response: PaginatedBackendResponse<any>,
  limitFallback: number
) {
  const total = response.total ?? response.pagination?.totalItems ?? 0;
  const page = response.page ?? response.pagination?.currentPage ?? 1;
  const limit =
    response.limit ?? response.pagination?.itemsPerPage ?? limitFallback;
  const totalPages =
    response.totalPages ??
    response.pagination?.totalPages ??
    (total > 0 ? Math.ceil(total / Math.max(1, limit)) : page);
  return { total, page, limit, totalPages };
}

export function useInfiniteScroll<
  T,
  Q extends Record<string, any> = Record<string, any>,
>(params: UseInfiniteScrollParams<T, Q>): UseInfiniteScrollReturn<T, Q> {
  const {
    fetchPage,
    initialQuery,
    pageSize = 50,
    collectionKey,
    mergeStrategy = 'append',
    rootMargin = '200px',
  } = params;

  const [query, setQueryState] = useState<Q>(() => ({
    ...(initialQuery as Q),
  }));
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    totalPages: number;
  } | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const setQuery = useCallback((updater: (prev: Q) => Q) => {
    setQueryState(prev => updater(prev));
  }, []);

  const load = useCallback(
    async (pageToLoad: number, reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPage({
          ...(query as any),
          page: pageToLoad,
          limit,
        });
        const pageItems = extractCollection<T>(response, collectionKey);
        const totals = deriveTotals(response, limit);

        setStats({ total: totals.total, totalPages: totals.totalPages });
        setHasMore(
          pageToLoad < totals.totalPages ||
            (totals.total === 0 ? false : pageItems.length === limit)
        );

        setItems(prev => {
          if (reset || mergeStrategy === 'replace' || pageToLoad === 1)
            return pageItems;
          return [...prev, ...pageItems];
        });
        setPage(pageToLoad);
        setLimit(totals.limit || limit);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, query, limit, collectionKey, mergeStrategy]
  );

  const loadInitial = useCallback(async () => {
    setItems([]);
    setHasMore(true);
    await load(1, true);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await load(page + 1);
  }, [loading, hasMore, load, page]);

  useEffect(() => {
    // quando query mudar, resetar
    setItems([]);
    setHasMore(true);
    setPage(1);
    void load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query), limit]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          void loadMore();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore, rootMargin]);

  return {
    items,
    page,
    limit,
    hasMore,
    loading,
    error,
    setQuery,
    reset: loadInitial,
    loadMore,
    loadInitial,
    loadMoreRef,
    stats,
  };
}
