import React from 'react';
import styled from 'styled-components';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

const StyledPageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageTitle: React.FC<PageTitleProps> = ({
  children,
  className,
}) => {
  return <StyledPageTitle className={className}>{children}</StyledPageTitle>;
};

export default PageTitle;
