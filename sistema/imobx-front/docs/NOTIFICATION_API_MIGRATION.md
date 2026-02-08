# 🔔 Migração da API de Notificações

## Resumo das Mudanças

O sistema de notificações foi atualizado para seguir a nova documentação da API, incluindo novos endpoints, tipos de dados, eventos WebSocket e lógica de filtragem por empresa usando o header `X-Company-ID`.

## 📋 Mudanças Implementadas

### 1. **Tipos TypeScript Atualizados**

**Arquivo:** `src/services/notificationApi.ts`

- ✅ **Priority**: Agora tipado como `'low' | 'medium' | 'high' | 'urgent'`
- ✅ **Removido**: Campo `companyName` (não existe na nova API)
- ✅ **Mantido**: Todos os outros campos conforme documentação

### 2. **Endpoints Atualizados**

**Arquivo:** `src/services/notificationApi.ts`

#### Endpoints Principais:
- ✅ `GET /notifications` - Listar notificações com filtros
- ✅ `GET /notifications/unread/list` - Listar apenas não lidas
- ✅ `GET /notifications/unread-count` - Contador de não lidas
- ✅ `GET /notifications/unread-count-by-company` - Contador por empresa

#### Endpoints de Marcação:
- ✅ `PATCH /notifications/:id/read` - Marcar como lida
- ✅ `PATCH /notifications/:id/unread` - Marcar como não lida
- ✅ `PATCH /notifications/read/bulk` - Marcar múltiplas como lidas
- ✅ `PATCH /notifications/read/all` - Marcar todas como lidas

#### Endpoints de Gerenciamento:
- ✅ `DELETE /notifications/:id` - Deletar notificação

### 3. **Eventos WebSocket Atualizados**

**Arquivo:** `src/services/notificationApi.ts`

- ✅ **`notification`**: Nova notificação recebida
- ✅ **`badge_update`**: Atualização do contador de não lidas
- ✅ **`notification_read`**: Notificação marcada como lida

**Removido:** Eventos legacy (`new_notification`, `badge-update`)

### 4. **Hook Atualizado**

**Arquivo:** `src/hooks/useNotifications.ts`

- ✅ **Endpoint**: Agora usa `getNotifications()` em vez de `getAllCompaniesNotifications()`
- ✅ **Compatibilidade**: Mantém toda funcionalidade existente
- ✅ **WebSocket**: Usa novos eventos conforme documentação

### 5. **Componente Atualizado**

**Arquivo:** `src/components/notifications/NotificationCenter.tsx`

- ✅ **Removido**: Referência ao campo `companyName` (não existe na nova API)
- ✅ **Mantido**: Toda funcionalidade visual e de interação
- ✅ **Compatibilidade**: Funciona com nova estrutura de dados

## 🏢 Lógica de Filtragem por Empresa

### Como Funciona

O sistema usa o **header `X-Company-ID`** automaticamente para filtrar notificações:

#### 1️⃣ Com `X-Company-ID` no Header (Empresa Selecionada)

**Retorna:**
- ✅ Notificações dessa empresa
- ✅ Notificações pessoais (sem empresa)

**Caso de uso:** Usuário navegando em uma empresa

#### 2️⃣ Sem `X-Company-ID` no Header (Sem Empresa)

**Retorna:**
- ✅ Apenas notificações pessoais

**Caso de uso:** Tela de perfil, configurações

### Implementação Automática

O header `X-Company-ID` é **enviado automaticamente** pelo interceptor Axios em `src/services/api.ts`:

```typescript
// O header é adicionado automaticamente em todas as requisições
if (selectedCompanyId) {
  config.headers['X-Company-ID'] = selectedCompanyId;
}
```

**Não é necessário adicionar manualmente** o header nas chamadas da API de notificações.

### Notificações de Empresa vs Pessoais

1. **Notificações de Empresa** (`companyId` presente)
   - Vinculadas a uma empresa específica
   - Ex: convites de agendamento, tarefas da empresa

2. **Notificações Pessoais** (`companyId` null)
   - Sem vínculo com empresa
   - Ex: atualização de perfil, mensagens diretas

## 🔄 Compatibilidade

### ✅ **Mantido:**
- Toda funcionalidade existente do sistema de notificações
- Interface do usuário idêntica
- Comportamento de marcação de leitura
- WebSocket em tempo real
- Paginação e scroll infinito
- Envio automático do header `X-Company-ID`

### 🔧 **Atualizado:**
- Endpoints da API para seguir nova documentação
- Tipos TypeScript para maior segurança
- Eventos WebSocket padronizados
- Estrutura de dados conforme especificação
- Lógica de filtragem baseada em empresa

## 📊 Tipos de Notificação Suportados

Conforme a documentação, o sistema suporta os seguintes tipos:

### Aluguéis
- `rental_expiring` - Aluguel expirando
- `rental_expired` - Aluguel expirado

### Pagamentos
- `payment_due` - Pagamento em dia
- `payment_overdue` - Pagamento em atraso

### Chaves
- `key_pending_return` - Chave pendente de devolução
- `key_overdue` - Chave em atraso

### Vistorias
- `inspection_scheduled` - Vistoria agendada
- `inspection_overdue` - Vistoria em atraso
- `inspection_approval_requested` - Aprovação de vistoria solicitada
- `inspection_approved` - Vistoria aprovada
- `inspection_rejected` - Vistoria rejeitada

### Documentos
- `client_document_expiring` - Documento do cliente expirando
- `property_document_expiring` - Documento da propriedade expirando

### Tarefas
- `task_assigned` - Tarefa atribuída
- `task_due` - Tarefa em dia
- `task_overdue` - Tarefa em atraso

### Agendamentos
- `appointment_reminder` - Lembrete de agendamento
- `appointment_invite` - Convite para agendamento
- `appointment_invite_accepted` - Convite aceito
- `appointment_invite_declined` - Convite recusado

### Assinaturas
- `subscription_expiring_soon` - Assinatura expirando em breve
- `subscription_expired` - Assinatura expirada

### Recompensas
- `reward_redemption_requested` - Resgate de recompensa solicitado
- `reward_redemption_approved` - Resgate de recompensa aprovado
- `reward_redemption_rejected` - Resgate de recompensa rejeitado
- `reward_delivered` - Recompensa entregue

### Sistema
- `new_message` - Nova mensagem
- `system_alert` - Alerta do sistema
- `note_pending` - Nota pendente

## 🎯 Prioridades Suportadas

- `low` - Baixa prioridade
- `medium` - Média prioridade  
- `high` - Alta prioridade
- `urgent` - Urgente

## 📦 Novos Recursos Adicionados

### 1. Hook `useNotificationsByCompany`

**Arquivo:** `src/hooks/useNotificationsByCompany.ts`

Novo hook para obter contador de notificações separado por empresa:

```typescript
const { countByCompany, loading } = useNotificationsByCompany();

// Estrutura retornada:
{
  "company-uuid-1": 5,
  "company-uuid-2": 3,
  "personal": 2
}
```

**Uso:**
- Dashboard com múltiplas empresas
- Seletor de empresas com badges
- Visão geral de notificações

## 🎯 Como Usar

### Cenário 1: Usuário Navegando em uma Empresa

```typescript
// O hook useNotifications automaticamente usa o X-Company-ID
const { notifications, unreadCount } = useNotifications();

// Retorna: notificações da empresa + pessoais
// Contador: soma de ambas
```

### Cenário 2: Tela de Perfil (Sem Empresa)

```typescript
// Se não houver empresa selecionada, retorna apenas pessoais
const { notifications, unreadCount } = useNotifications();

// Retorna: apenas notificações pessoais
// Contador: apenas pessoais
```

### Cenário 3: Dashboard Multi-Empresa

```typescript
// Buscar contador separado para cada empresa
const { countByCompany } = useNotificationsByCompany();

// Exibir badge para cada empresa
companies.map(company => (
  <CompanyBadge 
    count={countByCompany[company.id] || 0}
  />
))
```

## 🚀 Próximos Passos

1. **Testar** a integração com o backend
2. **Verificar** se todos os endpoints estão funcionando
3. **Validar** eventos WebSocket em tempo real
4. **Confirmar** que a UI está exibindo corretamente

## 📝 Notas Importantes

- ✅ **Backward Compatibility**: O sistema mantém compatibilidade com funcionalidades existentes
- ✅ **Type Safety**: Tipos TypeScript atualizados para maior segurança
- ✅ **Performance**: Endpoints otimizados conforme documentação
- ✅ **Real-time**: WebSocket atualizado para eventos padronizados

---

**Status:** ✅ **Concluído**  
**Data:** 19/10/2025  
**Versão:** API v2.0
