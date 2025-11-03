import { useState, useEffect } from 'react'

/**
 * Hook customizado para detectar breakpoints responsivos
 * @param query - Media query string ou breakpoint
 * @returns true se a media query corresponder
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    
    // Define o estado inicial
    setMatches(mediaQueryList.matches)

    // Handler para mudanças na media query
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Adiciona o listener
    mediaQueryList.addEventListener('change', handler)

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

/**
 * Hook para detectar se está em mobile
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)')
}

/**
 * Hook para detectar se está em tablet
 */
export const useIsTablet = (): boolean => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1023px)')
}

/**
 * Hook para detectar se está em desktop
 */
export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 1024px)')
}


