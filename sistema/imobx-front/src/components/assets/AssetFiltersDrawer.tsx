import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import type { AssetQueryParams } from '../../types/asset';
import { AssetCategoryOptions, AssetStatusOptions } from '../../types/asset';
import { useUsers } from '../../hooks/useUsers';
import { useProperties } from '../../hooks/useProperties';
import DataScopeFilter from '../common/DataScopeFilter';

const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const DrawerContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const DrawerBody = styled.div`
  padding: 24px;
  flex: 1;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px ${props.theme.colors.primary}35;
    }
  `
      : props.$variant === 'danger'
        ? `
    background: ${props.theme.colors.danger};
    color: white;

    &:hover {
      background: ${props.theme.colors.dangerHover};
      transform: translateY(-2px);
    }
  `
        : `
    background: ${props.theme.colors.border};
    color: ${props.theme.colors.text};
    
    &:hover {
      background: ${props.theme.colors.border}80;
    }
  `}
`;

interface AssetFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AssetQueryParams;
  onApplyFilters: (filters: AssetQueryParams) => void;
  onClearFilters: () => void;
}

export const AssetFiltersDrawer: React.FC<AssetFiltersDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<AssetQueryParams>(filters);
  const { users, getUsers } = useUsers();
  const { properties, getProperties } = useProperties();
  const [userSearch, setUserSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');

  // Carregar users e properties quando o drawer abrir
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

  // Debounce buscas
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

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (
    key: keyof AssetQueryParams,
    value: string | undefined
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = { page: 1, limit: 20 };
    setLocalFilters(cleared);
    onClearFilters();
    onClose();
  };

  return (
    <>
      <DrawerOverlay $isOpen={isOpen} onClick={onClose} />
      <DrawerContainer $isOpen={isOpen}>
        <DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </DrawerHeader>
        <DrawerBody>
          {/* Escopo de dados */}
          <FormGroup>
            <Label>Escopo</Label>
            <DataScopeFilter
              onlyMyData={!!localFilters.onlyMyData}
              onChange={val =>
                setLocalFilters(prev => ({
                  ...prev,
                  onlyMyData: val || undefined,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Status</Label>
            <Select
              value={localFilters.status || ''}
              onChange={e =>
                handleChange('status', e.target.value || undefined)
              }
            >
              <option value=''>Todos</option>
              {AssetStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Categoria</Label>
            <Select
              value={localFilters.category || ''}
              onChange={e =>
                handleChange('category', e.target.value || undefined)
              }
            >
              <option value=''>Todas</option>
              {AssetCategoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Responsável</Label>
            <Input
              type='text'
              placeholder='Buscar por nome ou email...'
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Select
              value={localFilters.assignedToUserId || ''}
              onChange={e =>
                handleChange('assignedToUserId', e.target.value || undefined)
              }
            >
              <option value=''>Todos</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Propriedade</Label>
            <Input
              type='text'
              placeholder='Buscar por nome, código ou endereço...'
              value={propertySearch}
              onChange={e => setPropertySearch(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Select
              value={localFilters.propertyId || ''}
              onChange={e =>
                handleChange('propertyId', e.target.value || undefined)
              }
            >
              <option value=''>Todas</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title} - {property.code || property.id.slice(0, 8)}
                </option>
              ))}
            </Select>
          </FormGroup>

          <ButtonGroup>
            <Button $variant='danger' onClick={handleClear}>
              Limpar
            </Button>
            <Button $variant='primary' onClick={handleApply}>
              Aplicar
            </Button>
          </ButtonGroup>
        </DrawerBody>
      </DrawerContainer>
    </>
  );
};
