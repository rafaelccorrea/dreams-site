import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { UserPreferencesModal } from '../components/modals/UserPreferencesModal';
import { toast } from 'react-toastify';
import { settingsApi } from '../services/settingsApi';
import { DevicesManagerModal } from '../components/modals/DevicesManagerModal';
import { StorageInfoCard } from '../components/storage';
import {
  SettingsContainer,
  SettingsContent,
  SettingsHeader,
  SettingsTitle,
  SettingsSubtitle,
  SettingsGrid,
  SettingsSection,
  SectionHeader,
  SectionHeaderContent,
  SectionIcon,
  SectionInfo,
  SectionTitle,
  SectionDescription,
  SectionItems,
  SettingItem,
  SettingInfo,
  SettingIcon,
  SettingContent,
  SettingName,
  SettingDescription,
  SettingControl,
  ToggleSwitch,
  ToggleInput,
  ToggleSlider,
  StatusBadge,
  ActionButton,
  StatsSection,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  QuickActionsSection,
  QuickActionsGrid,
  QuickActionCard,
  QuickActionIcon,
  QuickActionTitle,
  QuickActionDescription,
} from '../styles/pages/SettingsPageStyles';
import {
  MdPalette,
  MdStorage,
  MdDownload,
  MdUpload,
  MdDelete,
  MdDarkMode,
  MdLightMode,
  MdSystemUpdate,
  MdSecurity,
  MdBackup,
  MdRestore,
  MdLanguage,
  MdSync,
  MdCloud,
  MdDevices,
  MdPrivacyTip,
  MdAnalytics,
  MdHelp,
  MdInfo,
} from 'react-icons/md';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  useAuth(); // manter hook para consistência, sem necessidade de destructuring aqui

  // Estados para configurações
  const [autoBackup, setAutoBackup] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  // Acessibilidade removida
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  // Admin: 2FA por empresa removido deste contexto (gerenciado fora do Settings)

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Estatísticas dinâmicas (substitui mocks)
  const stats = useMemo(() => {
    const settingsList = [autoBackup, analytics, theme === 'dark'];
    const activeCount = settingsList.filter(Boolean).length;
    const connectedDevices = 1; // placeholder seguro; pode ser integrado com backend futuramente
    // Estimar tamanho de dados no localStorage
    let bytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) as string;
        const val = localStorage.getItem(key) || '';
        bytes += key.length + val.length;
      }
    } catch {
      /* noop */
    }
    const mb = (bytes / (1024 * 1024)).toFixed(1) + 'MB';
    return { activeCount, syncedData: mb, connectedDevices };
  }, [autoBackup, analytics, theme]);

  // Carregar analytics do backend
  useEffect(() => {
    const load = async () => {
      try {
        const anal = await settingsApi.getAnalytics().catch(() => null);
        if (anal) {
          setAnalytics(!!anal.enabled);
        }
      } catch (e: any) {
        toast.warning(e?.message || 'Não foi possível carregar configurações.');
      }
    };
    load();
  }, []);

  const persistAnalytics = async (enabled: boolean) => {
    try {
      await settingsApi.updateAnalytics(enabled);
      toast.success('Configuração de analytics salva.');
    } catch (e: any) {
      toast.error(e?.message || 'Falha ao salvar analytics.');
      try {
        const remote = await settingsApi.getAnalytics();
        setAnalytics(!!remote.enabled);
      } catch {
        /* noop */
      }
    }
  };

  const handleExportData = () => {
    settingsApi
      .exportSettings()
      .then(data => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `settings-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Configurações exportadas.');
      })
      .catch(() => toast.error('Falha ao exportar configurações.'));
  };

  const handleImportData = () => {
    importInputRef.current?.click();
  };

  const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || '{}'));
        settingsApi
          .importSettings(payload)
          .then(() => {
            toast.success('Configurações importadas.');
          })
          .catch(() => toast.error('Falha ao importar configurações.'));
      } catch {
        toast.error('Arquivo inválido.');
      } finally {
        if (importInputRef.current) importInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    try {
      const preserveKeys = new Set<string>([
        // chaves que não devem ser apagadas (ex.: auth)
        'auth_token',
        'user_info',
      ]);
      const toDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) as string;
        if (!preserveKeys.has(k)) toDelete.push(k);
      }
      toDelete.forEach(k => localStorage.removeItem(k));
      toast.success('Cache limpo com sucesso.');
    } catch {
      toast.error('Falha ao limpar cache.');
    }
  };

  const handleBackup = () => {
    settingsApi
      .createBackup('backup-manual')
      .then(() => toast.success('Backup solicitado com sucesso.'))
      .catch(() => toast.error('Falha ao solicitar backup.'));
  };

  const handleRestore = () => {
    // Por ora, restaura o último backup disponível
    settingsApi
      .listBackups()
      .then(list => {
        if (!list || list.length === 0) {
          toast.warning('Nenhum backup encontrado.');
          return;
        }
        const last = list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        return settingsApi
          .restoreBackup(last.backupId)
          .then(() => toast.success('Restauração iniciada.'))
          .catch(() => toast.error('Falha ao iniciar restauração.'));
      })
      .catch(() => toast.error('Falha ao listar backups.'));
  };

  const handleSync = () => {
    settingsApi
      .triggerSync()
      .then(() => toast.success('Sincronização iniciada.'))
      .catch(() => toast.error('Falha ao iniciar sincronização.'));
  };

  return (
    <Layout>
      <SettingsContainer>
        <SettingsContent>
          <SettingsHeader>
            <SettingsTitle>Configurações</SettingsTitle>
            <SettingsSubtitle>
              Personalize sua experiência e gerencie as configurações do sistema
            </SettingsSubtitle>
          </SettingsHeader>

          {/* Estatísticas Rápidas */}
          <StatsSection>
            <StatsGrid>
              <StatCard $type='total'>
                <StatValue $type='total'>{stats.activeCount}</StatValue>
                <StatLabel>Configurações Ativas</StatLabel>
              </StatCard>
              <StatCard $type='success'>
                <StatValue $type='success'>{stats.syncedData}</StatValue>
                <StatLabel>Dados Sincronizados</StatLabel>
              </StatCard>
              <StatCard $type='warning'>
                <StatValue $type='warning'>{stats.connectedDevices}</StatValue>
                <StatLabel>Dispositivos Conectados</StatLabel>
              </StatCard>
            </StatsGrid>
          </StatsSection>

          {/* Ações Rápidas */}
          <QuickActionsSection>
            <QuickActionsGrid>
              <QuickActionCard onClick={handleBackup}>
                <QuickActionIcon $color='#10b981'>
                  <MdBackup />
                </QuickActionIcon>
                <QuickActionTitle>Backup</QuickActionTitle>
                <QuickActionDescription>
                  Criar backup completo dos dados
                </QuickActionDescription>
              </QuickActionCard>

              <QuickActionCard onClick={handleSync}>
                <QuickActionIcon $color='#3b82f6'>
                  <MdSync />
                </QuickActionIcon>
                <QuickActionTitle>Sincronizar</QuickActionTitle>
                <QuickActionDescription>
                  Sincronizar dados entre dispositivos
                </QuickActionDescription>
              </QuickActionCard>

              <QuickActionCard onClick={handleClearCache}>
                <QuickActionIcon $color='#f59e0b'>
                  <MdDelete />
                </QuickActionIcon>
                <QuickActionTitle>Limpar Cache</QuickActionTitle>
                <QuickActionDescription>
                  Remover dados temporários
                </QuickActionDescription>
              </QuickActionCard>

              <QuickActionCard onClick={handleRestore}>
                <QuickActionIcon $color='#ef4444'>
                  <MdRestore />
                </QuickActionIcon>
                <QuickActionTitle>Restaurar</QuickActionTitle>
                <QuickActionDescription>
                  Restaurar dados de backup
                </QuickActionDescription>
              </QuickActionCard>
            </QuickActionsGrid>
          </QuickActionsSection>

          <SettingsGrid>
            {/* Seção de Aparência */}
            <SettingsSection>
              <SectionHeader>
                <SectionHeaderContent>
                  <SectionIcon $color='#8b5cf6'>
                    <MdPalette />
                  </SectionIcon>
                  <SectionInfo>
                    <SectionTitle>Aparência</SectionTitle>
                    <SectionDescription>
                      Personalize a aparência do sistema conforme sua
                      preferência
                    </SectionDescription>
                  </SectionInfo>
                </SectionHeaderContent>
              </SectionHeader>

              <SectionItems>
                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#8b5cf6'>
                      {theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Tema</SettingName>
                      <SettingDescription>
                        Escolha entre tema claro ou escuro
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ToggleSwitch $isOn={theme === 'dark'}>
                      <ToggleInput
                        type='checkbox'
                        checked={theme === 'dark'}
                        onChange={handleThemeToggle}
                      />
                      <ToggleSlider $isOn={theme === 'dark'} />
                    </ToggleSwitch>
                    <StatusBadge
                      $status={theme === 'dark' ? 'active' : 'inactive'}
                    >
                      {theme === 'dark' ? 'Escuro' : 'Claro'}
                    </StatusBadge>
                  </SettingControl>
                </SettingItem>

                {/* Preferências Pessoais removido conforme diretriz */}

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#06b6d4'>
                      <MdLanguage />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Idioma</SettingName>
                      <SettingDescription>
                        Selecione o idioma da interface
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <StatusBadge $status='active'>Português (BR)</StatusBadge>
                  </SettingControl>
                </SettingItem>

                {/* Acessibilidade removida conforme diretriz */}
              </SectionItems>
            </SettingsSection>

            {/* Seção de Dados */}
            <SettingsSection>
              <SectionHeader>
                <SectionHeaderContent>
                  <SectionIcon $color='#f59e0b'>
                    <MdStorage />
                  </SectionIcon>
                  <SectionInfo>
                    <SectionTitle>Dados e Armazenamento</SectionTitle>
                    <SectionDescription>
                      Gerencie seus dados, backups e sincronização
                    </SectionDescription>
                  </SectionInfo>
                </SectionHeaderContent>
              </SectionHeader>

              <SectionItems>
                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#10b981'>
                      <MdBackup />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Backup Automático</SettingName>
                      <SettingDescription>
                        Criar backups automáticos dos dados
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ToggleSwitch $isOn={autoBackup}>
                      <ToggleInput
                        type='checkbox'
                        checked={autoBackup}
                        onChange={() => setAutoBackup(!autoBackup)}
                      />
                      <ToggleSlider $isOn={autoBackup} />
                    </ToggleSwitch>
                    <StatusBadge $status={autoBackup ? 'active' : 'inactive'}>
                      {autoBackup ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </SettingControl>
                </SettingItem>

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#3b82f6'>
                      <MdCloud />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Sincronização em Nuvem</SettingName>
                      <SettingDescription>
                        Sincronizar dados entre dispositivos
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <StatusBadge $status='active'>Ativo</StatusBadge>
                  </SettingControl>
                </SettingItem>

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#8b5cf6'>
                      <MdAnalytics />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Analytics</SettingName>
                      <SettingDescription>
                        Compartilhar dados de uso para melhorias
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ToggleSwitch $isOn={analytics}>
                      <ToggleInput
                        type='checkbox'
                        checked={analytics}
                        onChange={async () => {
                          const next = !analytics;
                          setAnalytics(next);
                          await persistAnalytics(next);
                        }}
                      />
                      <ToggleSlider $isOn={analytics} />
                    </ToggleSwitch>
                    <StatusBadge $status={analytics ? 'active' : 'inactive'}>
                      {analytics ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </SettingControl>
                </SettingItem>

                {/* Informações de Armazenamento */}
                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#f59e0b'>
                      <MdStorage />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Uso de Armazenamento</SettingName>
                      <SettingDescription>
                        Visualize o uso de armazenamento de todas as suas
                        empresas
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                      <StorageInfoCard compact />
                    </div>
                  </SettingControl>
                </SettingItem>
              </SectionItems>
            </SettingsSection>

            {/* Seção de Segurança */}
            <SettingsSection>
              <SectionHeader>
                <SectionHeaderContent>
                  <SectionIcon $color='#ef4444'>
                    <MdSecurity />
                  </SectionIcon>
                  <SectionInfo>
                    <SectionTitle>Segurança e Privacidade</SectionTitle>
                    <SectionDescription>
                      Configure as opções de segurança e privacidade
                    </SectionDescription>
                  </SectionInfo>
                </SectionHeaderContent>
              </SectionHeader>

              <SectionItems>
                {/* Seção 2FA removida do Settings - gestão passa a ser feita pelo Admin e durante o login */}

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#8b5cf6'>
                      <MdPrivacyTip />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Política de Privacidade</SettingName>
                      <SettingDescription>
                        Visualizar política de privacidade
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ActionButton
                      $variant='secondary'
                      onClick={() => {
                        window.open('/privacy-policy', '_blank');
                      }}
                    >
                      Visualizar
                    </ActionButton>
                  </SettingControl>
                </SettingItem>

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#06b6d4'>
                      <MdDevices />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Dispositivos Conectados</SettingName>
                      <SettingDescription>
                        Gerenciar dispositivos autorizados
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ActionButton
                      $variant='secondary'
                      onClick={() => setShowDevicesModal(true)}
                    >
                      Gerenciar
                    </ActionButton>
                  </SettingControl>
                </SettingItem>
              </SectionItems>
            </SettingsSection>

            {/* Seção de Sistema */}
            <SettingsSection>
              <SectionHeader>
                <SectionHeaderContent>
                  <SectionIcon $color='#06b6d4'>
                    <MdSystemUpdate />
                  </SectionIcon>
                  <SectionInfo>
                    <SectionTitle>Sistema</SectionTitle>
                    <SectionDescription>
                      Configurações avançadas do sistema
                    </SectionDescription>
                  </SectionInfo>
                </SectionHeaderContent>
              </SectionHeader>

              <SectionItems>
                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#10b981'>
                      <MdDownload />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Exportar Dados</SettingName>
                      <SettingDescription>
                        Baixar todos os seus dados
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ActionButton $variant='primary' onClick={handleExportData}>
                      <MdDownload />
                      Exportar
                    </ActionButton>
                  </SettingControl>
                </SettingItem>

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#3b82f6'>
                      <MdUpload />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Importar Dados</SettingName>
                      <SettingDescription>
                        Importar dados de backup
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ActionButton
                      $variant='secondary'
                      onClick={handleImportData}
                    >
                      <MdUpload />
                      Importar
                    </ActionButton>
                  </SettingControl>
                </SettingItem>

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#f59e0b'>
                      <MdDelete />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Limpar Cache</SettingName>
                      <SettingDescription>
                        Remover dados temporários
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ActionButton $variant='danger' onClick={handleClearCache}>
                      <MdDelete />
                      Limpar
                    </ActionButton>
                  </SettingControl>
                </SettingItem>
              </SectionItems>
            </SettingsSection>

            {/* Seção de Ajuda */}
            <SettingsSection>
              <SectionHeader>
                <SectionHeaderContent>
                  <SectionIcon $color='#8b5cf6'>
                    <MdHelp />
                  </SectionIcon>
                  <SectionInfo>
                    <SectionTitle>Ajuda e Suporte</SectionTitle>
                    <SectionDescription>
                      Recursos de ajuda e informações do sistema
                    </SectionDescription>
                  </SectionInfo>
                </SectionHeaderContent>
              </SectionHeader>

              <SectionItems>
                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#3b82f6'>
                      <MdHelp />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Central de Ajuda</SettingName>
                      <SettingDescription>
                        Entre em contato conosco para suporte
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <ActionButton
                      $variant='secondary'
                      onClick={() => {
                        window.location.href =
                          'mailto:contato@dreamkeys.com.br?subject=Suporte - Sistema Imobiliário';
                      }}
                    >
                      Acessar
                    </ActionButton>
                  </SettingControl>
                </SettingItem>

                <SettingItem>
                  <SettingInfo>
                    <SettingIcon $color='#10b981'>
                      <MdInfo />
                    </SettingIcon>
                    <SettingContent>
                      <SettingName>Sobre o Sistema</SettingName>
                      <SettingDescription>
                        Informações da versão e licença
                      </SettingDescription>
                    </SettingContent>
                  </SettingInfo>
                  <SettingControl>
                    <StatusBadge $status='active'>v2.1.0</StatusBadge>
                  </SettingControl>
                </SettingItem>
              </SectionItems>
            </SettingsSection>
          </SettingsGrid>
          {/* Input oculto para importação */}
          <input
            ref={importInputRef}
            type='file'
            accept='application/json'
            onChange={onImportFileChange}
            style={{ display: 'none' }}
          />
        </SettingsContent>
      </SettingsContainer>

      {/* Modal de Preferências do Usuário */}
      <UserPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />

      {/* Modal de Dispositivos */}
      <DevicesManagerModal
        isOpen={showDevicesModal}
        onClose={() => setShowDevicesModal(false)}
        onLoadDevices={async () => {
          const list = await settingsApi.listDevices();
          return list;
        }}
        onRevoke={async (deviceId: string) => {
          await settingsApi.revokeDevice(deviceId);
          toast.success('Dispositivo revogado.');
        }}
      />
    </Layout>
  );
};

export default SettingsPage;
