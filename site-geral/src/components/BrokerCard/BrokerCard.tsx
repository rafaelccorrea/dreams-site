import { Paper, Avatar, Typography, Box, Chip, Divider, IconButton, Tooltip } from '@mui/material'
import { Phone, Email, LocationOn, Home, Business, WhatsApp } from '@mui/icons-material'
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
      navigate(`/corretor/${broker.id}`)
    }
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (broker.phone) {
      const phoneNumber = broker.phone.replace(/\D/g, '')
      const message = encodeURIComponent(`Olá ${broker.name}, gostaria de mais informações sobre seus imóveis.`)
      window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank')
    }
  }

  const handlePhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (broker.phone) {
      window.open(`tel:${broker.phone}`, '_self')
    }
  }

  // Função para formatar email de forma mais limpa (ocultar emails técnicos)
  const shouldShowEmail = (email: string) => {
    // Não mostrar emails que parecem técnicos/teste
    return !email.includes('@teste.') && !email.includes('master.') && !email.includes('user')
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
        position: 'relative',
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Avatar Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pt: 3,
          pb: { xs: 5, sm: 6 },
          px: 3,
          background: 'linear-gradient(135deg, #3370A6 0%, #8BB4D9 100%)',
          position: 'relative',
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
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            mb: 2,
          }}
        >
          {broker.name.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      {/* Nome posicionado entre roxo e branco */}
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          px: 2,
          mt: { xs: -3, sm: -3.5 },
          mb: 2,
          zIndex: 5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            bgcolor: 'background.paper',
            px: 2,
            py: 1,
            borderRadius: 2,
            display: 'inline-block',
            boxShadow: 3,
          }}
        >
          {broker.name}
        </Typography>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3, pt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {broker.city && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mt: 1, mb: 1 }}>
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

        {/* Contact Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          {broker.phone && (
            <>
              <Tooltip title="WhatsApp">
                <IconButton
                  size="small"
                  onClick={handleWhatsApp}
                  sx={{
                    bgcolor: '#25D366',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#20BA5A',
                    },
                  }}
                >
                  <WhatsApp fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ligar">
                <IconButton
                  size="small"
                  onClick={handlePhone}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <Phone fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Ver detalhes">
            <IconButton
              size="small"
              onClick={handleClick}
              sx={{
                bgcolor: 'rgba(51, 112, 166, 0.1)',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(51, 112, 166, 0.2)',
                },
              }}
            >
              <Email fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Phone display (sem email nos cards) */}
        {broker.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <Phone color="primary" sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem', fontWeight: 500 }}>
              {broker.phone}
            </Typography>
          </Box>
        )}

        {/* Email apenas se não for técnico/teste */}
        {broker.email && shouldShowEmail(broker.email) && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <Email color="primary" sx={{ fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {broker.email}
            </Typography>
          </Box>
        )}

        {/* Property Count - apenas se > 0 */}
        {broker.propertyCount > 0 && (
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
        )}
      </Box>
    </Paper>
  )
}

