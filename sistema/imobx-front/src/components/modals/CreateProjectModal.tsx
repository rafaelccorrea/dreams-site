import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useProjects } from '../../hooks/useProjects';
import { useKanbanProjectLimit } from '../../hooks/useKanbanProjectLimit';
import { showSuccess, showError } from '../../utils/notifications';
import { useNavigate } from 'react-router-dom';
import {
  ModernModalOverlay,
  ModernModalContainer,
  ModernModalHeader,
  ModernModalHeaderContent,
  ModernModalCloseButton,
  ModernModalContent,
  ModernFormGroup,
  ModernFormLabel,
  ModernRequiredIndicator,
  ModernFormInput,
  ModernFormTextarea,
  ModernErrorMessage,
  ModernButton,
  ModernLoadingSpinner,
} from '../../styles/components/ModernModalStyles';
import {
  MdClose,
  MdAdd,
  MdDescription,
  MdCalendarToday,
  MdSave,
} from 'react-icons/md';

// Styled components modernos e limpos
const StyledModalContainer = styled(ModernModalContainer)`
  border-radius: 16px;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.5)'
      : '0 20px 60px rgba(0, 0, 0, 0.15)'};
  border: none;
  overflow: visible;
`;

const StyledHeader = styled(ModernModalHeader)`
  padding: 28px 32px;
  border-bottom: none;
  background: transparent;
  border-radius: 16px 16px 0 0;

  &::before {
    display: none;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
`;

const TitleText = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
`;

const SubtitleText = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

const StyledContent = styled(ModernModalContent)`
  padding: 0 32px 32px 32px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LimitCard = styled.div<{
  $isError: boolean;
  $isWarning: boolean;
}>`
  padding: 16px;
  border-radius: 12px;
  background: ${props =>
    props.$isError
      ? props.theme.colors.error + '10'
      : props.$isWarning
        ? props.theme.colors.warning + '10'
        : props.theme.colors.primary + '08'};
  border: 1px solid
    ${props =>
      props.$isError
        ? props.theme.colors.error + '30'
        : props.$isWarning
          ? props.theme.colors.warning + '30'
          : props.theme.colors.primary + '20'};
  margin-bottom: 8px;
`;

const LimitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const LimitLabel = styled.span<{
  $isError: boolean;
  $isWarning: boolean;
}>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props =>
    props.$isError
      ? props.theme.colors.error
      : props.$isWarning
        ? props.theme.colors.warning
        : props.theme.colors.primary};
`;

const LimitValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ProgressWrapper = styled.div`
  width: 100%;
  height: 6px;
  background: ${props => props.theme.colors.border};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{
  $isError: boolean;
  $isWarning: boolean;
  $percent: number;
}>`
  width: ${props => props.$percent}%;
  height: 100%;
  background: ${props =>
    props.$isError
      ? props.theme.colors.error
      : props.$isWarning
        ? props.theme.colors.warning
        : props.theme.colors.primary};
  transition: width 0.3s ease;
  border-radius: 3px;
`;

const LimitMessage = styled.p<{
  $isError: boolean;
  $isWarning: boolean;
}>`
  margin: 12px 0 0 0;
  font-size: 0.8125rem;
  color: ${props =>
    props.$isError ? props.theme.colors.error : props.theme.colors.warning};
  line-height: 1.5;
`;

const LimitLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const FormGroup = styled(ModernFormGroup)`
  margin-bottom: 0;
`;

const StyledLabel = styled(ModernFormLabel)`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const StyledInput = styled(ModernFormInput)`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid ${props => props.theme.colors.border};
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const StyledTextarea = styled(ModernFormTextarea)`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid ${props => props.theme.colors.border};
  font-size: 0.9375rem;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FooterActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const StyledButton = styled(ModernButton)`
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  min-width: 120px;
`;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  onProjectCreated?: (project: any) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  teamId,
  onProjectCreated,
}) => {
  const navigate = useNavigate();
  const { createProject } = useProjects(teamId);
  const { limitInfo, refresh: refreshLimit } = useKanbanProjectLimit();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do funil é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (formData.dueDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const dueDate = new Date(formData.dueDate);
      if (dueDate <= startDate) {
        newErrors.dueDate =
          'Data de vencimento deve ser posterior à data de início';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verificar limite antes de criar usando o novo campo canCreate
    if (limitInfo && limitInfo.limit !== -1 && limitInfo.canCreate === false) {
      const errorMessage =
        limitInfo.message ||
        'Limite de funis Kanban atingido. Compre mais funis ou atualize seu plano.';
      showError(errorMessage);
      const shouldBuyMore = window.confirm(
        'Limite de funis atingido. Deseja comprar mais funis?'
      );
      if (shouldBuyMore) {
        navigate('/subscriptions/addons?type=extra_kanban_projects');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const newProject = await createProject({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate || undefined,
        dueDate: formData.dueDate || undefined,
        teamId: teamId!,
      });

      showSuccess('Funil criado com sucesso!');

      // Recarregar informações de limite
      await refreshLimit();

      onProjectCreated?.(newProject);
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar funil:', error);

      // Tratar erro 403 (limite atingido)
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || error.message;
        showError(errorMessage);
        const shouldBuyMore = window.confirm(
          'Limite de funis atingido. Deseja comprar mais funis?'
        );
        if (shouldBuyMore) {
          navigate('/subscriptions/addons?type=extra_kanban_projects');
        }
      } else {
        showError(error.message || 'Erro ao criar funil');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isLimitError =
    limitInfo &&
    limitInfo.limit !== -1 &&
    (limitInfo.canCreate === false || limitInfo.remaining === 0);
  const isLimitWarning =
    limitInfo &&
    limitInfo.limit !== -1 &&
    limitInfo.isNearLimit &&
    limitInfo.remaining > 0;

  return (
    <ModernModalOverlay
      $isOpen={isOpen}
      onClick={handleClose}
      style={{ paddingTop: '60px', alignItems: 'flex-start' }}
    >
      <StyledModalContainer
        $isOpen={isOpen}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '600px',
          width: '90%',
          maxHeight: '85vh',
          marginTop: '20px',
        }}
      >
        <StyledHeader>
          <ModernModalHeaderContent>
            <div style={{ flex: 1 }}>
              <TitleContainer>
                <IconWrapper>
                  <MdAdd size={28} />
                </IconWrapper>
                <div>
                  <TitleText>Criar Novo Funil</TitleText>
                  <SubtitleText>
                    Configure seu funil de vendas e organize suas oportunidades
                  </SubtitleText>
                </div>
              </TitleContainer>
            </div>
            <ModernModalCloseButton
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <MdClose />
            </ModernModalCloseButton>
          </ModernModalHeaderContent>
        </StyledHeader>

        <StyledContent>
          <form onSubmit={handleSubmit}>
            <FormContainer>
              {/* Informações de limite */}
              {limitInfo && limitInfo.limit !== -1 && (
                <LimitCard
                  $isError={isLimitError || false}
                  $isWarning={isLimitWarning || false}
                >
                  <LimitHeader>
                    <LimitLabel
                      $isError={isLimitError || false}
                      $isWarning={isLimitWarning || false}
                    >
                      Funis: {limitInfo.current} / {limitInfo.limit}
                    </LimitLabel>
                    {limitInfo.remaining > 0 && (
                      <LimitValue>{limitInfo.remaining} restante(s)</LimitValue>
                    )}
                  </LimitHeader>
                  <ProgressWrapper>
                    <ProgressBar
                      $isError={isLimitError || false}
                      $isWarning={isLimitWarning || false}
                      $percent={Math.min(100, limitInfo.percentUsed)}
                    />
                  </ProgressWrapper>
                  {(limitInfo.canCreate === false ||
                    limitInfo.remaining === 0) && (
                    <LimitMessage $isError={true} $isWarning={false}>
                      {limitInfo.message || 'Limite atingido!'}{' '}
                      <LimitLink
                        href='/subscriptions/addons?type=extra_kanban_projects'
                        onClick={e => {
                          e.preventDefault();
                          navigate(
                            '/subscriptions/addons?type=extra_kanban_projects'
                          );
                        }}
                      >
                        Comprar mais funis
                      </LimitLink>
                    </LimitMessage>
                  )}
                  {limitInfo.isNearLimit && limitInfo.remaining > 0 && (
                    <LimitMessage $isError={false} $isWarning={true}>
                      Você está próximo do limite (
                      {Math.round(limitInfo.percentUsed)}% usado)
                    </LimitMessage>
                  )}
                </LimitCard>
              )}

              {/* Nome do Funil */}
              <FormGroup>
                <StyledLabel>
                  Nome do Funil
                  <ModernRequiredIndicator>*</ModernRequiredIndicator>
                </StyledLabel>
                <StyledInput
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ex: Funil de Vendas Q1 2024'
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <ModernErrorMessage>{errors.name}</ModernErrorMessage>
                )}
              </FormGroup>

              {/* Descrição */}
              <FormGroup>
                <StyledLabel>
                  <MdDescription
                    style={{
                      marginRight: '8px',
                      fontSize: '18px',
                      verticalAlign: 'middle',
                    }}
                  />
                  Descrição
                </StyledLabel>
                <StyledTextarea
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Descreva o objetivo do funil, metas ou informações relevantes...'
                  disabled={isSubmitting}
                  rows={4}
                />
                {errors.description && (
                  <ModernErrorMessage>{errors.description}</ModernErrorMessage>
                )}
              </FormGroup>

              {/* Datas */}
              <DateGrid>
                <FormGroup>
                  <StyledLabel>
                    <MdCalendarToday
                      style={{
                        marginRight: '8px',
                        fontSize: '18px',
                        verticalAlign: 'middle',
                      }}
                    />
                    Data de Início
                  </StyledLabel>
                  <StyledInput
                    type='date'
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.startDate}
                    onChange={e =>
                      handleInputChange('startDate', e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  {errors.startDate && (
                    <ModernErrorMessage>{errors.startDate}</ModernErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <StyledLabel>
                    <MdCalendarToday
                      style={{
                        marginRight: '8px',
                        fontSize: '18px',
                        verticalAlign: 'middle',
                      }}
                    />
                    Data de Vencimento
                  </StyledLabel>
                  <StyledInput
                    type='date'
                    min={
                      formData.startDate ||
                      new Date().toISOString().split('T')[0]
                    }
                    value={formData.dueDate}
                    onChange={e => handleInputChange('dueDate', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.dueDate && (
                    <ModernErrorMessage>{errors.dueDate}</ModernErrorMessage>
                  )}
                </FormGroup>
              </DateGrid>
            </FormContainer>

            <FooterActions>
              <StyledButton
                type='button'
                $variant='secondary'
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </StyledButton>

              <StyledButton
                type='submit'
                $variant='primary'
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (limitInfo?.limit !== -1 && limitInfo?.canCreate === false) ||
                  false
                }
              >
                {isSubmitting ? (
                  <>
                    <ModernLoadingSpinner
                      style={{
                        width: '16px',
                        height: '16px',
                        borderWidth: '2px',
                      }}
                    />
                    Criando...
                  </>
                ) : (
                  <>
                    <MdSave size={18} />
                    Criar Funil
                  </>
                )}
              </StyledButton>
            </FooterActions>
          </form>
        </StyledContent>
      </StyledModalContainer>
    </ModernModalOverlay>
  );
};

export default CreateProjectModal;
