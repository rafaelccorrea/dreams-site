import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdSave, MdInventory } from 'react-icons/md';
import { useAssets } from '../hooks/useAssets';
import { useUsers } from '../hooks/useUsers';
import { useProperties } from '../hooks/useProperties';
import { PermissionButton } from '../components/common/PermissionButton';
import { toast } from 'react-toastify';
import type { CreateAssetDto, UpdateAssetDto } from '../types/asset';
import { AssetCategoryOptions, AssetStatusOptions } from '../types/asset';
import {
  formatCurrency,
  getNumericValue,
  formatCurrencyValue,
} from '../utils/masks';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
} from '../styles/pages/AssetsPageStyles';
import {
  BackButton,
  FormContainer,
  Form,
  FullWidthField,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  FormActions,
  SectionTitle,
} from '../styles/pages/CreateAssetPageStyles';

const CreateAssetPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const { createAsset, updateAsset, getAssetById, isLoading } = useAssets();
  const { users, getUsers } = useUsers();
  const { properties, getProperties } = useProperties();

  const [formData, setFormData] = useState<CreateAssetDto>({
    name: '',
    category: 'other',
    value: 0,
    status: 'available',
  });
  const [loading, setLoading] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const [assetLoading, setAssetLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');

  // Carregar users e properties quando a página carregar
  useEffect(() => {
    getUsers({ limit: 100 }).catch(err => {
      console.error('Erro ao carregar usuários:', err);
    });
    getProperties({}, { page: 1, limit: 100 }).catch(err => {
      console.error('Erro ao carregar propriedades:', err);
    });
  }, []);

  // Debounce busca de usuários
  useEffect(() => {
    const t = setTimeout(() => {
      getUsers({ limit: 100, search: userSearch || undefined }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch]);

  // Debounce busca de propriedades
  useEffect(() => {
    const t = setTimeout(() => {
      getProperties(
        { search: propertySearch || undefined },
        { page: 1, limit: 100 }
      ).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [propertySearch]);

  // Carregar dados se for edição
  useEffect(() => {
    if (isEditMode && id) {
      loadAsset();
    }
  }, [id, isEditMode]);

  const loadAsset = async () => {
    if (!id) return;
    setAssetLoading(true);
    try {
      const asset = await getAssetById(id);
      const loaded = {
        name: asset.name,
        description: asset.description,
        category: asset.category,
        status: asset.status,
        value: asset.value,
        serialNumber: asset.serialNumber,
        brand: asset.brand,
        model: asset.model,
        location: asset.location,
        notes: asset.notes,
        assignedToUserId: asset.assignedToUser?.id,
        propertyId: asset.property?.id,
        acquisitionDate: asset.acquisitionDate
          ? asset.acquisitionDate.split('T')[0]
          : undefined,
      } as CreateAssetDto;
      setFormData(loaded);
      // Inicializar máscara de valor
      setValueInput(
        formatCurrencyValue(loaded.value).replace(/[^\d,.]/g, '') // remove R$ e espaços
      );
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar patrimônio');
      navigate('/assets');
    } finally {
      setAssetLoading(false);
    }
  };

  // Função para remover campos vazios (mantém valores 0 e false)
  const cleanFormData = (
    data: CreateAssetDto | UpdateAssetDto
  ): CreateAssetDto | UpdateAssetDto => {
    const cleaned = { ...data };

    // Remover apenas strings vazias, null ou undefined (mantém 0, false, etc)
    Object.keys(cleaned).forEach(key => {
      const value = cleaned[key as keyof typeof cleaned];
      if (value === '' || value === null || value === undefined) {
        delete cleaned[key as keyof typeof cleaned];
      }
    });

    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanedData = cleanFormData(formData);

      if (isEditMode && id) {
        await updateAsset(id, cleanedData);
        toast.success('Patrimônio atualizado com sucesso!');
      } else {
        await createAsset(cleanedData);
        toast.success('Patrimônio criado com sucesso!');
      }
      navigate('/assets');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar patrimônio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'value') {
      const masked = formatCurrency(value);
      setValueInput(masked);
      const numeric = getNumericValue(masked);
      setFormData(prev => ({ ...prev, value: numeric }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (assetLoading) {
    return (
      <PageContainer>
        <PageContent>
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <MdInventory
              size={64}
              style={{ opacity: 0.3, marginBottom: '16px' }}
            />
            <p>Carregando patrimônio...</p>
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <PageTitleContainer>
            <PageTitle>
              {isEditMode ? 'Editar Patrimônio' : 'Novo Patrimônio'}
            </PageTitle>
            <PageSubtitle>
              {isEditMode
                ? 'Atualize as informações do patrimônio'
                : 'Preencha os dados para criar um novo patrimônio'}
            </PageSubtitle>
          </PageTitleContainer>
          <BackButton onClick={() => navigate('/assets')}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
        </PageHeader>

        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <SectionTitle>Informações Básicas</SectionTitle>

            <FullWidthField>
              <FormGroup>
                <Label $required>Nome</Label>
                <Input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder='Ex: Notebook Dell Latitude 5420'
                />
              </FormGroup>
            </FullWidthField>

            <FormGroup>
              <Label $required>Categoria</Label>
              <Select
                name='category'
                value={formData.category}
                onChange={handleChange}
                required
              >
                {AssetCategoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select
                name='status'
                value={formData.status}
                onChange={handleChange}
              >
                {AssetStatusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label $required>Valor (R$)</Label>
              <Input
                type='text'
                name='value'
                value={valueInput}
                onChange={handleChange}
                required
                placeholder='0,00'
                inputMode='numeric'
              />
            </FormGroup>

            <FullWidthField>
              <FormGroup>
                <Label>Descrição</Label>
                <TextArea
                  name='description'
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder='Descrição do patrimônio...'
                />
              </FormGroup>
            </FullWidthField>

            <SectionTitle>Detalhes Técnicos</SectionTitle>

            <FormGroup>
              <Label>Marca</Label>
              <Input
                type='text'
                name='brand'
                value={formData.brand || ''}
                onChange={handleChange}
                placeholder='Ex: Dell'
              />
            </FormGroup>

            <FormGroup>
              <Label>Modelo</Label>
              <Input
                type='text'
                name='model'
                value={formData.model || ''}
                onChange={handleChange}
                placeholder='Ex: Latitude 5420'
              />
            </FormGroup>

            <FormGroup>
              <Label>Número de Série</Label>
              <Input
                type='text'
                name='serialNumber'
                value={formData.serialNumber || ''}
                onChange={handleChange}
                placeholder='Ex: SN123456789'
              />
            </FormGroup>

            <FormGroup>
              <Label>Localização</Label>
              <Input
                type='text'
                name='location'
                value={formData.location || ''}
                onChange={handleChange}
                placeholder='Ex: Escritório Central - Sala 203'
              />
            </FormGroup>

            <FormGroup>
              <Label>Data de Aquisição</Label>
              <Input
                type='date'
                name='acquisitionDate'
                value={formData.acquisitionDate || ''}
                onChange={handleChange}
              />
            </FormGroup>

            <SectionTitle>Vinculações</SectionTitle>

            <FormGroup>
              <Label>Responsável (Corretor)</Label>
              <Input
                type='text'
                placeholder='Buscar por nome ou email...'
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <Select
                name='assignedToUserId'
                value={formData.assignedToUserId || ''}
                onChange={handleChange}
              >
                <option value=''>Sem responsável</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Propriedade</Label>
              <Input
                type='text'
                placeholder='Buscar propriedade por nome, código ou endereço...'
                value={propertySearch}
                onChange={e => setPropertySearch(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <Select
                name='propertyId'
                value={formData.propertyId || ''}
                onChange={handleChange}
              >
                <option value=''>Sem propriedade</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title} -{' '}
                    {property.code || property.id.slice(0, 8)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <SectionTitle>Observações</SectionTitle>

            <FullWidthField>
              <FormGroup>
                <Label>Observações</Label>
                <TextArea
                  name='notes'
                  value={formData.notes || ''}
                  onChange={handleChange}
                  placeholder='Observações adicionais...'
                />
              </FormGroup>
            </FullWidthField>

            <FormActions>
              <BackButton type='button' onClick={() => navigate('/assets')}>
                Cancelar
              </BackButton>
              <PermissionButton
                permission={isEditMode ? 'asset:update' : 'asset:create'}
                type='submit'
                disabled={loading || isLoading}
              >
                <MdSave size={20} />
                {loading || isLoading
                  ? isEditMode
                    ? 'Salvando...'
                    : 'Criando...'
                  : isEditMode
                    ? 'Salvar Alterações'
                    : 'Criar Patrimônio'}
              </PermissionButton>
            </FormActions>
          </Form>
        </FormContainer>
      </PageContent>
    </PageContainer>
  );
};

export default CreateAssetPage;
