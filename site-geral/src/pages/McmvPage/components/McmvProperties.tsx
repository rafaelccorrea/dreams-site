import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
} from '@mui/material'
import {
  Bed,
  Bathtub,
  Home,
  LocationOn,
  AttachMoney,
} from '@mui/icons-material'
import { listMcmvProperties, McmvProperty, IncomeRange, McmvPropertyFilters } from '../../../services/mcmvService'
import { PropertyCardShimmer } from '../../../components/Shimmer'
import { formatPrice } from '../../../utils/formatPrice'

interface McmvPropertiesProps {
  defaultCity: string
  defaultState: string
  incomeRange?: IncomeRange
}

const getIncomeRangeLabel = (range?: IncomeRange): string => {
  switch (range) {
    case 'faixa1':
      return 'Faixa 1 (até R$ 2.000/mês)'
    case 'faixa2':
      return 'Faixa 2 (até R$ 3.000/mês)'
    case 'faixa3':
      return 'Faixa 3 (até R$ 4.000/mês)'
    default:
      return ''
  }
}

export const McmvProperties = ({ defaultCity, defaultState, incomeRange }: McmvPropertiesProps) => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<McmvProperty[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const limit = 20

  useEffect(() => {
    if (!defaultCity) {
      setError('Cidade não informada')
      return
    }

    const loadProperties = async () => {
      setLoading(true)
      setError(null)

      try {
        const filters: McmvPropertyFilters = {
          city: defaultCity,
          state: defaultState || undefined,
          mcmvIncomeRange: incomeRange,
          page,
          limit,
        }

        const response = await listMcmvProperties(filters)
        setProperties(response.properties)
        setTotal(response.total)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar propriedades MCMV')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [defaultCity, defaultState, incomeRange, page])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePropertyClick = (property: McmvProperty) => {
    navigate(`/property/${property.id}`)
  }

  if (!defaultCity) {
    return (
      <Alert severity="warning">
        Selecione uma cidade para ver propriedades MCMV disponíveis.
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Propriedades MCMV Disponíveis
        </Typography>
        {total > 0 && (
          <Chip
            label={`${total} propriedade${total !== 1 ? 's' : ''}`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      {incomeRange && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Mostrando propriedades para {getIncomeRangeLabel(incomeRange)}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && properties.length === 0 ? (
        <Grid container spacing={3}>
          <PropertyCardShimmer count={8} />
        </Grid>
      ) : properties.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Home sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma propriedade MCMV encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Não há propriedades MCMV disponíveis para esta cidade no momento.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handlePropertyClick(property)}
                >
                  {property.mainImage ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.mainImage.url}
                      alt={property.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Home sx={{ fontSize: 60, color: 'grey.400' }} />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} noWrap>
                      {property.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" noWrap>
                        {property.address}, {property.city} - {property.state}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Bed fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {property.bedrooms}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Bathtub fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {property.bathrooms}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                        {formatPrice(property.salePrice)}
                      </Typography>

                      <Chip
                        label={getIncomeRangeLabel(property.mcmvIncomeRange)}
                        size="small"
                        color="primary"
                        sx={{ mb: 1, mr: 1 }}
                      />

                      {property.mcmvSubsidy > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <AttachMoney fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                            Subsídio: {formatPrice(property.mcmvSubsidy)}
                          </Typography>
                        </Box>
                      )}

                      {property.company && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          {property.company.name}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

