import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTitleConfig {
  [path: string]: string
}

const pageTitles: PageTitleConfig = {
  '/': 'Dream Keys - Encontre seu imóvel dos sonhos',
  '/imoveis-para-comprar': 'Imóveis para Comprar - Dream Keys',
  '/casas-a-venda': 'Casas à Venda - Dream Keys',
  '/apartamentos-a-venda': 'Apartamentos à Venda - Dream Keys',
  '/imoveis-comerciais-a-venda': 'Imóveis Comerciais à Venda - Dream Keys',
  '/alugar': 'Imóveis para Alugar - Dream Keys',
  '/casas-para-alugar': 'Casas para Locação - Dream Keys',
  '/apartamentos-para-alugar': 'Apartamentos para Locação - Dream Keys',
  '/imoveis-comerciais-para-alugar': 'Imóveis Comerciais para Locação - Dream Keys',
  '/lancamentos': 'Lançamentos - Dream Keys',
  '/minha-casa-minha-vida': 'Minha Casa Minha Vida - Dream Keys',
  '/corretores': 'Corretores - Dream Keys',
  '/imobiliarias': 'Imobiliárias - Dream Keys',
  '/favoritos': 'Meus Favoritos - Dream Keys',
  '/minha-propriedade': 'Minha Propriedade - Dream Keys',
  '/confirm-email': 'Confirmar Email - Dream Keys',
  '/confirmar-email': 'Confirmar Email - Dream Keys',
}

const getPageTitle = (pathname: string): string => {
  // Verificar se há um título exato para a rota
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  // Verificar rotas com parâmetros
  if (pathname.startsWith('/imovel/')) {
    const id = pathname.split('/imovel/')[1]
    return `Imóvel ${id} - Dream Keys`
  }

  if (pathname.startsWith('/corretor/')) {
    const id = pathname.split('/corretor/')[1]
    return `Corretor ${id} - Dream Keys`
  }

  if (pathname.startsWith('/imobiliaria/')) {
    const id = pathname.split('/imobiliaria/')[1]
    return `Imobiliária ${id} - Dream Keys`
  }

  // Título padrão
  return 'Dream Keys - Encontre seu imóvel dos sonhos'
}

export const usePageTitle = (customTitle?: string, customDescription?: string) => {
  const location = useLocation()

  useEffect(() => {
    const title = customTitle || getPageTitle(location.pathname)
    document.title = title

    // Atualizar meta description básico
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }

    // Usa descrição customizada se fornecida, caso contrário usa descrições padrão
    if (customDescription) {
      metaDescription.setAttribute('content', customDescription)
    } else {
      // Descrições específicas por página
      const descriptions: PageTitleConfig = {
        '/': 'Encontre casas, apartamentos e imóveis comerciais para compra e locação. Sua plataforma completa de imóveis.',
        '/minha-casa-minha-vida': 'Verifique sua elegibilidade e simule seu financiamento no programa Minha Casa Minha Vida.',
      '/corretores': 'Encontre os melhores corretores de imóveis perto de você.',
      '/imobiliarias': 'Explore as melhores imobiliárias e encontre seu imóvel ideal.',
      '/lancamentos': 'Confira os últimos lançamentos imobiliários.',
      '/favoritos': 'Seus imóveis favoritos salvos.',
      }

      const description = descriptions[location.pathname] || 'Encontre seu imóvel dos sonhos na Dream Keys.'
      metaDescription.setAttribute('content', description)
    }
  }, [location.pathname, customTitle, customDescription])
}

