import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdError, MdInfoOutline } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useNotes } from '../hooks/useNotes';
import { useCompany } from '../hooks/useCompany';
import { useSubscription } from '../hooks/useSubscription';
import { validateEmail, maskPhoneAuto } from '../utils/masks';
import { PermissionRoute } from '../components/PermissionRoute';
import styled from 'styled-components';
import {
  Input,
  TextArea,
  Select,
  ColorPicker,
  ColorOption,
  Button,
  ToastContainer,
  ToastIcon,
  ToastMessage,
} from '../styles/pages/NotesPageStyles';
import { type CreateNoteData } from '../services/notesApi';

const colors = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#F59E0B', // Amarelo
  '#EF4444', // Vermelho
  '#8B5CF6', // Roxo
  '#06B6D4', // Ciano
  '#84CC16', // Lima
  '#F97316', // Laranja
  '#EC4899', // Rosa
  '#6366F1', // Índigo
];

const AdvancedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabelWithTooltip = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: visible;
  z-index: 1;
`;

const TooltipIcon = styled(MdInfoOutline)`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;
`;

const TooltipContent = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.75rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  z-index: 200000;
  pointer-events: none;

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const ErrorHint = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: -2px;
`;

const CreateNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { createNote } = useNotes();
  const { selectedCompany } = useCompany();
  const { subscriptionStatus } = useSubscription();

  // Determinar tipo da nota baseado no plano da empresa
  const getNoteTypeByPlan = (): 'basic' | 'advanced' => {
    if (!subscriptionStatus?.plan) {
      return 'basic';
    }

    if (
      subscriptionStatus.plan.name.toLowerCase().includes('pro') ||
      subscriptionStatus.plan.name.toLowerCase().includes('custom') ||
      subscriptionStatus.plan.name.toLowerCase().includes('avançado')
    ) {
      return 'advanced';
    }

    return 'basic';
  };

  const [formData, setFormData] = useState<CreateNoteData>({
    title: '',
    content: '',
    type: getNoteTypeByPlan(),
    priority: 'medium',
    color: colors[0],
    companyId: selectedCompany?.id || '',
  });

  const [isCreating, setIsCreating] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (selectedCompany) {
      setFormData(prev => ({ ...prev, companyId: selectedCompany.id }));
    }
  }, [selectedCompany]);

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      setToastMessage('Título é obrigatório');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsCreating(true);
    try {
      await createNote(formData);
      setToastMessage('Anotação criada com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/notes');
      }, 1500);
    } catch {
      setToastMessage('Erro ao criar anotação');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PermissionRoute permission='note:create'>
      <Layout>
        <SimplePageContainer>
          <SimpleHeader>
            <div>
              <SimpleTitle>Nova Anotação</SimpleTitle>
              <SimpleSubtitle>
                Preencha os dados para criar uma nova anotação
              </SimpleSubtitle>
            </div>
            <SimpleBackButton onClick={() => navigate('/notes')}>
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
          </SimpleHeader>

          <SimpleFormGrid>
            <FieldContainer>
              <FieldLabelWithTooltip>
                Título <RequiredMark>*</RequiredMark>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Identifique a anotação para encontrá-la facilmente depois.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <Input
                type='text'
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder='Digite o título da anotação'
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Conteúdo
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Descreva os detalhes ou lembretes que deseja registrar.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <TextArea
                value={formData.content}
                onChange={e =>
                  setFormData(prev => ({ ...prev, content: e.target.value }))
                }
                placeholder='Digite o conteúdo da anotação'
                rows={8}
              />
            </FieldContainer>

            <ResponsiveRow>
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Prioridade
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Use para indicar a urgência ou relevância desta anotação.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Select
                  value={formData.priority}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      priority: e.target.value as any,
                    }))
                  }
                >
                  <option value='low'>Baixa</option>
                  <option value='medium'>Média</option>
                  <option value='high'>Alta</option>
                  <option value='urgent'>Urgente</option>
                </Select>
              </FieldContainer>
            </ResponsiveRow>

            {formData.type === 'advanced' && (
              <AdvancedSection>
                <SectionTitle>Informações do Cliente</SectionTitle>

                <FieldContainer>
                  <FieldLabelWithTooltip>
                    Nome do Cliente
                    <TooltipWrapper>
                      <TooltipIcon />
                      <TooltipContent>
                        Ajuda a relacionar a anotação a um cliente específico.
                      </TooltipContent>
                    </TooltipWrapper>
                  </FieldLabelWithTooltip>
                  <Input
                    type='text'
                    value={formData.clientName || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    placeholder='Nome do cliente'
                  />
                </FieldContainer>

                <ResponsiveRow>
                  <FieldContainer>
                    <FieldLabelWithTooltip>
                      Telefone do Cliente
                      <TooltipWrapper>
                        <TooltipIcon />
                        <TooltipContent>
                          Contato rápido para retorno ou lembrete.
                        </TooltipContent>
                      </TooltipWrapper>
                    </FieldLabelWithTooltip>
                    <Input
                      type='text'
                      value={formData.clientPhone || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          clientPhone: maskPhoneAuto(e.target.value),
                        }))
                      }
                      placeholder='(00) 00000-0000'
                      maxLength={15}
                    />
                  </FieldContainer>

                  <FieldContainer>
                    <FieldLabelWithTooltip>
                      Email do Cliente
                      <TooltipWrapper>
                        <TooltipIcon />
                        <TooltipContent>
                          Utilize para enviar notificações ou lembretes por
                          e-mail.
                        </TooltipContent>
                      </TooltipWrapper>
                    </FieldLabelWithTooltip>
                    <Input
                      type='email'
                      value={formData.clientEmail || ''}
                      onChange={e => {
                        const email = e.target.value;
                        setFormData(prev => ({ ...prev, clientEmail: email }));
                        if (email && !validateEmail(email)) {
                          setEmailError('Email inválido');
                        } else {
                          setEmailError('');
                        }
                      }}
                      placeholder='email@exemplo.com'
                      style={emailError ? { borderColor: '#EF4444' } : {}}
                    />
                    {emailError && <ErrorHint>{emailError}</ErrorHint>}
                  </FieldContainer>
                </ResponsiveRow>

                <FieldContainer>
                  <FieldLabelWithTooltip>
                    Data do Lembrete
                    <TooltipWrapper>
                      <TooltipIcon />
                      <TooltipContent>
                        Defina quando deseja ser lembrado desta anotação.
                      </TooltipContent>
                    </TooltipWrapper>
                  </FieldLabelWithTooltip>
                  <Input
                    type='datetime-local'
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.reminderDate || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        reminderDate: e.target.value,
                      }))
                    }
                  />
                </FieldContainer>
              </AdvancedSection>
            )}

            <FieldContainer>
              <FieldLabelWithTooltip>
                Cor da Anotação
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Destaque a nota visualmente na lista de anotações.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <ColorPicker>
                {colors.map(color => (
                  <ColorOption
                    key={color}
                    $color={color}
                    $isSelected={formData.color === color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </ColorPicker>
            </FieldContainer>
          </SimpleFormGrid>

          <ButtonsRow>
            <Button
              type='button'
              $variant='secondary'
              onClick={() => navigate('/notes')}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              $variant='primary'
              onClick={handleCreate}
              disabled={!formData.title.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <LoadingSpinner />
                  Criando...
                </>
              ) : (
                <>
                  <MdCheck size={18} />
                  Criar Anotação
                </>
              )}
            </Button>
          </ButtonsRow>

          {showSuccessToast && (
            <ToastContainer $type='success'>
              <ToastIcon>
                <MdCheck size={20} />
              </ToastIcon>
              <ToastMessage>{toastMessage}</ToastMessage>
            </ToastContainer>
          )}

          {showErrorToast && (
            <ToastContainer $type='error'>
              <ToastIcon>
                <MdError size={20} />
              </ToastIcon>
              <ToastMessage>{toastMessage}</ToastMessage>
            </ToastContainer>
          )}
        </SimplePageContainer>
      </Layout>
    </PermissionRoute>
  );
};

export default CreateNotePage;
