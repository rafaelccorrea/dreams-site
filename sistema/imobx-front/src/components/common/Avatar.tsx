import React from 'react';
import styled from 'styled-components';

const AvatarContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.size / 2.5}px;
  flex-shrink: 0;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

interface AvatarProps {
  name: string;
  image?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, image, size = 32 }) => {
  const getInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0]?.substring(0, 2) || '??';
  };

  return (
    <AvatarContainer size={size} title={name}>
      {image ? <AvatarImage src={image} alt={name} /> : getInitials(name)}
    </AvatarContainer>
  );
};
