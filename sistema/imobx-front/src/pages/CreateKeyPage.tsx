import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBack, MdSave, MdKey } from 'react-icons/md';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { Layout } from '../components/layout/Layout';
import { useKeys } from '../hooks/useKeys';
import { useProperties } from '../hooks/useProperties';
import { usePermissionsContext } from '../contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '../utils/permissionContextualDependencies';
import { type CreateKeyData } from '../services/keyService';

// Container principal
const Container = styled.div`
  padding: 24px;
  width: 100%;
`;

// Header da página
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  background: var(--color-background-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background);
    border-color: var(--color-primary);
  }
`;

// Formulário
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;

  &.required::after {
    content: ' *';
    color: var(--color-error);
  }
`;

const Input = styled.input`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const Select = styled.select`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
    }

    &:disabled {
      background: var(--color-text-secondary);
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: var(--color-background-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);

    &:hover {
      background: var(--color-background);
      border-color: var(--color-primary);
    }
  `}
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
`;

// Loading shimmer
const ShimmerLine = styled.div`
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 200px 100%;
  animation: shimmer 1.2s infinite linear;
  border-radius: 4px;
  margin-bottom: 16px;

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  &.title {
    height: 28px;
    width: 40%;
    margin-bottom: 24px;
  }
  &.label {
    height: 14px;
    width: 25%;
    margin-bottom: 8px;
  }
  &.input {
    height: 48px;
    margin-bottom: 20px;
  }
  &.button {
    height: 48px;
    width: 120px;
  }
`;

const CreateKeyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [checkingProperties, setCheckingProperties] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    propertyId: '',
    type: 'main',
    status: 'available',
    location: '',
    description: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createKey } = useKeys();
  const {
    properties,
    isLoading: propertiesLoading,
    getProperties,
  } = useProperties();
  const { hasPermission } = usePermissionsContext();

  // Garantir carregamento de propriedades ao montar a página
  useEffect(() => {
    // Verificar se pode vincular chave a propriedade
    const canLinkToProperty = canExecuteFunctionality(
      hasPermission,
      'key:create',
      'vincular_chave_propriedade'
    );

    // Só carregar propriedades se tiver permissão e ainda não foram carregadas
    if (canLinkToProperty && !propertiesLoading && properties.length === 0) {
      getProperties({}, { page: 1, limit: 100 }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertiesLoading, properties.length]); // Removida dependência getProperties

  // Verificar se há propriedades disponíveis após carregar
  useEffect(() => {
    if (!propertiesLoading && !checkingProperties) {
      if (!properties || properties.length === 0) {
        toast.warning(
          'Você precisa cadastrar pelo menos uma propriedade antes de criar chaves.'
        );
        navigate('/properties/create');
      } else {
        // Pré-selecionar propriedade se veio do cadastro de propriedade
        const preSelectedProperty = location.state?.preSelectedProperty;
        if (preSelectedProperty) {
          setFormData(prev => ({ ...prev, propertyId: preSelectedProperty }));
        }
      }
    }
  }, [
    properties,
    propertiesLoading,
    checkingProperties,
    navigate,
    location.state,
  ]);

  // Controlar quando parar de verificar propriedades
  useEffect(() => {
    if (!propertiesLoading) {
      setCheckingProperties(false);
    }
  }, [propertiesLoading]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.propertyId) {
      newErrors.propertyId = 'Propriedade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createKey(formData as CreateKeyData);
      toast.success('Chave criada com sucesso!');

      // Sempre ir para tela de chaves após criar
      navigate('/keys');
    } catch (error) {
      toast.error('Erro ao criar chave. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Se veio de uma propriedade específica, voltar para ela
    const fromProperty = location.state?.fromProperty;
    if (fromProperty) {
      navigate(`/properties/${fromProperty}`);
    } else {
      navigate('/keys');
    }
  };

  // Mostrar shimmer enquanto verifica propriedades
  if (checkingProperties || propertiesLoading) {
    return (
      <Layout>
        <Container>
          <Header>
            <ShimmerLine className='title' />
            <ShimmerLine className='button' />
          </Header>
          <Form>
            <FormRow>
              <FormGroup>
                <ShimmerLine className='label' />
                <ShimmerLine className='input' />
              </FormGroup>
              <FormGroup>
                <ShimmerLine className='label' />
                <ShimmerLine className='input' />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <ShimmerLine className='label' />
                <ShimmerLine className='input' />
              </FormGroup>
              <FormGroup>
                <ShimmerLine className='label' />
                <ShimmerLine className='input' />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <ShimmerLine className='label' />
              <ShimmerLine className='input' />
            </FormGroup>
            <FormGroup>
              <ShimmerLine className='label' />
              <ShimmerLine style={{ height: '100px' }} />
            </FormGroup>
            <FormGroup>
              <ShimmerLine className='label' />
              <ShimmerLine style={{ height: '100px' }} />
            </FormGroup>
            <ButtonGroup>
              <ShimmerLine className='button' />
              <ShimmerLine className='button' />
            </ButtonGroup>
          </Form>
        </Container>
      </Layout>
    );
  }

  // Se não há propriedades, não renderizar nada (já redirecionou)
  if (properties.length === 0) {
    return null;
  }

  return (
    <Layout>
      <Container>
        <Header>
          <Title>Cadastrar Nova Chave</Title>
          <BackButton onClick={handleCancel}>
            <MdArrowBack />
            Voltar
          </BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label className='required'>Nome da Chave</Label>
              <Input
                type='text'
                placeholder='Ex: Chave Principal'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label className='required'>Propriedade</Label>
              <Select
                value={formData.propertyId}
                onChange={e => handleInputChange('propertyId', e.target.value)}
              >
                <option value=''>Selecione uma propriedade</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </Select>
              {errors.propertyId && (
                <ErrorMessage>{errors.propertyId}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Tipo de Chave</Label>
              <Select
                value={formData.type}
                onChange={e => handleInputChange('type', e.target.value)}
              >
                <option value='main'>Principal</option>
                <option value='backup'>Reserva</option>
                <option value='emergency'>Emergência</option>
                <option value='garage'>Garagem</option>
                <option value='mailbox'>Caixa de Correio</option>
                <option value='other'>Outro</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Status Inicial</Label>
              <Select
                value={formData.status}
                onChange={e => handleInputChange('status', e.target.value)}
              >
                <option value='available'>Disponível</option>
                <option value='in_use'>Em uso</option>
                <option value='lost'>Perdida</option>
                <option value='maintenance'>Manutenção</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Localização</Label>
            <Input
              type='text'
              placeholder='Ex: Escritório, Portaria, Cofre'
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              placeholder='Descrição detalhada da chave, características, etc. (máx. 300 caracteres)'
              value={formData.description}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  handleInputChange('description', e.target.value);
                }
              }}
              maxLength={300}
            />
          </FormGroup>

          <FormGroup>
            <Label>Observações</Label>
            <TextArea
              placeholder='Observações adicionais sobre a chave (máx. 300 caracteres)'
              value={formData.notes}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  handleInputChange('notes', e.target.value);
                }
              }}
              maxLength={300}
            />
          </FormGroup>

          <ButtonGroup>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button $variant='primary' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Cadastrando...
                </>
              ) : (
                <>
                  <MdSave />
                  Cadastrar Chave
                </>
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    </Layout>
  );
};

export default CreateKeyPage;
