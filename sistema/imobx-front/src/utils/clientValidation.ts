import {
  validateCPF,
  validateEmail,
  validatePhone,
  validateCEP,
} from './masks';

export interface ClientFormData {
  name: string;
  email?: string;
  cpf: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  type: string;
  status: string;
  incomeRange?: string;
  loanRange?: string;
  priceRange?: string;
  preferences?: string;
  notes?: string;
  preferredContactMethod?: string;
  preferredPropertyType?: string;
  preferredCity?: string;
  preferredNeighborhood?: string;
  minArea?: string;
  maxArea?: string;
  minBedrooms?: string;
  maxBedrooms?: string;
  minBathrooms?: string;
  minValue?: string;
  maxValue?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateClientForm = (data: ClientFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar nome (obrigatório)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Nome é obrigatório';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  } else if (data.name.trim().length > 255) {
    errors.name = 'Nome não pode ter mais que 255 caracteres';
  }

  // Validar email (opcional, mas se preenchido deve ser válido)
  if (data.email && data.email.trim().length > 0) {
    if (!validateEmail(data.email.trim())) {
      errors.email = 'Email inválido';
    } else if (data.email.trim().length > 255) {
      errors.email = 'Email não pode ter mais que 255 caracteres';
    }
  }

  // Validar CPF (obrigatório)
  if (!data.cpf || data.cpf.trim().length === 0) {
    errors.cpf = 'CPF é obrigatório';
  } else if (!validateCPF(data.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  // Validar telefone principal (obrigatório)
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'Telefone principal é obrigatório';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Telefone inválido';
  }

  // Validar telefone secundário (opcional)
  if (data.secondaryPhone && data.secondaryPhone.trim().length > 0) {
    if (!validatePhone(data.secondaryPhone)) {
      errors.secondaryPhone = 'Telefone secundário inválido';
    }
  }

  // Validar WhatsApp (opcional)
  if (data.whatsapp && data.whatsapp.trim().length > 0) {
    if (!validatePhone(data.whatsapp)) {
      errors.whatsapp = 'WhatsApp inválido';
    }
  }

  // Validar CEP (obrigatório)
  if (!data.zipCode || data.zipCode.trim().length === 0) {
    errors.zipCode = 'CEP é obrigatório';
  } else if (!validateCEP(data.zipCode)) {
    errors.zipCode = 'CEP inválido';
  }

  // Validar endereço (obrigatório)
  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Endereço é obrigatório';
  } else if (data.address.trim().length > 500) {
    errors.address = 'Endereço não pode ter mais que 500 caracteres';
  }

  // Validar cidade (obrigatório)
  if (!data.city || data.city.trim().length === 0) {
    errors.city = 'Cidade é obrigatória';
  } else if (data.city.trim().length > 100) {
    errors.city = 'Cidade não pode ter mais que 100 caracteres';
  }

  // Validar estado (obrigatório)
  if (!data.state || data.state.trim().length === 0) {
    errors.state = 'Estado é obrigatório';
  } else if (data.state.trim().length !== 2) {
    errors.state = 'Estado deve ser a sigla com 2 caracteres';
  }

  // Validar bairro (obrigatório)
  if (!data.neighborhood || data.neighborhood.trim().length === 0) {
    errors.neighborhood = 'Bairro é obrigatório';
  } else if (data.neighborhood.trim().length > 100) {
    errors.neighborhood = 'Bairro não pode ter mais que 100 caracteres';
  }

  // Validar tipo (obrigatório)
  if (!data.type) {
    errors.type = 'Tipo do cliente é obrigatório';
  }

  // Validar status (obrigatório)
  if (!data.status) {
    errors.status = 'Status é obrigatório';
  }

  // Validar valores monetários (opcional)
  if (data.minValue && data.minValue.trim().length > 0) {
    const minValue = parseFloat(
      data.minValue.replace(/[^\d,]/g, '').replace(',', '.')
    );
    if (isNaN(minValue) || minValue < 0) {
      errors.minValue = 'Valor mínimo inválido';
    }
  }

  if (data.maxValue && data.maxValue.trim().length > 0) {
    const maxValue = parseFloat(
      data.maxValue.replace(/[^\d,]/g, '').replace(',', '.')
    );
    if (isNaN(maxValue) || maxValue < 0) {
      errors.maxValue = 'Valor máximo inválido';
    }

    // Validar se valor máximo é maior que mínimo
    if (data.minValue && data.minValue.trim().length > 0) {
      const minValue = parseFloat(
        data.minValue.replace(/[^\d,]/g, '').replace(',', '.')
      );
      const maxValue = parseFloat(
        data.maxValue.replace(/[^\d,]/g, '').replace(',', '.')
      );
      if (!isNaN(minValue) && !isNaN(maxValue) && maxValue < minValue) {
        errors.maxValue = 'Valor máximo deve ser maior que o valor mínimo';
      }
    }
  }

  // Validar área (opcional)
  if (data.minArea && data.minArea.trim().length > 0) {
    const minArea = parseFloat(data.minArea);
    if (isNaN(minArea) || minArea < 0) {
      errors.minArea = 'Área mínima inválida';
    }
  }

  if (data.maxArea && data.maxArea.trim().length > 0) {
    const maxArea = parseFloat(data.maxArea);
    if (isNaN(maxArea) || maxArea < 0) {
      errors.maxArea = 'Área máxima inválida';
    }

    // Validar se área máxima é maior que mínima
    if (data.minArea && data.minArea.trim().length > 0) {
      const minArea = parseFloat(data.minArea);
      const maxArea = parseFloat(data.maxArea);
      if (!isNaN(minArea) && !isNaN(maxArea) && maxArea < minArea) {
        errors.maxArea = 'Área máxima deve ser maior que a área mínima';
      }
    }
  }

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFirstError = (errors: ValidationErrors): string | null => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};
