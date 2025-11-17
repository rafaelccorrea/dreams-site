import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  noindex?: boolean
}

const SITE_URL = 'https://dreamskeys.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/logo-dream.png`

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const updateOrCreateTag = (tag: string, attributes: Record<string, string>) => {
  const selector = Object.entries(attributes)
    .map(([key, value]) => `[${key}="${value}"]`)
    .join('')
  
  let element = document.querySelector(`${tag}${selector}`) as HTMLElement
  if (!element) {
    element = document.createElement(tag) as HTMLElement
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
    document.head.appendChild(element)
  } else {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
  }
}

export const useSEO = (config: SEOConfig) => {
  const location = useLocation()
  const currentUrl = `${SITE_URL}${location.pathname}${location.search}`

  useEffect(() => {
    const title = config.title || 'Dream Keys - Encontre seu imóvel dos sonhos'
    const description = config.description || 'Encontre casas, apartamentos e imóveis comerciais para compra e locação. Sua plataforma completa de imóveis.'
    const image = config.image || DEFAULT_IMAGE
    const url = config.url || currentUrl
    const type = config.type || 'website'

    // Título da página
    document.title = title

    // Meta tags básicas
    updateMetaTag('description', description)
    updateMetaTag('robots', config.noindex ? 'noindex, nofollow' : 'index, follow')

    // Canonical URL
    updateLinkTag('canonical', url)

    // Open Graph / Facebook
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image, 'property')
    updateMetaTag('og:url', url, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:site_name', 'Dream Keys', 'property')
    updateMetaTag('og:locale', 'pt_BR', 'property')

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)

    // Schema.org - WebPage
    const schemaWebPage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description,
      url: url,
      image: image,
      inLanguage: 'pt-BR',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dream Keys',
        url: SITE_URL
      }
    }

    // Remover schema WebPage anterior se existir
    const existingWebPageSchema = document.querySelector('script[data-schema="webpage"]')
    if (existingWebPageSchema) {
      existingWebPageSchema.remove()
    }

    // Adicionar novo schema WebPage
    const schemaScript = document.createElement('script')
    schemaScript.setAttribute('type', 'application/ld+json')
    schemaScript.setAttribute('data-schema', 'webpage')
    schemaScript.textContent = JSON.stringify(schemaWebPage)
    document.head.appendChild(schemaScript)
  }, [config.title, config.description, config.image, config.url, config.type, config.noindex, currentUrl, location.pathname, location.search])
}

