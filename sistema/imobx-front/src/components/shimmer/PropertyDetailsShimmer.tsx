import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação moderna do shimmer
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: 200% 0;
    opacity: 0.8;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

// Componente shimmer moderno (sempre cinza)
const ModernShimmer = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
}>`
  background: linear-gradient(
    90deg,
    #e2e8f0 0%,
    #cbd5e1 25%,
    #94a3b8 50%,
    #cbd5e1 75%,
    #e2e8f0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 100%
    );
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

// Container principal moderno
const ShimmerContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background || '#f8fafc'};
  padding: 0;
  overflow: hidden;
`;

// Header moderno - ajustado para refletir PropertyDetailsHeader
const ModernHeader = styled.div`
  background: ${({ theme }) => theme.colors.background || '#ffffff'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#e2e8f0'};
  padding: 24px;
  margin-bottom: 32px;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 20px;
    margin-bottom: 28px;
  }

  @media (min-width: 1025px) and (max-width: 1400px) {
    padding: 28px;
    margin-bottom: 36px;
  }

  @media (min-width: 1401px) {
    padding: 32px;
    margin-bottom: 40px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 24px;
  }
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Grid moderno - ajustado para refletir a estrutura atual
const ModernGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0 20px 24px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;

  @media (min-width: 1401px) {
    grid-template-columns: 2.5fr 1fr;
    gap: 24px;
    padding: 0 24px 28px;
  }

  @media (max-width: 1400px) and (min-width: 1201px) {
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    padding: 0 20px 24px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1.5fr 1fr;
    gap: 18px;
    padding: 0 18px 22px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 0 18px 20px;
  }

  @media (max-width: 768px) {
    padding: 0 16px 18px;
    gap: 16px;
  }
`;

// Coluna esquerda (MainContent)
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 16px;
  }

  @media (min-width: 1025px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

// Coluna direita (Sidebar)
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 16px;
  }

  @media (min-width: 1025px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

// Card moderno - ajustado para refletir PropertyCard
const ModernCard = styled.div<{ $height?: string }>`
  background: ${({ theme }) => theme.colors.cardBackground || '#ffffff'};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.colors.border || '#e2e8f0'};
  position: relative;
  overflow: visible;
  height: ${props => props.$height || 'auto'};

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 18px;
    border-radius: 14px;
  }

  @media (min-width: 1025px) {
    padding: 22px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

// Overlay para imagens
const ImageOverlay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
`;

// Seção de características
const CharacteristicsSection = styled(ModernCard)`
  padding: 32px;
`;

const CharacteristicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const CharacteristicItem = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
`;

// Seção de localização
const LocationSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const AddressCard = styled(ModernCard)`
  padding: 32px;
`;

const AddressItem = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
`;

const MapCard = styled(ModernCard)`
  padding: 32px;
`;

const MapContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  height: 400px;
  position: relative;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

// Sidebar cards
const SidebarCard = styled(ModernCard)`
  padding: 28px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KeyStatusCard = styled(SidebarCard)`
  border: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
`;

const KeyStatusContent = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const ValuesCard = styled(SidebarCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
`;

const SalePriceCard = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  text-align: center;
  color: white;
`;

const AdditionalCosts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CostItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
`;

const UserCard = styled(SidebarCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const ClientsCard = styled(SidebarCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
`;

const ClientItem = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
`;

export const PropertyDetailsShimmer = () => (
  <ShimmerContainer>
    {/* Header Shimmer */}
    <ModernHeader>
      <HeaderContent>
        {/* Property Name Shimmer - Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ModernShimmer $width='100%' $height='48px' $borderRadius='12px' />
          <ModernShimmer
            $width='60%'
            $height='20px'
            $borderRadius='6px'
            $margin='12px 0 0 0'
          />
        </div>

        {/* Back Button Shimmer - Right */}
        <ModernShimmer $width='180px' $height='48px' $borderRadius='12px' />
      </HeaderContent>
    </ModernHeader>

    {/* Main Content Grid */}
    <ModernGrid>
      {/* Left Column - Main Content */}
      <LeftColumn>
        {/* Image Section Shimmer */}
        <ModernCard $height='400px'>
          <ModernShimmer $width='100%' $height='100%' $borderRadius='16px' />
          <ImageOverlay>
            <ModernShimmer $width='80px' $height='32px' $borderRadius='16px' />
          </ImageOverlay>
        </ModernCard>

        {/* Property Characteristics Shimmer */}
        <CharacteristicsSection>
          <ModernShimmer $width='240px' $height='28px' $borderRadius='8px' />
          <CharacteristicsGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <CharacteristicItem key={index}>
                <ModernShimmer
                  $width='40px'
                  $height='40px'
                  $borderRadius='50%'
                  $margin='0 auto 12px'
                />
                <ModernShimmer
                  $width='100px'
                  $height='14px'
                  $borderRadius='6px'
                  $margin='0 auto 6px'
                />
                <ModernShimmer
                  $width='80px'
                  $height='18px'
                  $borderRadius='6px'
                  $margin='0 auto'
                />
              </CharacteristicItem>
            ))}
          </CharacteristicsGrid>
        </CharacteristicsSection>

        {/* Documents Section Shimmer */}
        <ModernCard>
          <ModernShimmer
            $width='180px'
            $height='24px'
            $borderRadius='8px'
            $margin='0 0 16px 0'
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <ModernShimmer
                  $width='200px'
                  $height='16px'
                  $borderRadius='6px'
                  $margin='0 0 8px 0'
                />
                <ModernShimmer
                  $width='150px'
                  $height='14px'
                  $borderRadius='4px'
                />
              </div>
            ))}
          </div>
        </ModernCard>

        {/* Checklists Section Shimmer */}
        <ModernCard>
          <ModernShimmer
            $width='140px'
            $height='24px'
            $borderRadius='8px'
            $margin='0 0 16px 0'
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <ModernShimmer
                  $width='80%'
                  $height='18px'
                  $borderRadius='6px'
                  $margin='0 0 8px 0'
                />
                <ModernShimmer
                  $width='60%'
                  $height='14px'
                  $borderRadius='4px'
                  $margin='0 0 12px 0'
                />
                <ModernShimmer
                  $width='100%'
                  $height='8px'
                  $borderRadius='4px'
                />
              </div>
            ))}
          </div>
        </ModernCard>

        {/* Clients Section Shimmer */}
        <ModernCard>
          <ModernShimmer
            $width='180px'
            $height='24px'
            $borderRadius='8px'
            $margin='0 0 16px 0'
          />
          <div
            style={{
              padding: '20px 16px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px dashed #e2e8f0',
              textAlign: 'center',
            }}
          >
            <ModernShimmer
              $width='48px'
              $height='48px'
              $borderRadius='50%'
              $margin='0 auto 12px'
            />
            <ModernShimmer
              $width='200px'
              $height='16px'
              $borderRadius='6px'
              $margin='0 auto 8px'
            />
            <ModernShimmer
              $width='280px'
              $height='14px'
              $borderRadius='4px'
              $margin='0 auto 16px'
            />
            <ModernShimmer
              $width='160px'
              $height='40px'
              $borderRadius='8px'
              $margin='0 auto'
            />
          </div>
        </ModernCard>
      </LeftColumn>

      {/* Right Column - Sidebar */}
      <RightColumn>
        {/* Map Section Shimmer - Primeiro na sidebar */}
        <ModernCard>
          <ModernShimmer
            $width='120px'
            $height='24px'
            $borderRadius='8px'
            $margin='0 0 16px 0'
          />
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '12px',
              height: '300px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <ModernShimmer $width='100%' $height='100%' $borderRadius='12px' />
          </div>
        </ModernCard>

        {/* Action Buttons Shimmer */}
        <SidebarCard>
          <ActionButtons>
            <ModernShimmer $width='100%' $height='48px' $borderRadius='12px' />
            <ModernShimmer $width='100%' $height='48px' $borderRadius='12px' />
            <ModernShimmer $width='100%' $height='48px' $borderRadius='12px' />
          </ActionButtons>
        </SidebarCard>

        {/* Key Status Shimmer */}
        <KeyStatusCard>
          <ModernShimmer $width='160px' $height='24px' $borderRadius='6px' />
          <KeyStatusContent>
            <ModernShimmer
              $width='140px'
              $height='40px'
              $borderRadius='20px'
              $margin='0 auto 16px'
            />
            <ModernShimmer
              $width='120px'
              $height='16px'
              $borderRadius='6px'
              $margin='0 auto 16px'
            />
            <ModernShimmer $width='100%' $height='48px' $borderRadius='12px' />
          </KeyStatusContent>
        </KeyStatusCard>

        {/* Values Shimmer */}
        <ValuesCard>
          <ModernShimmer $width='100px' $height='20px' $borderRadius='6px' />

          {/* Sale Price Shimmer */}
          <SalePriceCard>
            <ModernShimmer
              $width='80px'
              $height='14px'
              $borderRadius='4px'
              $margin='0 auto 4px'
            />
            <ModernShimmer
              $width='160px'
              $height='22px'
              $borderRadius='6px'
              $margin='0 auto'
            />
          </SalePriceCard>

          {/* Additional Costs Shimmer */}
          <AdditionalCosts>
            {Array.from({ length: 2 }).map((_, index) => (
              <CostItem key={index}>
                <ModernShimmer
                  $width='100px'
                  $height='14px'
                  $borderRadius='4px'
                />
                <ModernShimmer
                  $width='80px'
                  $height='14px'
                  $borderRadius='4px'
                />
              </CostItem>
            ))}
          </AdditionalCosts>
        </ValuesCard>

        {/* Property Public Toggle Shimmer */}
        <ModernCard>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
            }}
          >
            <ModernShimmer $width='240px' $height='24px' $borderRadius='6px' />
            <ModernShimmer $width='120px' $height='40px' $borderRadius='20px' />
            <ModernShimmer $width='90%' $height='14px' $borderRadius='4px' />
          </div>
        </ModernCard>

        {/* Responsible User Shimmer */}
        <UserCard
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '200px',
          }}
        >
          <ModernShimmer
            $width='120px'
            $height='24px'
            $borderRadius='6px'
            $margin='0 0 16px 0'
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '12px',
              flex: 1,
            }}
          >
            <ModernShimmer $width='48px' $height='48px' $borderRadius='50%' />
            <div style={{ flex: 1 }}>
              <ModernShimmer
                $width='140px'
                $height='18px'
                $borderRadius='6px'
                $margin='0 0 6px 0'
              />
              <ModernShimmer
                $width='180px'
                $height='14px'
                $borderRadius='4px'
              />
            </div>
          </div>
        </UserCard>
      </RightColumn>
    </ModernGrid>
  </ShimmerContainer>
);

export default PropertyDetailsShimmer;
