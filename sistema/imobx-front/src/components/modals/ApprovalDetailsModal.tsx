import React from 'react';
import { MdClose, MdInfo } from 'react-icons/md';
import dayjs from 'dayjs';
import type { FinancialApprovalRequest } from '../../types/financial';
import {
  formatCurrency,
  getApprovalTypeLabel,
  getApprovalStatusLabel,
  getApprovalStatusColor,
} from '../../types/financial';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  InfoRow,
  InfoLabel,
  InfoValue,
  Section,
  SectionTitle,
} from '../../styles/pages/FinancialApprovalsPageStyles';

interface ApprovalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: FinancialApprovalRequest;
}

export const ApprovalDetailsModal: React.FC<ApprovalDetailsModalProps> = ({
  isOpen,
  onClose,
  approval,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '700px' }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdInfo style={{ color: '#6366f1', fontSize: '1.5rem' }} />
            Detalhes da Solicitação de Aprovação
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>Informações Gerais</SectionTitle>
            <InfoRow>
              <InfoLabel>Tipo:</InfoLabel>
              <InfoValue style={{ fontWeight: 600 }}>
                {approval.type === 'sale' ? '💰 Venda' : '🏠 Aluguel'}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Status:</InfoLabel>
              <InfoValue
                style={{
                  color: getApprovalStatusColor(approval.status),
                  fontWeight: 600,
                }}
              >
                {getApprovalStatusLabel(approval.status)}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                {approval.approvalType === 'inspection'
                  ? 'Vistoria:'
                  : 'Propriedade:'}
              </InfoLabel>
              <InfoValue>
                {approval.approvalType === 'inspection'
                  ? approval.inspectionTitle || 'Vistoria sem título'
                  : approval.property?.title || 'Propriedade não informada'}
              </InfoValue>
            </InfoRow>
            {approval.property?.code && (
              <InfoRow>
                <InfoLabel>Código:</InfoLabel>
                <InfoValue>{approval.property.code}</InfoValue>
              </InfoRow>
            )}
            {approval.approvalType === 'inspection' &&
              approval.propertyCode && (
                <InfoRow>
                  <InfoLabel>Código da Propriedade:</InfoLabel>
                  <InfoValue>{approval.propertyCode}</InfoValue>
                </InfoRow>
              )}
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
            {approval.reviewedBy && (
              <InfoRow>
                <InfoLabel>Analisado por:</InfoLabel>
                <InfoValue>{approval.reviewedBy.name}</InfoValue>
              </InfoRow>
            )}
            {approval.reviewedAt && (
              <InfoRow>
                <InfoLabel>Data da Análise:</InfoLabel>
                <InfoValue>
                  {dayjs(approval.reviewedAt).format('DD/MM/YYYY HH:mm')}
                </InfoValue>
              </InfoRow>
            )}
          </Section>

          <Section>
            <SectionTitle>Valores</SectionTitle>
            {approval.approvalType === 'inspection' ? (
              <InfoRow>
                <InfoLabel>Valor da Vistoria:</InfoLabel>
                <InfoValue style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  {formatCurrency(
                    typeof approval.amount === 'string'
                      ? parseFloat(approval.amount)
                      : (approval as any).amount || 0
                  )}
                </InfoValue>
              </InfoRow>
            ) : (
              <>
                <InfoRow>
                  <InfoLabel>Valor Base:</InfoLabel>
                  <InfoValue style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                    {formatCurrency(approval.baseValue || 0)}
                    {approval.editedBaseValue &&
                      approval.editedBaseValue !== approval.baseValue && (
                        <span
                          style={{
                            marginLeft: '8px',
                            fontSize: '0.875rem',
                            color: '#6366f1',
                            fontStyle: 'italic',
                          }}
                        >
                          (Ajustado para{' '}
                          {formatCurrency(approval.editedBaseValue)})
                        </span>
                      )}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>
                    Comissão ({approval.commissionPercentage}%):
                  </InfoLabel>
                  <InfoValue style={{ fontWeight: 600, color: '#10b981' }}>
                    {formatCurrency(approval.commissionValue)}
                    {approval.editedCommissionValue &&
                      approval.editedCommissionValue !==
                        approval.commissionValue && (
                        <span
                          style={{
                            marginLeft: '8px',
                            fontSize: '0.875rem',
                            color: '#6366f1',
                            fontStyle: 'italic',
                          }}
                        >
                          (Ajustado para{' '}
                          {formatCurrency(approval.editedCommissionValue)})
                        </span>
                      )}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>
                    Lucro da Empresa ({approval.companyProfitPercentage || 0}%):
                  </InfoLabel>
                  <InfoValue style={{ fontWeight: 600, color: '#6366f1' }}>
                    {formatCurrency(approval.companyProfitValue || 0)}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Valor Líquido:</InfoLabel>
                  <InfoValue style={{ fontWeight: 600, color: '#3b82f6' }}>
                    {formatCurrency(approval.companyNetValue || 0)}
                  </InfoValue>
                </InfoRow>
              </>
            )}
          </Section>

          {(approval.notes || approval.financialNotes) && (
            <Section>
              <SectionTitle>Observações</SectionTitle>
              {approval.notes && (
                <>
                  <InfoRow>
                    <InfoLabel>Do Corretor:</InfoLabel>
                    <InfoValue style={{ fontStyle: 'italic' }}>
                      "{approval.notes}"
                    </InfoValue>
                  </InfoRow>
                </>
              )}
              {approval.financialNotes && (
                <>
                  <InfoRow>
                    <InfoLabel>Do Financeiro:</InfoLabel>
                    <InfoValue style={{ fontStyle: 'italic' }}>
                      "{approval.financialNotes}"
                    </InfoValue>
                  </InfoRow>
                </>
              )}
            </Section>
          )}

          <Section>
            <SectionTitle>Cronologia</SectionTitle>
            <InfoRow>
              <InfoLabel>Criado em:</InfoLabel>
              <InfoValue>
                {dayjs(approval.createdAt).format('DD/MM/YYYY HH:mm')}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Atualizado em:</InfoLabel>
              <InfoValue>
                {dayjs(approval.updatedAt).format('DD/MM/YYYY HH:mm')}
              </InfoValue>
            </InfoRow>
          </Section>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
