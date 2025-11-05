import { ReactNode } from 'react'
import { Box } from '@mui/material'

interface PageHeaderProps {
  children: ReactNode
}

/**
 * Container de cabeçalho padrão para páginas
 * Espaçamento consistente abaixo do título
 */
export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        px: { xs: 3, sm: 4, md: '40px' },
        pt: 0,
        mb: { xs: 2, sm: 3 },
      }}
    >
      {children}
    </Box>
  )
}

