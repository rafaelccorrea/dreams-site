# Settings API - Especificação (Proposta)

Esta especificação descreve os endpoints necessários para tornar a página de Configurações funcional. Os endpoints seguem um prefixo comum:

- Base URL: `/settings`

Padrões:
- Autenticação via Bearer Token.
- Todas as respostas seguem `{ success: boolean, data?: any, message?: string }` quando pertinente.
- Em erros, retornar HTTP codes adequados (400/401/403/404/409/422/429/500) com `{ message }`.

## 1) Notificações

### GET `/settings/notifications`
Retorna preferências de notificações do usuário.

Response 200:
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

### PUT `/settings/notifications`
Atualiza preferências de notificações.

Body:
```json
{
  "general": true,
  "email": false,
  "push": true
}
```

Response 200: igual ao GET.


## 2) Push Notifications (permite registrar/remover subscription do navegador)

### POST `/settings/notifications/push/subscribe`
Body:
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/....",
  "keys": { "p256dh": "base64...", "auth": "base64..." },
  "userAgent": "Mozilla/5.0 ...",
  "deviceName": "iPhone de João"
}
```
Response 201:
```json
{ "success": true, "data": { "subscriptionId": "sub_123" } }
```

### DELETE `/settings/notifications/push/subscribe/:subscriptionId`
Response 204 (sem body).


## 3) Backup e Restauração

### POST `/settings/backup`
Cria um backup completo das preferências e dados de configuração do usuário no servidor.

Body (opcional):
```json
{ "label": "backup-manual" }
```

Response 201:
```json
{
  "success": true,
  "data": { "backupId": "bkp_001", "createdAt": "2025-11-16T12:00:00Z" }
}
```

### GET `/settings/backup`
Lista backups do usuário.

Response 200:
```json
{
  "success": true,
  "data": [
    { "backupId": "bkp_001", "createdAt": "2025-11-16T12:00:00Z", "label": "auto" }
  ]
}
```

### POST `/settings/restore`
Restaura a partir de um `backupId`.

Body:
```json
{ "backupId": "bkp_001" }
```

Response 202:
```json
{ "success": true, "message": "Restore started" }
```


## 4) Sincronização

### POST `/settings/sync`
Dispara sincronização do perfil do usuário (preferências/config).

Response 202:
```json
{ "success": true, "message": "Sync enqueued" }
```


## 5) Analytics (telemetria)

### GET `/settings/analytics`
Response:
```json
{ "success": true, "data": { "enabled": true } }
```

### PUT `/settings/analytics`
Body:
```json
{ "enabled": false }
```

Response 200: igual ao GET.


## 6) Segurança - 2FA (TOTP)

### POST `/settings/2fa/setup`
Gera segredo TOTP e QR code (data URL).

Response 200:
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeDataUrl": "data:image/png;base64,..."
  }
}
```

### POST `/settings/2fa/verify`
Verifica código para ativar 2FA.

Body:
```json
{ "code": "123456" }
```

Response 200:
```json
{ "success": true, "data": { "enabled": true } }
```

### DELETE `/settings/2fa`
Desativa 2FA.

Response 204.


## 7) Dispositivos/Sessões

### GET `/settings/devices`
Lista sessões/dispositivos autorizados.

Response 200:
```json
{
  "success": true,
  "data": [
    { "deviceId": "dev_1", "name": "Chrome Windows", "ip": "10.0.0.1", "lastActive": "2025-11-16T10:00:00Z", "current": true }
  ]
}
```

### DELETE `/settings/devices/:deviceId`
Revoga sessão/dispositivo.

Response 204.


## 8) Export/Import de Configurações

### GET `/settings/export`
Baixa um JSON com as configurações do usuário.
Content-Type: `application/json`

### POST `/settings/import`
Body (JSON):
```json
{ "payload": { "notifications": { "general": true }, "analytics": { "enabled": false } } }
```
Response 200:
```json
{ "success": true, "message": "Settings imported" }
```


## Considerações de Segurança
- Todas as rotas exigem autenticação.
- Rate limit nas rotas de 2FA e notificações push.
- Auditoria recomendada nas rotas de devices (registro de revogação com IP/UA).

## Erros Comuns
- 400: Body inválido (validar campos).
- 401/403: Sem autenticação/permissão.
- 409: Conflito de estado (ex.: 2FA já ativo).
- 422: Dados inconsistentes.
- 500: Falha interna.


