/**
 * Página de Templates MCMV
 * Gerenciamento de templates de mensagens
 */

import { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { toast } from 'react-toastify';
import { mcmvApi } from '../services/mcmvApi';
import type { MCMVTemplate, TemplateType } from '../types/mcmv';
import { Layout } from '../components/layout/Layout';
import { PermissionButton } from '../components/common/PermissionButton';
import { MCMVTemplatesShimmer } from '../components/shimmer/MCMVTemplatesShimmer';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  AddButton,
  TemplatesGrid,
  TemplateCard,
  TemplateHeader,
  TemplateName,
  TypeBadge,
  TemplateDescription,
  TemplateContent,
  VariablesList,
  VariableTag,
  TemplateActions,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  CheckboxLabel,
  ModalActions,
  Button,
  HelpText,
} from '../styles/pages/MCMVTemplatesPageStyles';

const getTypeLabel = (type: TemplateType): string => {
  const labels: Record<TemplateType, string> = {
    email: 'Email',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
  };
  return labels[type];
};

export default function MCMVTemplatesPage() {
  const [templates, setTemplates] = useState<MCMVTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MCMVTemplate | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await mcmvApi.listTemplates();
      setTemplates(response);
    } catch (error: any) {
      console.error('Erro ao carregar templates:', error);
      toast.error(
        error.response?.data?.message || 'Erro ao carregar templates'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Não é possível deletar templates padrão do sistema');
      return;
    }

    if (!window.confirm('Tem certeza que deseja deletar este template?')) {
      return;
    }

    try {
      await mcmvApi.deleteTemplate(id);
      toast.success('Template deletado com sucesso!');
      fetchTemplates();
    } catch (error: any) {
      console.error('Erro ao deletar template:', error);
      toast.error(error.response?.data?.message || 'Erro ao deletar template');
    }
  };

  const handleEdit = (template: MCMVTemplate) => {
    setEditingTemplate(template);
    setShowAddModal(true);
  };

  const handleSave = async (data: {
    name: string;
    content: string;
    type: TemplateType;
    description?: string;
    isActive?: boolean;
  }) => {
    try {
      if (editingTemplate) {
        await mcmvApi.updateTemplate(editingTemplate.id, data);
        toast.success('Template atualizado com sucesso!');
      } else {
        await mcmvApi.createTemplate(data);
        toast.success('Template criado com sucesso!');
      }
      setShowAddModal(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar template');
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Templates MCMV</PageTitle>
          <PermissionButton
            permission='mcmv:template:manage'
            variant='primary'
            onClick={() => {
              setEditingTemplate(null);
              setShowAddModal(true);
            }}
            style={{
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <MdAdd size={20} />
            {!isMobile && <span>Criar Template</span>}
          </PermissionButton>
        </PageHeader>

        {loading ? (
          <MCMVTemplatesShimmer />
        ) : templates.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyTitle>Nenhum template encontrado</EmptyTitle>
            <EmptyText>Crie seu primeiro template para começar</EmptyText>
          </EmptyState>
        ) : (
          <TemplatesGrid>
            {templates.map(template => {
              const isDefault = !template.companyId;
              return (
                <TemplateCard key={template.id}>
                  <TemplateHeader>
                    <TemplateName>{template.name}</TemplateName>
                    <TypeBadge $type={template.type}>
                      {getTypeLabel(template.type)}
                    </TypeBadge>
                  </TemplateHeader>
                  {template.description && (
                    <TemplateDescription>
                      {template.description}
                    </TemplateDescription>
                  )}
                  <TemplateContent>{template.content}</TemplateContent>
                  {template.variables.length > 0 && (
                    <VariablesList>
                      {template.variables.map(variable => (
                        <VariableTag
                          key={variable}
                        >{`{{${variable}}}`}</VariableTag>
                      ))}
                    </VariablesList>
                  )}
                  <TemplateActions>
                    <PermissionButton
                      permission='mcmv:template:manage'
                      variant='secondary'
                      onClick={() => handleEdit(template)}
                    >
                      <MdEdit size={16} />
                      Editar
                    </PermissionButton>
                    {!isDefault && (
                      <PermissionButton
                        permission='mcmv:template:manage'
                        variant='danger'
                        onClick={() => handleDelete(template.id, isDefault)}
                      >
                        <MdDelete size={16} />
                        Deletar
                      </PermissionButton>
                    )}
                  </TemplateActions>
                </TemplateCard>
              );
            })}
          </TemplatesGrid>
        )}

        {showAddModal && (
          <TemplateModal
            template={editingTemplate}
            onClose={() => {
              setShowAddModal(false);
              setEditingTemplate(null);
            }}
            onSave={handleSave}
          />
        )}
      </PageContainer>
    </Layout>
  );
}

// Modal para criar/editar template
const TemplateModal: React.FC<{
  template: MCMVTemplate | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    content: string;
    type: TemplateType;
    description?: string;
    isActive?: boolean;
  }) => void;
}> = ({ template, onClose, onSave }) => {
  const [name, setName] = useState(template?.name || '');
  const [content, setContent] = useState(template?.content || '');
  const [type, setType] = useState<TemplateType>(template?.type || 'email');
  const [description, setDescription] = useState(template?.description || '');
  const [isActive, setIsActive] = useState(
    template?.isActive !== undefined ? template.isActive : true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) {
      toast.error('Nome e conteúdo são obrigatórios');
      return;
    }
    onSave({ name, content, type, description, isActive });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>
          {template ? 'Editar Template' : 'Criar Template'}
        </ModalTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome *</Label>
            <Input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Ex: Follow-up MCMV'
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Tipo *</Label>
            <Select
              value={type}
              onChange={e => setType(e.target.value as TemplateType)}
              required
            >
              <option value='email'>Email</option>
              <option value='whatsapp'>WhatsApp</option>
              <option value='sms'>SMS</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Conteúdo *</Label>
            <TextArea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder='Olá {{leadName}}, bem-vindo ao programa MCMV!'
              required
            />
            <HelpText>
              Use variáveis no formato {'{{variavel}}'}. Ex: {'{{leadName}}'},{' '}
              {'{{leadEmail}}'}, {'{{leadPhone}}'}
            </HelpText>
          </FormGroup>
          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Descrição do template...'
              rows={3}
            />
          </FormGroup>
          <FormGroup>
            <CheckboxLabel>
              <input
                type='checkbox'
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
              />
              <span>Template ativo</span>
            </CheckboxLabel>
          </FormGroup>
          <ModalActions>
            <Button type='button' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' $variant='primary'>
              {template ? 'Atualizar' : 'Criar'}
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
