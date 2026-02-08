# 📡 Eventos WebSocket do Chat - Status de Implementação

## 📋 Resumo

Este documento descreve os eventos WebSocket do sistema de chat e seu status de implementação. **✅ TODOS OS EVENTOS ESTÃO IMPLEMENTADOS** conforme a documentação do backend atualizada em 2025-11-22.

## ✅ Eventos Implementados e Validados

### 1. `participant_left`
**Status:** ✅ Implementado conforme documentação

**Descrição:** Disparado quando um participante sai de um grupo.

**Payload (Conforme documentação do backend):**
```typescript
{
  roomId: string;
  userId: string;
  userName: string;
  leftAt: string;
  timestamp: string;
  removedBy?: string;        // ID do usuário que removeu (se foi removido)
  removedByName?: string;    // Nome do usuário que removeu (se foi removido)
  isRemoved?: boolean;       // true se foi removido, false se saiu voluntariamente
}
```

**Onde disparar:**
- Quando um usuário sai voluntariamente do grupo
- Quando um admin remove um participante do grupo

**Importante:** 
- Se `isRemoved === true` ou `removedBy` estiver presente, significa que foi removido por um admin
- Se `isRemoved === false` ou ausente, significa que o usuário saiu voluntariamente

---

## ✅ Novos Eventos Implementados

### 1. `participant_added`
**Status:** ✅ Implementado conforme documentação

**Descrição:** Disparado quando um participante é adicionado a um grupo via API ou por outro usuário.

**Payload Esperado:**
```typescript
{
  roomId: string;
  userId: string;           // ID do usuário adicionado
  userName: string;         // Nome do usuário adicionado
  userAvatar?: string;      // Avatar do usuário (opcional)
  addedBy?: string;         // ID do usuário que adicionou (opcional, pode ser sistema)
  addedByName?: string;     // Nome do usuário que adicionou (opcional)
  timestamp: string;        // ISO string do timestamp
}
```

**Onde disparar:**
- Quando um admin adiciona participantes ao grupo via API `POST /chat/rooms/:roomId/participants`
- Deve ser disparado para TODOS os participantes da sala (broadcast)

**Exemplo de uso no backend:**
```javascript
// Após adicionar participantes com sucesso
socket.to(roomId).emit('participant_added', {
  roomId,
  userId: newParticipant.id,
  userName: newParticipant.name,
  userAvatar: newParticipant.avatar,
  addedBy: currentUser.id,
  addedByName: currentUser.name,
  timestamp: new Date().toISOString()
});
```

---

### 2. `participant_removed`
**Status:** ✅ Implementado conforme documentação

**Descrição:** Disparado quando um participante é REMOVIDO do grupo por um admin (diferente de `participant_left` que é para saída voluntária).

**Payload Esperado:**
```typescript
{
  roomId: string;
  userId: string;           // ID do usuário removido
  userName: string;         // Nome do usuário removido
  removedBy: string;        // ID do usuário que removeu (obrigatório)
  removedByName: string;    // Nome do usuário que removeu (obrigatório)
  timestamp: string;        // ISO string do timestamp
}
```

**Onde disparar:**
- Quando um admin remove um participante via API `DELETE /chat/rooms/:roomId/participants/:userId`
- Deve ser disparado para TODOS os participantes da sala (broadcast)

**Exemplo de uso no backend:**
```javascript
// Após remover participante com sucesso
socket.to(roomId).emit('participant_removed', {
  roomId,
  userId: removedParticipant.id,
  userName: removedParticipant.name,
  removedBy: currentUser.id,
  removedByName: currentUser.name,
  timestamp: new Date().toISOString()
});
```

**Nota:** Se preferir manter apenas `participant_left` com os campos adicionais (`isRemoved`, `removedBy`), o frontend pode funcionar assim também. Mas ter um evento separado `participant_removed` é mais claro.

---

### 3. `room_updated`
**Status:** ✅ Implementado conforme documentação

**Descrição:** Disparado quando informações de uma sala são atualizadas (nome, imagem, etc).

**Payload Esperado:**
```typescript
{
  roomId: string;
  name?: string;            // Novo nome da sala (se foi alterado)
  imageUrl?: string;        // Nova imagem da sala (se foi alterado)
  updatedBy?: string;       // ID do usuário que atualizou (opcional)
  updatedByName?: string;   // Nome do usuário que atualizou (opcional)
  timestamp: string;        // ISO string do timestamp
}
```

**Onde disparar:**
- Quando o nome da sala é atualizado via API `PATCH /chat/rooms/:roomId`
- Quando a imagem da sala é atualizada via API `POST /chat/rooms/:roomId/image`
- Deve ser disparado para TODOS os participantes da sala (broadcast)

**Exemplo de uso no backend:**
```javascript
// Após atualizar sala com sucesso
socket.to(roomId).emit('room_updated', {
  roomId,
  name: updatedRoom.name,        // Só incluir se foi alterado
  imageUrl: updatedRoom.imageUrl, // Só incluir se foi alterado
  updatedBy: currentUser.id,
  updatedByName: currentUser.name,
  timestamp: new Date().toISOString()
});
```

---

## ✅ Evento `message_deleted` - Atualizado

**Status:** ✅ Implementado conforme documentação

O evento `message_deleted` agora inclui informações opcionais sobre quem deletou a mensagem:

```typescript
{
  roomId: string;
  messageId: string;
  timestamp: string;
  deletedBy?: {
    userId: string;
    userName: string;
  };
}
```

---

## 📊 Resumo de Eventos

| Evento | Status | Descrição |
|--------|--------|-----------|
| `participant_left` | ✅ Implementado | Evento quando participante sai voluntariamente ou é removido |
| `participant_added` | ✅ Implementado | Evento quando participante é adicionado ao grupo |
| `participant_removed` | ✅ Implementado | Evento quando participante é removido por admin |
| `room_updated` | ✅ Implementado | Evento quando sala é atualizada (nome, imagem) |
| `message_deleted` | ✅ Atualizado | Evento quando mensagem é deletada (inclui `deletedBy`) |

---

## 🎯 Comportamento Esperado

### Quando um usuário sai voluntariamente:
1. Backend recebe `DELETE /chat/rooms/:roomId/leave` ou similar
2. Backend dispara `participant_left` com:
   ```typescript
   {
     roomId,
     userId,
     userName,
     leftAt,
     timestamp,
     // NÃO incluir removedBy, removedByName, isRemoved
   }
   ```
3. Frontend mostra: "Nome do usuário saiu do grupo"

### Quando um admin remove um usuário:
1. Backend recebe `DELETE /chat/rooms/:roomId/participants/:userId`
2. Backend dispara `participant_removed` OU `participant_left` com:
   ```typescript
   {
     roomId,
     userId,
     userName,
     removedBy: adminId,
     removedByName: adminName,
     isRemoved: true,
     timestamp
   }
   ```
3. Frontend mostra: "Nome do usuário foi removido do grupo por Nome do Admin"

### Quando um participante é adicionado:
1. Backend recebe `POST /chat/rooms/:roomId/participants`
2. Backend dispara `participant_added` para TODOS os participantes da sala:
   ```typescript
   {
     roomId,
     userId: newUserId,
     userName: newUserName,
     userAvatar: newUserAvatar,
     addedBy: adminId,
     addedByName: adminName,
     timestamp
   }
   ```
3. Frontend mostra: "Nome do usuário foi adicionado ao grupo por Nome do Admin"

### Quando uma sala é atualizada:
1. Backend recebe `PATCH /chat/rooms/:roomId` ou `POST /chat/rooms/:roomId/image`
2. Backend dispara `room_updated` para TODOS os participantes da sala:
   ```typescript
   {
     roomId,
     name: newName,        // Só se foi alterado
     imageUrl: newImageUrl, // Só se foi alterado
     updatedBy: adminId,
     updatedByName: adminName,
     timestamp
   }
   ```
3. Frontend atualiza automaticamente o nome/imagem da sala para todos os usuários

---

## ⚠️ Notas Importantes

1. **Broadcast**: Todos os eventos são enviados para TODOS os participantes da sala, não apenas para quem realizou a ação
2. **Timestamp**: Sempre usar ISO string para timestamp
3. **Campos opcionais**: Campos opcionais podem ser omitidos se não aplicáveis
4. **Frontend**: O frontend está totalmente alinhado com a documentação do backend e todos os eventos estão sendo tratados corretamente

---

## ✅ Status Final

**Todos os eventos WebSocket necessários estão implementados e funcionando conforme a documentação do backend atualizada em 2025-11-22.**

O frontend está preparado para receber e processar todos os eventos em tempo real, garantindo uma experiência de usuário fluida e sincronizada.


