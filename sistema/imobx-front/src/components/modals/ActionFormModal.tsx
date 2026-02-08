import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button, Select, Input, ConfigProvider, theme } from 'antd';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/ThemeContext';
import { useKanbanValidations } from '../../hooks/useKanbanValidations';
import { ValidationModalShimmer } from '../kanban/ValidationModalShimmer';
import { FieldMappingEditor } from '../kanban/FieldMappingEditor';
import type {
  ColumnAction,
  CreateActionDto,
  ActionTrigger,
  ActionType,
} from '../../types/kanbanValidations';
import {
  ACTION_TYPE_OPTIONS_IMPLEMENTED,
  getTriggerOptionsForActionType,
  getDefaultTriggerForActionType,
} from '../../types/kanbanValidations';

interface ActionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  action?: ColumnAction | null;
  onSuccess: () => void;
  columns?: Array<{ id: string; title: string; position: number }>; // Colunas disponíveis para fromColumnId
  currentColumnTitle?: string; // Título da coluna atual para exibição
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10002;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5);
  border: 2px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10003;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;

  .ant-btn {
    height: 40px;
    padding: 0 24px;
    font-weight: 600;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column-reverse;

    .ant-btn {
      width: 100%;
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .ant-select,
  .ant-input,
  .ant-input-number {
    border-radius: 10px;
    border: 2px solid ${props => props.theme.colors.border};
    transition: all 0.2s ease;

    &:hover {
      border-color: ${props => props.theme.colors.primary}60;
    }

    &:focus,
    &.ant-select-focused {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    }
  }

  .ant-select-selector {
    border-radius: 10px !important;
    border: 2px solid ${props => props.theme.colors.border} !important;
    padding: 4px 12px !important;
    min-height: 40px !important;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
`;

const HelpText = styled.small`
  display: block;
  font-weight: normal;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
`;

const InfoBox = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.infoBackground};
  border: 1px solid ${props => props.theme.colors.infoBorder};
  border-radius: 12px;
  color: ${props => props.theme.colors.infoText};
  font-size: 13px;
  line-height: 1.6;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

export const ActionFormModal: React.FC<ActionFormModalProps> = ({
  isOpen,
  onClose,
  columnId,
  action,
  onSuccess,
  columns = [],
  currentColumnTitle = '',
}) => {
  const { theme: currentTheme } = useTheme();
  const { createAction, updateAction, loading, actions } =
    useKanbanValidations(columnId);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateActionDto>({
    trigger: 'on_enter',
    type: 'create_property',
    config: {},
    order: 0,
    fromColumnId: undefined,
    requireAdjacentPosition: false,
  });

  useEffect(() => {
    if (action) {
      const allowedTriggers = getTriggerOptionsForActionType(action.type).map(
        o => o.value
      );
      const trigger = allowedTriggers.includes(action.trigger)
        ? action.trigger
        : getDefaultTriggerForActionType(action.type);
      setFormData({
        trigger,
        type: action.type,
        config: action.config,
        conditions: action.conditions,
        order: action.order,
        intervalHours: action.intervalHours,
        maxExecutions: action.maxExecutions,
        fromColumnId: action.fromColumnId,
        requireAdjacentPosition: action.requireAdjacentPosition || false,
      });
    } else {
      // ✅ Ao criar nova ação, automaticamente definir como condicional
      // fromColumnId = coluna anterior (posição - 1)
      const currentColumn = columns.find(col => col.id === columnId);
      const previousColumn = currentColumn
        ? columns
            .filter(col => col.id !== columnId)
            .sort((a, b) => a.position - b.position)
            .find(col => col.position === currentColumn.position - 1)
        : undefined;

      // ✅ Se não houver coluna anterior (é a primeira coluna), não definir fromColumnId
      // Mas ainda definir requireAdjacentPosition como true
      setFormData({
        trigger: 'on_enter',
        type: 'create_property',
        config: {},
        order: 0,
        fromColumnId: previousColumn?.id, // ✅ Automaticamente da coluna anterior (se existir)
        requireAdjacentPosition: previousColumn ? true : false, // ✅ true se houver coluna anterior
      });
    }
  }, [action, isOpen, columnId, columns]);

  const antdTheme = {
    token: {
      colorBgContainer: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#374151' : '#e1e5e9',
      colorText: currentTheme === 'dark' ? '#f9fafb' : '#4B5563',
      colorTextSecondary: currentTheme === 'dark' ? '#ffffff' : '#6B7280',
      colorPrimary: currentTheme === 'dark' ? '#60a5fa' : '#1c4eff',
      zIndexPopupBase: 10004,
    },
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : undefined,
  };

  const handleSubmit = async () => {
    // Verificar se já existe uma ação duplicada na mesma coluna
    if (!action) {
      const duplicateAction = actions.find(a => {
        // Verificar se o tipo e trigger são os mesmos
        if (a.type !== formData.type || a.trigger !== formData.trigger)
          return false;

        // Para ações que criam entidades, verificar se o fieldMapping é o mesmo
        if (
          formData.type === 'create_property' ||
          formData.type === 'create_client' ||
          formData.type === 'create_document'
        ) {
          const aMapping = JSON.stringify(a.config?.fieldMapping || {});
          const fMapping = JSON.stringify(formData.config?.fieldMapping || {});
          return aMapping === fMapping;
        }

        // Para ações de email, verificar assunto e mensagem
        if (formData.type === 'send_email') {
          return (
            a.config?.subject === formData.config?.subject &&
            a.config?.message === formData.config?.message
          );
        }

        // Para outras ações, verificar se a configuração é idêntica
        const aConfig = JSON.stringify(a.config || {});
        const fConfig = JSON.stringify(formData.config || {});
        return aConfig === fConfig;
      });

      if (duplicateAction) {
        toast.error(
          'Já existe uma ação idêntica nesta coluna. Não é possível criar ações duplicadas.'
        );
        return;
      }
    }

    setIsSaving(true);
    try {
      if (action) {
        await updateAction(action.id, formData);
      } else {
        await createAction(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      // Erro já é tratado pelo hook
    } finally {
      setIsSaving(false);
    }
  };

  const modalContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const getPopupContainer = () => modalContentRef.current || document.body;

  const modalContent = (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent ref={modalContentRef} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{action ? 'Editar Ação' : 'Nova Ação'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <ValidationModalShimmer />
          ) : (
            <>
              {!action && (
                <InfoBox>
                  <strong>💡 Dica:</strong> Configure ações automáticas que
                  serão executadas quando tarefas entrarem, saírem ou
                  permanecerem nesta coluna.
                </InfoBox>
              )}

              <FormGroup>
                <Label>
                  Quando Executar
                  <HelpText>
                    Em qual momento esta ação deve ser executada?
                  </HelpText>
                </Label>
                <Select
                  value={formData.trigger}
                  onChange={value =>
                    setFormData({ ...formData, trigger: value })
                  }
                  getPopupContainer={getPopupContainer}
                  options={getTriggerOptionsForActionType(formData.type)}
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  O que esta ação deve fazer?
                  <HelpText>
                    Selecione a operação que será executada automaticamente
                  </HelpText>
                </Label>
                <Select
                  value={formData.type}
                  onChange={value => {
                    const allowedTriggers = getTriggerOptionsForActionType(
                      value
                    ).map(o => o.value);
                    const trigger = allowedTriggers.includes(formData.trigger)
                      ? formData.trigger
                      : getDefaultTriggerForActionType(value);
                    setFormData({
                      ...formData,
                      type: value,
                      config: {},
                      trigger,
                    });
                  }}
                  getPopupContainer={getPopupContainer}
                  options={ACTION_TYPE_OPTIONS_IMPLEMENTED}
                />
              </FormGroup>

              {(formData.type === 'create_property' ||
                formData.type === 'create_client' ||
                formData.type === 'create_document') && (
                <FormGroup>
                  <FieldMappingEditor
                    value={formData.config?.fieldMapping}
                    onChange={fieldMapping =>
                      setFormData({
                        ...formData,
                        config: { ...formData.config, fieldMapping },
                      })
                    }
                    targetEntityType={
                      formData.type === 'create_property'
                        ? 'property'
                        : formData.type === 'create_client'
                          ? 'client'
                          : 'document'
                    }
                  />
                </FormGroup>
              )}

              {formData.type === 'send_email' && (
                <>
                  <FormGroup>
                    <Label>
                      Assunto do Email
                      <HelpText>
                        Use variáveis como {'{{taskTitle}}'} para personalizar
                      </HelpText>
                    </Label>
                    <Input
                      value={formData.config?.subject || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            subject: e.target.value,
                          },
                        })
                      }
                      placeholder='Ex: Proposta enviada - {{taskTitle}}'
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      Mensagem do Email
                      <HelpText>
                        Variáveis disponíveis: {'{{taskTitle}}'},{' '}
                        {'{{taskDescription}}'}, {'{{clientName}}'},{' '}
                        {'{{propertyAddress}}'}
                      </HelpText>
                    </Label>
                    <Input.TextArea
                      value={formData.config?.message || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          config: {
                            ...formData.config,
                            message: e.target.value,
                          },
                        })
                      }
                      placeholder='Ex: Olá {{clientName}}, sua proposta {{taskTitle}} foi enviada com sucesso!'
                      rows={4}
                    />
                  </FormGroup>
                </>
              )}

              {formData.trigger === 'on_stay' && (
                <>
                  <FormGroup>
                    <Label>
                      Intervalo de Execução
                      <HelpText>
                        Com que frequência esta ação deve ser executada? (em
                        horas)
                      </HelpText>
                    </Label>
                    <Input
                      type='number'
                      value={formData.intervalHours || 24}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          intervalHours: parseInt(e.target.value) || 24,
                        })
                      }
                      min={1}
                      placeholder='Ex: 24 (a cada 24 horas)'
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      Máximo de Execuções
                      <HelpText>
                        Quantas vezes esta ação pode ser executada? (0 =
                        ilimitado)
                      </HelpText>
                    </Label>
                    <Input
                      type='number'
                      value={formData.maxExecutions || 10}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          maxExecutions: parseInt(e.target.value) || 10,
                        })
                      }
                      min={0}
                      placeholder='Ex: 10'
                    />
                  </FormGroup>
                </>
              )}

              {/* ✅ Ação Condicional - Automática e não editável */}
              {(formData.trigger === 'on_enter' ||
                formData.trigger === 'on_exit') &&
                formData.fromColumnId && (
                  <InfoBox>
                    <strong>ℹ️ Ação Condicional:</strong>
                    <br />
                    <br />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '16px',
                        fontWeight: 600,
                        marginTop: '8px',
                      }}
                    >
                      <span
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(28, 78, 255, 0.1)',
                          borderRadius: '8px',
                          border: '2px solid rgba(28, 78, 255, 0.3)',
                        }}
                      >
                        {columns.find(c => c.id === formData.fromColumnId)
                          ?.title || 'Coluna Anterior'}
                      </span>
                      <span
                        style={{
                          fontSize: '20px',
                          color: 'rgba(28, 78, 255, 0.8)',
                        }}
                      >
                        ⇒
                      </span>
                      <span
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(28, 78, 255, 0.1)',
                          borderRadius: '8px',
                          border: '2px solid rgba(28, 78, 255, 0.3)',
                        }}
                      >
                        {currentColumnTitle || 'Coluna Atual'}
                      </span>
                    </div>
                    <br />
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginTop: '8px',
                      }}
                    >
                      Esta ação será executada quando um card for movido da
                      coluna de origem para a coluna de destino
                      {formData.trigger === 'on_enter'
                        ? ' (ao entrar na coluna de destino)'
                        : ' (ao sair da coluna de origem)'}
                      .
                      <br />
                      <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        Esta configuração é automática e não pode ser editada.
                      </strong>
                    </div>
                  </InfoBox>
                )}
            </>
          )}
        </ModalBody>

        {!loading && (
          <ModalFooter>
            <Button onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              type='primary'
              onClick={handleSubmit}
              disabled={isSaving}
              loading={isSaving}
            >
              {action ? 'Salvar' : 'Criar'}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <ConfigProvider theme={antdTheme}>
      {createPortal(modalContent, document.body)}
    </ConfigProvider>
  );
};
