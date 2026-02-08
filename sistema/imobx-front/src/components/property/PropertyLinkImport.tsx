/**
 * Componente para importação de propriedades via link externo
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdLink,
  MdDownload,
  MdClose,
  MdCheckCircle,
  MdError,
  MdWarning,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { propertyImportApi } from '../../services/propertyImportApi';
import type { PropertyImportData } from '../../types/propertyImport';
import {
  detectSiteFromUrl,
  SupportedImportSite,
} from '../../types/propertyImport';
import { enrichPropertyImportData } from '../../utils/propertyUtils';

interface PropertyLinkImportProps {
  onDataImported: (data: PropertyImportData) => void;
  onClose?: () => void;
}

const Container = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: var(--color-card-background) !important;
  color: var(--color-text) !important;
  transition: all 0.2s;
  font-family: inherit;

  /* Forçar cor do texto em todos os estados */
  &,
  &:focus,
  &:hover,
  &:active,
  &:visited {
    color: var(--color-text) !important;
    background: var(--color-card-background) !important;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: var(--color-text-secondary) !important;
    opacity: 0.7;
  }

  /* Garantir que o texto seja sempre visível no autofill */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: var(--color-text) !important;
    -webkit-box-shadow: 0 0 0px 1000px var(--color-card-background) inset !important;
    box-shadow: 0 0 0px 1000px var(--color-card-background) inset !important;
    background: var(--color-card-background) !important;
    color: var(--color-text) !important;
  }

  /* Para inputs do tipo URL especificamente */
  &[type='url'] {
    color: var(--color-text) !important;
  }
`;

const ImportButton = styled.button<{ isLoading?: boolean }>`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: ${props => (props.isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.isLoading ? 0.6 : 1)};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SiteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PreviewTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const PreviewContent = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const PreviewField = styled.div`
  margin-bottom: 8px;
`;

const FieldLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  margin-right: 8px;
`;

const FieldValue = styled.span`
  color: ${props => props.theme.colors.text};
`;

const WarningsList = styled.ul`
  margin-top: 12px;
  padding-left: 20px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.warning};
`;

const WarningItem = styled.li`
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AlertCard = styled.div<{ variant?: 'warning' | 'info' | 'error' }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.875rem;
  background: ${props => {
    if (props.variant === 'error')
      return props.theme.colors.errorBackground || '#fee2e2';
    if (props.variant === 'warning')
      return props.theme.colors.warningBackground || '#fef3c7';
    return props.theme.colors.infoBackground || '#dbeafe';
  }};
  border: 1px solid
    ${props => {
      if (props.variant === 'error')
        return props.theme.colors.errorBorder || '#fecaca';
      if (props.variant === 'warning')
        return props.theme.colors.warningBorder || '#fde68a';
      return props.theme.colors.infoBorder || '#bfdbfe';
    }};
  color: ${props => {
    if (props.variant === 'error')
      return props.theme.colors.errorText || '#991b1b';
    if (props.variant === 'warning')
      return props.theme.colors.warningText || '#92400e';
    return props.theme.colors.infoText || '#1e40af';
  }};
`;

const AlertContent = styled.div`
  flex: 1;
  line-height: 1.5;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const MissingFieldsList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const MissingFieldTag = styled.span`
  padding: 4px 8px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ConfidenceBadge = styled.div<{ confidence: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.confidence >= 80) {
      return props.theme.mode === 'dark'
        ? 'rgba(52, 211, 153, 0.2)'
        : '#d1fae5';
    }
    if (props.confidence >= 50) {
      return props.theme.mode === 'dark'
        ? 'rgba(252, 211, 77, 0.2)'
        : '#fef3c7';
    }
    return props.theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2';
  }};
  color: ${props => {
    if (props.confidence >= 80) {
      return props.theme.mode === 'dark'
        ? props.theme.colors.success
        : '#065f46';
    }
    if (props.confidence >= 50) {
      return props.theme.mode === 'dark'
        ? props.theme.colors.warning
        : '#92400e';
    }
    return props.theme.mode === 'dark' ? props.theme.colors.error : '#991b1b';
  }};
`;

const getFieldDisplayName = (field: string): string => {
  const fieldNames: Record<string, string> = {
    address: 'Endereço',
    state: 'Estado',
    imageUrls: 'Imagens',
    zipCode: 'CEP',
    street: 'Rua',
    number: 'Número',
    complement: 'Complemento',
    neighborhood: 'Bairro',
    city: 'Cidade',
    totalArea: 'Área Total',
    builtArea: 'Área Construída',
    bedrooms: 'Quartos',
    bathrooms: 'Banheiros',
    parkingSpaces: 'Vagas',
    salePrice: 'Preço de Venda',
    rentPrice: 'Preço de Aluguel',
    condominiumFee: 'Taxa de Condomínio',
    iptu: 'IPTU',
    type: 'Tipo',
    description: 'Descrição',
    title: 'Título',
  };
  return fieldNames[field] || field;
};

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4b5563;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const getSiteDisplayName = (site: SupportedImportSite): string => {
  const names: Record<SupportedImportSite, string> = {
    [SupportedImportSite.OLX]: 'OLX / Mercado Livre',
    [SupportedImportSite.ZAP_IMOVEIS]: 'ZAP Imóveis',
    [SupportedImportSite.QUINTO_ANDAR]: 'QuintoAndar',
    [SupportedImportSite.VIVA_REAL]: 'Viva Real',
    [SupportedImportSite.IMOVELWEB]: 'Imovelweb',
    [SupportedImportSite.UNKNOWN]: 'Site desconhecido',
  };
  return names[site];
};

export const PropertyLinkImport: React.FC<PropertyLinkImportProps> = ({
  onDataImported,
  onClose,
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<PropertyImportData | null>(
    null
  );
  const [detectedSite, setDetectedSite] = useState<SupportedImportSite | null>(
    null
  );

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setImportedData(null);

    // Detectar site em tempo real
    if (newUrl.trim()) {
      const site = detectSiteFromUrl(newUrl);
      setDetectedSite(site);
    } else {
      setDetectedSite(null);
    }
  };

  const handleImport = async () => {
    if (!url.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    setIsLoading(true);
    setImportedData(null);

    try {
      const data = await propertyImportApi.importFromLink(url.trim());
      // Enriquecer dados inferindo campos faltantes
      const enrichedData = enrichPropertyImportData(data);
      setImportedData(enrichedData);
      toast.success(
        'Dados coletados com sucesso! Revise e aplique ao formulário.'
      );
    } catch (error: any) {
      console.error('Erro ao importar:', error);
      toast.error(
        error.message || 'Erro ao importar dados do link. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (importedData) {
      onDataImported(importedData);
      toast.success(
        'Dados aplicados ao formulário! Revise e ajuste se necessário.'
      );
      setImportedData(null);
      setUrl('');
    }
  };

  const handleCancel = () => {
    setImportedData(null);
    setUrl('');
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'Não informado';
    if (typeof value === 'number') {
      if (value.toString().includes('.')) {
        return value.toFixed(2);
      }
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Nenhum';
    }
    return String(value);
  };

  return (
    <Container>
      <Header>
        <Title>
          <MdLink size={20} />
          Importar de Link Externo
        </Title>
        {onClose && (
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        )}
      </Header>

      <Description>
        Cole o link de uma propriedade em sites como OLX, ZAP Imóveis,
        QuintoAndar, etc. O sistema coletará automaticamente as informações
        disponíveis.
      </Description>

      <InputContainer>
        <UrlInput
          type='url'
          placeholder='https://exemplo.com.br/imovel/12345'
          value={url}
          onChange={handleUrlChange}
          disabled={isLoading}
        />
        <ImportButton
          onClick={handleImport}
          isLoading={isLoading}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Coletando...
            </>
          ) : (
            <>
              <MdDownload size={18} />
              Importar
            </>
          )}
        </ImportButton>
      </InputContainer>

      {detectedSite && url.trim() && (
        <SiteInfo>
          {detectedSite === SupportedImportSite.UNKNOWN ? (
            <>
              <MdWarning size={16} color='#f59e0b' />
              Site não reconhecido automaticamente
            </>
          ) : (
            <>
              <MdCheckCircle size={16} color='#10b981' />
              Site detectado: {getSiteDisplayName(detectedSite)}
            </>
          )}
        </SiteInfo>
      )}

      {importedData && (
        <PreviewContainer>
          <PreviewHeader>
            <PreviewTitle>
              <MdCheckCircle size={18} color='#10b981' />
              Dados Coletados
              {importedData.confidence !== undefined && (
                <ConfidenceBadge confidence={importedData.confidence}>
                  {importedData.confidence}% de confiança
                </ConfidenceBadge>
              )}
            </PreviewTitle>
          </PreviewHeader>

          {/* Aviso quando site não foi identificado */}
          {importedData.sourceSite === 'unknown' && (
            <AlertCard variant='warning'>
              <MdWarning size={20} />
              <AlertContent>
                <AlertTitle>Site não identificado</AlertTitle>
                <div>
                  O sistema não conseguiu identificar automaticamente o site. Os
                  dados foram coletados usando métodos genéricos e podem estar
                  incompletos. Revise cuidadosamente antes de aplicar.
                </div>
              </AlertContent>
            </AlertCard>
          )}

          {/* Aviso quando não há imagens */}
          {(!importedData.imageUrls || importedData.imageUrls.length === 0) && (
            <AlertCard variant='info'>
              <MdWarning size={20} />
              <AlertContent>
                <AlertTitle>Nenhuma imagem coletada</AlertTitle>
                <div>
                  Não foi possível coletar imagens automaticamente. Você
                  precisará adicionar as imagens manualmente após aplicar os
                  dados ao formulário.
                </div>
              </AlertContent>
            </AlertCard>
          )}

          {/* Campos faltantes */}
          {importedData.missingFields &&
            importedData.missingFields.length > 0 && (
              <AlertCard variant='warning'>
                <MdWarning size={20} />
                <AlertContent>
                  <AlertTitle>Campos não coletados:</AlertTitle>
                  <MissingFieldsList>
                    {importedData.missingFields.map((field, index) => (
                      <MissingFieldTag key={index}>
                        {getFieldDisplayName(field)}
                      </MissingFieldTag>
                    ))}
                  </MissingFieldsList>
                </AlertContent>
              </AlertCard>
            )}

          <PreviewContent>
            {importedData.title && (
              <PreviewField>
                <FieldLabel>Título:</FieldLabel>
                <FieldValue>{importedData.title}</FieldValue>
              </PreviewField>
            )}

            {importedData.description && (
              <PreviewField>
                <FieldLabel>Descrição:</FieldLabel>
                <FieldValue>
                  {importedData.description.length > 100
                    ? `${importedData.description.substring(0, 100)}...`
                    : importedData.description}
                </FieldValue>
              </PreviewField>
            )}

            {importedData.type && (
              <PreviewField>
                <FieldLabel>Tipo:</FieldLabel>
                <FieldValue>{importedData.type}</FieldValue>
              </PreviewField>
            )}

            {importedData.address && (
              <PreviewField>
                <FieldLabel>Endereço:</FieldLabel>
                <FieldValue>{importedData.address}</FieldValue>
              </PreviewField>
            )}

            {(importedData.city || importedData.state) && (
              <PreviewField>
                <FieldLabel>Cidade/Estado:</FieldLabel>
                <FieldValue>
                  {[importedData.city, importedData.state]
                    .filter(Boolean)
                    .join(' / ')}
                </FieldValue>
              </PreviewField>
            )}

            {importedData.totalArea && (
              <PreviewField>
                <FieldLabel>Área Total:</FieldLabel>
                <FieldValue>{importedData.totalArea} m²</FieldValue>
              </PreviewField>
            )}

            {(importedData.bedrooms || importedData.bathrooms) && (
              <PreviewField>
                <FieldLabel>Quartos/Banheiros:</FieldLabel>
                <FieldValue>
                  {[importedData.bedrooms || 0, importedData.bathrooms || 0]
                    .filter(n => n > 0)
                    .join(' / ')}
                </FieldValue>
              </PreviewField>
            )}

            {(importedData.salePrice || importedData.rentPrice) && (
              <PreviewField>
                <FieldLabel>Preço:</FieldLabel>
                <FieldValue>
                  {importedData.salePrice
                    ? `Venda: R$ ${formatValue(importedData.salePrice)}`
                    : ''}
                  {importedData.salePrice && importedData.rentPrice
                    ? ' | '
                    : ''}
                  {importedData.rentPrice
                    ? `Aluguel: R$ ${formatValue(importedData.rentPrice)}`
                    : ''}
                </FieldValue>
              </PreviewField>
            )}

            {importedData.imageUrls && importedData.imageUrls.length > 0 ? (
              <PreviewField>
                <FieldLabel>Imagens:</FieldLabel>
                <FieldValue>
                  {importedData.imageUrls.length} imagem(ns) encontrada(s)
                </FieldValue>
              </PreviewField>
            ) : (
              <PreviewField>
                <FieldLabel>Imagens:</FieldLabel>
                <FieldValue
                  style={{
                    color: 'inherit',
                    fontStyle: 'italic',
                    opacity: 0.7,
                  }}
                >
                  Nenhuma imagem coletada
                </FieldValue>
              </PreviewField>
            )}

            {importedData.warnings && importedData.warnings.length > 0 && (
              <WarningsList>
                {importedData.warnings.map((warning, index) => (
                  <WarningItem key={index}>
                    <MdWarning size={14} />
                    {warning}
                  </WarningItem>
                ))}
              </WarningsList>
            )}
          </PreviewContent>

          <ActionButtons>
            <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
            <ApplyButton onClick={handleApply}>
              <MdCheckCircle size={18} />
              Aplicar ao Formulário
            </ApplyButton>
          </ActionButtons>
        </PreviewContainer>
      )}
    </Container>
  );
};
