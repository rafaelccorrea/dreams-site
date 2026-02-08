import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Layout } from '../layout/Layout';

// Animação do shimmer
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
  $borderRadius?: string;
  $margin?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 0%,
    ${props => props.theme.colors.border || '#e0e0e0'} 50%,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const PageContent = styled.div`
  padding: 0 24px 32px;
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 24px 24px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormContainer = styled.div`
  background: transparent;
  border-radius: 0;
  border: none;
  overflow: visible;
`;

const Section = styled.div`
  padding: 0;
  margin-bottom: 32px;
  border-bottom: none;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldContainer = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px 0 0 0;
  background: transparent;
  border-top: none;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 0;
    margin-top: 24px;
  }
`;

export const CreatePropertyExpenseShimmer: React.FC = () => {
  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <ShimmerBase $width='200px' $height='32px' $borderRadius='8px' />
              <ShimmerBase $width='300px' $height='20px' $borderRadius='6px' />
            </PageTitleContainer>
            <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
          </PageHeader>

          <FormContainer>
            {/* Informações Básicas */}
            <Section>
              <SectionHeader>
                <ShimmerBase
                  $width='180px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='280px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </SectionHeader>

              <FieldContainer>
                <ShimmerBase
                  $width='60px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>

              <FieldContainer>
                <ShimmerBase
                  $width='80px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase
                  $width='100%'
                  $height='100px'
                  $borderRadius='8px'
                />
              </FieldContainer>

              <RowContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='50px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='60px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
              </RowContainer>

              <RowContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='80px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='150px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
              </RowContainer>
            </Section>

            {/* Recorrência */}
            <Section>
              <SectionHeader>
                <ShimmerBase
                  $width='120px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='250px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </SectionHeader>

              <CheckboxContainer>
                <ShimmerBase $width='18px' $height='18px' $borderRadius='4px' />
                <ShimmerBase
                  $width='140px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </CheckboxContainer>

              <RowContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='80px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='100px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
              </RowContainer>

              <RowContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='100px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
                <FieldContainer>
                  <ShimmerBase
                    $width='180px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='48px'
                    $borderRadius='8px'
                  />
                </FieldContainer>
              </RowContainer>
            </Section>

            {/* Notificações */}
            <Section>
              <SectionHeader>
                <ShimmerBase
                  $width='120px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='250px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </SectionHeader>

              <CheckboxContainer>
                <ShimmerBase $width='18px' $height='18px' $borderRadius='4px' />
                <ShimmerBase
                  $width='140px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </CheckboxContainer>

              <FieldContainer>
                <ShimmerBase
                  $width='150px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </Section>

            {/* Informações Adicionais */}
            <Section>
              <SectionHeader>
                <ShimmerBase
                  $width='200px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='280px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </SectionHeader>

              <FieldContainer>
                <ShimmerBase
                  $width='100px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase
                  $width='100%'
                  $height='100px'
                  $borderRadius='8px'
                />
              </FieldContainer>

              <FieldContainer>
                <ShimmerBase
                  $width='160px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </Section>

            {/* Integração Financeira */}
            <Section>
              <SectionHeader>
                <ShimmerBase
                  $width='200px'
                  $height='24px'
                  $borderRadius='6px'
                  $margin='0 0 4px 0'
                />
                <ShimmerBase
                  $width='280px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </SectionHeader>

              <CheckboxContainer>
                <ShimmerBase $width='18px' $height='18px' $borderRadius='4px' />
                <ShimmerBase
                  $width='200px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </CheckboxContainer>

              <FieldContainer>
                <ShimmerBase $width='100%' $height='60px' $borderRadius='8px' />
              </FieldContainer>
            </Section>

            {/* Botões de ação */}
            <FormActions>
              <ShimmerBase $width='120px' $height='48px' $borderRadius='8px' />
              <ShimmerBase $width='180px' $height='48px' $borderRadius='8px' />
            </FormActions>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default CreatePropertyExpenseShimmer;
