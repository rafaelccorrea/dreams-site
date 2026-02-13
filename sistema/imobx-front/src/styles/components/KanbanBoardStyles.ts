import styled from 'styled-components';

export const KanbanContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  background: ${props => props.theme.colors.background};
  -webkit-overflow-scrolling: touch;

  /* Tablet */
  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 16px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 12px 8px;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
  }

  /* Mobile pequeno */
  @media (max-width: 480px) {
    padding: 10px 6px;
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
`;

export const KanbanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  min-width: 0;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
    gap: 10px;
  }
`;

export const KanbanTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

/** Linha que alinha título e ícones (notificação + 3 pontos) na mesma altura */
export const KanbanTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;

  @media (max-width: 480px) {
    gap: 8px;
    flex-wrap: nowrap;
  }
`;

export const KanbanTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.2;
  flex: 1;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 1024px) {
    font-size: 1.65rem;
  }

  @media (max-width: 768px) {
    font-size: 1.35rem;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    gap: 6px;
  }
`;

export const KanbanProjectDescription = styled.p`
  font-size: 0.95rem;
  font-weight: 400;
  color: ${props => props.theme.colors.textSecondary};
  margin: 4px 0 0 0;
  line-height: 1.5;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    max-width: 100%;
  }
`;

export const TeamMembersSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

/** Equipe + avatares (filtro responsável) no header, à direita */
export const KanbanHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    order: 1;
    margin-top: 8px;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const KanbanActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  flex-shrink: 0;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 6px;
  }

  @media (max-width: 768px) {
    gap: 8px;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }

  /* Mobile: ícones na mesma linha do título, alinhados verticalmente */
  @media (max-width: 480px) {
    gap: 6px;
    flex-shrink: 0;
    align-items: center;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.border};
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    flex: 0 0 auto;
    min-width: fit-content;
  }
`;

export const AddColumnButton = styled.button<{ $disabled?: boolean }>`
  background: ${props =>
    props.$disabled ? props.theme.colors.hover : props.theme.colors.primary};
  color: ${props =>
    props.$disabled ? props.theme.colors.textSecondary : props.theme.colors.cardBackground};
  border: ${props => (props.$disabled ? `1px solid ${props.theme.colors.border}` : 'none')};
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  opacity: ${props => (props.$disabled ? 0.6 : 1)};
  flex-shrink: 0;
  white-space: nowrap;
  position: relative;
  z-index: 1000;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &:hover {
    background: ${props =>
      props.$disabled ? props.theme.colors.hover : props.theme.colors.primaryDark};
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 8px 14px;
    font-size: 0.85rem;
    gap: 6px;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    flex-shrink: 0;
    min-width: fit-content;

    span {
      display: none;
    }
  }
`;

export const SettingsButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 40px;
  min-height: 40px;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    min-width: 40px;
    min-height: 40px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
  }
`;

export const KanbanBoardWrapper = styled.div<{ $hasManyColumns?: boolean }>`
  width: 100%;
  background: ${props => props.theme.colors.background};
  /* Desktop: scroll horizontal quando há 5+ colunas, senão distribuir igualmente */
  overflow-x: ${props => (props.$hasManyColumns ? 'auto' : 'hidden')};
  overflow-y: visible;
  padding: 0 0 48px 0;
  position: relative;

  /* Prevenir seleção de texto */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &:active {
    cursor: grabbing;
  }

  /* Prevenir seleção de texto em todos os elementos filhos */
  * {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }

  /* Permitir seleção apenas em elementos interativos */
  input,
  textarea,
  [contenteditable] {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }

  /* Scrollbar personalizada - visível e funcional quando há scroll horizontal */
  &::-webkit-scrollbar {
    height: ${props => (props.$hasManyColumns ? '12px' : '0px')};
    display: ${props => (props.$hasManyColumns ? 'block' : 'none')};
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.borderLight};
    border-radius: 6px;
    margin: 0 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 6px;
    border: 2px solid ${props => props.theme.colors.background};
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }

    &:active {
      background: ${props => props.theme.colors.primaryDarker};
    }
  }

  /* Tablet: manter comportamento desktop */
  @media (max-width: 1024px) and (min-width: 769px) {
    overflow-x: ${props => (props.$hasManyColumns ? 'auto' : 'hidden')};
  }

  /* Mobile: sempre permitir scroll horizontal */
  @media (max-width: 768px) {
    overflow-x: auto;
    overflow-y: visible;
    padding: 0 0 32px 0;
    padding-bottom: max(32px, env(safe-area-inset-bottom));
    cursor: grab;
    -webkit-overflow-scrolling: touch;

    &:active {
      cursor: grabbing;
    }
  }

  @media (max-width: 480px) {
    padding: 0 0 24px 0;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
  }
`;

export const KanbanBoard = styled.div<{
  $viewMode?: 'scroll' | 'fullscreen';
  $zoomLevel?: 'small' | 'normal' | 'large';
  $hasManyColumns?: boolean;
}>`
  display: flex;
  gap: 16px;
  min-height: auto;
  width: ${props =>
    props.$hasManyColumns
      ? 'max-content'
      : '100%'}; /* Scroll quando há muitas colunas */
  position: relative;
  align-items: flex-start; /* Alinhar colunas no topo */
  z-index: 0;

  /* Garantir que colunas NUNCA quebrem linha */
  flex-wrap: nowrap;

  /* Desktop: distribuir igualmente quando há 4 ou menos colunas, largura fixa quando há 5+ */
  & > * {
    ${props =>
      props.$hasManyColumns
        ? `
        flex: 0 0 auto;
        width: 320px;
        min-width: 320px;
        max-width: 320px;
      `
        : `
        flex: 1;
        min-width: 0;
      `}
  }

  /* Tablet: manter distribuição mas com gap menor */
  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 12px;
    min-height: auto;
    width: ${props => (props.$hasManyColumns ? 'max-content' : '100%')};

    & > * {
      ${props =>
        props.$hasManyColumns
          ? `
          flex: 0 0 auto;
          width: 300px;
          min-width: 300px;
          max-width: 300px;
        `
          : `
          flex: 1;
          min-width: 0;
        `}
    }
  }

  /* Mobile: largura fixa para scroll horizontal */
  @media (max-width: 768px) {
    gap: 12px;
    min-height: auto;
    width: max-content;

    & > * {
      flex: 0 0 auto;
      min-width: 300px;
      max-width: 300px;
    }
  }

  /* Mobile pequeno: coluna mais estreita para caber na tela */
  @media (max-width: 480px) {
    gap: 10px;

    & > * {
      min-width: 280px;
      max-width: 280px;
    }
  }

  /* Garantir que o scroll funcione com teclado */
  &:focus {
    outline: none;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;

export const RetryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.cardBackground};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

export const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;

export const SearchInputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    min-width: 140px;
  }
`;

/** Botão para abrir a busca (ícone + "Buscar") */
export const SearchToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '12'};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
    gap: 6px;
  }
`;

/** Input de busca moderno (pill com ícone) */
export const SearchInputModern = styled.input`
  flex: 1;
  min-width: 120px;
  padding: 10px 16px 10px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 999px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 8px 14px 8px 36px;
    font-size: 0.8125rem;
  }
`;

export const SearchInputWrapWithIcon = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;

  svg.search-icon {
    position: absolute;
    left: 14px;
    color: ${props => props.theme.colors.textSecondary};
    pointer-events: none;
    font-size: 1.125rem;
  }
`;

/** Equipe fixa à esquerda da toolbar (alinhada com Filtros e seletor de funil) */
export const ToolbarLeftFixed = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 4px;
  min-width: 0;

  @media (max-width: 768px) {
    flex: 1 1 auto;
    min-width: 140px;
    max-width: 100%;
  }

  /* Mobile: equipe compacta na mesma linha que Filtros, não ocupa linha inteira */
  @media (max-width: 480px) {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 52%;
  }
`;

/** Uma única linha: equipe (esquerda) + Filtros + seletor de funil */
export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  margin-bottom: 12px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 10px;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    gap: 8px;
    padding: 8px 0;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 8px 0;
    margin-bottom: 6px;
  }
`;

/** Botão de filtros moderno (pill com ícone + texto + badge opcional) */
export const FilterButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props =>
    props.$active ? props.theme.colors.primary + '12' : props.theme.colors.cardBackground};
  color: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-height: 44px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '18'};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
    gap: 6px;
    min-height: 40px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.75rem;
    gap: 6px;
    min-height: 44px;
  }
`;

export const FilterButtonBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.cardBackground};
  font-size: 0.75rem;
  font-weight: 600;

  @media (max-width: 480px) {
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    font-size: 0.7rem;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  margin-bottom: 16px;
  position: relative;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 768px) {
    padding: 12px 0;
    margin-bottom: 12px;
    gap: 8px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 11px 14px;
    font-size: 0.9rem;
    min-height: 40px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.875rem;
    min-height: 44px;
  }
`;

export const ClearSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.cardBackground};
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const NegotiationsCountBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 0;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: ${props =>
    props.theme.colors.textSecondary || props.theme.colors.text};
  font-weight: 500;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 6px 0;
    margin-bottom: 10px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 4px 0;
    margin-bottom: 8px;
    font-size: 0.75rem;
  }
`;

export const NegotiationsCountValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-right: 4px;
`;
