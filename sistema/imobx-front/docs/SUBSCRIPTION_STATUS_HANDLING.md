# 📋 Documentação: Tratamento de Assinaturas Vencidas/Suspensas no Frontend

## 🚨 PROBLEMA IDENTIFICADO

**O frontend está redirecionando usuários com assinaturas SUSPENSAS para a tela de planos, quando deveria permitir acesso limitado ou mostrar uma tela específica de assinatura suspensa.**

---

## 🔍 ANÁLISE ATUAL DO SISTEMA

### 1. **Fluxo de Verificação de Assinatura**

#### **1.1 Pontos de Verificação**
- `useSubscriptionCheck.ts` - Verificação após login
- `SubscriptionGuard.tsx` - Proteção de rotas
- `SubscriptionProtectedRoute.tsx` - Proteção de features específicas
- `useSubscriptionMonitor.ts` - Monitoramento contínuo
- `CreatePropertyPage.tsx` - Verificação antes de criar propriedades

#### **1.2 APIs Utilizadas**
```typescript
// Verifica se tem acesso (retorna boolean)
subscriptionService.checkSubscriptionAccess() 
// GET /subscriptions/check-access

// Busca assinatura ativa do usuário
subscriptionService.getMyActiveSubscription()
// GET /subscriptions/my-active-subscription

// Busca assinatura da empresa
subscriptionService.getCompanyActiveSubscription()
// GET /subscriptions/company-active-subscription
```

### 2. **Lógica Atual de Verificação**

#### **2.1 useSubscriptionCheck.ts**
```typescript
// ❌ PROBLEMA: Só verifica hasAccess (boolean)
const hasAccess = await subscriptionService.checkSubscriptionAccess();

if (!hasAccess) {
  if (user.role === 'admin') {
    navigate('/subscription-plans'); // ← REDIRECIONA SEMPRE!
  } else {
    navigate('/system-unavailable');
  }
}
```

#### **2.2 SubscriptionGuard.tsx**
```typescript
// ❌ PROBLEMA: Só verifica hasActiveSubscription
if (!subscriptionStatus.hasActiveSubscription) {
  return <Navigate to="/subscription-plans" replace />;
}

// ❌ PROBLEMA: Não diferencia suspensa de expirada
if (user?.role === 'admin' && (subscriptionStatus.isExpired || subscriptionStatus.isExpiringSoon)) {
  // Só permite acesso ao gerenciamento
}
```

#### **2.3 useSubscription.ts**
```typescript
// ❌ PROBLEMA: Não verifica status específico da assinatura
const hasAccess = await subscriptionService.checkSubscriptionAccess();

if (!hasAccess) {
  return {
    hasActiveSubscription: false,
    isExpired: true, // ← ASSUME QUE É EXPIRADA
    canAccessFeatures: false,
  };
}
```

### 3. **Status de Assinatura Disponíveis**

#### **3.1 Status Suportados pelo Backend**
```typescript
type SubscriptionStatus = 
  | 'active'      // ✅ Ativa
  | 'expired'     // ❌ Expirada (vencida)
  | 'cancelled'   // ❌ Cancelada
  | 'inactive'    // ❌ Inativa
  | 'pending'     // ⏳ Pendente
  | 'suspended'   // ⚠️ Suspensa (NOVO!)
```

#### **3.2 Traduções Implementadas**
```typescript
export const subscriptionStatusTranslations = {
  active: 'Ativa',
  expired: 'Expirada',
  cancelled: 'Cancelada',
  inactive: 'Inativa',
  pending: 'Pendente',
  suspended: 'Suspensa', // ← JÁ IMPLEMENTADO
};
```

---

## 🐛 PROBLEMAS IDENTIFICADOS

### **Problema 1: Verificação Simplista**
- **Atual**: `checkSubscriptionAccess()` retorna apenas `boolean`
- **Problema**: Não diferencia entre "suspensa" e "expirada"
- **Resultado**: Usuário com assinatura suspensa é redirecionado para planos

### **Problema 2: Falta de Status Específico**
- **Atual**: `hasActiveSubscription: false` para qualquer problema
- **Problema**: Não há campo `status` sendo verificado
- **Resultado**: Não é possível tratar suspensa diferente de expirada

### **Problema 3: Redirecionamento Inadequado**
- **Atual**: Suspensa → `/subscription-plans`
- **Deveria**: Suspensa → `/subscription-suspended` ou acesso limitado

### **Problema 4: Inconsistência entre Componentes**
- **SubscriptionGuard**: Redireciona para planos
- **SubscriptionNotification**: Mostra notificação genérica
- **CreatePropertyPage**: Bloqueia criação

---

## 🔧 SOLUÇÕES PROPOSTAS

### **Solução 1: Atualizar API de Verificação**

#### **1.1 Modificar `checkSubscriptionAccess()`**
```typescript
// ❌ ATUAL
async checkSubscriptionAccess(): Promise<boolean> {
  const response = await api.get('/subscriptions/check-access');
  return response.data.hasAccess;
}

// ✅ PROPOSTO
async checkSubscriptionAccess(): Promise<SubscriptionAccessInfo> {
  const response = await api.get('/subscriptions/check-access');
  return {
    hasAccess: response.data.hasAccess,
    status: response.data.status, // 'active' | 'suspended' | 'expired' | etc
    reason: response.data.reason, // Motivo da suspensão
    canAccessFeatures: response.data.canAccessFeatures,
    daysUntilExpiry: response.data.daysUntilExpiry,
  };
}
```

#### **1.2 Interface Proposta**
```typescript
interface SubscriptionAccessInfo {
  hasAccess: boolean;
  status: SubscriptionStatus;
  reason?: string;
  canAccessFeatures: boolean;
  daysUntilExpiry?: number;
  isExpired: boolean;
  isSuspended: boolean;
  isExpiringSoon: boolean;
}
```

### **Solução 2: Atualizar Lógica de Verificação**

#### **2.1 useSubscriptionCheck.ts**
```typescript
// ✅ PROPOSTO
const accessInfo = await subscriptionService.checkSubscriptionAccess();

if (!accessInfo.hasAccess) {
  switch (accessInfo.status) {
    case 'suspended':
      if (user.role === 'admin') {
        navigate('/subscription-management', {
          state: { reason: 'suspended', accessInfo }
        });
      } else {
        navigate('/system-unavailable', {
          state: { reason: 'suspended', message: accessInfo.reason }
        });
      }
      break;
    case 'expired':
      if (user.role === 'admin') {
        navigate('/subscription-plans');
      } else {
        navigate('/system-unavailable');
      }
      break;
    default:
      // Outros casos
      break;
  }
}
```

#### **2.2 SubscriptionGuard.tsx**
```typescript
// ✅ PROPOSTO
if (!subscriptionStatus.hasActiveSubscription) {
  switch (subscriptionStatus.status) {
    case 'suspended':
      return <Navigate to="/subscription-suspended" replace />;
    case 'expired':
      return <Navigate to="/subscription-plans" replace />;
    default:
      return <Navigate to="/subscription-plans" replace />;
  }
}
```

### **Solução 3: Criar Página de Assinatura Suspensa**

#### **3.1 Nova Rota**
```typescript
// App.tsx
<Route path="/subscription-suspended" element={<SubscriptionSuspendedPage />} />
```

#### **3.2 Página Proposta**
```typescript
const SubscriptionSuspendedPage: React.FC = () => {
  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>⚠️ Assinatura Suspensa</PageTitle>
          <PageSubtitle>
            Sua assinatura foi temporariamente suspensa
          </PageSubtitle>
        </PageHeader>
        
        <PageContent>
          <SuspensionCard>
            <SuspensionIcon>⏸️</SuspensionIcon>
            <SuspensionTitle>Assinatura Suspensa</SuspensionTitle>
            <SuspensionMessage>
              Sua assinatura foi suspensa por: <strong>{reason}</strong>
            </SuspensionMessage>
            
            <ActionButtons>
              <ContactButton onClick={handleContact}>
                Entrar em Contato
              </ContactButton>
              <ReactivateButton onClick={handleReactivate}>
                Solicitar Reativação
              </ReactivateButton>
            </ActionButtons>
          </SuspensionCard>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
```

### **Solução 4: Atualizar Notificações**

#### **4.1 SubscriptionNotification.tsx**
```typescript
// ✅ PROPOSTO
const getNotificationMessage = () => {
  if (!subscriptionStatus) return '';

  switch (subscriptionStatus.status) {
    case 'suspended':
      return `Sua assinatura foi suspensa. Motivo: ${subscriptionStatus.reason}`;
    case 'expired':
      return 'Sua assinatura expirou. Renove agora para continuar usando o sistema.';
    case 'expiringSoon':
      return `Sua assinatura expira em ${subscriptionStatus.daysUntilExpiry} dias.`;
    default:
      return '';
  }
};
```

---

## 📋 PLANO DE IMPLEMENTAÇÃO

### **Fase 1: Backend (Necessário)**
1. ✅ **Atualizar API `/check-access`** para retornar status detalhado
2. ✅ **Adicionar campo `reason`** para motivo da suspensão
3. ✅ **Adicionar campo `canAccessFeatures`** para controle granular

### **Fase 2: Frontend - Serviços**
1. ✅ **Atualizar `subscriptionService.checkSubscriptionAccess()`**
2. ✅ **Criar interface `SubscriptionAccessInfo`**
3. ✅ **Atualizar `useSubscription.ts`** para usar novo formato

### **Fase 3: Frontend - Componentes**
1. ✅ **Atualizar `useSubscriptionCheck.ts`**
2. ✅ **Atualizar `SubscriptionGuard.tsx`**
3. ✅ **Atualizar `SubscriptionNotification.tsx`**
4. ✅ **Atualizar `CreatePropertyPage.tsx`**

### **Fase 4: Frontend - Páginas**
1. ✅ **Criar `SubscriptionSuspendedPage.tsx`**
2. ✅ **Adicionar rota `/subscription-suspended`**
3. ✅ **Implementar ações de contato/reativação**

### **Fase 5: Testes**
1. ✅ **Testar fluxo de assinatura suspensa**
2. ✅ **Testar fluxo de assinatura expirada**
3. ✅ **Testar fluxo de assinatura ativa**
4. ✅ **Testar diferentes roles (admin/user/master)**

---

## 🎯 COMPORTAMENTO ESPERADO APÓS CORREÇÃO

### **Assinatura Ativa**
- ✅ Acesso completo ao sistema
- ✅ Notificação apenas se expirando em breve

### **Assinatura Suspensa**
- ⚠️ Redirecionamento para `/subscription-suspended`
- ⚠️ Acesso limitado (apenas contato/reativação)
- ⚠️ Notificação específica com motivo

### **Assinatura Expirada**
- ❌ Redirecionamento para `/subscription-plans`
- ❌ Acesso limitado (apenas renovação)
- ❌ Notificação de expiração

### **Assinatura Pendente**
- ⏳ Acesso limitado
- ⏳ Notificação de pendência

---

## 🔍 PONTOS DE ATENÇÃO

### **1. Compatibilidade**
- Manter compatibilidade com API atual durante transição
- Implementar fallback para casos de erro

### **2. Performance**
- Cache de verificação de assinatura
- Evitar verificações desnecessárias

### **3. Segurança**
- Verificação server-side sempre prevalece
- Frontend apenas para UX, não para segurança

### **4. UX**
- Mensagens claras sobre status
- Ações específicas para cada situação
- Evitar loops de redirecionamento

---

## 📊 IMPACTO DA CORREÇÃO

### **Antes (Atual)**
```
Assinatura Suspensa → /subscription-plans (❌ Incorreto)
Usuário confuso: "Por que estou na tela de planos se tenho assinatura?"
```

### **Depois (Proposto)**
```
Assinatura Suspensa → /subscription-suspended (✅ Correto)
Usuário informado: "Minha assinatura foi suspensa por [motivo]"
Ações claras: Contato | Solicitar Reativação
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Confirmar com Backend** se API `/check-access` pode retornar status detalhado
2. **Implementar Solução 1** (atualizar serviços)
3. **Implementar Solução 2** (atualizar lógica)
4. **Implementar Solução 3** (criar página suspensa)
5. **Implementar Solução 4** (atualizar notificações)
6. **Testar todos os cenários**
7. **Deploy e monitoramento**

---

**Status**: 🔴 **CRÍTICO** - Usuários com assinaturas suspensas estão sendo redirecionados incorretamente para tela de planos, causando confusão e má experiência do usuário.
