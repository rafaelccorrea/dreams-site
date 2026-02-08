import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease;
  padding: 100px 20px 20px 20px;
`;

export const ModalContainer = styled.div`
  background: var(--color-background);
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border);
`;

export const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-text);
  }
`;

export const ModalContent = styled.div`
  padding: 24px;
  background: var(--color-background-secondary);
  border-top: 1px solid var(--color-border);
`;

export const ClientInfo = styled.div`
  margin-bottom: 24px;
`;

export const ClientName = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 8px 0;
`;

export const CurrentResponsible = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
`;

export const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background);
`;

export const UserItem = styled.div<{ $isSelected: boolean }>`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.2s ease;
  background: ${props =>
    props.$isSelected
      ? 'var(--color-primary-light)'
      : 'var(--color-background)'};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--color-background-secondary);
  }

  ${props =>
    props.$isSelected &&
    `
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  `}
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

export const UserDetails = styled.div`
  flex: 1;
`;

export const UserName = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 4px 0;
`;

export const UserEmail = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
`;

export const UserRole = styled.span`
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-background-secondary);
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
`;

export const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin: 16px 0 0 0;
  padding: 12px;
  background: var(--color-error-light);
  border-radius: 8px;
  border: 1px solid var(--color-error);
`;

export const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    &:disabled {
      background: var(--color-text-secondary);
      cursor: not-allowed;
    }
  `
      : `
    background: var(--color-background);
    color: var(--color-text-secondary);
    border: 2px solid var(--color-border);

    &:hover:not(:disabled) {
      background: var(--color-background-secondary);
      border-color: var(--color-border-dark);
    }
  `}
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--color-text-secondary);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
`;

export const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;
