import styled from 'styled-components';

export const ColumnContainer = styled.div<{
  $isOver?: boolean;
  $scrollMode?: 'scroll' | 'expand';
}>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid
    ${props =>
      props.$isOver ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  /* Desktop: distribuir igualmente na tela */
  flex: 1;
  min-width: 0;
  max-width: none;
  /* Altura fixa baseada na viewport para permitir scroll interno */
  height: calc(100vh - 180px);
  min-height: 400px;
  max-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  z-index: 1;

  /* Quando a coluna está recebendo um card (isOver), aumentar z-index */
  ${props =>
    props.$isOver &&
    `
    z-index: 50;
  `}

  /* Garantir que tooltips não sejam cortados - eles usam position: fixed */
  /* Os tooltips são renderizados fora do contexto de overflow */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}60,
      ${props => props.theme.colors.primary}
    );
    opacity: 0.7;
  }

  ${props =>
    props.$isOver &&
    `
    box-shadow: 0 8px 25px ${props.theme.colors.primary}30;
    transform: translateY(-4px) scale(1.02);
    border-color: ${props.theme.colors.primary};
  `}

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  /* Tablet: largura mínima para scroll se necessário */
  @media (max-width: 1024px) and (min-width: 769px) {
    flex: 1;
    min-width: 300px;
    max-width: none;
    padding: 14px;
    height: calc(100vh - 200px);
    min-height: 380px;
    max-height: calc(100vh - 200px);
  }

  /* Mobile: largura fixa com scroll horizontal */
  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 300px;
    min-width: 300px;
    max-width: 300px;
    padding: 12px;
    border-radius: 12px;
    height: calc(100vh - 240px);
    min-height: 320px;
    max-height: calc(100vh - 240px);

    &:hover {
      transform: none;
    }
  }

  /* Mobile pequeno */
  @media (max-width: 480px) {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
    padding: 10px;
    height: calc(100vh - 220px);
    min-height: 280px;
    max-height: calc(100vh - 220px);
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${props => props.theme.colors.primary};
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
    padding-bottom: 6px;
  }
`;

export const ColumnTitle = styled.h3<{
  $headerStyle?: 'simple' | 'gradient' | 'colored';
}>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.01em;
  padding: 4px 8px;
  border-radius: 4px;
  flex-wrap: wrap;
  min-width: 0;
  overflow: hidden;

  /* Configuração de estilo do cabeçalho */
  ${props => {
    switch (props.$headerStyle) {
      case 'gradient':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary}20 0%, ${props.theme.colors.primary}10 100%);
          border: 1px solid ${props.theme.colors.primary}30;
        `;
      case 'colored':
        return `
          background: ${props.theme.colors.primary};
          color: ${props.theme.colors.cardBackground};
          border: 1px solid ${props.theme.colors.primary};
        `;
      case 'simple':
      default:
        return `
          background: transparent;
          border: none;
        `;
    }
  }}

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 0.9rem;
    padding: 5px 8px;
    gap: 6px;
    flex-wrap: nowrap;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 5px 8px;
    gap: 4px;
    flex-wrap: wrap;

    /* Permitir que o título quebre em telas muito pequenas */
    & > span:first-of-type {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 4px 6px;
    gap: 3px;
  }
`;

export const ColumnColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

export const ColumnMenu = styled.div`
  position: relative;
`;

export const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

export const MenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

export const MenuItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 12px 16px;
  text-align: left;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 4px 0;
`;

export const TasksList = styled.div<{ $scrollMode?: 'scroll' | 'expand' }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 8px;
  padding-bottom: 8px;
  position: relative;
  z-index: 1;
  min-height: 0;

  /* Tooltips usam position: fixed, então não são afetados pelo overflow */

  /* Estilizar scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.borderLight};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }

  /* Garantir que os cards dentro da lista fiquem acima */
  & > * {
    position: relative;
    z-index: 99999 !important;
    flex-shrink: 0;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 6px;
    padding-right: 6px;
  }

  @media (max-width: 768px) {
    gap: 6px;
    padding-right: 4px;
  }
`;

export const TaskCount = styled.span`
  flex-shrink: 0;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20,
    ${props => props.theme.colors.primary}30
  );
  color: ${props => props.theme.colors.primary};
  font-size: 0.813rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.primary}30;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const AddTaskButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px dashed ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
  margin-top: 4px;
  min-height: 36px;
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => `${props.theme.colors.primary}10`};
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 9px;
    font-size: 0.75rem;
    gap: 5px;
    min-height: 40px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.8rem;
    margin-top: 6px;
    min-height: 44px;
  }
`;
