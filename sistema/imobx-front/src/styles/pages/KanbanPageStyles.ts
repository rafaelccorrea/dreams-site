import styled from 'styled-components';

export const ProjectSelectContainer = styled.div`
  padding: 16px 24px;
  background: ${props => props.theme.colors.cardBackground};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const ProjectSelectLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProjectSelectWrapper = styled.div`
  flex: 1;
  min-width: 320px;
  max-width: 400px;
`;
