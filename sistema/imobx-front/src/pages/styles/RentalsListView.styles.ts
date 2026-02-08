import styled from 'styled-components';

export const RentalsListContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.text};

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 100px;
    gap: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 80px;
    gap: 12px;
    padding: 12px 16px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 70px;
    gap: 8px;
    padding: 10px 12px;
    font-size: 11px;
  }
`;

export const RentalRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background-color 0.2s ease;
  align-items: center;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 100px;
    gap: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 80px;
    gap: 12px;
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 70px;
    gap: 8px;
    padding: 10px 12px;
  }
`;

export const RentalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const RentalProperty = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const RentalTenant = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const RentalDates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const DateLabel = styled.span`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DateValue = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

export const RentalPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const RentalStatus = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${props => {
    const statusColors: Record<string, { bg: string; color: string }> = {
      active: {
        bg: props.theme.mode === 'dark' ? '#10B98120' : '#D1FAE5',
        color: props.theme.mode === 'dark' ? '#10B981' : '#065F46',
      },
      pending: {
        bg: props.theme.mode === 'dark' ? '#F59E0B20' : '#FEF3C7',
        color: props.theme.mode === 'dark' ? '#F59E0B' : '#92400E',
      },
      expired: {
        bg: props.theme.mode === 'dark' ? '#EF444420' : '#FEE2E2',
        color: props.theme.mode === 'dark' ? '#EF4444' : '#991B1B',
      },
      cancelled: {
        bg: props.theme.mode === 'dark' ? '#6B728020' : '#F3F4F6',
        color: props.theme.mode === 'dark' ? '#6B7280' : '#374151',
      },
    };

    const colors = statusColors[props.$status] || statusColors.pending;

    return `
      background: ${colors.bg};
      color: ${colors.color};
    `;
  }}

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 8px;
  }
`;

export const RowActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
    border-radius: 5px;
  }

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.textSecondary};
        
        &:hover {
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          transform: translateY(-1px);
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.95);
  }
`;

export const MobileHidden = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const TabletHidden = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileRentalDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const MobileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

export const MobileDetailLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const MobileDetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;
