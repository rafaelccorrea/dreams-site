import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
  MdWarning,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdLocationOn,
} from 'react-icons/md';
import type { SimilarCondominium } from '../../types/condominium';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
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
    max-width: 90%;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundHover};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const WarningIcon = styled.div<{ $isVerySimilar?: boolean }>`
  width: 64px;
  height: 64px;
  background: ${props => (props.$isVerySimilar ? '#fef2f2' : '#fffbeb')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: ${props => (props.$isVerySimilar ? '#dc2626' : '#f59e0b')};
  font-size: 2rem;
`;

const WarningTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin: 0 0 8px 0;
`;

const WarningMessage = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const SimilarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const SimilarItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}20;
  }
`;

const SimilarItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const SimilarItemName = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  margin-bottom: 4px;
`;

const SimilarityScore = styled.span<{ $score: number }>`
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.$score >= 80) return '#fef2f2';
    if (props.$score >= 70) return '#fffbeb';
    return '#f0f9ff';
  }};
  color: ${props => {
    if (props.$score >= 80) return '#dc2626';
    if (props.$score >= 70) return '#f59e0b';
    return '#3b82f6';
  }};
`;

const SimilarItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryHover || props.theme.colors.primaryDark};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;

        &:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.error}40;
        }
      `;
    } else {
      return `
        background: transparent;
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};

        &:hover {
          background: ${props.theme.colors.backgroundHover};
          border-color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface SimilarityWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onCancel: () => void;
  similarCondominiums: SimilarCondominium[];
  condominiumName: string;
}

export const SimilarityWarningModal: React.FC<SimilarityWarningModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  onCancel,
  similarCondominiums,
  condominiumName,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdWarning size={24} />
            Condomínios Similares Encontrados
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <WarningIcon
            $isVerySimilar={similarCondominiums.some(
              c => c.similarityScore >= 80
            )}
          >
            <MdWarning size={32} />
          </WarningIcon>

          <WarningTitle>
            {similarCondominiums.some(c => c.similarityScore >= 80)
              ? 'Atenção! Condomínio Muito Similar Encontrado'
              : 'Atenção!'}
          </WarningTitle>
          <WarningMessage>
            {similarCondominiums.some(c => c.similarityScore >= 80) ? (
              <>
                Encontramos <strong>{similarCondominiums.length}</strong>{' '}
                condomínio(s) <strong>muito idêntico(s)</strong> ao nome{' '}
                <strong>"{condominiumName}"</strong>.
                <br />
                <strong>Deseja realmente criar este condomínio?</strong>{' '}
                Verifique se não está tentando cadastrar um duplicado.
              </>
            ) : (
              <>
                Encontramos <strong>{similarCondominiums.length}</strong>{' '}
                condomínio(s) com nome similar a{' '}
                <strong>"{condominiumName}"</strong>.
                <br />
                Verifique se você não está tentando cadastrar um condomínio
                duplicado.
              </>
            )}
          </WarningMessage>

          <SimilarList>
            {similarCondominiums.map(condominium => (
              <SimilarItem key={condominium.id}>
                <SimilarItemHeader>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 500,
                      }}
                    >
                      Nome do Condomínio
                    </div>
                    <SimilarItemName>{condominium.name}</SimilarItemName>
                  </div>
                  <SimilarityScore $score={condominium.similarityScore}>
                    {condominium.similarityScore}% similar
                  </SimilarityScore>
                </SimilarItemHeader>
                <SimilarItemInfo>
                  <MdLocationOn size={14} />
                  {condominium.address}, {condominium.city} -{' '}
                  {condominium.state}
                </SimilarItemInfo>
                {!condominium.isActive && (
                  <SimilarItemInfo
                    style={{ color: '#ef4444', marginTop: '4px' }}
                  >
                    (Inativo)
                  </SimilarItemInfo>
                )}
              </SimilarItem>
            ))}
          </SimilarList>

          <ModalActions>
            <Button $variant='secondary' onClick={onCancel}>
              <MdCancel />
              Cancelar
            </Button>
            <Button $variant='primary' onClick={onContinue}>
              <MdCheckCircle />
              Continuar Mesmo Assim
            </Button>
          </ModalActions>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};
