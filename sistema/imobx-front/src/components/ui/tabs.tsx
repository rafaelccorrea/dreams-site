import React, { useState, createContext, useContext } from 'react';
import styled from 'styled-components';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}

const StyledTabs = styled.div`
  width: 100%;
`;

export const Tabs: React.FC<TabsProps> = ({
  children,
  defaultValue,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <StyledTabs className={className}>{children}</StyledTabs>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const StyledTabsList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return <StyledTabsList className={className}>{children}</StyledTabsList>;
};

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const StyledTabsTrigger = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  border-bottom: 2px solid
    ${props => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  value,
  className,
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <StyledTabsTrigger
      $isActive={isActive}
      className={className}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </StyledTabsTrigger>
  );
};

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const StyledTabsContent = styled.div<{ $isActive: boolean }>`
  display: ${props => (props.$isActive ? 'block' : 'none')};
`;

export const TabsContent: React.FC<TabsContentProps> = ({
  children,
  value,
  className,
}) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <StyledTabsContent $isActive={isActive} className={className}>
      {children}
    </StyledTabsContent>
  );
};
