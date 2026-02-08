import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { Layout } from '@/components/layout/Layout';
import { PermissionButton } from '@/components/common/PermissionButton';
import { useRewardManagement } from '@/hooks/useRewards';
import {
  RewardCategory,
  type CreateRewardRequest,
} from '@/types/rewards.types';
import { getCategoryLabel, getDefaultIcon } from '@/utils/rewards';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  ContentWrapper,
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
  Hint,
  FormActions,
  Button,
  PreviewSection,
  PreviewCard,
  PreviewHeader,
  PreviewTitle,
  PreviewSubtitle,
  PreviewContent,
  LoadingSpinner,
} from '@/styles/pages/RewardFormPageStyles';
import styled from 'styled-components';

export const CreateRewardPage: React.FC = () => {
  const navigate = useNavigate();
  const { createReward } = useRewardManagement();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: RewardCategory.MONETARY,
    pointsCost: 0,
    monetaryValue: 0,
    icon: '',
    stockQuantity: 0,
    displayOrder: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateRewardRequest = {
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category,
      pointsCost: formData.pointsCost,
      monetaryValue:
        formData.monetaryValue > 0 ? formData.monetaryValue : undefined,
      icon: formData.icon || getDefaultIcon(formData.category),
      stockQuantity:
        formData.stockQuantity > 0 ? formData.stockQuantity : undefined,
      displayOrder: formData.displayOrder,
    };

    setSubmitting(true);
    try {
      const result = await createReward(data);
      if (result) {
        navigate('/rewards/manage');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          {/* Header */}
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Criar Novo Prêmio</PageTitle>
              <PageSubtitle>
                Adicione um novo prêmio ao catálogo de resgates
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/rewards/manage')}>
              <MdArrowBack />
              Voltar
            </BackButton>
          </PageHeader>

          <ContentWrapper>
            {/* Formulário */}
            <FormContainer onSubmit={handleSubmit}>
              {/* Seção: Informações Básicas */}
              <Section>
                <SectionHeader>
                  <SectionTitle>Informações Básicas</SectionTitle>
                  <SectionDescription>
                    Dados principais do prêmio
                  </SectionDescription>
                </SectionHeader>

                <FieldContainer>
                  <FieldLabel>
                    Nome do Prêmio
                    <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldInput
                    type='text'
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder='Ex: Vale-Compras R$ 100'
                    required
                    disabled={submitting}
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Descrição</FieldLabel>
                  <FieldTextarea
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder='Descreva o prêmio, condições de uso, etc...'
                    rows={4}
                    disabled={submitting}
                  />
                </FieldContainer>

                <RowContainer>
                  <FieldContainer>
                    <FieldLabel>
                      Categoria
                      <RequiredIndicator>*</RequiredIndicator>
                    </FieldLabel>
                    <FieldSelect
                      value={formData.category}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          category: e.target.value as RewardCategory,
                        })
                      }
                      required
                      disabled={submitting}
                    >
                      {Object.values(RewardCategory).map(cat => (
                        <option key={cat} value={cat}>
                          {getCategoryLabel(cat)}
                        </option>
                      ))}
                    </FieldSelect>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel>Ícone (emoji)</FieldLabel>
                    <FieldInput
                      type='text'
                      value={formData.icon}
                      onChange={e =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      placeholder='💰'
                      maxLength={2}
                      disabled={submitting}
                    />
                    <Hint>Deixe vazio para usar ícone padrão da categoria</Hint>
                  </FieldContainer>
                </RowContainer>
              </Section>

              {/* Seção: Valores */}
              <Section>
                <SectionHeader>
                  <SectionTitle>Valores</SectionTitle>
                  <SectionDescription>
                    Custo em pontos e valor monetário
                  </SectionDescription>
                </SectionHeader>

                <RowContainer>
                  <FieldContainer>
                    <FieldLabel>
                      Custo em Pontos
                      <RequiredIndicator>*</RequiredIndicator>
                    </FieldLabel>
                    <NumericFormat
                      customInput={FieldInput}
                      value={formData.pointsCost}
                      onValueChange={values =>
                        setFormData({
                          ...formData,
                          pointsCost: values.floatValue || 0,
                        })
                      }
                      placeholder='500'
                      thousandSeparator='.'
                      decimalSeparator=','
                      allowNegative={false}
                      decimalScale={0}
                      disabled={submitting}
                    />
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel>Valor Monetário (R$)</FieldLabel>
                    <NumericFormat
                      customInput={FieldInput}
                      value={formData.monetaryValue}
                      onValueChange={values =>
                        setFormData({
                          ...formData,
                          monetaryValue: values.floatValue || 0,
                        })
                      }
                      placeholder='100,00'
                      prefix='R$ '
                      thousandSeparator='.'
                      decimalSeparator=','
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      disabled={submitting}
                    />
                    <Hint>Apenas para prêmios monetários</Hint>
                  </FieldContainer>
                </RowContainer>
              </Section>

              {/* Seção: Controle */}
              <Section>
                <SectionHeader>
                  <SectionTitle>Controle de Estoque</SectionTitle>
                  <SectionDescription>
                    Gerenciar disponibilidade e exibição
                  </SectionDescription>
                </SectionHeader>

                <RowContainer>
                  <FieldContainer>
                    <FieldLabel>Quantidade em Estoque</FieldLabel>
                    <NumericFormat
                      customInput={FieldInput}
                      value={formData.stockQuantity || ''}
                      onValueChange={values =>
                        setFormData({
                          ...formData,
                          stockQuantity: values.floatValue || 0,
                        })
                      }
                      placeholder='Deixe vazio para ilimitado'
                      thousandSeparator='.'
                      decimalSeparator=','
                      allowNegative={false}
                      decimalScale={0}
                      disabled={submitting}
                    />
                    <Hint>Deixe vazio para estoque ilimitado</Hint>
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabel>Ordem de Exibição</FieldLabel>
                    <NumericFormat
                      customInput={FieldInput}
                      value={formData.displayOrder}
                      onValueChange={values =>
                        setFormData({
                          ...formData,
                          displayOrder: values.floatValue || 0,
                        })
                      }
                      placeholder='0'
                      allowNegative={false}
                      decimalScale={0}
                      disabled={submitting}
                    />
                    <Hint>Menor número aparece primeiro no catálogo</Hint>
                  </FieldContainer>
                </RowContainer>
              </Section>

              {/* Botões */}
              <FormActions>
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={() => navigate('/rewards/manage')}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <PermissionButton
                  type='submit'
                  permission='reward:create'
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner />
                      Criando...
                    </>
                  ) : (
                    <>
                      <MdSave />
                      Criar Prêmio
                    </>
                  )}
                </PermissionButton>
              </FormActions>
            </FormContainer>

            {/* Preview */}
            <PreviewSection>
              <PreviewCard>
                <PreviewHeader>
                  <PreviewTitle>Pré-visualização</PreviewTitle>
                  <PreviewSubtitle>Como aparecerá no catálogo</PreviewSubtitle>
                </PreviewHeader>
                <PreviewContent>
                  <PreviewRewardCard>
                    <PreviewImageArea>
                      <PreviewIcon>
                        {formData.icon || getDefaultIcon(formData.category)}
                      </PreviewIcon>
                    </PreviewImageArea>
                    <PreviewCardContent>
                      <PreviewName>
                        {formData.name || 'Nome do Prêmio'}
                      </PreviewName>
                      <PreviewDescription>
                        {formData.description || 'Descrição do prêmio...'}
                      </PreviewDescription>
                      {formData.monetaryValue > 0 && (
                        <PreviewMoney>
                          💵 Valor:{' '}
                          {formData.monetaryValue.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </PreviewMoney>
                      )}
                      <PreviewCost>
                        💎 {formData.pointsCost.toLocaleString('pt-BR')} pontos
                      </PreviewCost>
                      {formData.stockQuantity > 0 && (
                        <PreviewStock>
                          📦 {formData.stockQuantity.toLocaleString('pt-BR')}{' '}
                          disponíveis
                        </PreviewStock>
                      )}
                      <PreviewButton>🎁 Resgatar</PreviewButton>
                    </PreviewCardContent>
                  </PreviewRewardCard>

                  <PreviewInfo>
                    <InfoItem>
                      <InfoLabel>Categoria:</InfoLabel>
                      <InfoValue>
                        {getCategoryLabel(formData.category)}
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Estoque:</InfoLabel>
                      <InfoValue>
                        {formData.stockQuantity > 0
                          ? `${formData.stockQuantity.toLocaleString('pt-BR')} unidades`
                          : '♾️ Ilimitado'}
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Ordem:</InfoLabel>
                      <InfoValue>{formData.displayOrder}</InfoValue>
                    </InfoItem>
                  </PreviewInfo>
                </PreviewContent>
              </PreviewCard>
            </PreviewSection>
          </ContentWrapper>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

// Styled components específicos do preview (não estão no arquivo compartilhado)
const PreviewRewardCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const PreviewImageArea = styled.div`
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewIcon = styled.div`
  font-size: 4rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const PreviewCardContent = styled.div`
  padding: 16px;
`;

const PreviewName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const PreviewDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 0.75rem;
  min-height: 2.5rem;
`;

const PreviewMoney = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 0.5rem;
`;

const PreviewCost = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const PreviewStock = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const PreviewButton = styled.div`
  width: 100%;
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
`;

const PreviewInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

export default CreateRewardPage;
