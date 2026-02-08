# Kanban – Ações de coluna (API e tipos implementados)

Documentação do endpoint **`/kanban/columns/:columnId/actions`** e das ações de coluna que podem ser configuradas no Kanban. Serve para o frontend exibir a tela de ações de forma correta e oferecer apenas o que está implementado hoje.

*(Este documento trata de **ações** de coluna. Validações de coluna possuem endpoints e documentação próprios.)*

---

## 1. Base URL e rota

- **Base:** `GET` / `POST` / `PUT` / `DELETE` sob o controller **Kanban - Validações e Ações**
- **Prefixo:** `kanban/columns`
- **Exemplo:** `GET /kanban/columns/b78b9ac6-c2d1-4346-b079-f1ebada5067f/actions`

O `columnId` deve ser o ID de uma coluna do quadro que o usuário está visualizando (mesmo time). O backend não valida acesso à coluna neste controller; o front deve chamar apenas para colunas do board já carregado.

---

## 2. Endpoints – Ações de coluna

| Ação     | Método | Rota | Permissão necessária | Observação |
|----------|--------|------|----------------------|------------|
| Listar   | GET    | `/:columnId/actions` | Nenhuma específica (só módulo Kanban) | Qualquer usuário com acesso ao Kanban pode listar. |
| Criar    | POST   | `/:columnId/actions` | `kanban:manage_validations_actions` | 403 se não tiver. |
| Atualizar| PUT    | `/actions/:actionId` | `kanban:manage_validations_actions` | 403 se não tiver. |
| Excluir  | DELETE | `/actions/:actionId` | `kanban:manage_validations_actions` | 403 se não tiver. |
| Reordenar| POST   | `/:columnId/actions/reorder` | `kanban:manage_validations_actions` | 403 se não tiver. |

- **Listar:** não exige a permissão de gerenciar validações/ações. Ou seja, **todos** podem ver a lista de ações da coluna.
- **Criar / Editar / Excluir / Reordenar:** exigem a permissão `KANBAN_MANAGE_VALIDATIONS_ACTIONS` (`kanban:manage_validations_actions`). Usuários sem essa permissão recebem **403**.

**Sugestão para o front:**

- Sempre mostrar a **lista** de ações para quem está na tela da coluna.
- Mostrar botões **“Adicionar ação”**, **“Editar”**, **“Excluir”** e **“Reordenar”** apenas se o usuário tiver a permissão `kanban:manage_validations_actions` (ex.: vinda do endpoint de permissões do usuário ou do módulo Kanban). Se não tiver, exibir a lista em modo somente leitura.

**Execução das ações (ao mover tarefa):** quando o usuário move uma tarefa e a coluna tem ações configuradas (ex.: criar propriedade, criar cliente, enviar e-mail), o backend **executa** essas ações **sem** exigir que o usuário que moveu tenha a permissão específica daquele recurso (ex.: criar propriedade, criar cliente). As ações de coluna são **automações** definidas por quem configurou a coluna; quem move a tarefa só precisa ter permissão para **mover tarefa** (`canMoveTasks`). Ou seja: não é necessário que o usuário tenha, por exemplo, permissão de criar propriedade para que a ação “criar propriedade” rode ao entrar na coluna.

---

## 3. GET `/:columnId/actions`

**Query (opcional):**

- `trigger` – filtra por gatilho: `on_enter` | `on_exit` | `on_stay`. Se omitido, retorna todas.

**Resposta 200:** array de ações no formato abaixo (cada item = `KanbanColumnActionResponseDto`).

**Exemplo de item:**

```json
{
  "id": "uuid",
  "columnId": "uuid",
  "fromColumnId": "uuid ou null",
  "requireAdjacentPosition": false,
  "trigger": "on_enter",
  "type": "assign_user",
  "config": { ... },
  "conditions": [],
  "order": 0,
  "isActive": true,
  "intervalHours": null,
  "maxExecutions": null,
  "executionCount": 0,
  "lastExecutionAt": null,
  "createdById": "uuid",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 4. Triggers (gatilhos)

| Valor      | Significado |
|------------|-------------|
| `on_enter` | Ao **entrar** na coluna (tarefa movida para esta coluna). |
| `on_exit`  | Ao **sair** da coluna (tarefa movida para outra coluna). |
| `on_stay`  | Enquanto **permanece** na coluna (ex.: a cada X horas; job periódico usa `intervalHours` e `maxExecutions`). |

**Importante:** Nem toda ação faz sentido com todo trigger. Ex.: **criar propriedade** “enquanto permanece” (a cada X horas) não faz sentido — criaria várias propriedades para a mesma tarefa. O backend **rejeita** (400) combinações inválidas (ver tabela na seção 5.1).

---

## 5. Tipos de ação – o que está implementado hoje

O backend só **executa** de fato os tipos listados abaixo (ao mover tarefa ou no job de `on_stay`). Os demais tipos do enum retornam mensagem do tipo *“Tipo de ação não implementado”*.

### 5.1 Triggers permitidos por tipo (validação no backend)

Alguns tipos **só aceitam** `on_enter`. Se enviar `on_exit` ou `on_stay` para esses tipos, a API responde **400** com mensagem explicando.

| Tipo (`type`)          | Nome sugerido (UI)       | Triggers aceitos        | Config principal |
|------------------------|--------------------------|-------------------------|------------------|
| `assign_user`          | Atribuir responsável     | **Só on_enter**         | `userId` (UUID)  |
| `set_priority`         | Definir prioridade       | **Só on_enter**         | `priority`: low, medium, high, urgent |
| `set_due_date`         | Definir data limite      | **Só on_enter**         | `value` (ISO date) |
| `add_tag`              | Adicionar tag            | **Só on_enter**         | `tagIds` (array UUID) |
| `create_property`      | Criar propriedade        | **Só on_enter**         | `fieldMapping` (tarefa → imóvel) |
| `create_client`        | Criar cliente            | **Só on_enter**         | `fieldMapping` (tarefa → cliente) |
| `create_document`      | Criar documento          | **Só on_enter**         | `fieldMapping`, `documentType`, etc. |
| `schedule_task`        | Agendar tarefa           | **Só on_enter**         | `scheduledFor` (data), `taskConfig` |
| `schedule_email`       | Agendar e-mail           | **Só on_enter**         | `scheduledFor`, `recipients`, `subject`, `message`, `template` |
| `start_email_sequence` | Iniciar sequência de e-mail | **Só on_enter**     | `sequenceId` (UUID) — *depende de sequências configuradas no produto* |
| `send_email`           | Enviar e-mail            | on_enter, on_exit, on_stay | `recipients`, `subject`, `message` (template `{{taskTitle}}`, etc.) |
| `send_notification`    | Enviar notificação       | on_enter, on_exit, on_stay | `recipients`, `message`, `subject`, `notificationType` |
| `update_score`         | Atualizar score          | on_enter, on_stay       | (sem config; recalcula score) — *on_stay = recalcular periodicamente* |

- **Por que “só on_enter” para create_* e assign/set/add/schedule/start_email_sequence?** Ao **sair** ou **enquanto permanece** (a cada X horas), repetir “criar propriedade”, “atribuir usuário”, “iniciar sequência” etc. não faz sentido ou gera duplicidade. O backend valida e retorna 400.
- **start_email_sequence:** existe no backend (inicia sequência de e-mails configurada). Só faz sentido **uma vez**, ao entrar. Conferir no produto se há tela de configuração de sequências de e-mail.
- **on_stay** faz sentido para: `update_score` (recalcular score periodicamente) e, com cuidado, `send_email` / `send_notification` (ex.: lembrete a cada X horas).

### 5.2 Detalhes dos implementados

- **assign_user / add_tag / set_priority / set_due_date:** a execução é aplicada no próprio movimento da tarefa (o `kanban.service` aplica no update da tarefa após as ações de entrada).
- **create_property / create_client / create_document:** criam a entidade e registram execução; se a ação já tiver sido executada para a mesma tarefa, faz bypass (não cria de novo, retorna `alreadyExecuted: true`).

### 5.3 Não implementados (não oferecer ou marcar “em breve”)

Estes tipos **não** têm lógica de execução; o backend responde *“Tipo de ação não implementado”*:

- `create_vistoria`, `create_rental`, `create_note`, `create_appointment`, `create_transaction`
- `update_property`, `update_client`, `update_document`
- `send_sms`, `send_chat_message`
- `add_comment`, `set_custom_field`
- `create_task`, `archive_documents`, `update_relationship`

O front pode esconder esses tipos ou exibir como “Em breve”.

---

## 6. POST `/:columnId/actions` – Criar ação

**Body (CreateKanbanColumnActionDto):**

- `trigger` (obrigatório): `on_enter` | `on_exit` | `on_stay`
- `type` (obrigatório): um dos tipos implementados (ex.: `assign_user`, `send_email`, …)
- `config` (obrigatório): objeto conforme o tipo (ver tabela na seção 5.1 e DTOs)
- `conditions` (opcional): array de condições para executar a ação
- `order` (opcional): número para ordenação
- `fromColumnId` (opcional): se preenchido, a ação só roda quando a tarefa **vem** dessa coluna
- `requireAdjacentPosition` (opcional): se `true`, só aplica quando a coluna de origem é adjacente (posição +1 ou -1)
- Para `on_stay`: `intervalHours`, `maxExecutions` (opcional)

**Exemplo mínimo (atribuir usuário ao entrar):**

```json
{
  "trigger": "on_enter",
  "type": "assign_user",
  "config": {
    "userId": "uuid-do-usuario"
  }
}
```

**Exemplo (enviar notificação ao entrar):**

```json
{
  "trigger": "on_enter",
  "type": "send_notification",
  "config": {
    "subject": "Nova tarefa na coluna",
    "message": "Tarefa {{taskTitle}} entrou na coluna.",
    "notificationType": "info",
    "recipients": [
      { "type": "task_assignee" },
      { "type": "user", "value": "uuid-usuario" }
    ]
  }
}
```

---

## 7. PUT `/actions/:actionId` – Atualizar ação

**Body (UpdateKanbanColumnActionDto):** todos os campos opcionais; enviar só o que for alterar.

- `trigger`, `type`, `config`, `conditions`, `order`, `isActive`, `fromColumnId`, `requireAdjacentPosition`, `intervalHours`, `maxExecutions`

---

## 8. POST `/:columnId/actions/reorder` – Reordenar

**Body:**

```json
{
  "actionIds": ["uuid1", "uuid2", "uuid3"]
}
```

Ordem do array = nova ordem de execução (índice 0 = primeiro).

---

## 9. Resumo para o frontend

1. **Listar ações:** `GET /kanban/columns/:columnId/actions` (opcional `?trigger=on_enter`). Não exige permissão de gerenciar.
2. **Quem pode criar/editar/excluir/reordenar:** apenas quem tem a permissão `kanban:manage_validations_actions`. Ocultar ou desabilitar esses botões para quem não tiver.
3. **Tipos a oferecer na UI:** apenas os 13 tipos da tabela “Implementados” (assign_user, set_priority, set_due_date, add_tag, create_property, create_client, create_document, send_email, send_notification, schedule_task, schedule_email, update_score, start_email_sequence). Os demais não estão implementados.
4. **Triggers:** on_enter, on_exit, on_stay; explicar na UI o significado de cada um. Para vários tipos (create_property, create_client, assign_user, start_email_sequence, etc.) **só on_enter** é aceito; o backend retorna **400** se enviar on_exit ou on_stay. **Oferecer na UI apenas o trigger permitido para cada tipo.**
5. **Resposta ao mover tarefa:** o movimento pode retornar `actionResults` com `success`, `alreadyExecuted`, `message`; usar para feedback (ex.: “Imóvel criado”, “Cliente já havia sido criado para esta tarefa”).

Com isso, a tela de ações da coluna pode ser exibida para todos (lista) e a edição apenas para quem tem permissão, e só com tipos que funcionam hoje no sistema.
