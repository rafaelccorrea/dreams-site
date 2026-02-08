import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdDescription } from 'react-icons/md';

const Button = styled.button<{ $fullWidth?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
  min-height: 44px;

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 11px 18px;
    font-size: 0.875rem;
    min-height: 42px;
  }

  @media (min-width: 1025px) {
    padding: 13px 22px;
    font-size: 0.95rem;
    min-height: 46px;
  }

  @media (max-width: 768px) {
    padding: 11px 18px;
    font-size: 0.875rem;
    min-height: 42px;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

interface ProposalGeneratorButtonProps {
  propertyId?: string;
  clientId?: string;
  variant?: 'button' | 'icon';
  fullWidth?: boolean;
}

export const ProposalGeneratorButton: React.FC<
  ProposalGeneratorButtonProps
> = ({ propertyId, clientId, variant = 'button', fullWidth = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const params = new URLSearchParams();
    if (propertyId) params.set('propertyId', propertyId);
    if (clientId) params.set('clientId', clientId);

    navigate(`/proposals/generate?${params.toString()}`);
  };

  return (
    <Button onClick={handleClick} $fullWidth={fullWidth}>
      <MdDescription size={18} />
      {variant === 'button' && 'Gerar Proposta'}
    </Button>
  );
};
