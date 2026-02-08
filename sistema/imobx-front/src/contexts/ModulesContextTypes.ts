import { createContext } from 'react';

export interface ModulesContextType {
  modules: string[];
  planType: string | null;
  hasModule: (moduleName: string) => boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const ModulesContext = createContext<ModulesContextType>({
  modules: [],
  planType: null,
  hasModule: () => false,
  loading: true,
  error: null,
  refresh: async () => {},
});

export { ModulesProvider } from './ModulesContext.tsx';
