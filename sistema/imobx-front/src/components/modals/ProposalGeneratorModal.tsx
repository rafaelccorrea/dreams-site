import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdDescription,
  MdPerson,
  MdHome,
  MdAttachMoney,
  MdInfo,
} from 'react-icons/md';
import { useGenerateProposal } from '../../hooks/useGenerateProposal';
import { clientsApi } from '../../services/clientsApi';
import { propertyApi } from '../../services/propertyApi';
import { toast } from 'react-toastify';
import { Spinner } from '../common/Spinner';

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
  max-width: 700px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const InfoBox = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $loading?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  opacity: ${props => (props.$loading ? 0.7 : 1)};

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.backgroundSecondary};
    }
  `}

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

interface ProposalGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalGenerated: (proposal: any) => void;
  initialPropertyId?: string;
  initialClientId?: string;
}

export const ProposalGeneratorModal: React.FC<ProposalGeneratorModalProps> = ({
  isOpen,
  onClose,
  onProposalGenerated,
  initialPropertyId,
  initialClientId,
}) => {
  const { generate, loading } = useGenerateProposal();
  const [propertyId, setPropertyId] = useState<string>(initialPropertyId || '');
  const [clientId, setClientId] = useState<string>(initialClientId || '');
  const [proposalType, setProposalType] = useState<
    'sale' | 'rental' | 'investment'
  >('sale');
  const [proposedValue, setProposedValue] = useState<string>('');
  const [specialConditions, setSpecialConditions] = useState<string>('');
  const [paymentTerm, setPaymentTerm] = useState<string>('');
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProperties();
      loadClients();
    }
  }, [isOpen]);

  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const response = await propertyApi.getProperties({});
      const list = Array.isArray(response)
        ? response
        : (response &&
            (response.properties ||
              response.items ||
              response.data ||
              response.results)) ||
          [];
      setProperties(Array.isArray(list) ? list : []);
      if (initialPropertyId && !propertyId) {
        setPropertyId(initialPropertyId);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const response = await clientsApi.getClients({
        page: 1,
        limit: 100,
      } as any);
      const list = Array.isArray(response)
        ? response
        : (response &&
            (response.clients ||
              response.items ||
              response.data ||
              response.results)) ||
          [];
      setClients(Array.isArray(list) ? list : []);
      if (initialClientId && !clientId) {
        setClientId(initialClientId);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleGenerate = async () => {
    if (!propertyId || !clientId) {
      toast.error('Selecione uma propriedade e um cliente');
      return;
    }

    const proposalData: any = {
      propertyId,
      clientId,
      proposalType,
    };

    if (proposedValue) {
      proposalData.proposedValue = parseFloat(
        proposedValue.replace(/[^\d,.-]/g, '').replace(',', '.')
      );
    }

    if (specialConditions) {
      proposalData.specialConditions = specialConditions;
    }

    if (paymentTerm) {
      proposalData.paymentTerm = parseInt(paymentTerm);
    }

    const result = await generate(proposalData);
    if (result) {
      onProposalGenerated(result);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdDescription size={20} />
            Gerar Proposta Comercial
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>
              <MdHome size={18} />
              Propriedade *
            </Label>
            {loadingProperties ? (
              <LoadingContainer>
                <Spinner size={20} />
                <span>Carregando propriedades...</span>
              </LoadingContainer>
            ) : (
              <Select
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
                disabled={!!initialPropertyId}
              >
                <option value=''>Selecione uma propriedade</option>
                {properties.map(prop => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title || prop.code || prop.id}
                  </option>
                ))}
              </Select>
            )}
          </FormGroup>

          <FormGroup>
            <Label>
              <MdPerson size={18} />
              Cliente *
            </Label>
            {loadingClients ? (
              <LoadingContainer>
                <Spinner size={20} />
                <span>Carregando clientes...</span>
              </LoadingContainer>
            ) : (
              <Select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                disabled={!!initialClientId}
              >
                <option value=''>Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Tipo de Proposta *</Label>
            <Select
              value={proposalType}
              onChange={e => setProposalType(e.target.value as any)}
            >
              <option value='sale'>Venda</option>
              <option value='rental'>Aluguel</option>
              <option value='investment'>Investimento</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <MdAttachMoney size={18} />
              Valor Proposto (opcional)
            </Label>
            <Input
              type='text'
              placeholder='Ex: 450000'
              value={proposedValue}
              onChange={e => setProposedValue(e.target.value)}
            />
            <InfoBox>
              <MdInfo size={16} />
              Se não informado, será usado o valor da propriedade
            </InfoBox>
          </FormGroup>

          <FormGroup>
            <Label>Prazo de Pagamento em Meses (opcional)</Label>
            <Input
              type='number'
              placeholder='Ex: 120'
              value={paymentTerm}
              onChange={e => setPaymentTerm(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Condições Especiais (opcional)</Label>
            <Textarea
              placeholder='Ex: Financiamento com entrada de 20%'
              value={specialConditions}
              onChange={e => setSpecialConditions(e.target.value)}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button $variant='secondary' onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={handleGenerate}
            disabled={loading || !propertyId || !clientId}
            $loading={loading}
          >
            {loading ? (
              <>
                <Spinner size={16} />
                Gerando...
              </>
            ) : (
              <>
                <MdDescription size={18} />
                Gerar Proposta
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  );
};
