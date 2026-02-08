import styled from 'styled-components';

export const TeamsListContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`;

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 140px;
  gap: 20px;
  padding: 20px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 100px;
    gap: 16px;
    padding: 18px 20px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 100px;
    gap: 12px;
    padding: 14px 16px;
    font-size: 12px;
  }
`;

export const TeamRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 140px;
  gap: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 100px;
    gap: 16px;
    padding: 18px 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 100px;
    gap: 12px;
    padding: 14px 16px;
  }
`;

export const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

export const TeamColorIndicator = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

export const TeamDetails = styled.div`
  min-width: 0;
  flex: 1;
`;

export const TeamName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const TeamDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const TeamMembers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

export const TeamAdmins = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

export const TeamProjects = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;

        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};

        &:hover {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: translateY(-1px);
        }
      `;
    } else {
      // secondary
      return `
        background: ${props.theme.mode === 'light' ? '#F3F4F6' : props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};

        &:hover {
          background: ${props.theme.mode === 'light' ? '#E5E7EB' : props.theme.colors.primary + '08'};
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
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

export const MobileTeamDetails = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const MobileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 6px;
  }
`;

export const MobileDetailLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const MobileDetailValue = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;
