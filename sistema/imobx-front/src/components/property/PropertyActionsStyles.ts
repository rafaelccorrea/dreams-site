import styled from 'styled-components';

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
