## API de Ofertas de Propriedades

Esta documentação descreve os endpoints de **ofertas de propriedades** tanto na **API pública** quanto na **API privada**.

**Importante:**  
- Endpoints sob `/api/public/...` são expostos como **API pública**, porém **criar ofertas exige usuário autenticado** (JWT via header `Authorization: Bearer <token>`).  
- As integrações de front/partner devem sempre obter o token via fluxo de login de usuário público antes de chamar os endpoints protegidos.

---

### Autenticação (API Pública)

- **Login** do usuário público: `POST /api/public/users/login`  
- Resposta inclui `accessToken` (JWT), que deve ser enviado no header:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

- Somente usuários autenticados podem:
  - Criar ofertas (`POST /api/public/properties/offers`)
  - Listar suas próprias ofertas
  - Retirar (withdraw) suas ofertas

---

## Campos de Negociação na Propriedade

- `acceptsNegotiation` (boolean) – Se a propriedade aceita negociação (padrão: `false`)
- `minSalePrice` (number) – Valor mínimo aceito para venda (deve ser < `salePrice`)
- `minRentPrice` (number) – Valor mínimo aceito para aluguel (deve ser < `rentPrice`)

**Regras:**
- Devem ser configurados ao **criar** ou **atualizar** a propriedade.
- Se `acceptsNegotiation: true`, é obrigatório ter pelo menos um valor mínimo configurado (`minSalePrice` ou `minRentPrice`).
- Os valores mínimos devem ser **sempre menores** que os preços de venda/aluguel (`salePrice` / `rentPrice`).

### Exemplo: Configurar Propriedade para Aceitar Negociação

```http
POST /api/public/properties
Content-Type: application/json
Authorization: Bearer <accessToken>   // se a criação for feita por usuário autenticado
```

```json
{
  "title": "Casa com 3 quartos",
  "salePrice": 450000,
  "rentPrice": 2500,
  "acceptsNegotiation": true,
  "minSalePrice": 400000,
  "minRentPrice": 2000
}
```

---

## Sistema de Ofertas

- Usuários **autenticados** podem criar ofertas (lances) para propriedades.
- Suporta ofertas para:
  - **Venda** (`type: "sale"`)
  - **Aluguel** (`type: "rental"`)
- Status possíveis:
  - `pending`
  - `accepted`
  - `rejected`
  - `withdrawn`
  - `expired`

### Ações Automáticas ao Aceitar Oferta

Quando uma oferta é aceita:

- Atualiza o preço da propriedade com o valor negociado.
- Muda o status da propriedade para `SOLD` (venda) ou `RENTED` (aluguel).
- Remove a propriedade do site público.
- Rejeita automaticamente outras ofertas pendentes daquela propriedade.
- Cria uma solicitação de aprovação financeira.

---

## Endpoints Principais

### API Pública (Usuários Públicos)

| Método | Endpoint                                      | Autenticação | Descrição                                |
|--------|-----------------------------------------------|--------------|------------------------------------------|
| POST   | `/api/public/properties/offers`              | **Sim**      | Criar oferta                            |
| GET    | `/api/public/properties/offers/property/:id` | **Sim**      | Listar ofertas da propriedade (do user) |
| GET    | `/api/public/properties/offers/:id`          | **Sim**      | Buscar oferta do usuário autenticado    |
| PUT    | `/api/public/properties/offers/:id/withdraw` | **Sim**      | Retirar oferta                          |
| PUT    | `/api/public/properties/offers/:id/status`   | **Sim**      | Aceitar/Rejeitar (quando aplicável)    |

> Mesmo sendo under `/api/public`, estes endpoints exigem JWT no header `Authorization`.

### API Privada (Imobiliárias)

| Método | Endpoint                               | Autenticação | Descrição                                      |
|--------|----------------------------------------|--------------|------------------------------------------------|
| GET    | `/properties/offers`                  | **Sim**      | Listar todas as ofertas da empresa (com filtros) |
| GET    | `/properties/offers/property/:id`     | **Sim**      | Listar ofertas da propriedade                  |
| GET    | `/properties/offers/detail/:id`       | **Sim**      | Buscar oferta por ID                           |
| PUT    | `/properties/offers/detail/:id/status`| **Sim**      | Aceitar/Rejeitar (responsável/imobiliária)     |

---

## Exemplos de Uso (API Pública)

### 1. Criar Oferta

```http
POST /api/public/properties/offers
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "propertyId": "uuid-da-propriedade",
  "type": "sale",
  "offeredValue": 420000,
  "message": "Mensagem opcional para o proprietário"
}
```

Regras de valor:
- Para ofertas de venda (`type: "sale"`):  
  `offeredValue` deve estar entre `minSalePrice` e `salePrice`.
- Para ofertas de aluguel (`type: "rental"`):  
  `offeredValue` deve estar entre `minRentPrice` e `rentPrice`.

### 2. Listar Ofertas de uma Propriedade (Usuário Público)

```http
GET /api/public/properties/offers/property/:propertyId
Authorization: Bearer <accessToken>
```

Retorna todas as ofertas da propriedade associadas ao usuário autenticado (ou conforme regras de visibilidade definidas no backend).

### 3. Buscar Oferta por ID (Usuário Público)

```http
GET /api/public/properties/offers/:offerId
Authorization: Bearer <accessToken>
```

Retorna detalhes completos da oferta pertencente ao usuário autenticado.

### 4. Retirar Oferta (Withdraw)

```http
PUT /api/public/properties/offers/:offerId/withdraw
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "message": "Retirando a oferta, encontrei outro imóvel."
}
```

Altera o status da oferta para `withdrawn`.

### 5. Atualizar Status de Oferta (quando permitido ao usuário público)

```http
PUT /api/public/properties/offers/:offerId/status
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "status": "rejected",
  "responseMessage": "Não tenho mais interesse."
}
```

---

## Exemplos de Uso (API Privada / Imobiliárias)

### 1. Ver Todas as Ofertas da Empresa

```http
GET /properties/offers
Authorization: Bearer <TokenDaImobiliariaOuAdmin>
```

Parâmetros de query opcionais:
- `propertyId` – Filtra por propriedade específica.
- `status` – Filtra por status (`pending`, `accepted`, `rejected`, `withdrawn`, `expired`).
- `type` – Filtra por tipo de oferta (`sale` ou `rental`).

Exemplos:

```http
GET /properties/offers?status=pending
GET /properties/offers?propertyId=uuid-da-propriedade&status=pending
GET /properties/offers?type=sale
```

### 2. Ver Ofertas de Uma Propriedade

```http
GET /properties/offers/property/:propertyId
Authorization: Bearer <TokenDaImobiliariaOuAdmin>
```

### 3. Buscar Oferta por ID (Detalhe)

```http
GET /properties/offers/detail/:offerId
Authorization: Bearer <TokenDaImobiliariaOuAdmin>
```

### 4. Aceitar Oferta (Imobiliária / Responsável)

```http
PUT /properties/offers/detail/:offerId/status
Authorization: Bearer <TokenDaImobiliariaOuAdmin>
Content-Type: application/json
```

```json
{
  "status": "accepted",
  "responseMessage": "Oferta aceita!"
}
```

Ao aceitar:
- Atualiza o preço da propriedade.
- Muda o status para `SOLD` ou `RENTED`.
- Remove do site público.
- Rejeita outras ofertas pendentes.
- Cria solicitação de aprovação financeira.

---

## Informações de Ofertas nas Propriedades

Ao buscar uma propriedade (`GET /properties/:id` ou `GET /api/public/properties/:id`), a resposta inclui:

### Contadores

- `totalOffersCount` – Total de ofertas.
- `pendingOffersCount` – Ofertas pendentes.
- `acceptedOffersCount` – Ofertas aceitas.
- `rejectedOffersCount` – Ofertas rejeitadas.
- `hasPendingOffers` – Indica se há ofertas pendentes.

### Lista Completa

- `offers` – Array com todas as ofertas da propriedade, incluindo:
  - Dados do ofertante.
  - Valores.
  - Status.
  - Datas de criação/atualização.

### Campos de Negociação (Relembrando)

- `acceptsNegotiation` – Se aceita negociação.
- `minSalePrice` – Valor mínimo para venda.
- `minRentPrice` – Valor mínimo para aluguel.

---

## Papéis e Permissões

### Usuário Público (Ofertante)

- Criar ofertas (autenticado).
- Ver suas próprias ofertas.
- Retirar suas ofertas.
- Ver ofertas da sua propriedade, quando aplicável.

### Responsável pela Propriedade (Imobiliária)

- Ver todas as ofertas da sua propriedade.
- Aceitar/rejeitar ofertas da sua propriedade.

### Administrador/Master (Imobiliária)

- Ver todas as ofertas da empresa.
- Aceitar/rejeitar ofertas de qualquer propriedade da empresa.

---

## Fluxo Completo Resumido

1. **Configurar Propriedade**
   - Criar/atualizar propriedade com `acceptsNegotiation: true`.
   - Definir `minSalePrice` e/ou `minRentPrice`.
2. **Usuário Público Autenticado Faz Oferta**
   - Faz login e obtém `accessToken`.
   - Chama `POST /api/public/properties/offers` com `Authorization: Bearer <accessToken>`.
3. **Imobiliária Analisa Ofertas (API Privada)**
   - Usa `GET /properties/offers` e filtros.
   - Aceita ou rejeita via `PUT /properties/offers/detail/:offerId/status`.
4. **Ações Automáticas**
   - Atualização de status e preço da propriedade.
   - Remoção do site público.
   - Rejeição de outras ofertas pendentes.
   - Criação de solicitação financeira.


