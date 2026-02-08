import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdDownload,
  MdUpload,
  MdCheckCircle,
  MdError,
  MdCloudUpload,
  MdFileDownload,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { propertyApi } from '../../services/propertyApi';
import { useProperties } from '../../hooks/useProperties';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { generatePropertyTemplate } from '../../utils/propertyTemplate';

interface PropertyImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

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
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 40px 24px;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    padding: 60px 20px 20px;
    align-items: flex-start;
    justify-content: center;
  }

  @media (max-width: 768px) {
    padding: 80px 16px 16px;
    align-items: flex-start;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 60px 12px 12px;
  }
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: calc(100vh - 80px);
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  animation: slideIn 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: auto;

  @keyframes slideIn {
    from {
      transform: scale(0.95) translateY(20px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    max-width: 95%;
    max-height: calc(100vh - 120px);
    border-radius: 18px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: calc(100vh - 160px);
    border-radius: 16px;
    margin: 0;
  }

  @media (max-width: 480px) {
    max-height: calc(100vh - 120px);
    border-radius: 12px;
  }
`;

const Header = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.backgroundSecondary};
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.colors.primary};
  }

  @media (max-width: 1024px) {
    padding: 20px 28px;
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    font-size: 1.375rem;
    gap: 10px;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    gap: 6px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 12px;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 480px) {
    font-size: 20px;
    padding: 6px;
    margin-left: 8px;
  }
`;

const Content = styled.div`
  padding: 32px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1024px) {
    padding: 28px;
    max-height: calc(100vh - 180px);
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-height: calc(100vh - 160px);
  }

  @media (max-width: 480px) {
    padding: 16px;
    max-height: calc(100vh - 140px);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-bottom: 20px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
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
  gap: 6px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 1024px) {
    padding: 11px 20px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    gap: 4px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    flex: 1;
    justify-content: center;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 10px;
    gap: 4px;
  }
`;

const UploadZone = styled.div<{ $isDragOver: boolean; $hasFile: boolean }>`
  border: 2px dashed
    ${props =>
      props.$isDragOver
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 12px;
  padding: 48px 24px;
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
    padding: 36px 20px;
  }

  @media (max-width: 480px) {
    padding: 32px 16px;
  }
`;

const UploadIcon = styled.div`
  font-size: 64px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 56px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 48px;
    margin-bottom: 10px;
  }
`;

const InstructionsList = styled.ul`
  text-align: left;
  margin: 16px 0;
  padding-left: 24px;

  li {
    margin-bottom: 12px;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }

  strong {
    color: ${props => props.theme.colors.text};
  }

  @media (max-width: 768px) {
    padding-left: 20px;
    margin: 12px 0;

    li {
      margin-bottom: 10px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }

  @media (max-width: 480px) {
    padding-left: 18px;
    margin: 10px 0;

    li {
      margin-bottom: 8px;
      font-size: 0.85rem;
    }
  }
`;

const FileInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
    margin-top: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;

    button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    margin-top: 16px;
    gap: 8px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
      transform: translateY(-1px);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.hover};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.9rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    gap: 6px;
  }
`;

const ExportFormatSelect = styled.select`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  width: 100%;
  max-width: 300px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 10px 14px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const ResultCard = styled.div<{ $type: 'success' | 'error' | 'warning' }>`
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
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
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
`;

const ErrorList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 16px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    max-height: 250px;
    margin-top: 12px;
  }

  @media (max-width: 480px) {
    max-height: 200px;
    margin-top: 10px;
  }
`;

const ErrorItem = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 3px solid ${props => props.theme.colors.error};
  word-break: break-word;

  @media (max-width: 768px) {
    padding: 10px;
    margin-bottom: 6px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px;
    margin-bottom: 4px;
    font-size: 0.85rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const PropertyImportExportModal: React.FC<
  PropertyImportExportModalProps
> = ({ isOpen, onClose, onImportSuccess }) => {
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
        if (onImportSuccess) {
          onImportSuccess();
        }
        // Recarregar lista de propriedades
        await getProperties();
      }

      if (result.failed > 0) {
        toast.warning(`${result.failed} propriedade(s) falharam na importação`);
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

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setIsProcessing(false);
    setIsExporting(false);
    setActiveTab('import');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={handleClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            {activeTab === 'import' ? (
              <MdUpload size={28} />
            ) : (
              <MdFileDownload size={28} />
            )}
            {activeTab === 'import'
              ? 'Importar Propriedades'
              : 'Exportar Propriedades'}
          </Title>
          <CloseButton onClick={handleClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Content>
          <TabsContainer>
            <Tab
              $active={activeTab === 'import'}
              onClick={() => hasImportPermission && setActiveTab('import')}
              style={{
                opacity: hasImportPermission ? 1 : 0.5,
                cursor: hasImportPermission ? 'pointer' : 'not-allowed',
              }}
            >
              <MdUpload style={{ marginRight: '8px' }} />
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
              <MdFileDownload style={{ marginRight: '8px' }} />
              Exportar
              {!hasExportPermission && ' (Sem permissão)'}
            </Tab>
          </TabsContainer>

          {activeTab === 'import' && !hasImportPermission && (
            <ResultCard $type='error'>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <MdError size={24} style={{ color: '#ef4444' }} />
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>
                    Você não tem permissão para importar propriedades
                  </strong>
                  <p style={{ margin: '8px 0 0 0' }}>
                    Entre em contato com um administrador para solicitar a
                    permissão <strong>property:import</strong>.
                  </p>
                </div>
              </div>
            </ResultCard>
          )}

          {activeTab === 'export' && !hasExportPermission && (
            <ResultCard $type='error'>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <MdError size={24} style={{ color: '#ef4444' }} />
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>
                    Você não tem permissão para exportar propriedades
                  </strong>
                  <p style={{ margin: '8px 0 0 0' }}>
                    Entre em contato com um administrador para solicitar a
                    permissão <strong>property:export</strong>.
                  </p>
                </div>
              </div>
            </ResultCard>
          )}

          {activeTab === 'import' && (
            <>
              <Section>
                <SectionTitle>
                  <MdDownload />
                  Passo 1: Download do Template
                </SectionTitle>
                <p style={{ marginBottom: '16px' }}>
                  Primeiro, baixe o template Excel ou CSV com exemplos e
                  instruções detalhadas:
                </p>
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
                    <strong>Importante:</strong> A segunda linha do template
                    contém instruções explicativas e será ignorada pelo sistema
                    durante a importação
                  </li>
                  <li>
                    <strong>Campos obrigatórios:</strong> Preencha todos os
                    campos marcados como OBRIGATÓRIO
                  </li>
                  <li>
                    <strong>Imagens:</strong> Propriedades com menos de 5
                    imagens serão criadas em status DRAFT
                  </li>
                  <li>
                    <strong>Formato:</strong> Use vírgulas para separar URLs de
                    imagens no CSV, ou ponto e vírgula no Excel
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
                    <h4 style={{ margin: '0 0 8px 0' }}>
                      {file
                        ? `Arquivo: ${file.name}`
                        : 'Clique aqui ou arraste um arquivo'}
                    </h4>
                    <p style={{ margin: 0 }}>
                      Formatos suportados: CSV, XLSX (máx. 10MB)
                    </p>
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
                    <MdCheckCircle size={24} style={{ color: '#10b981' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{file.name}</div>
                      <div style={{ fontSize: '0.875rem' }}>
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
                    <strong>Imagens são obrigatórias:</strong> Propriedades com
                    menos de 5 imagens serão criadas em status DRAFT
                  </li>
                  <li>
                    <strong>URLs de imagens:</strong> Use URLs públicas
                    separadas por vírgula ou ponto e vírgula
                  </li>
                  <li>
                    <strong>Validação:</strong> O sistema valida todos os campos
                    obrigatórios antes da importação
                  </li>
                  <li>
                    <strong>Status:</strong> Propriedades sem imagens
                    suficientes não podem ser alteradas para DISPONÍVEL
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
                        <MdCheckCircle size={24} style={{ color: '#10b981' }} />
                        <strong style={{ fontSize: '1.1rem' }}>
                          {importResult.success} propriedade(s) importada(s) com
                          sucesso!
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
                        <MdError size={24} style={{ color: '#f59e0b' }} />
                        <strong style={{ fontSize: '1.1rem' }}>
                          {importResult.failed} propriedade(s) falharam na
                          importação
                        </strong>
                      </div>
                    </ResultCard>
                  )}

                  {importResult.errors.length > 0 && (
                    <ErrorList>
                      <h4 style={{ margin: '0 0 12px 0' }}>
                        Erros Detalhados:
                      </h4>
                      {importResult.errors.map((error, index) => (
                        <ErrorItem key={index}>
                          <div
                            style={{ fontWeight: '600', marginBottom: '4px' }}
                          >
                            Linha {error.row} - {error.property}
                          </div>
                          <ul
                            style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}
                          >
                            {error.errors.map((err, i) => (
                              <li key={i} style={{ fontSize: '0.875rem' }}>
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
                  onClick={handleClose}
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  $variant='primary'
                  onClick={handleImport}
                  disabled={!file || isProcessing || !hasImportPermission}
                >
                  {isProcessing ? (
                    <>
                      <Spinner
                        style={{
                          width: '16px',
                          height: '16px',
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

          {activeTab === 'export' && (
            <>
              <Section>
                <SectionTitle>
                  <MdFileDownload />
                  Exportar Propriedades
                </SectionTitle>
                <p style={{ marginBottom: '16px' }}>
                  Selecione o formato de exportação e baixe todas as
                  propriedades:
                </p>

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
                </InstructionsList>
              </Section>

              <ButtonGroup>
                <Button
                  $variant='secondary'
                  onClick={handleClose}
                  disabled={isExporting}
                >
                  Cancelar
                </Button>
                <Button
                  $variant='primary'
                  onClick={handleExport}
                  disabled={isExporting || !hasExportPermission}
                >
                  {isExporting ? (
                    <>
                      <Spinner
                        style={{
                          width: '16px',
                          height: '16px',
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
        </Content>
      </Modal>
    </Overlay>
  );
};

export default PropertyImportExportModal;
