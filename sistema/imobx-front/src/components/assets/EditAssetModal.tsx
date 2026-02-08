import React, { useState, useEffect } from 'react';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';
import { useUsers } from '../../hooks/useUsers';
import { useProperties } from '../../hooks/useProperties';
import type {
  UpdateAssetDto,
  Asset,
  AssetCategory,
  AssetStatus,
} from '../../types/asset';
import { AssetCategoryOptions, AssetStatusOptions } from '../../types/asset';
import styled from 'styled-components';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
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

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateAssetDto) => Promise<void>;
  asset: Asset;
}

export const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  asset,
}) => {
  const [formData, setFormData] = useState<UpdateAssetDto>({});
  const [isLoading, setIsLoading] = useState(false);
  const { users, getUsers } = useUsers();
  const { properties, getProperties } = useProperties();

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
    if (asset) {
      setFormData({
        name: asset.name,
        description: asset.description,
        category: asset.category,
        status: asset.status,
        value: asset.value,
        serialNumber: asset.serialNumber,
        brand: asset.brand,
        model: asset.model,
        location: asset.location,
        notes: asset.notes,
        assignedToUserId: asset.assignedToUser?.id,
        propertyId: asset.property?.id,
        acquisitionDate: asset.acquisitionDate
          ? asset.acquisitionDate.split('T')[0]
          : undefined,
      });
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
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
      [name]: name === 'value' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={onClose}
      title='Editar Patrimônio'
      subtitle='Atualize os dados do patrimônio'
      maxWidth='800px'
    >
      <Form onSubmit={handleSubmit}>
        <FullWidthField>
          <FormGroup>
            <Label>Nome *</Label>
            <Input
              type='text'
              name='name'
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </FullWidthField>

        <FormGroup>
          <Label>Categoria *</Label>
          <Select
            name='category'
            value={formData.category || 'other'}
            onChange={handleChange}
            required
          >
            {AssetCategoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <Select
            name='status'
            value={formData.status || 'available'}
            onChange={handleChange}
          >
            {AssetStatusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Valor (R$) *</Label>
          <Input
            type='number'
            name='value'
            value={formData.value || 0}
            onChange={handleChange}
            required
            min='0'
            step='0.01'
          />
        </FormGroup>

        <FullWidthField>
          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              name='description'
              value={formData.description || ''}
              onChange={handleChange}
            />
          </FormGroup>
        </FullWidthField>

        <FormGroup>
          <Label>Marca</Label>
          <Input
            type='text'
            name='brand'
            value={formData.brand || ''}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Modelo</Label>
          <Input
            type='text'
            name='model'
            value={formData.model || ''}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Número de Série</Label>
          <Input
            type='text'
            name='serialNumber'
            value={formData.serialNumber || ''}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Localização</Label>
          <Input
            type='text'
            name='location'
            value={formData.location || ''}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Data de Aquisição</Label>
          <Input
            type='date'
            name='acquisitionDate'
            value={formData.acquisitionDate || ''}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Responsável (Corretor)</Label>
          <Select
            name='assignedToUserId'
            value={formData.assignedToUserId || ''}
            onChange={handleChange}
          >
            <option value=''>Sem responsável</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Propriedade</Label>
          <Select
            name='propertyId'
            value={formData.propertyId || ''}
            onChange={handleChange}
          >
            <option value=''>Sem propriedade</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.title} - {property.code || property.id.slice(0, 8)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FullWidthField>
          <FormGroup>
            <Label>Observações</Label>
            <TextArea
              name='notes'
              value={formData.notes || ''}
              onChange={handleChange}
            />
          </FormGroup>
        </FullWidthField>

        <div
          style={{
            gridColumn: '1 / -1',
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
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </ModalButton>
        </div>
      </Form>
    </ModalPadrão>
  );
};
