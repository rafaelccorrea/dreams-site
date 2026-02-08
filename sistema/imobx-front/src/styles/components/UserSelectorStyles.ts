import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

export const UsersList = styled.div<{ $maxHeight: string }>`
  max-height: ${props => props.$maxHeight};
  overflow-y: auto;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

export const UserItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }

  ${props =>
    props.$isSelected &&
    `
    background: ${props.theme.colors.primary}20;
    border-color: ${props.theme.colors.primary};
  `}
`;

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 12px;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SelectedIndicator = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyText = styled.div`
  margin-top: 8px;
  font-size: 0.9rem;
  text-align: center;
`;

export const SelectedCount = styled.div`
  margin-top: 12px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.primary}10;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  text-align: center;
`;
