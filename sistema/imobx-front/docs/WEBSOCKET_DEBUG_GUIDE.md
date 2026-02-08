# 🐛 Guia de Debug - WebSocket de Notificações

## 📝 Logs Ativados

Os logs de debug foram ativados nos seguintes arquivos:

### 1. `src/services/notificationApi.ts`
✅ Logs de conexão
✅ Logs de eventos
✅ Logs de erros detalhados

### 2. `src/hooks/useNotifications.ts`
✅ Logs de inicialização
✅ Logs de estado de conexão
✅ Logs de notificações recebidas

## 🔍 Como Verificar

### Passo 1: Abrir DevTools
1. Pressione `F12` ou clique com botão direito → Inspecionar
2. Vá para a aba **Console**

### Passo 2: Filtrar Logs
No console, você pode filtrar por:
- `[NotificationService]` - Logs do serviço
- `[useNotifications]` - Logs do hook

### Passo 3: Verificar Sequência de Logs

**Sequência Normal (Sucesso):**
```
1. [useNotifications] 🚀 Inicializando WebSocket...
2. [useNotifications] 👤 UserId: xxx-xxx-xxx
3. [NotificationService] 🔌 Conectando ao WebSocket: http://localhost:3000/notifications
4. [NotificationService] 👤 UserId: xxx-xxx-xxx
5. [NotificationService] 🔑 Token presente: true
6. [NotificationService] ✅ Conectado ao WebSocket de notificações
7. [NotificationService] 📡 Entrando no canal do usuário: xxx-xxx-xxx
8. [useNotifications] ✅ WebSocket conectado com sucesso!
9. [useNotifications] 🏢 Inscrevendo na empresa: yyy-yyy-yyy
10. [NotificationService] ✅ Confirmação de conexão recebida: {...}
```

**Sequência com Erro (Token):**
```
1. [useNotifications] 🚀 Inicializando WebSocket...
2. [useNotifications] ❌ Token não encontrado! Não é possível conectar ao WebSocket
```

**Sequência com Erro (Conexão):**
```
1. [useNotifications] 🚀 Inicializando WebSocket...
2. [useNotifications] 👤 UserId: xxx-xxx-xxx
3. [NotificationService] 🔌 Conectando ao WebSocket: http://localhost:3000/notifications
4. [NotificationService] 👤 UserId: xxx-xxx-xxx
5. [NotificationService] 🔑 Token presente: true
6. [NotificationService] ❌ Erro de conexão: Error: xhr poll error
7. [NotificationService] 📋 Detalhes do erro: {...}
```

## 🧪 Painel de Debug (Desenvolvimento)

Um painel de debug visual foi criado em `src/components/debug/WebSocketDebugPanel.tsx`.

### Como Usar:

#### Opção 1: Adicionar no Layout (Desenvolvimento)
```typescript
// Em src/components/layout/Layout.tsx
import { WebSocketDebugPanel } from '../debug/WebSocketDebugPanel';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* ... resto do código */}
      <WebSocketDebugPanel />
    </>
  );
};
```

#### Opção 2: Adicionar em Página Específica
```typescript
// Em qualquer página
import { WebSocketDebugPanel } from '../components/debug/WebSocketDebugPanel';

const MyPage = () => {
  return (
    <div>
      {/* ... conteúdo da página */}
      <WebSocketDebugPanel />
    </div>
  );
};
```

### Recursos do Painel:
- ✅ Indicador visual de conexão (verde/vermelho)
- ✅ Status do token
- ✅ Informações do usuário
- ✅ URLs configuradas
- ✅ Botões de ação rápida:
  - 🔄 Recarregar página
  - 🗑️ Limpar cache e fazer login novamente
  - 📋 Imprimir informações detalhadas no console

### Nota Importante:
O painel **só aparece em modo de desenvolvimento** (`import.meta.env.DEV`). Em produção, ele não é renderizado.

## 📊 Verificar Network Tab

### WebSocket Connection:
1. Abra DevTools (F12)
2. Vá para **Network**
3. Filtre por **WS** (WebSocket)
4. Deve aparecer:
   - Name: `socket.io/?EIO=...`
   - Status: `101 Switching Protocols`
   - Type: `websocket`

### Se não aparecer:
- Backend não está aceitando conexões
- URL está incorreta
- CORS bloqueando

## 🔧 Comandos Úteis no Console

### Ver Token:
```javascript
console.log('Token:', localStorage.getItem('imobx_access_token'));
```

### Ver Dados do Usuário:
```javascript
console.log('User:', JSON.parse(localStorage.getItem('imobx_user')));
```

### Ver URL da API:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### Testar Conexão Manual:
```javascript
const { io } = await import('socket.io-client');
const token = localStorage.getItem('imobx_access_token');
const user = JSON.parse(localStorage.getItem('imobx_user'));

const socket = io('http://localhost:3000/notifications', {
  auth: { token },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => console.log('✅ Conectado!'));
socket.on('connect_error', (e) => console.error('❌ Erro:', e));
socket.emit('join', user.id);
```

## 🎯 Checklist de Diagnóstico

### Frontend:
- [ ] Token existe no localStorage?
- [ ] UserId está correto?
- [ ] `VITE_API_URL` está configurada?
- [ ] Console mostra "Token não encontrado"?
- [ ] Console mostra "connect_error"?
- [ ] Network tab mostra WebSocket?

### Backend:
- [ ] Backend está rodando?
- [ ] Porta correta (3000)?
- [ ] Gateway `/notifications` existe?
- [ ] CORS configurado para permitir frontend?
- [ ] Logs do backend mostram conexão?

### Network:
- [ ] Firewall bloqueando porta?
- [ ] VPN ativa pode estar interferindo?
- [ ] Proxy configurado?

## 🆘 Soluções Rápidas

### Problema: Token não encontrado
```javascript
// Fazer logout e login novamente
localStorage.clear();
window.location.href = '/login';
```

### Problema: Erro de conexão
```javascript
// Verificar URL
console.log('URL:', import.meta.env.VITE_API_URL);
// Deve ser: http://localhost:3000
```

### Problema: WebSocket não aparece
```
// Backend não está aceitando conexões
// Verificar se backend está rodando:
curl http://localhost:3000/health
```

## 📚 Documentação Adicional

- **Troubleshooting Completo**: `docs/WEBSOCKET_TROUBLESHOOTING.md`
- **Sistema de Notificações**: `docs/NOTIFICATION_API_MIGRATION.md`
- **Implementação Frontend**: `docs/PROPERTY_MATCH_NOTIFICATIONS_FRONTEND.md`

---

**Status:** ✅ Logs Ativados  
**Painel Debug:** ✅ Disponível  
**Última Atualização:** 07/11/2025

