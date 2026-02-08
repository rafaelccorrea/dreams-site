import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

interface RequiredNoteProps {
  title?: string;
  message: string;
  className?: string;
}

const RequiredNoteContainer = styled.div`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const RequiredNote: React.FC<RequiredNoteProps> = ({
  title = 'Obrigatório',
  message,
  className,
}) => {
  return (
    <RequiredNoteContainer className={className}>
      <FaExclamationTriangle color='#1c4eff' />
      <strong>{title}:</strong> {message}
    </RequiredNoteContainer>
  );
};

export default RequiredNote;
