import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  MdAdd,
  MdClose,
  MdDelete,
  MdEdit,
  MdAttachFile,
  MdEvent,
  MdNotes,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { clientsApi } from '../../services/clientsApi';
import type { ClientInteraction } from '../../types/client';
import type { Attachment } from '../../types/attachment';
import { toast } from 'react-toastify';
import {
  SectionTitle,
  InfoLabel,
} from '../../styles/pages/ClientDetailsPageStyles';
import {
  HeaderRow,
  AddButton,
  ErrorMessage,
  InteractionForm,
  FormHeader,
  FormTitle,
  CloseFormButton,
  FormRow,
  FormField,
  FormInput,
  FormTextarea,
  AttachmentsHeader,
  FilePickerButton,
  HiddenFileInput,
  SelectedFilesGrid,
  SelectedFileCard,
  SelectedFileImage,
  SelectedFileFallback,
  SelectedFileOverlay,
  SelectedFileName,
  SelectedFileMeta,
  SelectedFileRemoveButton,
  ExistingAttachmentsSection,
  ExistingAttachmentNotice,
  ExistingAttachmentGrid,
  ExistingAttachmentCard,
  ExistingAttachmentPreview,
  ExistingAttachmentImage,
  ExistingAttachmentIcon,
  ExistingAttachmentCheckbox,
  ExistingAttachmentInfo,
  ExistingAttachmentLabel,
  ExistingAttachmentMeta,
  ExistingAttachmentActions,
  ExistingAttachmentLink,
  ExistingAttachmentHint,
  FormActions,
  PrimaryButton,
  SecondaryButton,
  SmallHint,
  LoadingState,
  EmptyState,
  InteractionsList,
  InteractionItem,
  InteractionHeader,
  InteractionTitle,
  InteractionActions,
  IconButton,
  InteractionMeta,
  InteractionMetaItem,
  InteractionNotes,
  InteractionAttachmentGrid,
  InteractionAttachmentItem,
  InteractionAttachmentPreview,
  InteractionAttachmentImage,
  InteractionAttachmentIcon,
  InteractionAttachmentInfo,
  InteractionAttachmentName,
  InteractionAttachmentMeta,
} from './ClientInteractionsPanel.styles';

interface ClientInteractionsPanelProps {
  clientId: string;
}

interface InteractionFormState {
  title: string;
  notes: string;
  interactionAt: string;
}

const INITIAL_FORM_STATE: InteractionFormState = {
  title: '',
  notes: '',
  interactionAt: '',
};

const MAX_INTERACTION_FILES = 10;

type SelectedInteractionFile = {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
};

const createSelectedInteractionFile = (
  file: File
): SelectedInteractionFile => ({
  id:
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  file,
  previewUrl: URL.createObjectURL(file),
  isImage: file.type.startsWith('image/'),
});

const isImageContent = (contentType?: string, url?: string): boolean => {
  if (contentType && contentType.startsWith('image/')) {
    return true;
  }

  if (!url) {
    return false;
  }

  const sanitizedUrl = url.split('?')[0].toLowerCase();
  const imageExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.bmp',
    '.webp',
    '.svg',
  ];
  return imageExtensions.some(extension => sanitizedUrl.endsWith(extension));
};

const getAttachmentPreviewSource = (attachment: Attachment): string => {
  return attachment.previewUrl || attachment.url;
};

const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) {
    return '';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const formatted = unitIndex === 0 ? size.toFixed(0) : size.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
};

export const ClientInteractionsPanel: React.FC<
  ClientInteractionsPanelProps
> = ({ clientId }) => {
  const [interactions, setInteractions] = useState<ClientInteraction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] =
    useState<InteractionFormState>(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [editingInteraction, setEditingInteraction] =
    useState<ClientInteraction | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  const [selectedFilePreviews, setSelectedFilePreviews] = useState<
    SelectedInteractionFile[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(
    []
  );
  const [retainedAttachmentKeys, setRetainedAttachmentKeys] = useState<
    Set<string>
  >(new Set());

  const clearSelectedFilePreviews = useCallback(() => {
    setSelectedFilePreviews(prev => {
      prev.forEach(item => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [fileInputRef]);

  useEffect(() => {
    return () => {
      selectedFilePreviews.forEach(item =>
        URL.revokeObjectURL(item.previewUrl)
      );
    };
  }, [selectedFilePreviews]);

  const sortedInteractions = useMemo(() => {
    return [...interactions].sort((a, b) => {
      const dateA = new Date(a.interactionAt ?? a.createdAt).getTime();
      const dateB = new Date(b.interactionAt ?? b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [interactions]);

  const loadInteractions = useCallback(async () => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await clientsApi.getClientInteractions(clientId);
      setInteractions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message =
        err?.message || 'Erro ao carregar histórico de atendimento';
      setError(message);
      console.error('Erro ao carregar interações do cliente:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadInteractions();
  }, [loadInteractions]);

  const openForm = (interaction?: ClientInteraction) => {
    if (interaction) {
      const allAttachments = interaction.attachments || [];
      setEditingInteraction(interaction);
      setFormState({
        title: interaction.title || '',
        notes: interaction.notes || '',
        interactionAt: interaction.interactionAt
          ? formatDateTimeInput(interaction.interactionAt)
          : '',
      });
      setExistingAttachments(allAttachments);
      setRetainedAttachmentKeys(
        new Set(
          allAttachments
            .map(att => att.key)
            .filter((key): key is string => Boolean(key))
        )
      );
    } else {
      setEditingInteraction(null);
      setFormState(INITIAL_FORM_STATE);
      setExistingAttachments([]);
      setRetainedAttachmentKeys(new Set());
    }
    clearSelectedFilePreviews();
    setIsFormOpen(true);
    setError(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingInteraction(null);
    setFormState(INITIAL_FORM_STATE);
    setError(null);
    clearSelectedFilePreviews();
    setExistingAttachments([]);
    setRetainedAttachmentKeys(new Set());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_INTERACTION_FILES - selectedFilePreviews.length;
    if (remainingSlots <= 0) {
      setError(
        `É permitido anexar até ${MAX_INTERACTION_FILES} arquivos por atendimento.`
      );
      event.target.value = '';
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    if (filesToAdd.length < files.length) {
      setError(
        `É permitido anexar até ${MAX_INTERACTION_FILES} arquivos por atendimento.`
      );
    } else {
      setError(null);
    }

    const previewsToAdd = filesToAdd.map(createSelectedInteractionFile);
    setSelectedFilePreviews(prev => [...prev, ...previewsToAdd]);

    event.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFilePreviews(prev => {
      const target = prev.find(item => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });
    setError(prev =>
      prev && prev.includes('É permitido anexar') ? null : prev
    );
  };

  const handleToggleRetainedAttachment = (key: string, keep: boolean) => {
    setRetainedAttachmentKeys(prev => {
      const next = new Set(prev);
      if (keep) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const handleDeleteInteraction = async (interactionId: string) => {
    if (
      !window.confirm('Deseja realmente remover este registro de atendimento?')
    ) {
      return;
    }

    setDeleteInProgress(interactionId);

    try {
      await clientsApi.deleteClientInteraction(clientId, interactionId);
      await loadInteractions();
    } catch (err: any) {
      const message = err?.message || 'Erro ao remover registro';
      setError(message);
      console.error('Erro ao remover interação:', err);
    } finally {
      setDeleteInProgress(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNotes = formState.notes.trim();

    if (!trimmedNotes) {
      setError('Observações são obrigatórias.');
      return;
    }

    if (formState.title && formState.title.trim().length > 150) {
      setError('O título deve ter no máximo 150 caracteres.');
      return;
    }

    const formattedInteractionAt = formState.interactionAt
      ? new Date(formState.interactionAt).toISOString()
      : undefined;

    const formData = new FormData();
    formData.append('notes', trimmedNotes);

    const trimmedTitle = formState.title?.trim();
    if (trimmedTitle) {
      formData.append('title', trimmedTitle);
    }

    if (formattedInteractionAt) {
      formData.append('interactionAt', formattedInteractionAt);
    }

    selectedFilePreviews.forEach(item => {
      formData.append('files', item.file);
    });

    setSubmitting(true);
    setError(null);

    try {
      if (editingInteraction) {
        formData.append(
          'retainAttachmentKeys',
          JSON.stringify(Array.from(retainedAttachmentKeys))
        );
        await clientsApi.updateClientInteraction(
          clientId,
          editingInteraction.id,
          formData
        );
      } else {
        await clientsApi.createClientInteraction(clientId, formData);
      }
      await loadInteractions();
      toast.success(
        editingInteraction
          ? 'Registro de atendimento atualizado com sucesso!'
          : 'Registro de atendimento criado com sucesso!'
      );
      closeForm();
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao salvar registro de atendimento';
      const validationMessages =
        err?.response?.data?.details?.validationErrors
          ?.map(
            (validationError: { message?: string }) => validationError?.message
          )
          .filter(Boolean) || [];
      const finalMessage =
        validationMessages.length > 0
          ? `${apiMessage}: ${validationMessages.join('; ')}`
          : apiMessage;
      setError(finalMessage);
      toast.error(finalMessage);
      console.error('Erro ao salvar interação:', err?.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <HeaderRow>
        <SectionTitle>
          <MdNotes size={18} />
          Histórico de Atendimento
        </SectionTitle>
        <AddButton type='button' onClick={() => openForm()}>
          <MdAdd size={18} />
          Registrar atendimento
        </AddButton>
      </HeaderRow>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isFormOpen && (
        <InteractionForm onSubmit={handleSubmit}>
          <FormHeader>
            <FormTitle>
              {editingInteraction ? 'Editar registro' : 'Novo registro'}
            </FormTitle>
            <CloseFormButton type='button' onClick={closeForm}>
              <MdClose size={18} />
            </CloseFormButton>
          </FormHeader>

          <FormRow>
            <FormField>
              <InfoLabel>Título (opcional)</InfoLabel>
              <FormInput
                placeholder='Ex.: Follow-up, Visita agendada...'
                maxLength={150}
                value={formState.title}
                onChange={e =>
                  setFormState(prev => ({ ...prev, title: e.target.value }))
                }
              />
              <SmallHint>{formState.title.length}/150</SmallHint>
            </FormField>
            <FormField>
              <InfoLabel>Data do atendimento</InfoLabel>
              <FormInput
                type='datetime-local'
                value={formState.interactionAt}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    interactionAt: e.target.value,
                  }))
                }
              />
            </FormField>
          </FormRow>

          <FormField>
            <InfoLabel>Observações *</InfoLabel>
            <FormTextarea
              placeholder='Descreva como foi o atendimento, próximos passos, feedback do cliente...'
              value={formState.notes}
              onChange={e =>
                setFormState(prev => ({ ...prev, notes: e.target.value }))
              }
              rows={4}
            />
          </FormField>

          <AttachmentsHeader>
            <InfoLabel>Anexos</InfoLabel>
            <FilePickerButton
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedFilePreviews.length >= MAX_INTERACTION_FILES}
            >
              <MdAttachFile size={16} />
              Selecionar arquivos
            </FilePickerButton>
          </AttachmentsHeader>

          <HiddenFileInput
            ref={fileInputRef}
            type='file'
            multiple
            onChange={handleFileChange}
          />

          {selectedFilePreviews.length > 0 && (
            <SelectedFilesGrid>
              {selectedFilePreviews.map(item => (
                <SelectedFileCard key={item.id}>
                  {item.isImage ? (
                    <SelectedFileImage
                      src={item.previewUrl}
                      alt={item.file.name}
                    />
                  ) : (
                    <SelectedFileFallback>
                      <MdAttachFile size={22} />
                      <span>{item.file.name}</span>
                    </SelectedFileFallback>
                  )}
                  <SelectedFileOverlay>
                    <SelectedFileName>{item.file.name}</SelectedFileName>
                    <SelectedFileMeta>
                      {formatFileSize(item.file.size)}
                    </SelectedFileMeta>
                  </SelectedFileOverlay>
                  <SelectedFileRemoveButton
                    type='button'
                    onClick={() => handleRemoveFile(item.id)}
                    title='Remover arquivo'
                  >
                    <MdClose size={14} />
                  </SelectedFileRemoveButton>
                </SelectedFileCard>
              ))}
            </SelectedFilesGrid>
          )}

          {existingAttachments.length > 0 && (
            <ExistingAttachmentsSection>
              <ExistingAttachmentNotice>
                Mantenha marcados os anexos que devem permanecer após salvar.
              </ExistingAttachmentNotice>
              <ExistingAttachmentGrid>
                {existingAttachments.map(attachment => {
                  const previewSource = getAttachmentPreviewSource(attachment);
                  const isImage = isImageContent(
                    attachment.contentType,
                    previewSource
                  );
                  const metaParts: string[] = [];
                  if (
                    typeof attachment.size === 'number' &&
                    attachment.size > 0
                  ) {
                    metaParts.push(formatFileSize(attachment.size));
                  }
                  if (attachment.contentType) {
                    metaParts.push(attachment.contentType);
                  }
                  if (attachment.key) {
                    metaParts.push(`Chave: ${attachment.key}`);
                  }

                  const checkboxId = `${attachment.key || attachment.url}-retain`;
                  const isSelectable = Boolean(attachment.key);
                  const isSelected = attachment.key
                    ? retainedAttachmentKeys.has(attachment.key)
                    : true;

                  return (
                    <ExistingAttachmentCard
                      key={attachment.key || attachment.url}
                    >
                      <ExistingAttachmentPreview>
                        {isImage ? (
                          <ExistingAttachmentImage
                            src={previewSource}
                            alt={attachment.name || 'Anexo'}
                          />
                        ) : (
                          <ExistingAttachmentIcon>
                            <MdAttachFile size={24} />
                          </ExistingAttachmentIcon>
                        )}
                        <ExistingAttachmentCheckbox
                          id={checkboxId}
                          type='checkbox'
                          disabled={!isSelectable}
                          checked={isSelected}
                          onChange={e =>
                            attachment.key
                              ? handleToggleRetainedAttachment(
                                  attachment.key,
                                  e.target.checked
                                )
                              : undefined
                          }
                          title={
                            isSelectable
                              ? 'Manter este anexo'
                              : 'Este anexo não possui chave e será mantido automaticamente'
                          }
                        />
                      </ExistingAttachmentPreview>
                      <ExistingAttachmentInfo>
                        <ExistingAttachmentLabel htmlFor={checkboxId}>
                          {attachment.name || attachment.url}
                        </ExistingAttachmentLabel>
                        {metaParts.length > 0 && (
                          <ExistingAttachmentMeta>
                            {metaParts.join(' • ')}
                          </ExistingAttachmentMeta>
                        )}
                        <ExistingAttachmentActions>
                          <ExistingAttachmentLink
                            href={attachment.url}
                            target='_blank'
                            rel='noreferrer'
                          >
                            Abrir
                          </ExistingAttachmentLink>
                          {!isSelectable && (
                            <ExistingAttachmentHint>
                              Anexo sem chave (será mantido)
                            </ExistingAttachmentHint>
                          )}
                        </ExistingAttachmentActions>
                      </ExistingAttachmentInfo>
                    </ExistingAttachmentCard>
                  );
                })}
              </ExistingAttachmentGrid>
            </ExistingAttachmentsSection>
          )}

          <FormActions>
            <SecondaryButton
              type='button'
              onClick={closeForm}
              disabled={submitting}
            >
              Cancelar
            </SecondaryButton>
            <PrimaryButton type='submit' disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar registro'}
            </PrimaryButton>
          </FormActions>
        </InteractionForm>
      )}

      {loading ? (
        <LoadingState>Carregando histórico...</LoadingState>
      ) : sortedInteractions.length === 0 ? (
        <EmptyState>Nenhum atendimento registrado ainda.</EmptyState>
      ) : (
        <InteractionsList>
          {sortedInteractions.map(interaction => (
            <InteractionItem key={interaction.id}>
              <InteractionHeader>
                <InteractionTitle>
                  {interaction.title || 'Sem título'}
                </InteractionTitle>
                <InteractionActions>
                  <IconButton
                    type='button'
                    onClick={() => openForm(interaction)}
                  >
                    <MdEdit size={18} />
                  </IconButton>
                  <IconButton
                    type='button'
                    onClick={() => handleDeleteInteraction(interaction.id)}
                    disabled={deleteInProgress === interaction.id}
                  >
                    <MdDelete size={18} />
                  </IconButton>
                </InteractionActions>
              </InteractionHeader>
              <InteractionMeta>
                <InteractionMetaItem>
                  <MdEvent size={16} />
                  <span>
                    {interaction.interactionAt
                      ? format(
                          new Date(interaction.interactionAt),
                          "dd/MM/yyyy 'às' HH:mm",
                          {
                            locale: ptBR,
                          }
                        )
                      : 'Sem data definida'}
                  </span>
                </InteractionMetaItem>
                <InteractionMetaItem>
                  <strong>{interaction.createdBy?.name || 'Equipe'}</strong>
                  <span>
                    registrou em{' '}
                    {format(new Date(interaction.createdAt), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </span>
                </InteractionMetaItem>
              </InteractionMeta>
              <InteractionNotes>{interaction.notes}</InteractionNotes>
              {interaction.attachments?.length > 0 && (
                <InteractionAttachmentGrid>
                  {interaction.attachments.map((attachment, index) => {
                    const previewSource =
                      getAttachmentPreviewSource(attachment);
                    const isImage = isImageContent(
                      attachment.contentType,
                      previewSource
                    );
                    const metaParts: string[] = [];
                    if (
                      typeof attachment.size === 'number' &&
                      attachment.size > 0
                    ) {
                      metaParts.push(formatFileSize(attachment.size));
                    }
                    if (attachment.contentType) {
                      metaParts.push(attachment.contentType);
                    }
                    if (attachment.key) {
                      metaParts.push(`Chave: ${attachment.key}`);
                    }

                    const shouldShowInfo = !isImage;

                    return (
                      <InteractionAttachmentItem
                        key={`${interaction.id}-attachment-${index}`}
                        href={attachment.url}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <InteractionAttachmentPreview>
                          {isImage ? (
                            <InteractionAttachmentImage
                              src={previewSource}
                              alt={attachment.name || 'Anexo'}
                            />
                          ) : (
                            <InteractionAttachmentIcon>
                              <MdAttachFile size={24} />
                            </InteractionAttachmentIcon>
                          )}
                        </InteractionAttachmentPreview>
                        {shouldShowInfo && (
                          <InteractionAttachmentInfo>
                            <InteractionAttachmentName>
                              {attachment.name || attachment.url}
                            </InteractionAttachmentName>
                            {metaParts.length > 0 && (
                              <InteractionAttachmentMeta>
                                {metaParts.join(' • ')}
                              </InteractionAttachmentMeta>
                            )}
                          </InteractionAttachmentInfo>
                        )}
                      </InteractionAttachmentItem>
                    );
                  })}
                </InteractionAttachmentGrid>
              )}
            </InteractionItem>
          ))}
        </InteractionsList>
      )}
    </div>
  );
};

const formatDateTimeInput = (value: string) => {
  try {
    const date = new Date(value);
    const iso = date.toISOString();
    return iso.slice(0, 16);
  } catch {
    return '';
  }
};
