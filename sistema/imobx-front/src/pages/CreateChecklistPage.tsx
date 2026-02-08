import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  MdArrowBack,
  MdSave,
  MdAdd,
  MdDelete,
  MdHome,
  MdPerson,
  MdVisibility,
  MdSchedule,
} from 'react-icons/md';
import { useChecklists } from '../hooks/useChecklists';
import { propertyApi } from '../services/propertyApi';
import { clientsApi } from '../services/clientsApi';
import { toast } from 'react-toastify';
import { Spinner } from '../components/common/Spinner';
import { CreateChecklistShimmer } from '../components/shimmer/CreateChecklistShimmer';
import { useModuleAccess } from '../hooks/useModuleAccess';
import { usePermissionsContext } from '../contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '../utils/permissionContextualDependencies';
import type {
  ChecklistType,
  CreateChecklistDto,
  ChecklistItemDto,
} from '../types/checklist.types';
import { ChecklistTypeLabels } from '../types/checklist.types';
import {
  PageContainer,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  FormContainer,
  Section,
  SectionTitle,
  SectionDescription,
  FormGroup,
  Label,
  RequiredIndicator,
  Input,
  Select,
  Textarea,
  ItemsSection,
  ItemCard,
  ItemHeader,
  ItemTitleInput,
  DeleteItemButton,
  AddItemButton,
  ItemRow,
  InfoText,
  FormActions,
  Button,
  LoadingContainer,
  ErrorMessage,
  PreviewSection,
  PreviewHeader,
  PreviewTitle,
  PreviewBadge,
  PreviewItemsList,
  PreviewItem,
  PreviewItemNumber,
  PreviewItemContent,
  PreviewItemTitle,
  PreviewItemMeta,
  PreviewItemDays,
} from './styles/CreateChecklistPage.styles';

const CreateChecklistPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;

  const { createChecklist, updateChecklist, fetchChecklistById } =
    useChecklists();
  const { isModuleAvailableForCompany } = useModuleAccess();
  const { hasPermission } = usePermissionsContext();
  const [propertyId, setPropertyId] = useState<string>(
    searchParams.get('propertyId') || ''
  );
  const [clientId, setClientId] = useState<string>(
    searchParams.get('clientId') || ''
  );
  const [type, setType] = useState<ChecklistType>('sale');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<ChecklistItemDto[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [errors, setErrors] = useState<{
    propertyId?: string;
    clientId?: string;
  }>({});

  // Verificar acesso aos módulos
  const hasPropertyModule = isModuleAvailableForCompany('property_management');
  const hasClientModule = isModuleAvailableForCompany('client_management');

  // Templates padrão de checklist
  const defaultTemplates = {
    sale: [
      {
        title: 'Documentação inicial',
        estimatedDays: 3,
        description: 'Coleta de documentos básicos do cliente',
      },
      {
        title: 'Análise de crédito',
        estimatedDays: 7,
        description: 'Avaliação da capacidade financeira do cliente',
      },
      {
        title: 'Vistoria técnica',
        estimatedDays: 5,
        description: 'Inspeção completa da propriedade',
      },
      {
        title: 'Negociação e proposta',
        estimatedDays: 5,
        description: 'Elaboração e apresentação da proposta comercial',
      },
      {
        title: 'Contrato de compra e venda',
        estimatedDays: 10,
        description: 'Elaboração e assinatura do contrato',
      },
      {
        title: 'Financiamento',
        estimatedDays: 15,
        description: 'Processamento e aprovação do financiamento',
      },
      {
        title: 'Escritura e registro',
        estimatedDays: 10,
        description: 'Registro da escritura em cartório',
      },
      {
        title: 'Entrega das chaves',
        estimatedDays: 1,
        description: 'Vistoria final e entrega das chaves',
      },
    ],
    rental: [
      {
        title: 'Documentação inicial',
        estimatedDays: 3,
        description: 'Coleta de documentos básicos do locatário',
      },
      {
        title: 'Análise de perfil',
        estimatedDays: 5,
        description: 'Avaliação do perfil do locatário',
      },
      {
        title: 'Vistoria de entrada',
        estimatedDays: 2,
        description: 'Vistoria da propriedade antes da locação',
      },
      {
        title: 'Contrato de locação',
        estimatedDays: 5,
        description: 'Elaboração e assinatura do contrato de locação',
      },
      {
        title: 'Pagamento e caução',
        estimatedDays: 1,
        description: 'Recebimento do primeiro pagamento e caução',
      },
      {
        title: 'Entrega das chaves',
        estimatedDays: 1,
        description: 'Vistoria final e entrega das chaves',
      },
    ],
  };

  useEffect(() => {
    // Verificar se pode vincular checklist a propriedade
    const canLinkToProperty = canExecuteFunctionality(
      hasPermission,
      isEdit ? 'checklist:update' : 'checklist:create',
      isEdit
        ? 'alterar_vinculo_propriedade_checklist'
        : 'vincular_checklist_propriedade'
    );

    // Verificar se pode vincular checklist a cliente
    const canLinkToClient = canExecuteFunctionality(
      hasPermission,
      isEdit ? 'checklist:update' : 'checklist:create',
      isEdit
        ? 'alterar_vinculo_cliente_checklist'
        : 'vincular_checklist_cliente'
    );

    if (hasPropertyModule && canLinkToProperty) {
      loadProperties();
    }
    if (hasClientModule && canLinkToClient) {
      loadClients();
    }
    if (isEdit && id) {
      loadChecklist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id, hasPropertyModule, hasClientModule]); // Removidas dependências que causam loop

  const loadChecklist = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const checklist = await fetchChecklistById(id);
      setPropertyId(checklist.propertyId);
      setClientId(checklist.clientId);
      setType(checklist.type);
      setNotes(checklist.notes || '');
      setItems(
        checklist.items.map(item => ({
          title: item.title,
          description: item.description,
          status: item.status,
          requiredDocuments: item.requiredDocuments,
          estimatedDays: item.estimatedDays,
          order: item.order,
          notes: item.notes,
        }))
      );
    } catch (error) {
      toast.error('Erro ao carregar checklist');
      navigate('/checklists');
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const response = await propertyApi.getProperties({});
      const list = Array.isArray(response)
        ? response
        : (response as any)?.properties ||
          (response as any)?.items ||
          (response as any)?.data ||
          (response as any)?.results ||
          [];
      setProperties(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const response = await clientsApi.getClients({});
      const list = Array.isArray(response) ? response : response?.data || [];
      setClients(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        title: '',
        description: '',
        status: 'pending',
        order: items.length + 1,
        estimatedDays: undefined,
        requiredDocuments: [],
        notes: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(
      items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i + 1 }))
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof ChecklistItemDto,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const validateForm = (): boolean => {
    const newErrors: { propertyId?: string; clientId?: string } = {};

    if (!propertyId) {
      newErrors.propertyId = 'Selecione uma propriedade';
    }

    if (!clientId) {
      newErrors.clientId = 'Selecione um cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const data: CreateChecklistDto = {
        propertyId,
        clientId,
        type,
        notes: notes || undefined,
        items: items.length > 0 ? items : undefined,
      };

      if (isEdit && id) {
        const updated = await updateChecklist(id, {
          type,
          notes: notes || undefined,
          items:
            items.length > 0
              ? items.map((item, index) => ({
                  ...item,
                  order: index + 1,
                }))
              : undefined,
        });
        if (!updated) {
          throw new Error('Erro ao atualizar checklist');
        }
        toast.success('Checklist atualizado com sucesso!');
        navigate(`/checklists/${id}`);
      } else {
        await createChecklist(data);
        navigate('/checklists');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar checklist');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <CreateChecklistShimmer />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>
            {isEdit ? 'Editar Checklist' : 'Novo Checklist'}
          </PageTitle>
          <PageSubtitle>
            {isEdit
              ? 'Atualize as informações do checklist'
              : 'Crie um novo checklist de venda ou aluguel'}
          </PageSubtitle>
        </PageTitleContainer>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack />
          Voltar
        </BackButton>
      </PageHeader>

      <FormContainer>
        <Section>
          <SectionTitle>Informações Básicas</SectionTitle>
          <SectionDescription>
            Selecione a propriedade e cliente relacionados ao checklist
          </SectionDescription>

          {(() => {
            const canLinkToProperty = canExecuteFunctionality(
              hasPermission,
              isEdit ? 'checklist:update' : 'checklist:create',
              isEdit
                ? 'alterar_vinculo_propriedade_checklist'
                : 'vincular_checklist_propriedade'
            );

            if (!hasPropertyModule || !canLinkToProperty) {
              const message = getDisabledFunctionalityMessage(
                isEdit ? 'checklist:update' : 'checklist:create',
                isEdit
                  ? 'alterar_vinculo_propriedade_checklist'
                  : 'vincular_checklist_propriedade'
              );
              return (
                <FormGroup>
                  <Label>
                    <MdHome size={18} />
                    Propriedade <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <div
                    style={{
                      padding: '12px',
                      background: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      color: '#92400e',
                      fontSize: '14px',
                    }}
                  >
                    {message ||
                      'Você não tem permissão para vincular checklists a propriedades.'}
                  </div>
                </FormGroup>
              );
            }

            return (
              <FormGroup>
                <Label>
                  <MdHome size={18} />
                  Propriedade <RequiredIndicator>*</RequiredIndicator>
                </Label>
                {loadingProperties ? (
                  <LoadingContainer>
                    <Spinner size={20} />
                    <span>Carregando propriedades...</span>
                  </LoadingContainer>
                ) : (
                  <>
                    <Select
                      value={propertyId}
                      onChange={e => {
                        setPropertyId(e.target.value);
                        setErrors({ ...errors, propertyId: undefined });
                      }}
                      disabled={isEdit || !!searchParams.get('propertyId')}
                    >
                      <option value=''>Selecione uma propriedade</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.title || prop.code || prop.id}
                        </option>
                      ))}
                    </Select>
                    {errors.propertyId && (
                      <ErrorMessage>{errors.propertyId}</ErrorMessage>
                    )}
                  </>
                )}
              </FormGroup>
            );
          })()}

          {(() => {
            const canLinkToClient = canExecuteFunctionality(
              hasPermission,
              isEdit ? 'checklist:update' : 'checklist:create',
              isEdit
                ? 'alterar_vinculo_cliente_checklist'
                : 'vincular_checklist_cliente'
            );

            if (!hasClientModule || !canLinkToClient) {
              const message = getDisabledFunctionalityMessage(
                isEdit ? 'checklist:update' : 'checklist:create',
                isEdit
                  ? 'alterar_vinculo_cliente_checklist'
                  : 'vincular_checklist_cliente'
              );
              return (
                <FormGroup>
                  <Label>
                    <MdPerson size={18} />
                    Cliente <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <div
                    style={{
                      padding: '12px',
                      background: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      color: '#92400e',
                      fontSize: '14px',
                    }}
                  >
                    {message ||
                      'Você não tem permissão para vincular checklists a clientes.'}
                  </div>
                </FormGroup>
              );
            }

            return (
              <FormGroup>
                <Label>
                  <MdPerson size={18} />
                  Cliente <RequiredIndicator>*</RequiredIndicator>
                </Label>
                {loadingClients ? (
                  <LoadingContainer>
                    <Spinner size={20} />
                    <span>Carregando clientes...</span>
                  </LoadingContainer>
                ) : (
                  <>
                    <Select
                      value={clientId}
                      onChange={e => {
                        setClientId(e.target.value);
                        setErrors({ ...errors, clientId: undefined });
                      }}
                      disabled={isEdit || !!searchParams.get('clientId')}
                    >
                      <option value=''>Selecione um cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </Select>
                    {errors.clientId && (
                      <ErrorMessage>{errors.clientId}</ErrorMessage>
                    )}
                  </>
                )}
              </FormGroup>
            );
          })()}

          <FormGroup>
            <Label>
              Tipo <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Select
              value={type}
              onChange={e => setType(e.target.value as ChecklistType)}
            >
              <option value='sale'>{ChecklistTypeLabels.sale}</option>
              <option value='rental'>{ChecklistTypeLabels.rental}</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Observações Gerais</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder='Adicione observações sobre este checklist...'
            />
          </FormGroup>
        </Section>

        {/* Prévia do Checklist Padrão - Mostra quando não há itens personalizados */}
        {items.length === 0 && !isEdit && (
          <PreviewSection>
            <PreviewHeader>
              <PreviewTitle>
                <MdVisibility size={20} />
                Prévia do Checklist Padrão
              </PreviewTitle>
              <PreviewBadge>{defaultTemplates[type].length} itens</PreviewBadge>
            </PreviewHeader>
            <InfoText style={{ marginBottom: '20px' }}>
              Se você não adicionar itens personalizados, será criado
              automaticamente um checklist padrão com os seguintes itens:
            </InfoText>
            <PreviewItemsList>
              {defaultTemplates[type].map((item, index) => (
                <PreviewItem key={index}>
                  <PreviewItemNumber>{index + 1}</PreviewItemNumber>
                  <PreviewItemContent>
                    <PreviewItemTitle>{item.title}</PreviewItemTitle>
                    <PreviewItemMeta>
                      {item.description && <span>{item.description}</span>}
                      {item.estimatedDays && (
                        <PreviewItemDays>
                          <MdSchedule size={14} />
                          {item.estimatedDays}{' '}
                          {item.estimatedDays === 1 ? 'dia' : 'dias'}
                        </PreviewItemDays>
                      )}
                    </PreviewItemMeta>
                  </PreviewItemContent>
                </PreviewItem>
              ))}
            </PreviewItemsList>
          </PreviewSection>
        )}

        <Section>
          <SectionTitle>Itens Personalizados</SectionTitle>
          <SectionDescription>
            {items.length === 0
              ? 'Adicione itens personalizados ao checklist. Se não informar itens, será criado um checklist padrão baseado no tipo selecionado.'
              : 'Gerencie os itens personalizados do seu checklist.'}
          </SectionDescription>

          {items.length === 0 && (
            <InfoText>
              Os itens personalizados permitem criar um checklist específico
              para suas necessidades. Cada item pode ter título, descrição,
              prazo estimado e observações.
            </InfoText>
          )}

          <ItemsSection>
            {items.map((item, index) => (
              <ItemCard key={index}>
                <ItemHeader>
                  <ItemTitleInput
                    value={item.title}
                    onChange={e =>
                      handleItemChange(index, 'title', e.target.value)
                    }
                    placeholder='Título do item *'
                  />
                  <DeleteItemButton onClick={() => handleRemoveItem(index)}>
                    <MdDelete size={18} />
                  </DeleteItemButton>
                </ItemHeader>

                <Textarea
                  value={item.description || ''}
                  onChange={e =>
                    handleItemChange(index, 'description', e.target.value)
                  }
                  placeholder='Descrição do item (opcional)'
                />

                <ItemRow>
                  <Input
                    type='number'
                    value={item.estimatedDays || ''}
                    onChange={e =>
                      handleItemChange(
                        index,
                        'estimatedDays',
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    placeholder='Prazo estimado (dias)'
                    min='1'
                  />
                  <Input
                    value={item.notes || ''}
                    onChange={e =>
                      handleItemChange(index, 'notes', e.target.value)
                    }
                    placeholder='Observações do item'
                  />
                </ItemRow>
              </ItemCard>
            ))}

            <AddItemButton onClick={handleAddItem}>
              <MdAdd size={18} />
              Adicionar Item
            </AddItemButton>
          </ItemsSection>
        </Section>

        <FormActions>
          <Button onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={handleSubmit}
            disabled={loading || !propertyId || !clientId}
          >
            {loading ? (
              <>
                <Spinner size={16} />
                {isEdit ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              <>
                <MdSave />
                {isEdit ? 'Salvar Alterações' : 'Criar Checklist'}
              </>
            )}
          </Button>
        </FormActions>
      </FormContainer>
    </PageContainer>
  );
};

export default CreateChecklistPage;
