import styled from 'styled-components';

export const CompanyDemoContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 24px;
    font-family: 'Poppins', sans-serif;
  }

  h3 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 12px;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
  }

  ul {
    color: ${props => props.theme.colors.textSecondary};
    font-family: 'Poppins', sans-serif;

    li {
      margin-bottom: 8px;
    }
  }
`;

export const CompanyInfoCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

export const CompanyName = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
`;

export const CompanyDetails = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
`;

export const CompanyActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  ${props =>
    props.$variant === 'secondary'
      ? `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.hover};
    }
  `
      : `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

export const StatusIndicator = styled.div<{
  $type: 'loading' | 'error' | 'warning' | 'info';
}>`
  padding: 16px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  text-align: center;

  ${props => {
    switch (props.$type) {
      case 'loading':
        return `
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
        `;
      case 'error':
        return `
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        `;
      case 'warning':
        return `
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fed7aa;
        `;
      case 'info':
        return `
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
        `;
      default:
        return '';
    }
  }}
`;
