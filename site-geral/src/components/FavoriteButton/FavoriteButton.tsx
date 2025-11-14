import { useState, useEffect } from 'react'
import { IconButton, Tooltip, CircularProgress } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import styled from 'styled-components'
import { useFavorites } from '../../hooks/useFavorites'
import { useAuth } from '../../hooks/useAuth'
import { LoginModal } from '../LoginModal'
import { RegisterModal } from '../RegisterModal'

const StyledIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.error || '#d32f2f'};
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(211, 47, 47, 0.1);
    transform: scale(1.1);
  }

  &.favorite-active {
    color: ${({ theme }) => theme.colors.error || '#d32f2f'};
  }
`

interface FavoriteButtonProps {
  propertyId: string
  size?: 'small' | 'medium' | 'large'
  showTooltip?: boolean
  isOwnProperty?: boolean // Nova prop para indicar se é propriedade do próprio usuário
}

export const FavoriteButton = ({
  propertyId,
  size = 'medium',
  showTooltip = true,
  isOwnProperty = false,
}: FavoriteButtonProps) => {
  const { isAuthenticated } = useAuth()
  const { checkFavorite, toggleFavorite } = useFavorites()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Se é propriedade do próprio usuário, não verifica favorito
  useEffect(() => {
    if (isAuthenticated && !isOwnProperty) {
      const loadFavoriteStatus = async () => {
        try {
          const result = await checkFavorite(propertyId)
          setIsFavorite(result.isFavorite)
        } catch (error) {
        }
      }
      loadFavoriteStatus()
    } else {
      setIsFavorite(false)
    }
  }, [propertyId, isAuthenticated, checkFavorite, isOwnProperty])

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Não permite favoritar própria propriedade
    if (isOwnProperty) {
      return
    }
    
    if (!isAuthenticated) {
      setLoginModalOpen(true)
      return
    }

    // Optimistic update: atualizar estado imediatamente
    const previousFavoriteState = isFavorite
    setIsFavorite(!isFavorite)
    setLoading(true)

    try {
      await toggleFavorite(propertyId)
      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new CustomEvent('favorites-changed'))
    } catch (error) {
      // Rollback: reverter para o estado anterior em caso de erro
      setIsFavorite(previousFavoriteState)
    } finally {
      setLoading(false)
    }
  }

  const button = (
    <StyledIconButton
      onClick={handleToggle}
      disabled={loading || isOwnProperty}
      size={size}
      className={isFavorite ? 'favorite-active' : ''}
      aria-label={isOwnProperty ? 'Não é possível favoritar sua própria propriedade' : (isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos')}
      sx={isOwnProperty ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : isFavorite ? (
        <Favorite />
      ) : (
        <FavoriteBorder />
      )}
    </StyledIconButton>
  )

  // Se é propriedade do próprio usuário, mostra tooltip explicativo
  if (showTooltip) {
    return (
      <>
        <Tooltip
          title={
            isOwnProperty
              ? 'Não é possível favoritar sua própria propriedade'
              : isAuthenticated
              ? isFavorite
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'
              : 'Faça login para favoritar'
          }
          arrow
        >
          {button}
        </Tooltip>
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={() => {
            setLoginModalOpen(false)
            // Recarregar estado após login
            window.dispatchEvent(new CustomEvent('auth-change'))
          }}
        />
      </>
    )
  }

  return (
    <>
      {button}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  )
}


