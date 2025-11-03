import { Paper, Avatar, Typography, Box, Chip, Divider } from '@mui/material'
import { Phone, Email, LocationOn, Home, Business } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Broker } from '../../services/propertyService'

interface BrokerCardProps {
  broker: Broker
  onClick?: () => void
}

export const BrokerCard = ({ broker, onClick }: BrokerCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/broker/${broker.id}`)
    }
  }

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
      {/* Avatar Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #3370A6 0%, #8BB4D9 100%)',
        }}
      >
        <Avatar
          src={broker.avatar}
          alt={broker.name}
          sx={{
            width: { xs: 100, sm: 120 },
            height: { xs: 100, sm: 120 },
            border: '4px solid white',
            boxShadow: 3,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 700,
          }}
        >
          {broker.name.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
            {broker.name}
          </Typography>
          {broker.city && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 1 }}>
              <LocationOn fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {broker.city}
              </Typography>
            </Box>
          )}
          {broker.company && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 2 }}>
              <Business fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {broker.company.name}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {broker.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone color="primary" sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
                {broker.phone}
              </Typography>
            </Box>
          )}

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
              {broker.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Chip
            icon={<Home />}
            label={`${broker.propertyCount} ${broker.propertyCount === 1 ? 'propriedade' : 'propriedades'}`}
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

