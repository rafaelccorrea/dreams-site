# Documentação MCMV - Clientes e Propriedades

Esta documentação descreve como os campos MCMV estão implementados no sistema para **Clientes** e **Propriedades**.

## Índice

1. [Campos MCMV em Clientes](#campos-mcmv-em-clientes)
2. [Campos MCMV em Propriedades](#campos-mcmv-em-propriedades)
3. [Como Marcar um Cliente como Interessado em MCMV](#como-marcar-um-cliente-como-interessado-em-mcmv)
4. [Como Marcar uma Propriedade como MCMV](#como-marcar-uma-propriedade-como-mcmv)
5. [Tipos e Enums](#tipos-e-enums)
6. [Validações e Restrições](#validações-e-restrições)

---

## Campos MCMV em Clientes

### Visão Geral

Os campos MCMV no cadastro de clientes estão disponíveis para **todas as empresas**, independentemente de terem o módulo MCMV habilitado. Esses campos são especialmente úteis para empresas com o módulo MCMV habilitado, mas podem ser usados por qualquer empresa para rastrear informações relacionadas ao programa Minha Casa Minha Vida.

### Campos Disponíveis

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `leadSource` | `ClientSource` | Origem do cliente - será `dream_keys` quando criado via conversão de lead MCMV | Não |
| `mcmvInterested` | `boolean` | Se o cliente está interessado em MCMV | Não |
| `mcmvEligible` | `boolean` | Se o cliente é elegível para MCMV | Não |
| `mcmvIncomeRange` | `McmvIncomeRange \| null` | Faixa de renda MCMV (`faixa1`, `faixa2` ou `faixa3`) | Não |
| `mcmvCadunicoNumber` | `string \| null` | Número do Cadastro Único | Não |
| `mcmvPreRegistrationDate` | `Date \| null` | Data do pré-cadastro MCMV | Não |

### Interface TypeScript

```typescript
interface Client {
  // ... outros campos do cliente
  
  // Campos MCMV (disponíveis para todas as empresas)
  leadSource?: string; // ClientSource - será 'dream_keys' quando criado via conversão de lead MCMV
  mcmvInterested?: boolean;
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
  mcmvCadunicoNumber?: string | null;
  mcmvPreRegistrationDate?: string | null;
}
```

### Enum ClientSource

```typescript
export enum ClientSource {
  WHATSAPP = 'whatsapp',
  SOCIAL_MEDIA = 'social_media',
  PHONE = 'phone',
  OLX = 'olx',
  ZAP_IMOVEIS = 'zap_imoveis',
  VIVA_REAL = 'viva_real',
  DREAM_KEYS = 'dream_keys', // Site público Dream Keys - usado para leads MCMV
  OTHER = 'other',
}
```

**⚠️ IMPORTANTE - Origem do Cliente:**

- Quando um lead MCMV é convertido em cliente através do endpoint `POST /mcmv/leads/:leadId/convert`, o campo `leadSource` é automaticamente definido como `dream_keys`
- Isso permite rastrear que o cliente veio do site público Dream Keys
- Útil para relatórios e análises de conversão de leads MCMV
- O campo `leadSource` pode ser usado para filtrar clientes por origem

---

## Campos MCMV em Propriedades

### Visão Geral

Os campos MCMV no cadastro de propriedades estão disponíveis **apenas para empresas com módulo MCMV habilitado** (incluído por padrão no plano PRO). Se a empresa não tiver o módulo MCMV habilitado, os campos não aparecerão no formulário e tentar salvar propriedade com campos MCMV retornará erro `403 Forbidden`.

### Campos Disponíveis

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `mcmvEligible` | `boolean` | Se a propriedade é elegível para MCMV | Não |
| `mcmvIncomeRange` | `McmvIncomeRange \| null` | Faixa de renda MCMV compatível (`faixa1`, `faixa2` ou `faixa3`) | Sim (se `mcmvEligible = true`) |
| `mcmvMaxValue` | `number \| null` | Valor máximo da propriedade para MCMV | Não |
| `mcmvSubsidy` | `number \| null` | Valor do subsídio disponível | Não |
| `mcmvDocumentation` | `string[]` | Lista de documentos necessários para MCMV | Não |
| `mcmvNotes` | `string \| null` | Observações sobre MCMV | Não |

### Interface TypeScript

```typescript
interface Property {
  // ... outros campos da propriedade
  
  // Campos MCMV (disponíveis apenas para empresas com módulo MCMV habilitado)
  mcmvEligible?: boolean;
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
  mcmvMaxValue?: number | null;
  mcmvSubsidy?: number | null;
  mcmvDocumentation?: string[];
  mcmvNotes?: string | null;
}
```

### Validação no Backend

- Se a empresa não tiver o módulo MCMV habilitado, tentar salvar propriedade com campos MCMV retornará erro `403 Forbidden`
- Mensagem: "Acesso negado: MCMV está disponível apenas para empresas com o módulo MCMV habilitado"

---

## Como Marcar um Cliente como Interessado em MCMV

### No Formulário de Cliente

1. **Acesse o formulário de cadastro/edição de cliente**
   - URL: `/clients/new` (criar) ou `/clients/:id/edit` (editar)

2. **Localize a seção "Informações MCMV"**
   - A seção aparece após a seção "Preferências Imobiliárias" e antes da seção "Observações"

3. **Preencha os campos MCMV:**
   - **Checkbox "Interessado em MCMV"** (`mcmvInterested`)
     - Marque como `true` para indicar que o cliente demonstrou interesse no programa MCMV
     - Este campo deve ser preenchido quando o cliente menciona interesse em MCMV ou quando é convertido de um lead MCMV
   - **Checkbox "Elegível para MCMV"** (`mcmvEligible`)
     - Marque como `true` se o cliente atende aos critérios de elegibilidade do programa
     - Baseado na verificação de elegibilidade realizada
   - **Faixa de Renda MCMV** (`mcmvIncomeRange`)
     - Selecionar a faixa de renda do cliente: `faixa1`, `faixa2` ou `faixa3`
     - Baseado na renda familiar mensal do cliente
     - Visível apenas quando "Interessado em MCMV" está marcado
   - **Número do CadÚnico** (`mcmvCadunicoNumber`)
     - Número do Cadastro Único do cliente (se possuir)
     - Campo opcional mas importante para elegibilidade
     - Visível apenas quando "Interessado em MCMV" está marcado
   - **Data do Pré-Cadastro MCMV** (`mcmvPreRegistrationDate`)
     - Data em que o cliente fez pré-cadastro no programa MCMV
     - Geralmente preenchida automaticamente quando cliente é convertido de lead MCMV
     - Visível apenas quando "Interessado em MCMV" está marcado

4. **Salve o cliente**
   - Os campos MCMV serão salvos junto com os outros dados do cliente

### Via API

```typescript
// Ao criar ou atualizar um cliente via API
PUT /api/clients/:id
{
  // ... outros campos do cliente
  "leadSource": "dream_keys", // Se veio do site público
  "mcmvInterested": true,
  "mcmvEligible": true,
  "mcmvIncomeRange": "faixa2",
  "mcmvCadunicoNumber": "12345678901",
  "mcmvPreRegistrationDate": "2024-01-15T00:00:00.000Z"
}
```

### Fluxo de Cadastro

1. Usuário acessa cadastro/edição de cliente
2. Seção "Informações MCMV" está disponível no formulário (para todas as empresas)
3. Campos podem ser preenchidos manualmente ou automaticamente via conversão de lead
4. Campo `mcmvInterested` deve ser marcado quando cliente demonstra interesse em MCMV
5. Outros campos MCMV podem ser preenchidos conforme informações disponíveis

### Uso no Frontend

- Seção "Informações MCMV" aparece no formulário de cadastro/edição de clientes
- Checkbox para `mcmvInterested` está visível e acessível
- Campos MCMV são agrupados em uma seção dedicada
- Campos adicionais aparecem apenas quando `mcmvInterested` está marcado
- Exibir badge "Interessado em MCMV" na listagem de clientes quando `mcmvInterested = true`
- Filtrar clientes por interesse em MCMV (`mcmvInterested = true`)

### Validação

- Campos MCMV são opcionais no cadastro de clientes
- Não há restrição de módulo para preencher campos MCMV em clientes
- Campos são úteis para rastreamento e relatórios mesmo sem módulo MCMV habilitado

---

## Como Marcar uma Propriedade como MCMV

### No Formulário de Propriedade

1. **Acesse o formulário de cadastro/edição de propriedade**
   - URL: `/properties/new` (criar) ou `/properties/:id/edit` (editar)

2. **Verifique se a empresa tem módulo MCMV habilitado**
   - Se não tiver, os campos MCMV não aparecerão no formulário

3. **Localize a seção "Informações MCMV"**
   - A seção aparece na etapa de cadastro da propriedade

4. **Preencha os campos MCMV:**
   - **Checkbox "Elegível para MCMV"** (`mcmvEligible`)
     - Marque como `true` para indicar que a propriedade pode ser financiada via MCMV
   - **Faixa de Renda MCMV** (`mcmvIncomeRange`)
     - Selecionar a faixa de renda compatível: `faixa1`, `faixa2` ou `faixa3`
     - Baseado no valor da propriedade e subsídio disponível
     - Obrigatório se `mcmvEligible = true`
   - **Valor Máximo para MCMV** (`mcmvMaxValue`)
     - Valor máximo que a propriedade pode ter para ser financiada via MCMV
     - Geralmente o valor de venda da propriedade
   - **Valor do Subsídio** (`mcmvSubsidy`)
     - Valor do subsídio disponível para esta propriedade
     - Calculado baseado na faixa de renda
   - **Documentos Necessários** (`mcmvDocumentation`)
     - Array de strings com lista de documentos necessários
     - Exemplo: `["CPF", "RG", "Comprovante de Renda", "CadÚnico"]`
   - **Observações MCMV** (`mcmvNotes`)
     - Texto livre com observações específicas sobre MCMV para esta propriedade

5. **Salve a propriedade**
   - Os campos MCMV serão salvos junto com os outros dados da propriedade
   - Se a empresa não tiver módulo MCMV habilitado, retornará erro `403 Forbidden`

### Via API

```typescript
// Ao criar ou atualizar uma propriedade via API
PUT /api/properties/:id
{
  // ... outros campos da propriedade
  "mcmvEligible": true,
  "mcmvIncomeRange": "faixa2",
  "mcmvMaxValue": 250000.00,
  "mcmvSubsidy": 50000.00,
  "mcmvDocumentation": [
    "CPF",
    "RG",
    "Comprovante de Renda",
    "Comprovante de Residência",
    "CadÚnico"
  ],
  "mcmvNotes": "Propriedade elegível para Faixa 2. Subsídio de R$ 50.000 disponível."
}
```

### Validação no Backend

- Se a empresa não tiver o módulo MCMV habilitado, tentar salvar propriedade com campos MCMV retornará erro `403 Forbidden`
- Mensagem: "Acesso negado: MCMV está disponível apenas para empresas com o módulo MCMV habilitado"

### No Frontend

- Campos MCMV devem estar ocultos/desabilitados se a empresa não tiver módulo MCMV
- Mostrar mensagem: "Funcionalidade MCMV disponível apenas para empresas com módulo MCMV habilitado"
- Seção MCMV deve aparecer apenas no formulário de cadastro/edição de propriedades quando módulo estiver habilitado

### Fluxo de Cadastro

1. Usuário acessa cadastro de propriedade
2. Sistema verifica se empresa tem módulo MCMV habilitado
3. Se sim, mostra seção "Informações MCMV" com todos os campos
4. Se não, oculta completamente a seção MCMV
5. Ao salvar, backend valida novamente o acesso ao módulo

---

## Tipos e Enums

### Enum: McmvIncomeRange

O campo `mcmvIncomeRange` (faixa de renda MCMV) é usado tanto em **Clientes** quanto em **Propriedades** e aceita os seguintes valores:

| Valor | Descrição |
|-------|-----------|
| `faixa1` | Faixa 1 de renda (até R$ 1.800) |
| `faixa2` | Faixa 2 de renda (R$ 1.801 até R$ 2.600) |
| `faixa3` | Faixa 3 de renda (R$ 2.601 até R$ 4.000) |

**Uso em Clientes:**

```typescript
interface Client {
  // ... outros campos
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
}
```

**Uso em Propriedades:**

```typescript
interface Property {
  // ... outros campos
  mcmvIncomeRange?: 'faixa1' | 'faixa2' | 'faixa3' | null;
}
```

---

## Validações e Restrições

### Clientes

- ✅ Campos MCMV estão disponíveis para **todas as empresas**
- ✅ Campos MCMV são **opcionais** no cadastro de clientes
- ✅ Não há restrição de módulo para preencher campos MCMV em clientes
- ✅ Campos são úteis para rastreamento e relatórios mesmo sem módulo MCMV habilitado

### Propriedades

- ⚠️ Campos MCMV estão disponíveis **apenas para empresas com módulo MCMV habilitado**
- ⚠️ Se a empresa não tiver o módulo MCMV habilitado, tentar salvar propriedade com campos MCMV retornará erro `403 Forbidden`
- ✅ Campo `mcmvIncomeRange` é obrigatório se `mcmvEligible = true`
- ✅ Campos MCMV são opcionais no cadastro de propriedades (exceto `mcmvIncomeRange` quando `mcmvEligible = true`)

### Conversão de Leads MCMV

- Quando um lead MCMV é convertido em cliente através do endpoint `POST /mcmv/leads/:leadId/convert`:
  - Campo `leadSource` é automaticamente definido como `dream_keys`
  - Campo `mcmvInterested` é automaticamente definido como `true`
  - Campo `mcmvEligible` é definido com base na elegibilidade do lead
  - Campo `mcmvIncomeRange` é definido com base na faixa de renda do lead
  - Campo `mcmvPreRegistrationDate` é definido com a data do pré-cadastro do lead
  - Campo `mcmvCadunicoNumber` é definido com o número do CadÚnico do lead (se fornecido)

---

## Resumo das Diferenças

| Aspecto | Clientes | Propriedades |
|---------|----------|--------------|
| **Disponibilidade** | Todas as empresas | Apenas empresas com módulo MCMV |
| **Restrição de Módulo** | Não há restrição | Requer módulo MCMV habilitado |
| **Campos Principais** | `mcmvInterested`, `mcmvEligible`, `mcmvIncomeRange`, `mcmvCadunicoNumber`, `mcmvPreRegistrationDate` | `mcmvEligible`, `mcmvIncomeRange`, `mcmvMaxValue`, `mcmvSubsidy`, `mcmvDocumentation`, `mcmvNotes` |
| **Campo de Origem** | `leadSource` (pode ser `dream_keys` quando convertido de lead MCMV) | N/A |
| **Validação Backend** | Não valida módulo MCMV | Valida módulo MCMV (retorna 403 se não tiver) |

---

## Notas Importantes

1. **Campos MCMV em Clientes:**
   - Disponíveis para todas as empresas, independentemente de terem o módulo MCMV habilitado
   - Úteis para rastreamento e relatórios mesmo sem módulo MCMV habilitado
   - Especialmente úteis para empresas com o módulo MCMV habilitado

2. **Campos MCMV em Propriedades:**
   - Disponíveis apenas para empresas com módulo MCMV habilitado (incluído por padrão no plano PRO)
   - Se a empresa não tiver o módulo MCMV habilitado, os campos não aparecerão no formulário
   - Tentar salvar propriedade com campos MCMV sem módulo retornará erro `403 Forbidden`

3. **Conversão de Leads MCMV:**
   - Quando um lead MCMV é convertido em cliente, os campos MCMV são automaticamente preenchidos
   - O campo `leadSource` é automaticamente definido como `dream_keys`
   - Isso permite rastrear que o cliente veio do site público Dream Keys

4. **Faixa de Renda MCMV:**
   - Usado tanto em clientes quanto em propriedades
   - Valores possíveis: `faixa1`, `faixa2`, `faixa3`
   - Baseado na renda familiar mensal do cliente ou no valor da propriedade

---

## Suporte

Para dúvidas ou problemas relacionados aos campos MCMV em clientes ou propriedades, entre em contato com a equipe de desenvolvimento.

