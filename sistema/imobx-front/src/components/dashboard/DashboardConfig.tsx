import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDragIndicator,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md';

export interface DashboardCard {
  id: string;
  label: string;
  category: 'stats' | 'charts' | 'widgets' | 'activities';
  enabled: boolean;
  order: number;
}

interface DashboardConfigProps {
  isOpen: boolean;
  onClose: () => void;
  cards: DashboardCard[];
  onSave: (cards: DashboardCard[]) => void;
  defaultCards: DashboardCard[];
}

const DashboardConfig: React.FC<DashboardConfigProps> = ({
  isOpen,
  onClose,
  cards,
  onSave,
  defaultCards,
}) => {
  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => a.order - b.order),
    [cards]
  );
  const [localCards, setLocalCards] = useState<DashboardCard[]>(sortedCards);

  // Sincronizar quando abrir/receber novos cards
  useEffect(() => {
    if (isOpen) {
      setLocalCards([...sortedCards]);
    }
  }, [sortedCards, isOpen]);

  const toggleCard = (cardId: string) => {
    setLocalCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, enabled: !card.enabled } : card
      )
    );
  };

  const moveCard = (cardId: string, direction: 'up' | 'down') => {
    setLocalCards(prev => {
      // Encontrar o card que está sendo movido
      const cardToMove = prev.find(c => c.id === cardId);
      if (!cardToMove) return prev;

      // Filtrar apenas os cards da mesma categoria
      const sameCategoryCards = prev
        .filter(c => c.category === cardToMove.category)
        .sort((a, b) => a.order - b.order);

      // Encontrar o índice dentro da categoria
      const categoryIndex = sameCategoryCards.findIndex(c => c.id === cardId);
      if (categoryIndex === -1) return prev;

      // Calcular o índice alvo dentro da categoria
      const targetCategoryIndex =
        direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
      if (
        targetCategoryIndex < 0 ||
        targetCategoryIndex >= sameCategoryCards.length
      )
        return prev;

      // Trocar as orders dentro da categoria
      const updated = prev.map(card => {
        if (card.id === cardToMove.id) {
          return {
            ...card,
            order: sameCategoryCards[targetCategoryIndex].order,
          };
        }
        if (card.id === sameCategoryCards[targetCategoryIndex].id) {
          return { ...card, order: cardToMove.order };
        }
        return card;
      });

      return updated;
    });
  };

  const handleSave = () => {
    // Normalizar orders mantendo a ordem por categoria
    const normalized = [...localCards]
      .sort((a, b) => {
        // Ordenar primeiro por categoria, depois por order
        if (a.category !== b.category) {
          const categoryOrder = ['stats', 'charts', 'widgets', 'activities'];
          return (
            categoryOrder.indexOf(a.category) -
            categoryOrder.indexOf(b.category)
          );
        }
        return a.order - b.order;
      })
      .map((card, index) => ({ ...card, order: index + 1 }));

    onSave(normalized);
    onClose();
  };

  const handleReset = () => {
    // Voltar para a configuração padrão recebida por props
    const normalized = [...defaultCards]
      .sort((a, b) => {
        if (a.category !== b.category) {
          const categoryOrder = ['stats', 'charts', 'widgets', 'activities'];
          return (
            categoryOrder.indexOf(a.category) -
            categoryOrder.indexOf(b.category)
          );
        }
        return a.order - b.order;
      })
      .map((card, index) => ({ ...card, order: index + 1 }));

    setLocalCards(normalized);
    onSave(normalized);
    // Limpar configuração custom do usuário para voltar ao padrão
    try {
      localStorage.removeItem('dashboardConfig');
    } catch {
      // ignore erro de localStorage
    }
  };

  // Mapeamento de descrições para cada card
  const cardDescriptions: Record<string, string> = {
    properties:
      'Total de imóveis cadastrados no sistema, incluindo apartamentos, casas, terrenos e imóveis comerciais.',
    users:
      'Total de usuários ativos no sistema, incluindo corretores, administradores e demais funcionários da imobiliária.',
    sales:
      'Valor total das vendas realizadas no período selecionado, incluindo imóveis vendidos e comissões geradas.',
    rating:
      'Avaliação média dos clientes baseada em feedback, avaliações e satisfação geral com os serviços prestados.',
    revenue:
      'Receita total gerada pela imobiliária, incluindo comissões de vendas, aluguéis e demais serviços oferecidos.',
    clients:
      'Número de clientes que estão ativamente buscando imóveis ou que têm negociações em andamento.',
    conversion:
      'Percentual de leads que se converteram em vendas ou aluguéis efetivados, indicando a eficácia da equipe de vendas.',
    leads:
      'Total de potenciais clientes que demonstraram interesse em imóveis, incluindo visitas, contatos e consultas.',
    appointments:
      'Número total de visitas e reuniões agendadas com clientes para visualização de imóveis ou negociações.',
    documents:
      'Documentos que precisam ser analisados, assinados ou finalizados para completar transações imobiliárias.',
    'sales-chart':
      'Gráfico mostrando a evolução das vendas ao longo dos meses, permitindo identificar tendências e sazonalidade.',
    'property-types':
      'Distribuição percentual dos tipos de imóveis no portfólio, mostrando apartamentos, casas, terrenos e comerciais.',
    'location-chart':
      'Mapa ou gráfico mostrando onde estão localizados os imóveis, ajudando a identificar as regiões com maior concentração de propriedades.',
    'lead-sources':
      'Distribuição das fontes de origem dos clientes, mostrando de onde eles estão vindo (WhatsApp, telefone, redes sociais, portais, etc.).',
    'company-goal':
      'Acompanhamento do progresso da meta de vendas da empresa. Mostra o percentual alcançado, valores atuais e restantes, além de quantos dias faltam para o fim do período.',
    'churn-alerts':
      'Alertas inteligentes sobre clientes com risco de cancelamento ou perda, permitindo ações preventivas para retenção.',
    'broker-performance':
      'Análise detalhada do desempenho individual dos corretores, incluindo vendas, conversões e métricas de produtividade.',
    matches:
      'Lista de correspondências pendentes entre clientes e imóveis, facilitando o acompanhamento de oportunidades de negócio.',
    'match-performance':
      'Métricas de eficácia dos matches realizados, mostrando taxa de conversão e sucesso das correspondências.',
    'top-performers':
      'Ranking dos melhores corretores e profissionais da equipe, destacando os principais resultados e conquistas.',
    tasks:
      'Lista de tarefas urgentes e pendentes que requerem atenção imediata para manter o fluxo de trabalho organizado.',
    'recent-leads':
      'Últimos leads cadastrados no sistema, permitindo acompanhamento rápido de novos potenciais clientes.',
    'team-performance':
      'Acompanhamento de tarefas concluídas, pendentes, performance geral e tempo médio de resposta da equipe.',
    'business-analysis':
      'Métricas de performance dos negócios: tamanho médio de deals, taxa de ocupação e tempos médios de venda/aluguel.',
    activities:
      'Timeline das últimas atividades realizadas no sistema, incluindo vendas, cadastros, visitas e outras ações importantes.',
  };

  // Categorias dinamicamente derivadas dos cards para evitar mocks
  const categories = useMemo(() => {
    const labels: Record<string, string> = {
      stats: 'Estatísticas',
      charts: 'Gráficos',
      widgets: 'Widgets',
      activities: 'Atividades',
    };
    const unique = Array.from(new Set(localCards.map(c => c.category)));
    return unique.map(id => ({ id, label: labels[id] || id }));
  }, [localCards]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <ModalTitle>Configurar Dashboard</ModalTitle>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Description>
            Personalize seu dashboard selecionando quais informações deseja
            visualizar. Você pode habilitar ou desabilitar cards, reordená-los
            dentro de cada categoria usando os botões de seta, e salvar suas
            preferências. As configurações serão mantidas mesmo após deslogar.
          </Description>

          {categories.map(category => {
            const categoryCards = localCards.filter(
              card => card.category === category.id
            );

            if (categoryCards.length === 0) return null;

            return (
              <Category key={category.id}>
                <CategoryTitle>{category.label}</CategoryTitle>
                <CardList>
                  {categoryCards
                    .sort((a, b) => a.order - b.order)
                    .map((card, idx) => (
                      <CardItem key={card.id}>
                        <DragHandle aria-hidden>
                          <MdDragIndicator />
                        </DragHandle>
                        <CardLabelContainer>
                          <CardLabel onClick={() => toggleCard(card.id)}>
                            {card.label}
                          </CardLabel>
                          {cardDescriptions[card.id] && (
                            <CardDescription>
                              {cardDescriptions[card.id]}
                            </CardDescription>
                          )}
                        </CardLabelContainer>
                        <ReorderButtons>
                          <ReorderBtn
                            aria-label='Mover para cima'
                            disabled={idx === 0}
                            onClick={() => moveCard(card.id, 'up')}
                          >
                            <MdArrowUpward size={18} />
                          </ReorderBtn>
                          <ReorderBtn
                            aria-label='Mover para baixo'
                            disabled={idx === categoryCards.length - 1}
                            onClick={() => moveCard(card.id, 'down')}
                          >
                            <MdArrowDownward size={18} />
                          </ReorderBtn>
                        </ReorderButtons>
                        <Checkbox onClick={() => toggleCard(card.id)}>
                          {card.enabled ? (
                            <MdCheckBox size={24} color='#10B981' />
                          ) : (
                            <MdCheckBoxOutlineBlank size={24} />
                          )}
                        </Checkbox>
                      </CardItem>
                    ))}
                </CardList>
              </Category>
            );
          })}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Fechar</CancelButton>
          <ResetButton type='button' onClick={handleReset}>
            Redefinir padrão
          </ResetButton>
          <SaveButton onClick={handleSave}>Salvar Configuração</SaveButton>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default DashboardConfig;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 999999;
  padding: 40px 20px 20px 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 1000px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  margin-top: 40px;

  @media (max-width: 1024px) {
    max-width: 90vw;
    border-radius: 14px;
    margin-top: 20px;
  }

  @media (max-width: 640px) {
    max-width: 95vw;
    border-radius: 12px;
    margin-top: 10px;
  }

  @keyframes modalSlideIn {
    from {
      transform: translateY(40px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.background};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.text};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 640px) {
    padding: 16px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.primary}dd;
    }
  }
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.938rem;
  margin: 0 0 24px 0;
  line-height: 1.7;
  padding: 16px;
  background: ${props =>
    props.theme.colors.backgroundSecondary || props.theme.colors.background};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const Category = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
  }

  @media (max-width: 640px) {
    gap: 10px;
    padding: 12px;
    &:hover {
      transform: none;
    }
  }
`;

const DragHandle = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const CardLabelContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardLabel = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 0.938rem;
  font-weight: 500;
  cursor: pointer;
`;

const CardDescription = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.813rem;
  line-height: 1.4;
  margin-top: 2px;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
`;

const ReorderButtons = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
  margin-right: 8px;
  padding-top: 2px;

  @media (max-width: 640px) {
    gap: 4px;
    margin-right: 6px;
  }
`;

const ReorderBtn = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 26px;
    height: 26px;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.background};
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  font-size: 0.938rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const ResetButton = styled.button`
  padding: 10px 16px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  font-size: 0.938rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}11;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  font-size: 0.938rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}dd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(0);
  }
`;
