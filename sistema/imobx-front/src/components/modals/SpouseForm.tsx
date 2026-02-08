import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdExpandMore,
  MdExpandLess,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdDelete,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import type { Spouse } from '../../types/spouse';
import { maskPhoneAuto, maskCPF, maskRG, validateCPF } from '../../utils/masks';

interface SpouseFormProps {
  clientId: string;
  spouse?: Spouse | null;
  onSave: (spouseData: any) => Promise<void>;
  onDelete?: (spouseId: string) => Promise<void>;
}

const SpouseContainer = styled.div<{ $hasSpouse: boolean }>`
  border: 2px dashed
    ${props => (props.$hasSpouse ? '#10B981' : props.theme.colors.border)};
  border-radius: 20px;
  padding: 24px;
  background: ${props =>
    props.$hasSpouse ? '#F0FDF4' : props.theme.colors.background};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props =>
      props.$hasSpouse ? '#10B981' : props.theme.colors.primary};
  }
`;

const SpouseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  cursor: pointer;
  user-select: none;
`;

const SpouseHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SpouseTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Badge = styled.span`
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ExpandButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SpouseFormContent = styled.div<{ $isExpanded: boolean }>`
  display: ${props => (props.$isExpanded ? 'block' : 'none')};
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const IconWrapper = styled.div`
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.primary}10;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props => (props.$hasError ? '#DC2626' : props.theme.colors.border)};
  border-radius: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props => (props.$hasError ? '#DC2626' : props.theme.colors.border)};
  border-radius: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  font-weight: 500;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  margin-top: 6px;

  &::before {
    content: '⚠';
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primary}dd);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px ${props.theme.colors.primary}40;
    }
  `
      : props.$variant === 'danger'
        ? `
    background: #DC2626;
    color: white;
    border: none;
    
    &:hover {
      background: #B91C1C;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(220, 38, 38, 0.4);
    }
  `
        : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
  `}
`;

const SectionDivider = styled.div`
  margin: 24px 0 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const SectionLabel = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const SectionDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const SpouseForm: React.FC<SpouseFormProps> = ({
  clientId,
  spouse,
  onSave,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(!!spouse);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    rg: '',
    birthDate: '',
    email: '',
    phone: '',
    whatsapp: '',
    profession: '',
    companyName: '',
    jobPosition: '',
    monthlyIncome: '',
    jobStartDate: '',
    isCurrentlyWorking: true,
    isRetired: false,
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (spouse) {
      setFormData({
        name: spouse.name || '',
        cpf: spouse.cpf || '',
        rg: spouse.rg || '',
        birthDate: spouse.birthDate || '',
        email: spouse.email || '',
        phone: spouse.phone || '',
        whatsapp: spouse.whatsapp || '',
        profession: spouse.profession || '',
        companyName: spouse.companyName || '',
        jobPosition: spouse.jobPosition || '',
        monthlyIncome: spouse.monthlyIncome?.toString() || '',
        jobStartDate: spouse.jobStartDate || '',
        isCurrentlyWorking: spouse.isCurrentlyWorking ?? true,
        isRetired: spouse.isRetired ?? false,
        notes: spouse.notes || '',
      });
      setIsExpanded(true);
    }
  }, [spouse]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const dataToSave = {
        ...formData,
        monthlyIncome: formData.monthlyIncome
          ? parseFloat(formData.monthlyIncome.toString().replace(/\D/g, '')) /
            100
          : undefined,
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Erro ao salvar cônjuge:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!spouse?.id || !onDelete) return;

    if (window.confirm('Tem certeza que deseja remover o cônjuge?')) {
      try {
        await onDelete(spouse.id);
        setFormData({
          name: '',
          cpf: '',
          rg: '',
          birthDate: '',
          email: '',
          phone: '',
          whatsapp: '',
          profession: '',
          companyName: '',
          jobPosition: '',
          monthlyIncome: '',
          jobStartDate: '',
          isCurrentlyWorking: true,
          isRetired: false,
          notes: '',
        });
        setIsExpanded(false);
      } catch (error) {
        console.error('Erro ao deletar cônjuge:', error);
      }
    }
  };

  return (
    <SpouseContainer $hasSpouse={!!spouse}>
      <SpouseHeader onClick={() => setIsExpanded(!isExpanded)}>
        <SpouseHeaderLeft>
          <SpouseTitle>
            💑 Informações do Cônjuge
            {spouse && <Badge>Cadastrado</Badge>}
          </SpouseTitle>
        </SpouseHeaderLeft>
        <ExpandButton
          type='button'
          onClick={e => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <>
              Recolher <MdExpandLess size={20} />
            </>
          ) : (
            <>
              Expandir <MdExpandMore size={20} />
            </>
          )}
        </ExpandButton>
      </SpouseHeader>

      <SpouseFormContent $isExpanded={isExpanded}>
        <SectionDivider>
          <SectionLabel>Dados Pessoais</SectionLabel>
          <SectionDescription>
            Informações básicas do cônjuge
          </SectionDescription>
        </SectionDivider>

        <FormGroup>
          <Label>
            <IconWrapper>
              <MdPerson size={16} />
            </IconWrapper>
            Nome Completo *
          </Label>
          <Input
            type='text'
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder='Digite o nome completo...'
            $hasError={!!errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <GridContainer>
          <FormGroup>
            <Label>
              <IconWrapper>
                <MdPerson size={16} />
              </IconWrapper>
              CPF *
            </Label>
            <Input
              type='text'
              value={formData.cpf}
              onChange={e => handleInputChange('cpf', maskCPF(e.target.value))}
              placeholder='000.000.000-00'
              maxLength={14}
              $hasError={!!errors.cpf}
            />
            {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <MdPerson size={16} />
              </IconWrapper>
              RG
            </Label>
            <Input
              type='text'
              value={formData.rg}
              onChange={e => handleInputChange('rg', maskRG(e.target.value))}
              placeholder='00.000.000-0'
              maxLength={12}
            />
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>
              <IconWrapper>
                <MdPerson size={16} />
              </IconWrapper>
              Data de Nascimento
            </Label>
            <Input
              type='date'
              value={formData.birthDate}
              onChange={e => handleInputChange('birthDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <MdEmail size={16} />
              </IconWrapper>
              Email
            </Label>
            <Input
              type='email'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder='email@exemplo.com'
            />
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>
              <IconWrapper>
                <MdPhone size={16} />
              </IconWrapper>
              Telefone
            </Label>
            <Input
              type='tel'
              value={formData.phone}
              onChange={e =>
                handleInputChange('phone', maskPhoneAuto(e.target.value))
              }
              placeholder='(11) 99999-9999'
              maxLength={15}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <MdPhone size={16} />
              </IconWrapper>
              WhatsApp
            </Label>
            <Input
              type='tel'
              value={formData.whatsapp}
              onChange={e =>
                handleInputChange('whatsapp', maskPhoneAuto(e.target.value))
              }
              placeholder='(11) 99999-9999'
              maxLength={15}
            />
          </FormGroup>
        </GridContainer>

        <SectionDivider>
          <SectionLabel>Dados Profissionais</SectionLabel>
          <SectionDescription>
            Informações sobre trabalho e renda
          </SectionDescription>
        </SectionDivider>

        <GridContainer>
          <FormGroup>
            <Label>
              <IconWrapper>
                <MdBusiness size={16} />
              </IconWrapper>
              Profissão
            </Label>
            <Input
              type='text'
              value={formData.profession}
              onChange={e => handleInputChange('profession', e.target.value)}
              placeholder='Ex: Médico, Professor...'
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <MdBusiness size={16} />
              </IconWrapper>
              Empresa
            </Label>
            <Input
              type='text'
              value={formData.companyName}
              onChange={e => handleInputChange('companyName', e.target.value)}
              placeholder='Nome da empresa...'
            />
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>
              <IconWrapper>
                <MdBusiness size={16} />
              </IconWrapper>
              Cargo
            </Label>
            <Input
              type='text'
              value={formData.jobPosition}
              onChange={e => handleInputChange('jobPosition', e.target.value)}
              placeholder='Cargo/função...'
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <MdBusiness size={16} />
              </IconWrapper>
              Renda Mensal
            </Label>
            <NumericFormat
              customInput={Input}
              thousandSeparator='.'
              decimalSeparator=','
              prefix='R$ '
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              placeholder='R$ 0,00'
              value={formData.monthlyIncome}
              onValueChange={values => {
                handleInputChange('monthlyIncome', values.floatValue || '');
              }}
            />
          </FormGroup>
        </GridContainer>

        <GridContainer>
          <FormGroup>
            <Label>
              <IconWrapper>
                <MdBusiness size={16} />
              </IconWrapper>
              Data de Início
            </Label>
            <Input
              type='date'
              value={formData.jobStartDate}
              onChange={e => handleInputChange('jobStartDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <CheckboxGroup>
              <Checkbox
                type='checkbox'
                checked={formData.isCurrentlyWorking}
                onChange={e =>
                  handleInputChange('isCurrentlyWorking', e.target.checked)
                }
              />
              <label>Ainda está trabalhando</label>
            </CheckboxGroup>

            <CheckboxGroup>
              <Checkbox
                type='checkbox'
                checked={formData.isRetired}
                onChange={e => handleInputChange('isRetired', e.target.checked)}
              />
              <label>É aposentado(a)</label>
            </CheckboxGroup>
          </FormGroup>
        </GridContainer>

        <SectionDivider>
          <SectionLabel>Observações</SectionLabel>
          <SectionDescription>
            Informações adicionais sobre o cônjuge
          </SectionDescription>
        </SectionDivider>

        <FormGroup>
          <TextArea
            value={formData.notes}
            onChange={e => handleInputChange('notes', e.target.value)}
            placeholder='Observações adicionais...'
          />
        </FormGroup>

        <ButtonGroup>
          <Button
            type='button'
            $variant='primary'
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : spouse ? 'Atualizar' : 'Salvar'} Cônjuge
          </Button>
          {spouse && onDelete && (
            <Button type='button' $variant='danger' onClick={handleDelete}>
              <MdDelete size={18} />
              Remover Cônjuge
            </Button>
          )}
        </ButtonGroup>
      </SpouseFormContent>
    </SpouseContainer>
  );
};
