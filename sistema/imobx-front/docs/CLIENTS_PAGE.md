# 👥 Documentação de Clientes

## Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Dados](#-estrutura-de-dados)
3. [Endpoints da API](#-endpoints-da-api) (23 endpoints)
4. [Páginas](#-páginas)
5. [Componentes](#-componentes)
6. [Validações](#-validações)
7. [Funcionalidades](#-funcionalidades)
8. [Hooks Relacionados](#-hooks-relacionados)
9. [Próximas Melhorias](#-próximas-melhorias)

---

## 📋 Visão Geral

O sistema de Clientes permite gerenciar todo o ciclo de vida dos clientes imobiliários, desde a captação até o fechamento de negócios, incluindo informações pessoais, profissionais, financeiras, preferências imobiliárias e relacionamento com propriedades.

### Funcionalidades Principais

- ✅ **CRUD Completo**: Criar, listar, visualizar, editar e excluir clientes
- ✅ **Filtros Avançados**: Busca por múltiplos critérios (nome, email, telefone, CPF, localização, tipo, status, etc.)
- ✅ **Importação/Exportação**: Importar em massa via Excel e exportar dados
- ✅ **Transferência de Clientes**: Transferir responsabilidade entre corretores
- ✅ **Gestão de Cônjuge**: Associar e gerenciar informações do cônjuge
- ✅ **Interações**: Registrar histórico de interações com clientes
- ✅ **Matches com Propriedades**: Sistema de compatibilidade automática
- ✅ **Classificação de Leads (IA)**: Classificação automática de leads (se módulo habilitado)
- ✅ **Estatísticas**: Métricas e estatísticas dos clientes
- ✅ **Vinculação com Propriedades**: Associar clientes a propriedades de interesse
- ✅ **Dados MCMV**: Suporte para clientes do programa Minha Casa Minha Vida
- ✅ **Informações Financeiras Completas**: Renda, score de crédito, dados bancários
- ✅ **Preferências Imobiliárias**: Tipo, localização, características desejadas

---

## 📊 Estrutura de Dados

### Client (Cliente)

```typescript
interface Client {
  id: string;
  name: string;                    // Nome completo (obrigatório)
  email: string;                   // Email (obrigatório)
  cpf: string;                     // CPF (obrigatório)
  phone: string;                   // Telefone principal (obrigatório)
  secondaryPhone?: string;         // Telefone secundário
  whatsapp?: string;               // WhatsApp
  
  // Dados pessoais básicos
  birthDate?: string;              // Data de nascimento (ISO)
  anniversaryDate?: string;        // Data de aniversário (MM-DD)
  rg?: string;                     // RG
  
  // Endereço
  zipCode: string;                 // CEP (obrigatório)
  address: string;                 // Endereço completo (obrigatório)
  city: string;                    // Cidade (obrigatório)
  state: string;                   // Estado/UF (obrigatório)
  neighborhood: string;            // Bairro (obrigatório)
  
  // Tipo e Status
  type: ClientType;                // 'buyer' | 'seller' | 'renter' | 'lessor' | 'investor' | 'general'
  status: ClientStatus;            // 'active' | 'inactive' | 'contacted' | 'interested' | 'closed'
  
  // Situação Pessoal
  maritalStatus?: MaritalStatus;   // 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'common_law'
  hasDependents?: boolean;
  numberOfDependents?: number;
  dependentsNotes?: string;
  
  // Informações Profissionais
  employmentStatus?: EmploymentStatus; // 'employed' | 'unemployed' | 'retired' | 'self_employed' | 'student' | 'freelancer'
  companyName?: string;
  jobPosition?: string;
  jobStartDate?: string;
  jobEndDate?: string;
  isCurrentlyWorking?: boolean;
  companyTimeMonths?: number;
  contractType?: string;
  isRetired?: boolean;
  
  // Informações Financeiras
  monthlyIncome?: number;          // Renda mensal
  grossSalary?: number;            // Salário bruto
  netSalary?: number;              // Salário líquido
  thirteenthSalary?: number;       // 13º salário
  vacationPay?: number;            // Férias
  otherIncomeSources?: string;     // Descrição de outras fontes
  otherIncomeAmount?: number;      // Valor de outras rendas
  familyIncome?: number;           // Renda familiar
  creditScore?: number;            // Score de crédito (0-1000)
  lastCreditCheck?: string;        // Data última consulta
  
  // Dados Bancários (Não Sensíveis)
  bankName?: string;
  bankAgency?: string;
  accountType?: string;
  
  // Patrimônio e Bens
  hasProperty?: boolean;
  hasVehicle?: boolean;
  
  // Referências
  referenceName?: string;
  referencePhone?: string;
  referenceRelationship?: string;
  professionalReferenceName?: string;
  professionalReferencePhone?: string;
  professionalReferencePosition?: string;
  
  // Preferências Imobiliárias
  incomeRange?: string;
  loanRange?: string;
  priceRange?: string;
  preferences?: string;
  notes?: string;
  preferredContactMethod?: string;
  preferredPropertyType?: string;
  preferredCity?: string;
  preferredNeighborhood?: string;
  minArea?: number;
  maxArea?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minValue?: number;
  maxValue?: number;
  desiredFeatures?: any;           // Características desejadas (estrutura complexa)
  
  // Campos de Controle
  isActive: boolean;
  companyId: string;
  responsibleUserId: string;       // ID do corretor responsável
  responsibleUser?: {
    id: string;
    name: string;
  };
  capturedById?: string;           // ID do captador (obrigatório na criação)
  capturedBy?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  
  // Cônjuge relacionado
  spouse?: Spouse;
  
  // Campos MCMV
  leadSource?: ClientSource;       // 'whatsapp' | 'social_media' | 'phone' | 'olx' | 'zap_imoveis' | 'viva_real' | 'dream_keys' | 'other'
  mcmvInterested?: boolean;
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
  mcmvCadunicoNumber?: string | null;
  mcmvPreRegistrationDate?: string | null;
  
  createdAt: string;
  updatedAt: string;
}
```

### CreateClientDto

```typescript
interface CreateClientDto {
  // Campos obrigatórios (todos os campos do Client podem ser incluídos)
  name: string;
  email: string;
  cpf: string;
  phone: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  type: ClientType;
  capturedById: string;            // ID do captador (obrigatório)
  
  // Campos opcionais (todos os demais campos do Client)
  // ... (mesmos campos opcionais do Client)
}
```

### UpdateClientDto

```typescript
interface UpdateClientDto extends Partial<CreateClientDto> {
  id?: string;
}
```

### ClientSearchFilters

```typescript
interface ClientSearchFilters {
  // Texto e campos básicos
  name?: string;                   // Busca ILIKE no nome
  email?: string;                  // Busca ILIKE no email
  phone?: string;                  // Busca ILIKE nos telefones
  search?: string;                 // Busca geral: nome, email, cpf, telefones
  document?: string;               // CPF (com ou sem máscara)

  // Localização
  city?: string;                   // Busca ILIKE
  neighborhood?: string;           // Busca ILIKE
  state?: string;

  // Classificações
  type?: ClientType;
  status?: ClientStatus;

  // Escopo e estado
  responsibleUserId?: string;
  isActive?: boolean;
  onlyMyData?: boolean;            // Apenas meus clientes

  // Período de criação
  createdFrom?: string;            // ISO string
  createdTo?: string;              // ISO string (backend inclui 23:59:59)

  // Paginação
  limit?: number;                  // Padrão: 50, Máx: 100
  page?: number;                   // Padrão: 1

  // Ordenação
  sortBy?: 'name' | 'createdAt' | 'status' | 'type' | 'city';
  sortOrder?: 'ASC' | 'DESC';
}
```

### ClientStatistics

```typescript
interface ClientStatistics {
  active_clients: number;          // Clientes ativos
  total_clients: number;           // Total de clientes
  buyers: number;                  // Compradores
  sellers: number;                 // Vendedores
  renters: number;                 // Locatários
  lessors: number;                 // Locadores
  investors: number;               // Investidores
  general_clients: number;         // Gerais
}
```

### ClientInteraction (Interação com Cliente)

```typescript
interface ClientInteraction {
  id: string;
  clientId: string;
  companyId: string;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  title?: string | null;
  notes: string;                   // Obrigatório
  interactionAt?: string | null;   // Data/hora da interação (ISO)
  attachments: Attachment[];       // Anexos
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔌 Endpoints da API

### Base URL
```
/clients
```

### Índice de Endpoints (23 rotas)

**CRUD Básico (6 rotas):**
1. GET /clients - Listar clientes
2. POST /clients - Criar cliente
3. GET /clients/:id - Buscar cliente por ID
4. PUT /clients/:id - Atualizar cliente
5. DELETE /clients/:id - Excluir cliente (soft delete)
6. DELETE /clients/:id/permanent - Excluir cliente permanentemente

**Estatísticas (1 rota):**
7. GET /clients/statistics - Obter estatísticas de clientes

**Transferência (2 rotas):**
8. PUT /clients/:clientId/transfer - Transferir cliente
9. GET /clients/users-for-transfer - Listar usuários para transferência

**Propriedades (4 rotas):**
10. POST /clients/:clientId/properties/:propertyId - Associar cliente a propriedade
11. DELETE /clients/:clientId/properties/:propertyId - Desassociar cliente de propriedade
12. GET /clients/:clientId/properties - Listar propriedades de um cliente
13. GET /clients/properties/:propertyId - Listar clientes de uma propriedade

**Interações (4 rotas):**
14. GET /clients/:clientId/interactions - Listar interações de um cliente
15. POST /clients/:clientId/interactions - Criar interação
16. PUT /clients/:clientId/interactions/:interactionId - Atualizar interação
17. DELETE /clients/:clientId/interactions/:interactionId - Excluir interação

**Importação/Exportação (6 rotas):**
18. POST /clients/bulk-import - Importar clientes em massa (Excel)
19. GET /clients/import-jobs - Listar jobs de importação
20. GET /clients/import-jobs/:jobId - Obter status de job de importação
21. GET /clients/import-jobs/:jobId/errors - Baixar planilha de erros
22. GET /clients/export - Exportar clientes
23. GET /clients/export-bulk - Exportar clientes em lotes

---

### CRUD Básico

#### 1. Listar Clientes

**Endpoint:**
```
GET /clients
```

**Query Parameters:**
```typescript
ClientSearchFilters  // Todos os filtros opcionais
```

**Resposta:**
```typescript
{
  data: Client[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Exemplo:**
```typescript
GET /clients?search=João&type=buyer&status=active&page=1&limit=50&sortBy=name&sortOrder=ASC
```

#### 2. Criar Cliente

**Endpoint:**
```
POST /clients
```

**Body:**
```typescript
CreateClientDto
```

**Resposta:**
```typescript
Client
```

**Exemplo:**
```typescript
POST /clients
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "phone": "(11) 98765-4321",
  "zipCode": "01310-100",
  "address": "Av. Paulista, 1000",
  "city": "São Paulo",
  "state": "SP",
  "neighborhood": "Bela Vista",
  "type": "buyer",
  "status": "active",
  "capturedById": "user-123"
}
```

#### 3. Buscar Cliente por ID

**Endpoint:**
```
GET /clients/:id
```

**Resposta:**
```typescript
Client
```

#### 4. Atualizar Cliente

**Endpoint:**
```
PUT /clients/:id
```

**Body:**
```typescript
UpdateClientDto
```

**Resposta:**
```typescript
Client
```

#### 5. Excluir Cliente (Soft Delete)

**Endpoint:**
```
DELETE /clients/:id
```

**Resposta:**
```
204 No Content
```

#### 6. Excluir Cliente Permanentemente

**Endpoint:**
```
DELETE /clients/:id/permanent
```

**Resposta:**
```
204 No Content
```

### Estatísticas

#### 7. Obter Estatísticas de Clientes

**Endpoint:**
```
GET /clients/statistics
```

**Query Parameters:**
```typescript
// Aceita os mesmos filtros de ClientSearchFilters (exceto paginação)
```

**Resposta:**
```typescript
ClientStatistics
```

**Exemplo:**
```typescript
GET /clients/statistics?onlyMyData=true
```

### Transferência

#### 8. Transferir Cliente

**Endpoint:**
```
PUT /clients/:clientId/transfer
```

**Body:**
```typescript
{
  newResponsibleUserId: string;
}
```

**Resposta:**
```typescript
Client
```

**Exemplo:**
```typescript
PUT /clients/client-123/transfer
{
  "newResponsibleUserId": "user-456"
}
```

#### 9. Listar Usuários para Transferência

**Endpoint:**
```
GET /clients/users-for-transfer
```

**Resposta:**
```typescript
User[]  // Lista de usuários da empresa que podem receber clientes
```

### Propriedades

#### 10. Associar Cliente a Propriedade

**Endpoint:**
```
POST /clients/:clientId/properties/:propertyId
```

**Body:**
```typescript
{
  interestType?: string;  // 'interested' | 'viewed' | 'offered' | etc.
  notes?: string;
}
```

**Resposta:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### 11. Desassociar Cliente de Propriedade

**Endpoint:**
```
DELETE /clients/:clientId/properties/:propertyId
```

**Resposta:**
```
204 No Content
```

#### 12. Listar Propriedades de um Cliente

**Endpoint:**
```
GET /clients/:clientId/properties
```

**Resposta:**
```typescript
Property[]  // Propriedades associadas ao cliente
```

#### 13. Listar Clientes de uma Propriedade

**Endpoint:**
```
GET /clients/properties/:propertyId
```

**Resposta:**
```typescript
Client[]  // Clientes interessados na propriedade
```

### Interações

#### 14. Listar Interações de um Cliente

**Endpoint:**
```
GET /clients/:clientId/interactions
```

**Resposta:**
```typescript
ClientInteraction[]
```

#### 15. Criar Interação

**Endpoint:**
```
POST /clients/:clientId/interactions
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```typescript
{
  title?: string;
  notes: string;              // Obrigatório
  interactionAt?: string;     // ISO string
  attachments?: File[];       // Arquivos opcionais
}
```

**Resposta:**
```typescript
ClientInteraction
```

#### 16. Atualizar Interação

**Endpoint:**
```
PUT /clients/:clientId/interactions/:interactionId
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```typescript
{
  title?: string;
  notes?: string;
  interactionAt?: string;
  attachments?: File[];
}
```

**Resposta:**
```typescript
ClientInteraction
```

#### 17. Excluir Interação

**Endpoint:**
```
DELETE /clients/:clientId/interactions/:interactionId
```

**Resposta:**
```
204 No Content
```

### Importação/Exportação

#### 18. Importar Clientes em Massa (Excel)

**Endpoint:**
```
POST /clients/bulk-import
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```
file: File  // Arquivo Excel (.xlsx, .xls)
```

**Resposta:**
```typescript
{
  jobId: string;              // ID do job assíncrono
  message: string;
  totalRows?: number;
}
```

**Processo Assíncrono:**
- A importação é processada de forma assíncrona
- Use os endpoints abaixo para acompanhar o progresso

#### 19. Listar Jobs de Importação

**Endpoint:**
```
GET /clients/import-jobs
```

**Resposta:**
```typescript
ImportJob[]  // Lista de jobs de importação
```

#### 20. Obter Status de Job de Importação

**Endpoint:**
```
GET /clients/import-jobs/:jobId
```

**Resposta:**
```typescript
{
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;          // 0-100
  totalRows?: number;
  processedRows?: number;
  successCount?: number;
  errorCount?: number;
  errors?: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

#### 21. Baixar Planilha de Erros

**Endpoint:**
```
GET /clients/import-jobs/:jobId/errors
```

**Response Type:**
```
Blob (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
```

#### 22. Exportar Clientes

**Endpoint:**
```
GET /clients/export
```

**Query Parameters:**
```typescript
ClientSearchFilters  // Filtros opcionais
```

**Response Type:**
```
Blob (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
```

#### 23. Exportar Clientes em Lotes

**Endpoint:**
```
GET /clients/export-bulk
```

**Query Parameters:**
```typescript
{
  page?: number;      // Padrão: 1
  pageSize?: number;  // Padrão: 1000
}
```

**Resposta:**
```typescript
{
  data: Client[];
  hasMore: boolean;
}
```

---

## 📄 Páginas

### ClientsPage (Listagem)

**Localização:** `src/pages/ClientsPage.tsx`

**Rota:** `/clients`

**Funcionalidades:**
- Listar clientes com paginação
- Busca em tempo real
- Filtros avançados (drawer lateral)
- Estatísticas em cards
- Ações por cliente (visualizar, editar, transferir, excluir)
- Importação/exportação Excel
- Indicadores de matches e classificação de leads
- Responsivo (versão mobile otimizada)

**Componentes Utilizados:**
- `ClientFiltersDrawer`: Drawer de filtros
- `TransferClientModal`: Modal de transferência
- `AsyncExcelImportModal`: Modal de importação assíncrona
- `MatchesBadge`: Badge de matches
- `LeadClassificationBadge`: Badge de classificação (IA)
- `ConfirmDeleteModal`: Modal de confirmação de exclusão

**Permissões:**
- `client:read`: Visualizar lista
- `client:create`: Criar cliente
- `client:update`: Editar cliente
- `client:delete`: Excluir cliente
- `client:transfer`: Transferir cliente

### ClientFormPage (Criação/Edição)

**Localização:** `src/pages/ClientFormPage.tsx`

**Rotas:**
- Criar: `/clients/new`
- Editar: `/clients/:id/edit`

**Seções do Formulário:**
1. **Informações Básicas**
   - Nome*, Email*, CPF*, Telefones
   - Data de nascimento, RG
   - Tipo*, Status*

2. **Endereço**
   - CEP* (com busca automática), Endereço*, Cidade*, Estado*, Bairro*

3. **Situação Pessoal**
   - Estado civil, Dependentes, Notas

4. **Informações Profissionais**
   - Situação profissional, Empresa, Cargo, Tipo de contrato
   - Datas de início/término, Aposentado

5. **Informações Financeiras**
   - Renda mensal, Renda familiar
   - Salários (bruto/líquido), 13º salário, Férias
   - Score de crédito (0-1000), Última consulta
   - Outras fontes de renda

6. **Dados Bancários**
   - Banco, Agência, Tipo de conta

7. **Patrimônio**
   - Possui imóvel? Possui veículo?

8. **Referências**
   - Referência pessoal e profissional

9. **Preferências Imobiliárias**
   - Faixa de preço, Tipo preferido, Cidade/Região
   - Área (mín/máx), Quartos, Banheiros
   - Características desejadas (componente especializado)
   - Notas e observações

10. **Cônjuge**
    - Gestão via componente `SpouseForm`

11. **Dados MCMV**
    - Interessado, Elegível, Faixa de renda, CADÚnico, Data pré-cadastro

**Validações:**
- Campos obrigatórios marcados com *
- Validação de CPF, Email, Telefone, CEP
- Score de crédito entre 0-1000
- Se houver renda, exige situação profissional ou aposentado

### ClientDetailsPage (Detalhes)

**Localização:** `src/pages/ClientDetailsPage.tsx`

**Rota:** `/clients/:id`

**Seções:**
1. **Cabeçalho**: Nome, badges (tipo, status, origem do lead), ações (editar)
2. **Informações Pessoais**: Dados básicos, contatos, endereço
3. **Situação Pessoal**: Estado civil, dependentes
4. **Informações Profissionais**: Emprego, empresa, cargo
5. **Informações Financeiras**: Renda, score, dados bancários
6. **Patrimônio e Referências**
7. **Preferências Imobiliárias**: Características desejadas
8. **Cônjuge**: Card com informações do cônjuge (se existir)
9. **Matches**: Lista de propriedades compatíveis
10. **Interações**: Histórico de interações (componente `ClientInteractionsPanel`)
11. **Checklists**: Checklists associadas (componente `ChecklistSection`)
12. **IA (se módulo habilitado)**:
    - `LeadClassificationCard`: Classificação do lead
    - `ConversationSummaryCard`: Resumo de conversas
    - `FollowupButton`: Sugestões de follow-up
    - `ProposalGeneratorButton`: Gerar proposta

---

## 🧩 Componentes

### ClientFiltersDrawer

**Localização:** `src/components/clients/ClientFiltersDrawer.tsx`

**Props:**
```typescript
interface ClientFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
  loading?: boolean;
}
```

**Funcionalidades:**
- Filtros por: nome, email, telefone, CPF, cidade, bairro, estado
- Filtros por tipo, status, responsável, período de criação
- Filtro de escopo (todos os dados / apenas meus dados)
- Ordenação (campo e direção)
- Limpar filtros

### TransferClientModal

**Localização:** `src/components/modals/TransferClientModal.tsx`

**Props:**
```typescript
interface TransferClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (newResponsibleUserId: string) => void;
  clientName: string;
  currentResponsible?: string;
  clientId: string;
}
```

**Funcionalidades:**
- Lista usuários da empresa que podem receber clientes
- Exibe responsável atual
- Seleção de novo responsável
- Confirmação antes de transferir

### AsyncExcelImportModal

**Localização:** `src/components/modals/AsyncExcelImportModal.tsx`

**Funcionalidades:**
- Upload de arquivo Excel
- Processamento assíncrono
- Acompanhamento de progresso
- Download de planilha de erros
- Histórico de importações

### SpouseForm

**Localização:** `src/components/modals/SpouseForm.tsx`

**Funcionalidades:**
- Criar/editar cônjuge
- Campos: nome, CPF, telefone, email, data de nascimento, RG
- Validações específicas
- Vinculação automática ao cliente

### ClientInteractionsPanel

**Localização:** `src/components/clients/ClientInteractionsPanel.tsx`

**Funcionalidades:**
- Listar interações do cliente
- Criar nova interação (com anexos)
- Editar interações
- Excluir interações
- Visualizar anexos

---

## ✅ Validações

### Validações de Cliente

#### Campos Obrigatórios
- ✅ `name`: Nome completo (mínimo 2 caracteres, máximo 255)
- ✅ `email`: Email válido (formato válido)
- ✅ `cpf`: CPF válido (11 dígitos, validação de dígitos verificadores)
- ✅ `phone`: Telefone principal (formato válido)
- ✅ `zipCode`: CEP válido (8 dígitos)
- ✅ `address`: Endereço (máximo 500 caracteres)
- ✅ `city`: Cidade (máximo 100 caracteres)
- ✅ `state`: Estado/UF (exatamente 2 caracteres)
- ✅ `neighborhood`: Bairro (máximo 100 caracteres)
- ✅ `type`: Tipo de cliente (deve ser um dos valores válidos)
- ✅ `status`: Status do cliente (deve ser um dos valores válidos)
- ✅ `capturedById`: ID do captador (obrigatório na criação)

#### Regras de Negócio

1. **Email:**
   - Deve ter formato válido
   - Máximo 255 caracteres
   - Opcional, mas se fornecido deve ser válido

2. **CPF:**
   - Deve ter 11 dígitos (com ou sem formatação)
   - Deve passar na validação de dígitos verificadores
   - Não pode estar duplicado na empresa

3. **Telefone:**
   - Telefone principal é obrigatório
   - Telefones secundários são opcionais
   - Formato aceito: (XX) XXXXX-XXXX ou variações

4. **CEP:**
   - Deve ter 8 dígitos
   - Formato: XXXXX-XXX ou XXXXXXXX
   - Busca automática de endereço ao preencher

5. **Score de Crédito:**
   - Deve estar entre 0 e 1000 (se fornecido)

6. **Renda:**
   - Se houver qualquer valor de renda informado, deve ter:
     - Situação profissional (`employmentStatus`), OU
     - Marcação de aposentado (`isRetired: true`)

7. **Valores Monetários:**
   - Devem ser números positivos (se fornecidos)
   - Aceita formatação brasileira (R$ X.XXX,XX)

8. **Áreas e Valores:**
   - Se `minValue` e `maxValue` fornecidos: `minValue <= maxValue`
   - Se `minArea` e `maxArea` fornecidos: `minArea <= maxArea`
   - Se `minBedrooms` e `maxBedrooms` fornecidos: `minBedrooms <= maxBedrooms`

### Validações de Interação

1. **Notas:**
   - Obrigatório
   - Texto não pode estar vazio

2. **Título:**
   - Opcional
   - Máximo 255 caracteres (se fornecido)

3. **Anexos:**
   - Opcional
   - Tipos de arquivo aceitos: conforme configuração do sistema
   - Tamanho máximo: conforme configuração

---

## 🎯 Funcionalidades

### 1. Busca e Filtros

**Funcionalidade:**
- Busca geral em tempo real
- Filtros avançados via drawer
- Busca por múltiplos critérios
- Ordenação personalizada
- Filtro de escopo (meus dados / todos)

**Campos de Busca:**
- Nome (ILIKE)
- Email (ILIKE)
- Telefone (busca em phone, secondaryPhone, whatsapp)
- CPF (com ou sem máscara)
- Busca geral (`search`): busca em nome, email, CPF, telefones

**Filtros Disponíveis:**
- Tipo (buyer, seller, renter, lessor, investor, general)
- Status (active, inactive, contacted, interested, closed)
- Cidade, Bairro, Estado
- Responsável (usuarioId)
- Período de criação (createdFrom, createdTo)
- Status ativo (isActive)
- Escopo (onlyMyData)

**Ordenação:**
- Por nome, data de criação, status, tipo, cidade
- Ascendente ou descendente

### 2. Importação em Massa

**Funcionalidade:**
- Upload de arquivo Excel (.xlsx, .xls)
- Processamento assíncrono
- Validação de dados
- Relatório de erros
- Download de planilha de erros

**Formato Esperado:**
- Colunas: name, email, cpf, phone, zipCode, address, city, state, neighborhood, type, status
- Valores válidos para type e status
- CPFs únicos

**Processo:**
1. Upload do arquivo
2. Criação de job assíncrono
3. Processamento em background
4. Atualização de progresso
5. Download de erros (se houver)

### 3. Exportação

**Funcionalidade:**
- Exportar todos os clientes
- Exportar com filtros aplicados
- Formato Excel (.xlsx)
- Exportação em lotes para grandes volumes

**Dados Exportados:**
- Todos os campos do cliente
- Dados relacionados (cônjuge, responsável, captador)

### 4. Transferência de Clientes

**Funcionalidade:**
- Transferir responsabilidade de um cliente entre corretores
- Lista apenas usuários da mesma empresa
- Histórico de transferências (futuro)

**Fluxo:**
1. Selecionar cliente
2. Abrir modal de transferência
3. Selecionar novo responsável
4. Confirmar transferência
5. Cliente é atualizado no sistema

### 5. Gestão de Cônjuge

**Funcionalidade:**
- Criar/editar cônjuge associado ao cliente
- Campos: nome, CPF, telefone, email, data de nascimento, RG
- Validações específicas
- Vinculação automática

### 6. Interações com Cliente

**Funcionalidade:**
- Registrar interações (ligações, reuniões, emails, etc.)
- Adicionar anexos (documentos, imagens)
- Histórico completo
- Editar/excluir interações

**Campos:**
- Título (opcional)
- Notas (obrigatório)
- Data/hora da interação
- Anexos (opcionais)

### 7. Matches com Propriedades

**Funcionalidade:**
- Sistema de compatibilidade automática
- Compara preferências do cliente com características das propriedades
- Exibe na página de detalhes do cliente
- Badge de matches na listagem

**Algoritmo:**
- Compara tipo desejado vs tipo da propriedade
- Compara faixa de preço
- Compara localização (cidade, bairro)
- Compara características (quartos, banheiros, área)
- Calcula score de compatibilidade

### 8. Classificação de Leads (IA)

**Funcionalidade (requer módulo `ai_assistant`):**
- Classificação automática de leads
- Badge na listagem
- Card de classificação na página de detalhes
- Sugestões de follow-up

### 9. Estatísticas

**Métricas Disponíveis:**
- Total de clientes
- Clientes ativos
- Por tipo (buyers, sellers, renters, lessors, investors, general)
- Com filtros aplicados

### 10. Vinculação com Propriedades

**Funcionalidade:**
- Associar cliente a propriedade
- Tipo de interesse (interested, viewed, offered, etc.)
- Notas sobre o interesse
- Listar propriedades do cliente
- Listar clientes da propriedade

---

## 🎣 Hooks Relacionados

### useClients

**Localização:** `src/hooks/useClients.ts`

**Interface:**
```typescript
{
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: (filters?: ClientSearchFilters) => Promise<Client[]>;
  createClient: (data: CreateClientDto) => Promise<Client>;
  updateClient: (id: string, data: UpdateClientDto) => Promise<Client>;
  deleteClient: (id: string, permanent?: boolean) => Promise<void>;
  getClient: (id: string) => Promise<Client>;
  getClientStatistics: (filters?: ClientSearchFilters) => Promise<ClientStatistics>;
  assignClientToProperty: (clientId: string, propertyId: string, interestType?: string, notes?: string) => Promise<void>;
  unassignClientFromProperty: (clientId: string, propertyId: string) => Promise<void>;
  getClientProperties: (clientId: string) => Promise<Property[]>;
  getClientsByProperty: (propertyId: string) => Promise<Client[]>;
  transferClient: (clientId: string, newResponsibleUserId: string) => Promise<void>;
}
```

**Funcionalidades:**
- Gerenciamento completo de clientes
- Cache local
- Recarregamento automático ao mudar empresa
- Tratamento de erros

### useSpouse

**Localização:** `src/hooks/useSpouse.ts`

**Funcionalidades:**
- Criar/editar/excluir cônjuge
- Validações específicas
- Vinculação ao cliente

### useMatches

**Localização:** `src/hooks/useMatches.ts`

**Funcionalidades:**
- Buscar matches de um cliente
- Score de compatibilidade
- Ordenação por relevância

---

## 🔄 Fluxos Principais

### Fluxo de Criação de Cliente

```
1. Usuário acessa /clients/new
   ↓
2. Preenche formulário (campos obrigatórios)
   ↓
3. Validações frontend são executadas
   ↓
4. Se houver cônjuge, cria cônjuge primeiro
   ↓
5. API POST /clients é chamada
   ↓
6. Backend valida dados (validações server-side)
   ↓
7. Cliente é criado no banco
   ↓
8. Resposta com cliente criado
   ↓
9. Navega para /clients/:id (detalhes)
   ↓
10. Toast de sucesso é exibido
```

### Fluxo de Importação em Massa

```
1. Usuário clica em "Importar Excel"
   ↓
2. Modal de importação é aberto
   ↓
3. Arquivo Excel é selecionado
   ↓
4. Upload do arquivo via POST /clients/bulk-import
   ↓
5. Job assíncrono é criado
   ↓
6. Modal mostra progresso (polling)
   ↓
7. Processamento em background:
   - Valida cada linha
   - Cria clientes válidos
   - Registra erros
   ↓
8. Quando completo:
   - Mostra resumo (sucessos/erros)
   - Disponibiliza download de erros
   ↓
9. Lista de clientes é recarregada
```

### Fluxo de Transferência

```
1. Usuário clica em "Transferir" no menu do cliente
   ↓
2. Modal TransferClientModal é aberto
   ↓
3. Lista de usuários é carregada (GET /clients/users-for-transfer)
   ↓
4. Usuário seleciona novo responsável
   ↓
5. Confirma transferência
   ↓
6. API PUT /clients/:id/transfer é chamada
   ↓
7. Cliente é atualizado
   ↓
8. Lista é recarregada
   ↓
9. Toast de sucesso é exibido
```

---

## 🔐 Permissões e Restrições

### Permissões Necessárias

| Ação | Permissão |
|------|-----------|
| Listar clientes | `client:read` |
| Criar cliente | `client:create` |
| Editar cliente | `client:update` |
| Excluir cliente | `client:delete` |
| Transferir cliente | `client:transfer` |
| Importar clientes | `client:create` (implícito) |
| Exportar clientes | `client:read` (implícito) |

### Restrições

1. **Escopo de Dados:**
   - Por padrão, usuários veem apenas seus próprios clientes
   - `onlyMyData=false` requer permissões administrativas
   - Responsável pode ver apenas seus clientes

2. **Transferência:**
   - Apenas usuários da mesma empresa podem receber clientes
   - Admin/master podem transferir para qualquer usuário

3. **Exclusão:**
   - Soft delete por padrão
   - Exclusão permanente requer permissões especiais

---

## 📱 Responsividade

### Desktop
- Grid de cards com múltiplas colunas
- Lista em tabela com todas as informações
- Filtros em drawer lateral
- Estatísticas em grid horizontal

### Tablet
- Layout adaptado
- Cards empilhados
- Filtros em modal

### Mobile
- Lista vertical otimizada
- Cards com informações essenciais
- Menu de ações por cliente
- Detalhes em versão mobile

---

## 🚀 Próximas Melhorias

- [ ] Histórico de alterações do cliente
- [ ] Timeline de interações visual
- [ ] Integração com WhatsApp (envio direto)
- [ ] Notificações automáticas de matches
- [ ] Templates de comunicação
- [ ] Automações baseadas em status
- [ ] Análise preditiva de conversão
- [ ] Score de qualidade do lead
- [ ] Integração com CRMs externos
- [ ] Relatórios personalizados
- [ ] Segmentação avançada
- [ ] Campanhas de marketing direcionadas
- [ ] App mobile para gestão de clientes
- [ ] Sincronização offline

---

## 📝 Notas Técnicas

### Paginação

- Padrão: 50 itens por página
- Máximo: 100 itens por página
- Paginação incremental (carrega mais itens)

### Busca ILIKE

- Buscas case-insensitive
- Busca parcial (não exige match exato)
- Otimizado para performance

### Cache

- Lista de clientes é cacheada localmente
- Recarregamento ao mudar empresa
- Invalidação após CRUD

### Performance

- Lazy loading de componentes
- Debounce em buscas
- Virtualização de listas grandes (futuro)
- Exportação em lotes para grandes volumes

---

**Última atualização:** Janeiro 2025

