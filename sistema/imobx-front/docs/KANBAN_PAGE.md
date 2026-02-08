# 📋 Documentação do Sistema Kanban

## Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Dados](#-estrutura-de-dados)
3. [Endpoints da API](#-endpoints-da-api) (30 endpoints)
4. [Páginas](#-páginas)
5. [Componentes](#-componentes)
6. [Drag and Drop](#-drag-and-drop)
7. [Filtros](#-filtros)
8. [Projetos](#-projetos)
9. [Comentários](#-comentários)
10. [Histórico de Tarefas](#-histórico-de-tarefas)
11. [Vinculação de Usuários](#-vinculação-de-usuários)
12. [Pessoas Envolvidas no Kanban](#-pessoas-envolvidas-no-kanban)
13. [Permissões](#-permissões)
14. [WebSocket em Tempo Real](#-websocket-em-tempo-real)
15. [Configurações](#-configurações)
16. [Hooks Relacionados](#-hooks-relacionados)
17. [Fluxos Principais](#-fluxos-principais)
18. [Próximas Melhorias](#-próximas-melhorias)

---

## 📋 Visão Geral

O sistema Kanban é uma ferramenta de gerenciamento de tarefas baseada no método Kanban, permitindo visualização e organização de trabalho através de colunas e cards arrastáveis.

### Funcionalidades Principais

- ✅ **Quadro Kanban Visual**: Colunas e cards organizados em um quadro visual
- ✅ **Drag and Drop**: Arrastar e soltar tarefas entre colunas
- ✅ **Gerenciamento de Colunas**: Criar, editar, deletar e reordenar colunas
- ✅ **Gerenciamento de Tarefas**: Criar, editar, deletar e mover tarefas
- ✅ **Projetos**: Organizar tarefas em projetos (team-based ou pessoais)
- ✅ **Filtros Avançados**: Filtrar por responsável, prioridade, data, tags, etc.
- ✅ **Prioridades**: Sistema de prioridades (low, medium, high, urgent)
- ✅ **Tags**: Sistema de tags para categorização
- ✅ **Responsáveis**: Atribuição de tarefas a membros da equipe
- ✅ **Prazos**: Sistema de datas de vencimento com alertas
- ✅ **Comentários**: Sistema de comentários em tarefas
- ✅ **Permissões Granulares**: Controle fino de permissões por ação
- ✅ **Tempo Real**: Atualizações em tempo real via WebSocket
- ✅ **Configurações Personalizáveis**: Visual e comportamento customizáveis
- ✅ **Workspace Pessoal**: Quadro Kanban pessoal para cada usuário

### Conceitos Principais

- **Board (Quadro)**: Container principal que contém colunas e tarefas
- **Column (Coluna)**: Representa um estágio do processo (ex: "A Fazer", "Em Progresso", "Concluído")
- **Task (Tarefa)**: Item de trabalho individual que pode ser movido entre colunas
- **Project (Projeto)**: Agrupamento de tarefas relacionadas
- **Team (Equipe)**: Grupo de usuários que compartilham um quadro Kanban

---

## 📊 Estrutura de Dados

### KanbanBoard

```typescript
interface KanbanBoard {
  columns: KanbanColumn[];
  tasks: KanbanTask[];
  projects?: KanbanProject[];
  permissions?: KanbanPermissions;
  team?: {
    id: string;
    name: string;
  };
}
```

### KanbanColumn

```typescript
interface KanbanColumn {
  id: string;
  title: string;
  description?: string;
  color?: string;
  position: number;          // Ordem da coluna (0, 1, 2, ...)
  isActive: boolean;
  teamId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### KanbanTask

```typescript
interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  columnId: string;          // ID da coluna onde a tarefa está
  position: number;          // Posição dentro da coluna (0, 1, 2, ...)
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isCompleted: boolean;
  assignedToId?: string;     // ID do usuário responsável
  createdById: string;
  dueDate?: Date;
  projectId?: string;        // ID do projeto (opcional)
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos populados
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  project?: KanbanProject;
  tags?: string[];
  comments?: KanbanTaskComment[];
  commentsCount?: number;
}
```

### KanbanProject

```typescript
interface KanbanProject {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived' | 'cancelled';
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  completedById?: string;
  teamId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  taskCount: number;
  completedTaskCount?: number;
  tasks?: KanbanTask[];
  isPersonal?: boolean;      // Se é um workspace pessoal
  progress?: number;         // Progresso em % (0-100)
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  completedBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
```

### KanbanPermissions

```typescript
interface KanbanPermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canMoveTasks: boolean;
  canCreateColumns: boolean;
  canEditColumns: boolean;
  canDeleteColumns: boolean;
}
```

### KanbanFilters

```typescript
interface KanbanFilters {
  searchText?: string;       // Busca textual (título, descrição)
  assigneeId?: string;       // Filtrar por responsável
  priority?: string;         // Filtrar por prioridade
  status?: string;           // Filtrar por status
  dueDateFrom?: Date;        // Data de vencimento - início
  dueDateTo?: Date;          // Data de vencimento - fim
  createdFrom?: Date;        // Data de criação - início
  createdTo?: Date;          // Data de criação - fim
  tags?: string[];           // Filtrar por tags
}
```

### KanbanFilterOptions

```typescript
interface KanbanFilterOptions {
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  priorities: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  statuses: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}
```

### DTOs (Data Transfer Objects)

#### CreateColumnDto

```typescript
interface CreateColumnDto {
  title: string;
  description?: string;
  color?: string;
  teamId: string;
}
```

#### UpdateColumnDto

```typescript
interface UpdateColumnDto {
  title?: string;
  description?: string;
  color?: string;
  position?: number;
}
```

#### CreateTaskDto

```typescript
interface CreateTaskDto {
  title: string;
  description?: string;
  columnId: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedToId?: string;
  dueDate?: Date;
  projectId?: string;
}
```

#### UpdateTaskDto

```typescript
interface UpdateTaskDto {
  title?: string;
  description?: string;
  columnId?: string;
  position?: number;
  priority?: string;
  assignedToId?: string;
  dueDate?: Date;
  projectId?: string;
  tags?: string[];
}
```

#### MoveTaskDto

```typescript
interface MoveTaskDto {
  taskId: string;
  sourceColumnId: string;
  targetColumnId: string;
  sourcePosition: number;
  targetPosition: number;
}
```

#### CreateKanbanProjectDto

```typescript
interface CreateKanbanProjectDto {
  name: string;
  description?: string;
  teamId: string;
  startDate?: string;
  dueDate?: string;
}
```

#### UpdateKanbanProjectDto

```typescript
interface UpdateKanbanProjectDto {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived' | 'cancelled';
  startDate?: string;
  dueDate?: string;
}
```

### KanbanTaskComment

```typescript
interface KanbanTaskComment {
  id: string;
  taskId: string;
  userId: string;
  message: string;
  attachments: Attachment[];
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔌 Endpoints da API

### Base URL
```
/kanban
```

### Índice de Endpoints (30 rotas)

**Colunas:**
1. GET /kanban/board/:teamId - Buscar quadro completo
2. GET /kanban/columns - Listar colunas
3. POST /kanban/columns - Criar coluna
4. PUT /kanban/columns/:id - Atualizar coluna
5. DELETE /kanban/columns/:id - Deletar coluna
6. POST /kanban/columns/reorder/:teamId - Reordenar colunas

**Tarefas:**
7. GET /kanban/tasks - Listar tarefas
8. POST /kanban/tasks - Criar tarefa
9. PUT /kanban/tasks/:id - Atualizar tarefa
10. DELETE /kanban/tasks/:id - Deletar tarefa
11. POST /kanban/tasks/move - Mover tarefa
12. GET /kanban/tasks/:id/history - Histórico da tarefa

**Comentários:**
13. GET /kanban/tasks/:taskId/comments - Listar comentários
14. POST /kanban/tasks/:taskId/comments - Criar comentário
15. DELETE /kanban/tasks/:taskId/comments/:commentId - Deletar comentário

**Tags:**
16. GET /kanban/tags/:teamId - Listar tags disponíveis

**Projetos:**
17. POST /kanban/projects - Criar projeto
18. GET /kanban/projects/team/:teamId - Listar projetos por equipe
19. GET /kanban/projects/team/personal - Obter workspace pessoal
20. GET /kanban/projects/filtered - Listar projetos com filtros
21. GET /kanban/projects/:id - Obter projeto por ID
22. PUT /kanban/projects/:id - Atualizar projeto
23. DELETE /kanban/projects/:id - Deletar projeto
24. POST /kanban/projects/:id/finalize - Finalizar projeto
25. GET /kanban/projects/team/:teamId/history - Histórico de projetos da equipe
26. GET /kanban/projects/:id/history - Histórico do projeto

---

### 1. Buscar Quadro Kanban

**Endpoint:**
```
GET /kanban/board/:teamId
```

**Query Parameters:**
```typescript
{
  projectId?: string;  // Opcional: filtrar por projeto
}
```

**Resposta:**
```typescript
KanbanBoard
```

**Exemplo:**
```typescript
GET /kanban/board/team-123?projectId=project-456
```

**Resposta de Exemplo:**
```typescript
{
  "columns": [
    {
      "id": "col-1",
      "title": "A Fazer",
      "color": "#3B82F6",
      "position": 0,
      "isActive": true,
      "teamId": "team-123",
      "createdById": "user-1",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Implementar feature X",
      "description": "Descrição da tarefa",
      "columnId": "col-1",
      "position": 0,
      "priority": "high",
      "isCompleted": false,
      "assignedToId": "user-2",
      "createdById": "user-1",
      "dueDate": "2024-01-20T00:00:00Z",
      "projectId": "project-456",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "assignedTo": {
        "id": "user-2",
        "name": "João Silva",
        "email": "joao@example.com",
        "avatar": "https://..."
      },
      "tags": ["frontend", "urgent"]
    }
  ],
  "permissions": {
    "canCreateTasks": true,
    "canEditTasks": true,
    "canDeleteTasks": true,
    "canMoveTasks": true,
    "canCreateColumns": true,
    "canEditColumns": true,
    "canDeleteColumns": true
  }
}
```

### 2. Listar Colunas

**Endpoint:**
```
GET /kanban/columns
```

**Resposta:**
```typescript
KanbanColumn[]
```

### 3. Criar Coluna

**Endpoint:**
```
POST /kanban/columns
```

**Body:**
```typescript
CreateColumnDto
```

**Resposta:**
```typescript
KanbanColumn
```

**Exemplo:**
```typescript
POST /kanban/columns
{
  "title": "Em Revisão",
  "description": "Tarefas em processo de revisão",
  "color": "#F59E0B",
  "teamId": "team-123"
}
```

### 4. Atualizar Coluna

**Endpoint:**
```
PUT /kanban/columns/:id
```

**Body:**
```typescript
UpdateColumnDto
```

**Resposta:**
```typescript
KanbanColumn
```

**Exemplo:**
```typescript
PUT /kanban/columns/col-1
{
  "title": "A Fazer (Atualizado)",
  "color": "#10B981"
}
```

### 5. Deletar Coluna

**Endpoint:**
```
DELETE /kanban/columns/:id
```

**Resposta:**
```
204 No Content
```

### 6. Reordenar Colunas

**Endpoint:**
```
POST /kanban/columns/reorder/:teamId
```

**Body:**
```typescript
{
  columnIds: string[];  // Array de IDs na nova ordem
  projectId?: string;   // Opcional: para projetos
}
```

**Resposta:**
```
200 OK
```

**Exemplo:**
```typescript
POST /kanban/columns/reorder/team-123
{
  "columnIds": ["col-2", "col-1", "col-3"],
  "projectId": "project-456"
}
```

### 7. Listar Tarefas

**Endpoint:**
```
GET /kanban/tasks
```

**Query Parameters:**
```typescript
{
  projectId?: string;
  columnId?: string;
  assignedToId?: string;
  // ... outros filtros
}
```

**Resposta:**
```typescript
KanbanTask[]
```

### 8. Criar Tarefa

**Endpoint:**
```
POST /kanban/tasks
```

**Body:**
```typescript
CreateTaskDto
```

**Resposta:**
```typescript
KanbanTask
```

**Exemplo:**
```typescript
POST /kanban/tasks
{
  "title": "Implementar login",
  "description": "Criar página de login com autenticação",
  "columnId": "col-1",
  "priority": "high",
  "assignedToId": "user-2",
  "dueDate": "2024-01-25T00:00:00Z",
  "projectId": "project-456"
}
```

### 9. Atualizar Tarefa

**Endpoint:**
```
PUT /kanban/tasks/:id
```

**Body:**
```typescript
UpdateTaskDto
```

**Resposta:**
```typescript
KanbanTask
```

**Exemplo:**
```typescript
PUT /kanban/tasks/task-1
{
  "title": "Implementar login (atualizado)",
  "priority": "urgent",
  "assignedToId": "user-3",
  "tags": ["frontend", "auth", "urgent"]
}
```

### 10. Deletar Tarefa

**Endpoint:**
```
DELETE /kanban/tasks/:id
```

**Resposta:**
```
204 No Content
```

### 11. Mover Tarefa

**Endpoint:**
```
POST /kanban/tasks/move
```

**Body:**
```typescript
{
  taskId: string;
  targetColumnId: string;
  targetPosition: number;
}
```

**Resposta:**
```
200 OK
```

**Exemplo:**
```typescript
POST /kanban/tasks/move
{
  "taskId": "task-1",
  "targetColumnId": "col-2",
  "targetPosition": 0
}
```

### 12. Histórico da Tarefa

**Endpoint:**
```
GET /kanban/tasks/:id/history
```

**Descrição:** Retorna o histórico completo de alterações de uma tarefa, incluindo criação, edições, movimentações entre colunas, mudanças de responsável, alterações de prioridade, etc.

**Resposta:**
```typescript
Array<HistoryEntry>
```

**Estrutura de HistoryEntry:**
```typescript
interface HistoryEntry {
  id: string;
  action: string;              // Tipo de ação (created, updated, moved, assigned, etc.)
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;                    // Usuário que realizou a ação (null para ações do sistema)
  fromColumn?: {               // Coluna de origem (para movimentações)
    id: string;
    title: string;
    color: string;
  } | null;
  toColumn?: {                 // Coluna de destino (para movimentações)
    id: string;
    title: string;
    color: string;
  } | null;
  oldValue?: string;           // Valor anterior (para alterações de campos)
  newValue?: string;           // Valor novo (para alterações de campos)
  description?: string;        // Descrição adicional da ação
  field?: string;              // Campo alterado (title, description, priority, assignedToId, etc.)
  fieldLabel?: string;         // Label amigável do campo
  createdAt: string;           // Data e hora da ação
}
```

**Tipos de Ações Registradas:**
- `created`: Tarefa foi criada
- `updated`: Tarefa foi atualizada
- `moved`: Tarefa foi movida entre colunas
- `assigned`: Responsável foi atribuído/alterado
- `unassigned`: Responsável foi removido
- `priority_changed`: Prioridade foi alterada
- `due_date_changed`: Data de vencimento foi alterada
- `description_changed`: Descrição foi alterada
- `title_changed`: Título foi alterado
- `tags_changed`: Tags foram alteradas
- `project_changed`: Projeto associado foi alterado
- `completed`: Tarefa foi marcada como concluída
- `reopened`: Tarefa foi reaberta

**Exemplo de Resposta:**
```typescript
[
  {
    "id": "hist-1",
    "action": "created",
    "user": {
      "id": "user-1",
      "name": "João Silva",
      "email": "joao@example.com",
      "avatar": "https://..."
    },
    "description": "Tarefa criada",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "hist-2",
    "action": "moved",
    "user": {
      "id": "user-2",
      "name": "Maria Santos",
      "email": "maria@example.com"
    },
    "fromColumn": {
      "id": "col-1",
      "title": "A Fazer",
      "color": "#3B82F6"
    },
    "toColumn": {
      "id": "col-2",
      "title": "Em Progresso",
      "color": "#F59E0B"
    },
    "createdAt": "2024-01-15T14:30:00Z"
  },
  {
    "id": "hist-3",
    "action": "priority_changed",
    "user": {
      "id": "user-1",
      "name": "João Silva"
    },
    "field": "priority",
    "fieldLabel": "Prioridade",
    "oldValue": "medium",
    "newValue": "high",
    "createdAt": "2024-01-15T16:00:00Z"
  },
  {
    "id": "hist-4",
    "action": "assigned",
    "user": {
      "id": "user-1",
      "name": "João Silva"
    },
    "field": "assignedToId",
    "fieldLabel": "Responsável",
    "oldValue": null,
    "newValue": "user-2 - Maria Santos",
    "createdAt": "2024-01-15T17:00:00Z"
  }
]
```

**Exemplo de Uso:**
```typescript
const history = await kanbanApi.getTaskHistory('task-123');
history.forEach(entry => {
  console.log(`${entry.user?.name} ${entry.action} em ${entry.createdAt}`);
});
```

### 13. Listar Comentários

**Endpoint:**
```
GET /kanban/tasks/:taskId/comments
```

**Descrição:** Retorna todos os comentários de uma tarefa, ordenados por data de criação (mais antigos primeiro).

**Resposta:**
```typescript
KanbanTaskComment[]
```

**Estrutura de KanbanTaskComment:**
```typescript
interface KanbanTaskComment {
  id: string;
  taskId: string;
  userId: string;              // ID do usuário que criou o comentário
  message: string;             // Mensagem do comentário
  attachments: Attachment[];   // Anexos do comentário
  user: {                      // Dados do usuário (populado)
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;           // Data de criação (ISO 8601)
  updatedAt: string;           // Data de última atualização (ISO 8601)
}
```

**Estrutura de Attachment:**
```typescript
interface Attachment {
  id: string;
  filename: string;
  url: string;                 // URL para download do arquivo
  size: number;               // Tamanho em bytes
  mimeType: string;           // Tipo MIME do arquivo
  uploadedAt: string;         // Data de upload
}
```

**Exemplo de Resposta:**
```typescript
[
  {
    "id": "comment-1",
    "taskId": "task-123",
    "userId": "user-1",
    "message": "Vou começar a trabalhar nisso hoje à tarde.",
    "attachments": [],
    "user": {
      "id": "user-1",
      "name": "João Silva",
      "email": "joao@example.com",
      "avatar": "https://..."
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "comment-2",
    "taskId": "task-123",
    "userId": "user-2",
    "message": "Segue o arquivo com as especificações.",
    "attachments": [
      {
        "id": "att-1",
        "filename": "especificacoes.pdf",
        "url": "https://storage.example.com/files/att-1",
        "size": 245760,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-01-15T11:00:00Z"
      }
    ],
    "user": {
      "id": "user-2",
      "name": "Maria Santos",
      "email": "maria@example.com"
    },
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
]
```

**Exemplo de Uso:**
```typescript
const comments = await kanbanApi.getTaskComments('task-123');
comments.forEach(comment => {
  console.log(`${comment.user.name}: ${comment.message}`);
  comment.attachments.forEach(att => {
    console.log(`  Anexo: ${att.filename} (${att.size} bytes)`);
  });
});
```

### 14. Criar Comentário

**Endpoint:**
```
POST /kanban/tasks/:taskId/comments
```

**Descrição:** Cria um novo comentário em uma tarefa. Permite adicionar mensagem e anexos (arquivos).

**Body (FormData):**
```typescript
{
  message: string;             // Mensagem do comentário (obrigatório, máx. 2000 caracteres)
  files?: File[];              // Arquivos anexos (opcional, máx. 10 arquivos)
}
```

**Validações:**
- `message`: Obrigatório, não pode estar vazio (após trim), máximo 2000 caracteres
- `files`: Opcional, máximo 10 arquivos por comentário
- Cada arquivo deve ter tamanho válido e tipo MIME permitido

**Resposta:**
```typescript
KanbanTaskComment  // Comentário criado com todos os dados populados
```

**Exemplo de Criação:**
```typescript
// Criar comentário sem anexos
const formData1 = new FormData();
formData1.append('message', 'Vou começar a trabalhar nisso hoje à tarde.');

const comment1 = await kanbanApi.createTaskComment('task-123', formData1);

// Criar comentário com anexos
const formData2 = new FormData();
formData2.append('message', 'Segue o arquivo com as especificações.');
formData2.append('files', file1);  // File object
formData2.append('files', file2);  // File object

const comment2 = await kanbanApi.createTaskComment('task-123', formData2);
```

**Exemplo de Requisição HTTP:**
```http
POST /kanban/tasks/task-123/comments
Content-Type: multipart/form-data

message: "Vou começar a trabalhar nisso hoje à tarde."
files: [file1.pdf, file2.jpg]
```

**Comportamento:**
- O comentário é criado automaticamente vinculado ao usuário autenticado (`userId` extraído do token)
- A data de criação (`createdAt`) é definida automaticamente pelo backend
- Os arquivos são enviados para storage e as URLs são geradas automaticamente
- O comentário aparece imediatamente na lista após criação
- WebSocket envia evento para outros usuários visualizando a tarefa

**Tratamento de Erros:**
- `400 Bad Request`: Mensagem vazia ou muito longa, arquivos inválidos
- `401 Unauthorized`: Usuário não autenticado
- `403 Forbidden`: Usuário não tem permissão para comentar na tarefa
- `404 Not Found`: Tarefa não encontrada
- `413 Payload Too Large`: Arquivos muito grandes

### 15. Deletar Comentário

**Endpoint:**
```
DELETE /kanban/tasks/:taskId/comments/:commentId
```

**Descrição:** Remove um comentário de uma tarefa. Apenas o criador do comentário ou administradores podem deletar.

**Resposta:**
```
204 No Content
```

**Validações:**
- Comentário deve existir
- Usuário deve ser o criador do comentário OU ter permissão de administrador
- Tarefa deve existir

**Exemplo de Uso:**
```typescript
await kanbanApi.deleteTaskComment('task-123', 'comment-456');
```

**Comportamento:**
- Comentário é removido permanentemente
- Anexos associados também são removidos do storage
- WebSocket envia evento para outros usuários visualizando a tarefa
- Ação não pode ser desfeita

**Tratamento de Erros:**
- `401 Unauthorized`: Usuário não autenticado
- `403 Forbidden`: Usuário não tem permissão para deletar o comentário
- `404 Not Found`: Comentário ou tarefa não encontrados

### 16. Listar Tags Disponíveis

**Endpoint:**
```
GET /kanban/tags/:teamId
```

**Resposta:**
```typescript
string[]  // Array de nomes de tags
```

### 17. Criar Projeto

**Endpoint:**
```
POST /kanban/projects
```

**Body:**
```typescript
CreateKanbanProjectDto
```

**Resposta:**
```typescript
KanbanProjectResponseDto
```

**Exemplo:**
```typescript
POST /kanban/projects
{
  "name": "Sistema de Vendas",
  "description": "Desenvolvimento do novo sistema de vendas",
  "teamId": "team-123",
  "startDate": "2024-01-01",
  "dueDate": "2024-06-30"
}
```

### 18. Listar Projetos por Equipe

**Endpoint:**
```
GET /kanban/projects/team/:teamId
```

**Resposta:**
```typescript
KanbanProjectResponseDto[]
```

**Exemplo:**
```typescript
GET /kanban/projects/team/team-123
```

### 19. Obter Workspace Pessoal

**Endpoint:**
```
GET /kanban/projects/team/personal
```

**Descrição:** Retorna o workspace pessoal do usuário. Se não existir, é criado automaticamente.

**Resposta:**
```typescript
KanbanProjectResponseDto[]
```

**Exemplo:**
```typescript
GET /kanban/projects/team/personal
```

### 20. Listar Projetos com Filtros

**Endpoint:**
```
GET /kanban/projects/filtered
```

**Query Parameters:**
```typescript
ProjectFiltersDto {
  page?: string;
  limit?: string;
  status?: 'active' | 'completed' | 'archived' | 'cancelled';
  teamId?: string;
  createdById?: string;
  startDateFrom?: string;
  startDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
```

**Resposta:**
```typescript
PaginatedKanbanProjectsResponseDto
```

**Exemplo:**
```typescript
GET /kanban/projects/filtered?status=active&teamId=team-123&page=1&limit=10
```

### 21. Obter Projeto por ID

**Endpoint:**
```
GET /kanban/projects/:id
```

**Resposta:**
```typescript
KanbanProjectResponseDto
```

**Exemplo:**
```typescript
GET /kanban/projects/project-456
```

### 22. Atualizar Projeto

**Endpoint:**
```
PUT /kanban/projects/:id
```

**Body:**
```typescript
UpdateKanbanProjectDto
```

**Resposta:**
```typescript
KanbanProjectResponseDto
```

**Exemplo:**
```typescript
PUT /kanban/projects/project-456
{
  "name": "Sistema de Vendas (Atualizado)",
  "status": "active",
  "dueDate": "2024-07-31"
}
```

### 23. Deletar Projeto

**Endpoint:**
```
DELETE /kanban/projects/:id
```

**Resposta:**
```typescript
{
  message: string;
}
```

**Exemplo:**
```typescript
DELETE /kanban/projects/project-456
```

### 24. Finalizar Projeto

**Endpoint:**
```
POST /kanban/projects/:id/finalize
```

**Descrição:** Marca o projeto como concluído (`status: 'completed'`) e define `completedAt` e `completedById`.

**Resposta:**
```typescript
KanbanProjectResponseDto
```

**Exemplo:**
```typescript
POST /kanban/projects/project-456/finalize
```

### 25. Histórico de Projetos da Equipe

**Endpoint:**
```
GET /kanban/projects/team/:teamId/history
```

**Descrição:** Retorna todos os projetos da equipe (incluindo concluídos, arquivados e cancelados).

**Resposta:**
```typescript
KanbanProjectResponseDto[]
```

**Exemplo:**
```typescript
GET /kanban/projects/team/team-123/history
```

### 26. Histórico do Projeto

**Endpoint:**
```
GET /kanban/projects/:id/history
```

**Descrição:** Retorna o histórico de mudanças de um projeto específico.

**Resposta:**
```typescript
Array<{
  id: string;
  action: string;
  userId: string;
  changes: Record<string, any>;
  createdAt: Date;
}>
```

**Exemplo:**
```typescript
GET /kanban/projects/project-456/history
```

---

## 📄 Páginas

### KanbanPage

**Localização:** `src/pages/KanbanPage.tsx`

**Rota:** `/kanban`

**Query Parameters:**
- `teamId`: ID da equipe (opcional)
- `projectId`: ID do projeto (opcional)
- `workspace`: Tipo de workspace (`personal` para workspace pessoal)

**Funcionalidades:**
- Renderiza o componente `KanbanBoardComponent`
- Valida parâmetros e redireciona se necessário
- Suporta workspace pessoal e por equipe

**Exemplo de URL:**
```
/kanban?teamId=team-123&projectId=project-456
/kanban?workspace=personal&projectId=personal-project-1
```

---

## 🧩 Componentes

### KanbanBoardComponent

**Localização:** `src/components/kanban/KanbanBoard.tsx`

**Props:**
```typescript
interface KanbanBoardComponentProps {
  initialTeamId?: string;
  initialProjectId?: string;
  isPersonalWorkspace?: boolean;
}
```

**Funcionalidades:**
- Renderiza o quadro Kanban completo
- Gerencia drag and drop de tarefas e colunas
- Integra com hooks `useKanban`, `useKanbanSettings`, `useKanbanViewSettings`
- Gerencia seleção de equipe e projeto
- Renderiza filtros e controles de visualização
- Modais para criação/edição de colunas e tarefas

**Componentes Utilizados:**
- `Column`: Componente de coluna
- `Task`: Componente de tarefa
- `KanbanFilters`: Componente de filtros
- `TeamSelector`: Seletor de equipe
- `ProjectSelector`: Seletor de projeto
- `DndContext`: Contexto de drag and drop (@dnd-kit)

### Column

**Localização:** `src/components/kanban/Column.tsx`

**Props:**
```typescript
interface ColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onAddTask?: (columnId: string) => void;
  onEditTask?: (task: KanbanTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onEditColumn?: (column: KanbanColumn) => void;
  onDeleteColumn?: (columnId: string) => void;
  canCreateTasks?: boolean;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
  canMoveTasks?: boolean;
  canEditColumns?: boolean;
  canDeleteColumns?: boolean;
  scrollMode?: 'scroll' | 'expand';
  viewSettings?: any;
  settings?: any;
}
```

**Funcionalidades:**
- Renderiza uma coluna do Kanban
- Exibe lista de tarefas da coluna
- Permite arrastar coluna (reordenar)
- Permite soltar tarefas (drop zone)
- Menu de ações (editar, deletar coluna)
- Botão para adicionar tarefa
- Contador de tarefas (se habilitado)

### Task

**Localização:** `src/components/kanban/Task.tsx`

**Props:**
```typescript
interface TaskProps {
  task: KanbanTask;
  onEdit?: (task: KanbanTask) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (task: KanbanTask) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canMove?: boolean;
  viewSettings?: any;
  settings?: any;
}
```

**Funcionalidades:**
- Renderiza card de tarefa
- Permite arrastar tarefa (drag)
- Exibe informações: título, descrição, prioridade, responsável, tags, prazo
- Indicadores visuais de prioridade e prazo
- Ações: editar, deletar
- Handle de drag (especialmente em mobile)
- Responsivo e adaptável a diferentes densidades de card
- Exibe avatar do criador (se configurado)
- Exibe avatar do responsável (se atribuído)
- Contador de comentários (se houver)

**Visual:**
- Borda colorida baseada na prioridade (opcional)
- Avatar do responsável (`assignedTo`)
- Avatar do criador (`createdBy`) - opcional
- Badge de prioridade
- Tags coloridas
- Indicador de prazo (com cores para vencido/próximo)
- Badge de contador de comentários

### TaskModal

**Localização:** `src/components/modals/TaskModal.tsx`

**Props:**
```typescript
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTaskDto | UpdateTaskDto) => Promise<void>;
  task?: KanbanTask;           // Se fornecido, modo edição; caso contrário, modo criação
  columnId?: string;           // ID da coluna (obrigatório na criação)
  columnTitle?: string;        // Título da coluna (para exibição)
  teamId?: string;             // ID da equipe
  projectId?: string;          // ID do projeto
}
```

**Funcionalidades:**
- Modal para criar ou editar tarefas
- Formulário completo com validação
- Seleção de responsável (dropdown de usuários)
- Seleção de prioridade
- Seleção de projeto (se aplicável)
- Campo de data de vencimento (date picker)
- Campo de tags (multiselect)
- Validação de campos obrigatórios
- Feedback visual de erros
- Loading state durante salvamento

**Campos do Formulário:**
- **Título** (obrigatório): Input de texto
- **Descrição** (opcional): Textarea
- **Responsável** (opcional): Select com lista de usuários da equipe
- **Prioridade** (opcional): Select com opções (low, medium, high, urgent)
- **Data de Vencimento** (opcional): Date picker
- **Projeto** (opcional): Select com projetos da equipe
- **Tags** (opcional): Multiselect com tags disponíveis

**Validações:**
- Título não pode estar vazio
- Título não pode exceder limite de caracteres
- Descrição não pode exceder limite de caracteres
- Data de vencimento deve ser válida (se informada)
- Responsável deve existir na equipe (se informado)
- Projeto deve existir e estar ativo (se informado)

**Comportamento:**
- Ao criar: `createdById` é definido automaticamente pelo backend
- Ao editar: mantém `createdById` original
- `assignedToId` pode ser alterado a qualquer momento (se tiver permissão)

### TaskDetailsModal

**Localização:** `src/components/modals/TaskDetailsModal.tsx`

**Props:**
```typescript
interface TaskDetailsModalProps {
  task: KanbanTask;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (taskId: string) => void;
  canDelete?: boolean;
}
```

**Funcionalidades:**
- Modal completo de visualização e gerenciamento de tarefa
- Exibe todas as informações da tarefa
- **Aba de Detalhes:**
  - Título e descrição
  - Informações do criador (`createdBy`)
  - Informações do responsável (`assignedTo`)
  - Prioridade
  - Data de vencimento
  - Projeto associado
  - Tags
  - Datas de criação e atualização
- **Aba de Comentários:**
  - Lista de comentários (ordenados por data)
  - Formulário para criar novo comentário
  - Upload de anexos (máx. 10 arquivos)
  - Exclusão de comentários (apenas criador ou admin)
  - Visualização de anexos
  - Download de anexos
- **Aba de Histórico:**
  - Timeline de todas as alterações
  - Filtros por tipo de ação
  - Visualização detalhada de mudanças
  - Informações do usuário que realizou cada ação
  - Valores antigos e novos (quando aplicável)
  - Movimentações entre colunas

**Recursos de Comentários:**
- Criar comentário com mensagem (obrigatório, máx. 2000 caracteres)
- Anexar arquivos (máx. 10 por comentário)
- Visualizar anexos com preview
- Download de anexos
- Excluir comentários próprios
- Validação em tempo real
- Loading states
- Tratamento de erros

**Recursos de Histórico:**
- Carregamento automático ao abrir aba
- Filtros por tipo de ação
- Visualização cronológica
- Destaque de ações importantes
- Informações completas de cada alteração
- Avatar do usuário que realizou a ação
- Timestamps formatados

**Permissões:**
- Visualização: qualquer usuário com acesso à tarefa
- Criar comentário: qualquer usuário com acesso à tarefa
- Excluir comentário: apenas criador do comentário ou admin
- Excluir tarefa: verificado via `canDelete` prop

**Integração:**
- WebSocket para atualizações em tempo real
- Sincronização automática de comentários
- Atualização de histórico quando tarefa é modificada

### KanbanFilters

**Localização:** `src/components/kanban/KanbanFilters.tsx`

**Props:**
```typescript
interface KanbanFiltersProps {
  filters: KanbanFilters;
  filterOptions: KanbanFilterOptions;
  onFiltersChange: (filters: KanbanFilters) => void;
  onClearFilters: () => void;
  className?: string;
}
```

**Funcionalidades:**
- Busca textual (debounced)
- Filtro por responsável (select)
- Filtro por prioridade (select)
- Filtro por status (select)
- Filtro por data de vencimento (date range)
- Filtro por data de criação (date range)
- Filtro por tags (multiselect)
- Botão para limpar filtros

---

## 🖱️ Drag and Drop

### Biblioteca

O sistema utiliza **@dnd-kit** para drag and drop.

**Instalação:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Estrutura

```typescript
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
```

### Drag de Tarefas

**Fluxo:**
1. Tarefa é arrastada (`onDragStart`)
2. Tarefa é movida sobre coluna (`onDragOver`)
3. Tarefa é solta (`onDragEnd`)
4. `handleDragEnd` é chamado
5. Tarefa é atualizada na API
6. Estado local é atualizado (optimistic update)

**Código:**
```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (!over) return;
  
  const taskId = active.id as string;
  const targetColumnId = over.id as string;
  
  // Buscar tarefa atual
  const task = board.tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Se já está na mesma coluna, não fazer nada
  if (task.columnId === targetColumnId) return;
  
  // Calcular nova posição
  const targetColumnTasks = board.tasks.filter(
    t => t.columnId === targetColumnId
  );
  const newPosition = targetColumnTasks.length;
  
  // Optimistic update
  setBoard(prev => ({
    ...prev,
    tasks: prev.tasks.map(t =>
      t.id === taskId 
        ? { ...t, columnId: targetColumnId, position: newPosition }
        : t
    ),
  }));
  
  // Enviar para API
  await moveTask({
    taskId,
    sourceColumnId: task.columnId,
    targetColumnId,
    sourcePosition: task.position,
    targetPosition: newPosition,
  });
};
```

### Drag de Colunas

**Fluxo:**
1. Coluna é arrastada
2. Colunas são reordenadas localmente
3. Nova ordem é enviada para API
4. Se erro, rollback é feito

**Código:**
```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const isColumn = localColumns.some(col => col.id === active.id);
  
  if (isColumn && active.id !== over.id) {
    const oldIndex = localColumns.findIndex(col => col.id === active.id);
    const newIndex = localColumns.findIndex(col => col.id === over.id);
    
    // Optimistic update
    const newColumns = arrayMove(localColumns, oldIndex, newIndex);
    setLocalColumns(newColumns);
    
    // Enviar para API
    try {
      await kanbanApi.reorderColumns(
        selectedTeam!.id,
        newColumns.map(col => col.id),
        selectedProjectId || undefined
      );
    } catch (error) {
      // Rollback
      setLocalColumns(previousColumns);
    }
  }
};
```

### Mobile vs Desktop

**Desktop:**
- Drag pelo card inteiro
- Cursor muda para `grab` / `grabbing`

**Mobile/Tablet:**
- Drag apenas pelo handle (ícone de drag)
- `touch-action: none` no handle
- Card normal não é arrastável (permite scroll)

---

## 🔍 Filtros

### Filtros Disponíveis

1. **Busca Textual**: Busca em título e descrição
2. **Responsável**: Filtrar por usuário atribuído
3. **Prioridade**: Filtrar por prioridade (low, medium, high, urgent)
4. **Status**: Filtrar por status (todo, in-progress, done)
5. **Data de Vencimento**: Filtrar por range de datas
6. **Data de Criação**: Filtrar por range de datas
7. **Tags**: Filtrar por uma ou mais tags

### Implementação

Os filtros são aplicados no hook `useKanban` através de `useMemo`:

```typescript
const filteredTasks = useMemo(() => {
  return board.tasks.filter(task => {
    // Busca textual
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }
    
    // Responsável
    if (filters.assigneeId && task.assignedToId !== filters.assigneeId) {
      return false;
    }
    
    // Prioridade
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    
    // Projeto
    if (selectedProjectId && task.projectId !== selectedProjectId) {
      return false;
    }
    
    // Data de vencimento
    if (filters.dueDateFrom && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < filters.dueDateFrom) return false;
    }
    
    // Tags
    if (filters.tags && filters.tags.length > 0 && task.tags) {
      const hasMatchingTag = filters.tags.some(tagId =>
        task.tags!.includes(tagId)
      );
      if (!hasMatchingTag) return false;
    }
    
    return true;
  });
}, [board.tasks, filters, selectedProjectId]);
```

---

## 📁 Projetos

### Tipos de Projetos

1. **Projetos de Equipe**: Associados a uma equipe (`teamId`)
   - Compartilhados entre membros da equipe
   - Podem ter múltiplos responsáveis
   - Colunas e tarefas são compartilhadas

2. **Projetos Pessoais (Workspace Pessoal)**: Workspace pessoal do usuário (`isPersonal: true`)
   - Criado automaticamente na primeira utilização
   - Acessível via `/kanban/projects/team/personal`
   - Privado para o usuário
   - Permite organização de tarefas pessoais

### Funcionalidades

- ✅ Criar projetos (com nome, descrição, datas)
- ✅ Editar projetos (nome, descrição, status, datas)
- ✅ Deletar projetos
- ✅ Listar projetos por equipe
- ✅ Obter workspace pessoal (criação automática)
- ✅ Filtrar projetos (status, data, responsável, equipe)
- ✅ Visualizar progresso do projeto (% de tarefas concluídas)
- ✅ Associar tarefas a projetos
- ✅ Finalizar projetos (marca como concluído)
- ✅ Histórico de projetos (mudanças e ações)
- ✅ Histórico de projetos da equipe (todos os status)

### Status de Projeto

- `active`: Projeto ativo (em andamento)
- `completed`: Projeto concluído (finalizado)
- `archived`: Projeto arquivado (oculto mas mantido)
- `cancelled`: Projeto cancelado (não será continuado)

### Componentes Relacionados

#### ProjectSelector

**Localização:** `src/components/kanban/ProjectSelector.tsx`

**Funcionalidades:**
- Dropdown para selecionar projeto
- Exibe apenas projetos ativos no dropdown
- Mostra informações do projeto selecionado (nome, descrição, data de vencimento)
- Botão para criar novo projeto
- Botão para finalizar projeto (se ativo)
- Link para histórico de projetos
- Status visual do projeto (badge colorido)

**Props:**
```typescript
interface ProjectSelectorProps {
  selectedProjectId?: string;
  onProjectChange: (projectId: string | null) => void;
  teamId: string;
  disabled?: boolean;
}
```

#### CreateProjectModal

**Localização:** `src/components/modals/CreateProjectModal.tsx`

**Funcionalidades:**
- Modal para criar novo projeto
- Campos: nome, descrição, data de início, data de vencimento
- Validação de formulário
- Criação via `useProjects` hook

#### ConfirmFinalizeProjectModal

**Localização:** `src/components/modals/ConfirmFinalizeProjectModal.tsx`

**Funcionalidades:**
- Modal de confirmação para finalizar projeto
- Exibe informações do projeto
- Confirmação antes de marcar como concluído

#### ProjectHistory

**Localização:** `src/components/kanban/ProjectHistory.tsx`

**Funcionalidades:**
- Visualização de histórico de projetos da equipe
- Filtros por status
- Lista de projetos concluídos, arquivados e cancelados
- Detalhes de cada projeto

### Hook useProjects

**Localização:** `src/hooks/useProjects.ts`

**Interface:**
```typescript
{
  projects: KanbanProject[];
  loading: boolean;
  error: string | null;
  createProject: (data: CreateKanbanProjectDto) => Promise<KanbanProjectResponseDto>;
  updateProject: (id: string, data: UpdateKanbanProjectDto) => Promise<KanbanProjectResponseDto>;
  deleteProject: (id: string) => Promise<void>;
  finalizeProject: (id: string) => Promise<KanbanProjectResponseDto>;
  getProjectsByTeam: (teamId: string) => Promise<KanbanProjectResponseDto[]>;
  getProjectById: (id: string) => Promise<KanbanProjectResponseDto>;
  getProjectHistory: (id: string) => Promise<any[]>;
  refreshProjects: () => Promise<void>;
}
```

**Funcionalidades:**
- Gerenciar estado de projetos
- CRUD completo de projetos
- Finalização de projetos
- Histórico de projetos
- Auto-reload ao mudar empresa

### Workspace Pessoal

O workspace pessoal é um projeto especial criado automaticamente para cada usuário:

- **Criação**: Automática na primeira chamada de `GET /kanban/projects/team/personal`
- **Acesso**: Via endpoint `/kanban/projects/team/personal`
- **Características**:
  - `isPersonal: true`
  - `teamId`: ID especial do workspace pessoal
  - Privado para o usuário
  - Permite organização de tarefas pessoais sem equipe

**Uso:**
```typescript
// Obter workspace pessoal
const personalProjects = await projectsApi.getPersonalWorkspace();

// Usar no Kanban
<KanbanBoardComponent 
  isPersonalWorkspace={true}
  initialTeamId="personal-{userId}"
/>
```

---

## 💬 Comentários

### Visão Geral

O sistema de comentários permite comunicação e colaboração em tarefas. Cada comentário pode conter uma mensagem de texto e anexos de arquivos.

### Funcionalidades

- ✅ Criar comentários em tarefas
- ✅ Listar comentários (ordenados por data)
- ✅ Excluir comentários próprios
- ✅ Anexar arquivos aos comentários (máx. 10 por comentário)
- ✅ Visualizar e baixar anexos
- ✅ Atualização em tempo real via WebSocket
- ✅ Validação de mensagem (máx. 2000 caracteres)
- ✅ Preview de anexos

### Estrutura de Dados

```typescript
interface KanbanTaskComment {
  id: string;
  taskId: string;
  userId: string;              // ID do usuário que criou
  message: string;             // Mensagem do comentário
  attachments: Attachment[];   // Anexos
  user: {                      // Dados do usuário (populado)
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
}

interface Attachment {
  id: string;
  filename: string;
  url: string;                 // URL para download
  size: number;               // Tamanho em bytes
  mimeType: string;           // Tipo MIME
  uploadedAt: string;         // ISO 8601
}
```

### Validações

**Mensagem:**
- Obrigatória (não pode estar vazia após trim)
- Máximo 2000 caracteres
- Validação em tempo real no frontend

**Anexos:**
- Máximo 10 arquivos por comentário
- Cada arquivo deve ter tamanho válido
- Tipos MIME permitidos (configurável no backend)
- Validação antes do upload

### Permissões

- **Criar comentário**: Qualquer usuário com acesso à tarefa
- **Excluir comentário**: Apenas o criador do comentário OU administradores
- **Visualizar comentários**: Qualquer usuário com acesso à tarefa

### Componente TaskDetailsModal - Aba Comentários

**Localização:** `src/components/modals/TaskDetailsModal.tsx`

**Funcionalidades:**
- Lista de comentários com scroll infinito
- Formulário de criação com validação
- Upload de múltiplos arquivos
- Preview de anexos
- Botão de download para cada anexo
- Botão de exclusão (apenas para próprios comentários)
- Loading states
- Tratamento de erros
- Atualização em tempo real

**Interface:**
```typescript
// Formulário de criação
<form onSubmit={handleSubmitComment}>
  <textarea 
    value={commentMessage}
    onChange={(e) => setCommentMessage(e.target.value)}
    maxLength={2000}
    placeholder="Escreva um comentário..."
  />
  <input 
    type="file" 
    multiple 
    onChange={handleFileSelect}
    accept="*/*"
  />
  <button type="submit" disabled={!commentMessage.trim() || isSubmitting}>
    Enviar
  </button>
</form>

// Lista de comentários
{comments.map(comment => (
  <CommentItem key={comment.id}>
    <Avatar user={comment.user} />
    <CommentContent>
      <CommentHeader>
        <UserName>{comment.user.name}</UserName>
        <CommentDate>{format(comment.createdAt, 'PPp')}</CommentDate>
        {canDeleteComment(comment) && (
          <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
            Excluir
          </DeleteButton>
        )}
      </CommentHeader>
      <CommentMessage>{comment.message}</CommentMessage>
      {comment.attachments.length > 0 && (
        <AttachmentsList>
          {comment.attachments.map(att => (
            <AttachmentItem key={att.id}>
              <AttachmentIcon />
              <AttachmentName>{att.filename}</AttachmentName>
              <DownloadButton href={att.url} download>
                Download
              </DownloadButton>
            </AttachmentItem>
          ))}
        </AttachmentsList>
      )}
    </CommentContent>
  </CommentItem>
))}
```

### API de Comentários

**Listar:**
```typescript
const comments = await kanbanApi.getTaskComments(taskId);
```

**Criar:**
```typescript
const formData = new FormData();
formData.append('message', 'Comentário sobre a tarefa');
formData.append('files', file1);
formData.append('files', file2);

const comment = await kanbanApi.createTaskComment(taskId, formData);
```

**Excluir:**
```typescript
await kanbanApi.deleteTaskComment(taskId, commentId);
```

### WebSocket

Quando um comentário é criado ou excluído, o WebSocket envia eventos para outros usuários visualizando a tarefa, atualizando a lista automaticamente.

---

## 📜 Histórico de Tarefas

### Visão Geral

O histórico registra todas as alterações feitas em uma tarefa, permitindo rastreabilidade completa e auditoria.

### Funcionalidades

- ✅ Registro automático de todas as alterações
- ✅ Timeline cronológica de eventos
- ✅ Detalhes de cada alteração (valores antigos e novos)
- ✅ Informações do usuário que realizou cada ação
- ✅ Filtros por tipo de ação
- ✅ Visualização de movimentações entre colunas
- ✅ Histórico completo desde a criação

### Estrutura de Dados

```typescript
interface HistoryEntry {
  id: string;
  action: string;              // Tipo de ação
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;                    // null para ações do sistema
  fromColumn?: {               // Para movimentações
    id: string;
    title: string;
    color: string;
  } | null;
  toColumn?: {                 // Para movimentações
    id: string;
    title: string;
    color: string;
  } | null;
  oldValue?: string;           // Valor anterior
  newValue?: string;           // Valor novo
  description?: string;        // Descrição adicional
  field?: string;              // Campo alterado
  fieldLabel?: string;         // Label amigável
  createdAt: string;           // ISO 8601
}
```

### Tipos de Ações

| Ação | Descrição | Campos Específicos |
|------|-----------|-------------------|
| `created` | Tarefa criada | - |
| `updated` | Tarefa atualizada | `field`, `oldValue`, `newValue` |
| `moved` | Movida entre colunas | `fromColumn`, `toColumn` |
| `assigned` | Responsável atribuído | `field`, `oldValue`, `newValue` |
| `unassigned` | Responsável removido | `field`, `oldValue` |
| `priority_changed` | Prioridade alterada | `field`, `oldValue`, `newValue` |
| `due_date_changed` | Data de vencimento alterada | `field`, `oldValue`, `newValue` |
| `description_changed` | Descrição alterada | `field`, `oldValue`, `newValue` |
| `title_changed` | Título alterado | `field`, `oldValue`, `newValue` |
| `tags_changed` | Tags alteradas | `field`, `oldValue`, `newValue` |
| `project_changed` | Projeto alterado | `field`, `oldValue`, `newValue` |
| `completed` | Tarefa concluída | - |
| `reopened` | Tarefa reaberta | - |

### Componente TaskDetailsModal - Aba Histórico

**Localização:** `src/components/modals/TaskDetailsModal.tsx`

**Funcionalidades:**
- Carregamento automático ao abrir aba
- Timeline visual com avatares
- Filtros por tipo de ação
- Destaque de ações importantes
- Formatação de valores (datas, prioridades, etc.)
- Scroll infinito para histórico longo
- Loading states
- Estado vazio quando não há histórico

**Interface:**
```typescript
// Timeline de histórico
<HistoryList>
  {history.map(entry => (
    <HistoryItem key={entry.id}>
      <HistoryAvatar>
        <Avatar user={entry.user} />
      </HistoryAvatar>
      <HistoryContent>
        <HistoryAction>
          <strong>{entry.user?.name || 'Sistema'}</strong> {getActionLabel(entry.action)}
          {entry.field && <span> - {getFieldLabel(entry.field)}</span>}
        </HistoryAction>
        
        {/* Valores antigos e novos */}
        {entry.oldValue && (
          <HistoryOldValue>
            <strong>Antes:</strong> {entry.oldValue}
          </HistoryOldValue>
        )}
        {entry.newValue && (
          <HistoryNewValue>
            <strong>Agora:</strong> {entry.newValue}
          </HistoryNewValue>
        )}
        
        {/* Movimentação entre colunas */}
        {entry.fromColumn && entry.toColumn && (
          <HistoryMove>
            De <ColumnBadge color={entry.fromColumn.color}>
              {entry.fromColumn.title}
            </ColumnBadge>
            para <ColumnBadge color={entry.toColumn.color}>
              {entry.toColumn.title}
            </ColumnBadge>
          </HistoryMove>
        )}
        
        <HistoryDate>
          {format(new Date(entry.createdAt), 'PPp', { locale: ptBR })}
        </HistoryDate>
      </HistoryContent>
    </HistoryItem>
  ))}
</HistoryList>
```

### API de Histórico

**Buscar:**
```typescript
const history = await kanbanApi.getTaskHistory(taskId);
```

**Exemplo de Uso:**
```typescript
// Filtrar apenas movimentações
const moves = history.filter(entry => entry.action === 'moved');

// Filtrar alterações de um campo específico
const priorityChanges = history.filter(
  entry => entry.field === 'priority'
);

// Obter última alteração
const lastChange = history[history.length - 1];
```

### Registro Automático

O backend registra automaticamente todas as alterações:
- Ao criar tarefa: registra ação `created`
- Ao atualizar: registra ação `updated` com campo específico
- Ao mover: registra ação `moved` com colunas
- Ao atribuir responsável: registra ação `assigned` ou `unassigned`

### Visualização

O histórico é exibido em ordem cronológica (mais antigo primeiro), facilitando o acompanhamento da evolução da tarefa.

---

## 👤 Vinculação de Usuários

### Visão Geral

Cada tarefa está vinculada a usuários de duas formas: o criador (quem criou) e o responsável (quem está trabalhando).

### Tipos de Vinculação

#### 1. Criador (`createdById`)

- **Definição**: Automática no momento da criação
- **Fonte**: Token JWT do usuário autenticado
- **Imutável**: Não pode ser alterado após criação
- **Uso**: Rastreamento, histórico, auditoria

**Exemplo:**
```typescript
// Usuário autenticado: user-1 (João Silva)
const task = await createTask({
  title: "Nova tarefa",
  columnId: "col-1"
});

// Resultado:
// task.createdById = "user-1"
// task.createdBy = {
//   id: "user-1",
//   name: "João Silva",
//   email: "joao@example.com",
//   avatar: "..."
// }
```

#### 2. Responsável (`assignedToId`)

- **Definição**: Opcional, pode ser definido na criação ou depois
- **Alterável**: Pode ser alterado ou removido a qualquer momento
- **Uso**: Filtros, notificações, organização

**Exemplo:**
```typescript
// Criar tarefa atribuída a outro usuário
const task = await createTask({
  title: "Nova tarefa",
  columnId: "col-1",
  assignedToId: "user-2"  // Maria Santos
});

// Resultado:
// task.createdById = "user-1" (João - criador)
// task.assignedToId = "user-2" (Maria - responsável)
// task.createdBy = { id: "user-1", name: "João Silva", ... }
// task.assignedTo = { id: "user-2", name: "Maria Santos", ... }
```

### Alteração de Responsável

```typescript
// Atribuir responsável
await updateTask(taskId, {
  assignedToId: "user-3"
});

// Remover responsável
await updateTask(taskId, {
  assignedToId: null  // ou undefined
});
```

### Validações

- Usuário responsável deve existir
- Usuário responsável deve estar ativo
- Usuário responsável deve ter acesso à equipe/projeto
- Apenas usuários com `canEditTasks` podem alterar responsável

### Histórico

Todas as alterações de responsável são registradas no histórico:
- `assigned`: Quando um responsável é atribuído
- `unassigned`: Quando o responsável é removido
- Registra valores antigos e novos

### Filtros

O sistema permite filtrar tarefas por:
- Criadas por mim (`createdById = currentUserId`)
- Atribuídas a mim (`assignedToId = currentUserId`)
- Atribuídas a outro usuário (`assignedToId = userId`)
- Sem responsável (`assignedToId = null`)

### Permissões

- **Visualizar criador/responsável**: Qualquer usuário com acesso à tarefa
- **Alterar responsável**: Requer permissão `canEditTasks`
- **Criador não pode ser alterado**: Sempre mantém o usuário original

---

## 👥 Pessoas Envolvidas no Kanban

> **Data**: Janeiro 2025  
> **Versão**: 1.0  
> **Status**: ✅ Implementado

### 📖 Visão Geral

Esta funcionalidade permite adicionar múltiplos usuários (SDR, corretores, gestores) como "pessoas envolvidas" em uma tarefa do Kanban. Todos os usuários envolvidos podem visualizar e interagir com a tarefa e suas subtarefas.

### 🎯 Funcionalidades Implementadas

#### 1. **Pessoas Envolvidas**
- ✅ Adicionar usuários como pessoas envolvidas
- ✅ Remover usuários das pessoas envolvidas
- ✅ Definir lista completa de pessoas envolvidas
- ✅ Visualizar pessoas envolvidas no card

#### 2. **Acesso e Permissões**
- ✅ Usuários envolvidos podem ver o card completo
- ✅ Usuários envolvidos podem ver e gerenciar subtarefas
- ✅ Filtro para mostrar apenas cards onde o usuário está envolvido

#### 3. **Notificações**
- ✅ Notificação automática quando usuário é adicionado como pessoa envolvida
- ✅ Notificação via WebSocket em tempo real

#### 4. **Histórico**
- ✅ Rastreamento de quando pessoas são adicionadas/removidas
- ✅ Histórico completo de alterações

### 🔌 Endpoints da API

#### 1. Adicionar Pessoa Envolvida

```http
POST /kanban/tasks/:taskId/involved-users/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Parâmetros:**
- `taskId` (UUID): ID da tarefa
- `userId` (UUID): ID do usuário a ser adicionado

**Resposta (200):**
```json
{
  "id": "task-uuid",
  "title": "Negociação com João Silva",
  "involvedUsers": [
    {
      "id": "user-uuid",
      "name": "Maria Santos",
      "email": "maria@example.com",
      "avatar": "https://..."
    }
  ],
  // ... outros campos da tarefa
}
```

**Erros:**
- `404`: Tarefa ou usuário não encontrado
- `400`: Usuário já está envolvido nesta tarefa
- `403`: Usuário não tem acesso a esta equipe

---

#### 2. Remover Pessoa Envolvida

```http
DELETE /kanban/tasks/:taskId/involved-users/:userId
```

**Headers:**
```
Authorization: Bearer {token}
```

**Parâmetros:**
- `taskId` (UUID): ID da tarefa
- `userId` (UUID): ID do usuário a ser removido

**Resposta (200):**
```json
{
  "id": "task-uuid",
  "title": "Negociação com João Silva",
  "involvedUsers": [],
  // ... outros campos da tarefa
}
```

**Erros:**
- `404`: Tarefa não encontrada ou usuário não está envolvido
- `403`: Usuário não tem acesso a esta equipe

---

#### 3. Definir Lista de Pessoas Envolvidas

```http
PUT /kanban/tasks/:taskId/involved-users
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "userIds": ["user-uuid-1", "user-uuid-2", "user-uuid-3"]
}
```

**Resposta (200):**
```json
{
  "id": "task-uuid",
  "title": "Negociação com João Silva",
  "involvedUsers": [
    {
      "id": "user-uuid-1",
      "name": "Maria Santos",
      "email": "maria@example.com",
      "avatar": "https://..."
    },
    {
      "id": "user-uuid-2",
      "name": "Pedro Costa",
      "email": "pedro@example.com",
      "avatar": "https://..."
    }
  ],
  // ... outros campos da tarefa
}
```

**Erros:**
- `404`: Tarefa não encontrada
- `400`: Um ou mais usuários não foram encontrados
- `403`: Usuário não tem acesso a esta equipe

---

#### 4. Filtrar por Pessoa Envolvida

```http
GET /kanban/board/:teamId?involvedUserId={userId}
```

**Query Parameters:**
- `involvedUserId` (UUID): ID do usuário - mostra apenas cards onde ele está envolvido

**Resposta (200):**
```json
{
  "columns": [
    {
      "id": "column-uuid",
      "title": "Em Andamento",
      "tasks": [
        {
          "id": "task-uuid",
          "title": "Negociação com João Silva",
          "involvedUsers": [
            {
              "id": "user-uuid",
              "name": "Maria Santos",
              "email": "maria@example.com",
              "avatar": "https://..."
            }
          ],
          // ... outros campos
        }
      ]
    }
  ]
}
```

---

### 📊 Estrutura de Dados

#### KanbanTaskResponseDto

O campo `involvedUsers` foi adicionado à resposta da tarefa:

```typescript
interface KanbanTaskResponseDto {
  id: string;
  title: string;
  // ... outros campos
  involvedUsers?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}
```

#### KanbanBoardFiltersDto

O filtro `involvedUserId` foi adicionado:

```typescript
interface KanbanBoardFiltersDto {
  // ... outros filtros
  involvedUserId?: string; // Filtrar por pessoa envolvida
}
```

---

### 🎨 Exemplos de Integração Frontend

#### 1. Adicionar Pessoa Envolvida

```typescript
async function addInvolvedUser(taskId: string, userId: string) {
  const response = await fetch(
    `/api/kanban/tasks/${taskId}/involved-users/${userId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao adicionar pessoa envolvida');
  }

  const task = await response.json();
  return task;
}
```

#### 2. Remover Pessoa Envolvida

```typescript
async function removeInvolvedUser(taskId: string, userId: string) {
  const response = await fetch(
    `/api/kanban/tasks/${taskId}/involved-users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao remover pessoa envolvida');
  }

  const task = await response.json();
  return task;
}
```

#### 3. Definir Lista Completa

```typescript
async function setInvolvedUsers(taskId: string, userIds: string[]) {
  const response = await fetch(
    `/api/kanban/tasks/${taskId}/involved-users`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds }),
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao definir pessoas envolvidas');
  }

  const task = await response.json();
  return task;
}
```

#### 4. Filtrar Cards por Pessoa Envolvida

```typescript
async function getBoardWithInvolvedUserFilter(teamId: string, userId: string) {
  const response = await fetch(
    `/api/kanban/board/${teamId}?involvedUserId=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar quadro');
  }

  const board = await response.json();
  return board;
}
```

#### 5. Exibir Pessoas Envolvidas no Card

```tsx
function TaskCard({ task }: { task: KanbanTaskResponseDto }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      
      {/* Exibir pessoas envolvidas */}
      {task.involvedUsers && task.involvedUsers.length > 0 && (
        <div className="involved-users">
          <span className="label">Pessoas Envolvidas:</span>
          <div className="users-list">
            {task.involvedUsers.map(user => (
              <div key={user.id} className="user-avatar">
                <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 6. Componente para Adicionar/Remover Pessoas Envolvidas

```tsx
function InvolvedUsersManager({ taskId, currentInvolvedUsers }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    currentInvolvedUsers.map(u => u.id)
  );
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    // Buscar lista de usuários disponíveis
    fetchAvailableUsers();
  }, []);

  const handleSave = async () => {
    try {
      await setInvolvedUsers(taskId, selectedUsers);
      // Atualizar UI
    } catch (error) {
      console.error('Erro ao salvar pessoas envolvidas:', error);
    }
  };

  return (
    <div className="involved-users-manager">
      <h4>Pessoas Envolvidas</h4>
      <UserSelector
        users={availableUsers}
        selected={selectedUsers}
        onChange={setSelectedUsers}
      />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
```

---

### 🔔 Notificações

#### WebSocket

Quando uma pessoa é adicionada como envolvida, uma notificação é enviada via WebSocket:

```typescript
// Conectar ao WebSocket de notificações
const socket = io('/notifications', {
  auth: { token }
});

socket.on('new_notification', (data) => {
  const { notification } = data;
  
  if (notification.type === 'info' && 
      notification.title === 'Você foi adicionado a uma tarefa') {
    // Exibir notificação
    showNotification(notification);
    
    // Opcional: Redirecionar para a tarefa
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  }
});
```

#### Estrutura da Notificação

```json
{
  "id": "notification-uuid",
  "userId": "user-uuid",
  "companyId": "company-uuid",
  "type": "info",
  "title": "Você foi adicionado a uma tarefa",
  "message": "Você foi adicionado como pessoa envolvida na tarefa \"Negociação com João Silva\"",
  "actionUrl": "/kanban/board/team-uuid?taskId=task-uuid",
  "read": false,
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### 🎯 Regras de Acesso

#### Quem pode ver uma tarefa?

Uma tarefa pode ser visualizada por:
1. ✅ **Criador da tarefa** (`createdById`)
2. ✅ **Responsável pela tarefa** (`assignedToId`)
3. ✅ **Pessoas envolvidas** (`involvedUsers`)
4. ✅ **Usuários com acesso à equipe** (membros da equipe)

#### Quem pode adicionar/remover pessoas envolvidas?

Apenas usuários com acesso à equipe podem gerenciar pessoas envolvidas.

---

### 📝 Histórico

Todas as alterações de pessoas envolvidas são registradas no histórico da tarefa:

#### Tipos de Ação

- `INVOLVED_USER_ADDED`: Pessoa foi adicionada
- `INVOLVED_USER_REMOVED`: Pessoa foi removida

#### Exemplo de Entrada no Histórico

```json
{
  "id": "history-uuid",
  "taskId": "task-uuid",
  "action": "involved_user_added",
  "userId": "current-user-uuid",
  "newValue": "Maria Santos",
  "description": "Maria Santos foi adicionado como pessoa envolvida",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### 🧪 Testes

#### Cenários de Teste

1. ✅ Adicionar pessoa envolvida
2. ✅ Remover pessoa envolvida
3. ✅ Definir lista completa de pessoas envolvidas
4. ✅ Filtrar cards por pessoa envolvida
5. ✅ Verificar acesso de pessoa envolvida ao card
6. ✅ Verificar acesso de pessoa envolvida às subtarefas
7. ✅ Verificar notificação quando pessoa é adicionada
8. ✅ Verificar histórico de alterações

---

### ⚠️ Observações Importantes

1. **Migration**: A migration `1850000000000-CreateKanbanTaskInvolvedUsersTable` deve ser executada antes de usar esta funcionalidade.

2. **Performance**: O filtro `involvedUserId` usa `INNER JOIN`, então pode afetar a performance em quadros muito grandes. Considere adicionar índices se necessário.

3. **Notificações**: As notificações são enviadas apenas quando um usuário diferente do atual é adicionado (não envia notificação para si mesmo).

4. **Subtarefas**: Usuários envolvidos na tarefa principal têm acesso automático a todas as subtarefas.

---

### 🔗 Links Relacionados

- [Documentação Completa do Kanban](./KANBAN_PAGE.md)
- [Revisão Completa do Sistema Kanban](./KANBAN_VALIDATIONS_REVIEW.md)
- [Guia de Ações e Validações](./KANBAN_VALIDATIONS_AND_ACTIONS_CONDITIONAL.md)

---

**Última atualização**: Janeiro 2025

---

## 🔐 Permissões

### Permissões Disponíveis

```typescript
interface KanbanPermissions {
  canCreateTasks: boolean;      // Pode criar tarefas
  canEditTasks: boolean;        // Pode editar tarefas
  canDeleteTasks: boolean;      // Pode deletar tarefas
  canMoveTasks: boolean;        // Pode mover tarefas entre colunas
  canCreateColumns: boolean;    // Pode criar colunas
  canEditColumns: boolean;      // Pode editar colunas
  canDeleteColumns: boolean;    // Pode deletar colunas
}
```

### Controle de Acesso

As permissões são verificadas antes de permitir ações:

```typescript
// Exemplo: Criar tarefa
{permissions.canCreateTasks && (
  <button onClick={handleCreateTask}>Criar Tarefa</button>
)}

// Exemplo: Mover tarefa
const handleDragEnd = async (event: DragEndEvent) => {
  if (!permissions.canMoveTasks) return;
  // ... mover tarefa
};
```

### Fonte das Permissões

As permissões vêm do backend na resposta de `GET /kanban/board/:teamId`:

```typescript
{
  "permissions": {
    "canCreateTasks": true,
    "canEditTasks": true,
    // ...
  }
}
```

---

## 🔌 WebSocket em Tempo Real

### Serviço

**Localização:** `src/services/kanbanSocketService.ts`

**Conexão:**
```typescript
const socket = io(`${BASE_URL}/kanban`, {
  auth: { token },
  transports: ['websocket'],
});
```

### Eventos

#### `task_updated`

Evento enviado quando uma tarefa é atualizada em outro dispositivo/sessão.

**Payload:**
```typescript
KanbanTask  // Tarefa atualizada
```

**Handler:**
```typescript
kanbanSocketService.on('task_updated', (updatedTask: KanbanTask) => {
  setBoard(prev => ({
    ...prev,
    tasks: prev.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ),
  }));
});
```

### Reconexão Automática

O serviço implementa reconexão automática com delay de 5 segundos:

```typescript
private scheduleReconnect() {
  this.reconnectTimeout = setTimeout(() => {
    this.ensureConnection();
  }, 5000);
}
```

---

## ⚙️ Configurações

### KanbanSettings

**Localização:** `src/hooks/useKanbanSettings.ts`

**Interface:**
```typescript
interface KanbanSettings {
  // Tags e Prioridades
  tags: Array<{ id: string; name: string; color: string }>;
  priorities: Array<{ value: string; label: string; color: string }>;
  
  // Configurações Visuais
  theme: 'light' | 'dark' | 'auto';
  cardDensity: 'compact' | 'normal' | 'comfortable';
  showTaskCount: boolean;
  showAssigneeAvatars: boolean;
  showPriorityIndicators: boolean;
  showDueDateIndicators: boolean;
  defaultColumnColors: string[];
  
  // Configurações de Comportamento
  autoSave: boolean;
  autoSaveInterval: number;
  allowTaskReordering: boolean;
  allowTaskDuplication: boolean;
  allowTaskArchiving: boolean;
  autoArchiveCompleted: boolean;
  autoArchiveAfterDays: number;
  
  // Configurações de Notificações
  enableNotifications: boolean;
  notifyOnTaskAssignment: boolean;
  notifyOnDueDateApproaching: boolean;
  notifyOnDueDateOverdue: boolean;
  dueDateWarningDays: number;
  
  // Configurações de Colunas
  allowColumnCreation: boolean;
  allowColumnDeletion: boolean;
  allowColumnReordering: boolean;
  maxColumnsPerBoard: number;
  defaultColumnLimit: number;
  
  // Configurações de Tarefas
  defaultTaskPriority: 'low' | 'medium' | 'high' | 'urgent';
  requireTaskDescription: boolean;
  allowTaskComments: boolean;
  allowTaskAttachments: boolean;
  maxTaskTitleLength: number;
  maxTaskDescriptionLength: number;
  
  // Configurações de Filtros
  enableAdvancedFilters: boolean;
  saveFilterPresets: boolean;
  defaultFilterView: 'all' | 'my-tasks' | 'overdue' | 'completed';
  
  // Configurações de Exportação
  allowExport: boolean;
  exportFormats: ('pdf' | 'excel' | 'csv')[];
  includeCompletedTasks: boolean;
  includeTaskHistory: boolean;
  
  // Configurações de Integração
  enableWebhooks: boolean;
  webhookUrl?: string;
  syncWithCalendar: boolean;
  calendarProvider?: 'google' | 'outlook' | 'apple';
  
  // Configurações de Performance
  enableVirtualization: boolean;
  maxTasksPerColumn: number;
  enableLazyLoading: boolean;
  cacheExpirationTime: number;
}
```

### Armazenamento

As configurações são armazenadas no `localStorage` com a chave `kanban-settings`.

### View Settings

Configurações de visualização específicas (ex: densidade de card, mostrar/ocultar elementos) são gerenciadas por `useKanbanViewSettings`.

---

## 🎣 Hooks Relacionados

### useKanban

**Localização:** `src/hooks/useKanban.ts`

**Interface:**
```typescript
{
  board: KanbanBoard;                    // Quadro filtrado
  originalBoard: KanbanBoard;            // Quadro completo (sem filtros)
  filters: KanbanFilters;
  filterOptions: KanbanFilterOptions;
  permissions: KanbanPermissions;
  loading: boolean;
  error: string | null;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  createColumn: (data: CreateColumnDto) => Promise<KanbanColumn>;
  updateColumn: (id: string, data: UpdateColumnDto) => Promise<KanbanColumn>;
  deleteColumn: (id: string) => Promise<void>;
  createTask: (data: CreateTaskDto, teamId: string, projectId?: string) => Promise<KanbanTask>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<KanbanTask>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (data: MoveTaskDto) => Promise<void>;
  refresh: (teamId: string, projectId?: string) => Promise<void>;
  handleFiltersChange: (filters: KanbanFilters) => void;
  handleClearFilters: () => void;
}
```

**Funcionalidades:**
- Buscar quadro Kanban
- Gerenciar colunas (CRUD)
- Gerenciar tarefas (CRUD)
- Mover tarefas
- Aplicar filtros
- Gerenciar permissões
- Sincronização com WebSocket
- Auto-reload ao mudar empresa

### useKanbanSettings

**Localização:** `src/hooks/useKanbanSettings.ts`

**Funcionalidades:**
- Carregar configurações do localStorage
- Salvar configurações
- Gerenciar tags e prioridades
- Configurações visuais e de comportamento

### useKanbanViewSettings

**Localização:** `src/hooks/useKanbanViewSettings.ts`

**Funcionalidades:**
- Configurações de visualização (densidade, mostrar/ocultar elementos)
- Armazenamento no localStorage
- Aplicação de estilos dinâmicos

### useKanbanScroll

**Localização:** `src/hooks/useKanbanScroll.ts`

**Funcionalidades:**
- Gerenciar scroll horizontal do quadro
- Controles de scroll
- Scroll suave

### useProjects

**Localização:** `src/hooks/useProjects.ts`

**Interface:**
```typescript
{
  projects: KanbanProject[];
  loading: boolean;
  error: string | null;
  createProject: (data: CreateKanbanProjectDto) => Promise<KanbanProjectResponseDto>;
  updateProject: (id: string, data: UpdateKanbanProjectDto) => Promise<KanbanProjectResponseDto>;
  deleteProject: (id: string) => Promise<void>;
  finalizeProject: (id: string) => Promise<KanbanProjectResponseDto>;
  getProjectsByTeam: (teamId: string) => Promise<KanbanProjectResponseDto[]>;
  getProjectById: (id: string) => Promise<KanbanProjectResponseDto>;
  getProjectHistory: (id: string) => Promise<any[]>;
  refreshProjects: () => Promise<void>;
}
```

**Funcionalidades:**
- Gerenciar estado de projetos
- CRUD completo de projetos
- Finalização de projetos
- Histórico de projetos
- Auto-reload ao mudar empresa
- Carregamento automático ao mudar `teamId`

### useTeams

**Localização:** `src/hooks/useTeams.ts`

**Funcionalidades:**
- Carregar equipes do usuário
- Selecionar equipe ativa
- Gerenciar estado de equipes
- Integração com permissões

### usePersonalProject

**Localização:** `src/hooks/usePersonalProject.ts`

**Funcionalidades:**
- Gerenciar workspace pessoal
- Criar workspace pessoal automaticamente
- Acessar projetos pessoais

---

## 🔄 Fluxos Principais

### Fluxo: Criar Tarefa

```
1. Usuário clica em "Adicionar Tarefa" em uma coluna
   ↓
2. Modal de criação é aberto
   ↓
3. Usuário preenche dados (título, descrição, prioridade, responsável, prazo, etc.)
   ↓
4. Formulário é validado
   ↓
5. API POST /kanban/tasks é chamada
   ↓
6. Tarefa é criada no backend
   ↓
7. Quadro é recarregado (fetchBoard)
   ↓
8. Nova tarefa aparece na coluna
   ↓
9. WebSocket envia evento 'task_updated' para outros clientes
```

**Campos Obrigatórios:**
- `title`: Título da tarefa (string, obrigatório)
- `columnId`: ID da coluna onde a tarefa será criada (string, obrigatório)

**Campos Opcionais:**
- `description`: Descrição detalhada da tarefa (string)
- `priority`: Prioridade (`'low' | 'medium' | 'high' | 'urgent'`)
- `assignedToId`: ID do usuário responsável pela tarefa (string)
- `dueDate`: Data de vencimento (Date)
- `projectId`: ID do projeto associado (string)
- `tags`: Array de tags (string[])

**Vinculação de Usuários:**

A tarefa é automaticamente vinculada ao usuário que a cria:

- **`createdById`**: ID do usuário autenticado (extraído do token JWT)
  - Definido automaticamente pelo backend
  - Não pode ser alterado após criação
  - Usado para rastreamento e histórico

- **`assignedToId`**: ID do usuário responsável pela tarefa (opcional)
  - Pode ser definido na criação ou alterado depois
  - Se não informado, a tarefa fica sem responsável
  - Pode ser alterado por usuários com permissão `canEditTasks`
  - Usado para filtros e notificações

**Exemplo de Criação com Usuário:**
```typescript
// Tarefa criada pelo usuário autenticado (userId extraído do token)
// e atribuída a outro usuário
const newTask = await createTask({
  title: "Implementar login",
  description: "Criar página de login com autenticação",
  columnId: "col-1",
  priority: "high",
  assignedToId: "user-2",  // Atribuída a outro usuário
  dueDate: new Date("2024-01-25"),
  projectId: "project-456"
});

// Resultado:
// - createdById: "user-1" (usuário autenticado)
// - assignedToId: "user-2" (usuário responsável)
// - createdBy: { id: "user-1", name: "João Silva", ... } (populado)
// - assignedTo: { id: "user-2", name: "Maria Santos", ... } (populado)
```

**Permissões Necessárias:**
- `canCreateTasks`: true (verificado antes de mostrar botão de criar)

**Validações:**
- Título não pode estar vazio
- Coluna deve existir e estar ativa
- Usuário responsável (se informado) deve existir e estar ativo
- Projeto (se informado) deve existir e estar ativo
- Usuário autenticado deve ter permissão para criar tarefas na equipe/projeto

### Fluxo: Editar Tarefa

```
1. Usuário clica em uma tarefa ou no botão "Editar"
   ↓
2. Modal de edição é aberto com dados atuais da tarefa
   ↓
3. Usuário modifica campos desejados
   ↓
4. Formulário é validado
   ↓
5. API PUT /kanban/tasks/:id é chamada
   ↓
6. Tarefa é atualizada no backend
   ↓
7. Quadro é recarregado (fetchBoard)
   ↓
8. Tarefa atualizada aparece na coluna
   ↓
9. WebSocket envia evento 'task_updated' para outros clientes
```

**Campos Editáveis:**
- `title`: Título da tarefa
- `description`: Descrição detalhada
- `columnId`: Coluna onde a tarefa está (permite mover entre colunas)
- `position`: Posição dentro da coluna
- `priority`: Prioridade
- `assignedToId`: Usuário responsável
- `dueDate`: Data de vencimento
- `projectId`: Projeto associado
- `tags`: Tags da tarefa

**Permissões Necessárias:**
- `canEditTasks`: true (verificado antes de mostrar botão de editar)

### Fluxo: Excluir Tarefa

```
1. Usuário clica no botão "Excluir" em uma tarefa
   ↓
2. Modal de confirmação é exibido
   ↓
3. Usuário confirma a exclusão
   ↓
4. API DELETE /kanban/tasks/:id é chamada
   ↓
5. Tarefa é removida do backend
   ↓
6. Quadro é recarregado (fetchBoard)
   ↓
7. Tarefa desaparece da coluna
   ↓
8. WebSocket envia evento 'task_updated' para outros clientes
```

**Atenção:**
- A exclusão é **permanente** e **irreversível**
- Todos os comentários e histórico associados à tarefa também são removidos
- A ação não pode ser desfeita

**Permissões Necessárias:**
- `canDeleteTasks`: true (verificado antes de mostrar botão de excluir)

**Validações:**
- Tarefa deve existir
- Usuário deve ter permissão para excluir tarefas

### Fluxo: Mover Tarefa (Drag and Drop)

```
1. Usuário arrasta tarefa para outra coluna
   ↓
2. onDragStart: tarefa é marcada como "arrastando"
   ↓
3. onDragOver: feedback visual (hover)
   ↓
4. onDragEnd: tarefa é solta
   ↓
5. Optimistic update: UI atualiza imediatamente
   ↓
6. API POST /kanban/tasks/move é chamada
   ↓
7. Backend atualiza posição da tarefa
   ↓
8. Se sucesso: UI mantém mudança
   ↓
9. Se erro: Rollback (reverter para posição anterior)
   ↓
10. WebSocket envia evento 'task_updated' para outros clientes
```

### Fluxo: Criar Coluna

```
1. Usuário clica em "Adicionar Coluna"
   ↓
2. Modal de criação é aberto
   ↓
3. Usuário preenche título, descrição, cor
   ↓
4. API POST /kanban/columns é chamada
   ↓
5. Coluna é criada no backend
   ↓
6. Coluna é adicionada ao estado local
   ↓
7. Coluna aparece no quadro (ordenada por position)
```

### Fluxo: Reordenar Colunas

```
1. Usuário arrasta coluna para nova posição
   ↓
2. Optimistic update: colunas são reordenadas localmente
   ↓
3. API POST /kanban/columns/reorder/:teamId é chamada
   ↓
4. Backend atualiza positions das colunas
   ↓
5. Se sucesso: UI mantém nova ordem
   ↓
6. Se erro: Rollback (reverter para ordem anterior)
```

### Fluxo: Aplicar Filtros

```
1. Usuário seleciona filtros (responsável, prioridade, etc.)
   ↓
2. handleFiltersChange é chamado
   ↓
3. Estado de filtros é atualizado
   ↓
4. useMemo recalcula filteredTasks
   ↓
5. Quadro é re-renderizado com tarefas filtradas
   ↓
6. Tarefas que não correspondem aos filtros são ocultadas
```

### Fluxo: Atualização em Tempo Real

```
1. Usuário A atualiza tarefa
   ↓
2. Backend salva alteração
   ↓
3. Backend envia evento WebSocket 'task_updated'
   ↓
4. Usuário B recebe evento
   ↓
5. Hook useKanban atualiza estado local
   ↓
6. Tarefa é atualizada na UI do Usuário B
```

### Fluxo: Criar Comentário

```
1. Usuário abre TaskDetailsModal e vai para aba "Comentários"
   ↓
2. Usuário digita mensagem (opcionalmente anexa arquivos)
   ↓
3. Formulário valida mensagem (não vazia, máx. 2000 caracteres)
   ↓
4. Valida anexos (máx. 10 arquivos, tamanho válido)
   ↓
5. FormData é criado com mensagem e arquivos
   ↓
6. API POST /kanban/tasks/:taskId/comments é chamada
   ↓
7. Backend salva comentário e faz upload dos arquivos
   ↓
8. Comentário é retornado com dados completos
   ↓
9. Comentário é adicionado à lista local (optimistic update)
   ↓
10. WebSocket envia evento para outros usuários
   ↓
11. Outros usuários veem o novo comentário em tempo real
```

**Validações no Frontend:**
- Mensagem não pode estar vazia (após trim)
- Mensagem não pode exceder 2000 caracteres
- Máximo 10 arquivos por comentário
- Cada arquivo deve ter tamanho válido
- Feedback visual de erros

### Fluxo: Visualizar Histórico

```
1. Usuário abre TaskDetailsModal e vai para aba "Histórico"
   ↓
2. Modal carrega histórico via API GET /kanban/tasks/:id/history
   ↓
3. Histórico é exibido em timeline cronológica
   ↓
4. Cada entrada mostra:
   - Usuário que realizou a ação
   - Tipo de ação
   - Valores antigos e novos (quando aplicável)
   - Colunas de origem/destino (para movimentações)
   - Data e hora da ação
   ↓
5. Usuário pode filtrar por tipo de ação
   ↓
6. Histórico é atualizado automaticamente quando tarefa muda
```

**Tipos de Entradas no Histórico:**
- Criação da tarefa
- Alteração de título
- Alteração de descrição
- Mudança de prioridade
- Atribuição/remoção de responsável
- Alteração de data de vencimento
- Movimentação entre colunas
- Alteração de tags
- Alteração de projeto
- Conclusão/reabertura da tarefa

### Fluxo: Vincular Usuário a Tarefa

```
1. Ao criar tarefa:
   - createdById é definido automaticamente (usuário autenticado)
   - assignedToId pode ser definido opcionalmente
   ↓
2. Ao editar tarefa:
   - createdById permanece inalterado
   - assignedToId pode ser alterado/removido
   ↓
3. Backend valida:
   - Usuário responsável existe e está ativo
   - Usuário tem acesso à equipe/projeto
   ↓
4. Histórico registra alteração:
   - Ação: "assigned" ou "unassigned"
   - Usuário que fez a alteração
   - Valor antigo e novo
   ↓
5. Notificações são enviadas (se configurado)
   ↓
6. WebSocket atualiza outros usuários
```

**Regras de Vinculação:**
- `createdById`: Sempre o usuário autenticado, não pode ser alterado
- `assignedToId`: Pode ser qualquer usuário da equipe, pode ser alterado
- Apenas usuários com `canEditTasks` podem alterar `assignedToId`
- Remover responsável: definir `assignedToId` como `null` ou `undefined`

---

## 🚀 Próximas Melhorias

- [ ] Sub-tarefas (checklist dentro de tarefas)
- [ ] Anexos de arquivos em tarefas
- [ ] Tempo estimado vs tempo real
- [ ] Gráficos e relatórios de progresso
- [ ] Templates de colunas
- [ ] Automações (ex: mover para "Concluído" quando todas sub-tarefas completas)
- [ ] Etiquetas customizáveis (além de tags)
- [ ] Comentários com menções (@user)
- [ ] Notificações push
- [ ] Exportação para PDF/Excel
- [ ] Importação de tarefas
- [ ] Integração com calendário
- [ ] Workflows customizáveis
- [ ] Permissões por coluna
- [ ] Limite de tarefas por coluna
- [ ] Arquivo automático de tarefas concluídas
- [ ] Busca avançada (filtros complexos)
- [ ] Histórico detalhado de mudanças
- [ ] Modo de visualização alternativa (lista, timeline)

---

## 📝 Notas Técnicas

### Performance

- **Optimistic Updates**: UI atualiza antes da resposta do servidor
- **Virtualização**: Suporte para virtualização de listas grandes (futuro)
- **Memoização**: Filtros são calculados com `useMemo`
- **Debounce**: Busca textual usa debounce para reduzir chamadas

### Responsividade

- **Desktop**: Drag pelo card inteiro, scroll horizontal
- **Tablet**: Drag pelo handle, scroll vertical nas colunas
- **Mobile**: Drag pelo handle, cards mais compactos

### Estado Offline

- Mudanças são mantidas localmente até reconexão
- Sincronização automática ao reconectar
- Tratamento de conflitos (último write wins)

---

## 👥 Times/Equipes

### Conceito

Times (ou Equipes) são grupos de usuários que compartilham um quadro Kanban. Cada time pode ter múltiplos projetos e múltiplos membros.

### Funcionalidades de Times

- ✅ Criar times
- ✅ Editar times (nome, descrição, cor)
- ✅ Deletar times
- ✅ Listar times do usuário
- ✅ Selecionar time ativo
- ✅ Gerenciar membros do time (backend)
- ✅ Permissões por time

### Estrutura de Time

```typescript
interface Team {
  id: string;
  name: string;
  description?: string;
  color?: string;
  companyId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  members?: TeamMember[];
  isPersonal?: boolean;  // Indica se é workspace pessoal
}
```

### Componente TeamSelector

**Localização:** `src/components/kanban/TeamSelector.tsx`

**Funcionalidades:**
- Lista todas as equipes do usuário
- Permite selecionar equipe
- Botão para criar nova equipe
- Botão para solicitar acesso
- Menu de ações (editar, deletar) por equipe
- Filtra automaticamente times pessoais
- Estado vazio quando não há equipes
- Integração com permissões

**Permissões:**
- `team:create` - Criar times
- `team:update` - Editar times
- `team:delete` - Deletar times

### Workspace Pessoal vs Times

**Workspace Pessoal:**
- Criado automaticamente
- Privado para o usuário
- Acessível via `/kanban/projects/team/personal`
- Não aparece no seletor de times
- `isPersonal: true`

**Times Normais:**
- Criados manualmente
- Compartilhados entre membros
- Aparecem no seletor de times
- Podem ter múltiplos projetos
- `isPersonal: false` ou undefined

### Integração com Projetos

- Cada projeto pertence a um time (`teamId`)
- Projetos podem ser filtrados por time
- Workspace pessoal é um time especial
- Ao selecionar time, projetos do time são carregados

---

## 👥 Times/Equipes

### Conceito

Times (ou Equipes) são grupos de usuários que compartilham um quadro Kanban. Cada time pode ter múltiplos projetos e múltiplos membros.

### Funcionalidades de Times

- ✅ Criar times
- ✅ Editar times (nome, descrição, cor)
- ✅ Deletar times
- ✅ Listar times do usuário
- ✅ Selecionar time ativo
- ✅ Gerenciar membros do time (backend)
- ✅ Permissões por time
- ✅ Filtro automático de times pessoais

### Estrutura de Time

```typescript
interface Team {
  id: string;
  name: string;
  description?: string;
  color?: string;
  companyId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  members?: TeamMember[];
  isPersonal?: boolean;  // Indica se é workspace pessoal
}
```

### Componente TeamSelector

**Localização:** `src/components/kanban/TeamSelector.tsx`

**Props:**
```typescript
interface TeamSelectorProps {
  onTeamSelect: (team: Team | null) => void;
  selectedTeam: Team | null;
}
```

**Funcionalidades:**
- Lista todas as equipes do usuário
- Permite selecionar equipe
- Botão para criar nova equipe (navega para `/teams/create`)
- Botão para solicitar acesso a equipes
- Menu de ações (editar, deletar) por equipe
- Filtra automaticamente times pessoais (não mostra no seletor)
- Estado vazio quando não há equipes
- Integração com permissões (`team:create`, `team:update`, `team:delete`)
- Visual com cor do time e nome
- Indicador de seleção (checkmark)

**Permissões:**
- `team:create` - Criar times
- `team:update` - Editar times
- `team:delete` - Deletar times

**Integração:**
- Usa hook `useTeams` para carregar equipes
- Navega para `/teams/create` ao criar equipe
- Verifica permissões via `usePermissionsContextOptional`
- Integra com `useRoleAccess` para verificar roles (admin, master)

### Workspace Pessoal vs Times

**Workspace Pessoal:**
- Criado automaticamente pelo backend
- Privado para o usuário
- Acessível via `/kanban/projects/team/personal`
- Não aparece no seletor de times
- `isPersonal: true`
- ID geralmente no formato `personal-{userId}`
- Permite organização de tarefas pessoais sem equipe

**Times Normais:**
- Criados manualmente pelo usuário
- Compartilhados entre membros da equipe
- Aparecem no seletor de times
- Podem ter múltiplos projetos
- `isPersonal: false` ou undefined
- Gerenciados via página `/teams/create` ou modal

### Integração com Projetos

- Cada projeto pertence a um time (`teamId`)
- Projetos podem ser filtrados por time
- Workspace pessoal é um time especial
- Ao selecionar time, projetos do time são carregados automaticamente
- Projetos de outros times não são exibidos

### Fluxo: Selecionar Time

```
1. Usuário clica em um time no TeamSelector
   ↓
2. onTeamSelect é chamado com o time selecionado
   ↓
3. selectedTeam é atualizado
   ↓
4. useProjects carrega projetos do time
   ↓
5. ProjectSelector exibe projetos do time
   ↓
6. useKanban.refresh é chamado com novo teamId
   ↓
7. Quadro Kanban é recarregado com dados do time
```

### Hook useTeams

**Localização:** `src/hooks/useTeams.ts`

**Interface:**
```typescript
{
  teams: Team[];
  selectedTeam: Team | null;
  selectTeam: (team: Team | null) => void;
  loading: boolean;
  error: string | null;
  reloadTeams: () => Promise<void>;
}
```

**Funcionalidades:**
- Carregar equipes do usuário
- Selecionar equipe ativa
- Gerenciar estado de equipes
- Integração com permissões
- Auto-reload ao mudar empresa

### Página de Criação de Time

**Rota:** `/teams/create`

**Funcionalidades:**
- Formulário para criar novo time
- Campos: nome, descrição, cor
- Validação de formulário
- Redirecionamento após criação

---

**Última atualização:** Janeiro 2025

