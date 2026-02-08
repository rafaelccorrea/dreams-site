import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDownload,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdWarning,
  MdSchedule,
  MdLink,
  MdPerson,
  MdHome,
  MdEdit as MdSignature,
  MdCheckCircle,
  MdPending,
  MdMoreVert,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import type { DocumentModel } from '../../types/document';
import {
  DocumentTypeLabels,
  DocumentStatusLabels,
  StatusColors,
} from '../../types/document';
import { formatFileSize, formatDate } from '../../utils/format';
import { PermissionButton } from '../common/PermissionButton';
import { PermissionMenuItem } from '../common/PermissionMenuItem';
import { SignatureStatusBadge } from './SignatureStatusBadge';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { Tooltip } from '../ui/Tooltip';
import { DraggableContainer } from '../common/DraggableContainer';

interface DocumentsTableProps {
  documents: DocumentModel[];
  loading?: boolean;
  silentLoading?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onDocumentAction?: (action: string, document: DocumentModel) => void;
  onViewDocument?: (document: DocumentModel) => void;
  onEditDocument?: (document: DocumentModel) => void;
  onDeleteDocument?: (document: DocumentModel) => void;
  onCreateLink?: (document: DocumentModel) => void;
  onSendForSignature?: (document: DocumentModel) => void;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  loading = false,
  silentLoading = false,
  onSelectionChange,
  onDocumentAction,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onCreateLink,
  onSendForSignature,
}) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
    openUp: boolean;
  } | null>(null);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedDocs);
    }
  }, [selectedDocs, onSelectionChange]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = documents.map(doc => doc.id);
      setSelectedDocs(allIds);
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs(prev => [...prev, docId]);
    } else {
      setSelectedDocs(prev => prev.filter(id => id !== docId));
    }
  };

  const isAllSelected =
    documents.length > 0 && selectedDocs.length === documents.length;
  const isPartiallySelected =
    selectedDocs.length > 0 && selectedDocs.length < documents.length;

  // Verifica se o documento tem assinaturas ativas ou já finalizadas
  // O botão "Enviar para Assinatura" não deve aparecer quando:
  // 1. Todas as assinaturas já foram assinadas (signed === total)
  // 2. Há assinaturas pendentes (pending)
  // 3. Há assinaturas visualizadas (viewed) que não estão expiradas
  // 4. Há assinaturas canceladas (cancelled) - processo foi cancelado
  //
  // Status possíveis: pending, viewed, signed, rejected, expired, cancelled
  const hasActiveSignatures = (doc: DocumentModel): boolean => {
    if (!doc.signatures?.hasSignatures) return false;

    // Se todas as assinaturas já foram assinadas, não deve mostrar o botão
    if (
      doc.signatures.signed === doc.signatures.total &&
      doc.signatures.total > 0
    ) {
      return true;
    }

    // Verifica se há assinaturas pendentes
    if (doc.signatures.pending > 0) return true;

    // Verifica nos signers individuais se há algum com status ativo
    if (doc.signatures.signers && doc.signatures.signers.length > 0) {
      return doc.signatures.signers.some(signer => {
        // Status que impedem novo envio:
        // - signed: já assinado
        // - pending: aguardando assinatura
        // - viewed: visualizado mas não expirado (ainda pode assinar)
        // - cancelled: processo cancelado
        if (
          signer.status === 'signed' ||
          signer.status === 'pending' ||
          signer.status === 'cancelled'
        ) {
          return true;
        }

        // viewed: só é ativo se não estiver expirado
        if (signer.status === 'viewed') {
          return !signer.isExpired;
        }

        // rejected e expired: permitem novo envio (retorna false)
        return false;
      });
    }

    return false;
  };

  const getFileIcon = (extension: string): string => {
    const icons: Record<string, string> = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      webp: '🖼️',
      txt: '📃',
    };
    return icons[extension.toLowerCase()] || '📎';
  };

  const isExpiring = (expiryDate: string | Date | undefined): boolean => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string | Date | undefined): boolean => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const getDaysUntilExpiry = (
    expiryDate: string | Date | undefined
  ): number => {
    if (!expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const handleDownload = (doc: DocumentModel) => {
    if (onDocumentAction) {
      onDocumentAction('download', doc);
    }
  };

  const handleEdit = (doc: DocumentModel) => {
    if (onEditDocument) {
      onEditDocument(doc);
    } else if (onDocumentAction) {
      onDocumentAction('edit', doc);
    }
  };

  const handleDelete = (doc: DocumentModel) => {
    if (onDeleteDocument) {
      onDeleteDocument(doc);
    } else if (onDocumentAction) {
      onDocumentAction('delete', doc);
    }
  };

  const handleView = (doc: DocumentModel) => {
    if (onViewDocument) {
      onViewDocument(doc);
    } else if (onDocumentAction) {
      onDocumentAction('view', doc);
    }
  };

  const handleCreateLink = (doc: DocumentModel) => {
    if (onCreateLink) {
      onCreateLink(doc);
    } else if (onDocumentAction) {
      onDocumentAction('create_link', doc);
    }
  };

  const handleSendForSignature = (doc: DocumentModel) => {
    if (onSendForSignature) {
      onSendForSignature(doc);
    } else if (onDocumentAction) {
      onDocumentAction('send_for_signature', doc);
    }
  };

  const handleToggleMenu = (docId: string) => {
    setOpenMenuId(openMenuId === docId ? null : docId);
  };

  const handleMenuAction = (
    doc: DocumentModel,
    action: string,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Fechar menu primeiro
    setOpenMenuId(null);

    // Executar ação imediatamente
    switch (action) {
      case 'view':
        handleView(doc);
        break;
      case 'download':
        handleDownload(doc);
        break;
      case 'edit':
        handleEdit(doc);
        break;
      case 'create_link':
        handleCreateLink(doc);
        break;
      case 'send_for_signature':
        handleSendForSignature(doc);
        break;
      case 'delete':
        handleDelete(doc);
        break;
    }
  };

  const toggleTags = (docId: string) => {
    setExpandedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  // Fechar menu ao clicar fora
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Calcular posição do menu quando abrir
  useEffect(() => {
    if (openMenuId) {
      const menuContainer = menuRefs.current[openMenuId];
      if (!menuContainer) return;

      const calculatePosition = () => {
        const buttonElement = menuContainer.querySelector(
          'button[aria-label="Menu de ações"]'
        ) as HTMLElement;
        if (!buttonElement) return;

        const buttonRect = buttonElement.getBoundingClientRect();
        const dropdownHeight = 280; // Altura estimada do dropdown (com todos os itens)
        const spacing = 8;
        const viewportHeight = window.innerHeight;

        // Verificar se há espaço suficiente abaixo do botão
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // Se não há espaço suficiente abaixo E há mais espaço acima, abrir para cima
        const openUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        let top: number;
        if (openUp) {
          top = buttonRect.top - dropdownHeight - spacing;
        } else {
          top = buttonRect.bottom + spacing;
        }

        // Garantir que o menu não saia da viewport
        top = Math.max(8, Math.min(top, viewportHeight - dropdownHeight - 8));

        const right = window.innerWidth - buttonRect.right;

        setMenuPosition({ top, right, openUp });
      };

      // Calcular após um pequeno delay para garantir que o DOM foi atualizado
      setTimeout(calculatePosition, 0);

      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);

      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    } else {
      setMenuPosition(null);
    }
  }, [openMenuId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(menuRefs.current).forEach(docId => {
        const ref = menuRefs.current[docId];
        if (ref && !ref.contains(event.target as Node)) {
          // Pequeno delay para permitir que ações do menu sejam executadas primeiro
          setTimeout(() => {
            setOpenMenuId(prev => (prev === docId ? null : prev));
          }, 150);
        }
      });
    };

    if (openMenuId) {
      // Usar 'click' ao invés de 'mousedown' para dar tempo da ação ser executada
      document.addEventListener('click', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [openMenuId]);

  if (documents.length === 0) {
    return (
      <DraggableContainer>
        <TableContainer>
          <EmptyState>
            <EmptyIcon>📄</EmptyIcon>
            <EmptyTitle>Nenhum documento encontrado</EmptyTitle>
            <EmptyDescription>
              Tente ajustar os filtros ou fazer upload de novos documentos.
            </EmptyDescription>
          </EmptyState>
        </TableContainer>
      </DraggableContainer>
    );
  }

  return (
    <DraggableContainer>
      <TableContainer>
        {silentLoading && <LoadingOverlay />}
        <Table $loading={silentLoading}>
          <TableHeader>
            <TableRow>
              <CheckboxHeader>
                <CheckboxContainer>
                  <CheckboxInput
                    type='checkbox'
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isPartiallySelected;
                    }}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                  <CheckboxIcon>
                    {isAllSelected ? (
                      <MdCheckBox size={20} />
                    ) : (
                      <MdCheckBoxOutlineBlank size={20} />
                    )}
                  </CheckboxIcon>
                </CheckboxContainer>
              </CheckboxHeader>
              <HeaderCell>Documento</HeaderCell>
              <HeaderCell>Cliente/Propriedade</HeaderCell>
              <HeaderCell>Tipo</HeaderCell>
              <HeaderCell>Tags</HeaderCell>
              <HeaderCell>Tamanho</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Assinaturas</HeaderCell>
              <HeaderCell>Vencimento</HeaderCell>
              <HeaderCell>Upload</HeaderCell>
              <HeaderCell>Ações</HeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map(doc => {
              const isDocSelected = selectedDocs.includes(doc.id);
              const isExpiringDoc = isExpiring(doc.expiryDate);
              const isExpiredDoc = isExpired(doc.expiryDate);
              const daysUntilExpiry = getDaysUntilExpiry(doc.expiryDate);

              // Acessar informações da entidade agrupada (se existir)
              const groupEntity = (doc as any)._groupEntity;
              const groupEntityType = (doc as any)._groupEntityType;

              return (
                <TableRow key={doc.id} $selected={isDocSelected}>
                  <CheckboxCell>
                    <CheckboxContainer>
                      <CheckboxInput
                        type='checkbox'
                        checked={isDocSelected}
                        onChange={e =>
                          handleSelectDoc(doc.id, e.target.checked)
                        }
                      />
                      <CheckboxIcon>
                        {isDocSelected ? (
                          <MdCheckBox size={18} />
                        ) : (
                          <MdCheckBoxOutlineBlank size={18} />
                        )}
                      </CheckboxIcon>
                    </CheckboxContainer>
                  </CheckboxCell>

                  <DocumentCell>
                    <Tooltip
                      content={doc.title || doc.originalName}
                      placement='top'
                    >
                      <DocumentInfo>
                        <DocumentIcon>
                          {getFileIcon(doc.fileExtension)}
                        </DocumentIcon>
                        <DocumentName title={doc.title || doc.originalName}>
                          {doc.title || doc.originalName}
                        </DocumentName>
                      </DocumentInfo>
                    </Tooltip>
                  </DocumentCell>

                  <EntityCell>
                    {groupEntity ? (
                      <Tooltip
                        content={
                          groupEntityType === 'client'
                            ? `${groupEntity.name}${groupEntity.cpf ? ` - CPF: ${groupEntity.cpf}` : ''}${groupEntity.email ? ` - ${groupEntity.email}` : ''}`
                            : `${groupEntity.name}${groupEntity.code ? ` - Cód: ${groupEntity.code}` : ''}${groupEntity.address ? ` - ${groupEntity.address}` : ''}`
                        }
                        placement='top'
                      >
                        <EntityInfo>
                          <EntityIcon $type={groupEntityType}>
                            {groupEntityType === 'client' ? (
                              <MdPerson size={16} />
                            ) : (
                              <MdHome size={16} />
                            )}
                          </EntityIcon>
                          <EntityDetails>
                            <EntityName title={groupEntity.name}>
                              {groupEntity.name}
                            </EntityName>
                            {groupEntityType === 'client' && (
                              <EntityMeta>
                                {groupEntity.cpf && (
                                  <span>CPF: {groupEntity.cpf}</span>
                                )}
                                {groupEntity.email && (
                                  <span> • {groupEntity.email}</span>
                                )}
                              </EntityMeta>
                            )}
                            {groupEntityType === 'property' && (
                              <EntityMeta>
                                {groupEntity.code && (
                                  <span>Cód: {groupEntity.code}</span>
                                )}
                                {groupEntity.address && (
                                  <span> • {groupEntity.address}</span>
                                )}
                              </EntityMeta>
                            )}
                          </EntityDetails>
                        </EntityInfo>
                      </Tooltip>
                    ) : (
                      <NoEntity>-</NoEntity>
                    )}
                  </EntityCell>

                  <TypeCell>
                    <Tooltip
                      content={`Tipo: ${DocumentTypeLabels[doc.type] || 'Desconhecido'}`}
                      placement='top'
                    >
                      <TypeBadge>
                        {DocumentTypeLabels[doc.type] || 'Desconhecido'}
                      </TypeBadge>
                    </Tooltip>
                  </TypeCell>

                  <TagsCell>
                    {doc.tags && doc.tags.length > 0 ? (
                      <Tooltip content={doc.tags.join(', ')} placement='top'>
                        <TagsContainer>
                          <TagsList $expanded={expandedTags.has(doc.id)}>
                            <TagBadge>{doc.tags[0]}</TagBadge>
                            {doc.tags.length > 1 && (
                              <>
                                {expandedTags.has(doc.id) &&
                                  doc.tags
                                    .slice(1)
                                    .map((tag, index) => (
                                      <TagBadge key={index + 1}>{tag}</TagBadge>
                                    ))}
                                <TagToggleButton
                                  onClick={() => toggleTags(doc.id)}
                                >
                                  {expandedTags.has(doc.id) ? (
                                    <>
                                      <MdExpandLess size={14} />
                                      <span>Menos</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>+{doc.tags.length - 1}</span>
                                      <MdExpandMore size={14} />
                                    </>
                                  )}
                                </TagToggleButton>
                              </>
                            )}
                          </TagsList>
                        </TagsContainer>
                      </Tooltip>
                    ) : (
                      <NoTags>-</NoTags>
                    )}
                  </TagsCell>

                  <SizeCell>
                    <Tooltip
                      content={`Tamanho: ${formatFileSize(doc.fileSize)}`}
                      placement='top'
                    >
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </Tooltip>
                  </SizeCell>

                  <StatusCell>
                    <Tooltip
                      content={`Status: ${DocumentStatusLabels[doc.status] || 'Desconhecido'}`}
                      placement='top'
                    >
                      <StatusBadge
                        $color={
                          StatusColors[doc.status] || {
                            background: '#6b7280',
                            color: '#ffffff',
                          }
                        }
                      >
                        {DocumentStatusLabels[doc.status] || 'Desconhecido'}
                      </StatusBadge>
                    </Tooltip>
                  </StatusCell>

                  <SignatureCell>
                    {doc.isForSignature && doc.signatures ? (
                      <Tooltip
                        content={
                          doc.signatures.hasSignatures
                            ? `Assinaturas: ${doc.signatures.signed} assinadas de ${doc.signatures.total} total${doc.signatures.pending > 0 ? `, ${doc.signatures.pending} pendentes` : ''}${doc.signatures.rejected > 0 ? `, ${doc.signatures.rejected} rejeitadas` : ''}${doc.signatures.expired > 0 ? `, ${doc.signatures.expired} expiradas` : ''}`
                            : 'Sem assinaturas'
                        }
                        placement='top'
                      >
                        <SignatureInfo>
                          {doc.signatures.hasSignatures ? (
                            <>
                              <SignatureBadges>
                                {doc.signatures.signers
                                  .slice(0, 3)
                                  .map(signer => (
                                    <Tooltip
                                      key={signer.id}
                                      content={`${signer.name} (${signer.email}) - ${signer.status === 'pending' ? 'Pendente' : signer.status === 'viewed' ? 'Visualizado' : signer.status === 'signed' ? 'Assinado' : signer.status === 'rejected' ? 'Rejeitado' : signer.status === 'expired' ? 'Expirado' : signer.status}`}
                                      placement='top'
                                    >
                                      <SignatureStatusBadge
                                        status={signer.status as any}
                                      />
                                    </Tooltip>
                                  ))}
                                {doc.signatures.signers.length > 3 && (
                                  <MoreSigners>
                                    +{doc.signatures.signers.length - 3}
                                  </MoreSigners>
                                )}
                              </SignatureBadges>
                              <SignatureStats>
                                <StatItem>
                                  <MdCheckCircle size={12} color='#10b981' />
                                  <span>
                                    {doc.signatures.signed}/
                                    {doc.signatures.total}
                                  </span>
                                </StatItem>
                                {doc.signatures.pending > 0 && (
                                  <StatItem>
                                    <MdPending size={12} color='#f59e0b' />
                                    <span>{doc.signatures.pending}</span>
                                  </StatItem>
                                )}
                              </SignatureStats>
                            </>
                          ) : (
                            <NoSignatures>Sem assinaturas</NoSignatures>
                          )}
                        </SignatureInfo>
                      </Tooltip>
                    ) : (
                      <NoSignatures>-</NoSignatures>
                    )}
                  </SignatureCell>

                  <ExpiryCell
                    $isExpired={isExpiredDoc}
                    $isExpiring={isExpiringDoc}
                  >
                    {doc.expiryDate ? (
                      <Tooltip
                        content={`Vencimento: ${formatDate(doc.expiryDate)}${daysUntilExpiry !== undefined ? ` (${daysUntilExpiry <= 0 ? 'Vencido' : `${daysUntilExpiry} dia(s) restantes`})` : ''}`}
                        placement='top'
                      >
                        <ExpiryInfo>
                          <ExpiryDate>{formatDate(doc.expiryDate)}</ExpiryDate>
                          {isExpiringDoc && (
                            <ExpiryWarning>
                              <MdWarning size={14} />
                              {daysUntilExpiry <= 0
                                ? 'Vencido'
                                : `${daysUntilExpiry} dia(s)`}
                            </ExpiryWarning>
                          )}
                        </ExpiryInfo>
                      </Tooltip>
                    ) : (
                      <NoExpiry>-</NoExpiry>
                    )}
                  </ExpiryCell>

                  <UploadCell>
                    <Tooltip
                      content={`Upload em: ${formatDate(doc.createdAt)}`}
                      placement='top'
                    >
                      <UploadDate>{formatDate(doc.createdAt)}</UploadDate>
                    </Tooltip>
                  </UploadCell>

                  <ActionsCell>
                    <ActionsMenuContainer
                      ref={el => (menuRefs.current[doc.id] = el)}
                    >
                      <MenuButton
                        onClick={() => handleToggleMenu(doc.id)}
                        $isOpen={openMenuId === doc.id}
                        aria-label='Menu de ações'
                      >
                        <MdMoreVert size={20} />
                      </MenuButton>
                      {openMenuId === doc.id && menuPosition && (
                        <MenuDropdown
                          onClick={e => e.stopPropagation()}
                          $position={menuPosition}
                        >
                          <PermissionMenuItem
                            permission='document:read'
                            onClick={e => handleMenuAction(doc, 'view', e)}
                          >
                            <MdVisibility size={18} />
                            <span>Visualizar</span>
                          </PermissionMenuItem>

                          <PermissionMenuItem
                            permission='document:download'
                            onClick={e => handleMenuAction(doc, 'download', e)}
                          >
                            <MdDownload size={18} />
                            <span>Download</span>
                          </PermissionMenuItem>

                          <PermissionMenuItem
                            permission='document:update'
                            onClick={e => handleMenuAction(doc, 'edit', e)}
                          >
                            <MdEdit size={18} />
                            <span>Editar</span>
                          </PermissionMenuItem>

                          <MenuDivider />

                          <PermissionMenuItem
                            permission='document:create'
                            onClick={e =>
                              handleMenuAction(doc, 'create_link', e)
                            }
                          >
                            <MdLink size={18} />
                            <span>Criar Link Público</span>
                          </PermissionMenuItem>

                          {!hasActiveSignatures(doc) && (
                            <PermissionMenuItem
                              permission='document:create'
                              onClick={e =>
                                handleMenuAction(doc, 'send_for_signature', e)
                              }
                            >
                              <MdSignature size={18} />
                              <span>Enviar para Assinatura</span>
                            </PermissionMenuItem>
                          )}

                          <MenuDivider />

                          <PermissionMenuItem
                            permission='document:delete'
                            onClick={e => handleMenuAction(doc, 'delete', e)}
                            danger
                          >
                            <MdDelete size={18} />
                            <span>Excluir</span>
                          </PermissionMenuItem>
                        </MenuDropdown>
                      )}
                    </ActionsMenuContainer>
                  </ActionsCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ScrollIndicator>← Deslize para ver mais →</ScrollIndicator>
    </DraggableContainer>
  );
};

// Styled Components
const TableContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  overflow-x: auto;
  overflow-y: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.primary}60 transparent;

  /* Melhor scroll para mobile */
  @media (max-width: 768px) {
    overflow-x: scroll;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: none;
    padding-bottom: 8px;
    touch-action: pan-x;
    overscroll-behavior-x: contain;
    width: 100%;

    /* Forçar scroll horizontal no mobile */
    & > * {
      min-width: max-content;
    }

    /* Scrollbar mais visível no mobile */
    scrollbar-width: auto;
    scrollbar-color: ${props => props.theme.colors.primary}80 transparent;
  }

  /* Estilizar scrollbar para WebKit */
  &::-webkit-scrollbar {
    height: 8px;

    @media (max-width: 768px) {
      height: 6px;
    }
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    @media (max-width: 768px) {
      background: ${props => props.theme.colors.primary}80;
    }

    &:hover {
      background: ${props => props.theme.colors.primary}80;
    }
  }
`;

const ScrollIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 0 16px 16px;
  text-align: center;
  font-weight: 500;

  @media (min-width: 1201px) {
    display: none;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.theme.colors.primary};
  z-index: 10;
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

const Table = styled.table<{ $loading?: boolean }>`
  width: 100%;
  min-width: 1450px; /* Largura mínima para garantir scroll horizontal */
  border-collapse: collapse;
  background: ${props => props.theme.colors.surface};
  opacity: ${props => (props.$loading ? 0.6 : 1)};

  @media (max-width: 768px) {
    min-width: 1250px; /* Largura mínima reduzida no mobile */
    display: table;
    table-layout: auto;
  }
  transition: opacity 0.3s ease;

  @media (max-width: 1024px) {
    min-width: 1250px; /* Largura mínima menor em tablets */
  }

  @media (max-width: 768px) {
    min-width: 1150px; /* Largura mínima menor em mobile */
  }
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $selected?: boolean }>`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  background: ${props =>
    props.$selected ? `${props.theme.colors.primary}10` : 'transparent'};

  &:hover {
    background: ${props =>
      props.$selected
        ? `${props.theme.colors.primary}15`
        : `${props.theme.colors.background}50`};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CheckboxHeader = styled.th`
  width: 50px;
  padding: 16px 12px;
  text-align: center;
`;

const HeaderCell = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  &:first-of-type {
    padding-left: 20px;
  }

  &:last-of-type {
    padding-right: 20px;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 11px;
    letter-spacing: 0.3px;

    &:first-of-type {
      padding-left: 12px;
    }

    &:last-of-type {
      padding-right: 12px;
    }
  }
`;

const CheckboxCell = styled.td`
  width: 50px;
  padding: 16px 12px;
  text-align: center;
`;

const CheckboxContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const CheckboxIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  transition: all 0.2s ease;

  ${CheckboxInput}:checked + & {
    color: ${props => props.theme.colors.primary};
  }

  ${CheckboxInput}:hover + & {
    transform: scale(1.1);
  }
`;

const DocumentCell = styled.td`
  padding: 16px 12px;
  min-width: 250px;
  max-width: 350px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 180px;
    max-width: 250px;
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DocumentIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DocumentName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const EntityCell = styled.td`
  padding: 16px 12px;
  min-width: 250px;
  max-width: 350px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 180px;
    max-width: 250px;
  }
`;

const EntityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EntityIcon = styled.div<{ $type?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
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

const EntityDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const EntityName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EntityMeta = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  span {
    white-space: nowrap;
  }
`;

const NoEntity = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  font-style: italic;
`;

const TypeCell = styled.td`
  padding: 16px 12px;
  white-space: nowrap;
  min-width: 100px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 80px;
  }
`;

const TypeBadge = styled.span`
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TagsCell = styled.td`
  padding: 16px 12px;
  max-width: 200px;
  min-width: 120px;

  @media (max-width: 768px) {
    max-width: 150px;
    min-width: 100px;
    padding: 12px 8px;
  }
`;

const TagsContainer = styled.div`
  width: 100%;
`;

const TagsList = styled.div<{ $expanded: boolean }>`
  display: flex;
  flex-wrap: ${props => (props.$expanded ? 'wrap' : 'nowrap')};
  gap: 4px;
  align-items: center;
`;

const TagBadge = styled.span`
  padding: 4px 8px;
  background: ${props => props.theme.colors.success}15;
  color: ${props => props.theme.colors.success};
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
`;

const TagToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.primary}15;
    border-color: ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NoTags = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  font-style: italic;
`;

const SizeCell = styled.td`
  padding: 16px 12px;
  white-space: nowrap;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  min-width: 80px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 12px;
    min-width: 70px;
  }
`;

const StatusCell = styled.td`
  padding: 16px 12px;
  white-space: nowrap;
  min-width: 100px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 90px;
  }
`;

const StatusBadge = styled.span<{ $color: any }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ $color }) => $color?.background || '#f3f4f6'};
  color: ${({ $color }) => $color?.color || '#374151'};
`;

const SignatureCell = styled.td`
  padding: 16px 12px;
  white-space: nowrap;
  min-width: 140px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 120px;
  }
`;

const SignatureInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SignatureBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const MoreSigners = styled.span`
  padding: 2px 6px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
`;

const SignatureStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.colors.textSecondary};
`;

const NoSignatures = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  font-style: italic;
`;

const ExpiryCell = styled.td<{ $isExpired?: boolean; $isExpiring?: boolean }>`
  padding: 16px 12px;
  white-space: nowrap;
  min-width: 120px;

  ${props =>
    props.$isExpired &&
    `
    color: ${props.theme.colors.error};
    font-weight: 600;
  `}

  ${props =>
    props.$isExpiring &&
    !props.$isExpired &&
    `
    color: ${props.theme.colors.warning};
    font-weight: 600;
  `}

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 100px;
    font-size: 12px;
  }
`;

const ExpiryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ExpiryDate = styled.div`
  font-size: 13px;
`;

const ExpiryWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const NoExpiry = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const UploadCell = styled.td`
  padding: 16px 12px;
  white-space: nowrap;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  min-width: 120px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 12px;
    min-width: 100px;
  }
`;

const UploadDate = styled.div``;

const ActionsCell = styled.td`
  padding: 16px 12px;
  white-space: nowrap;
  position: relative;
  min-width: 60px;
  width: 60px;

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-width: 50px;
    width: 50px;
    position: sticky;
    right: 0;
    background: ${props => props.theme.colors.cardBackground};
    z-index: 3;
  }
`;

const ActionsMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid
    ${props =>
      props.$isOpen
        ? `${props.theme.colors.primary}40`
        : props.theme.colors.border};
  border-radius: 8px;
  background: ${props =>
    props.$isOpen
      ? `${props.theme.colors.primary}15`
      : props.theme.colors.background};
  color: ${props =>
    props.$isOpen ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  ${props =>
    props.$isOpen &&
    `
    box-shadow: 0 0 0 2px ${props.theme.colors.primary}20;
  `}

  &:hover {
    background: ${props =>
      props.$isOpen
        ? `${props.theme.colors.primary}25`
        : props.theme.colors.backgroundSecondary};
    border-color: ${props => `${props.theme.colors.primary}60`};
    color: ${props =>
      props.$isOpen ? props.theme.colors.primary : props.theme.colors.text};
    transform: ${props => (props.$isOpen ? 'scale(1.05)' : 'none')};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MenuDropdown = styled.div<{
  $position: { top: number; right: number; openUp: boolean };
}>`
  position: fixed;
  top: ${props => props.$position.top}px;
  right: ${props => props.$position.right}px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  min-width: 200px;
  max-width: 250px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: auto;

  /* Animação suave ao abrir */
  animation: dropdownFadeIn 0.2s ease-out;

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: ${props =>
        props.$position.openUp ? 'translateY(10px)' : 'translateY(-10px)'};
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Prevenir que cliques dentro do dropdown fechem o menu */
  & > * {
    pointer-events: auto;
  }
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${props =>
    props.$danger ? props.theme.colors.error : props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  pointer-events: auto;

  &:hover:not(:disabled) {
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}15`
        : `${props.theme.colors.primary}15`};
    color: ${props =>
      props.$danger ? props.theme.colors.error : props.theme.colors.primary};
    transform: translateX(2px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98) translateX(2px);
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}25`
        : `${props.theme.colors.primary}25`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
    color: ${props =>
      props.$danger ? props.theme.colors.error : props.theme.colors.primary};
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 4px 0;
`;

// Componente para item de menu com verificação de permissão
// PermissionMenuItem agora é importado de '../common/PermissionMenuItem'

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  gap: 16px;
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
