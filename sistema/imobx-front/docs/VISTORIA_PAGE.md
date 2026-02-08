# 🔍 Documentação do Sistema de Vistorias

## Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Dados](#-estrutura-de-dados)
3. [Endpoints da API](#-endpoints-da-api)
4. [Páginas](#-páginas)
5. [Componentes](#-componentes)
6. [Status e Tipos](#-status-e-tipos)
7. [Filtros](#-filtros)
8. [Histórico](#-histórico)
9. [Fotos](#-fotos)
10. [Aprovação Financeira](#-aprovação-financeira)
11. [Permissões](#-permissões)
12. [Hooks](#-hooks)
13. [Fluxos Principais](#-fluxos-principais)
14. [Integrações](#-integrações)

---

## 🔍 Visão Geral

O sistema de Vistorias permite o gerenciamento completo de inspeções técnicas de propriedades, incluindo agendamento, execução, documentação com fotos e histórico completo das atividades realizadas.

### Funcionalidades Principais

- ✅ **Gerenciamento de Vistorias**: Criar, editar, visualizar e excluir vistorias
- ✅ **Agendamento**: Sistema de agendamento com datas e horários
- ✅ **Status de Vistoria**: Controle de status (Agendada, Em Andamento, Concluída, Cancelada)
- ✅ **Tipos de Vistoria**: Entrada, Saída, Manutenção e Venda
- ✅ **Vinculação com Propriedades**: Cada vistoria está vinculada a uma propriedade
- ✅ **Vistoriador**: Atribuição de responsável pela vistoria
- ✅ **Fotos**: Upload e gerenciamento de fotos relacionadas à vistoria
- ✅ **Histórico**: Registro completo de todas as alterações e atividades
- ✅ **Aprovação Financeira**: Sistema de aprovação financeira para vistorias com valor
- ✅ **Filtros Avançados**: Filtrar por status, tipo, propriedade, vistoriador e datas
- ✅ **Observações**: Campo para observações e anotações da vistoria
- ✅ **Checklist**: Suporte a checklist customizado (estrutura flexível)
- ✅ **Responsável**: Dados do responsável pela propriedade (nome, documento, telefone)
- ✅ **Permissões Granulares**: Controle fino de permissões por ação

### Conceitos Principais

- **Vistoria/Inspection**: Representa uma inspeção técnica de uma propriedade
- **Status**: Estado atual da vistoria (agendada, em andamento, concluída, cancelada)
- **Tipo**: Categoria da vistoria (entrada, saída, manutenção, venda)
- **Vistoriador/Inspector**: Usuário responsável por realizar a vistoria
- **Propriedade/Property**: Imóvel que está sendo vistoriado
- **Histórico**: Registro de todas as alterações e eventos relacionados à vistoria

---

## 📊 Estrutura de Dados

### Inspection (Vistoria)

```typescript
interface Inspection {
  id: string;
  title: string;                    // Título da vistoria (obrigatório)
  description?: string;             // Descrição detalhada
  type: string;                     // Tipo: 'entry' | 'exit' | 'maintenance' | 'sale'
  status: string;                   // Status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledDate: string;            // Data agendada (ISO 8601)
  startDate?: string;               // Data de início (preenchida automaticamente)
  completionDate?: string;          // Data de conclusão (preenchida automaticamente)
  observations?: string;            // Observações e anotações
  checklist?: Record<string, any>;  // Checklist customizado (estrutura flexível)
  photos?: string[];                // URLs das fotos anexadas
  value?: number;                   // Valor da vistoria (opcional)
  responsibleName?: string;         // Nome do responsável pela propriedade
  responsibleDocument?: string;     // CPF/CNPJ do responsável
  responsiblePhone?: string;        // Telefone do responsável
  companyId: string;                // ID da empresa (obtido automaticamente)
  propertyId: string;               // ID da propriedade (obrigatório)
  userId: string;                   // ID do usuário que criou (obtido automaticamente)
  inspectorId?: string;             // ID do vistoriador responsável
  hasFinancialApproval?: boolean;   // Indica se possui aprovação financeira
  approvalId?: string;              // ID da aprovação financeira (se houver)
  approvalStatus?: 'pending' | 'approved' | 'rejected'; // Status da aprovação
  createdAt: string;                // Data de criação
  updatedAt: string;                // Data da última atualização
  
  // Relacionamentos (populados pelo backend)
  property?: {
    id: string;
    title: string;
    address: string;
    code?: string;
    mainImage?: {
      url: string;
      alt?: string;
    };
    images?: Array<{
      url: string;
      alt?: string;
    }>;
  };
  
  user?: {
    id: string;
    name: string;
    email: string;
  };
  
  inspector?: {
    id: string;
    name: string;
    email: string;
  };
  
  history?: InspectionHistoryEntry[]; // Histórico de alterações
}
```

### InspectionHistoryEntry

```typescript
interface InspectionHistoryEntry {
  id: string;
  inspectionId: string;
  description: string;              // Descrição do evento/alteracao
  userId: string;                   // ID do usuário que registrou
  createdAt: string;                // Data/hora do registro
  
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
```

### CreateInspectionRequest

```typescript
interface CreateInspectionRequest {
  title: string;                    // Obrigatório
  description?: string;
  type: string;                     // Obrigatório: 'entry' | 'exit' | 'maintenance' | 'sale'
  scheduledDate: string;            // Obrigatório (ISO 8601)
  propertyId: string;               // Obrigatório
  inspectorId?: string;             // ID do vistoriador
  value?: number;                   // Valor da vistoria
  responsibleName?: string;
  responsibleDocument?: string;     // CPF/CNPJ
  responsiblePhone?: string;
  observations?: string;
  // companyId e userId são obtidos automaticamente pelo backend
}
```

### UpdateInspectionRequest

```typescript
interface UpdateInspectionRequest {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  scheduledDate?: string;
  startDate?: string;
  completionDate?: string;
  propertyId?: string;
  inspectorId?: string;
  value?: number;
  responsibleName?: string;
  responsibleDocument?: string;
  responsiblePhone?: string;
  observations?: string;
  checklist?: Record<string, any>;
}
```

### InspectionFilter

```typescript
interface InspectionFilter {
  title?: string;                   // Busca por título
  status?: string;                  // Filtrar por status
  type?: string;                    // Filtrar por tipo
  propertyId?: string;              // Filtrar por propriedade
  inspectorId?: string;             // Filtrar por vistoriador
  startDate?: string;               // Data inicial (ISO 8601)
  endDate?: string;                 // Data final (ISO 8601)
  page?: number;                    // Página para paginação
  limit?: number;                   // Itens por página
  onlyMyData?: boolean;             // Apenas vistorias criadas pelo usuário
}
```

### InspectionListResponse

```typescript
interface InspectionListResponse {
  inspections: Inspection[];
  total: number;                    // Total de registros
  page: number;                     // Página atual
  limit: number;                    // Limite por página
  totalPages: number;               // Total de páginas
}
```

---

## 🌐 Endpoints da API

Todos os endpoints estão sob o prefixo `/inspection` e requerem autenticação via JWT.

### Criar Vistoria

```http
POST /inspection
Content-Type: application/json

{
  "title": "Vistoria de Entrada - Apartamento 101",
  "description": "Vistoria inicial do apartamento",
  "type": "entry",
  "scheduledDate": "2024-03-15T10:00:00Z",
  "propertyId": "prop-123",
  "inspectorId": "user-456",
  "value": 500.00,
  "responsibleName": "João Silva",
  "responsibleDocument": "123.456.789-00",
  "responsiblePhone": "(11) 98765-4321",
  "observations": "Verificar estado dos móveis"
}
```

**Resposta:**
```json
{
  "id": "insp-789",
  "title": "Vistoria de Entrada - Apartamento 101",
  "status": "scheduled",
  "type": "entry",
  "scheduledDate": "2024-03-15T10:00:00Z",
  "propertyId": "prop-123",
  "userId": "current-user-id",
  "companyId": "company-123",
  "createdAt": "2024-03-10T08:00:00Z",
  "updatedAt": "2024-03-10T08:00:00Z",
  "property": { ... },
  "user": { ... }
}
```

### Listar Vistorias

```http
GET /inspection?page=1&limit=20&status=scheduled&type=entry&propertyId=prop-123&onlyMyData=false
```

**Parâmetros de Query:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `title`: Busca por título (busca parcial)
- `status`: Filtrar por status (`scheduled`, `in_progress`, `completed`, `cancelled`)
- `type`: Filtrar por tipo (`entry`, `exit`, `maintenance`, `sale`)
- `propertyId`: Filtrar por propriedade
- `inspectorId`: Filtrar por vistoriador
- `dataInicial`: Data inicial (formato ISO 8601)
- `dataFinal`: Data final (formato ISO 8601)
- `onlyMyData`: Boolean - apenas vistorias criadas pelo usuário atual

**Resposta:**
```json
{
  "inspections": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### Buscar Vistoria por ID

```http
GET /inspection/:id
```

**Resposta:** Objeto `Inspection` completo com relacionamentos populados.

### Atualizar Vistoria

```http
PUT /inspection/:id
Content-Type: application/json

{
  "status": "in_progress",
  "startDate": "2024-03-15T10:15:00Z",
  "observations": "Vistoria iniciada. Encontrado pequeno dano na parede."
}
```

**Resposta:** Objeto `Inspection` atualizado.

### Excluir Vistoria

```http
DELETE /inspection/:id
```

**Resposta:** Status 204 (No Content)

### Listar Vistorias de uma Propriedade

```http
GET /inspection/property/:propertyId
```

**Resposta:** Array de `Inspection[]`

### Listar Vistorias de um Vistoriador

```http
GET /inspection/vistoriador/:inspectorId
```

**Resposta:** Array de `Inspection[]`

### Upload de Foto

```http
POST /inspection/:id/upload-foto
Content-Type: multipart/form-data

file: [arquivo de imagem]
```

**Resposta:** Objeto `Inspection` atualizado com a nova foto na array `photos`.

### Remover Foto

```http
DELETE /inspection/:id/foto/:photoUrl
```

**Resposta:** Objeto `Inspection` atualizado sem a foto removida.

### Solicitar Aprovação Financeira

Há duas formas de solicitar aprovação financeira:

#### 1. Endpoint Direto da Vistoria (API de Vistoria)

```http
POST /inspection/:id/request-approval
```

**Nota:** A vistoria deve ter um `value` definido para solicitar aprovação.

**Resposta:**
```json
{
  "message": "Aprovação financeira solicitada com sucesso"
}
```

#### 2. API de Aprovações Financeiras (Recomendado)

```http
POST /inspection-approval
Content-Type: application/json

{
  "inspectionId": "insp-123",
  "amount": 500.00,
  "notes": "Aprovação financeira para vistoria: Título da Vistoria"
}
```

**Resposta:**
```json
{
  "id": "approval-456",
  "inspectionId": "insp-123",
  "status": "pending",
  "amount": 500.00,
  "notes": "Aprovação financeira para vistoria: Título da Vistoria",
  "createdAt": "2024-03-10T08:00:00Z",
  ...
}
```

### Listar Aprovações Financeiras

```http
GET /inspection-approval?status=pending&page=1&limit=20
```

**Parâmetros de Query:**
- `status`: Filtrar por status (`pending`, `approved`, `rejected`)
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)
- `page`: Número da página
- `limit`: Itens por página

### Buscar Aprovação por ID

```http
GET /inspection-approval/:id
```

**Resposta:** Objeto `InspectionApproval` completo.

### Aprovar ou Rejeitar Aprovação Financeira

```http
PUT /inspection-approval/:id/approve
Content-Type: application/json

// Para aprovar
{
  "status": "approved",
  "notes": "Aprovado conforme orçamento"
}

// Para rejeitar
{
  "status": "rejected",
  "rejectionReason": "Valor acima do orçamento",
  "notes": "Solicitar novo orçamento"
}
```

**Resposta:** Objeto `InspectionApproval` atualizado.

### Histórico de Vistoria

#### Adicionar Registro ao Histórico

```http
POST /inspection/:id/history
Content-Type: application/json

{
  "description": "Vistoria iniciada pelo vistoriador João Silva"
}
```

**Resposta:** Objeto `InspectionHistoryEntry`

#### Listar Histórico

```http
GET /inspection/:id/history
```

**Resposta:** Array de `InspectionHistoryEntry[]`

#### Remover Registro do Histórico

```http
DELETE /inspection/:id/history/:historyId
```

**Resposta:** Status 204 (No Content)

---

## 📄 Páginas

### VistoriaPage (`/inspection`)

Página principal de listagem de vistorias.

**Funcionalidades:**
- Listagem paginada de vistorias
- Busca por título
- Filtros avançados (status, tipo, propriedade, vistoriador, datas)
- Ações por vistoria (visualizar, editar, excluir, alterar status)
- Solicitar aprovação financeira (quando houver valor)
- Filtro "Apenas minhas vistorias"
- Cards visuais com informações principais
- Indicadores de status com cores

**Componentes Principais:**
- `InspectionListShimmer`: Loading state
- `FilterDrawer`: Drawer de filtros
- `StatusConfirmationModal`: Modal de confirmação para alteração de status
- `DeleteConfirmationModal`: Modal de confirmação para exclusão
- `DataScopeFilter`: Filtro de escopo de dados

**Ações Disponíveis:**
- Criar nova vistoria (requer `inspection:create`)
- Visualizar detalhes (requer `inspection:view`)
- Editar vistoria (requer `inspection:update`)
- Excluir vistoria (requer `inspection:delete`)
- Alterar status (requer `inspection:update`)
- Solicitar aprovação financeira (requer permissão de aprovação)

### VistoriaDetailPage (`/inspection/:id`)

Página de detalhes de uma vistoria específica.

**Funcionalidades:**
- Visualização completa dos dados da vistoria
- Informações da propriedade vinculada
- Informações do vistoriador
- Galeria de fotos (upload e remoção)
- Histórico de alterações
- Observações e checklist
- Dados do responsável
- Ações de edição e exclusão
- Alteração de status
- Solicitar aprovação financeira

**Componentes Principais:**
- `InspectionDetailShimmer`: Loading state
- `StatusConfirmationModal`: Modal de confirmação para alteração de status
- `DeleteConfirmationModal`: Modal de confirmação para exclusão
- Galeria de fotos com upload
- Timeline de histórico

### CreateInspectionPage (`/inspection/new`)

Página de criação de nova vistoria.

**Funcionalidades:**
- Formulário completo de criação
- Validação de campos obrigatórios
- Validação de data (não pode ser no passado)
- Seleção de propriedade (filtrado por permissões)
- Seleção de vistoriador (opcional)
- Campos opcionais (valor, responsável, observações)
- Redirecionamento após criação bem-sucedida

**Componentes Principais:**
- `InspectionForm`: Formulário reutilizável

**Validações:**
- Título: obrigatório
- Tipo: obrigatório
- Data agendada: obrigatória e não pode ser no passado
- Propriedade: obrigatória

**Permissões:**
- Requer `inspection:create`
- Requer `vincular_vistoria_propriedade` (implicitamente requer `property:view`)

### EditInspectionPage (`/inspection/:id/edit`)

Página de edição de vistoria existente.

**Funcionalidades:**
- Formulário pré-preenchido com dados atuais
- Validação de campos
- Alteração de propriedade (requer permissão específica)
- Salvamento de alterações
- Redirecionamento após edição bem-sucedida

**Componentes Principais:**
- `InspectionForm`: Formulário reutilizável

**Permissões:**
- Requer `inspection:update`
- Para alterar propriedade: requer `alterar_propriedade_vistoria`

---

## 🧩 Componentes

### InspectionForm (VistoriaForm)

Componente de formulário reutilizável para criar e editar vistorias.

**Props:**
```typescript
interface InspectionFormProps {
  inspection?: Inspection;          // Vistoria existente (para edição)
  onSubmit: (data: CreateInspectionRequest | UpdateInspectionRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  properties?: Property[];           // Lista de propriedades para seleção
  inspectors?: User[];               // Lista de vistoriadores para seleção
}
```

**Campos do Formulário:**
- **Título** (obrigatório): Texto
- **Descrição**: Textarea
- **Tipo** (obrigatório): Select (entry, exit, maintenance, sale)
- **Data Agendada** (obrigatório): Date picker
- **Propriedade** (obrigatório): Select com busca
- **Vistoriador**: Select com busca (opcional)
- **Valor**: Number format (opcional)
- **Nome do Responsável**: Texto (opcional)
- **Documento do Responsável**: Texto com máscara CPF/CNPJ (opcional)
- **Telefone do Responsável**: Texto com máscara (opcional)
- **Observações**: Textarea (opcional)

**Validações:**
- **Título**: Obrigatório, não pode estar vazio (trim aplicado)
- **Tipo**: Obrigatório, deve ser um dos tipos válidos (entry, exit, maintenance, sale)
- **Data Agendada**: Obrigatória, não pode ser no passado (apenas na criação - validação frontend com `min` no date picker)
- **Propriedade**: Obrigatória, deve ser uma propriedade válida
- **Valor**: Opcional, mas se preenchido:
  - Não pode ser negativo (`allowNegative={false}` no NumericFormat)
  - Deve ser maior que 0 para solicitar aprovação financeira
  - Formato: R$ com separador de milhar (.) e decimal (,), 2 casas decimais fixas
- **Documento do Responsável**: Opcional, mas se preenchido:
  - Aplica máscara automática: CPF se ≤ 14 caracteres, CNPJ se > 14 caracteres
  - Formato CPF: `000.000.000-00`
  - Formato CNPJ: `00.000.000/0000-00`
- **Telefone do Responsável**: Opcional, mas se preenchido:
  - Aplica máscara automática de telefone brasileiro: `(00) 00000-0000`
- **Observações**: Opcional, sem limite de caracteres
- **Descrição**: Opcional, sem limite de caracteres
- **Descrição do Histórico**: Máximo de 500 caracteres (validação no frontend)

### VistoriaCard

Componente de card para exibição de vistoria na listagem.

**Funcionalidades:**
- Exibição de informações principais
- Badge de status com cor
- Badge de tipo
- Data formatada
- Menu de ações
- Indicadores visuais

### VistoriaFilters / VistoriaFiltersDrawer

Componentes para filtros de vistorias.

**Filtros Disponíveis:**
- Título (busca textual)
- Status (select)
- Tipo (select)
- Propriedade (select com busca)
- Vistoriador (select com busca)
- Data Inicial (date picker)
- Data Final (date picker)
- Apenas minhas vistorias (checkbox)

---

## 📌 Status e Tipos

### Status de Vistoria

| Status | Valor | Label | Cor | Descrição |
|--------|-------|-------|-----|-----------|
| Agendada | `scheduled` | Agendada | Azul | Vistoria agendada, ainda não iniciada |
| Em Andamento | `in_progress` | Em Andamento | Laranja | Vistoria em execução |
| Concluída | `completed` | Concluída | Verde | Vistoria finalizada |
| Cancelada | `cancelled` | Cancelada | Vermelho | Vistoria cancelada |
| Aguardando Aprovação | `pending_approval` | Aguardando Aprovação | Amarelo | Aguardando aprovação financeira |
| Aprovada | `approved` | Aprovada | Verde | Aprovação financeira concedida |
| Rejeitada | `rejected` | Rejeitada | Vermelho | Aprovação financeira rejeitada |

**Transições de Status:**
- `scheduled` → `in_progress`: Quando a vistoria é iniciada (data de início preenchida automaticamente)
- `in_progress` → `completed`: Quando a vistoria é finalizada (data de conclusão preenchida automaticamente)
- Qualquer status → `cancelled`: Quando a vistoria é cancelada

### Tipos de Vistoria

| Tipo | Valor | Label | Cor | Descrição |
|------|-------|-------|-----|-----------|
| Entrada | `entry` | Entrada | Azul | Vistoria de entrada do imóvel (ex: locação) |
| Saída | `exit` | Saída | Vermelho | Vistoria de saída do imóvel (ex: desocupação) |
| Manutenção | `maintenance` | Manutenção | Laranja | Vistoria para verificação/manutenção |
| Venda | `sale` | Venda | Verde | Vistoria para processo de venda |

**Constantes TypeScript:**
```typescript
export const InspectionStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const InspectionType = {
  ENTRY: 'entry',
  EXIT: 'exit',
  MAINTENANCE: 'maintenance',
  SALE: 'sale',
} as const;
```

---

## 🔍 Filtros

### Filtros Disponíveis

1. **Título**: Busca textual parcial no título da vistoria
2. **Status**: Filtro por status específico
3. **Tipo**: Filtro por tipo de vistoria
4. **Propriedade**: Filtro por propriedade específica
5. **Vistoriador**: Filtro por vistoriador responsável
6. **Data Inicial**: Filtrar vistorias a partir de uma data
7. **Data Final**: Filtrar vistorias até uma data
8. **Apenas minhas vistorias**: Filtrar apenas vistorias criadas pelo usuário atual

### Implementação de Filtros

Os filtros são aplicados via query parameters na API:

```typescript
const params = new URLSearchParams();
if (filters.title) params.append('title', filters.title);
if (filters.status) params.append('status', filters.status);
if (filters.type) params.append('type', filters.type);
if (filters.propertyId) params.append('propertyId', filters.propertyId);
if (filters.inspectorId) params.append('inspectorId', filters.inspectorId);
if (filters.startDate) params.append('dataInicial', filters.startDate);
if (filters.endDate) params.append('dataFinal', filters.endDate);
if (filters.page) params.append('page', filters.page.toString());
if (filters.limit) params.append('limit', filters.limit.toString());
if (filters.onlyMyData) params.append('onlyMyData', 'true');
```

### Filtro de Escopo de Dados

O sistema também aplica filtros automáticos baseados nas permissões do usuário:
- Usuários sem permissão de visualização hierárquica veem apenas suas próprias vistorias
- Usuários com permissão adequada veem vistorias de toda a hierarquia

---

## 📜 Histórico

O histórico de vistoria registra todas as alterações e eventos importantes relacionados à vistoria.

### Estrutura do Histórico

Cada entrada do histórico contém:
- **ID**: Identificador único
- **Descrição**: Texto descritivo do evento
- **Usuário**: Quem registrou o evento
- **Data/Hora**: Quando o evento ocorreu

### Quando o Histórico é Atualizado

O histórico pode ser atualizado manualmente através da API ou automaticamente pelo backend em eventos específicos:
- Criação da vistoria
- Alteração de status
- Upload de fotos
- Alterações importantes

### API do Histórico

**Adicionar registro:**
```typescript
POST /inspection/:id/history
{ "description": "Vistoria iniciada" }
```

**Listar histórico:**
```typescript
GET /inspection/:id/history
```

**Remover registro:**
```typescript
DELETE /inspection/:id/history/:historyId
```

### Exibição do Histórico

Na página de detalhes, o histórico é exibido como uma timeline cronológica (do mais recente para o mais antigo), mostrando:
- Descrição do evento
- Nome do usuário que registrou
- Avatar do usuário (se disponível)
- Data/hora formatada

---

## 📸 Fotos

### Upload de Fotos

As fotos podem ser anexadas a uma vistoria através do endpoint de upload:

```http
POST /inspection/:id/upload-foto
Content-Type: multipart/form-data
```

**Limitações:**
- Formato: Imagens (JPEG, PNG, etc.)
- Tamanho máximo: Definido pelo backend

### Armazenamento

As fotos são armazenadas como URLs no array `photos` da vistoria:

```typescript
photos?: string[]; // URLs das fotos
```

### Remoção de Fotos

```http
DELETE /inspection/:id/foto/:photoUrl
```

**Nota:** O `photoUrl` deve ser codificado (encodeURIComponent) ao fazer a requisição.

### Galeria na Interface

Na página de detalhes, as fotos são exibidas em uma galeria com:
- Visualização em grid
- Upload de novas fotos
- Remoção de fotos existentes
- Visualização ampliada (modal ou lightbox)

---

## 💰 Aprovação Financeira

Vistorias com valor definido podem solicitar aprovação financeira através do sistema de aprovações financeiras.

### Solicitar Aprovação

Existem duas formas de solicitar aprovação:

1. **Via API de Vistoria** (endpoint direto): `POST /inspection/:id/request-approval`
2. **Via API de Aprovações** (recomendado): `POST /inspection-approval`

A interface utiliza a API de Aprovações (`/inspection-approval`), que é mais completa e permite gerenciar aprovações de forma centralizada.

**Pré-requisitos:**
- A vistoria deve ter um `value` definido e maior que zero
- A vistoria não deve ter uma aprovação já solicitada (`hasFinancialApproval !== true`)

### Estrutura de Aprovação

```typescript
interface InspectionApproval {
  id: string;
  inspectionId: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number | string;
  rejectionReason?: string | null;
  notes?: string | null;
  isAutomatic: boolean;
  createdAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  requesterName: string;
  approverName?: string | null;
  inspectionTitle: string;
  propertyCode?: string;
  approvalType?: string;
}
```

### Status de Aprovação na Vistoria

O status de aprovação é sincronizado na vistoria através dos campos:
- `hasFinancialApproval`: Boolean indicando se possui aprovação
- `approvalId`: ID da aprovação financeira (se houver)
- `approvalStatus`: Status da aprovação (`pending`, `approved`, `rejected`)

### Validações ao Solicitar Aprovação

- Valor deve ser maior que zero: `inspection.value > 0`
- Vistoria não pode ter aprovação já solicitada
- Mensagens de erro/warning são exibidas via toast se validações falharem

### Integração com Sistema Financeiro

A aprovação financeira está integrada com o sistema de aprovações financeiras:
- Ao solicitar aprovação via API, uma solicitação é criada no sistema financeiro
- O status é atualizado automaticamente quando a aprovação é processada
- Campos na vistoria são atualizados automaticamente (`hasFinancialApproval`, `approvalId`, `approvalStatus`)
- Notificações são enviadas quando há mudanças no status

### Exibição na Interface

- Badge indicando status de aprovação
- Botão para solicitar aprovação (quando aplicável e validado)
- Link para a página de aprovações financeiras (`/financial/inspection-approvals`)
- Indicadores visuais do status (cores diferentes para pending/approved/rejected)
- Mensagens informativas quando aprovação já existe

---

## 🔐 Permissões

### Permissões de Vistoria

| Permissão | Descrição | Ação |
|-----------|-----------|------|
| `inspection:view` | Visualizar vistorias | Visualizar lista e detalhes |
| `inspection:create` | Criar vistorias | Criar nova vistoria |
| `inspection:update` | Editar vistorias | Editar dados e alterar status |
| `inspection:delete` | Excluir vistorias | Excluir vistoria |

### Permissões Contextuais

| Permissão | Descrição | Dependência |
|-----------|-----------|-------------|
| `vincular_vistoria_propriedade` | Vincular vistoria a propriedade | Requer `property:view` |
| `alterar_propriedade_vistoria` | Alterar propriedade da vistoria | Requer `property:view` |

### Verificação de Permissões

As permissões são verificadas em vários pontos:

1. **Navegação**: Rotas protegidas verificam permissões antes de renderizar
2. **Botões/Ações**: `PermissionButton` oculta ações sem permissão
3. **API**: Backend valida permissões em cada requisição
4. **Filtros**: Dados são filtrados baseado nas permissões do usuário

### Módulo de Vistoria

Para acessar vistorias, o módulo `vistoria` deve estar ativo no plano da empresa:

```typescript
MODULE_TYPES.VISTORIA = 'vistoria'
```

---

## 🪝 Hooks

### useInspection

Hook para operações CRUD de vistorias.

```typescript
const {
  inspections,
  loading,
  error,
  createInspection,
  updateInspection,
  deleteInspection,
  uploadPhoto,
  removePhoto,
  setError,
} = useInspection();
```

**Métodos:**
- `createInspection(data)`: Cria nova vistoria
- `updateInspection(id, data)`: Atualiza vistoria existente
- `deleteInspection(id)`: Exclui vistoria
- `uploadPhoto(id, file)`: Faz upload de foto
- `removePhoto(id, photoUrl)`: Remove foto

### useInspectionList

Hook para listar vistorias com filtros e paginação.

```typescript
const { data, loading, error, refetch } = useInspectionList(filters);
```

**Retorno:**
- `data`: `InspectionListResponse` com paginação
- `loading`: Estado de carregamento
- `error`: Mensagem de erro (se houver)
- `refetch`: Função para recarregar os dados

**Características:**
- Recarrega automaticamente quando os filtros mudam
- Monitora mudanças de empresa e recarrega dados
- Suporta tratamento de erro de módulo não disponível

### useInspectionById

Hook para buscar uma vistoria específica por ID.

```typescript
const { inspection, loading, error, refetch } = useInspectionById(id);
```

**Retorno:**
- `inspection`: Objeto `Inspection` completo
- `loading`: Estado de carregamento
- `error`: Mensagem de erro (se houver)
- `refetch`: Função para recarregar os dados

### useInspectionByProperty

Hook para listar vistorias de uma propriedade específica.

```typescript
const { inspections, loading, error, refetch } = useInspectionByProperty(propertyId);
```

**Retorno:**
- `inspections`: Array de `Inspection[]`
- `loading`: Estado de carregamento
- `error`: Mensagem de erro (se houver)
- `refetch`: Função para recarregar os dados

### useInspectionApproval

Hook para gerenciar aprovações financeiras de vistorias.

```typescript
const {
  loading,
  error,
  requestApproval,
  listApprovals,
  getApprovalById,
  approve,
  reject,
  setError,
} = useInspectionApproval();
```

**Métodos:**
- `requestApproval(data)`: Solicita aprovação financeira
  - Parâmetro: `CreateInspectionApprovalRequest` (`inspectionId`, `amount`, `notes?`)
  - Retorna: `InspectionApproval`
- `listApprovals(filters?)`: Lista aprovações com filtros
  - Retorna: `InspectionApprovalListResponse`
- `getApprovalById(id)`: Busca aprovação por ID
  - Retorna: `InspectionApproval`
- `approve(id, data?)`: Aprova uma solicitação
  - Parâmetro opcional: `ApproveInspectionApprovalRequest` (`status: 'approved'`, `notes?`)
  - Retorna: `InspectionApproval`
- `reject(id, data)`: Rejeita uma solicitação
  - Parâmetro: `RejectInspectionApprovalRequest` (`status: 'rejected'`, `rejectionReason`, `notes?`)
  - Retorna: `InspectionApproval`

### Aliases (Compatibilidade)

Para compatibilidade com código existente, há aliases:

```typescript
export const useVistoria = useInspection;
export const useVistoriaList = useInspectionList;
export const useVistoriaById = useInspectionById;
export const useVistoriaByProperty = useInspectionByProperty;
```

---

## 🔄 Fluxos Principais

### Fluxo: Criar Nova Vistoria

1. Usuário navega para `/inspection/new`
2. Sistema verifica permissão `inspection:create`
3. Sistema carrega lista de propriedades disponíveis
4. Usuário preenche formulário:
   - Título (obrigatório)
   - Tipo (obrigatório)
   - Data agendada (obrigatório, não pode ser no passado)
   - Propriedade (obrigatório)
   - Campos opcionais (vistoriador, valor, responsável, etc.)
5. Sistema valida dados do formulário
6. Usuário submete formulário
7. Sistema envia requisição `POST /inspection`
8. Backend valida permissões e dados
9. Backend cria vistoria com status `scheduled`
10. Sistema redireciona para `/inspection/:id` (detalhes)
11. Notificação de sucesso é exibida

### Fluxo: Alterar Status da Vistoria

1. Usuário visualiza lista de vistorias ou detalhes
2. Usuário clica em ação de alterar status (ex: "Iniciar Vistoria")
3. Sistema exibe modal de confirmação (`StatusConfirmationModal`)
4. Usuário confirma a ação
5. Sistema prepara dados de atualização:
   - Se mudando para `in_progress`: adiciona `startDate`
   - Se mudando para `completed`: adiciona `completionDate`
6. Sistema envia requisição `PUT /inspection/:id`
7. Backend atualiza vistoria
8. Sistema recarrega dados
9. Notificação de sucesso é exibida

### Fluxo: Upload de Foto

1. Usuário visualiza página de detalhes da vistoria
2. Usuário clica em "Adicionar Foto" ou arrasta imagem
3. Sistema abre seletor de arquivo ou captura drag & drop
4. Usuário seleciona arquivo de imagem
5. Sistema valida formato e tamanho (se necessário)
6. Sistema cria FormData com o arquivo
7. Sistema envia requisição `POST /inspection/:id/upload-foto`
8. Backend processa upload e retorna vistoria atualizada
9. Sistema atualiza galeria de fotos
10. Notificação de sucesso é exibida

### Fluxo: Solicitar Aprovação Financeira

1. Usuário visualiza vistoria que possui valor definido
2. Sistema verifica validações:
   - Vistoria deve ter `value > 0`
   - Vistoria não deve possuir aprovação já solicitada (`hasFinancialApproval !== true`)
3. Usuário clica em "Solicitar Aprovação Financeira"
4. Sistema envia requisição `POST /inspection-approval` com:
   - `inspectionId`: ID da vistoria
   - `amount`: Valor da vistoria
   - `notes`: Nota automática com título da vistoria
5. Backend valida dados e cria solicitação de aprovação
6. Backend atualiza vistoria com campos `hasFinancialApproval`, `approvalId`, `approvalStatus`
7. Sistema recarrega dados da vistoria para obter campos atualizados
8. Notificação de sucesso é exibida
9. Sistema pode redirecionar para página de aprovações financeiras

**Validações Aplicadas:**
- Valor deve ser maior que zero (`inspection.value > 0`)
- Vistoria não pode ter aprovação já solicitada
- Erros são exibidos via toast (warning/info/error)

### Fluxo: Filtrar Vistorias

1. Usuário visualiza lista de vistorias
2. Usuário clica em "Filtros" para abrir drawer de filtros
3. Usuário preenche filtros desejados (status, tipo, propriedade, datas, etc.)
4. Usuário aplica filtros
5. Sistema atualiza estado de filtros
6. Hook `useInspectionList` detecta mudança nos filtros
7. Sistema envia requisição `GET /inspection?[filters]`
8. Backend aplica filtros e retorna resultados paginados
9. Sistema atualiza lista de vistorias
10. Paginação é resetada para página 1 (se necessário)

---

## 🔗 Integrações

### Sistema de Propriedades

Vistorias estão fortemente integradas com o sistema de propriedades:
- Cada vistoria deve estar vinculada a uma propriedade
- Ao visualizar uma vistoria, informações da propriedade são exibidas
- Filtros podem ser aplicados por propriedade
- Lista de propriedades disponíveis é filtrada por permissões do usuário

### Sistema de Usuários

Integração com usuários para:
- Vistoriador (inspector): Usuário responsável pela vistoria
- Criador da vistoria: Usuário que criou o registro
- Histórico: Registro de qual usuário realizou cada ação

### Sistema Financeiro

Integração com sistema de aprovações financeiras:
- Vistorias com valor podem solicitar aprovação
- Status de aprovação é sincronizado
- Notificações são enviadas em mudanças de status

### Calendário

Vistorias podem ser exibidas no calendário:
- Tipo de evento: `inspection`
- Exibição da data agendada
- Link para detalhes da vistoria

### Notificações

Notificações relacionadas a vistorias:
- `INSPECTION_SCHEDULED`: Vistoria agendada
- `INSPECTION_OVERDUE`: Vistoria atrasada
- `INSPECTION_APPROVAL_REQUESTED`: Aprovação solicitada
- `INSPECTION_APPROVED`: Aprovação concedida
- `INSPECTION_REJECTED`: Aprovação rejeitada

### Dashboard

Estatísticas de vistorias no dashboard:
- Contador de vistorias pendentes
- Card de vistorias com link para página
- Requer permissão `inspection:view`

### Documentos

Laudos de vistoria podem ser gerados como documentos:
- Tipo de documento: `INSPECTION_REPORT`
- Vinculação com vistoria

---

## 📝 Notas Técnicas

### Compatibilidade com Código Legado

O sistema mantém compatibilidade com código que usa a nomenclatura em português:

```typescript
// Aliases mantidos para compatibilidade
export type Vistoria = Inspection;
export type VistoriaFilter = InspectionFilter;
export const vistoriaApi = inspectionApi;
export const useVistoria = useInspection;
```

### Monitoramento de Mudanças de Empresa

Os hooks monitoram mudanças de empresa e recarregam dados automaticamente usando `useAutoReloadOnCompanyChange`.

### Tratamento de Erros

- Erros de módulo não disponível são tratados especificamente
- Mensagens de erro do backend são exibidas ao usuário
- Estados de loading são gerenciados durante operações assíncronas

### Validações

**Frontend:**
- Campos obrigatórios validados antes de enviar (título, tipo, data, propriedade)
- Data agendada não pode ser no passado (apenas na criação)
- Valor não pode ser negativo (via `allowNegative={false}`)
- Valor deve ser > 0 para solicitar aprovação financeira
- Descrição do histórico limitada a 500 caracteres
- Máscaras aplicadas em documento (CPF/CNPJ) e telefone
- Trim aplicado em campos de texto antes do envio
- Validação que vistoria não possui aprovação já solicitada antes de solicitar nova

**Backend:**
- Validações adicionais de segurança e integridade
- Validação de permissões do usuário
- Validação de propriedade existe e pertence à empresa
- Validação de vistoriador existe (se fornecido)
- Validação de formato de datas
- Validação de módulo ativo no plano da empresa

### Performance

- Paginação implementada para listas grandes
- Lazy loading de componentes pesados
- Loading states (shimmer) para melhor UX
- Filtros aplicados no backend para reduzir dados transferidos

---

## 🚀 Melhorias Futuras

- [ ] Checklist estruturado com templates
- [ ] Assinatura digital em laudos de vistoria
- [ ] Relatórios PDF de vistoria
- [ ] Integração com câmera mobile para captura direta
- [ ] Localização GPS para fotos
- [ ] Templates de vistoria por tipo de propriedade
- [ ] Compartilhamento de vistoria com clientes
- [ ] Exportação de dados (CSV, Excel)
- [ ] Integração com agenda/calendário externo
- [ ] Notificações push para mobile

---

## 📚 Referências

- **API Base**: `/inspection`
- **Módulo**: `vistoria`
- **Tipo de Evento no Calendário**: `inspection`
- **Tipo de Documento**: `INSPECTION_REPORT`
- **Permissões Principais**: `inspection:view`, `inspection:create`, `inspection:update`, `inspection:delete`
- **Páginas Relacionadas**: Dashboard, Calendário, Propriedades, Financeiro

