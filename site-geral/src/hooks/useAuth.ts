import { useState, useEffect, useCallback } from 'react'
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated as isAuthenticatedService,
  getUser as getUserService,
  register as registerService,
  confirmEmail as confirmEmailService,
  resendConfirmationEmail as resendConfirmationEmailService,
  PublicUser,
  LoginResponse,
  RegisterResponse,
  ConfirmEmailResponse,
} from '../services/publicUserService'

interface UseAuthReturn {
  isAuthenticated: boolean
  user: PublicUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  register: (
    email: string,
    password: string,
    phone: string
  ) => Promise<RegisterResponse>
  confirmEmail: (token: string) => Promise<ConfirmEmailResponse>
  resendConfirmationEmail: (email: string) => Promise<ConfirmEmailResponse>
}

/**
 * Hook para gerenciar autenticação de usuários públicos
 */
export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticação ao montar o componente e quando o localStorage mudar
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticatedService()
      const userData = getUserService()
      setIsAuthenticated(authenticated)
      setUser(userData)
      setLoading(false)
    }

    // Verificar imediatamente
    checkAuth()

    // Escutar mudanças no localStorage (de outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth()
      }
    }

    // Escutar eventos de storage (mudanças entre abas)
    window.addEventListener('storage', handleStorageChange)

    // Escutar evento customizado (mudanças na mesma aba)
    const handleAuthChange = () => {
      checkAuth()
    }
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await loginService(email, password)
      setIsAuthenticated(true)
      setUser(result.user)
      // Disparar evento customizado para atualizar outros componentes
      window.dispatchEvent(new CustomEvent('auth-change'))
      return result
    } catch (error) {
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    logoutService()
    setIsAuthenticated(false)
    setUser(null)
    // Disparar evento customizado para atualizar outros componentes
    window.dispatchEvent(new CustomEvent('auth-change'))
  }, [])

  const register = useCallback(
    async (email: string, password: string, phone: string) => {
      return await registerService(email, password, phone)
    },
    []
  )

  const confirmEmail = useCallback(async (token: string) => {
    return await confirmEmailService(token)
  }, [])

  const resendConfirmationEmail = useCallback(async (email: string) => {
    return await resendConfirmationEmailService(email)
  }, [])

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register,
    confirmEmail,
    resendConfirmationEmail,
  }
}

