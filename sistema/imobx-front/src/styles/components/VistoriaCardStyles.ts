import styled from 'styled-components';

export const CardContainer = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

export const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.surface} 100%
  );
  flex-shrink: 0;
`;

export const CardHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;

  ${CardContainer}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

export const StatusBadge = styled.span<{ $variant?: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return `
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'warning':
        return `
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        `;
      case 'error':
        return `
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        `;
      case 'info':
        return `
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
        `;
    }
  }}
`;

export const TypeBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

export const CardContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DescriptionContainer = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
`;

export const DescriptionText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

export const InfoItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: ${props => {
    switch (props.$color) {
      case 'blue':
        return '#eff6ff';
      case 'green':
        return '#f0fdf4';
      case 'purple':
        return '#faf5ff';
      case 'orange':
        return '#fff7ed';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$color) {
        case 'blue':
          return '#dbeafe';
        case 'green':
          return '#dcfce7';
        case 'purple':
          return '#e9d5ff';
        case 'orange':
          return '#fed7aa';
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: 12px;
`;

export const InfoIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  background: ${props => {
    switch (props.$color) {
      case 'blue':
        return '#dbeafe';
      case 'green':
        return '#dcfce7';
      case 'purple':
        return '#e9d5ff';
      case 'orange':
        return '#fed7aa';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
  color: ${props => {
    switch (props.$color) {
      case 'blue':
        return '#1e40af';
      case 'green':
        return '#166534';
      case 'purple':
        return '#7c3aed';
      case 'orange':
        return '#ea580c';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

export const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InfoLabel = styled.p<{ $color?: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 4px 0;
  color: ${props => {
    switch (props.$color) {
      case 'blue':
        return '#1e40af';
      case 'green':
        return '#166534';
      case 'purple':
        return '#7c3aed';
      case 'orange':
        return '#ea580c';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

export const InfoValue = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ValueContainer = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
`;

export const ValueContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ValueInfo = styled.div`
  flex: 1;
`;

export const ValueLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: #166534;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 4px 0;
`;

export const ValueAmount = styled.p`
  font-size: 1.125rem;
  font-weight: 700;
  color: #166534;
  margin: 0;
`;

export const ValueIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #bbf7d0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #166534;
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 24px;
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 40px;

  ${props => {
    if (props.$variant === 'delete') {
      return `
        background: transparent;
        border: 1px solid #fca5a5;
        color: #dc2626;

        &:hover {
          background: #fef2f2;
          border-color: #f87171;
          color: #b91c1c;
        }
      `;
    } else {
      return `
        background: transparent;
        border: 1px solid ${props.theme.colors.border};
        color: ${props.theme.colors.text};

        &:hover {
          background: ${props.theme.colors.hover};
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;
