# 📋 Documentação Técnica - Validações e Ações por Coluna no Kanban

## 📑 Índice

1. [Visão Geral](#-visão-geral)
2. [Requisitos Funcionais](#-requisitos-funcionais)
3. [Estrutura de Dados](#-estrutura-de-dados)
4. [Endpoints da API](#-endpoints-da-api)
5. [Fluxos de Execução](#-fluxos-de-execução)
6. [Tipos de Validações](#-tipos-de-validações)
7. [Tipos de Ações](#-tipos-de-ações)
8. [Integrações com Módulos Existentes](#-integrações-com-módulos-existentes)
9. [Exemplos Práticos](#-exemplos-práticos)
10. [Tratamento de Erros](#-tratamento-de-erros)
11. [Performance e Otimizações](#-performance-e-otimizações)
12. [Segurança e Permissões](#-segurança-e-permissões)

---

## 🎯 Visão Geral

Este documento descreve a implementação de um sistema de **validações e ações por coluna** no Kanban. Cada coluna pode ter:

- **Validações**: Regras que devem ser atendidas para que uma tarefa possa estar naquela coluna
- **Ações**: Operações automáticas executadas quando uma tarefa entra, sai ou permanece em uma coluna

### Objetivo

Permitir que empresas configurem workflows personalizados no Kanban, onde:
- Colunas podem exigir que tarefas atendam certos critérios (validações)
- Colunas podem executar ações automáticas ao receber tarefas (criar propriedade, cliente, documento, etc.)

### Casos de Uso Principais

1. **Coluna "Proposta Enviada"**: Exige cliente vinculado e documento anexado. Ao entrar, cria documento automaticamente.
2. **Coluna "Aguardando Aprovação"**: Exige documento assinado. Ao entrar, notifica aprovadores.
3. **Coluna "Venda Fechada"**: Exige cliente, propriedade e contrato. Ao entrar, cria propriedade, cliente e registra transação financeira.

---

## 📋 Requisitos Funcionais

### RF1: Validações por Coluna

- **RF1.1**: Cada coluna pode ter múltiplas validações configuradas
- **RF1.2**: Validações podem ser de diferentes tipos (campo obrigatório, checklist, documento, relacionamento, condição customizada)
- **RF1.3**: Cada validação pode ter comportamento: bloquear, avisar ou marcar como incompleto
- **RF1.4**: Validações devem ser executadas quando uma tarefa tenta entrar na coluna
- **RF1.5**: Mensagens de erro customizadas por validação
- **RF1.6**: Validações podem ser ativadas/desativadas sem deletar

### RF2: Ações por Coluna

- **RF2.1**: Cada coluna pode ter múltiplas ações configuradas
- **RF2.2**: Ações podem ser executadas em três momentos: ao entrar (on_enter), ao sair (on_exit), ou enquanto está (on_stay)
- **RF2.3**: Ações podem criar/atualizar entidades do sistema (propriedade, cliente, documento, etc.)
- **RF2.4**: Ações podem enviar notificações (email, SMS, push)
- **RF2.5**: Ações podem modificar a própria tarefa (adicionar tags, mudar prioridade, etc.)
- **RF2.6**: Ações podem ter condições para execução
- **RF2.7**: Ações podem ser ativadas/desativadas sem deletar
- **RF2.8**: Mapeamento de campos da tarefa para entidades criadas/atualizadas

### RF3: Configuração

- **RF3.1**: Interface para configurar validações e ações por coluna
- **RF3.2**: Validações e ações podem ser reordenadas
- **RF3.3**: Configurações são por equipe/projeto (herança de equipe para projetos)
- **RF3.4**: Histórico de execuções de validações e ações

### RF4: Feedback e Notificações

- **RF4.1**: Retornar lista de validações que falharam ao tentar mover tarefa
- **RF4.2**: Retornar lista de ações executadas após mover tarefa
- **RF4.3**: Logs de erros em ações para debug
- **RF4.4**: Notificações quando validações bloqueiam movimento

---

## 📊 Estrutura de Dados

### 1. Extensão de KanbanColumn

```typescript
interface KanbanColumn {
  // ... campos existentes ...
  id: string;
  title: string;
  description?: string;
  color?: string;
  position: number;
  isActive: boolean;
  teamId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  
  // NOVOS CAMPOS
  validations?: ColumnValidation[];
  actions?: ColumnAction[];
}
```

### 2. ColumnValidation (Validação de Coluna)

```typescript
interface ColumnValidation {
  id: string;
  columnId: string;
  type: ValidationType;
  config: ValidationConfig;
  behavior: ValidationBehavior;
  message: string; // Mensagem de erro customizada
  order: number; // Ordem de execução
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

enum ValidationType {
  REQUIRED_FIELD = 'required_field',           // Campo obrigatório
  REQUIRED_CHECKLIST = 'required_checklist',   // Checklist obrigatório
  REQUIRED_DOCUMENT = 'required_document',     // Documento obrigatório
  REQUIRED_RELATIONSHIP = 'required_relationship', // Relacionamento obrigatório
  CUSTOM_CONDITION = 'custom_condition'        // Condição customizada
}

enum ValidationBehavior {
  BLOCK = 'block',           // Bloqueia movimento se falhar
  WARN = 'warn',             // Avisa mas permite movimento
  MARK_INCOMPLETE = 'mark_incomplete' // Marca como incompleto mas permite
}
```

### 3. ValidationConfig (Configuração de Validação)

```typescript
interface ValidationConfig {
  // Para REQUIRED_FIELD
  fieldName?: string;        // Nome do campo (ex: 'assignedToId', 'dueDate', 'priority')
  fieldType?: string;        // Tipo do campo (ex: 'string', 'number', 'date', 'reference')
  customFieldId?: string;    // Se for campo customizado, ID do campo
  
  // Para REQUIRED_CHECKLIST
  checklistId?: string;      // ID do checklist vinculado
  requiredItems?: string[];  // IDs dos itens obrigatórios (se vazio, todos obrigatórios)
  allItemsRequired?: boolean; // Se true, todos os itens devem estar marcados
  
  // Para REQUIRED_DOCUMENT
  documentType?: string;     // Tipo de documento (ex: 'proposta', 'contrato')
  documentStatus?: 'any' | 'signed' | 'approved'; // Status exigido
  minDocuments?: number;     // Mínimo de documentos (padrão: 1)
  documentCategory?: string; // Categoria específica
  
  // Para REQUIRED_RELATIONSHIP
  relationshipType?: 'client' | 'property' | 'project' | 'rental';
  required?: boolean;        // Se true, relacionamento deve existir
  
  // Para CUSTOM_CONDITION
  condition?: {
    field: string;           // Campo a validar
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 
             'greater_or_equal' | 'less_or_equal' | 'contains' | 
             'not_contains' | 'empty' | 'not_empty' | 'in' | 'not_in';
    value: any;             // Valor de comparação
    valueType?: 'string' | 'number' | 'date' | 'boolean' | 'array';
  };
}
```

### 4. ColumnAction (Ação de Coluna)

```typescript
interface ColumnAction {
  id: string;
  columnId: string;
  trigger: ActionTrigger;
  type: ActionType;
  config: ActionConfig;
  conditions?: ActionCondition[]; // Condições para executar (opcional)
  order: number; // Ordem de execução
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

enum ActionTrigger {
  ON_ENTER = 'on_enter',  // Ao entrar na coluna
  ON_EXIT = 'on_exit',    // Ao sair da coluna
  ON_STAY = 'on_stay'     // Enquanto está na coluna (periódico)
}

enum ActionType {
  // Criar entidades
  CREATE_PROPERTY = 'create_property',
  CREATE_CLIENT = 'create_client',
  CREATE_DOCUMENT = 'create_document',
  CREATE_VISTORIA = 'create_vistoria',
  CREATE_RENTAL = 'create_rental',
  CREATE_NOTE = 'create_note',
  CREATE_APPOINTMENT = 'create_appointment',
  CREATE_TRANSACTION = 'create_transaction',
  
  // Atualizar entidades
  UPDATE_PROPERTY = 'update_property',
  UPDATE_CLIENT = 'update_client',
  UPDATE_DOCUMENT = 'update_document',
  
  // Notificações
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  SEND_NOTIFICATION = 'send_notification',
  SEND_CHAT_MESSAGE = 'send_chat_message',
  
  // Modificar tarefa
  ASSIGN_USER = 'assign_user',
  ADD_TAG = 'add_tag',
  SET_PRIORITY = 'set_priority',
  SET_DUE_DATE = 'set_due_date',
  ADD_COMMENT = 'add_comment',
  SET_CUSTOM_FIELD = 'set_custom_field',
  
  // Outros
  CREATE_TASK = 'create_task',
  ARCHIVE_DOCUMENTS = 'archive_documents',
  UPDATE_RELATIONSHIP = 'update_relationship'
}
```

### 5. ActionConfig (Configuração de Ação)

```typescript
interface ActionConfig {
  // Para criar/atualizar entidades
  entityType?: string;
  fieldMapping?: Record<string, FieldMapping>; // Mapear campos da tarefa para entidade
  
  // Para notificações
  recipients?: RecipientConfig[]; // Destinatários
  template?: string;                // Template de email/SMS
  subject?: string;                // Assunto (email)
  message?: string;                // Mensagem
  notificationType?: 'info' | 'success' | 'warning' | 'error';
  
  // Para atribuições
  userId?: string;                  // ID do usuário
  role?: string;                   // Role (ex: 'admin', 'manager')
  teamId?: string;                 // Equipe específica
  
  // Para tags/prioridade/etc
  value?: any;                     // Valor a definir
  tagIds?: string[];              // IDs das tags
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // Para ações periódicas (on_stay)
  interval?: number;               // Intervalo em horas
  maxExecutions?: number;          // Limite de execuções
  executionCount?: number;          // Contador atual (interno)
  lastExecutionAt?: Date;          // Última execução (interno)
  
  // Para criar tarefa
  targetColumnId?: string;         // Coluna destino da nova tarefa
  taskData?: Partial<CreateTaskDto>; // Dados da nova tarefa
  
  // Para atualizar relacionamento
  relationshipType?: 'client' | 'property' | 'project';
  relationshipId?: string;         // ID do relacionamento a atualizar
  action?: 'add' | 'remove' | 'replace';
}
```

### 6. FieldMapping (Mapeamento de Campo)

```typescript
interface FieldMapping {
  source: 'task_field' | 'custom_field' | 'user_field' | 'project_field' | 
          'team_field' | 'company_field' | 'fixed_value' | 'calculated';
  sourceField?: string;            // Nome do campo na tarefa
  customFieldId?: string;          // Se for campo customizado
  targetField: string;             // Nome do campo na entidade destino
  transform?: FieldTransform;      // Transformação opcional
  defaultValue?: any;              // Valor padrão se source estiver vazio
  required?: boolean;               // Se true, erro se não conseguir mapear
}

enum FieldTransform {
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  CAPITALIZE = 'capitalize',
  FORMAT_CPF = 'format_cpf',
  FORMAT_CNPJ = 'format_cnpj',
  FORMAT_PHONE = 'format_phone',
  FORMAT_DATE = 'format_date',
  FORMAT_CURRENCY = 'format_currency',
  EXTRACT_NUMBERS = 'extract_numbers',
  TRIM = 'trim'
}
```

### 7. ActionCondition (Condição para Ação)

```typescript
interface ActionCondition {
  field: string;                   // Campo a verificar
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 
           'contains' | 'empty' | 'not_empty' | 'in' | 'not_in';
  value: any;                     // Valor de comparação
  valueType?: 'string' | 'number' | 'date' | 'boolean' | 'array';
  logicalOperator?: 'AND' | 'OR'; // Para múltiplas condições (padrão: AND)
}
```

### 8. RecipientConfig (Configuração de Destinatário)

```typescript
interface RecipientConfig {
  type: 'user' | 'role' | 'team' | 'email' | 'task_assignee' | 
        'task_creator' | 'client' | 'property_owner';
  value?: string;                  // userId, roleId, teamId, email, etc.
  field?: string;                  // Campo da tarefa (ex: 'assignedToId')
}
```

### 9. ValidationResult (Resultado de Validação)

```typescript
interface ValidationResult {
  validationId: string;
  validationType: ValidationType;
  passed: boolean;
  message: string;
  details?: Record<string, any>; // Detalhes adicionais
}
```

### 10. ActionResult (Resultado de Ação)

```typescript
interface ActionResult {
  actionId: string;
  actionType: ActionType;
  success: boolean;
  message: string;
  createdEntityId?: string;      // ID da entidade criada (se aplicável)
  createdEntityType?: string;     // Tipo da entidade criada
  error?: string;                 // Mensagem de erro (se falhou)
  details?: Record<string, any>;   // Detalhes adicionais
}
```

### 11. MoveTaskWithValidationDto (DTO para mover tarefa com validações)

```typescript
interface MoveTaskWithValidationDto {
  taskId: string;
  targetColumnId: string;
  targetPosition: number;
  skipValidations?: boolean;      // Apenas para admins (forçar movimento)
  skipActions?: boolean;          // Apenas para admins (pular ações)
}
```

### 12. MoveTaskResponse (Resposta ao mover tarefa)

```typescript
interface MoveTaskResponse {
  task: KanbanTask;               // Tarefa atualizada
  validationResults: ValidationResult[]; // Resultados das validações
  actionResults: ActionResult[];  // Resultados das ações
  blocked: boolean;               // Se movimento foi bloqueado
  warnings: string[];             // Avisos (se behavior = 'warn')
}
```

### 13. Tabelas do Banco de Dados

#### Tabela: `kanban_column_validations`

```sql
CREATE TABLE kanban_column_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  behavior VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by_id UUID NOT NULL REFERENCES users(id),
  
  CONSTRAINT fk_column FOREIGN KEY (column_id) REFERENCES kanban_columns(id)
);

CREATE INDEX idx_column_validations_column_id ON kanban_column_validations(column_id);
CREATE INDEX idx_column_validations_active ON kanban_column_validations(column_id, is_active);
```

#### Tabela: `kanban_column_actions`

```sql
CREATE TABLE kanban_column_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  trigger VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  conditions JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  interval_hours INTEGER, -- Para on_stay
  max_executions INTEGER, -- Para on_stay
  execution_count INTEGER DEFAULT 0,
  last_execution_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by_id UUID NOT NULL REFERENCES users(id),
  
  CONSTRAINT fk_column FOREIGN KEY (column_id) REFERENCES kanban_columns(id)
);

CREATE INDEX idx_column_actions_column_id ON kanban_column_actions(column_id);
CREATE INDEX idx_column_actions_active ON kanban_column_actions(column_id, is_active);
CREATE INDEX idx_column_actions_trigger ON kanban_column_actions(column_id, trigger, is_active);
```

#### Tabela: `kanban_validation_executions` (Histórico)

```sql
CREATE TABLE kanban_validation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES kanban_tasks(id) ON DELETE CASCADE,
  validation_id UUID NOT NULL REFERENCES kanban_column_validations(id) ON DELETE CASCADE,
  column_id UUID NOT NULL REFERENCES kanban_columns(id),
  passed BOOLEAN NOT NULL,
  message TEXT,
  details JSONB,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  executed_by_id UUID REFERENCES users(id)
);

CREATE INDEX idx_validation_executions_task ON kanban_validation_executions(task_id);
CREATE INDEX idx_validation_executions_validation ON kanban_validation_executions(validation_id);
```

#### Tabela: `kanban_action_executions` (Histórico)

```sql
CREATE TABLE kanban_action_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES kanban_tasks(id) ON DELETE CASCADE,
  action_id UUID NOT NULL REFERENCES kanban_column_actions(id) ON DELETE CASCADE,
  column_id UUID NOT NULL REFERENCES kanban_columns(id),
  success BOOLEAN NOT NULL,
  message TEXT,
  created_entity_id UUID,
  created_entity_type VARCHAR(50),
  error TEXT,
  details JSONB,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  executed_by_id UUID REFERENCES users(id)
);

CREATE INDEX idx_action_executions_task ON kanban_action_executions(task_id);
CREATE INDEX idx_action_executions_action ON kanban_action_executions(action_id);
CREATE INDEX idx_action_executions_created_entity ON kanban_action_executions(created_entity_type, created_entity_id);
```

---

## 🔌 Endpoints da API

### 1. Gerenciar Validações de Coluna

#### 1.1. Listar Validações de uma Coluna

```
GET /kanban/columns/:columnId/validations
```

**Resposta:**
```typescript
{
  validations: ColumnValidation[];
}
```

#### 1.2. Criar Validação

```
POST /kanban/columns/:columnId/validations
```

**Body:**
```typescript
{
  type: ValidationType;
  config: ValidationConfig;
  behavior: ValidationBehavior;
  message: string;
  order?: number;
}
```

**Resposta:**
```typescript
ColumnValidation
```

#### 1.3. Atualizar Validação

```
PUT /kanban/columns/validations/:validationId
```

**Body:**
```typescript
{
  type?: ValidationType;
  config?: ValidationConfig;
  behavior?: ValidationBehavior;
  message?: string;
  order?: number;
  isActive?: boolean;
}
```

**Resposta:**
```typescript
ColumnValidation
```

#### 1.4. Deletar Validação

```
DELETE /kanban/columns/validations/:validationId
```

**Resposta:**
```
204 No Content
```

#### 1.5. Reordenar Validações

```
POST /kanban/columns/:columnId/validations/reorder
```

**Body:**
```typescript
{
  validationIds: string[]; // Array de IDs na nova ordem
}
```

**Resposta:**
```
200 OK
```

### 2. Gerenciar Ações de Coluna

#### 2.1. Listar Ações de uma Coluna

```
GET /kanban/columns/:columnId/actions
```

**Query Parameters:**
- `trigger?: ActionTrigger` - Filtrar por trigger

**Resposta:**
```typescript
{
  actions: ColumnAction[];
}
```

#### 2.2. Criar Ação

```
POST /kanban/columns/:columnId/actions
```

**Body:**
```typescript
{
  trigger: ActionTrigger;
  type: ActionType;
  config: ActionConfig;
  conditions?: ActionCondition[];
  order?: number;
}
```

**Resposta:**
```typescript
ColumnAction
```

#### 2.3. Atualizar Ação

```
PUT /kanban/columns/actions/:actionId
```

**Body:**
```typescript
{
  trigger?: ActionTrigger;
  type?: ActionType;
  config?: ActionConfig;
  conditions?: ActionCondition[];
  order?: number;
  isActive?: boolean;
}
```

**Resposta:**
```typescript
ColumnAction
```

#### 2.4. Deletar Ação

```
DELETE /kanban/columns/actions/:actionId
```

**Resposta:**
```
204 No Content
```

#### 2.5. Reordenar Ações

```
POST /kanban/columns/:columnId/actions/reorder
```

**Body:**
```typescript
{
  actionIds: string[]; // Array de IDs na nova ordem
}
```

**Resposta:**
```
200 OK
```

### 3. Mover Tarefa com Validações e Ações

#### 3.1. Mover Tarefa (Atualizado)

```
POST /kanban/tasks/move
```

**Body:**
```typescript
{
  taskId: string;
  targetColumnId: string;
  targetPosition: number;
  skipValidations?: boolean; // Apenas admins
  skipActions?: boolean;     // Apenas admins
}
```

**Resposta:**
```typescript
{
  task: KanbanTask;
  validationResults: ValidationResult[];
  actionResults: ActionResult[];
  blocked: boolean;
  warnings: string[];
}
```

**Códigos de Status:**
- `200 OK`: Movimento realizado (pode ter avisos)
- `400 Bad Request`: Movimento bloqueado por validações
- `403 Forbidden`: Sem permissão para mover
- `404 Not Found`: Tarefa ou coluna não encontrada

### 4. Histórico de Execuções

#### 4.1. Histórico de Validações de uma Tarefa

```
GET /kanban/tasks/:taskId/validation-history
```

**Query Parameters:**
- `columnId?: string` - Filtrar por coluna
- `validationId?: string` - Filtrar por validação
- `passed?: boolean` - Filtrar por resultado
- `limit?: number` - Limite de resultados
- `offset?: number` - Offset para paginação

**Resposta:**
```typescript
{
  executions: Array<{
    id: string;
    validation: ColumnValidation;
    column: KanbanColumn;
    passed: boolean;
    message: string;
    details: Record<string, any>;
    executedAt: Date;
    executedBy?: User;
  }>;
  total: number;
}
```

#### 4.2. Histórico de Ações de uma Tarefa

```
GET /kanban/tasks/:taskId/action-history
```

**Query Parameters:**
- `columnId?: string` - Filtrar por coluna
- `actionId?: string` - Filtrar por ação
- `success?: boolean` - Filtrar por sucesso
- `limit?: number` - Limite de resultados
- `offset?: number` - Offset para paginação

**Resposta:**
```typescript
{
  executions: Array<{
    id: string;
    action: ColumnAction;
    column: KanbanColumn;
    success: boolean;
    message: string;
    createdEntityId?: string;
    createdEntityType?: string;
    error?: string;
    details: Record<string, any>;
    executedAt: Date;
    executedBy?: User;
  }>;
  total: number;
}
```

### 5. Testar Validações e Ações

#### 5.1. Testar Validações de uma Tarefa

```
POST /kanban/tasks/:taskId/test-validations
```

**Body:**
```typescript
{
  columnId: string; // Coluna a testar
}
```

**Resposta:**
```typescript
{
  validationResults: ValidationResult[];
  allPassed: boolean;
  blocked: boolean;
  warnings: string[];
}
```

#### 5.2. Executar Ação Manualmente (Apenas para testes/admin)

```
POST /kanban/tasks/:taskId/execute-action
```

**Body:**
```typescript
{
  actionId: string;
  dryRun?: boolean; // Se true, não executa, apenas simula
}
```

**Resposta:**
```typescript
ActionResult
```

---

## 🔄 Fluxos de Execução

### Fluxo 1: Mover Tarefa para Nova Coluna

```
1. Usuário tenta mover tarefa (POST /kanban/tasks/move)
   ↓
2. Backend busca tarefa e coluna destino
   ↓
3. Executa validações da coluna destino (em ordem)
   ↓
4. Se alguma validação com behavior=BLOCK falhar:
   - Registra execuções no histórico
   - Retorna 400 com lista de validações que falharam
   - NÃO move a tarefa
   ↓
5. Se todas validações passaram ou behavior=WARN/MARK_INCOMPLETE:
   - Executa ações ON_EXIT da coluna origem (se houver)
   - Move tarefa para coluna destino
   - Executa ações ON_ENTER da coluna destino (em ordem)
   - Registra todas execuções no histórico
   - Retorna 200 com resultados
   ↓
6. Se ações ON_ENTER falharem:
   - Tarefa já foi movida (não reverte)
   - Erros são registrados e retornados
   - Usuário é notificado
```

### Fluxo 2: Executar Validação

```
1. Para cada validação ativa da coluna (em ordem):
   ↓
2. Identifica tipo de validação
   ↓
3. Executa lógica específica do tipo:
   - REQUIRED_FIELD: Verifica se campo existe e tem valor
   - REQUIRED_CHECKLIST: Verifica checklist vinculado
   - REQUIRED_DOCUMENT: Verifica documentos vinculados
   - REQUIRED_RELATIONSHIP: Verifica relacionamentos
   - CUSTOM_CONDITION: Avalia condição customizada
   ↓
4. Retorna ValidationResult:
   - passed: boolean
   - message: string
   - details: Record<string, any>
   ↓
5. Registra execução no histórico
```

### Fluxo 3: Executar Ação

```
1. Verifica se ação está ativa
   ↓
2. Verifica condições (se houver):
   - Se alguma condição falhar, pula ação
   ↓
3. Executa lógica específica do tipo de ação:
   - CREATE_PROPERTY: Cria propriedade usando fieldMapping
   - CREATE_CLIENT: Cria cliente usando fieldMapping
   - SEND_EMAIL: Envia email usando template
   - etc.
   ↓
4. Retorna ActionResult:
   - success: boolean
   - message: string
   - createdEntityId?: string (se criou entidade)
   - error?: string (se falhou)
   ↓
5. Registra execução no histórico
   ↓
6. Se falhou e é ação crítica, pode lançar exceção
```

### Fluxo 4: Ações Periódicas (on_stay)

```
1. Job/Worker verifica tarefas em colunas com ações ON_STAY
   ↓
2. Para cada tarefa:
   - Verifica intervalo (última execução + interval_hours)
   - Verifica max_executions (se atingiu limite)
   ↓
3. Se deve executar:
   - Executa ações ON_STAY da coluna
   - Atualiza last_execution_at e execution_count
   ↓
4. Repete periodicamente (ex: a cada hora)
```

---

## ✅ Tipos de Validações

### 1. REQUIRED_FIELD (Campo Obrigatório)

**Config:**
```typescript
{
  fieldName: 'assignedToId', // ou 'dueDate', 'priority', etc.
  fieldType: 'string',        // 'string', 'number', 'date', 'reference'
  customFieldId?: 'custom-field-123' // Se for campo customizado
}
```

**Lógica:**
- Verifica se campo existe na tarefa
- Verifica se campo tem valor (não null, não undefined, não vazio)
- Para campos customizados, busca em `task.customFields[fieldId]`

**Exemplo:**
```typescript
// Validação: Responsável obrigatório
{
  type: 'required_field',
  config: {
    fieldName: 'assignedToId',
    fieldType: 'reference'
  },
  behavior: 'block',
  message: 'Tarefa deve ter um responsável atribuído'
}
```

### 2. REQUIRED_CHECKLIST (Checklist Obrigatório)

**Config:**
```typescript
{
  checklistId: 'checklist-123',
  requiredItems: ['item-1', 'item-2'], // Opcional: IDs específicos
  allItemsRequired: true // Se true, todos os itens devem estar marcados
}
```

**Lógica:**
- Busca checklist vinculado à tarefa
- Verifica se checklist existe
- Se `requiredItems` especificado, verifica apenas esses itens
- Se `allItemsRequired = true`, verifica todos os itens
- Verifica se itens obrigatórios estão marcados como concluídos

**Exemplo:**
```typescript
// Validação: Checklist de documentação completo
{
  type: 'required_checklist',
  config: {
    checklistId: 'doc-checklist-123',
    allItemsRequired: true
  },
  behavior: 'block',
  message: 'Todos os documentos devem estar anexados'
}
```

### 3. REQUIRED_DOCUMENT (Documento Obrigatório)

**Config:**
```typescript
{
  documentType: 'proposta',      // Tipo de documento
  documentStatus: 'signed',       // 'any', 'signed', 'approved'
  minDocuments: 1,               // Mínimo de documentos
  documentCategory?: 'contract'   // Categoria específica
}
```

**Lógica:**
- Busca documentos vinculados à tarefa (ou cliente/propriedade vinculados)
- Filtra por tipo/categoria se especificado
- Verifica status se especificado
- Conta documentos que atendem critérios
- Compara com `minDocuments`

**Exemplo:**
```typescript
// Validação: Proposta assinada obrigatória
{
  type: 'required_document',
  config: {
    documentType: 'proposta',
    documentStatus: 'signed',
    minDocuments: 1
  },
  behavior: 'block',
  message: 'Proposta assinada é obrigatória'
}
```

### 4. REQUIRED_RELATIONSHIP (Relacionamento Obrigatório)

**Config:**
```typescript
{
  relationshipType: 'client', // 'client', 'property', 'project', 'rental'
  required: true
}
```

**Lógica:**
- Verifica se tarefa tem relacionamento do tipo especificado
- Para 'client': verifica `task.clientId` ou relacionamento via API
- Para 'property': verifica `task.propertyId` ou relacionamento via API
- Para 'project': verifica `task.projectId`
- Para 'rental': busca relacionamento via API

**Exemplo:**
```typescript
// Validação: Cliente vinculado obrigatório
{
  type: 'required_relationship',
  config: {
    relationshipType: 'client',
    required: true
  },
  behavior: 'block',
  message: 'Tarefa deve estar vinculada a um cliente'
}
```

### 5. CUSTOM_CONDITION (Condição Customizada)

**Config:**
```typescript
{
  condition: {
    field: 'customFields.value', // Campo a validar
    operator: 'greater_than',     // Operador
    value: 1000,                 // Valor de comparação
    valueType: 'number'          // Tipo do valor
  }
}
```

**Lógica:**
- Busca valor do campo na tarefa
- Aplica operador de comparação
- Retorna true/false

**Operadores:**
- `equals`: valor == campo
- `not_equals`: valor != campo
- `greater_than`: campo > valor
- `less_than`: campo < valor
- `greater_or_equal`: campo >= valor
- `less_or_equal`: campo <= valor
- `contains`: campo contém valor (string/array)
- `not_contains`: campo não contém valor
- `empty`: campo está vazio/null/undefined
- `not_empty`: campo não está vazio
- `in`: campo está em array de valores
- `not_in`: campo não está em array

**Exemplo:**
```typescript
// Validação: Valor da proposta > 0
{
  type: 'custom_condition',
  config: {
    condition: {
      field: 'customFields.proposalValue',
      operator: 'greater_than',
      value: 0,
      valueType: 'number'
    }
  },
  behavior: 'block',
  message: 'Valor da proposta deve ser maior que zero'
}
```

---

## ⚡ Tipos de Ações

### 1. CREATE_PROPERTY (Criar Propriedade)

**Config:**
```typescript
{
  fieldMapping: {
    'title': { source: 'task_field', sourceField: 'title', targetField: 'title' },
    'address': { source: 'custom_field', customFieldId: 'address', targetField: 'address' },
    'salePrice': { source: 'custom_field', customFieldId: 'value', targetField: 'salePrice', transform: 'format_currency' },
    'responsibleUserId': { source: 'task_field', sourceField: 'assignedToId', targetField: 'responsibleUserId' },
    'companyId': { source: 'company_field', targetField: 'companyId' }
  }
}
```

**Lógica:**
1. Mapeia campos da tarefa para propriedade usando `fieldMapping`
2. Aplica transformações se especificado
3. Cria propriedade via API de propriedades
4. Vincula propriedade à tarefa (adiciona `propertyId` na tarefa ou relacionamento)
5. Retorna `createdEntityId` e `createdEntityType: 'property'`

**Exemplo:**
```typescript
// Ação: Criar propriedade ao entrar na coluna "Venda Fechada"
{
  trigger: 'on_enter',
  type: 'create_property',
  config: {
    fieldMapping: {
      'title': { source: 'task_field', sourceField: 'title', targetField: 'title' },
      'address': { source: 'custom_field', customFieldId: 'address-field', targetField: 'address' },
      'salePrice': { source: 'custom_field', customFieldId: 'value-field', targetField: 'salePrice' },
      'type': { source: 'fixed_value', value: 'apartment', targetField: 'type' },
      'status': { source: 'fixed_value', value: 'sold', targetField: 'status' }
    }
  }
}
```

### 2. CREATE_CLIENT (Criar Cliente)

**Config:**
```typescript
{
  fieldMapping: {
    'name': { source: 'task_field', sourceField: 'title', targetField: 'name' },
    'email': { source: 'custom_field', customFieldId: 'email', targetField: 'email' },
    'phone': { source: 'custom_field', customFieldId: 'phone', targetField: 'phone', transform: 'format_phone' },
    'cpf': { source: 'custom_field', customFieldId: 'cpf', targetField: 'cpf', transform: 'format_cpf' }
  }
}
```

**Lógica:**
1. Mapeia campos da tarefa para cliente
2. Valida dados obrigatórios (nome, email, etc.)
3. Cria cliente via API de clientes
4. Vincula cliente à tarefa
5. Retorna `createdEntityId` e `createdEntityType: 'client'`

### 3. CREATE_DOCUMENT (Criar Documento)

**Config:**
```typescript
{
  documentType: 'proposta',
  template?: 'template-id-123', // Template de documento
  fieldMapping: {
    'title': { source: 'task_field', sourceField: 'title', targetField: 'title' },
    'clientId': { source: 'task_field', sourceField: 'clientId', targetField: 'clientId' }
  },
  autoSign?: boolean, // Se true, assina automaticamente
  sendForSignature?: boolean // Se true, envia para assinatura
}
```

**Lógica:**
1. Cria documento usando template (se especificado)
2. Preenche campos do documento usando `fieldMapping`
3. Vincula documento à tarefa/cliente/propriedade
4. Se `autoSign = true`, assina automaticamente
5. Se `sendForSignature = true`, envia para assinatura via Assinafy
6. Retorna `createdEntityId` e `createdEntityType: 'document'`

### 4. SEND_EMAIL (Enviar Email)

**Config:**
```typescript
{
  recipients: [
    { type: 'task_assignee' },
    { type: 'user', value: 'user-123' },
    { type: 'email', value: 'cliente@example.com' },
    { type: 'client' } // Busca email do cliente vinculado
  ],
  template: 'email-template-123', // Template de email
  subject: 'Nova proposta enviada',
  message: 'Olá {{clientName}}, sua proposta foi enviada.'
}
```

**Lógica:**
1. Resolve destinatários (busca emails de usuários, clientes, etc.)
2. Aplica template (substitui variáveis como `{{clientName}}`, `{{taskTitle}}`, etc.)
3. Envia email via serviço de email
4. Registra envio no histórico

**Variáveis disponíveis no template:**
- `{{taskTitle}}`, `{{taskDescription}}`
- `{{clientName}}`, `{{clientEmail}}`
- `{{propertyAddress}}`
- `{{userName}}` (usuário que moveu)
- `{{companyName}}`
- etc.

### 5. SEND_NOTIFICATION (Enviar Notificação)

**Config:**
```typescript
{
  recipients: [
    { type: 'role', value: 'admin' },
    { type: 'team', value: 'team-123' }
  ],
  notificationType: 'info',
  message: 'Nova venda fechada: {{taskTitle}}',
  link?: '/properties/{{propertyId}}' // Link opcional
}
```

**Lógica:**
1. Resolve destinatários (usuários com role, membros da equipe, etc.)
2. Cria notificação para cada destinatário
3. Envia via sistema de notificações
4. Registra no histórico

### 6. ASSIGN_USER (Atribuir Usuário)

**Config:**
```typescript
{
  userId: 'user-123', // ID direto
  // OU
  role: 'manager', // Atribui primeiro usuário com essa role
  // OU
  field: 'assignedToId' // Usa valor do campo da tarefa
}
```

**Lógica:**
1. Resolve userId (direto, por role, ou do campo)
2. Atualiza `assignedToId` da tarefa
3. Registra no histórico da tarefa

### 7. ADD_TAG (Adicionar Tag)

**Config:**
```typescript
{
  tagIds: ['tag-1', 'tag-2'], // IDs das tags
  // OU
  tagNames: ['venda-fechada', 'aprovado'] // Nomes das tags (cria se não existir)
}
```

**Lógica:**
1. Adiciona tags à tarefa
2. Cria tags se não existirem (se usar `tagNames`)

### 8. SET_PRIORITY (Definir Prioridade)

**Config:**
```typescript
{
  priority: 'high' // 'low' | 'medium' | 'high' | 'urgent'
}
```

**Lógica:**
1. Atualiza `priority` da tarefa

### 9. CREATE_TRANSACTION (Criar Transação Financeira)

**Config:**
```typescript
{
  fieldMapping: {
    'amount': { source: 'custom_field', customFieldId: 'value', targetField: 'amount' },
    'type': { source: 'fixed_value', value: 'income', targetField: 'type' },
    'category': { source: 'fixed_value', value: 'sale', targetField: 'category' },
    'description': { source: 'task_field', sourceField: 'title', targetField: 'description' }
  },
  requireApproval?: boolean // Se true, cria como pendente de aprovação
}
```

**Lógica:**
1. Mapeia campos para transação financeira
2. Cria transação via API financeira
3. Se `requireApproval = true`, cria como pendente
4. Retorna `createdEntityId` e `createdEntityType: 'transaction'`

### 10. CREATE_VISTORIA (Criar Vistoria)

**Config:**
```typescript
{
  fieldMapping: {
    'propertyId': { source: 'task_field', sourceField: 'propertyId', targetField: 'propertyId' },
    'scheduledDate': { source: 'custom_field', customFieldId: 'vistoria-date', targetField: 'scheduledDate' },
    'type': { source: 'fixed_value', value: 'entrada', targetField: 'type' }
  }
}
```

**Lógica:**
1. Mapeia campos para vistoria
2. Cria vistoria via API de vistorias
3. Retorna `createdEntityId` e `createdEntityType: 'vistoria'`

---

## 🔗 Integrações com Módulos Existentes

### 1. API de Propriedades

**Endpoint:** `POST /properties`

**Uso em ação CREATE_PROPERTY:**
```typescript
const propertyData = mapFields(task, fieldMapping);
const property = await propertiesApi.create(propertyData);
// Vincula à tarefa
await linkPropertyToTask(taskId, property.id);
```

### 2. API de Clientes

**Endpoint:** `POST /clients`

**Uso em ação CREATE_CLIENT:**
```typescript
const clientData = mapFields(task, fieldMapping);
const client = await clientsApi.create(clientData);
// Vincula à tarefa
await linkClientToTask(taskId, client.id);
```

### 3. API de Documentos

**Endpoint:** `POST /documents`

**Uso em ação CREATE_DOCUMENT:**
```typescript
const documentData = mapFields(task, fieldMapping);
if (template) {
  documentData.templateId = template;
}
const document = await documentsApi.create(documentData);
// Se sendForSignature, envia para Assinafy
if (config.sendForSignature) {
  await sendForSignature(document.id);
}
```

### 4. API de Notificações

**Endpoint:** `POST /notifications`

**Uso em ação SEND_NOTIFICATION:**
```typescript
const recipients = resolveRecipients(config.recipients, task);
for (const recipient of recipients) {
  await notificationsApi.create({
    userId: recipient.id,
    type: config.notificationType,
    message: applyTemplate(config.message, task),
    link: applyTemplate(config.link, task)
  });
}
```

### 5. API de Email/SMS

**Serviço:** Serviço de email/SMS existente

**Uso em ação SEND_EMAIL/SEND_SMS:**
```typescript
const recipients = resolveEmailRecipients(config.recipients, task);
const emailData = {
  to: recipients,
  subject: applyTemplate(config.subject, task),
  body: applyTemplate(config.message, task),
  template: config.template
};
await emailService.send(emailData);
```

### 6. API de Vistorias

**Endpoint:** `POST /inspection`

**Uso em ação CREATE_VISTORIA:**
```typescript
const vistoriaData = mapFields(task, fieldMapping);
const vistoria = await vistoriaApi.create(vistoriaData);
```

### 7. API Financeira

**Endpoint:** `POST /financial/transactions`

**Uso em ação CREATE_TRANSACTION:**
```typescript
const transactionData = mapFields(task, fieldMapping);
if (config.requireApproval) {
  transactionData.status = 'pending_approval';
}
const transaction = await financialApi.createTransaction(transactionData);
```

---

## 📝 Exemplos Práticos

### Exemplo 1: Coluna "Proposta Enviada"

**Validações:**
```typescript
[
  {
    type: 'required_relationship',
    config: { relationshipType: 'client', required: true },
    behavior: 'block',
    message: 'Cliente deve estar vinculado à tarefa'
  },
  {
    type: 'required_document',
    config: { documentType: 'proposta', minDocuments: 1 },
    behavior: 'warn',
    message: 'Recomendado anexar proposta'
  }
]
```

**Ações (on_enter):**
```typescript
[
  {
    trigger: 'on_enter',
    type: 'create_document',
    config: {
      documentType: 'proposta',
      template: 'proposta-template-123',
      fieldMapping: {
        'title': { source: 'task_field', sourceField: 'title', targetField: 'title' },
        'clientId': { source: 'task_field', sourceField: 'clientId', targetField: 'clientId' }
      },
      sendForSignature: true
    }
  },
  {
    trigger: 'on_enter',
    type: 'send_email',
    config: {
      recipients: [{ type: 'client' }],
      template: 'proposta-enviada-template',
      subject: 'Proposta enviada - {{taskTitle}}'
    }
  },
  {
    trigger: 'on_enter',
    type: 'add_tag',
    config: { tagNames: ['proposta-enviada'] }
  }
]
```

### Exemplo 2: Coluna "Aguardando Aprovação"

**Validações:**
```typescript
[
  {
    type: 'required_document',
    config: {
      documentType: 'proposta',
      documentStatus: 'signed',
      minDocuments: 1
    },
    behavior: 'block',
    message: 'Proposta deve estar assinada'
  },
  {
    type: 'custom_condition',
    config: {
      condition: {
        field: 'customFields.proposalValue',
        operator: 'greater_than',
        value: 0,
        valueType: 'number'
      }
    },
    behavior: 'block',
    message: 'Valor da proposta deve ser informado'
  }
]
```

**Ações (on_enter):**
```typescript
[
  {
    trigger: 'on_enter',
    type: 'send_notification',
    config: {
      recipients: [{ type: 'role', value: 'admin' }],
      notificationType: 'info',
      message: 'Nova proposta aguardando aprovação: {{taskTitle}}',
      link: '/kanban?taskId={{taskId}}'
    }
  },
  {
    trigger: 'on_enter',
    type: 'set_priority',
    config: { priority: 'high' }
  },
  {
    trigger: 'on_enter',
    type: 'set_due_date',
    config: {
      value: '7 days' // 7 dias a partir de agora
    }
  }
]
```

### Exemplo 3: Coluna "Venda Fechada"

**Validações:**
```typescript
[
  {
    type: 'required_relationship',
    config: { relationshipType: 'client', required: true },
    behavior: 'block',
    message: 'Cliente deve estar vinculado'
  },
  {
    type: 'required_relationship',
    config: { relationshipType: 'property', required: true },
    behavior: 'block',
    message: 'Propriedade deve estar vinculada'
  },
  {
    type: 'required_document',
    config: {
      documentType: 'contrato',
      documentStatus: 'signed',
      minDocuments: 1
    },
    behavior: 'block',
    message: 'Contrato assinado é obrigatório'
  }
]
```

**Ações (on_enter):**
```typescript
[
  {
    trigger: 'on_enter',
    type: 'create_property',
    config: {
      fieldMapping: {
        'title': { source: 'task_field', sourceField: 'title', targetField: 'title' },
        'address': { source: 'custom_field', customFieldId: 'address', targetField: 'address' },
        'salePrice': { source: 'custom_field', customFieldId: 'value', targetField: 'salePrice' },
        'type': { source: 'fixed_value', value: 'apartment', targetField: 'type' },
        'status': { source: 'fixed_value', value: 'sold', targetField: 'status' }
      }
    },
    conditions: [
      {
        field: 'propertyId',
        operator: 'empty' // Só cria se não tiver propriedade vinculada
      }
    ]
  },
  {
    trigger: 'on_enter',
    type: 'create_client',
    config: {
      fieldMapping: {
        'name': { source: 'custom_field', customFieldId: 'client-name', targetField: 'name' },
        'email': { source: 'custom_field', customFieldId: 'client-email', targetField: 'email' },
        'phone': { source: 'custom_field', customFieldId: 'client-phone', targetField: 'phone' },
        'cpf': { source: 'custom_field', customFieldId: 'client-cpf', targetField: 'cpf' }
      }
    },
    conditions: [
      {
        field: 'clientId',
        operator: 'empty'
      }
    ]
  },
  {
    trigger: 'on_enter',
    type: 'create_transaction',
    config: {
      fieldMapping: {
        'amount': { source: 'custom_field', customFieldId: 'value', targetField: 'amount' },
        'type': { source: 'fixed_value', value: 'income', targetField: 'type' },
        'category': { source: 'fixed_value', value: 'sale', targetField: 'category' },
        'description': { source: 'task_field', sourceField: 'title', targetField: 'description' }
      },
      requireApproval: false
    }
  },
  {
    trigger: 'on_enter',
    type: 'send_email',
    config: {
      recipients: [{ type: 'client' }],
      template: 'venda-fechada-template',
      subject: 'Parabéns! Sua compra foi confirmada'
    }
  },
  {
    trigger: 'on_enter',
    type: 'add_tag',
    config: { tagNames: ['venda-fechada', 'concluido'] }
  }
]
```

---

## ⚠️ Tratamento de Erros

### 1. Erros em Validações

**Comportamento:**
- Se `behavior = 'block'` e validação falhar: retorna 400 e não move tarefa
- Se `behavior = 'warn'` e validação falhar: move tarefa mas retorna aviso
- Se `behavior = 'mark_incomplete'` e validação falhar: move tarefa e marca como incompleto

**Resposta de erro:**
```typescript
{
  error: 'VALIDATION_FAILED',
  message: 'Movimento bloqueado por validações',
  validationResults: [
    {
      validationId: 'val-123',
      validationType: 'required_field',
      passed: false,
      message: 'Responsável deve estar atribuído'
    }
  ],
  blocked: true
}
```

### 2. Erros em Ações

**Comportamento:**
- Ações são executadas em ordem
- Se uma ação falhar, continua executando as próximas
- Erros são registrados no histórico
- Retorna lista de ações que falharam

**Resposta com erros:**
```typescript
{
  task: KanbanTask,
  actionResults: [
    {
      actionId: 'action-1',
      actionType: 'create_property',
      success: true,
      message: 'Propriedade criada com sucesso',
      createdEntityId: 'property-123',
      createdEntityType: 'property'
    },
    {
      actionId: 'action-2',
      actionType: 'send_email',
      success: false,
      message: 'Erro ao enviar email',
      error: 'Invalid email address'
    }
  ]
}
```

### 3. Validações de Configuração

**Ao criar/atualizar validação:**
- Validar se `columnId` existe
- Validar se `type` é válido
- Validar se `config` está correto para o tipo
- Validar se `behavior` é válido
- Validar se `message` não está vazio

**Ao criar/atualizar ação:**
- Validar se `columnId` existe
- Validar se `trigger` é válido
- Validar se `type` é válido
- Validar se `config` está correto para o tipo
- Validar `fieldMapping` se aplicável
- Validar condições se especificadas

### 4. Erros de Integração

**Se API externa falhar:**
- Registrar erro no histórico
- Retornar erro na resposta
- Não reverter movimento da tarefa (já foi movida)
- Notificar administrador se ação for crítica

---

## 🚀 Performance e Otimizações

### 1. Cache de Validações e Ações

- Cachear validações e ações de colunas (invalidar ao atualizar)
- Cache por `columnId` com TTL de 5 minutos

### 2. Execução Assíncrona

- Ações não-críticas podem ser executadas em background
- Usar fila de jobs para ações pesadas (ex: envio de emails em massa)
- Retornar resposta imediata e processar ações depois

### 3. Batch de Validações

- Executar validações em paralelo quando possível
- Parar na primeira validação que bloqueia (se `behavior = 'block'`)

### 4. Índices no Banco

- Índices em `column_id` nas tabelas de validações e ações
- Índices em `task_id` nas tabelas de histórico
- Índices em `is_active` para filtrar rapidamente

### 5. Limites

- Máximo de 20 validações por coluna
- Máximo de 20 ações por coluna
- Timeout de 30 segundos para execução de todas ações
- Limite de 100 execuções para ações `on_stay`

---

## 🔒 Segurança e Permissões

### 1. Permissões de Configuração

- **Criar/Editar/Deletar validações**: Apenas `admin` ou `master`
- **Criar/Editar/Deletar ações**: Apenas `admin` ou `master`
- **Ver histórico**: Qualquer usuário com acesso à tarefa
- **Executar ação manualmente**: Apenas `admin` ou `master`

### 2. Permissões de Execução

- Validações: Executadas automaticamente para todos
- Ações: Executadas automaticamente, mas respeitam permissões das APIs chamadas
  - Se usuário não tem permissão para criar propriedade, ação falha
  - Usar contexto do usuário que moveu a tarefa para executar ações

### 3. Validação de Dados

- Sanitizar todos os inputs
- Validar tipos de dados
- Validar referências (columnId, taskId, etc.)
- Prevenir SQL injection e XSS

### 4. Rate Limiting

- Limitar número de movimentos por minuto por usuário
- Limitar número de ações executadas por minuto

### 5. Auditoria

- Registrar todas as execuções de validações e ações
- Registrar quem configurou validações/ações
- Registrar quem moveu tarefas que dispararam ações

---

## 📋 Checklist de Implementação

### Backend

- [ ] Criar tabelas no banco de dados
- [ ] Criar modelos/entidades
- [ ] Implementar endpoints de CRUD de validações
- [ ] Implementar endpoints de CRUD de ações
- [ ] Implementar lógica de validações (todos os tipos)
- [ ] Implementar lógica de ações (todos os tipos)
- [ ] Integrar com APIs existentes (propriedades, clientes, etc.)
- [ ] Implementar histórico de execuções
- [ ] Implementar mapeamento de campos
- [ ] Implementar transformações de campos
- [ ] Implementar condições para ações
- [ ] Implementar ações periódicas (on_stay)
- [ ] Implementar tratamento de erros
- [ ] Implementar cache
- [ ] Implementar permissões
- [ ] Implementar auditoria
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação da API

### Frontend (para referência futura)

- [ ] Interface de configuração de validações
- [ ] Interface de configuração de ações
- [ ] Editor de mapeamento de campos
- [ ] Feedback visual de validações
- [ ] Feedback visual de ações executadas
- [ ] Histórico de execuções
- [ ] Indicadores visuais no Kanban

---

## 📞 Contato e Dúvidas

Para dúvidas sobre esta documentação, entre em contato com a equipe de desenvolvimento.

**Última atualização:** Janeiro 2025

