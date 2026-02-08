import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave, MdInfoOutline } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Layout } from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { goalsApi } from '../services/goalsApi';
import { useUsers } from '../hooks/useUsers';
import { useTeams } from '../hooks/useTeams';
import { useCompany } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import type {
  GoalType,
  GoalPeriod,
  GoalScope,
  CreateGoalDTO,
} from '../types/goal';
import {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
  GOAL_COLORS,
  GOAL_ICONS,
} from '../types/goal';
import {
  FieldContainer,
  RequiredIndicator,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  Button,
  ColorPicker,
  ColorOption,
  IconPicker,
  IconOption,
  LoadingSpinner,
} from '../styles/pages/GoalFormPageStyles';
import styled from 'styled-components';

interface GoalFormData {
  title: string;
  description: string;
  type: GoalType;
  period: GoalPeriod;
  scope: GoalScope;
  targetValue: number;
  startDate: string;
  endDate: string;
  color: string;
  icon: string;
  userId?: string;
  teamId?: string;
  companyId?: string;
}

const NewGoalPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { users, getUsers } = useUsers();
  const { teams, refreshTeams } = useTeams();
  const { companies } = useCompany();
  const { getCurrentUser } = useAuth();

  const currentUser = getCurrentUser();
  const isAdminOrMaster =
    currentUser?.role === 'admin' || currentUser?.role === 'master';
  const hasMultipleCompanies = companies.length > 1;

  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    type: 'sales_value',
    period: 'monthly',
    scope: 'company',
    targetValue: 0,
    startDate: '',
    endDate: '',
    color: GOAL_COLORS[0],
    icon: GOAL_ICONS[0],
  });

  // Carregar usuários e equipes ao montar
  useEffect(() => {
    getUsers({ limit: 1000 });
    refreshTeams();
  }, [getUsers, refreshTeams]);

  const handleInputChange = (field: keyof GoalFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (formData.targetValue <= 0) {
      toast.error('Valor alvo deve ser maior que zero');
      return;
    }

    // Datas são opcionais - o backend calcula automaticamente se não informadas

    setLoading(true);

    try {
      const createData: CreateGoalDTO = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        period: formData.period,
        scope: formData.scope,
        targetValue: formData.targetValue,
        ...(formData.startDate && { startDate: formData.startDate }),
        ...(formData.endDate && { endDate: formData.endDate }),
        ...(formData.userId && { userId: formData.userId }),
        ...(formData.teamId && { teamId: formData.teamId }),
        color: formData.color,
        icon: formData.icon,
      };

      await goalsApi.createGoal(createData);

      toast.success('Meta criada com sucesso!');
      navigate('/goals');
    } catch (error: any) {
      console.error('Erro ao criar meta:', error);
      toast.error(error.message || 'Erro ao criar meta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>Nova Meta</SimpleTitle>
            <SimpleSubtitle>
              Preencha os dados para criar uma nova meta
            </SimpleSubtitle>
          </div>
          <SimpleBackButton onClick={() => navigate('/goals')}>
            <MdArrowBack />
            Voltar
          </SimpleBackButton>
        </SimpleHeader>

        <form onSubmit={handleSubmit}>
          <SimpleFormGrid>
            <FieldContainer>
              <FieldLabelWithTooltip>
                Título da Meta <RequiredIndicator>*</RequiredIndicator>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Nome exibido em dashboards e relatórios para identificar a
                    meta.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldInput
                type='text'
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder='Ex: Meta de Vendas Novembro 2025'
                required
              />
            </FieldContainer>

            <ResponsiveRow>
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Tipo da Meta <RequiredIndicator>*</RequiredIndicator>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Define qual indicador será acompanhado (valor de vendas,
                      quantidade, tarefas...).
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldSelect
                  value={formData.type}
                  onChange={e =>
                    handleInputChange('type', e.target.value as GoalType)
                  }
                  required
                >
                  {Object.entries(GOAL_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </FieldSelect>
              </FieldContainer>

              <FieldContainer>
                <FieldLabelWithTooltip>
                  Período <RequiredIndicator>*</RequiredIndicator>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Determina a recorrência da meta (diária, semanal,
                      mensal...).
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldSelect
                  value={formData.period}
                  onChange={e =>
                    handleInputChange('period', e.target.value as GoalPeriod)
                  }
                  required
                >
                  {Object.entries(GOAL_PERIOD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </FieldSelect>
              </FieldContainer>

              <FieldContainer>
                <FieldLabelWithTooltip>
                  Escopo <RequiredIndicator>*</RequiredIndicator>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Escolha se a meta é para a empresa, equipe específica ou
                      corretor individual.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldSelect
                  value={formData.scope}
                  onChange={e => {
                    const newScope = e.target.value as GoalScope;
                    setFormData(prev => ({
                      ...prev,
                      scope: newScope,
                      userId: undefined,
                      teamId: undefined,
                      companyId: undefined,
                    }));
                  }}
                  required
                >
                  {Object.entries(GOAL_SCOPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </FieldSelect>
              </FieldContainer>
            </ResponsiveRow>

            {formData.scope === 'company' &&
              isAdminOrMaster &&
              hasMultipleCompanies && (
                <FieldContainer>
                  <FieldLabelWithTooltip>
                    Empresa <RequiredIndicator>*</RequiredIndicator>
                    <TooltipWrapper>
                      <TooltipIcon />
                      <TooltipContent>
                        Selecione em qual empresa a meta será aplicada.
                      </TooltipContent>
                    </TooltipWrapper>
                  </FieldLabelWithTooltip>
                  <FieldSelect
                    value={formData.companyId || ''}
                    onChange={e =>
                      handleInputChange('companyId', e.target.value)
                    }
                    required
                  >
                    <option value=''>Selecione uma empresa...</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </FieldSelect>
                </FieldContainer>
              )}

            {formData.scope === 'team' && (
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Equipe <RequiredIndicator>*</RequiredIndicator>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Escolha a equipe responsável por atingir os resultados.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldSelect
                  value={formData.teamId || ''}
                  onChange={e => handleInputChange('teamId', e.target.value)}
                  required
                >
                  <option value=''>Selecione uma equipe...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </FieldSelect>
              </FieldContainer>
            )}

            {formData.scope === 'user' && (
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Corretor <RequiredIndicator>*</RequiredIndicator>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Defina o corretor responsável por cumprir esta meta.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldSelect
                  value={formData.userId || ''}
                  onChange={e => handleInputChange('userId', e.target.value)}
                  required
                >
                  <option value=''>Selecione um corretor...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} {user.email && `(${user.email})`}
                    </option>
                  ))}
                </FieldSelect>
              </FieldContainer>
            )}

            <FieldContainer>
              <FieldLabelWithTooltip>
                Descrição
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Adicione observações, critérios de sucesso ou passos a serem
                    seguidos.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldTextarea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Descreva os objetivos e detalhes desta meta...'
                rows={3}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Valor Alvo <RequiredIndicator>*</RequiredIndicator>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Meta numérica que deve ser atingida (ex.: faturamento,
                    número de contratos).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <NumericFormat
                customInput={FieldInput}
                value={formData.targetValue}
                onValueChange={values =>
                  handleInputChange('targetValue', values.floatValue || 0)
                }
                placeholder='Ex: 1.000.000,00'
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                prefix='R$ '
                allowNegative={false}
                required
              />
            </FieldContainer>

            <ResponsiveRow>
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Data de Início
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Preencha quando quiser controlar a meta a partir de uma
                      data específica.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldInput
                  type='date'
                  value={formData.startDate}
                  onChange={e => handleInputChange('startDate', e.target.value)}
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabelWithTooltip>
                  Data de Término
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Use para definir uma data final. Deixe em branco para
                      cálculo automático conforme período.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <FieldInput
                  type='date'
                  value={formData.endDate}
                  onChange={e => handleInputChange('endDate', e.target.value)}
                />
              </FieldContainer>
            </ResponsiveRow>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Cor da Meta
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Personaliza a cor exibida nos cards e gráficos.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <ColorPicker>
                {GOAL_COLORS.map(color => (
                  <ColorOption
                    key={color}
                    type='button'
                    $color={color}
                    $selected={formData.color === color}
                    onClick={e => {
                      e.preventDefault();
                      handleInputChange('color', color);
                    }}
                  />
                ))}
              </ColorPicker>
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Ícone da Meta
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Ícone sugerido nos painéis para ilustrar a meta.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <IconPicker>
                {GOAL_ICONS.map(icon => (
                  <IconOption
                    key={icon}
                    type='button'
                    $selected={formData.icon === icon}
                    onClick={e => {
                      e.preventDefault();
                      handleInputChange('icon', icon);
                    }}
                  >
                    {icon}
                  </IconOption>
                ))}
              </IconPicker>
            </FieldContainer>
          </SimpleFormGrid>

          <ButtonsRow>
            <Button
              type='button'
              $variant='secondary'
              onClick={() => navigate('/goals')}
            >
              Cancelar
            </Button>
            <Button type='submit' $variant='primary' disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Salvando...
                </>
              ) : (
                <>
                  <MdSave />
                  Salvar Meta
                </>
              )}
            </Button>
          </ButtonsRow>
        </form>
      </SimplePageContainer>
    </Layout>
  );
};

const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const FieldLabelWithTooltip = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: visible;
  z-index: 1;
`;

const TooltipIcon = styled(MdInfoOutline)`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;
`;

const TooltipContent = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.75rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  z-index: 200000;
  pointer-events: none;

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export default NewGoalPage;
