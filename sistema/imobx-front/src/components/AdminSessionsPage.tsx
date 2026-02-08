import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface UserLastLogin {
  id: string;
  email: string;
  name: string;
  lastLogin: string | null;
  lastLoginIp: string | null;
  lastLoginDevice: string | null;
  lastLoginBrowser: string | null;
  lastLoginOperatingSystem: string | null;
}

interface AdminSessionsPageProps {
  onClose: () => void;
}

export const AdminSessionsPage: React.FC<AdminSessionsPageProps> = ({
  onClose,
}) => {
  const [users, setUsers] = useState<UserLastLogin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.getAllUsersLastLogins(page, limit);
      setUsers(response.users);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (lastLogin: string | null) => {
    if (!lastLogin) return 'text-gray-500';

    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) return 'text-green-600';
    if (diffHours < 24) return 'text-yellow-600';
    if (diffHours < 168) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusText = (lastLogin: string | null) => {
    if (!lastLogin) return 'Nunca logou';

    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) return 'Online agora';
    if (diffHours < 24) return 'Online hoje';
    if (diffHours < 168) return 'Online esta semana';
    return 'Offline há muito tempo';
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Última Atividade dos Usuários
          </h2>
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
            <p className='mt-2 text-gray-600'>Carregando usuários...</p>
          </div>
        ) : error ? (
          <div className='text-center py-8'>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={loadUsers}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <div className='mb-4'>
              <p className='text-gray-600'>
                Mostrando {users.length} de {total} usuários (página {page} de{' '}
                {totalPages})
              </p>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-300'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Nome
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Email
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Último Login
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Status
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      IP
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Dispositivo
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Navegador
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left'>
                      Sistema
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className='hover:bg-gray-50'>
                      <td className='border border-gray-300 px-4 py-2 font-medium'>
                        {user.name}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {user.email}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        <span className={getStatusColor(user.lastLogin)}>
                          {getStatusText(user.lastLogin)}
                        </span>
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {user.lastLoginIp || '-'}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {user.lastLoginDevice || '-'}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {user.lastLoginBrowser || '-'}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {user.lastLoginOperatingSystem || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-600'>Nenhum usuário encontrado.</p>
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className='mt-6 flex justify-center items-center space-x-2'>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
                >
                  Anterior
                </button>

                <span className='px-3 py-1'>
                  Página {page} de {totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
                >
                  Próxima
                </button>
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
