# ⚙️ Tela de Configurações do Usuário

Esta documentação descreve a tela de **Configurações** (`/settings`), onde o usuário pode personalizar sua experiência, gerenciar dados, segurança e preferências do sistema.

---

## 📋 Visão Geral

A tela de Configurações é uma página centralizada que permite ao usuário:

- **Personalizar aparência** (tema, idioma)
- **Gerenciar dados** (backup, sincronização, export/import)
- **Configurar segurança** (dispositivos, privacidade)
- **Controlar analytics** (compartilhamento de dados)
- **Acessar ajuda** (suporte, informações do sistema)

**Rota**: `/settings`  
**Arquivo Principal**: `src/pages/SettingsPage.tsx`

---

## 📁 Estrutura de Arquivos

```
src/
├── pages/
│   └── SettingsPage.tsx              # Componente principal da página
├── components/
│   └── modals/
│       ├── UserPreferencesModal.tsx  # Modal de preferências pessoais
│       └── DevicesManagerModal.tsx   # Modal de gerenciamento de dispositivos
├── services/
│   ├── settingsApi.ts                # API de configurações
│   └── userPreferencesService.ts     # Serviço de preferências do usuário
├── hooks/
│   ├── useTheme.ts                   # Hook de tema
│   └── useUserPreferences.ts         # Hook de preferências
├── styles/
│   └── pages/
│       └── SettingsPageStyles.ts     # Estilos da página
└── types/
    └── user-preferences.types.ts     # Tipos TypeScript
```

---

## 🎨 Estrutura da Interface

A página é dividida em **seções principais**:

### 1. **Cabeçalho**
- Título: "Configurações"
- Subtítulo: "Personalize sua experiência e gerencie as configurações do sistema"

### 2. **Estatísticas Rápidas** (Cards)
- Configurações Ativas
- Dados Sincronizados (tamanho do localStorage)
- Dispositivos Conectados

### 3. **Ações Rápidas** (Cards clicáveis)
- Backup
- Sincronizar
- Limpar Cache
- Restaurar

### 4. **Seções de Configuração**

#### 4.1. **Aparência**
- Tema (Claro/Escuro)
- Idioma (Português BR)

#### 4.2. **Dados e Armazenamento**
- Backup Automático
- Sincronização em Nuvem
- Analytics

#### 4.3. **Segurança e Privacidade**
- Política de Privacidade
- Dispositivos Conectados

#### 4.4. **Sistema**
- Exportar Dados
- Importar Dados
- Limpar Cache

#### 4.5. **Ajuda e Suporte**
- Central de Ajuda
- Sobre o Sistema (versão)

---

## 🔧 Funcionalidades Detalhadas

### 1. Tema (Aparência)

**Funcionalidade**: Alternar entre tema claro e escuro

**Implementação**:
```typescript
const { theme, toggleTheme } = useTheme();

<ToggleSwitch $isOn={theme === 'dark'}>
  <ToggleInput
    type="checkbox"
    checked={theme === 'dark'}
    onChange={handleThemeToggle}
  />
  <ToggleSlider $isOn={theme === 'dark'} />
</ToggleSwitch>
```

**Comportamento**:
- Alterna entre `'light'` e `'dark'`
- Persistido no localStorage via `useTheme`
- Aplicado globalmente na aplicação

---

### 2. Analytics

**Funcionalidade**: Controlar compartilhamento de dados de uso

**API**:
```typescript
// Carregar configuração
const analytics = await settingsApi.getAnalytics();
// { enabled: boolean }

// Atualizar configuração
await settingsApi.updateAnalytics(enabled);
```

**Fluxo**:
1. Carrega configuração do backend ao montar componente
2. Exibe toggle com estado atual
3. Ao alterar, salva no backend imediatamente
4. Em caso de erro, reverte para valor anterior

**Código**:
```typescript
// Carregar ao montar
useEffect(() => {
  const load = async () => {
    try {
      const anal = await settingsApi.getAnalytics().catch(() => null);
      if (anal) {
        setAnalytics(!!anal.enabled);
      }
    } catch (e: any) {
      toast.warning(e?.message || 'Não foi possível carregar configurações.');
    }
  };
  load();
}, []);

// Salvar ao alterar
const persistAnalytics = async (enabled: boolean) => {
  try {
    await settingsApi.updateAnalytics(enabled);
    toast.success('Configuração de analytics salva.');
  } catch (e: any) {
    toast.error(e?.message || 'Falha ao salvar analytics.');
    // Reverter para valor anterior
    const remote = await settingsApi.getAnalytics();
    setAnalytics(!!remote.enabled);
  }
};
```

---

### 3. Backup Automático

**Funcionalidade**: Toggle para ativar/desativar backup automático

**Estado**: Local (não persistido no backend ainda)

**Comportamento**:
- Toggle visual apenas
- Estado local (`autoBackup`)
- Pode ser integrado com backend futuramente

---

### 4. Exportar Dados

**Funcionalidade**: Baixar todas as configurações como JSON

**API**:
```typescript
const data = await settingsApi.exportSettings();
```

**Fluxo**:
1. Chama API `/settings/export`
2. Recebe JSON com todas as configurações
3. Cria blob e faz download automático
4. Nome do arquivo: `settings-{timestamp}.json`

**Código**:
```typescript
const handleExportData = () => {
  settingsApi.exportSettings()
    .then((data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Configurações exportadas.');
    })
    .catch(() => toast.error('Falha ao exportar configurações.'));
};
```

**Formato Exportado**:
```json
{
  "preferences": {
    "defaultHomeScreen": "dashboard",
    "themeSettings": { "theme": "light", "language": "pt-BR" },
    "notificationSettings": { "general": true, "email": true, "push": false },
    "layoutSettings": { "sidebar": "expanded", "grid": "normal" }
  },
  "analytics": { "enabled": true },
  "exportedAt": "2024-01-20T12:00:00Z"
}
```

---

### 5. Importar Dados

**Funcionalidade**: Importar configurações de um arquivo JSON

**API**:
```typescript
await settingsApi.importSettings(payload);
```

**Fluxo**:
1. Usuário clica em "Importar"
2. Abre seletor de arquivo (input oculto)
3. Lê arquivo JSON
4. Valida formato
5. Envia para API `/settings/import`
6. Mostra feedback de sucesso/erro

**Código**:
```typescript
const handleImportData = () => {
  importInputRef.current?.click();
};

const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || '{}'));
      settingsApi.importSettings(payload)
        .then(() => {
          toast.success('Configurações importadas.');
        })
        .catch(() => toast.error('Falha ao importar configurações.'));
    } catch {
      toast.error('Arquivo inválido.');
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };
  reader.readAsText(file);
};
```

---

### 6. Limpar Cache

**Funcionalidade**: Remover dados temporários do localStorage

**Comportamento**:
- Remove todas as chaves do localStorage **exceto**:
  - `auth_token`
  - `user_info`
- Mostra toast de sucesso/erro

**Código**:
```typescript
const handleClearCache = () => {
  try {
    const preserveKeys = new Set<string>([
      'auth_token',
      'user_info',
    ]);
    const toDelete: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) as string;
      if (!preserveKeys.has(k)) toDelete.push(k);
    }
    
    toDelete.forEach(k => localStorage.removeItem(k));
    toast.success('Cache limpo com sucesso.');
  } catch {
    toast.error('Falha ao limpar cache.');
  }
};
```

---

### 7. Backup Manual

**Funcionalidade**: Criar backup completo no servidor

**API**:
```typescript
await settingsApi.createBackup('backup-manual');
```

**Fluxo**:
1. Chama API `/settings/backup` com label opcional
2. Backend cria backup completo
3. Mostra toast de sucesso

**Código**:
```typescript
const handleBackup = () => {
  settingsApi.createBackup('backup-manual')
    .then(() => toast.success('Backup solicitado com sucesso.'))
    .catch(() => toast.error('Falha ao solicitar backup.'));
};
```

---

### 8. Restaurar Backup

**Funcionalidade**: Restaurar configurações de um backup anterior

**API**:
```typescript
// Listar backups
const backups = await settingsApi.listBackups();

// Restaurar backup
await settingsApi.restoreBackup(backupId);
```

**Fluxo**:
1. Lista todos os backups disponíveis
2. Seleciona o mais recente automaticamente
3. Restaura backup selecionado
4. Mostra feedback

**Código**:
```typescript
const handleRestore = () => {
  settingsApi.listBackups()
    .then((list) => {
      if (!list || list.length === 0) {
        toast.warning('Nenhum backup encontrado.');
        return;
      }
      // Seleciona o mais recente
      const last = list.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      return settingsApi.restoreBackup(last.backupId)
        .then(() => toast.success('Restauração iniciada.'))
        .catch(() => toast.error('Falha ao iniciar restauração.'));
    })
    .catch(() => toast.error('Falha ao listar backups.'));
};
```

---

### 9. Sincronizar

**Funcionalidade**: Sincronizar dados entre dispositivos

**API**:
```typescript
await settingsApi.triggerSync();
```

**Fluxo**:
1. Chama API `/settings/sync`
2. Backend processa sincronização em background
3. Mostra toast de sucesso

**Código**:
```typescript
const handleSync = () => {
  settingsApi.triggerSync()
    .then(() => toast.success('Sincronização iniciada.'))
    .catch(() => toast.error('Falha ao iniciar sincronização.'));
};
```

---

### 10. Dispositivos Conectados

**Funcionalidade**: Gerenciar dispositivos/sessões autorizados

**Modal**: `DevicesManagerModal`

**API**:
```typescript
// Listar dispositivos
const devices = await settingsApi.listDevices();

// Revogar dispositivo
await settingsApi.revokeDevice(deviceId);
```

**Fluxo**:
1. Usuário clica em "Gerenciar"
2. Abre modal `DevicesManagerModal`
3. Modal carrega lista de dispositivos
4. Exibe: nome, IP, último acesso, se é atual
5. Permite revogar dispositivos (exceto o atual)

**Informações Exibidas**:
- Nome do dispositivo
- IP (se disponível)
- Último acesso (data/hora formatada)
- Tag "Atual" se for o dispositivo atual
- Botão "Revogar" (desabilitado para dispositivo atual)

---

### 11. Política de Privacidade

**Funcionalidade**: Abrir política de privacidade em nova aba

**Comportamento**:
- Abre `/privacy-policy` em nova aba
- Link externo

---

### 12. Central de Ajuda

**Funcionalidade**: Abrir email de suporte

**Comportamento**:
- Abre cliente de email com:
  - Para: `contato@dreamkeys.com.br`
  - Assunto: "Suporte - Sistema Imobiliário"

---

## 📊 Estatísticas Dinâmicas

As estatísticas são calculadas dinamicamente:

```typescript
const stats = useMemo(() => {
  const settingsList = [
    autoBackup,
    analytics,
    theme === 'dark',
  ];
  const activeCount = settingsList.filter(Boolean).length;
  const connectedDevices = 1; // Placeholder
  // Calcular tamanho do localStorage
  let bytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) as string;
      const val = localStorage.getItem(key) || '';
      bytes += key.length + val.length;
    }
  } catch { /* noop */ }
  const mb = (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  return { activeCount, syncedData: mb, connectedDevices };
}, [autoBackup, analytics, theme]);
```

**Cards Exibidos**:
1. **Configurações Ativas**: Conta quantas configurações estão ativas
2. **Dados Sincronizados**: Tamanho total do localStorage em MB
3. **Dispositivos Conectados**: Número de dispositivos (placeholder)

---

## 🎣 Hooks Utilizados

### useTheme

**Arquivo**: `src/hooks/useTheme.ts`

**Função**: Gerenciar tema da aplicação

**Uso**:
```typescript
const { theme, toggleTheme } = useTheme();
```

**Retorna**:
- `theme`: `'light' | 'dark'`
- `toggleTheme`: Função para alternar tema

---

### useAuth

**Arquivo**: `src/hooks/useAuth.ts`

**Função**: Manter contexto de autenticação

**Uso**:
```typescript
useAuth(); // Apenas para manter hook ativo
```

---

## 🔌 APIs Utilizadas

### settingsApi

**Arquivo**: `src/services/settingsApi.ts`

**Métodos Utilizados**:

```typescript
// Analytics
settingsApi.getAnalytics(): Promise<{ enabled: boolean }>
settingsApi.updateAnalytics(enabled: boolean): Promise<{ enabled: boolean }>

// Export/Import
settingsApi.exportSettings(): Promise<any>
settingsApi.importSettings(payload: any): Promise<void>

// Backup/Restore
settingsApi.createBackup(label?: string): Promise<BackupInfo>
settingsApi.listBackups(): Promise<BackupInfo[]>
settingsApi.restoreBackup(backupId: string): Promise<void>

// Sync
settingsApi.triggerSync(): Promise<void>

// Dispositivos
settingsApi.listDevices(): Promise<DevicesInfo[]>
settingsApi.revokeDevice(deviceId: string): Promise<void>
```

**Base URL**: `/settings`

**Autenticação**: Bearer Token (automático via interceptor)

---

## 🎨 Componentes Relacionados

### UserPreferencesModal

**Arquivo**: `src/components/modals/UserPreferencesModal.tsx`

**Função**: Modal para configurar preferências pessoais do usuário

**Abre quando**: Não está sendo usado atualmente na página (pode ser adicionado futuramente)

**Funcionalidades**:
- Tela inicial padrão
- Tema
- Layout (sidebar)
- Notificações (email, push, in-app)

---

### DevicesManagerModal

**Arquivo**: `src/components/modals/DevicesManagerModal.tsx`

**Função**: Modal para gerenciar dispositivos conectados

**Props**:
```typescript
interface DevicesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDevices: () => Promise<DeviceItem[]>;
  onRevoke: (deviceId: string) => Promise<void>;
}
```

**Uso**:
```typescript
<DevicesManagerModal
  isOpen={showDevicesModal}
  onClose={() => setShowDevicesModal(false)}
  onLoadDevices={async () => {
    const list = await settingsApi.listDevices();
    return list;
  }}
  onRevoke={async (deviceId: string) => {
    await settingsApi.revokeDevice(deviceId);
    toast.success('Dispositivo revogado.');
  }}
/>
```

---

## 📱 Estados da Página

```typescript
// Estados locais
const [autoBackup, setAutoBackup] = useState(true);
const [analytics, setAnalytics] = useState(true);
const [showPreferencesModal, setShowPreferencesModal] = useState(false);
const [showDevicesModal, setShowDevicesModal] = useState(false);

// Refs
const importInputRef = useRef<HTMLInputElement | null>(null);

// Hooks
const { theme, toggleTheme } = useTheme();
```

---

## 🔄 Fluxos de Uso

### Fluxo 1: Alterar Tema

```
1. Usuário clica no toggle de tema
   ↓
2. handleThemeToggle() é chamado
   ↓
3. toggleTheme() atualiza tema global
   ↓
4. Tema é aplicado imediatamente
   ↓
5. Persistido no localStorage
```

---

### Fluxo 2: Exportar Dados

```
1. Usuário clica em "Exportar Dados"
   ↓
2. handleExportData() é chamado
   ↓
3. settingsApi.exportSettings() busca dados
   ↓
4. Cria Blob com JSON formatado
   ↓
5. Faz download automático do arquivo
   ↓
6. Mostra toast de sucesso
```

---

### Fluxo 3: Importar Dados

```
1. Usuário clica em "Importar Dados"
   ↓
2. Abre seletor de arquivo (input oculto)
   ↓
3. Usuário seleciona arquivo JSON
   ↓
4. onImportFileChange() lê arquivo
   ↓
5. Valida formato JSON
   ↓
6. settingsApi.importSettings() envia dados
   ↓
7. Mostra toast de sucesso/erro
```

---

### Fluxo 4: Gerenciar Dispositivos

```
1. Usuário clica em "Gerenciar" (Dispositivos)
   ↓
2. Abre DevicesManagerModal
   ↓
3. Modal carrega lista via onLoadDevices()
   ↓
4. Exibe lista de dispositivos
   ↓
5. Usuário pode revogar dispositivos
   ↓
6. onRevoke() remove dispositivo
   ↓
7. Lista é atualizada
```

---

## 🎨 Estilos

**Arquivo**: `src/styles/pages/SettingsPageStyles.ts`

**Componentes Estilizados**:
- `SettingsContainer`
- `SettingsContent`
- `SettingsHeader`
- `SettingsTitle`
- `SettingsSubtitle`
- `SettingsGrid`
- `SettingsSection`
- `SectionHeader`
- `SettingItem`
- `ToggleSwitch`
- `StatusBadge`
- `ActionButton`
- `StatsSection`
- `QuickActionsSection`

**Características**:
- Layout responsivo
- Grid de seções
- Cards de estatísticas
- Toggles customizados
- Badges de status
- Botões de ação

---

## 🚨 Tratamento de Erros

### Erros Comuns

1. **Falha ao carregar analytics**
   - Mostra toast de warning
   - Mantém valor padrão (true)

2. **Falha ao salvar analytics**
   - Mostra toast de erro
   - Reverte para valor anterior do backend

3. **Falha ao exportar**
   - Mostra toast de erro
   - Não interrompe fluxo

4. **Falha ao importar**
   - Valida JSON antes de enviar
   - Mostra toast específico para "Arquivo inválido"
   - Mostra toast de erro para falha na API

5. **Falha ao limpar cache**
   - Try/catch para proteger
   - Mostra toast de erro

---

## 📝 Exemplo de Código Completo

```typescript
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { settingsApi } from '../services/settingsApi';
import { DevicesManagerModal } from '../components/modals/DevicesManagerModal';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  useAuth();
  
  const [autoBackup, setAutoBackup] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // Carregar analytics do backend
  useEffect(() => {
    const load = async () => {
      try {
        const anal = await settingsApi.getAnalytics().catch(() => null);
        if (anal) {
          setAnalytics(!!anal.enabled);
        }
      } catch (e: any) {
        toast.warning(e?.message || 'Não foi possível carregar configurações.');
      }
    };
    load();
  }, []);

  // Salvar analytics
  const persistAnalytics = async (enabled: boolean) => {
    try {
      await settingsApi.updateAnalytics(enabled);
      toast.success('Configuração de analytics salva.');
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao salvar analytics.');
      const remote = await settingsApi.getAnalytics();
      setAnalytics(!!remote.enabled);
    }
  };

  // Exportar dados
  const handleExportData = () => {
    settingsApi.exportSettings()
      .then((data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `settings-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Configurações exportadas.');
      })
      .catch(() => toast.error('Falha ao exportar configurações.'));
  };

  // ... outros handlers ...

  return (
    <Layout>
      <SettingsContainer>
        {/* Cabeçalho */}
        <SettingsHeader>
          <SettingsTitle>Configurações</SettingsTitle>
          <SettingsSubtitle>
            Personalize sua experiência e gerencie as configurações do sistema
          </SettingsSubtitle>
        </SettingsHeader>

        {/* Estatísticas */}
        <StatsSection>
          {/* Cards de estatísticas */}
        </StatsSection>

        {/* Ações Rápidas */}
        <QuickActionsSection>
          {/* Cards de ações */}
        </QuickActionsSection>

        {/* Seções de Configuração */}
        <SettingsGrid>
          {/* Aparência, Dados, Segurança, Sistema, Ajuda */}
        </SettingsGrid>
      </SettingsContainer>

      {/* Modal de Dispositivos */}
      <DevicesManagerModal
        isOpen={showDevicesModal}
        onClose={() => setShowDevicesModal(false)}
        onLoadDevices={async () => await settingsApi.listDevices()}
        onRevoke={async (deviceId) => {
          await settingsApi.revokeDevice(deviceId);
          toast.success('Dispositivo revogado.');
        }}
      />
    </Layout>
  );
};
```

---

## 🔍 Debugging

### Verificar Estado de Analytics

```typescript
// No console do navegador
const analytics = await settingsApi.getAnalytics();
console.log('Analytics:', analytics);
```

### Verificar Dispositivos

```typescript
const devices = await settingsApi.listDevices();
console.log('Dispositivos:', devices);
```

### Verificar Tamanho do Cache

```typescript
let bytes = 0;
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const val = localStorage.getItem(key) || '';
  bytes += key.length + val.length;
}
console.log('Tamanho do cache:', (bytes / (1024 * 1024)).toFixed(2), 'MB');
```

---

## 🚀 Melhorias Futuras

1. **Backup Automático**: Integrar com backend para persistir estado
2. **Dispositivos**: Mostrar número real de dispositivos conectados
3. **Preferências Pessoais**: Reativar modal de preferências
4. **Histórico de Backups**: Mostrar lista de backups para escolha
5. **Validação de Import**: Validar estrutura do JSON antes de importar
6. **Confirmação de Ações**: Adicionar confirmação para ações destrutivas
7. **Loading States**: Adicionar indicadores de carregamento para ações assíncronas

---

## 📚 Referências

- **SettingsPage**: `src/pages/SettingsPage.tsx`
- **settingsApi**: `src/services/settingsApi.ts`
- **DevicesManagerModal**: `src/components/modals/DevicesManagerModal.tsx`
- **UserPreferencesModal**: `src/components/modals/UserPreferencesModal.tsx`
- **useTheme**: `src/hooks/useTheme.ts`
- **API Documentation**: `docs/SETTINGS_API_FRONTEND.md`

---

## 🎓 Checklist para Desenvolvedores

Ao trabalhar na tela de configurações:

- [ ] Verificar se todas as APIs estão funcionando
- [ ] Testar export/import de dados
- [ ] Validar tratamento de erros
- [ ] Verificar responsividade
- [ ] Testar em diferentes temas
- [ ] Validar permissões (se aplicável)
- [ ] Verificar feedback visual (toasts)
- [ ] Testar fluxos completos

---

**Versão da Documentação**: 1.0.0  
**Data de Criação**: 2024-01-20  
**Última Atualização**: 2024-01-20






















