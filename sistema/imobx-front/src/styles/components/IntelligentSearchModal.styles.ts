import styled from 'styled-components';

export const ModalContent = styled.div`
  padding: 20px;
`;

export const InfoText = styled.div`
  margin-bottom: 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.6;

  strong {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

export const UnderstandButton = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;
