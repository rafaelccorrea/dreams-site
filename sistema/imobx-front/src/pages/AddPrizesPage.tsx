import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { competitionService } from '../services/competition.service';
import { usePrizes } from '../hooks/usePrizes';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdAdd,
  MdDelete,
  MdCardGiftcard,
  MdEmojiEvents,
} from 'react-icons/md';
import { formatCurrency, getNumericValue } from '../utils/masks';
import type { Competition } from '../types/competition.types';

export const AddPrizesPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const { createPrize, deletePrize } = usePrizes();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    position: '1',
    name: '',
    description: '',
    value: '',
  });

  useEffect(() => {
    if (competitionId) {
      loadCompetition();
    }
  }, [competitionId]);

  const loadCompetition = async () => {
    if (!competitionId) return;

    try {
      const data = await competitionService.findById(competitionId);
      setCompetition(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao carregar competição'
      );
      console.error(error);
    }
  };

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!competitionId || !formData.name) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    // Validar posição única
    const existingPrizes = competition?.prizes || [];
    if (existingPrizes.some(p => p.position === parseInt(formData.position))) {
      toast.error(`Já existe um prêmio para a posição ${formData.position}!`);
      return;
    }

    setLoading(true);

    try {
      const prizeData = {
        competitionId,
        position: parseInt(formData.position),
        name: formData.name,
        description: formData.description || undefined,
        value: formData.value ? getNumericValue(formData.value) : undefined,
      };

      await createPrize(prizeData);

      toast.success('Prêmio adicionado com sucesso!');
      setFormData({ position: '1', name: '', description: '', value: '' });
      setShowAddForm(false);

      // Recarregar competição para atualizar a lista de prêmios
      loadCompetition();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar prêmio');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePrize = async (prizeId: string) => {
    if (!confirm('Remover este prêmio?')) return;

    try {
      await deletePrize(prizeId);
      toast.success('Prêmio removido!');
      loadCompetition();
    } catch (error: any) {
      toast.error('Erro ao remover prêmio');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate('/competitions');
  };

  if (!competition) {
    return (
      <Layout>
        <Container>
          <LoadingState>Carregando competição...</LoadingState>
        </Container>
      </Layout>
    );
  }

  const prizes = competition.prizes || [];
  const nextPosition =
    prizes.length > 0 ? Math.max(...prizes.map(p => p.position)) + 1 : 1;

  return (
    <Layout>
      <Container>
        <Header>
          <BackButton onClick={handleBack}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>

          <TitleContainer>
            <Title>Prêmios da Competição</Title>
            <Subtitle>{competition.name}</Subtitle>
          </TitleContainer>
        </Header>

        {/* Informações da Competição */}
        <CompetitionInfo>
          <CompetitionHeader>
            <CompetitionIcon>
              <MdEmojiEvents />
            </CompetitionIcon>
            <CompetitionDetails>
              <CompetitionName>{competition.name}</CompetitionName>
              <CompetitionMeta>
                <MetaItem>
                  <MetaLabel>Tipo:</MetaLabel>
                  <MetaValue>
                    {competition.type === 'individual'
                      ? 'Individual'
                      : competition.type === 'team'
                        ? 'Por Equipes'
                        : 'Misto'}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Status:</MetaLabel>
                  <MetaValue>{competition.status}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Período:</MetaLabel>
                  <MetaValue>
                    {new Date(competition.startDate).toLocaleDateString(
                      'pt-BR'
                    )}{' '}
                    -{' '}
                    {new Date(competition.endDate).toLocaleDateString('pt-BR')}
                  </MetaValue>
                </MetaItem>
              </CompetitionMeta>
            </CompetitionDetails>
          </CompetitionHeader>

          {competition.description && (
            <CompetitionDescription>
              {competition.description}
            </CompetitionDescription>
          )}
        </CompetitionInfo>

        {/* Lista de Prêmios Existentes */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <MdCardGiftcard />
              Prêmios Cadastrados ({prizes.length})
            </SectionTitle>
            <AddButton onClick={() => setShowAddForm(!showAddForm)}>
              <MdAdd />
              Adicionar Prêmio
            </AddButton>
          </SectionHeader>

          {prizes.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🎁</EmptyIcon>
              <EmptyTitle>Nenhum prêmio cadastrado</EmptyTitle>
              <EmptyText>
                Adicione prêmios para motivar os participantes!
              </EmptyText>
            </EmptyState>
          ) : (
            <PrizesList>
              {prizes
                .sort((a, b) => a.position - b.position)
                .map(prize => (
                  <PrizeItem key={prize.id}>
                    <PrizePosition>{prize.position}º Lugar</PrizePosition>
                    <PrizeInfo>
                      <PrizeName>{prize.name}</PrizeName>
                      {prize.description && (
                        <PrizeDescription>{prize.description}</PrizeDescription>
                      )}
                      {prize.value && prize.value > 0 && (
                        <PrizeValue>
                          R${' '}
                          {prize.value.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </PrizeValue>
                      )}
                    </PrizeInfo>
                    <PrizeActions>
                      <RemoveButton onClick={() => handleRemovePrize(prize.id)}>
                        <MdDelete />
                      </RemoveButton>
                    </PrizeActions>
                  </PrizeItem>
                ))}
            </PrizesList>
          )}
        </Section>

        {/* Formulário para Adicionar Novo Prêmio */}
        {showAddForm && (
          <AddFormSection>
            <FormHeader>
              <FormTitle>Adicionar Novo Prêmio</FormTitle>
              <CloseButton
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    position: '1',
                    name: '',
                    description: '',
                    value: '',
                  });
                }}
              >
                ×
              </CloseButton>
            </FormHeader>

            <form onSubmit={handleAddPrize}>
              <FormRow>
                <FormGroup>
                  <Label>Posição *</Label>
                  <Input
                    type='number'
                    min='1'
                    value={formData.position}
                    onChange={e =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Nome do Prêmio *</Label>
                  <Input
                    type='text'
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder='Ex: R$ 5.000 em bônus'
                    required
                    maxLength={100}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Descrição</Label>
                <TextArea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder='Descrição do prêmio...'
                  rows={3}
                  maxLength={300}
                />
              </FormGroup>

              <FormGroup>
                <Label>Valor (R$)</Label>
                <Input
                  type='text'
                  value={formData.value}
                  onChange={e => {
                    const formatted = formatCurrency(e.target.value);
                    setFormData({ ...formData, value: formatted });
                  }}
                  placeholder='5.000,00'
                />
              </FormGroup>

              <FormActions>
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      position: '1',
                      name: '',
                      description: '',
                      value: '',
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button type='submit' $variant='primary' disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <MdAdd />
                      Adicionar Prêmio
                    </>
                  )}
                </Button>
              </FormActions>
            </form>
          </AddFormSection>
        )}

        <PageActions>
          <Button onClick={handleBack} $variant='secondary'>
            <MdArrowBack />
            Voltar para Competições
          </Button>
        </PageActions>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const TitleContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CompetitionInfo = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CompetitionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CompetitionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 12px;
  font-size: 2rem;
`;

const CompetitionDetails = styled.div`
  flex: 1;
`;

const CompetitionName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const CompetitionMeta = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CompetitionDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
`;

const EmptyTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const PrizesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PrizeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const PrizePosition = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.primary};
  min-width: 80px;
`;

const PrizeInfo = styled.div`
  flex: 1;
`;

const PrizeName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const PrizeDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const PrizeValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.success};
`;

const PrizeActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.error}15;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error}30;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.error}25;
  }
`;

const AddFormSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary' &&
    `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
    }
  `}

  ${props =>
    props.$variant === 'secondary' &&
    `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.hover};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export default AddPrizesPage;
