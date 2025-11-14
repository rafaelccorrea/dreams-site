import { useState } from 'react'
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import { Share } from '@mui/icons-material'
import styled from 'styled-components'

const StyledIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSecondary || '#666'};
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.1);
    color: ${({ theme }) => theme.colors.primary || '#3370A6'};
  }
`

interface ShareButtonProps {
  propertyId: string
  propertyTitle: string
  propertyUrl?: string
  size?: 'small' | 'medium' | 'large'
  showTooltip?: boolean
}

export const ShareButton = ({
  propertyId,
  propertyTitle,
  propertyUrl,
  size = 'medium',
  showTooltip = true,
}: ShareButtonProps) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleShare = async () => {
    const url = propertyUrl || `${window.location.origin}/imovel/${propertyId}`
    const text = `Confira esta propriedade: ${propertyTitle}`

    try {
      // Verificar se a API Web Share está disponível (mobile)
      if (navigator.share) {
        await navigator.share({
          title: propertyTitle,
          text: text,
          url: url,
        })
      } else {
        // Fallback: copiar para clipboard
        await navigator.clipboard.writeText(url)
        setSnackbarMessage('Link copiado para a área de transferência!')
        setSnackbarOpen(true)
      }
    } catch (error: any) {
      // Se o usuário cancelar o compartilhamento, não fazer nada
      if (error.name !== 'AbortError') {
        // Fallback: copiar para clipboard
        try {
          await navigator.clipboard.writeText(url)
          setSnackbarMessage('Link copiado para a área de transferência!')
          setSnackbarOpen(true)
        } catch (clipboardError) {
          setSnackbarMessage('Erro ao compartilhar. Tente novamente.')
          setSnackbarOpen(true)
        }
      }
    }
  }

  const button = (
    <StyledIconButton
      onClick={(e) => {
        e.stopPropagation()
        handleShare()
      }}
      size={size}
      aria-label="Compartilhar propriedade"
    >
      <Share fontSize={size === 'small' ? 'small' : 'medium'} />
    </StyledIconButton>
  )

  return (
    <>
      {showTooltip ? (
        <Tooltip title="Compartilhar propriedade" arrow>
          {button}
        </Tooltip>
      ) : (
        button
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

