import { useState, useCallback, useEffect } from 'react'
import {
  createProperty as createPropertyService,
  getMyProperty as getMyPropertyService,
  deleteProperty as deletePropertyService,
  CreatePropertyRequest,
  Property,
} from '../services/publicPropertyService'
import { useAuth } from '../hooks/useAuth'

interface UsePublicPropertyReturn {
  property: Property | null
  loading: boolean
  error: string | null
  loadProperty: () => Promise<void>
  createProperty: (data: CreatePropertyRequest) => Promise<Property>
  deleteProperty: (propertyId: string) => Promise<void>
  hasProperty: boolean
}

/**
 * Hook para gerenciar propriedades do usuário público
 */
export function usePublicProperty(): UsePublicPropertyReturn {
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProperty = useCallback(async () => {
    if (!isAuthenticated) {
      setProperty(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getMyPropertyService()
      setProperty(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      loadProperty()
    }
  }, [isAuthenticated, loadProperty])

  const createProperty = useCallback(
    async (data: CreatePropertyRequest): Promise<Property> => {
      setLoading(true)
      setError(null)
      try {
        const newProperty = await createPropertyService(data)
        setProperty(newProperty)
        return newProperty
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao criar propriedade'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteProperty = useCallback(
    async (propertyId: string): Promise<void> => {
      setLoading(true)
      setError(null)
      try {
        await deletePropertyService(propertyId)
        setProperty(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao deletar propriedade'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    property,
    loading,
    error,
    loadProperty,
    createProperty,
    deleteProperty,
    hasProperty: property !== null,
  }
}

