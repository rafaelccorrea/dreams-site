import { useState, useEffect } from 'react';
import { authStorage } from '../services/authStorage';

export const useCompanyCheck = () => {
  const [hasCompany, setHasCompany] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCompanyStatus = () => {
    setIsLoading(true);

    try {
      const user = authStorage.getUserData();
      const decodedToken = authStorage.getDecodedToken();

      const userCompanyId = user?.companyId;
      const tokenCompanyId = decodedToken?.companyId;

      const hasCompanyId = !!(userCompanyId || tokenCompanyId);
      const finalCompanyId = userCompanyId || tokenCompanyId;

      setHasCompany(hasCompanyId);
      setCompanyId(finalCompanyId);
    } catch (error) {
      console.error('Erro ao verificar status da empresa:', error);
      setHasCompany(false);
      setCompanyId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCompanyStatus();
  }, []);

  return {
    hasCompany,
    companyId,
    isLoading,
    checkCompanyStatus,
  };
};
