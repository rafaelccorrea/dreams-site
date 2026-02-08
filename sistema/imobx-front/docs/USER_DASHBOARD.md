# 📊 Dashboard do Usuário - Documentação Completa

Esta documentação descreve a implementação completa do Dashboard do Usuário no App Corretor, incluindo estrutura, componentes, hooks, APIs e funcionalidades.

---

## 📋 Visão Geral

O Dashboard do Usuário é uma tela personalizada que exibe estatísticas, métricas de performance, conquistas e atividades recentes específicas do usuário logado. É o ponto de entrada principal para corretores visualizarem seu desempenho individual.

### Funcionalidades Principais

- 📈 **Performance e Ranking**: Visualização de performance mensal, ranking e crescimento
- 🏆 **Gamificação**: Pontos, níveis, conquistas e breakdown de pontos
- 📊 **Estatísticas**: Propriedades, clientes, vistorias, agendamentos, comissões
- 📅 **Atividades Recentes**: Timeline de atividades recentes
- 📅 **Próximos Agendamentos**: Lista de compromissos futuros
- 🎯 **Metas Mensais**: Progresso de metas de vendas e comissões
- 📉 **Métricas de Conversão**: Taxas de conversão de visitas, clientes e matches
- 🔍 **Filtros Avançados**: Filtragem por período, métricas e comparações

---

## 🗂️ Estrutura de Arquivos

```
src/
├── pages/
│   └── UserDashboardPage.tsx           # Página principal do dashboard
├── components/
│   ├── dashboard/
│   │   └── UserDashboardFilters.tsx   # Componente de filtros
│   └── shimmer/
│       └── UserDashboardShimmer.tsx   # Loading skeleton
├── hooks/
│   └── useUserDashboard.ts            # Hook principal com lógica
├── services/
│   └── dashboardApi.ts                # Serviço de API
├── styles/
│   └── pages/
│       └── UserDashboardPageStyles.ts # Estilos do dashboard
└── types/
    └── auth.ts                        # Tipos relacionados (se houver)
```

---

## 🔌 Endpoint da API

### GET `/dashboard/user`

Endpoint principal que retorna todos os dados do dashboard do usuário.

**Autenticação:** Requerida (Bearer Token)

**Parâmetros de Query (Opcionais):**

| Parâmetro | Tipo | Descrição | Valores Possíveis |
|-----------|------|-----------|-------------------|
| `dateRange` | string | Período de análise | `today`, `7d`, `30d`, `90d`, `1y`, `custom` |
| `startDate` | string | Data inicial (quando `custom`) | Formato: `YYYY-MM-DD` |
| `endDate` | string | Data final (quando `custom`) | Formato: `YYYY-MM-DD` |
| `compareWith` | string | Tipo de comparação | `previous_period`, `previous_year`, `none` |
| `metric` | string | Filtrar por métrica específica | `all`, `properties`, `clients`, `inspections`, `appointments`, `commissions`, `tasks`, `matches` |
| `activitiesLimit` | number | Limite de atividades recentes | 1-100 (padrão: 10) |
| `appointmentsLimit` | number | Limite de agendamentos | 1-50 (padrão: 5) |

**Exemplo de Requisição:**
```typescript
GET /dashboard/user?dateRange=custom&startDate=2024-01-01&endDate=2024-01-31&compareWith=previous_period&metric=all&activitiesLimit=10&appointmentsLimit=5
```

**Resposta:**
```typescript
{
  success: boolean;
  data: UserDashboardDataDto;
  lastUpdated: string;
}
```

Para estrutura completa da resposta, consulte a seção [Estrutura de Dados](#estrutura-de-dados).

---

## 📊 Estrutura de Dados

### UserDashboardDataDto

```typescript
interface UserDashboardDataDto {
  user: UserInfoDto;
  stats: UserStatsDto;
  performance: UserPerformanceDto;
  gamification: GamificationDto;
  activityStats: ActivityStatsDto;
  recentActivities: RecentActivityItemDto[];
  upcomingAppointments: UpcomingAppointmentDto[];
  monthlyGoals: MonthlyGoalsDto;
  conversionMetrics: ConversionMetricsDto;
}
```

### Detalhamento dos Campos

#### 1. UserInfoDto
```typescript
interface UserInfoDto {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}
```

#### 2. UserStatsDto
```typescript
interface UserStatsDto {
  myProperties: number;      // Total de propriedades atribuídas
  myClients: number;         // Total de clientes atribuídos
  myInspections: number;     // Vistorias pendentes
  myAppointments: number;    // Total de agendamentos
  myCommissions: number;     // Comissões recebidas (R$)
  myTasks: number;           // Tarefas pendentes
  myKeys: number;            // Chaves em posse
  myNotes: number;           // Anotações ativas
  myMatches: number;         // Matches pendentes
}
```

#### 3. UserPerformanceDto
```typescript
interface UserPerformanceDto {
  thisMonth: number;           // Performance atual (R$)
  lastMonth: number;           // Performance mês anterior (R$)
  growthPercentage: number;    // Crescimento percentual
  ranking: number;             // Posição no ranking
  totalUsers: number;          // Total de usuários no ranking
  points: number;              // Pontos de gamificação
}
```

#### 4. GamificationDto
```typescript
interface GamificationDto {
  currentPoints: number;
  level: number;
  achievements: AchievementDto[];
  pointsBreakdown: {
    sales: number;
    rentals: number;
    clients: number;
    appointments: number;
    tasks: number;
    other: number;
  };
}

interface AchievementDto {
  id: string;
  achievementId: string;
  name: string;
  description: string;
  icon: string;                // Emoji ou código de ícone
  earnedAt: string;            // ISO 8601 date
}
```

#### 5. ActivityStatsDto
```typescript
interface ActivityStatsDto {
  totalVisits: number;              // Total de visitas realizadas
  appointmentsThisMonth: number;    // Agendamentos no mês atual
  completionRate: number;           // Taxa de conclusão de tarefas (%)
}
```

#### 6. RecentActivityItemDto
```typescript
interface RecentActivityItemDto {
  id: string;
  type: string;                     // 'property', 'client', 'inspection', 'appointment'
  title: string;
  description: string;
  time: string;                     // Tempo relativo ("2 horas atrás")
  status: string;
  createdAt: string;                // ISO 8601 date
}
```

#### 7. UpcomingAppointmentDto
```typescript
interface UpcomingAppointmentDto {
  id: string;
  title: string;
  date: string;                     // YYYY-MM-DD
  time: string;                     // HH:MM
  client: string;
  type: string;
}
```

#### 8. MonthlyGoalsDto
```typescript
interface MonthlyGoalsDto {
  sales?: GoalProgressDto;
  commissions?: GoalProgressDto;
}

interface GoalProgressDto {
  current: number;                  // Valor/quantidade atual
  target: number;                   // Meta
  percentage: number;               // Percentual atingido (0-100)
}
```

#### 9. ConversionMetricsDto
```typescript
interface ConversionMetricsDto {
  visitsToSales: number;            // Taxa de conversão visitas → vendas (%)
  clientsToClosed: number;          // Taxa de conversão clientes → fechados (%)
  matchesAccepted: number;          // Taxa de aceitação de matches (%)
}
```

---

## 🎣 Hook: useUserDashboard

**Arquivo**: `src/hooks/useUserDashboard.ts`

Hook principal que gerencia estado, filtros e busca de dados do dashboard.

### Interface do Retorno

```typescript
interface UseUserDashboardReturn {
  data: UserDashboardResponse | null;
  loading: boolean;
  error: string | null;
  filters: UserDashboardFilters;
  updateFilters: (newFilters: Partial<UserDashboardFilters>) => void;
  refresh: () => void;
}
```

### Interface de Filtros

```typescript
interface UserDashboardFilters {
  dateRange?: 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';
  compareWith?: 'previous_period' | 'previous_year' | 'none';
  metric?: 'all' | 'properties' | 'clients' | 'inspections' | 'appointments' | 'commissions' | 'tasks' | 'matches';
  startDate?: string;              // YYYY-MM-DD
  endDate?: string;                // YYYY-MM-DD
  activitiesLimit?: number;        // Padrão: 10
  appointmentsLimit?: number;      // Padrão: 5
}
```

### Filtros Padrão

Os filtros padrão são:
- `dateRange`: `'custom'` (primeiro dia do mês até hoje)
- `compareWith`: `'none'`
- `metric`: `'all'`
- `activitiesLimit`: `10`
- `appointmentsLimit`: `5`

### Exemplo de Uso

```typescript
import { useUserDashboard } from '../hooks/useUserDashboard';

function DashboardComponent() {
  const { 
    data, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    refresh 
  } = useUserDashboard();
  
  // Atualizar filtros
  const handleFilterChange = () => {
    updateFilters({
      dateRange: '30d',
      metric: 'commissions'
    });
  };
  
  // Recarregar dados
  const handleRefresh = () => {
    refresh();
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <DashboardContent data={data?.data} />;
}
```

---

## 🎨 Componente: UserDashboardPage

**Arquivo**: `src/pages/UserDashboardPage.tsx`

Componente principal que renderiza o dashboard completo.

### Estrutura do Dashboard

O dashboard é dividido em várias seções:

1. **Cabeçalho com Saudação**
   - Saudação personalizada (Bom dia/Boa tarde/Boa noite)
   - Nome do usuário
   - Data atual formatada
   - Botão de filtros

2. **Card de Performance** (se tiver permissão `commission:view`)
   - Performance mensal (R$)
   - Comparação com mês anterior (%)
   - Ranking e posição
   - Nível de gamificação
   - Pontos totais
   - Gráfico de breakdown de pontos

3. **Seção de Conquistas**
   - Grid com conquistas recentes
   - Ícone, título, descrição e data de conquista

4. **Cards de Estatísticas Principais**
   - Propriedades (com permissão `property:view`)
   - Clientes (com permissão `client:view`)
   - Vistorias (com permissão `inspection:view`)
   - Comissões (com permissão `commission:view`)

5. **Seção de Atividades**
   - Tarefas
   - Agendamentos do mês
   - Matches pendentes

6. **Metas Mensais**
   - Meta de vendas (progresso)
   - Meta de comissões (progresso)

7. **Métricas de Conversão**
   - Visitas → Vendas
   - Clientes → Fechados
   - Matches → Aceitos

8. **Atividades Recentes**
   - Lista de atividades recentes com ícones
   - Timeline com tempo relativo

9. **Próximos Agendamentos**
   - Lista de agendamentos futuros
   - Data, hora e cliente

### Permissões e Controle de Acesso

O dashboard respeita permissões do usuário:

```typescript
const canAccess = (permission: string): boolean => {
  return permissionsContext?.hasPermission(permission) ?? false;
};
```

Seções condicionais:
- **Performance Card**: Requer `commission:view`
- **Card de Propriedades**: Requer `property:view`
- **Card de Clientes**: Requer `client:view`
- **Card de Vistorias**: Requer `inspection:view`
- **Card de Comissões**: Requer `commission:view`

### Navegação

Os cards são clicáveis e redirecionam para páginas específicas:

- **Propriedades** → `/properties`
- **Clientes** → `/clients`
- **Vistorias** → `/inspection`
- **Tarefas** → `/kanban`
- **Agendamentos** → `/calendar`
- **Comissões** → `/financial`
- **Matches** → `/matches`

---

## 🔍 Componente: UserDashboardFilters

**Arquivo**: `src/components/dashboard/UserDashboardFilters.tsx`

Componente de filtros em formato de drawer lateral que permite personalizar os dados exibidos no dashboard.

### Filtros Disponíveis

#### 1. Período de Análise (dateRange)

| Valor | Label | Descrição |
|-------|-------|-----------|
| `today` | Hoje | Dados apenas do dia atual |
| `7d` | Últimos 7 dias | Dados dos últimos 7 dias |
| `30d` | Últimos 30 dias | Dados dos últimos 30 dias |
| `90d` | Últimos 90 dias | Dados dos últimos 90 dias |
| `1y` | Último ano | Dados dos últimos 365 dias |
| `custom` | Período Personalizado | Período customizado com datas específicas |

**Quando "Custom" é selecionado:**
- Exibe campos de data inicial (`startDate`) e data final (`endDate`)
- Formato das datas: `YYYY-MM-DD`
- **Padrão automático**: Primeiro dia do mês atual até hoje
- Permite selecionar qualquer intervalo de datas

**Exemplo:**
```typescript
{
  dateRange: 'custom',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
}
```

#### 2. Comparação (compareWith)

Permite comparar os dados do período selecionado com outro período para análise de crescimento/tendências.

| Valor | Label | Descrição |
|-------|-------|-----------|
| `none` | Sem comparação | Exibe apenas dados do período selecionado (padrão) |
| `previous_period` | Período anterior | Compara com período equivalente anterior |
| `previous_year` | Mesmo período ano passado | Compara com mesmo período do ano anterior |

**Exemplos:**
- Período: `30d` (1-30 Jan) + `previous_period` = Compara com 2-31 Dez
- Período: `custom` (Jan 2024) + `previous_year` = Compara com Jan 2023

#### 3. Tipo de Métrica (metric)

Filtra quais métricas específicas devem ser retornadas. Quando uma métrica específica é selecionada, apenas essa métrica terá dados, as outras retornarão zero.

| Valor | Label | Descrição |
|-------|-------|-----------|
| `all` | Todas as métricas | Retorna todas as estatísticas (padrão) |
| `properties` | Propriedades | Apenas estatísticas de propriedades |
| `clients` | Clientes | Apenas estatísticas de clientes |
| `inspections` | Vistorias | Apenas estatísticas de vistorias |
| `appointments` | Agendamentos | Apenas estatísticas de agendamentos |
| `commissions` | Comissões | Apenas estatísticas de comissões |
| `tasks` | Tarefas | Apenas estatísticas de tarefas |
| `matches` | Matches | Apenas estatísticas de matches |

**Nota Importante:** Quando uma métrica específica é selecionada, o backend otimiza a consulta retornando apenas os dados relevantes. Isso pode melhorar a performance em dashboards focados.

#### 4. Limites de Resultados

Controla quantos itens são retornados nas listas de atividades e agendamentos.

| Campo | Tipo | Padrão | Mínimo | Máximo | Descrição |
|-------|------|--------|--------|--------|-----------|
| `activitiesLimit` | number | 10 | 1 | 100 | Limite de atividades recentes |
| `appointmentsLimit` | number | 5 | 1 | 50 | Limite de próximos agendamentos |

**Exemplo:**
```typescript
{
  activitiesLimit: 20,  // Retorna 20 atividades recentes
  appointmentsLimit: 10  // Retorna 10 próximos agendamentos
}
```

### Interface Completa de Filtros

```typescript
interface UserDashboardFilters {
  dateRange?: 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';
  compareWith?: 'previous_period' | 'previous_year' | 'none';
  metric?: 'all' | 'properties' | 'clients' | 'inspections' | 'appointments' | 'commissions' | 'tasks' | 'matches';
  startDate?: string;              // YYYY-MM-DD (obrigatório quando dateRange = 'custom')
  endDate?: string;                // YYYY-MM-DD (obrigatório quando dateRange = 'custom')
  activitiesLimit?: number;        // Padrão: 10
  appointmentsLimit?: number;      // Padrão: 5
}
```

### Filtros Padrão

Quando o dashboard é carregado pela primeira vez, os filtros padrão são:

```typescript
{
  dateRange: 'custom',             // Período personalizado
  startDate: '2024-01-01',         // Primeiro dia do mês atual
  endDate: '2024-01-15',           // Hoje
  compareWith: 'none',             // Sem comparação
  metric: 'all',                   // Todas as métricas
  activitiesLimit: 10,             // 10 atividades
  appointmentsLimit: 5             // 5 agendamentos
}
```

### Comportamento do Componente

1. **Drawer Lateral**: O componente é exibido em um drawer (gaveta lateral) que abre/fecha
2. **Estado Local**: Mantém uma cópia local dos filtros enquanto o usuário edita
3. **Aplicar Filtros**: Ao clicar em "Aplicar Filtros", os filtros são aplicados e o drawer fecha
4. **Limpar Filtros**: Botão para resetar todos os filtros para os valores padrão
5. **Validação**: Valida que datas custom têm startDate e endDate preenchidos

### Exemplos de Uso

#### Exemplo 1: Dashboard do mês atual
```typescript
{
  dateRange: 'custom',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  compareWith: 'previous_period',  // Comparar com dezembro
  metric: 'all'
}
```

#### Exemplo 2: Últimos 30 dias com comparação anual
```typescript
{
  dateRange: '30d',
  compareWith: 'previous_year',    // Comparar com mesmo período do ano passado
  metric: 'commissions'            // Apenas comissões
}
```

#### Exemplo 3: Hoje apenas
```typescript
{
  dateRange: 'today',
  compareWith: 'none',
  metric: 'all',
  activitiesLimit: 20,             // Mais atividades hoje
  appointmentsLimit: 10            // Mais agendamentos
}
```

### Interface do Componente

```typescript
interface UserDashboardFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserDashboardFilters;
  onFilterChange: (filters: UserDashboardFilters) => void;
  onApply?: (filters: UserDashboardFilters) => void;
}
```

### Exemplo de Uso

```typescript
<UserDashboardFilters
  isOpen={showFilters}
  onClose={() => setShowFilters(false)}
  filters={filters}
  onFilterChange={(newFilters) => updateFilters(newFilters)}
  onApply={(newFilters) => {
    updateFilters(newFilters);
    setShowFilters(false);
  }}
/>
```

---

## 📱 Seções do Dashboard

### 1. Cabeçalho com Saudação

```typescript
<WelcomeSection>
  <WelcomeContent>
    <WelcomeTitle>
      {getGreeting()}, {userInfo?.name?.split(' ')[0] || 'Usuário'}! 👋
    </WelcomeTitle>
    <WelcomeSubtitle>
      Aqui está um resumo das suas atividades
    </WelcomeSubtitle>
  </WelcomeContent>
  <WelcomeDate>
    {new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}
  </WelcomeDate>
</WelcomeSection>
```

**Saudações dinâmicas:**
- `Bom dia` (0h - 12h)
- `Boa tarde` (12h - 18h)
- `Boa noite` (18h - 24h)

### 2. Card de Performance

Exibe performance mensal com:
- Valor total em R$ (formatado)
- Percentual de crescimento vs mês anterior
- Ranking (#X de Y usuários)
- Nível de gamificação
- Pontos totais
- Gráfico de barras com breakdown de pontos por categoria

**Categorias de pontos:**
- Vendas (verde)
- Clientes (azul)
- Agendamentos (laranja)
- Tarefas (roxo)
- Aluguéis (rosa)
- Outros (cinza)

### 3. Cards de Estatísticas

Cada card mostra:
- Ícone colorido
- Valor principal (grande)
- Label descritivo
- Badge com valor adicional
- Footer com informação complementar
- Tooltip informativo (hover)

**Cores dos cards:**
- Propriedades: `#3b82f6` (azul)
- Clientes: `#10b981` (verde)
- Vistorias: `#f59e0b` (laranja)
- Comissões: `#ec4899` (rosa)
- Tarefas: `#3b82f6` (azul)
- Agendamentos: `#f59e0b` (laranja)
- Matches: `#10b981` (verde)

### 4. Metas Mensais

Exibe progresso de metas com:
- Valor atual formatado
- Meta definida
- Barra de progresso visual
- Percentual atingido

### 5. Métricas de Conversão

Cards pequenos com:
- Ícone
- Valor percentual
- Label descritivo
- Tooltip explicativo

### 6. Atividades Recentes

Lista de atividades com:
- Ícone por tipo
- Título
- Descrição (formatada)
- Tempo relativo

**Tipos de atividades:**
- `property` → Ícone de casa
- `client` → Ícone de pessoas
- `inspection` → Ícone de tarefa
- `appointment` → Ícone de calendário

### 7. Próximos Agendamentos

Lista de agendamentos futuros com:
- Título
- Cliente
- Data formatada
- Hora
- Clique para navegar ao calendário

---

## 🔄 Estados do Dashboard

### Loading State

```typescript
if (loading) {
  return <LottieLoading asOverlay={false} />;
}
```

### Error State

```typescript
if (error) {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Erro ao carregar dashboard</ErrorTitle>
      <ErrorMessage>{error}</ErrorMessage>
      <RetryButton onClick={refresh}>
        Tentar Novamente
      </RetryButton>
    </ErrorContainer>
  );
}
```

### Empty State

```typescript
if (!dashboardData?.data) {
  return (
    <EmptyContainer>
      <EmptyIcon>📊</EmptyIcon>
      <EmptyTitle>Nenhum dado disponível</EmptyTitle>
      <EmptyMessage>Não foi possível carregar os dados do dashboard.</EmptyMessage>
      <RetryButton onClick={refresh}>
        Recarregar
      </RetryButton>
    </EmptyContainer>
  );
}
```

---

## 🛠️ Serviço: dashboardApi

**Arquivo**: `src/services/dashboardApi.ts`

### Método: getUserDashboardData

```typescript
async getUserDashboardData(filters?: UserDashboardFilters): Promise<UserDashboardResponse>
```

Constrói query string com parâmetros e faz requisição GET para `/dashboard/user`.

**Tratamento de Erros:**
- Respostas HTTP de erro são convertidas em Error com mensagem
- Erros de conexão são tratados separadamente
- Erros inesperados têm mensagem genérica

---

## 📐 Estilos

**Arquivo**: `src/styles/pages/UserDashboardPageStyles.ts`

O dashboard usa styled-components com tema suportado (light/dark mode).

### Componentes Estilizados Principais

- `Container`: Container principal com padding
- `WelcomeSection`: Seção de boas-vindas
- `PerformanceCard`: Card destacado de performance
- `StatCard`: Card de estatística individual
- `AchievementCard`: Card de conquista
- `GoalCard`: Card de meta
- `MetricCard`: Card pequeno de métrica
- `ActivityItem`: Item de atividade recente
- E muitos outros...

### Tema

Usa `props.theme.colors` para cores dinâmicas baseadas no modo (light/dark).

---

## 🎯 Funcionalidades Especiais

### Formatação de Valores

**Moeda (R$):**
```typescript
R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
```

**Percentual:**
```typescript
{value.toFixed(2)}%
```

**Data:**
```typescript
new Date().toLocaleDateString('pt-BR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})
```

### Formatação de Descrições

Valores monetários em descrições são formatados:
```typescript
const formatActivityDescription = (description: string): string => {
  if (description.includes('R$')) {
    return description.replace(/R\$\s*(\d+)/g, (_, number) => {
      return `R$ ${parseInt(number).toLocaleString('pt-BR')}`;
    });
  }
  return description;
};
```

### Indicadores Visuais

**Crescimento:**
- Positivo: Ícone de seta para cima (verde)
- Negativo: Ícone de seta para baixo (vermelho)

**Badges:**
- Contadores em badges coloridos
- Destaque visual para valores importantes

**Progresso:**
- Barras de progresso com porcentagem
- Cores baseadas em performance (verde = bom, amarelo = médio, vermelho = ruim)

---

## 🔐 Permissões Necessárias

O dashboard verifica as seguintes permissões:

| Seção | Permissão Necessária |
|-------|---------------------|
| Performance Card | `commission:view` |
| Card de Propriedades | `property:view` |
| Card de Clientes | `client:view` |
| Card de Vistorias | `inspection:view` |
| Card de Comissões | `commission:view` |

Se o usuário não tiver a permissão, a seção não é exibida.

---

## 📊 Exemplo de Dados Completos

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "João Silva",
      "email": "joao@imobiliaria.com",
      "role": "user",
      "avatar": "https://api.example.com/avatars/joao.jpg"
    },
    "stats": {
      "myProperties": 12,
      "myClients": 28,
      "myInspections": 5,
      "myAppointments": 8,
      "myCommissions": 15420.50,
      "myTasks": 6,
      "myKeys": 3,
      "myNotes": 14,
      "myMatches": 4
    },
    "performance": {
      "thisMonth": 15420.50,
      "lastMonth": 13750.00,
      "growthPercentage": 12.15,
      "ranking": 3,
      "totalUsers": 12,
      "points": 1250
    },
    "gamification": {
      "currentPoints": 1250,
      "level": 5,
      "achievements": [
        {
          "id": "ach-1",
          "achievementId": "top-3",
          "name": "Top 3 Vendedor",
          "description": "Ficou entre os 3 primeiros do ranking",
          "icon": "🏆",
          "earnedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "pointsBreakdown": {
        "sales": 800,
        "rentals": 200,
        "clients": 150,
        "appointments": 50,
        "tasks": 30,
        "other": 20
      }
    },
    "activityStats": {
      "totalVisits": 34,
      "appointmentsThisMonth": 12,
      "completionRate": 85
    },
    "recentActivities": [
      {
        "id": "act-1",
        "type": "property",
        "title": "Propriedade cadastrada",
        "description": "Casa 3 quartos - R$ 350000",
        "time": "2 horas atrás",
        "status": "success",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "upcomingAppointments": [
      {
        "id": "apt-1",
        "title": "Visita - Casa Centro",
        "date": "2024-01-16",
        "time": "14:00",
        "client": "Maria Santos",
        "type": "visit"
      }
    ],
    "monthlyGoals": {
      "sales": {
        "current": 850000,
        "target": 1200000,
        "percentage": 71
      },
      "commissions": {
        "current": 15420.50,
        "target": 20000,
        "percentage": 77
      }
    },
    "conversionMetrics": {
      "visitsToSales": 28,
      "clientsToClosed": 65,
      "matchesAccepted": 75
    }
  },
  "lastUpdated": "2024-01-15T12:00:00Z"
}
```

---

## 🚀 Boas Práticas

### ✅ Faça:

1. **Use o hook `useUserDashboard`** para gerenciar estado
2. **Respeite permissões** - verifique antes de exibir seções
3. **Trate estados de loading/error/empty** adequadamente
4. **Formate valores** corretamente (moeda, datas, percentuais)
5. **Use tooltips** para explicar métricas complexas
6. **Implemente refresh** manual quando necessário
7. **Valide filtros** antes de enviar para API

### ❌ Evite:

1. **Acessar dados diretamente da API** sem usar o hook
2. **Ignorar estados de loading/error**
3. **Exibir seções sem verificar permissões**
4. **Hardcode valores** - sempre use dados da API
5. **Fazer múltiplas requisições** - use o hook que já gerencia isso
6. **Esquecer de limpar filtros** quando necessário

---

## 🐛 Troubleshooting

### Problema: Dashboard não carrega

**Soluções:**
1. Verificar autenticação (token válido)
2. Verificar permissões do usuário
3. Verificar console para erros de API
4. Verificar se o endpoint está acessível

### Problema: Filtros não funcionam

**Soluções:**
1. Verificar se os filtros estão sendo passados corretamente
2. Verificar formato de datas (YYYY-MM-DD)
3. Verificar se a API está processando os parâmetros
4. Verificar console para erros

### Problema: Seções não aparecem

**Soluções:**
1. Verificar permissões do usuário
2. Verificar se os dados estão vindo da API
3. Verificar condições de renderização no código
4. Verificar se `canAccess()` está funcionando

---

## 📚 Referências

- **Página**: `src/pages/UserDashboardPage.tsx`
- **Hook**: `src/hooks/useUserDashboard.ts`
- **Componente de Filtros**: `src/components/dashboard/UserDashboardFilters.tsx`
- **Serviço API**: `src/services/dashboardApi.ts`
- **Estilos**: `src/styles/pages/UserDashboardPageStyles.ts`
- **Documentação da API**: `docs/USER_DASHBOARD_API.md`

---

## 🔄 Fluxo de Dados

```
1. Componente UserDashboardPage monta
   ↓
2. Hook useUserDashboard é inicializado
   ↓
3. Hook busca dados iniciais com filtros padrão
   ↓
4. API /dashboard/user é chamada com parâmetros
   ↓
5. Dados são retornados e armazenados no estado
   ↓
6. Componente renderiza com dados
   ↓
7. Usuário interage (aplica filtros, clica em cards)
   ↓
8. Filtros são atualizados via updateFilters
   ↓
9. Nova requisição é feita com novos filtros
   ↓
10. Dashboard é atualizado com novos dados
```

---

**Versão da Documentação**: 1.0.0  
**Data de Criação**: 2024-01-20  
**Última Atualização**: 2024-01-20



