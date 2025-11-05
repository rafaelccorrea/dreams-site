import { ReactNode } from 'react'
import { Box } from '@mui/material'

interface PageContentProps {
  children: ReactNode
  sx?: object
}

/**
 * Container de conteúdo padrão para páginas
 * Centraliza o conteúdo com maxWidth e padding consistente
 */
export const PageContent = ({ children, sx }: PageContentProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        px: { xs: 3, sm: 4, md: '40px' },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

