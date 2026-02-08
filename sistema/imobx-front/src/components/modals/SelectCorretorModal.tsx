import React, { useState, useEffect } from 'react';
import { MdClose, MdPerson, MdSearch, MdCheckCircle } from 'react-icons/md';
import {
  buscarCorretores,
  type TempUniaoUser,
} from '../../services/tempUniaoUsersApi';
import { showError } from '../../utils/notifications';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalButton,
} from '../../styles/pages/FichaVendaPageStyles';
import { FormInput, FormSelect } from '../../styles/pages/FichaVendaPageStyles';
import styled from 'styled-components';

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const CorretorList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const CorretorItem = styled.div<{ $selected: boolean }>`
  padding: 16px;
  border: 2px solid
    ${props =>
      props.$selected ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$selected
      ? 'var(--color-primary-light)'
      : 'var(--color-card-background)'};

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CorretorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CorretorIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-dark) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
`;

const CorretorDetails = styled.div`
  flex: 1;
`;

const CorretorName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const CorretorEmail = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const CorretorCpf = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
`;

const SelectedIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
`;

interface SelectCorretorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (corretor: TempUniaoUser) => void;
  selectedCorretorId?: string;
  /** Título do modal (ex.: "Adicionar corretor à comissão") */
  title?: string;
  /** Texto do botão de confirmação */
  confirmButtonText?: string;
}

const SelectCorretorModal: React.FC<SelectCorretorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedCorretorId,
  title = 'Selecionar Corretor',
  confirmButtonText = 'Confirmar Seleção',
}) => {
  const [corretores, setCorretores] = useState<TempUniaoUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>(
    selectedCorretorId
  );

  useEffect(() => {
    if (isOpen) {
      carregarCorretores();
      setSelectedId(selectedCorretorId);
    }
  }, [isOpen, selectedCorretorId]);

  const carregarCorretores = async () => {
    setLoading(true);
    try {
      const lista = await buscarCorretores();
      setCorretores(lista);
    } catch (error: any) {
      console.error('Erro ao carregar corretores:', error);
      showError(error.message || 'Erro ao carregar lista de corretores');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (corretor: TempUniaoUser) => {
    setSelectedId(corretor.id);
  };

  const handleConfirm = () => {
    if (!selectedId) {
      showError('Por favor, selecione um corretor');
      return;
    }

    const corretorSelecionado = corretores.find(c => c.id === selectedId);
    if (corretorSelecionado) {
      onSelect(corretorSelecionado);
      onClose();
    }
  };

  const filteredCorretores = corretores.filter(corretor => {
    const search = searchTerm.toLowerCase();
    return (
      corretor.nome.toLowerCase().includes(search) ||
      corretor.email.toLowerCase().includes(search) ||
      (corretor.cpf && corretor.cpf.includes(search))
    );
  });

  const getInitials = (nome: string) => {
    const parts = nome.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '90%' }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdPerson size={24} />
            Selecionar Corretor
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <MdClose />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <SearchContainer>
            <FormInput
              type='text'
              placeholder='Buscar por nome, email ou CPF...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </SearchContainer>

          {loading ? (
            <LoadingState>Carregando corretores...</LoadingState>
          ) : filteredCorretores.length === 0 ? (
            <EmptyState>
              {searchTerm
                ? 'Nenhum corretor encontrado com essa busca.'
                : 'Nenhum corretor disponível.'}
            </EmptyState>
          ) : (
            <CorretorList>
              {filteredCorretores.map(corretor => (
                <CorretorItem
                  key={corretor.id}
                  $selected={selectedId === corretor.id}
                  onClick={() => handleSelect(corretor)}
                >
                  <CorretorInfo>
                    <CorretorIcon>{getInitials(corretor.nome)}</CorretorIcon>
                    <CorretorDetails>
                      <CorretorName>{corretor.nome}</CorretorName>
                      <CorretorEmail>{corretor.email}</CorretorEmail>
                      {corretor.cpf && (
                        <CorretorCpf>CPF: {corretor.cpf}</CorretorCpf>
                      )}
                      {typeof corretor.porcentagem === 'number' && (
                        <CorretorCpf>
                          Porcentagem padrão: {corretor.porcentagem}%
                        </CorretorCpf>
                      )}
                    </CorretorDetails>
                    {selectedId === corretor.id && (
                      <SelectedIndicator>
                        <MdCheckCircle size={24} />
                        Selecionado
                      </SelectedIndicator>
                    )}
                  </CorretorInfo>
                </CorretorItem>
              ))}
            </CorretorList>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalButton
            $variant='secondary'
            onClick={onClose}
            style={{ marginRight: '12px' }}
          >
            Cancelar
          </ModalButton>
          <ModalButton
            $variant='primary'
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            {confirmButtonText}
          </ModalButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SelectCorretorModal;
