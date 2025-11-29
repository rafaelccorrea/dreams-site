import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'
import styled from 'styled-components'
import { useAuth } from '../../hooks/useAuth'
import { PageContainer, PageHeader, PageContent } from '../../components/PageContainer'
import { LoginModal } from '../../components/LoginModal'
import { listMyOffers } from '../../services/propertyOffersService'
import { PropertyOffer } from '../../services/propertyService'
import { formatPrice } from '../../utils/formatPrice'

const EmptyState = styled(Box)`
  text-align: center;
  padding: ${({ theme }) => `calc(${theme.spacing.xl} * 3)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export const MyOffersPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [offers, setOffers] = useState<PropertyOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOffers = async () => {
      if (!isAuthenticated || authLoading) return
      setLoading(true)
      setError(null)
      try {
        const data = await listMyOffers()
        setOffers(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar suas ofertas. Tente novamente.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
  }, [isAuthenticated, authLoading])

  if (authLoading) {
    return (
      <PageContainer>
        <PageContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <CircularProgress />
          </Box>
        </PageContent>
      </PageContainer>
    )
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <PageContent>
          <EmptyState>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Acesso Restrito
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Faça login para visualizar suas ofertas
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => setLoginModalOpen(true)}
            >
              Fazer Login
            </Button>
          </EmptyState>
          <LoginModal
            open={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
          />
        </PageContent>
      </PageContainer>
    )
  }

  const getStatusLabel = (status: PropertyOffer['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'accepted':
        return 'Aceita'
      case 'rejected':
        return 'Recusada'
      case 'withdrawn':
        return 'Retirada'
      case 'expired':
        return 'Expirada'
      default:
        return status
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            mb: 1,
          }}
        >
          Minhas Ofertas
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          Acompanhe todas as ofertas que você já fez em imóveis.
        </Typography>
      </PageHeader>

      <PageContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : offers.length === 0 ? (
          <EmptyState>
            <Box
              component="img"
              src="/not_found.png"
              alt="Nenhuma oferta encontrada"
              sx={{
                width: '100%',
                maxWidth: { xs: 300, sm: 400 },
                height: 'auto',
                opacity: 0.8,
                mb: 3,
              }}
            />
            <Typography variant="h5" gutterBottom>
              Nenhuma oferta encontrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Encontre um imóvel e envie sua primeira oferta.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
            >
              Explorar Propriedades
            </Button>
          </EmptyState>
        ) : (
          <Grid container spacing={2}>
            {offers.map((offer) => (
              <Grid item xs={12} md={6} key={offer.id}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ flexWrap: 'wrap', mb: 0.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={offer.type === 'sale' ? 'Compra' : 'Aluguel'}
                        sx={{
                          bgcolor:
                            offer.type === 'sale'
                              ? 'rgba(25, 118, 210, 0.08)'
                              : 'rgba(76, 175, 80, 0.08)',
                          color:
                            offer.type === 'sale' ? '#1976d2' : '#2e7d32',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        size="small"
                        label={getStatusLabel(offer.status)}
                        sx={{
                          bgcolor:
                            offer.status === 'accepted'
                              ? 'rgba(76, 175, 80, 0.12)'
                              : offer.status === 'pending'
                              ? 'rgba(255, 193, 7, 0.12)'
                              : 'rgba(158, 158, 158, 0.08)',
                          color:
                            offer.status === 'accepted'
                              ? '#2e7d32'
                              : offer.status === 'pending'
                              ? '#f9a825'
                              : '#616161',
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: '#212121' }}
                    >
                      {formatPrice(offer.offeredValue)}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    Enviada em{' '}
                    {offer.createdAt
                      ? new Date(offer.createdAt).toLocaleDateString('pt-BR')
                      : ''}
                  </Typography>

                  {offer.message && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 0.5 }}
                    >
                      {offer.message}
                    </Typography>
                  )}

                  {offer.responseMessage && (
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          offer.status === 'accepted'
                            ? '#2e7d32'
                            : '#616161',
                        mt: 0.5,
                        fontStyle: 'italic',
                      }}
                    >
                      Resposta da imobiliária: {offer.responseMessage}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </PageContent>
    </PageContainer>
  )
}


