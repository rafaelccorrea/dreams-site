import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  PageContainer,
  PageHeader,
  PageTitleContainer,
  FormContainer,
  Section,
  FormGroup,
  FormActions,
} from '../../pages/styles/CreateChecklistPage.styles';

// Animação de shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Componente base do shimmer
const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover || props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$radius || '8px'};
`;

const ShimmerTitle = styled(ShimmerBase)`
  width: 250px;
  height: 32px;
  margin-bottom: 8px;
`;

const ShimmerSubtitle = styled(ShimmerBase)`
  width: 400px;
  height: 18px;
`;

const ShimmerBackButton = styled(ShimmerBase)`
  width: 120px;
  height: 44px;
`;

const ShimmerSectionTitle = styled(ShimmerBase)`
  width: 200px;
  height: 24px;
  margin-bottom: 8px;
`;

const ShimmerSectionDescription = styled(ShimmerBase)`
  width: 100%;
  height: 16px;
  margin-bottom: 24px;
`;

const ShimmerLabel = styled(ShimmerBase)`
  width: 150px;
  height: 18px;
  margin-bottom: 8px;
`;

const ShimmerInput = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const ShimmerSelect = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const ShimmerTextarea = styled(ShimmerBase)`
  width: 100%;
  height: 100px;
`;

const ShimmerItemCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShimmerItemHeader = styled.div`
  display: flex;
  gap: 12px;
`;

const ShimmerItemTitle = styled(ShimmerBase)`
  flex: 1;
  height: 44px;
`;

const ShimmerDeleteButton = styled(ShimmerBase)`
  width: 44px;
  height: 44px;
`;

const ShimmerAddButton = styled(ShimmerBase)`
  width: 100%;
  height: 56px;
  border-radius: 8px;
`;

const ShimmerButton = styled(ShimmerBase)`
  width: 160px;
  height: 44px;
`;

export const CreateChecklistShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitleContainer>
          <ShimmerTitle />
          <ShimmerSubtitle />
        </PageTitleContainer>
        <ShimmerBackButton />
      </PageHeader>

      <FormContainer>
        <Section>
          <ShimmerSectionTitle />
          <ShimmerSectionDescription />

          <FormGroup>
            <ShimmerLabel />
            <ShimmerSelect />
          </FormGroup>

          <FormGroup>
            <ShimmerLabel />
            <ShimmerSelect />
          </FormGroup>

          <FormGroup>
            <ShimmerLabel />
            <ShimmerSelect />
          </FormGroup>

          <FormGroup>
            <ShimmerLabel />
            <ShimmerTextarea />
          </FormGroup>
        </Section>

        <Section>
          <ShimmerSectionTitle />
          <ShimmerSectionDescription />

          {[1, 2].map(i => (
            <ShimmerItemCard key={i}>
              <ShimmerItemHeader>
                <ShimmerItemTitle />
                <ShimmerDeleteButton />
              </ShimmerItemHeader>
              <ShimmerTextarea $height='80px' />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  gap: '12px',
                }}
              >
                <ShimmerInput $height='44px' />
                <ShimmerInput $height='44px' />
              </div>
            </ShimmerItemCard>
          ))}

          <ShimmerAddButton />
        </Section>

        <FormActions>
          <ShimmerButton />
          <ShimmerButton />
        </FormActions>
      </FormContainer>
    </PageContainer>
  );
};
