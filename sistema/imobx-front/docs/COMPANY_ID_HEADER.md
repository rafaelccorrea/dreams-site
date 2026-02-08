# 🏢 Company ID no Header - Documentação

Esta documentação descreve como o **Company ID** é enviado automaticamente no header `X-Company-ID` de todas as requisições HTTP, quando é obrigatório, quando é opcional, e como funciona o sistema de interceptação.

---

## 📋 Visão Geral

O sistema utiliza um **interceptor Axios** que adiciona automaticamente o header `X-Company-ID` em todas as requisições HTTP que precisam dele. O Company ID é obtido do `localStorage` e adicionado automaticamente, sem necessidade de configuração manual em cada chamada de API.

### Header

```
X-Company-ID: <company-uuid>
```

**Exemplo:**
```
X-Company-ID: 123e4567-e89b-12d3-a456-426614174000
```

---

## 🔧 Implementação

### Interceptor Axios

**Arquivo**: `src/services/api.ts`

O interceptor é configurado automaticamente e executa antes de cada requisição HTTP:

```typescript
api.interceptors.request.use(
  async config => {
    // ... código de refresh token ...
    
    // Adicionar empresa selecionada no header se disponível
    const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
    
    if (selectedCompanyId) {
      config.headers['X-Company-ID'] = selectedCompanyId;
    }
    
    return config;
  }
);
```

### Como Funciona

1. **Antes de cada requisição**, o interceptor é executado
2. **Lê o Company ID** do `localStorage` usando a chave `dream_keys_selected_company_id`
3. **Adiciona o header** `X-Company-ID` automaticamente
4. **Envia a requisição** com o header incluído

**Não é necessário** adicionar o header manualmente em nenhuma chamada de API!

---

## ✅ Quando o Company ID é Obrigatório

O Company ID é **obrigatório** e enviado automaticamente para a maioria das rotas protegidas. Se não estiver disponível, a requisição será **bloqueada** e o usuário será redirecionado.

### Rotas que Exigem Company ID

Todas as rotas **exceto** as listadas na seção "Rotas que NÃO Exigem Company ID" abaixo.

**Exemplos:**
- ✅ `/properties` - Listar propriedades
- ✅ `/clients` - Listar clientes
- ✅ `/dashboard/user` - Dashboard do usuário
- ✅ `/kanban` - Tarefas
- ✅ `/financial` - Financeiro
- ✅ `/inspection` - Vistorias
- ✅ `/calendar` - Calendário
- ✅ `/matches` - Matches
- ✅ E todas as outras rotas de negócio

### Comportamento quando Company ID não está disponível

```typescript
if (!selectedCompanyId) {
  // Para rotas de dashboard, aguardar até 500ms (pode estar carregando)
  if (isDashboardRoute && token && user) {
    // Aguardar carregamento...
    await waitForCompanyId(maxWait: 500ms);
    
    if (companyIdFound) {
      config.headers['X-Company-ID'] = companyId;
    } else {
      // Bloquear e redirecionar
      return Promise.reject(new Error('Company ID não encontrado'));
    }
  } else {
    // Bloquear imediatamente
    console.error('❌ BLOQUEADO: Tentativa de acessar rota protegida sem Company ID');
    
    // Redirecionar baseado no role
    if (userRole === 'admin' || userRole === 'master') {
      window.location.href = '/create-first-company';
    } else {
      window.location.href = '/dashboard';
    }
    
    return Promise.reject(new Error('Company ID não encontrado. Requisição bloqueada.'));
  }
}
```

---

## ⚠️ Rotas que NÃO Exigem Company ID

Estas rotas são **exceções** e o Company ID é **opcional** ou **não deve ser enviado**:

### 1. Rotas de Autenticação (`/auth/*`)

**Motivo**: Essas rotas são executadas antes do usuário ter uma empresa selecionada.

**Exemplos:**
- `/auth/login`
- `/auth/register`
- `/auth/refresh`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-2fa`
- `/auth/profile` (pode ser chamado antes de ter empresa)

**Código:**
```typescript
const isAuthRoute = config.url?.includes('/auth/');

if (isAuthRoute) {
  // NÃO adicionar X-Company-ID
  return config;
}
```

---

### 2. Rotas Públicas (`/public/*`)

**Motivo**: Conteúdo público não requer empresa.

**Exemplos:**
- `/public/properties`
- `/public/plans`

**Código:**
```typescript
const isPublicRoute = config.url?.includes('/public/');

if (isPublicRoute) {
  // NÃO adicionar X-Company-ID
  return config;
}
```

---

### 3. Listar Companies (`/companies`)

**Motivo**: Esta rota é usada para **OBTER** o Company ID, então não pode exigir um.

**Exemplo:**
- `GET /companies`

**Código:**
```typescript
const isCompaniesListRoute = config.url === '/companies' || config.url?.endsWith('/companies');

if (isCompaniesListRoute) {
  // Company ID é opcional aqui
  const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
  if (selectedCompanyId) {
    config.headers['X-Company-ID'] = selectedCompanyId; // Opcional
  }
  // NÃO bloquear se não tiver
}
```

---

### 4. My Permissions (`/permissions/my-permissions`)

**Motivo**: Pode ser chamado antes de ter Company ID definido (durante login).

**Exemplo:**
- `GET /permissions/my-permissions`

**Código:**
```typescript
const isMyPermissionsRoute = config.url?.includes('/permissions/my-permissions');

if (isMyPermissionsRoute) {
  // Company ID é opcional
  const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
  if (selectedCompanyId) {
    config.headers['X-Company-ID'] = selectedCompanyId; // Opcional
  }
  // NÃO bloquear se não tiver
}
```

---

### 5. Rotas de Assinatura (`/subscriptions/*`, `/plans`)

**Motivo**: Verificação de assinatura pode ser feita antes de ter empresa.

**Exemplos:**
- `/subscriptions/check-access`
- `/subscriptions/my-usage`
- `/plans`

**Código:**
```typescript
const isSubscriptionRoute = config.url?.includes('/subscriptions/') || config.url?.includes('/plans');

if (isSubscriptionRoute) {
  // Company ID é opcional
  const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
  if (selectedCompanyId) {
    config.headers['X-Company-ID'] = selectedCompanyId; // Opcional
  }
  // NÃO bloquear se não tiver
}
```

---

### 6. Rotas de Notificações (`/notifications`)

**Motivo**: Notificações podem ser pessoais (sem empresa).

**Exemplo:**
- `GET /notifications`

**Código:**
```typescript
const isNotificationsRoute = config.url?.includes('/notifications');

if (isNotificationsRoute) {
  // Company ID é opcional
  const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
  if (selectedCompanyId) {
    config.headers['X-Company-ID'] = selectedCompanyId; // Opcional
  }
  // NÃO bloquear se não tiver
}
```

---

### 7. Rotas de Teams (`/teams`)

**Motivo**: Pode ser acessado antes de ter Company ID definido.

**Exemplo:**
- `GET /teams`

**Código:**
```typescript
const isTeamsRoute = config.url?.includes('/teams');

if (isTeamsRoute) {
  // Company ID é opcional
  const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
  if (selectedCompanyId) {
    config.headers['X-Company-ID'] = selectedCompanyId; // Opcional
  }
  // NÃO bloquear se não tiver
}
```

---

## 📝 Resumo das Regras

| Tipo de Rota | Company ID | Comportamento |
|--------------|------------|---------------|
| **Rotas de Negócio** (properties, clients, dashboard, etc) | ✅ **Obrigatório** | Bloqueia se não tiver |
| **Rotas de Autenticação** (`/auth/*`) | ❌ **Não enviar** | Ignora Company ID |
| **Rotas Públicas** (`/public/*`) | ❌ **Não enviar** | Ignora Company ID |
| **`/companies`** | ⚠️ **Opcional** | Envia se tiver, não bloqueia |
| **`/permissions/my-permissions`** | ⚠️ **Opcional** | Envia se tiver, não bloqueia |
| **`/subscriptions/*`** | ⚠️ **Opcional** | Envia se tiver, não bloqueia |
| **`/notifications`** | ⚠️ **Opcional** | Envia se tiver, não bloqueia |
| **`/teams`** | ⚠️ **Opcional** | Envia se tiver, não bloqueia |

---

## 🔍 Armazenamento do Company ID

### LocalStorage

**Chave**: `dream_keys_selected_company_id`

**Formato**: UUID (string)

**Exemplo:**
```typescript
localStorage.setItem('dream_keys_selected_company_id', '123e4567-e89b-12d3-a456-426614174000');
```

### Quando é Definido

1. **Após login bem-sucedido** (se usuário tem empresas)
2. **Ao selecionar empresa manualmente** (seleção de empresa)
3. **Ao criar primeira empresa** (create-first-company)

### Quando é Removido

1. **Ao fazer logout**
2. **Quando usuário não tem empresas** (404 na API de companies)
3. **Ao trocar de empresa** (substituído por novo ID)

---

## 💻 Exemplos de Uso

### Exemplo 1: Requisição Normal (Company ID Automático)

```typescript
import { api } from '../services/api';

// O header X-Company-ID é adicionado AUTOMATICAMENTE
const response = await api.get('/properties');
// Header enviado: X-Company-ID: <company-id-do-localStorage>
```

**Não é necessário** fazer nada manualmente!

---

### Exemplo 2: Verificar se Company ID está disponível

```typescript
const companyId = localStorage.getItem('dream_keys_selected_company_id');

if (!companyId) {
  console.warn('Company ID não está disponível');
  // Redirecionar ou aguardar carregamento
}
```

---

### Exemplo 3: Definir Company ID Manualmente

```typescript
// Ao selecionar uma empresa
const selectCompany = (companyId: string) => {
  localStorage.setItem('dream_keys_selected_company_id', companyId);
  
  // Próximas requisições já terão o novo Company ID automaticamente
  // Não é necessário fazer nada mais!
};
```

---

### Exemplo 4: Requisição Específica (Forçar Company ID)

**Nota**: Normalmente não é necessário, mas se precisar:

```typescript
import { api } from '../services/api';

// Se precisar forçar um Company ID específico (raro)
const response = await api.get('/properties', {
  headers: {
    'X-Company-ID': 'specific-company-id'
  }
});

// ⚠️ ATENÇÃO: O interceptor ainda adicionará o Company ID do localStorage
// Se quiser usar um diferente, defina no localStorage primeiro:
localStorage.setItem('dream_keys_selected_company_id', 'specific-company-id');
const response = await api.get('/properties');
```

---

## 🚨 Tratamento de Erros

### Erro: Company ID não encontrado

**Quando acontece:**
- Requisição para rota protegida sem Company ID no localStorage
- Company ID foi removido durante a sessão

**Comportamento:**
```typescript
// 1. Para rotas de dashboard, aguarda até 500ms
if (isDashboardRoute) {
  await waitForCompanyId(500ms);
}

// 2. Se ainda não encontrou, bloqueia requisição
if (!companyId) {
  // Redireciona baseado no role
  if (userRole === 'admin' || userRole === 'master') {
    window.location.href = '/create-first-company';
  } else {
    window.location.href = '/dashboard';
  }
  
  return Promise.reject(new Error('Company ID não encontrado'));
}
```

---

### Erro: Company ID inválido

**Quando acontece:**
- Backend retorna erro 400/403 relacionado a Company ID
- Company ID não existe mais ou usuário não tem acesso

**Tratamento:**
```typescript
// No interceptor de response
if (error.response?.status === 400 || error.response?.status === 403) {
  const errorMessage = error.response.data?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('company') || errorMessage.includes('empresa')) {
    // Limpar Company ID inválido
    localStorage.removeItem('dream_keys_selected_company_id');
    
    // Redirecionar para seleção de empresa
    window.location.href = '/create-first-company';
  }
}
```

---

## 🔄 Fluxo Completo

```
1. Usuário faz login
   ↓
2. Sistema carrega companies via GET /companies
   ↓
3. Seleciona empresa preferida (ou primeira)
   ↓
4. Salva Company ID no localStorage
   localStorage.setItem('dream_keys_selected_company_id', companyId)
   ↓
5. Próximas requisições HTTP
   ↓
6. Interceptor Axios executa ANTES da requisição
   ↓
7. Lê Company ID do localStorage
   ↓
8. Adiciona header X-Company-ID automaticamente
   ↓
9. Envia requisição com header
   ↓
10. Backend recebe e processa com Company ID
```

---

## 🎯 Boas Práticas

### ✅ Faça:

1. **Confie no interceptor** - Não adicione header manualmente
2. **Verifique Company ID** antes de fazer requisições críticas
3. **Aguarde inicialização** se Company ID pode estar carregando
4. **Limpe Company ID** ao fazer logout ou trocar empresa
5. **Use localStorage** para persistir Company ID entre sessões

### ❌ Evite:

1. **Adicionar header manualmente** - O interceptor já faz isso
2. **Assumir que Company ID existe** - Sempre verifique se necessário
3. **Fazer requisições antes de ter Company ID** - Aguarde inicialização
4. **Hardcode Company ID** - Sempre use do localStorage
5. **Ignorar erros de Company ID** - Trate adequadamente

---

## 🔍 Debugging

### Verificar se Header está sendo enviado

**Opção 1: Console do Navegador**
```typescript
// No DevTools > Network
// Filtrar requisições e verificar Headers
// Procurar por "X-Company-ID"
```

**Opção 2: Log no Código**
```typescript
// No interceptor (já existe, mas comentado)
console.log('🏢 Enviando Company ID no header:', selectedCompanyId, 'para URL:', config.url);
```

**Opção 3: Verificar localStorage**
```typescript
const companyId = localStorage.getItem('dream_keys_selected_company_id');
console.log('Company ID no localStorage:', companyId);
```

---

### Verificar se Company ID está correto

```typescript
// Verificar valor atual
const currentCompanyId = localStorage.getItem('dream_keys_selected_company_id');
console.log('Company ID atual:', currentCompanyId);

// Verificar se existe
if (!currentCompanyId) {
  console.warn('⚠️ Company ID não está definido!');
}

// Verificar formato (deve ser UUID)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (currentCompanyId && !uuidRegex.test(currentCompanyId)) {
  console.error('❌ Company ID tem formato inválido!');
}
```

---

## 📚 Código de Referência

### Interceptor Completo

**Arquivo**: `src/services/api.ts` (linhas 83-229)

```typescript
// Adicionar empresa selecionada no header se disponível
const isAuthRoute = config.url?.includes('/auth/');
const isPublicRoute = config.url?.includes('/public/');
const isMyPermissionsRoute = config.url?.includes('/permissions/my-permissions');
const isCompaniesListRoute = config.url === '/companies' || config.url?.endsWith('/companies');
const isSubscriptionRoute = config.url?.includes('/subscriptions/') || config.url?.includes('/plans');
const isNotificationsRoute = config.url?.includes('/notifications');
const isTeamsRoute = config.url?.includes('/teams');

if (!isAuthRoute && !isPublicRoute && !isMyPermissionsRoute && 
    !isCompaniesListRoute && !isSubscriptionRoute && 
    !isNotificationsRoute && !isTeamsRoute) {
  
  const selectedCompanyId = localStorage.getItem('dream_keys_selected_company_id');
  
  if (selectedCompanyId) {
    config.headers['X-Company-ID'] = selectedCompanyId;
  } else {
    // Bloquear requisição se não tem Company ID
    // (com tratamento especial para dashboard)
    return Promise.reject(new Error('Company ID não encontrado'));
  }
}
```

---

## 🧪 Testes

### Teste Manual

```typescript
// 1. Definir Company ID
localStorage.setItem('dream_keys_selected_company_id', 'test-company-id');

// 2. Fazer requisição
const response = await api.get('/properties');

// 3. Verificar no Network tab do DevTools
// Header deve conter: X-Company-ID: test-company-id
```

### Teste Automatizado

```typescript
import { api } from '../services/api';

describe('Company ID Header', () => {
  beforeEach(() => {
    localStorage.setItem('dream_keys_selected_company_id', 'test-company-id');
  });
  
  it('deve adicionar X-Company-ID automaticamente', async () => {
    const response = await api.get('/properties');
    
    // Verificar que header foi adicionado
    expect(response.config.headers['X-Company-ID']).toBe('test-company-id');
  });
  
  it('não deve adicionar em rotas de auth', async () => {
    const response = await api.post('/auth/login', { email: 'test', password: 'test' });
    
    // Verificar que header NÃO foi adicionado
    expect(response.config.headers['X-Company-ID']).toBeUndefined();
  });
});
```

---

## 🔗 Relacionado

- **Fluxo de Login**: `docs/LOGIN_FLOW.md` - Como Company ID é definido após login
- **Dashboard**: `docs/USER_DASHBOARD.md` - Como dashboard usa Company ID
- **API Service**: `src/services/api.ts` - Implementação do interceptor

---

## 📝 Checklist para Desenvolvedores

Ao criar novas rotas ou serviços:

- [ ] Verificar se a rota precisa de Company ID
- [ ] Se sim, confirmar que está na lista de rotas protegidas
- [ ] Se não, adicionar à lista de exceções no interceptor
- [ ] Testar requisição sem Company ID (deve bloquear se obrigatório)
- [ ] Testar requisição com Company ID (deve funcionar)
- [ ] Verificar no Network tab que header está sendo enviado

---

**Versão da Documentação**: 1.0.0  
**Data de Criação**: 2024-01-20  
**Última Atualização**: 2024-01-20






















