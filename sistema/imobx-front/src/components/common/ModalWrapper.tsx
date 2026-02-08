import React from 'react';
import { ModalPadrão } from './ModalPadrão';
import { ModalButton } from './ModalButton';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Wrapper para facilitar a migração de modais existentes
 * Mantém a mesma interface do ModalPadrão mas com nome mais familiar
 */
export const ModalWrapper: React.FC<ModalWrapperProps> = props => {
  return <ModalPadrão {...props} />;
};

export { ModalButton };
export default ModalWrapper;
