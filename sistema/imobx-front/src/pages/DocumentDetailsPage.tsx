import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  MdArrowBack,
  MdPerson,
  MdLock,
  MdLockOpen,
  MdSchedule,
  MdTag,
  MdSecurity,
  MdFilePresent,
  MdInfo,
  MdHome,
  MdEdit as MdSignature,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import type { DocumentWithDetails } from '../types/document';
import { DocumentTypeLabels, DocumentStatusLabels } from '../types/document';
import { useDocuments } from '../hooks/useDocuments';
import { Layout } from '../components/layout/Layout';
import { DocumentSignatureList } from '../components/documents/DocumentSignatureList';
import { formatFileSize, formatDate } from '../utils/format';
import {
  maskCPF,
  formatPhoneDisplay,
  formatCurrencyValue,
} from '../utils/masks';
import {
  ClickableEmail,
  ClickablePhone,
} from '../components/common/ClickableContact';
import { PageContentShimmer } from '../components/shimmer';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
} from '../styles/pages/ClientFormPageStyles';
import styled from 'styled-components';

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 40px;
  margin-bottom: 32px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80,
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 1024px) {
    padding: 32px 28px;
    margin-bottom: 24px;
    border-radius: 16px;
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
    margin-bottom: 20px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    margin-bottom: 16px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}60
    );
    border-radius: 3px 3px 0 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
    padding-bottom: 16px;

    &::after {
      width: 60px;
      height: 2px;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  letter-spacing: -0.03em;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.75rem;
    flex-shrink: 0;
    padding: 8px;
    background: ${props => props.theme.colors.primary}15;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  &:hover svg {
    background: ${props => props.theme.colors.primary}25;
    transform: scale(1.1);
  }

  @media (max-width: 1024px) {
    font-size: 1.375rem;
    gap: 14px;

    svg {
      font-size: 1.5rem;
      padding: 6px;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 12px;

    svg {
      font-size: 1.375rem;
      padding: 6px;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    gap: 10px;

    svg {
      font-size: 1.25rem;
      padding: 5px;
    }
  }
`;

const SectionDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  padding-left: 54px;
  opacity: 0.85;

  @media (max-width: 1024px) {
    font-size: 0.9rem;
    padding-left: 50px;
  }

  @media (max-width: 768px) {
    padding-left: 0;
    font-size: 0.85rem;
    margin-top: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary}40;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 14px;
    gap: 6px;
  }
`;

const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 10px;
    letter-spacing: 0.8px;
  }
`;

const InfoValue = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  word-break: break-word;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.7rem;
    gap: 6px;
    letter-spacing: 0.5px;

    svg {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.65rem;

    svg {
      font-size: 0.9rem;
    }
  }

  ${props => {
    switch (props.$status) {
      case 'approved':
        return `
          background: linear-gradient(135deg, ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'}, ${props.theme.mode === 'dark' ? '#047857' : '#a7f3d0'});
          color: ${props.theme.mode === 'dark' ? '#d1fae5' : '#065f46'};
          border: 2px solid ${props.theme.mode === 'dark' ? '#6ee7b7' : '#10b981'};
        `;
      case 'pending_review':
        return `
          background: linear-gradient(135deg, ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'}, ${props.theme.mode === 'dark' ? '#78350f' : '#fde68a'});
          color: ${props.theme.mode === 'dark' ? '#fef3c7' : '#92400e'};
          border: 2px solid ${props.theme.mode === 'dark' ? '#fbbf24' : '#f59e0b'};
        `;
      case 'rejected':
        return `
          background: linear-gradient(135deg, ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'}, ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'});
          color: ${props.theme.mode === 'dark' ? '#fee2e2' : '#991b1b'};
          border: 2px solid ${props.theme.mode === 'dark' ? '#fca5a5' : '#ef4444'};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
          border: 2px solid ${props.theme.colors.border};
        `;
    }
  }}
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: linear-gradient(
    135deg,
    ${props => (props.theme.mode === 'dark' ? '#1e40af' : '#dbeafe')},
    ${props => (props.theme.mode === 'dark' ? '#1e3a8a' : '#bfdbfe')}
  );
  color: ${props => (props.theme.mode === 'dark' ? '#dbeafe' : '#1e40af')};
  border: 2px solid
    ${props => (props.theme.mode === 'dark' ? '#60a5fa' : '#3b82f6')};
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.7rem;
    gap: 5px;
    letter-spacing: 0.5px;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.65rem;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: 16px;
  border: 2px solid ${props => props.theme.colors.primary}30;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px ${props => props.theme.colors.primary}10;

  svg {
    font-size: 0.95rem;
  }

  &:hover {
    background: ${props => props.theme.colors.primary}25;
    border-color: ${props => props.theme.colors.primary}50;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.7rem;
    gap: 5px;

    svg {
      font-size: 0.85rem;
    }

    &:hover {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    font-size: 0.65rem;

    svg {
      font-size: 0.75rem;
    }
  }
`;

const EncryptionBadge = styled.span<{ $encrypted: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  background: ${({ $encrypted, theme }) =>
    $encrypted
      ? `linear-gradient(135deg, ${theme.mode === 'dark' ? '#065f46' : '#d1fae5'}, ${theme.mode === 'dark' ? '#047857' : '#a7f3d0'})`
      : `linear-gradient(135deg, ${theme.mode === 'dark' ? '#92400e' : '#fef3c7'}, ${theme.mode === 'dark' ? '#78350f' : '#fde68a'})`};
  color: ${({ $encrypted, theme }) =>
    $encrypted
      ? theme.mode === 'dark'
        ? '#d1fae5'
        : '#065f46'
      : theme.mode === 'dark'
        ? '#fef3c7'
        : '#92400e'};
  border: 2px solid
    ${({ $encrypted, theme }) =>
      $encrypted
        ? theme.mode === 'dark'
          ? '#6ee7b7'
          : '#10b981'
        : theme.mode === 'dark'
          ? '#fbbf24'
          : '#f59e0b'};

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.7rem;
    gap: 6px;
    letter-spacing: 0.5px;

    svg {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.65rem;

    svg {
      font-size: 0.9rem;
    }
  }
`;

const LinkedEntityTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10,
    ${props => props.theme.colors.primary}05
  );
  border-radius: 12px;
  border-left: 4px solid ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 14px 16px;
    margin-bottom: 16px;
  }
`;

const ModernPageHeader = styled(PageHeader)`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.surface} 0%,
    ${props => props.theme.colors.background} 100%
  );
  padding: 32px 40px;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}60,
      transparent
    );
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
    margin-bottom: 24px;
    border-radius: 16px;
  }
`;

const ModernPageTitle = styled(PageTitle)`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.text},
    ${props => props.theme.colors.text}dd
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ModernPageSubtitle = styled(PageSubtitle)`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchById, loading } = useDocuments();
  const [document, setDocument] = useState<DocumentWithDetails | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) {
        message.error('ID do documento não encontrado');
        navigate('/documents');
        return;
      }

      const doc = await fetchById(id);
      if (doc) {
        setDocument(doc);
      } else {
        message.error('Documento não encontrado');
        navigate('/documents');
      }
    };

    if (id) {
      loadDocument();
    }
  }, [id, fetchById, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <MdCheckCircle />;
      case 'rejected':
        return <MdCancel />;
      case 'pending_review':
        return <MdSchedule />;
      default:
        return <MdFilePresent />;
    }
  };

  const getStatusLabel = (status: string) => {
    return (
      DocumentStatusLabels[status as keyof typeof DocumentStatusLabels] ||
      'Desconhecido'
    );
  };

  const getTypeLabel = (type: string) => {
    return (
      DocumentTypeLabels[type as keyof typeof DocumentTypeLabels] ||
      'Desconhecido'
    );
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return '';
    const roleMap: { [key: string]: string } = {
      admin: 'Administrador',
      master: 'Master',
      manager: 'Gerente',
      user: 'Usuário',
      broker: 'Corretor',
      agent: 'Agente',
      secretary: 'Secretário(a)',
      owner: 'Proprietário',
      super_admin: 'Super Admin',
    };
    return roleMap[role.toLowerCase()] || role;
  };

  if (loading || !document) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageContentShimmer />
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <ModernPageHeader>
            <PageTitleContainer>
              <ModernPageTitle>
                {document.title || document.originalName}
              </ModernPageTitle>
              <ModernPageSubtitle>
                Visualize as informações completas do documento
              </ModernPageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/documents')} type='button'>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </ModernPageHeader>

          {/* Informações Básicas */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <MdInfo />
                Informações Gerais
              </SectionTitle>
              <SectionDescription>
                Dados principais do documento
              </SectionDescription>
            </SectionHeader>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Nome Original</InfoLabel>
                <InfoValue>{document.originalName}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Nome do Arquivo</InfoLabel>
                <InfoValue>{document.fileName}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Tipo de Documento</InfoLabel>
                <InfoValue>
                  <TypeBadge>{getTypeLabel(document.type)}</TypeBadge>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>
                  <StatusBadge $status={document.status}>
                    {getStatusIcon(document.status)}
                    {getStatusLabel(document.status)}
                  </StatusBadge>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Tamanho</InfoLabel>
                <InfoValue>
                  {formatFileSize(Number(document.fileSize))}
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Extensão</InfoLabel>
                <InfoValue>{document.fileExtension.toUpperCase()}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Tipo MIME</InfoLabel>
                <InfoValue>{document.mimeType}</InfoValue>
              </InfoItem>

              {document.title && (
                <InfoItem>
                  <InfoLabel>Título</InfoLabel>
                  <InfoValue>{document.title}</InfoValue>
                </InfoItem>
              )}

              {document.description && (
                <InfoItem>
                  <InfoLabel>Descrição</InfoLabel>
                  <InfoValue>{document.description}</InfoValue>
                </InfoItem>
              )}

              {document.notes && (
                <InfoItem>
                  <InfoLabel>Observações</InfoLabel>
                  <InfoValue>{document.notes}</InfoValue>
                </InfoItem>
              )}

              {document.expiryDate && (
                <InfoItem>
                  <InfoLabel>Data de Vencimento</InfoLabel>
                  <InfoValue>
                    {formatDate(document.expiryDate)}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        marginTop: '4px',
                      }}
                    >
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
                      dias restantes)
                    </span>
                  </InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdTag />
                  Tags
                </SectionTitle>
                <SectionDescription>
                  Etiquetas associadas ao documento
                </SectionDescription>
              </SectionHeader>
              <TagsList>
                {document.tags.map((tag, index) => (
                  <Tag key={index}>
                    <MdTag size={14} />
                    {tag}
                  </Tag>
                ))}
              </TagsList>
            </Section>
          )}

          {/* Cliente Vinculado */}
          {document.client && (
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdPerson />
                  Cliente Vinculado
                </SectionTitle>
                <SectionDescription>
                  Cliente associado a este documento
                </SectionDescription>
              </SectionHeader>
              <LinkedEntityTitle>👤 {document.client.name}</LinkedEntityTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>
                    <ClickableEmail email={document.client.email} />
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>CPF</InfoLabel>
                  <InfoValue>{maskCPF(document.client.cpf)}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Telefone</InfoLabel>
                  <InfoValue>
                    <ClickablePhone
                      phone={formatPhoneDisplay(document.client.phone)}
                    />
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Endereço</InfoLabel>
                  <InfoValue>
                    {document.client.address}, {document.client.city}/
                    {document.client.state}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>
          )}

          {/* Propriedade Vinculada */}
          {document.property && (
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdHome />
                  Propriedade Vinculada
                </SectionTitle>
                <SectionDescription>
                  Imóvel relacionado a este documento
                </SectionDescription>
              </SectionHeader>
              <LinkedEntityTitle>
                🏠 {document.property.title}
              </LinkedEntityTitle>
              <InfoGrid>
                {document.property.address && (
                  <InfoItem>
                    <InfoLabel>Endereço</InfoLabel>
                    <InfoValue>
                      {document.property.address}, {document.property.city}/
                      {document.property.state}
                    </InfoValue>
                  </InfoItem>
                )}

                {document.property.code && (
                  <InfoItem>
                    <InfoLabel>Código</InfoLabel>
                    <InfoValue>{document.property.code}</InfoValue>
                  </InfoItem>
                )}

                <InfoItem>
                  <InfoLabel>Tipo</InfoLabel>
                  <InfoValue>{document.property.type}</InfoValue>
                </InfoItem>

                {document.property.bedrooms && (
                  <InfoItem>
                    <InfoLabel>Quartos</InfoLabel>
                    <InfoValue>{document.property.bedrooms}</InfoValue>
                  </InfoItem>
                )}

                {document.property.bathrooms && (
                  <InfoItem>
                    <InfoLabel>Banheiros</InfoLabel>
                    <InfoValue>{document.property.bathrooms}</InfoValue>
                  </InfoItem>
                )}

                {document.property.totalArea && (
                  <InfoItem>
                    <InfoLabel>Área Total</InfoLabel>
                    <InfoValue>{document.property.totalArea}m²</InfoValue>
                  </InfoItem>
                )}

                {document.property.salePrice && (
                  <InfoItem>
                    <InfoLabel>Preço de Venda</InfoLabel>
                    <InfoValue>
                      {formatCurrencyValue(Number(document.property.salePrice))}
                    </InfoValue>
                  </InfoItem>
                )}

                {document.property.rentPrice && (
                  <InfoItem>
                    <InfoLabel>Preço de Locação</InfoLabel>
                    <InfoValue>
                      {formatCurrencyValue(Number(document.property.rentPrice))}
                    </InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>
          )}

          {/* Assinaturas */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <MdSignature />
                Assinaturas
              </SectionTitle>
              <SectionDescription>
                Gerencie as assinaturas deste documento
              </SectionDescription>
            </SectionHeader>
            {document && <DocumentSignatureList documentId={document.id} />}
          </Section>

          {/* Segurança e Auditoria */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <MdSecurity />
                Segurança e Auditoria
              </SectionTitle>
              <SectionDescription>
                Informações de segurança e histórico
              </SectionDescription>
            </SectionHeader>
            <InfoGrid>
              {document.uploadedBy && (
                <InfoItem>
                  <InfoLabel>Upload feito por</InfoLabel>
                  <InfoValue>
                    {document.uploadedBy.name} -{' '}
                    {getRoleLabel(document.uploadedBy.role)}
                  </InfoValue>
                </InfoItem>
              )}

              {document.approvedBy && (
                <InfoItem>
                  <InfoLabel>Aprovado por</InfoLabel>
                  <InfoValue>
                    {document.approvedBy.name} -{' '}
                    {getRoleLabel(document.approvedBy.role)}
                  </InfoValue>
                </InfoItem>
              )}

              <InfoItem>
                <InfoLabel>Criptografia</InfoLabel>
                <InfoValue>
                  <EncryptionBadge $encrypted={document.isEncrypted}>
                    {document.isEncrypted ? <MdLock /> : <MdLockOpen />}
                    {document.isEncrypted
                      ? 'Criptografado'
                      : 'Não Criptografado'}
                  </EncryptionBadge>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Data de Upload</InfoLabel>
                <InfoValue>{formatDate(document.createdAt)}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Última Atualização</InfoLabel>
                <InfoValue>{formatDate(document.updatedAt)}</InfoValue>
              </InfoItem>

              {document.approvedAt && (
                <InfoItem>
                  <InfoLabel>Data de Aprovação</InfoLabel>
                  <InfoValue>{formatDate(document.approvedAt)}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default DocumentDetailsPage;
