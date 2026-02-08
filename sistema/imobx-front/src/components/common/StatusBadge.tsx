import React from 'react';
import styled from 'styled-components';
import {
  MdCheckCircle,
  MdLock,
  MdBuild,
  MdCheck,
  MdEdit,
} from 'react-icons/md';

interface StatusBadgeProps {
  status: 'available' | 'rented' | 'sold' | 'maintenance' | 'draft';
  children?: React.ReactNode;
}

const BadgeContainer = styled.div<{
  $status: string;
  $variant?: 'corner' | 'overlay';
}>`
  position: ${props => (props.$variant === 'corner' ? 'absolute' : 'static')};
  top: ${props => (props.$variant === 'corner' ? '8px' : 'auto')};
  left: ${props => (props.$variant === 'corner' ? '8px' : 'auto')};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  ${props => {
    switch (props.$status) {
      case 'available':
        return `
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        `;
      case 'rented':
        return `
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        `;
      case 'sold':
        return `
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        `;
      case 'maintenance':
        return `
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        `;
      case 'draft':
        return `
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        `;
      default:
        return `
          background: rgba(0, 0, 0, 0.7);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
    }
  }}

  ${props =>
    props.$variant === 'corner' &&
    `
    @media (max-width: 768px) {
      font-size: 10px;
      padding: 4px 8px;
      gap: 3px;
    }
  `}
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;

    @media (max-width: 768px) {
      width: 12px;
      height: 12px;
    }
  }
`;

const StatusText = styled.span`
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const getStatusInfo = (status: string) => {
  const statusMap: {
    [key: string]: { label: string; icon: React.ComponentType };
  } = {
    available: { label: 'Disponível', icon: MdCheckCircle },
    rented: { label: 'Alugado', icon: MdLock },
    sold: { label: 'Vendido', icon: MdCheck },
    maintenance: { label: 'Manutenção', icon: MdBuild },
    draft: { label: 'Rascunho', icon: MdEdit },
  };

  return statusMap[status] || statusMap.available;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
}) => {
  const statusInfo = getStatusInfo(status);
  const IconComponent = statusInfo.icon;

  return (
    <BadgeContainer $status={status} $variant='corner'>
      <StatusIcon>
        <IconComponent />
      </StatusIcon>
      <StatusText>{children || statusInfo.label}</StatusText>
    </BadgeContainer>
  );
};

// Versão para modal (maior)
export const StatusBadgeLarge: React.FC<StatusBadgeProps> = ({
  status,
  children,
}) => {
  const statusInfo = getStatusInfo(status);
  const IconComponent = statusInfo.icon;

  return (
    <BadgeContainer $status={status} $variant='overlay'>
      <StatusIcon>
        <IconComponent />
      </StatusIcon>
      <StatusText>{children || statusInfo.label}</StatusText>
    </BadgeContainer>
  );
};
