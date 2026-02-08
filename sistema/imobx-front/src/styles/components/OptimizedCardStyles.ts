import styled from 'styled-components';

// Card otimizado - sem transformações pesadas
export const OptimizedCard = styled.div<{
  $isSelected?: boolean;
  $hover?: boolean;
}>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 16px; // Reduzido de 20px
  padding: 20px; // Reduzido de 24px
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease; // Removido transform
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  will-change: border-color, box-shadow; // Otimização

  ${props =>
    props.$isSelected &&
    `
    box-shadow: 0 4px 16px ${props.theme.colors.primary}20;
  `}

  ${props =>
    props.$hover &&
    `
    &:hover {
      border-color: ${props.theme.colors.primary}60;
      box-shadow: 0 4px 12px ${props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
    }
  `}

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

// Card header otimizado
export const OptimizedCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px; // Reduzido de 20px
  gap: 12px;
`;

export const OptimizedCardIcon = styled.div<{ $color?: string }>`
  width: 40px; // Reduzido de 48px
  height: 40px;
  border-radius: 10px; // Reduzido de 12px
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem; // Reduzido de 1.3rem
  flex-shrink: 0;
`;

export const OptimizedCardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const OptimizedCardTitle = styled.h3`
  font-size: 1.2rem; // Reduzido de 1.3rem
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 6px 0; // Reduzido de 8px
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const OptimizedCardDescription = styled.p`
  font-size: 0.9rem; // Reduzido de 0.95rem
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const OptimizedCardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; // Reduzido de 12px
  margin-top: 12px; // Reduzido de 16px
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const OptimizedCardDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; // Reduzido de 8px
  font-size: 0.85rem; // Reduzido de 0.9rem
  color: ${props => props.theme.colors.textSecondary};
`;

// Status badge otimizado
export const OptimizedStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px; // Reduzido de 6px
  padding: 4px 8px; // Reduzido de 6px 12px
  border-radius: 12px; // Reduzido de 20px
  font-size: 0.75rem; // Reduzido de 0.8rem
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px; // Reduzido de 0.5px

  ${props => {
    switch (props.$status) {
      case 'active':
        return `
          background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
          color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
        `;
      case 'completed':
        return `
          background: ${props.theme.mode === 'dark' ? '#1e3a8a' : '#dbeafe'};
          color: ${props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af'};
        `;
      case 'pending':
        return `
          background: ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'};
          color: ${props.theme.mode === 'dark' ? '#fbbf24' : '#92400e'};
        `;
      case 'cancelled':
        return `
          background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
          color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}
`;

// Ações do card otimizadas
export const OptimizedCardActions = styled.div`
  display: flex;
  gap: 6px; // Reduzido de 8px
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  min-width: 100px; // Reduzido de 120px
  max-width: 120px; // Reduzido de 140px

  @media (max-width: 768px) {
    justify-content: flex-end;
    margin-top: 12px; // Reduzido de 16px
    min-width: auto;
    max-width: none;
  }
`;

export const OptimizedActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'info';
}>`
  padding: 6px 8px; // Reduzido de 8px 12px
  border-radius: 6px; // Reduzido de 8px
  font-size: 0.8rem; // Reduzido de 0.85rem
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease; // Reduzido de 0.2s
  display: flex;
  align-items: center;
  gap: 2px; // Reduzido de 4px
  border: none;
  min-width: 28px; // Reduzido de 32px
  height: 28px; // Reduzido de 32px
  justify-content: center;
  flex-shrink: 0;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
        }
      `;
    } else if (props.$variant === 'info') {
      return `
        background: ${props.theme.mode === 'dark' ? '#1e3a8a' : '#dbeafe'};
        color: ${props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#1e40af' : '#bfdbfe'};
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}08;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.95);
  }
`;

// Grid de cards otimizado
export const OptimizedCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(300px, 1fr)
  ); // Reduzido de 320px
  gap: 20px; // Reduzido de 24px

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Lista de cards otimizada
export const OptimizedCardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; // Reduzido de 16px
`;

// Card de lista otimizado
export const OptimizedListCard = styled.div<{ $isSelected?: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 12px; // Reduzido de 16px
  padding: 16px; // Reduzido de 20px
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  position: relative;
  box-shadow: 0 1px 4px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(0, 0, 0, 0.03)'};
  will-change: border-color, box-shadow;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 2px 8px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.06)'};
  }

  ${props =>
    props.$isSelected &&
    `
    box-shadow: 0 2px 8px ${props.theme.colors.primary}20;
  `}

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 10px;
  }
`;

// Item de lista otimizado
export const OptimizedListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px; // Reduzido
  border-radius: 8px;
  transition: background-color 0.15s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
  }
`;

export const OptimizedListItemIcon = styled.div<{ $color?: string }>`
  width: 32px; // Reduzido de 40px
  height: 32px;
  border-radius: 8px;
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem; // Reduzido de 1.2rem
  flex-shrink: 0;
`;

export const OptimizedListItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const OptimizedListItemTitle = styled.div`
  font-size: 1rem; // Reduzido de 1.1rem
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 2px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OptimizedListItemDescription = styled.div`
  font-size: 0.85rem; // Reduzido de 0.9rem
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Skeleton otimizado
export const OptimizedSkeleton = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '16px'};
  border-radius: ${props => props.$borderRadius || '4px'};

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

// Card skeleton otimizado
export const OptimizedCardSkeleton = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  margin-bottom: 16px;
`;

// Grid skeleton otimizado
export const OptimizedSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
