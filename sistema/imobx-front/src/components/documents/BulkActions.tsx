import React from 'react';
import styled from 'styled-components';
import {
  MdDelete,
  MdArchive,
  MdDownload,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import { PermissionButton } from '../common/PermissionButton';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onArchive?: () => void;
  onDownload?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onClearSelection: () => void;
  loading?: boolean;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onArchive,
  onDownload,
  onApprove,
  onReject,
  onClearSelection,
  loading = false,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <BulkActionsContainer>
      <BulkActionsContent>
        <SelectionInfo>
          <SelectionCount>{selectedCount}</SelectionCount>
          <SelectionLabel>
            {selectedCount === 1
              ? 'documento selecionado'
              : 'documentos selecionados'}
          </SelectionLabel>
        </SelectionInfo>

        <ActionsGroup>
          {onDownload && (
            <PermissionButton
              permission='document:download'
              onClick={onDownload}
              disabled={loading}
              variant='secondary'
              size='small'
            >
              <MdDownload size={16} />
              Download
            </PermissionButton>
          )}

          {onArchive && (
            <PermissionButton
              permission='document:update'
              onClick={onArchive}
              disabled={loading}
              variant='secondary'
              size='small'
            >
              <MdArchive size={16} />
              Arquivar
            </PermissionButton>
          )}

          {onApprove && (
            <PermissionButton
              permission='document:approve'
              onClick={onApprove}
              disabled={loading}
              variant='primary'
              size='small'
            >
              <MdCheck size={16} />
              Aprovar
            </PermissionButton>
          )}

          {onReject && (
            <PermissionButton
              permission='document:approve'
              onClick={onReject}
              disabled={loading}
              variant='danger'
              size='small'
            >
              <MdClose size={16} />
              Rejeitar
            </PermissionButton>
          )}

          <PermissionButton
            permission='document:delete'
            onClick={onDelete}
            disabled={loading}
            variant='danger'
            size='small'
          >
            <MdDelete size={16} />
            Excluir
          </PermissionButton>
        </ActionsGroup>

        <ClearButton onClick={onClearSelection} disabled={loading}>
          <MdClose size={16} />
        </ClearButton>
      </BulkActionsContent>
    </BulkActionsContainer>
  );
};

// Styled Components
const BulkActionsContainer = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }
`;

const BulkActionsContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  min-width: 400px;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
    padding: 12px 16px;
    gap: 12px;
  }
`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const SelectionCount = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;

const SelectionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
`;

const ActionsGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`;

const ClearButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.error}15;
    border-color: ${props => props.theme.colors.error}30;
    color: ${props => props.theme.colors.error};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
