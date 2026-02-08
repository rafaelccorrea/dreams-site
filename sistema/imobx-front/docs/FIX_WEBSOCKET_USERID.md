# 🔧 Fix: WebSocket UserId Undefined

## 🐛 Problema

O WebSocket de notificações estava conectando mas sendo imediatamente desconectado pelo backend devido ao UserId estar como `undefined`.

```
[useNotifications] 👤 UserId: undefined  ❌
[NotificationService] ✅ Conectado ao WebSocket
[NotificationService] ❌ Desconectado: io server disconnect
```

## ✅ Solução Aplicada

Melhorado a validação do UserId antes de tentar conectar ao WebSocket.

### Mudanças em `src/hooks/useNotifications.ts`:

1. ✅ Validação mais robusta do userData do localStorage
2. ✅ Verificação se userId existe antes de conectar
3. ✅ Mensagens de erro mais descritivas
4. ✅ Bloqueio de conexão se userId não estiver disponível

## 🚀 Como Resolver

### Solução 1: Logout e Login Novamente

Esta é a solução mais simples e geralmente resolve o problema:

1. **Faça Logout**
   - Clique no seu avatar no canto superior direito
   - Clique em "Sair"

2. **Faça Login Novamente**
   - Entre com suas credenciais
   - O sistema salvará corretamente os dados do usuário

3. **Verifique os Logs**
   - Abra o console (F12)
   - Você deve ver:
     ```
     [useNotifications] 📦 UserId do localStorage: xxx-xxx-xxx
     [useNotifications] 🚀 Inicializando WebSocket...
     [useNotifications] 👤 UserId: xxx-xxx-xxx
     [NotificationService] ✅ Conectado ao WebSocket
     ```

### Solução 2: Verificar localStorage Manualmente

Se o problema persistir, verifique os dados do localStorage:

```javascript
// Cole no console do navegador (F12)

// 1. Ver dados do usuário
const userData = localStorage.getItem('imobx_user');
console.log('📦 Dados do usuário:', userData);

// 2. Parsear e verificar estrutura
if (userData) {
  const user = JSON.parse(userData);
  console.log('👤 Objeto do usuário:', user);
  console.log('🆔 UserId:', user?.id);
} else {
  console.error('❌ Nenhum dado de usuário encontrado!');
}
```

#### Resultado Esperado:

```javascript
{
  id: "xxx-xxx-xxx",  // ← Deve ter este campo!
  name: "Seu Nome",
  email: "seu@email.com",
  role: "user",
  // ... outros campos
}
```

#### Se estiver faltando o campo `id`:

```javascript
// Limpar localStorage e fazer novo login
localStorage.clear();
window.location.href = '/login';
```

### Solução 3: Verificar Resposta do Backend no Login

O problema pode estar no backend não retornando o `id` do usuário na resposta do login.

**Verifique o Network Tab:**

1. Abra DevTools (F12)
2. Vá para a aba **Network**
3. Filtre por `login` ou `auth`
4. Faça login
5. Verifique a resposta do endpoint de login

**Resposta esperada:**
```json
{
  "user": {
    "id": "xxx-xxx-xxx",  // ← Deve estar presente!
    "name": "Nome",
    "email": "email@exemplo.com",
    "role": "user"
  },
  "token": "..."
}
```

Se o `id` não estiver na resposta, o problema é no **backend**.

## 🔍 Diagnóstico Completo

Execute este script no console para diagnóstico completo:

```javascript
console.log('=== 🔍 DIAGNÓSTICO WEBSOCKET ===');

// 1. Token
const token = localStorage.getItem('imobx_access_token');
console.log('🔑 Token:', token ? `Presente (${token.length} chars)` : '❌ Ausente');

// 2. Dados do usuário
const userData = localStorage.getItem('imobx_user');
console.log('📦 UserData:', userData ? 'Presente' : '❌ Ausente');

if (userData) {
  try {
    const user = JSON.parse(userData);
    console.log('👤 User Object:', user);
    console.log('🆔 UserId:', user?.id || '❌ UNDEFINED!');
    console.log('📧 Email:', user?.email);
    console.log('👔 Role:', user?.role);
    
    if (!user?.id) {
      console.error('❌ PROBLEMA ENCONTRADO: UserId está undefined!');
      console.error('💡 SOLUÇÃO: Faça logout e login novamente');
    }
  } catch (e) {
    console.error('❌ Erro ao parsear userData:', e);
  }
}

// 3. Company ID
const companyId = localStorage.getItem('imobx_selected_company_id');
console.log('🏢 Company ID:', companyId || 'Não definido');

// 4. API URL
const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3000';
console.log('🌐 API URL:', apiUrl);

console.log('=== FIM DO DIAGNÓSTICO ===');
```

## 📊 Verificação de Sucesso

Após aplicar a solução, você deve ver nos logs:

```
✅ [useNotifications] 📦 UserId do localStorage: xxx-xxx-xxx
✅ [useNotifications] 🚀 Inicializando WebSocket...
✅ [useNotifications] 👤 UserId: xxx-xxx-xxx
✅ [useNotifications] 🔑 Token presente: true
✅ [NotificationService] 🔌 Conectando ao WebSocket: http://localhost:3000/notifications
✅ [NotificationService] 👤 UserId: xxx-xxx-xxx
✅ [NotificationService] ✅ Conectado ao WebSocket de notificações
✅ [NotificationService] 📡 Entrando no canal do usuário: xxx-xxx-xxx
✅ [useNotifications] ✅ WebSocket conectado com sucesso!
✅ [NotificationService] ✅ Confirmação de conexão recebida
```

**Importante:** Não deve aparecer `❌ Desconectado: io server disconnect` logo após conectar.

## 🆘 Se nada funcionar

Se mesmo após logout/login o problema persistir:

1. **Verificar Backend:**
   - O backend está retornando o `id` do usuário no login?
   - O endpoint `/auth/login` retorna todos os dados necessários?

2. **Verificar Autenticação:**
   ```javascript
   // No console
   const response = await fetch('http://localhost:3000/auth/me', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('imobx_access_token')}`
     }
   });
   const data = await response.json();
   console.log('Dados do usuário do backend:', data);
   ```

3. **Contatar Suporte:**
   - Envie o resultado do script de diagnóstico
   - Informe qual solução tentou
   - Compartilhe logs do console

## 📚 Arquivos Relacionados

- `src/hooks/useNotifications.ts` - Hook de notificações (corrigido)
- `src/services/notificationApi.ts` - Serviço de WebSocket
- `src/hooks/useAuth.ts` - Hook de autenticação
- `docs/WEBSOCKET_TROUBLESHOOTING.md` - Guia completo de troubleshooting

---

**Status:** ✅ Correção Aplicada  
**Data:** 07/11/2025  
**Prioridade:** Alta  
**Solução:** Logout + Login

