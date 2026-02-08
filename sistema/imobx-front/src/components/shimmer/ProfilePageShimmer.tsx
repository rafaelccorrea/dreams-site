import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animações otimizadas
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
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

// Componente shimmer base otimizado
const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
  $variant?: 'primary' | 'secondary' | 'accent';
}>`
  background: ${props => {
    switch (props.$variant) {
      case 'primary':
        return `linear-gradient(90deg, ${props.theme.colors.backgroundSecondary} 0%, ${props.theme.colors.border} 50%, ${props.theme.colors.backgroundSecondary} 100%)`;
      case 'accent':
        return `linear-gradient(90deg, ${props.theme.colors.primary}10 0%, ${props.theme.colors.primary}30 50%, ${props.theme.colors.primary}10 100%)`;
      default:
        return `linear-gradient(90deg, ${props.theme.colors.backgroundSecondary} 0%, ${props.theme.colors.border} 50%, ${props.theme.colors.backgroundSecondary} 100%)`;
    }
  }};
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
  will-change: background-position;
`;

// Container principal
const ProfileShimmerContainer = styled.div`
  padding: 32px;
  width: 100%;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// Header shimmer
const ProfileHeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    margin-bottom: 32px;
  }
`;

const ProfileTitleShimmer = styled.div`
  flex: 1;

  h1 {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0 0 12px 0;
  }

  p {
    margin: 0;
  }
`;

// Controles shimmer
const ProfileControlsShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const SearchContainerShimmer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

// Estatísticas shimmer
const StatsShimmer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 28px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

// Grid principal shimmer
const ResponsiveGridShimmer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

// Card shimmer
const InfoCardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  overflow: hidden;
`;

const CardHeaderShimmer = styled.div`
  padding: 28px 32px 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}08 0%,
    ${props => props.theme.colors.primary}04 100%
  );

  @media (max-width: 768px) {
    padding: 24px 28px 16px 28px;
  }
`;

const InfoListShimmer = styled.div`
  padding: 0;
`;

const InfoItemShimmer = styled.div`
  padding: 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 16px 28px;
  }
`;

const InfoIconShimmer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}20;
  flex-shrink: 0;
`;

const InfoContentShimmer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// Avatar shimmer especial
const AvatarShimmer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => props.theme.colors.primary}20;
  animation: ${pulse} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

// Seção de empresas shimmer
const CompaniesSectionShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  overflow: hidden;
`;

const CompaniesHeaderShimmer = styled.div`
  padding: 28px 32px 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}08 0%,
    ${props => props.theme.colors.primary}04 100%
  );

  @media (max-width: 768px) {
    padding: 24px 28px 16px 28px;
  }
`;

const CompaniesListShimmer = styled.div`
  padding: 0;
`;

const CompanyItemShimmer = styled.div`
  padding: 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 16px 28px;
  }
`;

const CompanyIconShimmer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: ${props => props.theme.colors.primary}20;
  flex-shrink: 0;
`;

const CompanyInfoShimmer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CompanyActionsShimmer = styled.div`
  display: flex;
  gap: 8px;
`;

export const ProfilePageShimmer: React.FC = () => {
  return (
    <ProfileShimmerContainer>
      {/* Header */}
      <ProfileHeaderShimmer>
        <ProfileTitleShimmer>
          <h1>
            <ShimmerBase $width='40px' $height='40px' $borderRadius='12px' />
            <ShimmerBase $width='200px' $height='32px' $borderRadius='8px' />
          </h1>
          <p>
            <ShimmerBase $width='300px' $height='20px' $borderRadius='6px' />
          </p>
        </ProfileTitleShimmer>

        <ShimmerBase $width='150px' $height='48px' $borderRadius='16px' />
      </ProfileHeaderShimmer>

      {/* Controles */}
      <ProfileControlsShimmer>
        <SearchContainerShimmer>
          <ShimmerBase $width='100%' $height='48px' $borderRadius='16px' />
        </SearchContainerShimmer>

        <ShimmerBase $width='120px' $height='48px' $borderRadius='16px' />
      </ProfileControlsShimmer>

      {/* Estatísticas */}
      <StatsShimmer>
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardShimmer key={index}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <ShimmerBase
                $width='48px'
                $height='48px'
                $borderRadius='12px'
                $variant='accent'
              />
              <div style={{ flex: 1 }}>
                <ShimmerBase
                  $width='80px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='100px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </div>
            </div>
          </StatCardShimmer>
        ))}
      </StatsShimmer>

      {/* Grid Principal */}
      <ResponsiveGridShimmer>
        {/* Card de Informações Pessoais */}
        <InfoCardShimmer>
          <CardHeaderShimmer>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShimmerBase $width='24px' $height='24px' $borderRadius='6px' />
              <ShimmerBase $width='200px' $height='24px' $borderRadius='6px' />
            </div>
          </CardHeaderShimmer>

          <InfoListShimmer>
            {/* Avatar e informações básicas */}
            <InfoItemShimmer
              style={{
                padding: '24px 32px',
                borderBottom: '2px solid var(--color-border)',
                marginBottom: '16px',
              }}
            >
              <AvatarShimmer />
              <InfoContentShimmer>
                <ShimmerBase
                  $width='180px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='120px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </InfoContentShimmer>
            </InfoItemShimmer>

            {/* Informações detalhadas */}
            {Array.from({ length: 4 }).map((_, index) => (
              <InfoItemShimmer key={index}>
                <InfoIconShimmer />
                <InfoContentShimmer>
                  <ShimmerBase
                    $width='100px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='180px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoContentShimmer>
              </InfoItemShimmer>
            ))}
          </InfoListShimmer>
        </InfoCardShimmer>

        {/* Card de Segurança */}
        <InfoCardShimmer>
          <CardHeaderShimmer>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShimmerBase $width='24px' $height='24px' $borderRadius='6px' />
              <ShimmerBase $width='150px' $height='24px' $borderRadius='6px' />
            </div>
          </CardHeaderShimmer>

          <InfoListShimmer>
            {Array.from({ length: 2 }).map((_, index) => (
              <InfoItemShimmer key={index}>
                <InfoIconShimmer />
                <InfoContentShimmer>
                  <ShimmerBase
                    $width='120px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='150px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoContentShimmer>
                <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
              </InfoItemShimmer>
            ))}
          </InfoListShimmer>
        </InfoCardShimmer>
      </ResponsiveGridShimmer>

      {/* Seção de Empresas (fora do grid) */}
      <div style={{ marginTop: '32px' }}>
        <CompaniesSectionShimmer>
          <CompaniesHeaderShimmer>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShimmerBase $width='24px' $height='24px' $borderRadius='6px' />
              <ShimmerBase $width='180px' $height='24px' $borderRadius='6px' />
            </div>
          </CompaniesHeaderShimmer>

          {/* Campo de busca */}
          <div style={{ padding: '0 32px 16px 32px' }}>
            <ShimmerBase $width='100%' $height='48px' $borderRadius='16px' />
          </div>

          <CompaniesListShimmer>
            {Array.from({ length: 3 }).map((_, index) => (
              <CompanyItemShimmer key={index}>
                <CompanyIconShimmer />
                <CompanyInfoShimmer>
                  <ShimmerBase
                    $width='160px'
                    $height='18px'
                    $borderRadius='4px'
                    $margin='0 0 6px 0'
                  />
                  <ShimmerBase
                    $width='200px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='180px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='160px'
                    $height='14px'
                    $borderRadius='4px'
                  />
                </CompanyInfoShimmer>
                <CompanyActionsShimmer>
                  <ShimmerBase
                    $width='36px'
                    $height='36px'
                    $borderRadius='8px'
                  />
                  <ShimmerBase
                    $width='36px'
                    $height='36px'
                    $borderRadius='8px'
                  />
                </CompanyActionsShimmer>
              </CompanyItemShimmer>
            ))}
          </CompaniesListShimmer>
        </CompaniesSectionShimmer>
      </div>
    </ProfileShimmerContainer>
  );
};

export default ProfilePageShimmer;
