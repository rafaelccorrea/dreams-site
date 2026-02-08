# Kanban – API de validações de coluna

Documentação da API de **validações** do Kanban: endpoints, tipos de validação, comportamentos e quando são executadas. Serve para o frontend integrar a tela de validações e tratar bloqueios/avisos ao mover tarefas.

> **Relacionado:** Ações de coluna (criar propriedade, enviar e-mail, etc.) estão documentadas em [kanban-acoes-coluna-api.md](./kanban-acoes-coluna-api.md). Validações e ações usam o mesmo controller (`kanban/columns`) e a mesma permissão para criar/editar/excluir (`kanban:manage_validations_actions`).

---

## 1. Visão geral

As validações são regras configuradas **por coluna** e executadas **ao mover uma tarefa** (da coluna de origem para a de destino). Elas rodam na **coluna de origem** (de onde a tarefa está saindo). Se alguma validação falhar com comportamento **block**, o movimento é **bloqueado** (400) e a tarefa não muda de coluna.

- **Base URL:** mesmo controller das ações: **Kanban - Validações e Ações**
- **Prefixo:** `kanban/columns`
- **Exemplo:** `GET /kanban/columns/{columnId}/validations`

O `columnId` é a coluna onde a validação está configurada. No fluxo de movimento, as validações da **coluna de origem** (de onde a tarefa sai) são as que são executadas.

---

## 2. Endpoints – Validações

| Ação     | Método | Rota | Permissão | Observação |
|----------|--------|------|-----------|------------|
| Listar   | GET    | `/:columnId/validations` | Nenhuma específica (módulo Kanban) | Qualquer usuário com acesso ao Kanban pode listar. |
| Criar    | POST   | `/:columnId/validations` | `kanban:manage_validations_actions` | 403 se não tiver. |
| Atualizar| PUT    | `/validations/:validationId` | `kanban:manage_validations_actions` | 403 se não tiver. |
| Excluir  | DELETE | `/validations/:validationId` | `kanban:manage_validations_actions` | 403 se não tiver. |
| Reordenar| POST   | `/:columnId/validations/reorder` | `kanban:manage_validations_actions` | 403 se não tiver. |

- **Listar:** não exige permissão de gerenciar; todos podem ver as validações da coluna.
- **Criar / Editar / Excluir / Reordenar:** exigem `KANBAN_MANAGE_VALIDATIONS_ACTIONS` (`kanban:manage_validations_actions`).

---

## 3. GET `/:columnId/validations`

Retorna todas as validações **ativas** da coluna, ordenadas por `order`.

**Resposta 200:** array de objetos no formato abaixo.

**Exemplo de item:**

```json
{
  "id": "uuid",
  "columnId": "uuid",
  "fromColumnId": "uuid ou null",
  "requireAdjacentPosition": false,
  "type": "required_field",
  "config": { ... },
  "behavior": "block",
  "message": "Campo obrigatório não preenchido",
  "order": 0,
  "isActive": true,
  "createdById": "uuid",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 4. Tipos de validação (`type`)

O backend implementa cinco tipos. O `config` varia conforme o tipo.

| Tipo (`type`)            | Nome sugerido (UI)     | Descrição | Config principal | Status no backend |
|--------------------------|------------------------|-----------|-------------------|-------------------|
| `required_field`         | Campo obrigatório      | Exige que um campo da tarefa (ou customizado) tenha valor. | `fieldName`, `customFieldId` | Implementado (campos comuns + customFields). |
| `required_checklist`     | Checklist obrigatório | Exige itens do checklist (da ficha de venda) completos. | `checklistId`, `requiredItems`, `allItemsRequired` | Implementado (SaleChecklistService). |
| `required_document`      | Documento obrigatório  | Exige documento(s) por tipo/status/categoria. | `documentType`, `documentStatus`, `minDocuments`, `documentCategory` | Parcial: estrutura pronta; falta vínculo tarefa ↔ documentos. |
| `required_relationship`  | Relacionamento obrigatório | Exige tarefa vinculada a cliente, imóvel, projeto ou aluguel. | `relationshipType` (client/property/project/rental), `required` | Parcial: só `project` (projectId) verificado; client/property/rental retornam false. |
| `custom_condition`       | Condição customizada   | Regra com campo + operador + valor. | `condition`: `{ field, operator, value, valueType? }` | Implementado. |

### 4.1 Detalhes por tipo

**required_field**

- `config.fieldName`: campo da tarefa (ex.: `assignedToId`, `dueDate`, `priority`, `title`, `description`, `projectId`).
- `config.customFieldId`: UUID do campo customizado; o valor é lido de `task.customFields[customFieldId]`.
- Se não preenchido, a validação falha e a mensagem pode ser a customizada ou gerada (ex.: "Campo 'X' é obrigatório").

**required_checklist**

- `config.checklistId`: ID do checklist (ficha de venda).
- `config.allItemsRequired`: se `true`, todos os itens devem estar completos.
- `config.requiredItems`: array de IDs de itens que são obrigatórios; só esses são checados.
- Se nenhum dos dois for usado, exige “pelo menos um item completo”.
- Depende de `userId` e `companyId` no contexto da movimentação (para buscar o checklist).

**required_document**

- `config.documentType`, `documentStatus` (`any` | `signed` | `approved`), `minDocuments`, `documentCategory`.
- Hoje a validação **sempre falha** (retorno false) até existir vínculo claro entre tarefa e documentos no backend.

**required_relationship**

- `config.relationshipType`: `client` | `property` | `project` | `rental`.
- `config.required`: boolean (default true); se false, a validação não exige o vínculo.
- **Implementado:** apenas `project` (usa `task.projectId`). Para `client`, `property` e `rental` o executor ainda retorna false (a tarefa já tem `clientId`/`propertyId`; falta uso no executor).

**custom_condition**

- `config.condition`: `{ field, operator, value, valueType? }`.
- `field`: caminho no objeto tarefa (ex.: `priority`, `assignedToId`, `customFields.xxx`).
- `operator`: `equals`, `not_equals`, `greater_than`, `less_than`, `greater_or_equal`, `less_or_equal`, `contains`, `not_contains`, `empty`, `not_empty`, `in`, `not_in`.
- `value`: valor de comparação; para `in`/`not_in`, array.
- `valueType`: opcional, `string` | `number` | `date` | `boolean` | `array`.

---

## 5. Comportamento (`behavior`)

Quando a validação **falha** (não passa), o comportamento define o que acontece no movimento:

| Valor             | Efeito |
|-------------------|--------|
| `block`           | **Bloqueia** o movimento. Backend retorna **400** com `validationResults` e `failedValidations`; a tarefa não muda de coluna. |
| `warn`            | **Não bloqueia.** A mensagem da validação é adicionada ao array `warnings` na resposta; o movimento é concluído. |
| `mark_incomplete`  | **Não bloqueia.** Não gera aviso na resposta atual; pensado para marcar a tarefa como incompleta (comportamento específico pode ser expandido no futuro). |

Só validações com `behavior === 'block'` e que falharam causam 400.

---

## 6. Coluna de origem e posição adjacente

- **`fromColumnId`** (opcional): se preenchido, a validação **só se aplica** quando a tarefa está indo **para essa coluna** (a coluna de destino do movimento deve ser a indicada em `fromColumnId`). Se `fromColumnId` for null, a validação se aplica a **qualquer** coluna de destino.
- **`requireAdjacentPosition`** (opcional, default false): se `true`, a validação **só roda** quando o movimento é para a coluna **imediatamente à frente** (posição origem + 1). Movimentos “para trás” ou para colunas não adjacentes não disparam essa validação.

**Resumo:** as validações ficam na **coluna de origem** (de onde a tarefa sai). Ao mover da coluna A para a coluna B, são consideradas as validações da coluna A que:
- tenham `fromColumnId` null ou igual a B, e
- se `requireAdjacentPosition` for true, que a posição de B seja adjacente à de A (movimento para frente).

---

## 7. POST `/:columnId/validations` – Criar validação

**Body (CreateKanbanColumnValidationDto):**

- `type` (obrigatório): um de `required_field` | `required_checklist` | `required_document` | `required_relationship` | `custom_condition`.
- `config` (obrigatório): objeto conforme o tipo (ver seção 4 e `ValidationConfigDto`).
- `behavior` (obrigatório): `block` | `warn` | `mark_incomplete`.
- `message` (obrigatório): mensagem exibida quando a validação falha (o backend pode gerar mensagem específica).
- `order` (opcional): número para ordenação.
- `fromColumnId` (opcional): UUID da coluna de destino à qual esta validação se aplica; se omitido, aplica a qualquer destino.
- `requireAdjacentPosition` (opcional): se `true`, só valida em movimento para coluna adjacente à frente.

**Exemplo – campo obrigatório:**

```json
{
  "type": "required_field",
  "config": {
    "fieldName": "assignedToId"
  },
  "behavior": "block",
  "message": "A tarefa deve ter um responsável atribuído"
}
```

**Exemplo – condição customizada:**

```json
{
  "type": "custom_condition",
  "config": {
    "condition": {
      "field": "priority",
      "operator": "not_empty",
      "value": null,
      "valueType": "string"
    }
  },
  "behavior": "block",
  "message": "A prioridade deve estar definida"
}
```

**Exemplo – só para coluna destino específica e adjacente:**

```json
{
  "type": "required_field",
  "config": { "fieldName": "totalValue" },
  "behavior": "block",
  "message": "Valor total é obrigatório nesta etapa",
  "fromColumnId": "uuid-da-coluna-destino",
  "requireAdjacentPosition": true
}
```

---

## 8. PUT `/validations/:validationId` – Atualizar validação

**Body (UpdateKanbanColumnValidationDto):** todos os campos opcionais; enviar só o que for alterar.

- `type`, `config`, `behavior`, `message`, `order`, `isActive`, `fromColumnId`, `requireAdjacentPosition`

---

## 9. POST `/:columnId/validations/reorder` – Reordenar

**Body:**

```json
{
  "validationIds": ["uuid1", "uuid2", "uuid3"]
}
```

A ordem do array é a nova ordem de execução (índice 0 = primeira).

---

## 10. Resposta ao mover tarefa (POST `/kanban/tasks/move`)

Quando há validações na coluna de origem e alguma falha com `behavior: block`, o backend responde **400** com corpo no formato:

```json
{
  "message": "Mensagem de erro (ex.: Campo 'X' é obrigatório)",
  "validationResults": [
    {
      "validationId": "uuid",
      "validationType": "required_field",
      "passed": false,
      "message": "Campo 'assignedToId' é obrigatório",
      "details": { "fieldName": "assignedToId", "hasValue": false, ... }
    }
  ],
  "failedValidations": [
    {
      "validationId": "uuid",
      "validationType": "required_field",
      "message": "...",
      "details": { ... },
      "fieldName": "assignedToId",
      "customFieldId": null
    }
  ],
  "blocked": true,
  "warnings": [],
  "totalFailed": 1
}
```

O front pode usar `validationResults` e `failedValidations` para exibir quais regras falharam e, se houver, `fieldName`/`customFieldId` para destacar o campo no formulário.

Se todas as validações passarem ou só houver `warn`, o movimento segue e as mensagens de aviso vêm em `warnings` (quando houver).

---

## 11. Resumo para o frontend

1. **Listar:** `GET /kanban/columns/:columnId/validations` — sem permissão de gerenciar; usar para exibir lista na tela da coluna.
2. **Criar/editar/excluir/reordenar:** exigem `kanban:manage_validations_actions`; mostrar botões apenas para quem tem a permissão.
3. **Tipos a oferecer na UI:** os cinco tipos acima; para `required_document` e `required_relationship` (client/property/rental) deixar claro que estão parcialmente implementados ou “em breve”.
4. **Comportamentos:** explicar block (impede mover), warn (só aviso), mark_incomplete (não bloqueia).
5. **fromColumnId e requireAdjacentPosition:** opcionais; usar quando a validação deve aplicar só a uma coluna de destino ou só em movimento adjacente para frente.
6. **Tratamento de 400 no move:** ler `message`, `failedValidations` e `validationResults` para feedback e, se possível, foco em campo (`fieldName`/`customFieldId`).

Com isso, a tela de validações e o fluxo de movimentação de tarefas podem ser integrados de forma consistente com a API.
