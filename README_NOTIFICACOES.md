# 🔔 Sistema de Notificações - ImobX

## ⚡ Início Rápido

```bash
# Backend
cd imobx && yarn dev

# Frontend (nova janela)
cd imobx-front && yarn dev

# Acessar
http://localhost:5173
```

✅ Faça login e veja sua notificação de boas-vindas! 🎉

## ✨ Status

### Backend
- ✅ Tabela `notifications` criada no banco (UUID corrigido)
- ✅ API REST completa (`/notifications`)
- ✅ WebSocket em tempo real (`/notifications`)
- ✅ Notificação de boas-vindas no primeiro login
- ⏸️ Cron jobs desabilitados (implementar depois)

### Frontend
- ✅ Badge em tempo real no header
- ✅ Painel com scroll infinito
- ✅ Marcar como lida
- ✅ Navegação com troca de empresa
- ✅ Indicador de conexão WebSocket

## 📚 Documentação Completa

**Guia de Integração:**  
`imobx/NOTIFICATION_INTEGRATION_GUIDE.md` - Como adicionar notificações em outros módulos

## 🎯 Funcionalidades

| Feature | Status |
|---------|--------|
| Notificação de boas-vindas | ✅ Funcional |
| Badge em tempo real | ✅ Funcional |
| WebSocket | ✅ Funcional |
| API REST | ✅ Funcional |
| Scroll infinito | ✅ Funcional |
| Marcar como lida | ✅ Funcional |
| Navegação automática | ✅ Funcional |
| Cron jobs | ⏸️ Desabilitados |

## 🔌 API REST

```bash
GET    /notifications                 # Lista notificações
GET    /notifications/all-companies   # Todas empresas
GET    /notifications/unread-count    # Contador
PATCH  /notifications/:id/read        # Marca como lida
PATCH  /notifications/read/all        # Marca todas
DELETE /notifications/:id             # Remove
```

## 🔧 Como Usar em Outros Módulos

```typescript
// Injetar serviço
constructor(
  private readonly notificationGenerator: NotificationGeneratorService,
) {}

// Criar notificação
await this.notificationGenerator.createNotification({
  type: NotificationType.PAYMENT_OVERDUE,
  priority: NotificationPriority.URGENT,
  title: 'Pagamento em atraso',
  message: 'Pagamento venceu há 5 dias',
  userId: user.id,
  companyId: company.id,
  actionUrl: '/rentals/123',
  entityType: 'rental_payment',
  entityId: payment.id,
});
```

**Ver exemplos completos:** `imobx/NOTIFICATION_INTEGRATION_GUIDE.md`

## 🎨 16 Tipos de Notificação

- `rental_expiring` - Aluguel vencendo
- `rental_expired` - Aluguel vencido
- `payment_due` - Pagamento vencendo
- `payment_overdue` - Pagamento atrasado
- `key_pending_return` - Chave não devolvida
- `key_overdue` - Chave atrasada
- `inspection_scheduled` - Vistoria agendada
- `inspection_overdue` - Vistoria atrasada
- `note_pending` - Anotação pendente
- `task_assigned` - Tarefa atribuída
- `task_due` - Tarefa vencendo
- `task_overdue` - Tarefa atrasada
- `client_document_expiring` - Documento vencendo
- `property_document_expiring` - Documento vencendo
- `new_message` - Nova mensagem
- `system_alert` - Alerta do sistema

## 🧪 Scripts de Teste

```bash
# Ver info do banco
node scripts/show-database-info.js

# Verificar tabela
node scripts/check-notifications-table.js

# Testar API
node scripts/test-notifications.js
```

## ⏰ Cron Jobs (Desabilitados)

Os cron jobs foram temporariamente desabilitados pois precisam de ajustes nas relações das entidades. Para implementá-los:

1. Buscar usuários via `UserCompany` (não `company.users`)
2. Usar campos corretos (`tenantName` não `client.name`)
3. Consultar `NOTIFICATION_INTEGRATION_GUIDE.md`

## 📁 Arquivos Criados

```
Backend:
├── entities/notification.entity.ts
├── dto/notification/*.dto.ts
├── notifications/*.ts
└── auth/auth.service.ts (boas-vindas)

Frontend:
├── services/notificationApi.ts
├── hooks/useNotifications.ts
└── components/notifications/NotificationCenter.tsx

Scripts:
├── setup-notifications.ps1/.sh
├── show-database-info.js
└── check-notifications-table.js
```

## ✅ Pronto!

O sistema está funcional. Inicie o backend, faça login e veja sua notificação de boas-vindas! 🎉
