# Componentes de Armazenamento

Este diretório contém componentes, hooks e utilitários para gerenciar o controle de armazenamento por empresa.

## 📦 Componentes Disponíveis

### 1. `StorageDashboard`

Dashboard completo de armazenamento com breakdown por empresa.

```tsx
import { StorageDashboard } from '../components/storage';

<StorageDashboard
  showCompaniesBreakdown={true}
  onRefresh={() => console.log('Atualizado')}
/>;
```

### 2. `StorageInfoCard`

Card compacto para exibir informações de armazenamento (ideal para Settings).

```tsx
import { StorageInfoCard } from '../components/storage';

<StorageInfoCard compact />;
```

### 3. `FileUploadWithValidation`

Componente de upload com validação automática de armazenamento.

```tsx
import { FileUploadWithValidation } from '../components/storage';

<FileUploadWithValidation
  onUpload={async file => {
    // Fazer upload
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
  }}
  maxSizeMB={10}
  accept='image/*'
/>;
```

### 4. `StorageManagementDashboard`

Dashboard completo com funcionalidade de upload integrada.

```tsx
import { StorageManagementDashboard } from '../components/storage';

<StorageManagementDashboard
  onUpload={async file => {
    // Implementar upload
  }}
/>;
```

## 🎣 Hooks Disponíveis

### `useCanUpload`

Verifica se pode fazer upload de um arquivo.

```tsx
import { useCanUpload } from '../hooks/useCanUpload';

const { checkCanUpload, checking } = useCanUpload();

const result = await checkCanUpload(file.size);
if (!result.canUpload) {
  alert(result.reason);
}
```

### `useTotalStorage`

Obtém uso consolidado de todas as empresas.

```tsx
import { useTotalStorage } from '../hooks/useTotalStorage';

const { data, loading, error, refetch } = useTotalStorage();
```

### `useCompanyStorage`

Obtém uso de uma empresa específica.

```tsx
import { useCompanyStorage } from '../hooks/useCompanyStorage';

const { data, loading, error, refetch } = useCompanyStorage(companyId, true);
```

### `useStorageLimits`

Obtém limites de armazenamento por plano.

```tsx
import { useStorageLimits } from '../hooks/useStorageLimits';

const { data, loading, error } = useStorageLimits();
```

## 🛠️ Utilitários

### `validateStorageBeforeUpload`

Valida armazenamento antes de fazer upload.

```tsx
import { validateStorageBeforeUpload } from '../utils/storageValidation';

try {
  const result = await validateStorageBeforeUpload(file.size, true);
  // Prosseguir com upload
} catch (error) {
  // Tratar erro de limite excedido
}
```

### `validateMultipleFilesStorage`

Valida múltiplos arquivos.

```tsx
import { validateMultipleFilesStorage } from '../utils/storageValidation';

const result = await validateMultipleFilesStorage(files);
```

### `formatBytes` e `formatGB`

Formatam tamanhos de arquivo.

```tsx
import { formatBytes, formatGB } from '../utils/storageValidation';

formatBytes(1024 * 1024); // "1 MB"
formatGB(1.5); // "1.50 GB"
```

## 🔌 Serviços

### `storageApi`

Serviço de API para controle de armazenamento.

```tsx
import { storageApi } from '../services/storageApi';

// Verificar se pode fazer upload
const canUpload = await storageApi.canUpload(fileSizeBytes);

// Obter uso total
const usage = await storageApi.getMyCompaniesStorage();

// Obter detalhes de uma empresa
const details = await storageApi.getCompanyStorageDetails(companyId);

// Obter limites
const limits = await storageApi.getStorageLimits();
```

## ✅ Integração Automática

A validação de armazenamento já está integrada automaticamente em:

- ✅ `documentApi.uploadDocument()` - Upload de documentos
- ✅ `galleryApi.uploadImages()` - Upload de imagens da galeria

Ambos os serviços verificam automaticamente o armazenamento antes de fazer upload.

## 📝 Exemplo Completo

```tsx
import React, { useState } from 'react';
import { FileUploadWithValidation } from '../components/storage';
import { useTotalStorage } from '../hooks/useTotalStorage';
import { storageApi } from '../services/storageApi';

function MyUploadPage() {
  const { data, refetch } = useTotalStorage();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      // Verificar novamente antes de upload (redundância)
      const canUpload = await storageApi.canUpload(file.size);
      if (!canUpload.canUpload) {
        alert(canUpload.reason);
        return;
      }

      // Fazer upload
      const formData = new FormData();
      formData.append('file', file);
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Atualizar dados de armazenamento
      refetch(true);
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload de Arquivo</h1>
      <FileUploadWithValidation
        onUpload={handleUpload}
        maxSizeMB={10}
        accept='image/*'
      />
      {data && (
        <div>
          <p>Uso: {data.totalSizeGB.toFixed(2)} GB</p>
        </div>
      )}
    </div>
  );
}
```

## 🎯 Boas Práticas

1. **Sempre validar antes de upload**: Use `validateStorageBeforeUpload` ou o componente `FileUploadWithValidation`
2. **Atualizar após upload**: Chame `refetch(true)` após uploads bem-sucedidos
3. **Tratar erros**: Sempre trate erros de limite excedido adequadamente
4. **Mostrar feedback**: Informe o usuário sobre o uso de armazenamento e limites
