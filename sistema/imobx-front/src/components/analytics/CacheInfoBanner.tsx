import React from 'react';
import { MdInfoOutline, MdUpdate } from 'react-icons/md';
import styled from 'styled-components';

const CacheBanner = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(59, 130, 246, 0.1)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.3)'
        : 'rgba(59, 130, 246, 0.2)'};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    padding: 12px 16px;
    margin-bottom: 20px;
    flex-direction: column;
    gap: 8px;
  }
`;

const CacheIcon = styled.div`
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const CacheContent = styled.div`
  flex: 1;
`;

const CacheTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CacheDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const CacheTime = styled.span`
  font-weight: 600;
  color: #3b82f6;
`;

interface CacheInfoBannerProps {
  formattedTime?: string;
  dataSource?: string;
}

export const CacheInfoBanner: React.FC<CacheInfoBannerProps> = ({
  formattedTime,
  dataSource = 'dados',
}) => {
  if (!formattedTime) return null;

  return (
    <CacheBanner>
      <CacheIcon>
        <MdInfoOutline />
      </CacheIcon>
      <CacheContent>
        <CacheTitle>
          <MdUpdate size={16} />
          Dados atualizados em cache
        </CacheTitle>
        <CacheDescription>
          Os {dataSource} foram atualizados pela última vez em{' '}
          <CacheTime>{formattedTime}</CacheTime>. Os dados serão atualizados em
          breve automaticamente.
        </CacheDescription>
      </CacheContent>
    </CacheBanner>
  );
};
