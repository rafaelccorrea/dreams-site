import { config } from '../config'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
          }) => void
          prompt: (momentNotification?: (notification: PromptMomentNotification) => void) => void
          renderButton: (
            element: HTMLElement,
            config: {
              type: string
              theme: string
              size: string
              text: string
              shape: string
              logo_alignment: string
              width?: string | number
            }
          ) => void
        }
      }
    }
  }
}

export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

export interface PromptMomentNotification {
  isDisplayMoment: () => boolean
  isDisplayed: () => boolean
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
  getMomentType: () => string
}

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
}

/**
 * Decodifica o JWT do Google para obter informações do usuário
 */
export const decodeGoogleCredential = (credential: string): GoogleUser | null => {
  try {
    const base64Url = credential.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const payload = JSON.parse(jsonPayload)
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    }
  } catch (error) {
    console.error('Erro ao decodificar credencial do Google:', error)
    return null
  }
}

/**
 * Inicializa o Google Identity Services
 */
export const initializeGoogleAuth = (callback: (user: GoogleUser | null) => void) => {
  if (!window.google?.accounts?.id) {
    console.error('Google Identity Services não carregado')
    return
  }

  if (!config.google.clientId) {
    console.error('Google Client ID não configurado')
    return
  }

  window.google.accounts.id.initialize({
    client_id: config.google.clientId,
    callback: (response: GoogleCredentialResponse) => {
      const user = decodeGoogleCredential(response.credential)
      callback(user)
    },
  })
}

/**
 * Inicia o fluxo de login do Google
 */
export const triggerGoogleLogin = (onSuccess: (user: GoogleUser) => void, onError?: (error: Error) => void) => {
  if (!window.google?.accounts?.id) {
    const error = new Error('Google Identity Services não carregado')
    console.error(error)
    onError?.(error)
    return
  }

  if (!config.google.clientId) {
    const error = new Error('Google Client ID não configurado')
    console.error(error)
    onError?.(error)
    return
  }

  try {
    window.google.accounts.id.initialize({
      client_id: config.google.clientId,
      callback: (response: GoogleCredentialResponse) => {
        const user = decodeGoogleCredential(response.credential)
        if (user) {
          onSuccess(user)
        } else {
          onError?.(new Error('Falha ao decodificar credencial do Google'))
        }
      },
    })

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Se não puder mostrar o prompt automático, força o login manual
        window.google?.accounts?.id.prompt()
      }
    })
  } catch (error) {
    console.error('Erro ao iniciar login do Google:', error)
    onError?.(error as Error)
  }
}

/**
 * Verifica se o Google Identity Services está carregado
 */
export const isGoogleAuthReady = (): boolean => {
  return !!window.google?.accounts?.id
}

/**
 * Aguarda o carregamento do Google Identity Services
 */
export const waitForGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isGoogleAuthReady()) {
      resolve()
      return
    }

    let attempts = 0
    const maxAttempts = 50 // 5 segundos máximo

    const checkInterval = setInterval(() => {
      attempts++
      
      if (isGoogleAuthReady()) {
        clearInterval(checkInterval)
        resolve()
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        reject(new Error('Timeout ao carregar Google Identity Services'))
      }
    }, 100)
  })
}





