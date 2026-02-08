import styled from 'styled-components';

export const KanbanContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden; /* Desktop: sem scroll horizontal */
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  background: #fff;

  /* Tablet: manter comportamento desktop */
  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 16px;
  }

  /* Mobile: ajustar padding e permitir scroll horizontal no wrapper */
  @media (max-width: 768px) {
    padding: 12px 8px;
    overflow-x: hidden; /* Container não tem scroll, apenas o wrapper interno */
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 12px;
  }
`;

export const KanbanTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
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

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 8px;
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

export const KanbanActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 6px;
  }

  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    justify-content: flex-start;

    /* Esconder scrollbar mas manter funcionalidade */
    &::-webkit-scrollbar {
      height: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.border};
      border-radius: 2px;
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
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
    props.$disabled ? '#f1f5f9' : props.theme.colors.primary};
  color: ${props =>
    props.$disabled ? props.theme.colors.textSecondary : 'white'};
  border: ${props => (props.$disabled ? '1px solid #e2e8f0' : 'none')};
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
      props.$disabled ? '#f1f5f9' : props.theme.colors.primaryDark};
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
  background: #fff;
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
    padding: 8px;
    flex-shrink: 0;
    min-width: 40px;
    min-height: 40px;
  }
`;

export const KanbanBoardWrapper = styled.div<{ $hasManyColumns?: boolean }>`
  width: 100%;
  background: #fff;
  /* Desktop: scroll horizontal quando há 5+ colunas, senão distribuir igualmente */
  overflow-x: ${props => (props.$hasManyColumns ? 'auto' : 'hidden')};
  overflow-y: visible;
  padding: 0 0 24px 0;
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
    background: #f1f5f9;
    border-radius: 6px;
    margin: 0 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 6px;
    border: 2px solid #fff;
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
    padding: 0 0 16px 0;
    cursor: default;
    -webkit-overflow-scrolling: touch; /* Scroll suave no iOS */

    &:active {
      cursor: default;
    }
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
        width: 280px;
        min-width: 280px;
        max-width: 280px;
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
          width: 260px;
          min-width: 260px;
          max-width: 260px;
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
    width: max-content; /* Permitir que o conteúdo defina a largura */

    & > * {
      flex: 0 0 auto; /* Não distribuir igualmente, usar largura fixa */
      min-width: 280px;
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
  color: white;
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
  flex: 0 0 70%;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0; /* Permite que o input encolha */

  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
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
  background: #fff;
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
  background: #fff;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const NegotiationsCountBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: ${props =>
    props.theme.colors.textSecondary || props.theme.colors.text};
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 6px 0;
    margin-bottom: 10px;
    font-size: 0.8125rem;
  }
`;

export const NegotiationsCountValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-right: 4px;
`;
