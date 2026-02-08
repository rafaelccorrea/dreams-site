import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Layout } from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { goalsApi } from '../services/goalsApi';
import { useUsers } from '../hooks/useUsers';
import { useTeams } from '../hooks/useTeams';
import { useCompany } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import { EditGoalShimmer } from '../components/shimmer/EditGoalShimmer';
import type {
  GoalType,
  GoalPeriod,
  GoalScope,
  UpdateGoalDTO,
  Goal,
} from '../types/goal';
import {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
  GOAL_COLORS,
  GOAL_ICONS,
} from '../types/goal';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  FormContainer,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  FieldContainer,
  FieldLabel,
  RequiredIndicator,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  RowContainer,
  FormActions,
  Button,
  ColorPicker,
  ColorOption,
  IconPicker,
  IconOption,
  LoadingSpinner,
} from '../styles/pages/GoalFormPageStyles';

interface GoalFormData {
  title: string;
  description: string;
  targetValue: number;
  status: string;
  isActive: boolean;
  color: string;
  icon: string;
}

const EditGoalPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingGoal, setLoadingGoal] = useState(true);
  const [goal, setGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    targetValue: 0,
    status: 'active',
    isActive: true,
    color: GOAL_COLORS[0],
    icon: GOAL_ICONS[0],
  });

  // Carregar meta ao montar
  useEffect(() => {
    if (id) {
      loadGoal();
    }
  }, [id]);

  const loadGoal = async () => {
    setLoadingGoal(true);
    try {
      const goalData: Goal = await goalsApi.getGoalById(id!);
      setGoal(goalData);

      setFormData({
        title: goalData.title,
        description: goalData.description || '',
        targetValue: goalData.targetValue,
        status: goalData.status,
        isActive: goalData.isActive,
        color: goalData.color || GOAL_COLORS[0],
        icon: goalData.icon || GOAL_ICONS[0],
      });
    } catch (error: any) {
      console.error('Erro ao carregar meta:', error);
      toast.error('Erro ao carregar meta');
      navigate('/goals');
    } finally {
      setLoadingGoal(false);
    }
  };

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

    setLoading(true);

    try {
      const updateData: UpdateGoalDTO = {
        title: formData.title,
        description: formData.description,
        targetValue: formData.targetValue,
        status: formData.status as any,
        isActive: formData.isActive,
        color: formData.color,
        icon: formData.icon,
      };

      await goalsApi.updateGoal(id!, updateData);

      toast.success('Meta atualizada com sucesso!');
      navigate('/goals');
    } catch (error: any) {
      console.error('Erro ao atualizar meta:', error);
      toast.error(error.message || 'Erro ao atualizar meta');
    } finally {
      setLoading(false);
    }
  };

  if (loadingGoal) {
    return (
      <Layout>
        <EditGoalShimmer />
      </Layout>
    );
  }

  if (!goal) {
    return null;
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Editar Meta</PageTitle>
              <PageSubtitle>Atualize as informações da meta</PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/goals')}>
              <MdArrowBack />
              Voltar
            </BackButton>
          </PageHeader>

          <FormContainer onSubmit={handleSubmit}>
            {/* Informações da Meta (apenas leitura) */}
            <Section>
              <SectionHeader>
                <SectionTitle>ℹ️ Informações da Meta</SectionTitle>
                <SectionDescription>
                  Tipo, período e escopo não podem ser alterados
                </SectionDescription>
              </SectionHeader>

              <RowContainer>
                <FieldContainer>
                  <FieldLabel>Tipo</FieldLabel>
                  <FieldInput
                    type='text'
                    value={GOAL_TYPE_LABELS[goal.type]}
                    disabled
                    style={{ background: '#374151', cursor: 'not-allowed' }}
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Período</FieldLabel>
                  <FieldInput
                    type='text'
                    value={GOAL_PERIOD_LABELS[goal.period]}
                    disabled
                    style={{ background: '#374151', cursor: 'not-allowed' }}
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Escopo</FieldLabel>
                  <FieldInput
                    type='text'
                    value={GOAL_SCOPE_LABELS[goal.scope]}
                    disabled
                    style={{ background: '#374151', cursor: 'not-allowed' }}
                  />
                </FieldContainer>
              </RowContainer>
            </Section>

            {/* Informações Editáveis */}
            <Section>
              <SectionHeader>
                <SectionTitle>📋 Informações Básicas</SectionTitle>
                <SectionDescription>
                  Atualize o título e descrição
                </SectionDescription>
              </SectionHeader>

              <FieldContainer>
                <FieldLabel>
                  Título da Meta <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder='Ex: Meta de Vendas Novembro 2025'
                  required
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Descrição</FieldLabel>
                <FieldTextarea
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Descreva os objetivos e detalhes desta meta...'
                  rows={3}
                />
              </FieldContainer>
            </Section>

            {/* Valores */}
            <Section>
              <SectionHeader>
                <SectionTitle>💰 Valor Alvo</SectionTitle>
                <SectionDescription>Ajuste o valor da meta</SectionDescription>
              </SectionHeader>

              <FieldContainer>
                <FieldLabel>
                  Valor Alvo <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
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

              <RowContainer>
                <FieldContainer>
                  <FieldLabel>Status</FieldLabel>
                  <FieldSelect
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                  >
                    <option value='draft'>Rascunho</option>
                    <option value='active'>Ativa</option>
                    <option value='completed'>Completada</option>
                    <option value='failed'>Falhou</option>
                    <option value='cancelled'>Cancelada</option>
                  </FieldSelect>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Ativa</FieldLabel>
                  <FieldSelect
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={e =>
                      handleInputChange('isActive', e.target.value === 'true')
                    }
                  >
                    <option value='true'>Sim</option>
                    <option value='false'>Não</option>
                  </FieldSelect>
                </FieldContainer>
              </RowContainer>
            </Section>

            {/* Personalização */}
            <Section>
              <SectionHeader>
                <SectionTitle>🎨 Personalização</SectionTitle>
                <SectionDescription>
                  Escolha cor e ícone para a meta
                </SectionDescription>
              </SectionHeader>

              <FieldContainer>
                <FieldLabel>Cor da Meta</FieldLabel>
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
                <FieldLabel>Ícone da Meta</FieldLabel>
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
            </Section>

            {/* Ações do Formulário */}
            <FormActions>
              <Button type='submit' $variant='primary' disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Salvando...
                  </>
                ) : (
                  <>
                    <MdSave />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </FormActions>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default EditGoalPage;
