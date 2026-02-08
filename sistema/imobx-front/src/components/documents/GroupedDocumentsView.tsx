import React, { useState } from 'react';
import styled from 'styled-components';
import { MdExpandMore, MdExpandLess, MdPerson, MdHome } from 'react-icons/md';
import type { GroupedDocuments, DocumentModel } from '../../types/document';
import { DocumentsTable } from './DocumentsTable';

interface GroupedDocumentsViewProps {
  groupedDocuments: GroupedDocuments[];
  onDocumentAction?: (action: string, document: DocumentModel) => void;
  onViewDocument?: (document: DocumentModel) => void;
  onEditDocument?: (document: DocumentModel) => void;
  onDeleteDocument?: (document: DocumentModel) => void;
  loading?: boolean;
  silentLoading?: boolean;
}

export const GroupedDocumentsView: React.FC<GroupedDocumentsViewProps> = ({
  groupedDocuments,
  onDocumentAction,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  loading = false,
  silentLoading = false,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedGroups(new Set(groupedDocuments.map(g => g.entity.id)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  if (groupedDocuments.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📁</EmptyIcon>
        <EmptyTitle>Nenhum grupo de documentos encontrado</EmptyTitle>
        <EmptyDescription>
          Os documentos serão agrupados por cliente ou propriedade quando
          disponíveis.
        </EmptyDescription>
      </EmptyState>
    );
  }

  return (
    <Container>
      {silentLoading && <LoadingBar />}
      <GroupActions>
        <ActionButton onClick={expandAll}>Expandir Todos</ActionButton>
        <ActionButton onClick={collapseAll}>Recolher Todos</ActionButton>
      </GroupActions>

      {groupedDocuments.map(group => {
        const isExpanded = expandedGroups.has(group.entity.id);
        const icon =
          group.entityType === 'client' ? (
            <MdPerson size={20} />
          ) : (
            <MdHome size={20} />
          );

        return (
          <GroupCard key={group.entity.id}>
            <GroupHeader onClick={() => toggleGroup(group.entity.id)}>
              <GroupInfo>
                <GroupIcon $type={group.entityType}>{icon}</GroupIcon>
                <GroupDetails>
                  <GroupName>{group.entity.name}</GroupName>
                  <GroupMeta>
                    {group.entityType === 'client' && group.entity.cpf && (
                      <span>CPF: {group.entity.cpf}</span>
                    )}
                    {group.entityType === 'property' && group.entity.code && (
                      <span>Código: {group.entity.code}</span>
                    )}
                    <DocumentCount>
                      {group.documents.length} documento(s)
                    </DocumentCount>
                  </GroupMeta>
                </GroupDetails>
              </GroupInfo>
              <ExpandButton $expanded={isExpanded}>
                {isExpanded ? (
                  <MdExpandLess size={24} />
                ) : (
                  <MdExpandMore size={24} />
                )}
              </ExpandButton>
            </GroupHeader>

            {isExpanded && (
              <GroupContent>
                <DocumentsTable
                  documents={group.documents}
                  loading={loading}
                  onDocumentAction={onDocumentAction}
                  onViewDocument={onViewDocument}
                  onEditDocument={onEditDocument}
                  onDeleteDocument={onDeleteDocument}
                />
              </GroupContent>
            )}
          </GroupCard>
        );
      })}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LoadingBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.theme.colors.primary};
  z-index: 1000;
  animation: loading 1.5s ease-in-out infinite;

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const GroupActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const GroupCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background}50;
  }
`;

const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const GroupIcon = styled.div<{ $type: 'client' | 'property' }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.$type === 'client'
      ? `${props.theme.colors.primary}15`
      : `${props.theme.colors.success}15`};
  color: ${props =>
    props.$type === 'client'
      ? props.theme.colors.primary
      : props.theme.colors.success};
  flex-shrink: 0;
`;

const GroupDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const GroupMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
`;

const DocumentCount = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ExpandButton = styled.div<{ $expanded: boolean }>`
  color: ${props => props.theme.colors.textSecondary};
  transition: transform 0.2s ease;
  transform: ${props => (props.$expanded ? 'rotate(0deg)' : 'rotate(0deg)')};
  display: flex;
  align-items: center;
`;

const GroupContent = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  gap: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  max-width: 400px;
`;
