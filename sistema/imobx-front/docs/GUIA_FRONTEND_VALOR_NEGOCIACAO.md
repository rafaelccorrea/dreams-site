# 💰 Guia Frontend: Valor da Negociação

> **Data**: Janeiro 2025  
> **Versão**: 1.0  
> **Status**: ✅ Implementado

---

## 📖 Visão Geral

O sistema permite definir e atualizar o **valor total da negociação** diretamente na tarefa (não subtarefa). Este valor é utilizado para análises de pipeline, métricas de vendas e identificação de valores parados por coluna.

---

## 🎯 Funcionalidades

- ✅ Definir valor ao criar uma tarefa
- ✅ Atualizar valor ao editar uma tarefa
- ✅ Histórico de alterações de valor
- ✅ Utilizado em métricas e análises

---

## 📡 Endpoints

### 1. Criar Tarefa com Valor

```http
POST /kanban/tasks
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Negociação Cliente Premium",
  "columnId": "uuid-coluna",
  "projectId": "uuid-projeto",
  "totalValue": 350000.00,
  "priority": "high",
  "description": "Negociação de imóvel comercial"
}
```

**Resposta (201):**
```json
{
  "id": "uuid-tarefa",
  "title": "Negociação Cliente Premium",
  "totalValue": 350000.00,
  // ... outros campos
}
```

---

### 2. Atualizar Valor da Tarefa

```http
PATCH /kanban/tasks/{taskId}
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "totalValue": 400000.00
}
```

**Resposta (200):**
```json
{
  "id": "uuid-tarefa",
  "title": "Negociação Cliente Premium",
  "totalValue": 400000.00,
  // ... outros campos
}
```

---

## 💻 Exemplos de Uso

### Exemplo 1: Criar Tarefa com Valor

```typescript
async function createTaskWithValue(
  title: string,
  columnId: string,
  projectId: string,
  totalValue: number,
) {
  const response = await fetch('/api/kanban/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      columnId,
      projectId,
      totalValue,
      priority: 'high',
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar tarefa');
  }

  return response.json();
}

// Uso
const task = await createTaskWithValue(
  'Negociação Cliente X',
  'uuid-coluna',
  'uuid-projeto',
  350000.00,
);
```

---

### Exemplo 2: Atualizar Valor

```typescript
async function updateTaskValue(taskId: string, newValue: number) {
  const response = await fetch(`/api/kanban/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      totalValue: newValue,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar valor');
  }

  return response.json();
}

// Uso
const updatedTask = await updateTaskValue('uuid-tarefa', 400000.00);
```

---

### Exemplo 3: Componente React - Formulário de Tarefa

```typescript
import { useState } from 'react';
import { formatCurrency, getNumericValue } from '../utils/masks';

interface TaskFormProps {
  columnId: string;
  projectId: string;
  onSuccess?: () => void;
}

function TaskForm({ columnId, projectId, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [totalValue, setTotalValue] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/kanban/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          columnId,
          projectId,
          totalValue: totalValue ? getNumericValue(totalValue) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa');
      }

      const task = await response.json();
      console.log('Tarefa criada:', task);
      
      // Limpar formulário
      setTitle('');
      setTotalValue('');
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Título da Negociação *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />
      </div>

      <div className="form-group">
        <label htmlFor="totalValue">Valor da Negociação (R$)</label>
        <input
          id="totalValue"
          type="text"
          value={totalValue}
          onChange={(e) => setTotalValue(formatCurrency(e.target.value))}
          placeholder="R$ 350.000,00"
        />
        <small>Opcional - Valor total da negociação</small>
      </div>

      <button type="submit" disabled={loading || !title}>
        {loading ? 'Criando...' : 'Criar Negociação'}
      </button>
    </form>
  );
}
```

---

### Exemplo 4: Componente React - Card de Tarefa com Valor

```typescript
import { useState } from 'react';
import { formatCurrencyValue, getNumericValue } from '../utils/masks';
import { formatCurrency } from '../utils/masks';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    totalValue?: number;
    // ... outros campos
  };
  onValueUpdate?: (taskId: string, newValue: number) => void;
}

function TaskCard({ task, onValueUpdate }: TaskCardProps) {
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [newValue, setNewValue] = useState(
    task.totalValue ? formatCurrencyValue(task.totalValue) : ''
  );

  const handleValueUpdate = async () => {
    const numericValue = newValue ? getNumericValue(newValue) : undefined;
    
    if (numericValue === task.totalValue) {
      setIsEditingValue(false);
      return;
    }

    try {
      await updateTaskValue(task.id, numericValue || 0);
      setIsEditingValue(false);
      onValueUpdate?.(task.id, numericValue || 0);
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
      alert('Erro ao atualizar valor');
    }
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      
      <div className="task-value">
        {isEditingValue ? (
          <div className="value-edit">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(formatCurrency(e.target.value))}
              onBlur={handleValueUpdate}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleValueUpdate();
                }
              }}
              autoFocus
            />
            <button onClick={handleValueUpdate}>Salvar</button>
            <button onClick={() => {
              setNewValue(task.totalValue ? formatCurrencyValue(task.totalValue) : '');
              setIsEditingValue(false);
            }}>
              Cancelar
            </button>
          </div>
        ) : (
          <div 
            className="value-display" 
            onClick={() => setIsEditingValue(true)}
            title="Clique para editar"
          >
            {task.totalValue ? (
              <>
                <span className="value-label">Valor:</span>
                <span className="value-amount">
                  {formatCurrencyValue(task.totalValue)}
                </span>
              </>
            ) : (
              <span className="value-empty">Clique para adicionar valor</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 📋 Especificações Técnicas

### Campo `totalValue`

| Propriedade | Valor |
|-------------|-------|
| **Tipo** | `number` (decimal) |
| **Obrigatório** | Não |
| **Formato** | Decimal com 2 casas (ex: 350000.00) |
| **Valor mínimo** | 0 |
| **Precisão** | 15 dígitos, 2 decimais |
| **Armazenamento** | Banco de dados como `decimal(15,2)` |

### Validações

- ✅ Aceita apenas números positivos
- ✅ Formato decimal (ex: 350000.00)
- ✅ Opcional (pode ser `null` ou `undefined`)
- ✅ Não afeta outras funcionalidades se não informado

---

## 🎨 Recomendações de UI/UX

### 1. Formatação de Valor

```typescript
import { formatCurrencyValue } from '../utils/masks';

function formatCurrency(value: number): string {
  return formatCurrencyValue(value);
}

// Uso
formatCurrency(350000.00); // "R$ 350.000,00"
```

### 2. Input de Valor

```typescript
import { formatCurrency, getNumericValue } from '../utils/masks';

// Máscara para input de valor
function handleValueChange(value: string, setValue: (val: string) => void) {
  // Formata automaticamente enquanto o usuário digita
  const formatted = formatCurrency(value);
  setValue(formatted);
}

// Ao salvar, converter para número
const numericValue = getNumericValue(formattedValue);
```

### 3. Indicadores Visuais

- **Valor alto**: Destaque visual (ex: cor verde, ícone de dinheiro)
- **Sem valor**: Placeholder ou indicador discreto
- **Valor editável**: Ícone de edição ou hover effect

---

## 📊 Integração com Métricas

O valor da negociação é automaticamente utilizado em:

1. **Análise de Valores por Coluna**
   - `GET /kanban/analytics/columns/value-analysis`
   - Mostra quanto está parado em cada coluna

2. **Métricas de Negociações**
   - `GET /kanban/analytics/tasks/metrics`
   - Calcula pipeline total, valor médio, etc.

3. **Exportação para Excel**
   - Incluído em todas as exportações de métricas

---

## ⚠️ Observações Importantes

1. **Valor é por Tarefa**: O valor é da negociação (tarefa), não das subtarefas
2. **Histórico**: Alterações de valor são registradas no histórico da tarefa
3. **Métricas**: Apenas tarefas com valor são consideradas nas análises de valor
4. **Opcional**: O campo é opcional, mas recomendado para negociações de venda

---

## 🔗 Referências

- `docs/KANBAN_PAGE.md` - Documentação completa do sistema Kanban
- `docs/KANBAN_VALIDATIONS_AND_ACTIONS_CONDITIONAL.md` - Validações e ações
- `src/components/kanban/TaskAdditionalFields.tsx` - Componente de edição de campos adicionais
- `src/pages/CreateTaskPage.tsx` - Página de criação de tarefas
- `src/utils/masks.ts` - Funções de formatação de moeda

---

## 📝 Implementação no Código

### Tipos TypeScript

```typescript
// src/types/kanban.ts
export interface CreateTaskDto {
  title: string;
  description?: string;
  columnId: string;
  position?: number;
  priority?: string;
  assignedToId?: string;
  dueDate?: Date;
  projectId?: string;
  totalValue?: number; // ✅ Campo adicionado
}

export interface KanbanTask {
  // ... outros campos
  totalValue?: number; // ✅ Já existente
}
```

### Formulário de Criação

O campo de valor está disponível no formulário de criação de tarefas (`CreateTaskPage.tsx`):

- Campo opcional "Valor da Negociação (R$)"
- Formatação automática durante a digitação
- Conversão para número antes do envio

### Edição de Tarefas

O valor pode ser editado através do componente `TaskAdditionalFields.tsx`:

- Campo "Valor Total" com formatação automática
- Salvamento automático após 1 segundo de inatividade
- Atualização otimista da interface

---

**Última atualização**: Janeiro 2025
