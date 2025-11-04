import { Paper, Typography, Box, Grid, Chip, Avatar, Divider } from '@mui/material'
import { Phone, Email, LocationOn, Business, Language, Home } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Company } from '../../services/propertyService'

interface CompanyCardProps {
  company: Company
  onClick?: () => void
}

export const CompanyCard = ({ company, onClick }: CompanyCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/company/${company.id}`)
    }
  }

  // Função para verificar se email é técnico/teste
  const shouldShowEmail = (email: string) => {
    const emailLower = email.toLowerCase();
    return !emailLower.includes("@teste.") && !emailLower.includes("master.") && !emailLower.includes("@user");
  };

  return (
    <Paper
      onClick={handleClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #3370A6 0%, #8BB4D9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          minHeight: 180,
        }}
      >
        {company.logo ? (
          <Box
            component="img"
            src={company.logo}
            alt={company.name}
            sx={{
              maxWidth: 140,
              maxHeight: 100,
              objectFit: 'contain',
              bgcolor: 'white',
              p: 1.5,
              borderRadius: 1.5,
              boxShadow: 3,
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'white',
              color: 'primary.main',
            }}
          >
            <Business sx={{ fontSize: 50 }} />
          </Avatar>
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
            {company.name}
          </Typography>
          {company.city && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 2 }}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {company.city}{company.state ? `, ${company.state}` : ''}
              </Typography>
            </Box>
          )}
          {company.address && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1 }}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {company.address}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {company.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone color="primary" sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
                {company.phone}
              </Typography>
            </Box>
          )}

          {company.email && shouldShowEmail(company.email) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email color="primary" sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {company.email}
              </Typography>
            </Box>
          )}

          {company.website && (
            <Box
              component="a"
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              <Language color="primary" sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Site oficial
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Chip
            icon={<Home />}
            label={`${company.propertyCount || 0} ${(company.propertyCount || 0) === 1 ? 'propriedade' : 'propriedades'}`}
            color="primary"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
      </Box>
    </Paper>
  )
}

