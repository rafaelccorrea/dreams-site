import React, { useState } from 'react';
import { MdClose, MdCancel } from 'react-icons/md';
import type {
  FinancialApprovalRequest,
  RejectRequestData,
} from '../../types/financial';
import { formatCurrency } from '../../types/financial';
import { useFinancialApprovals } from '../../hooks/useFinancialApprovals';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormField,
  FormLabel,
  FormTextarea,
  ErrorMessage,
  InfoRow,
  InfoLabel,
  InfoValue,
  Section,
  SectionTitle,
  SectionDescription,
} from '../../styles/pages/FinancialApprovalsPageStyles';
import { Button } from '../../styles/pages/ClientFormPageStyles';

interface RejectApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRejected: () => void;
  approval: FinancialApprovalRequest;
}

export const RejectApprovalModal: React.FC<RejectApprovalModalProps> = ({
  isOpen,
  onClose,
  onRejected,
  approval,
}) => {
  const { rejectRequest, isLoading } = useFinancialApprovals();
  const [financialNotes, setFinancialNotes] = useState('');
  const [error, setError] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!isOpen) return null;

  const handleConfirmSubmit = async () => {
    // Validação: motivo é obrigatório
    if (!financialNotes.trim()) {
      setError('Obrigatório informar motivo da recusa');
      setShowConfirmModal(false);
      return;
    }

    setError('');
    setShowConfirmModal(false);

    try {
      const data: RejectRequestData = {
        financialNotes: financialNotes.trim(),
      };

      await rejectRequest(approval.id, data);
      onRejected();
    } catch (error: any) {
      console.error('Erro ao recusar solicitação:', error);
    }
  };

  const handleSubmit = () => {
    // Validação: motivo é obrigatório
    if (!financialNotes.trim()) {
      setError('Obrigatório informar motivo da recusa');
      return;
    }
    setShowConfirmModal(true);
  };

  // Se o modal de confirmação estiver aberto, mostrar apenas ele
  if (showConfirmModal) {
    return (
      <ModalOverlay
        onClick={() => !isLoading && setShowConfirmModal(false)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '10vh',
        }}
      >
        <ModalContent
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '1000px',
            width: '95%',
            maxHeight: '35vh',
            margin: '0 auto',
          }}
        >
          <ModalHeader>
            <ModalTitle>
              <MdCancel style={{ color: '#ef4444', fontSize: '1.5rem' }} />
              Confirmar Recusa
            </ModalTitle>
            <CloseButton
              onClick={() => !isLoading && setShowConfirmModal(false)}
            >
              <MdClose />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <MdCancel
                style={{
                  fontSize: '2rem',
                  color: '#ef4444',
                  marginBottom: '6px',
                }}
              />
              <h3
                style={{
                  margin: '0 0 6px 0',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                }}
              >
                Confirmar Recusa
              </h3>
              <p
                style={{
                  margin: '0 0 3px 0',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                {approval.approvalType === 'inspection'
                  ? `Deseja realmente recusar esta solicitação de vistoria?`
                  : `Deseja realmente recusar esta solicitação de aprovação financeira?`}
              </p>
              {approval.approvalType === 'inspection' && (
                <p
                  style={{
                    margin: '3px 0',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                  }}
                >
                  {approval.inspectionTitle || 'Vistoria sem título'}
                </p>
              )}
              {approval.property?.title && (
                <p
                  style={{
                    margin: '3px 0',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                  }}
                >
                  {approval.property.title}
                  {approval.property.code && ` (${approval.property.code})`}
                </p>
              )}
              <div
                style={{
                  margin: '6px 0',
                  padding: '8px',
                  background: 'var(--color-info-background)',
                  borderRadius: '8px',
                  textAlign: 'left',
                }}
              >
                <p
                  style={{
                    margin: '0 0 3px 0',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontSize: '0.8rem',
                  }}
                >
                  Motivo da Recusa:
                </p>
                <p
                  style={{
                    margin: '0',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {financialNotes}
                </p>
              </div>
              <p
                style={{
                  margin: '6px 0 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setShowConfirmModal(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              $variant='primary'
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
              }}
              disabled={isLoading}
            >
              <MdCancel />
              {isLoading ? 'Recusando...' : 'Confirmar Recusa'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '1200px',
          width: '95%',
        }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdCancel style={{ color: '#ef4444', fontSize: '1.5rem' }} />
            Recusar Solicitação de Aprovação Financeira
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>Informações da Solicitação</SectionTitle>
            <InfoRow>
              <InfoLabel>Tipo:</InfoLabel>
              <InfoValue>
                {approval.type === 'sale' ? 'Venda' : 'Aluguel'}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Propriedade:</InfoLabel>
              <InfoValue>
                {approval.property?.title || 'Propriedade não informada'}
                {approval.property?.code && ` (${approval.property.code})`}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                {approval.approvalType === 'inspection'
                  ? 'Solicitante:'
                  : 'Corretor:'}
              </InfoLabel>
              <InfoValue>
                {approval.approvalType === 'inspection'
                  ? approval.requesterName || 'Não informado'
                  : approval.requestedBy?.name || 'Não informado'}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Valor:</InfoLabel>
              <InfoValue>
                {approval.approvalType === 'inspection'
                  ? formatCurrency(
                      typeof approval.amount === 'string'
                        ? parseFloat(approval.amount)
                        : (approval as any).amount || 0
                    )
                  : formatCurrency(approval.baseValue || 0)}
              </InfoValue>
            </InfoRow>
            {approval.notes && (
              <InfoRow>
                <InfoLabel>Observações do Corretor:</InfoLabel>
                <InfoValue style={{ fontStyle: 'italic' }}>
                  "{approval.notes}"
                </InfoValue>
              </InfoRow>
            )}
          </Section>

          <Section>
            <FormField>
              <FormLabel>
                Motivo da Recusa <span style={{ color: '#ef4444' }}>*</span>
              </FormLabel>
              <FormTextarea
                $hasError={!!error}
                value={financialNotes}
                onChange={e => {
                  setFinancialNotes(e.target.value);
                  if (error) setError('');
                }}
                placeholder='Informe o motivo da recusa desta solicitação...'
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <SectionDescription
                style={{ marginTop: '8px', fontSize: '0.875rem' }}
              >
                ⚠️ Obrigatório informar motivo. Esta informação será enviada ao
                corretor.
              </SectionDescription>
            </FormField>
          </Section>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            $variant='primary'
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
            }}
            disabled={isLoading}
          >
            <MdCancel />
            {isLoading ? 'Recusando...' : 'Confirmar Recusa'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
