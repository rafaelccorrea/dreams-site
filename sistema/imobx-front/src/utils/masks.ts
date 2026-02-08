// Utilitários para formatação e máscaras de inputs

// Máscara para CPF
export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

/** Máscara para CPF (11 dígitos) ou CNPJ (14 dígitos). Formato CNPJ: 59.991.430/0001-65 */
export const maskCPFouCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) return maskCPF(value);
  const d = digits.slice(0, 14);
  if (d.length <= 11) return maskCPF(d);
  // CNPJ: XX.XXX.XXX/XXXX-XX (14 dígitos)
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
};

// Máscara para telefone
export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// Máscara para celular (11 dígitos)
export const maskCelPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// Máscara inteligente para telefone (detecta automaticamente fixo ou celular)
export const maskPhoneAuto = (value: string): string => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');

  // Se tem 11 dígitos, é celular
  if (cleaned.length === 11) {
    return maskCelPhone(value);
  }

  // Caso contrário, usa máscara de telefone fixo
  return maskPhone(value);
};

// Função para formatar telefone em exibição (sem input)
export const formatPhoneDisplay = (
  value: string | null | undefined
): string => {
  if (!value) return 'N/A';
  return maskPhoneAuto(value);
};

// Máscara para CEP
export const maskCEP = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

// Máscara para RG
export const maskRG = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{1})\d+?$/, '$1');
};

// Máscara para data de aniversário (MM-DD)
export const maskAnniversaryDate = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Validação de data de aniversário (MM-DD)
export const validateAnniversaryDate = (date: string): boolean => {
  const cleanDate = date.replace(/\D/g, '');
  if (cleanDate.length !== 4) return false;

  const month = parseInt(cleanDate.substring(0, 2));
  const day = parseInt(cleanDate.substring(2, 4));

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Validar dias por mês (simplificado)
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return false;

  return true;
};

// Validação de score de crédito
export const validateCreditScore = (score: number): boolean => {
  return score >= 0 && score <= 1000;
};

// Máscara para valores monetários
export const maskMoney = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.')
    .replace(/^(0|0,)$/, '')
    .replace(/^$/, '');
};

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de telefone
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Validação de CEP
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

// Converter valor monetário para número
export const parseMoney = (value: string): number => {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

// Formatação de valores monetários para exibição
export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Limitar comprimento do texto
export const limitText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Formatação de texto capitalizado
export const capitalize = (text: string): string => {
  return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Máscara para CNPJ (aceita alfanumérico)
export const maskCNPJ = (value: string): string => {
  // Converte para maiúsculo e mantém apenas letras, números e caracteres especiais
  const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Aplica a máscara mantendo a estrutura: XX.XXX.XXX/XXXX-XX
  return cleanValue
    .replace(/([A-Z0-9]{2})([A-Z0-9])/, '$1.$2')
    .replace(/([A-Z0-9]{2}\.[A-Z0-9]{3})([A-Z0-9])/, '$1.$2')
    .replace(/([A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3})([A-Z0-9])/, '$1/$2')
    .replace(
      /([A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4})([A-Z0-9])/,
      '$1-$2'
    )
    .replace(/(-[A-Z0-9]{2})[A-Z0-9]+?$/, '$1');
};

// Validação de CNPJ alfanumérico (conforme documentação SERPRO)
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres especiais
  const cleanCNPJ = cnpj.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Deve ter 14 caracteres (12 + 2 dígitos verificadores)
  if (cleanCNPJ.length !== 14) return false;

  // Função para converter caractere para valor numérico
  // Números: valor direto (0-9)
  // Letras: A=17, B=18, ..., Z=42 (ou seja, ASCII - 48)
  const getCharValue = (char: string): number => {
    const code = char.charCodeAt(0);
    return code - 48;
  };

  // Calcular primeiro dígito verificador
  const calculateDV = (base: string): number => {
    const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const startIndex = 13 - base.length;

    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      const value = getCharValue(base[i]);
      const weight = weights[startIndex + i];
      sum += value * weight;
    }

    const remainder = sum % 11;
    return remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
  };

  // Validar primeiro DV
  const base12 = cleanCNPJ.substring(0, 12);
  const dv1 = calculateDV(base12);
  const dv1Expected = parseInt(cleanCNPJ[12]);

  if (dv1 !== dv1Expected) return false;

  // Validar segundo DV
  const base13 = cleanCNPJ.substring(0, 13);
  const dv2 = calculateDV(base13);
  const dv2Expected = parseInt(cleanCNPJ[13]);

  if (dv2 !== dv2Expected) return false;

  return true;
};

// Funções de formatação (alias para as máscaras)
export const formatPhone = maskPhone;
export const formatCPF = maskCPF;
export const formatCNPJ = maskCNPJ;
export const formatCEP = maskCEP;

// Formatação de moeda para inputs (ex.: 1.234,56)
export const formatCurrency = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.')
    .replace(/^(0|0,)$/, '')
    .replace(/^$/, '');
};

/** Máscara de reais para input: exibe "R$ 1.234,56". Use com getNumericValue para obter o número. */
export const maskCurrencyReais = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return 'R$ ' + formatCurrency(value);
};

// Formatação de área (metros quadrados)
export const formatArea = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.')
    .replace(/^(0|0,)$/, '')
    .replace(/^$/, '');
};

// Função auxiliar para parsear valores corrigindo formato brasileiro
const parseImprovedValue = (cleanValue: string): number => {
  // Se não tem vírgula, trata como inteiro
  if (!cleanValue.includes(',')) {
    return parseFloat(cleanValue) || 0;
  }

  const parts = cleanValue.split(',');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Assumir que os separadores de milhares faltaram
  // Se parte decimal tem mais de 2 dígitos, provavelmente é parte da estrutura incorreta
  if (decimalPart.length > 2) {
    // Combinar inteiro + decimal e separar os últimos 2 dígitos como centavos
    const allDigits = integerPart + decimalPart;

    // Se tem 5+ dígitos no total, separar últimos 2 como centavos
    if (allDigits.length >= 5) {
      const correctedInteger = allDigits.slice(0, -2);
      const correctedDecimal = allDigits.slice(-2);
      return parseFloat(correctedInteger + '.' + correctedDecimal) || 0;
    }
  }

  // Formato correto: inteiro.virgula(2 dígitos)
  return parseFloat(integerPart + '.' + decimalPart.slice(0, 2)) || 0;
};

// Obter valor numérico de string formatada (para moeda brasileira)
export const getNumericValue = (value: string): number => {
  // Remove todos os caracteres não numéricos exceto vírgula
  const cleanValue = value.replace(/[^\d,]/g, '');

  // Se não há vírgula ou tem menos de 3 caracteres após vírgula,
  // assume que não há centavos
  if (!cleanValue.includes(',') || cleanValue.split(',')[1]?.length <= 2) {
    // Formato brasileiro: 1.780.000,00 -> remove pontos, troca vírgula por ponto
    return parseImprovedValue(cleanValue) || 0;
  }

  // Se há 3+ caracteres após vírgula, pode ser formato incorreto
  // Assume formato brasileiro padrão
  const parts = cleanValue.split(',');
  if (parts.length === 2 && parts[1].length > 2) {
    // Ex: 17800000,00 -> separa os últimos 2 dígitos como centavos
    const integerPart = parts[0];
    const decimalPart = parts[1].slice(0, 2);
    return parseFloat(integerPart + '.' + decimalPart) || 0;
  }

  return parseFloat(cleanValue.replace(',', '.')) || 0;
};

// Formatar valor monetário para exibição
export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
