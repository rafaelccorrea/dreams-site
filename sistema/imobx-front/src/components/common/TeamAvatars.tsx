import React from 'react';
import styled from 'styled-components';
import { Avatar } from './Avatar';
import type { TeamMember } from '../../types/kanban';

interface TeamAvatarsProps {
  members: TeamMember[];
  maxVisible?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const AvatarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: -4px; /* Overlap avatars slightly */
`;

const AvatarWrapper = styled.div<{ index: number }>`
  margin-left: ${props => (props.index > 0 ? '-4px' : '0')};
  z-index: ${props => 10 - props.index};
  position: relative;
`;

const MoreCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid ${props => props.theme.colors.background};
  margin-left: -4px;
  z-index: 1;
  min-width: 32px;
  height: 32px;
  padding: 0 4px;
`;

export const TeamAvatars: React.FC<TeamAvatarsProps> = ({
  members,
  maxVisible = 5,
  size = 'medium',
  className,
}) => {
  // Filtrar apenas membros ativos
  const activeMembers = members.filter(member => member.isActive);

  // Se não há membros, não renderizar nada
  if (activeMembers.length === 0) {
    return null;
  }

  const visibleMembers = activeMembers.slice(0, maxVisible);
  const remainingCount = activeMembers.length - maxVisible;

  return (
    <AvatarsContainer className={className}>
      {visibleMembers.map((member, index) => (
        <AvatarWrapper key={member.id} index={index}>
          <Avatar
            src={member.user.avatar}
            alt={member.user.name}
            size={size}
            showTooltip={true}
          />
        </AvatarWrapper>
      ))}

      {remainingCount > 0 && <MoreCount>+{remainingCount}</MoreCount>}
    </AvatarsContainer>
  );
};
