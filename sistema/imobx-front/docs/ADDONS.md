# Guia Frontend - Compra de Extras (Add-ons)

## 📋 Visão Geral

Este documento descreve o sistema de compra de extras (add-ons) para assinaturas, permitindo que usuários comprem:
- **Usuários adicionais** (+10, +20, etc.)
- **Propriedades adicionais** (+50, +100, etc.)
- **Armazenamento adicional** (+5 GB, +10 GB, etc.)

Os extras aumentam os limites do plano e o valor mensal da assinatura, sendo atualizados automaticamente no Asaas.

## 🎯 Conceito Principal

**IMPORTANTE:** Os extras são adicionados ao plano base:
- **Limite Total** = Limite do Plano Base + Extras Comprados
- **Valor Mensal** = Valor do Plano Base + Valor dos Extras Ativos
- **Atualização Automática**: O valor é atualizado no Asaas automaticamente

## 🔌 APIs Disponíveis

### 1. Listar Add-ons Disponíveis

**Endpoint:** `GET /subscriptions/:subscriptionId/addons/available`

**Descrição:** Retorna os tipos de add-ons disponíveis com seus preços unitários.

**Autenticação:** Requerida (JWT Bearer Token)

**Resposta:**

```json
[
  {
    "type": "extra_users",
    "unitPrice": 15.0,
    "description": "Usuário adicional"
  },
  {
    "type": "extra_properties",
    "unitPrice": 2.0,
    "description": "Propriedade adicional"
  },
  {
    "type": "extra_storage_gb",
    "unitPrice": 5.0,
    "description": "GB de armazenamento adicional"
  }
]
```

### 2. Listar Add-ons da Assinatura

**Endpoint:** `GET /subscriptions/:subscriptionId/addons`

**Descrição:** Retorna todos os add-ons (ativos e cancelados) de uma assinatura.

**Resposta:**

```json
[
  {
    "id": "uuid",
    "subscriptionId": "uuid",
    "type": "extra_users",
    "quantity": 10,
    "monthlyPrice": 150.0,
    "status": "active",
    "startDate": "2026-01-05",
    "endDate": null,
    "purchasedByUserId": "uuid",
    "notes": null,
    "createdAt": "2026-01-05T12:00:00.000Z",
    "updatedAt": "2026-01-05T12:00:00.000Z"
  }
]
```

### 3. Listar Add-ons Ativos

**Endpoint:** `GET /subscriptions/:subscriptionId/addons/active`

**Descrição:** Retorna apenas os add-ons ativos de uma assinatura.

### 4. Comprar Add-on

**Endpoint:** `POST /subscriptions/:subscriptionId/addons/purchase`

**Descrição:** Compra um add-on e atualiza o valor da assinatura no Asaas e no banco de dados.

**Body:**

```json
{
  "type": "extra_users",
  "quantity": 10,
  "startDate": "2026-01-05", // Opcional, padrão: hoje
  "endDate": null, // Opcional, null = permanente
  "notes": "Adicionando 10 usuários para expansão" // Opcional
}
```

**Resposta:**

```json
{
  "id": "uuid",
  "subscriptionId": "uuid",
  "type": "extra_users",
  "quantity": 10,
  "monthlyPrice": 150.0,
  "status": "active",
  "startDate": "2026-01-05",
  "endDate": null,
  "purchasedByUserId": "uuid",
  "notes": "Adicionando 10 usuários para expansão",
  "createdAt": "2026-01-05T12:00:00.000Z",
  "updatedAt": "2026-01-05T12:00:00.000Z"
}
```

### 5. Cancelar Add-on

**Endpoint:** `DELETE /subscriptions/:subscriptionId/addons/:addonId`

**Descrição:** Cancela um add-on ativo, removendo-o do valor da assinatura e atualizando no Asaas.

**Resposta:**

```json
{
  "id": "uuid",
  "status": "cancelled",
  "endDate": "2026-01-05",
  ...
}
```

### 6. Recalcular Preço da Assinatura

**Endpoint:** `POST /subscriptions/:subscriptionId/addons/recalculate`

**Descrição:** Recalcula o preço total da assinatura baseado no plano + add-ons ativos e atualiza no Asaas.

**Resposta:**

```json
{
  "newPrice": 509.9,
  "message": "Preço da assinatura recalculado: R$ 509.90/mês"
}
```

### 7. Obter Limites Totais

**Endpoint:** `GET /subscriptions/:subscriptionId/addons/limits`

**Descrição:** Retorna os limites totais (plano base + add-ons ativos) para usuários, propriedades e armazenamento.

**Resposta:**

```json
{
  "users": 30,
  "properties": 150,
  "storage": 15
}
```

## 💻 Exemplos de Uso no Frontend

### TypeScript Interfaces

As interfaces TypeScript estão disponíveis em `src/types/addons.ts`:

```typescript
import type {
  AddonType,
  AddonStatus,
  AddonPricing,
  SubscriptionAddon,
  PurchaseAddonDto,
  AddonLimits,
} from '../types/addons';
```

### React Hook para Comprar Add-on

```typescript
import { usePurchaseAddon } from '../hooks/usePurchaseAddon';

function MyComponent() {
  const { purchaseAddon, loading, error } = usePurchaseAddon(subscriptionId);

  const handlePurchase = async () => {
    try {
      const addon = await purchaseAddon({
        type: AddonType.EXTRA_USERS,
        quantity: 10,
      });
      console.log('Add-on comprado:', addon);
    } catch (err) {
      console.error('Erro:', err);
    }
  };
}
```

### React Hook para Listar Add-ons

```typescript
import { useAddons } from '../hooks/useAddons';

function AddonsComponent() {
  const { addons, loading, error, refetch } = useAddons(subscriptionId, false);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {addons.map(addon => (
        <div key={addon.id}>{addon.type} - {addon.quantity}</div>
      ))}
    </div>
  );
}
```

### Componente de Compra de Extras

```typescript
import { PurchaseAddonForm } from '../components/addons';

function AddonsPage() {
  return (
    <div>
      <h1>Comprar Extras</h1>
      <PurchaseAddonForm
        subscriptionId={subscriptionId}
        onSuccess={() => {
          console.log('Add-on comprado com sucesso!');
        }}
      />
    </div>
  );
}
```

### Componente de Lista de Add-ons

```typescript
import { AddonsList } from '../components/addons';

function MyAddonsPage() {
  return (
    <div>
      <h1>Meus Extras</h1>
      <AddonsList
        subscriptionId={subscriptionId}
        activeOnly={false}
        onAddonCancel={() => {
          console.log('Add-on cancelado');
        }}
      />
    </div>
  );
}
```

### Obter Limites Totais

```typescript
import { useAddonLimits } from '../hooks/useAddonLimits';

function LimitsComponent() {
  const { limits, loading, error } = useAddonLimits(subscriptionId);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <p>Usuários: {limits?.users}</p>
      <p>Propriedades: {limits?.properties}</p>
      <p>Armazenamento: {limits?.storage} GB</p>
    </div>
  );
}
```

## 📊 Preços Padrão

Os preços padrão dos add-ons são:

- **Usuário adicional**: R$ 15,00/mês por usuário
- **Propriedade adicional**: R$ 2,00/mês por propriedade
- **Armazenamento adicional**: R$ 5,00/mês por GB

**Nota:** Estes preços podem ser configurados no backend.

## ⚠️ Comportamento de Erros

### Erro ao Comprar

```json
{
  "statusCode": 400,
  "message": "A quantidade deve ser maior que zero",
  "error": "Bad Request"
}
```

### Erro de Permissão

```json
{
  "statusCode": 403,
  "message": "Você não tem permissão para comprar add-ons para esta assinatura",
  "error": "Forbidden"
}
```

### Erro de Assinatura Inativa

```json
{
  "statusCode": 400,
  "message": "Apenas assinaturas ativas podem comprar add-ons",
  "error": "Bad Request"
}
```

## 🔄 Fluxo de Compra

1. **Usuário seleciona tipo e quantidade**
2. **Frontend calcula preço** (unitPrice × quantity)
3. **Frontend mostra confirmação** com valor adicional
4. **Usuário confirma compra**
5. **Backend cria add-on** no banco de dados
6. **Backend recalcula preço** da assinatura (plano base + add-ons ativos)
7. **Backend atualiza no Asaas** automaticamente
8. **Próxima fatura** já terá o novo valor

## 📝 Notas Importantes

1. **Atualização Automática no Asaas**: O valor é atualizado automaticamente no Asaas após a compra
2. **Próxima Fatura**: O novo valor será aplicado na próxima fatura recorrente
3. **Cancelamento**: Ao cancelar um add-on, o valor é removido e atualizado no Asaas
4. **Limites**: Os limites são atualizados imediatamente após a compra
5. **Validação**: Apenas o dono da assinatura pode comprar add-ons

## 🔍 Troubleshooting

### Valor não foi atualizado no Asaas

**Causa:** Pode haver erro na comunicação com o Asaas.

**Solução:**
- Verificar logs do servidor
- Usar endpoint `POST /subscriptions/:id/addons/recalculate` para forçar atualização

### Limite não foi atualizado

**Causa:** Cache pode estar desatualizado.

**Solução:**
- Aguardar alguns segundos e verificar novamente
- Os limites são calculados em tempo real considerando add-ons ativos

### Erro ao cancelar add-on

**Causa:** Add-on já está cancelado ou não existe.

**Solução:**
- Verificar status do add-on antes de cancelar
- Verificar se o add-on pertence à assinatura do usuário

## 🔄 Última Atualização

**Data:** 05/01/2026

**Versão da API:** 1.0

**Status:** ✅ Implementado e Funcional

---

Para mais informações sobre a API de add-ons, consulte a documentação Swagger em `/api-docs`.







