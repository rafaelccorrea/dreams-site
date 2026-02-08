import React from 'react';
import type { Property } from '../../types';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent,
  PropertyImage,
  PropertyInfo,
  PropertySection,
  PropertySectionTitle,
  PropertyField,
  PropertyFieldLabel,
  PropertyFieldValue,
  PropertyFeatures,
  PropertyFeatureTag,
  PropertyActions,
  PropertyActionButton,
} from './PropertyDetailsModalStyles';
import { OptimizedImage } from '../common/OptimizedImage';
import { PropertyActiveToggle } from '../properties/PropertyActiveToggle';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onEdit?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  property,
  onEdit,
  onDelete,
}) => {
  if (!property) return null;

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === 0) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'rented':
        return 'Alugado';
      case 'sold':
        return 'Vendido';
      case 'maintenance':
        return 'Manutenção';
      case 'draft':
        return 'Rascunho';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10B981';
      case 'rented':
        return '#F59E0B';
      case 'sold':
        return '#EF4444';
      case 'maintenance':
        return '#6B7280';
      case 'draft':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'house':
        return 'Casa';
      case 'apartment':
        return 'Apartamento';
      case 'commercial':
        return 'Comercial';
      case 'land':
        return 'Terreno';
      case 'rural':
        return 'Rural';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>🏠 Detalhes da Propriedade</ModalTitle>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>

        <ModalContent>
          {/* Imagem Principal */}
          {property.mainImage && (
            <PropertyImage style={{ position: 'relative' }}>
              <OptimizedImage
                src={property.mainImage.url}
                alt={property.title}
                width='100%'
                height='200px'
                borderRadius='8px'
                objectFit='cover'
                imageCount={property.imageCount}
                status={property.status}
                placeholder={<span style={{ fontSize: '48px' }}>🏠</span>}
              />
              <PropertyActiveToggle property={property} size='small' />
            </PropertyImage>
          )}

          {/* Informações Básicas */}
          <PropertySection>
            <PropertySectionTitle>📝 Informações Básicas</PropertySectionTitle>
            <PropertyInfo>
              <PropertyField>
                <PropertyFieldLabel>Título:</PropertyFieldLabel>
                <PropertyFieldValue>{property.title}</PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>Tipo:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {getTypeText(property.type)}
                </PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>Status:</PropertyFieldLabel>
                <PropertyFieldValue>
                  <span
                    style={{
                      color: getStatusColor(property.status),
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: `${getStatusColor(property.status)}20`,
                    }}
                  >
                    {getStatusText(property.status)}
                  </span>
                </PropertyFieldValue>
              </PropertyField>

              {property.description && (
                <PropertyField>
                  <PropertyFieldLabel>Descrição:</PropertyFieldLabel>
                  <PropertyFieldValue>
                    {property.description}
                  </PropertyFieldValue>
                </PropertyField>
              )}
            </PropertyInfo>
          </PropertySection>

          {/* Localização */}
          <PropertySection>
            <PropertySectionTitle>📍 Localização</PropertySectionTitle>
            <PropertyInfo>
              <PropertyField>
                <PropertyFieldLabel>Endereço:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {property.street && property.number
                    ? `${property.street}, ${property.number}`
                    : property.address || 'Não informado'}
                  {property.complement && `, ${property.complement}`}
                </PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>Bairro:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {property.neighborhood || 'Não informado'}
                </PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>Cidade/Estado:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {property.city && property.state
                    ? `${property.city}/${property.state}`
                    : 'Não informado'}
                </PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>CEP:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {property.zipCode || 'Não informado'}
                </PropertyFieldValue>
              </PropertyField>
            </PropertyInfo>
          </PropertySection>

          {/* Características */}
          <PropertySection>
            <PropertySectionTitle>🏗️ Características</PropertySectionTitle>
            <PropertyInfo>
              <PropertyField>
                <PropertyFieldLabel>Área Total:</PropertyFieldLabel>
                <PropertyFieldValue>{property.totalArea}m²</PropertyFieldValue>
              </PropertyField>

              {property.builtArea && property.builtArea > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>Área Construída:</PropertyFieldLabel>
                  <PropertyFieldValue>
                    {property.builtArea}m²
                  </PropertyFieldValue>
                </PropertyField>
              )}

              {property.bedrooms !== undefined && property.bedrooms > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>Quartos:</PropertyFieldLabel>
                  <PropertyFieldValue>{property.bedrooms}</PropertyFieldValue>
                </PropertyField>
              )}

              {property.bathrooms !== undefined && property.bathrooms > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>Banheiros:</PropertyFieldLabel>
                  <PropertyFieldValue>{property.bathrooms}</PropertyFieldValue>
                </PropertyField>
              )}

              {property.parkingSpaces !== undefined &&
                property.parkingSpaces > 0 && (
                  <PropertyField>
                    <PropertyFieldLabel>Vagas:</PropertyFieldLabel>
                    <PropertyFieldValue>
                      {property.parkingSpaces}
                    </PropertyFieldValue>
                  </PropertyField>
                )}
            </PropertyInfo>
          </PropertySection>

          {/* Valores */}
          <PropertySection>
            <PropertySectionTitle>💰 Valores</PropertySectionTitle>
            <PropertyInfo>
              {property.salePrice && property.salePrice > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>Preço de Venda:</PropertyFieldLabel>
                  <PropertyFieldValue
                    style={{ color: '#10B981', fontWeight: '600' }}
                  >
                    {formatPrice(property.salePrice)}
                  </PropertyFieldValue>
                </PropertyField>
              )}

              {property.rentPrice && property.rentPrice > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>Preço de Aluguel:</PropertyFieldLabel>
                  <PropertyFieldValue
                    style={{ color: '#3B82F6', fontWeight: '600' }}
                  >
                    {formatPrice(property.rentPrice)}
                  </PropertyFieldValue>
                </PropertyField>
              )}

              {property.condominiumFee && property.condominiumFee > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>Condomínio:</PropertyFieldLabel>
                  <PropertyFieldValue>
                    {formatPrice(property.condominiumFee)}
                  </PropertyFieldValue>
                </PropertyField>
              )}

              {property.iptu && property.iptu > 0 && (
                <PropertyField>
                  <PropertyFieldLabel>IPTU:</PropertyFieldLabel>
                  <PropertyFieldValue>
                    {formatPrice(property.iptu)}
                  </PropertyFieldValue>
                </PropertyField>
              )}
            </PropertyInfo>
          </PropertySection>

          {/* Características Especiais */}
          {property.features && property.features.length > 0 && (
            <PropertySection>
              <PropertySectionTitle>
                ✨ Características Especiais
              </PropertySectionTitle>
              <PropertyFeatures>
                {property.features.map((feature, index) => (
                  <PropertyFeatureTag key={index}>{feature}</PropertyFeatureTag>
                ))}
              </PropertyFeatures>
            </PropertySection>
          )}

          {/* Informações do Sistema */}
          <PropertySection>
            <PropertySectionTitle>
              ℹ️ Informações do Sistema
            </PropertySectionTitle>
            <PropertyInfo>
              <PropertyField>
                <PropertyFieldLabel>Criado em:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {formatDate(property.createdAt)}
                </PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>Atualizado em:</PropertyFieldLabel>
                <PropertyFieldValue>
                  {formatDate(property.updatedAt)}
                </PropertyFieldValue>
              </PropertyField>

              <PropertyField>
                <PropertyFieldLabel>Status do Sistema:</PropertyFieldLabel>
                <PropertyFieldValue>
                  <span
                    style={{
                      color: property.isActive ? '#10B981' : '#EF4444',
                      fontWeight: '600',
                    }}
                  >
                    {property.isActive ? '✅ Ativo' : '❌ Inativo'}
                  </span>
                  {property.isFeatured && (
                    <span
                      style={{
                        marginLeft: '8px',
                        color: '#F59E0B',
                        fontWeight: '600',
                      }}
                    >
                      ⭐ Destaque
                    </span>
                  )}
                </PropertyFieldValue>
              </PropertyField>
            </PropertyInfo>
          </PropertySection>

          {/* Ações */}
          <PropertyActions>
            {onEdit && (
              <PropertyActionButton
                $variant='primary'
                onClick={() => {
                  onEdit(property.id);
                  onClose();
                }}
              >
                ✏️ Editar
              </PropertyActionButton>
            )}

            {onDelete && (
              <PropertyActionButton
                $variant='danger'
                onClick={() => {
                  if (
                    window.confirm(
                      'Tem certeza que deseja excluir esta propriedade?'
                    )
                  ) {
                    onDelete(property.id);
                    onClose();
                  }
                }}
              >
                🗑️ Excluir
              </PropertyActionButton>
            )}

            <PropertyActionButton $variant='secondary' onClick={onClose}>
              Fechar
            </PropertyActionButton>
          </PropertyActions>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PropertyDetailsModal;
