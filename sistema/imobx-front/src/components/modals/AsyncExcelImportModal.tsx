import React, { useState, useEffect, useRef } from 'react';
import { Button, Upload, Typography, Space, Alert, List, Progress } from 'antd';
import {
  DownloadOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  generateClientTemplate,
  parseExcelFile,
} from '../../utils/excelTemplate';
import type { ClientTemplateRow } from '../../utils/excelTemplate';
import { clientsApi } from '../../services/clientsApi';
import { toast } from 'react-toastify';
import {
  StyledModal,
  StepContainer,
  StepTitle,
  StepNumber,
  StepDescription,
  ActionContainer,
  PreviewContainer,
  FileInfo,
  FileIcon,
  FileDetails,
  FileName,
  FileSize,
} from './styles/AsyncExcelImportModal.styles';

const { Dragger } = Upload;
const { Text } = Typography;

interface AsyncExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ImportJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  processedRows: number;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  hasErrorFile: boolean;
  errorFileUrl?: string | null;
}

export const AsyncExcelImportModal: React.FC<AsyncExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [parsedData, setParsedData] = useState<ClientTemplateRow[] | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(0); // 0: Download, 1: Upload, 2: Preview, 3: Processing
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<ImportJob | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasDownloadedErrorsRef = useRef(false);

  const handleDownloadTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
    generateClientTemplate(format);
    toast.info(`Template ${format.toUpperCase()} baixado com sucesso!`);
    setCurrentStep(1); // Avança para o passo de upload
  };

  const handleFileChange = async (info: any) => {
    const newFileList = info.fileList.slice(-1); // Apenas o último arquivo
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      if (file) {
        try {
          const data = await parseExcelFile(file);
          setParsedData(data);
          setCurrentStep(2); // Avança para o passo de preview
        } catch (error: any) {
          toast.error(error.message);
          setParsedData(null);
          setFileList([]);
        }
      }
    } else {
      setParsedData(null);
      setCurrentStep(1);
    }
  };

  // Função para fazer download da planilha de erros
  const downloadErrorSpreadsheet = async (jobId: string) => {
    try {
      const blob = await clientsApi.downloadErrorSpreadsheet(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `erros_importacao_${jobId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Planilha de erros baixada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao baixar planilha de erros:', error);
      if (error.response?.status === 404) {
        toast.error(
          'Planilha de erros não encontrada. Pode não haver erros ou o job ainda está processando.'
        );
      } else {
        toast.error('Erro ao baixar planilha de erros.');
      }
    }
  };

  // Monitorar progresso do job
  useEffect(() => {
    if (!jobId || !isOpen) {
      return;
    }

    const pollJobStatus = async () => {
      try {
        const job = await clientsApi.getImportJobStatus(jobId);
        setJobStatus(job);

        // Se o job completou ou falhou
        if (job.status === 'completed' || job.status === 'failed') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          // Se houver erros e ainda não baixou, fazer download automático
          if (
            job.status === 'completed' &&
            job.failedImports > 0 &&
            job.hasErrorFile &&
            !hasDownloadedErrorsRef.current
          ) {
            hasDownloadedErrorsRef.current = true;
            // Aguardar um pouco para garantir que o arquivo está pronto
            setTimeout(async () => {
              try {
                const blob = await clientsApi.downloadErrorSpreadsheet(jobId);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `erros_importacao_${jobId}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Planilha de erros baixada automaticamente!');
              } catch (error: any) {
                console.error('Erro ao baixar planilha de erros:', error);
                if (error.response?.status !== 404) {
                  toast.error(
                    'Erro ao baixar planilha de erros automaticamente.'
                  );
                }
              }
            }, 1000);
          }

          // Notificar sucesso
          if (job.status === 'completed') {
            if (job.failedImports === 0) {
              toast.success(
                `✅ Importação concluída! ${job.successfulImports} cliente(s) importado(s) com sucesso.`
              );
            } else {
              toast.warning(
                `⚠️ Importação concluída com ${job.successfulImports} sucesso(s) e ${job.failedImports} falha(s). A planilha de erros foi baixada automaticamente.`
              );
            }
            onImportSuccess();
          } else if (job.status === 'failed') {
            toast.error(
              'A importação falhou. Verifique os logs para mais detalhes.'
            );
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status do job:', error);
      }
    };

    // Verificar imediatamente
    pollJobStatus();

    // Configurar polling a cada 2 segundos
    pollingIntervalRef.current = setInterval(pollJobStatus, 2000);

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [jobId, isOpen, onImportSuccess]);

  const handleImport = async () => {
    if (!parsedData || parsedData.length === 0) {
      toast.error('Nenhum dado para importar.');
      return;
    }

    setUploading(true);
    hasDownloadedErrorsRef.current = false;
    try {
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);

      const result = await clientsApi.bulkImport(formData);

      if (result.jobId) {
        setJobId(result.jobId);
        setCurrentStep(3); // Ir para step de processamento
        toast.info(
          `Importação iniciada! Processando ${parsedData.length} clientes em segundo plano.`
        );
      }
    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast.error(
        error.response?.data?.message ||
          'Erro ao iniciar importação de clientes.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Limpar polling se estiver ativo
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    setFileList([]);
    setParsedData(null);
    setUploading(false);
    setCurrentStep(0);
    setJobId(null);
    setJobStatus(null);
    hasDownloadedErrorsRef.current = false;
    onClose();
  };

  const handleManualDownloadErrors = () => {
    if (jobId && jobStatus?.hasErrorFile) {
      downloadErrorSpreadsheet(jobId);
    }
  };

  return (
    <StyledModal
      title='Importar Clientes (Excel/CSV)'
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={900}
    >
      {currentStep === 0 && (
        <StepContainer>
          <StepTitle>
            <StepNumber>1</StepNumber>
            Template (Opcional)
          </StepTitle>
          <StepDescription>
            <strong>Importante:</strong> Você pode usar seu próprio arquivo
            Excel/CSV, mas ele deve conter exatamente os mesmos campos do nosso
            template. Recomendamos baixar o template para garantir
            compatibilidade.
          </StepDescription>

          <Alert
            message='Campos Obrigatórios'
            description='Seu arquivo deve conter exatamente estes campos: Nome, CPF, Telefone Principal, Telefone Secundário, WhatsApp, Endereço, Número, Complemento, Bairro, Cidade, Estado, CEP, Valor Mínimo, Valor Máximo, Tipo de Interesse, Observações'
            type='warning'
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Button
                type='primary'
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadTemplate('xlsx')}
                size='large'
                style={{ marginRight: '12px' }}
              >
                Baixar Template Excel (.xlsx)
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadTemplate('csv')}
                size='large'
              >
                Baixar Template CSV (.csv)
              </Button>
            </div>
          </Space>

          <Button onClick={() => setCurrentStep(1)} size='large'>
            Pular - Usar Meu Arquivo
          </Button>
        </StepContainer>
      )}

      {currentStep === 1 && (
        <StepContainer>
          <StepTitle>
            <StepNumber>2</StepNumber>
            Faça o Upload do Arquivo
          </StepTitle>
          <StepDescription>
            Faça o upload do seu arquivo Excel/CSV.{' '}
            <strong>
              Certifique-se de que contém exatamente os campos listados abaixo.
            </strong>
          </StepDescription>

          <Alert
            message='⚠️ Validação de Campos'
            description='O arquivo será rejeitado se não conter todos os campos obrigatórios com os nomes exatos. Use o template para garantir compatibilidade.'
            type='warning'
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Dragger
            name='file'
            multiple={false}
            accept='.xlsx,.xls,.csv'
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={fileList}
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
              Clique ou arraste o arquivo Excel/CSV aqui
            </p>
            <p className='ant-upload-hint'>
              Suporta arquivos .xlsx, .xls e .csv
            </p>
          </Dragger>

          <ActionContainer>
            <Button onClick={() => setCurrentStep(0)}>Voltar</Button>
          </ActionContainer>
        </StepContainer>
      )}

      {currentStep === 2 && parsedData && (
        <StepContainer>
          <StepTitle>
            <StepNumber>3</StepNumber>
            Pré-visualização e Confirmação
          </StepTitle>
          <StepDescription>
            Verifique os dados abaixo. O processamento será feito em background
            e você será notificado em tempo real.
          </StepDescription>

          {fileList.length > 0 && (
            <FileInfo>
              <FileIcon>📄</FileIcon>
              <FileDetails>
                <FileName>{fileList[0].name}</FileName>
                <FileSize>{(fileList[0].size / 1024).toFixed(1)} KB</FileSize>
              </FileDetails>
            </FileInfo>
          )}

          <Alert
            message={`Preparando para importar ${parsedData.length} clientes`}
            description='O processamento acontecerá em background. Você poderá continuar trabalhando enquanto a importação é processada.'
            type='info'
            showIcon
          />

          <PreviewContainer>
            <Text
              strong
              style={{
                fontSize: '16px',
                marginBottom: '16px',
                display: 'block',
              }}
            >
              Pré-visualização dos dados:
            </Text>
            <List
              itemLayout='horizontal'
              dataSource={parsedData.slice(0, 5)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.nome}</Text>}
                    description={
                      <Space direction='vertical' size={4}>
                        <Text>{item.email || 'Sem email'}</Text>
                        <Text>{item.telefone_principal}</Text>
                        <Text type='secondary'>{`${item.cidade} - ${item.estado}`}</Text>
                      </Space>
                    }
                  />
                  <Text type='secondary'>{item.tipo_interesse}</Text>
                </List.Item>
              )}
            />
            {parsedData.length > 5 && (
              <Text
                type='secondary'
                style={{
                  fontSize: '14px',
                  marginTop: '12px',
                  display: 'block',
                }}
              >
                ... e mais {parsedData.length - 5} clientes
              </Text>
            )}
          </PreviewContainer>

          <ActionContainer>
            <Button onClick={() => setCurrentStep(1)}>Voltar</Button>
            <Button
              type='primary'
              onClick={handleImport}
              loading={uploading}
              disabled={uploading}
            >
              {uploading ? 'Iniciando Importação...' : 'Iniciar Importação'}
            </Button>
          </ActionContainer>
        </StepContainer>
      )}

      {currentStep === 3 && (
        <StepContainer>
          <StepTitle>
            <StepNumber>4</StepNumber>
            Processando Importação
          </StepTitle>
          <StepDescription>
            A importação está sendo processada em segundo plano. Você pode
            acompanhar o progresso abaixo.
          </StepDescription>

          {!jobStatus ? (
            <Alert
              message='Carregando informações do job...'
              description='Aguarde enquanto buscamos as informações da importação.'
              type='info'
              showIcon
            />
          ) : (
            <>
              {/* Barra de Progresso */}
              <div style={{ marginBottom: '24px' }}>
                <Progress
                  percent={jobStatus.progress || 0}
                  status={
                    jobStatus.status === 'failed'
                      ? 'exception'
                      : jobStatus.status === 'completed'
                        ? 'success'
                        : 'active'
                  }
                  strokeColor={
                    jobStatus.status === 'completed' ? '#52c41a' : undefined
                  }
                />
                <Text
                  type='secondary'
                  style={{
                    display: 'block',
                    marginTop: '8px',
                    textAlign: 'center',
                  }}
                >
                  {jobStatus.processedRows || 0} de {jobStatus.totalRows || 0}{' '}
                  clientes processados
                </Text>
              </div>

              {/* Estatísticas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <Alert
                  message='Sucessos'
                  description={
                    <Text strong style={{ fontSize: '24px', color: '#52c41a' }}>
                      {jobStatus.successfulImports || 0}
                    </Text>
                  }
                  type='success'
                  showIcon
                />
                {(jobStatus.failedImports || 0) > 0 && (
                  <Alert
                    message='Falhas'
                    description={
                      <Text
                        strong
                        style={{ fontSize: '24px', color: '#ff4d4f' }}
                      >
                        {jobStatus.failedImports}
                      </Text>
                    }
                    type='error'
                    showIcon
                  />
                )}
              </div>

              {/* Mensagem de Conclusão */}
              {jobStatus.status === 'completed' && (
                <div style={{ marginBottom: '24px' }}>
                  {jobStatus.failedImports === 0 ? (
                    <Alert
                      message='✅ Importação Concluída com Sucesso!'
                      description={`Todos os ${jobStatus.successfulImports} cliente(s) foram importados com sucesso.`}
                      type='success'
                      showIcon
                    />
                  ) : (
                    <Alert
                      message='⚠️ Importação Concluída com Erros'
                      description={
                        <div>
                          <p>
                            {jobStatus.successfulImports} cliente(s)
                            importado(s) com sucesso e {jobStatus.failedImports}{' '}
                            falha(s).
                          </p>
                          {jobStatus.hasErrorFile && (
                            <div style={{ marginTop: '12px' }}>
                              <p style={{ marginBottom: '8px' }}>
                                A planilha de erros foi baixada automaticamente.
                                Se necessário, você pode baixar novamente:
                              </p>
                              <Button
                                type='default'
                                icon={<DownloadOutlined />}
                                onClick={handleManualDownloadErrors}
                                size='small'
                              >
                                Baixar Planilha de Erros Novamente
                              </Button>
                            </div>
                          )}
                        </div>
                      }
                      type='warning'
                      showIcon
                    />
                  )}
                </div>
              )}

              {jobStatus.status === 'failed' && (
                <Alert
                  message='❌ Importação Falhou'
                  description='A importação não pôde ser concluída. Verifique os logs para mais detalhes.'
                  type='error'
                  showIcon
                  style={{ marginBottom: '24px' }}
                />
              )}

              {/* Botão Fechar */}
              {(jobStatus.status === 'completed' ||
                jobStatus.status === 'failed') && (
                <ActionContainer>
                  <Button type='primary' onClick={handleClose}>
                    Fechar
                  </Button>
                </ActionContainer>
              )}
            </>
          )}
        </StepContainer>
      )}
    </StyledModal>
  );
};
