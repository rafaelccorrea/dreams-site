import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import type {
  GoalType,
  GoalPeriod,
  GoalScope,
  CreateGoalDTO,
  Goal,
} from '../../types/goal';
import {
  GOAL_TYPE_LABELS,
  GOAL_PERIOD_LABELS,
  GOAL_SCOPE_LABELS,
  GOAL_COLORS,
  GOAL_ICONS,
} from '../../types/goal';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateGoalDTO) => Promise<void>;
  editingGoal?: Goal | null;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 24px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow:
    0 40px 80px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;

  @keyframes modalSlideIn {
    from {
      transform: translateY(40px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  svg {
    font-size: 24px;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  max-height: calc(90vh - 180px);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$color};
  border: 3px solid
    ${props => (props.$selected ? props.theme.colors.primary : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props =>
    props.$selected
      ? `0 0 0 4px ${props.theme.colors.primary}20`
      : '0 2px 4px rgba(0,0,0,0.1)'};

  &:hover {
    transform: scale(1.1);
  }
`;

const IconPicker = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const IconOption = styled.button<{ $selected: boolean }>`
  width: 44px;
  height: 44px;
  font-size: 24px;
  border-radius: 12px;
  background: ${props =>
    props.$selected
      ? props.theme.colors.primary
      : props.theme.colors.background};
  border: 2px solid
    ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.colors.primary}15;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SwitchLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  flex: 1;
`;

const SwitchToggle = styled.div<{ $checked: boolean; $disabled?: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background: ${props =>
    props.$checked ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => (props.$checked ? '26px' : '2px')};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchDescription = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
  line-height: 1.4;
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.surface};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGoal,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGoalDTO>({
    title: '',
    description: '',
    type: 'sales_value',
    period: 'monthly',
    scope: 'company',
    targetValue: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    color: GOAL_COLORS[0],
    icon: GOAL_ICONS[0],
    isCompanyWide: false,
    notificationSettings: {
      enabled: true,
      notifyAt: [50, 75, 90, 100],
      notifyOnRisk: true,
      notifyOnAchieved: true,
    },
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        description: editingGoal.description || '',
        type: editingGoal.type,
        period: editingGoal.period,
        scope: editingGoal.scope,
        targetValue: editingGoal.targetValue,
        startDate: editingGoal.startDate.split('T')[0],
        endDate: editingGoal.endDate.split('T')[0],
        userId: editingGoal.userId,
        teamId: editingGoal.teamId,
        color: editingGoal.color || GOAL_COLORS[0],
        icon: editingGoal.icon || GOAL_ICONS[0],
        isCompanyWide: editingGoal.isCompanyWide || false,
        notificationSettings: editingGoal.notificationSettings || {
          enabled: true,
          notifyAt: [50, 75, 90, 100],
          notifyOnRisk: true,
          notifyOnAchieved: true,
        },
      });
    }
  }, [editingGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateGoalDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScopeChange = (scope: GoalScope) => {
    setFormData(prev => ({
      ...prev,
      scope,
      // Se não for empresa, desabilitar isCompanyWide
      isCompanyWide: scope === 'company' ? prev.isCompanyWide : false,
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{editingGoal ? 'Editar Meta' : 'Nova Meta'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>Título *</Label>
              <Input
                type='text'
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder='Ex: Meta de Vendas - Dezembro 2025'
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Descrição</Label>
              <TextArea
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder='Descreva o objetivo desta meta...'
              />
            </FormGroup>

            <GridRow>
              <FormGroup>
                <Label>Tipo *</Label>
                <Select
                  value={formData.type}
                  onChange={e =>
                    handleChange('type', e.target.value as GoalType)
                  }
                  required
                >
                  {Object.entries(GOAL_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Período *</Label>
                <Select
                  value={formData.period}
                  onChange={e =>
                    handleChange('period', e.target.value as GoalPeriod)
                  }
                  required
                >
                  {Object.entries(GOAL_PERIOD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </GridRow>

            <FormGroup>
              <Label>Escopo *</Label>
              <Select
                value={formData.scope}
                onChange={e => handleScopeChange(e.target.value as GoalScope)}
                required
              >
                {Object.entries(GOAL_SCOPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Campo isCompanyWide - apenas para metas da empresa */}
            {formData.scope === 'company' && (
              <FormGroup>
                <Label>Visibilidade da Meta</Label>
                <SwitchContainer>
                  <SwitchLabel htmlFor='isCompanyWide'>
                    Meta visível para toda a empresa
                  </SwitchLabel>
                  <SwitchToggle
                    $checked={formData.isCompanyWide || false}
                    $disabled={formData.scope !== 'company'}
                    onClick={() => {
                      if (formData.scope === 'company') {
                        handleChange('isCompanyWide', !formData.isCompanyWide);
                      }
                    }}
                  >
                    <SwitchInput
                      id='isCompanyWide'
                      type='checkbox'
                      checked={formData.isCompanyWide || false}
                      onChange={e =>
                        handleChange('isCompanyWide', e.target.checked)
                      }
                      disabled={formData.scope !== 'company'}
                    />
                  </SwitchToggle>
                </SwitchContainer>
                <SwitchDescription>
                  🌐 Quando ativado, esta meta aparecerá no dashboard de todos
                  os usuários da empresa.
                  <br />
                  💡 Ideal para objetivos globais que todos devem acompanhar.
                </SwitchDescription>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Valor da Meta *</Label>
              <Input
                type='number'
                value={formData.targetValue}
                onChange={e =>
                  handleChange('targetValue', Number(e.target.value))
                }
                placeholder='Ex: 1000000'
                required
                min='0'
                step='0.01'
              />
            </FormGroup>

            <GridRow>
              <FormGroup>
                <Label>Data de Início *</Label>
                <Input
                  type='date'
                  value={formData.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Data de Término *</Label>
                <Input
                  type='date'
                  value={formData.endDate}
                  onChange={e => handleChange('endDate', e.target.value)}
                  required
                />
              </FormGroup>
            </GridRow>

            <FormGroup>
              <Label>Cor</Label>
              <ColorPicker>
                {GOAL_COLORS.map(color => (
                  <ColorOption
                    key={color}
                    type='button'
                    $color={color}
                    $selected={formData.color === color}
                    onClick={() => handleChange('color', color)}
                  />
                ))}
              </ColorPicker>
            </FormGroup>

            <FormGroup>
              <Label>Ícone</Label>
              <IconPicker>
                {GOAL_ICONS.map(icon => (
                  <IconOption
                    key={icon}
                    type='button'
                    $selected={formData.icon === icon}
                    onClick={() => handleChange('icon', icon)}
                  >
                    {icon}
                  </IconOption>
                ))}
              </IconPicker>
            </FormGroup>

            <FormGroup>
              <Label>🔔 Notificações</Label>
              <CheckboxGroup>
                <CheckboxLabel>
                  <Checkbox
                    type='checkbox'
                    checked={formData.notificationSettings?.enabled}
                    onChange={e =>
                      handleChange('notificationSettings', {
                        ...formData.notificationSettings!,
                        enabled: e.target.checked,
                      })
                    }
                  />
                  Ativar notificações
                </CheckboxLabel>
                <CheckboxLabel>
                  <Checkbox
                    type='checkbox'
                    checked={formData.notificationSettings?.notifyOnRisk}
                    onChange={e =>
                      handleChange('notificationSettings', {
                        ...formData.notificationSettings!,
                        notifyOnRisk: e.target.checked,
                      })
                    }
                  />
                  Alertar se meta em risco
                </CheckboxLabel>
                <CheckboxLabel>
                  <Checkbox
                    type='checkbox'
                    checked={formData.notificationSettings?.notifyOnAchieved}
                    onChange={e =>
                      handleChange('notificationSettings', {
                        ...formData.notificationSettings!,
                        notifyOnAchieved: e.target.checked,
                      })
                    }
                  />
                  Alertar ao atingir 100%
                </CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type='button' $variant='secondary' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' $variant='primary' disabled={loading}>
              {loading
                ? 'Salvando...'
                : editingGoal
                  ? 'Salvar Alterações'
                  : 'Criar Meta'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
