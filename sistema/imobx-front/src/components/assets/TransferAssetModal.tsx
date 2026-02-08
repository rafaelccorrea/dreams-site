import React, { useState, useEffect } from 'react';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';
import { useUsers } from '../../hooks/useUsers';
import { useProperties } from '../../hooks/useProperties';
import type { TransferAssetDto, Asset } from '../../types/asset';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

interface TransferAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: TransferAssetDto) => Promise<void>;
  asset: Asset;
}

export const TransferAssetModal: React.FC<TransferAssetModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  asset,
}) => {
  const [formData, setFormData] = useState<TransferAssetDto>({
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { users, getUsers } = useUsers();
  const { properties, getProperties } = useProperties();
  const [userSearch, setUserSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');

  // Carregar users e properties quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      getUsers({ limit: 100 }).catch(err => {
        console.error('Erro ao carregar usuários:', err);
      });
      getProperties({}, { page: 1, limit: 100 }).catch(err => {
        console.error('Erro ao carregar propriedades:', err);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      getUsers({ limit: 100, search: userSearch || undefined }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      getProperties(
        { search: propertySearch || undefined },
        { page: 1, limit: 100 }
      ).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [propertySearch, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onTransfer(formData);
      setFormData({ reason: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={onClose}
      title='Transferir Patrimônio'
      subtitle={`Transferir "${asset.name}" para outro responsável ou propriedade`}
      maxWidth='600px'
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Transferir Para Corretor</Label>
          <Input
            type='text'
            placeholder='Buscar por nome ou email...'
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <Select
            name='toUserId'
            value={formData.toUserId || ''}
            onChange={handleChange}
          >
            <option value=''>Manter atual ou remover responsável</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Transferir Para Propriedade</Label>
          <Input
            type='text'
            placeholder='Buscar por nome, código ou endereço...'
            value={propertySearch}
            onChange={e => setPropertySearch(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <Select
            name='toPropertyId'
            value={formData.toPropertyId || ''}
            onChange={handleChange}
          >
            <option value=''>Manter atual ou remover propriedade</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.title} - {property.code || property.id.slice(0, 8)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Motivo da Transferência *</Label>
          <TextArea
            name='reason'
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder='Descreva o motivo da transferência...'
          />
        </FormGroup>

        <FormGroup>
          <Label>Observações</Label>
          <TextArea
            name='notes'
            value={formData.notes || ''}
            onChange={handleChange}
            placeholder='Observações adicionais...'
          />
        </FormGroup>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}
        >
          <ModalButton variant='secondary' onClick={onClose} type='button'>
            Cancelar
          </ModalButton>
          <ModalButton variant='primary' type='submit' disabled={isLoading}>
            {isLoading ? 'Transferindo...' : 'Transferir'}
          </ModalButton>
        </div>
      </Form>
    </ModalPadrão>
  );
};
