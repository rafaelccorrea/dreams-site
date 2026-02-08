import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdCreditCard, MdInfo } from 'react-icons/md';
import { toast } from 'react-toastify';
import { subscriptionService } from '../../services/subscriptionService';

interface UpdatePaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  padding: 80px 20px 20px 20px;
  z-index: 999999;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Field = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}22;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
`;

const InfoCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $loading?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  opacity: ${props => (props.$loading ? 0.7 : 1)};

  ${props =>
    props.$variant === 'primary'
      ? `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, #6366f1 100%);
        color: white;

        &:hover {
          transform: ${props.$loading ? 'none' : 'translateY(-2px)'};
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `
      : `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};

        &:hover {
          background: ${props.theme.colors.border};
        }
      `}
`;

const sanitizeNumber = (value: string) => value.replace(/\D/g, '');

const maskCardNumber = (value: string) => {
  const digits = sanitizeNumber(value).slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
};

const maskExpiryValue = (value: string) => sanitizeNumber(value).slice(0, 2);

const maskCvv = (value: string) => sanitizeNumber(value).slice(0, 4);

const maskCpfCnpj = (value: string) => {
  const digits = sanitizeNumber(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const maskPostalCode = (value: string) => {
  const digits = sanitizeNumber(value).slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

const maskPhoneNumber = (value: string) => {
  const digits = sanitizeNumber(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

const cardDataPrototype = {
  holderName: '',
  number: '',
  expiryMonth: '',
  expiryYear: '',
  ccv: '',
};

const CARD_FIELD_ERROR_MAP: Record<keyof typeof cardDataPrototype, string> = {
  holderName: 'cardHolderName',
  number: 'cardNumber',
  expiryMonth: 'expiryMonth',
  expiryYear: 'expiryYear',
  ccv: 'cvv',
};

const UpdatePaymentMethodModal: React.FC<UpdatePaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
  });
  const [holderData, setHolderData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    postalCode: '',
    addressNumber: '',
    addressComplement: '',
    mobilePhone: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [clientIp, setClientIp] = useState<string | null>(null);
  const clearError = (key: string) => {
    setErrors(prev => {
      if (!(key in prev)) {
        return prev;
      }
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCardInputChange = (
    field: keyof typeof cardData,
    rawValue: string
  ) => {
    let formattedValue = rawValue;

    switch (field) {
      case 'number':
        formattedValue = maskCardNumber(rawValue);
        break;
      case 'expiryMonth': {
        // CORREÇÃO: Validar que o mês está entre 1 e 12
        formattedValue = maskExpiryValue(rawValue);
        const monthDigits = sanitizeNumber(formattedValue);
        if (monthDigits.length === 2) {
          const monthNumber = Number(monthDigits);
          // Se o valor for maior que 12, manter apenas o primeiro dígito
          if (monthNumber > 12) {
            formattedValue = monthDigits[0];
          }
        }
        break;
      }
      case 'expiryYear':
        formattedValue = maskExpiryValue(rawValue);
        break;
      case 'ccv':
        formattedValue = maskCvv(rawValue);
        break;
      default:
        break;
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    const errorKey = CARD_FIELD_ERROR_MAP[field];
    if (errorKey) {
      clearError(errorKey);
    }
  };

  const handleHolderInputChange = (
    field: keyof typeof holderData,
    rawValue: string
  ) => {
    let formattedValue = rawValue;

    if (field === 'cpfCnpj') {
      formattedValue = maskCpfCnpj(rawValue);
    } else if (field === 'postalCode') {
      formattedValue = maskPostalCode(rawValue);
    } else if (field === 'mobilePhone' || field === 'phone') {
      formattedValue = maskPhoneNumber(rawValue);
    }

    setHolderData(prev => ({ ...prev, [field]: formattedValue }));
    clearError(field);
  };

  useEffect(() => {
    if (isOpen) {
      setCardData({
        holderName: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: '',
      });
      setHolderData({
        name: '',
        email: '',
        cpfCnpj: '',
        postalCode: '',
        addressNumber: '',
        addressComplement: '',
        mobilePhone: '',
        phone: '',
      });
      setErrors({});

      subscriptionService
        .fetchClientIp()
        .then(ip => setClientIp(ip))
        .catch(() => setClientIp(null));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardData.holderName.trim()) {
      newErrors.cardHolderName = 'Informe o nome impresso no cartão';
    }

    const cardNumberDigits = sanitizeNumber(cardData.number);
    if (cardNumberDigits.length < 13 || cardNumberDigits.length > 16) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }

    const monthDigits = sanitizeNumber(cardData.expiryMonth);
    const yearDigits = sanitizeNumber(cardData.expiryYear);
    const monthNumber = Number(monthDigits);
    if (
      monthDigits.length !== 2 ||
      Number.isNaN(monthNumber) ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      newErrors.expiryMonth = 'Mês inválido';
    }
    if (yearDigits.length !== 2) {
      newErrors.expiryYear = 'Ano inválido';
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const yearNumber = Number(yearDigits);
      const century = Math.floor(currentYear / 100) * 100;
      let fullYear = century + yearNumber;
      if (fullYear < currentYear) {
        fullYear += 100;
      }
      if (!newErrors.expiryMonth) {
        if (fullYear === currentYear && monthNumber < currentMonth) {
          newErrors.expiryMonth = 'Cartão expirado';
        } else if (fullYear - currentYear > 15) {
          newErrors.expiryYear = 'Ano inválido';
        }
      }
    }

    const cvvDigits = sanitizeNumber(cardData.ccv);
    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
      newErrors.cvv = 'CVV inválido';
    }

    if (!holderData.name.trim()) {
      newErrors.holderName = 'Informe o nome do titular';
    }

    const emailValue = holderData.email.trim();
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      newErrors.email = 'Informe um e-mail válido';
    }

    const cpfCnpjDigits = sanitizeNumber(holderData.cpfCnpj);
    if (cpfCnpjDigits.length !== 11 && cpfCnpjDigits.length !== 14) {
      newErrors.cpfCnpj = 'CPF/CNPJ inválido';
    }

    if (sanitizeNumber(holderData.postalCode).length !== 8) {
      newErrors.postalCode = 'CEP inválido';
    }

    if (!holderData.addressNumber.trim()) {
      newErrors.addressNumber = 'Informe o número';
    }

    const mobileDigits = sanitizeNumber(holderData.mobilePhone);
    if (mobileDigits.length !== 11) {
      newErrors.mobilePhone = 'Telefone celular inválido';
    }

    const phoneDigits = sanitizeNumber(holderData.phone);
    if (
      phoneDigits.length > 0 &&
      (phoneDigits.length < 10 || phoneDigits.length > 11)
    ) {
      newErrors.phone = 'Telefone fixo inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    if (!validate()) {
      toast.error('Revise os campos destacados.');
      return;
    }

    try {
      setLoading(true);
      await subscriptionService.updatePaymentMethod({
        card: {
          holderName: cardData.holderName.trim(),
          number: sanitizeNumber(cardData.number),
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: sanitizeNumber(cardData.ccv),
        },
        cardHolder: {
          name: holderData.name.trim(),
          email: holderData.email.trim(),
          cpfCnpj: sanitizeNumber(holderData.cpfCnpj),
          postalCode: sanitizeNumber(holderData.postalCode),
          addressNumber: holderData.addressNumber.trim(),
          addressComplement: holderData.addressComplement?.trim() || undefined,
          mobilePhone: sanitizeNumber(holderData.mobilePhone),
          phone: holderData.phone
            ? sanitizeNumber(holderData.phone)
            : undefined,
        },
        remoteIp: clientIp ?? undefined,
      });

      toast.success('Forma de pagamento atualizada com sucesso!');
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Erro ao atualizar forma de pagamento.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={() => !loading && onClose()}>
      <ModalContent onClick={event => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdCreditCard size={24} />
            Atualizar Forma de Pagamento
          </ModalTitle>
          <CloseButton onClick={onClose} disabled={loading}>
            <MdClose size={22} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoCard>
            <MdInfo size={18} />
            <div>
              Seus dados são enviados com segurança para validar o novo cartão.
              Uma cobrança de R$ 1 será realizada e estornada automaticamente.
            </div>
          </InfoCard>

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label>Nome impresso no cartão</Label>
              <Input
                placeholder='João da Silva'
                value={cardData.holderName}
                onChange={event =>
                  handleCardInputChange('holderName', event.target.value)
                }
                autoComplete='cc-name'
              />
              {errors.cardHolderName && (
                <ErrorMessage>{errors.cardHolderName}</ErrorMessage>
              )}
            </FieldGroup>

            <FieldGroup>
              <Label>Número do cartão</Label>
              <Input
                placeholder='4111 1111 1111 1111'
                value={cardData.number}
                onChange={event =>
                  handleCardInputChange('number', event.target.value)
                }
                autoComplete='cc-number'
                inputMode='numeric'
              />
              {errors.cardNumber && (
                <ErrorMessage>{errors.cardNumber}</ErrorMessage>
              )}
            </FieldGroup>

            <FieldRow>
              <Field>
                <Label>Validade (mês)</Label>
                <Input
                  placeholder='08'
                  value={cardData.expiryMonth}
                  onChange={event =>
                    handleCardInputChange('expiryMonth', event.target.value)
                  }
                  maxLength={2}
                  inputMode='numeric'
                  autoComplete='cc-exp-month'
                />
                {errors.expiryMonth && (
                  <ErrorMessage>{errors.expiryMonth}</ErrorMessage>
                )}
              </Field>

              <Field>
                <Label>Validade (ano)</Label>
                <Input
                  placeholder='29'
                  value={cardData.expiryYear}
                  onChange={event =>
                    handleCardInputChange('expiryYear', event.target.value)
                  }
                  maxLength={2}
                  inputMode='numeric'
                  autoComplete='cc-exp-year'
                />
                {errors.expiryYear && (
                  <ErrorMessage>{errors.expiryYear}</ErrorMessage>
                )}
              </Field>

              <Field>
                <Label>CVV</Label>
                <Input
                  placeholder='123'
                  value={cardData.ccv}
                  onChange={event =>
                    handleCardInputChange('ccv', event.target.value)
                  }
                  maxLength={4}
                  inputMode='numeric'
                  autoComplete='cc-csc'
                />
                {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
              </Field>
            </FieldRow>

            <FieldRow>
              <Field>
                <Label>Nome completo do titular</Label>
                <Input
                  placeholder='João da Silva'
                  value={holderData.name}
                  onChange={event =>
                    handleHolderInputChange('name', event.target.value)
                  }
                  autoComplete='name'
                />
                {errors.holderName && (
                  <ErrorMessage>{errors.holderName}</ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>E-mail do titular</Label>
                <Input
                  placeholder='joao.silva@example.com'
                  value={holderData.email}
                  onChange={event =>
                    handleHolderInputChange('email', event.target.value)
                  }
                  type='email'
                  autoComplete='email'
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </Field>
            </FieldRow>

            <FieldRow>
              <Field>
                <Label>CPF/CNPJ</Label>
                <Input
                  placeholder='123.456.789-01'
                  value={holderData.cpfCnpj}
                  onChange={event =>
                    handleHolderInputChange('cpfCnpj', event.target.value)
                  }
                  inputMode='numeric'
                />
                {errors.cpfCnpj && (
                  <ErrorMessage>{errors.cpfCnpj}</ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Celular</Label>
                <Input
                  placeholder='(48) 99999-9999'
                  value={holderData.mobilePhone}
                  onChange={event =>
                    handleHolderInputChange('mobilePhone', event.target.value)
                  }
                  inputMode='tel'
                  autoComplete='tel-national'
                />
                {errors.mobilePhone && (
                  <ErrorMessage>{errors.mobilePhone}</ErrorMessage>
                )}
              </Field>
            </FieldRow>

            <FieldRow>
              <Field>
                <Label>CEP</Label>
                <Input
                  placeholder='88000-000'
                  value={holderData.postalCode}
                  onChange={event =>
                    handleHolderInputChange('postalCode', event.target.value)
                  }
                  inputMode='numeric'
                  autoComplete='postal-code'
                />
                {errors.postalCode && (
                  <ErrorMessage>{errors.postalCode}</ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Número</Label>
                <Input
                  placeholder='123'
                  value={holderData.addressNumber}
                  onChange={event =>
                    handleHolderInputChange('addressNumber', event.target.value)
                  }
                  autoComplete='address-line2'
                />
                {errors.addressNumber && (
                  <ErrorMessage>{errors.addressNumber}</ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Complemento</Label>
                <Input
                  placeholder='Apto 101'
                  value={holderData.addressComplement}
                  onChange={event =>
                    handleHolderInputChange(
                      'addressComplement',
                      event.target.value
                    )
                  }
                  autoComplete='address-line3'
                />
              </Field>
              <Field>
                <Label>Telefone (opcional)</Label>
                <Input
                  placeholder='(48) 3333-3333'
                  value={holderData.phone}
                  onChange={event =>
                    handleHolderInputChange('phone', event.target.value)
                  }
                  inputMode='tel'
                />
                {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              </Field>
            </FieldRow>

            <Actions>
              <Button type='button' onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type='submit'
                $variant='primary'
                $loading={loading}
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Salvar Novo Cartão'}
              </Button>
            </Actions>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UpdatePaymentMethodModal;
