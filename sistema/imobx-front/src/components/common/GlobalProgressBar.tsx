import React, { useState, useEffect, useCallback } from 'react';
import { Progress, Button, Typography, Space, Alert } from 'antd';
import { API_BASE_URL } from '../../config/apiConfig';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import { ImportNotification } from './ImportNotification';
import {
  ProgressContainer,
  ProgressHeader,
  ProgressContent,
  ProgressFooter,
  ProgressList,
  ProgressItem,
  IconContainer,
} from './styles/GlobalProgressBar.styles';

const { Text } = Typography;

interface ImportProgress {
  jobId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  processedRows: number;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  errors: { row: number; message: string }[];
  type: 'import' | 'export';
}

interface GlobalProgressBarProps {
  onImportComplete?: () => void;
}

export const GlobalProgressBar: React.FC<GlobalProgressBarProps> = ({
  onImportComplete,
}) => {
  const [progressItems, setProgressItems] = useState<ImportProgress[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sideNotification, setSideNotification] = useState<{
    isVisible: boolean;
    type: 'processing' | 'success' | 'error';
    title: string;
    description: string;
    progress?: number;
  }>({
    isVisible: false,
    type: 'processing',
    title: '',
    description: '',
    progress: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    // console.log('GlobalProgressBar: Usuário carregado:', user);
    setCurrentUser(user);
  }, []);

  const getStatusIcon = useCallback((status: string, type: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'failed':
        return <CloseCircleOutlined />;
      case 'processing':
        return <LoadingOutlined spin />;
      default:
        return type === 'import' ? (
          <CloudUploadOutlined />
        ) : (
          <CloudDownloadOutlined />
        );
    }
  }, []);

  const getFileIcon = useCallback((fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'csv') {
      return <FileTextOutlined />;
    }
    return <FileExcelOutlined />;
  }, []);

  const openNotification = useCallback(
    (
      message: string,
      description: string,
      type: 'success' | 'error' | 'info'
    ) => {
      // console.log(`${type.toUpperCase()}: ${message} - ${description}`);
    },
    []
  );

  useEffect(() => {
    if (!currentUser?.id) {
      // console.log('GlobalProgressBar: Usuário não encontrado, não conectando WebSocket');
      return;
    }

    // console.log('GlobalProgressBar: Conectando WebSocket para usuário:', currentUser.id);
    // URL do backend WebSocket com namespace /notifications (conforme documentação)
    const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`;

    const socket = io(NOTIFICATIONS_URL, {
      auth: { token: localStorage.getItem('auth_token') },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      // console.log('✅ Connected to WebSocket for global progress');
      // Entrar no canal do usuário conforme documentação
      if (currentUser.id) {
        // console.log('📡 Entrando no canal do usuário:', currentUser.id);
        socket.emit('join', currentUser.id);
      }
    });

    socket.on('disconnect', () => {
      // console.log('Disconnected from WebSocket for global progress');
    });

    // Debug: Log all events
    socket.onAny((event, ...args) => {
      // console.log(`WebSocket event received: ${event}`, args);
    });

    // Listener para novos jobs criados
    socket.on(
      `job-created-${currentUser.id}`,
      (data: {
        jobId: string;
        fileName: string;
        totalRows: number;
        type?: string;
      }) => {
        // console.log('Job created:', data);
        const newItem: ImportProgress = {
          jobId: data.jobId,
          fileName: data.fileName,
          status: 'pending',
          progress: 0,
          processedRows: 0,
          totalRows: data.totalRows || 0,
          successfulImports: 0,
          failedImports: 0,
          errors: [],
          type: (data.type as 'import' | 'export') || 'import',
        };

        setProgressItems(prev => {
          const exists = prev.find(item => item.jobId === data.jobId);
          if (!exists) {
            return [...prev, newItem];
          }
          return prev;
        });

        setIsVisible(true);

        // Mostrar notificação lateral
        setSideNotification({
          isVisible: true,
          type: 'processing',
          title: `${data.type === 'export' ? 'Exportação' : 'Importação'} Iniciada`,
          description: `Processando ${data.totalRows} clientes de ${data.fileName}`,
          progress: 0,
        });

        openNotification(
          `${data.type === 'export' ? 'Exportação' : 'Importação'} Iniciada`,
          `Processando ${data.fileName}`,
          'info'
        );
      }
    );

    // Listener para progresso do job
    socket.on(
      `import-progress-${currentUser.id}`,
      (data: ImportProgress & { jobId: string }) => {
        setProgressItems(prev =>
          prev.map(item =>
            item.jobId === data.jobId ? { ...item, ...data } : item
          )
        );

        // Atualizar notificação lateral com progresso
        setSideNotification(prev => ({
          ...prev,
          progress: data.progress,
          description: `Processando ${data.processedRows}/${data.totalRows} clientes`,
        }));
      }
    );

    // Listener para conclusão do job
    socket.on(
      `job-completed-${currentUser.id}`,
      (data: ImportProgress & { jobId: string }) => {
        setProgressItems(prev =>
          prev.map(item =>
            item.jobId === data.jobId
              ? { ...item, ...data, status: 'completed' }
              : item
          )
        );

        // Mostrar notificação lateral de sucesso
        setSideNotification({
          isVisible: true,
          type: data.failedImports > 0 ? 'error' : 'success',
          title: `${data.type === 'export' ? 'Exportação' : 'Importação'} Concluída`,
          description: `${data.successfulImports} sucessos, ${data.failedImports} falhas`,
        });

        setTimeout(() => {
          setProgressItems(prev =>
            prev.filter(item => item.jobId !== data.jobId)
          );
          if (progressItems.length <= 1) {
            setIsVisible(false);
          }
        }, 3000);

        if (data.type === 'import') {
          onImportComplete?.();
        }

        openNotification(
          `${data.type === 'export' ? 'Exportação' : 'Importação'} Concluída`,
          `${data.successfulImports} sucessos, ${data.failedImports} falhas`,
          data.failedImports > 0 ? 'error' : 'success'
        );
      }
    );

    // Listener para erro no job
    socket.on(
      `job-error-${currentUser.id}`,
      (data: ImportProgress & { jobId: string; message: string }) => {
        setProgressItems(prev =>
          prev.map(item =>
            item.jobId === data.jobId
              ? { ...item, ...data, status: 'failed' }
              : item
          )
        );

        setTimeout(() => {
          setProgressItems(prev =>
            prev.filter(item => item.jobId !== data.jobId)
          );
          if (progressItems.length <= 1) {
            setIsVisible(false);
          }
        }, 3000);

        openNotification(
          `${data.type === 'export' ? 'Exportação' : 'Importação'} Falhou`,
          data.message || 'Erro desconhecido',
          'error'
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [
    currentUser?.id,
    onImportComplete,
    openNotification,
    progressItems.length,
  ]);

  const handleDismiss = (jobId: string) => {
    setProgressItems(prev => prev.filter(item => item.jobId !== jobId));
    if (progressItems.length <= 1) {
      setIsVisible(false);
    }
  };

  const handleMinimize = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  };

  if (!isVisible || progressItems.length === 0) {
    return null;
  }

  const currentItem = progressItems[progressItems.length - 1];

  return (
    <>
      <ProgressContainer $show={isVisible}>
        <ProgressHeader>
          <IconContainer $status={currentItem.status}>
            {getStatusIcon(currentItem.status, currentItem.type)}
          </IconContainer>
          <div style={{ flex: 1 }}>
            <Text strong>
              {currentItem.type === 'export' ? 'Exportação' : 'Importação'} em
              Progresso
            </Text>
            <br />
            <Text type='secondary' style={{ fontSize: '12px' }}>
              {getFileIcon(currentItem.fileName)} {currentItem.fileName}
            </Text>
          </div>
          <Button
            size='small'
            type='text'
            onClick={handleMinimize}
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            ×
          </Button>
        </ProgressHeader>

        <ProgressContent>
          <Progress
            percent={currentItem.progress}
            status={currentItem.status === 'failed' ? 'exception' : 'active'}
            strokeColor={
              currentItem.status === 'failed' ? '#ff4d4f' : '#1890ff'
            }
            showInfo={false}
          />

          <div style={{ marginBottom: '12px' }}>
            <Text
              style={{ fontSize: '13px', color: 'var(--theme-text-secondary)' }}
            >
              {currentItem.processedRows} de {currentItem.totalRows}{' '}
              {currentItem.type === 'export' ? 'registros' : 'linhas'}{' '}
              processados
            </Text>
          </div>

          {currentItem.status === 'processing' && (
            <Alert
              message={`Em andamento... ${currentItem.progress}%`}
              type='info'
              showIcon={false}
              style={{
                fontSize: '12px',
                padding: '8px',
                marginBottom: '12px',
                backgroundColor: 'var(--theme-info-background)',
                borderColor: 'var(--theme-info-border)',
              }}
            />
          )}

          {currentItem.status === 'completed' && (
            <Alert
              message={`Concluído! ${currentItem.successfulImports} sucessos`}
              description={
                currentItem.failedImports > 0
                  ? `${currentItem.failedImports} falhas`
                  : 'Sem erros'
              }
              type={currentItem.failedImports > 0 ? 'warning' : 'success'}
              showIcon={false}
              style={{
                fontSize: '12px',
                padding: '8px',
                marginBottom: '12px',
              }}
            />
          )}

          {currentItem.status === 'failed' && (
            <Alert
              message='Falha na importação/exportação'
              description='Verifique os logs para detalhes'
              type='error'
              showIcon={false}
              style={{
                fontSize: '12px',
                padding: '8px',
                marginBottom: '12px',
              }}
            />
          )}

          {currentItem.errors.length > 0 && (
            <ProgressList>
              <Text
                strong
                style={{
                  fontSize: '12px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Últimos erros:
              </Text>
              {currentItem.errors.slice(-3).map((error, index) => (
                <ProgressItem key={index} $status='error'>
                  <Text style={{ fontSize: '11px' }}>
                    Linha {error.row}: {error.message}
                  </Text>
                </ProgressItem>
              ))}
            </ProgressList>
          )}
        </ProgressContent>

        {currentItem.status === 'completed' ||
        currentItem.status === 'failed' ? (
          <ProgressFooter>
            <Space>
              <Button
                size='small'
                onClick={() => handleDismiss(currentItem.jobId)}
              >
                Dispensar
              </Button>
            </Space>
          </ProgressFooter>
        ) : null}
      </ProgressContainer>

      <ImportNotification
        isVisible={sideNotification.isVisible}
        type={sideNotification.type}
        title={sideNotification.title}
        description={sideNotification.description}
        progress={sideNotification.progress}
        onRefresh={() => {
          window.location.reload();
        }}
        onClose={() => {
          setSideNotification(prev => ({ ...prev, isVisible: false }));
        }}
      />
    </>
  );
};
