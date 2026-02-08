import React, { useState } from 'react';
import { MdClose, MdCheckCircle } from 'react-icons/md';
import { EditOutlined } from '@ant-design/icons';
import type {
  FinancialApprovalRequest,
  ApproveRequestData,
} from '../../types/financial';
import {
  formatCurrency,
  getNumericValue,
  formatCurrencyValue,
} from '../../utils/masks';
import { CurrencyInput } from './CurrencyInput';
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
  Section,
  SectionTitle,
  SectionDescription,
  ApprovalActionButton,
} from '../../styles/pages/FinancialApprovalsPageStyles';
import { Button } from '../../styles/pages/ClientFormPageStyles';

interface ApproveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproved: () => void;
  approval: FinancialApprovalRequest;
}

export const ApproveApprovalModal: React.FC<ApproveApprovalModalProps> = ({
  isOpen,
  onClose,
  onApproved,
  approval,
}) => {
  const { approveRequest, isLoading } = useFinancialApprovals();
  const [allowEdit, setAllowEdit] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Para aprovações de vistoria, não há baseValue/commissionValue, então usar amount
  const initialBaseValue =
    approval.approvalType === 'inspection'
      ? typeof approval.amount === 'string'
        ? approval.amount
        : (approval.amount || 0).toString()
      : (approval.baseValue || 0).toString();
  const [editedBaseValue, setEditedBaseValue] = useState(
    formatCurrency(initialBaseValue.replace(/\D/g, ''))
  );
  const [editedCommissionValue, setEditedCommissionValue] = useState(
    approval.approvalType === 'inspection'
      ? ''
      : formatCurrency(
          (approval.commissionValue || 0).toString().replace(/\D/g, '')
        )
  );
  const [financialNotes, setFinancialNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Para aprovações de vistoria, não calcular valores financeiros
  const baseValueNum =
    approval.approvalType === 'inspection'
      ? editedBaseValue
        ? getNumericValue(editedBaseValue)
        : typeof approval.amount === 'string'
          ? parseFloat(approval.amount)
          : (approval as any).amount || 0
      : editedBaseValue
        ? getNumericValue(editedBaseValue)
        : approval.baseValue || 0;

  const commissionValueNum =
    approval.approvalType === 'inspection'
      ? 0
      : editedCommissionValue
        ? getNumericValue(editedCommissionValue)
        : approval.commissionValue || 0;

  // Se editou baseValue, recalcular commission automaticamente se não editou commission
  let finalCommissionValue = commissionValueNum;
  if (
    approval.approvalType !== 'inspection' &&
    allowEdit &&
    editedBaseValue &&
    !editedCommissionValue &&
    approval.commissionPercentage
  ) {
    finalCommissionValue = (baseValueNum * approval.commissionPercentage) / 100;
  }

  // Calcular lucro da empresa e valor líquido baseados no valor editado
  const profitValue =
    approval.approvalType === 'inspection'
      ? 0
      : (approval.companyProfitPercentage || 0) > 0
        ? (baseValueNum * (approval.companyProfitPercentage || 0)) / 100
        : 0;
  const netValue =
    approval.approvalType === 'inspection'
      ? baseValueNum
      : baseValueNum - finalCommissionValue;

  const handleConfirmSubmit = async () => {
    // Validações
    const newErrors: { [key: string]: string } = {};

    if (allowEdit) {
      if (!editedBaseValue || getNumericValue(editedBaseValue) <= 0) {
        newErrors.baseValue =
          approval.approvalType === 'inspection'
            ? 'Valor da vistoria deve ser maior que zero'
            : 'Valor base deve ser maior que zero';
      }
      if (
        approval.approvalType !== 'inspection' &&
        (!editedCommissionValue || getNumericValue(editedCommissionValue) <= 0)
      ) {
        newErrors.commission = 'Valor da comissão deve ser maior que zero';
      }

      const numericBaseValue = getNumericValue(editedBaseValue);
      if (approval.approvalType !== 'inspection') {
        const numericCommissionValue = getNumericValue(editedCommissionValue);

        if (numericCommissionValue > numericBaseValue) {
          newErrors.commission = 'Comissão não pode ser maior que o valor base';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowConfirmModal(false);
      return;
    }

    setErrors({});
    setShowConfirmModal(false);

    try {
      const data: ApproveRequestData = {
        ...(allowEdit && {
          editedBaseValue: getNumericValue(editedBaseValue),
          ...(approval.approvalType !== 'inspection' && {
            editedCommissionValue: getNumericValue(editedCommissionValue),
          }),
        }),
        ...(financialNotes && { financialNotes }),
      };

      await approveRequest(approval.id, data);
      onApproved();
    } catch (error: any) {
      console.error('Erro ao aprovar solicitação:', error);
    }
  };

  const handleSubmit = async () => {
    // Para aprovações de vistoria, aprovar diretamente sem confirmação extra
    if (approval.approvalType === 'inspection') {
      await handleConfirmSubmit();
      return;
    }
    // Para aprovações financeiras, mostrar modal de confirmação
    setShowConfirmModal(true);
  };

  const handleToggleEdit = () => {
    setAllowEdit(!allowEdit);
    if (!allowEdit) {
      // Ao ativar edição, resetar para valores originais
      if (approval.approvalType === 'inspection') {
        const amountValue =
          typeof approval.amount === 'string'
            ? approval.amount
            : (approval as any).amount || 0;
        setEditedBaseValue(
          formatCurrency(amountValue.toString().replace(/\D/g, ''))
        );
        setEditedCommissionValue('');
      } else {
        setEditedBaseValue(
          formatCurrency(
            (approval.baseValue || 0).toString().replace(/\D/g, '')
          )
        );
        setEditedCommissionValue(
          formatCurrency(
            (approval.commissionValue || 0).toString().replace(/\D/g, '')
          )
        );
      }
    }
    setErrors({});
  };

  // Se o modal de confirmação estiver aberto (e não for aprovação de vistoria), mostrar apenas ele
  if (showConfirmModal && approval.approvalType !== 'inspection') {
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
            maxHeight: '25vh',
            margin: '0 auto',
          }}
        >
          <ModalHeader>
            <ModalTitle>
              <MdCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
              Confirmar Aprovação
            </ModalTitle>
            <CloseButton
              onClick={() => !isLoading && setShowConfirmModal(false)}
            >
              <MdClose />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <MdCheckCircle
                style={{
                  fontSize: '2rem',
                  color: '#10b981',
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
                Confirmar Aprovação
              </h3>
              <p
                style={{
                  margin: '0 0 3px 0',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                }}
              >
                {approval.approvalType === 'inspection'
                  ? `Deseja realmente aprovar esta solicitação de vistoria?`
                  : `Deseja realmente aprovar esta solicitação de aprovação financeira?`}
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
              }}
              disabled={isLoading}
            >
              <MdCheckCircle />
              {isLoading ? 'Aprovando...' : 'Confirmar Aprovação'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay
      onClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <ModalContent
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '700px',
          width: '90%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
            {approval.approvalType === 'inspection'
              ? 'Aprovar Solicitação de Vistoria'
              : 'Aprovar Solicitação de Aprovação Financeira'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody style={{ padding: '20px 24px' }}>
          {/* Destaque para informações principais */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                approval.approvalType === 'inspection' ? '1fr' : '1fr 1fr',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {approval.approvalType === 'inspection' ? (
              <>
                <div
                  style={{
                    padding: '12px 14px',
                    background:
                      'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#0284c7',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Vistoria
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#0c4a6e',
                    }}
                  >
                    {approval.inspectionTitle || 'Vistoria sem título'}
                  </div>
                  {approval.propertyCode && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#075985',
                        marginTop: '6px',
                      }}
                    >
                      Código: {approval.propertyCode}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: '12px 14px',
                    background:
                      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: '8px',
                    border: '1px solid #22c55e',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#16a34a',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Solicitante
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#14532d',
                    }}
                  >
                    {approval.requesterName || 'Não informado'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    padding: '12px 14px',
                    background:
                      'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#0284c7',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Propriedade
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#0c4a6e',
                    }}
                  >
                    {approval.property?.title || 'Propriedade não informada'}
                  </div>
                  {approval.property?.code && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#075985',
                        marginTop: '6px',
                      }}
                    >
                      Código: {approval.property.code}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#075985',
                      marginTop: '6px',
                      padding: '3px 8px',
                      background: 'rgba(14, 165, 233, 0.1)',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {approval.type === 'sale' ? 'Venda' : 'Aluguel'}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px 14px',
                    background:
                      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: '8px',
                    border: '1px solid #22c55e',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#16a34a',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Corretor
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#14532d',
                    }}
                  >
                    {approval.requestedBy?.name || 'Não informado'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Informações adicionais */}
          {approval.notes && (
            <Section style={{ marginBottom: '20px' }}>
              <div
                style={{
                  padding: '10px 12px',
                  background: '#fff7ed',
                  borderRadius: '8px',
                  borderLeft: '3px solid #f59e0b',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#92400e',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {approval.approvalType === 'inspection'
                    ? 'Observações'
                    : 'Observações do Corretor'}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#78350f',
                    fontStyle: 'italic',
                  }}
                >
                  "{approval.notes}"
                </div>
              </div>
            </Section>
          )}

          {/* Destaque para o valor principal */}
          <Section style={{ marginBottom: '20px' }}>
            <SectionTitle
              style={{
                marginBottom: '12px',
                fontSize: '0.95rem',
                fontWeight: 600,
              }}
            >
              {approval.approvalType === 'inspection'
                ? 'Valor da Vistoria'
                : 'Valores Financeiros'}{' '}
              {allowEdit && '(Editáveis)'}
            </SectionTitle>
            {approval.approvalType !== 'inspection' && (
              <SectionDescription
                style={{
                  marginBottom: '12px',
                  fontSize: '0.8rem',
                  color: '#64748b',
                }}
              >
                {allowEdit
                  ? 'Você pode ajustar os valores antes de aprovar. Os valores serão recalculados automaticamente.'
                  : 'Estes são os valores calculados automaticamente. Clique em "Editar Valores" se precisar ajustar.'}
              </SectionDescription>
            )}

            {/* Card destacado para o valor principal */}
            <div
              style={{
                padding: '16px',
                background:
                  approval.approvalType === 'inspection'
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                    : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: '10px',
                border:
                  approval.approvalType === 'inspection'
                    ? '2px solid #f59e0b'
                    : '2px solid #3b82f6',
                marginBottom: '12px',
              }}
            >
              <FormField style={{ marginBottom: 0 }}>
                <FormLabel
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color:
                      approval.approvalType === 'inspection'
                        ? '#92400e'
                        : '#1e40af',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {approval.approvalType === 'inspection'
                    ? 'Valor da Vistoria'
                    : 'Valor Base'}
                </FormLabel>
                {allowEdit ? (
                  <>
                    <CurrencyInput
                      value={editedBaseValue}
                      onChange={setEditedBaseValue}
                      placeholder='R$ 0,00'
                    />
                    {errors.baseValue && (
                      <ErrorMessage>{errors.baseValue}</ErrorMessage>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      padding: '14px 18px',
                      background: 'white',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color:
                        approval.approvalType === 'inspection'
                          ? '#b45309'
                          : '#1e40af',
                      textAlign: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {approval.approvalType === 'inspection'
                      ? formatCurrencyValue(
                          typeof approval.amount === 'string'
                            ? parseFloat(approval.amount)
                            : (approval as any).amount || 0
                        )
                      : formatCurrencyValue(approval.baseValue || 0)}
                  </div>
                )}
              </FormField>
            </div>

            {approval.approvalType !== 'inspection' && (
              <FormField>
                <FormLabel>
                  Comissão ({approval.commissionPercentage || 0}%)
                </FormLabel>
                {allowEdit ? (
                  <>
                    <CurrencyInput
                      value={editedCommissionValue}
                      onChange={setEditedCommissionValue}
                      placeholder='R$ 0,00'
                    />
                    {errors.commission && (
                      <ErrorMessage>{errors.commission}</ErrorMessage>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'var(--color-background-secondary)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#10b981',
                    }}
                  >
                    {formatCurrencyValue(approval.commissionValue || 0)}
                  </div>
                )}
              </FormField>
            )}

            {approval.approvalType !== 'inspection' && (
              <>
                <FormField>
                  <FormLabel>
                    Lucro da Empresa ({approval.companyProfitPercentage || 0}%)
                  </FormLabel>
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'var(--color-background-secondary)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#6366f1',
                    }}
                  >
                    {formatCurrencyValue(profitValue)}
                  </div>
                </FormField>

                <FormField>
                  <FormLabel>Valor Líquido</FormLabel>
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'var(--color-background-secondary)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#3b82f6',
                    }}
                  >
                    {formatCurrencyValue(netValue)}
                  </div>
                </FormField>
              </>
            )}

            {!allowEdit && approval.approvalType === 'inspection' && (
              <ApprovalActionButton
                $variant='edit'
                onClick={handleToggleEdit}
                style={{ marginTop: '8px' }}
              >
                <EditOutlined />
                Editar Valor
              </ApprovalActionButton>
            )}
            {!allowEdit && approval.approvalType !== 'inspection' && (
              <ApprovalActionButton
                $variant='edit'
                onClick={handleToggleEdit}
                style={{ marginTop: '8px' }}
              >
                <EditOutlined />
                Editar Valores
              </ApprovalActionButton>
            )}
          </Section>

          <Section>
            <FormField>
              <FormLabel>Observações do Financeiro (Opcional)</FormLabel>
              <FormTextarea
                value={financialNotes}
                onChange={e => setFinancialNotes(e.target.value)}
                placeholder='Adicione observações sobre a aprovação...'
              />
            </FormField>
          </Section>
        </ModalBody>

        <ModalFooter style={{ padding: '12px 24px' }}>
          <Button
            onClick={onClose}
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            $variant='primary'
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              fontSize: '0.875rem',
            }}
            disabled={isLoading}
          >
            <MdCheckCircle />
            {isLoading
              ? 'Aprovando...'
              : approval.approvalType === 'inspection'
                ? 'Confirmar Aprovação'
                : 'Aprovar Solicitação'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
