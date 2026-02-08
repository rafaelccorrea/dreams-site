# Conferência: Rotas Ficha de Proposta e Temp Uniao Users

Conferência do frontend em relação ao documento **"Revisão das rotas – Ficha de Proposta e Usuários Temporários"**.

**Base URL no frontend:** `API_BASE_URL` (config/apiConfig.ts) — ex.: `https://api.dreamkeys.com.br`. Todas as chamadas usam o prefixo `/api/` no path.

---

## 1. Ficha de Proposta de Compra (`fichaPropostaApi.ts`)

| Doc (método + rota) | Frontend | Arquivo:linha | Status |
|---------------------|----------|---------------|--------|
| **POST** `/api/ficha-proposta` (CreatePurchaseProposalDto) | `publicApi.post('/api/ficha-proposta', dados)` | fichaPropostaApi.ts:213-215 | ✅ OK |
| **GET** `/api/ficha-proposta` ?corretorCpf ou ?gestorCpf + page, limit, dataInicio, dataFim, search | `listarPropostas(filters)` → GET com params | fichaPropostaApi.ts:264-266 | ✅ OK |
| **GET** `/api/ficha-proposta/corretor/:corretorId` + query | `listarPropostasPorCorretorId(corretorId, filters)` → `/api/ficha-proposta/corretor/${corretorId}` | fichaPropostaApi.ts:350 | ✅ OK |
| **GET** `/api/ficha-proposta/corretor/cpf/:cpf` + query | `listarPropostasPorCorretorCpf(cpf, filters)` → `/api/ficha-proposta/corretor/cpf/${cpfLimpo}` | fichaPropostaApi.ts:396 | ✅ OK |
| **GET** `/api/ficha-proposta/:id/pdf` ?corretorCpf ou ?gestorCpf | `getUrlPdfProposta(propostaId, userCpf, userTipo)` → URL com query | fichaPropostaApi.ts:319-321 | ✅ OK |
| **GET** `/api/ficha-proposta/:id` ?corretorCpf ou ?gestorCpf | `buscarPropostaPorId(id, cpfParam)` → GET com query | fichaPropostaApi.ts:296-297 | ✅ OK |

**Extras no frontend (não listados no doc de rotas):**

- **POST** `/api/ficha-proposta/extract-from-image` — usado em `extrairDadosDaImagem(files)` (FormData com `images`). Manter se a API existir.

---

## 2. Usuários Temporários – Login (`tempUniaoUsersApi.ts`)

| Doc (método + rota) | Frontend | Arquivo:linha | Status |
|---------------------|----------|---------------|--------|
| **POST** `/api/temp-uniao-users/login` body `{ "cpf": "..." }` → `{ success, user? }` | `loginPorCpf(cpf)` → POST com `{ cpf: cleanCpf }`, retorna `LoginResponse` | tempUniaoUsersApi.ts:79-82 | ✅ OK |
| **POST** `/api/temp-uniao-users/login-gestor` body `{ "cpf": "..." }` → `{ success, user? }` | `loginGestorPorCpf(cpf)` → POST com `{ cpf: cleanCpf }` | tempUniaoUsersApi.ts:101-104 | ✅ OK |

---

## 3. Usuários Temporários – CRUD e listagens

| Doc (método + rota) | Frontend | Arquivo:linha | Status |
|---------------------|----------|---------------|--------|
| **GET** `/api/temp-uniao-users/corretores` | `buscarCorretores()` → GET `/api/temp-uniao-users/corretores` | tempUniaoUsersApi.ts:143-144 | ✅ OK |
| **GET** `/api/temp-uniao-users/gestores` | `buscarGestores()` → GET `/api/temp-uniao-users/gestores` | tempUniaoUsersApi.ts:213-214 | ✅ OK |
| **GET** `/api/temp-uniao-users/cpf/:cpf` | `buscarUsuarioPorCpf(cpf)` → GET `/api/temp-uniao-users/cpf/${cleanCpf}` | tempUniaoUsersApi.ts:292-293 | ✅ OK |
| **GET** `/api/temp-uniao-users` (corretores + gestores) | — | — | ⚪ Não usado no front |
| **GET** `/api/temp-uniao-users/email/:email` | — | — | ⚪ Não usado no front |
| **GET** `/api/temp-uniao-users/:id` | — | — | ⚪ Não usado no front |
| **PUT** `/api/temp-uniao-users/:id` | — | — | ⚪ Não usado no front |
| **DELETE** `/api/temp-uniao-users/:id` | — | — | ⚪ Não usado no front |
| **POST** `/api/temp-uniao-users` | — | — | ⚪ Não usado no front |

---

## 4. Usuários Temporários – Importação

| Doc (método + rota) | Frontend | Arquivo:linha | Status |
|---------------------|----------|---------------|--------|
| **POST** `/api/temp-uniao-users/import` (file) | — | — | ⚪ Não usado no front |
| **POST** `/api/temp-uniao-users/import-porcentagens` (form: file, password) | `importPorcentagens(file, password)` → FormData com `file` e `password` | tempUniaoUsersApi.ts:331-345 | ✅ OK |

---

## 5. Rotas alternativas sem `/api`

O documento cita rotas **sem** prefixo `/api` (ex.: `/temp-uniao-users/login`) para quando o proxy encaminha sem o segmento `/api`. No frontend todas as chamadas usam **com** `/api` (ex.: `/api/temp-uniao-users/login`). Se o backend/proxy exigir sem `/api`, será preciso ajustar a base URL ou o path no front (ex.: variável de ambiente ou proxy no Vite).

---

## 6. Resumo

- **Ficha de Proposta:** todas as rotas do documento usadas no front estão corretas (POST criar, GET listar com CPF, GET por ID, GET PDF, GET por corretorId, GET por corretor/cpf).
- **Temp Uniao Users:** login, login-gestor, corretores, gestores, cpf e import-porcentagens conferem com o doc. Demais rotas (GET geral, email, :id, PUT, DELETE, POST criar, import) não são usadas no front.
- **Query obrigatória (CPF):** listagem, GET por ID e PDF de proposta usam `corretorCpf` ou `gestorCpf` conforme o doc.

**Última conferência:** Janeiro 2025
