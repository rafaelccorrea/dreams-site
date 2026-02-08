import styled from 'styled-components';

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props =>
    props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    filter: brightness(0.98);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const Td = styled.td`
  padding: 10px;
  color: ${props => props.theme.colors.textSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  background: ${props =>
    props.$status === 'success'
      ? 'rgba(34,197,94,0.12)'
      : props.$status === 'error'
        ? 'rgba(239,68,68,0.12)'
        : 'rgba(234,179,8,0.12)'};
  color: ${props =>
    props.$status === 'success'
      ? '#22c55e'
      : props.$status === 'error'
        ? '#ef4444'
        : '#b45309'};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 24px 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;

export const DrawerForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DrawerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DrawerLabel = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const DrawerHint = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Shimmer = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 25%,
    ${props => props.theme.colors.border || '#e0e0e0'} 50%,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 75%
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

export const ShimmerRow = styled.tr`
  td {
    padding: 12px 10px;
  }
`;

export const ShimmerCell = styled.td`
  padding: 12px 10px;
`;
