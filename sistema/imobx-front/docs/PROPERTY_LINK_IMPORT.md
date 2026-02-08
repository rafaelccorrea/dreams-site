# Importação de Propriedades via Link Externo

## 📋 Visão Geral

Esta feature permite que usuários cadastrem propriedades automaticamente ao fornecer um link de um site externo (ex: OLX, ZAP Imóveis, QuintoAndar, etc.). O sistema coleta automaticamente imagens, títulos, informações e preenche o formulário de cadastro.

## 🏗️ Arquitetura

### Fluxo de Funcionamento

```
1. Usuário insere link na página de criação
   ↓
2. Frontend envia link para o backend
   ↓
3. Backend identifica o site e faz scraping/coleta
   ↓
4. Backend retorna dados estruturados
   ↓
5. Frontend preenche formulário com dados coletados
   ↓
6. Usuário revisa e ajusta dados
   ↓
7. Usuário salva propriedade normalmente
```

## 🎯 Componentes

### Frontend

1. **Componente de Importação por Link**
   - Modal ou seção no formulário de criação
   - Campo de input para URL
   - Botão para coletar dados
   - Indicador de carregamento
   - Preview dos dados coletados
   - Botão para aplicar dados ao formulário

2. **Serviço de API**
   - `propertyImportApi.ts` - Comunicação com backend

3. **Tipos TypeScript**
   - `PropertyImportData` - Dados coletados do link
   - `PropertyImportResponse` - Resposta da API

### Backend (Proposta)

1. **Endpoint de Importação**
   ```
   POST /properties/import-from-link
   Body: { url: string }
   Response: PropertyImportData
   ```

2. **Serviços de Scraping**
   - Identificador de site (OLX, ZAP, etc.)
   - Scrapers específicos por site
   - Normalização de dados
   - Download e armazenamento de imagens

## 📊 Estrutura de Dados

### PropertyImportData

```typescript
interface PropertyImportData {
  // Dados básicos
  title?: string;
  description?: string;
  type?: PropertyType; // inferido ou mapeado
  status?: PropertyStatus;
  
  // Localização
  address?: string;
  street?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  
  // Características
  totalArea?: number;
  builtArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  
  // Valores
  salePrice?: number;
  rentPrice?: number;
  condominiumFee?: number;
  iptu?: number;
  
  // Imagens (URLs para download)
  imageUrls?: string[];
  
  // Dados extras do site
  sourceUrl: string;
  sourceSite?: string; // 'olx', 'zap', 'quintoandar', etc.
  rawData?: any; // Dados brutos para referência
}
```

## 🔧 Implementação Sugerida

### Sites Prioritários (Brasil)

1. **OLX** - Mercado Livre Imóveis
2. **ZAP Imóveis**
3. **QuintoAndar**
4. **Viva Real**
5. **Imovelweb**

### Considerações Técnicas

1. **CORS e Proxy**
   - Scraping precisa ser feito no backend
   - Considerar proxy para evitar bloqueios
   - Rate limiting para evitar ban

2. **Mapeamento de Dados**
   - Cada site tem estrutura diferente
   - Normalizar dados para formato padrão
   - Tratamento de campos faltantes

3. **Imagens**
   - Download de imagens no backend
   - Conversão para formato adequado
   - Upload para storage (S3, etc.)

4. **Validação**
   - Validar dados coletados
   - Permitir edição antes de salvar
   - Alertas para dados faltantes críticos

## 🚀 Roadmap de Implementação

### Fase 1: Frontend Básico
- [ ] Componente de input de link
- [ ] Integração com API
- [ ] Preenchimento automático do formulário
- [ ] Feedback visual de sucesso/erro

### Fase 2: Backend MVP
- [ ] Endpoint de importação
- [ ] Scraper para 1-2 sites principais (ex: OLX, ZAP)
- [ ] Download básico de imagens
- [ ] Mapeamento de dados

### Fase 3: Melhorias
- [ ] Suporte a mais sites
- [ ] Melhoria na detecção de campos
- [ ] Cache de dados coletados
- [ ] Histórico de importações

### Fase 4: Avançado
- [ ] Suporte a múltiplos links (batch)
- [ ] IA para melhorar mapeamento
- [ ] Validação inteligente de dados
- [ ] Preview antes de aplicar

## ⚠️ Limitações e Desafios

1. **Mudanças nos Sites**
   - Sites podem mudar estrutura HTML
   - Scrapers precisam ser mantidos

2. **Termos de Uso**
   - Verificar ToS de cada site
   - Considerar APIs oficiais quando disponíveis

3. **Performance**
   - Scraping pode ser lento
   - Implementar timeout e retry

4. **Qualidade dos Dados**
   - Dados podem estar incompletos
   - Usuário sempre deve revisar

## 📝 Notas Adicionais

- Considerar usar serviços terceiros (ScraperAPI, Apify) para facilitar
- Implementar fallback quando scraping falhar
- Adicionar logs detalhados para debugging
- Permitir importação manual parcial se automática falhar

