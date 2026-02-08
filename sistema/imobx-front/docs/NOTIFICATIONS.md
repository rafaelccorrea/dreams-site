# 🔔 Documentação - Sistema de Notificações

Documentação completa do sistema de notificações, incluindo tipos, prioridades, API, WebSocket, componentes e fluxos de uso.

---

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Tipos de Notificação](#tipos-de-notificação)
3. [Prioridades](#prioridades)
4. [Estrutura de Dados](#estrutura-de-dados)
5. [Endpoints da API](#endpoints-da-api)
6. [WebSocket e Tempo Real](#websocket-e-tempo-real)
7. [Componentes](#componentes)
8. [Hooks](#hooks)
9. [Navegação](#navegação)
10. [Fluxos de Uso](#fluxos-de-uso)

---

## 🎯 Visão Geral

O sistema de notificações fornece comunicação em tempo real entre o sistema e os usuários, alertando sobre eventos importantes, prazos, atualizações e ações necessárias.

### Funcionalidades Principais
- ✅ Notificações em tempo real via WebSocket
- ✅ Badge de contador de não lidas
- ✅ Centro de notificações com lista completa
- ✅ Marcação individual e em massa como lida
- ✅ Filtros por tipo e status
- ✅ Navegação automática para entidades relacionadas
- ✅ Suporte a múltiplas empresas
- ✅ Diferentes níveis de prioridade

### Arquitetura

```
Frontend (React)
    ↓
NotificationCenter (UI)
    ↓
useNotifications (Hook)
    ↓
notificationApi (Service)
    ↓
├── REST API (HTTP)
└── WebSocket (Tempo Real)
```

---

## 📝 Tipos de Notificação

### Aluguéis

| Tipo | Label | Descrição |
|------|-------|-----------|
| `RENTAL_EXPIRING` | Aluguel Expirando | Contrato de aluguel próximo ao vencimento |
| `rental_expiring` | Aluguel Expirando | Versão lowercase |
| `RENTAL_EXPIRED` | Aluguel Vencido | Contrato de aluguel vencido |
| `rental_expired` | Aluguel Vencido | Versão lowercase |

**Entity Type:** `rental`

### Pagamentos

| Tipo | Label | Descrição |
|------|-------|-----------|
| `PAYMENT_DUE` | Pagamento a Vencer | Pagamento com vencimento próximo |
| `payment_due` | Pagamento a Vencer | Versão lowercase |
| `PAYMENT_OVERDUE` | Pagamento Atrasado | Pagamento em atraso |
| `payment_overdue` | Pagamento Atrasado | Versão lowercase |

**Entity Type:** `payment`

### Chaves

| Tipo | Label | Descrição |
|------|-------|-----------|
| `KEY_PENDING_RETURN` | Devolução de Chave Pendente | Chave aguardando devolução |
| `key_pending_return` | Devolução de Chave Pendente | Versão lowercase |
| `KEY_OVERDUE` | Devolução de Chave Atrasada | Chave com devolução em atraso |
| `key_overdue` | Devolução de Chave Atrasada | Versão lowercase |

**Entity Type:** `key`

### Vistorias

| Tipo | Label | Descrição |
|------|-------|-----------|
| `INSPECTION_SCHEDULED` | Vistoria Agendada | Vistoria foi agendada |
| `inspection_scheduled` | Vistoria Agendada | Versão lowercase |
| `INSPECTION_OVERDUE` | Vistoria Atrasada | Vistoria com prazo vencido |
| `inspection_overdue` | Vistoria Atrasada | Versão lowercase |
| `INSPECTION_APPROVAL_REQUESTED` | Aprovação de Vistoria Solicitada | Aguardando aprovação de vistoria |
| `inspection_approval_requested` | Aprovação de Vistoria Solicitada | Versão lowercase |
| `INSPECTION_APPROVED` | Vistoria Aprovada | Vistoria foi aprovada |
| `inspection_approved` | Vistoria Aprovada | Versão lowercase |
| `INSPECTION_REJECTED` | Vistoria Rejeitada | Vistoria foi rejeitada |
| `inspection_rejected` | Vistoria Rejeitada | Versão lowercase |

**Entity Types:** `inspection`, `inspection_approval`

### Documentos

| Tipo | Label | Descrição |
|------|-------|-----------|
| `CLIENT_DOCUMENT_EXPIRING` | Documento de Cliente Expirando | Documento do cliente próximo ao vencimento |
| `client_document_expiring` | Documento de Cliente Expirando | Versão lowercase |
| `PROPERTY_DOCUMENT_EXPIRING` | Documento de Propriedade Expirando | Documento da propriedade próximo ao vencimento |
| `property_document_expiring` | Documento de Propriedade Expirando | Versão lowercase |

**Entity Type:** `document`

### Tarefas

| Tipo | Label | Descrição |
|------|-------|-----------|
| `TASK_ASSIGNED` | Tarefa Atribuída | Nova tarefa atribuída ao usuário |
| `task_assigned` | Tarefa Atribuída | Versão lowercase |
| `TASK_DUE` | Tarefa a Vencer | Tarefa com prazo próximo |
| `task_due` | Tarefa a Vencer | Versão lowercase |
| `TASK_OVERDUE` | Tarefa Atrasada | Tarefa com prazo vencido |
| `task_overdue` | Tarefa Atrasada | Versão lowercase |

**Entity Type:** `task`

### Notas

| Tipo | Label | Descrição |
|------|-------|-----------|
| `NOTE_PENDING` | Nota Pendente | Nota pendente de ação |
| `note_pending` | Nota Pendente | Versão lowercase |

**Entity Type:** `note`

### Compromissos

| Tipo | Label | Descrição |
|------|-------|-----------|
| `APPOINTMENT_REMINDER` | Lembrete de Compromisso | Lembrete de compromisso agendado |
| `appointment_reminder` | Lembrete de Compromisso | Versão lowercase |
| `APPOINTMENT_INVITE` | Convite para Compromisso | Convite para participar de compromisso |
| `appointment_invite` | Convite para Compromisso | Versão lowercase |
| `APPOINTMENT_INVITE_ACCEPTED` | Convite Aceito | Convite foi aceito |
| `appointment_invite_accepted` | Convite Aceito | Versão lowercase |
| `APPOINTMENT_INVITE_DECLINED` | Convite Recusado | Convite foi recusado |
| `appointment_invite_declined` | Convite Recusado | Versão lowercase |

**Entity Types:** `appointment`, `appointment_invite`

### Assinaturas

| Tipo | Label | Descrição |
|------|-------|-----------|
| `SUBSCRIPTION_EXPIRING_SOON` | Assinatura Expirando | Assinatura próxima ao vencimento |
| `subscription_expiring_soon` | Assinatura Expirando | Versão lowercase |
| `SUBSCRIPTION_EXPIRED` | Assinatura Expirada | Assinatura expirada |
| `subscription_expired` | Assinatura Expirada | Versão lowercase |

**Entity Type:** `subscription`

### Recompensas

| Tipo | Label | Descrição |
|------|-------|-----------|
| `reward_redemption_requested` | Resgate de Recompensa Solicitado | Resgate de recompensa aguardando aprovação |
| `reward_redemption_approved` | Resgate de Recompensa Aprovado | Resgate de recompensa foi aprovado |
| `reward_redemption_rejected` | Resgate de Recompensa Rejeitado | Resgate de recompensa foi rejeitado |
| `reward_delivered` | Recompensa Entregue | Recompensa foi entregue |

**Entity Type:** `reward` (implícito)

### Sistema

| Tipo | Label | Descrição |
|------|-------|-----------|
| `SYSTEM_ALERT` | Alerta do Sistema | Alerta geral do sistema |
| `system_alert` | Alerta do Sistema | Versão lowercase |
| `NEW_MESSAGE` | Nova Mensagem | Nova mensagem recebida |
| `new_message` | Nova Mensagem | Versão lowercase |

**Entity Type:** `message` (para NEW_MESSAGE)

### Matches de Propriedades

| Tipo | Label | Descrição |
|------|-------|-----------|
| `PROPERTY_MATCH_FOUND` | Match de Propriedade Encontrado | Novo match encontrado para propriedade |
| `property_match_found` | Match de Propriedade Encontrado | Versão lowercase |
| `PROPERTY_MATCH_HIGH_SCORE` | Match com Alta Compatibilidade | Match com score alto de compatibilidade |
| `property_match_high_score` | Match com Alta Compatibilidade | Versão lowercase |

**Entity Type:** `property_match`

### Propriedades

| Tipo | Label | Descrição |
|------|-------|-----------|
| (genérico) | Notificação de Propriedade | Notificação relacionada a propriedade |

**Entity Type:** `property`

---

## ⚡ Prioridades

As notificações têm 4 níveis de prioridade:

### Urgente (`urgent`)
- **Cor:** `#dc2626` (vermelho)
- **Ícone:** `alert-circle`
- **Uso:** Situações críticas que requerem ação imediata
- **Exemplos:** Pagamentos muito atrasados, contratos expirados críticos

### Alta (`high`)
- **Cor:** `#ea580c` (laranja)
- **Ícone:** `alert-triangle`
- **Uso:** Situações importantes que requerem atenção
- **Exemplos:** Pagamentos em atraso, vistorias vencidas

### Média (`medium`)
- **Cor:** `#2563eb` (azul)
- **Ícone:** `info`
- **Uso:** Informações importantes mas não urgentes
- **Exemplos:** Tarefas atribuídas, compromissos agendados

### Baixa (`low`)
- **Cor:** `#64748b` (cinza)
- **Ícone:** `message-circle`
- **Uso:** Informações gerais
- **Exemplos:** Notas, mensagens informativas

---

## 📦 Estrutura de Dados

### Interface Notification

```typescript
interface Notification {
  id: string;                    // ID único da notificação
  type: string;                  // Tipo da notificação
  priority: 'low' | 'medium' | 'high' | 'urgent'; // Prioridade
  title: string;                 // Título da notificação
  message: string;               // Mensagem da notificação
  read: boolean;                 // Se foi lida
  readAt: Date | null;           // Data/hora que foi lida
  actionUrl: string | null;      // URL de ação (prioridade 1 para navegação)
  entityType: string | null;     // Tipo de entidade relacionada
  entityId: string | null;       // ID da entidade relacionada
  metadata: Record<string, any> | null; // Metadados adicionais
  userId: string;                // ID do usuário destinatário
  companyId: string | null;      // ID da empresa (se aplicável)
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de atualização
}
```

### Interface NotificationListResponse

```typescript
interface NotificationListResponse {
  notifications: Notification[]; // Lista de notificações
  total: number;                 // Total de notificações
  page: number;                  // Página atual
  limit: number;                 // Limite por página
  totalPages: number;            // Total de páginas
  unreadCount: number;           // Contador de não lidas
}
```

### Interface NotificationQueryParams

```typescript
interface NotificationQueryParams {
  read?: boolean;                // Filtrar por lidas/não lidas
  type?: string;                 // Filtrar por tipo
  companyId?: string;            // Filtrar por empresa
  page?: number;                 // Página
  limit?: number;                // Limite por página
}
```

### Metadata de Notificações de Match

```typescript
interface PropertyMatchNotificationMetadata {
  propertyId: string;
  propertyTitle: string;
  propertyCode?: string;
  totalMatches: number;
  highScoreMatches: number;
  propertyType?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyPrice?: number;
  matchScores?: Array<{
    clientId: string;
    score: number;
  }>;
}
```

---

## 🌐 Endpoints da API

### 1. Listar Notificações

**Endpoint:**
```
GET /notifications
```

**Query Parameters:**
```typescript
{
  read?: boolean;        // true = apenas lidas, false = apenas não lidas
  type?: string;         // Filtrar por tipo
  companyId?: string;    // Filtrar por empresa
  page?: number;         // Página (padrão: 1)
  limit?: number;        // Limite por página (padrão: 20)
}
```

**Headers:**
```
Authorization: Bearer {token}
X-Company-ID: {companyId}  // Opcional, para filtrar por empresa
```

**Resposta:**
```json
{
  "notifications": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "property_match_found",
      "priority": "high",
      "title": "Novo match encontrado",
      "message": "3 clientes compatíveis encontrados para a propriedade",
      "read": false,
      "readAt": null,
      "actionUrl": "/properties/123/matches",
      "entityType": "property_match",
      "entityId": "match-123",
      "metadata": {
        "propertyId": "prop-123",
        "propertyTitle": "Apartamento 2 quartos",
        "totalMatches": 3
      },
      "userId": "user-123",
      "companyId": "company-123",
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "unreadCount": 15
}
```

### 2. Listar Notificações Não Lidas

**Endpoint:**
```
GET /notifications/unread/list
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  companyId?: string;
}
```

**Resposta:**
Mesma estrutura de `NotificationListResponse`

### 3. Buscar Notificação por ID

**Endpoint:**
```
GET /notifications/:id
```

**Resposta:**
```typescript
Notification
```

### 4. Contador de Não Lidas

**Endpoint:**
```
GET /notifications/unread-count
```

**Query Parameters:**
```typescript
{
  companyId?: string;
}
```

**Resposta:**
```json
{
  "count": 15
}
```

### 5. Contador por Empresa

**Endpoint:**
```
GET /notifications/unread-count-by-company
```

**Resposta:**
```json
{
  "countByCompany": {
    "company-123": 10,
    "company-456": 5
  }
}
```

### 6. Marcar como Lida

**Endpoint:**
```
PATCH /notifications/:id/read
```

**Resposta:**
```typescript
Notification  // Notificação atualizada
```

### 7. Marcar como Não Lida

**Endpoint:**
```
PATCH /notifications/:id/unread
```

**Resposta:**
```typescript
Notification  // Notificação atualizada
```

### 8. Marcar Múltiplas como Lidas

**Endpoint:**
```
PATCH /notifications/read/bulk
```

**Body:**
```json
{
  "notificationIds": [
    "id-1",
    "id-2",
    "id-3"
  ]
}
```

**Resposta:**
```json
{
  "affected": 3,
  "unreadCount": 12
}
```

### 9. Marcar Todas como Lidas

**Endpoint:**
```
PATCH /notifications/read/all
```

**Body:**
```json
{
  "companyId": "company-123"  // Opcional
}
```

**Resposta:**
```json
{
  "affected": 15,
  "unreadCount": 0
}
```

### 10. Excluir Notificação

**Endpoint:**
```
DELETE /notifications/:id
```

**Resposta:**
```
204 No Content
```

---

## 🔌 WebSocket e Tempo Real

### Conexão

O sistema utiliza WebSocket para receber notificações em tempo real.

**URL:**
```
ws://{API_BASE_URL}/notifications
```

**Autenticação:**
```javascript
{
  auth: {
    token: 'jwt_token_aqui'
  }
}
```

**Evento de Conexão:**
```javascript
socket.emit('join', userId);
```

### Eventos Recebidos

#### 1. `connect`
Evento quando a conexão é estabelecida.

```javascript
socket.on('connect', () => {
  console.log('Conectado ao WebSocket de notificações');
});
```

#### 2. `notifications_connected`
Confirmação de conexão do servidor.

```javascript
socket.on('notifications_connected', (data) => {
  console.log('Conectado:', data);
});
```

#### 3. `notification`
Nova notificação recebida.

```javascript
socket.on('notification', (data) => {
  // data: Notification
  console.log('Nova notificação:', data);
});
```

#### 4. `badge_update`
Atualização do contador de não lidas.

```javascript
socket.on('badge_update', (data) => {
  // data: { unreadCount: number }
  console.log('Contador atualizado:', data.unreadCount);
});
```

#### 5. `notification_read`
Notificação foi marcada como lida.

```javascript
socket.on('notification_read', (data) => {
  // data: { notificationId: string }
  console.log('Notificação lida:', data.notificationId);
});
```

#### 6. `company_subscribed`
Confirmação de inscrição em empresa.

```javascript
socket.on('company_subscribed', (data) => {
  // data: { companyId: string }
  console.log('Inscrito na empresa:', data.companyId);
});
```

#### 7. `company_unsubscribed`
Confirmação de desinscrição de empresa.

```javascript
socket.on('company_unsubscribed', (data) => {
  // data: { companyId: string }
  console.log('Desinscrito da empresa:', data.companyId);
});
```

#### 8. `disconnect`
Desconexão do WebSocket.

```javascript
socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
});
```

#### 9. `error`
Erro no WebSocket.

```javascript
socket.on('error', (error) => {
  console.error('Erro:', error);
});
```

### Eventos Enviados

#### 1. `join`
Entrar no canal do usuário.

```javascript
socket.emit('join', userId);
```

#### 2. `subscribe_company`
Inscrever-se para notificações de uma empresa.

```javascript
socket.emit('subscribe_company', { companyId: 'company-123' });
```

#### 3. `unsubscribe_company`
Cancelar inscrição de notificações de uma empresa.

```javascript
socket.emit('unsubscribe_company', { companyId: 'company-123' });
```

### Reconexão Automática

O sistema possui reconexão automática com exponential backoff:
- Delay inicial: 1 segundo
- Delay máximo: 30 segundos
- Máximo de tentativas: 10

---

## 🎨 Componentes

### NotificationCenter

Componente principal do centro de notificações.

**Localização:** `src/components/notifications/NotificationCenter.tsx`

**Props:**
```typescript
interface NotificationCenterProps {
  embedded?: boolean;  // Se está embutido em outra página
}
```

**Funcionalidades:**
- Exibe badge com contador de não lidas
- Painel dropdown com lista de notificações
- Marcar todas como lidas
- Navegação ao clicar em notificação
- Scroll infinito
- Filtros visuais por tipo

### NotificationRenderer

Renderizador que detecta o tipo e renderiza o componente apropriado.

**Localização:** `src/components/notifications/NotificationRenderer.tsx`

**Props:**
```typescript
interface NotificationRendererProps {
  notification: Notification;
  onRead?: () => void;
  fallbackComponent?: React.ComponentType<{ notification: Notification; onRead?: () => void }>;
}
```

### PropertyMatchNotification

Componente específico para notificações de match de propriedades.

**Localização:** `src/components/notifications/PropertyMatchNotification.tsx`

---

## 🎣 Hooks

### useNotifications

Hook principal para gerenciar notificações.

**Localização:** `src/hooks/useNotifications.ts`

**Uso:**
```typescript
const {
  notifications,
  unreadCount,
  loading,
  error,
  hasMore,
  page,
  loadNotifications,
  loadMore,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  refresh,
  connected,
} = useNotifications({
  read: false,  // Opcional: filtrar por lidas/não lidas
  type: 'property_match_found',  // Opcional: filtrar por tipo
  companyId: 'company-123',  // Opcional: filtrar por empresa
});
```

**Retorno:**
```typescript
interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  loadNotifications: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  connected: boolean;
}
```

### useNotificationCounts

Hook para obter contadores de notificações por rota.

**Localização:** `src/hooks/useNotificationCounts.ts`

**Uso:**
```typescript
const { counts, loading } = useNotificationCounts();
// counts: { '/properties': 5, '/clients': 3, ... }
```

---

## 🧭 Navegação

### Função getNotificationNavigationUrl

Determina a URL de navegação para uma notificação.

**Localização:** `src/utils/notificationNavigation.ts`

**Lógica:**
1. Prioridade 1: Usa `actionUrl` se existir
2. Prioridade 2: Usa `entityType` e `entityId` para gerar URL

**Mapeamento de Entity Types:**

| Entity Type | URL Gerada |
|------------|------------|
| `inspection` | `/inspections/{entityId}` |
| `inspection_approval` | `/financial/inspection-approvals` |
| `rental` | `/rentals/{entityId}` |
| `key` | `/keys/{entityId}` |
| `payment` | `/financial/payments/{entityId}` |
| `document` | `/clients/{clientId}/documents` ou `/properties/{propertyId}/documents` |
| `task` | `/tasks/{entityId}` |
| `appointment` | `/appointments/{entityId}` |
| `appointment_invite` | `/appointments/invites/{entityId}` |
| `note` | `/notes/{entityId}` |
| `message` | `/messages/{entityId}` |
| `subscription` | `/subscriptions` |
| `property_match` | `/properties/{propertyId}/matches` ou `/matches` |
| `property` | `/properties/{entityId}` |

**Uso:**
```typescript
import { getNotificationNavigationUrl } from '../utils/notificationNavigation';

const url = getNotificationNavigationUrl(notification);
if (url) {
  navigate(url);
}
```

---

## 🔄 Fluxos de Uso

### Fluxo: Receber Notificação em Tempo Real

1. Usuário está logado
2. WebSocket conecta automaticamente
3. Usuário emite evento `join` com seu userId
4. Sistema inscreve em empresas relacionadas
5. Nova notificação é criada no backend
6. Backend envia evento `notification` via WebSocket
7. Frontend recebe e atualiza lista
8. Badge é atualizado com evento `badge_update`
9. Notificação aparece no centro de notificações

### Fluxo: Visualizar Notificações

1. Usuário clica no ícone de notificações
2. Painel dropdown abre
3. Hook `useNotifications` carrega lista (primeira página)
4. Notificações são exibidas em ordem cronológica (mais recente primeiro)
5. Badge mostra contador de não lidas
6. Usuário pode scroll para carregar mais (paginção)

### Fluxo: Marcar como Lida

1. Usuário clica em uma notificação
2. `markAsRead(id)` é chamado
3. Requisição PATCH para `/notifications/:id/read`
4. Notificação é atualizada no backend
5. Evento `notification_read` é emitido via WebSocket
6. Frontend atualiza estado local
7. Badge é atualizado
8. Navegação para URL relacionada (se aplicável)

### Fluxo: Marcar Todas como Lidas

1. Usuário clica em "Marcar todas como lidas"
2. `markAllAsRead()` é chamado
3. Requisição PATCH para `/notifications/read/all`
4. Backend marca todas como lidas (filtrado por empresa se fornecido)
5. Frontend recebe resposta com `unreadCount: 0`
6. Badge é atualizado para 0
7. Lista é atualizada visualmente

### Fluxo: Filtrar Notificações

1. Usuário aplica filtros (tipo, lidas/não lidas, empresa)
2. `loadNotifications(true)` é chamado (reset)
3. Requisição GET para `/notifications` com query params
4. Lista filtrada é retornada
5. Componente exibe apenas notificações filtradas

### Fluxo: Excluir Notificação

1. Usuário clica em excluir notificação
2. `deleteNotification(id)` é chamado
3. Requisição DELETE para `/notifications/:id`
4. Notificação é removida do backend
5. Frontend remove da lista local
6. Badge é atualizado se necessário

---

## 📱 Integração no Layout

### NotificationCenter no Header

O componente `NotificationCenter` é tipicamente incluído no header da aplicação:

```tsx
import { NotificationCenter } from '../components/notifications/NotificationCenter';

function Header() {
  return (
    <HeaderContainer>
      {/* Outros elementos do header */}
      <NotificationCenter />
    </HeaderContainer>
  );
}
```

### Badge Global

O badge de contador é exibido no ícone de notificações e atualizado automaticamente quando:
- Nova notificação chega via WebSocket
- Notificação é marcada como lida
- Todas as notificações são marcadas como lidas
- Notificação é excluída

---

## 🎨 Estilos e Temas

### Cores por Tipo

Cada tipo de notificação tem cores específicas para ícones:

- **Aluguéis/Pagamentos/Chaves Vencidos:** `#ef4444` (vermelho)
- **Alertas/Prazos:** `#f59e0b` (amarelo/laranja)
- **Tarefas/Compromissos:** `#10b981` (verde) ou `#3b82f6` (azul)
- **Informações:** `#3b82f6` (azul)
- **Sistema:** `#8b5cf6` (roxo)

### Estados Visuais

- **Não Lida:** Fundo destacado, fonte em negrito
- **Lida:** Fundo transparente, fonte normal
- **Hover:** Efeito de destaque
- **Clique:** Navegação para URL relacionada

---

## 🔒 Segurança

### Autenticação
- Todas as requisições requerem token JWT
- WebSocket autenticado via token no handshake

### Autorização
- Usuário só vê suas próprias notificações
- Filtro automático por `userId`
- Filtro opcional por `companyId`

### Validação
- Validação de IDs antes de ações
- Validação de permissões no backend

---

## 🐛 Tratamento de Erros

### Erros Comuns

#### 401 Unauthorized
- Token expirado ou inválido
- **Ação:** Redirecionar para login

#### 403 Forbidden
- Sem permissão para acessar notificação
- **Ação:** Exibir mensagem de erro

#### 404 Not Found
- Notificação não encontrada
- **Ação:** Remover da lista local

#### 500 Internal Server Error
- Erro no servidor
- **Ação:** Exibir mensagem genérica, permitir retry

### Reconexão WebSocket

Em caso de desconexão:
1. Sistema detecta desconexão
2. Inicia reconexão com exponential backoff
3. Re-autentica com token atual
4. Re-inscreve em canais necessários

---

## 📊 Performance

### Otimizações

- **Paginação:** Carregamento por páginas (20 itens por vez)
- **Scroll Infinito:** Carregamento sob demanda
- **Debounce:** Debounce em atualizações de badge
- **Cache:** Cache local de notificações carregadas
- **WebSocket:** Conexão única reutilizada

### Limites

- Máximo de 100 notificações carregadas na memória
- Paginação padrão: 20 itens por página
- Timeout de WebSocket: 30 segundos

---

## 🚀 Próximas Melhorias

### Funcionalidades Planejadas
- [ ] Notificações agrupadas por tipo
- [ ] Filtros avançados por data
- [ ] Notificações silenciosas (sem som/badge)
- [ ] Preferências de notificação por tipo
- [ ] Exportação de notificações
- [ ] Busca de notificações
- [ ] Notificações com ações rápidas inline
- [ ] Push notifications no mobile

---

**Versão**: 1.0.0  
**Última Atualização**: 2024-01-20



