import { useLocation } from 'react-router-dom'
import { useSEO } from './useSEO'

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

const pageDescriptions: PageTitleConfig = {
  '/': 'Encontre casas, apartamentos e imóveis comerciais para compra e locação. Sua plataforma completa de imóveis com os melhores corretores e imobiliárias.',
  '/imoveis-para-comprar': 'Encontre imóveis para comprar: casas, apartamentos e imóveis comerciais. Milhares de opções em todo o Brasil.',
  '/casas-a-venda': 'Casas à venda em todo o Brasil. Encontre a casa dos seus sonhos com os melhores preços e condições.',
  '/apartamentos-a-venda': 'Apartamentos à venda. Encontre apartamentos novos e usados com as melhores condições de pagamento.',
  '/imoveis-comerciais-a-venda': 'Imóveis comerciais à venda: salas, lojas, galpões e escritórios. Invista no seu negócio.',
  '/alugar': 'Imóveis para alugar: casas, apartamentos e imóveis comerciais. Encontre o imóvel ideal para locação.',
  '/casas-para-alugar': 'Casas para locação. Encontre casas para alugar com os melhores preços e localizações.',
  '/apartamentos-para-alugar': 'Apartamentos para locação. Encontre apartamentos para alugar em todas as regiões.',
  '/imoveis-comerciais-para-alugar': 'Imóveis comerciais para locação. Salas, lojas e escritórios para alugar.',
  '/lancamentos': 'Confira os últimos lançamentos imobiliários. Apartamentos e casas novas com condições especiais.',
  '/minha-casa-minha-vida': 'Verifique sua elegibilidade e simule seu financiamento no programa Minha Casa Minha Vida.',
  '/corretores': 'Encontre os melhores corretores de imóveis perto de você. Profissionais qualificados e experientes.',
  '/imobiliarias': 'Explore as melhores imobiliárias e encontre seu imóvel ideal. Parceiros confiáveis em todo o Brasil.',
  '/favoritos': 'Seus imóveis favoritos salvos. Acompanhe os imóveis que mais te interessam.',
  '/minha-propriedade': 'Gerencie sua propriedade. Adicione e edite informações sobre seus imóveis.',
  '/confirm-email': 'Confirme seu email para ativar sua conta e acessar todas as funcionalidades.',
  '/confirmar-email': 'Confirme seu email para ativar sua conta e acessar todas as funcionalidades.',
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

const getPageDescription = (pathname: string): string => {
  if (pageDescriptions[pathname]) {
    return pageDescriptions[pathname]
  }
  return 'Encontre seu imóvel dos sonhos na Dream Keys.'
}

export const usePageTitle = (customTitle?: string, customDescription?: string, customImage?: string) => {
  const location = useLocation()
  
  const title = customTitle || getPageTitle(location.pathname)
  const description = customDescription || getPageDescription(location.pathname)
  
  useSEO({
    title,
    description,
    image: customImage,
    type: 'website',
  })
}

