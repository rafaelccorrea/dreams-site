import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-end;
  }
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 16px 16px 0 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 16px 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 16px 20px;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    gap: 8px;
    flex-direction: column-reverse;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.2s;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px; /* Evita zoom automático no iOS */
    min-height: 44px; /* Tamanho mínimo recomendado para touch */
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 16px;
    min-height: 42px;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: inherit;
  }

  /* Evitar zoom no iOS */
  @supports (-webkit-touch-callout: none) {
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

export const SearchInput = styled(Input)`
  padding-left: 40px;

  @media (max-width: 768px) {
    padding-left: 38px;
  }

  @media (max-width: 480px) {
    padding-left: 36px;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;

  @media (max-width: 768px) {
    left: 11px;
  }

  @media (max-width: 480px) {
    left: 10px;
  }
`;

export const UsersList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
`;

export const UserCard = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary + '10' : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary + '15'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const UserAvatar = styled.div<{ $small?: boolean }>`
  width: ${({ $small }) => ($small ? '28px' : '40px')};
  height: ${({ $small }) => ($small ? '28px' : '40px')};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${({ $small }) => ($small ? '12px' : '16px')};
  margin-right: 12px;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SelectedIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EmptyText = styled.div`
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
`;

export const SelectedUsersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 50px;
`;

export const SelectedUserTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.primary + '15'};
  border: 1px solid ${({ theme }) => theme.colors.primary + '30'};
  border-radius: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

export const RemoveUserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.error + '20'};
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
  touch-action: manipulation;

  @media (max-width: 768px) {
    padding: 12px 18px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.border};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CreateButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
  touch-action: manipulation;

  @media (max-width: 768px) {
    padding: 12px 18px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary + '40'};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
