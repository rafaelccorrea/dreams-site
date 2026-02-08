import React, { useEffect, useState } from 'react';
import { PropertyPublicUpgradeModal } from './modals/PropertyPublicUpgradeModal';

interface UpgradeModalData {
  title: string;
  message: string;
  suggestions?: string[];
}

/**
 * Componente global que escuta eventos de upgrade necessário para propriedades públicas
 * e exibe o modal automaticamente
 */
export const GlobalPropertyPublicUpgradeModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<UpgradeModalData | null>(null);

  useEffect(() => {
    const handleUpgradeRequired = (event: CustomEvent) => {
      const { title, message, suggestions } = event.detail;
      setModalData({
        title: title || 'Upgrade Necessário',
        message:
          message ||
          'Esta funcionalidade está disponível apenas no plano Professional.',
        suggestions,
      });
      setIsModalOpen(true);
    };

    const handleLimitReached = (event: CustomEvent) => {
      const { title, message, suggestions } = event.detail;
      setModalData({
        title: title || 'Limite Atingido',
        message:
          message || 'Limite de propriedades no site Dream Keys atingido.',
        suggestions: suggestions || [
          'Remover algumas propriedades do site Dream Keys',
          'Fazer upgrade para plano Custom (ilimitado)',
        ],
      });
      setIsModalOpen(true);
    };

    // Adicionar listeners para os eventos customizados
    window.addEventListener(
      'property-public-upgrade-required',
      handleUpgradeRequired as EventListener
    );
    window.addEventListener(
      'property-public-limit-reached',
      handleLimitReached as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        'property-public-upgrade-required',
        handleUpgradeRequired as EventListener
      );
      window.removeEventListener(
        'property-public-limit-reached',
        handleLimitReached as EventListener
      );
    };
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  if (!modalData) return null;

  return (
    <PropertyPublicUpgradeModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={modalData.title}
      message={modalData.message}
      suggestions={modalData.suggestions}
    />
  );
};
