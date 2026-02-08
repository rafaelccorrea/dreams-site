# 📋 Fluxo de Ofertas de Propriedades - Documentação

## 🎯 Visão Geral

O sistema de ofertas permite que **usuários públicos** (compradores/inquilinos) façam ofertas (lances) para propriedades que aceitam negociação. As **imobiliárias** podem visualizar e gerenciar essas ofertas através da interface privada.

---

## 🔄 Fluxo Completo

### 1️⃣ **Configuração da Propriedade** (Imobiliária)

Antes de receber ofertas, a propriedade precisa estar configurada para aceitar negociação:

```typescript
{
  acceptsNegotiation: true,
  minSalePrice: 400000.00,  // Valor mínimo para venda (deve ser < salePrice)
  minRentPrice: 2000.00,   // Valor mínimo para aluguel (deve ser < rentPrice)
  salePrice: 450000.00,    // Preço de venda
  rentPrice: 2500.00       // Preço de aluguel
}
```

**Onde configurar:**
- Ao criar uma nova propriedade
- Ao editar uma propriedade existente
- Campos disponíveis no formulário de propriedade

---

### 2️⃣ **Criação de Oferta** (Usuário Público)

O usuário público (compradores/inquilinos) cria uma oferta através da **API pública** (endpoint separado, não implementado no frontend privado):

```typescript
POST /api/public/properties/offers
{
  propertyId: "uuid-da-propriedade",
  type: "sale" | "rental",
  offeredValue: 420000.00,
  message: "Gostaria de negociar o valor e condições de pagamento."
}
```

**Validações:**
- ✅ Propriedade deve aceitar negociação (`acceptsNegotiation: true`)
- ✅ Valor oferecido deve estar entre `minPrice` e `price`
- ✅ Não pode ter múltiplas ofertas pendentes para a mesma propriedade

---

### 3️⃣ **Visualização de Ofertas** (Imobiliária)

A imobiliária acessa a página de ofertas:

**Rota:** `/properties/offers`

**Funcionalidades:**
- 📋 Lista todas as ofertas recebidas
- 🔍 Busca por propriedade, email ou telefone
- 🎯 Filtros por status (Pendente, Aceita, Rejeitada)
- 🏷️ Filtro por tipo (Venda/Aluguel)

**Permissões necessárias:**
- `property:view` - Para visualizar ofertas

---

### 4️⃣ **Ações Disponíveis** (Imobiliária)

#### ✅ **Aceitar Oferta**

Quando uma oferta é aceita, o sistema executa automaticamente:

1. **Atualiza a propriedade:**
   - Atualiza o preço com o valor da oferta aceita
   - Muda status para `SOLD` (venda) ou `RENTED` (aluguel)
   - Define data de venda/aluguel
   - Remove do site público

2. **Rejeita outras ofertas:**
   - Rejeita automaticamente todas as outras ofertas pendentes para a mesma propriedade

3. **Cria solicitação financeira:**
   - Cria automaticamente uma solicitação de aprovação financeira
   - O fluxo financeiro normal do sistema será executado (comissões, transações, etc.)

#### ❌ **Rejeitar Oferta**

- A oferta é marcada como rejeitada
- Pode incluir uma mensagem de resposta para o ofertante
- Outras ofertas permanecem pendentes

---

## 📊 Status das Ofertas

| Status | Descrição | Ações Disponíveis |
|--------|-----------|-------------------|
| `pending` | Aguardando análise | ✅ Aceitar / ❌ Rejeitar |
| `accepted` | Oferta aceita | 👁️ Visualizar apenas |
| `rejected` | Oferta rejeitada | 👁️ Visualizar apenas |
| `withdrawn` | Oferta retirada pelo ofertante | 👁️ Visualizar apenas |
| `expired` | Oferta expirada | 👁️ Visualizar apenas |

---

## 🎨 Interface da Página de Ofertas

### Componentes Principais

1. **Lista de Ofertas** (`PropertyOffersPage.tsx`)
   - Tabela com todas as ofertas
   - Filtros e busca
   - Botões de ação

2. **Modal de Ação** (`OfferActionModal.tsx`)
   - Visualizar detalhes da oferta
   - Aceitar ou rejeitar oferta
   - Incluir mensagem de resposta

### Informações Exibidas

- **Propriedade:** Título da propriedade
- **Tipo:** Venda ou Aluguel
- **Ofertante:** Email e telefone do usuário público
- **Valor Oferecido:** Valor da oferta (em destaque verde)
- **Valor Original:** Preço original da propriedade
- **Valor Mínimo:** Valor mínimo aceito (se configurado)
- **Status:** Badge colorido com o status
- **Data:** Data de criação da oferta
- **Mensagem:** Mensagem do ofertante (se houver)

---

## 🔧 Uso Técnico

### Hook: `usePropertyOffers`

```typescript
import { usePropertyOffers } from '../hooks/usePropertyOffers';

const {
  offers,              // Lista de ofertas
  loading,             // Estado de carregamento
  error,                // Erro (se houver)
  fetchAllOffers,      // Buscar todas as ofertas (com filtros)
  fetchPropertyOffers, // Buscar ofertas de uma propriedade específica
  acceptOffer,         // Aceitar uma oferta
  rejectOffer,         // Rejeitar uma oferta
} = usePropertyOffers();
```

### API Service: `propertyOffersApi`

```typescript
import { propertyOffersApi } from '../services/propertyOffersApi';

// Listar todas as ofertas
const offers = await propertyOffersApi.getAllOffers({
  status: 'pending',
  type: 'sale'
});

// Aceitar oferta
await propertyOffersApi.updateOfferStatus(offerId, {
  status: 'accepted',
  responseMessage: 'Oferta aceita!'
});
```

---

## ⚠️ Validações Importantes

### No Backend

- ✅ Valor oferecido deve estar entre `minPrice` e `price`
- ✅ Não é possível criar múltiplas ofertas pendentes para a mesma propriedade
- ✅ Apenas ofertas pendentes podem ser atualizadas
- ✅ Apenas o responsável pela propriedade pode aceitar/rejeitar

### No Frontend

- ✅ Validação visual dos valores antes de enviar
- ✅ Feedback claro sobre ações realizadas
- ✅ Mensagens de erro amigáveis

---

## 📝 Notas Importantes

1. **Configuração Inicial:** Antes de receber ofertas, a propriedade deve ter `acceptsNegotiation: true` e valores mínimos configurados.

2. **Ações Automáticas:** Quando uma oferta é aceita, várias ações são executadas automaticamente. O usuário é informado sobre isso.

3. **Notificações:** Considere implementar notificações para informar quando:
   - Uma nova oferta é recebida
   - Uma oferta é aceita/rejeitada (para o ofertante via API pública)

4. **Validação:** Sempre valide os valores no frontend, mas lembre-se que a validação final é feita no backend.

5. **Status da Propriedade:** Quando uma oferta é aceita, a propriedade muda automaticamente para `SOLD` ou `RENTED` e não aparece mais no site público.

---

## 🔗 Endpoints Relacionados

### API Privada (Imobiliária)
- `GET /properties/offers` - Listar todas as ofertas
- `GET /properties/offers/property/:propertyId` - Listar ofertas de uma propriedade
- `GET /properties/offers/:offerId` - Buscar oferta por ID
- `PUT /properties/offers/:offerId/status` - Aceitar/rejeitar oferta

### API Pública (Usuários Públicos)
- `POST /api/public/properties/offers` - Criar oferta
- `GET /api/public/properties/offers/property/:propertyId` - Listar ofertas
- `PUT /api/public/properties/offers/:offerId/withdraw` - Retirar oferta

---

## 🎯 Próximos Passos (Opcional)

1. **Notificações em Tempo Real:** WebSocket para notificar novas ofertas
2. **Dashboard de Ofertas:** Gráficos e estatísticas de ofertas
3. **Histórico Completo:** Visualizar histórico de todas as ofertas de uma propriedade
4. **Exportação:** Exportar lista de ofertas para Excel/PDF
5. **Filtros Avançados:** Filtros por data, valor, propriedade, etc.



