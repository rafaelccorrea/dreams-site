# 📋 Documentação Frontend - Checklist de Vendas/Aluguéis

## 🎯 Visão Geral

API completa para gerenciar checklists de vendas e aluguéis vinculados a propriedades e clientes. O sistema permite criar, editar, atualizar status de itens e acompanhar o progresso completo do processo.

---

## 🔗 Base URL

```
/api/sale-checklists
```

**Autenticação:** Requer token JWT no header `Authorization` e header `X-Company-ID`

---

## 📡 Endpoints Disponíveis

### 1. Criar Checklist

**Endpoint:** `POST /api/sale-checklists`

**Descrição:** Cria um novo checklist vinculado a uma propriedade e cliente.

**Headers:**
```
Authorization: Bearer {token}
X-Company-ID: {companyId}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  propertyId: string;        // UUID da propriedade (obrigatório)
  clientId: string;          // UUID do cliente (obrigatório)
  type: 'sale' | 'rental';  // Tipo do checklist (obrigatório)
  items?: ChecklistItemDto[]; // Itens customizados (opcional - usa padrão se não informado)
  notes?: string;            // Observações iniciais (opcional)
}
```

**ChecklistItemDto (opcional):**
```typescript
{
  title: string;                    // Título do item
  description?: string;             // Descrição do item
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  requiredDocuments?: string[];     // Lista de documentos necessários
  estimatedDays?: number;          // Prazo estimado em dias
  order: number;                   // Ordem do item
  notes?: string;                  // Observações
}
```

**Response (201 Created):**
```typescript
{
  id: string;
  propertyId: string;
  clientId: string;
  companyId: string;
  responsibleUserId: string;
  type: 'sale' | 'rental';
  items: ChecklistItemResponseDto[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  startedAt: string; // ISO 8601
  completedAt?: string; // ISO 8601 (null se não concluído)
  notes?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  property?: {
    id: string;
    title: string;
    code?: string;
  };
  client?: {
    id: string;
    name: string;
    email?: string;
    phone: string;
  };
  responsibleUser?: {
    id: string;
    name: string;
    email: string;
  };
  statistics: {
    totalItems: number;
    completedItems: number;
    pendingItems: number;
    inProgressItems: number;
    completionPercentage: number; // 0-100
  };
}
```

**ChecklistItemResponseDto:**
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  requiredDocuments?: string[];
  estimatedDays?: number;
  order: number;
  completedAt?: string; // ISO 8601 (null se não concluído)
  completedBy?: string; // UUID do usuário que completou
  notes?: string;
}
```

**Exemplo de Uso:**
```typescript
const createChecklist = async (propertyId: string, clientId: string) => {
  const response = await fetch('/api/sale-checklists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Company-ID': companyId,
    },
    body: JSON.stringify({
      propertyId,
      clientId,
      type: 'sale', // ou 'rental'
      notes: 'Checklist criado automaticamente',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar checklist');
  }

  return await response.json();
};
```

**Checklist Padrão (Vendas):**

Se não informar `items`, o sistema cria automaticamente um checklist com 8 etapas:

1. Documentação inicial (3 dias)
2. Análise de crédito (7 dias)
3. Vistoria técnica (5 dias)
4. Negociação e proposta (5 dias)
5. Contrato de compra e venda (10 dias)
6. Financiamento (15 dias)
7. Escritura e registro (10 dias)
8. Entrega das chaves (1 dia)

**Checklist Padrão (Aluguéis):**

Se não informar `items`, o sistema cria automaticamente um checklist com 6 etapas:

1. Documentação inicial (3 dias)
2. Análise de perfil (5 dias)
3. Vistoria de entrada (2 dias)
4. Contrato de locação (5 dias)
5. Pagamento e caução (1 dia)
6. Entrega das chaves (1 dia)

---

### 2. Listar Checklists

**Endpoint:** `GET /api/sale-checklists`

**Descrição:** Lista todos os checklists, com filtros opcionais por propriedade, cliente, tipo ou status.

**Query Parameters:**

- `propertyId` (opcional): Filtrar por propriedade específica
- `clientId` (opcional): Filtrar por cliente específico
- `type` (opcional): Filtrar por tipo (`'sale'` ou `'rental'`)
- `status` (opcional): Filtrar por status (`'pending'`, `'in_progress'`, `'completed'`, `'skipped'`)
- `search` (opcional): Busca textual por propriedade, cliente ou tipo
- `page` (opcional): Número da página para paginação (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)

**Response (200 OK):**
```typescript
ChecklistResponseDto[] // Array de checklists
```

**Exemplo de Uso:**

```typescript
// Listar todos os checklists
const getAllChecklists = async () => {
  const response = await fetch('/api/sale-checklists', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Company-ID': companyId,
    },
  });
  return await response.json();
};

// Filtrar por propriedade
const getChecklistsByProperty = async (propertyId: string) => {
  const response = await fetch(
    `/api/sale-checklists?propertyId=${propertyId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-ID': companyId,
      },
    },
  );
  return await response.json();
};

// Filtrar por cliente
const getChecklistsByClient = async (clientId: string) => {
  const response = await fetch(
    `/api/sale-checklists?clientId=${clientId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-ID': companyId,
      },
    },
  );
  return await response.json();
};

// Filtrar por tipo e status
const getChecklistsByTypeAndStatus = async (
  type: 'sale' | 'rental',
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
) => {
  const response = await fetch(
    `/api/sale-checklists?type=${type}&status=${status}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-ID': companyId,
      },
    },
  );
  return await response.json();
};

// Busca textual
const searchChecklists = async (searchTerm: string) => {
  const response = await fetch(
    `/api/sale-checklists?search=${encodeURIComponent(searchTerm)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-ID': companyId,
      },
    },
  );
  return await response.json();
};

// Múltiplos filtros combinados
const getFilteredChecklists = async (filters: {
  propertyId?: string;
  clientId?: string;
  type?: 'sale' | 'rental';
  status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  
  if (filters.propertyId) params.append('propertyId', filters.propertyId);
  if (filters.clientId) params.append('clientId', filters.clientId);
  if (filters.type) params.append('type', filters.type);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(
    `/api/sale-checklists?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-ID': companyId,
      },
    },
  );
  return await response.json();
};
```

**Filtros Disponíveis no Frontend:**

A página de listagem (`/checklists`) possui um drawer de filtros avançados com as seguintes opções:

1. **Tipo** (`type`):
   - `'sale'` - Checklists de vendas
   - `'rental'` - Checklists de aluguéis
   - `''` (vazio) - Todos os tipos

2. **Status** (`status`):
   - `'pending'` - Pendente
   - `'in_progress'` - Em Andamento
   - `'completed'` - Concluído
   - `'skipped'` - Pulado
   - `''` (vazio) - Todos os status

3. **Propriedade** (`propertyId`):
   - Seleção via dropdown com todas as propriedades disponíveis
   - Filtra checklists vinculados à propriedade selecionada

4. **Cliente** (`clientId`):
   - Seleção via dropdown com todos os clientes disponíveis
   - Filtra checklists vinculados ao cliente selecionado

5. **Busca Textual** (`search`):
   - Busca por nome da propriedade, nome do cliente ou tipo
   - Aplicada em tempo real enquanto o usuário digita

**Combinação de Filtros:**

Todos os filtros podem ser combinados. Por exemplo:
- Filtrar apenas checklists de vendas (`type=sale`) que estão em andamento (`status=in_progress`) para uma propriedade específica (`propertyId=xxx`)
- Filtrar checklists de aluguéis (`type=rental`) concluídos (`status=completed`) de um cliente específico (`clientId=xxx`)

---

### 3. Buscar Checklist por ID

**Endpoint:** `GET /api/sale-checklists/:id`

**Descrição:** Busca um checklist específico com todas as informações relacionadas.

**Response (200 OK):**
```typescript
ChecklistResponseDto // Objeto único
```

**Exemplo de Uso:**
```typescript
const getChecklist = async (checklistId: string) => {
  const response = await fetch(`/api/sale-checklists/${checklistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Company-ID': companyId,
    },
  });

  if (!response.ok) {
    throw new Error('Checklist não encontrado');
  }

  return await response.json();
};
```

---

### 4. Atualizar Checklist Completo

**Endpoint:** `PATCH /api/sale-checklists/:id`

**Descrição:** Atualiza o checklist completo, incluindo todos os itens. Use este endpoint para editar múltiplos itens de uma vez ou modificar o checklist inteiro.

**Request Body:**
```typescript
{
  type?: 'sale' | 'rental';  // Alterar tipo (opcional)
  items?: UpdateChecklistItemDto[]; // Atualizar todos os itens (opcional)
  status?: 'pending' | 'in_progress' | 'completed' | 'skipped'; // Status geral (opcional)
  notes?: string; // Observações (opcional)
}
```

**UpdateChecklistItemDto:**
```typescript
{
  id?: string;              // ID do item (obrigatório se já existe)
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
  requiredDocuments?: string[];
  estimatedDays?: number;
  order?: number;
  notes?: string;
}
```

**Response (200 OK):**
```typescript
ChecklistResponseDto
```

**Exemplo de Uso - Editar Múltiplos Itens:**
```typescript
const updateChecklist = async (
  checklistId: string,
  updates: {
    items?: Array<{
      id: string;
      title?: string;
      status?: string;
      notes?: string;
    }>;
    notes?: string;
  },
) => {
  const response = await fetch(`/api/sale-checklists/${checklistId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Company-ID': companyId,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao atualizar checklist');
  }

  return await response.json();
};

// Exemplo: Marcar múltiplos itens como concluídos
await updateChecklist(checklistId, {
  items: [
    { id: 'item-1', status: 'completed' },
    { id: 'item-2', status: 'completed' },
  ],
  notes: 'Documentação inicial e análise de crédito concluídas',
});
```

**Exemplo de Uso - Adicionar Novo Item:**
```typescript
// Buscar checklist atual
const checklist = await getChecklist(checklistId);

// Adicionar novo item
const newItem = {
  id: undefined, // Novo item não tem ID ainda
  title: 'Revisão de documentos',
  description: 'Revisar todos os documentos antes do fechamento',
  status: 'pending',
  requiredDocuments: ['Contrato', 'Escritura'],
  estimatedDays: 2,
  order: checklist.items.length + 1,
};

// Atualizar com novo item
await updateChecklist(checklistId, {
  items: [...checklist.items, newItem],
});
```

---

### 5. Atualizar Status de Item Específico

**Endpoint:** `PATCH /api/sale-checklists/:id/item-status`

**Descrição:** Atualiza apenas o status de um item específico. **Recomendado para mudanças simples de status.**

**Request Body:**
```typescript
{
  itemId: string;  // ID do item a ser atualizado
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  notes?: string;  // Observações opcionais
}
```

**Response (200 OK):**
```typescript
ChecklistResponseDto // Checklist completo atualizado
```

**Exemplo de Uso - Marcar Item como Concluído:**
```typescript
const updateItemStatus = async (
  checklistId: string,
  itemId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'skipped',
  notes?: string,
) => {
  const response = await fetch(
    `/api/sale-checklists/${checklistId}/item-status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Company-ID': companyId,
      },
      body: JSON.stringify({
        itemId,
        status,
        notes,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao atualizar status do item');
  }

  return await response.json();
};

// Exemplo: Marcar item como concluído
await updateItemStatus(
  checklistId,
  'item-1',
  'completed',
  'Documentação coletada com sucesso',
);

// Exemplo: Voltar status anterior (de completed para in_progress)
await updateItemStatus(
  checklistId,
  'item-1',
  'in_progress',
  'Necessário revisar alguns documentos',
);
```

**⚠️ Importante - Voltar Status Anterior:**

O sistema permite voltar para qualquer status anterior. Por exemplo:

- `completed` → `in_progress` (se precisar revisar)
- `completed` → `pending` (se precisar refazer)
- `in_progress` → `pending` (se precisar recomeçar)
- `skipped` → `pending` (se decidir não pular)

Quando você volta um status, o campo `completedAt` e `completedBy` são limpos automaticamente.

---

### 6. Remover Checklist (Soft Delete)

**Endpoint:** `DELETE /api/sale-checklists/:id`

**Descrição:** Remove um checklist usando **soft delete**. O checklist não é removido permanentemente do banco de dados, apenas marcado como deletado (`deletedAt`). Isso permite recuperação futura e mantém histórico.

**Response (200 OK):**
```json
{
  "message": "Checklist removido com sucesso"
}
```

**⚠️ Importante:**

- O checklist não é removido permanentemente
- Após a exclusão, o checklist não aparecerá mais nas listagens normais
- O campo `deletedAt` será preenchido com a data/hora da exclusão
- Se tentar deletar um checklist já deletado, retornará erro 400

**Exemplo de Uso:**
```typescript
const deleteChecklist = async (checklistId: string) => {
  const response = await fetch(`/api/sale-checklists/${checklistId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Company-ID': companyId,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao remover checklist');
  }

  return await response.json();
};
```

---

## 🎨 Exemplos Práticos de Integração

### Exemplo 1: Criar Checklist ao Iniciar Processo de Venda

```typescript
// Quando corretor inicia processo de venda
const startSaleProcess = async (propertyId: string, clientId: string) => {
  try {
    const checklist = await createChecklist(propertyId, clientId, 'sale');
    
    console.log('Checklist criado:', checklist.id);
    console.log('Progresso inicial:', checklist.statistics.completionPercentage);
    
    return checklist;
  } catch (error) {
    console.error('Erro ao criar checklist:', error);
    throw error;
  }
};
```

### Exemplo 2: Componente React - Lista de Checklists com Filtros

```typescript
import { useState, useEffect } from 'react';

interface Checklist {
  id: string;
  property: { title: string };
  client: { name: string };
  type: 'sale' | 'rental';
  status: string;
  statistics: {
    completionPercentage: number;
    completedItems: number;
    totalItems: number;
  };
}

const ChecklistsList = ({ 
  propertyId, 
  clientId,
  filters 
}: { 
  propertyId?: string; 
  clientId?: string;
  filters?: {
    type?: 'sale' | 'rental';
    status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
    search?: string;
  };
}) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChecklists();
  }, [propertyId, clientId, filters]);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      let url = '/api/sale-checklists';
      const params = new URLSearchParams();
      
      if (propertyId) params.append('propertyId', propertyId);
      if (clientId) params.append('clientId', clientId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-ID': companyId,
        },
      });

      const data = await response.json();
      setChecklists(data);
    } catch (error) {
      console.error('Erro ao carregar checklists:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Checklists</h2>
      {checklists.map(checklist => (
        <div key={checklist.id} className="checklist-card">
          <h3>{checklist.property.title}</h3>
          <p>Cliente: {checklist.client.name}</p>
          <p>Tipo: {checklist.type === 'sale' ? 'Venda' : 'Aluguel'}</p>
          <div className="progress-bar">
            <div
              style={{ width: `${checklist.statistics.completionPercentage}%` }}
            />
          </div>
          <p>
            {checklist.statistics.completedItems} / {checklist.statistics.totalItems} concluídos
          </p>
        </div>
      ))}
    </div>
  );
};
```

### Exemplo 3: Componente React - Visualizar e Editar Checklist

```typescript
import { useState, useEffect } from 'react';

const ChecklistView = ({ checklistId }: { checklistId: string }) => {
  const [checklist, setChecklist] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  useEffect(() => {
    loadChecklist();
  }, [checklistId]);

  const loadChecklist = async () => {
    const data = await getChecklist(checklistId);
    setChecklist(data);
  };

  const handleItemStatusChange = async (
    itemId: string,
    newStatus: string,
  ) => {
    try {
      const updated = await updateItemStatus(
        checklistId,
        itemId,
        newStatus as any,
      );
      setChecklist(updated);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do item');
    }
  };

  const handleEditItem = async (itemId: string, updates: any) => {
    try {
      // Buscar item atual
      const item = checklist.items.find((i: any) => i.id === itemId);
      
      // Atualizar item
      const updatedItems = checklist.items.map((i: any) =>
        i.id === itemId ? { ...i, ...updates } : i,
      );

      const updated = await updateChecklist(checklistId, {
        items: updatedItems,
      });
      
      setChecklist(updated);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao editar item:', error);
      alert('Erro ao editar item');
    }
  };

  if (!checklist) return <div>Carregando...</div>;

  return (
    <div className="checklist-view">
      <h2>Checklist - {checklist.property?.title}</h2>
      <p>Cliente: {checklist.client?.name}</p>
      
      <div className="progress-summary">
        <h3>Progresso: {checklist.statistics.completionPercentage}%</h3>
        <p>
          {checklist.statistics.completedItems} de {checklist.statistics.totalItems} itens concluídos
        </p>
      </div>

      <div className="checklist-items">
        {checklist.items.map((item: any) => (
          <div key={item.id} className="checklist-item">
            <div className="item-header">
              <h4>{item.title}</h4>
              <select
                value={item.status}
                onChange={(e) =>
                  handleItemStatusChange(item.id, e.target.value)
                }
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="skipped">Pulado</option>
              </select>
            </div>

            {item.description && <p>{item.description}</p>}

            {item.requiredDocuments && item.requiredDocuments.length > 0 && (
              <div className="required-documents">
                <strong>Documentos necessários:</strong>
                <ul>
                  {item.requiredDocuments.map((doc: string, idx: number) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.estimatedDays && (
              <p>Prazo estimado: {item.estimatedDays} dias</p>
            )}

            {item.completedAt && (
              <p className="completed-info">
                Concluído em: {new Date(item.completedAt).toLocaleDateString('pt-BR')}
              </p>
            )}

            {editingItem === item.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  defaultValue={item.title}
                  onChange={(e) =>
                    handleEditItem(item.id, { title: e.target.value })
                  }
                />
                <textarea
                  defaultValue={item.notes || ''}
                  placeholder="Observações"
                  onChange={(e) =>
                    handleEditItem(item.id, { notes: e.target.value })
                  }
                />
                <button onClick={() => setEditingItem(null)}>Salvar</button>
              </div>
            ) : (
              <button onClick={() => setEditingItem(item.id)}>Editar</button>
            )}

            {item.notes && <p className="notes">{item.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Exemplo 4: Hook Customizado para Gerenciar Checklist

```typescript
import { useState, useCallback } from 'react';

export const useChecklist = (checklistId: string) => {
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChecklist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChecklist(checklistId);
      setChecklist(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar checklist');
    } finally {
      setLoading(false);
    }
  }, [checklistId]);

  const updateItemStatus = useCallback(
    async (
      itemId: string,
      status: 'pending' | 'in_progress' | 'completed' | 'skipped',
      notes?: string,
    ) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await updateItemStatus(checklistId, itemId, status, notes);
        setChecklist(updated);
        return updated;
      } catch (err: any) {
        setError(err.message || 'Erro ao atualizar status');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checklistId],
  );

  const updateChecklist = useCallback(
    async (updates: any) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await updateChecklist(checklistId, updates);
        setChecklist(updated);
        return updated;
      } catch (err: any) {
        setError(err.message || 'Erro ao atualizar checklist');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checklistId],
  );

  return {
    checklist,
    loading,
    error,
    loadChecklist,
    updateItemStatus,
    updateChecklist,
  };
};

// Uso do hook:
const MyComponent = ({ checklistId }: { checklistId: string }) => {
  const {
    checklist,
    loading,
    error,
    loadChecklist,
    updateItemStatus,
  } = useChecklist(checklistId);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    await updateItemStatus(itemId, newStatus as any);
  };

  // ... resto do componente
};
```

---

## 🔄 Fluxo de Trabalho Recomendado

### 1. Criar Checklist ao Iniciar Processo

```typescript
// Quando corretor inicia processo de venda/aluguel
const checklist = await createChecklist(propertyId, clientId, 'sale');
// Checklist padrão é criado automaticamente
```

### 2. Atualizar Status Conforme Progresso

```typescript
// Marcar item como "em andamento"
await updateItemStatus(checklistId, itemId, 'in_progress');

// Quando concluir etapa
await updateItemStatus(
  checklistId,
  itemId,
  'completed',
  'Documentação coletada com sucesso',
);

// Se precisar voltar (corrigir erro)
await updateItemStatus(
  checklistId,
  itemId,
  'in_progress',
  'Necessário revisar alguns documentos',
);
```

### 3. Editar Item (Adicionar Observações, Modificar)

```typescript
// Editar título, descrição ou adicionar observações
await updateChecklist(checklistId, {
  items: [
    {
      id: itemId,
      title: 'Novo título',
      notes: 'Observações importantes',
    },
  ],
});
```

### 4. Adicionar Novo Item Personalizado

```typescript
const checklist = await getChecklist(checklistId);

const newItem = {
  title: 'Etapa personalizada',
  description: 'Descrição da etapa',
  status: 'pending',
  requiredDocuments: ['Documento 1', 'Documento 2'],
  estimatedDays: 5,
  order: checklist.items.length + 1,
};

await updateChecklist(checklistId, {
  items: [...checklist.items, newItem],
});
```

---

## ⚠️ Tratamento de Erros

### Erros Comuns

**400 Bad Request - Checklist já existe:**
```json
{
  "statusCode": 400,
  "message": "Já existe um checklist para esta propriedade e cliente",
  "error": "Bad Request"
}
```

**404 Not Found - Checklist não encontrado:**
```json
{
  "statusCode": 404,
  "message": "Checklist não encontrado",
  "error": "Not Found"
}
```

**404 Not Found - Item não encontrado:**
```json
{
  "statusCode": 404,
  "message": "Item do checklist não encontrado",
  "error": "Not Found"
}
```

**403 Forbidden - Sem acesso:**
```json
{
  "statusCode": 403,
  "message": "Você não tem acesso a esta empresa",
  "error": "Forbidden"
}
```

### Exemplo de Tratamento de Erros

```typescript
const handleApiCall = async (apiCall: () => Promise<any>) => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          alert(`Erro de validação: ${data.message}`);
          break;
        case 403:
          alert('Você não tem permissão para esta ação');
          break;
        case 404:
          alert('Recurso não encontrado');
          break;
        case 500:
          alert('Erro interno do servidor. Tente novamente mais tarde.');
          break;
        default:
          alert(`Erro: ${data.message || 'Erro desconhecido'}`);
      }
    } else {
      alert('Erro de conexão. Verifique sua internet.');
    }
    throw error;
  }
};

// Uso:
await handleApiCall(() => updateItemStatus(checklistId, itemId, 'completed'));
```

---

## 📊 Status e Transições

### Status Disponíveis

- **`pending`**: Item ainda não iniciado
- **`in_progress`**: Item em andamento
- **`completed`**: Item concluído
- **`skipped`**: Item pulado (não aplicável)

### Transições Permitidas

✅ **Todas as transições são permitidas:**

- `pending` → `in_progress` → `completed`
- `completed` → `in_progress` (voltar para revisar)
- `completed` → `pending` (refazer completamente)
- `in_progress` → `pending` (recomeçar)
- Qualquer status → `skipped` (pular item)
- `skipped` → `pending` (decidir não pular)

### Status Geral do Checklist

O status geral é calculado automaticamente:

- **`completed`**: Todos os itens estão concluídos
- **`in_progress`**: Pelo menos um item está em andamento ou concluído
- **`pending`**: Nenhum item foi iniciado

---

## 💡 Dicas de Implementação

### 1. Atualização Otimista

Para melhor UX, atualize a UI antes da resposta da API:

```typescript
const updateItemStatusOptimistic = async (
  checklistId: string,
  itemId: string,
  newStatus: string,
) => {
  // Atualizar UI imediatamente
  setChecklist((prev: any) => ({
    ...prev,
    items: prev.items.map((item: any) =>
      item.id === itemId
        ? {
            ...item,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
          }
        : item,
    ),
  }));

  try {
    // Chamar API
    const updated = await updateItemStatus(checklistId, itemId, newStatus);
    // Atualizar com dados reais do servidor
    setChecklist(updated);
  } catch (error) {
    // Reverter em caso de erro
    loadChecklist();
    throw error;
  }
};
```

### 2. Cache e Sincronização

```typescript
// Usar React Query ou similar para cache
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useChecklistQuery = (checklistId: string) => {
  return useQuery({
    queryKey: ['checklist', checklistId],
    queryFn: () => getChecklist(checklistId),
    staleTime: 30000, // 30 segundos
  });
};

const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, itemId, status }: any) =>
      updateItemStatus(checklistId, itemId, status),
    onSuccess: (data, variables) => {
      // Invalidar cache para atualizar
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId],
      });
    },
  });
};
```

### 3. Notificações de Progresso

```typescript
// Notificar quando checklist for concluído
useEffect(() => {
  if (
    checklist?.statistics.completionPercentage === 100 &&
    checklist?.status === 'completed'
  ) {
    showNotification('Checklist concluído! 🎉');
  }
}, [checklist]);
```

---

## 🎯 Casos de Uso Comuns

### Caso 1: Corretor marca etapa como concluída

```typescript
// Usuário clica em "Marcar como concluído"
await updateItemStatus(
  checklistId,
  'item-documentacao-inicial',
  'completed',
  'Todos os documentos coletados',
);
```

### Caso 2: Corretor percebe erro e precisa voltar

```typescript
// Item estava marcado como concluído, mas precisa revisar
await updateItemStatus(
  checklistId,
  'item-documentacao-inicial',
  'in_progress',
  'Faltou o comprovante de renda, necessário revisar',
);
```

### Caso 3: Adicionar observações a um item

```typescript
// Editar item para adicionar observações
await updateChecklist(checklistId, {
  items: [
    {
      id: 'item-1',
      notes: 'Cliente precisa enviar comprovante de renda atualizado',
    },
  ],
});
```

### Caso 4: Pular etapa não aplicável

```typescript
// Se financiamento não for necessário
await updateItemStatus(
  checklistId,
  'item-financiamento',
  'skipped',
  'Pagamento à vista, não requer financiamento',
);
```

---

## 📝 Notas Importantes

1. **Um checklist por Property + Client**: Não é possível criar múltiplos checklists para a mesma combinação de propriedade e cliente.

2. **Status automático**: O status geral do checklist é calculado automaticamente baseado nos itens. Não é necessário atualizar manualmente.

3. **Histórico**: O sistema não mantém histórico de mudanças de status. Se precisar de histórico, considere integrar com o sistema de auditoria.

4. **Permissões**: Todos os endpoints respeitam as permissões do usuário e da empresa.

5. **Validação**: O sistema valida que a propriedade e cliente pertencem à mesma empresa antes de criar o checklist.

---

## 🔔 Sistema de Notificações Automáticas

O sistema possui um sistema automático de notificações que alerta sobre checklists com itens pendentes há muito tempo.

### Como Funciona

O sistema verifica diariamente (às 9h da manhã) todos os checklists ativos e identifica aqueles com itens pendentes que ultrapassaram os prazos estimados.

### Níveis de Notificação

#### 1. Lembrete ao Corretor (Após 3 dias de atraso)

Quando um item do checklist está pendente há **3 ou mais dias** além do prazo estimado, o corretor responsável recebe uma notificação de lembrete.

**Características:**

- **Prioridade:** Média (`MEDIUM`)
- **Título:** `⏰ Lembrete: Checklist pendente - [Nome do Imóvel]`
- **Mensagem:** Informa quantos dias o checklist está pendente e pede para atualizar o progresso
- **Destinatário:** Apenas o corretor responsável pelo checklist

**Exemplo de Notificação:**

```json
{
  "type": "SYSTEM_ALERT",
  "priority": "MEDIUM",
  "title": "⏰ Lembrete: Checklist pendente - Apartamento Centro",
  "message": "O checklist de venda do imóvel \"Apartamento Centro\" com o cliente \"João Silva\" possui itens pendentes há 5 dias. Não se esqueça de atualizar o progresso.",
  "actionUrl": "/checklists/abc-123",
  "entityType": "checklist",
  "entityId": "abc-123",
  "metadata": {
    "checklistId": "abc-123",
    "propertyId": "prop-456",
    "clientId": "client-789",
    "daysOverdue": 5,
    "type": "sale"
  }
}
```

#### 2. Escalação Crítica (Após 7 dias de atraso)

Quando um item do checklist está pendente há **7 ou mais dias** além do prazo estimado, o sistema escalona a notificação para:

- **Corretor responsável** (notificação de alta prioridade)
- **Manager do corretor** (se existir)
- **Proprietário do imóvel** (se existir)

**Características:**

- **Prioridade:** Alta (`HIGH`)
- **Título Corretor:** `⚠️ Checklist com atraso crítico - [Nome do Imóvel]`
- **Título Manager:** `🚨 Checklist crítico - [Nome do Corretor]`
- **Título Proprietário:** `⚠️ Atualização necessária - [Nome do Imóvel]`
- **Mensagem:** Informa sobre o atraso crítico e pede ação imediata

**Exemplo de Notificação para Corretor:**

```json
{
  "type": "SYSTEM_ALERT",
  "priority": "HIGH",
  "title": "⚠️ Checklist com atraso crítico - Apartamento Centro",
  "message": "O checklist de venda do imóvel \"Apartamento Centro\" com o cliente \"João Silva\" está atrasado há 10 dias. Por favor, atualize o status dos itens pendentes.",
  "actionUrl": "/checklists/abc-123",
  "entityType": "checklist",
  "entityId": "abc-123"
}
```

**Exemplo de Notificação para Manager:**

```json
{
  "type": "SYSTEM_ALERT",
  "priority": "HIGH",
  "title": "🚨 Checklist crítico - Maria Santos",
  "message": "O checklist de venda do imóvel \"Apartamento Centro\" com o cliente \"João Silva\" está atrasado há 10 dias. O corretor responsável é Maria Santos.",
  "actionUrl": "/checklists/abc-123",
  "entityType": "checklist",
  "entityId": "abc-123",
  "metadata": {
    "realtorId": "user-123",
    "realtorName": "Maria Santos",
    "daysOverdue": 10
  }
}
```

### Cálculo de Atraso

O sistema calcula o atraso baseado em:

1. **Data de referência:** `startedAt` (se existir) ou `createdAt` do checklist
2. **Prazo estimado:** Soma dos `estimatedDays` de todos os itens anteriores + prazo do item atual
3. **Dias de atraso:** Diferença entre a data atual e a data esperada de conclusão

**Exemplo:**

- Checklist criado em: 01/01/2024
- Item 1: `estimatedDays: 3` → Esperado: 04/01/2024
- Item 2: `estimatedDays: 7` → Esperado: 11/01/2024
- Se hoje é 15/01/2024 e o Item 2 está pendente:
  - Atraso = 15 - 11 = **4 dias**
  - Notificação será enviada (4 >= 3)

### Integração no Frontend

#### 1. Escutar Notificações em Tempo Real

O sistema envia notificações via WebSocket. Configure o listener:

```typescript
import { useEffect } from 'react';
import io from 'socket.io-client';

const ChecklistNotifications = () => {
  useEffect(() => {
    const socket = io(`${API_URL}/notifications`, {
      auth: {
        token: userToken,
      },
    });

    socket.on('new_notification', (data: { notification: any }) => {
      const { notification } = data;
      
      // Verificar se é notificação de checklist
      if (notification.entityType === 'checklist') {
        handleChecklistNotification(notification);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChecklistNotification = (notification: any) => {
    // Mostrar toast/alert
    showNotificationToast({
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      actionUrl: notification.actionUrl,
    });

    // Atualizar badge de notificações não lidas
    updateUnreadBadge();
  };
};
```

#### 2. Exibir Notificações de Checklist

```typescript
interface ChecklistNotification {
  id: string;
  type: 'SYSTEM_ALERT';
  priority: 'MEDIUM' | 'HIGH';
  title: string;
  message: string;
  actionUrl: string;
  entityType: 'checklist';
  entityId: string;
  metadata: {
    checklistId: string;
    propertyId: string;
    clientId: string;
    daysOverdue: number;
    type: 'sale' | 'rental';
  };
  read: boolean;
  createdAt: Date;
}

const ChecklistNotificationCard = ({ notification }: { notification: ChecklistNotification }) => {
  const isCritical = notification.priority === 'HIGH';
  const daysOverdue = notification.metadata.daysOverdue;

  return (
    <div className={`notification-card ${isCritical ? 'critical' : 'reminder'}`}>
      <div className="notification-header">
        <h4>{notification.title}</h4>
        <span className={`badge ${isCritical ? 'badge-high' : 'badge-medium'}`}>
          {isCritical ? 'Crítico' : 'Lembrete'}
        </span>
      </div>
      
      <p className="notification-message">{notification.message}</p>
      
      <div className="notification-footer">
        <span className="days-overdue">
          {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'} de atraso
        </span>
        
        <button
          onClick={() => navigate(notification.actionUrl)}
          className="btn-primary"
        >
          Ver Checklist
        </button>
      </div>
    </div>
  );
};
```

#### 3. Filtrar Notificações de Checklist

```typescript
const useChecklistNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<ChecklistNotification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const allNotifications = await response.json();
    
    // Filtrar apenas notificações de checklist
    const checklistNotifications = allNotifications.filter(
      (n: any) => n.entityType === 'checklist'
    );

    setNotifications(checklistNotifications);
  };

  return { notifications };
};
```

#### 4. Marcar Notificação como Lida

```typescript
const markAsRead = async (notificationId: string) => {
  await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Atualizar estado local
  setNotifications(prev =>
    prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    )
  );
};
```

### Configurações do Sistema

As configurações de tempo podem ser ajustadas no backend:

```typescript
// Configurações padrão
REMINDER_DAYS = 3;      // Notificar corretor após 3 dias
ESCALATION_DAYS = 7;    // Notificar manager/proprietário após 7 dias
```

### Boas Práticas

1. **Exibir Badge de Notificações:** Mostre um contador de notificações não lidas no header
2. **Destaque Visual:** Use cores diferentes para notificações críticas (vermelho) vs lembretes (amarelo)
3. **Ação Rápida:** Permita navegar diretamente para o checklist ao clicar na notificação
4. **Agrupamento:** Agrupe notificações do mesmo checklist para evitar spam
5. **Histórico:** Mantenha histórico de notificações mesmo após marcar como lida

### Exemplo Completo de Componente

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChecklistNotificationsPanel = () => {
  const [notifications, setNotifications] = useState<ChecklistNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    setupWebSocket();
  }, []);

  const loadNotifications = async () => {
    const response = await fetch('/api/notifications?entityType=checklist', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setNotifications(data);
    setUnreadCount(data.filter((n: any) => !n.read).length);
  };

  const setupWebSocket = () => {
    const socket = io(`${API_URL}/notifications`);
    
    socket.on('new_notification', (data: any) => {
      if (data.notification.entityType === 'checklist') {
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });
  };

  const handleNotificationClick = (notification: ChecklistNotification) => {
    // Marcar como lida
    markAsRead(notification.id);
    
    // Navegar para o checklist
    navigate(notification.actionUrl);
  };

  return (
    <div className="notifications-panel">
      <div className="panel-header">
        <h3>Notificações de Checklist</h3>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>

      <div className="notifications-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${!notification.read ? 'unread' : ''} ${
              notification.priority === 'HIGH' ? 'critical' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="days-info">
                {notification.metadata.daysOverdue} dias de atraso
              </span>
            </div>
            {!notification.read && <div className="unread-indicator" />}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎨 Páginas e Componentes Frontend

### Páginas Disponíveis

1. **`/checklists`** - Página de listagem de todos os checklists
   - Busca textual
   - Filtros avançados (tipo, status, propriedade, cliente)
   - Grid responsivo com cards
   - Ações rápidas (ver detalhes, deletar)

2. **`/checklists/:id`** - Página de detalhes do checklist
   - Visualização completa do checklist
   - Barra de progresso com estatísticas
   - Lista de itens com atualização de status em tempo real
   - Informações da propriedade e cliente
   - Botões de ação (editar, excluir)

### Componentes Reutilizáveis

1. **`ChecklistSection`** - Componente para exibir checklists em outras páginas
   - Usado em `PropertyDetailsPage` e `ClientDetailsPage`
   - Exibe até N checklists (configurável via prop `limit`)
   - Filtra automaticamente por propriedade ou cliente
   - Botão para criar novo checklist (quando propertyId e clientId estão disponíveis)

2. **`ChecklistModal`** - Modal para criar/editar checklist
   - Formulário completo com validação
   - Seleção de propriedade e cliente
   - Adição de itens personalizados (opcional)
   - Suporte para criar e editar

### Integração nas Páginas Existentes

- **PropertyDetailsPage** (`/properties/:id`): Exibe seção de checklists da propriedade
- **ClientDetailsPage** (`/clients/:id`): Exibe seção de checklists do cliente

---

**Última atualização:** 2024-01-15

