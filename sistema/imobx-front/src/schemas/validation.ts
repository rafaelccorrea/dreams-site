import * as yup from 'yup';
import { PropertyType, PropertyStatus } from '../types/property';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const loginFormSchema = yup.object({
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  rememberMe: yup
    .boolean()
    .transform(v => v === true || v === 'true' || v === 'on')
    .default(false),
});

export const registerSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  document: yup
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(18, 'CNPJ deve ter no máximo 18 caracteres')
    .matches(
      /^[A-Za-z0-9.\-/s]+$/,
      'Documento deve conter apenas letras, números e formatação (., -, /, espaços)'
    )
    .required('CPF/CNPJ é obrigatório'),
  phone: yup
    .string()
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (XX) XXXXX-XXXX'
    )
    .optional(),
});

export const profileSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  document: yup
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CNPJ deve ter 14 dígitos')
    .required('CPF/CNPJ é obrigatório'),
  phone: yup.string(),
});

// Schema para criação de propriedade
export const createPropertySchema = yup.object({
  title: yup
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .required('Título é obrigatório'),

  description: yup
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .required('Descrição é obrigatória'),

  type: yup
    .string()
    .oneOf(Object.values(PropertyType), 'Tipo de propriedade inválido')
    .required('Tipo é obrigatório'),

  status: yup
    .string()
    .oneOf(Object.values(PropertyStatus), 'Status inválido')
    .required('Status é obrigatório'),

  address: yup
    .string()
    .min(10, 'Endereço deve ter pelo menos 10 caracteres')
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .required('Endereço é obrigatório'),

  city: yup
    .string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .required('Cidade é obrigatória'),

  state: yup
    .string()
    .length(2, 'Estado deve ter 2 caracteres')
    .matches(/^[A-Z]{2}$/, 'Estado deve ser uma sigla válida')
    .required('Estado é obrigatório'),

  zipCode: yup
    .string()
    .matches(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000')
    .required('CEP é obrigatório'),

  neighborhood: yup
    .string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres')
    .required('Bairro é obrigatório'),

  totalArea: yup
    .number()
    .positive('Área total deve ser positiva')
    .max(999999.99, 'Área total deve ser menor que 1.000.000 m²')
    .required('Área total é obrigatória'),

  builtArea: yup
    .number()
    .positive('Área construída deve ser positiva')
    .max(999999.99, 'Área construída deve ser menor que 1.000.000 m²')
    .nullable()
    .optional(),

  bedrooms: yup
    .number()
    .integer('Número de quartos deve ser inteiro')
    .min(0, 'Número de quartos não pode ser negativo')
    .max(50, 'Número de quartos deve ser menor que 50')
    .nullable()
    .optional(),

  bathrooms: yup
    .number()
    .integer('Número de banheiros deve ser inteiro')
    .min(0, 'Número de banheiros não pode ser negativo')
    .max(20, 'Número de banheiros deve ser menor que 20')
    .nullable()
    .optional(),

  parkingSpaces: yup
    .number()
    .integer('Número de vagas deve ser inteiro')
    .min(0, 'Número de vagas não pode ser negativo')
    .max(20, 'Número de vagas deve ser menor que 20')
    .nullable()
    .optional(),

  salePrice: yup
    .number()
    .positive('Preço de venda deve ser positivo')
    .max(999999999.99, 'Preço de venda deve ser menor que R$ 1 bilhão')
    .nullable()
    .optional(),

  rentPrice: yup
    .number()
    .positive('Preço de aluguel deve ser positivo')
    .max(999999.99, 'Preço de aluguel deve ser menor que R$ 1 milhão')
    .nullable()
    .optional(),

  condominiumFee: yup
    .number()
    .positive('Valor do condomínio deve ser positivo')
    .max(99999.99, 'Valor do condomínio deve ser menor que R$ 100 mil')
    .nullable()
    .optional(),

  iptu: yup
    .number()
    .positive('IPTU deve ser positivo')
    .max(99999.99, 'IPTU deve ser menor que R$ 100 mil')
    .nullable()
    .optional(),

  features: yup.array().of(yup.string()).default([]).optional(),

  isActive: yup.boolean().default(true).optional(),

  isFeatured: yup.boolean().default(false).optional(),

  isAvailableForSite: yup.boolean().default(false).optional(),

  // Campos do proprietário (obrigatórios)
  ownerName: yup
    .string()
    .min(3, 'Nome do proprietário deve ter pelo menos 3 caracteres')
    .max(255, 'Nome do proprietário deve ter no máximo 255 caracteres')
    .required('Nome do proprietário é obrigatório'),

  ownerEmail: yup
    .string()
    .email('Email do proprietário deve ter um formato válido')
    .max(255, 'Email do proprietário deve ter no máximo 255 caracteres')
    .required('Email do proprietário é obrigatório'),

  ownerPhone: yup
    .string()
    .min(10, 'Telefone do proprietário deve ter pelo menos 10 caracteres')
    .max(20, 'Telefone do proprietário deve ter no máximo 20 caracteres')
    .required('Telefone do proprietário é obrigatório'),

  ownerDocument: yup
    .string()
    .min(11, 'CPF/CNPJ do proprietário deve ter pelo menos 11 caracteres')
    .max(18, 'CPF/CNPJ do proprietário deve ter no máximo 18 caracteres')
    .required('CPF/CNPJ do proprietário é obrigatório'),

  ownerAddress: yup
    .string()
    .min(10, 'Endereço do proprietário deve ter pelo menos 10 caracteres')
    .required('Endereço do proprietário é obrigatório'),
});

// Schema para atualização de propriedade (todos os campos opcionais)
export const updatePropertySchema = createPropertySchema.partial();

// Schema para filtros de propriedades
export const propertyFiltersSchema = yup.object({
  type: yup.string().oneOf(Object.values(PropertyType)).optional(),
  status: yup.string().oneOf(Object.values(PropertyStatus)).optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  neighborhood: yup.string().optional(),
  minPrice: yup.number().positive().optional(),
  maxPrice: yup.number().positive().optional(),
  minArea: yup.number().positive().optional(),
  maxArea: yup.number().positive().optional(),
  bedrooms: yup.number().integer().min(0).optional(),
  bathrooms: yup.number().integer().min(0).optional(),
  parkingSpaces: yup.number().integer().min(0).optional(),
  features: yup.array().of(yup.string()).optional(),
  isActive: yup.boolean().optional(),
  isFeatured: yup.boolean().optional(),
  search: yup.string().optional(),
});
