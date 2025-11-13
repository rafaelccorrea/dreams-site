import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { LocationOn, Email, Business, Description } from '@mui/icons-material'
import { StyledFooter, FooterContainer, FooterContent, FooterSection, FooterLink, FooterInfo, FooterInfoItem, LogoContainer } from './Footer.styles'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <StyledFooter>
      <FooterContainer maxWidth="xl">
        <FooterContent>
          <FooterSection>
            <LogoContainer>
              <img 
                src="/logo-dream.png" 
                alt="Dream Keys Logo" 
                style={{ 
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))'
                }} 
              />
            </LogoContainer>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2 }}>
              © {currentYear} Dream Keys. Todos os direitos reservados.
            </Typography>
          </FooterSection>

          <FooterSection>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'white',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px'
              }}
            >
              Empresa
            </Typography>
            <FooterInfo>
              <FooterInfoItem>
                <Business sx={{ fontSize: 18, mr: 1.5, color: 'rgba(255, 255, 255, 0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Next Innovation Technologies LTDA
                </Typography>
              </FooterInfoItem>
              <FooterInfoItem>
                <Description sx={{ fontSize: 18, mr: 1.5, color: 'rgba(255, 255, 255, 0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  CNPJ: 52.497.027/0001-35
                </Typography>
              </FooterInfoItem>
            </FooterInfo>
          </FooterSection>

          <FooterSection>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'white',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px'
              }}
            >
              Links Rápidos
            </Typography>
            <Box component="nav" aria-label="Links rápidos do site">
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box component="li">
                  <Link
                    to="/casas-a-venda"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Casas à Venda
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    to="/apartamentos-a-venda"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Apartamentos à Venda
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    to="/casas-para-alugar"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Casas para Locação
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    to="/apartamentos-para-alugar"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Apartamentos para Locação
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    to="/lancamentos"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Lançamentos
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    to="/corretores"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Corretores
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    to="/imobiliarias"
                    style={{
                      textDecoration: 'none',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.875rem',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Imobiliárias
                  </Link>
                </Box>
              </Box>
            </Box>
          </FooterSection>

          <FooterSection>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'white',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px'
              }}
            >
              Contato
            </Typography>
            <FooterInfo>
              <FooterInfoItem>
                <LocationOn sx={{ fontSize: 18, mr: 1.5, color: 'rgba(255, 255, 255, 0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Rua Wanderley Rodrigues Pereira, 79<br />
                  Marília - SP
                </Typography>
              </FooterInfoItem>
              <FooterInfoItem>
                <Email sx={{ fontSize: 18, mr: 1.5, color: 'rgba(255, 255, 255, 0.6)' }} />
                <FooterLink href="mailto:contato@dreamkeys.com.br">
                  contato@dreamkeys.com.br
                </FooterLink>
              </FooterInfoItem>
            </FooterInfo>
          </FooterSection>
        </FooterContent>
        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
            Desenvolvido com ❤️ pela Next Innovation Technologies
          </Typography>
        </Box>
      </FooterContainer>
    </StyledFooter>
  )
}

