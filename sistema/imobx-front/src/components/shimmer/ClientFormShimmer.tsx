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

// Container principal
const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

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

export const ClientFormShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <PageTitleContainer>
            <ShimmerBase $width='200px' $height='40px' $borderRadius='8px' />
            <ShimmerBase $width='400px' $height='20px' $borderRadius='6px' />
          </PageTitleContainer>
          <ShimmerBase $width='120px' $height='44px' $borderRadius='12px' />
        </PageHeader>

        <FormContainer>
          {/* Dados Básicos */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='180px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='280px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <FieldContainer>
              <ShimmerBase
                $width='140px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='80px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='60px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='40px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='150px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='70px'
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
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <FieldContainer>
              <ShimmerBase
                $width='120px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>
          </Section>

          {/* Contatos */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='120px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='250px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <FieldContainer>
              <ShimmerBase
                $width='160px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='150px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='100px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>
          </Section>

          {/* Endereço */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='100px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='200px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='50px'
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
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
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
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='80px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

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

          {/* Situação Pessoal */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='160px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='220px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <FieldContainer>
              <ShimmerBase
                $width='120px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>

            <FieldContainer>
              <ShimmerBase $width='160px' $height='20px' $borderRadius='4px' />
            </FieldContainer>
          </Section>

          {/* Dados Profissionais */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='180px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='280px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <FieldContainer>
              <ShimmerBase
                $width='180px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='90px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='120px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <FieldContainer>
              <ShimmerBase $width='180px' $height='20px' $borderRadius='4px' />
            </FieldContainer>
          </Section>

          {/* Informações Financeiras */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='220px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='200px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='120px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='130px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='120px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='140px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>
          </Section>

          {/* Dados Bancários */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='160px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='240px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='70px'
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
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <FieldContainer>
              <ShimmerBase
                $width='120px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>
          </Section>

          {/* Preferências Imobiliárias */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='220px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='300px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='140px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='140px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='120px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
              <FieldContainer>
                <ShimmerBase
                  $width='120px'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
              </FieldContainer>
            </RowContainer>
          </Section>

          {/* Informações MCMV */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='180px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='320px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <FieldContainer>
              <ShimmerBase
                $width='180px'
                $height='20px'
                $borderRadius='4px'
                $margin='0 0 16px 0'
              />
            </FieldContainer>

            <FieldContainer>
              <ShimmerBase
                $width='160px'
                $height='20px'
                $borderRadius='4px'
                $margin='0 0 16px 0'
              />
            </FieldContainer>

            <FieldContainer>
              <ShimmerBase
                $width='150px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
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

            <FieldContainer>
              <ShimmerBase
                $width='200px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='48px' $borderRadius='8px' />
            </FieldContainer>
          </Section>

          {/* Observações */}
          <Section>
            <SectionHeader>
              <ShimmerBase
                $width='140px'
                $height='24px'
                $borderRadius='6px'
                $margin='0 0 4px 0'
              />
              <ShimmerBase $width='280px' $height='16px' $borderRadius='4px' />
            </SectionHeader>

            <FieldContainer>
              <ShimmerBase
                $width='160px'
                $height='16px'
                $borderRadius='4px'
                $margin='0 0 8px 0'
              />
              <ShimmerBase $width='100%' $height='120px' $borderRadius='8px' />
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
  );
};

export default ClientFormShimmer;
