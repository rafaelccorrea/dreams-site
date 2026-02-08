import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const ShimmerWrapper = styled.div`
  width: 100%;
  padding: 32px;
`;

const ShimmerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const ShimmerTitle = styled.div`
  width: 200px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.cardBackground} 0px,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.cardBackground} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
`;

const ShimmerButton = styled.div`
  width: 150px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.cardBackground} 0px,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.cardBackground} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
`;

const ShimmerCalendar = styled.div`
  width: 100%;
  height: 600px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.cardBackground} 0px,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.cardBackground} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 12px;
`;

export const CalendarShimmer: React.FC = () => {
  return (
    <ShimmerWrapper>
      <ShimmerHeader>
        <ShimmerTitle />
        <ShimmerButton />
      </ShimmerHeader>
      <ShimmerCalendar />
    </ShimmerWrapper>
  );
};
