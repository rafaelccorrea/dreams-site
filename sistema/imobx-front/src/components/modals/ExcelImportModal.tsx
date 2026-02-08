import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdDownload,
  MdUpload,
  MdCheckCircle,
  MdError,
  MdCloudUpload,
} from 'react-icons/md';
import {
  Table,
  Progress,
  Alert,
  Button as AntButton,
  Space,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  generateClientTemplate,
  parseExcelFile,
  ClientTemplateRow,
} from '../../utils/excelTemplate';
import { clientsApi } from '../../services/clientsApi';

const { Text } = Typography;

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: ClientTemplateRow }>;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const Modal = styled.div`
  background: var(--color-surface);
  border-radius: 16px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-background-secondary);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-text);
  }
`;

const Content = styled.div`
  padding: 24px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UploadZone = styled.div<{ $isDragOver: boolean; $hasFile: boolean }>`
  border: 2px dashed
    ${props =>
      props.$isDragOver ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: ${props =>
    props.$hasFile
      ? 'var(--color-background-secondary)'
      : 'var(--color-background)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-background-secondary);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
`;

const InstructionsList = styled.ol`
  text-align: left;
  margin: 16px 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  strong {
    color: var(--color-text);
  }
`;

const FileInfo = styled.div`
  background: var(--color-background-secondary);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PreviewTable = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;

  .ant-table-wrapper {
    margin: 0;
  }

  .ant-table-thead > tr > th {
    background: var(--color-background-secondary) !important;
    color: var(--color-text) !important;
    font-weight: 600 !important;
  }

  .ant-table-tbody > tr > td {
    color: var(--color-text-secondary) !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: var(--color-background-secondary) !important;
  }
`;

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ClientTemplateRow[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<
    'instructions' | 'upload' | 'preview' | 'importing' | 'result'
  >('instructions');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
    generateClientTemplate(format);
  };

  const handleDragOver = (e: React.AttachEvent) => {
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
    if (
      droppedFile &&
      (droppedFile.name.endsWith('.xlsx') ||
        droppedFile.name.endsWith('.xls') ||
        droppedFile.name.endsWith('.csv'))
    ) {
      handleFileUpload(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.name.endsWith('.xlsx') ||
        selectedFile.name.endsWith('.xls') ||
        selectedFile.name.endsWith('.csv'))
    ) {
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const data = await parseExcelFile(uploadedFile);
      setParsedData(data);
      setStep('preview');
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setIsProcessing(true);
    setStep('importing');

    try {
      const result = await clientsApi.bulkImport(parsedData);
      setImportResult(result);
      setStep('result');

      if (result.success > 0) {
        onImportSuccess();
      }
    } catch (error) {
      console.error('Erro na importação:', error);
      setImportResult({
        success: 0,
        errors: parsedData.map((_, index) => ({
          row: index + 1,
          error: 'Erro na conexão com o servidor',
          data: parsedData[index],
        })),
      });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setImportResult(null);
    setStep('instructions');
    setFile(null);
    onClose();
  };

  const columns: ColumnsType<ClientTemplateRow & { rowIndex: number }> = [
    {
      title: '#',
      dataIndex: 'rowIndex',
      width: 50,
      align: 'center',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      width: 150,
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone_principal',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Endereço',
      dataIndex: 'endereco',
      width: 200,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo_interesse',
      width: 100,
    },
  ];

  const previewData = parsedData.map((item, index) => ({
    ...item,
    rowIndex: index + 1,
  }));

  return (
    <Overlay $isOpen={isOpen}>
      <Modal>
        <Header>
          <Title>
            <MdUpload size={24} />
            Importação de Clientes via Excel
          </Title>
          <CloseButton onClick={handleClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Content>
          {step === 'instructions' && (
            <>
              <Section>
                <SectionTitle>
                  <MdDownload />
                  Passo 1: Download do Template
                </SectionTitle>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 16px 0',
                  }}
                >
                  Primeiro, baixe o template Excel com exemplos e instruções
                  detalhadas:
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <AntButton
                    type='primary'
                    icon={<MdDownload />}
                    onClick={() => handleDownloadTemplate('xlsx')}
                    size='large'
                  >
                    Baixar Template Excel (.xlsx)
                  </AntButton>
                  <AntButton
                    icon={<MdDownload />}
                    onClick={() => handleDownloadTemplate('csv')}
                    size='large'
                  >
                    Baixar Template CSV (.csv)
                  </AntButton>
                </div>
              </Section>

              <Section>
                <SectionTitle>
                  <MdCloudUpload />
                  Passo 2: Instruções de Preenchimento
                </SectionTitle>
                <InstructionsList>
                  <li>Preencha os dados dos clientes abaixo dos exemplos</li>
                  <li>
                    Campos marcados como <strong>OBRIGATÓRIO</strong> devem ser
                    preenchidos
                  </li>
                  <li>
                    Campos marcados como <strong>OPCIONAL</strong> podem ficar
                    vazios
                  </li>
                  <li>
                    Valores devem ser informados apenas números (ex: 150000 para
                    R$ 150.000)
                  </li>
                  <li>Tipo de interesse deve ser "Compra" ou "Locação"</li>
                  <li>Salve como arquivo .xlsx antes do upload</li>
                </InstructionsList>
              </Section>

              <Section>
                <SectionTitle>
                  <MdUpload />
                  Passo 3: Upload do Arquivo
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
                        margin: '0 0 8px 0',
                        color: 'var(--color-text)',
                      }}
                    >
                      {file
                        ? `Arquivo: ${file.name}`
                        : 'Clique aqui ou arraste um arquivo Excel'}
                    </h4>
                    <Text type='secondary'>
                      Suporta arquivos .xlsx, .xls e .csv
                    </Text>
                  </div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='.xlsx,.xls,.csv'
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                  />
                </UploadZone>

                {file && (
                  <FileInfo>
                    <MdCheckCircle color='var(--color-success)' />
                    <div>
                      <div
                        style={{
                          fontWeight: '500',
                          color: 'var(--color-text)',
                        }}
                      >
                        {file.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <AntButton
                      onClick={() => {
                        const newEvent = {
                          target: { value: '' },
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleFileInput(newEvent);
                      }}
                      size='small'
                    >
                      Remover
                    </AntButton>
                  </FileInfo>
                )}
              </Section>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '24px',
                }}
              >
                <AntButton onClick={handleClose}>Cancelar</AntButton>
                <AntButton
                  type='primary'
                  onClick={() => file && setStep('preview')}
                  disabled={!file}
                >
                  Processar Arquivo
                </AntButton>
              </div>
            </>
          )}

          {step === 'preview' && (
            <>
              <Section>
                <SectionTitle>
                  <MdCheckCircle />
                  Prévia dos Dados
                </SectionTitle>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 16px 0',
                  }}
                >
                  Encontrados {parsedData.length} client(es) para importação:
                </p>
                <PreviewTable>
                  <Table
                    columns={columns}
                    dataSource={previewData}
                    pagination={{ pageSize: 10, simple: true }}
                    size='small'
                    scroll={{ x: 800 }}
                  />
                </PreviewTable>
              </Section>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '24px',
                }}
              >
                <AntButton onClick={() => setStep('instructions')}>
                  Voltar
                </AntButton>
                <AntButton
                  type='primary'
                  onClick={handleImport}
                  loading={isProcessing}
                >
                  Importar {parsedData.length} Cliente(s)
                </AntButton>
              </div>
            </>
          )}

          {step === 'importing' && (
            <Section>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  <Progress type='circle' percent={75} />
                </div>
                <h3 style={{ color: 'var(--color-text)', margin: '0 0 8px 0' }}>
                  Importando Clientes...
                </h3>
                <p
                  style={{ color: 'var(--color-text-secondary)', margin: '0' }}
                >
                  Aguarde enquanto processamos os dados
                </p>
              </div>
            </Section>
          )}

          {step === 'result' && importResult && (
            <>
              <Section>
                <SectionTitle>
                  <MdCheckCircle />
                  Resultado da Importação
                </SectionTitle>

                <div style={{ marginBottom: '20px' }}>
                  {importResult.success > 0 && (
                    <Alert
                      message={`${importResult.success} cliente(s) importado(s) com sucesso!`}
                      type='success'
                      showIcon
                      style={{ marginBottom: '16px' }}
                    />
                  )}

                  {importResult.errors.length > 0 && (
                    <Alert
                      message={`${importResult.errors.length} erro(s) encontrado(s)`}
                      description='Alguns clientes não puderam ser importados. Verifique os dados e tente novamente.'
                      type='warning'
                      showIcon
                      style={{ marginBottom: '16px' }}
                    />
                  )}
                </div>

                {importResult.errors.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4
                      style={{
                        margin: '0 0 12px 0',
                        color: 'var(--color-text)',
                      }}
                    >
                      Erros Detalhados:
                    </h4>
                    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                      {importResult.errors.map((error, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            background: 'var(--color-background-secondary)',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '500',
                              color: 'var(--color-text)',
                            }}
                          >
                            Linha {error.row}:{' '}
                            {error.data.nome || 'Cliente sem nome'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--color-text-secondary)',
                              marginTop: '4px',
                            }}
                          >
                            {error.error}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '24px',
                }}
              >
                <AntButton onClick={() => setStep('instructions')}>
                  Nova Importação
                </AntButton>
                <AntButton type='primary' onClick={handleClose}>
                  Fechar
                </AntButton>
              </div>
            </>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};
