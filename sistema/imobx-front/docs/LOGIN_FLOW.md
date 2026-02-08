# 🔐 Fluxo Completo de Login - Documentação

Esta documentação descreve o fluxo completo de login para usuário comum, desde a tela de login até o carregamento do dashboard, incluindo todas as etapas intermediárias: 2FA, verificação de assinatura, seleção de empresa, carregamento de permissões, verificação de módulos e finalmente a chamada da API de dashboard.

---

## 📋 Visão Geral

O fluxo de login é um processo sequencial complexo que envolve múltiplas etapas de verificação e inicialização. Cada etapa é crítica e deve ser concluída antes de prosseguir para a próxima.

### Etapas do Fluxo

1. **Login Inicial** - Autenticação com email/senha
2. **Verificação 2FA** - Se necessário, validação de código TOTP
3. **Verificação de Assinatura** - Para owners, verificar status da assinatura
4. **Carregamento de Companies** - Buscar empresas do usuário
5. **Seleção de Company** - Definir Company ID no localStorage
6. **Carregamento de Permissões** - Buscar permissões do usuário (my-permissions)
7. **Verificação de Módulos** - Validar módulos disponíveis da empresa
8. **Redirecionamento Inteligente** - Decidir para onde redirecionar
9. **Carregamento do Dashboard** - Chamar API de dashboard

---

## 🔄 Fluxo Detalhado

### 1. Login Inicial

**Arquivo**: `src/hooks/useAuth.ts` - Função `login()`

**Processo:**

```typescript
// 1.1. Salvar credenciais temporariamente
setPendingLogin({
  email: data.email,
  password: data.password,
  remember: !!data.rememberMe,
});

// 1.2. Verificar se empresa requer 2FA
const check = await checkTwoFactorStatusCached(data.email);
const requires2FA = !!(check?.requires2FA && check?.emailExists);
const hasTwoFactorConfigured = !!check?.hasTwoFactorConfigured;
```

**Decisões:**

- **Se requer 2FA E usuário configurou**: Abrir modal de 2FA
- **Se requer 2FA E usuário NÃO configurou**: Abrir modal de setup
- **Se NÃO requer 2FA**: Fazer login direto

**Endpoint**: `GET /auth/check-2fa?email={email}`

**Resposta:**
```typescript
{
  requires2FA: boolean;
  emailExists: boolean;
  hasTwoFactorConfigured: boolean;
}
```

---

### 2. Verificação 2FA (Se Necessário)

**Arquivo**: `src/hooks/useAuth.ts` - Função `mfa.verify()`

**Processo:**

```typescript
// 2.1. Se não tem tempToken, fazer login primeiro
if (!tempToken) {
  const loginResponse = await authApi.login(email, password);
  tempToken = loginResponse.tempToken;
}

// 2.2. Verificar código TOTP
const response = await authApi.verify2FA({
  tempToken: tempToken,
  code: code
});
```

**Endpoints:**

1. **POST** `/auth/login` (se não tem tempToken)
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
   **Resposta (2FA requerido):**
   ```json
   {
     "errorCode": "2FA_REQUIRED",
     "tempToken": "temporary_token_here",
     "expiresAt": "2024-01-20T12:00:00Z"
   }
   ```

2. **POST** `/auth/verify-2fa`
   ```json
   {
     "tempToken": "temporary_token_here",
     "code": "123456"
   }
   ```
   **Resposta:**
   ```json
   {
     "user": { /* dados do usuário */ },
     "token": "jwt_token_final",
     "refreshToken": "refresh_token_final"
   }
   ```

**Após sucesso 2FA:**
- Tokens são salvos via `authStorage.saveAuthData()`
- Fluxo continua para `handleAuthSuccess()`

---

### 3. handleAuthSuccess - Início do Fluxo Pós-Login

**Arquivo**: `src/hooks/useAuth.ts` - Função `handleAuthSuccess()`

**Processo:**

```typescript
// 3.1. Salvar dados de autenticação
authStorage.saveAuthData(response, rememberMe);

// 3.2. Verificar tipo de usuário
const isOwnerUser = user.owner === true;
const isMasterOrAdmin = user.role === 'master' || user.role === 'admin';
const shouldCheckSubscriptionFirst = isMasterOrAdmin && isOwnerUser;
```

**Decisão de Fluxo:**

- **Se é MASTER/ADMIN com owner=true**: Fluxo especial (verificar assinatura primeiro)
- **Se é usuário comum**: Fluxo normal (verificar companies primeiro)

---

### 4. Fluxo Especial: MASTER/ADMIN com owner=true

**Processo:**

#### 4.1. Verificar Assinatura Primeiro

```typescript
// ETAPA 1: Verificar assinatura
const accessInfo = await subscriptionService.checkSubscriptionAccess();
```

**Endpoint**: `GET /subscriptions/check-access`

**Resposta:**
```typescript
{
  hasAccess: boolean;
  status: 'active' | 'expired' | 'suspended' | 'none';
  reason?: string;
  canAccessFeatures: boolean;
  isExpired: boolean;
  isSuspended: boolean;
  subscription?: Subscription;
  daysUntilExpiry?: number;
}
```

**Decisões:**

- **Se `hasAccess === false` e `status === 'none'`**: Redirecionar para `/subscription-plans`
- **Se `hasAccess === false` e status diferente**: Redirecionar para `/subscription-management`
- **Se `hasAccess === true`**: Continuar para verificar empresas

#### 4.2. Verificar Companies

```typescript
// ETAPA 2: Verificar empresas (só se tem assinatura)
const companies = await companyApi.getCompanies();
```

**Endpoint**: `GET /companies`

**Resposta:**
```json
[
  {
    "id": "company-uuid",
    "name": "Nome da Empresa",
    "isMatrix": true,
    "availableModules": ["property", "client", ...]
  }
]
```

**Decisões:**

- **Se tem empresas**: Selecionar empresa preferida e redirecionar para `/dashboard`
- **Se não tem empresas**: Redirecionar para `/create-first-company`

**Seleção de Empresa Preferida:**
```typescript
const choosePreferredCompany = (companyList) => {
  // Prioridade 1: Empresa com isMatrix === true
  const matrixCompany = companyList.find(c => c.isMatrix === true);
  if (matrixCompany) return matrixCompany;
  
  // Prioridade 2: Primeira empresa da lista
  return companyList[0];
};
```

---

### 5. Fluxo Normal: Usuário Comum

**Processo:**

#### 5.1. Carregar Companies

```typescript
// ETAPA 1: Chamar API de companies PRIMEIRO
const companies = await companyApi.getCompanies();
```

**Endpoint**: `GET /companies`

**Tratamento de Erros:**

- **Erro 404**: Usuário não tem empresas → Limpar Company ID e seguir fluxo
- **Erro de bloqueio (Company ID não encontrado)**: Aguardar 2s e tentar novamente
- **Erro desconhecido**: Manter Company ID existente se houver

**Seleção de Company:**

```typescript
if (companies && companies.length > 0) {
  const preferredCompany = choosePreferredCompany(companies);
  const preferredCompanyId = preferredCompany?.id;
  
  if (preferredCompanyId) {
    localStorage.setItem('dream_keys_selected_company_id', preferredCompanyId);
  }
}
```

**Decisões:**

- **Se tem empresas E é master/admin**: Redirecionar para `/dashboard` imediatamente
- **Se tem empresas E é usuário comum**: Continuar para carregar permissões
- **Se não tem empresas**: Limpar Company ID e continuar para permissões

---

### 6. Carregamento de Permissões (my-permissions)

**Arquivo**: `src/services/initializationService.ts`

**Processo:**

```typescript
// ETAPA CRÍTICA: Aguardar carregamento das permissões
const { initializationService } = await import('../services/initializationService');
const initResult = await initializationService.initialize();
```

#### 6.1. Verificar Cache de Permissões

```typescript
// Verificar se há cache válido
const cached = permissionsCache.getCache();

if (cached && permissionsCache.isCacheValid()) {
  // Usar cache
  userPermissions = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    permissions: [],
    permissionNames: cached.permissions
  };
} else {
  // Carregar da API
  userPermissions = await permissionsApi.getMyPermissions();
  
  // Salvar no cache
  permissionsCache.setCache(
    userPermissions.permissionNames,
    user.role,
    companyId,
    user.id
  );
}
```

**Endpoint**: `GET /permissions/my-permissions`

**Headers:**
- `Authorization: Bearer <token>`
- `X-Company-ID: <company_id>` (opcional, mas recomendado)

**Resposta:**
```json
{
  "userId": "user-uuid",
  "userName": "Nome do Usuário",
  "userEmail": "user@example.com",
  "permissions": [
    {
      "id": "perm-uuid",
      "name": "property:view",
      "description": "Visualizar propriedades",
      "category": "property",
      "isActive": true
    }
  ],
  "permissionNames": [
    "property:view",
    "property:create",
    "client:view",
    ...
  ]
}
```

**Cache de Permissões:**

- **Chave**: `dream_keys_permissions_cache`
- **Validade**: Baseada em timestamp e Company ID
- **Estrutura**:
  ```typescript
  {
    permissions: string[];
    role: string;
    companyId: string;
    userId: string;
    timestamp: number;
  }
  ```

---

### 7. Verificação de Módulos

**Arquivo**: `src/contexts/CompanyContext.tsx`

**Processo:**

Após Company ID ser definido, o `CompanyContext` carrega os dados da empresa:

```typescript
// Carregar dados da empresa selecionada
const company = await companyApi.getCompanyById(companyId);

// Empresa contém availableModules
const availableModules = company.availableModules; // ["property", "client", ...]
```

**Módulos Disponíveis:**

Os módulos são verificados em tempo real quando:
- Usuário tenta acessar uma rota protegida
- Componente `ModuleRoute` verifica se módulo está disponível
- Hook `useModuleAccess` verifica acesso a módulos

**Mapeamento Permissão → Módulo:**

```typescript
// Exemplo: permissionModuleMapping.ts
if (permissionName.startsWith('property:')) {
  return MODULE_TYPES.PROPERTY_MANAGEMENT;
}
if (permissionName.startsWith('client:')) {
  return MODULE_TYPES.CLIENT_MANAGEMENT;
}
// ... etc
```

---

### 8. Redirecionamento Inteligente

**Arquivo**: `src/services/redirectService.ts`

**Processo:**

```typescript
// Analisar permissões do usuário
const permissionAnalysis = getPermissionAnalysis(userPermissions);

if (hasValidPermissions(userPermissions)) {
  // Usuário tem permissões válidas
  const suggestedPage = analyzeUserPermissions(userPermissions);
  navigate(suggestedPage);
} else {
  // Usuário sem permissões válidas
  navigate('/dashboard');
}
```

**Lógica de Análise:**

1. **Se é MASTER**: Redirecionar para página inicial preferida (`/dashboard` ou custom)
2. **Se tem permissões válidas**: Analisar permissões e sugerir melhor página
3. **Se não tem permissões**: Redirecionar para `/dashboard`

**Análise de Permissões:**

```typescript
// Exemplo de análise
if (hasPermission('property:view')) {
  return '/properties';
}
if (hasPermission('client:view')) {
  return '/clients';
}
// Fallback
return '/dashboard';
```

---

### 9. Carregamento do Dashboard

**Arquivo**: `src/pages/UserDashboardPage.tsx` e `src/hooks/useUserDashboard.ts`

**Processo:**

Após redirecionamento para `/dashboard`:

```typescript
// Hook carrega dados do dashboard
const { data, loading, error } = useUserDashboard();
```

#### 9.1. Hook useUserDashboard

```typescript
// Buscar dados com filtros padrão
const response = await dashboardApi.getUserDashboardData({
  dateRange: 'custom',
  startDate: firstDayOfMonth,
  endDate: today,
  compareWith: 'none',
  metric: 'all',
  activitiesLimit: 10,
  appointmentsLimit: 5
});
```

**Endpoint**: `GET /dashboard/user?dateRange=custom&startDate=2024-01-01&endDate=2024-01-31&...`

**Headers:**
- `Authorization: Bearer <token>`
- `X-Company-ID: <company_id>` (obrigatório)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": { /* dados do usuário */ },
    "stats": { /* estatísticas */ },
    "performance": { /* performance */ },
    "gamification": { /* gamificação */ },
    "recentActivities": [ /* atividades */ ],
    "upcomingAppointments": [ /* agendamentos */ ],
    "monthlyGoals": { /* metas */ },
    "conversionMetrics": { /* métricas */ }
  },
  "lastUpdated": "2024-01-20T12:00:00Z"
}
```

---

## 🔄 Componentes do Fluxo

### AuthInitializer

**Arquivo**: `src/components/AuthInitializer.tsx`

**Função**: Verificar autenticação na inicialização da aplicação

**Processo:**

```typescript
// Verificar se está autenticado
const isAuthenticated = authStorage.isAuthenticated();
const hasToken = !!authStorage.getToken();
const hasRefreshToken = !!authStorage.getRefreshToken();

// Se tem tokens e está em /login ou /register, redirecionar
if ((hasToken && hasRefreshToken) && (currentPath === '/login' || currentPath === '/register')) {
  navigate('/dashboard', { replace: true });
}
```

**Quando executa:**
- Ao carregar a aplicação
- Ao mudar de rota
- Ao detectar mudanças no localStorage (outras abas)

---

### InitializationFlow

**Arquivo**: `src/components/InitializationFlow.tsx`

**Função**: Gerenciar fluxo de inicialização pós-login

**Processo:**

```typescript
const { isLoading, error } = useInitializationFlow();

// Mostrar loading durante inicialização
if (isLoading) {
  return <LottieLoading message="Carregando empresas..." />;
}
```

**Quando executa:**
- Após login bem-sucedido
- Ao acessar rotas protegidas
- Ao mudar de empresa

---

### useInitializationFlow

**Arquivo**: `src/hooks/useInitializationFlow.ts`

**Função**: Lógica de inicialização e verificação de assinatura

**Processo:**

```typescript
// Verificar se usuário é owner
if (!user || user.owner !== true) {
  // Usuário comum - verificar apenas Company ID
  if (!selectedCompanyId) {
    navigate('/create-first-company');
  } else {
    navigate('/dashboard');
  }
  return;
}

// Owner - verificar assinatura
const accessInfo = await subscriptionService.checkSubscriptionAccess();

if (!accessInfo.hasAccess) {
  if (accessInfo.status === 'none') {
    navigate('/subscription-plans');
  } else {
    navigate('/subscription-management');
  }
  return;
}

// Tem acesso - verificar empresa
if (!selectedCompanyId) {
  navigate('/create-first-company');
} else {
  navigate('/dashboard');
}
```

---

## 📊 Diagrama de Fluxo

```
┌─────────────────┐
│  Tela de Login  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verificar 2FA  │
│  (check-2fa)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌──────────┐
│ 2FA   │ │ Sem 2FA  │
│Modal  │ │ Login    │
└───┬───┘ │ Direto   │
    │     └────┬─────┘
    │          │
    ▼          │
┌──────────┐   │
│ verify-  │   │
│ 2fa      │   │
└────┬─────┘   │
     │         │
     └────┬────┘
          │
          ▼
┌─────────────────────┐
│ handleAuthSuccess   │
│ (Salvar tokens)     │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌──────────┐
│ Owner?  │  │ Usuário  │
│ MASTER/ │  │ Comum    │
│ ADMIN   │  │          │
└────┬────┘  └────┬─────┘
     │            │
     ▼            ▼
┌─────────────┐ ┌──────────────┐
│ Verificar   │ │ Carregar     │
│ Assinatura  │ │ Companies    │
│ (check-     │ │ (/companies) │
│ access)     │ └──────┬───────┘
└─────┬───────┘        │
      │                │
  ┌───┴───┐            │
  │       │            │
  ▼       ▼            ▼
┌─────┐ ┌──────────┐ ┌──────────────┐
│None │ │ Expired/ │ │ Selecionar   │
│→    │ │ Suspended│ │ Company ID   │
│Plans│ │→         │ │ (localStorage│
└─────┘ │Management│ └──────┬───────┘
        └─────┬─────┘        │
              │              │
              └──────┬───────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Carregar        │
            │ Permissões      │
            │ (my-permissions)│
            └────────┬────────┘
                     │
                ┌────┴────┐
                │         │
                ▼         ▼
        ┌───────────┐ ┌──────────┐
        │ Cache     │ │ API      │
        │ Válido?   │ │ Call     │
        └─────┬─────┘ └────┬─────┘
              │            │
              └─────┬──────┘
                    │
                    ▼
            ┌─────────────────┐
            │ Verificar       │
            │ Módulos         │
            │ (Company        │
            │  Modules)       │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Redirecionar     │
            │ Inteligente      │
            │ (analyzeUser     │
            │  Permissions)    │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Dashboard       │
            │ (/dashboard)    │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Carregar        │
            │ Dashboard Data  │
            │ (/dashboard/    │
            │  user)          │
            └─────────────────┘
```

---

## 🔑 Pontos Críticos

### 1. Ordem de Execução

**IMPORTANTE**: A ordem é crítica!

1. ✅ Login → 2FA (se necessário)
2. ✅ Salvar tokens
3. ✅ Verificar assinatura (se owner)
4. ✅ Carregar companies
5. ✅ Selecionar Company ID
6. ✅ Carregar permissões (my-permissions)
7. ✅ Verificar módulos
8. ✅ Redirecionar
9. ✅ Carregar dashboard

**NÃO** pular etapas ou inverter a ordem!

---

### 2. Company ID no localStorage

**Chave**: `dream_keys_selected_company_id`

**Quando é definido:**
- Após login bem-sucedido (se tem empresas)
- Ao selecionar empresa manualmente
- Ao criar primeira empresa

**Quando é removido:**
- Ao fazer logout
- Quando usuário não tem empresas (404)
- Ao trocar de empresa

**Uso:**
- Enviado em header `X-Company-ID` em todas as requisições (exceto rotas públicas)
- Usado para filtrar dados por empresa
- Usado para cache de permissões

---

### 3. Cache de Permissões

**Chave**: `dream_keys_permissions_cache`

**Estrutura:**
```typescript
{
  permissions: string[];
  role: string;
  companyId: string;
  userId: string;
  timestamp: number;
}
```

**Validade:**
- Cache é válido se:
  - Company ID não mudou
  - User ID não mudou
  - Timestamp não expirou (configurável, padrão: 5 minutos)

**Invalidar cache:**
- Ao fazer logout
- Ao trocar de empresa
- Ao atualizar permissões manualmente

---

### 4. Interceptor de API

**Arquivo**: `src/services/api.ts`

**Função**: Adicionar headers automaticamente

**Processo:**

```typescript
// Adicionar Authorization
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// Adicionar X-Company-ID (exceto rotas públicas)
if (!isAuthRoute && !isPublicRoute) {
  const companyId = localStorage.getItem('dream_keys_selected_company_id');
  if (companyId) {
    config.headers['X-Company-ID'] = companyId;
  } else {
    // Bloquear requisição se não tem Company ID
    return Promise.reject(new Error('Company ID não encontrado'));
  }
}
```

**Rotas que NÃO exigem Company ID:**
- `/auth/*` (login, register, refresh, etc)
- `/public/*`
- `/permissions/my-permissions` (opcional)
- `/companies` (usado para OBTER Company ID)
- `/subscriptions/*` (algumas rotas)

---

## 🚨 Tratamento de Erros

### Erro no Login

```typescript
// 401 - Credenciais inválidas
if (error.response?.status === 401) {
  errorMessage = 'Email ou senha incorretos.';
}

// 2FA_REQUIRED - Requer 2FA
if (error.response?.data?.errorCode === '2FA_REQUIRED') {
  setMfaRequired(true);
  setTempToken(error.response.data.tempToken);
}
```

### Erro ao Carregar Companies

```typescript
// 404 - Não tem empresas
if (error.response?.status === 404) {
  localStorage.removeItem('dream_keys_selected_company_id');
  navigate('/create-first-company');
}

// Erro de bloqueio - Aguardar e retry
if (error.message.includes('Company ID não encontrado')) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  // Retry
}
```

### Erro ao Carregar Permissões

```typescript
// Se falhar, redirecionar para system-unavailable
if (!initResult.isInitialized) {
  navigate('/system-unavailable');
}
```

### Erro no Dashboard

```typescript
// Mostrar erro e botão de retry
if (error) {
  return (
    <ErrorContainer>
      <ErrorMessage>{error}</ErrorMessage>
      <RetryButton onClick={refresh}>Tentar Novamente</RetryButton>
    </ErrorContainer>
  );
}
```

---

## 📝 Exemplos de Código

### Exemplo 1: Login Completo

```typescript
const { login } = useAuth();

await login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
});

// Fluxo automático:
// 1. Verifica 2FA
// 2. Se necessário, abre modal
// 3. Após sucesso, carrega companies
// 4. Seleciona company
// 5. Carrega permissões
// 6. Redireciona para dashboard
```

### Exemplo 2: Verificar Permissões

```typescript
const { initializationService } = await import('./services/initializationService');

// Aguardar inicialização
await initializationService.waitForInitialization();

// Obter permissões
const permissions = initializationService.getUserPermissions();
const hasPermission = permissions.permissionNames.includes('property:view');
```

### Exemplo 3: Verificar Company ID

```typescript
const companyId = localStorage.getItem('dream_keys_selected_company_id');

if (!companyId) {
  // Redirecionar para criar empresa ou selecionar
  navigate('/create-first-company');
}
```

---

## 🔍 Debugging

### Logs Importantes

O sistema possui logs detalhados em cada etapa:

```typescript
// Login
console.log('🔍 [useAuth] Verificando tipo de usuário:', { role, owner });

// Companies
console.log('🏢 [useAuth] Companies carregadas:', companies?.length);

// Permissões
console.log('🔐 [initializationService] Carregando permissões...');

// Dashboard
console.log('📊 [useUserDashboard] Buscando dados do dashboard...');
```

### Verificar Estado

```typescript
// Verificar tokens
const token = authStorage.getToken();
const refreshToken = authStorage.getRefreshToken();

// Verificar Company ID
const companyId = localStorage.getItem('dream_keys_selected_company_id');

// Verificar permissões
const cached = permissionsCache.getCache();
const permissions = cached?.permissions || [];
```

---

## 🚀 Boas Práticas

### ✅ Faça:

1. **Sempre aguardar inicialização** antes de fazer requisições que dependem de Company ID
2. **Verificar cache de permissões** antes de chamar API
3. **Tratar erros adequadamente** em cada etapa
4. **Usar retry** para APIs críticas (companies)
5. **Validar Company ID** antes de fazer requisições
6. **Limpar cache** ao fazer logout ou trocar empresa

### ❌ Evite:

1. **Fazer requisições antes de ter Company ID**
2. **Ignorar erros de inicialização**
3. **Fazer múltiplas chamadas** de my-permissions simultaneamente
4. **Assumir que Company ID existe** sem verificar
5. **Pular etapas do fluxo**
6. **Fazer requisições sem token válido**

---

## 📚 Referências

- **Login**: `src/hooks/useAuth.ts`
- **2FA**: `src/hooks/useAuth.ts` - Função `mfa.verify()`
- **Companies**: `src/services/companyApi.ts`
- **Permissões**: `src/services/permissionsApi.ts` e `src/services/initializationService.ts`
- **Módulos**: `src/contexts/CompanyContext.tsx` e `src/utils/moduleMapping.ts`
- **Dashboard**: `src/hooks/useUserDashboard.ts` e `src/services/dashboardApi.ts`
- **Inicialização**: `src/hooks/useInitializationFlow.ts` e `src/components/InitializationFlow.tsx`

---

**Versão da Documentação**: 1.0.0  
**Data de Criação**: 2024-01-20  
**Última Atualização**: 2024-01-20






















