import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

interface ModalContextType {
  activeModal:
    | 'createUser'
    | 'editUser'
    | 'deleteUser'
    | 'createTeam'
    | 'editTeam'
    | 'deleteTeam'
    | 'userPermissions'
    | null;
  modalData: {
    userId?: string;
    userName?: string;
    userEmail?: string;
    teamId?: string;
    teamName?: string;
    user?: any;
    team?: any;
  };
  openModal: (type: any, data?: any) => void;
  closeModal: () => void;
}

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};
