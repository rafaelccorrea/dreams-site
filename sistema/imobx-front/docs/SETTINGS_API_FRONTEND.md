# Settings API - Documentação de Integração Frontend



## 📋 Visão Geral



Esta documentação descreve todas as APIs de Configurações disponíveis para integração no frontend. Todas as rotas seguem o prefixo `/settings` e exigem autenticação via Bearer Token.



**Base URL:** `/settings`



**Autenticação:** Todas as rotas exigem header `Authorization: Bearer <token>`



---



## 🔐 Autenticação



Todas as requisições devem incluir o token JWT no header:



```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```



---



## 📚 Índice



1. [Notificações](#1-notificações)
2. [Analytics](#2-analytics)
3. [Dispositivos/Sessões](#3-dispositivossessões)
4. [Backup e Restauração](#4-backup-e-restauração)
5. [Sincronização](#5-sincronização)
6. [Export/Import](#6-exportimport)
7. [2FA (Autenticação de Dois Fatores)](#7-2fa-autenticação-de-dois-fatores)
8. [Tratamento de Erros](#tratamento-de-erros)



---



## 1. Notificações



### GET `/settings/notifications`



Obtém as preferências de notificações do usuário.



**Request:**

```http
GET /settings/notifications
Authorization: Bearer <token>
```



**Response 200:**

```json
{
  "success": true,
  "data": {
    "general": true,
    "email": true,
    "push": false
  }
}
```



**Exemplo TypeScript:**

```typescript
interface NotificationSettings {
  general: boolean;
  email: boolean;
  push: boolean;
}

interface NotificationResponse {
  success: boolean;
  data: NotificationSettings;
}

async function getNotificationSettings(): Promise<NotificationSettings> {
  const response = await fetch('/settings/notifications', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const result: NotificationResponse = await response.json();
  return result.data;
}
```



---



### PUT `/settings/notifications`



Atualiza as preferências de notificações do usuário.



**Request:**

```http
PUT /settings/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "general": true,
  "email": false,
  "push": true
}
```



**Response 200:**

```json
{
  "success": true,
  "data": {
    "general": true,
    "email": false,
    "push": true
  }
}
```



**Exemplo TypeScript:**

```typescript
async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<NotificationSettings> {
  const response = await fetch('/settings/notifications', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  const result: NotificationResponse = await response.json();
  return result.data;
}
```



---



## 2. Analytics



### GET `/settings/analytics`



Obtém as configurações de analytics/telemetria do usuário.



**Request:**

```http
GET /settings/analytics
Authorization: Bearer <token>
```



**Response 200:**

```json
{
  "success": true,
  "data": {
    "enabled": true
  }
}
```



**Exemplo TypeScript:**

```typescript
interface AnalyticsSettings {
  enabled: boolean;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsSettings;
}

async function getAnalyticsSettings(): Promise<AnalyticsSettings> {
  const response = await fetch('/settings/analytics', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const result: AnalyticsResponse = await response.json();
  return result.data;
}
```



---



### PUT `/settings/analytics`



Atualiza as configurações de analytics.



**Request:**

```http
PUT /settings/analytics
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": false
}
```



**Response 200:**

```json
{
  "success": true,
  "data": {
    "enabled": false
  }
}
```



**Exemplo TypeScript:**

```typescript
async function updateAnalyticsSettings(
  enabled: boolean
): Promise<AnalyticsSettings> {
  const response = await fetch('/settings/analytics', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enabled }),
  });
  const result: AnalyticsResponse = await response.json();
  return result.data;
}
```



---



## 3. Dispositivos/Sessões



### GET `/settings/devices`



Lista todos os dispositivos/sessões autorizados do usuário.



**Request:**

```http
GET /settings/devices
Authorization: Bearer <token>
```



**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "deviceId": "dev_1",
      "name": "Chrome Windows",
      "ip": "10.0.0.1",
      "lastActive": "2025-11-16T10:00:00Z",
      "current": true
    },
    {
      "deviceId": "dev_2",
      "name": "Firefox macOS",
      "ip": "10.0.0.2",
      "lastActive": "2025-11-15T08:00:00Z",
      "current": false
    }
  ]
}
```



**Exemplo TypeScript:**

```typescript
interface DeviceInfo {
  deviceId: string;
  name: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface DevicesResponse {
  success: boolean;
  data: DeviceInfo[];
}

async function getDevices(): Promise<DeviceInfo[]> {
  const response = await fetch('/settings/devices', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const result: DevicesResponse = await response.json();
  return result.data;
}
```



---



### DELETE `/settings/devices/:deviceId`



Revoga uma sessão/dispositivo específico.



**Request:**

```http
DELETE /settings/devices/dev_2
Authorization: Bearer <token>
```



**Response 204:** (Sem body)



**Exemplo TypeScript:**

```typescript
async function revokeDevice(deviceId: string): Promise<void> {
  const response = await fetch(`/settings/devices/${deviceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Erro ao revogar dispositivo');
  }
}
```



---



## 4. Backup e Restauração



### POST `/settings/backup`



Cria um backup completo das configurações do usuário.



**Request:**

```http
POST /settings/backup
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "backup-manual"
}
```



**Response 201:**

```json
{
  "success": true,
  "data": {
    "backupId": "bkp_001",
    "createdAt": "2025-11-16T12:00:00Z"
  }
}
```



**Exemplo TypeScript:**

```typescript
interface CreateBackupRequest {
  label?: string;
}

interface BackupInfo {
  backupId: string;
  createdAt: string;
}

interface BackupResponse {
  success: boolean;
  data: BackupInfo;
}

async function createBackup(label?: string): Promise<BackupInfo> {
  const response = await fetch('/settings/backup', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label }),
  });
  const result: BackupResponse = await response.json();
  return result.data;
}
```



---



### GET `/settings/backup`



Lista todos os backups do usuário.



**Request:**

```http
GET /settings/backup
Authorization: Bearer <token>
```



**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "backupId": "bkp_001",
      "createdAt": "2025-11-16T12:00:00Z",
      "label": "backup-manual"
    },
    {
      "backupId": "bkp_002",
      "createdAt": "2025-11-15T10:00:00Z",
      "label": "auto"
    }
  ]
}
```



**Exemplo TypeScript:**

```typescript
interface BackupListItem {
  backupId: string;
  createdAt: string;
  label?: string;
}

interface BackupListResponse {
  success: boolean;
  data: BackupListItem[];
}

async function listBackups(): Promise<BackupListItem[]> {
  const response = await fetch('/settings/backup', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const result: BackupListResponse = await response.json();
  return result.data;
}
```



---



### POST `/settings/restore`



Restaura as configurações a partir de um backup.



**Request:**

```http
POST /settings/restore
Authorization: Bearer <token>
Content-Type: application/json

{
  "backupId": "bkp_001"
}
```



**Response 202:**

```json
{
  "success": true,
  "message": "Restore started"
}
```



**Exemplo TypeScript:**

```typescript
interface RestoreRequest {
  backupId: string;
}

interface RestoreResponse {
  success: boolean;
  message: string;
}

async function restoreBackup(backupId: string): Promise<void> {
  const response = await fetch('/settings/restore', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ backupId }),
  });
  
  const result: RestoreResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Erro ao restaurar backup');
  }
}
```



---



## 5. Sincronização



### POST `/settings/sync`



Dispara sincronização do perfil do usuário.



**Request:**

```http
POST /settings/sync
Authorization: Bearer <token>
```



**Response 202:**

```json
{
  "success": true,
  "message": "Sync enqueued"
}
```



**Exemplo TypeScript:**

```typescript
interface SyncResponse {
  success: boolean;
  message: string;
}

async function syncSettings(): Promise<void> {
  const response = await fetch('/settings/sync', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result: SyncResponse = await response.json();
  if (!result.success) {
    throw new Error('Erro ao sincronizar configurações');
  }
}
```



---



## 6. Export/Import



### GET `/settings/export`



Exporta todas as configurações do usuário como JSON.



**Request:**

```http
GET /settings/export
Authorization: Bearer <token>
```



**Response 200:**

```json
{
  "preferences": {
    "defaultHomeScreen": "dashboard",
    "themeSettings": {
      "theme": "light",
      "language": "pt-BR"
    },
    "notificationSettings": {
      "general": true,
      "email": true,
      "push": false
    },
    "layoutSettings": {
      "sidebar": "expanded",
      "grid": "normal"
    },
    "generalSettings": {}
  },
  "analytics": {
    "enabled": true
  },
  "exportedAt": "2025-11-16T12:00:00Z"
}
```



**Exemplo TypeScript:**

```typescript
interface ExportedSettings {
  preferences: {
    defaultHomeScreen?: string;
    themeSettings?: Record<string, any>;
    notificationSettings?: Record<string, any>;
    layoutSettings?: Record<string, any>;
    generalSettings?: Record<string, any>;
  };
  analytics: {
    enabled: boolean;
  };
  exportedAt: string;
}

async function exportSettings(): Promise<ExportedSettings> {
  const response = await fetch('/settings/export', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
}

// Exemplo de download do arquivo
async function downloadSettings(): Promise<void> {
  const settings = await exportSettings();
  const blob = new Blob([JSON.stringify(settings, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `settings-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```



---



### POST `/settings/import`



Importa configurações de um JSON.



**Request:**

```http
POST /settings/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "payload": {
    "notifications": {
      "general": true,
      "email": false,
      "push": true
    },
    "analytics": {
      "enabled": false
    }
  }
}
```



**Response 200:**

```json
{
  "success": true,
  "message": "Settings imported"
}
```



**Exemplo TypeScript:**

```typescript
interface ImportRequest {
  payload: {
    preferences?: {
      defaultHomeScreen?: string;
      themeSettings?: Record<string, any>;
      notificationSettings?: Record<string, any>;
      layoutSettings?: Record<string, any>;
      generalSettings?: Record<string, any>;
    };
    analytics?: {
      enabled: boolean;
    };
  };
}

interface ImportResponse {
  success: boolean;
  message: string;
}

async function importSettings(payload: ImportRequest['payload']): Promise<void> {
  const response = await fetch('/settings/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payload }),
  });
  
  const result: ImportResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Erro ao importar configurações');
  }
}

// Exemplo de importação a partir de arquivo
async function importFromFile(file: File): Promise<void> {
  const text = await file.text();
  const settings = JSON.parse(text);
  await importSettings(settings);
}
```



---



## 7. 2FA (Autenticação de Dois Fatores)



### POST `/settings/2fa/setup`



Gera o secret TOTP e QR code para configuração do 2FA.



**Request:**

```http
POST /settings/2fa/setup
Authorization: Bearer <token>
```



**Response 200:**

```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```



**Exemplo TypeScript:**

```typescript
interface TwoFactorSetup {
  secret: string;
  qrCodeDataUrl: string;
}

interface TwoFactorSetupResponse {
  success: boolean;
  data: TwoFactorSetup;
}

async function setupTwoFactor(): Promise<TwoFactorSetup> {
  const response = await fetch('/settings/2fa/setup', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 409) {
    throw new Error('2FA já está ativado');
  }
  
  const result: TwoFactorSetupResponse = await response.json();
  return result.data;
}

// Exemplo de exibição do QR Code
async function displayQRCode(): Promise<void> {
  const { qrCodeDataUrl, secret } = await setupTwoFactor();
  
  // Exibir QR Code em uma imagem
  const img = document.createElement('img');
  img.src = qrCodeDataUrl;
  document.body.appendChild(img);
  
  // Também mostrar o secret manualmente (caso o usuário não possa escanear)
  console.log('Secret manual:', secret);
}
```



---



### POST `/settings/2fa/verify`



Verifica o código TOTP e ativa o 2FA.



**Request:**

```http
POST /settings/2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```



**Response 200:**

```json
{
  "success": true,
  "data": {
    "enabled": true
  }
}
```



**Exemplo TypeScript:**

```typescript
interface TwoFactorVerifyRequest {
  code: string; // Código de 6 dígitos
}

interface TwoFactorVerifyResponse {
  success: boolean;
  data: {
    enabled: boolean;
  };
}

async function verifyTwoFactor(code: string): Promise<boolean> {
  const response = await fetch('/settings/2fa/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  if (response.status === 400) {
    const error = await response.json();
    throw new Error(error.message || 'Código TOTP inválido');
  }
  
  const result: TwoFactorVerifyResponse = await response.json();
  return result.data.enabled;
}

// Exemplo de fluxo completo de ativação
async function enableTwoFactor(): Promise<void> {
  try {
    // 1. Gerar QR Code
    const { qrCodeDataUrl, secret } = await setupTwoFactor();
    
    // 2. Exibir QR Code para o usuário escanear
    showQRCodeModal(qrCodeDataUrl, secret);
    
    // 3. Aguardar usuário inserir código
    const code = await getUserInputCode();
    
    // 4. Verificar e ativar
    const enabled = await verifyTwoFactor(code);
    
    if (enabled) {
      showSuccessMessage('2FA ativado com sucesso!');
    }
  } catch (error) {
    showErrorMessage(error.message);
  }
}
```



---



### DELETE `/settings/2fa`



Desativa o 2FA.



**Request:**

```http
DELETE /settings/2fa
Authorization: Bearer <token>
```



**Response 204:** (Sem body)



**Exemplo TypeScript:**

```typescript
async function disableTwoFactor(): Promise<void> {
  const response = await fetch('/settings/2fa', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 400) {
    throw new Error('2FA não está ativado');
  }
  
  if (!response.ok) {
    throw new Error('Erro ao desativar 2FA');
  }
}
```



---



## Tratamento de Erros



### Códigos HTTP



| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 202 | Aceito (processamento assíncrono) |
| 204 | Sucesso sem conteúdo |
| 400 | Dados inválidos |
| 401 | Não autorizado (token inválido/expirado) |
| 403 | Sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: 2FA já ativado) |
| 422 | Dados inconsistentes |
| 500 | Erro interno do servidor |



### Formato de Erro



```json
{
  "message": "Mensagem de erro",
  "errorCode": "ERROR_CODE",
  "details": {
    "reason": "Motivo do erro",
    "suggestion": "Sugestão de solução"
  }
}
```



### Exemplo de Tratamento de Erros



```typescript
async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<T> {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Erro ${response.status}: ${response.statusText}`,
      }));
      
      switch (response.status) {
        case 400:
          throw new Error(error.message || 'Dados inválidos');
        case 401:
          // Redirecionar para login
          window.location.href = '/login';
          throw new Error('Sessão expirada');
        case 403:
          throw new Error('Sem permissão para esta ação');
        case 404:
          throw new Error('Recurso não encontrado');
        case 409:
          throw new Error(error.message || 'Conflito de estado');
        case 422:
          throw new Error(error.message || 'Dados inconsistentes');
        default:
          throw new Error(error.message || 'Erro desconhecido');
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Uso
const settings = await handleApiCall(() =>
  fetch('/settings/notifications', {
    headers: { 'Authorization': `Bearer ${token}` },
  })
);
```



---



## 📦 Tipos TypeScript Completos



```typescript
// ==================== NOTIFICAÇÕES ====================
export interface NotificationSettings {
  general: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationResponse {
  success: boolean;
  data: NotificationSettings;
}

// ==================== ANALYTICS ====================
export interface AnalyticsSettings {
  enabled: boolean;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsSettings;
}

// ==================== DISPOSITIVOS ====================
export interface DeviceInfo {
  deviceId: string;
  name: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export interface DevicesResponse {
  success: boolean;
  data: DeviceInfo[];
}

// ==================== BACKUP ====================
export interface BackupInfo {
  backupId: string;
  createdAt: string;
}

export interface BackupResponse {
  success: boolean;
  data: BackupInfo;
}

export interface BackupListItem {
  backupId: string;
  createdAt: string;
  label?: string;
}

export interface BackupListResponse {
  success: boolean;
  data: BackupListItem[];
}

export interface RestoreRequest {
  backupId: string;
}

export interface RestoreResponse {
  success: boolean;
  message: string;
}

// ==================== SINCRONIZAÇÃO ====================
export interface SyncResponse {
  success: boolean;
  message: string;
}

// ==================== EXPORT/IMPORT ====================
export interface ExportedSettings {
  preferences: {
    defaultHomeScreen?: string;
    themeSettings?: Record<string, any>;
    notificationSettings?: Record<string, any>;
    layoutSettings?: Record<string, any>;
    generalSettings?: Record<string, any>;
  };
  analytics: {
    enabled: boolean;
  };
  exportedAt: string;
}

export interface ImportRequest {
  payload: {
    preferences?: {
      defaultHomeScreen?: string;
      themeSettings?: Record<string, any>;
      notificationSettings?: Record<string, any>;
      layoutSettings?: Record<string, any>;
      generalSettings?: Record<string, any>;
    };
    analytics?: {
      enabled: boolean;
    };
  };
}

export interface ImportResponse {
  success: boolean;
  message: string;
}

// ==================== 2FA ====================
export interface TwoFactorSetup {
  secret: string;
  qrCodeDataUrl: string;
}

export interface TwoFactorSetupResponse {
  success: boolean;
  data: TwoFactorSetup;
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  data: {
    enabled: boolean;
  };
}
```



---



## 🔄 Exemplo de Cliente Completo



```typescript
class SettingsApiClient {
  constructor(private baseUrl: string, private getToken: () => string) {}

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = this.getToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Erro ${response.status}`,
      }));
      throw new Error(error.message);
    }

    return await response.json();
  }

  // Notificações
  async getNotifications(): Promise<NotificationSettings> {
    const result = await this.request<NotificationResponse>(
      '/settings/notifications'
    );
    return result.data;
  }

  async updateNotifications(
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    const result = await this.request<NotificationResponse>(
      '/settings/notifications',
      {
        method: 'PUT',
        body: JSON.stringify(settings),
      }
    );
    return result.data;
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsSettings> {
    const result = await this.request<AnalyticsResponse>(
      '/settings/analytics'
    );
    return result.data;
  }

  async updateAnalytics(enabled: boolean): Promise<AnalyticsSettings> {
    const result = await this.request<AnalyticsResponse>(
      '/settings/analytics',
      {
        method: 'PUT',
        body: JSON.stringify({ enabled }),
      }
    );
    return result.data;
  }

  // Dispositivos
  async getDevices(): Promise<DeviceInfo[]> {
    const result = await this.request<DevicesResponse>('/settings/devices');
    return result.data;
  }

  async revokeDevice(deviceId: string): Promise<void> {
    await this.request(`/settings/devices/${deviceId}`, {
      method: 'DELETE',
    });
  }

  // Backup
  async createBackup(label?: string): Promise<BackupInfo> {
    const result = await this.request<BackupResponse>('/settings/backup', {
      method: 'POST',
      body: JSON.stringify({ label }),
    });
    return result.data;
  }

  async listBackups(): Promise<BackupListItem[]> {
    const result = await this.request<BackupListResponse>('/settings/backup');
    return result.data;
  }

  async restoreBackup(backupId: string): Promise<void> {
    await this.request<RestoreResponse>('/settings/restore', {
      method: 'POST',
      body: JSON.stringify({ backupId }),
    });
  }

  // Sincronização
  async sync(): Promise<void> {
    await this.request<SyncResponse>('/settings/sync', {
      method: 'POST',
    });
  }

  // Export/Import
  async export(): Promise<ExportedSettings> {
    return await this.request<ExportedSettings>('/settings/export');
  }

  async import(payload: ImportRequest['payload']): Promise<void> {
    await this.request<ImportResponse>('/settings/import', {
      method: 'POST',
      body: JSON.stringify({ payload }),
    });
  }

  // 2FA
  async setupTwoFactor(): Promise<TwoFactorSetup> {
    const result = await this.request<TwoFactorSetupResponse>(
      '/settings/2fa/setup',
      {
        method: 'POST',
      }
    );
    return result.data;
  }

  async verifyTwoFactor(code: string): Promise<boolean> {
    const result = await this.request<TwoFactorVerifyResponse>(
      '/settings/2fa/verify',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    );
    return result.data.enabled;
  }

  async disableTwoFactor(): Promise<void> {
    await this.request('/settings/2fa', {
      method: 'DELETE',
    });
  }
}

// Uso
const settingsClient = new SettingsApiClient('/api', () => {
  return localStorage.getItem('token') || '';
});

// Exemplo de uso
const notifications = await settingsClient.getNotifications();
await settingsClient.updateNotifications({ general: true, email: false, push: true });
```



---



## 📝 Notas Importantes



1. **2FA no Login:** Quando o 2FA está ativado, o fluxo de login pode precisar ser modificado para exigir o código TOTP após a validação da senha. Consulte a documentação de autenticação para mais detalhes.

2. **Rate Limiting:** Algumas rotas podem ter rate limiting. Em caso de erro 429, aguarde antes de tentar novamente.

3. **Sessões:** O campo `current` em `/settings/devices` indica se é a sessão atual. Pode não estar disponível em todas as implementações.

4. **Backup:** O backup não restaura configurações de 2FA por questões de segurança.

5. **Export/Import:** O formato exportado pode mudar com atualizações futuras. Sempre valide o formato antes de importar.



---



## 🚀 Próximos Passos



1. Implementar cliente API no frontend usando os tipos fornecidos
2. Criar componentes de UI para cada funcionalidade
3. Implementar tratamento de erros global
4. Adicionar loading states e feedback visual
5. Testar integração completa com o backend



---



**Última atualização:** 2025-11-16



