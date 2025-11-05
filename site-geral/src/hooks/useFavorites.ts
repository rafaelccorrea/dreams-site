import { useState, useCallback } from 'react'
import {
  listFavorites,
  toggleFavorite as toggleFavoriteService,
  checkFavorite as checkFavoriteService,
  getFavoritesCount as getFavoritesCountService,
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService,
  Property,
  CheckFavoriteResponse,
} from '../services/publicUserService'

interface UseFavoritesReturn {
  favorites: Property[]
  loading: boolean
  error: string | null
  total: number
  loadFavorites: (page?: number, limit?: number) => Promise<void>
  toggleFavorite: (propertyId: string) => Promise<void>
  checkFavorite: (propertyId: string) => Promise<CheckFavoriteResponse>
  addFavorite: (propertyId: string) => Promise<void>
  removeFavorite: (propertyId: string) => Promise<void>
  refreshCount: () => Promise<void>
}

/**
 * Hook para gerenciar favoritos do usuário autenticado
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const loadFavorites = useCallback(async (page = 1, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listFavorites(page, limit)
      setFavorites(data.properties)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setFavorites([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const addFavorite = useCallback(async (propertyId: string) => {
    try {
      await addFavoriteService(propertyId)
      // Recarregar lista após adicionar
      await loadFavorites()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar favorito')
      throw err
    }
  }, [loadFavorites])

  const removeFavorite = useCallback(async (propertyId: string) => {
    try {
      await removeFavoriteService(propertyId)
      // Recarregar lista após remover
      await loadFavorites()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover favorito')
      throw err
    }
  }, [loadFavorites])

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      try {
        await toggleFavoriteService(propertyId)
        // Recarregar lista após alternar
        await loadFavorites()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao alternar favorito'
        )
        throw err
      }
    },
    [loadFavorites]
  )

  const checkFavorite = useCallback(async (propertyId: string) => {
    try {
      return await checkFavoriteService(propertyId)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao verificar favorito'
      )
      return { isFavorite: false }
    }
  }, [])

  const refreshCount = useCallback(async () => {
    try {
      const count = await getFavoritesCountService()
      setTotal(count)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao atualizar contador'
      )
    }
  }, [])

  return {
    favorites,
    loading,
    error,
    total,
    loadFavorites,
    toggleFavorite,
    checkFavorite,
    addFavorite,
    removeFavorite,
    refreshCount,
  }
}


