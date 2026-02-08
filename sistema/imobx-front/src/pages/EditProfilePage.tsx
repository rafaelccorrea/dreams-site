import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave, MdPerson, MdPhone } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { TagSelector } from '../components/TagSelector';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';
import { EditProfilePageShimmer } from '../components/shimmer/EditProfilePageShimmer';
import {
  EditProfileContainer,
  EditProfileHeader,
  EditProfileHeaderContent,
  EditProfileTitle,
  EditProfileSubtitle,
  BackButton,
  EditProfileContent,
  SectionTitle,
  FormGroup,
  Label,
  Input,
  TagsSection,
  TagsLabel,
  FormActions,
  SaveButton,
  CancelButton,
} from '../styles/pages/EditProfilePageStyles';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, refreshUser } = useAuth();
  const { tags, loading: tagsLoading } = useTags();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const user = getCurrentUser();

        if (user) {
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
          });

          // Carregar tags do usuário se disponível
          if (user.tagIds && Array.isArray(user.tagIds)) {
            setSelectedTags(user.tagIds);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [getCurrentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      await authApi.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        tagIds: selectedTags,
      });

      // Atualizar dados do usuário
      await refreshUser();

      toast.success('Perfil atualizado com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      const errorMessage =
        error.response?.data?.message || 'Erro ao atualizar perfil';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Layout>
        <EditProfilePageShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <EditProfileContainer>
        <EditProfileHeader>
          <EditProfileHeaderContent>
            <div>
              <EditProfileTitle>
                <MdPerson size={28} />
                Editar Perfil
              </EditProfileTitle>
              <EditProfileSubtitle>
                Atualize suas informações pessoais
              </EditProfileSubtitle>
            </div>
            <BackButton onClick={handleCancel}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </EditProfileHeaderContent>
        </EditProfileHeader>

        <EditProfileContent>
          <SectionTitle>
            <MdPerson />
            Informações Pessoais
          </SectionTitle>

          <FormGroup>
            <Label>
              <MdPerson />
              Nome Completo
            </Label>
            <Input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Digite seu nome completo'
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <MdPhone />
              Telefone
            </Label>
            <Input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              placeholder='(11) 99999-9999'
            />
          </FormGroup>

          <SectionTitle style={{ marginTop: '32px' }}>Tags</SectionTitle>
          <TagsSection>
            <TagsLabel>Tags do Perfil</TagsLabel>
            <TagSelector
              availableTags={tags}
              selectedTagIds={selectedTags}
              onSelectionChange={setSelectedTags}
              loading={tagsLoading}
            />
          </TagsSection>

          <FormActions>
            <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
            <SaveButton
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim()}
            >
              <MdSave size={20} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </SaveButton>
          </FormActions>
        </EditProfileContent>
      </EditProfileContainer>
    </Layout>
  );
};

export default EditProfilePage;
