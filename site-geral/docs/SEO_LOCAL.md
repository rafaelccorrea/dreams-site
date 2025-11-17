# SEO Local - Sistema de Páginas Dinâmicas por Cidade

Este documento explica como funciona o sistema de SEO local implementado para captar pesquisas como "casas à venda em Marília", "alugueis São Paulo", "apartamentos Rio de Janeiro", etc.

**IMPORTANTE:** O sistema funciona para **TODAS as cidades do Brasil**, não apenas para cidades específicas. Qualquer cidade brasileira pode ser acessada através das URLs dinâmicas.

## Como Funciona

O sistema cria URLs amigáveis e otimizadas para SEO que capturam pesquisas locais no Google.

### Formatos de URL Suportados

1. **Tipo + Operação + Cidade**: `/casas-a-venda-em-marilia`
2. **Tipo + Cidade**: `/casas-em-marilia`
3. **Imóveis + Cidade**: `/imoveis-em-marilia`

### Exemplos de URLs Geradas

- `/casas-a-venda-em-marilia` - Casas à venda em Marília
- `/apartamentos-para-alugar-em-sao-paulo` - Apartamentos para locação em São Paulo
- `/terrenos-a-venda-em-campinas` - Terrenos à venda em Campinas
- `/imoveis-comerciais-para-alugar-em-ribeirao-preto` - Imóveis comerciais para locação em Ribeirão Preto

## Componentes Criados

### 1. LocalSearchPage (`src/pages/LocalSearchPage/LocalSearchPage.tsx`)

Página dinâmica que:
- Captura parâmetros da URL (cidade, tipo, operação)
- Gera títulos e descrições otimizados para SEO
- Filtra propriedades automaticamente
- Adiciona dados estruturados Schema.org (RealEstateAgent)
- Exibe breadcrumbs para navegação

### 2. Utilitários SEO (`src/utils/seoUrls.ts`)

Funções para gerar URLs SEO-friendly:

```typescript
import { generateLocalUrl, generateLocalUrlsForCity } from '@/utils'

// Gerar URL específica
const url = generateLocalUrl('Marília', 'house', 'sale')
// Retorna: '/casas-a-venda-em-marilia'

// Gerar todas as URLs para uma cidade
const urls = generateLocalUrlsForCity('Marília')
// Retorna array com todas as combinações
```

## Rotas Configuradas

As seguintes rotas foram adicionadas no `App.tsx`:

```typescript
// Formato completo: tipo-operacao-em-cidade
/:typeSlug-:operationSlug-em-:citySlug

// Formato tipo-cidade
/:typeSlug-em-:citySlug

// Formato imoveis-cidade
/imoveis-em-:citySlug
```

## Dados Estruturados

Cada página local adiciona automaticamente dados estruturados Schema.org do tipo `RealEstateAgent`:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Dream Keys",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Marília",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "areaServed": {
    "@type": "City",
    "name": "Marília"
  }
}
```

## Sitemap

Páginas principais por cidade foram adicionadas ao `sitemap.xml`:

- Casas à venda em Marília
- Apartamentos à venda em Marília
- Casas para locação em Marília
- Apartamentos para locação em Marília
- Terrenos à venda em Marília

## Como Funciona para Todas as Cidades

### ✅ Sistema Totalmente Dinâmico

O sistema **já funciona para TODAS as cidades do Brasil**! Não é necessário adicionar cidades manualmente. As rotas dinâmicas capturam automaticamente qualquer cidade brasileira.

### Exemplos que Funcionam Automaticamente:

- `/casas-a-venda-em-sao-paulo` ✅
- `/apartamentos-para-alugar-em-rio-de-janeiro` ✅
- `/casas-em-belo-horizonte` ✅
- `/terrenos-a-venda-em-campinas` ✅
- `/imoveis-em-qualquer-cidade-do-brasil` ✅

### Sitemap com Cidades Principais

Algumas cidades principais foram adicionadas ao sitemap como exemplos para ajudar o Google a descobrir o padrão de URLs. Mas **qualquer cidade funciona**, mesmo que não esteja no sitemap.

O Google indexará essas páginas automaticamente quando:
- Encontrar links para elas
- Usuários acessarem essas URLs
- Descobrir através de crawling

## Otimizações Implementadas

1. **Títulos Dinâmicos**: Cada página tem título único e otimizado
   - Exemplo: "Casas à Venda em Marília - Dream Keys"

2. **Descrições Otimizadas**: Descrições específicas por cidade e tipo
   - Exemplo: "Encontre casas à venda em Marília. Casas com os melhores preços e condições em Marília."

3. **Breadcrumbs**: Navegação estruturada com dados Schema.org

4. **Filtros Automáticos**: Propriedades são filtradas automaticamente pela cidade e tipo

5. **Dados Estruturados**: Schema.org RealEstateAgent para cada cidade

## Como o Google Vai Indexar

1. **Páginas no Sitemap**: Páginas listadas no sitemap.xml serão indexadas primeiro
2. **Páginas Dinâmicas**: Outras páginas serão indexadas quando:
   - Usuários acessarem essas URLs
   - Houver links internos para essas páginas
   - O Google descobrir através de crawling

## Exemplos de Pesquisas que Serão Captadas

- ✅ "casas à venda em marília"
- ✅ "alugueis marília"
- ✅ "apartamentos para alugar em marília"
- ✅ "terrenos marília"
- ✅ "imóveis comerciais marília"
- ✅ "casas marília"
- ✅ "apartamentos marília"

## Próximos Passos Recomendados

1. **Adicionar Links Internos**: Criar links nas páginas principais apontando para páginas locais
2. **Conteúdo Único**: Adicionar conteúdo descritivo específico por cidade nas páginas locais
3. **Backlinks Locais**: Conseguir backlinks de sites locais da região
4. **Google My Business**: Configurar perfil no Google My Business para Marília
5. **Monitorar Performance**: Acompanhar no Google Search Console quais páginas locais estão performando melhor

## Manutenção

- **Atualizar Sitemap**: Adicione novas cidades importantes ao sitemap.xml periodicamente
- **Monitorar Erros**: Verifique no Google Search Console se há erros de indexação
- **Atualizar Conteúdo**: Mantenha as descrições e títulos atualizados

