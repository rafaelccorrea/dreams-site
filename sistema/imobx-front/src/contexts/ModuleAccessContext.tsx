import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

interface ModuleAccessContextType {
  showModuleUpgradeModal: (moduleName: string, description?: string) => void;
  hideModuleUpgradeModal: () => void;
  isModalOpen: boolean;
  currentModule: string | null;
  currentDescription: string | null;
}

const ModuleAccessContext = createContext<ModuleAccessContextType | undefined>(
  undefined
);

export const useModuleAccess = (): ModuleAccessContextType => {
  const context = useContext(ModuleAccessContext);
  if (!context) {
    throw new Error(
      'useModuleAccess deve ser usado dentro de um ModuleAccessProvider'
    );
  }
  return context;
};

interface ModuleAccessProviderProps {
  children: ReactNode;
}

export const ModuleAccessProvider: React.FC<ModuleAccessProviderProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string | null>(
    null
  );

  const showModuleUpgradeModal = useCallback(
    (moduleName: string, description?: string) => {
      // console.log('🔒 ModuleAccessContext: Mostrando modal de upgrade para módulo:', moduleName);
      setCurrentModule(moduleName);
      setCurrentDescription(description || null);
      setIsModalOpen(true);
    },
    []
  );

  const hideModuleUpgradeModal = useCallback(() => {
    // console.log('🔒 ModuleAccessContext: Escondendo modal de upgrade');
    setIsModalOpen(false);
    setCurrentModule(null);
    setCurrentDescription(null);
  }, []);

  const value: ModuleAccessContextType = {
    showModuleUpgradeModal,
    hideModuleUpgradeModal,
    isModalOpen,
    currentModule,
    currentDescription,
  };

  return (
    <ModuleAccessContext.Provider value={value}>
      {children}
    </ModuleAccessContext.Provider>
  );
};
