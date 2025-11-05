import { ReactNode } from 'react'
import { Box } from '@mui/material'
import { MainContentWrapper } from '../MainContentWrapper'

interface PageContainerProps {
  children: ReactNode
  showBackground?: boolean
  pt?: number | { xs?: number; sm?: number; md?: number }
}

/**
 * Container padrão para todas as páginas
 * Garante consistência de margens, padding e estrutura
 */
export const PageContainer = ({ children, showBackground = false, pt }: PageContainerProps) => {
  return (
    <MainContentWrapper $showBackground={showBackground} style={{ paddingTop: '50px' }}>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 200px)',
          bgcolor: 'background.default',
          pt: pt !== undefined ? pt : { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, sm: 4, md: 5 },
        }}
      >
        {children}
      </Box>
    </MainContentWrapper>
  )
}

