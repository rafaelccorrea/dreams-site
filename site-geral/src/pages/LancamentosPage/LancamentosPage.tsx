import { Box, Typography, Container } from '@mui/material'
import { Home } from '@mui/icons-material'
import styled from 'styled-components'
import { useLocation } from '../../contexts/LocationContext'

const PageContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing['2xl']};
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
`

const MessageContainer = styled(Box)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`

const IconContainer = styled(Box)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutralLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const LancamentosPage = () => {
  const { location } = useLocation()

  return (
    <PageContainer maxWidth="md">
      <MessageContainer>
        <IconContainer>
          <Home sx={{ fontSize: 60 }} />
        </IconContainer>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Não há lançamentos na localidade
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 500 }}>
          {location?.city
            ? `No momento não temos lançamentos disponíveis em ${location.city}.`
            : 'No momento não temos lançamentos disponíveis na sua localidade.'}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Continue explorando outras opções de imóveis disponíveis.
        </Typography>
      </MessageContainer>
    </PageContainer>
  )
}

