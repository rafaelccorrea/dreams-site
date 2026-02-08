import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdError } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useNotes } from '../hooks/useNotes';
import { validateEmail } from '../utils/masks';
import { maskPhoneAuto } from '../utils/masks';
import { toast } from 'react-toastify';
import { PermissionRoute } from '../components/PermissionRoute';
import styled from 'styled-components';
import {
  FormContent,
  FormGroup,
  FormGrid,
  Label,
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
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  FormContainer,
  FormActions,
} from '../styles/pages/CreatePropertyPageStyles';
import { type UpdateNoteData } from '../services/notesApi';
import { NotesShimmer } from '../components/common/Shimmer';

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

// Ajustar PageContainer para não ter padding (margens chegando aos cantos)
const NotePageContainer = styled(PageContainer)`
  padding: 0;
`;

// Adicionar padding ao PageContent para que o conteúdo não encoste nos cantos
const NotePageContent = styled(PageContent)`
  padding: 24px;
`;

const NoteFormContainer = styled(FormContainer)`
  width: 100%;
  margin: 0;
`;

const EditNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getNote, updateNote } = useNotes();

  const [formData, setFormData] = useState<UpdateNoteData>({
    title: '',
    content: '',
    type: 'basic',
    priority: 'medium',
    color: colors[0],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadNote = async () => {
      if (!id) {
        navigate('/notes');
        return;
      }

      setIsLoading(true);
      try {
        const note = await getNote(id);
        setFormData({
          title: note.title,
          content: note.content || '',
          type: note.type,
          priority: note.priority,
          color: note.color,
          tags: note.tags,
          clientName: note.clientName,
          clientPhone: note.clientPhone,
          clientEmail: note.clientEmail,
          reminderDate: note.reminderDate,
          hasReminder: note.hasReminder,
        });
      } catch (error) {
        toast.error('Erro ao carregar anotação');
        navigate('/notes');
      } finally {
        setIsLoading(false);
      }
    };

    loadNote();
  }, [id, navigate, getNote]);

  const handleUpdate = async () => {
    if (!id || !formData.title?.trim()) {
      setToastMessage('Título é obrigatório');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsUpdating(true);
    try {
      await updateNote(id, formData);
      setToastMessage('Anotação atualizada com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/notes');
      }, 1500);
    } catch {
      setToastMessage('Erro ao atualizar anotação');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <NotePageContainer>
          <NotePageContent>
            <NotesShimmer />
          </NotePageContent>
        </NotePageContainer>
      </Layout>
    );
  }

  return (
    <PermissionRoute permission='note:update'>
      <Layout>
        <NotePageContainer>
          <NotePageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Editar Anotação</PageTitle>
                <PageSubtitle>Atualize as informações da anotação</PageSubtitle>
              </PageTitleContainer>
              <BackButton onClick={() => navigate('/notes')}>
                <MdArrowBack size={20} />
                Voltar
              </BackButton>
            </PageHeader>

            <NoteFormContainer>
              <FormContent>
                <FormGroup>
                  <Label>Título *</Label>
                  <Input
                    type='text'
                    value={formData.title || ''}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder='Digite o título da anotação'
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Conteúdo</Label>
                  <TextArea
                    value={formData.content || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder='Digite o conteúdo da anotação'
                    rows={8}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Prioridade</Label>
                  <Select
                    value={formData.priority || 'medium'}
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
                </FormGroup>

                {formData.type === 'advanced' && (
                  <>
                    <FormGroup>
                      <Label>Nome do Cliente</Label>
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
                    </FormGroup>

                    <FormGrid>
                      <FormGroup style={{ marginBottom: 0 }}>
                        <Label>Telefone do Cliente</Label>
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
                      </FormGroup>

                      <FormGroup style={{ marginBottom: 0 }}>
                        <Label>Email do Cliente</Label>
                        <Input
                          type='email'
                          value={formData.clientEmail || ''}
                          onChange={e => {
                            const email = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              clientEmail: email,
                            }));
                            if (email && !validateEmail(email)) {
                              setEmailError('Email inválido');
                            } else {
                              setEmailError('');
                            }
                          }}
                          placeholder='email@exemplo.com'
                          style={
                            emailError
                              ? { borderColor: 'var(--color-error)' }
                              : {}
                          }
                        />
                        {emailError && (
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-error)',
                              marginTop: '4px',
                              display: 'block',
                            }}
                          >
                            {emailError}
                          </span>
                        )}
                      </FormGroup>
                    </FormGrid>

                    <FormGroup>
                      <Label>Data do Lembrete</Label>
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
                    </FormGroup>
                  </>
                )}

                <FormGroup>
                  <Label>Cor da Anotação</Label>
                  <ColorPicker>
                    {colors.map(color => (
                      <ColorOption
                        key={color}
                        $color={color}
                        $isSelected={formData.color === color}
                        onClick={() =>
                          setFormData(prev => ({ ...prev, color }))
                        }
                      />
                    ))}
                  </ColorPicker>
                </FormGroup>
              </FormContent>

              <FormActions>
                <BackButton onClick={() => navigate('/notes')}>
                  <MdArrowBack size={18} />
                  Cancelar
                </BackButton>
                <Button
                  className='primary'
                  onClick={handleUpdate}
                  disabled={!formData.title?.trim() || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ccc',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginRight: '8px',
                        }}
                      />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <MdCheck size={18} style={{ marginRight: '8px' }} />
                      Atualizar Anotação
                    </>
                  )}
                </Button>
              </FormActions>
            </NoteFormContainer>

            {/* Toast de Sucesso */}
            {showSuccessToast && (
              <ToastContainer $type='success'>
                <ToastIcon>
                  <MdCheck size={20} />
                </ToastIcon>
                <ToastMessage>{toastMessage}</ToastMessage>
              </ToastContainer>
            )}

            {/* Toast de Erro */}
            {showErrorToast && (
              <ToastContainer $type='error'>
                <ToastIcon>
                  <MdError size={20} />
                </ToastIcon>
                <ToastMessage>{toastMessage}</ToastMessage>
              </ToastContainer>
            )}
          </NotePageContent>
        </NotePageContainer>
      </Layout>
    </PermissionRoute>
  );
};

export default EditNotePage;
