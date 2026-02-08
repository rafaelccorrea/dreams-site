import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação do shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Base do shimmer
export const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
`;

// Container principal
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    gap: 16px;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
`;

// Cards
const FormContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 30px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  border: 1px solid ${props => props.theme.colors.border};
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
    padding: 24px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FieldContainer = styled.div`
  margin-bottom: 20px;
`;

// Info Box
const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20 0%,
    ${props => props.theme.colors.primary}10 100%
  );
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 16px;
  margin-bottom: 24px;
`;

// Permissions Grid
const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const PermissionCategory = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const PermissionInfo = styled.div`
  flex: 1;
`;

// Actions
const FormActions = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Button = styled.div`
  padding: 16px 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const CreateUserShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitleContainer>
          <ShimmerBase $width='120px' $height='40px' $borderRadius='12px' />
          <ShimmerBase $width='300px' $height='48px' $borderRadius='8px' />
        </PageTitleContainer>
        <ShimmerBase $width='200px' $height='20px' $borderRadius='8px' />
      </PageHeader>

      <ContentContainer>
        {/* Informações Básicas */}
        <FormContainer>
          <SectionHeader>
            <ShimmerBase $width='40px' $height='40px' $borderRadius='12px' />
            <ShimmerBase $width='200px' $height='28px' $borderRadius='8px' />
          </SectionHeader>

          <RowContainer>
            {/* Primeira linha */}
            <FieldContainer>
              <ShimmerBase
                $width='120px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
            </FieldContainer>
            <FieldContainer>
              <ShimmerBase
                $width='80px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
            </FieldContainer>
          </RowContainer>

          <RowContainer>
            {/* Segunda linha */}
            <FieldContainer>
              <ShimmerBase
                $width='100px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
            </FieldContainer>
            <FieldContainer>
              <ShimmerBase
                $width='140px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
            </FieldContainer>
          </RowContainer>

          <RowContainer>
            {/* Terceira linha */}
            <FieldContainer>
              <ShimmerBase
                $width='90px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
            </FieldContainer>
            <FieldContainer>
              <ShimmerBase
                $width='70px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
            </FieldContainer>
          </RowContainer>
        </FormContainer>

        {/* Permissões */}
        <FormContainer>
          <SectionHeader>
            <ShimmerBase $width='40px' $height='40px' $borderRadius='12px' />
            <ShimmerBase $width='150px' $height='28px' $borderRadius='8px' />
          </SectionHeader>

          <InfoBox>
            <ShimmerBase $width='24px' $height='24px' $borderRadius='50%' />
            <ShimmerBase $width='400px' $height='20px' $borderRadius='8px' />
          </InfoBox>

          <FieldContainer>
            <ShimmerBase
              $width='150px'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase $width='100%' $height='56px' $borderRadius='12px' />
          </FieldContainer>

          <PermissionsGrid>
            {/* Categoria 1 */}
            <PermissionCategory>
              <CategoryHeader>
                <ShimmerBase
                  $width='40px'
                  $height='40px'
                  $borderRadius='12px'
                />
                <ShimmerBase
                  $width='180px'
                  $height='20px'
                  $borderRadius='8px'
                />
              </CategoryHeader>

              {[1, 2, 3].map(item => (
                <PermissionItem key={item}>
                  <ShimmerBase
                    $width='20px'
                    $height='20px'
                    $borderRadius='4px'
                  />
                  <PermissionInfo>
                    <ShimmerBase
                      $width='150px'
                      $height='16px'
                      $borderRadius='4px'
                      $margin='0 0 4px 0'
                    />
                    <ShimmerBase
                      $width='100px'
                      $height='14px'
                      $borderRadius='4px'
                    />
                  </PermissionInfo>
                </PermissionItem>
              ))}
            </PermissionCategory>

            {/* Categoria 2 */}
            <PermissionCategory>
              <CategoryHeader>
                <ShimmerBase
                  $width='40px'
                  $height='40px'
                  $borderRadius='12px'
                />
                <ShimmerBase
                  $width='160px'
                  $height='20px'
                  $borderRadius='8px'
                />
              </CategoryHeader>

              {[1, 2, 3].map(item => (
                <PermissionItem key={item}>
                  <ShimmerBase
                    $width='20px'
                    $height='20px'
                    $borderRadius='4px'
                  />
                  <PermissionInfo>
                    <ShimmerBase
                      $width='140px'
                      $height='16px'
                      $borderRadius='4px'
                      $margin='0 0 4px 0'
                    />
                    <ShimmerBase
                      $width='90px'
                      $height='14px'
                      $borderRadius='4px'
                    />
                  </PermissionInfo>
                </PermissionItem>
              ))}
            </PermissionCategory>

            {/* Categoria 3 */}
            <PermissionCategory>
              <CategoryHeader>
                <ShimmerBase
                  $width='40px'
                  $height='40px'
                  $borderRadius='12px'
                />
                <ShimmerBase
                  $width='140px'
                  $height='20px'
                  $borderRadius='8px'
                />
              </CategoryHeader>

              {[1, 2].map(item => (
                <PermissionItem key={item}>
                  <ShimmerBase
                    $width='20px'
                    $height='20px'
                    $borderRadius='4px'
                  />
                  <PermissionInfo>
                    <ShimmerBase
                      $width='160px'
                      $height='16px'
                      $borderRadius='4px'
                      $margin='0 0 4px 0'
                    />
                    <ShimmerBase
                      $width='110px'
                      $height='14px'
                      $borderRadius='4px'
                    />
                  </PermissionInfo>
                </PermissionItem>
              ))}
            </PermissionCategory>
          </PermissionsGrid>
        </FormContainer>

        {/* Tags */}
        <FormContainer>
          <SectionHeader>
            <ShimmerBase $width='40px' $height='40px' $borderRadius='12px' />
            <ShimmerBase $width='80px' $height='28px' $borderRadius='8px' />
          </SectionHeader>

          <InfoBox>
            <ShimmerBase $width='24px' $height='24px' $borderRadius='50%' />
            <ShimmerBase $width='350px' $height='20px' $borderRadius='8px' />
          </InfoBox>

          <FieldContainer>
            <ShimmerBase
              $width='120px'
              $height='16px'
              $borderRadius='4px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase $width='100%' $height='120px' $borderRadius='12px' />
          </FieldContainer>
        </FormContainer>

        {/* Botões de ação */}
        <FormActions>
          <ShimmerBase $width='120px' $height='56px' $borderRadius='12px' />
          <ShimmerBase $width='150px' $height='56px' $borderRadius='12px' />
        </FormActions>
      </ContentContainer>
    </PageContainer>
  );
};

export default CreateUserShimmer;
