import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
`;

const FormGroupShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 40%;
  height: 16px;
`;

const HelpTextShimmer = styled(ShimmerBase)`
  width: 60%;
  height: 12px;
  margin-top: 4px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 40px;
  border-radius: 10px;
`;

const TextAreaShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 80px;
  border-radius: 10px;
`;

const SelectShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 40px;
  border-radius: 10px;
`;

const ButtonGroupShimmer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 40px;
  border-radius: 10px;
`;

export const ValidationModalShimmer: React.FC = () => {
  return (
    <Container>
      <FormGroupShimmer>
        <LabelShimmer />
        <SelectShimmer />
      </FormGroupShimmer>

      <FormGroupShimmer>
        <LabelShimmer />
        <HelpTextShimmer />
        <SelectShimmer />
      </FormGroupShimmer>

      <FormGroupShimmer>
        <LabelShimmer />
        <HelpTextShimmer />
        <TextAreaShimmer />
      </FormGroupShimmer>

      <FormGroupShimmer>
        <LabelShimmer />
        <SelectShimmer />
      </FormGroupShimmer>

      <ButtonGroupShimmer>
        <ButtonShimmer />
        <ButtonShimmer />
      </ButtonGroupShimmer>
    </Container>
  );
};
