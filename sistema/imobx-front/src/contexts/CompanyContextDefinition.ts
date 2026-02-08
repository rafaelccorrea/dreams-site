import { createContext } from 'react';
import type { Company } from '../services/companyApiTemp';

export interface CompanyContextType {
  selectedCompany: Company | null;
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  selectCompany: (company: Company) => void;
  refreshCompanies: () => Promise<void>;
  clearSelectedCompany: () => void;
  clearError: () => void;
  addCompany: (company: Company) => void;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
