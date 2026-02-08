import * as XLSX from 'xlsx';

export const generatePropertyTemplate = (
  format: 'xlsx' | 'csv' = 'xlsx'
): void => {
  // Cabeçalhos das colunas conforme a documentação
  const headers = [
    'Título',
    'Descrição',
    'Tipo',
    'Endereço',
    'Rua',
    'Número',
    'Complemento',
    'Cidade',
    'Estado',
    'CEP',
    'Bairro',
    'Área Total (m²)',
    'Área Construída (m²)',
    'Quartos',
    'Banheiros',
    'Vagas de Garagem',
    'Preço de Venda',
    'Preço de Aluguel',
    'Aceita Negociação',
    'Valor Mínimo Venda',
    'Valor Mínimo Aluguel',
    'Condomínio',
    'IPTU',
    'Características',
    'Ativa',
    'Destaque',
    'Nome do Proprietário',
    'Email do Proprietário',
    'Telefone do Proprietário',
    'CPF/CNPJ do Proprietário',
    'Endereço do Proprietário',
    'Imagens (URLs separadas por vírgula)',
  ];

  // Linha de comentários/instruções (linha 2 no template)
  const commentsRow = [
    'Título da propriedade (OBRIGATÓRIO - máximo 255 caracteres)',
    'Descrição detalhada da propriedade (OBRIGATÓRIO)',
    'Tipo: Casa, Apartamento, Comercial, Terreno ou Rural (OBRIGATÓRIO)',
    'Status será definido automaticamente: RASCUNHO se faltar imagens ou dados, DISPONÍVEL se tiver pelo menos 5 imagens e dados completos',
    'Endereço completo (OBRIGATÓRIO)',
    'Rua/Logradouro (OBRIGATÓRIO - máximo 255 caracteres)',
    'Número do endereço (OBRIGATÓRIO - máximo 20 caracteres)',
    'Complemento: Apto, Bloco, etc (opcional - máximo 100 caracteres)',
    'Cidade (OBRIGATÓRIO - máximo 100 caracteres)',
    'Estado: SP, RJ, MG, etc - 2 letras (OBRIGATÓRIO)',
    'CEP com ou sem traço (OBRIGATÓRIO - máximo 10 caracteres)',
    'Bairro (OBRIGATÓRIO - máximo 100 caracteres)',
    'Área total em m² - número decimal (OBRIGATÓRIO - mínimo 0.01)',
    'Área construída em m² - número decimal (opcional)',
    'Número de quartos - número inteiro (opcional)',
    'Número de banheiros - número inteiro (opcional)',
    'Número de vagas de garagem - número inteiro (opcional)',
    'Preço de venda em reais - número decimal (opcional)',
    'Preço de aluguel em reais - número decimal (opcional)',
    'Aceita negociação: Sim ou Não (padrão: Não)',
    'Valor mínimo aceito para venda - número decimal (opcional - requer aceita negociação = Sim)',
    'Valor mínimo aceito para aluguel - número decimal (opcional - requer aceita negociação = Sim)',
    'Valor do condomínio em reais - número decimal (opcional)',
    'IPTU anual em reais - número decimal (opcional)',
    'Características separadas por ponto e vírgula: Piscina; Churrasqueira; etc (opcional)',
    'Ativa: Sim ou Não (padrão: Sim)',
    'Destaque: Sim ou Não (padrão: Não)',
    'Nome completo do proprietário (OBRIGATÓRIO - máximo 255 caracteres)',
    'Email do proprietário (OBRIGATÓRIO - máximo 255 caracteres)',
    'Telefone do proprietário (OBRIGATÓRIO - máximo 20 caracteres)',
    'CPF ou CNPJ do proprietário (OBRIGATÓRIO - máximo 18 caracteres)',
    'Endereço completo do proprietário (OBRIGATÓRIO)',
    'URLs de imagens separadas por vírgula - mínimo 5 imagens para status AVAILABLE (opcional - propriedades sem imagens ficam em DRAFT)',
  ];

  // Dados de exemplo para CSV (valores como strings)
  const exampleDataCSV = [
    [
      'Casa com 3 quartos na Zona Sul',
      'Casa térrea com 3 quartos, 2 banheiros, garagem para 2 carros, área de lazer completa',
      'Casa',
      'Rua das Flores, 123',
      'Rua das Flores',
      '123',
      '',
      'São Paulo',
      'SP',
      '01234-567',
      'Vila Madalena',
      '150.5',
      '120.0',
      '3',
      '2',
      '2',
      '450000.0',
      '2500.0',
      'Sim',
      '400000.0',
      '2000.0',
      '300.0',
      '1200.0',
      'Piscina; Churrasqueira; Área de lazer',
      'Sim',
      'Não',
      'João Silva',
      'joao@example.com',
      '(11) 98765-4321',
      '123.456.789-00',
      'Rua Exemplo, 456, São Paulo - SP',
      'https://example.com/image1.jpg,https://example.com/image2.jpg,https://example.com/image3.jpg,https://example.com/image4.jpg,https://example.com/image5.jpg',
    ],
    [
      'Apartamento moderno no centro',
      'Apartamento de 2 quartos, 1 banheiro, 1 vaga, com varanda e vista para a cidade',
      'Apartamento',
      'Av. Paulista, 1000',
      'Av. Paulista',
      '1000',
      'Apto 50',
      'São Paulo',
      'SP',
      '01310-100',
      'Bela Vista',
      '80.0',
      '75.0',
      '2',
      '1',
      '1',
      '350000.0',
      '',
      'Não',
      '',
      '',
      '500.0',
      '800.0',
      'Varanda; Vista; Elevador',
      'Sim',
      'Sim',
      'Maria Santos',
      'maria@example.com',
      '(11) 91234-5678',
      '987.654.321-00',
      'Rua Teste, 789, São Paulo - SP',
      '',
    ],
  ];

  // Dados de exemplo para XLSX (valores numéricos como números)
  const exampleDataXLSX = [
    [
      'Casa com 3 quartos na Zona Sul',
      'Casa térrea com 3 quartos, 2 banheiros, garagem para 2 carros, área de lazer completa',
      'Casa',
      'Rua das Flores, 123',
      'Rua das Flores',
      '123',
      null,
      'São Paulo',
      'SP',
      '01234-567',
      'Vila Madalena',
      150.5,
      120.0,
      3,
      2,
      2,
      450000.0,
      2500.0,
      'Sim',
      400000.0,
      2000.0,
      300.0,
      1200.0,
      'Piscina; Churrasqueira; Área de lazer',
      'Sim',
      'Não',
      'João Silva',
      'joao@example.com',
      '(11) 98765-4321',
      '123.456.789-00',
      'Rua Exemplo, 456, São Paulo - SP',
      'https://example.com/image1.jpg,https://example.com/image2.jpg,https://example.com/image3.jpg,https://example.com/image4.jpg,https://example.com/image5.jpg',
    ],
    [
      'Apartamento moderno no centro',
      'Apartamento de 2 quartos, 1 banheiro, 1 vaga, com varanda e vista para a cidade',
      'Apartamento',
      'Av. Paulista, 1000',
      'Av. Paulista',
      '1000',
      'Apto 50',
      'São Paulo',
      'SP',
      '01310-100',
      'Bela Vista',
      80.0,
      75.0,
      2,
      1,
      1,
      350000.0,
      null,
      'Não',
      null,
      null,
      500.0,
      800.0,
      'Varanda; Vista; Elevador',
      'Sim',
      'Sim',
      'Maria Santos',
      'maria@example.com',
      '(11) 91234-5678',
      '987.654.321-00',
      'Rua Teste, 789, São Paulo - SP',
      null,
    ],
  ];

  if (format === 'csv') {
    // Gerar CSV
    const csvRows = [
      headers.join(','),
      commentsRow.join(','), // Linha de comentários/instruções
      ...exampleDataCSV.map(row =>
        row
          .map(cell => {
            // Campos vazios ficam vazios (sem aspas)
            if (cell === null || cell === undefined || cell === '') {
              return '';
            }
            const cellStr = String(cell);
            // Apenas escapar se contiver vírgula, aspas ou quebra de linha
            if (
              cellStr.includes(',') ||
              cellStr.includes('"') ||
              cellStr.includes('\n')
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_propriedades.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // Gerar XLSX
  const excelData = [
    headers,
    commentsRow, // Linha de comentários/instruções
    ...exampleDataXLSX.map(row =>
      row.map(cell => (cell === null || cell === undefined ? '' : cell))
    ),
  ];

  // Criar worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Definir larguras das colunas
  const colWidths = [
    { wch: 35 }, // Título
    { wch: 50 }, // Descrição
    { wch: 15 }, // Tipo
    { wch: 30 }, // Endereço
    { wch: 25 }, // Rua
    { wch: 10 }, // Número
    { wch: 15 }, // Complemento
    { wch: 15 }, // Cidade
    { wch: 6 }, // Estado
    { wch: 12 }, // CEP
    { wch: 20 }, // Bairro
    { wch: 12 }, // Área Total
    { wch: 12 }, // Área Construída
    { wch: 8 }, // Quartos
    { wch: 10 }, // Banheiros
    { wch: 12 }, // Vagas
    { wch: 15 }, // Preço Venda
    { wch: 15 }, // Preço Aluguel
    { wch: 15 }, // Aceita Negociação
    { wch: 15 }, // Valor Mínimo Venda
    { wch: 15 }, // Valor Mínimo Aluguel
    { wch: 12 }, // Condomínio
    { wch: 12 }, // IPTU
    { wch: 40 }, // Características
    { wch: 8 }, // Ativa
    { wch: 10 }, // Destaque
    { wch: 25 }, // Nome Proprietário
    { wch: 30 }, // Email Proprietário
    { wch: 18 }, // Telefone Proprietário
    { wch: 18 }, // CPF/CNPJ Proprietário
    { wch: 40 }, // Endereço Proprietário
    { wch: 60 }, // Imagens
  ];
  worksheet['!cols'] = colWidths;

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Propriedades');

  // Baixar arquivo
  XLSX.writeFile(workbook, 'template_propriedades.xlsx');
};
