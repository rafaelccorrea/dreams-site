# 📄 Documentação Completa - Sistema de Documentos

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Rotas Frontend](#-rotas-frontend)
3. [Endpoints da API](#-endpoints-da-api)
4. [Estrutura de Dados](#-estrutura-de-dados)
5. [Validações Completas](#-validações-completas)
6. [Upload de Documentos](#-upload-de-documentos)
7. [Links Públicos de Upload (Upload Tokens)](#-links-públicos-de-upload-upload-tokens)
8. [Assinaturas de Documentos](#-assinaturas-de-documentos)
9. [Fluxos Principais](#-fluxos-principais)
10. [Permissões](#-permissões)
11. [Componentes Relacionados](#-componentes-relacionados)
12. [Tratamento de Erros](#-tratamento-de-erros)
13. [Próximas Melhorias](#-próximas-melhorias)

---

## 🎯 Visão Geral

O sistema de documentos permite gerenciar arquivos vinculados a clientes e propriedades, com funcionalidades de upload, organização, assinatura digital e links públicos para coleta de documentos.

### Funcionalidades Principais

- ✅ **Upload de Documentos**: Upload de arquivos (PDF, DOC, XLS, imagens) até 50MB
- ✅ **Vinculação**: Documentos podem ser vinculados a clientes OU propriedades
- ✅ **Organização**: Sistema de tipos, tags, status e filtros avançados
- ✅ **Assinatura Digital**: Integração com Assinafy para assinatura eletrônica
- ✅ **Links Públicos**: Geração de links seguros para clientes enviarem documentos
- ✅ **Validação de CPF**: Validação de CPF para upload público
- ✅ **Aprovação/Rejeição**: Sistema de aprovação de documentos
- ✅ **Vencimento**: Controle de documentos com data de vencimento
- ✅ **Criptografia**: Opção de criptografia para documentos sensíveis
- ✅ **Busca e Filtros**: Busca textual e filtros por tipo, status, tags, etc.
- ✅ **Visualização Agrupada**: Visualização de documentos agrupados por cliente/propriedade

### Módulo Requerido

- **`document_management`**: Módulo obrigatório para acessar funcionalidades de documentos

---

## 🛣️ Rotas Frontend

### Rotas Protegidas (Requerem Autenticação)

#### 1. Listagem de Documentos
- **Rota:** `/documents`
- **Componente:** `DocumentsPage`
- **Módulo:** `document_management`
- **Permissão:** `document:read`
- **Descrição:** Página principal com listagem de todos os documentos

#### 2. Criar Documento
- **Rota:** `/documents/create`
- **Componente:** `CreateDocumentPage`
- **Módulo:** `document_management`
- **Permissão:** `document:create`
- **Descrição:** Formulário para criar novo documento

#### 3. Detalhes do Documento
- **Rota:** `/documents/:id`
- **Componente:** `DocumentDetailsPage`
- **Módulo:** `document_management`
- **Permissão:** `document:read`
- **Descrição:** Visualização detalhada de um documento específico

#### 4. Editar Documento
- **Rota:** `/documents/:id/edit`
- **Componente:** `EditDocumentPage`
- **Módulo:** `document_management`
- **Permissão:** `document:update`
- **Descrição:** Formulário para editar documento existente

#### 5. Enviar para Assinatura
- **Rota:** `/documents/:id/send-for-signature`
- **Componente:** `SendDocumentForSignaturePage`
- **Módulo:** `document_management`
- **Permissão:** `document:create`
- **Descrição:** Página para configurar e enviar documento para assinatura

#### 6. Todas as Assinaturas
- **Rota:** `/documents/signatures`
- **Componente:** `AllSignaturesPage`
- **Módulo:** `document_management`
- **Permissão:** `document:read`
- **Descrição:** Listagem de todas as assinaturas pendentes e concluídas

### Rotas Públicas (Não Requerem Autenticação)

#### 7. Upload Público de Documentos
- **Rota:** `/public/upload-documents/:token`
- **Componente:** `PublicDocumentUploadPage`
- **Descrição:** Página pública para clientes enviarem documentos usando token de upload

---

## 🔌 Endpoints da API

### Base URL
```
/api/documents
```

**Autenticação:** Requer token JWT no header `Authorization` e header `X-Company-ID`

### Índice de Endpoints (32 rotas)

#### Documentos

1. **GET** `/documents` - Listar documentos com filtros
2. **POST** `/documents/upload` - Upload de documento
3. **GET** `/documents/:id` - Buscar documento por ID (com detalhes)
4. **PUT** `/documents/:id` - Atualizar documento
5. **DELETE** `/documents` - Deletar documentos (múltiplos)
6. **PUT** `/documents/:id/approve` - Aprovar ou rejeitar documento
7. **GET** `/documents/client/:clientId` - Listar documentos por cliente
8. **GET** `/documents/property/:propertyId` - Listar documentos por propriedade
9. **GET** `/documents/expiring/:days` - Listar documentos vencendo

#### Assinaturas

10. **POST** `/documents/:documentId/signatures?companyId={companyId}` - Criar assinatura
11. **POST** `/documents/:documentId/signatures/batch?companyId={companyId}` - Criar múltiplas assinaturas em lote
12. **GET** `/documents/:documentId/signatures?companyId={companyId}` - Listar assinaturas de um documento
13. **GET** `/documents/:documentId/signatures/stats?companyId={companyId}` - Estatísticas de assinaturas
14. **GET** `/documents/:documentId/signatures/:signatureId?companyId={companyId}` - Obter assinatura específica
15. **PUT** `/documents/:documentId/signatures/:signatureId?companyId={companyId}` - Atualizar assinatura
16. **POST** `/documents/:documentId/signatures/:signatureId/send-email?companyId={companyId}` - Enviar link por email
17. **POST** `/documents/:documentId/signatures/:signatureId/resend-email?companyId={companyId}` - Reenviar link por email
18. **PUT** `/documents/:documentId/signatures/:signatureId/viewed?companyId={companyId}` - Marcar como visualizada
19. **PUT** `/documents/:documentId/signatures/:signatureId/signed?companyId={companyId}` - Marcar como assinada
20. **PUT** `/documents/:documentId/signatures/:signatureId/rejected?companyId={companyId}` - Marcar como rejeitada
21. **GET** `/signatures/client/:clientId?companyId={companyId}&status={status}` - Listar assinaturas por cliente
22. **GET** `/signatures/pending?companyId={companyId}` - Listar assinaturas pendentes
23. **GET** `/signatures?companyId={companyId}&...` - Listar todas as assinaturas (com filtros)

#### Assinaturas Públicas

24. **GET** `/public/signatures/:signatureId` - Obter informações de assinatura pública (sem autenticação)

#### Upload Tokens (Links Públicos)

25. **POST** `/documents/upload-tokens` - Criar token de upload
26. **GET** `/documents/upload-tokens` - Listar tokens de upload
27. **POST** `/documents/upload-tokens/:tokenId/send-email` - Enviar link por email
28. **PUT** `/documents/upload-tokens/:tokenId/revoke` - Revogar token
29. **GET** `/public/upload-documents/:token/info` - Obter informações do token (público)
30. **POST** `/public/upload-documents/:token/validate` - Validar CPF para upload público
31. **POST** `/public/upload-documents/:token/upload` - Upload público de documento
32. **POST** `/public/upload-documents/:token/upload-multiple` - Upload público de múltiplos documentos

---

## 📊 Estrutura de Dados

### DocumentModel

```typescript
interface DocumentModel {
  id: string;
  originalName: string;          // Nome original do arquivo
  fileName: string;              // Nome do arquivo no servidor
  fileUrl: string;              // URL para download/visualização
  fileSize: number;             // Tamanho em bytes
  mimeType: string;             // Tipo MIME (ex: application/pdf)
  fileExtension: string;         // Extensão do arquivo (ex: .pdf)
  type: DocumentType;           // Tipo do documento
  status: DocumentStatus;        // Status do documento
  title?: string;                // Título personalizado
  description?: string;          // Descrição
  tags?: string[];               // Tags para organização
  notes?: string;                // Observações internas
  expiryDate?: Date | string;    // Data de vencimento
  companyId: string;            // ID da empresa
  uploadedById: string;         // ID do usuário que fez upload
  clientId?: string;             // ID do cliente (se vinculado)
  propertyId?: string;           // ID da propriedade (se vinculado)
  isEncrypted: boolean;          // Se o documento está criptografado
  approvedAt?: Date | string;    // Data de aprovação
  approvedById?: string;         // ID do aprovador
  createdAt: Date | string;     // Data de criação
  updatedAt: Date | string;     // Data de atualização
  isForSignature?: boolean;      // Se está marcado para assinatura
  signatures?: DocumentSignaturesInfo; // Informações de assinaturas
}
```

### DocumentWithDetails

```typescript
interface DocumentWithDetails extends DocumentModel {
  client?: DocumentClient;       // Dados completos do cliente
  property?: DocumentProperty;    // Dados completos da propriedade
  uploadedBy?: DocumentUser;      // Dados do usuário que fez upload
  approvedBy?: DocumentUser;      // Dados do aprovador
}
```

### DocumentType

```typescript
enum DocumentType {
  CONTRACT = 'contract',                    // Contrato
  IDENTITY = 'identity',                    // Identidade
  PROOF_OF_ADDRESS = 'proof_of_address',    // Comprovante de Endereço
  PROOF_OF_INCOME = 'proof_of_income',      // Comprovante de Renda
  DEED = 'deed',                            // Escritura
  REGISTRATION = 'registration',            // Registro
  TAX_DOCUMENT = 'tax_document',            // Documento Fiscal
  INSPECTION_REPORT = 'inspection_report',  // Laudo Vistoria
  APPRAISAL = 'appraisal',                  // Avaliação
  PHOTO = 'photo',                          // Foto
  OTHER = 'other'                           // Outro
}
```

### DocumentStatus

```typescript
enum DocumentStatus {
  ACTIVE = 'active',                    // Ativo
  ARCHIVED = 'archived',                // Arquivado
  DELETED = 'deleted',                  // Deletado
  PENDING_REVIEW = 'pending_review',    // Pendente de Revisão
  APPROVED = 'approved',                // Aprovado
  REJECTED = 'rejected'                 // Rejeitado
}
```

### DocumentSignature

```typescript
interface DocumentSignature {
  id: string;
  documentId: string;
  companyId: string;
  clientId?: string;              // Se for cliente do sistema
  userId?: string;                // Se for usuário do sistema
  status: DocumentSignatureStatus;
  signerName: string;             // Nome do signatário
  signerEmail: string;           // Email do signatário
  signerPhone?: string;           // Telefone do signatário
  signerCpf?: string;            // CPF do signatário
  expiresAt?: Date | string;      // Data de expiração
  viewedAt?: Date | string;      // Data de visualização
  signedAt?: Date | string;      // Data de assinatura
  rejectedAt?: Date | string;    // Data de rejeição
  rejectionReason?: string;       // Motivo da rejeição
  assinafyDocumentId?: string;   // ID do documento no Assinafy
  assinafySignerId?: string;     // ID do signatário no Assinafy
  assinafyAssignmentId?: string; // ID da atribuição no Assinafy
  signatureUrl?: string;         // URL para assinatura
  signerAccessCode?: string;     // Código de acesso do signatário
  metadata?: Record<string, any>; // Metadados adicionais
  createdAt: Date | string;
  updatedAt: Date | string;
  document?: {                    // Dados do documento
    id: string;
    title: string;
    originalName: string;
  };
  client?: {                      // Dados do cliente
    id: string;
    name: string;
    email: string;
  };
  user?: {                        // Dados do usuário
    id: string;
    name: string;
    email: string;
  };
}
```

### DocumentSignatureStatus

```typescript
enum DocumentSignatureStatus {
  PENDING = 'pending',      // Aguardando
  VIEWED = 'viewed',        // Visualizado
  SIGNED = 'signed',        // Assinado
  REJECTED = 'rejected',    // Rejeitado
  EXPIRED = 'expired',      // Expirado
  CANCELLED = 'cancelled'   // Cancelado
}
```

### UploadToken

```typescript
interface UploadToken {
  id: string;
  token: string;                    // Token único
  uploadUrl: string;                // URL pública de upload
  clientId: string;                 // ID do cliente
  clientName: string;               // Nome do cliente
  clientCpfMasked: string;          // CPF mascarado (ex: 123.***.***-45)
  expiresAt: string;                // Data de expiração
  status: UploadTokenStatus;        // Status do token
  documentsUploaded: number;        // Quantidade de documentos enviados
  notes?: string;                   // Observações
  createdAt: string;                // Data de criação
}
```

### UploadTokenStatus

```typescript
enum UploadTokenStatus {
  ACTIVE = 'active',     // Ativo
  EXPIRED = 'expired',   // Expirado
  USED = 'used',         // Usado
  REVOKED = 'revoked'    // Revogado
}
```

---

## ✅ Validações Completas

### Validação de Arquivo

#### Tipos Permitidos
- `application/pdf` - PDF
- `application/msword` - DOC (Word antigo)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - DOCX
- `application/vnd.ms-excel` - XLS (Excel antigo)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` - XLSX
- `image/jpeg` - JPEG
- `image/jpg` - JPG
- `image/png` - PNG
- `image/gif` - GIF
- `image/webp` - WebP
- `text/plain` - TXT

#### Tamanho Máximo
- **50MB** (50 * 1024 * 1024 bytes)
- **Erro:** "Arquivo muito grande! Tamanho máximo: 50MB"

#### Validação de Tipo
- **Erro:** "Tipo de arquivo não permitido! Use PDF, DOC, XLS ou imagens."

### Validação de Vínculo

#### Regra de Vínculo
- O documento **DEVE** estar vinculado a um cliente **OU** uma propriedade
- **NÃO PODE** estar vinculado a ambos simultaneamente
- **NÃO PODE** estar sem vínculo

#### Validação
```typescript
validateBinding(clientId?: string, propertyId?: string): boolean {
  return (!!clientId && !propertyId) || (!clientId && !!propertyId);
}
```

**Erro:** "O documento deve estar vinculado a um cliente OU uma propriedade (não ambos)."

### Validação de Campos

#### Campos Obrigatórios no Upload

1. **`file`** (File)
   - **Obrigatório:** ✅ Sim
   - **Tipo:** File object
   - **Validação:** Deve passar em `validateFile()`

2. **`type`** (DocumentType)
   - **Obrigatório:** ✅ Sim
   - **Tipo:** Enum DocumentType
   - **Valores:** Um dos valores válidos de `DocumentType`

3. **Vínculo** (clientId OU propertyId)
   - **Obrigatório:** ✅ Sim (um dos dois)
   - **Validação:** Deve passar em `validateBinding()`

#### Campos Opcionais no Upload

4. **`title`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 255 caracteres
   - **Descrição:** Título personalizado do documento

5. **`description`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 300 caracteres (validação frontend)
   - **Descrição:** Descrição detalhada do documento

6. **`tags`** (string[])
   - **Obrigatório:** ❌ Não
   - **Tipo:** Array de strings
   - **Descrição:** Tags para organização

7. **`notes`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 300 caracteres
   - **Descrição:** Observações internas

8. **`expiryDate`** (string)
   - **Obrigatório:** ❌ Não
   - **Formato:** ISO 8601 (YYYY-MM-DD)
   - **Validação:** Deve ser uma data futura
   - **Descrição:** Data de vencimento do documento

9. **`isEncrypted`** (boolean)
   - **Obrigatório:** ❌ Não
   - **Padrão:** `false`
   - **Descrição:** Se o documento deve ser criptografado

### Validação de Atualização

#### Campos Atualizáveis

Todos os campos são opcionais na atualização, exceto:
- `id` (não pode ser alterado)
- `file` (não pode ser alterado - requer novo upload)
- `companyId` (não pode ser alterado)
- `uploadedById` (não pode ser alterado)

#### Validações Especiais na Atualização

1. **Vínculo (clientId/propertyId)**
   - Pode ser alterado, mas deve manter a regra: cliente OU propriedade
   - Pode ser removido (`null`) se necessário

2. **Status**
   - Deve ser um valor válido de `DocumentStatus`
   - Transições de status podem ter regras de negócio específicas

### Validação de Assinatura

#### CreateSignatureDto

1. **`signerName`** (string)
   - **Obrigatório:** ✅ Sim
   - **Mínimo:** 3 caracteres
   - **Máximo:** 255 caracteres

2. **`signerEmail`** (string)
   - **Obrigatório:** ✅ Sim
   - **Formato:** Email válido
   - **Validação:** Regex de email

3. **`signerPhone`** (string)
   - **Obrigatório:** ❌ Não
   - **Formato:** (XX) XXXXX-XXXX ou variações

4. **`signerCpf`** (string)
   - **Obrigatório:** ❌ Não
   - **Formato:** 11 dígitos (com ou sem formatação)
   - **Validação:** Dígitos verificadores

5. **`clientId`** (string)
   - **Obrigatório:** ❌ Não (se fornecido, deve existir)
   - **Validação:** Cliente deve existir na empresa

6. **`userId`** (string)
   - **Obrigatório:** ❌ Não (se fornecido, deve existir)
   - **Validação:** Usuário deve existir na empresa

7. **`expiresAt`** (string)
   - **Obrigatório:** ❌ Não
   - **Formato:** ISO 8601
   - **Validação:** Deve ser data futura

8. **`sendEmail`** (boolean)
   - **Obrigatório:** ❌ Não
   - **Padrão:** `false`
   - **Descrição:** Se deve enviar email automaticamente

### Validação de Upload Token

#### CreateUploadTokenDto

1. **`clientId`** (string)
   - **Obrigatório:** ✅ Sim
   - **Validação:** Cliente deve existir na empresa

2. **`expirationDays`** (number)
   - **Obrigatório:** ❌ Não
   - **Padrão:** 3 dias
   - **Mínimo:** 1 dia
   - **Máximo:** 30 dias

3. **`notes`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 500 caracteres

### Validação de Upload Público (Arquivo)

#### Limites para Upload Público

- **Tamanho Máximo:** 10MB (diferente do upload autenticado que permite 50MB)
- **Tipos Permitidos:** Mesmos tipos do upload autenticado
- **Erro:** "Arquivo muito grande: {nome}. Tamanho máximo: 10MB"

### Validação de Upload Público

#### PublicUploadDocumentDto

1. **`file`** (File)
   - **Obrigatório:** ✅ Sim
   - **Validação:** Deve passar em `validateFile()`

2. **`cpf`** (string)
   - **Obrigatório:** ✅ Sim
   - **Formato:** 11 dígitos (com ou sem formatação)
   - **Validação:** 
     - Deve ser válido (dígitos verificadores)
     - Deve corresponder ao CPF do cliente do token

3. **`type`** (DocumentType)
   - **Obrigatório:** ✅ Sim
   - **Validação:** Deve ser um valor válido

4. **`title`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 255 caracteres

5. **`description`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 300 caracteres

6. **`notes`** (string)
   - **Obrigatório:** ❌ Não
   - **Máximo:** 300 caracteres

---

## 📤 Upload de Documentos

### Fluxo de Upload

```
1. Usuário seleciona arquivo
   ↓
2. Validação de arquivo (tipo e tamanho)
   ↓
3. Usuário preenche dados (tipo, título, descrição, etc.)
   ↓
4. Usuário vincula a cliente OU propriedade
   ↓
5. Validação de vínculo
   ↓
6. FormData é criado com arquivo e metadados
   ↓
7. POST /documents/upload
   ↓
8. Documento é salvo no servidor
   ↓
9. Documento aparece na listagem
```

### Endpoint: POST /documents/upload

**Headers:**
```
Authorization: Bearer {token}
X-Company-ID: {companyId}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
file: File (obrigatório)
type: DocumentType (obrigatório)
clientId?: string (obrigatório se propertyId não fornecido)
propertyId?: string (obrigatório se clientId não fornecido)
title?: string
description?: string
tags?: string (JSON stringified array)
notes?: string
expiryDate?: string (ISO 8601)
isEncrypted?: string ('true' ou 'false')
```

**Response (201 Created):**
```typescript
DocumentModel
```

**Erros:**
- **400 Bad Request:** Dados inválidos ou validação falhou
- **403 Forbidden:** Sem permissão ou módulo não disponível
- **404 Not Found:** Cliente ou propriedade não encontrado
- **413 Payload Too Large:** Arquivo muito grande
- **415 Unsupported Media Type:** Tipo de arquivo não permitido

---

## 🔗 Links Públicos de Upload (Upload Tokens)

### Conceito

Links públicos permitem que clientes enviem documentos sem precisar de login no sistema. Um token único é gerado e compartilhado com o cliente.

### Fluxo de Criação de Token

```
1. Usuário seleciona cliente
   ↓
2. Define prazo de expiração (1-30 dias, padrão: 3)
   ↓
3. Adiciona observações (opcional)
   ↓
4. POST /upload-tokens
   ↓
5. Token é gerado
   ↓
6. Link público é criado: /public/upload-documents/{token}
   ↓
7. Link pode ser compartilhado por email ou copiado
```

### Endpoint: POST /documents/upload-tokens

**Request Body:**
```typescript
{
  clientId: string;           // Obrigatório
  expirationDays?: number;     // 1-30, padrão: 3
  notes?: string;              // Máximo 500 caracteres
}
```

**Response (201 Created):**
```typescript
{
  id: string;
  token: string;
  uploadUrl: string;
  clientId: string;
  clientName: string;
  clientCpfMasked: string;
  expiresAt: string;
  status: 'active';
  documentsUploaded: 0;
  notes?: string;
  createdAt: string;
}
```

### Fluxo de Upload Público

```
1. Cliente acessa link público: /public/upload-documents/{token}
   ↓
2. Sistema valida token (ativo, não expirado, não revogado)
   ↓
3. Cliente informa CPF
   ↓
4. POST /public/upload-documents/{token}/validate
   ↓
5. Sistema valida CPF (deve corresponder ao cliente do token)
   ↓
6. Cliente seleciona arquivo(s)
   ↓
7. Cliente preenche tipo e informações
   ↓
8. POST /public/upload-documents/{token}/upload (ou /upload-multiple)
   ↓
9. Documento é vinculado automaticamente ao cliente
   ↓
10. Documento aparece no sistema
```

### Endpoint: POST /public/upload-documents/:token/validate

**Request Body:**
```typescript
{
  cpf: string;  // 11 dígitos
}
```

**Response (200 OK):**
```typescript
{
  valid: boolean;
  clientName?: string;
  expiresAt?: string;
  message?: string;
}
```

### Endpoint: POST /public/upload-documents/:token/upload

**Request Body (FormData):**
```
file: File (obrigatório)
cpf: string (obrigatório, 11 dígitos)
type: DocumentType (obrigatório)
title?: string
description?: string
notes?: string
```

**Response (201 Created):**
```typescript
{
  id: string;
  originalName: string;
  type: DocumentType;
  title?: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  createdAt: string;
}
```

### Endpoint: POST /public/upload-documents/:token/upload-multiple

**Request Body (FormData):**
```
files: File[] (obrigatório, múltiplos arquivos)
cpf: string (obrigatório, 11 dígitos)
type: DocumentType (obrigatório)
title?: string
description?: string
notes?: string
```

**Response (201 Created):**
```typescript
{
  success: boolean;
  message: string;
  documents: PublicUploadResponse[];
  failed: Array<{
    fileName: string;
    error: string;
  }>;
}
```

---

## ✍️ Assinaturas de Documentos

### Conceito

Sistema de assinatura digital integrado com Assinafy, permitindo enviar documentos para assinatura de clientes e usuários.

### Fluxo de Envio para Assinatura

```
1. Usuário seleciona documento
   ↓
2. Acessa página: /documents/:id/send-for-signature
   ↓
3. Adiciona signatários (clientes, usuários ou externos)
   ↓
4. Define data de expiração (opcional)
   ↓
5. POST /documents/:documentId/signatures/batch
   ↓
6. Assinaturas são criadas no Assinafy
   ↓
7. Links de assinatura são gerados
   ↓
8. Emails são enviados (se sendEmail=true)
   ↓
9. Signatários recebem link para assinar
```

### Endpoint: POST /documents/:documentId/signatures/batch

**Query Params:**
```
companyId: string (obrigatório)
```

**Request Body:**
```typescript
{
  signers: Array<{
    clientId?: string;        // Se for cliente do sistema
    userId?: string;           // Se for usuário do sistema
    signerName: string;       // Obrigatório
    signerEmail: string;      // Obrigatório
    signerPhone?: string;
    signerCpf?: string;
  }>;
  expiresAt?: string;         // ISO 8601
  sendEmail?: boolean;         // Padrão: false
  metadata?: Record<string, any>;
}
```

**Response (201 Created):**
```typescript
{
  signatures: DocumentSignature[];
  assinafyDocumentId?: string;
  total: number;
  success: number;
  errors: Array<{
    signer: string;
    error: string;
  }>;
}
```

### Endpoint: GET /documents/:documentId/signatures

**Query Params:**
```
companyId: string (obrigatório)
```

**Response (200 OK):**
```typescript
DocumentSignature[]
```

### Endpoint: GET /public/signatures/:signatureId

**Descrição:** Obter informações de uma assinatura pública (sem autenticação). Usado quando o signatário acessa o link de assinatura.

**Response (200 OK):**
```typescript
DocumentSignature
```

**Erros:**
- **404 Not Found:** Assinatura não encontrada
- **403 Forbidden:** Assinatura expirada ou cancelada

### Endpoint: GET /documents/:documentId/signatures/stats

**Query Params:**
```
companyId: string (obrigatório)
```

**Response (200 OK):**
```typescript
{
  total: number;
  pending: number;
  viewed: number;
  signed: number;
  rejected: number;
  expired: number;
}
```

### Endpoint: POST /documents/:documentId/signatures/:signatureId/send-email

**Query Params:**
```
companyId: string (obrigatório)
```

**Response (200 OK):**
```typescript
{
  success: boolean;
  message: string;
  signatureUrl?: string;
}
```

### Endpoint: PUT /documents/:documentId/signatures/:signatureId/rejected

**Query Params:**
```
companyId: string (obrigatório)
```

**Request Body:**
```typescript
{
  rejectionReason: string;  // Obrigatório
}
```

**Response (200 OK):**
```typescript
DocumentSignature
```

---

## 🔄 Fluxos Principais

### Fluxo: Criar Documento

```
1. Usuário clica em "Criar Documento"
   ↓
2. Modal/Drawer de upload é aberto
   ↓
3. Usuário seleciona arquivo
   ↓
4. Validação de arquivo (tipo e tamanho)
   ↓
5. Usuário preenche tipo, título, descrição, etc.
   ↓
6. Usuário vincula a cliente OU propriedade
   ↓
7. Validação de vínculo
   ↓
8. POST /documents/upload
   ↓
9. Documento é criado
   ↓
10. Listagem é atualizada
```

### Fluxo: Editar Documento

```
1. Usuário clica em "Editar" em um documento
   ↓
2. Página de edição é aberta: /documents/:id/edit
   ↓
3. Formulário é preenchido com dados atuais
   ↓
4. Usuário modifica campos desejados
   ↓
5. Validações são executadas
   ↓
6. PUT /documents/:id
   ↓
7. Documento é atualizado
   ↓
8. Redirecionamento para detalhes ou listagem
```

### Fluxo: Aprovar/Rejeitar Documento

```
1. Usuário visualiza documento pendente
   ↓
2. Usuário clica em "Aprovar" ou "Rejeitar"
   ↓
3. PUT /documents/:id/approve
   ↓
4. Body: { status: 'approved' | 'rejected' }
   ↓
5. Status do documento é atualizado
   ↓
6. Listagem é atualizada
```

### Fluxo: Deletar Documento(s)

```
1. Usuário seleciona documento(s) para deletar
   ↓
2. Modal de confirmação é exibido
   ↓
3. Usuário confirma exclusão
   ↓
4. DELETE /documents
   ↓
5. Body: { documentIds: string[] }
   ↓
6. Documentos são deletados
   ↓
7. Listagem é atualizada
```

### Fluxo: Enviar para Assinatura

```
1. Usuário seleciona documento
   ↓
2. Acessa: /documents/:id/send-for-signature
   ↓
3. Adiciona signatários (um ou mais)
   ↓
4. Define data de expiração (opcional)
   ↓
5. Marca "Enviar email automaticamente" (opcional)
   ↓
6. POST /documents/:documentId/signatures/batch
   ↓
7. Assinaturas são criadas
   ↓
8. Links são gerados
   ↓
9. Emails são enviados (se solicitado)
   ↓
10. Signatários recebem notificação
```

### Fluxo: Cliente Assina Documento

```
1. Signatário recebe email com link
   ↓
2. Acessa link de assinatura
   ↓
3. Visualiza documento
   ↓
4. PUT /documents/:documentId/signatures/:signatureId/viewed
   ↓
5. Assina documento (via Assinafy)
   ↓
6. PUT /documents/:documentId/signatures/:signatureId/signed
   ↓
7. Status é atualizado para 'signed'
   ↓
8. Sistema notifica criador do documento
```

### Fluxo: Upload Público (Cliente)

```
1. Cliente recebe link público
   ↓
2. Acessa: /public/upload-documents/{token}
   ↓
3. Informa CPF
   ↓
4. POST /public/upload-documents/{token}/validate
   ↓
5. CPF é validado
   ↓
6. Cliente seleciona arquivo(s)
   ↓
7. Preenche tipo e informações
   ↓
8. POST /public/upload-documents/{token}/upload
   ↓
9. Documento é vinculado ao cliente
   ↓
10. Confirmação é exibida
```

---

## 🔍 Filtros e Busca

### Filtros Disponíveis

O endpoint `GET /documents` aceita os seguintes filtros via query params:

#### Filtros de Tipo e Status
- **`type`** (DocumentType): Filtrar por tipo específico de documento
- **`status`** (DocumentStatus): Filtrar por status (active, archived, pending_review, approved, rejected)

#### Filtros de Vínculo
- **`clientId`** (string): Filtrar documentos de um cliente específico
- **`propertyId`** (string): Filtrar documentos de uma propriedade específica

#### Filtros de Organização
- **`tags`** (string): Tags separadas por vírgula (ex: "importante,contrato")
- **`onlyMyDocuments`** (boolean): Apenas documentos do usuário logado

#### Busca Textual
- **`search`** (string): Busca em nome do arquivo, título, descrição e notas

#### Paginação e Ordenação
- **`page`** (number): Número da página (padrão: 1)
- **`limit`** (number): Itens por página (padrão: 20)
- **`sortBy`** (string): Campo para ordenação
- **`sortOrder`** ('ASC' | 'DESC'): Ordem (padrão: DESC)

### Exemplo de Uso

```typescript
// Buscar documentos aprovados do cliente X
GET /documents?clientId=xxx&status=approved&page=1&limit=20

// Buscar documentos com tag "contrato"
GET /documents?tags=contrato&sortBy=createdAt&sortOrder=DESC

// Buscar apenas meus documentos pendentes
GET /documents?onlyMyDocuments=true&status=pending_review

// Busca textual
GET /documents?search=cpf&type=identity
```

---

## 🔐 Permissões

### Permissões de Documentos

- **`document:read`** - Visualizar documentos
- **`document:create`** - Criar documentos
- **`document:update`** - Editar documentos
- **`document:delete`** - Deletar documentos
- **`document:approve`** - Aprovar/rejeitar documentos

### Dependências Contextuais

#### Vincular Documento a Cliente
- **Permissão:** `document:create`
- **Funcionalidade:** `vincular_documento_cliente`
- **Descrição:** Permite vincular documento a um cliente

#### Vincular Documento a Propriedade
- **Permissão:** `document:create`
- **Funcionalidade:** `vincular_documento_propriedade`
- **Descrição:** Permite vincular documento a uma propriedade

### Módulo Requerido

- **`document_management`** - Módulo obrigatório para todas as funcionalidades

---

## 🧩 Componentes Relacionados

### Páginas

- **`DocumentsPage`** - Listagem principal de documentos
- **`CreateDocumentPage`** - Página de criação
- **`DocumentDetailsPage`** - Detalhes do documento
- **`EditDocumentPage`** - Edição do documento
- **`SendDocumentForSignaturePage`** - Envio para assinatura
- **`AllSignaturesPage`** - Listagem de assinaturas
- **`PublicDocumentUploadPage`** - Upload público

### Componentes

- **`DocumentDrawer`** - Drawer para upload rápido
- **`DocumentsTable`** - Tabela de documentos
- **`DocumentList`** - Lista de documentos
- **`DocumentFilters`** - Filtros de documentos
- **`DocumentDetailsModal`** - Modal de detalhes
- **`DocumentEditModal`** - Modal de edição
- **`DocumentUpload`** - Componente de upload
- **`DocumentStatsCards`** - Cards de estatísticas
- **`DocumentSignatureCard`** - Card de assinatura
- **`DocumentSignatureList`** - Lista de assinaturas
- **`CreateDocumentUploadLinkModal`** - Modal para criar link público
- **`UploadTokensDashboard`** - Dashboard de tokens
- **`EntityDocumentsList`** - Lista de documentos de uma entidade (cliente/propriedade)

### Hooks

- **`useDocuments`** - Hook para gerenciar documentos
- **`useDocumentPermissions`** - Hook para permissões
- **`useUploadTokens`** - Hook para tokens de upload
- **`usePublicDocumentUpload`** - Hook para upload público

### Serviços

- **`documentApi`** - API de documentos
- **`documentSignatureApi`** - API de assinaturas
- **`uploadTokenApi`** - API de tokens de upload

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

#### 400 Bad Request
- Dados inválidos
- Validação falhou
- Arquivo não fornecido
- Vínculo inválido

#### 403 Forbidden
- Sem permissão
- Módulo não disponível
- Plano não permite funcionalidade

#### 404 Not Found
- Documento não encontrado
- Cliente não encontrado
- Propriedade não encontrada
- Token não encontrado

#### 413 Payload Too Large
- Arquivo muito grande (>50MB)

#### 415 Unsupported Media Type
- Tipo de arquivo não permitido

#### 422 Unprocessable Entity
- Validação de negócio falhou
- CPF inválido
- Token expirado ou revogado

### Mensagens de Erro

A função `handleDocumentError` trata erros e retorna mensagens amigáveis:

```typescript
handleDocumentError(error: any): string {
  if (error.response?.status === 403) {
    if (error.response.data.message?.includes('plano')) {
      return 'Este módulo está disponível apenas no plano PRO. Faça upgrade!';
    }
    return 'Você não tem permissão para realizar esta ação.';
  }
  
  if (error.response?.status === 400) {
    return error.response.data.message || 'Dados inválidos.';
  }
  
  if (error.response?.status === 404) {
    return 'Documento, cliente ou propriedade não encontrado.';
  }
  
  return error.message || 'Erro ao processar requisição.';
}
```

---

## 🚀 Próximas Melhorias

### Funcionalidades Planejadas

- [ ] Versões de documentos (histórico de alterações)
- [ ] Compartilhamento de documentos entre empresas
- [ ] OCR para extração de dados de documentos
- [ ] Assinatura em lote de múltiplos documentos
- [ ] Templates de documentos
- [ ] Notificações de vencimento de documentos
- [ ] Relatórios de documentos
- [ ] Exportação de documentos em ZIP
- [ ] Integração com mais provedores de assinatura
- [ ] Preview de documentos no navegador
- [ ] Anotações em documentos
- [ ] Workflow de aprovação customizável

---

## 📚 Referências

- [Assinafy Integration Analysis](./ASSINAFY_INTEGRATION_ANALYSIS.md)
- [Permissions and Modules](./PERMISSIONS_AND_MODULES.md)

---

**Última atualização:** 2024-01-XX

