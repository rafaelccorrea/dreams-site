# 📋 Análise e Proposta de Integração - Assinafy

## 🎯 Objetivo

Integrar o sistema de assinatura de documentos via Assinafy no frontend, permitindo:
- **Corretor (autenticado)**: Enviar documentos para assinatura, monitorar status, gerenciar assinaturas
- **Signatário (externo)**: Assinar documentos sem necessidade de autenticação
- **Ambos**: Corretor e comprador podem assinar (dependendo do fluxo)
- Receber notificações em tempo real quando eventos ocorrem

---

## ⚠️ Pontos Críticos: Assinatura por Usuários Externos e Múltiplas Assinaturas

### 1. **Tipos de Signatários Suportados**

O sistema suporta **3 tipos de signatários**:

1. **Cliente do Sistema** (`clientId`)
   - Cliente cadastrado no sistema
   - Notificação vai para o corretor responsável

2. **Usuário do Sistema** (`userId`)
   - Corretor ou usuário interno
   - Notificação vai para o próprio usuário

3. **Signatário Externo** (sem `clientId` nem `userId`)
   - Pessoa que não está no sistema
   - Apenas `signerName` e `signerEmail` são obrigatórios
   - Notificação vai para quem fez upload do documento

### 2. **Múltiplas Assinaturas**

**Um mesmo documento pode ter múltiplas assinaturas** (ex: 5 signatários diferentes):
- Cada assinatura é independente
- Cada signatário pode ser cliente, usuário ou externo
- Status de cada assinatura é rastreado separadamente
- Documento só fica "completo" quando **todos** assinarem

### 3. **URL de Assinatura**

- **`signatureUrl` é gerado AUTOMATICAMENTE** pelo backend
- Sempre retornado na resposta da API ao criar assinatura
- É uma URL **externa** do Assinafy (ex: `https://app.assinafy.com.br/sign?signer-access-code=abc123`)
- Pode ser copiado e enviado via WhatsApp, SMS, email, etc.
- **NÃO precisa de página pública intermediária** - pode redirecionar direto para Assinafy

---

## 📊 Análise da Estrutura Atual

### ✅ O que já existe:

1. **Módulo de Documentos Completo**
   - `src/components/documents/` - Componentes de UI
   - `src/services/documentApi.ts` - API de documentos
   - `src/hooks/useDocuments.ts` - Hook para gerenciar documentos
   - `src/types/document.ts` - Tipos TypeScript
   - `src/pages/DocumentsPage.tsx` - Página principal
   - `src/pages/DocumentDetailsPage.tsx` - Página de detalhes

2. **Sistema de Notificações WebSocket**
   - `src/services/notificationApi.ts` - Serviço de notificações
   - `src/hooks/useNotifications.ts` - Hook para notificações
   - Já recebe eventos em tempo real via WebSocket
   - Suporta notificações por empresa (`companyId`)

3. **Infraestrutura de API**
   - `src/services/api.ts` - Cliente axios configurado
   - `companyId` enviado via header `X-Company-ID`
   - Base URL: `https://api.dreamkeys.com.br`

4. **Página Pública Existente** ✅
   - `src/PublicApp.tsx` - Página pública para upload de documentos
   - Rota: `/public/upload-documents/:token`
   - Funciona sem autenticação
   - Validação por CPF/token
   - **Pode ser usada como referência para página de assinatura pública**

---

## 🏗️ Proposta de Arquitetura

### 1. **Estrutura de Arquivos**

```
src/
├── types/
│   └── documentSignature.ts          # Novos tipos para assinaturas
├── services/
│   ├── documentSignatureApi.ts        # API de assinaturas
│   └── assinafyApi.ts                # API direta do Assinafy
├── hooks/
│   └── useDocumentSignatures.ts      # Hook para gerenciar assinaturas
├── components/
│   └── documents/
│       ├── DocumentSignatureCard.tsx      # Card de assinatura
│       ├── DocumentSignatureList.tsx     # Lista de assinaturas
│       ├── DocumentSignatureTimeline.tsx # Timeline de eventos
│       ├── SendDocumentForSignatureModal.tsx # Modal para enviar
│       ├── SignatureStatusBadge.tsx        # Badge de status
│       └── SignatureActions.tsx            # Ações (reenviar, cancelar)
├── pages/
│   └── DocumentSignaturesPage.tsx    # Página de assinaturas (autenticada)
└── PublicApp.tsx                      # ⚠️ ATUALIZAR: Adicionar rota de assinatura pública
```

**Observação**: A página pública de assinatura pode ser:
- **Opção 1**: Redirecionar diretamente para `signatureUrl` (Assinafy)
- **Opção 2**: Criar página intermediária em `PublicApp.tsx` (similar ao upload)

### 2. **Fluxo de Integração**

#### **A. Enviar Documento para Assinatura** (Corretor Autenticado)

**Localização:** `DocumentDetailsPage.tsx` e `DocumentsTable.tsx`

**Componente:** `SendDocumentForSignatureModal.tsx`

**Fluxo:**
1. Corretor clica em "Enviar para Assinatura" no documento
2. Modal abre com formulário:
   - **Tipo de signatário** (seleção):
     - Cliente do sistema (buscar cliente)
     - Usuário do sistema (buscar usuário)
     - Signatário externo (apenas nome e email)
   - Nome do signatário (`signerName` - obrigatório)
   - Email do signatário (`signerEmail` - obrigatório)
   - CPF (opcional)
   - Telefone (opcional)
   - Data de expiração (`expiresAt` - opcional)
   - **Enviar email automaticamente** (`sendEmail: true/false`)
3. Ao confirmar:
   - Marca documento como `isForSignature: true` (se ainda não estiver)
   - Cria assinatura via `POST /documents/:id/signatures`
     - Backend retorna `signatureUrl` **automaticamente**
     - Se `sendEmail: true`, email é enviado automaticamente
   - **Pode repetir para múltiplos signatários** (criar várias assinaturas)

**⚠️ Importante:**
- `signatureUrl` é gerado automaticamente pelo backend
- Não precisa fazer upload/atribuição manualmente - backend faz tudo
- Pode criar múltiplas assinaturas para o mesmo documento
- Cada assinatura tem seu próprio `signatureUrl`

#### **B. Signatário Acessa URL de Assinatura** (Usuário Externo/Cliente/Usuário)

**Localização:** URL externa do Assinafy (`signatureUrl`)

**Fluxo Signatário:**
1. Recebe `signatureUrl` por:
   - Email (se `sendEmail: true`)
   - WhatsApp/SMS (corretor copia e envia)
   - Link direto compartilhado
2. Clica no link → Acessa `signatureUrl` diretamente no Assinafy
   - **NÃO precisa de página intermediária** - URL já é completa
   - Assinafy gerencia todo o processo de assinatura
3. Visualiza documento no Assinafy
4. Assina ou rejeita
5. Assinafy processa e dispara webhook
6. Backend atualiza status automaticamente
7. Corretor recebe notificação em tempo real via WebSocket

**⚠️ Importante:**
- `signatureUrl` já vem completa do backend
- Não precisa criar página pública intermediária
- Signatário acessa diretamente o Assinafy
- Funciona para: clientes, usuários internos e signatários externos

#### **C. Visualizar Assinaturas** (Corretor Autenticado)

**Localização:** `DocumentDetailsPage.tsx`

**Componente:** `DocumentSignatureList.tsx`

**Exibe:**
- Lista de assinaturas do documento
- Status de cada assinatura (badge colorido)
- Timeline de eventos
- Estatísticas (total, pendentes, assinadas, rejeitadas)
- Link para copiar `signatureUrl` e reenviar

#### **D. Monitoramento em Tempo Real** (Corretor Autenticado)

**Localização:** `useDocumentSignatures.ts` hook

**Integração:**
- Hook `useNotifications` já recebe eventos WebSocket
- Filtrar notificações do tipo `document_signed`, `document_rejected`
- Atualizar estado local quando notificação chegar
- Atualizar UI automaticamente
- Mostrar toast/notificação visual

#### **E. Lista de Assinaturas Pendentes** (Corretor Autenticado)

**Localização:** Nova página ou widget no Dashboard

**Componente:** `DocumentSignaturesPage.tsx` ou widget

**Funcionalidades:**
- Lista todas as assinaturas pendentes da empresa
- Filtros por status, cliente, documento
- Ações rápidas (reenviar, cancelar, renovar expiração)
- Link para copiar `signatureUrl`

---

## 🔧 Implementação Técnica

### 1. **Tipos TypeScript** (`src/types/documentSignature.ts`)

```typescript
export enum DocumentSignatureStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  SIGNED = 'signed',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface DocumentSignature {
  id: string;
  documentId: string;
  companyId: string;
  clientId?: string;
  userId?: string;
  status: DocumentSignatureStatus;
  signerName: string;
  signerEmail: string;
  signerPhone?: string;
  signerCpf?: string;
  expiresAt?: Date | string;
  viewedAt?: Date | string;
  signedAt?: Date | string;
  rejectedAt?: Date | string;
  rejectionReason?: string;
  assinafyDocumentId?: string;
  assinafySignerId?: string;
  assinafyAssignmentId?: string;
  signatureUrl?: string;
  signerAccessCode?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  document?: {
    id: string;
    title: string;
    originalName: string;
  };
  client?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateSignatureDto {
  clientId?: string;        // Se for cliente do sistema
  userId?: string;          // Se for usuário do sistema
  signerName: string;       // Obrigatório
  signerEmail: string;      // Obrigatório
  signerPhone?: string;
  signerCpf?: string;
  expiresAt?: string;       // Data de expiração (opcional)
  sendEmail?: boolean;      // Enviar email automaticamente (opcional)
  metadata?: Record<string, any>;
}

export interface SignatureStats {
  total: number;
  pending: number;
  viewed: number;
  signed: number;
  rejected: number;
  expired: number;
}
```

### 2. **API Service** (`src/services/documentSignatureApi.ts`)

```typescript
import { api } from './api';
import type { DocumentSignature, CreateSignatureDto, SignatureStats } from '../types/documentSignature';

const BASE_URL = '/documents';

export const documentSignatureApi = {
  // Criar assinatura
  createSignature: async (
    documentId: string,
    data: CreateSignatureDto,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.post(
      `${BASE_URL}/${documentId}/signatures?companyId=${companyId}`,
      data
    );
    // signatureUrl é retornado automaticamente na resposta
    return response.data;
  },

  // Enviar link por email
  sendSignatureEmail: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<void> => {
    await api.post(
      `${BASE_URL}/${documentId}/signatures/${signatureId}/send-email?companyId=${companyId}`
    );
  },

  // Listar assinaturas de um documento
  listSignatures: async (
    documentId: string,
    companyId: string
  ): Promise<DocumentSignature[]> => {
    const response = await api.get(
      `${BASE_URL}/${documentId}/signatures?companyId=${companyId}`
    );
    return response.data;
  },

  // Obter estatísticas
  getStats: async (
    documentId: string,
    companyId: string
  ): Promise<SignatureStats> => {
    const response = await api.get(
      `${BASE_URL}/${documentId}/signatures/stats?companyId=${companyId}`
    );
    return response.data;
  },

  // Obter assinatura específica
  getSignature: async (
    documentId: string,
    signatureId: string,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.get(
      `${BASE_URL}/${documentId}/signatures/${signatureId}?companyId=${companyId}`
    );
    return response.data;
  },

  // Listar assinaturas por cliente
  listByClient: async (
    clientId: string,
    companyId: string,
    status?: string
  ): Promise<DocumentSignature[]> => {
    const params = new URLSearchParams({ companyId });
    if (status) params.append('status', status);
    const response = await api.get(
      `/signatures/client/${clientId}?${params.toString()}`
    );
    return response.data;
  },

  // Listar assinaturas pendentes
  listPending: async (companyId: string): Promise<DocumentSignature[]> => {
    const response = await api.get(
      `/signatures/pending?companyId=${companyId}`
    );
    return response.data;
  },

  // Atualizar assinatura
  updateSignature: async (
    documentId: string,
    signatureId: string,
    data: Partial<DocumentSignature>,
    companyId: string
  ): Promise<DocumentSignature> => {
    const response = await api.put(
      `${BASE_URL}/${documentId}/signatures/${signatureId}?companyId=${companyId}`,
      data
    );
    return response.data;
  },
};
```

### 3. **API Assinafy** (`src/services/assinafyApi.ts`)

```typescript
import { api } from './api';

export interface AssinafyDocument {
  id: string;
  name: string;
  status: string;
  // ... outros campos
}

export interface AssinafySigner {
  id: string;
  email: string;
  full_name: string;
  // ... outros campos
}

export interface AssinafyAssignment {
  id: string;
  document_id: string;
  // ... outros campos
}

export const assinafyApi = {
  // Upload de documento
  uploadDocument: async (file: File): Promise<AssinafyDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/assinafy/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Criar signatário
  createSigner: async (data: {
    full_name: string;
    email: string;
    phone?: string;
    cpf?: string;
  }): Promise<AssinafySigner> => {
    const response = await api.post('/assinafy/signers', data);
    return response.data;
  },

  // Criar atribuição virtual
  createVirtualAssignment: async (
    documentId: string,
    data: {
      method: 'virtual';
      signer_ids: string[];  // Array de IDs dos signatários
      message?: string;
      expires_at?: string;
      copy_receivers?: string[];
    }
  ): Promise<AssinafyAssignment> => {
    const response = await api.post(
      `/assinafy/documents/${documentId}/assignments/virtual`,
      data
    );
    return response.data;
  },

  // Reenviar assinatura
  resendSignature: async (
    documentId: string,
    assignmentId: string,
    email: string
  ): Promise<void> => {
    await api.put(
      `/assinafy/documents/${documentId}/assignments/${assignmentId}/resend`,
      { email }
    );
  },

  // Renovar expiração
  resetExpiration: async (
    documentId: string,
    assignmentId: string,
    expiresAt: string | null
  ): Promise<void> => {
    await api.put(
      `/assinafy/documents/${documentId}/assignments/${assignmentId}/reset-expiration`,
      { expires_at: expiresAt }
    );
  },

  // Reenviar assinatura
  resendSignature: async (
    documentId: string,
    assignmentId: string,
    signerId: string
  ): Promise<void> => {
    await api.put(
      `/assinafy/documents/${documentId}/assignments/${assignmentId}/signers/${signerId}/resend`
    );
  },

  // Renovar expiração
  resetExpiration: async (
    documentId: string,
    assignmentId: string,
    expiresAt: string
  ): Promise<void> => {
    await api.put(
      `/assinafy/documents/${documentId}/assignments/${assignmentId}/reset-expiration`,
      { expires_at: expiresAt }
    );
  },
};
```

### 4. **Página Pública de Assinatura** ⚠️ NÃO NECESSÁRIA

**IMPORTANTE**: Com a atualização do backend, **NÃO é necessário criar página pública intermediária**!

**Motivo:**
- `signatureUrl` já vem completa do backend ao criar assinatura
- É uma URL externa do Assinafy (ex: `https://app.assinafy.com.br/sign?signer-access-code=abc123`)
- Signatário pode acessar diretamente essa URL
- Assinafy gerencia todo o processo

**Se ainda quiser criar página intermediária** (opcional, para tracking/instruções):
- Criar endpoint público: `GET /public/signatures/:signatureId`
- Retornar informações básicas da assinatura
- Redirecionar para `signatureUrl`
- Mas **não é obrigatório** - pode usar `signatureUrl` diretamente

### 5. **Hook de Assinaturas** (`src/hooks/useDocumentSignatures.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { documentSignatureApi } from '../services/documentSignatureApi';
import { useNotifications } from './useNotifications';
import { useCompany } from '../contexts/CompanyContext';
import type { DocumentSignature, CreateSignatureDto } from '../types/documentSignature';

export const useDocumentSignatures = (documentId?: string) => {
  const { selectedCompanyId } = useCompany();
  const { notifications } = useNotifications();
  const [signatures, setSignatures] = useState<DocumentSignature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar assinaturas
  const loadSignatures = useCallback(async () => {
    if (!documentId || !selectedCompanyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await documentSignatureApi.listSignatures(documentId, selectedCompanyId);
      setSignatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar assinaturas');
    } finally {
      setLoading(false);
    }
  }, [documentId, selectedCompanyId]);

  // Escutar notificações de assinatura
  useEffect(() => {
    if (!notifications) return;

    const signatureNotifications = notifications.filter(
      (n) =>
        n.type === 'document_signed' ||
        n.type === 'document_rejected' ||
        (n.metadata?.documentId === documentId)
    );

    if (signatureNotifications.length > 0 && documentId) {
      // Recarregar assinaturas quando notificação chegar
      loadSignatures();
    }
  }, [notifications, documentId, loadSignatures]);

  // Carregar ao montar ou quando documentId mudar
  useEffect(() => {
    loadSignatures();
  }, [loadSignatures]);

  return {
    signatures,
    loading,
    error,
    refresh: loadSignatures,
  };
};
```

---

## 📍 Locais de Integração

### 1. **Página Pública: Assinatura de Documento** ⚠️ NÃO NECESSÁRIA

**Status:** Com a atualização do backend, **NÃO é necessário criar página pública**!

**Motivo:**
- `signatureUrl` já vem completa e pronta para uso
- Signatário acessa diretamente o Assinafy
- Não precisa de página intermediária

**Se quiser criar** (opcional, para tracking/analytics):
- Endpoint público: `GET /public/signatures/:signatureId`
- Mostrar informações básicas
- Redirecionar para `signatureUrl`
- Mas **não é obrigatório** - pode usar `signatureUrl` diretamente

### 2. **DocumentDetailsPage.tsx** (Corretor Autenticado)

**Adicionar:**
- Seção "Assinaturas" após "Segurança e Auditoria"
- Componente `DocumentSignatureList` mostrando todas as assinaturas
- Botão "Enviar para Assinatura" na seção de ações
- Badge indicando se documento tem assinaturas pendentes
- Link para copiar `signatureUrl` de cada assinatura

### 3. **DocumentsTable.tsx** (Corretor Autenticado)

**Adicionar:**
- Coluna "Assinaturas" mostrando status resumido
- Badge indicando quantidade de assinaturas pendentes
- Ação "Enviar para Assinatura" no menu de ações

### 4. **Dashboard** (Corretor Autenticado - opcional)

**Adicionar:**
- Widget "Assinaturas Pendentes" mostrando:
  - Quantidade de assinaturas pendentes
  - Lista resumida dos documentos
  - Link para página completa

### 5. **Nova Página: DocumentSignaturesPage.tsx** (Corretor Autenticado - opcional)

**Funcionalidades:**
- Lista todas as assinaturas da empresa
- Filtros por status, cliente, documento
- Ações em massa
- Estatísticas gerais
- Links para copiar `signatureUrl`

---

## 🔔 Integração com Notificações

### Eventos WebSocket a Escutar:

1. **`document_signed`** - Documento assinado
2. **`document_rejected`** - Documento rejeitado
3. **`document_processing_failed`** - Erro no processamento

### Como Integrar:

O hook `useNotifications` já recebe todas as notificações. Basta:

1. Filtrar notificações relacionadas a assinaturas
2. Atualizar estado local quando notificação chegar
3. Atualizar UI automaticamente

**Exemplo no hook:**

```typescript
useEffect(() => {
  const signatureNotifications = notifications.filter(
    (n) => n.type === 'document_signed' || n.type === 'document_rejected'
  );

  if (signatureNotifications.length > 0) {
    // Recarregar assinaturas
    loadSignatures();
    
    // Mostrar toast/notificação visual
    signatureNotifications.forEach(n => {
      toast.success(n.message);
    });
  }
}, [notifications]);
```

---

## 🎨 Componentes UI Necessários

### 1. **SignatureStatusBadge.tsx**
- Badge colorido com status
- Ícone correspondente
- Tooltip com informações

### 2. **DocumentSignatureCard.tsx**
- Card mostrando uma assinatura
- Status, nome do signatário, datas
- Ações (reenviar, cancelar)

### 3. **DocumentSignatureList.tsx**
- Lista de assinaturas de um documento
- Estatísticas no topo
- Cards de assinaturas

### 4. **DocumentSignatureTimeline.tsx**
- Timeline de eventos (enviado, visualizado, assinado)
- Datas e horários
- Ícones visuais

### 5. **SendDocumentForSignatureModal.tsx**
- Modal para enviar documento
- Formulário com dados do signatário
- Validações
- Loading durante processo

### 6. **SignatureActions.tsx**
- Botões de ação (reenviar, cancelar, renovar)
- Confirmações
- Feedback visual

---

## ✅ Checklist de Implementação

### Fase 1: Fundação
- [ ] Criar tipos TypeScript (`documentSignature.ts`)
- [ ] Criar API service (`documentSignatureApi.ts`)
- [ ] Criar API Assinafy (`assinafyApi.ts`)
- [ ] Criar hook (`useDocumentSignatures.ts`)
- [ ] **NÃO precisa criar página pública** - `signatureUrl` já vem do backend

### Fase 2: Componentes Base
- [ ] `SignatureStatusBadge.tsx`
- [ ] `DocumentSignatureCard.tsx`
- [ ] `DocumentSignatureList.tsx`
- [ ] `DocumentSignatureTimeline.tsx`
- [ ] **NÃO precisa de página pública** - usar `signatureUrl` diretamente

### Fase 3: Funcionalidades
- [ ] `SendDocumentForSignatureModal.tsx` (com suporte a 3 tipos de signatários)
- [ ] `SignatureActions.tsx` (reenviar, enviar email, renovar expiração)
- [ ] Integrar em `DocumentDetailsPage.tsx`
- [ ] Integrar em `DocumentsTable.tsx`
- [ ] Suporte a múltiplas assinaturas no mesmo documento

### Fase 4: Notificações
- [ ] Integrar eventos WebSocket no hook
- [ ] Atualizar UI quando notificação chegar
- [ ] Mostrar toasts/notificações visuais

### Fase 5: Melhorias
- [ ] Página de assinaturas pendentes (opcional)
- [ ] Widget no Dashboard (opcional)
- [ ] Filtros e busca
- [ ] Ações em massa

---

## 🚀 Próximos Passos

1. **Revisar esta proposta** com a equipe
2. **Aprovar arquitetura** e estrutura de arquivos
3. **Iniciar implementação** pela Fase 1
4. **Testar integração** com backend
5. **Iterar** baseado em feedback

---

## 📝 Observações Importantes

### 🔐 Segurança e Autenticação

1. **CompanyId**: Sempre passar `companyId` como query param nas requisições autenticadas
2. **Autenticação**: 
   - **Corretor**: Token JWT já é enviado automaticamente via interceptor
   - **Signatário**: **NÃO precisa de autenticação** - acesso público via `signatureUrl`
3. **URLs Públicas**: 
   - Rotas públicas devem estar em `PublicApp.tsx` ou configuradas como públicas
   - Não exigir autenticação para acessar `signatureUrl`
   - Validar `signatureId` na URL pública

### 🔄 Fluxo de Assinatura

4. **URL de Assinatura (`signatureUrl`)**:
   - **Gerada automaticamente** pelo backend ao criar assinatura
   - Sempre retornada na resposta da API
   - É uma URL **externa** do Assinafy (ex: `https://app.assinafy.com.br/sign?signer-access-code=abc123`)
   - Signatário acessa diretamente (sem login no nosso sistema)
   - Pode ser enviada por email automaticamente (`sendEmail: true`)
   - Pode ser copiada e enviada via WhatsApp, SMS, etc.

5. **Página Pública Intermediária**:
   - **NÃO é necessária** - `signatureUrl` já vem completa
   - Signatário pode acessar diretamente o Assinafy
   - Se quiser criar (opcional), apenas para tracking/analytics

### ⚙️ Técnico

6. **WebSocket**: Sistema de notificações já está configurado
7. **Validações**: Validar email, CPF, datas antes de enviar
8. **Tratamento de Erros**: Tratar erros da API Assinafy adequadamente
9. **Loading States**: Mostrar loading durante operações assíncronas
10. **Feedback Visual**: Usar toasts para feedback de ações

### 👥 Cenários de Uso

11. **3 Tipos de Signatários**:
    - **Cliente do Sistema** (`clientId`): Cliente cadastrado, notificação vai para corretor
    - **Usuário do Sistema** (`userId`): Corretor/usuário interno, notificação vai para ele
    - **Signatário Externo**: Não está no sistema, apenas nome/email, notificação vai para quem fez upload

12. **Múltiplas Assinaturas**:
    - Um documento pode ter várias assinaturas
    - Cada assinatura é independente
    - Cada signatário pode ser de tipo diferente
    - Documento só fica completo quando todos assinarem

13. **Envio de Email**:
    - `sendEmail: true` envia email automaticamente
    - Ou usar `POST /documents/:id/signatures/:sigId/send-email` para enviar depois
    - Link pode ser copiado e enviado via WhatsApp, SMS, etc.

---

**Última atualização:** 08/12/2024

