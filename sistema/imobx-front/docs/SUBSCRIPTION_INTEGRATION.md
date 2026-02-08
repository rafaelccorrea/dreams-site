## Integração de Assinaturas (Frontend ↔ Backend IMOBX)

Esta documentação descreve como o frontend deve consumir as rotas de assinatura integradas ao Asaas. Todos os endpoints exigem autenticação JWT (`Authorization: Bearer <token>`) e estão sob o prefixo `/subscriptions`. Apenas usuários com perfil `admin` ou `master` têm acesso.

---

## Visão Geral do Fluxo

1. **Início da assinatura** (`POST /subscriptions/start`)
   - Cria/atualiza o cliente no Asaas
   - Valida o cartão (cobrança de R$ 1 com estorno automático)
   - Agenda assinatura mensal com 7 dias de trial (padrão)
2. **Gerenciamento do ciclo**
   - Cron de backend reconcilia pagamentos a cada hora
   - Cobrança recorrente sempre no ciclo seguinte (nunca no mesmo mês da mudança)
3. **Operações disponíveis**
   - `POST /subscriptions/deactivate`: encerra a assinatura com cobrança proporcional (pró-rata) se houver uso após o trial
   - `POST /subscriptions/reactivate`: reativa assinatura desde que não haja débitos pendentes
   - `PATCH /subscriptions/payment-method`: troca o cartão (cobrança + estorno de R$ 1 para validar)
4. **Troca de plano**
   - `POST /subscriptions/admin/change-plan` (já existente) agendada para o próximo ciclo
   - Restrição: apenas uma alteração a cada 90 dias (`planChangeLockedUntil`)

---

## DTOs Utilizados

### `StartSubscriptionDto`

```jsonc
{
  "planId": "uuid obrigatório",
  "card": {
    "holderName": "João da Silva",
    "number": "4111111111111111",
    "expiryMonth": "08",
    "expiryYear": "29",
    "ccv": "123"
  },
  "cardHolder": {
    "name": "João da Silva",
    "email": "joao.silva@example.com",
    "cpfCnpj": "12345678901",
    "postalCode": "88000000",
    "addressNumber": "123",
    "addressComplement": "Apto 101",
    "mobilePhone": "48999999999",
    "phone": "4833333333"
  },
  "remoteIp": "187.11.22.33",
  "trialDays": 7
}
```

### `DeactivateSubscriptionDto`

```jsonc
{
  "reason": "Não vou utilizar o sistema neste mês"
}
```

### `ReactivateSubscriptionDto`

```jsonc
{
  "remoteIp": "187.11.22.33"
}
```

### `UpdateCardDto`

Estrutura idêntica ao bloco `card` + `cardHolder` do `StartSubscriptionDto`.

---

## Endpoints

### 1. Iniciar Assinatura

`POST /subscriptions/start`

**Body**: `StartSubscriptionDto`  
**Resposta (200)**: `SubscriptionResponseDto`

```jsonc
{
  "id": "uuid da assinatura",
  "plan": "basic",
  "status": "active",
  "currentCompanies": 0,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2026-01-01T00:00:00.000Z",
  "price": 359.9,
  "notes": "Assinatura iniciada em ...",
  "userId": "uuid do usuário",
  "planId": "uuid do plano",
  "createdAt": "...",
  "updatedAt": "...",
  "nextBillingDate": "2025-02-07",
  "trialEndsAt": "2025-01-08",
  "asaasSubscriptionId": "sub_xxx"
}
```

**Códigos adicionais**:

- `400`: falha na validação do DTO ou rejeição do Asaas (cartão inválido)
- `409`: usuário já possui assinatura ativa ou suspensa

### 2. Desativar Assinatura

`POST /subscriptions/deactivate`

**Body**: opcional (`DeactivateSubscriptionDto`)  
**Processo**:

1. Calcula pró-rata (desconsidera trial; cobra apenas dias realmente usados)
2. Cancela assinatura no Asaas mantendo histórico (soft delete no sistema)
3. Retorna assinatura atualizada

**Resposta (200)**: `SubscriptionResponseDto` com `status = "inactive"` e `deactivatedAt` preenchido

### 3. Reativar Assinatura

`POST /subscriptions/reactivate`

**Body**: opcional (`ReactivateSubscriptionDto`)  
**Requisitos**:

- Sem pagamentos pendentes (`subscription_payments` com status pendente/overdue/failed)
- Respeita bloqueio de downgrade/upgrade (planChangeLockedUntil)

**Resposta (200)**: assinatura com `status = "active"` atualizada

### 4. Atualizar Cartão

`PATCH /subscriptions/payment-method`

**Body**: `UpdateCardDto`  
**Processo**:

1. Cobra R$ 1 (validação) e estorna automaticamente
2. Atualiza cartão da assinatura no Asaas

**Resposta (200)**: assinatura com `lastCardValidatedAt` atualizado

---

## Estruturas Persistidas

### Tabela `subscriptions` (novos campos)

- `asaasCustomerId`, `asaasSubscriptionId`
- `billingType`, `nextBillingDate`, `lastBillingDate`
- `trialEndsAt`, `deactivatedAt`, `planChangeLockedUntil`, `reactivationAvailableAt`
- `validationPaymentId`, `lastCardValidatedAt`, `autoRenew`

### Tabela `subscription_payments`

- Histórico de cobranças (recorrentes, pró-rata, validação, ajustes)
- Campos relevantes:
  - `type`: enum (`recurring`, `validation`, `prorated`, `adjustment`, `trial`, `manual`)
  - `status`: enum (`pending`, `received`, `overdue`, `cancelled`, `refunded`, `chargeback`, `failed`, `processing`)
  - `amount`, `dueDate`, `paidAt`, `metadata` (informações do Asaas)

---

## Cron de Reconciliação

- Serviço: `SubscriptionBillingCronService`
- Frequência: `@Cron(CronExpression.EVERY_HOUR)`
- Ações:
  - Busca pagamentos locais com status pendente/processing/overdue/failed/chargeback
  - Consulta o Asaas (`GET /payments/{id}`)
  - Atualiza status local, `lastBillingDate`, `nextBillingDate`

---

## Regras Específicas

- **Trial**: padrão 7 dias (`trialDays` pode ser enviado pelo frontend, caso seja necessário customizar)
- **Troca de plano**: sempre agendada para próximo ciclo; usuário só pode solicitar nova alteração após 90 dias
- **Desativação soft**: assinatura nunca é removida definitivamente (permite reativação futura)
- **Pró-rata**: se cancelado após trial, cobra valor proporcional aos dias de uso no ciclo atual
- **Bloqueios**:
  - Não é permitido iniciar nova assinatura se já existe uma ativa/suspensa
  - Reativação exige ausência de débitos pendentes
  - Reativação automática também faz restore no Asaas (`/subscriptions/{id}/restore`)

---

## Webhooks (Backend)

- Endpoints serão configurados posteriormente; o serviço `SubscriptionBillingService` já suporta reconciliação manual via cron.
- Quando o webhook for exposto, o frontend será notificado por canais internos (socket/notification).

---

## Checklist Frontend

1. Coletar dados do cartão (PCI compliance) → enviar diretamente ao backend via HTTPS (não armazenar no client)
2. Enviar `remoteIp` (pegar do browser usando serviço externo ou proxy)
3. Informar `trialDays` apenas se política mudar (deixar em branco usa default 7)
4. Armazenar status retornado da assinatura para condicionar telas de acesso
5. Controlar mensagens de bloqueio:
   - `planChangeLockedUntil` → exibir aviso de quando poderá alterar novamente
   - `deactivatedAt` / `reactivationAvailableAt` → liberação para reativar
6. Após qualquer operação, consumir `/subscriptions/my-active-subscription` (rota existente) para refletir estado atualizado

---

## Variáveis de Ambiente Relevantes (Backend)

```
ASAAS_ENV=sandbox | production
ASAAS_SANDBOX_BASE_URL=https://api-sandbox.asaas.com/v3
ASAAS_SANDBOX_API_KEY=...
ASAAS_PROD_BASE_URL=https://api.asaas.com/v3
ASAAS_PROD_API_KEY=...
ASAAS_WEBHOOK_SECRET=...
```

---

Qualquer ajuste adicional (ex.: alterar frequência do cron, incluir novos campos na tela de checkout) pode ser combinado com o backend para manter a sincronia. Entre em contato se precisar de exemplos extras ou mock de respostas.


