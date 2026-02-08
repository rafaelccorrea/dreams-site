# API - Ficha de Venda

## Endpoint

```
POST /api/ficha-venda
```

## Descrição

Endpoint para cadastrar uma nova ficha de venda no sistema. A ficha de venda contém todas as informações relacionadas a uma venda imobiliária, incluindo dados do comprador, vendedor, imóvel, valores financeiros e distribuição de comissões.

## Autenticação

**⚠️ IMPORTANTE:** Esta é uma API pública e **não requer autenticação**. Os dados não são vinculados a empresa ou corretor específico.

## Request Body

### Estrutura Completa

```json
{
  "venda": {
    "dataVenda": "2024-01-15",
    "secretariaPresentes": "Maria Silva",
    "midiaOrigem": "Instagram",
    "grupoGeral": false
  },
  "comprador": {
    "nome": "João da Silva",
    "cpf": "12345678901",
    "dataNascimento": "1990-05-20",
    "email": "joao@email.com",
    "celular": "11987654321",
    "profissao": "Engenheiro",
    "endereco": {
      "cep": "01310100",
      "rua": "Avenida Paulista",
      "numero": "1000",
      "complemento": "Apto 101",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  },
  "compradorConjuge": {
    "nome": "Maria da Silva",
    "cpf": "98765432100",
    "dataNascimento": "1992-08-15",
    "email": "maria@email.com",
    "celular": "11912345678",
    "profissao": "Arquiteta",
    "endereco": {
      "cep": "01310100",
      "rua": "Avenida Paulista",
      "numero": "1000",
      "complemento": "Apto 101",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  },
  "vendedor": {
    "nome": "Pedro Santos",
    "cpf": "11122233344",
    "dataNascimento": "1985-03-10",
    "email": "pedro@email.com",
    "celular": "11999998888",
    "profissao": "Corretor",
    "endereco": {
      "cep": "04567890",
      "rua": "Rua das Flores",
      "numero": "500",
      "complemento": "",
      "bairro": "Jardim Paulista",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  },
  "vendedorConjuge": {
    "nome": "Ana Santos",
    "cpf": "55566677788",
    "dataNascimento": "1987-11-25",
    "email": "ana@email.com",
    "celular": "11988887777",
    "profissao": "Advogada",
    "endereco": {
      "cep": "04567890",
      "rua": "Rua das Flores",
      "numero": "500",
      "complemento": "",
      "bairro": "Jardim Paulista",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  },
  "imovel": {
    "cep": "01234567",
    "endereco": "Rua Exemplo",
    "numero": "123",
    "complemento": "Bloco A",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "codigo": "IMV-001"
  },
  "financeiro": {
    "valorVenda": 500000.00,
    "comissaoTotal": 25000.00,
    "valorMeta": 25000.00
  },
  "comissoes": {
    "corretores": [
      {
        "id": "COR-001",
        "porcentagem": 60.00,
        "captador": "CAP-001"
      },
      {
        "id": "COR-002",
        "porcentagem": 30.00,
        "captador": null
      }
    ],
    "gerencias": [
      {
        "nivel": 1,
        "porcentagem": 5.00
      },
      {
        "nivel": 2,
        "porcentagem": 5.00
      }
    ]
  },
  "colaboradores": {
    "preAtendimento": "COL-001",
    "centralCaptacao": "COL-002"
  }
}
```

## Campos Detalhados

### 1. Venda (Obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `dataVenda` | string (date) | Sim | Data da venda no formato YYYY-MM-DD |
| `secretariaPresentes` | string | Não | Nome da secretária presente na venda |
| `midiaOrigem` | string | Não | Origem da venda (Instagram, Facebook, Google, Indicação, Site, Outro) |
| `grupoGeral` | boolean | Não | Indica se é venda do grupo geral (default: false) |

### 2. Comprador (Obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Nome completo do comprador |
| `cpf` | string | Sim | CPF apenas números (11 dígitos) |
| `dataNascimento` | string (date) | Sim | Data de nascimento no formato YYYY-MM-DD (idade mínima: 18 anos) |
| `email` | string | Sim | Email válido |
| `celular` | string | Sim | Celular apenas números (11 dígitos com DDD) |
| `profissao` | string | Não | Profissão do comprador |
| `endereco` | object | Sim | Objeto de endereço (ver estrutura abaixo) |

**Estrutura do Endereço:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `cep` | string | Sim | CEP apenas números (8 dígitos) |
| `rua` | string | Sim | Nome da rua/avenida |
| `numero` | string | Sim | Número do endereço (aceita "S/N" para sem número) |
| `complemento` | string | Não | Complemento (Apto, Bloco, etc.) |
| `bairro` | string | Sim | Nome do bairro |
| `cidade` | string | Sim | Nome da cidade |
| `estado` | string | Sim | Sigla do estado (2 letras maiúsculas, ex: SP, RJ) |

### 3. Comprador Cônjuge/Sócio (Opcional)

**Nota:** Este campo deve ser `null` se não houver cônjuge/sócio.

Mesma estrutura do comprador. Todos os campos são obrigatórios se o objeto for enviado.

### 4. Vendedor (Obrigatório)

Mesma estrutura do comprador. Todos os campos são obrigatórios.

### 5. Vendedor Cônjuge/Sócio (Opcional)

**Nota:** Este campo deve ser `null` se não houver cônjuge/sócio.

Mesma estrutura do vendedor. Todos os campos são obrigatórios se o objeto for enviado.

### 6. Imóvel (Obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `cep` | string | Sim | CEP apenas números (8 dígitos) |
| `endereco` | string | Sim | Nome da rua/avenida |
| `numero` | string | Sim | Número do endereço (aceita "S/N" para sem número) |
| `complemento` | string | Não | Complemento (Apto, Bloco, etc.) |
| `bairro` | string | Sim | Nome do bairro |
| `cidade` | string | Sim | Nome da cidade |
| `estado` | string | Sim | Sigla do estado (2 letras maiúsculas) |
| `codigo` | string | Sim | Código único do imóvel (ex: IMV-001) |

### 7. Financeiro (Obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `valorVenda` | number (decimal) | Sim | Valor total da venda (sem formatação) |
| `comissaoTotal` | number (decimal) | Sim | Valor total da comissão (sem formatação) |
| `valorMeta` | number (decimal) | Sim | Valor de meta (calculado como 5% do valor de venda) |

**Nota:** Todos os valores monetários devem ser enviados como números decimais, sem formatação de moeda.

### 8. Comissões (Obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `corretores` | array | Sim | Lista de corretores com suas comissões |
| `gerencias` | array | Sim | Lista de gerências com suas comissões |

**Estrutura do Corretor:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | Sim | ID ou nome do corretor |
| `porcentagem` | number (decimal) | Sim | Porcentagem da comissão (0-100) |
| `captador` | string \| null | Não | ID ou nome do captador (opcional) |

**Estrutura da Gerência:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nivel` | number (integer) | Sim | Nível da gerência (1, 2, 3 ou 4) |
| `porcentagem` | number (decimal) | Sim | Porcentagem da comissão (0-100) |

**Validação de Comissões:**
- A soma de todas as porcentagens (corretores + gerências) deve ser exatamente **100%**
- Cada porcentagem deve estar entre 0 e 100
- Pode haver múltiplos corretores
- Pode haver até 4 níveis de gerência (1, 2, 3, 4)

### 9. Colaboradores (Opcional)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `preAtendimento` | string | Não | ID ou nome do colaborador de pré-atendimento |
| `centralCaptacao` | string | Não | ID ou nome do colaborador da central de captação |

## Validações

### Validações de Formato

1. **CPF**: Deve conter exatamente 11 dígitos numéricos (sem formatação)
2. **Celular**: Deve conter exatamente 11 dígitos numéricos (DDD + número)
3. **CEP**: Deve conter exatamente 8 dígitos numéricos (sem formatação)
4. **Email**: Deve ser um email válido
5. **Data de Nascimento**: 
   - Formato: YYYY-MM-DD
   - Idade mínima: 18 anos
6. **Estado (UF)**: Deve ser uma sigla de 2 letras maiúsculas
7. **Data da Venda**: Formato YYYY-MM-DD

### Validações de Negócio

1. **Comissões**: A soma de todas as porcentagens deve ser exatamente 100%
2. **Valor Meta**: Deve ser calculado como 5% do valor de venda
3. **Idade Mínima**: Comprador e vendedor devem ter pelo menos 18 anos
4. **CPF Válido**: CPF deve ser válido (algoritmo de validação)

## Respostas

### Sucesso (201 Created)

```json
{
  "success": true,
  "message": "Ficha de venda cadastrada com sucesso",
  "data": {
    "id": "ficha_venda_123",
    "numero": "FV-2024-001",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Erro de Validação (400 Bad Request)

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": [
    {
      "field": "comprador.cpf",
      "message": "CPF inválido"
    },
    {
      "field": "comissoes",
      "message": "A soma das porcentagens deve ser 100%. Atual: 95.50%"
    }
  ]
}
```

### Erro de Servidor (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Erro interno do servidor",
  "error": "Detalhes do erro (apenas em desenvolvimento)"
}
```

## Exemplo de Requisição Completa

```bash
curl -X POST https://api.exemplo.com/api/ficha-venda \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{
    "venda": {
      "dataVenda": "2024-01-15",
      "secretariaPresentes": "Maria Silva",
      "midiaOrigem": "Instagram",
      "grupoGeral": false
    },
    "comprador": {
      "nome": "João da Silva",
      "cpf": "12345678901",
      "dataNascimento": "1990-05-20",
      "email": "joao@email.com",
      "celular": "11987654321",
      "profissao": "Engenheiro",
      "endereco": {
        "cep": "01310100",
        "rua": "Avenida Paulista",
        "numero": "1000",
        "complemento": "Apto 101",
        "bairro": "Bela Vista",
        "cidade": "São Paulo",
        "estado": "SP"
      }
    },
    "compradorConjuge": null,
    "vendedor": {
      "nome": "Pedro Santos",
      "cpf": "11122233344",
      "dataNascimento": "1985-03-10",
      "email": "pedro@email.com",
      "celular": "11999998888",
      "profissao": "Corretor",
      "endereco": {
        "cep": "04567890",
        "rua": "Rua das Flores",
        "numero": "500",
        "complemento": "",
        "bairro": "Jardim Paulista",
        "cidade": "São Paulo",
        "estado": "SP"
      }
    },
    "vendedorConjuge": null,
    "imovel": {
      "cep": "01234567",
      "endereco": "Rua Exemplo",
      "numero": "123",
      "complemento": "Bloco A",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "codigo": "IMV-001"
    },
    "financeiro": {
      "valorVenda": 500000.00,
      "comissaoTotal": 25000.00,
      "valorMeta": 25000.00
    },
    "comissoes": {
      "corretores": [
        {
          "id": "COR-001",
          "porcentagem": 60.00,
          "captador": "CAP-001"
        },
        {
          "id": "COR-002",
          "porcentagem": 30.00,
          "captador": null
        }
      ],
      "gerencias": [
        {
          "nivel": 1,
          "porcentagem": 5.00
        },
        {
          "nivel": 2,
          "porcentagem": 5.00
        }
      ]
    },
    "colaboradores": {
      "preAtendimento": "COL-001",
      "centralCaptacao": "COL-002"
    }
  }'
```

## Observações Importantes

1. **Formatação de Dados**: 
   - CPF, CEP e Celular são enviados **sem formatação** (apenas números)
   - Valores monetários são enviados como **números decimais** (não strings)
   - Estado (UF) deve ser enviado em maiúsculas (SP, RJ, MG, etc.)

2. **Campos Opcionais**:
   - `compradorConjuge`: Enviar `null` se não houver
   - `vendedorConjuge`: Enviar `null` se não houver
   - `captador`: Pode ser `null` se não houver captador
   - `colaboradores.preAtendimento` e `colaboradores.centralCaptacao`: Podem ser strings vazias ou omitidos
   - `profissao`: Campo opcional para todas as pessoas
   - `complemento`: Campo opcional para todos os endereços

3. **Validação de Comissões**:
   - A validação de que a soma deve ser 100% é feita no frontend, mas deve ser **revalidada no backend**
   - O backend deve garantir que não há duplicação de corretores ou gerências
   - A soma deve ser exatamente 100% (pode usar margem de erro de 0.01 para arredondamentos)

4. **Validação de Valor Meta**:
   - O `valorMeta` deve ser exatamente 5% do `valorVenda`
   - Pode usar margem de erro de 0.01 para arredondamentos

5. **Tratamento de Erros**:
   - Sempre retornar mensagens de erro claras e específicas
   - Indicar quais campos estão com problema no array `errors`
   - Retornar status HTTP apropriados (400 para validação, 500 para erros de servidor)
   - Em desenvolvimento, pode incluir detalhes do erro. Em produção, ser mais genérico

## Endpoints Relacionados (Sugestões)

### GET /api/ficha-venda/:id
Retornar uma ficha de venda específica

### GET /api/ficha-venda
Listar fichas de venda (com paginação e filtros)

### PUT /api/ficha-venda/:id
Atualizar uma ficha de venda existente

### DELETE /api/ficha-venda/:id
Excluir uma ficha de venda (soft delete recomendado)

## Exemplos de Integração

### JavaScript/TypeScript (Fetch API)

```typescript
async function criarFichaVenda(dados: CreateSaleFormDto) {
  try {
    const response = await fetch('https://api.exemplo.com/api/ficha-venda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    const result = await response.json();

    if (!response.ok) {
      // Erro de validação ou servidor
      console.error('Erro:', result.message);
      if (result.errors) {
        result.errors.forEach((error: any) => {
          console.error(`- ${error.field}: ${error.message}`);
        });
      }
      throw new Error(result.message);
    }

    // Sucesso
    console.log('Ficha criada:', result.data);
    return result.data;
  } catch (error) {
    console.error('Erro ao criar ficha:', error);
    throw error;
  }
}
```

### Axios

```typescript
import axios from 'axios';

async function criarFichaVenda(dados: CreateSaleFormDto) {
  try {
    const response = await axios.post(
      'https://api.exemplo.com/api/ficha-venda',
      dados,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Erro do servidor (400, 500, etc)
      console.error('Erro:', error.response.data);
      throw error.response.data;
    }
    throw error;
  }
}
```

## Validações Recomendadas no Backend

### 1. Validar CPF (Algoritmo de Dígitos Verificadores)

```typescript
function validarCPF(cpf: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false; // Todos os dígitos iguais

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
}
```

### 2. Validar Soma de Comissões

```typescript
function validarComissoes(comissoes: CommissionsDto): boolean {
  const totalCorretores = comissoes.corretores.reduce(
    (sum, c) => sum + c.porcentagem,
    0
  );
  const totalGerencias = comissoes.gerencias.reduce(
    (sum, g) => sum + g.porcentagem,
    0
  );
  const total = totalCorretores + totalGerencias;
  
  // Permite pequena margem de erro para arredondamentos
  return Math.abs(total - 100) < 0.01;
}
```

### 3. Validar Valor Meta

```typescript
function validarValorMeta(valorVenda: number, valorMeta: number): boolean {
  const esperado = valorVenda * 0.05;
  // Permite pequena margem de erro para arredondamentos
  return Math.abs(valorMeta - esperado) < 0.01;
}
```

### 4. Validar Idade Mínima

```typescript
function calcularIdade(dataNascimento: string): number {
  const birth = new Date(dataNascimento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function validarIdadeMinima(dataNascimento: string): boolean {
  return calcularIdade(dataNascimento) >= 18;
}
```

## Changelog

- **2024-01-15**: Versão inicial da documentação
- Campos de endereço integrados com ViaCEP
- Remoção temporária de campos de assinatura
- API pública (sem autenticação)
- Validações de CPF, idade, comissões e valorMeta implementadas
