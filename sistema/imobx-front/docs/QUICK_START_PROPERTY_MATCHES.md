# 🚀 Guia Rápido - Sistema de Notificações de Matches de Propriedades

## ✅ O que foi implementado

Sistema completo de notificações automáticas de matches de propriedades no **frontend**. Quando o backend detecta clientes compatíveis com uma nova propriedade, o usuário recebe notificações em tempo real.

## 📦 Arquivos Criados

### Páginas
- ✅ `src/pages/PropertyMatchesPage.tsx` - Página de matches de uma propriedade específica

### Componentes
- ✅ `src/components/notifications/PropertyMatchNotification.tsx` - Card rico de notificação
- ✅ `src/components/notifications/NotificationRenderer.tsx` - Renderizador inteligente

### Estilos
- ✅ `src/styles/pages/MatchesPageStyles.ts` - Estilos atualizados

### Utilitários
- ✅ `src/utils/notificationNavigation.ts` - Tipos e navegação atualizados

### Documentação
- ✅ `docs/PROPERTY_MATCH_NOTIFICATIONS_FRONTEND.md` - Documentação completa
- ✅ `docs/QUICK_START_PROPERTY_MATCHES.md` - Este guia

## 🔧 Integrando no NotificationCenter

### Opção 1: Usando o NotificationRenderer (Recomendado)

```typescript
import { NotificationRenderer } from '../notifications/NotificationRenderer';

// No seu NotificationCenter
{notifications.map(notification => (
  <NotificationRenderer
    key={notification.id}
    notification={notification}
    onRead={() => markAsRead(notification.id)}
    fallbackComponent={YourDefaultNotificationCard}
  />
))}
```

### Opção 2: Renderização Condicional Manual

```typescript
import { PropertyMatchNotification } from '../notifications/PropertyMatchNotification';
import { useIsPropertyMatchNotification } from '../notifications/NotificationRenderer';

// No seu NotificationCenter
{notifications.map(notification => {
  const isPropertyMatch = useIsPropertyMatchNotification(notification);
  
  if (isPropertyMatch) {
    return (
      <PropertyMatchNotification
        key={notification.id}
        notification={notification}
        onRead={() => markAsRead(notification.id)}
      />
    );
  }
  
  return <YourDefaultNotificationCard notification={notification} />;
})}
```

## 🎯 Tipos de Notificação Suportados

| Tipo | Descrição | Visual |
|------|-----------|--------|
| `property_match_found` | Match normal (60-79%) | 🏠 Borda azul |
| `property_match_high_score` | Match alta compatibilidade (80%+) | 🎯 Borda vermelha com animação |

## 🛣️ Rotas Criadas

### Nova Rota de Matches por Propriedade

```
/properties/:propertyId/matches
```

**Proteções:**
- ✅ Requer autenticação
- ✅ Requer módulo `match_system`
- ✅ Requer permissão `property:view`

**Exemplo:**
```
https://app.imobx.com/properties/abc-123/matches
```

## 📱 Fluxo Completo

```
1. Usuário cria propriedade com status AVAILABLE
   ↓
2. Backend processa matches automaticamente
   ↓
3. Backend envia notificação via WebSocket
   ↓
4. Frontend recebe notificação em tempo real
   ↓
5. NotificationCenter exibe PropertyMatchNotification
   ↓
6. Usuário clica na notificação
   ↓
7. Navega para /properties/:id/matches
   ↓
8. Visualiza lista de clientes compatíveis
   ↓
9. Pode aceitar ou ignorar matches
```

## 🎨 Exemplos de Uso

### 1. Navegação Programática

```typescript
import { getNotificationNavigationUrl } from '../utils/notificationNavigation';

const handleNotificationClick = (notification: Notification) => {
  const url = getNotificationNavigationUrl(notification);
  if (url) {
    navigate(url);
    markAsRead(notification.id);
  }
};
```

### 2. Verificar Tipo de Notificação

```typescript
import { useIsPropertyMatchNotification } from '../notifications/NotificationRenderer';

const MyComponent = ({ notification }) => {
  const isMatch = useIsPropertyMatchNotification(notification);
  
  if (isMatch) {
    // Lógica específica para matches
  }
};
```

### 3. Acessar Metadata Tipada

```typescript
import type { PropertyMatchNotificationMetadata } from '../utils/notificationNavigation';

const metadata = notification.metadata as PropertyMatchNotificationMetadata;

console.log('Propriedade:', metadata.propertyTitle);
console.log('Total de matches:', metadata.totalMatches);
console.log('High score matches:', metadata.highScoreMatches);
```

## 🎯 Estrutura de Notificação

```typescript
{
  "id": "notif-123",
  "type": "property_match_high_score",
  "priority": "high",
  "title": "🎯 3 Matches Excelentes - Casa 3 Quartos",
  "message": "A propriedade tem 5 clientes compatíveis!",
  "read": false,
  "actionUrl": "/properties/abc-123/matches",
  "entityType": "property_match",
  "entityId": "abc-123",
  "metadata": {
    "propertyId": "abc-123",
    "propertyTitle": "Casa 3 Quartos Zona Sul",
    "totalMatches": 5,
    "highScoreMatches": 3,
    "propertyCity": "São Paulo",
    "propertyState": "SP",
    "propertyPrice": 450000,
    "matchScores": [
      { "clientId": "client-1", "score": 92 }
    ]
  }
}
```

## ✨ Recursos Visuais

### Match Normal (60-79%)
- 🏠 Ícone de casa
- Borda azul suave
- Animação hover padrão

### Match High Score (80%+)
- 🎯 Ícone de alvo
- Borda vermelha gradiente
- Animação de pulso contínua
- Background gradiente sutil
- Destaque visual para alta compatibilidade

## 🔍 Debugging

### Verificar se WebSocket está conectado

```typescript
const { connected } = useNotifications();
console.log('WebSocket conectado:', connected);
```

### Verificar notificações recebidas

```typescript
const { notifications } = useNotifications();
console.log('Total de notificações:', notifications.length);

const matchNotifications = notifications.filter(n => 
  n.type.includes('property_match')
);
console.log('Notificações de match:', matchNotifications.length);
```

### Testar navegação

```typescript
import { getNotificationNavigationUrl } from '../utils/notificationNavigation';

const testNotification = {
  // ... dados da notificação
  metadata: {
    propertyId: 'test-123'
  }
};

const url = getNotificationNavigationUrl(testNotification);
console.log('URL de navegação:', url);
// Deve retornar: /properties/test-123/matches
```

## ⚠️ Troubleshooting

### Notificação não aparece
1. ✅ Verificar conexão WebSocket
2. ✅ Verificar console do navegador para erros
3. ✅ Verificar se o backend está enviando o tipo correto

### Navegação não funciona
1. ✅ Verificar se `propertyId` está no metadata
2. ✅ Verificar se a rota está registrada no App.tsx
3. ✅ Verificar permissões do usuário

### Estilos não aplicados
1. ✅ Verificar se styled-components está funcionando
2. ✅ Verificar variáveis de tema CSS
3. ✅ Limpar cache do navegador

## 📊 Compatibilidade

- ✅ React 19.1.1+
- ✅ TypeScript 5.8+
- ✅ styled-components 6.1+
- ✅ Backend com sistema de matches implementado

## 🎉 Próximos Passos

Após integrar o NotificationRenderer no seu NotificationCenter:

1. ✅ Criar uma propriedade de teste
2. ✅ Criar clientes compatíveis
3. ✅ Aguardar notificação aparecer
4. ✅ Testar navegação para página de matches
5. ✅ Testar aceitar/ignorar matches

## 💡 Dicas

- Use `property_match_high_score` para matches importantes (score ≥ 80%)
- Mantenha mensagens de notificação concisas mas informativas
- Sempre inclua `propertyId` no metadata para navegação correta
- Use os tipos TypeScript para garantir consistência

## 📞 Suporte

Para mais detalhes, consulte:
- **Documentação Completa**: `docs/PROPERTY_MATCH_NOTIFICATIONS_FRONTEND.md`
- **Documentação Backend**: Arquivo raiz fornecido pelo usuário
- **Sistema de Notificações**: `docs/NOTIFICATION_API_MIGRATION.md`

---

**Status:** ✅ Pronto para Uso  
**Última Atualização:** 07/11/2025  
**Versão:** 1.0.0

