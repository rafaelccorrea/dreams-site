import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

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

const PageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const SectionBlock = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FieldWrap = styled.div`
  margin-bottom: 0;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
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

const CategoryCard = styled.div`
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
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ModeRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const CreateUserShimmer: React.FC = () => {
  return (
    <PageContainer>
      <ShimmerBase $width='120px' $height='40px' $borderRadius='8px' $margin='0 0 24px 0' />

      <PageHeader>
        <ShimmerBase $width='280px' $height='36px' $borderRadius='8px' $margin='0 0 8px 0' />
        <ShimmerBase $width='420px' $height='20px' $borderRadius='6px' />
      </PageHeader>

      {/* Informações Básicas */}
      <SectionBlock>
        <SectionHeader>
          <ShimmerBase $width='220px' $height='24px' $borderRadius='6px' $margin='0 0 8px 0' />
          <ShimmerBase $width='100%' $height='16px' $borderRadius='4px' />
        </SectionHeader>

        <RowContainer>
          <FieldWrap>
            <ShimmerBase $width='120px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
          </FieldWrap>
          <FieldWrap>
            <ShimmerBase $width='80px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
          </FieldWrap>
        </RowContainer>

        <RowContainer>
          <FieldWrap>
            <ShimmerBase $width='60px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
          </FieldWrap>
          <FieldWrap>
            <ShimmerBase $width='100px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
          </FieldWrap>
        </RowContainer>

        <RowContainer>
          <FieldWrap>
            <ShimmerBase $width='80px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
          </FieldWrap>
          <FieldWrap>
            <ShimmerBase $width='60px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
          </FieldWrap>
        </RowContainer>

        <RowContainer>
          <FieldWrap>
            <ShimmerBase $width='140px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
            <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
          </FieldWrap>
        </RowContainer>

        <RowContainer>
          <FieldWrap style={{ width: '100%' }}>
            <ShimmerBase $width='100%' $height='72px' $borderRadius='12px' />
          </FieldWrap>
        </RowContainer>
      </SectionBlock>

      {/* Permissões */}
      <SectionBlock>
        <SectionHeader>
          <ShimmerBase $width='140px' $height='24px' $borderRadius='6px' $margin='0 0 8px 0' />
          <ShimmerBase $width='100%' $height='16px' $borderRadius='4px' />
        </SectionHeader>

        <InfoBox>
          <ShimmerBase $width='24px' $height='24px' $borderRadius='50%' $margin='0' />
          <ShimmerBase $width='100%' $height='20px' $borderRadius='6px' />
        </InfoBox>

        <FieldWrap style={{ marginBottom: 20 }}>
          <ShimmerBase $width='140px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
          <ModeRow>
            <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
            <ShimmerBase $width='110px' $height='40px' $borderRadius='8px' />
          </ModeRow>
          <ShimmerBase $width='320px' $height='14px' $borderRadius='4px' $margin='4px 0 0 0' />
        </FieldWrap>

        <FieldWrap style={{ marginBottom: 24 }}>
          <ShimmerBase $width='130px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
          <ShimmerBase $width='100%' $height='44px' $borderRadius='8px' />
        </FieldWrap>

        <PermissionsGrid>
          {[1, 2, 3].map(cat => (
            <CategoryCard key={cat}>
              <CategoryHeader>
                <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
                <ShimmerBase $width='160px' $height='20px' $borderRadius='6px' />
              </CategoryHeader>
              {[1, 2, 3, 4].map(item => (
                <PermissionItem key={item}>
                  <ShimmerBase $width='20px' $height='20px' $borderRadius='4px' />
                  <div style={{ flex: 1 }}>
                    <ShimmerBase $width='70%' $height='14px' $borderRadius='4px' $margin='0 0 4px 0' />
                    <ShimmerBase $width='50%' $height='12px' $borderRadius='4px' />
                  </div>
                </PermissionItem>
              ))}
            </CategoryCard>
          ))}
        </PermissionsGrid>
      </SectionBlock>

      {/* Tags */}
      <SectionBlock>
        <SectionHeader>
          <ShimmerBase $width='100px' $height='24px' $borderRadius='6px' $margin='0 0 8px 0' />
          <ShimmerBase $width='100%' $height='16px' $borderRadius='4px' />
        </SectionHeader>

        <InfoBox>
          <ShimmerBase $width='24px' $height='24px' $borderRadius='50%' $margin='0' />
          <ShimmerBase $width='280px' $height='20px' $borderRadius='6px' />
        </InfoBox>

        <FieldWrap>
          <ShimmerBase $width='120px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
          <ShimmerBase $width='100%' $height='120px' $borderRadius='12px' />
        </FieldWrap>
      </SectionBlock>

      <FormActions>
        <ShimmerBase $width='120px' $height='48px' $borderRadius='10px' />
        <ShimmerBase $width='160px' $height='48px' $borderRadius='10px' />
      </FormActions>
    </PageContainer>
  );
};

export default CreateUserShimmer;
