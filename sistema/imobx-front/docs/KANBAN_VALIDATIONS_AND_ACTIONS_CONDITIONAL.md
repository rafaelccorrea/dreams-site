# Guia Frontend - Validações e Ações Condicionais no Kanban

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Conceitos Fundamentais](#conceitos-fundamentais)
3. [API de Colunas](#api-de-colunas)
4. [Validações Condicionais](#validações-condicionais)
5. [Ações Condicionais](#ações-condicionais)
6. [Validação de Posições Adjacentes](#validação-de-posições-adjacentes)
7. [Fluxo de Movimentação de Cards](#fluxo-de-movimentação-de-cards)
8. [Exemplos Práticos](#exemplos-práticos)
9. [Tratamento de Erros](#tratamento-de-erros)
10. [Validações de Exclusão e Reordenação de Colunas](#validações-de-exclusão-e-reordenação-de-colunas)

---

## 🎯 Visão Geral

O sistema de validações e ações condicionais permite que você configure regras específicas que só são aplicadas quando um card é movido de uma coluna específica para outra. Isso é especialmente útil para:

- **Validações**: Bloquear ou avisar quando um card é movido de uma coluna específica para outra
- **Ações**: Executar ações automáticas apenas quando o card vem de uma coluna específica
- **Controle de Fluxo**: Garantir que cards só possam ser movidos entre colunas adjacentes (posição +1 ou -1)

---

## 🔑 Conceitos Fundamentais

### Coluna de Origem vs Coluna de Destino

- **Coluna de Origem (`fromColumnId`)**: A coluna de onde o card está sendo movido
- **Coluna de Destino (`columnId`)**: A coluna para onde o card está sendo movido

### Campos Importantes

#### Validações
- `fromColumnId` (opcional): Se definido, a validação só será aplicada quando o card vier desta coluna específica
- `requireAdjacentPosition` (boolean): Se `true`, a validação só será aplicada se a coluna de origem está adjacente à de destino (posição +1 ou -1)

#### Ações
- `fromColumnId` (opcional): Se definido, a ação só será executada quando o card vier desta coluna específica
- `requireAdjacentPosition` (boolean): Se `true`, a ação só será executada se a coluna de origem está adjacente à de destino

---

## 📡 API de Colunas

### Endpoint: Listar Colunas com Validações e Ações

```http
GET /kanban/columns/:teamId?projectId=:projectId
```

**Query Params:**
- `projectId` (opcional): Se fornecido, retorna apenas colunas do projeto específico

**Resposta:**
```typescript
[
  {
    id: string;
    title: string;
    description?: string;
    position: number;
    color?: string;
    teamId: string;
    projectId?: string;
    validations: [
      {
        id: string;
        type: ValidationType;
        behavior: 'block' | 'warn' | 'mark_incomplete';
        message: string;
        fromColumnId?: string;  // Coluna de origem (opcional)
        fromColumn?: { id: string; title: string };  // ✅ NOVO: Informação da coluna de origem
        toColumnId?: string;  // ✅ NOVO: ID da coluna de destino
        toColumn?: { id: string; title: string };  // ✅ NOVO: Informação da coluna de destino
        requireAdjacentPosition: boolean;  // Requer posição adjacente
        order: number;
        config: Record<string, any>;
      }
    ];
    actions: [
      {
        id: string;
        trigger: 'on_enter' | 'on_exit' | 'on_stay';
        type: ActionType;
        fromColumnId?: string;  // Coluna de origem (opcional)
        fromColumn?: { id: string; title: string };  // ✅ NOVO: Informação da coluna de origem
        toColumnId?: string;  // ✅ NOVO: ID da coluna de destino
        toColumn?: { id: string; title: string };  // ✅ NOVO: Informação da coluna de destino
        requireAdjacentPosition: boolean;  // Requer posição adjacente
        order: number;
        config: Record<string, any>;
        conditions?: Record<string, any>[];
      }
    ];
  }
]
```

**Exemplo de Uso:**
```typescript
const getColumns = async (teamId: string, projectId?: string) => {
  const url = projectId
    ? `/kanban/columns/${teamId}?projectId=${projectId}`
    : `/kanban/columns/${teamId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### Endpoint: Obter Relações entre Colunas

```http
GET /kanban/columns/:teamId/relations?projectId=:projectId
```

**Query Params:**
- `projectId` (opcional): Se fornecido, retorna apenas relações do projeto específico

**Resposta:**
```typescript
{
  relations: [
    {
      fromColumn: {
        id: string;
        title: string;
      };
      toColumn: {
        id: string;
        title: string;
      };
      validations: number;  // Quantidade de validações de X para Y
      actions: number;      // Quantidade de ações de X para Y
    }
  ]
}
```

**Exemplo de Uso:**
```typescript
// ✅ Usando o serviço de API
import { kanbanValidationsApi } from './services/kanbanValidationsApi';

const getColumnRelations = async (teamId: string, projectId?: string) => {
  return await kanbanValidationsApi.getColumnRelations(teamId, projectId);
};

// ✅ Ou usando fetch diretamente
const getColumnRelationsWithFetch = async (teamId: string, projectId?: string) => {
  const url = projectId
    ? `/kanban/columns/${teamId}/relations?projectId=${projectId}`
    : `/kanban/columns/${teamId}/relations`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};

// Verificar se duas colunas estão relacionadas
const areColumnsRelated = (
  relations: any[],
  columnId1: string,
  columnId2: string
): boolean => {
  return relations.some(rel => 
    (rel.fromColumn.id === columnId1 && rel.toColumn.id === columnId2) ||
    (rel.fromColumn.id === columnId2 && rel.toColumn.id === columnId1)
  );
};
```

---

## ✅ Validações Condicionais

### Como Funciona

1. **Sem `fromColumnId`**: A validação é aplicada sempre que um card entra na coluna, independente de onde vem
2. **Com `fromColumnId`**: A validação só é aplicada quando o card vem especificamente daquela coluna
3. **Com `requireAdjacentPosition: true`**: A validação só é aplicada se a coluna de origem está adjacente (posição +1 ou -1)

### Exemplo de Validação Condicional

```typescript
// Validação que só bloqueia quando o card vem da coluna "Em Análise"
{
  id: "val-123",
  type: "required_field",
  behavior: "block",
  message: "Campo 'Valor' é obrigatório ao sair de 'Em Análise'",
  fromColumnId: "coluna-em-analise-id",  // Só valida se vier desta coluna
  requireAdjacentPosition: false,
  config: {
    field: "totalValue",
    required: true
  }
}
```

### Implementação no Frontend

```typescript
interface Column {
  id: string;
  position: number;
  validations: Validation[];
}

interface Validation {
  id: string;
  fromColumnId?: string;
  requireAdjacentPosition: boolean;
  behavior: 'block' | 'warn' | 'mark_incomplete';
  message: string;
}

const getApplicableValidations = (
  columns: Column[],
  fromColumnId: string,
  toColumnId: string,
  validations: Validation[]  // ✅ Parâmetro adicional: lista de validações da coluna de destino
): Validation[] => {
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);
  
  if (!fromColumn || !toColumn) return [];
  
  const fromPosition = fromColumn.position;
  const toPosition = toColumn.position;
  const positionDiff = Math.abs(toPosition - fromPosition);
  
  return validations.filter(validation => {
    // ✅ Só considerar validações ativas
    if (!validation.isActive) {
      return false;
    }
    
    // Se tem fromColumnId definido, só aplica se corresponder
    if (validation.fromColumnId && validation.fromColumnId !== fromColumnId) {
      return false;
    }
    
    // Se requireAdjacentPosition é true, verificar se são adjacentes
    if (validation.requireAdjacentPosition && positionDiff !== 1) {
      return false;
    }
    
    return true;
  });
};
```

---

## ⚡ Ações Condicionais

### Como Funciona

1. **ON_EXIT**: Executada quando o card sai de uma coluna
   - `fromColumnId` na ação ON_EXIT se refere à coluna de destino
2. **ON_ENTER**: Executada quando o card entra em uma coluna
   - `fromColumnId` na ação ON_ENTER se refere à coluna de origem
3. **ON_STAY**: Executada periodicamente enquanto o card está na coluna

### Exemplo de Ação Condicional

```typescript
// Ação que só envia email quando o card vem da coluna "Qualificação"
{
  id: "action-456",
  trigger: "on_enter",
  type: "send_email",
  fromColumnId: "coluna-qualificacao-id",  // Só executa se vier desta coluna
  requireAdjacentPosition: true,  // E se for adjacente
  config: {
    template: "welcome_email",
    to: "{{task.assignedTo.email}}"
  }
}
```

### Implementação no Frontend

```typescript
const getApplicableActions = (
  columns: Column[],
  fromColumnId: string,
  toColumnId: string,
  trigger: 'on_enter' | 'on_exit',
  actions: Action[]  // ✅ Parâmetro adicional: lista de ações (da coluna de origem ou destino)
): Action[] => {
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);
  
  if (!fromColumn || !toColumn) return [];
  
  const fromPosition = fromColumn.position;
  const toPosition = toColumn.position;
  const positionDiff = Math.abs(toPosition - fromPosition);
  
  // ✅ Filtrar ações da coluna correta (já deve vir filtrado, mas garantimos)
  const targetColumn = trigger === 'on_exit' ? fromColumn : toColumn;
  const targetColumnActions = actions.filter(a => a.columnId === targetColumn.id);
  
  return targetColumnActions.filter(action => {
    // ✅ Só considerar ações ativas e com o trigger correto
    if (!action.isActive || action.trigger !== trigger) {
      return false;
    }
    
    // Para ON_EXIT, fromColumnId se refere à coluna de destino
    // Para ON_ENTER, fromColumnId se refere à coluna de origem
    const expectedFromColumnId = trigger === 'on_exit' 
      ? toColumnId 
      : fromColumnId;
    
    if (action.fromColumnId && action.fromColumnId !== expectedFromColumnId) {
      return false;
    }
    
    if (action.requireAdjacentPosition && positionDiff !== 1) {
      return false;
    }
    
    return true;
  });
};
```

---

## 📍 Validação de Posições Adjacentes

### Conceito

Quando `requireAdjacentPosition: true`, a validação/ação só é aplicada se a coluna de origem está **adjacente** à coluna de destino, ou seja:

- Posição da origem = Posição do destino ± 1
- Exemplo: Se origem está na posição 1, só valida se destino está na posição 0 ou 2

### Implementação

```typescript
const isAdjacent = (fromPosition: number, toPosition: number): boolean => {
  return Math.abs(toPosition - fromPosition) === 1;
};

const canMoveToColumn = (
  columns: Column[],
  fromColumnId: string,
  toColumnId: string
): { canMove: boolean; reason?: string } => {
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);
  
  if (!fromColumn || !toColumn) {
    return { canMove: false, reason: 'Coluna não encontrada' };
  }
  
  const fromPosition = fromColumn.position;
  const toPosition = toColumn.position;
  const positionDiff = Math.abs(toPosition - fromPosition);
  
  // Verificar validações que requerem posição adjacente
  const adjacentValidations = toColumn.validations.filter(
    v => v.requireAdjacentPosition && v.fromColumnId === fromColumnId
  );
  
  if (adjacentValidations.length > 0 && positionDiff !== 1) {
    return {
      canMove: false,
      reason: 'Esta validação só permite movimentação entre colunas adjacentes'
    };
  }
  
  return { canMove: true };
};
```

---

## 🔄 Fluxo de Movimentação de Cards

### 1. Pré-validação no Frontend

Antes de mover o card, o frontend deve:

1. Buscar as colunas com validações e ações
2. Verificar quais validações se aplicam à transição
3. Validar os dados do card localmente (se possível)
4. Mostrar avisos ao usuário

```typescript
const validateMove = async (
  task: Task,
  fromColumnId: string,
  toColumnId: string
): Promise<{ valid: boolean; warnings: string[]; errors: string[] }> => {
  const columns = await getColumns(teamId, projectId);
  
  // ✅ Buscar validações da coluna de destino
  const toColumn = columns.find(c => c.id === toColumnId);
  if (!toColumn) {
    return { valid: false, warnings: [], errors: ['Coluna de destino não encontrada'] };
  }
  
  // ✅ Obter validações aplicáveis
  const applicableValidations = getApplicableValidations(
    columns,
    fromColumnId,
    toColumnId,
    toColumn.validations  // ✅ Passar as validações da coluna de destino
  );
  
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // ✅ Usar função utilitária para validar
  const validationResult = validateTaskForValidations(task, applicableValidations);
  
  return {
    valid: validationResult.valid,
    warnings: validationResult.warnings,
    errors: validationResult.errors
  };
};
```

### 2. Movimentação

```typescript
const moveTask = async (
  taskId: string,
  fromColumnId: string,
  toColumnId: string,
  targetPosition: number
): Promise<void> => {
  // Validar antes de mover
  const validation = await validateMove(task, fromColumnId, toColumnId);
  
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }
  
  // Mostrar avisos se houver
  if (validation.warnings.length > 0) {
    const proceed = await showWarningDialog(validation.warnings);
    if (!proceed) return;
  }
  
  // ✅ Mover o card usando a API de validações
  // Nota: O endpoint correto é /kanban/tasks/move e aceita MoveTaskWithValidationDto
  const response = await fetch('/kanban/tasks/move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      taskId,
      targetColumnId: toColumnId,
      targetPosition,
      skipValidations: false,  // Backend também valida
      skipActions: false,
      actionData: undefined  // ✅ Dados opcionais para ações que requerem input do usuário
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    
    // ✅ Se for erro de validação, retornar dados completos
    if (error.blocked) {
      throw {
        ...error,
        isValidationError: true
      };
    }
    
    throw new Error(error.message);
  }
  
  const result = await response.json();
  
  // ✅ O resultado inclui validationResults, actionResults e warnings
  return result;
};
```

### 3. Pós-movimentação

Após mover, o backend retorna:
- `validationResults`: Resultados das validações executadas
- `actionResults`: Resultados das ações executadas
- `warnings`: Avisos gerados

```typescript
interface MoveTaskResponse {
  validationResults: ValidationResult[];
  warnings: string[];
  actionResults: ActionResult[];
  task: KanbanTask;
}

const handleMoveResponse = (response: MoveTaskResponse) => {
  // Mostrar avisos se houver
  if (response.warnings.length > 0) {
    showWarnings(response.warnings);
  }
  
  // Mostrar resultados das ações
  if (response.actionResults.length > 0) {
    const successfulActions = response.actionResults.filter(r => r.success);
    const failedActions = response.actionResults.filter(r => !r.success);
    
    if (successfulActions.length > 0) {
      console.log('Ações executadas:', successfulActions);
    }
    
    if (failedActions.length > 0) {
      console.error('Ações falharam:', failedActions);
    }
  }
  
  // Atualizar o card na UI
  updateTaskInUI(response.task);
};
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Validação que só bloqueia movimento de coluna específica

```typescript
// Configuração no backend
{
  columnId: "coluna-vendido-id",
  fromColumnId: "coluna-negociacao-id",  // Só valida se vier desta coluna
  requireAdjacentPosition: false,
  type: "required_field",
  behavior: "block",
  message: "Campo 'Valor da Venda' é obrigatório ao marcar como vendido",
  config: {
    field: "totalValue",
    required: true
  }
}

// No frontend
const columns = await getColumns(teamId);
const validation = columns
  .find(c => c.id === "coluna-vendido-id")
  ?.validations
  .find(v => v.fromColumnId === "coluna-negociacao-id");

if (validation && !task.totalValue) {
  // Bloquear movimento
  showError(validation.message);
  return;
}
```

### Exemplo 2: Ação que só envia email quando vem de coluna adjacente

```typescript
// Configuração no backend
{
  columnId: "coluna-aprovado-id",
  trigger: "on_enter",
  fromColumnId: "coluna-aguardando-id",
  requireAdjacentPosition: true,  // Só se for adjacente
  type: "send_email",
  config: {
    template: "approval_notification"
  }
}

// No frontend
const columns = await getColumns(teamId);
const fromColumn = columns.find(c => c.id === "coluna-aguardando-id");
const toColumn = columns.find(c => c.id === "coluna-aprovado-id");

const isAdjacent = Math.abs(toColumn.position - fromColumn.position) === 1;

if (isAdjacent) {
  // A ação será executada automaticamente pelo backend
  // Mas você pode mostrar uma mensagem ao usuário
  showInfo("Email de aprovação será enviado automaticamente");
}
```

### Exemplo 3: Componente React Completo

```tsx
import React, { useState, useEffect } from 'react';

interface Column {
  id: string;
  title: string;
  position: number;
  validations: Validation[];
  actions: Action[];
}

interface Task {
  id: string;
  title: string;
  columnId: string;
  totalValue?: number;
  // ... outros campos
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    const data = await getColumns(teamId, projectId);
    setColumns(data);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const fromColumnId = result.source.droppableId;
    const toColumnId = result.destination.droppableId;
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    // ✅ Buscar validações da coluna de destino
    const toColumn = columns.find(c => c.id === toColumnId);
    if (!toColumn) return;
    
    // ✅ Verificar validações aplicáveis
    const applicableValidations = getApplicableValidations(
      columns,
      fromColumnId,
      toColumnId,
      toColumn.validations  // ✅ Passar validações da coluna de destino
    );

    // ✅ Validar localmente
    const validation = validateTaskForValidations(task, applicableValidations);

    if (!validation.valid) {
      if (validation.hasBlockingErrors) {
        showError(validation.errors.join('; '));
        return;
      }
      
      if (validation.warnings.length > 0) {
        const proceed = await showWarningDialog(validation.warnings);
        if (!proceed) return;
      }
    }

    // Verificar se é movimento adjacente (se necessário)
    const fromColumn = columns.find(c => c.id === fromColumnId);
    const toColumn = columns.find(c => c.id === toColumnId);
    const positionDiff = Math.abs(toColumn.position - fromColumn.position);

    const hasAdjacentRequirement = applicableValidations.some(
      v => v.requireAdjacentPosition
    );

    if (hasAdjacentRequirement && positionDiff !== 1) {
      showError('Este movimento só é permitido entre colunas adjacentes');
      return;
    }

    // Mover o card
    try {
      const response = await moveTask(
        taskId,
        fromColumnId,
        toColumnId,
        result.destination.index
      );
      
      handleMoveResponse(response);
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {columns.map(column => (
        <Droppable key={column.id} droppableId={column.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <ColumnHeader column={column} />
              {tasks
                .filter(t => t.columnId === column.id)
                .map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={index}
                  >
                    {(provided) => (
                      <TaskCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        task={task}
                      />
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};
```

---

## ⚠️ Tratamento de Erros

### Erros Comuns

1. **Movimento Bloqueado por Validação**
```typescript
{
  status: 400,
  message: "Movimento bloqueado por validações",
  validationResults: [
    {
      validationId: "val-123",
      passed: false,
      message: "Campo obrigatório não preenchido"
    }
  ],
  blocked: true
}
```

2. **Movimento Não Adjacente**
```typescript
{
  status: 400,
  message: "Movimento só permitido entre colunas adjacentes"
}
```

3. **Coluna Não Encontrada**
```typescript
{
  status: 404,
  message: "Coluna não encontrada"
}
```

### Tratamento no Frontend

```typescript
const handleMoveError = (error: any) => {
  if (error.status === 400 && error.blocked) {
    // Mostrar erros de validação
    const messages = error.validationResults
      .filter((r: any) => !r.passed)
      .map((r: any) => r.message);
    
    showErrorDialog(messages);
  } else if (error.status === 400) {
    showError(error.message);
  } else if (error.status === 404) {
    showError('Coluna não encontrada. Recarregue a página.');
  } else {
    showError('Erro ao mover card. Tente novamente.');
  }
};
```

---

## 🚫 Validações de Exclusão e Reordenação de Colunas

### Proteção contra Movimentação de Colunas

O sistema impede a movimentação de uma coluna se ela estiver sendo referenciada em validações ou ações, seja como **origem** (`fromColumnId`) ou como **destino** (`columnId`/`toColumnId`). Quando uma coluna está vinculada, o botão de arrastar fica desabilitado visualmente.

**Importante**: Uma coluna é bloqueada se:
- Ela é origem de alguma validação/ação (`fromColumnId`)
- Ela é destino de alguma validação/ação (`columnId` ou `toColumnId`)

#### Comportamento no Frontend

**Verificação Automática:**

Quando o quadro Kanban carrega, o sistema:
1. Busca todas as validações e ações de todas as colunas
2. Verifica quais colunas estão sendo usadas como `columnId` ou `fromColumnId`
3. Desabilita o drag handle (botão de arrastar) das colunas bloqueadas
4. Exibe tooltip explicativo ao passar o mouse sobre o botão desabilitado

**Implementação:**

```typescript
// No componente Column
const Column: React.FC<ColumnProps> = ({
  column,
  isColumnLocked = false, // Prop recebida do KanbanBoard
  canEditColumns = false,
  // ... outras props
}) => {
  const { attributes, listeners, ... } = useSortable({
    id: column.id,
    disabled: !canEditColumns || isColumnLocked, // Desabilita se bloqueada
  });

  return (
    <ColumnContainer>
      <ColumnHeader>
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: canEditColumns && !isColumnLocked ? 'grab' : 'not-allowed',
            opacity: isColumnLocked ? 0.5 : 1,
          }}
          title={
            isColumnLocked 
              ? 'Esta coluna não pode ser movida pois está vinculada a validações ou ações'
              : canEditColumns 
                ? 'Arrastar para reordenar' 
                : ''
          }
        >
          <MdDragIndicator size={16} />
        </div>
        {/* ... resto do header */}
      </ColumnHeader>
    </ColumnContainer>
  );
};
```

**Verificação no KanbanBoard:**

```typescript
// Estado para rastrear colunas bloqueadas
const [lockedColumns, setLockedColumns] = useState<Set<string>>(new Set());

// Verificar colunas bloqueadas quando o board carregar
useEffect(() => {
  const checkLockedColumns = async () => {
    if (board.columns.length === 0) {
      setLockedColumns(new Set());
      return;
    }
    
    try {
      const { kanbanValidationsApi } = await import('../../services/kanbanValidationsApi');
      const allValidations: any[] = [];
      const allActions: any[] = [];
      
      // Buscar validações e ações de todas as colunas
      for (const column of board.columns) {
        try {
          const validations = await kanbanValidationsApi.getValidations(column.id);
          const actions = await kanbanValidationsApi.getActions(column.id);
          allValidations.push(...validations);
          allActions.push(...actions);
        } catch (error) {
          console.warn(`⚠️ Não foi possível buscar validações/ações da coluna ${column.id}:`, error);
        }
      }
      
      // Verificar quais colunas estão bloqueadas
      const locked = new Set<string>();
      for (const column of board.columns) {
        const usageCheck = isColumnUsedInValidationsOrActions(
          column.id,
          allValidations,
          allActions
        );
        
        if (usageCheck.isUsed) {
          locked.add(column.id);
        }
      }
      
      setLockedColumns(locked);
    } catch (error) {
      console.error('❌ Erro ao verificar colunas bloqueadas:', error);
      setLockedColumns(new Set());
    }
  };
  
  checkLockedColumns();
}, [board.columns]);

// Passar isColumnLocked para cada Column
{localColumns.map(column => (
  <Column
    key={column.id}
    column={column}
    isColumnLocked={lockedColumns.has(column.id)}
    // ... outras props
  />
))}
```

**Função Utilitária:**

```typescript
/**
 * Verifica se uma coluna está sendo usada em validações ou ações
 * Agora verifica tanto como origem (fromColumnId) quanto como destino (columnId/toColumnId)
 */
export const isColumnUsedInValidationsOrActions = (
  columnId: string,
  allValidations: ColumnValidation[],
  allActions: ColumnAction[]
): {
  isUsed: boolean;
  usedInValidations: Array<{ validationId: string; columnId: string; message: string; role: 'origin' | 'destination' }>;
  usedInActions: Array<{ actionId: string; columnId: string; trigger: string; role: 'origin' | 'destination' }>;
  reason?: string;
} => {
  const usedInValidations: Array<{ validationId: string; columnId: string; message: string; role: 'origin' | 'destination' }> = [];
  const usedInActions: Array<{ actionId: string; columnId: string; trigger: string; role: 'origin' | 'destination' }> = [];
  
  // Verificar validações
  for (const validation of allValidations) {
    if (!validation.isActive) continue;
    
    // Verificar se a coluna está sendo usada como coluna de destino (toColumnId ou columnId)
    const isDestination = validation.columnId === columnId || validation.toColumnId === columnId;
    if (isDestination) {
      usedInValidations.push({
        validationId: validation.id,
        columnId: validation.columnId,
        message: validation.message,
        role: 'destination',
      });
    }
    
    // Verificar se a coluna está sendo usada como coluna de origem (fromColumnId)
    if (validation.fromColumnId === columnId) {
      usedInValidations.push({
        validationId: validation.id,
        columnId: validation.columnId,
        message: validation.message,
        role: 'origin',
      });
    }
  }
  
  // Verificar ações
  for (const action of allActions) {
    if (!action.isActive) continue;
    
    // Verificar se a coluna está sendo usada como coluna de destino (toColumnId ou columnId)
    const isDestination = action.columnId === columnId || action.toColumnId === columnId;
    if (isDestination) {
      usedInActions.push({
        actionId: action.id,
        columnId: action.columnId,
        trigger: action.trigger,
        role: 'destination',
      });
    }
    
    // Verificar se a coluna está sendo usada como coluna de origem (fromColumnId)
    if (action.fromColumnId === columnId) {
      usedInActions.push({
        actionId: action.id,
        columnId: action.columnId,
        trigger: action.trigger,
        role: 'origin',
      });
    }
  }
  
  const isUsed = usedInValidations.length > 0 || usedInActions.length > 0;
  
  let reason = '';
  if (isUsed) {
    const reasons: string[] = [];
    if (usedInValidations.length > 0) {
      const asOrigin = usedInValidations.filter(v => v.role === 'origin').length;
      const asDestination = usedInValidations.filter(v => v.role === 'destination').length;
      const parts: string[] = [];
      if (asOrigin > 0) parts.push(`${asOrigin} como origem`);
      if (asDestination > 0) parts.push(`${asDestination} como destino`);
      reasons.push(`${usedInValidations.length} validação(ões) (${parts.join(', ')})`);
    }
    if (usedInActions.length > 0) {
      const asOrigin = usedInActions.filter(a => a.role === 'origin').length;
      const asDestination = usedInActions.filter(a => a.role === 'destination').length;
      const parts: string[] = [];
      if (asOrigin > 0) parts.push(`${asOrigin} como origem`);
      if (asDestination > 0) parts.push(`${asDestination} como destino`);
      reasons.push(`${usedInActions.length} ação(ões) (${parts.join(', ')})`);
    }
    reason = `Esta coluna está sendo usada em ${reasons.join(' e ')}. Remova ou desative essas configurações antes de movê-la ou excluí-la.`;
  }
  
  return {
    isUsed,
    usedInValidations,
    usedInActions,
    reason,
  };
};
```

### Proteção contra Exclusão

O sistema impede a exclusão de uma coluna se ela estiver sendo referenciada em validações ou ações, ou se possuir configurações próprias.

#### Endpoint: Excluir Coluna

```http
DELETE /kanban/columns/:id
```

**Validações Automáticas:**

A exclusão será bloqueada se a coluna:
1. Está sendo referenciada como `fromColumnId` em validações de outras colunas
2. Está sendo referenciada como `fromColumnId` em ações de outras colunas
3. Possui validações próprias configuradas
4. Possui ações próprias configuradas
5. Possui tarefas ativas

**Resposta de Erro (400):**

```typescript
{
  message: "Não é possível excluir esta coluna",
  errors: [
    "Esta coluna está sendo referenciada em 2 validação(ões) como coluna de origem. Remova essas referências antes de excluir a coluna.",
    "Esta coluna possui 1 ação(ões) configurada(s). Remova essas ações antes de excluir a coluna.",
    "Esta coluna possui 5 tarefa(s) ativa(s). Mova ou conclua essas tarefas antes de excluir a coluna."
  ],
  details: {
    validationsUsingAsFrom: 2,      // Validações em outras colunas que usam esta como origem
    actionsUsingAsFrom: 0,           // Ações em outras colunas que usam esta como origem
    validationsTargetingThis: 1,     // ✅ Validações que têm esta coluna como destino
    actionsTargetingThis: 0,         // ✅ Ações que têm esta coluna como destino
    ownValidations: 0,               // Validações próprias desta coluna
    ownActions: 1,                   // Ações próprias desta coluna
    activeTasks: 5,                  // Tarefas ativas nesta coluna
    relatedColumns: [                // ✅ Lista de colunas relacionadas
      { id: "col-x-id", title: "Coluna X" },
      { id: "col-y-id", title: "Coluna Y" }
    ]
  }
}
```

**Exemplo de Tratamento no Frontend:**

```typescript
const deleteColumn = async (columnId: string) => {
  try {
    await fetch(`/kanban/columns/${columnId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    showSuccess('Coluna excluída com sucesso');
  } catch (error) {
    if (error.status === 400 && error.errors) {
      // Mostrar erros específicos
      showErrorDialog({
        title: 'Não é possível excluir esta coluna',
        messages: error.errors,
        details: error.details
      });
    } else {
      showError('Erro ao excluir coluna');
    }
  }
};
```

### Avisos na Reordenação

Ao reordenar colunas, o sistema verifica se alguma coluna está sendo referenciada e retorna avisos (mas não bloqueia).

#### Endpoint: Reordenar Colunas

```http
POST /kanban/columns/reorder/:teamId
```

**Body:**
```typescript
{
  columnIds: string[];  // IDs na nova ordem
  projectId?: string;   // Opcional
}
```

**Resposta com Avisos:**

```typescript
{
  message: "Colunas reordenadas com sucesso",
  warnings: [
    "A coluna 'Em Negociação' está sendo referenciada em 1 validação(ões) e 2 ação(ões) como coluna de origem. A reordenação pode afetar validações/ações que requerem posição adjacente."
  ]
}
```

**Exemplo de Tratamento:**

```typescript
const reorderColumns = async (teamId: string, columnIds: string[]) => {
  const response = await fetch(`/kanban/columns/reorder/${teamId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ columnIds })
  });
  
  const result = await response.json();
  
  if (result.warnings && result.warnings.length > 0) {
    showWarningDialog({
      title: 'Aviso sobre reordenação',
      messages: result.warnings,
      onConfirm: () => {
        // Continuar mesmo com avisos
      }
    });
  } else {
    showSuccess(result.message);
  }
};
```

---

## 📌 Resumo de Endpoints

- `GET /kanban/columns/:teamId?projectId=:projectId` - Listar colunas com validações e ações (inclui fromColumn e toColumn)
- `GET /kanban/columns/:teamId/relations?projectId=:projectId` - Obter relações entre colunas
- `POST /kanban/tasks/move` - Mover card entre colunas
- `DELETE /kanban/columns/:id` - Excluir coluna (com validações)
- `POST /kanban/columns/reorder/:teamId` - Reordenar colunas (com avisos)

---

## 🎯 Boas Práticas

1. **Cache de Colunas**: As colunas mudam raramente, então cache-as no frontend
2. **Validação Local**: Valide localmente antes de enviar ao backend para melhor UX
3. **Feedback Visual**: Mostre claramente quais movimentos são permitidos/bloqueados
4. **Mensagens Claras**: Use as mensagens das validações para orientar o usuário
5. **Posições Adjacentes**: Destaque visualmente colunas adjacentes quando houver restrições
6. **Proteção de Colunas**: Sempre verifique se uma coluna está vinculada antes de permitir movimentação ou exclusão

---

**Última atualização:** Janeiro 2026

