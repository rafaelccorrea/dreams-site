import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de modais disponíveis
export type ModalType =
  | 'createUser'
  | 'editUser'
  | 'deleteUser'
  | 'createTeam'
  | 'editTeam'
  | 'deleteTeam'
  | 'userPermissions'
  | 'createTask'
  | 'editTask'
  | 'deleteTask'
  | null;

interface ModalData {
  userId?: string;
  userName?: string;
  userEmail?: string;
  teamId?: string;
  teamName?: string;
  user?: any;
  team?: any;
  taskId?: string;
  taskTitle?: string;
  task?: any;
  columnId?: string;
  columnTitle?: string;
}

export interface ModalContextType {
  activeModal: ModalType;
  modalData: ModalData;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>({});

  const openModal = (type: ModalType, data: ModalData = {}) => {
    setActiveModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData({});
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Hook movido para hooks/useModal.ts
