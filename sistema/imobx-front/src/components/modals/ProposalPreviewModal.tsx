import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdContentCopy,
  MdCheck,
  MdDownload,
  MdPhone,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import type { GenerateProposalResponse } from '../../services/aiAssistantApi';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 8px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
`;

const ProposalHtml = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    padding: 16px;
  }

  /* Estilos para HTML renderizado */
  h1,
  h2,
  h3 {
    color: ${props => props.theme.colors.text};
    margin-top: 0;
  }

  p {
    margin-bottom: 12px;
  }

  ul,
  ol {
    padding-left: 20px;
  }
`;

const SummaryBox = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const KeyPointsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const KeyPoint = styled.li`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const RecommendationsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Recommendation = styled.li`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.backgroundSecondary};
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

interface ProposalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: GenerateProposalResponse;
}

export const ProposalPreviewModal: React.FC<ProposalPreviewModalProps> = ({
  isOpen,
  onClose,
  proposal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal.proposalText);
      setCopied(true);
      toast.success('Proposta copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar proposta');
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implementar download de PDF
    toast.info('Funcionalidade de PDF em desenvolvimento');
  };

  // const handleSendEmail = () => {
  //   // TODO: Implementar envio por email
  //   toast.info('Funcionalidade de email em desenvolvimento');
  // };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(proposal.proposalText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Proposta Comercial Gerada</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ProposalHtml
            dangerouslySetInnerHTML={{ __html: proposal.proposalHtml }}
          />

          {proposal.executiveSummary && (
            <SummaryBox>
              <SummaryTitle>Resumo Executivo</SummaryTitle>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                }}
              >
                {proposal.executiveSummary}
              </p>
            </SummaryBox>
          )}

          {proposal.keyPoints && proposal.keyPoints.length > 0 && (
            <SummaryBox>
              <SummaryTitle>Pontos Principais</SummaryTitle>
              <KeyPointsList>
                {proposal.keyPoints.map((point, index) => (
                  <KeyPoint key={index}>{point}</KeyPoint>
                ))}
              </KeyPointsList>
            </SummaryBox>
          )}

          {proposal.recommendations && proposal.recommendations.length > 0 && (
            <SummaryBox>
              <SummaryTitle>Recomendações</SummaryTitle>
              <RecommendationsList>
                {proposal.recommendations.map((rec, index) => (
                  <Recommendation key={index}>{rec}</Recommendation>
                ))}
              </RecommendationsList>
            </SummaryBox>
          )}

          {proposal.suggestedValue && (
            <SummaryBox>
              <SummaryTitle>Valor Sugerido</SummaryTitle>
              <p
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                }}
              >
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(proposal.suggestedValue)}
              </p>
            </SummaryBox>
          )}
        </ModalBody>

        <ModalFooter>
          <Button $variant='secondary' onClick={onClose}>
            Fechar
          </Button>
          <Button $variant='secondary' onClick={handleCopy}>
            {copied ? (
              <>
                <MdCheck size={18} />
                Copiado!
              </>
            ) : (
              <>
                <MdContentCopy size={18} />
                Copiar Texto
              </>
            )}
          </Button>
          <Button $variant='secondary' onClick={handleDownloadPDF}>
            <MdDownload size={18} />
            Exportar PDF
          </Button>
          {/* <Button $variant="secondary" onClick={handleSendEmail}>
            <MdEmail size={18} />
            Enviar por Email
          </Button> */}
          <Button $variant='primary' onClick={handleSendWhatsApp}>
            <MdPhone size={18} />
            Enviar por WhatsApp
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  );
};
