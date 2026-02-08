import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 16px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    margin-bottom: 12px;
    font-size: 13px;
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

export const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const InfoValue = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'new':
        return '#3b82f6';
      case 'contacted':
        return '#8b5cf6';
      case 'qualified':
        return '#10b981';
      case 'converted':
        return '#059669';
      case 'lost':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
  color: white;
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        &:hover { opacity: 0.9; }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { opacity: 0.9; }
      `;
    }
    return `
      background: ${props.theme.colors.cardBackground};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover { background: ${props.theme.colors.background}; }
    `;
  }}

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }
`;
