import React, { useState, useEffect } from 'react';
import { Select } from './Select';
import {
  companyMembersApi,
  type CompanyMember,
} from '../../services/companyMembersApi';

interface ManagerSelectorProps {
  value: string | null;
  onChange: (managerId: string | null) => void;
  userRole?: 'user' | 'admin' | 'master' | 'manager';
  disabled?: boolean;
  error?: string;
  label?: string;
}

export const ManagerSelector: React.FC<ManagerSelectorProps> = ({
  value,
  onChange,
  userRole = 'user',
  disabled = false,
  error,
  label = 'Gestor Responsável',
}) => {
  const [managers, setManagers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Só carregar gestores se o usuário for USER
    if (userRole === 'user') {
      loadManagers();
    }
  }, [userRole]);

  const loadManagers = async () => {
    setLoading(true);
    try {
      // Usando a nova API pública de membros da empresa
      // Agora qualquer usuário pode ver os managers para atribuição
      const members = await companyMembersApi.getMembersByRole('manager', 100);
      setManagers(members);
    } catch (error) {
      console.error('Erro ao carregar gestores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Não mostrar se o role não for USER
  if (userRole !== 'user') {
    return null;
  }

  return (
    <Select
      label={label}
      value={value || ''}
      onChange={e => onChange(e.target.value || null)}
      disabled={loading || disabled}
      error={error}
      fullWidth
    >
      <option value=''>Nenhum gestor</option>
      {managers.map(manager => (
        <option key={manager.id} value={manager.id}>
          {manager.name} - {manager.email}
        </option>
      ))}
    </Select>
  );
};
