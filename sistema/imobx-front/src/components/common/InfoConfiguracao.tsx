import React, { useState, useEffect } from 'react';
import { useCommissionConfig } from '../../hooks/useCommissionConfig';
import {
  MdSettings,
  MdAttachMoney,
  MdClose,
  MdVisibilityOff,
} from 'react-icons/md';
import {
  AlertInfo,
  AlertHeader,
  AlertHeaderLeft,
  CloseButton,
  AlertTitle,
  AlertContent,
  AlertActions,
  HideButton,
  LinkButton,
  ConfigGrid,
  ConfigItem,
  ConfigLabel,
  ConfigValue,
  ShimmerBox,
} from '../../styles/components/InfoConfiguracaoStyles';

const STORAGE_KEY = 'hideCommissionInfo';

export const InfoConfiguracao: React.FC = () => {
  const { config, loading } = useCommissionConfig();
  const [isHidden, setIsHidden] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já ocultou o alerta
    const hiddenState = localStorage.getItem(STORAGE_KEY);
    if (hiddenState === 'true') {
      setIsHidden(true);
    }
  }, []);

  useEffect(() => {
    // Delay para mostrar o conteúdo suavemente
    if (!loading && !isHidden) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, isHidden]);

  const handleHide = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsHidden(true);
  };

  if (isHidden) return null;

  if (loading || !showContent) {
    return <ShimmerBox />;
  }

  if (!config) {
    return (
      <AlertInfo>
        <AlertHeader>
          <AlertHeaderLeft>
            <MdSettings size={20} />
            <AlertTitle>⚠️ Configuração de Comissões</AlertTitle>
          </AlertHeaderLeft>
          <CloseButton onClick={handleHide} title='Ocultar permanentemente'>
            <MdClose size={20} />
          </CloseButton>
        </AlertHeader>
        <AlertContent>
          <strong>Nenhuma configuração encontrada!</strong>
          <br />
          As vendas e aluguéis serão registrados com comissão ZERO até que você
          configure os percentuais.
        </AlertContent>
        <AlertActions>
          <LinkButton to='/commission-config'>
            <MdSettings />
            Configurar Agora
          </LinkButton>
          <HideButton onClick={handleHide}>
            <MdVisibilityOff />
            Não mostrar novamente
          </HideButton>
        </AlertActions>
      </AlertInfo>
    );
  }

  return (
    <AlertInfo>
      <AlertHeader>
        <AlertHeaderLeft>
          <MdAttachMoney size={20} />
          <AlertTitle>📊 Configuração de Comissões Ativa</AlertTitle>
        </AlertHeaderLeft>
        <CloseButton onClick={handleHide} title='Ocultar permanentemente'>
          <MdClose size={20} />
        </CloseButton>
      </AlertHeader>
      <AlertContent>
        <ConfigGrid>
          <ConfigItem>
            <ConfigLabel>Vendas:</ConfigLabel>
            <ConfigValue>
              {config.saleCommissionPercentage}% comissão +{' '}
              {config.companyProfitPercentage}% lucro
            </ConfigValue>
          </ConfigItem>
          <ConfigItem>
            <ConfigLabel>Aluguéis:</ConfigLabel>
            <ConfigValue>
              {config.rentalCommissionPercentage}% comissão +{' '}
              {config.companyRentalProfitPercentage}% lucro
            </ConfigValue>
          </ConfigItem>
        </ConfigGrid>
      </AlertContent>
      <AlertActions>
        <LinkButton to='/commission-config'>
          <MdSettings />
          Ajustar Configurações
        </LinkButton>
        <HideButton onClick={handleHide}>
          <MdVisibilityOff />
          Não mostrar novamente
        </HideButton>
      </AlertActions>
    </AlertInfo>
  );
};
