import { useState, useEffect } from 'react'
import { getNeighborhoods, Neighborhood } from '../services/propertyService'

interface UseNeighborhoodsOptions {
  city?: string
  minCount?: number
  enabled?: boolean
}

export function useNeighborhoods({
  city,
  minCount = 1,
  enabled = true,
}: UseNeighborhoodsOptions) {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !city) {
      setNeighborhoods([])
      return
    }

    const fetchNeighborhoods = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getNeighborhoods(city, minCount)
        setNeighborhoods(response.neighborhoods || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar bairros')
        setNeighborhoods([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(() => {
      fetchNeighborhoods()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [city, minCount, enabled])

  return { neighborhoods, loading, error }
}

