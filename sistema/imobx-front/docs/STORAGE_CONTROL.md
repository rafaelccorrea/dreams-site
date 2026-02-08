# Guia Frontend - Controle de Armazenamento por Empresa

## 📋 Visão Geral

Este documento descreve o sistema de controle de armazenamento por empresa, onde **o armazenamento é contabilizado de todas as empresas de um usuário (owner) juntas**. Por exemplo, se um usuário tem 3 empresas, o limite de armazenamento é compartilhado entre as 3.

## 🎯 Conceito Principal

**IMPORTANTE:** O armazenamento não é por empresa individual, mas sim **consolidado de todas as empresas onde o usuário é owner**. Isso significa:

- Se um usuário tem 3 empresas e o plano permite 2 GB
- O limite de 2 GB é compartilhado entre as 3 empresas
- Se a Empresa A usa 0.5 GB, Empresa B usa 0.8 GB e Empresa C usa 0.3 GB
- O total usado é 1.6 GB de 2 GB disponíveis

## 🔌 APIs Disponíveis

### 1. Verificar se Pode Fazer Upload

**Endpoint:** `GET /storage/company/can-upload?fileSizeBytes={tamanho}`

**Descrição:** Verifica se o usuário pode fazer upload de um arquivo considerando o limite de armazenamento de todas as suas empresas.

**Autenticação:** Requerida (JWT Bearer Token)

**Parâmetros:**
- `fileSizeBytes` (obrigatório): Tamanho do arquivo em bytes

**Resposta:**

```json
{
  "canUpload": true,
  "totalStorageUsedGB": 1.5,
  "totalStorageLimitGB": 2,
  "remainingGB": 0.5,
  "wouldExceed": false
}
```

**Exemplo de Uso:**

```typescript
// Verificar antes de fazer upload
const fileSize = file.size; // em bytes
const response = await fetch(
  `/api/storage/company/can-upload?fileSizeBytes=${fileSize}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = await response.json();

if (!data.canUpload) {
  alert(`Não é possível fazer upload: ${data.reason}`);
  return;
}

// Prosseguir com upload
```

### 2. Obter Uso Total de Todas as Empresas

**Endpoint:** `GET /storage/company/my-companies`

**Descrição:** Retorna o uso consolidado de armazenamento de todas as empresas onde o usuário é owner.

**Autenticação:** Requerida (JWT Bearer Token)

**Query Parameters:**
- `forceRecalculate` (opcional): `true` para forçar recálculo (padrão: `false`)

**Resposta:**

```json
{
  "userId": "uuid",
  "totalCompanies": 3,
  "totalSizeBytes": 1610612736,
  "totalSizeMB": 1536,
  "totalSizeGB": 1.5,
  "totalFileCount": 150,
  "companies": [
    {
      "companyId": "uuid",
      "companyName": "Empresa 1",
      "totalSizeBytes": 536870912,
      "totalSizeMB": 512,
      "totalSizeGB": 0.5,
      "fileCount": 50,
      "imagesSizeBytes": 400000000,
      "imagesCount": 40,
      "documentsSizeBytes": 136870912,
      "documentsCount": 10,
      "otherFilesSizeBytes": 0,
      "otherFilesCount": 0,
      "calculatedAt": "2026-01-05T12:00:00.000Z"
    },
    {
      "companyId": "uuid",
      "companyName": "Empresa 2",
      "totalSizeBytes": 805306368,
      "totalSizeMB": 768,
      "totalSizeGB": 0.75,
      "fileCount": 75,
      "imagesSizeBytes": 600000000,
      "imagesCount": 60,
      "documentsSizeBytes": 205306368,
      "documentsCount": 15,
      "otherFilesSizeBytes": 0,
      "otherFilesCount": 0,
      "calculatedAt": "2026-01-05T12:00:00.000Z"
    },
    {
      "companyId": "uuid",
      "companyName": "Empresa 3",
      "totalSizeBytes": 268435456,
      "totalSizeMB": 256,
      "totalSizeGB": 0.25,
      "fileCount": 25,
      "imagesSizeBytes": 200000000,
      "imagesCount": 20,
      "documentsSizeBytes": 68435456,
      "documentsCount": 5,
      "otherFilesSizeBytes": 0,
      "otherFilesCount": 0,
      "calculatedAt": "2026-01-05T12:00:00.000Z"
    }
  ],
  "calculatedAt": "2026-01-05T12:00:00.000Z"
}
```

### 3. Obter Detalhes de Uma Empresa Específica

**Endpoint:** `GET /storage/company/company/:companyId`

**Descrição:** Retorna informações detalhadas sobre o uso de armazenamento de uma empresa específica, incluindo breakdown por tipo de arquivo.

**Autenticação:** Requerida (JWT Bearer Token)

**Query Parameters:**
- `forceRecalculate` (opcional): `true` para forçar recálculo

**Resposta:**

```json
{
  "usage": {
    "id": "uuid",
    "companyId": "uuid",
    "totalSizeBytes": 536870912,
    "totalSizeMB": 512,
    "totalSizeGB": 0.5,
    "fileCount": 50,
    "imagesSizeBytes": 400000000,
    "imagesCount": 40,
    "documentsSizeBytes": 136870912,
    "documentsCount": 10,
    "otherFilesSizeBytes": 0,
    "otherFilesCount": 0,
    "calculatedAt": "2026-01-05T12:00:00.000Z"
  },
  "company": {
    "id": "uuid",
    "name": "Empresa 1",
    "planType": "basic",
    "planFeatures": {
      "storageGB": 2
    }
  },
  "breakdown": {
    "images": {
      "sizeBytes": 400000000,
      "sizeMB": 381.47,
      "sizeGB": 0.37,
      "count": 40,
      "percentage": 75
    },
    "documents": {
      "sizeBytes": 136870912,
      "sizeMB": 130.52,
      "sizeGB": 0.13,
      "count": 10,
      "percentage": 25
    },
    "other": {
      "sizeBytes": 0,
      "sizeMB": 0,
      "sizeGB": 0,
      "count": 0,
      "percentage": 0
    }
  }
}
```

### 4. Obter Uso Básico de Uma Empresa

**Endpoint:** `GET /storage/company/company/:companyId/usage`

**Descrição:** Retorna apenas os dados básicos de uso de armazenamento de uma empresa.

**Autenticação:** Requerida (JWT Bearer Token)

**Resposta:**

```json
{
  "id": "uuid",
  "companyId": "uuid",
  "totalSizeBytes": 536870912,
  "totalSizeMB": 512,
  "totalSizeGB": 0.5,
  "fileCount": 50,
  "imagesSizeBytes": 400000000,
  "imagesCount": 40,
  "documentsSizeBytes": 136870912,
  "documentsCount": 10,
  "otherFilesSizeBytes": 0,
  "otherFilesCount": 0,
  "calculatedAt": "2026-01-05T12:00:00.000Z"
}
```

### 5. Obter Limites de Armazenamento por Plano

**Endpoint:** `GET /gallery/storage/limits`

**Descrição:** Retorna os limites de armazenamento configurados para cada plano (busca do banco de dados).

**Autenticação:** Requerida (JWT Bearer Token)

**Resposta:**

```json
{
  "plans": [
    {
      "plan": "basic",
      "limitGB": 2,
      "limitBytes": 2147483648,
      "description": "Plano Básico - 2 GB de armazenamento"
    },
    {
      "plan": "pro",
      "limitGB": 10,
      "limitBytes": 10737418240,
      "description": "Plano Pro - 10 GB de armazenamento"
    },
    {
      "plan": "custom",
      "limitGB": -1,
      "limitBytes": -1,
      "description": "Plano Personalizado - Armazenamento ilimitado"
    }
  ]
}
```

## 💻 Exemplos de Uso no Frontend

### TypeScript Interfaces

As interfaces TypeScript estão disponíveis em `src/types/storage.ts`:

```typescript
import type {
  CanUploadResponse,
  CompanyStorageInfo,
  UserTotalStorageInfo,
  CompanyStorageDetails,
  CompanyStorageUsage,
  StorageLimitsResponse,
} from '../types/storage';
```

### React Hook para Verificar Upload

```typescript
import { useCanUpload } from '../hooks/useCanUpload';

function MyComponent() {
  const { checkCanUpload, checking } = useCanUpload();

  const handleFileSelect = async (file: File) => {
    const result = await checkCanUpload(file.size);
    if (!result.canUpload) {
      alert(result.reason || 'Limite de armazenamento excedido');
      return;
    }
    // Prosseguir com upload
  };
}
```

### React Hook para Obter Uso Total

```typescript
import { useTotalStorage } from '../hooks/useTotalStorage';

function StorageComponent() {
  const { data, loading, error, refetch } = useTotalStorage();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <p>{data?.totalSizeGB.toFixed(2)} GB de {data?.totalStorageLimitGB} GB</p>
      <button onClick={() => refetch(true)}>Atualizar</button>
    </div>
  );
}
```

### Componente de Validação de Upload

```typescript
import { FileUploadWithValidation } from '../components/storage';

function MyUploadComponent() {
  const handleUpload = async (file: File) => {
    // Implementar lógica de upload
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <FileUploadWithValidation
      onUpload={handleUpload}
      maxSizeMB={10}
      accept="image/*"
    />
  );
}
```

### Componente de Dashboard de Armazenamento

```typescript
import { StorageDashboard } from '../components/storage';

function StoragePage() {
  return (
    <div>
      <h1>Armazenamento</h1>
      <StorageDashboard showCompaniesBreakdown={true} />
    </div>
  );
}
```

### Validação Antes de Upload (Exemplo Completo)

```typescript
import { storageApi } from '../services/storageApi';

async function uploadFileWithValidation(
  file: File,
  uploadUrl: string
): Promise<void> {
  // 1. Verificar se pode fazer upload
  const canUploadResponse = await storageApi.canUpload(file.size);

  if (!canUploadResponse.canUpload) {
    throw new Error(
      canUploadResponse.reason ||
        'Limite de armazenamento excedido'
    );
  }

  // 2. Prosseguir com upload
  const formData = new FormData();
  formData.append('file', file);

  await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
```

## 📊 Estrutura de Dados

### Breakdown de Armazenamento

O sistema rastreia o armazenamento por tipo de arquivo:

- **Imagens**: Arquivos de imagens de propriedades (`GalleryImage`)
- **Documentos**: Documentos de clientes e propriedades (`Document`)
- **Outros**: Outros tipos de arquivos (futuro)

### Cálculo de Armazenamento

O armazenamento é calculado somando:
- `GalleryImage.fileSize` (todas as imagens de todas as empresas do owner)
- `Document.fileSize` (todos os documentos de todas as empresas do owner)

### Cache

Os dados são cacheados por **1 hora**. Após esse período, são recalculados automaticamente. Você pode forçar o recálculo usando `forceRecalculate=true`.

## 🔒 Validações Automáticas

O sistema **bloqueia automaticamente** uploads que excederiam o limite:

1. **Upload de Imagens de Propriedades**: Validado antes do upload
2. **Upload de Documentos**: Validado antes do upload
3. **Upload de Imagens na Galeria**: Validado antes do upload

Todas as validações consideram o **armazenamento total de todas as empresas do owner**.

## ⚠️ Comportamento de Erros

Quando um upload é bloqueado, a API retorna:

```json
{
  "statusCode": 403,
  "message": "Upload excederia o limite de armazenamento. Uso atual: 1.50 GB, Limite: 2 GB, Espaço disponível: 0.50 GB",
  "error": "Forbidden"
}
```

## 📝 Notas Importantes

1. **Armazenamento Consolidado**: O limite é compartilhado entre todas as empresas do owner
2. **Cache**: Dados são cacheados por 1 hora para performance
3. **Recálculo Automático**: Job periódico recalcula diariamente às 2h da manhã
4. **Limites Dinâmicos**: Limites são buscados do banco de dados (`plan.features.storageGB`)
5. **Planos Customizados**: Podem ter armazenamento ilimitado (`storageGB: -1`)

## 🔄 Fluxo Recomendado no Frontend

1. **Antes de mostrar o botão de upload**: Verificar `can-upload` para desabilitar se necessário
2. **Ao selecionar arquivo**: Verificar novamente `can-upload` com o tamanho do arquivo
3. **Antes de enviar**: Verificar uma última vez (pode ter mudado)
4. **Após upload bem-sucedido**: Atualizar o dashboard de armazenamento

## 📈 Exemplo de Dashboard Completo

```typescript
import { StorageManagementDashboard } from '../components/storage';

function StorageManagementPage() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div>
      <h1>Gerenciamento de Armazenamento</h1>
      <StorageManagementDashboard onUpload={handleUpload} />
    </div>
  );
}
```

## 🔍 Troubleshooting

### Erro: "Upload excederia o limite de armazenamento"

**Causa:** O upload do arquivo faria o uso total exceder o limite do plano.

**Solução:**
1. Verificar uso atual: `GET /storage/company/my-companies`
2. Verificar limite do plano: `GET /gallery/storage/limits`
3. Remover arquivos antigos se necessário
4. Considerar upgrade de plano

### Dados Parecem Desatualizados

**Causa:** Cache pode estar desatualizado (cache de 1 hora).

**Solução:**
- Usar `forceRecalculate=true` no endpoint para forçar recálculo
- Aguardar o job periódico (executa diariamente às 2h)

### Limite Não Está Sendo Respeitado

**Causa:** Pode haver um problema na validação.

**Solução:**
- Verificar se o endpoint `can-upload` está sendo chamado antes do upload
- Verificar se o backend está validando corretamente (logs do servidor)

## 🔄 Última Atualização

**Data:** 05/01/2026

**Versão da API:** 1.0

**Status:** ✅ Implementado e Funcional

---

Para mais informações sobre a API de armazenamento, consulte a documentação Swagger em `/api-docs`.







