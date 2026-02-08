# API Pública de Planos - Especificação

## Endpoint

```
GET /public/plans
```

**Descrição:** Retorna a lista de planos ativos disponíveis para exibição pública na landing page.

**Autenticação:** Não requerida (rota pública)

**Headers:**
```
Content-Type: application/json
```

## Resposta

### Status Code: 200 OK

### Estrutura da Resposta

A resposta deve ser um array de objetos `Plan`:

```typescript
[
  {
    "id": "string (UUID)",
    "name": "string",
    "type": "basic" | "pro" | "custom",
    "price": "string (número como string) ou number",
    "maxCompanies": number,
    "description": "string",
    "modules": "string (JSON array como string) ou array de strings",
    "features": "string (JSON object como string) ou object",
    "isActive": boolean,
    "isDefault": boolean (opcional),
    "displayOrder": number,
    "createdAt": "string (ISO date)" (opcional),
    "updatedAt": "string (ISO date)" (opcional)
  }
]
```

## Exemplo de Resposta

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Plano Básico",
    "type": "basic",
    "price": "97.90",
    "maxCompanies": 1,
    "description": "Plano ideal para imobiliárias pequenas que estão começando",
    "modules": "[\"user_management\",\"company_management\",\"basic_reports\",\"image_gallery\",\"team_management\",\"asset_management\"]",
    "features": "{\"maxUsers\":5,\"maxProperties\":50,\"storageGB\":2,\"supportLevel\":\"basic\",\"apiAccess\":false,\"customFields\":false,\"advancedReports\":false,\"integrations\":false}",
    "isActive": true,
    "isDefault": true,
    "displayOrder": 1,
    "createdAt": "2025-09-25 16:00:50.580427",
    "updatedAt": "2025-11-10 00:57:44.36542"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Plano Profissional",
    "type": "pro",
    "price": "247.90",
    "maxCompanies": 3,
    "description": "Plano completo para imobiliárias em crescimento e expansão",
    "modules": "[\"user_management\", \"company_management\", \"basic_reports\", \"image_gallery\", \"team_management\", \"advanced_reports\", \"property_management\", \"client_management\", \"kanban_management\", \"calendar_management\"]",
    "features": "{\"maxUsers\":25,\"maxProperties\":500,\"storageGB\":10,\"supportLevel\":\"priority\",\"apiAccess\":true,\"customFields\":true,\"advancedReports\":true,\"integrations\":true,\"workflowAutomation\":true,\"marketingTools\":true}",
    "isActive": true,
    "isDefault": false,
    "displayOrder": 2,
    "createdAt": "2025-09-25 16:00:50.729748",
    "updatedAt": "2025-11-10 00:57:45.271328"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Plano Personalizado",
    "type": "custom",
    "price": "147.90",
    "maxCompanies": 0,
    "description": "Solução completa com recursos avançados para grandes imobiliárias",
    "modules": "[\"user_management\",\"company_management\",\"basic_reports\",\"image_gallery\",\"team_management\",\"advanced_reports\",\"property_management\",\"client_management\",\"kanban_management\",\"financial_management\",\"marketing_tools\",\"api_integrations\",\"custom_fields\",\"workflow_automation\",\"business_intelligence\",\"third_party_integrations\",\"white_label\",\"priority_support\",\"calendar_management\",\"vistoria\",\"key_control\",\"rental_management\",\"commission_management\"]",
    "features": "{\"maxUsers\":100,\"maxProperties\":2000,\"storageGB\":50,\"supportLevel\":\"premium\",\"apiAccess\":true,\"customFields\":true,\"advancedReports\":true,\"integrations\":true,\"workflowAutomation\":true,\"marketingTools\":true,\"businessIntelligence\":true,\"whiteLabel\":true,\"prioritySupport\":true,\"customModules\":true,\"dedicatedSupport\":true}",
    "isActive": true,
    "isDefault": false,
    "displayOrder": 3,
    "createdAt": "2025-09-25 16:00:50.877373",
    "updatedAt": "2025-11-10 00:57:45.984748"
  }
]
```

## Campos Detalhados

### `id` (string, obrigatório)
- UUID único do plano
- Exemplo: `"550e8400-e29b-41d4-a716-446655440001"`

### `name` (string, obrigatório)
- Nome do plano para exibição
- Exemplo: `"Plano Básico"`

### `type` (string, obrigatório)
- Tipo do plano: `"basic"`, `"pro"` ou `"custom"`
- Usado para determinar qual conjunto de features exibir

### `price` (string ou number, obrigatório)
- Preço do plano em formato decimal
- Pode ser string (`"97.90"`) ou number (`97.90`)
- Exemplo: `"97.90"` ou `97.90`

### `maxCompanies` (number, obrigatório)
- Número máximo de empresas permitidas no plano
- `0` significa ilimitado (para planos customizados)

### `description` (string, obrigatório)
- Descrição do plano
- Exemplo: `"Plano ideal para imobiliárias pequenas que estão começando"`

### `modules` (string ou array, obrigatório)
- Lista de módulos disponíveis no plano
- Pode ser:
  - String JSON: `"[\"user_management\",\"company_management\"]"`
  - Array de strings: `["user_management","company_management"]`
- Módulos comuns:
  - `user_management`
  - `company_management`
  - `basic_reports`
  - `advanced_reports`
  - `property_management`
  - `client_management`
  - `kanban_management`
  - `calendar_management`
  - `financial_management`
  - `marketing_tools`
  - `api_integrations`
  - `custom_fields`
  - `workflow_automation`
  - `business_intelligence`
  - `white_label`
  - `priority_support`
  - `vistoria`
  - `key_control`
  - `rental_management`
  - `commission_management`

### `features` (string ou object, obrigatório)
- Objeto JSON com features específicas do plano
- Pode ser:
  - String JSON: `"{\"maxUsers\":5,\"maxProperties\":50}"`
  - Objeto: `{"maxUsers":5,"maxProperties":50}`
- Campos possíveis:
  - `maxUsers` (number): Número máximo de usuários
  - `maxProperties` (number): Número máximo de propriedades
  - `storageGB` (number): Armazenamento em GB
  - `supportLevel` (string): Nível de suporte (`"basic"`, `"priority"`, `"premium"`)
  - `apiAccess` (boolean): Acesso à API
  - `customFields` (boolean): Campos personalizados
  - `advancedReports` (boolean): Relatórios avançados
  - `integrations` (boolean): Integrações
  - `workflowAutomation` (boolean): Automação de workflow
  - `marketingTools` (boolean): Ferramentas de marketing
  - `businessIntelligence` (boolean): Business Intelligence
  - `whiteLabel` (boolean): White Label
  - `prioritySupport` (boolean): Suporte prioritário
  - `customModules` (boolean): Módulos personalizados
  - `dedicatedSupport` (boolean): Suporte dedicado

### `isActive` (boolean, obrigatório)
- Indica se o plano está ativo e deve ser exibido
- Apenas planos com `isActive: true` devem ser retornados

### `isDefault` (boolean, opcional)
- Indica se é o plano padrão

### `displayOrder` (number, obrigatório)
- Ordem de exibição dos planos (menor número aparece primeiro)
- Usado para ordenar os planos na landing page

### `createdAt` (string, opcional)
- Data de criação do plano (ISO format)

### `updatedAt` (string, opcional)
- Data de última atualização do plano (ISO format)

## Filtros e Ordenação

- Apenas planos com `isActive: true` devem ser retornados
- Os planos devem ser ordenados por `displayOrder` (ascendente)
- Não requer paginação (retorna todos os planos ativos)

## Tratamento de Erros

### 500 Internal Server Error
Se houver erro no servidor, o frontend tratará com fallback para planos mockados.

## Notas de Implementação

1. **Compatibilidade:** O frontend aceita tanto strings JSON quanto objetos/arrays para `modules` e `features`
2. **Ordenação:** Os planos devem vir ordenados por `displayOrder` do menor para o maior
3. **Filtro:** Apenas planos ativos (`isActive: true`) devem ser retornados
4. **Performance:** Esta é uma rota pública e pode ser cacheada (sugestão: cache de 1 hora)

## Exemplo de Query SQL (PostgreSQL)

```sql
SELECT 
  id,
  name,
  type,
  price::text as price,
  max_companies as "maxCompanies",
  description,
  modules::text as modules,
  features::text as features,
  is_active as "isActive",
  is_default as "isDefault",
  display_order as "displayOrder",
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM plans
WHERE is_active = true
ORDER BY display_order ASC;
```

## Exemplo de Implementação (Node.js/Express)

```javascript
router.get('/public/plans', async (req, res) => {
  try {
    const plans = await db.query(`
      SELECT 
        id,
        name,
        type,
        price::text as price,
        max_companies as "maxCompanies",
        description,
        modules::text as modules,
        features::text as features,
        is_active as "isActive",
        is_default as "isDefault",
        display_order as "displayOrder",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM plans
      WHERE is_active = true
      ORDER BY display_order ASC
    `);
    
    res.json(plans.rows);
  } catch (error) {
    console.error('Erro ao buscar planos públicos:', error);
    res.status(500).json({ error: 'Erro ao buscar planos' });
  }
});
```

