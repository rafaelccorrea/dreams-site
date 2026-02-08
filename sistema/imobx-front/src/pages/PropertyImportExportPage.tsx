import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdClose,
  MdDownload,
  MdUpload,
  MdCheckCircle,
  MdError,
  MdCloudUpload,
  MdFileDownload,
  MdArrowBack,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { Layout } from '../components/layout/Layout';
import { propertyApi } from '../services/propertyApi';
import { useProperties } from '../hooks/useProperties';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { generatePropertyTemplate } from '../utils/propertyTemplate';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
} from '../styles/pages/PropertiesPageStyles';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  properties: any[];
  errors: Array<{
    row: number;
    property: string;
    errors: string[];
  }>;
  hasErrorFile?: boolean;
  errorSpreadsheetBase64?: string;
}

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  align-self: flex-start;
  margin-top: 0;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 13px;
    align-self: flex-start;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    margin-bottom: 14px;
    gap: 4px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 16px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  cursor: pointer;
  border-bottom: 3px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;
  margin-bottom: -2px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 1024px) {
    padding: 14px 28px;
    font-size: 1.05rem;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 1rem;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.95rem;
    gap: 4px;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (max-width: 1024px) {
    padding: 14px;
    border-radius: 10px;
    margin-bottom: 14px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 10px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 8px;
    gap: 6px;
  }
`;

const UploadZone = styled.div<{ $isDragOver: boolean; $hasFile: boolean }>`
  border: 2px dashed
    ${props =>
      props.$isDragOver
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: ${props =>
    props.$hasFile
      ? props.theme.colors.backgroundSecondary
      : props.theme.colors.background};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  @media (max-width: 768px) {
    padding: 32px 16px;
  }

  @media (max-width: 480px) {
    padding: 24px 12px;
  }
`;

const UploadIcon = styled.div`
  font-size: 80px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 64px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 56px;
    margin-bottom: 12px;
  }
`;

const InstructionsList = styled.ul`
  text-align: left;
  margin: 12px 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.5;
  }

  strong {
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 768px) {
    padding-left: 18px;
    margin: 10px 0;

    li {
      margin-bottom: 6px;
      font-size: 0.95rem;
      line-height: 1.4;
    }
  }

  @media (max-width: 480px) {
    padding-left: 16px;
    margin: 8px 0;

    li {
      margin-bottom: 6px;
      font-size: 0.9rem;
    }
  }
`;

const FileInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 10px;
    margin-top: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;

    button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    margin-top: 10px;
    gap: 8px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  white-space: nowrap;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
    color: white;
    box-shadow: 0 4px 15px ${props.theme.colors.primary}20;

    &:hover:not(:disabled) {
      box-shadow: 0 6px 20px ${props.theme.colors.primary}30;
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.hover};
      border-color: ${props.theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 1024px) {
    padding: 14px 28px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.9rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 0.85rem;
    gap: 8px;
  }
`;

const ExportFormatSelect = styled.select`
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  width: 100%;
  max-width: 350px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 12px 16px;
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
`;

const ResultCard = styled.div<{ $type: 'success' | 'error' | 'warning' }>`
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  background: ${props => {
    if (props.$type === 'success') return props.theme.colors.success + '15';
    if (props.$type === 'error') return props.theme.colors.error + '15';
    return props.theme.colors.warning + '15';
  }};
  border: 1px solid
    ${props => {
      if (props.$type === 'success') return props.theme.colors.success + '40';
      if (props.$type === 'error') return props.theme.colors.error + '40';
      return props.theme.colors.warning + '40';
    }};

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

const ErrorList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-top: 20px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    max-height: 300px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    max-height: 250px;
    margin-top: 12px;
  }
`;

const ErrorItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 10px;
  margin-bottom: 12px;
  border-left: 4px solid ${props => props.theme.colors.error};
  word-break: break-word;

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 10px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 8px;
    font-size: 0.85rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 48px 32px;
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
`;

const ErrorFileNotice = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: ${props => props.theme.colors.warning}15;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.warning}40;

  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 10px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    margin-top: 8px;
  }
`;

const ErrorFileNoticeContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 6px;
  }
`;

const ErrorFileNoticeText = styled.div`
  flex: 1;
`;

const ErrorFileNoticeTitle = styled.strong`
  font-size: 0.95rem;
  display: block;
  margin-bottom: 4px;
  color: ${props => props.theme.colors.text};

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 3px;
  }
`;

const ErrorFileNoticeDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const ErrorFileIcon = styled(MdFileDownload)`
  color: ${props => props.theme.colors.warning};
  flex-shrink: 0;
  margin-top: 2px;
`;

const PropertyImportExportPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('xlsx');
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getProperties } = useProperties();
  const permissionsContext = usePermissionsContextOptional();

  const hasImportPermission =
    permissionsContext?.hasPermission('property:import') ?? false;
  const hasExportPermission =
    permissionsContext?.hasPermission('property:export') ?? false;

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedExtensions = ['.csv', '.xlsx'];
    const extension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: 'Formato não suportado. Use CSV ou XLSX',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Máximo: 10MB',
      };
    }

    return { valid: true };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (validation.valid) {
        setFile(droppedFile);
      } else {
        toast.error(validation.error);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (validation.valid) {
        setFile(selectedFile);
      } else {
        toast.error(validation.error);
      }
    }
  };

  const downloadErrorSpreadsheet = (base64: string) => {
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `erros_importacao_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao fazer download da planilha de erros:', error);
      toast.error('Erro ao fazer download da planilha de erros');
    }
  };

  const handleImport = async () => {
    if (!hasImportPermission) {
      toast.error(
        'Você não tem permissão para importar propriedades. Entre em contato com um administrador.'
      );
      return;
    }

    if (!file) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    setIsProcessing(true);
    setImportResult(null);

    try {
      const result = await propertyApi.importProperties(file);
      setImportResult(result);

      if (result.success > 0) {
        toast.success(
          `${result.success} propriedade(s) importada(s) com sucesso!`
        );
        // Recarregar lista de propriedades
        await getProperties();
      }

      if (result.failed > 0) {
        toast.warning(`${result.failed} propriedade(s) falharam na importação`);

        // Fazer download automático da planilha de erros se houver
        if (result.hasErrorFile && result.errorSpreadsheetBase64) {
          downloadErrorSpreadsheet(result.errorSpreadsheetBase64);
          toast.info(
            'Planilha de erros baixada automaticamente. Corrija os erros indicados e reimporte.'
          );
        }
      }
    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast.error(error.message || 'Erro ao importar propriedades');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    if (!hasExportPermission) {
      toast.error(
        'Você não tem permissão para exportar propriedades. Entre em contato com um administrador.'
      );
      return;
    }

    setIsExporting(true);

    try {
      const blob = await propertyApi.exportProperties(exportFormat);

      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Nome do arquivo com data
      const date = new Date().toISOString().split('T')[0];
      const fileName = `propriedades_${date}.${exportFormat}`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Propriedades exportadas com sucesso!');
    } catch (error: any) {
      console.error('Erro na exportação:', error);
      toast.error(error.message || 'Erro ao exportar propriedades');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <HeaderWrapper>
              <PageTitleContainer>
                <PageTitle>Importar / Exportar Propriedades</PageTitle>
                <PageSubtitle>
                  Gerencie a importação e exportação em lote de propriedades
                </PageSubtitle>
              </PageTitleContainer>
              <BackButton onClick={() => navigate('/properties')}>
                <MdArrowBack />
                Voltar
              </BackButton>
            </HeaderWrapper>
          </PageHeader>

          <ContentWrapper>
            <TabsContainer>
              <Tab
                $active={activeTab === 'import'}
                onClick={() => hasImportPermission && setActiveTab('import')}
                style={{
                  opacity: hasImportPermission ? 1 : 0.5,
                  cursor: hasImportPermission ? 'pointer' : 'not-allowed',
                }}
              >
                <MdUpload />
                Importar
                {!hasImportPermission && ' (Sem permissão)'}
              </Tab>
              <Tab
                $active={activeTab === 'export'}
                onClick={() => hasExportPermission && setActiveTab('export')}
                style={{
                  opacity: hasExportPermission ? 1 : 0.5,
                  cursor: hasExportPermission ? 'pointer' : 'not-allowed',
                }}
              >
                <MdFileDownload />
                Exportar
                {!hasExportPermission && ' (Sem permissão)'}
              </Tab>
            </TabsContainer>

            {activeTab === 'import' && !hasImportPermission && (
              <Section>
                <ResultCard $type='error'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <MdError size={28} style={{ color: '#ef4444' }} />
                    <div>
                      <strong style={{ fontSize: '1.25rem' }}>
                        Você não tem permissão para importar propriedades
                      </strong>
                      <p style={{ margin: '12px 0 0 0' }}>
                        Entre em contato com um administrador para solicitar a
                        permissão <strong>property:import</strong>.
                      </p>
                    </div>
                  </div>
                </ResultCard>
              </Section>
            )}

            {activeTab === 'export' && !hasExportPermission && (
              <Section>
                <ResultCard $type='error'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <MdError size={28} style={{ color: '#ef4444' }} />
                    <div>
                      <strong style={{ fontSize: '1.25rem' }}>
                        Você não tem permissão para exportar propriedades
                      </strong>
                      <p style={{ margin: '12px 0 0 0' }}>
                        Entre em contato com um administrador para solicitar a
                        permissão <strong>property:export</strong>.
                      </p>
                    </div>
                  </div>
                </ResultCard>
              </Section>
            )}

            {activeTab === 'import' && hasImportPermission && (
              <>
                <Section>
                  <SectionTitle>
                    <MdDownload />
                    Passo 1: Download do Template
                  </SectionTitle>
                  <InfoText>
                    Primeiro, baixe o template Excel ou CSV com exemplos e
                    instruções detalhadas:
                  </InfoText>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '24px',
                    }}
                  >
                    <Button
                      $variant='primary'
                      onClick={() => generatePropertyTemplate('xlsx')}
                    >
                      <MdDownload />
                      Baixar Template Excel (.xlsx)
                    </Button>
                    <Button
                      $variant='secondary'
                      onClick={() => generatePropertyTemplate('csv')}
                    >
                      <MdDownload />
                      Baixar Template CSV (.csv)
                    </Button>
                  </div>
                  <InstructionsList>
                    <li>
                      <strong>Importante:</strong> A primeira linha (linha 1) do
                      template contém instruções explicativas e será sempre
                      ignorada pelo sistema durante a importação. Os dados devem
                      começar a partir da linha 2
                    </li>
                    <li>
                      <strong>Status Automático:</strong> O campo "Status" NÃO
                      deve ser incluído no arquivo. O sistema define
                      automaticamente: DISPONÍVEL (se tiver 5 ou mais imagens e
                      dados completos) ou RASCUNHO (se faltar imagens ou dados)
                    </li>
                    <li>
                      <strong>Validação ao Sair de RASCUNHO:</strong>{' '}
                      Propriedades em RASCUNHO NÃO podem sair deste status sem
                      dados completos (título, descrição, tipo, endereço
                      completo, área total e dados do proprietário)
                    </li>
                    <li>
                      <strong>Tipos de Propriedade:</strong> Use português:
                      Casa, Apartamento, Comercial, Terreno ou Rural
                    </li>
                    <li>
                      <strong>Campos obrigatórios:</strong> Preencha todos os
                      campos marcados como OBRIGATÓRIO
                    </li>
                    <li>
                      <strong>Imagens:</strong> Propriedades com menos de 5
                      imagens serão criadas em status RASCUNHO automaticamente e
                      NÃO podem ser alteradas para DISPONÍVEL sem pelo menos 5
                      imagens
                    </li>
                    <li>
                      <strong>Formato:</strong> Use vírgulas para separar URLs
                      de imagens no CSV, ou ponto e vírgula no Excel
                    </li>
                  </InstructionsList>
                </Section>

                <Section>
                  <SectionTitle>
                    <MdCloudUpload />
                    Passo 2: Upload do Arquivo
                  </SectionTitle>
                  <UploadZone
                    $isDragOver={isDragOver}
                    $hasFile={!!file}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon>
                      <MdCloudUpload />
                    </UploadIcon>
                    <div>
                      <h4
                        style={{
                          margin: '0 0 12px 0',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                        }}
                      >
                        {file
                          ? `Arquivo: ${file.name}`
                          : 'Clique aqui ou arraste um arquivo'}
                      </h4>
                      <InfoText>
                        Formatos suportados: CSV, XLSX (máx. 10MB)
                      </InfoText>
                    </div>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='.csv,.xlsx'
                      onChange={handleFileInput}
                      style={{ display: 'none' }}
                    />
                  </UploadZone>

                  {file && (
                    <FileInfo>
                      <MdCheckCircle size={28} style={{ color: '#10b981' }} />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: '600',
                            fontSize: '1.05rem',
                            marginBottom: '4px',
                          }}
                        >
                          {file.name}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                          Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <Button
                        $variant='secondary'
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Remover
                      </Button>
                    </FileInfo>
                  )}
                </Section>

                <Section>
                  <SectionTitle>Instruções Importantes</SectionTitle>
                  <InstructionsList>
                    <li>
                      <strong>Primeira Linha Ignorada:</strong> A primeira linha
                      (linha 1) do arquivo contém descrições/instruções e será
                      sempre ignorada pelo sistema. Os dados das propriedades
                      devem começar a partir da linha 2
                    </li>
                    <li>
                      <strong>Status Automático:</strong> O campo "Status" NÃO
                      deve ser incluído no arquivo. O sistema define
                      automaticamente: DISPONÍVEL (se tiver 5+ imagens e dados
                      completos) ou RASCUNHO (se faltar imagens ou dados)
                    </li>
                    <li>
                      <strong>Validação ao Sair de RASCUNHO:</strong>{' '}
                      Propriedades em RASCUNHO NÃO podem sair deste status sem
                      dados completos. É necessário preencher: título,
                      descrição, tipo, endereço completo (rua, número, cidade,
                      estado, CEP, bairro), área total e dados do proprietário
                      (nome, email, telefone, documento, endereço)
                    </li>
                    <li>
                      <strong>Imagens são obrigatórias:</strong> Propriedades
                      com menos de 5 imagens serão criadas em status RASCUNHO
                      automaticamente e NÃO podem ser alteradas para DISPONÍVEL
                      sem pelo menos 5 imagens
                    </li>
                    <li>
                      <strong>Endereços de imagens:</strong> Use endereços
                      públicos (URLs) separados por vírgula ou ponto e vírgula
                    </li>
                    <li>
                      <strong>Tipos de Propriedade:</strong> Use português:
                      Casa, Apartamento, Comercial, Terreno ou Rural
                    </li>
                    <li>
                      <strong>Validação:</strong> O sistema valida todos os
                      campos obrigatórios antes da importação
                    </li>
                    <li>
                      <strong>Fluxo Recomendado:</strong> Importe → Complete
                      dados faltantes → Adicione imagens (se necessário) →
                      Altere status quando tudo estiver completo
                    </li>
                  </InstructionsList>
                </Section>

                {importResult && (
                  <Section>
                    <SectionTitle>Resultado da Importação</SectionTitle>

                    {importResult.success > 0 && (
                      <ResultCard $type='success'>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          <MdCheckCircle
                            size={28}
                            style={{ color: '#10b981' }}
                          />
                          <strong style={{ fontSize: '1.25rem' }}>
                            {importResult.success} propriedade(s) importada(s)
                            com sucesso!
                          </strong>
                        </div>
                        <p style={{ margin: 0 }}>
                          Total processado: {importResult.total}
                        </p>
                      </ResultCard>
                    )}

                    {importResult.failed > 0 && (
                      <ResultCard $type='warning'>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                          }}
                        >
                          <MdError size={28} style={{ color: '#f59e0b' }} />
                          <strong style={{ fontSize: '1.25rem' }}>
                            {importResult.failed} propriedade(s) falharam na
                            importação
                          </strong>
                        </div>
                        {importResult.hasErrorFile && (
                          <ErrorFileNotice>
                            <ErrorFileNoticeContent>
                              <ErrorFileIcon size={20} />
                              <ErrorFileNoticeText>
                                <ErrorFileNoticeTitle>
                                  Planilha de Erros Disponível
                                </ErrorFileNoticeTitle>
                                <ErrorFileNoticeDescription>
                                  Uma planilha XLSX com as propriedades que
                                  falharam foi gerada. Corrija os erros
                                  indicados na coluna "Erro" e reimporte o
                                  arquivo.
                                </ErrorFileNoticeDescription>
                              </ErrorFileNoticeText>
                            </ErrorFileNoticeContent>
                            {importResult.errorSpreadsheetBase64 && (
                              <Button
                                $variant='secondary'
                                onClick={() =>
                                  downloadErrorSpreadsheet(
                                    importResult.errorSpreadsheetBase64!
                                  )
                                }
                                style={{
                                  marginTop: '8px',
                                  fontSize: '0.875rem',
                                  padding: '8px 16px',
                                }}
                              >
                                <MdFileDownload />
                                Baixar Planilha de Erros
                              </Button>
                            )}
                          </ErrorFileNotice>
                        )}
                      </ResultCard>
                    )}

                    {importResult.errors.length > 0 && (
                      <ErrorList>
                        <h4
                          style={{
                            margin: '0 0 16px 0',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                          }}
                        >
                          Erros Detalhados:
                        </h4>
                        {importResult.errors.map((error, index) => (
                          <ErrorItem key={index}>
                            <div
                              style={{
                                fontWeight: '600',
                                marginBottom: '6px',
                                fontSize: '1.05rem',
                              }}
                            >
                              Linha {error.row} - {error.property}
                            </div>
                            <ul
                              style={{
                                margin: '6px 0 0 0',
                                paddingLeft: '20px',
                              }}
                            >
                              {error.errors.map((err, i) => (
                                <li key={i} style={{ fontSize: '0.95rem' }}>
                                  {err}
                                </li>
                              ))}
                            </ul>
                          </ErrorItem>
                        ))}
                      </ErrorList>
                    )}
                  </Section>
                )}

                <ButtonGroup>
                  <Button
                    $variant='secondary'
                    onClick={() => navigate('/properties')}
                    disabled={isProcessing}
                  >
                    <MdArrowBack />
                    Voltar
                  </Button>
                  <Button
                    $variant='primary'
                    onClick={handleImport}
                    disabled={!file || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner
                          style={{
                            width: '18px',
                            height: '18px',
                            borderWidth: '2px',
                            margin: 0,
                          }}
                        />
                        Importando...
                      </>
                    ) : (
                      <>
                        <MdUpload />
                        Importar Propriedades
                      </>
                    )}
                  </Button>
                </ButtonGroup>
              </>
            )}

            {activeTab === 'export' && hasExportPermission && (
              <>
                <Section>
                  <SectionTitle>
                    <MdFileDownload />
                    Exportar Propriedades
                  </SectionTitle>
                  <InfoText>
                    Selecione o formato de exportação e baixe todas as
                    propriedades:
                  </InfoText>

                  <ExportFormatSelect
                    value={exportFormat}
                    onChange={e =>
                      setExportFormat(e.target.value as 'csv' | 'xlsx')
                    }
                  >
                    <option value='xlsx'>Excel (XLSX)</option>
                    <option value='csv'>CSV</option>
                  </ExportFormatSelect>
                </Section>

                <Section>
                  <SectionTitle>Informações sobre Exportação</SectionTitle>
                  <InstructionsList>
                    <li>
                      O arquivo será baixado automaticamente após a exportação
                    </li>
                    <li>
                      O formato Excel (XLSX) é recomendado para melhor
                      compatibilidade
                    </li>
                    <li>Todas as propriedades da empresa serão exportadas</li>
                    <li>
                      O arquivo inclui todas as informações das propriedades,
                      incluindo imagens (URLs)
                    </li>
                    <li>
                      <strong>Tipos em Português:</strong> Os tipos são
                      exportados em português (Casa, Apartamento, Comercial,
                      Terreno, Rural)
                    </li>
                    <li>
                      <strong>Status não exportado:</strong> O campo Status não
                      é exportado pois é definido automaticamente pelo sistema
                    </li>
                  </InstructionsList>
                </Section>

                <ButtonGroup>
                  <Button
                    $variant='secondary'
                    onClick={() => navigate('/properties')}
                    disabled={isExporting}
                  >
                    <MdArrowBack />
                    Voltar
                  </Button>
                  <Button
                    $variant='primary'
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <>
                        <Spinner
                          style={{
                            width: '18px',
                            height: '18px',
                            borderWidth: '2px',
                            margin: 0,
                          }}
                        />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <MdDownload />
                        Exportar Propriedades
                      </>
                    )}
                  </Button>
                </ButtonGroup>
              </>
            )}
          </ContentWrapper>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default PropertyImportExportPage;
