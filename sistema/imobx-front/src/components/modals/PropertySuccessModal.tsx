import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalContent,
  SuccessIcon,
  SuccessMessage,
  ActionButtons,
  PrimaryButton,
  SecondaryButton,
  KeyIcon,
  PropertyIcon,
} from './PropertySuccessModalStyles';

interface PropertySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  propertyId: string | null;
}

export const PropertySuccessModal: React.FC<PropertySuccessModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  propertyId,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Sempre redirecionar para lista ao fechar (replace para evitar voltar ao formulário)
    navigate('/properties', { replace: true });
    onClose();
  };

  const handleCreateKey = () => {
    if (propertyId) {
      // Disparar evento customizado para mostrar card de criar chave na lista
      const event = new CustomEvent('showCreateKeyCard', {
        detail: { propertyId },
      });
      window.dispatchEvent(event);
    }
    handleClose();
  };

  const handleGoToProperties = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <SuccessIcon>{isEditMode ? '✏️' : '🏠'}</SuccessIcon>
          <ModalTitle>
            {isEditMode ? 'Propriedade Atualizada!' : 'Propriedade Criada!'}
          </ModalTitle>
        </ModalHeader>

        <ModalContent>
          <SuccessMessage>
            {isEditMode ? (
              <>
                <p>A propriedade foi atualizada com sucesso!</p>
                <p>Todas as alterações foram salvas.</p>
              </>
            ) : (
              <>
                <p>Sua propriedade foi criada com sucesso!</p>
                <p>
                  Agora você pode gerenciar suas chaves e começar a trabalhar
                  com ela.
                </p>
              </>
            )}
          </SuccessMessage>

          {!isEditMode && (
            <div
              style={{
                background: 'var(--color-background-secondary)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <KeyIcon>🔑</KeyIcon>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 2px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                    }}
                  >
                    Próximo Passo Sugerido
                  </h4>
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Cadastre uma chave para esta propriedade
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.4',
                    }}
                  >
                    As chaves são essenciais para o controle de acesso e
                    gerenciamento de visitas. Você pode cadastrar agora ou fazer
                    isso mais tarde.
                  </p>
                </div>
              </div>
            </div>
          )}

          <ActionButtons>
            {!isEditMode && (
              <PrimaryButton onClick={handleCreateKey}>
                <KeyIcon>🔑</KeyIcon>
                Cadastrar Chave
              </PrimaryButton>
            )}

            <SecondaryButton onClick={handleGoToProperties}>
              <PropertyIcon>🏠</PropertyIcon>
              {isEditMode ? 'Ver Propriedades' : 'Ver Propriedades'}
            </SecondaryButton>
          </ActionButtons>

          <div
            style={{
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Fechar
            </button>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PropertySuccessModal;
