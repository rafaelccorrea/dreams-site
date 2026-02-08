import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';

interface Session {
  id: string;
  ipAddress: string;
  device: string;
  browser: string;
  operatingSystem: string;
  lastActivity: string;
  createdAt: string;
}

interface SessionsPageProps {
  onClose: () => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutOthersLoading, setLogoutOthersLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionsData = await authApi.getSessions();
      setSessions(sessionsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar sessões');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutOthers = async () => {
    if (
      !confirm('Tem certeza que deseja deslogar de todas as outras sessões?')
    ) {
      return;
    }

    try {
      setLogoutOthersLoading(true);
      await authApi.logoutOthers();
      await loadSessions(); // Recarregar lista
      toast.success('Outras sessões foram desativadas com sucesso!');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Erro ao deslogar outras sessões'
      );
    } finally {
      setLogoutOthersLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getCurrentSessionId = () => {
    // Identificar sessão atual por IP e User Agent
    // Esta é uma implementação simples - em produção seria melhor usar um ID único
    return sessions.find(
      session =>
        session.ipAddress === window.location.hostname ||
        session.device === 'Desktop'
    )?.id;
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Sessões Ativas</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-2xl'
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Carregando sessões...</p>
          </div>
        ) : error ? (
          <div className='text-center py-8'>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={loadSessions}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <div className='mb-4 flex justify-between items-center'>
              <p className='text-gray-600'>
                Você tem {sessions.length} sessão(ões) ativa(s)
              </p>
              {sessions.length > 1 && (
                <button
                  onClick={handleLogoutOthers}
                  disabled={logoutOthersLoading}
                  className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50'
                >
                  {logoutOthersLoading
                    ? 'Deslogando...'
                    : 'Deslogar Outras Sessões'}
                </button>
              )}
            </div>

            <div className='space-y-4'>
              {sessions.map(session => {
                const isCurrentSession = getCurrentSessionId() === session.id;
                return (
                  <div
                    key={session.id}
                    className={`border rounded-lg p-4 ${
                      isCurrentSession
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className='flex justify-between items-start'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h3 className='font-semibold text-gray-800'>
                            {session.device} - {session.browser}
                          </h3>
                          {isCurrentSession && (
                            <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                              Sessão Atual
                            </span>
                          )}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600'>
                          <div>
                            <span className='font-medium'>IP:</span>{' '}
                            {session.ipAddress}
                          </div>
                          <div>
                            <span className='font-medium'>Sistema:</span>{' '}
                            {session.operatingSystem}
                          </div>
                          <div>
                            <span className='font-medium'>
                              Última Atividade:
                            </span>{' '}
                            {formatDate(session.lastActivity)}
                          </div>
                          <div>
                            <span className='font-medium'>Criada em:</span>{' '}
                            {formatDate(session.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sessions.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-600'>
                  Nenhuma sessão ativa encontrada.
                </p>
              </div>
            )}
          </>
        )}

        <div className='mt-6 flex justify-end'>
          <button
            onClick={onClose}
            className='bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700'
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
