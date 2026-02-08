import styled from 'styled-components';

export const PermissionCategoryContainer = styled.div`
  margin-bottom: 16px;
`;

export const PermissionCategoryTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 8px;
`;

export const PermissionItem = styled.label<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  background-color: ${props =>
    props.$isSelected
      ? props.theme.colors.backgroundSecondary
      : props.theme.colors.background};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.border};
  }
`;

export const PermissionCheckbox = styled.input`
  margin-right: 8px;
`;

export const PermissionInfo = styled.div`
  flex: 1;
`;

export const PermissionName = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

export const PermissionDescription = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const LoadingContainer = styled.div`
  padding: 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
`;
