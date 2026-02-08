# Revisão das rotas – Ficha de Proposta, Ficha de Venda e Usuários Temporários

Documento de referência com **todas as rotas** criadas para Ficha de Proposta de Compra, Ficha de Venda e Usuários Temporários (temp-uniao-users), incluindo login e acesso por CPF.

**Base URL:** use a URL do ambiente (ex.: `https://api.exemplo.com`). Não há prefixo global `api` no Nest; o path já inclui `api` onde aplicável.

**Regras de acesso:**
- **Corretores:** só acessam **propostas** (ficha de proposta). Usam `corretorCpf` para listar/ver/PDF. Não acessam fichas de venda.
- **Gestores:** fazem login na ficha de venda (`POST /api/temp-uniao-users/login-gestor`) e acessam **propostas e fichas de venda** da própria equipe com `gestorCpf`.

**Depara por unidade (equipe):**  
A definição de "equipe" do gestor vem da tabela **temp_uniao_users** (campo `unidade`). O gestor vê:
- **Propostas** em que o corretor da proposta (`corretor_cpf`) tem a **mesma unidade** que o gestor, ou em que a proposta já está vinculada ao gestor (`gestor_cpf`).
- **Fichas de venda** em que `gestor_cpf` é o CPF do gestor **ou** em que a unidade de venda da ficha (`sale_unit`) corresponde à **mesma unidade** do gestor (comparação normalizada).  
Assim, gestores veem tudo da sua equipe mesmo quando o vínculo direto (`gestor_cpf`) não foi preenchido (ex.: registros antigos).

---

## 1. Ficha de Proposta de Compra

**Controller:** `api/ficha-proposta` (PublicPurchaseProposalController)

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **POST** | `/api/ficha-proposta` | Cadastrar nova proposta de compra. Body: CreatePurchaseProposalDto (JSON). |
| **GET** | `/api/ficha-proposta` | Listar propostas. **Query obrigatória:** `corretorCpf` **ou** `gestorCpf`. Opcionais: `page`, `limit`, `dataInicio`, `dataFim`, `search`. Com `gestorCpf`: mostra propostas da equipe (corretor com mesma unidade em temp_uniao_users). |
| **GET** | `/api/ficha-proposta/corretor/:corretorId` | Listar propostas por ID do corretor (UUID). Query: `page`, `limit`, `dataInicio`, `dataFim`, `search`. |
| **GET** | `/api/ficha-proposta/corretor/cpf/:cpf` | Listar propostas por CPF do corretor. Query: `page`, `limit`, `dataInicio`, `dataFim`, `search`. |
| **GET** | `/api/ficha-proposta/:id/pdf` | Download PDF da proposta. **Query obrigatória:** `corretorCpf` **ou** `gestorCpf`. |
| **GET** | `/api/ficha-proposta/:id` | Buscar proposta por ID. **Query obrigatória:** `corretorCpf` **ou** `gestorCpf`. |

**Ordem das rotas (NestJS):** Rotas estáticas (`corretor/:corretorId`, `corretor/cpf/:cpf`) vêm **antes** das paramétricas (`:id/pdf`, `:id`) para evitar que `corretor` seja interpretado como `:id`.

---

## 2. Ficha de Venda (somente gestores)

**Controller:** `api/ficha-venda` (PublicSaleFormController)

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **POST** | `/api/ficha-venda` | Cadastrar nova ficha de venda. Body: CreateSaleFormDto (JSON). A ficha fica vinculada ao gestor da unidade de venda. |
| **GET** | `/api/ficha-venda` | Listar fichas de venda da equipe do gestor. **Query obrigatória:** `gestorCpf`. Opcionais: `page`, `limit`, `dataInicio`, `dataFim`, `search`. Equipe = mesma unidade (temp_uniao_users) ou ficha com `gestor_cpf` do gestor. **Somente gestores.** |
| **GET** | `/api/ficha-venda/:id` | Buscar ficha de venda por ID. **Query obrigatória:** `gestorCpf`. Só retorna se a ficha pertencer à equipe do gestor (unidade ou `gestor_cpf`). **Somente gestores.** |
| **PATCH** | `/api/ficha-venda/:id` | Atualizar ficha de venda. **Query obrigatória:** `gestorCpf`. Body: CreateSaleFormDto. Só atualiza se a ficha pertencer à equipe do gestor (unidade ou `gestor_cpf`). **Somente gestores.** |

**Ordem das rotas:** `GET /` (listagem) vem **antes** de `GET /:id` e `PATCH /:id`.

**Observação:** Corretores **não** acessam fichas de venda; somente gestores (login com `POST /api/temp-uniao-users/login-gestor`).

---

## 3. Usuários Temporários (temp-uniao-users)

**Controller principal:** `api/temp-uniao-users` (TempUniaoUserController)

### 3.1 Login (identificação por CPF)

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **POST** | `/api/temp-uniao-users/login` | Login por CPF. Body: `{ "cpf": "12345678901" }`. Retorna `{ success, user? }` (user com todos os dados quando encontrado). |
| **POST** | `/api/temp-uniao-users/login-gestor` | Login de gestor por CPF. Body: `{ "cpf": "..." }`. Retorna `{ success, user? }` somente se o CPF for de um gestor. |

### 3.2 CRUD e listagens

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **POST** | `/api/temp-uniao-users` | Criar usuário temporário (corretor ou gestor). Body: CreateTempUniaoUserDto. |
| **GET** | `/api/temp-uniao-users/corretores` | Listar todos os corretores. |
| **GET** | `/api/temp-uniao-users/gestores` | Listar todos os gestores. |
| **GET** | `/api/temp-uniao-users` | Listar corretores e gestores separados. Resposta: `{ corretores, gestores }`. |
| **GET** | `/api/temp-uniao-users/cpf/:cpf` | Buscar usuário por CPF. |
| **GET** | `/api/temp-uniao-users/email/:email` | Buscar usuário por email. |
| **GET** | `/api/temp-uniao-users/:id` | Buscar usuário por ID (UUID). |
| **PUT** | `/api/temp-uniao-users/:id` | Atualizar usuário. Body: campos parciais do CreateTempUniaoUserDto. |
| **DELETE** | `/api/temp-uniao-users/:id` | Remover usuário. Retorna 204. |

### 3.3 Importação

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **POST** | `/api/temp-uniao-users/import` | Importar usuários de CSV/Excel. Form-data: `file`. |
| **POST** | `/api/temp-uniao-users/import-porcentagens` | Importar porcentagens de corretores (Excel/CSV). Form-data: `file`, `password` (senha de aprovação). |

---

## 4. API dedicada – Somente gestores

**Controller:** `api/gestores` (GestoresController)  
Path curto para listar **apenas** gestores (mesma fonte: temp_uniao_users, type = gestor).

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **GET** | `/api/gestores` | Listar somente os gestores. Retorna array de gestores (id, nome, email, cpf, type, unidade, porcentagem, createdAt, updatedAt). Ordenado por nome. |

Equivalente a `GET /api/temp-uniao-users/gestores`, com URL mais curta.

---

## 5. Rotas alternativas de login (sem prefixo /api)

**Controller:** `temp-uniao-users` (TempUniaoUserLoginController)  
Use quando o proxy/gateway encaminha a requisição **sem** o segmento `/api`.

| Método | Rota completa | Descrição |
|--------|----------------|-----------|
| **POST** | `/temp-uniao-users/login` | Mesmo que `POST /api/temp-uniao-users/login`. |
| **POST** | `/temp-uniao-users/login-gestor` | Mesmo que `POST /api/temp-uniao-users/login-gestor`. |

---

## 6. Resumo para o frontend

### Acesso às propostas (ficha de proposta – corretores e gestores)

- **Corretor:** usar `corretorCpf` em listagem, GET por ID e PDF. Corretores **só** veem propostas.
- **Gestor:** usar `gestorCpf` em listagem, GET por ID e PDF. Vê propostas da **equipe** (corretores com mesma `unidade` em temp_uniao_users ou propostas com `gestor_cpf` do gestor).

### Acesso às fichas de venda (somente gestores)

- **Gestor:** fazer login com `POST /api/temp-uniao-users/login-gestor` e usar `gestorCpf` em:
  - `GET /api/ficha-venda?gestorCpf=...` (listar fichas da equipe = mesma unidade ou `gestor_cpf`)
  - `GET /api/ficha-venda/:id?gestorCpf=...` (ver ficha)
  - `PATCH /api/ficha-venda/:id?gestorCpf=...` (editar ficha)
- **Corretor:** não acessa fichas de venda; somente propostas.

**Frontend (Ficha de Venda):** a tela exige login por CPF; se o usuário for **corretor**, exibe mensagem de acesso restrito (“Somente gestores”). Listagem, visualização e edição de fichas usam sempre `gestorCpf` nas chamadas à API.

### Fluxo recomendado

1. **Login:** `POST /api/temp-uniao-users/login` (ou `/temp-uniao-users/login`) com `{ cpf }`.
2. **Identificar gestor:** `POST /api/temp-uniao-users/login-gestor` com o mesmo CPF.
3. **Se for corretor:** listar/ver propostas com `corretorCpf`.
4. **Se for gestor:** listar/ver propostas da equipe com `gestorCpf`; listar/ver/editar fichas de venda com `gestorCpf`.
5. **Listar propostas:** `GET /api/ficha-proposta?corretorCpf=...` ou `?gestorCpf=...`.
6. **Ver proposta:** `GET /api/ficha-proposta/:id?corretorCpf=...` ou `?gestorCpf=...`.
7. **PDF proposta:** `GET /api/ficha-proposta/:id/pdf?corretorCpf=...` ou `?gestorCpf=...`.
8. **Listar fichas de venda (gestor):** `GET /api/ficha-venda?gestorCpf=...`.
9. **Ver/editar ficha de venda (gestor):** `GET /api/ficha-venda/:id?gestorCpf=...` e `PATCH /api/ficha-venda/:id?gestorCpf=...`.

### Ordem das rotas no controller de proposta (ficha-proposta)

Para evitar que rotas paramétricas engulam paths estáticos, a ordem no código é:

1. `GET /` (listagem)
2. `GET /corretor/:corretorId`
3. `GET /corretor/cpf/:cpf`
4. `GET /:id/pdf`
5. `GET /:id`

---

## 7. Depara por unidade (temp_uniao_users)

A **equipe** do gestor é definida pelo campo **unidade** na tabela **temp_uniao_users**:

- Cada **gestor** tem uma `unidade` (ex.: "Uniao Esmeralda").
- Cada **corretor** tem uma `unidade` (ex.: "Uniao Esmeralda").
- **Mesma unidade** (comparação normalizada: trim, lowercase, acentos) = mesma equipe.

**Propostas:** o gestor vê propostas em que:
1. `proposal.gestor_cpf` = CPF do gestor, **ou**
2. `proposal.corretor_cpf` pertence a um corretor que tem a mesma unidade que o gestor.

**Fichas de venda:** o gestor vê fichas em que:
1. `sale_form.gestor_cpf` = CPF do gestor, **ou**
2. `sale_form.sale_unit` (unidade de venda) corresponde à unidade do gestor (comparação normalizada).

Assim, corretores e gestores precisam ter o campo **unidade** preenchido corretamente em temp_uniao_users para o depara funcionar.

---

**Última atualização:** Janeiro 2025
