import styled from 'styled-components';

// Container principal do dashboard
export const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 90px 24px 20px 24px;
`;

// Container de informações do usuário
export const UserInfo = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
`;

// Título das informações do usuário
export const UserTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  font-family: 'Poppins', sans-serif;
`;

// Detalhe do usuário
export const UserDetail = styled.div`
  margin-bottom: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-family: 'Poppins', sans-serif;
`;

// Label dos detalhes
export const Label = styled.span`
  font-weight: 600;
  color: #111827; /* Gray-900 */
`;
