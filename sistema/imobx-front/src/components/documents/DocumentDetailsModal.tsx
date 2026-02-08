import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatNumbers';
import {
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdBusiness,
  MdLock,
  MdLockOpen,
  MdSchedule,
  MdTag,
  MdDescription,
  MdSecurity,
  MdFilePresent,
  MdDateRange,
  MdInfo,
  MdLink,
  MdHome,
  MdAccountCircle,
  MdEmail,
  MdPhone,
  MdLocationOn,
} from 'react-icons/md';
import type { DocumentWithDetails } from '../../types/document';
import {
  DocumentTypeLabels,
  DocumentStatusLabels,
  StatusColors,
} from '../../types/document';
import { useDocuments } from '../../hooks/useDocuments';
import { useDocumentPermissions } from '../../hooks/useDocumentPermissions';
import { PermissionButton } from '../common/PermissionButton';
import { formatFileSize, formatDate } from '../../utils/format';

interface DocumentDetailsModalProps {
  documentId: string;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
}

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  documentId,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { canApprove } = useDocumentPermissions();
  const { fetchById, approve, loading } = useDocuments();
  const [document, setDocument] = useState<DocumentWithDetails | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDocument = async () => {
    const doc = await fetchById(documentId);
    if (doc) {
      setDocument(doc);
    }
  };

  const handleApprove = async (status: 'approved' | 'rejected') => {
    setApproving(true);
    const result = await approve(documentId, status);
    setApproving(false);

    if (result) {
      setDocument(result);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <MdCheckCircle color='#10b981' size={20} />;
      case 'rejected':
        return <MdCancel color='#ef4444' size={20} />;
      case 'pending_review':
        return <MdSchedule color='#f59e0b' size={20} />;
      default:
        return <MdFilePresent color='#6b7280' size={20} />;
    }
  };

  if (loading || !document) {
    return (
      <Overlay onClick={onClose}>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Carregando documento...</LoadingText>
        </LoadingContainer>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <TitleIcon>{getFileIcon(document.fileExtension)}</TitleIcon>
            <TitleSection>
              <ModalTitle>{document.title || document.originalName}</ModalTitle>
              <DocumentId>ID: {document.id.slice(0, 8)}...</DocumentId>
            </TitleSection>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ContentGrid>
            {/* Informações Principais */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdInfo size={20} />
                </SectionIcon>
                <SectionTitle>Informações Gerais</SectionTitle>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Nome Original
                  </InfoLabel>
                  <InfoValue>{document.originalName}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Nome do Arquivo
                  </InfoLabel>
                  <InfoValue>{document.fileName}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Tipo de Documento
                  </InfoLabel>
                  <InfoValue>
                    <TypeBadge>
                      {DocumentTypeLabels[document.type] || 'Desconhecido'}
                    </TypeBadge>
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Status
                  </InfoLabel>
                  <InfoValue>
                    <StatusBadge
                      $color={
                        StatusColors[document.status] || {
                          background: '#6b7280',
                          color: '#ffffff',
                        }
                      }
                    >
                      {getStatusIcon(document.status)}
                      {DocumentStatusLabels[document.status] || 'Desconhecido'}
                    </StatusBadge>
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Tamanho
                  </InfoLabel>
                  <InfoValue>
                    {formatFileSize(Number(document.fileSize))}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Extensão
                  </InfoLabel>
                  <InfoValue>{document.fileExtension.toUpperCase()}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdFilePresent size={16} />
                    </IconWrapper>
                    Tipo MIME
                  </InfoLabel>
                  <InfoValue>{document.mimeType}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>

            {/* Conteúdo e Metadados */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdDescription size={20} />
                </SectionIcon>
                <SectionTitle>Conteúdo e Metadados</SectionTitle>
              </SectionHeader>

              <InfoGrid>
                {document.title && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdFilePresent size={16} />
                      </IconWrapper>
                      Título
                    </InfoLabel>
                    <InfoValue>{document.title}</InfoValue>
                  </InfoItem>
                )}

                {document.description && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdDescription size={16} />
                      </IconWrapper>
                      Descrição
                    </InfoLabel>
                    <InfoValue>{document.description}</InfoValue>
                  </InfoItem>
                )}

                {document.tags && document.tags.length > 0 && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdTag size={16} />
                      </IconWrapper>
                      Tags
                    </InfoLabel>
                    <InfoValue>
                      <TagsContainer>
                        {document.tags.map((tag, index) => (
                          <TagBadge key={index}>{tag}</TagBadge>
                        ))}
                      </TagsContainer>
                    </InfoValue>
                  </InfoItem>
                )}

                {document.notes && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdDescription size={16} />
                      </IconWrapper>
                      Observações
                    </InfoLabel>
                    <InfoValue>{document.notes}</InfoValue>
                  </InfoItem>
                )}

                {document.expiryDate && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdDateRange size={16} />
                      </IconWrapper>
                      Data de Vencimento
                    </InfoLabel>
                    <InfoValue>
                      {formatDate(document.expiryDate)}
                      <ExpiryInfo>
                        (
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(
                              document.expiryDate + 'T00:00:00'
                            ).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}{' '}
                        dia(s) restante(s))
                      </ExpiryInfo>
                    </InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>

            {/* Vínculos */}
            {(document.client ||
              document.property ||
              document.uploadedBy ||
              document.approvedBy) && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdLink size={20} />
                  </SectionIcon>
                  <SectionTitle>Vínculos</SectionTitle>
                </SectionHeader>

                {/* Cliente Vinculado */}
                {document.client && (
                  <LinkCard>
                    <LinkCardHeader>
                      <MdAccountCircle size={20} />
                      <LinkCardTitle>Cliente Vinculado</LinkCardTitle>
                    </LinkCardHeader>
                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdPerson size={16} />
                          </IconWrapper>
                          Nome
                        </InfoLabel>
                        <InfoValue>{document.client.name}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdEmail size={16} />
                          </IconWrapper>
                          Email
                        </InfoLabel>
                        <InfoValue>{document.client.email}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdBusiness size={16} />
                          </IconWrapper>
                          CPF
                        </InfoLabel>
                        <InfoValue>{document.client.cpf}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdPhone size={16} />
                          </IconWrapper>
                          Telefone
                        </InfoLabel>
                        <InfoValue>{document.client.phone}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdLocationOn size={16} />
                          </IconWrapper>
                          Endereço
                        </InfoLabel>
                        <InfoValue>
                          {document.client.address}, {document.client.city}/
                          {document.client.state}
                        </InfoValue>
                      </InfoItem>
                    </InfoGrid>
                  </LinkCard>
                )}

                {/* Propriedade Vinculada */}
                {document.property && (
                  <LinkCard>
                    <LinkCardHeader>
                      <MdHome size={20} />
                      <LinkCardTitle>Propriedade Vinculada</LinkCardTitle>
                    </LinkCardHeader>
                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdDescription size={16} />
                          </IconWrapper>
                          Título
                        </InfoLabel>
                        <InfoValue>{document.property.title}</InfoValue>
                      </InfoItem>
                      {document.property.code && (
                        <InfoItem>
                          <InfoLabel>
                            <IconWrapper>
                              <MdTag size={16} />
                            </IconWrapper>
                            Código
                          </InfoLabel>
                          <InfoValue>{document.property.code}</InfoValue>
                        </InfoItem>
                      )}
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdLocationOn size={16} />
                          </IconWrapper>
                          Endereço
                        </InfoLabel>
                        <InfoValue>
                          {document.property.address}, {document.property.city}/
                          {document.property.state}
                        </InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdHome size={16} />
                          </IconWrapper>
                          Tipo
                        </InfoLabel>
                        <InfoValue>{document.property.type}</InfoValue>
                      </InfoItem>
                      {document.property.bedrooms && (
                        <InfoItem>
                          <InfoLabel>
                            <IconWrapper>
                              <MdHome size={16} />
                            </IconWrapper>
                            Quartos
                          </InfoLabel>
                          <InfoValue>{document.property.bedrooms}</InfoValue>
                        </InfoItem>
                      )}
                      {document.property.bathrooms && (
                        <InfoItem>
                          <InfoLabel>
                            <IconWrapper>
                              <MdHome size={16} />
                            </IconWrapper>
                            Banheiros
                          </InfoLabel>
                          <InfoValue>{document.property.bathrooms}</InfoValue>
                        </InfoItem>
                      )}
                      {document.property.totalArea && (
                        <InfoItem>
                          <InfoLabel>
                            <IconWrapper>
                              <MdHome size={16} />
                            </IconWrapper>
                            Área Total
                          </InfoLabel>
                          <InfoValue>{document.property.totalArea}m²</InfoValue>
                        </InfoItem>
                      )}
                      {document.property.salePrice && (
                        <InfoItem>
                          <InfoLabel>
                            <IconWrapper>
                              <MdBusiness size={16} />
                            </IconWrapper>
                            Preço de Venda
                          </InfoLabel>
                          <InfoValue>
                            {formatCurrency(document.property.salePrice)}
                          </InfoValue>
                        </InfoItem>
                      )}
                      {document.property.rentPrice && (
                        <InfoItem>
                          <InfoLabel>
                            <IconWrapper>
                              <MdBusiness size={16} />
                            </IconWrapper>
                            Preço de Locação
                          </InfoLabel>
                          <InfoValue>
                            {formatCurrency(document.property.rentPrice)}
                          </InfoValue>
                        </InfoItem>
                      )}
                    </InfoGrid>
                  </LinkCard>
                )}

                {/* Upload feito por */}
                {document.uploadedBy && (
                  <LinkCard>
                    <LinkCardHeader>
                      <MdPerson size={20} />
                      <LinkCardTitle>Upload feito por</LinkCardTitle>
                    </LinkCardHeader>
                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdPerson size={16} />
                          </IconWrapper>
                          Nome
                        </InfoLabel>
                        <InfoValue>{document.uploadedBy.name}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdBusiness size={16} />
                          </IconWrapper>
                          Função
                        </InfoLabel>
                        <InfoValue>{document.uploadedBy.role}</InfoValue>
                      </InfoItem>
                    </InfoGrid>
                  </LinkCard>
                )}

                {/* Aprovado por */}
                {document.approvedBy && (
                  <LinkCard>
                    <LinkCardHeader>
                      <MdCheckCircle size={20} />
                      <LinkCardTitle>Aprovado por</LinkCardTitle>
                    </LinkCardHeader>
                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdPerson size={16} />
                          </IconWrapper>
                          Nome
                        </InfoLabel>
                        <InfoValue>{document.approvedBy.name}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>
                          <IconWrapper>
                            <MdBusiness size={16} />
                          </IconWrapper>
                          Função
                        </InfoLabel>
                        <InfoValue>{document.approvedBy.role}</InfoValue>
                      </InfoItem>
                    </InfoGrid>
                  </LinkCard>
                )}
              </Section>
            )}

            {/* Segurança e Auditoria */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdSecurity size={20} />
                </SectionIcon>
                <SectionTitle>Segurança e Auditoria</SectionTitle>
              </SectionHeader>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      {document.isEncrypted ? (
                        <MdLock size={16} />
                      ) : (
                        <MdLockOpen size={16} />
                      )}
                    </IconWrapper>
                    Criptografia
                  </InfoLabel>
                  <InfoValue>
                    <EncryptionBadge $encrypted={document.isEncrypted}>
                      {document.isEncrypted ? (
                        <>
                          <MdLock size={16} />
                          Criptografado
                        </>
                      ) : (
                        <>
                          <MdLockOpen size={16} />
                          Não Criptografado
                        </>
                      )}
                    </EncryptionBadge>
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdSchedule size={16} />
                    </IconWrapper>
                    Data de Upload
                  </InfoLabel>
                  <InfoValue>{formatDate(document.createdAt)}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>
                    <IconWrapper>
                      <MdSchedule size={16} />
                    </IconWrapper>
                    Última Atualização
                  </InfoLabel>
                  <InfoValue>{formatDate(document.updatedAt)}</InfoValue>
                </InfoItem>

                {document.approvedAt && (
                  <InfoItem>
                    <InfoLabel>
                      <IconWrapper>
                        <MdCheckCircle size={16} />
                      </IconWrapper>
                      Data de Aprovação
                    </InfoLabel>
                    <InfoValue>{formatDate(document.approvedAt)}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>
          </ContentGrid>

          {/* Ações de Aprovação */}
          {canApprove && document.status === 'pending_review' && (
            <ApprovalSection>
              <SectionHeader>
                <SectionIcon>
                  <MdCheckCircle size={20} />
                </SectionIcon>
                <SectionTitle>Aprovação</SectionTitle>
              </SectionHeader>

              <ApprovalActions>
                <PermissionButton
                  permission='document:approve'
                  onClick={() => handleApprove('approved')}
                  disabled={approving}
                  variant='primary'
                >
                  <MdCheckCircle size={16} />
                  Aprovar
                </PermissionButton>
                <PermissionButton
                  permission='document:approve'
                  onClick={() => handleApprove('rejected')}
                  disabled={approving}
                  variant='danger'
                >
                  <MdCancel size={16} />
                  Rejeitar
                </PermissionButton>
              </ApprovalActions>
            </ApprovalSection>
          )}
        </ModalBody>
      </ModalContent>
    </Overlay>
  );
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 120px 20px 40px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 80px 20px 20px;
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 160px);
  overflow: hidden;
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.4),
    0 10px 20px -8px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 20px;

  @keyframes modalSlideIn {
    from {
      transform: translateY(40px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 1440px) {
    max-width: 1000px;
  }

  @media (max-width: 1024px) {
    max-width: 95vw;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100vh - 40px);
    border-radius: 0;
    margin-bottom: 0;
  }
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background}00,
    ${props => props.theme.colors.primary}05
  );
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
`;

const TitleIcon = styled.div`
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DocumentId = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #fef2f2;
    border-color: #fee2e2;
    color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
  background: ${props => props.theme.colors.surface};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 5px;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 5px;
    border: 2px solid ${props => props.theme.colors.surface};

    &:hover {
      background: ${props => props.theme.colors.primary};
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const SectionIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LinkCard = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border}20;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const LinkCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.primary};
`;

const LinkCardTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.background}50;
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary}30;
`;

const InfoLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;
`;

const IconWrapper = styled.span`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const TypeBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
`;

const StatusBadge = styled.div<{ $color: any }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $color }) => $color?.background || '#f3f4f6'};
  color: ${({ $color }) => $color?.color || '#374151'};
  width: fit-content;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TagBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

const ExpiryInfo = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-style: italic;
`;

const EncryptionBadge = styled.div<{ $encrypted: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $encrypted, theme }) =>
    $encrypted ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ $encrypted, theme }) =>
    $encrypted ? theme.colors.success : theme.colors.warning};
  width: fit-content;
`;

const ApprovalSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.colors.border};
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: ${props => props.theme.colors.surface};
  padding: 60px;
  border-radius: 16px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${props => props.theme.colors.border};
  border-top: 5px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;
