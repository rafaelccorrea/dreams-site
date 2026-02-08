import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Progress, Button, Collapse, Typography, Space } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../config/apiConfig';

const { Text } = Typography;
const { Panel } = Collapse;

interface ImportJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  successfulImports: number;
  failedImports: number;
  errors: { row: number; message: string }[];
  createdAt: Date;
  completedAt?: Date;
}

interface ImportProgressNotificationProps {
  onJobComplete?: (job: ImportJob) => void;
}

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-width: calc(100vw - 40px);
  z-index: 1000;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const JobItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const JobTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIcon = styled.div<{ status: string }>`
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return props.theme.colors.warning;
      case 'processing':
        return props.theme.colors.primary;
      case 'completed':
        return props.theme.colors.success;
      case 'failed':
        return props.theme.colors.error;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

const ErrorList = styled.div`
  max-height: 100px;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.errorBackground};
  border: 1px solid ${props => props.theme.colors.errorBorder};
  border-radius: 4px;
  padding: 8px;
`;

const ErrorItem = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  color: ${props => props.theme.colors.errorText};
`;

export const ImportProgressNotification: React.FC<
  ImportProgressNotificationProps
> = ({ onJobComplete }) => {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [, setSocket] = useState<any>(null);

  useEffect(() => {
    // Conectar ao WebSocket
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // URL do backend WebSocket com namespace /notifications (conforme documentação)
    const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`;

    // console.log('🔌 Conectando ao WebSocket de importações:', NOTIFICATIONS_URL);
    const newSocket = io(NOTIFICATIONS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      // console.log('✅ WebSocket conectado para importações');
      // Entrar no canal do usuário conforme documentação
      const userData = localStorage.getItem('dream_keys_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.id) {
            // console.log('📡 Entrando no canal do usuário:', user.id);
            newSocket.emit('join', user.id);
          }
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
        }
      }
    });

    newSocket.on('connect_error', error => {
      console.error('❌ Erro na conexão WebSocket:', error.message);
    });

    setSocket(newSocket);

    newSocket.on('import-progress', (data: any) => {
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        const jobIndex = updatedJobs.findIndex(job => job.id === data.jobId);

        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = {
            ...updatedJobs[jobIndex],
            status: data.status,
            progress: data.progress,
            processedRows:
              data.processedRows ?? updatedJobs[jobIndex].processedRows,
            successfulImports:
              data.successfulImports ?? updatedJobs[jobIndex].successfulImports,
            failedImports:
              data.failedImports ?? updatedJobs[jobIndex].failedImports,
            errors: data.errors ?? updatedJobs[jobIndex].errors,
          };
        }

        return updatedJobs;
      });
    });

    newSocket.on('job-completed', (data: any) => {
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        const jobIndex = updatedJobs.findIndex(job => job.id === data.jobId);

        if (jobIndex !== -1) {
          const completedJob = {
            ...updatedJobs[jobIndex],
            status: 'completed',
            progress: 100,
            completedAt: new Date(),
          };

          updatedJobs[jobIndex] = completedJob;

          // Notificar componente pai
          if (onJobComplete) {
            onJobComplete(completedJob as ImportJob);
          }

          // Auto-remover após 10 segundos
          setTimeout(() => {
            setJobs(prev => prev.filter(job => job.id !== data.jobId));
          }, 10000);
        }

        return updatedJobs;
      });
    });

    newSocket.on('job-error', (data: any) => {
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        const jobIndex = updatedJobs.findIndex(job => job.id === data.jobId);

        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = {
            ...updatedJobs[jobIndex],
            status: 'failed',
            completedAt: new Date(),
          };

          // Auto-remover após 15 segundos
          setTimeout(() => {
            setJobs(prev => prev.filter(job => job.id !== data.jobId));
          }, 15000);
        }

        return updatedJobs;
      });
    });

    // Carregar jobs existentes
    fetchImportJobs();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchImportJobs = async () => {
    try {
      const response = await fetch('/api/clients/import-jobs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const activeJobs = await response.json();
        setJobs(
          activeJobs.filter((job: ImportJob) => job.status !== 'completed')
        );
      }
    } catch (error) {
      console.error('Erro ao buscar jobs:', error);
    }
  };

  const removeJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined />;
      case 'processing':
        return <LoadingOutlined spin />;
      case 'completed':
        return <CheckCircleOutlined />;
      case 'failed':
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aguardando';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  if (jobs.length === 0) {
    return null;
  }

  return (
    <NotificationContainer>
      {jobs.map(job => (
        <JobItem key={job.id}>
          <JobHeader>
            <JobTitle>
              <StatusIcon status={job.status}>
                {getStatusIcon(job.status)}
              </StatusIcon>
              <div>
                <Text strong style={{ fontSize: 14 }}>
                  {job.fileName}
                </Text>
                <br />
                <Text type='secondary' style={{ fontSize: 12 }}>
                  {getStatusText(job.status)}
                </Text>
              </div>
            </JobTitle>
            <Button
              size='small'
              type='text'
              onClick={() => removeJob(job.id)}
              style={{ color: '#999' }}
            >
              ×
            </Button>
          </JobHeader>

          {job.status === 'processing' && (
            <Progress
              percent={job.progress}
              size='small'
              format={() => `${job.processedRows}/${job.totalRows}`}
            />
          )}

          <Space style={{ marginTop: 8, fontSize: 12 }}>
            <Text type='success'>{job.successfulImports} sucessos</Text>
            <Text type='danger'>{job.failedImports} falhas</Text>
          </Space>

          {job.errors.length > 0 && (
            <Collapse ghost size='small'>
              <Panel header={`Ver erros (${job.errors.length})`} key='1'>
                <ErrorList>
                  {job.errors.map((error, index) => (
                    <ErrorItem key={index}>
                      <Text strong>Linha {error.row}:</Text> {error.message}
                    </ErrorItem>
                  ))}
                </ErrorList>
              </Panel>
            </Collapse>
          )}
        </JobItem>
      ))}
    </NotificationContainer>
  );
};
