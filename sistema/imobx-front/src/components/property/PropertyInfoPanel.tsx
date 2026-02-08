import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdLocationOn,
  MdBed,
  MdBathroom,
  MdSquareFoot,
  MdAttachMoney,
  MdPerson,
  MdAdd,
} from 'react-icons/md';
import { TbHome, TbBuilding } from 'react-icons/tb';
import {
  formatPrice,
  getStatusText,
  getStatusColor,
  getTypeText,
} from '../../utils/propertyUtils';
import {
  InfoContainer,
  InfoSection,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  StatusBadge,
  UserInfo,
  UserAvatar,
  UserDetails,
  KeyStatus,
  FeaturesList,
  FeatureTag,
  PriceDisplay,
} from './PropertyInfoPanelStyles';

interface PropertyInfoPanelProps {
  property: any;
  responsibleUser?: any;
  keyStatus?: any;
}

export const PropertyInfoPanel: React.FC<PropertyInfoPanelProps> = ({
  property,
  responsibleUser,
  keyStatus,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateKey = () => {
    navigate(`/keys/create?propertyId=${property.id}`);
  };

  const handleManageKeys = () => {
    navigate(`/keys?propertyId=${property.id}`);
  };

  return (
    <InfoContainer>
      {/* Header */}
      <div
        style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--color-text)',
            margin: '0 0 8px 0',
          }}
        >
          Informações Gerais
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <StatusBadge $status={getStatusColor(property.status)}>
            {getStatusText(property.status)}
          </StatusBadge>
          <span
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
            }}
          >
            {getTypeText(property.type)}
          </span>
        </div>
      </div>

      {/* Basic Information */}
      <InfoSection>
        <SectionTitle>
          <MdLocationOn size={20} />
          Localização
        </SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Endereço</InfoLabel>
            <InfoValue>
              {property.street && property.number
                ? `${property.street}, ${property.number}`
                : property.address || 'Não informado'}
              {property.complement && `, ${property.complement}`}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Bairro</InfoLabel>
            <InfoValue>{property.neighborhood || 'Não informado'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Cidade/Estado</InfoLabel>
            <InfoValue>
              {property.city && property.state
                ? `${property.city}/${property.state}`
                : 'Não informado'}
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>CEP</InfoLabel>
            <InfoValue>{property.zipCode || 'Não informado'}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>

      {/* Property Details */}
      <InfoSection>
        <SectionTitle>
          <TbBuilding size={20} />
          Características
        </SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>
              <MdSquareFoot size={16} />
              Área Total
            </InfoLabel>
            <InfoValue>{property.totalArea}m²</InfoValue>
          </InfoItem>

          {property.builtArea && property.builtArea > 0 && (
            <InfoItem>
              <InfoLabel>Área Construída</InfoLabel>
              <InfoValue>{property.builtArea}m²</InfoValue>
            </InfoItem>
          )}

          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <InfoItem>
              <InfoLabel>
                <MdBed size={16} />
                Quartos
              </InfoLabel>
              <InfoValue>{property.bedrooms}</InfoValue>
            </InfoItem>
          )}

          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <InfoItem>
              <InfoLabel>
                <MdBathroom size={16} />
                Banheiros
              </InfoLabel>
              <InfoValue>{property.bathrooms}</InfoValue>
            </InfoItem>
          )}

          {property.parkingSpaces !== undefined &&
            property.parkingSpaces > 0 && (
              <InfoItem>
                <InfoLabel>Vagas</InfoLabel>
                <InfoValue>{property.parkingSpaces}</InfoValue>
              </InfoItem>
            )}
        </InfoGrid>
      </InfoSection>

      {/* Prices */}
      <InfoSection>
        <SectionTitle>
          <MdAttachMoney size={20} />
          Valores
        </SectionTitle>
        <div
          style={{
            padding: '16px',
            background: 'var(--color-background-secondary)',
            borderRadius: '12px',
            margin: '12px 0',
          }}
        >
          {property.salePrice && property.salePrice > 0 && (
            <PriceDisplay>
              <InfoLabel style={{ color: '#10B981' }}>Preço de Venda</InfoLabel>
              <InfoValue
                style={{
                  color: '#10B981',
                  fontWeight: '600',
                  fontSize: '18px',
                }}
              >
                {formatPrice(property.salePrice)}
              </InfoValue>
            </PriceDisplay>
          )}

          {property.rentPrice && property.rentPrice > 0 && (
            <PriceDisplay>
              <InfoLabel style={{ color: '#3B82F6' }}>
                Preço do Aluguel
              </InfoLabel>
              <InfoValue
                style={{
                  color: '#3B82F6',
                  fontWeight: '600',
                  fontSize: '18px',
                }}
              >
                {formatPrice(property.rentPrice)}
              </InfoValue>
            </PriceDisplay>
          )}

          {property.condominiumFee && property.condominiumFee > 0 && (
            <PriceDisplay>
              <InfoLabel>Condomínio</InfoLabel>
              <InfoValue>{formatPrice(property.condominiumFee)}</InfoValue>
            </PriceDisplay>
          )}

          {property.iptu && property.iptu > 0 && (
            <PriceDisplay>
              <InfoLabel>IPTU</InfoLabel>
              <InfoValue>{formatPrice(property.iptu)}</InfoValue>
            </PriceDisplay>
          )}
        </div>
      </InfoSection>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <InfoSection>
          <SectionTitle>✨ Características Especiais</SectionTitle>
          <FeaturesList>
            {property.features.map((feature: string, index: number) => (
              <FeatureTag key={index}>{feature}</FeatureTag>
            ))}
          </FeaturesList>
        </InfoSection>
      )}

      {/* Responsible User */}
      {responsibleUser && (
        <InfoSection>
          <SectionTitle>
            <MdPerson size={20} />
            Responsável
          </SectionTitle>
          <UserInfo>
            <UserAvatar>
              {responsibleUser.name?.charAt(0).toUpperCase() || 'U'}
            </UserAvatar>
            <UserDetails>
              <InfoValue style={{ fontWeight: '600', margin: '0 0 4px 0' }}>
                {responsibleUser.name || 'Nome não informado'}
              </InfoValue>
              <InfoLabel style={{ fontSize: '13px', margin: 0 }}>
                {responsibleUser.email || 'Email não informado'}
              </InfoLabel>
            </UserDetails>
          </UserInfo>
        </InfoSection>
      )}

      {/* Key Status */}
      <InfoSection>
        <SectionTitle>🔑 Status da Chave</SectionTitle>
        <KeyStatus $hasKey={!!keyStatus}>
          {keyStatus ? (
            <div style={{ width: '100%' }}>
              <InfoValue
                style={{
                  color: '#10B981',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Chave Disponível
              </InfoValue>
              <InfoLabel style={{ fontSize: '13px', margin: '0 0 12px 0' }}>
                Status:{' '}
                {keyStatus.status === 'available' ? 'Disponível' : 'Em uso'}
              </InfoLabel>
              <button
                onClick={handleManageKeys}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '6px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'var(--color-surface)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                🔑 Gerenciar Chaves
              </button>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <InfoValue
                style={{
                  color: '#6B7280',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Sem chave cadastrada
              </InfoValue>
              <InfoLabel style={{ fontSize: '13px', margin: '0 0 12px 0' }}>
                Chave não foi cadastrada para esta propriedade
              </InfoLabel>
              <button
                onClick={handleCreateKey}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '6px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background =
                    'var(--color-primary-dark, #2563eb)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                }}
              >
                <MdAdd size={16} />
                Criar Chave
              </button>
            </div>
          )}
        </KeyStatus>
      </InfoSection>

      {/* System Information */}
      <InfoSection>
        <SectionTitle>ℹ️ Informações do Sistema</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Criado em</InfoLabel>
            <InfoValue>{formatDate(property.createdAt)}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Atualizado em</InfoLabel>
            <InfoValue>{formatDate(property.updatedAt)}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <InfoValue>
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
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>
    </InfoContainer>
  );
};
