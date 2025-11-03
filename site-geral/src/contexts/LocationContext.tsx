import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Location } from '../types/location'

interface LocationContextType {
  location: Location | null
  setLocation: (location: Location) => void
  clearLocation: () => void
  hasLocation: boolean
  isLocationConfirmed: boolean // Flag para indicar se o usuário confirmou a localização
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const STORAGE_KEY = 'user_location'

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocationState] = useState<Location | null>(null)
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false)

  // Carregar localização do localStorage ao montar
  useEffect(() => {
    const savedLocation = localStorage.getItem(STORAGE_KEY)
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation)
        setLocationState(parsed)
        // Se há localização salva, considera como confirmada (usuário já havia confirmado antes)
        setIsLocationConfirmed(true)
      } catch (error) {
        console.error('Erro ao carregar localização:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation))
    setIsLocationConfirmed(true) // Marca como confirmado quando o usuário seleciona
  }

  const clearLocation = () => {
    setLocationState(null)
    setIsLocationConfirmed(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        clearLocation,
        hasLocation: location !== null,
        isLocationConfirmed,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation deve ser usado dentro de um LocationProvider')
  }
  return context
}

