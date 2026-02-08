import styled from 'styled-components';

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContainer = styled.div`
  background: var(--color-surface);
  border-radius: 24px;
  box-shadow:
    0 32px 64px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--color-border);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 95vh;
    margin: 10px;
    border-radius: 20px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px 0 32px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 28px;
  background: linear-gradient(
    135deg,
    var(--color-surface) 0%,
    var(--color-background-secondary) 100%
  );

  @media (max-width: 768px) {
    padding: 20px 24px 0 24px;
    margin-bottom: 20px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CloseButton = styled.button`
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  font-size: 20px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  &:hover {
    background: var(--color-error);
    color: white;
    border-color: var(--color-error);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalContent = styled.div`
  padding: 0 32px 32px 32px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-background-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary-dark);
  }

  @media (max-width: 768px) {
    padding: 0 24px 24px 24px;
    max-height: calc(95vh - 100px);
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 40px;
  background: var(--color-background-secondary);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
  }
`;

export const FilterSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(
      90deg,
      var(--color-primary) 0%,
      transparent 100%
    );
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 16px;
  }
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  width: 100%;
`;

export const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
`;

export const FilterSelect = styled.select`
  padding: 14px 48px 14px 18px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  background: var(--color-surface);
  color: var(--color-text);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  option {
    padding: 12px;
    font-size: 0.9rem;
    background: var(--color-surface);
    color: var(--color-text);
  }

  &::-ms-expand {
    display: none;
  }
`;

export const FilterInput = styled.input`
  padding: 14px 18px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--color-surface);
  color: var(--color-text);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

export const RangeSeparator = styled.span`
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  padding: 8px;
  background: var(--color-background-secondary);
  border-radius: 8px;
  border: 1px solid var(--color-border);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 28px;
  border-top: 1px solid var(--color-border);
  margin-top: 28px;
  background: linear-gradient(
    135deg,
    var(--color-surface) 0%,
    var(--color-background-secondary) 100%
  );

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding-top: 20px;
    margin-top: 20px;
  }
`;

export const ActiveFiltersBadge = styled.span`
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  color: white;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  position: relative;
  overflow: hidden;
  min-height: 52px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
      : `
    background: var(--color-surface);
    color: var(--color-text-secondary);
    border: 2px solid var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: var(--color-background-secondary);
      border-color: var(--color-border-dark);
      color: var(--color-text);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 18px 24px;
    font-size: 1rem;
    min-height: 56px;
  }
`;
