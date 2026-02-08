import React, { useState } from 'react';
import { MdClose, MdSend, MdAttachMoney } from 'react-icons/md';
import type {
  ApprovalRequestType,
  CreateApprovalRequestData,
} from '../../types/financial';
import { formatCurrency, getNumericValue } from '../../utils/masks';
import { CurrencyInput } from './CurrencyInput';
import { useFinancialApprovals } from '../../hooks/useFinancialApprovals';
import { toast } from 'react-toastify';
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
  FormInput,
  FormTextarea,
  ErrorMessage,
} from '../../styles/pages/FinancialApprovalsPageStyles';
import { Button } from '../../styles/pages/ClientFormPageStyles';

interface SubmitApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  propertyId: string;
  propertyTitle: string;
  type: ApprovalRequestType;
}

export const SubmitApprovalModal: React.FC<SubmitApprovalModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
  propertyId,
  propertyTitle,
  type,
}) => {
  const { createApproval, isLoading } = useFinancialApprovals();
  const [baseValue, setBaseValue] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Validações
    const newErrors: { [key: string]: string } = {};

    if (!baseValue || getNumericValue(baseValue) <= 0) {
      newErrors.baseValue = 'Valor base deve ser maior que zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const data: CreateApprovalRequestData = {
        type,
        propertyId,
        baseValue: getNumericValue(baseValue),
        notes: notes || undefined,
      };

      await createApproval(data);
      toast.success('Solicitação de aprovação enviada com sucesso!');
      onSubmitted();
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error(error.message || 'Erro ao enviar solicitação de aprovação');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdSend style={{ color: '#6366f1', fontSize: '1.5rem' }} />
            Submeter para Aprovação Financeira
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormField>
            <FormLabel>Propriedade</FormLabel>
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--color-background-secondary)',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--color-text)',
              }}
            >
              {propertyTitle}
            </div>
          </FormField>

          <FormField>
            <FormLabel>Tipo de Operação</FormLabel>
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--color-background-secondary)',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--color-text)',
              }}
            >
              {type === 'sale' ? '💰 Venda' : '🏠 Aluguel'}
            </div>
          </FormField>

          <FormField>
            <FormLabel>Valor Base *</FormLabel>
            <CurrencyInput
              value={baseValue}
              onChange={setBaseValue}
              placeholder='R$ 0,00'
            />
            {errors.baseValue && (
              <ErrorMessage>{errors.baseValue}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel>Observações (Opcional)</FormLabel>
            <FormTextarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder='Adicione observações sobre a operação...'
              rows={4}
            />
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            $variant='primary'
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              border: 'none',
            }}
            disabled={isLoading}
          >
            <MdAttachMoney />
            {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
