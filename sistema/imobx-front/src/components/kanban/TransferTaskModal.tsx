import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdSwapHoriz, MdCheckCircle } from 'react-icons/md';
import type {
  TransferTaskDto,
  TaskTransferResponse,
  KanbanProjectResponseDto,
} from '../../types/kanban';
import { kanbanApi } from '../../services/kanbanApi';
import { showError, showSuccess } from '../../utils/notifications';

interface TransferTaskModalProps {
  isOpen: boolean;
  taskId: string;
  currentProjectId?: string;
  onClose: () => void;
  onSuccess?: (result: TaskTransferResponse) => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  padding-top: 100px;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1001;
  margin-bottom: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};

  .required {
    color: ${props => props.theme.colors.error};
    margin-left: 4px;
  }
`;

const Select = styled.select`
  padding: 12px 14px;
  padding-right: 36px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const HelpText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: -4px;
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
  margin-top: -4px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$variant === 'secondary'
      ? props.theme.colors.border
      : props.theme.colors.primary};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.text : '#fff'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const InfoBox = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

export const TransferTaskModal: React.FC<TransferTaskModalProps> = ({
  isOpen,
  taskId,
  currentProjectId,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [projectMembers, setProjectMembers] = useState<
    Array<{
      id: string;
      role: 'member' | 'leader';
      isActive: boolean;
      createdAt: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>
  >([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Carregar funis quando modal abrir
  useEffect(() => {
    if (isOpen) {
      loadProjects();
      // Reset form
      setSelectedProjectId('');
      setSelectedUserId('');
      setNotes('');
      setError('');
      setProjectMembers([]);
    }
  }, [isOpen]);

  // Carregar membros do funil quando funil destino for selecionado
  useEffect(() => {
    if (selectedProjectId) {
      loadProjectMembers(selectedProjectId);
    } else {
      setProjectMembers([]);
      setSelectedUserId('');
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      // Buscar funis da empresa usando getFilteredProjects
      const { projectsApi } = await import('../../services/projectsApi');
      const teamId = localStorage.getItem('selectedTeamId') || '';

      let allProjects: any[] = [];

      if (teamId) {
        // Buscar funis da equipe
        try {
          const teamProjects = await projectsApi.getProjectsByTeam(teamId);
          allProjects = teamProjects;
        } catch (error) {
          console.warn(
            'Erro ao buscar funis da equipe, tentando filtrados:',
            error
          );
        }
      }

      // Se não encontrou funis ou não tem teamId, buscar todos com filtros
      if (allProjects.length === 0) {
        try {
          const response = await projectsApi.getFilteredProjects({
            limit: '100',
            status: 'active',
          });
          allProjects = response.data || [];
        } catch (error) {
          console.error('Erro ao buscar funis filtrados:', error);
        }
      }

      // Filtrar funis (remover o funil atual)
      const availableProjects = currentProjectId
        ? allProjects.filter(p => p.id !== currentProjectId)
        : allProjects;

      setProjects(availableProjects);
    } catch (error: any) {
      console.error('Erro ao carregar funis:', error);
      showError('Erro ao carregar funis');
    }
  };

  const loadProjectMembers = async (projectId: string) => {
    try {
      setLoadingMembers(true);
      const members = await kanbanApi.getProjectMembers(projectId);
      setProjectMembers(members);
    } catch (error: any) {
      console.error('Erro ao carregar membros do funil:', error);
      showError('Erro ao carregar membros do funil');
      setProjectMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedProjectId) {
      setError('Selecione o funil destino');
      return;
    }

    try {
      setLoading(true);
      const data: TransferTaskDto = {
        toProjectId: selectedProjectId,
        assignedToId: selectedUserId || undefined,
        notes: notes.trim() || undefined,
      };

      const result = await kanbanApi.transferTask(taskId, data);

      showSuccess(
        `Tarefa transferida com sucesso para ${result.toProject.name}`
      );

      if (onSuccess) {
        onSuccess(result);
      }

      onClose();
    } catch (error: any) {
      console.error('Erro ao transferir tarefa:', error);
      const errorMessage = error?.message || 'Erro ao transferir tarefa';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdSwapHoriz size={20} />
            Transferir Tarefa para Outro Funil
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoBox>
            <strong>ℹ️ Importante:</strong> A tarefa será{' '}
            <strong>duplicada</strong> para o funil destino. A tarefa original
            permanecerá no funil atual.
          </InfoBox>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor='toProjectId'>
                Funil Destino <span className='required'>*</span>
              </Label>
              <Select
                id='toProjectId'
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                disabled={loading}
                required
              >
                <option value=''>Selecione o funil destino</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
              {projects.length === 0 && (
                <HelpText>Nenhum funil disponível para transferência</HelpText>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor='assignedToId'>
                Responsável no Funil Destino (Opcional)
              </Label>
              <Select
                id='assignedToId'
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                disabled={loading || !selectedProjectId || loadingMembers}
              >
                <option value=''>
                  {loadingMembers
                    ? 'Carregando membros...'
                    : selectedProjectId
                      ? 'Selecione o responsável'
                      : 'Selecione primeiro o funil destino'}
                </option>
                {projectMembers.map(member => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}{' '}
                    {member.role === 'leader' ? '(Líder)' : ''}{' '}
                    {member.user.email ? `(${member.user.email})` : ''}
                  </option>
                ))}
              </Select>
              <HelpText>
                Apenas membros do funil destino podem ser atribuídos como
                responsáveis
              </HelpText>
              {selectedProjectId &&
                !loadingMembers &&
                projectMembers.length === 0 && (
                  <HelpText style={{ color: '#EF4444' }}>
                    Nenhum membro encontrado no funil selecionado
                  </HelpText>
                )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor='notes'>Observações (Opcional)</Label>
              <Textarea
                id='notes'
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder='Ex: Transferido do funil SDR para continuidade com corretor'
                disabled={loading}
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <ButtonGroup>
              <Button
                type='button'
                $variant='secondary'
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={loading || !selectedProjectId}>
                {loading ? (
                  'Transferindo...'
                ) : (
                  <>
                    <MdCheckCircle size={18} />
                    Transferir Tarefa
                  </>
                )}
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};
