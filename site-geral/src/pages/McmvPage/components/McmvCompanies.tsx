import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Typography,
  Alert,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
} from '@mui/material'
import {
  Business,
  LocationOn,
  Phone,
  Email,
  Language,
  Home,
} from '@mui/icons-material'
import { listMcmvCompanies, McmvCompany, IncomeRange, McmvCompanyFilters } from '../../../services/mcmvService'
import { CompanyCardShimmer } from '../../../components/Shimmer'

interface McmvCompaniesProps {
  defaultCity?: string
  defaultState?: string
  incomeRange?: IncomeRange
}

export const McmvCompanies = ({ defaultCity, defaultState, incomeRange }: McmvCompaniesProps) => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<McmvCompany[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true)
      setError(null)

      try {
        const filters: McmvCompanyFilters = {
          city: defaultCity,
          state: defaultState,
          mcmvIncomeRange: incomeRange,
        }

        const response = await listMcmvCompanies(filters)
        setCompanies(response.companies)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar imobiliárias')
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [defaultCity, defaultState, incomeRange])

  const handleCompanyClick = (company: McmvCompany) => {
    navigate(`/imobiliaria/${company.id}`)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Imobiliárias com Propriedades MCMV
        </Typography>
        {companies.length > 0 && (
          <Chip
            label={`${companies.length} imobiliária${companies.length !== 1 ? 's' : ''}`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && companies.length === 0 ? (
        <Grid container spacing={3}>
          <CompanyCardShimmer count={6} />
        </Grid>
      ) : companies.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma imobiliária encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Não há imobiliárias com propriedades MCMV disponíveis no momento.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
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
                onClick={() => handleCompanyClick(company)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={company.logo}
                      alt={company.name}
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
                        {company.name}
                      </Typography>
                      {(company.city || company.state) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {company.city || ''} {company.city && company.state ? '-' : ''} {company.state || ''}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Home fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {company.mcmvPropertyCount} propriedade{company.mcmvPropertyCount !== 1 ? 's' : ''} MCMV
                    </Typography>
                  </Box>

                  {company.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {company.phone}
                      </Typography>
                    </Box>
                  )}

                  {company.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {company.email}
                      </Typography>
                    </Box>
                  )}

                  {company.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Language fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        component="a"
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Site
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCompanyClick(company)
                    }}
                  >
                    Ver Propriedades
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

