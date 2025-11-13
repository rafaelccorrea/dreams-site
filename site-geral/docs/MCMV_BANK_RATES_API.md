# API de Taxas de Juros dos Bancos - MCMV

## Endpoint

```
GET /api/public/mcmv/bank-interest-rates
```

## Resposta

### Sucesso (200 OK)

```json
{
  "rates": [
    {
      "bank": "Caixa Econômica Federal",
      "bankCode": "CAIXA",
      "interestRate": 7.62,
      "minimumRate": 7.50,
      "maximumRate": 8.00,
      "lastUpdated": "2024-10-15T10:00:00Z",
      "source": "Site oficial da Caixa",
      "notes": "Taxa para financiamento Minha Casa Minha Vida"
    },
    {
      "bank": "Bradesco",
      "bankCode": "BRADESCO",
      "interestRate": 10.44,
      "minimumRate": 10.00,
      "maximumRate": 11.00,
      "lastUpdated": "2024-10-15T10:00:00Z",
      "source": "Site oficial do Bradesco",
      "notes": "Taxa de referência, pode variar conforme perfil do cliente"
    },
    {
      "bank": "Itaú Unibanco",
      "bankCode": "ITAU",
      "interestRate": 10.43,
      "minimumRate": 10.00,
      "maximumRate": 11.00,
      "lastUpdated": "2024-10-15T10:00:00Z",
      "source": "Site oficial do Itaú",
      "notes": "Taxa de referência"
    },
    {
      "bank": "Santander",
      "bankCode": "SANTANDER",
      "interestRate": 11.25,
      "minimumRate": 11.00,
      "maximumRate": 12.00,
      "lastUpdated": "2024-10-15T10:00:00Z",
      "source": "Site oficial do Santander",
      "notes": "Taxa de referência"
    },
    {
      "bank": "Banco do Brasil",
      "bankCode": "BB",
      "interestRate": 8.50,
      "minimumRate": 8.00,
      "maximumRate": 9.00,
      "lastUpdated": "2024-10-15T10:00:00Z",
      "source": "Site oficial do Banco do Brasil",
      "notes": "Taxa para financiamento MCMV"
    }
  ],
  "lastUpdated": "2024-10-15T10:00:00Z"
}
```

### Erro (500 Internal Server Error)

```json
{
  "message": "Erro ao buscar taxas de juros dos bancos"
}
```

## Campos da Resposta

### BankInterestRate

- `bank` (string, obrigatório): Nome do banco
- `bankCode` (string, obrigatório): Código único do banco (ex: "CAIXA", "BRADESCO")
- `interestRate` (number, obrigatório): Taxa de juros anual (%)
- `minimumRate` (number, opcional): Taxa mínima possível
- `maximumRate` (number, opcional): Taxa máxima possível
- `lastUpdated` (string, obrigatório): Data da última atualização (ISO 8601)
- `source` (string, opcional): Fonte dos dados (ex: "Site oficial da Caixa")
- `notes` (string, opcional): Observações sobre a taxa

### BankInterestRatesResponse

- `rates` (array, obrigatório): Array de taxas de juros dos bancos
- `lastUpdated` (string, obrigatório): Data da última atualização geral (ISO 8601)

## Implementação Sugerida no Backend

### Opção 1: Base de Dados Estática

Criar uma tabela no banco de dados com as taxas dos bancos e atualizar periodicamente (diariamente ou semanalmente):

```sql
CREATE TABLE bank_interest_rates (
  id SERIAL PRIMARY KEY,
  bank VARCHAR(100) NOT NULL,
  bank_code VARCHAR(50) UNIQUE NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  minimum_rate DECIMAL(5,2),
  maximum_rate DECIMAL(5,2),
  source VARCHAR(255),
  notes TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Opção 2: Web Scraping

Implementar um serviço que faz scraping dos sites dos bancos para obter as taxas atualizadas:

- **Caixa Econômica Federal**: https://www.caixa.gov.br/programas-social-habitacional/minha-casa-minha-vida
- **Bradesco**: https://www.bradesco.com.br/pessoas/financiamento-habitacional
- **Itaú**: https://www.itau.com.br/emprestimos-e-financiamentos/financiamento-imobiliario
- **Santander**: https://www.santander.com.br/pessoas/financiamento-habitacional

**Atenção**: Verificar os termos de uso dos sites antes de fazer scraping.

### Opção 3: API de Terceiros

Utilizar serviços de terceiros que agregam essas informações, como:
- APIs de dados financeiros
- Serviços de comparação de taxas
- Agregadores de dados bancários

### Opção 4: Atualização Manual

Permitir que administradores atualizem as taxas manualmente através de uma interface administrativa.

## Código do Banco (bankCode)

Códigos sugeridos para os principais bancos:

- `CAIXA` - Caixa Econômica Federal
- `BB` - Banco do Brasil
- `BRADESCO` - Bradesco
- `ITAU` - Itaú Unibanco
- `SANTANDER` - Santander
- `BANRISUL` - Banrisul
- `SICREDI` - Sicredi
- `INTER` - Banco Inter

## Atualização das Taxas

Recomenda-se atualizar as taxas:
- **Diariamente**: Para garantir dados sempre atualizados
- **Semanalmente**: Como mínimo
- **Quando houver mudanças**: Monitorar anúncios de mudanças de taxa

## Cache

Recomenda-se implementar cache na API:
- Cache de 1 hora: Para reduzir carga no servidor
- Cache de 24 horas: Se as taxas não mudam frequentemente
- Invalidar cache: Quando novas taxas forem detectadas

## Observações Importantes

1. **Taxas são apenas estimativas**: As taxas podem variar conforme o perfil do cliente, valor do imóvel, prazo, etc.

2. **Fonte confiável**: Sempre verificar a fonte dos dados e manter registro de quando foram atualizados.

3. **Legalidade**: Verificar se é permitido fazer scraping ou usar APIs dos bancos antes de implementar.

4. **Fallback**: Se não conseguir obter as taxas, a API deve retornar um array vazio ou um erro, mas o frontend continuará funcionando com taxa manual.

## Exemplo de Implementação (Node.js/Express)

```javascript
// routes/mcmv.js
router.get('/bank-interest-rates', async (req, res) => {
  try {
    // Buscar taxas do banco de dados ou serviço
    const rates = await getBankInterestRates()
    
    res.json({
      rates,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao buscar taxas de juros:', error)
    res.status(500).json({
      message: 'Erro ao buscar taxas de juros dos bancos'
    })
  }
})
```

## Exemplo de Implementação (Python/Flask)

```python
# routes/mcmv.py
@mcmv_bp.route('/bank-interest-rates', methods=['GET'])
def get_bank_interest_rates():
    try:
        # Buscar taxas do banco de dados ou serviço
        rates = get_bank_interest_rates_from_db()
        
        return jsonify({
            'rates': rates,
            'lastUpdated': datetime.utcnow().isoformat()
        })
    except Exception as e:
        print(f'Erro ao buscar taxas de juros: {e}')
        return jsonify({
            'message': 'Erro ao buscar taxas de juros dos bancos'
        }), 500
```

