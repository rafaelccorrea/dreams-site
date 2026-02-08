# 📢 API de Alertas de Prazo do Funil de Vendas (Kanban)

## 📋 Visão Geral

Esta documentação descreve a API necessária para gerenciar alertas de prazo das tarefas do Funil de Vendas (Kanban). Atualmente, os alertas são gerenciados apenas no frontend usando localStorage, mas para uma experiência completa e sincronização entre dispositivos, é recomendado implementar persistência no backend.

## 🎯 Funcionalidades Atuais (Frontend)

- ✅ Detecção automática de tarefas com prazo próximo (≤ 2 dias) ou vencidas
- ✅ Marcar alertas individuais como lidas
- ✅ Marcar todos os alertas como lidas
- ✅ Persistência local via localStorage
- ✅ Contador de alertas não lidos
- ✅ Atualização automática quando tarefas mudam

## 🔧 Problema Identificado

O componente `KanbanNotifications` não estava usando o hook `useDeadlineAlerts` corretamente, fazendo com que a funcionalidade de "marcar como lidas" não funcionasse. **Isso foi corrigido no frontend**, mas para uma solução completa, recomenda-se implementar a API no backend.

## 📡 Endpoints Necessários

### 1. Listar Alertas de Prazo

**Endpoint:**
```
GET /kanban/deadline-alerts
```

**Query Parameters:**
```typescript
{
  projectId?: string;      // Opcional: filtrar por projeto
  teamId?: string;         // Opcional: filtrar por equipe
  isRead?: boolean;        // Opcional: filtrar por status de leitura
  type?: 'warning' | 'overdue';  // Opcional: filtrar por tipo
}
```

**Resposta:**
```typescript
{
  alerts: DeadlineAlert[];
  unreadCount: number;
  totalCount: number;
}

interface DeadlineAlert {
  id: string;
  taskId: string;
  taskTitle: string;
  type: 'warning' | 'overdue';
  dueDate: string;  // ISO 8601
  daysRemaining: number;
  message: string;
  isRead: boolean;
  readAt?: string;  // ISO 8601, opcional
  createdAt: string;  // ISO 8601
  userId: string;  // ID do usuário que recebeu o alerta
  projectId?: string;  // Opcional
  teamId?: string;  // Opcional
}
```

**Exemplo de Resposta:**
```json
{
  "alerts": [
    {
      "id": "alert-123",
      "taskId": "task-456",
      "taskTitle": "Fechar negócio com cliente X",
      "type": "overdue",
      "dueDate": "2026-01-25T00:00:00Z",
      "daysRemaining": 2,
      "message": "Tarefa vencida há 2 dias",
      "isRead": false,
      "createdAt": "2026-01-23T10:00:00Z",
      "userId": "user-789",
      "projectId": "project-123",
      "teamId": "team-456"
    }
  ],
  "unreadCount": 1,
  "totalCount": 1
}
```

---

### 2. Marcar Alerta como Lido

**Endpoint:**
```
PATCH /kanban/deadline-alerts/:alertId/read
```

**Resposta:**
```typescript
{
  success: boolean;
  alert: DeadlineAlert;
}
```

**Exemplo:**
```json
{
  "success": true,
  "alert": {
    "id": "alert-123",
    "taskId": "task-456",
    "taskTitle": "Fechar negócio com cliente X",
    "type": "overdue",
    "dueDate": "2026-01-25T00:00:00Z",
    "daysRemaining": 2,
    "message": "Tarefa vencida há 2 dias",
    "isRead": true,
    "readAt": "2026-01-27T14:30:00Z",
    "createdAt": "2026-01-23T10:00:00Z",
    "userId": "user-789",
    "projectId": "project-123",
    "teamId": "team-456"
  }
}
```

---

### 3. Marcar Todos os Alertas como Lidos

**Endpoint:**
```
PATCH /kanban/deadline-alerts/read/all
```

**Query Parameters:**
```typescript
{
  projectId?: string;  // Opcional: apenas alertas de um projeto
  teamId?: string;     // Opcional: apenas alertas de uma equipe
}
```

**Resposta:**
```typescript
{
  success: boolean;
  affected: number;  // Número de alertas marcados como lidos
  unreadCount: number;  // Contador atualizado de não lidos
}
```

**Exemplo:**
```json
{
  "success": true,
  "affected": 5,
  "unreadCount": 0
}
```

---

### 4. Sincronizar Alertas (Gerar/Atualizar Alertas)

**Endpoint:**
```
POST /kanban/deadline-alerts/sync
```

**Descrição:** Este endpoint deve ser chamado periodicamente ou quando tarefas são atualizadas para gerar/atualizar alertas baseados nas tarefas atuais.

**Body:**
```typescript
{
  projectId?: string;  // Opcional: sincronizar apenas um projeto
  teamId?: string;     // Opcional: sincronizar apenas uma equipe
}
```

**Resposta:**
```typescript
{
  success: boolean;
  created: number;    // Novos alertas criados
  updated: number;    // Alertas atualizados
  removed: number;    // Alertas removidos (tarefas não têm mais prazo)
  alerts: DeadlineAlert[];
}
```

**Exemplo:**
```json
{
  "success": true,
  "created": 3,
  "updated": 2,
  "removed": 1,
  "alerts": [...]
}
```

**Lógica de Sincronização:**
1. Buscar todas as tarefas com `dueDate` não nulo
2. Para cada tarefa, calcular o status:
   - Se `dueDate < hoje`: tipo `overdue`, `daysRemaining = abs(dias)`
   - Se `dueDate <= hoje + 2 dias`: tipo `warning`, `daysRemaining = dias`
   - Caso contrário: não criar alerta
3. Criar alerta se não existir ou atualizar se já existir
4. Remover alertas de tarefas que não têm mais `dueDate` ou não atendem mais aos critérios

---

### 5. Obter Contador de Alertas Não Lidos

**Endpoint:**
```
GET /kanban/deadline-alerts/unread-count
```

**Query Parameters:**
```typescript
{
  projectId?: string;
  teamId?: string;
}
```

**Resposta:**
```typescript
{
  unreadCount: number;
}
```

**Exemplo:**
```json
{
  "unreadCount": 5
}
```

---

## 🗄️ Estrutura de Banco de Dados Sugerida

```sql
CREATE TABLE kanban_deadline_alerts (
  id VARCHAR(255) PRIMARY KEY,
  task_id VARCHAR(255) NOT NULL,
  task_title VARCHAR(500) NOT NULL,
  type ENUM('warning', 'overdue') NOT NULL,
  due_date DATETIME NOT NULL,
  days_remaining INT NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME NULL,
  user_id VARCHAR(255) NOT NULL,
  project_id VARCHAR(255) NULL,
  team_id VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_task_id (task_id),
  INDEX idx_project_id (project_id),
  INDEX idx_team_id (team_id),
  INDEX idx_is_read (is_read),
  INDEX idx_due_date (due_date),
  
  FOREIGN KEY (task_id) REFERENCES kanban_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES kanban_projects(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
```

---

## 🔄 Fluxo de Sincronização

### Quando Sincronizar

1. **Ao carregar o quadro Kanban**: Chamar `POST /kanban/deadline-alerts/sync`
2. **Após atualizar uma tarefa**: Se `dueDate` foi alterado, chamar sync
3. **Periodicamente**: A cada 5-10 minutos (opcional, via cron job)
4. **Ao criar nova tarefa com prazo**: Chamar sync

### Lógica de Negócio

```typescript
// Pseudocódigo da lógica de sincronização

function syncDeadlineAlerts(projectId?: string, teamId?: string) {
  // 1. Buscar todas as tarefas com dueDate
  const tasks = await getTasksWithDueDate(projectId, teamId);
  
  // 2. Para cada tarefa, calcular status
  for (const task of tasks) {
    const status = calculateDeadlineStatus(task.dueDate);
    
    if (status.type === 'warning' || status.type === 'overdue') {
      // 3. Verificar se alerta já existe
      let alert = await findAlertByTaskId(task.id);
      
      if (!alert) {
        // Criar novo alerta
        alert = await createAlert({
          taskId: task.id,
          taskTitle: task.title,
          type: status.type,
          dueDate: task.dueDate,
          daysRemaining: status.daysRemaining,
          message: generateMessage(status.type, status.daysRemaining),
          userId: task.assignedToId || task.createdById,
          projectId: task.projectId,
          teamId: task.teamId,
        });
      } else {
        // Atualizar alerta existente se necessário
        if (alert.type !== status.type || 
            alert.daysRemaining !== status.daysRemaining) {
          await updateAlert(alert.id, {
            type: status.type,
            daysRemaining: status.daysRemaining,
            message: generateMessage(status.type, status.daysRemaining),
            dueDate: task.dueDate,
          });
        }
      }
    }
  }
  
  // 4. Remover alertas de tarefas que não têm mais prazo ou não atendem critérios
  const allAlerts = await getAllAlerts(projectId, teamId);
  for (const alert of allAlerts) {
    const task = await getTask(alert.taskId);
    if (!task || !task.dueDate) {
      await deleteAlert(alert.id);
      continue;
    }
    
    const status = calculateDeadlineStatus(task.dueDate);
    if (status.type !== 'warning' && status.type !== 'overdue') {
      await deleteAlert(alert.id);
    }
  }
}

function calculateDeadlineStatus(dueDate: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { type: 'overdue', daysRemaining: Math.abs(diffDays) };
  } else if (diffDays <= 2) {
    return { type: 'warning', daysRemaining: diffDays };
  }
  
  return { type: 'ok', daysRemaining: diffDays };
}
```

---

## 🔐 Autenticação e Autorização

- Todos os endpoints requerem autenticação (JWT token)
- O usuário só pode ver/marcar seus próprios alertas
- Para alertas de equipe, verificar se o usuário é membro da equipe
- Para alertas de projeto, verificar permissões do projeto

---

## 📝 Notas de Implementação

1. **Performance**: 
   - Usar índices no banco de dados para consultas rápidas
   - Considerar cache para contadores de não lidos
   - Sincronização pode ser feita em background

2. **Notificações em Tempo Real**:
   - Considerar enviar eventos WebSocket quando novos alertas são criados
   - Evento: `deadline_alert:created`
   - Evento: `deadline_alert:read` (quando marcado como lido)

3. **Limpeza**:
   - Remover alertas de tarefas deletadas (CASCADE)
   - Considerar limpar alertas muito antigos (ex: > 30 dias)

4. **Múltiplos Usuários**:
   - Alertas podem ser criados para diferentes usuários (responsável, criador, etc.)
   - Considerar criar alerta para todos os envolvidos na tarefa

---

## 🚀 Integração com Frontend

Após implementar a API, o frontend precisará:

1. **Criar serviço de API** (`src/services/kanbanDeadlineAlertsApi.ts`):
```typescript
class KanbanDeadlineAlertsApiService {
  async getAlerts(filters?: { projectId?: string; teamId?: string; isRead?: boolean }) {
    // GET /kanban/deadline-alerts
  }
  
  async markAsRead(alertId: string) {
    // PATCH /kanban/deadline-alerts/:alertId/read
  }
  
  async markAllAsRead(filters?: { projectId?: string; teamId?: string }) {
    // PATCH /kanban/deadline-alerts/read/all
  }
  
  async syncAlerts(filters?: { projectId?: string; teamId?: string }) {
    // POST /kanban/deadline-alerts/sync
  }
  
  async getUnreadCount(filters?: { projectId?: string; teamId?: string }) {
    // GET /kanban/deadline-alerts/unread-count
  }
}
```

2. **Atualizar hook `useDeadlineAlerts`** para usar a API em vez de localStorage

3. **Chamar sync** quando necessário (ao carregar quadro, após atualizar tarefa, etc.)

---

## ✅ Checklist de Implementação

- [ ] Criar tabela `kanban_deadline_alerts` no banco de dados
- [ ] Implementar endpoint `GET /kanban/deadline-alerts`
- [ ] Implementar endpoint `PATCH /kanban/deadline-alerts/:alertId/read`
- [ ] Implementar endpoint `PATCH /kanban/deadline-alerts/read/all`
- [ ] Implementar endpoint `POST /kanban/deadline-alerts/sync`
- [ ] Implementar endpoint `GET /kanban/deadline-alerts/unread-count`
- [ ] Implementar lógica de sincronização
- [ ] Adicionar índices no banco de dados
- [ ] Implementar autorização (usuário só vê seus alertas)
- [ ] Testar todos os endpoints
- [ ] Documentar no Swagger/OpenAPI (se aplicável)
- [ ] Considerar eventos WebSocket para tempo real
- [ ] Implementar limpeza de alertas antigos (opcional)

---

## 📞 Suporte

Para dúvidas sobre a implementação, consultar:
- Documentação do Kanban: `docs/KANBAN_PAGE.md`
- Código do hook: `src/hooks/useDeadlineAlerts.ts`
- Código do componente: `src/components/kanban/KanbanNotifications.tsx`
