import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import { BreadcrumbsContainer } from './Breadcrumbs.styles'

interface BreadcrumbItem {
  label: string
  path: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  showHome?: boolean
}

const SITE_URL = 'https://www.dreamkeys.com.br'

const getDefaultBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: 'Home', path: '/' }]

  const pathMap: Record<string, string> = {
    '/imoveis-para-comprar': 'Imóveis para Comprar',
    '/casas-a-venda': 'Casas à Venda',
    '/apartamentos-a-venda': 'Apartamentos à Venda',
    '/imoveis-comerciais-a-venda': 'Imóveis Comerciais à Venda',
    '/alugar': 'Imóveis para Alugar',
    '/casas-para-alugar': 'Casas para Locação',
    '/apartamentos-para-alugar': 'Apartamentos para Locação',
    '/imoveis-comerciais-para-alugar': 'Imóveis Comerciais para Locação',
    '/lancamentos': 'Lançamentos',
    '/minha-casa-minha-vida': 'Minha Casa Minha Vida',
    '/corretores': 'Corretores',
    '/imobiliarias': 'Imobiliárias',
    '/favoritos': 'Favoritos',
    '/minha-propriedade': 'Minha Propriedade',
  }

  // Verificar rotas com parâmetros
  if (pathname.startsWith('/imovel/')) {
    items.push({ label: 'Imóveis', path: '/imoveis-para-comprar' })
    const id = pathname.split('/imovel/')[1]
    items.push({ label: `Imóvel ${id}`, path: pathname })
  } else if (pathname.startsWith('/corretor/')) {
    items.push({ label: 'Corretores', path: '/corretores' })
    const id = pathname.split('/corretor/')[1]
    items.push({ label: `Corretor ${id}`, path: pathname })
  } else if (pathname.startsWith('/imobiliaria/')) {
    items.push({ label: 'Imobiliárias', path: '/imobiliarias' })
    const id = pathname.split('/imobiliaria/')[1]
    items.push({ label: `Imobiliária ${id}`, path: pathname })
  } else if (pathMap[pathname]) {
    items.push({ label: pathMap[pathname], path: pathname })
  }

  return items
}

export const Breadcrumbs = ({ items, showHome = true }: BreadcrumbsProps) => {
  const location = useLocation()
  const breadcrumbItems = items || getDefaultBreadcrumbs(location.pathname)
  const finalItems = showHome ? breadcrumbItems : breadcrumbItems.slice(1)

  // Gerar dados estruturados (Schema.org) para BreadcrumbList
  useEffect(() => {
    const schemaBreadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: finalItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: `${SITE_URL}${item.path}`,
      })),
    }

    // Remover breadcrumb anterior se existir
    const existingBreadcrumb = document.querySelector('script[data-schema="breadcrumb"]')
    if (existingBreadcrumb) {
      existingBreadcrumb.remove()
    }

    // Adicionar novo breadcrumb estruturado
    const schemaScript = document.createElement('script')
    schemaScript.setAttribute('type', 'application/ld+json')
    schemaScript.setAttribute('data-schema', 'breadcrumb')
    schemaScript.textContent = JSON.stringify(schemaBreadcrumb)
    document.head.appendChild(schemaScript)

    return () => {
      // Limpar ao desmontar
      const script = document.querySelector('script[data-schema="breadcrumb"]')
      if (script) {
        script.remove()
      }
    }
  }, [finalItems])

  if (finalItems.length <= 1) {
    return null
  }

  return (
    <BreadcrumbsContainer>
      <Box
        component="nav"
        aria-label="Breadcrumb"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.5,
        }}
      >
        {finalItems.map((item, index) => {
          const isLast = index === finalItems.length - 1

          return (
            <Box
              key={item.path}
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {isLast ? (
                <Typography
                  component="span"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                  aria-current="page"
                >
                  {item.label}
                </Typography>
              ) : (
                <>
                  <Link
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1976d2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    {item.label}
                  </Link>
                  {!isLast && (
                    <NavigateNext
                      sx={{
                        fontSize: '1rem',
                        color: 'text.secondary',
                        mx: 0.25,
                      }}
                    />
                  )}
                </>
              )}
            </Box>
          )
        })}
      </Box>
    </BreadcrumbsContainer>
  )
}

