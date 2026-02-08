# 🔔 Sistema de Notificações em Tempo Real

## Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura WebSocket](#-arquitetura-websocket)
3. [Conexão e Autenticação](#-conexão-e-autenticação)
4. [Eventos WebSocket](#-eventos-websocket)
5. [Sistema de Badges](#-sistema-de-badges)
6. [Mapeamento de Rotas](#-mapeamento-de-rotas)
7. [Implementação no Drawer](#-implementação-no-drawer)
8. [Hooks e Serviços](#-hooks-e-serviços)
9. [Exemplo de Implementação (Mobile)](#-exemplo-de-implementação-mobile)
10. [Fluxos de Atualização](#-fluxos-de-atualização)
11. [Troubleshooting](#-troubleshooting)

---

## 📋 Visão Geral

O sistema de notificações em tempo real utiliza **WebSocket** (via Socket.IO) para manter uma conexão persistente entre o cliente e o servidor, permitindo:

- ✅ Recebimento instantâneo de novas notificações
- ✅ Atualização automática de badges (contadores)
- ✅ Sincronização em tempo real de status (lida/não lida)
- ✅ Inscrição por empresa (multitenancy)
- ✅ Reconexão automática com exponential backoff
- ✅ Badges contextuais por rota no drawer/navegação

### Componentes Principais

1. **NotificationApiService** (`src/services/notificationApi.ts`): Gerencia conexão WebSocket
2. **useNotifications** (`src/hooks/useNotifications.ts`): Hook principal para notificações
3. **useNotificationCounts** (`src/hooks/useNotificationCounts.ts`): Hook para badges por rota
4. **Drawer Component** (`src/components/layout/Drawer.tsx`): Renderiza badges nos ícones

---

## 🔌 Arquitetura WebSocket

### URL do WebSocket

```
ws://{API_BASE_URL}/notifications
```

**Exemplo:**
```
ws://api.imobx.com/notifications
```

### Biblioteca

- **Socket.IO Client**: Utiliza `socket.io-client`
- **Transport**: Apenas `websocket` (sem polling)
- **Reconexão**: Manual com exponential backoff

### Estrutura da Conexão

```typescript
socket.io(notificationsUrl, {
  auth: { token: 'jwt_token_aqui' },
  transports: ['websocket'],
  reconnection: false, // Reconexão manual
});
```

---

## 🔐 Conexão e Autenticação

### Fluxo de Conexão

```
1. Usuário faz login
   ↓
2. Token JWT é obtido
   ↓
3. useNotifications é inicializado
   ↓
4. notificationApi.connect(token, userId) é chamado
   ↓
5. WebSocket conecta com autenticação
   ↓
6. Evento 'connect' é recebido
   ↓
7. socket.emit('join', userId) é enviado
   ↓
8. Backend inscreve usuário no canal
   ↓
9. subscriptionToCompany(companyId) é chamado (se houver empresa selecionada)
   ↓
10. Conexão estabelecida
```

### Código de Conexão

```typescript
// src/services/notificationApi.ts
connect(token: string, userId?: string): void {
  const notificationsUrl = `${API_BASE_URL}/notifications`;
  
  this.socket = io(notificationsUrl, {
    auth: { token },
    transports: ['websocket'],
    reconnection: false,
  });

  this.setupEventHandlers(userId);
}

// No setupEventHandlers
this.socket.on('connect', () => {
  if (userId) {
    this.socket?.emit('join', userId);  // Entrar no canal do usuário
  }
  this.emit('connected', { connected: true });
});
```

### Inscrição por Empresa

```typescript
// Após conectar, inscrever na empresa atual
if (selectedCompany?.id) {
  notificationApi.subscribeToCompany(selectedCompany.id);
}

// Método
subscribeToCompany(companyId: string): void {
  this.socket.emit('subscribe_company', { companyId });
}
```

### Reconexão Automática

O sistema implementa reconexão automática com **exponential backoff**:

```typescript
private handleReconnect(): void {
  this.reconnectAttempts++;
  
  // Exponential backoff: 1s, 2s, 4s, 8s, ... até 30s
  const exponentialDelay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
  const delay = Math.min(exponentialDelay, this.maxReconnectDelay);
  
  setTimeout(() => {
    if (this.currentToken) {
      this.connect(this.currentToken, this.currentUserId);
    }
  }, delay);
}
```

**Reconexão também é disparada quando:**
- Usuário volta à aba do navegador (visibilitychange)
- Conexão de internet é restaurada (online event)

---

## 📡 Eventos WebSocket

### Eventos Recebidos do Servidor

#### 1. `connect`

Evento quando a conexão WebSocket é estabelecida.

```typescript
socket.on('connect', () => {
  console.log('✅ Conectado ao WebSocket de notificações');
  // Emitir 'join' para entrar no canal do usuário
  socket.emit('join', userId);
});
```

#### 2. `notifications_connected`

Confirmação de conexão do servidor.

```typescript
socket.on('notifications_connected', (data) => {
  console.log('✅ Confirmação de conexão:', data);
});
```

#### 3. `notification` ⭐ **PRINCIPAL**

Nova notificação recebida.

**Payload:**
```typescript
{
  id: string;
  type: string;              // 'property_match', 'client', 'document', etc.
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  read: boolean;
  readAt: Date | null;
  actionUrl: string | null;
  entityType: string | null;  // 'property', 'client', 'document', etc.
  entityId: string | null;
  metadata: Record<string, any> | null;
  userId: string;
  companyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Handler:**
```typescript
socket.on('notification', (data: Notification) => {
  // Adicionar à lista de notificações
  setNotifications(prev => [data, ...prev]);
  
  // Incrementar badge se não lida
  if (!data.read) {
    setUnreadCount(prev => prev + 1);
  }
});
```

#### 4. `badge_update` ⭐ **CRÍTICO PARA BADGES**

Atualização do contador total de notificações não lidas.

**Payload:**
```typescript
{
  unreadCount: number;  // Contador total de não lidas
}
```

**Handler:**
```typescript
socket.on('badge_update', (data: { unreadCount: number }) => {
  // Atualizar contador total
  setUnreadCount(data.unreadCount);
  
  // Isso dispara atualização automática dos badges no drawer
});
```

**Quando é Enviado:**
- Quando uma nova notificação é criada
- Quando uma notificação é marcada como lida
- Quando todas as notificações são marcadas como lidas
- Quando uma notificação é deletada

#### 5. `notification_read`

Notificação foi marcada como lida (em outro dispositivo/sessão).

**Payload:**
```typescript
{
  notificationId: string;
}
```

**Handler:**
```typescript
socket.on('notification_read', (data: { notificationId: string }) => {
  // Atualizar notificação na lista
  setNotifications(prev =>
    prev.map(n => n.id === data.notificationId 
      ? { ...n, read: true } 
      : n
    )
  );
  
  // Decrementar badge
  setUnreadCount(prev => Math.max(0, prev - 1));
});
```

#### 6. `disconnect`

Conexão foi perdida.

```typescript
socket.on('disconnect', (reason) => {
  console.log('❌ Desconectado:', reason);
  // Iniciar tentativas de reconexão
});
```

#### 7. `connect_error`

Erro ao conectar.

```typescript
socket.on('connect_error', (error) => {
  console.error('❌ Erro de conexão:', error);
  // Iniciar tentativas de reconexão
});
```

### Eventos Enviados ao Servidor

#### 1. `join`

Entrar no canal do usuário (ao conectar).

```typescript
socket.emit('join', userId);
```

#### 2. `subscribe_company`

Inscrever-se para receber notificações de uma empresa.

```typescript
socket.emit('subscribe_company', { companyId: 'company-123' });
```

#### 3. `unsubscribe_company`

Cancelar inscrição de uma empresa.

```typescript
socket.emit('unsubscribe_company', { companyId: 'company-123' });
```

---

## 🎯 Sistema de Badges

### Badge Total vs Badges por Rota

O sistema possui **dois tipos de badges**:

1. **Badge Total**: Contador geral de notificações não lidas (usado no ícone principal)
2. **Badges por Rota**: Contadores específicos por seção (usado no drawer/navegação)

### Badge Total

O badge total é atualizado diretamente via WebSocket através do evento `badge_update`:

```typescript
// useNotifications hook
const handleBadgeUpdate = (count: number) => {
  setUnreadCount(count);  // Atualiza contador total
};

notificationApi.on('badge_update', handleBadgeUpdate);
```

**Fonte:** Vem direto do backend via WebSocket, sempre sincronizado.

### Badges por Rota

Os badges por rota são calculados no frontend baseado nas notificações recebidas:

```typescript
// useNotificationCounts hook
const countsByRoute = useMemo(() => {
  const counts: Record<string, number> = {};
  
  // Inicializar contadores para todas as rotas
  Object.keys(routeToNotificationTypes).forEach(route => {
    counts[route] = 0;
  });
  
  // Contar notificações não lidas por rota
  notifications.forEach(notification => {
    if (notification.read) return;
    
    Object.entries(routeToNotificationTypes).forEach(([route, types]) => {
      if (types.includes(notification.type) || 
          types.includes(notification.entityType || '')) {
        counts[route] = (counts[route] || 0) + 1;
      }
    });
  });
  
  return counts;
}, [notifications]);
```

**Fonte:** Calculado localmente baseado nas notificações recebidas.

---

## 🗺️ Mapeamento de Rotas

### Mapeamento Rota → Tipos de Notificação

```typescript
const routeToNotificationTypes: Record<string, string[]> = {
  '/inspections': ['inspection', 'inspection_approval'],
  '/rentals': ['rental'],
  '/keys': ['key'],
  '/financial': ['payment', 'inspection_approval'],
  '/clients': ['client', 'document'],
  '/properties': ['property', 'property_match', 'document'],
  '/matches': ['property_match'],
  '/tasks': ['task'],
  '/appointments': ['appointment', 'appointment_invite'],
  '/notes': ['note'],
  '/messages': ['message'],
  '/subscriptions': ['subscription'],
};
```

### Como Funciona

1. **Cada rota** tem uma lista de **tipos de notificação** associados
2. Quando uma notificação chega, seu `type` ou `entityType` é comparado com os tipos da rota
3. Se houver match, o contador daquela rota é incrementado
4. O badge é exibido no item de navegação correspondente

### Exemplo

```typescript
// Notificação recebida:
{
  type: 'property_match',
  entityType: 'property_match',
  read: false
}

// Rotas que recebem badge:
- '/properties' (tem 'property_match' na lista)
- '/matches' (tem 'property_match' na lista)
```

---

## 🎨 Implementação no Drawer

### Estrutura no Drawer

O Drawer renderiza badges nos ícones de navegação da seguinte forma:

```typescript
// src/components/layout/Drawer.tsx

// 1. Obter hook de contadores
const { getCountForRoute } = useNotificationCounts();

// 2. Para cada item de navegação
const renderNavigationItem = (item: NavigationItem) => {
  // 3. Calcular contador para a rota
  const notificationRoute = item.notificationRoute || item.path;
  let notificationCount = 0;
  
  if (notificationRoute) {
    notificationCount = getCountForRoute(notificationRoute);
    
    // Se tem children, somar contadores dos filhos também
    if (hasChildren) {
      filteredChildren.forEach(child => {
        const childRoute = child.notificationRoute || child.path;
        if (childRoute) {
          notificationCount += getCountForRoute(childRoute);
        }
      });
    }
  }
  
  // 4. Renderizar badge condicionalmente
  return (
    <>
      <NavigationIcon style={{ position: 'relative' }}>
        <item.icon size={20} />
        {/* Badge quando drawer FECHADO (absolute position) */}
        {notificationCount > 0 && !isOpen && (
          <NotificationBadge $isOpen={false} $isActive={isActive}>
            {notificationCount > 99 ? '99+' : notificationCount}
          </NotificationBadge>
        )}
      </NavigationIcon>
      
      <NavigationText>{item.title}</NavigationText>
      
      {/* Badge quando drawer ABERTO (inline) */}
      {notificationCount > 0 && isOpen && (
        <NotificationBadge $isOpen={true} $isActive={isActive}>
          {notificationCount > 99 ? '99+' : notificationCount}
        </NotificationBadge>
      )}
    </>
  );
};
```

### Estilos do Badge

```typescript
// src/styles/components/DrawerStyles.ts
export const NotificationBadge = styled.span<{ 
  $isOpen: boolean; 
  $isActive?: boolean 
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  // Tamanho varia conforme drawer aberto/fechado
  min-width: ${props => props.$isOpen ? '20px' : '16px'};
  height: ${props => props.$isOpen ? '20px' : '16px'};
  padding: ${props => props.$isOpen ? '0 6px' : '0 3px'};
  
  // Cor: primary se item ativo, vermelho (#ef4444) se inativo
  background: ${props => props.$isActive 
    ? props.theme.colors.primary 
    : '#ef4444'};
  color: white;
  border-radius: ${props => props.$isOpen ? '10px' : '8px'};
  font-size: ${props => props.$isOpen ? '0.7rem' : '0.6rem'};
  font-weight: 600;
  line-height: 1;
  
  // Posicionamento
  margin-left: ${props => props.$isOpen ? '8px' : '0'};
  position: ${props => props.$isOpen ? 'relative' : 'absolute'};
  
  // Quando fechado, posição absoluta no canto superior direito do ícone
  ${props => !props.$isOpen && `
    top: -2px;
    right: -2px;
    border: 2px solid ${props.theme.colors.cardBackground};
  `}
  
  flex-shrink: 0;
  transition: all 0.3s ease;
  z-index: 1;
`;
```

### Comportamento do Badge

- **Drawer Fechado**: Badge aparece como círculo pequeno no canto superior direito do ícone (position: absolute)
- **Drawer Aberto**: Badge aparece como pill ao lado do texto (position: relative, inline)
- **Limite**: Mostra "99+" se contador > 99
- **Visibilidade**: Só aparece se `notificationCount > 0`
- **Cor**: Vermelho (#ef4444) por padrão, primary se item está ativo

---

## 🎣 Hooks e Serviços

### useNotifications

**Localização:** `src/hooks/useNotifications.ts`

**Interface:**
```typescript
interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;          // ⭐ Contador total (vem do WebSocket)
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

**Funcionalidades Principais:**
- Conecta WebSocket automaticamente
- Escuta eventos `notification`, `badge_update`, `notification_read`
- Mantém lista de notificações sincronizada
- Atualiza `unreadCount` em tempo real
- Gerencia reconexão automática

**Uso:**
```typescript
const { notifications, unreadCount, connected } = useNotifications();
```

### useNotificationCounts

**Localização:** `src/hooks/useNotificationCounts.ts`

**Interface:**
```typescript
interface UseNotificationCountsReturn {
  countsByRoute: Record<string, number>;  // { '/clients': 5, '/properties': 3, ... }
  getCountForRoute: (route: string) => number;
  getTotalCount: () => number;
  unreadCount: number;
}
```

**Funcionalidades Principais:**
- Calcula contadores por rota baseado em `routeToNotificationTypes`
- Recalcula automaticamente quando `notifications` muda
- Retorna função para obter contador de rota específica
- Retorna contador total

**Uso:**
```typescript
const { getCountForRoute, getTotalCount } = useNotificationCounts();

const clientCount = getCountForRoute('/clients');  // 5
const totalCount = getTotalCount();                // 12
```

### NotificationApiService

**Localização:** `src/services/notificationApi.ts`

**Métodos Principais:**

```typescript
class NotificationApiService {
  // WebSocket
  connect(token: string, userId?: string): void;
  disconnect(): void;
  subscribeToCompany(companyId: string): void;
  unsubscribeFromCompany(companyId: string): void;
  isConnected(): boolean;
  
  // Event Listeners
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  
  // REST API
  getNotifications(params?: NotificationQueryParams): Promise<NotificationListResponse>;
  getUnreadCount(companyId?: string): Promise<number>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(companyId?: string): Promise<{ affected: number; unreadCount: number }>;
  deleteNotification(id: string): Promise<void>;
}
```

---

## 📱 Exemplo de Implementação (Mobile)

### Estrutura Básica

Para implementar badges no mobile (React Native, Flutter, etc.), siga a mesma estrutura:

#### 1. Conexão WebSocket

```typescript
// Exemplo React Native com Socket.IO Client
import io from 'socket.io-client';

const socket = io('ws://api.imobx.com/notifications', {
  auth: { token: jwtToken },
  transports: ['websocket'],
});

// Conectar
socket.on('connect', () => {
  socket.emit('join', userId);
  socket.emit('subscribe_company', { companyId });
});
```

#### 2. Estado de Notificações

```typescript
const [notifications, setNotifications] = useState<Notification[]>([]);
const [unreadCount, setUnreadCount] = useState(0);
const [countsByRoute, setCountsByRoute] = useState<Record<string, number>>({});
```

#### 3. Listeners de Eventos

```typescript
// Nova notificação
socket.on('notification', (data: Notification) => {
  setNotifications(prev => [data, ...prev]);
  if (!data.read) {
    setUnreadCount(prev => prev + 1);
    updateRouteCounts(data, 1); // Incrementar contador da rota
  }
});

// Atualização de badge (contador total)
socket.on('badge_update', (data: { unreadCount: number }) => {
  setUnreadCount(data.unreadCount);
});

// Notificação lida
socket.on('notification_read', (data: { notificationId: string }) => {
  setNotifications(prev =>
    prev.map(n => n.id === data.notificationId ? { ...n, read: true } : n)
  );
  setUnreadCount(prev => Math.max(0, prev - 1));
  // Decrementar contador da rota correspondente
});
```

#### 4. Cálculo de Badges por Rota

```typescript
const routeToNotificationTypes: Record<string, string[]> = {
  '/clients': ['client', 'document'],
  '/properties': ['property', 'property_match', 'document'],
  '/matches': ['property_match'],
  '/tasks': ['task'],
  // ... (mesmo mapeamento do frontend)
};

const calculateRouteCounts = (notifications: Notification[]) => {
  const counts: Record<string, number> = {};
  
  // Inicializar
  Object.keys(routeToNotificationTypes).forEach(route => {
    counts[route] = 0;
  });
  
  // Contar
  notifications.forEach(notification => {
    if (notification.read) return;
    
    Object.entries(routeToNotificationTypes).forEach(([route, types]) => {
      if (types.includes(notification.type) || 
          types.includes(notification.entityType || '')) {
        counts[route] = (counts[route] || 0) + 1;
      }
    });
  });
  
  return counts;
};

// Atualizar quando notificações mudarem
useEffect(() => {
  const counts = calculateRouteCounts(notifications);
  setCountsByRoute(counts);
}, [notifications]);
```

#### 5. Renderização do Badge no Ícone

```typescript
// Exemplo React Native
import { View, Text, StyleSheet } from 'react-native';

const NavigationItem = ({ route, icon, title }) => {
  const count = countsByRoute[route] || 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {count > 99 ? '99+' : count}
            </Text>
          </View>
        )}
      </View>
      <Text>{title}</Text>
      {count > 0 && (
        <View style={styles.badgeInline}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff', // ou cor de fundo
  },
  badgeInline: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
```

#### 6. Badge no Ícone Principal de Notificações

```typescript
// Badge total (ícone de notificações no header)
const NotificationIcon = () => {
  return (
    <View style={styles.iconContainer}>
      <BellIcon />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};
```

---

## 🔄 Fluxos de Atualização

### Fluxo: Nova Notificação Recebida

```
1. Backend cria notificação
   ↓
2. Backend envia via WebSocket:
   - Evento 'notification' (dados completos)
   - Evento 'badge_update' (contador total)
   ↓
3. Frontend recebe 'notification':
   - Adiciona à lista de notificações
   - Incrementa unreadCount localmente (se não lida)
   ↓
4. Frontend recebe 'badge_update':
   - Atualiza unreadCount com valor do servidor (source of truth)
   ↓
5. useNotificationCounts recalcula countsByRoute:
   - Itera sobre todas as notificações não lidas
   - Conta por rota baseado em routeToNotificationTypes
   ↓
6. Drawer re-renderiza:
   - getCountForRoute é chamado para cada item
   - Badge é exibido se count > 0
```

### Fluxo: Marcar Notificação como Lida

```
1. Usuário marca notificação como lida (via UI)
   ↓
2. Frontend chama markAsRead(id) (REST API)
   ↓
3. Backend atualiza notificação
   ↓
4. Backend envia via WebSocket:
   - Evento 'notification_read' (notificationId)
   - Evento 'badge_update' (novo contador total)
   ↓
5. Frontend recebe 'notification_read':
   - Atualiza notificação na lista (read: true)
   - Decrementa unreadCount localmente
   ↓
6. Frontend recebe 'badge_update':
   - Atualiza unreadCount com valor do servidor
   ↓
7. useNotificationCounts recalcula:
   - Notificação não é mais contada (read: true)
   - Contador da rota é decrementado
   ↓
8. Badge é atualizado/removido no drawer
```

### Fluxo: Marcar Todas como Lidas

```
1. Usuário clica em "Marcar todas como lidas"
   ↓
2. Frontend zera unreadCount imediatamente (feedback visual)
   ↓
3. Frontend chama markAllAsRead() (REST API)
   ↓
4. Backend marca todas como lidas
   ↓
5. Backend envia via WebSocket:
   - Evento 'badge_update' (unreadCount: 0)
   ↓
6. Frontend recebe 'badge_update':
   - unreadCount já está em 0 (ou atualiza se necessário)
   ↓
7. Frontend atualiza todas as notificações (read: true)
   ↓
8. useNotificationCounts recalcula:
   - Todos os contadores ficam em 0
   ↓
9. Todos os badges são removidos
```

### Fluxo: Reconexão após Desconexão

```
1. Conexão WebSocket é perdida
   ↓
2. Evento 'disconnect' é recebido
   ↓
3. handleReconnect() inicia:
   - Calcula delay com exponential backoff
   - Agenda reconexão
   ↓
4. Após delay, connect() é chamado novamente
   ↓
5. WebSocket reconecta
   ↓
6. Evento 'connect' é recebido
   ↓
7. socket.emit('join', userId) é enviado
   ↓
8. subscriptionToCompany é chamado
   ↓
9. Frontend carrega notificações via REST API (sincronização)
   ↓
10. Badges são atualizados com dados sincronizados
```

---

## 🛠️ Troubleshooting

### Badge não Atualiza

**Problema:** Badge não atualiza quando nova notificação chega.

**Soluções:**
1. Verificar se WebSocket está conectado: `notificationApi.isConnected()`
2. Verificar se evento `badge_update` está sendo recebido
3. Verificar se `unreadCount` está sendo atualizado no estado
4. Verificar se `useNotificationCounts` está recalculando quando `notifications` muda
5. Verificar console para erros de WebSocket

### Badge Mostra Número Errado

**Problema:** Badge mostra número diferente do esperado.

**Soluções:**
1. Verificar mapeamento `routeToNotificationTypes` - tipos devem corresponder
2. Verificar se `notification.type` e `notification.entityType` estão corretos
3. Verificar se notificações estão sendo marcadas como `read: true` corretamente
4. Sincronizar com backend: chamar `loadNotifications()` para recarregar

### WebSocket não Conecta

**Problema:** Conexão WebSocket falha.

**Soluções:**
1. Verificar token JWT válido
2. Verificar userId disponível no localStorage
3. Verificar URL do WebSocket (API_BASE_URL)
4. Verificar console para erros de conexão
5. Verificar se não está bloqueado por CORS/firewall
6. Tentar reconexão manual

### Badge Some e Volta

**Problema:** Badge desaparece e reaparece.

**Causa:** Conflito entre atualização local e WebSocket.

**Solução:**
- Sempre priorizar `badge_update` do WebSocket como source of truth
- Evitar decrementar/incrementar manualmente quando WebSocket está ativo
- Aguardar resposta do servidor antes de atualizar UI

### Badge não Some ao Marcar como Lida

**Problema:** Badge continua mostrando após marcar como lida.

**Soluções:**
1. Verificar se `notification.read` está sendo atualizado
2. Verificar se `useNotificationCounts` está filtrando `read: true`
3. Verificar se evento `notification_read` está sendo recebido
4. Verificar se `badge_update` está sendo recebido com contador correto

---

## 📝 Notas Técnicas

### Performance

- **Memoização**: `countsByRoute` é calculado com `useMemo` para evitar recálculos desnecessários
- **Re-renders**: Badges só re-renderizam quando contadores mudam
- **WebSocket**: Conexão única compartilhada (singleton pattern)

### Sincronização

- **Source of Truth**: Contador total vem do servidor via `badge_update`
- **Cálculo Local**: Badges por rota são calculados localmente (não vêm do servidor)
- **Consistência**: Se houver divergência, `badge_update` do servidor prevalece

### Multitenancy

- Cada empresa tem suas próprias notificações
- Ao mudar empresa, `subscribeToCompany` é chamado
- Notificações são filtradas por `companyId`

### Estado Offline

- Notificações são cacheadas localmente
- Ao reconectar, sincronização automática via REST API
- Badges são atualizados após sincronização

---

## 🚀 Exemplo Completo (Mobile)

### Componente de Navegação com Badges

```typescript
// NavigationTab.tsx (exemplo React Native)
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const routeToNotificationTypes = {
  '/clients': ['client', 'document'],
  '/properties': ['property', 'property_match', 'document'],
  '/matches': ['property_match'],
  '/tasks': ['task'],
  // ... outros mapeamentos
};

const NavigationTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [countsByRoute, setCountsByRoute] = useState({});

  useEffect(() => {
    // 1. Conectar WebSocket
    const socket = io('ws://api.imobx.com/notifications', {
      auth: { token: jwtToken },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('join', userId);
      socket.emit('subscribe_company', { companyId });
    });

    // 2. Listener de nova notificação
    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
      if (!data.read) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // 3. Listener de atualização de badge
    socket.on('badge_update', (data) => {
      setUnreadCount(data.unreadCount);
    });

    // 4. Listener de notificação lida
    socket.on('notification_read', (data) => {
      setNotifications(prev =>
        prev.map(n => n.id === data.notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    // 5. Carregar notificações iniciais (REST API)
    loadInitialNotifications();

    return () => socket.disconnect();
  }, []);

  // 6. Calcular badges por rota
  useEffect(() => {
    const counts = {};
    Object.keys(routeToNotificationTypes).forEach(route => {
      counts[route] = 0;
    });

    notifications.forEach(notification => {
      if (notification.read) return;

      Object.entries(routeToNotificationTypes).forEach(([route, types]) => {
        if (types.includes(notification.type) || 
            types.includes(notification.entityType || '')) {
          counts[route] = (counts[route] || 0) + 1;
        }
      });
    });

    setCountsByRoute(counts);
  }, [notifications]);

  const getCountForRoute = (route: string) => {
    return countsByRoute[route] || 0;
  };

  return (
    <View style={styles.container}>
      <TabItem 
        route="/clients" 
        icon={<ClientsIcon />} 
        count={getCountForRoute('/clients')}
      />
      <TabItem 
        route="/properties" 
        icon={<PropertiesIcon />} 
        count={getCountForRoute('/properties')}
      />
      {/* Badge total no ícone de notificações */}
      <NotificationIcon count={unreadCount} />
    </View>
  );
};

const TabItem = ({ route, icon, count }) => (
  <TouchableOpacity style={styles.tabItem}>
    <View style={styles.iconContainer}>
      {icon}
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
```

---

## ✅ Checklist de Implementação (Mobile)

- [ ] Conectar WebSocket com autenticação
- [ ] Emitir evento 'join' com userId
- [ ] Emitir 'subscribe_company' com companyId
- [ ] Implementar listener para 'notification'
- [ ] Implementar listener para 'badge_update'
- [ ] Implementar listener para 'notification_read'
- [ ] Carregar notificações iniciais via REST API
- [ ] Implementar mapeamento `routeToNotificationTypes`
- [ ] Calcular `countsByRoute` baseado em notificações
- [ ] Criar função `getCountForRoute(route)`
- [ ] Renderizar badge no ícone de cada rota
- [ ] Renderizar badge total no ícone de notificações
- [ ] Implementar reconexão automática
- [ ] Sincronizar ao reconectar
- [ ] Atualizar badges quando notificações mudam

---

**Última atualização:** Janeiro 2025

