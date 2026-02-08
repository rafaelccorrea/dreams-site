import * as XLSX from 'xlsx';

export interface ClientTemplateRow {
  nome: string;
  email?: string;
  cpf: string;
  telefone_principal: string;
  telefone_secundario?: string;
  whatsapp?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  valor_minimo?: number;
  valor_maximo?: number;
  tipo_interesse: string;
  observacoes?: string;
}

export const generateClientTemplate = (
  format: 'xlsx' | 'csv' = 'xlsx'
): void => {
  // Cabeçalhos das colunas
  const headers = [
    'nome',
    'email',
    'cpf',
    'telefone_principal',
    'telefone_secundario',
    'whatsapp',
    'endereco',
    'numero',
    'complemento',
    'bairro',
    'cidade',
    'estado',
    'cep',
    'valor_minimo',
    'valor_maximo',
    'tipo_interesse',
    'observacoes',
  ];

  // Linha de comentários/instruções (linha 2 no template)
  const commentsRow = [
    'Nome completo (OBRIGATÓRIO)',
    'Email (opcional)',
    'CPF apenas números, 11 dígitos (OBRIGATÓRIO)',
    'Telefone principal apenas números (OBRIGATÓRIO)',
    'Telefone secundário apenas números (opcional)',
    'WhatsApp apenas números (opcional)',
    'Nome da rua/avenida (OBRIGATÓRIO)',
    'Número do endereço (OBRIGATÓRIO)',
    'Complemento: apto, sala, etc (opcional)',
    'Bairro (OBRIGATÓRIO)',
    'Cidade (OBRIGATÓRIO)',
    'Estado: SP, RJ, MG, etc - 2 letras (OBRIGATÓRIO)',
    'CEP apenas números, 8 dígitos (OBRIGATÓRIO)',
    'Valor mínimo em números (opcional)',
    'Valor máximo em números (opcional)',
    'comprador, vendedor, locatario, locador, investidor (OBRIGATÓRIO)',
    'Observações gerais (opcional)',
  ];

  // Dados de exemplo (exatamente como no template fornecido)
  // Para CSV: valores numéricos como strings simples
  // Para XLSX: valores numéricos como números
  const exampleDataCSV = [
    [
      'João Silva',
      'joao.silva@example.com',
      '12345678901',
      '11987654321',
      '11912345678',
      '11987654321',
      'Rua das Flores',
      '123',
      'Apto 401',
      'Jardim Paulista',
      'São Paulo',
      'SP',
      '01234567',
      '100000',
      '500000',
      'comprador',
      'Cliente interessado em apartamentos de 2 quartos',
    ],
    [
      'Maria Oliveira',
      'maria.o@example.com',
      '98765432100',
      '21998765432',
      '',
      '21998765432',
      'Avenida Principal',
      '456',
      '',
      'Centro',
      'Rio de Janeiro',
      'RJ',
      '20000000',
      '',
      '800000',
      'vendedor',
      'Proprietária de casa no centro',
    ],
    [
      'Pedro Santos',
      'pedro@example.com',
      '11122233344',
      '11999887766',
      '11988776655',
      '11999887766',
      'Rua dos Lírios',
      '789',
      'Casa',
      'Jardim América',
      'Belo Horizonte',
      'MG',
      '30123456',
      '200000',
      '600000',
      'comprador',
      'Interessado em casas com garagem',
    ],
    [
      'Ana Costa',
      'ana.costa@example.com',
      '55566677788',
      '11977665544',
      '',
      '11977665544',
      'Av. Paulista',
      '1000',
      'Sala 50',
      'Bela Vista',
      'São Paulo',
      'SP',
      '01310100',
      '',
      '',
      'locador',
      'Proprietária de apartamento para locação',
    ],
  ];

  // Para XLSX: valores numéricos como números
  const exampleDataXLSX = [
    [
      'João Silva',
      'joao.silva@example.com',
      '12345678901',
      '11987654321',
      '11912345678',
      '11987654321',
      'Rua das Flores',
      '123',
      'Apto 401',
      'Jardim Paulista',
      'São Paulo',
      'SP',
      '01234567',
      100000,
      500000,
      'comprador',
      'Cliente interessado em apartamentos de 2 quartos',
    ],
    [
      'Maria Oliveira',
      'maria.o@example.com',
      '98765432100',
      '21998765432',
      null,
      '21998765432',
      'Avenida Principal',
      '456',
      null,
      'Centro',
      'Rio de Janeiro',
      'RJ',
      '20000000',
      null,
      800000,
      'vendedor',
      'Proprietária de casa no centro',
    ],
    [
      'Pedro Santos',
      'pedro@example.com',
      '11122233344',
      '11999887766',
      '11988776655',
      '11999887766',
      'Rua dos Lírios',
      '789',
      'Casa',
      'Jardim América',
      'Belo Horizonte',
      'MG',
      '30123456',
      200000,
      600000,
      'comprador',
      'Interessado em casas com garagem',
    ],
    [
      'Ana Costa',
      'ana.costa@example.com',
      '55566677788',
      '11977665544',
      null,
      '11977665544',
      'Av. Paulista',
      '1000',
      'Sala 50',
      'Bela Vista',
      'São Paulo',
      'SP',
      '01310100',
      null,
      null,
      'locador',
      'Proprietária de apartamento para locação',
    ],
  ];

  if (format === 'csv') {
    // Gerar CSV exatamente como no template fornecido
    // Incluir linha de comentários após os cabeçalhos
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
            // Valores numéricos são strings simples (sem aspas)
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

    // Gerar CSV sem BOM para corresponder exatamente ao template fornecido
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Gerar XLSX
  // Criar dados para o Excel com valores numéricos como números
  // Incluir linha de comentários após os cabeçalhos
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
    { wch: 20 }, // nome
    { wch: 25 }, // email
    { wch: 15 }, // cpf
    { wch: 15 }, // telefone_principal
    { wch: 15 }, // telefone_secundario
    { wch: 15 }, // whatsapp
    { wch: 25 }, // endereco
    { wch: 8 }, // numero
    { wch: 15 }, // complemento
    { wch: 15 }, // bairro
    { wch: 15 }, // cidade
    { wch: 5 }, // estado
    { wch: 10 }, // cep
    { wch: 12 }, // valor_minimo
    { wch: 12 }, // valor_maximo
    { wch: 15 }, // tipo_interesse
    { wch: 40 }, // observacoes
  ];
  worksheet['!cols'] = colWidths;

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

  // Baixar arquivo
  XLSX.writeFile(workbook, 'template_clientes.xlsx');
};

const parseCSVFile = async (file: File): Promise<ClientTemplateRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        let text = e.target.result as string;
        // Remover BOM (Byte Order Mark) se presente
        if (text.charCodeAt(0) === 0xfeff) {
          text = text.slice(1);
        }
        // Normalizar quebras de linha (suporta \r\n, \n, \r)
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('O arquivo CSV está vazio ou não contém dados.'));
          return;
        }

        // Parse CSV manualmente (suporta campos com vírgulas entre aspas)
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
              if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Pular próxima aspas
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        // Encontrar a linha dos cabeçalhos
        let headerRowIndex = -1;
        let headers: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          const parsedLine = parseCSVLine(lines[i]);
          if (parsedLine.includes('nome')) {
            headerRowIndex = i;
            headers = parsedLine.map(h => h.toLowerCase().trim());
            break;
          }
        }

        if (headerRowIndex === -1) {
          reject(
            new Error(
              'Não foi possível encontrar os cabeçalhos do arquivo. Certifique-se de que o arquivo contém a coluna "nome".'
            )
          );
          return;
        }

        // Pular linha de comentários se existir (linha após cabeçalhos)
        let dataStartIndex = headerRowIndex + 1;
        if (dataStartIndex < lines.length) {
          const nextLine = parseCSVLine(lines[dataStartIndex]);
          // Se a próxima linha contém "OBRIGATÓRIO" ou "opcional", é a linha de comentários
          const nextLineStr = nextLine.join(' ').toLowerCase();
          if (
            nextLineStr.includes('obrigatório') ||
            nextLineStr.includes('opcional')
          ) {
            dataStartIndex = dataStartIndex + 1;
          }
        }

        const dataRows = lines.slice(dataStartIndex).map(parseCSVLine);

        // Campos obrigatórios
        const requiredHeaders = [
          'nome',
          'cpf',
          'telefone_principal',
          'endereco',
          'numero',
          'bairro',
          'cidade',
          'estado',
          'cep',
          'tipo_interesse',
        ];

        // Verificar campos obrigatórios
        const missingRequiredHeaders = requiredHeaders.filter(
          h => !headers.includes(h)
        );
        if (missingRequiredHeaders.length > 0) {
          reject(
            new Error(
              `Campos obrigatórios ausentes: ${missingRequiredHeaders.join(', ')}. Verifique o template.`
            )
          );
          return;
        }

        // Mapear dados
        const clients: ClientTemplateRow[] = dataRows
          .filter((row: string[]) => row.length > 0 && row[0] && row[0].trim())
          .map((row: string[]) => {
            const getFieldValue = (fieldName: string) => {
              const index = headers.indexOf(fieldName);
              return index !== -1 && row[index]
                ? String(row[index]).trim()
                : undefined;
            };

            const getNumberValue = (fieldName: string) => {
              const index = headers.indexOf(fieldName);
              if (index === -1 || !row[index]) return undefined;
              const value = String(row[index]).trim();
              return value ? Number(value) : undefined;
            };

            return {
              nome: getFieldValue('nome') || '',
              email: getFieldValue('email'),
              cpf: getFieldValue('cpf') || '',
              telefone_principal: getFieldValue('telefone_principal') || '',
              telefone_secundario: getFieldValue('telefone_secundario'),
              whatsapp: getFieldValue('whatsapp'),
              endereco: getFieldValue('endereco') || '',
              numero: getFieldValue('numero') || '',
              complemento: getFieldValue('complemento'),
              bairro: getFieldValue('bairro') || '',
              cidade: getFieldValue('cidade') || '',
              estado: getFieldValue('estado') || '',
              cep: getFieldValue('cep') || '',
              valor_minimo: getNumberValue('valor_minimo'),
              valor_maximo: getNumberValue('valor_maximo'),
              tipo_interesse: getFieldValue('tipo_interesse') || '',
              observacoes: getFieldValue('observacoes'),
            };
          });

        resolve(clients);
      } catch (error: any) {
        reject(new Error(`Erro ao processar o arquivo CSV: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsText(file);
  });
};

export const parseExcelFile = async (
  file: File
): Promise<ClientTemplateRow[]> => {
  // Detectar se é CSV ou Excel
  const fileName = file.name.toLowerCase();
  const isCSV = fileName.endsWith('.csv');

  if (isCSV) {
    return parseCSVFile(file);
  }

  // Processar Excel
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const bstr = e.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        if (!jsonData || jsonData.length < 2) {
          reject(new Error('O arquivo Excel está vazio ou não contém dados.'));
          return;
        }

        // Encontrar a linha dos cabeçalhos
        let headerRowIndex = -1;
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i] && jsonData[i].includes('nome')) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          reject(
            new Error(
              'Não foi possível encontrar os cabeçalhos do arquivo. Certifique-se de que o arquivo contém a coluna "nome".'
            )
          );
          return;
        }

        const headers = jsonData[headerRowIndex].map((h: any) =>
          String(h || '')
            .toLowerCase()
            .trim()
        );

        // Pular linha de comentários se existir (linha após cabeçalhos)
        let dataStartIndex = headerRowIndex + 1;
        if (dataStartIndex < jsonData.length) {
          const nextRow = jsonData[dataStartIndex];
          if (nextRow && Array.isArray(nextRow)) {
            const nextRowStr = nextRow.join(' ').toLowerCase();
            // Se a próxima linha contém "OBRIGATÓRIO" ou "opcional", é a linha de comentários
            if (
              nextRowStr.includes('obrigatório') ||
              nextRowStr.includes('opcional')
            ) {
              dataStartIndex = dataStartIndex + 1;
            }
          }
        }

        const dataRows = jsonData.slice(dataStartIndex);

        // Campos obrigatórios
        const requiredHeaders = [
          'nome',
          'cpf',
          'telefone_principal',
          'endereco',
          'numero',
          'bairro',
          'cidade',
          'estado',
          'cep',
          'tipo_interesse',
        ];

        // Verificar campos obrigatórios
        const missingRequiredHeaders = requiredHeaders.filter(
          h => !headers.includes(h)
        );
        if (missingRequiredHeaders.length > 0) {
          reject(
            new Error(
              `Campos obrigatórios ausentes: ${missingRequiredHeaders.join(', ')}. Verifique o template.`
            )
          );
          return;
        }

        // Mapear dados
        const clients: ClientTemplateRow[] = dataRows
          .filter((row: any[]) => row.length > 0 && row[0])
          .map((row: any[]) => {
            const getFieldValue = (fieldName: string) => {
              const index = headers.indexOf(fieldName);
              return index !== -1 && row[index]
                ? String(row[index]).trim()
                : undefined;
            };

            const getNumberValue = (fieldName: string) => {
              const index = headers.indexOf(fieldName);
              return index !== -1 && row[index]
                ? Number(row[index])
                : undefined;
            };

            return {
              nome: getFieldValue('nome') || '',
              email: getFieldValue('email'),
              cpf: getFieldValue('cpf') || '',
              telefone_principal: getFieldValue('telefone_principal') || '',
              telefone_secundario: getFieldValue('telefone_secundario'),
              whatsapp: getFieldValue('whatsapp'),
              endereco: getFieldValue('endereco') || '',
              numero: getFieldValue('numero') || '',
              complemento: getFieldValue('complemento'),
              bairro: getFieldValue('bairro') || '',
              cidade: getFieldValue('cidade') || '',
              estado: getFieldValue('estado') || '',
              cep: getFieldValue('cep') || '',
              valor_minimo: getNumberValue('valor_minimo'),
              valor_maximo: getNumberValue('valor_maximo'),
              tipo_interesse: getFieldValue('tipo_interesse') || '',
              observacoes: getFieldValue('observacoes'),
            };
          });

        resolve(clients);
      } catch (error: any) {
        reject(new Error(`Erro ao processar o arquivo: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsArrayBuffer(file);
  });
};
