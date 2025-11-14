import { useState, useEffect, useCallback } from 'react'
import {
  initializeGoogleAuth,
  triggerGoogleLogin,
  waitForGoogleAuth,
  isGoogleAuthReady,
  GoogleUser,
} from '../services/authService'

interface UseGoogleAuthReturn {
  isReady: boolean
  isLoading: boolean
  login: () => Promise<void>
  user: GoogleUser | null
  error: Error | null
}

export const useGoogleAuth = (
  onLoginSuccess?: (user: GoogleUser) => void,
  onLoginError?: (error: Error) => void
): UseGoogleAuthReturn => {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        await waitForGoogleAuth()
        setIsReady(true)
      } catch (err) {
        setError(err as Error)
      }
    }

    checkGoogleAuth()
  }, [])

  const login = useCallback(async () => {
    if (!isReady) {
      const error = new Error('Google Identity Services não está pronto')
      setError(error)
      onLoginError?.(error)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      triggerGoogleLogin(
        (userData) => {
          setUser(userData)
          setIsLoading(false)
          onLoginSuccess?.(userData)
        },
        (err) => {
          setError(err)
          setIsLoading(false)
          onLoginError?.(err)
        }
      )
    } catch (err) {
      const error = err as Error
      setError(error)
      setIsLoading(false)
      onLoginError?.(error)
    }
  }, [isReady, onLoginSuccess, onLoginError])

  return {
    isReady,
    isLoading,
    login,
    user,
    error,
  }
}





