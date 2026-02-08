# 🔧 Troubleshooting - WebSocket de Notificações

## ❌ Problema: WebSocket não está conectando

### ✅ Passo 1: Verificar Logs no Console

Abra o DevTools (F12) e verifique os logs no console. Você deve ver:

```
[useNotifications] 🚀 Inicializando WebSocket...
[useNotifications] 👤 UserId: xxx-xxx-xxx
[NotificationService] 🔌 Conectando ao WebSocket: http://localhost:3000/notifications
[NotificationService] 👤 UserId: xxx-xxx-xxx
[NotificationService] 🔑 Token presente: true
[NotificationService] ✅ Conectado ao WebSocket de notificações
[NotificationService] 📡 Entrando no canal do usuário: xxx-xxx-xxx
[useNotifications] ✅ WebSocket conectado com sucesso!
[useNotifications] 🏢 Inscrevendo na empresa: yyy-yyy-yyy
```

### ✅ Passo 2: Identificar o Erro

#### Erro: "Token não encontrado"
```
[useNotifications] ❌ Token não encontrado! Não é possível conectar ao WebSocket
```

**Solução:**
1. Verificar se você está autenticado
2. Fazer logout e login novamente
3. Limpar localStorage e fazer novo login

#### Erro: "connect_error"
```
[NotificationService] ❌ Erro de conexão: Error: ...
```

**Causas Comuns:**
1. **Backend não está rodando**
   - Verificar se o backend está ativo
   - Testar: `curl http://localhost:3000/health`

2. **URL incorreta**
   - Verificar variável de ambiente `VITE_API_URL`
   - Padrão: `http://localhost:3000`
   - Deve apontar para o backend

3. **CORS bloqueando**
   - Backend precisa permitir conexões do frontend
   - Verificar configuração de CORS no backend

4. **Token inválido/expirado**
   - Fazer logout e login novamente
   - Verificar se o backend aceita o token

#### Erro: "transport error"
```
[NotificationService] ❌ Erro de conexão: Error: xhr poll error
```

**Solução:**
- Backend não está aceitando conexões WebSocket
- Verificar se o namespace `/notifications` existe no backend
- Testar com Postman/Insomnia

### ✅ Passo 3: Verificar Variáveis de Ambiente

Verifique o arquivo `.env` ou `.env.local`:

```bash
VITE_API_URL=http://localhost:3000
```

**Importante:**
- Não deve terminar com `/`
- Deve ser a URL completa do backend
- Após mudar, reiniciar o servidor de desenvolvimento

### ✅ Passo 4: Verificar Network Tab

1. Abra DevTools (F12)
2. Vá para a aba **Network**
3. Filtre por **WS** (WebSocket)
4. Deve aparecer uma conexão com status **101 Switching Protocols**

Se não aparecer:
- Backend não está aceitando conexões WebSocket
- Verificar configuração do Socket.IO no backend

### ✅ Passo 5: Testar Conexão Manual

Abra o console do navegador e execute:

```javascript
// Pegar token
const token = localStorage.getItem('imobx_access_token');
console.log('Token:', token ? 'Presente' : 'Ausente');

// Pegar userId
const userData = localStorage.getItem('imobx_user');
const user = JSON.parse(userData);
console.log('UserId:', user?.id);

// Testar conexão manual
const { io } = await import('socket.io-client');
const socket = io('http://localhost:3000/notifications', {
  auth: { token },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Conectado!');
  socket.emit('join', user.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Erro:', error);
});
```

### ✅ Passo 6: Verificar Backend

No backend, verifique:

1. **Gateway de Notificações existe?**
   ```typescript
   @WebSocketGateway({ namespace: '/notifications' })
   export class NotificationGateway {
     // ...
   }
   ```

2. **Está escutando conexões?**
   ```
   [WebSocket] Cliente conectado: xxx-xxx-xxx
   ```

3. **Token está sendo validado?**
   - Middleware de autenticação WebSocket
   - Decorator `@WsGuard()`

### ✅ Passo 7: Soluções Rápidas

#### Solução 1: Limpar Cache
```javascript
// No console do navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### Solução 2: Reiniciar Tudo
```bash
# Frontend
npm run dev

# Backend (em outra janela)
npm run start:dev
```

#### Solução 3: Verificar Firewall
- Firewall pode estar bloqueando a porta
- Desativar temporariamente para testar
- Adicionar exceção para a porta do backend

#### Solução 4: Usar Fallback Polling
Se WebSocket não funcionar, o Socket.IO tenta polling automaticamente:

```typescript
// Em notificationApi.ts (já configurado)
transports: ['websocket', 'polling']
```

## 🔍 Logs de Debug Ativados

Os logs de debug foram ativados automaticamente. Para desativar:

**Em `src/services/notificationApi.ts`:**
```typescript
// Mudar console.log para // console.log
console.log('[NotificationService] ...') // Ativo
// console.log('[NotificationService] ...') // Desativado
```

**Em `src/hooks/useNotifications.ts`:**
```typescript
// Mudar console.log para // console.log
console.log('[useNotifications] ...') // Ativo
// console.log('[useNotifications] ...') // Desativado
```

## 📊 Indicador Visual de Conexão

Verifique o ícone de sino no header:
- 🔴 **Ponto vermelho**: Desconectado
- 🟢 **Ponto verde**: Conectado

## 🆘 Ainda com problemas?

### Checklist Final:

- [ ] Backend está rodando?
- [ ] `VITE_API_URL` está correta?
- [ ] Token existe em `localStorage.getItem('imobx_access_token')`?
- [ ] UserId existe em `localStorage.getItem('imobx_user')`?
- [ ] Console mostra "Token não encontrado"?
- [ ] Console mostra "connect_error"?
- [ ] Network tab mostra conexão WebSocket?
- [ ] Backend logs mostram conexão?

### Informações para Suporte:

Colete estas informações:

```javascript
// Cole no console do navegador
const debugInfo = {
  token: !!localStorage.getItem('imobx_access_token'),
  userId: JSON.parse(localStorage.getItem('imobx_user') || '{}').id,
  apiUrl: import.meta.env.VITE_API_URL,
  pathname: window.location.pathname,
  timestamp: new Date().toISOString()
};
console.log('🐛 Debug Info:', debugInfo);
```

### Contato:

Se nenhuma solução funcionar:
1. Tire print dos logs do console
2. Tire print da aba Network (WebSocket)
3. Copie as informações de debug acima
4. Entre em contato com o suporte

---

**Última Atualização:** 07/11/2025  
**Versão:** 1.0.0

