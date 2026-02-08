import React, { useState, useEffect } from 'react';
import { ModalPadrão } from '../common/ModalPadrão';
import { useAssets } from '../../hooks/useAssets';
import type { Asset, AssetMovement } from '../../types/asset';
import {
  formatAssetValue,
  getCategoryLabel,
  getStatusLabel,
  getMovementTypeLabel,
} from '../../types/asset';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styled from 'styled-components';

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DetailsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const MovementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

const MovementItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const MovementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const MovementType = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const MovementDate = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MovementReason = styled.p`
  margin: 8px 0 0 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const Badge = styled.span<{
  $variant?: 'success' | 'warning' | 'error' | 'info';
}>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.$variant === 'success') return '#10B981' + '15';
    if (props.$variant === 'warning') return '#F59E0B' + '15';
    if (props.$variant === 'error') return '#EF4444' + '15';
    return props.theme.colors.primary + '15';
  }};
  color: ${props => {
    if (props.$variant === 'success') return '#10B981';
    if (props.$variant === 'warning') return '#F59E0B';
    if (props.$variant === 'error') return '#EF4444';
    return props.theme.colors.primary;
  }};
`;

interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const [movements, setMovements] = useState<AssetMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const { getAssetMovements } = useAssets();

  useEffect(() => {
    if (isOpen && asset) {
      loadMovements();
    }
  }, [isOpen, asset]);

  const loadMovements = async () => {
    setLoadingMovements(true);
    try {
      const data = await getAssetMovements(asset.id);
      setMovements(data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    } finally {
      setLoadingMovements(false);
    }
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={onClose}
      title={asset.name}
      subtitle='Detalhes do patrimônio'
      maxWidth='900px'
    >
      <DetailsContainer>
        <div>
          <SectionTitle>Informações Gerais</SectionTitle>
          <DetailsSection>
            <DetailItem>
              <DetailLabel>Nome</DetailLabel>
              <DetailValue>{asset.name}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Categoria</DetailLabel>
              <DetailValue>
                <Badge $variant='info'>
                  {getCategoryLabel(asset.category)}
                </Badge>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>
                <Badge
                  $variant={
                    asset.status === 'available'
                      ? 'success'
                      : asset.status === 'in_use'
                        ? 'info'
                        : asset.status === 'maintenance'
                          ? 'warning'
                          : 'error'
                  }
                >
                  {getStatusLabel(asset.status)}
                </Badge>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Valor</DetailLabel>
              <DetailValue>{formatAssetValue(asset.value)}</DetailValue>
            </DetailItem>
            {asset.description && (
              <DetailItem style={{ gridColumn: '1 / -1' }}>
                <DetailLabel>Descrição</DetailLabel>
                <DetailValue>{asset.description}</DetailValue>
              </DetailItem>
            )}
          </DetailsSection>
        </div>

        <div>
          <SectionTitle>Detalhes Técnicos</SectionTitle>
          <DetailsSection>
            {asset.brand && (
              <DetailItem>
                <DetailLabel>Marca</DetailLabel>
                <DetailValue>{asset.brand}</DetailValue>
              </DetailItem>
            )}
            {asset.model && (
              <DetailItem>
                <DetailLabel>Modelo</DetailLabel>
                <DetailValue>{asset.model}</DetailValue>
              </DetailItem>
            )}
            {asset.serialNumber && (
              <DetailItem>
                <DetailLabel>Número de Série</DetailLabel>
                <DetailValue>{asset.serialNumber}</DetailValue>
              </DetailItem>
            )}
            {asset.location && (
              <DetailItem>
                <DetailLabel>Localização</DetailLabel>
                <DetailValue>{asset.location}</DetailValue>
              </DetailItem>
            )}
            {asset.acquisitionDate && (
              <DetailItem>
                <DetailLabel>Data de Aquisição</DetailLabel>
                <DetailValue>
                  {format(
                    new Date(asset.acquisitionDate),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: ptBR }
                  )}
                </DetailValue>
              </DetailItem>
            )}
          </DetailsSection>
        </div>

        <div>
          <SectionTitle>Vinculações</SectionTitle>
          <DetailsSection>
            {asset.assignedToUser && (
              <DetailItem>
                <DetailLabel>Responsável</DetailLabel>
                <DetailValue>{asset.assignedToUser.name}</DetailValue>
              </DetailItem>
            )}
            {asset.property && (
              <DetailItem>
                <DetailLabel>Propriedade</DetailLabel>
                <DetailValue>{asset.property.title}</DetailValue>
              </DetailItem>
            )}
          </DetailsSection>
        </div>

        <div>
          <SectionTitle>Histórico de Movimentações</SectionTitle>
          {loadingMovements ? (
            <p>Carregando movimentações...</p>
          ) : movements.length === 0 ? (
            <p style={{ color: '#6B7280', fontStyle: 'italic' }}>
              Nenhuma movimentação registrada ainda.
            </p>
          ) : (
            <MovementsList>
              {movements.map(movement => (
                <MovementItem key={movement.id}>
                  <MovementHeader>
                    <MovementType>
                      {getMovementTypeLabel(movement.type)}
                    </MovementType>
                    <MovementDate>
                      {format(
                        new Date(movement.movementDate),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </MovementDate>
                  </MovementHeader>
                  <MovementReason>{movement.reason}</MovementReason>
                  {movement.fromUser && movement.toUser && (
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                      }}
                    >
                      De: {movement.fromUser.name} → Para:{' '}
                      {movement.toUser.name}
                    </p>
                  )}
                  {movement.notes && (
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontStyle: 'italic',
                      }}
                    >
                      {movement.notes}
                    </p>
                  )}
                </MovementItem>
              ))}
            </MovementsList>
          )}
        </div>
      </DetailsContainer>
    </ModalPadrão>
  );
};
