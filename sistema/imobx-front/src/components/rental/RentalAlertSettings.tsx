import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdNotifications,
  MdEdit,
  MdSave,
  MdClose,
  MdEmail,
  MdPhone,
  MdChat,
  MdNotificationsActive,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import type {
  RentalAlertSettings as AlertSettings,
  RentalAlertType,
  NotificationChannel,
  UpdateRentalAlertSettingsRequest,
} from '@/types/rental-alert.types';
import {
  RentalAlertTypeLabels,
  NotificationChannelLabels,
} from '@/types/rental-alert.types';

export const RentalAlertSettings: React.FC = () => {
  const [settings, setSettings] = useState<AlertSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateRentalAlertSettingsRequest>(
    {}
  );

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get<AlertSettings[]>(
        '/rental/alerts/settings'
      );
      setSettings(response.data);
    } catch (error: any) {
      toast.error('Erro ao carregar configurações de alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting: AlertSettings) => {
    setEditingId(setting.id);
    setEditForm({
      isActive: setting.isActive,
      daysBeforeAlert: setting.daysBeforeAlert,
      channels: setting.channels,
      customMessage: setting.customMessage,
      sendToTenant: setting.sendToTenant,
      sendToAdmin: setting.sendToAdmin,
      additionalRecipients: setting.additionalRecipients,
    });
  };

  const handleSave = async (id: string) => {
    try {
      await api.put(`/rental/alerts/settings/${id}`, editForm);
      toast.success('Configuração atualizada com sucesso!');
      setEditingId(null);
      loadSettings();
    } catch (error: any) {
      toast.error('Erro ao atualizar configuração');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleChannel = (channel: NotificationChannel) => {
    const currentChannels = editForm.channels || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];
    setEditForm({ ...editForm, channels: newChannels });
  };

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case 'email':
        return <MdEmail />;
      case 'sms':
        return <MdPhone />;
      case 'whatsapp':
        return <MdChat />;
      case 'in_app':
        return <MdNotificationsActive />;
      default:
        return <MdNotifications />;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>Carregando configurações...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <MdNotifications />
          Configurações de Alertas
        </Title>
        <Subtitle>
          Configure alertas automáticos para eventos importantes de aluguéis
        </Subtitle>
      </Header>

      <SettingsGrid>
        {settings.map(setting => (
          <SettingCard key={setting.id} $isActive={setting.isActive}>
            <CardHeader>
              <CardTitle>{RentalAlertTypeLabels[setting.alertType]}</CardTitle>
              <CardActions>
                {editingId === setting.id ? (
                  <>
                    <SaveButton onClick={() => handleSave(setting.id)}>
                      <MdSave /> Salvar
                    </SaveButton>
                    <CancelButton onClick={handleCancel}>
                      <MdClose /> Cancelar
                    </CancelButton>
                  </>
                ) : (
                  <EditButton onClick={() => handleEdit(setting)}>
                    <MdEdit /> Editar
                  </EditButton>
                )}
              </CardActions>
            </CardHeader>

            <CardBody>
              {editingId === setting.id ? (
                <>
                  <FormGroup>
                    <Label>
                      <Checkbox
                        type='checkbox'
                        checked={editForm.isActive}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      Alerta Ativo
                    </Label>
                  </FormGroup>

                  <FormGroup>
                    <Label>Dias antes do evento</Label>
                    <Input
                      type='number'
                      min='0'
                      value={editForm.daysBeforeAlert}
                      onChange={e =>
                        setEditForm({
                          ...editForm,
                          daysBeforeAlert: parseInt(e.target.value),
                        })
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Canais de Notificação</Label>
                    <ChannelsGrid>
                      {Object.values(NotificationChannelLabels).map(
                        (label, index) => {
                          const channel = Object.keys(
                            NotificationChannelLabels
                          )[index] as NotificationChannel;
                          return (
                            <ChannelButton
                              key={channel}
                              type='button'
                              $active={editForm.channels?.includes(channel)}
                              onClick={() => toggleChannel(channel)}
                            >
                              {getChannelIcon(channel)}
                              {label}
                            </ChannelButton>
                          );
                        }
                      )}
                    </ChannelsGrid>
                  </FormGroup>

                  <FormGroup>
                    <Label>Mensagem Personalizada (opcional)</Label>
                    <TextArea
                      rows={3}
                      value={editForm.customMessage || ''}
                      onChange={e =>
                        setEditForm({
                          ...editForm,
                          customMessage: e.target.value,
                        })
                      }
                      placeholder='Digite uma mensagem personalizada...'
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Checkbox
                        type='checkbox'
                        checked={editForm.sendToTenant}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            sendToTenant: e.target.checked,
                          })
                        }
                      />
                      Enviar para inquilino
                    </Label>
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Checkbox
                        type='checkbox'
                        checked={editForm.sendToAdmin}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            sendToAdmin: e.target.checked,
                          })
                        }
                      />
                      Enviar para administrador
                    </Label>
                  </FormGroup>
                </>
              ) : (
                <>
                  <Info>
                    <InfoLabel>Status:</InfoLabel>
                    <StatusBadge $isActive={setting.isActive}>
                      {setting.isActive ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </Info>

                  <Info>
                    <InfoLabel>Dias antes:</InfoLabel>
                    <InfoValue>{setting.daysBeforeAlert} dias</InfoValue>
                  </Info>

                  <Info>
                    <InfoLabel>Canais:</InfoLabel>
                    <ChannelsList>
                      {setting.channels.map(channel => (
                        <ChannelTag key={channel}>
                          {getChannelIcon(channel)}
                          {NotificationChannelLabels[channel]}
                        </ChannelTag>
                      ))}
                    </ChannelsList>
                  </Info>

                  {setting.customMessage && (
                    <Info>
                      <InfoLabel>Mensagem:</InfoLabel>
                      <InfoValue>{setting.customMessage}</InfoValue>
                    </Info>
                  )}

                  <Info>
                    <InfoLabel>Destinatários:</InfoLabel>
                    <InfoValue>
                      {[
                        setting.sendToTenant && 'Inquilino',
                        setting.sendToAdmin && 'Administrador',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </InfoValue>
                  </Info>
                </>
              )}
            </CardBody>
          </SettingCard>
        ))}
      </SettingsGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const SettingCard = styled.div<{ $isActive: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: ${props =>
    props.$isActive
      ? props.theme.colors.success
      : props.theme.colors.textSecondary}20;
  color: ${props =>
    props.$isActive
      ? props.theme.colors.success
      : props.theme.colors.textSecondary};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ChannelsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ChannelTag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;

  svg {
    font-size: 0.875rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Checkbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const ChannelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const ChannelButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryDark
        : props.theme.colors.hover};
  }

  svg {
    font-size: 1rem;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  padding: 2rem;
`;
