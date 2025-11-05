import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  Pagination,
  CircularProgress,
} from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'
import styled from 'styled-components'
import { useFavorites } from '../../hooks/useFavorites'
import { useAuth } from '../../hooks/useAuth'
import { PropertyCard } from '../../components/PropertyCard'
import { PropertyCardShimmer } from '../../components/Shimmer'
import { PageContainer, PageHeader, PageContent } from '../../components/PageContainer'
import { LoginModal } from '../../components/LoginModal'
import { Property } from '../../services/propertyService'


const EmptyState = styled(Box)`
  text-align: center;
  padding: ${({ theme }) => `calc(${theme.spacing.xl} * 3)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export const FavoritesPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { favorites, loading, error, total, loadFavorites } = useFavorites()
  const [page, setPage] = useState(1)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const limit = 20

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadFavorites(page, limit)
    }
  }, [isAuthenticated, authLoading, page, loadFavorites])

  // Escutar mudanças nos favoritos para atualizar a lista
  useEffect(() => {
    const handleFavoritesChange = () => {
      if (isAuthenticated && !authLoading) {
        loadFavorites(page, limit)
      }
    }

    window.addEventListener('favorites-changed', handleFavoritesChange)
    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChange)
    }
  }, [isAuthenticated, authLoading, page, loadFavorites])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
              Faça login para visualizar suas propriedades favoritas
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

  return (
    <PageContainer>
      <PageHeader>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            mb: 1,
          }}
          >
          Meus Favoritos
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {total > 0
            ? `${total} ${total === 1 ? 'propriedade favoritada' : 'propriedades favoritadas'}`
            : 'Você ainda não tem propriedades favoritadas'}
        </Typography>
      </PageHeader>

      <PageContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Grid container spacing={3}>
              <PropertyCardShimmer count={8} />
            </Grid>
          ) : favorites.length === 0 ? (
            <EmptyState>
              <Box
                component="img"
                src="/not_found.png"
                alt="Nenhum favorito encontrado"
                sx={{
                  width: "100%",
                  maxWidth: { xs: 300, sm: 400 },
                  height: "auto",
                  opacity: 0.8,
                  mb: 3,
                }}
              />
              <Typography variant="h5" gutterBottom>
                Nenhum favorito encontrado
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Explore nossas propriedades e adicione seus favoritos
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
              >
                Explorar Propriedades
              </Button>
            </EmptyState>
          ) : (
            <>
              <Grid container spacing={3}>
                {favorites.map((property: Property) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
                    <PropertyCard property={property} />
                  </Grid>
                ))}
              </Grid>

              {total > limit && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                  }}
                >
                  <Pagination
                    count={Math.ceil(total / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
      </PageContent>
    </PageContainer>
  )
}
