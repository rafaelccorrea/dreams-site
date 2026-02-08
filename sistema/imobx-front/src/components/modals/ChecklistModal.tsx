import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdHome,
  MdPerson,
  MdAdd,
  MdDelete,
  MdSchedule,
} from 'react-icons/md';
import { useChecklists } from '../../hooks/useChecklists';
import { propertyApi } from '../../services/propertyApi';
import { clientsApi } from '../../services/clientsApi';
import { toast } from 'react-toastify';
import { Spinner } from '../common/Spinner';
import type {
  ChecklistType,
  CreateChecklistDto,
  ChecklistItemDto,
} from '../../types/checklist.types';
import { ChecklistTypeLabels } from '../../types/checklist.types';

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
  max-width: 800px;
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
  transition: all 0.2s ease;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        &:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid #ef4444;
        &:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `;
    }
    return `
      background: ${props.theme.colors.surface};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover {
        background: ${props.theme.colors.border};
      }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ItemCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const ItemTitleInput = styled(Input)`
  flex: 1;
`;

const DeleteItemButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const AddItemButton = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPropertyId?: string;
  initialClientId?: string;
  checklistId?: string;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPropertyId,
  initialClientId,
  checklistId,
}) => {
  const { createChecklist, updateChecklist, fetchChecklistById } =
    useChecklists();
  const [propertyId, setPropertyId] = useState<string>(initialPropertyId || '');
  const [clientId, setClientId] = useState<string>(initialClientId || '');
  const [type, setType] = useState<ChecklistType>('sale');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<ChecklistItemDto[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProperties();
      loadClients();
      if (checklistId) {
        loadChecklist();
      } else {
        resetForm();
      }
    }
  }, [isOpen, checklistId]);

  const resetForm = () => {
    setPropertyId(initialPropertyId || '');
    setClientId(initialClientId || '');
    setType('sale');
    setNotes('');
    setItems([]);
  };

  const loadChecklist = async () => {
    if (!checklistId) return;
    try {
      setLoading(true);
      const checklist = await fetchChecklistById(checklistId);
      setPropertyId(checklist.propertyId);
      setClientId(checklist.clientId);
      setType(checklist.type);
      setNotes(checklist.notes || '');
      setItems(
        checklist.items.map(item => ({
          title: item.title,
          description: item.description,
          status: item.status,
          requiredDocuments: item.requiredDocuments,
          estimatedDays: item.estimatedDays,
          order: item.order,
          notes: item.notes,
        }))
      );
    } catch (error) {
      toast.error('Erro ao carregar checklist');
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const response = await propertyApi.getProperties({});
      const list = Array.isArray(response)
        ? response
        : response?.properties ||
          response?.items ||
          response?.data ||
          response?.results ||
          [];
      setProperties(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const response = await clientsApi.getClients({});
      const list = Array.isArray(response) ? response : response?.data || [];
      setClients(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        title: '',
        description: '',
        status: 'pending',
        order: items.length + 1,
        estimatedDays: undefined,
        requiredDocuments: [],
        notes: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(
      items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i + 1 }))
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof ChecklistItemDto,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (!propertyId || !clientId) {
      toast.error('Selecione uma propriedade e um cliente');
      return;
    }

    try {
      setLoading(true);
      const data: CreateChecklistDto = {
        propertyId,
        clientId,
        type,
        notes: notes || undefined,
        items: items.length > 0 ? items : undefined,
      };

      if (checklistId) {
        const updated = await updateChecklist(checklistId, {
          type,
          notes: notes || undefined,
          items:
            items.length > 0
              ? items.map((item, index) => ({
                  ...item,
                  order: index + 1,
                }))
              : undefined,
        });
        if (!updated) {
          throw new Error('Erro ao atualizar checklist');
        }
        toast.success('Checklist atualizado com sucesso!');
      } else {
        await createChecklist(data);
      }

      onSuccess?.();
      onClose();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar checklist');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            📋 {checklistId ? 'Editar' : 'Criar'} Checklist
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
            <Label>Tipo *</Label>
            <Select
              value={type}
              onChange={e => setType(e.target.value as ChecklistType)}
            >
              <option value='sale'>{ChecklistTypeLabels.sale}</option>
              <option value='rental'>{ChecklistTypeLabels.rental}</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Observações Gerais</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder='Adicione observações sobre este checklist...'
            />
          </FormGroup>

          <FormGroup>
            <Label>Itens Personalizados (Opcional)</Label>
            <InfoText>
              Se não informar itens, será criado um checklist padrão baseado no
              tipo selecionado.
            </InfoText>
            <ItemsSection>
              {items.map((item, index) => (
                <ItemCard key={index}>
                  <ItemHeader>
                    <ItemTitleInput
                      value={item.title}
                      onChange={e =>
                        handleItemChange(index, 'title', e.target.value)
                      }
                      placeholder='Título do item'
                    />
                    <DeleteItemButton onClick={() => handleRemoveItem(index)}>
                      <MdDelete size={18} />
                    </DeleteItemButton>
                  </ItemHeader>
                  <Textarea
                    value={item.description || ''}
                    onChange={e =>
                      handleItemChange(index, 'description', e.target.value)
                    }
                    placeholder='Descrição (opcional)'
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Input
                      type='number'
                      value={item.estimatedDays || ''}
                      onChange={e =>
                        handleItemChange(
                          index,
                          'estimatedDays',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      placeholder='Prazo estimado (dias)'
                      style={{ width: '150px' }}
                    />
                    <Input
                      value={item.notes || ''}
                      onChange={e =>
                        handleItemChange(index, 'notes', e.target.value)
                      }
                      placeholder='Observações do item'
                      style={{ flex: 1 }}
                    />
                  </div>
                </ItemCard>
              ))}
              <AddItemButton onClick={handleAddItem}>
                <MdAdd size={18} />
                Adicionar Item
              </AddItemButton>
            </ItemsSection>
          </FormGroup>

          <ButtonGroup>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              $variant='primary'
              onClick={handleSubmit}
              disabled={loading || !propertyId || !clientId}
            >
              {loading ? (
                <>
                  <Spinner size={16} />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </ButtonGroup>
        </ModalBody>
      </Modal>
    </ModalOverlay>
  );
};
