# 🎯 Documentação do Sistema de Matches

## Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Dados](#-estrutura-de-dados)
3. [Endpoints da API](#-endpoints-da-api) (6 endpoints)
4. [Algoritmo de Compatibilidade](#-algoritmo-de-compatibilidade)
5. [Páginas](#-páginas)
6. [Componentes](#-componentes)
7. [Hooks Relacionados](#-hooks-relacionados)
8. [Status e Ações](#-status-e-ações)
9. [Automações](#-automações)
10. [Próximas Melhorias](#-próximas-melhorias)

---

## 📋 Visão Geral

O sistema de **Matches** é uma funcionalidade inteligente que calcula automaticamente a compatibilidade entre clientes e propriedades, facilitando a identificação de oportunidades de negócio e aumentando a eficiência dos corretores.

### Funcionalidades Principais

- ✅ **Cálculo Automático de Compatibilidade**: Algoritmo que analisa múltiplos critérios
- ✅ **Score de 0-100**: Pontuação clara da compatibilidade
- ✅ **Detalhes do Match**: Explicação dos motivos da compatibilidade
- ✅ **Filtros Avançados**: Por status, score mínimo, busca
- ✅ **Ações sobre Matches**: Aceitar, ignorar, visualizar
- ✅ **Automações**: Criação automática de tasks e notas ao aceitar
- ✅ **Notificações**: Alertas de novos matches
- ✅ **Badges Visuais**: Indicadores de matches pendentes
- ✅ **Widget no Dashboard**: Resumo de matches recentes
- ✅ **Integração com Propriedades e Clientes**: Visualização em ambos os contextos

### Como Funciona

1. **Cálculo Automático**: O sistema analisa automaticamente as preferências dos clientes e as características das propriedades
2. **Geração de Matches**: Quando há compatibilidade, um match é criado automaticamente
3. **Notificação**: O corretor é notificado sobre novos matches
4. **Ação do Corretor**: O corretor pode aceitar (criando task/nota) ou ignorar (com motivo)
5. **Aprendizado**: O sistema aprende com os feedbacks para melhorar futuros matches

---

## 📊 Estrutura de Dados

### Match (Match Completo)

```typescript
interface Match {
  id: string;
  matchScore: number;              // 0-100 (pontuação de compatibilidade)
  status: MatchStatus;              // Status atual do match
  
  property: PropertySummary;        // Resumo da propriedade
  client: ClientSummary;           // Resumo do cliente
  matchDetails: MatchDetails;      // Detalhes da compatibilidade
  
  // Flags de automação
  taskCreated: boolean;             // Se task foi criada automaticamente
  appointmentCreated: boolean;       // Se agendamento foi criado
  emailSent: boolean;                // Se email foi enviado
  notificationSent: boolean;        // Se notificação foi enviada
  
  // Timestamps
  createdAt: string;                // Data de criação (ISO)
  viewedAt?: string;                // Data de visualização (ISO)
  actionTakenAt?: string;           // Data da última ação (ISO)
  
  // Para matches ignorados
  ignoreReason?: IgnoreReason;      // Motivo do ignore
  notes?: string;                   // Notas adicionais
}
```

### MatchStatus (Status do Match)

```typescript
type MatchStatus =
  | 'pending'           // Pendente (novo match)
  | 'viewed'            // Visualizado
  | 'accepted'          // Aceito (task/nota criadas)
  | 'contacted'         // Cliente foi contatado
  | 'scheduled'         // Agendamento feito
  | 'ignored'           // Ignorado
  | 'not_interested'    // Cliente não se interessou
  | 'completed'         // Concluído (negócio fechado)
  | 'expired';          // Expirado
```

### IgnoreReason (Motivo de Ignorar)

```typescript
type IgnoreReason =
  | 'price_too_high'          // Preço muito alto
  | 'price_too_low'           // Preço muito baixo (suspeito)
  | 'location_bad'            // Localização ruim
  | 'already_shown'           // Já mostrado ao cliente
  | 'client_not_interested'   // Cliente não se interessou
  | 'property_sold'           // Imóvel já vendido
  | 'other';                  // Outro motivo
```

### MatchDetails (Detalhes da Compatibilidade)

```typescript
interface MatchDetails {
  priceMatch: boolean;         // Preço está na faixa desejada
  pricePercentage: number;     // % do orçamento do cliente
  locationMatch: boolean;      // Localização desejada
  typeMatch: boolean;          // Tipo de imóvel desejado
  sizeMatch: boolean;          // Tamanho/área compatível
  bedroomsMatch: boolean;      // Número de quartos adequado
  bathroomsMatch: boolean;     // Número de banheiros adequado
  reasons: string[];           // Lista de motivos (texto explicativo)
}
```

### PropertySummary (Resumo da Propriedade)

```typescript
interface PropertySummary {
  id: string;
  title: string;
  code?: string;
  salePrice?: number;
  rentPrice?: number;
  address?: string;
  city?: string;
  neighborhood?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  builtArea?: number;
  area?: number;
  images?: Array<string | {
    id?: string;
    url: string;
    thumbnailUrl?: string;
    isMain?: boolean;
    category?: string;
  }>;
  mainImage?: {
    id?: string;
    url: string;
    thumbnailUrl?: string;
  };
}
```

### ClientSummary (Resumo do Cliente)

```typescript
interface ClientSummary {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  cpf?: string;
  type?: string;               // 'buyer' | 'seller' | 'renter' | etc.
}
```

### DesiredFeatures (Características Desejadas)

```typescript
interface DesiredFeatures {
  hasGarage?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasBalcony?: boolean;
  hasGrill?: boolean;
  hasElevator?: boolean;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  hasAirConditioning?: boolean;
  hasGatedCommunity?: boolean;
  hasSportsArea?: boolean;
  hasPartyRoom?: boolean;
  hasPlayground?: boolean;
  hasSecurity?: boolean;
  garageSpots?: number;
  other?: string[];
}
```

### MatchListResponse

```typescript
interface MatchListResponse {
  matches: Match[];
  total: number;
  page: number;
  totalPages: number;
}
```

### MatchSummary

```typescript
interface MatchSummary {
  total: number;              // Total de matches
  pending: number;            // Matches pendentes
  accepted: number;          // Matches aceitos
  ignored: number;          // Matches ignorados
  highScore: number;        // Matches com score >= 80
}
```

### AcceptMatchResponse

```typescript
interface AcceptMatchResponse {
  message: string;
  match: {
    id: string;
    status: MatchStatus;
    taskCreated: boolean;
    actionTakenAt: string;
  };
}
```

### IgnoreMatchRequest

```typescript
interface IgnoreMatchRequest {
  reason: IgnoreReason;
  notes?: string;
}
```

### IgnoreMatchResponse

```typescript
interface IgnoreMatchResponse {
  message: string;
  match: {
    id: string;
    status: MatchStatus;
    ignoreReason: IgnoreReason;
    notes?: string;
    actionTakenAt: string;
  };
}
```

---

## 🔌 Endpoints da API

### Base URL
```
/matches
```

### Índice de Endpoints (6 rotas)

1. GET /matches - Listar matches do usuário
2. GET /matches/:matchId - Buscar match específico
3. POST /matches/:matchId/accept - Aceitar match
4. POST /matches/:matchId/ignore - Ignorar match
5. POST /matches/:matchId/view - Marcar como visualizado
6. PATCH /matches/:matchId/status - Atualizar status do match

---

### 1. Listar Matches

**Endpoint:**
```
GET /matches
```

**Query Parameters:**
```typescript
{
  status?: MatchStatus;        // Filtrar por status
  page?: number;               // Página (padrão: 1)
  limit?: number;              // Itens por página (padrão: 20)
  propertyId?: string;         // Filtrar por propriedade
  clientId?: string;           // Filtrar por cliente
}
```

**Resposta:**
```typescript
MatchListResponse
```

**Exemplo:**
```typescript
GET /matches?status=pending&page=1&limit=20&clientId=client-123
```

**Resposta de Exemplo:**
```typescript
{
  "matches": [
    {
      "id": "match-123",
      "matchScore": 85,
      "status": "pending",
      "property": {
        "id": "prop-456",
        "title": "Apartamento 3 quartos",
        "salePrice": 350000,
        "city": "São Paulo",
        "neighborhood": "Vila Mariana"
      },
      "client": {
        "id": "client-789",
        "name": "João Silva",
        "phone": "(11) 98765-4321"
      },
      "matchDetails": {
        "priceMatch": true,
        "pricePercentage": 87,
        "locationMatch": true,
        "typeMatch": true,
        "bedroomsMatch": true,
        "reasons": [
          "Preço dentro da faixa desejada (87% do orçamento)",
          "Localização desejada (Vila Mariana)",
          "Tipo de imóvel: Apartamento",
          "3 quartos conforme solicitado"
        ]
      },
      "taskCreated": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "totalPages": 1
}
```

### 2. Buscar Match por ID

**Endpoint:**
```
GET /matches/:matchId
```

**Resposta:**
```typescript
Match
```

**Exemplo:**
```typescript
GET /matches/match-123
```

### 3. Aceitar Match

**Endpoint:**
```
POST /matches/:matchId/accept
```

**Resposta:**
```typescript
AcceptMatchResponse
```

**Comportamento:**
- Altera status para `accepted`
- Cria automaticamente uma task no workspace do corretor
- Cria uma nota com detalhes do match
- Registra `actionTakenAt``

**Exemplo:**
```typescript
POST /matches/match-123/accept
```

**Resposta:**
```typescript
{
  "message": "Match aceito com sucesso. Task e nota criadas automaticamente.",
  "match": {
    "id": "match-123",
    "status": "accepted",
    "taskCreated": true,
    "actionTakenAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Ignorar Match

**Endpoint:**
```
POST /matches/:matchId/ignore
```

**Body:**
```typescript
{
  reason: IgnoreReason;        // Obrigatório
  notes?: string;               // Opcional
}
```

**Resposta:**
```typescript
IgnoreMatchResponse
```

**Comportamento:**
- Altera status para `ignored`
- Registra motivo do ignore
- Sistema aprende com o feedback para melhorar futuros matches
- Registra `actionTakenAt`

**Exemplo:**
```typescript
POST /matches/match-123/ignore
{
  "reason": "price_too_high",
  "notes": "Cliente não tem orçamento para este valor"
}
```

**Resposta:**
```typescript
{
  "message": "Match ignorado com sucesso.",
  "match": {
    "id": "match-123",
    "status": "ignored",
    "ignoreReason": "price_too_high",
    "notes": "Cliente não tem orçamento para este valor",
    "actionTakenAt": "2024-01-15T10:35:00Z"
  }
}
```

### 5. Marcar como Visualizado

**Endpoint:**
```
POST /matches/:matchId/view
```

**Resposta:**
```
204 No Content
```

**Comportamento:**
- Altera status para `viewed` (se estava `pending`)
- Registra `viewedAt`
- Não cria tasks ou notas

**Exemplo:**
```typescript
POST /matches/match-123/view
```

### 6. Atualizar Status do Match

**Endpoint:**
```
PATCH /matches/:matchId/status
```

**Body:**
```typescript
{
  status: MatchStatus;
}
```

**Resposta:**
```typescript
Match
```

**Exemplo:**
```typescript
PATCH /matches/match-123/status
{
  "status": "contacted"
}
```

---

## 🧮 Algoritmo de Compatibilidade

### Critérios Analisados

O sistema calcula a compatibilidade baseado em **7 critérios principais**:

#### 1. **Preço** (Peso: Alto)
- Compara preço da propriedade com faixa de interesse do cliente
- Calcula `pricePercentage`: % do orçamento do cliente
- `priceMatch = true` se preço está dentro da faixa desejada
- Score: 0-30 pontos (dependendo da proximidade do orçamento)

#### 2. **Localização** (Peso: Alto)
- Compara cidade e bairro da propriedade com preferências do cliente
- `locationMatch = true` se cidade/bairro correspondem
- Score: 0-25 pontos

#### 3. **Tipo de Imóvel** (Peso: Médio)
- Compara tipo da propriedade com tipo preferido do cliente
- `typeMatch = true` se tipos correspondem
- Score: 0-15 pontos

#### 4. **Tamanho/Área** (Peso: Médio)
- Compara área da propriedade com faixa desejada (min/max)
- `sizeMatch = true` se área está na faixa
- Score: 0-10 pontos

#### 5. **Quartos** (Peso: Médio)
- Compara número de quartos com preferência do cliente
- `bedroomsMatch = true` se número corresponde
- Score: 0-10 pontos

#### 6. **Banheiros** (Peso: Baixo)
- Compara número de banheiros com preferência mínima
- `bathroomsMatch = true` se atende mínimo
- Score: 0-5 pontos

#### 7. **Características Especiais** (Peso: Baixo)
- Compara características desejadas (`DesiredFeatures`) com características da propriedade
- Score: 0-5 pontos (por característica correspondente)

### Cálculo do Score Final

```
Score Total = 
  Preço (0-30) +
  Localização (0-25) +
  Tipo (0-15) +
  Área (0-10) +
  Quartos (0-10) +
  Banheiros (0-5) +
  Características (0-5)

Score Final = min(100, Score Total)
```

### Classificação do Score

| Score | Classificação | Cor | Label |
|-------|--------------|-----|-------|
| 90-100 | Match Perfeito | Verde Escuro | "Match Perfeito!" |
| 80-89 | Ótimo Match | Verde | "Ótimo Match" |
| 70-79 | Bom Match | Amarelo | "Bom Match" |
| 50-69 | Match Moderado | Laranja | "Match Moderado" |
| 25-49 | Match Baixo | Vermelho Claro | "Match Baixo" |
| 1-24 | Match Muito Baixo | Vermelho Escuro | "Match Muito Baixo" |
| 0 | Sem Compatibilidade | Cinza | "Sem Compatibilidade" |

### Geração de Motivos (Reasons)

O sistema gera automaticamente uma lista de motivos (`reasons`) explicando por que é um match:

**Exemplos de Motivos:**
- "Preço dentro da faixa desejada (87% do orçamento)"
- "Localização desejada (Vila Mariana)"
- "Tipo de imóvel: Apartamento"
- "3 quartos conforme solicitado"
- "Área de 120m² dentro da faixa desejada"
- "Possui garagem conforme solicitado"
- "Possui piscina conforme solicitado"

---

## 📄 Páginas

### MatchesPage (Página Principal)

**Localização:** `src/pages/MatchesPage.tsx`

**Rota:** `/matches`

**Funcionalidades:**
- Listar todos os matches do usuário
- Filtros por status, score mínimo, busca
- Grid de cards de matches
- Ações: aceitar, ignorar, visualizar
- Modais de confirmação
- Toast de workspace após aceitar

**Filtros Disponíveis:**
- Status (pending, accepted, ignored, etc.)
- Score mínimo (0-100)
- Busca (por nome do cliente ou título da propriedade)
- Tipo de busca (todos, cliente, propriedade)

**Componentes Utilizados:**
- `MatchCard`: Card de match
- `MatchFiltersDrawer`: Drawer de filtros
- `MatchActionConfirmationModal`: Modal de confirmação
- `IgnoreMatchDialog`: Dialog para ignorar com motivo
- `MatchWorkspaceToast`: Toast após aceitar

### PropertyMatchesPage (Matches de Propriedade)

**Localização:** `src/pages/PropertyMatchesPage.tsx`

**Rota:** `/properties/:propertyId/matches`

**Funcionalidades:**
- Listar clientes compatíveis com uma propriedade específica
- Exibe informações da propriedade no topo
- Mesmas ações e filtros da página principal
- Filtro automático por `propertyId`

**Uso:**
- Acessada a partir da página de detalhes da propriedade
- Mostra quais clientes são compatíveis com o imóvel

---

## 🧩 Componentes

### MatchCard

**Localização:** `src/components/matches/MatchCard.tsx`

**Props:**
```typescript
interface MatchCardProps {
  match: Match;
  onAccept: (match: Match) => void;
  onIgnore: (match: Match) => void;
  loading?: boolean;
}
```

**Funcionalidades:**
- Exibe score com badge colorido
- Imagem da propriedade
- Informações do cliente e propriedade
- Lista de motivos do match
- Grid de compatibilidade
- Botões de ação (aceitar, ver detalhes, ignorar)

**Visual:**
- Score badge com cor baseada no score
- Ícone de fogo (🔥) para scores >= 90
- Imagem principal da propriedade ou placeholder
- Motivos com ícones contextuais

### MatchesBadge

**Localização:** `src/components/common/MatchesBadge.tsx`

**Props:**
```typescript
interface MatchesBadgeProps {
  clientId?: string;
  propertyId?: string;
  onClick?: () => void;
}
```

**Funcionalidades:**
- Badge que mostra quantidade de matches pendentes
- Aparece ao lado do nome do cliente ou propriedade
- Clique redireciona para página de matches
- Animação de pulse
- Só aparece se houver matches pendentes

**Uso:**
```typescript
<MatchesBadge clientId={client.id} />
// ou
<MatchesBadge propertyId={property.id} />
```

### MatchesWidget

**Localização:** `src/components/common/MatchesWidget.tsx`

**Funcionalidades:**
- Widget para dashboard
- Exibe resumo de matches (total, pendentes, aceitos, etc.)
- Lista os 5 matches mais recentes
- Links para ver detalhes
- Diferenciação visual para clientes vendedores

### MatchFiltersDrawer

**Localização:** `src/components/matches/MatchFiltersDrawer.tsx`

**Props:**
```typescript
interface MatchFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    status: MatchStatus | '';
    minScore: number;
    search: string;
    searchType?: 'all' | 'client' | 'property';
  };
  onChange: (filters: any) => void;
}
```

**Funcionalidades:**
- Filtro por status (dropdown)
- Filtro por score mínimo (slider 0-100)
- Busca por texto (mínimo 3 caracteres)
- Tipo de busca (todos, cliente, propriedade)
- Limpar filtros
- Aplicar filtros

### MatchActionConfirmationModal

**Localização:** `src/components/matches/MatchActionConfirmationModal.tsx`

**Funcionalidades:**
- Modal de confirmação antes de aceitar ou ignorar
- Exibe informações do match
- Botões de confirmar/cancelar
- Estado de loading durante processamento

### IgnoreMatchDialog

**Localização:** `src/components/matches/IgnoreMatchDialog.tsx`

**Funcionalidades:**
- Dialog para selecionar motivo do ignore
- Lista de motivos com ícones
- Campo de notas opcional
- Botões de confirmar/cancelar

### MatchWorkspaceToast

**Localização:** `src/components/matches/MatchWorkspaceToast.tsx`

**Funcionalidades:**
- Toast exibido após aceitar match
- Informa que task e nota foram criadas
- Botão para ir ao workspace
- Botão para fechar

---

## 🎣 Hooks Relacionados

### useMatches

**Localização:** `src/hooks/useMatches.ts`

**Interface:**
```typescript
interface UseMatchesParams {
  status?: MatchStatus;
  page?: number;
  limit?: number;
  propertyId?: string;
  clientId?: string;
  autoFetch?: boolean;
}

// Retorno
{
  matches: Match[] | null;
  loading: boolean;
  error: Error | null;
  total: number;
  totalPages: number;
  refetch: () => void;
}
```

**Funcionalidades:**
- Buscar matches com filtros
- Paginação automática
- Recarregamento ao mudar empresa
- Cache local
- Auto-fetch opcional

**Uso:**
```typescript
const { matches, loading, refetch } = useMatches({
  status: 'pending',
  propertyId: 'prop-123',
  autoFetch: true
});
```

### useMatchesSummary

**Localização:** `src/hooks/useMatches.ts`

**Interface:**
```typescript
// Retorno
{
  summary: MatchSummaryWithRecent | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface MatchSummaryWithRecent extends MatchSummary {
  recent: Match[];  // 5 matches mais recentes
}
```

**Funcionalidades:**
- Calcula resumo de matches (total, pendentes, aceitos, etc.)
- Retorna os 5 matches mais recentes
- Útil para widgets e dashboards

**Uso:**
```typescript
const { summary, loading } = useMatchesSummary();
```

### useMatchActions

**Localização:** `src/hooks/useMatchActions.ts`

**Interface:**
```typescript
// Retorno
{
  acceptMatch: (matchId: string) => Promise<{ success: boolean; data?: AcceptMatchResponse; error?: any }>;
  ignoreMatch: (matchId: string, reason: IgnoreReason, notes?: string) => Promise<{ success: boolean; error?: any }>;
  processing: boolean;
}
```

**Funcionalidades:**
- Aceitar match (com toast de sucesso)
- Ignorar match (com motivo)
- Gerenciamento de estado de processamento
- Tratamento de erros

**Uso:**
```typescript
const { acceptMatch, ignoreMatch, processing } = useMatchActions();

await acceptMatch('match-123');
await ignoreMatch('match-123', 'price_too_high', 'Notas opcionais');
```

---

## 📊 Status e Ações

### Status Disponíveis

| Status | Descrição | Ações Disponíveis |
|--------|-----------|-------------------|
| `pending` | Match novo, não visualizado | Aceitar, Ignorar, Visualizar |
| `viewed` | Match visualizado | Aceitar, Ignorar |
| `accepted` | Match aceito (task/nota criadas) | Atualizar status |
| `contacted` | Cliente foi contatado | Atualizar status |
| `scheduled` | Agendamento feito | Atualizar status |
| `ignored` | Match ignorado | - |
| `not_interested` | Cliente não se interessou | - |
| `completed` | Negócio fechado | - |
| `expired` | Match expirado | - |

### Fluxo de Status

```
pending → viewed → accepted → contacted → scheduled → completed
   ↓
ignored / not_interested / expired
```

### Motivos de Ignorar

| Motivo | Ícone | Descrição |
|--------|-------|-----------|
| `price_too_high` | 💰 | Preço muito alto |
| `price_too_low` | 💸 | Preço muito baixo (suspeito) |
| `location_bad` | 📍 | Localização ruim |
| `already_shown` | 👁️ | Já mostrado ao cliente |
| `client_not_interested` | 😐 | Cliente não se interessou |
| `property_sold` | 🏷️ | Imóvel já vendido |
| `other` | 🔹 | Outro motivo |

---

## 🤖 Automações

### Ao Aceitar um Match

Quando um match é aceito, o sistema automaticamente:

1. **Cria uma Task** no workspace pessoal do corretor:
   - Título: "Contatar [Nome do Cliente] sobre [Título da Propriedade]"
   - Descrição: Detalhes do match
   - Prioridade: Baseada no score (alto se >= 80)
   - Data: Hoje

2. **Cria uma Nota** associada ao cliente:
   - Título: "Match com [Título da Propriedade]"
   - Conteúdo: Detalhes completos do match, score, motivos
   - Tipo: "match"

3. **Atualiza Flags**:
   - `taskCreated = true`
   - `appointmentCreated = false` (pode ser criado depois)
   - `actionTakenAt = now()`

4. **Exibe Toast**:
   - Informa que task e nota foram criadas
   - Oferece link para ir ao workspace

### Ao Ignorar um Match

Quando um match é ignorado:

1. **Registra Motivo**: Salva `ignoreReason` e `notes`
2. **Aprendizado**: Sistema usa feedback para melhorar algoritmos futuros
3. **Atualiza Status**: `status = 'ignored'`
4. **Registra Timestamp**: `actionTakenAt = now()`

### Notificações

- **Novo Match**: Notificação quando match é criado
- **Match Aceito**: Confirmação de criação de task/nota
- **Match Ignorado**: Confirmação de ignore

---

## 🔄 Fluxos Principais

### Fluxo de Visualização de Matches

```
1. Usuário acessa /matches
   ↓
2. Hook useMatches busca matches (status=pending por padrão)
   ↓
3. Matches são exibidos em grid de cards
   ↓
4. Usuário pode:
   - Filtrar por status/score/busca
   - Visualizar detalhes (navega para propriedade/cliente)
   - Aceitar match
   - Ignorar match
```

### Fluxo de Aceitar Match

```
1. Usuário clica em "Aceitar" no card
   ↓
2. Modal de confirmação é exibido
   ↓
3. Usuário confirma
   ↓
4. API POST /matches/:id/accept é chamada
   ↓
5. Backend:
   - Atualiza status para 'accepted'
   - Cria task no workspace
   - Cria nota no cliente
   - Atualiza flags
   ↓
6. Frontend:
   - Recarrega lista de matches
   - Exibe toast de sucesso
   - Oferece link para workspace
   ↓
7. Match desaparece da lista de pendentes
```

### Fluxo de Ignorar Match

```
1. Usuário clica em "Ignorar" no card
   ↓
2. Modal de confirmação é exibido
   ↓
3. Usuário confirma
   ↓
4. Dialog de motivos é exibido
   ↓
5. Usuário seleciona motivo (obrigatório) e opcionalmente adiciona notas
   ↓
6. API POST /matches/:id/ignore é chamada
   ↓
7. Backend:
   - Atualiza status para 'ignored'
   - Salva motivo e notas
   - Aprende com feedback
   ↓
8. Frontend:
   - Recarrega lista de matches
   - Exibe toast de confirmação
   ↓
9. Match desaparece da lista de pendentes
```

### Fluxo de Cálculo de Match (Backend)

```
1. Cliente é criado/atualizado OU Propriedade é criada/atualizada
   ↓
2. Sistema verifica se há propriedades/clientes compatíveis
   ↓
3. Para cada combinação possível:
   - Calcula score de compatibilidade
   - Se score >= threshold (ex: 50), cria match
   ↓
4. Match é criado com:
   - Score calculado
   - Detalhes da compatibilidade
   - Motivos gerados
   - Status 'pending'
   ↓
5. Notificação é enviada ao corretor responsável
```

---

## 🔐 Permissões e Restrições

### Permissões Necessárias

| Ação | Permissão |
|------|-----------|
| Ver matches próprios | Autenticação |
| Aceitar match | Autenticação |
| Ignorar match | Autenticação |
| Atualizar status | Autenticação |

### Restrições

1. **Escopo de Dados:**
   - Usuários veem apenas matches de seus próprios clientes/propriedades
   - Matches são vinculados ao corretor responsável

2. **Ações:**
   - Apenas o corretor responsável pode aceitar/ignorar
   - Matches aceitos não podem ser ignorados depois
   - Matches ignorados podem ser visualizados mas não aceitos

3. **Cálculo:**
   - Matches são calculados automaticamente pelo backend
   - Não há endpoint para criar match manualmente
   - Threshold mínimo de score pode ser configurado

---

## 📱 Integrações

### Com Propriedades

- **Badge de Matches**: Aparece na listagem e detalhes de propriedades
- **Seção de Clientes Compatíveis**: Na página de detalhes da propriedade
- **Link para Matches**: Navega para `/properties/:id/matches`

### Com Clientes

- **Badge de Matches**: Aparece na listagem e detalhes de clientes
- **Seção de Propriedades Compatíveis**: Na página de detalhes do cliente
- **Link para Matches**: Navega para página de matches filtrada

### Com Workspace

- **Tasks Automáticas**: Tasks são criadas no workspace ao aceitar
- **Notas Automáticas**: Notas são criadas no cliente ao aceitar
- **Link de Navegação**: Toast oferece link para workspace

### Com Notificações

- **Notificações de Novos Matches**: WebSocket ou polling
- **Badge de Contagem**: Mostra quantidade de matches pendentes
- **Navegação**: Clicar na notificação leva para match específico

---

## 📱 Responsividade

### Desktop
- Grid de 3-4 colunas
- Cards grandes com todas as informações
- Filtros em drawer lateral

### Tablet
- Grid de 2 colunas
- Cards adaptados
- Filtros em modal

### Mobile
- Grid de 1 coluna
- Cards otimizados
- Filtros em drawer full-screen

---

## 🚀 Próximas Melhorias

- [ ] Machine Learning para melhorar algoritmo
- [ ] Score personalizado por corretor (aprendizado)
- [ ] Filtros avançados (faixa de score, data, etc.)
- [ ] Exportação de matches
- [ ] Histórico de matches
- [ ] Estatísticas de conversão (matches → negócios)
- [ ] Comparação de matches lado a lado
- [ ] Agendamento automático de visita ao aceitar
- [ ] Email automático ao cliente ao aceitar
- [ ] Integração com WhatsApp
- [ ] Matches em tempo real
- [ ] Notificações push no mobile
- [ ] Dashboard de performance de matches
- [ ] A/B testing de algoritmos
- [ ] Feedback do cliente sobre match

---

## 📝 Notas Técnicas

### Performance

- **Cálculo Assíncrono**: Matches são calculados em background
- **Cache**: Lista de matches é cacheada
- **Paginação**: Suporte a grandes volumes
- **Lazy Loading**: Componentes carregados sob demanda

### Algoritmo

- **Backend**: Cálculo é feito no servidor
- **Threshold**: Score mínimo configurável (padrão: 50)
- **Pesos**: Pesos dos critérios podem ser ajustados
- **Aprendizado**: Sistema aprende com feedbacks de ignore

### Notificações

- **WebSocket**: Notificações em tempo real (se disponível)
- **Polling**: Fallback para polling periódico
- **Badges**: Atualização automática de contadores

---

**Última atualização:** Janeiro 2025

