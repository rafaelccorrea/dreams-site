import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Animações
export const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Componentes
export const AlertInfo = styled.div`
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.4)' : '#3B82F6'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  color: ${props => (props.theme.mode === 'dark' ? '#93C5FD' : '#1E40AF')};
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const AlertHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => (props.theme.mode === 'dark' ? '#60A5FA' : '#3B82F6')};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.1)'};
    color: ${props => (props.theme.mode === 'dark' ? '#93C5FD' : '#2563EB')};
  }
`;

export const AlertTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => (props.theme.mode === 'dark' ? '#93C5FD' : '#1E40AF')};
  margin: 0;
`;

export const AlertContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  color: ${props => (props.theme.mode === 'dark' ? '#93C5FD' : '#1E40AF')};

  strong {
    color: ${props => (props.theme.mode === 'dark' ? '#BFDBFE' : '#1E3A8A')};
  }
`;

export const AlertActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const HideButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  color: ${props => (props.theme.mode === 'dark' ? '#60A5FA' : '#3B82F6')};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.5)' : '#3B82F6'};
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.1)'};
    border-color: ${props =>
      props.theme.mode === 'dark' ? '#93C5FD' : '#2563EB'};
    color: ${props => (props.theme.mode === 'dark' ? '#93C5FD' : '#2563EB')};
  }
`;

export const LinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => (props.theme.mode === 'dark' ? '#2563EB' : '#3B82F6')};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${props =>
      props.theme.mode === 'dark' ? '#1D4ED8' : '#2563EB'};
  }
`;

export const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ConfigItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.2)'
      : 'rgba(59, 130, 246, 0.1)'};
  border-radius: 6px;
`;

export const ConfigLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${props => (props.theme.mode === 'dark' ? '#93C5FD' : '#1E40AF')};
`;

export const ConfigValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${props => (props.theme.mode === 'dark' ? '#BFDBFE' : '#1E40AF')};
`;

export const ShimmerBox = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%)'
      : 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'};
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 12px;
  height: 160px;
  margin-bottom: 24px;
`;
