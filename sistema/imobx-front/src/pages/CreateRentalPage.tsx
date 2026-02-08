import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { rentalService } from '@/services/rental.service';
import { useProperties } from '@/hooks/useProperties';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '@/utils/permissionContextualDependencies';
import type { CreateRentalRequest } from '@/types/rental.types';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdSave,
  MdPerson,
  MdHome,
  MdAttachMoney,
} from 'react-icons/md';
import {
  maskCPF,
  maskCNPJ,
  maskCelPhone,
  formatCurrency,
  getNumericValue,
  validateEmail,
} from '@/utils/masks';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
} from '@/styles/pages/PropertiesPageStyles';

export const CreateRentalPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { properties, getProperties } = useProperties();
  const { hasPermission } = usePermissionsContext();
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = React.useRef(false);

  // Data mínima para validação (hoje)
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<CreateRentalRequest>({
    tenantName: '',
    tenantDocument: '',
    tenantPhone: '',
    tenantEmail: '',
    startDate: '',
    endDate: '',
    monthlyValue: 0,
    dueDay: 5,
    propertyId: '',
    observations: '',
    depositValue: 0,
    autoGeneratePayments: true,
    sendBilletByEmail: false,
  });

  // Estados para os valores formatados
  const [displayValues, setDisplayValues] = useState({
    document: '',
    phone: '',
    monthlyValue: '',
    depositValue: '',
  });

  // Estado para validação de email
  const [emailError, setEmailError] = useState('');

  // Verificar permissões e carregar propriedades
  useEffect(() => {
    if (hasLoadedRef.current) return;

    const loadData = async () => {
      hasLoadedRef.current = true;
      // Verificar se pode vincular aluguel a propriedade
      const canLinkToProperty = canExecuteFunctionality(
        hasPermission,
        isEdit ? 'rental:update' : 'rental:create',
        isEdit ? 'alterar_propriedade_aluguel' : 'vincular_aluguel_propriedade'
      );

      // Só carregar propriedades se tiver permissão
      if (canLinkToProperty && (!properties || properties.length === 0)) {
        try {
          await getProperties({}, { page: 1, limit: 100 });
        } catch (error) {
          console.error('Erro ao carregar propriedades:', error);
          hasLoadedRef.current = false; // Permite tentar novamente
        }
      }
      setHasCheckedPermissions(true);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez ao montar

  useEffect(() => {
    if (isEdit && hasCheckedPermissions) {
      loadRental();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, hasCheckedPermissions]);

  const loadRental = async () => {
    if (!id) return;
    try {
      const rental = await rentalService.getById(id);
      setFormData({
        tenantName: rental.tenantName,
        tenantDocument: rental.tenantDocument,
        tenantPhone: rental.tenantPhone || '',
        tenantEmail: rental.tenantEmail || '',
        startDate: rental.startDate.split('T')[0],
        endDate: rental.endDate.split('T')[0],
        monthlyValue: rental.monthlyValue,
        dueDay: rental.dueDay,
        propertyId: rental.propertyId,
        observations: rental.observations || '',
        depositValue: rental.depositValue || 0,
        autoGeneratePayments: rental.autoGeneratePayments,
        sendBilletByEmail: false,
      });

      // Formatar valores para exibição
      const doc = rental.tenantDocument;
      const cleanDoc = doc.replace(/\D/g, '');
      setDisplayValues({
        document: cleanDoc.length === 11 ? maskCPF(doc) : maskCNPJ(doc),
        phone: rental.tenantPhone ? maskCelPhone(rental.tenantPhone) : '',
        monthlyValue: formatCurrency(String(rental.monthlyValue * 100)),
        depositValue: rental.depositValue
          ? formatCurrency(String(rental.depositValue * 100))
          : '',
      });
    } catch {
      toast.error('Erro ao carregar aluguel');
      navigate('/rentals');
    }
  };

  const handleDocumentChange = (value: string) => {
    // Remove tudo que não é alfanumérico
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');

    // Se tem letras, é CNPJ alfanumérico (independente do tamanho)
    const hasLetters = /[A-Za-z]/.test(cleaned);
    let formatted = '';

    if (hasLetters) {
      // CNPJ alfanumérico
      formatted = maskCNPJ(value);
    } else if (cleaned.length <= 11) {
      // CPF (só números, 11 dígitos)
      formatted = maskCPF(value);
    } else {
      // CNPJ numérico (só números, mais de 11 dígitos)
      formatted = maskCNPJ(value);
    }

    setDisplayValues(prev => ({ ...prev, document: formatted }));
    setFormData(prev => ({ ...prev, tenantDocument: cleaned }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = maskCelPhone(value);
    const cleanValue = value.replace(/\D/g, '');
    setDisplayValues(prev => ({ ...prev, phone: formatted }));
    setFormData(prev => ({ ...prev, tenantPhone: cleanValue }));
  };

  const handleMoneyChange = (
    value: string,
    field: 'monthlyValue' | 'depositValue'
  ) => {
    const formatted = formatCurrency(value);
    const numericValue = getNumericValue(formatted) / 100;

    setDisplayValues(prev => ({ ...prev, [field]: formatted }));
    setFormData(prev => ({ ...prev, [field]: numericValue }));
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, tenantEmail: value }));

    // Validar email apenas se não estiver vazio
    if (value && !validateEmail(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await rentalService.update(id, formData);
        toast.success('Aluguel atualizado com sucesso');
      } else {
        await rentalService.create(formData);
        toast.success('Aluguel criado com sucesso');
      }
      navigate('/rentals');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar aluguel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          {/* Header */}
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>
                {isEdit ? 'Editar Aluguel' : 'Novo Aluguel'}
              </PageTitle>
              <PageSubtitle>
                {isEdit
                  ? 'Atualize as informações do contrato de aluguel'
                  : 'Cadastre um novo contrato de aluguel'}
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/rentals')}>
              <MdArrowBack />
              Voltar
            </BackButton>
          </PageHeader>

          <FormCard onSubmit={handleSubmit}>
            {/* Dados do Inquilino */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPerson />
                </SectionIcon>
                <SectionTitle>Dados do Inquilino</SectionTitle>
              </SectionHeader>

              <FormGrid>
                <FormGroup>
                  <Label>
                    Nome Completo <Required>*</Required>
                  </Label>
                  <Input
                    required
                    placeholder='Digite o nome do inquilino'
                    value={formData.tenantName}
                    onChange={e =>
                      setFormData({ ...formData, tenantName: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    CPF/CNPJ <Required>*</Required>
                  </Label>
                  <Input
                    required
                    placeholder='000.000.000-00'
                    value={displayValues.document}
                    onChange={e => handleDocumentChange(e.target.value)}
                    maxLength={18}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Telefone</Label>
                  <Input
                    type='tel'
                    placeholder='(00) 00000-0000'
                    value={displayValues.phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type='email'
                    placeholder='email@exemplo.com'
                    value={formData.tenantEmail}
                    onChange={e => handleEmailChange(e.target.value)}
                    $hasError={!!emailError}
                  />
                  {emailError && <ErrorText>{emailError}</ErrorText>}
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Dados do Contrato */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdHome />
                </SectionIcon>
                <SectionTitle>Dados do Contrato</SectionTitle>
              </SectionHeader>

              <FormGrid>
                <FormGroup>
                  <Label>
                    Propriedade <Required>*</Required>
                  </Label>
                  <Select
                    required
                    value={formData.propertyId}
                    onChange={e =>
                      setFormData({ ...formData, propertyId: e.target.value })
                    }
                  >
                    <option value=''>Selecione uma propriedade</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>
                        {prop.title}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Data de Início <Required>*</Required>
                  </Label>
                  <Input
                    type='date'
                    required
                    min={isEdit ? undefined : today}
                    value={formData.startDate}
                    onChange={e =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  {!isEdit && (
                    <HintText>
                      Não é possível selecionar datas no passado
                    </HintText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    Data de Término <Required>*</Required>
                  </Label>
                  <Input
                    type='date'
                    required
                    min={formData.startDate || today}
                    value={formData.endDate}
                    onChange={e =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                  <HintText>Deve ser posterior à data de início</HintText>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Dia de Vencimento <Required>*</Required>
                  </Label>
                  <Input
                    type='number'
                    required
                    min='1'
                    max='31'
                    placeholder='5'
                    value={formData.dueDay}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        dueDay: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <HintText>
                    Dia do mês para vencimento das parcelas (1 a 31)
                  </HintText>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Valores */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdAttachMoney />
                </SectionIcon>
                <SectionTitle>Valores</SectionTitle>
              </SectionHeader>

              <FormGrid>
                <FormGroup>
                  <Label>
                    Valor Mensal <Required>*</Required>
                  </Label>
                  <InputWithPrefix>
                    <Prefix>R$</Prefix>
                    <InputMoney
                      required
                      placeholder='0,00'
                      value={displayValues.monthlyValue}
                      onChange={e =>
                        handleMoneyChange(e.target.value, 'monthlyValue')
                      }
                    />
                  </InputWithPrefix>
                </FormGroup>

                <FormGroup>
                  <Label>Valor do Depósito/Caução</Label>
                  <InputWithPrefix>
                    <Prefix>R$</Prefix>
                    <InputMoney
                      placeholder='0,00'
                      value={displayValues.depositValue}
                      onChange={e =>
                        handleMoneyChange(e.target.value, 'depositValue')
                      }
                    />
                  </InputWithPrefix>
                  <HintText>Valor pago como garantia (opcional)</HintText>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Observações e Opções */}
            <Section>
              <FormGroup>
                <Label>Observações</Label>
                <TextArea
                  rows={4}
                  placeholder='Informações adicionais sobre o contrato...'
                  value={formData.observations}
                  onChange={e =>
                    setFormData({ ...formData, observations: e.target.value })
                  }
                />
              </FormGroup>

              <CheckboxContainer>
                <CheckboxLabel>
                  <Checkbox
                    type='checkbox'
                    checked={formData.autoGeneratePayments}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        autoGeneratePayments: e.target.checked,
                      })
                    }
                  />
                  <CheckboxText>
                    <strong>Gerar pagamentos automaticamente</strong>
                    <CheckboxHint>
                      Criar automaticamente as parcelas mensais com base no
                      período do contrato
                    </CheckboxHint>
                  </CheckboxText>
                </CheckboxLabel>
              </CheckboxContainer>

              <CheckboxContainer>
                <CheckboxLabel>
                  <Checkbox
                    type='checkbox'
                    checked={formData.sendBilletByEmail}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        sendBilletByEmail: e.target.checked,
                      })
                    }
                  />
                  <CheckboxText>
                    <strong>Enviar boleto por email</strong>
                    <CheckboxHint>
                      Enviar automaticamente o boleto de pagamento para o email
                      do inquilino
                    </CheckboxHint>
                  </CheckboxText>
                </CheckboxLabel>
              </CheckboxContainer>
            </Section>

            {/* Ações */}
            <Actions>
              <CancelButton type='button' onClick={() => navigate('/rentals')}>
                Cancelar
              </CancelButton>
              <SaveButton type='submit' disabled={loading}>
                <MdSave />
                {loading
                  ? 'Salvando...'
                  : isEdit
                    ? 'Atualizar Aluguel'
                    : 'Criar Aluguel'}
              </SaveButton>
            </Actions>
          </FormCard>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

// Styled Components
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateX(-2px);
  }

  svg {
    font-size: 18px;
  }
`;

const FormCard = styled.form`
  /* Formulário sem card - campos soltos */
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: 10px;
  font-size: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Required = styled.span`
  color: ${props => props.theme.colors.error};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError
          ? props.theme.colors.error
          : props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const InputWithPrefix = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s;

  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Prefix = styled.span`
  padding: 12px 0 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

const InputMoney = styled.input`
  flex: 1;
  padding: 12px 16px 12px 8px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: none;
  font-size: 14px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  option {
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const HintText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: -4px;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.error};
  margin-top: -4px;
`;

const CheckboxContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
`;

const CheckboxHint = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const CancelButton = styled.button`
  padding: 14px 28px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}20;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 18px;
  }
`;

export default CreateRentalPage;
