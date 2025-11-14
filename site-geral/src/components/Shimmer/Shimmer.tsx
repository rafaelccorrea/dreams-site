import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

export const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutralLight} 0%,
    ${({ theme }) => theme.colors.neutral} 50%,
    ${({ theme }) => theme.colors.neutralLight} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

export const ShimmerBox = styled(ShimmerBase)<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
`










