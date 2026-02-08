import React, { useState } from 'react';
import styled from 'styled-components';
import { MdAutoAwesome, MdClose } from 'react-icons/md';
import { whatsappApi } from '../../services/whatsappApi';
import { showSuccess, showError } from '../../utils/notifications';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { PermissionRoute } from '../PermissionRoute';
import type { AnalyzeMessageResponse } from '../../types/whatsapp';

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary}25;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

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
  z-index: 10000;
  padding: 24px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}08 0%,
    ${props => props.theme.colors.primary}04 100%
  );
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const DataItem = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DataLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const DataValue = styled.div`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const IntentBadge = styled.span<{ $intent: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;

  ${props => {
    switch (props.$intent) {
      case 'lead':
        return `background: #10B98120; color: #10B981;`;
      case 'question':
        return `background: #3B82F620; color: #3B82F6;`;
      case 'complaint':
        return `background: #EF444420; color: #EF4444;`;
      default:
        return `background: #6B728020; color: #6B7280;`;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;

  ${props => {
    switch (props.$priority) {
      case 'urgent':
        return `background: #EF444420; color: #EF4444;`;
      case 'high':
        return `background: #F59E0B20; color: #F59E0B;`;
      case 'medium':
        return `background: #3B82F620; color: #3B82F6;`;
      case 'low':
        return `background: #10B98120; color: #10B981;`;
      default:
        return `background: #6B728020; color: #6B7280;`;
    }
  }}
`;

const SuggestedResponse = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.primary}10;
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary};
  margin-top: 12px;
`;

const SuggestedResponseText = styled.div`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.error};
  padding: 12px;
  background: ${props => props.theme.colors.error}15;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.error}30;
  margin-bottom: 20px;
`;

interface AnalyzeMessageButtonProps {
  message: string;
  phoneNumber: string;
  contactName?: string;
  onAnalysisComplete?: (analysis: AnalyzeMessageResponse) => void;
}

export const AnalyzeMessageButton: React.FC<AnalyzeMessageButtonProps> = ({
  message,
  phoneNumber,
  contactName,
  onAnalysisComplete,
}) => {
  const permissionsContext = usePermissionsContextOptional();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeMessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar permissão de análise
  const canAnalyze =
    permissionsContext?.hasPermission('whatsapp:view') ?? false;

  const handleAnalyze = async () => {
    // Verificar permissão antes de chamar API
    if (!canAnalyze) {
      setError('Você não tem permissão para analisar mensagens WhatsApp.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setIsOpen(true);

    try {
      const result = await whatsappApi.analyzeMessage({
        message,
        phoneNumber,
        contactName,
      });
      setAnalysis(result);
      onAnalysisComplete?.(result);
      showSuccess('Mensagem analisada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao analisar mensagem:', err);
      if (err.response?.status === 403) {
        setError('Você não tem permissão para realizar esta ação.');
        showError('Permissão negada');
      } else {
        setError(err.message || 'Erro ao analisar mensagem com IA');
        showError(err.message || 'Erro ao analisar mensagem');
      }
    } finally {
      setLoading(false);
    }
  };

  // Não renderizar botão se não tiver permissão
  if (!canAnalyze) {
    return null;
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const translateIntent = (intent: string) => {
    const translations: Record<string, string> = {
      lead: 'Lead',
      question: 'Pergunta',
      complaint: 'Reclamação',
      other: 'Outro',
    };
    return translations[intent] || intent;
  };

  const translatePriority = (priority?: string) => {
    const translations: Record<string, string> = {
      urgent: 'Urgente',
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    };
    return priority ? translations[priority] || priority : 'Não definida';
  };

  return (
    <>
      <Button onClick={handleAnalyze} disabled={loading || !message.trim()}>
        <MdAutoAwesome size={16} />
        {loading ? 'Analisando...' : 'Analisar com IA'}
      </Button>

      <ModalOverlay $isOpen={isOpen} onClick={() => setIsOpen(false)}>
        <ModalContainer onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              <MdAutoAwesome size={20} />
              Análise da Mensagem com IA
            </ModalTitle>
            <CloseButton onClick={() => setIsOpen(false)}>
              <MdClose size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalContent>
            {loading && (
              <LoadingState>
                <MdAutoAwesome
                  size={48}
                  style={{ marginBottom: '16px', opacity: 0.5 }}
                />
                <div>Analisando mensagem com Inteligência Artificial...</div>
              </LoadingState>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {analysis && !loading && (
              <>
                <Section>
                  <SectionTitle>Intenção Detectada</SectionTitle>
                  <IntentBadge $intent={analysis.intent}>
                    {translateIntent(analysis.intent)}
                  </IntentBadge>
                  {analysis.shouldCreateTask && (
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '0.875rem',
                        color: '#10B981',
                      }}
                    >
                      ✓ Recomendado criar tarefa no Kanban
                    </div>
                  )}
                </Section>

                <Section>
                  <SectionTitle>Dados Extraídos</SectionTitle>
                  <DataGrid>
                    {analysis.extractedData.name && (
                      <DataItem>
                        <DataLabel>Nome</DataLabel>
                        <DataValue>{analysis.extractedData.name}</DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.phone && (
                      <DataItem>
                        <DataLabel>Telefone</DataLabel>
                        <DataValue>{analysis.extractedData.phone}</DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.email && (
                      <DataItem>
                        <DataLabel>Email</DataLabel>
                        <DataValue>{analysis.extractedData.email}</DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.interest && (
                      <DataItem>
                        <DataLabel>Interesse</DataLabel>
                        <DataValue>
                          {analysis.extractedData.interest === 'compra' &&
                            'Compra'}
                          {analysis.extractedData.interest === 'venda' &&
                            'Venda'}
                          {analysis.extractedData.interest === 'aluguel' &&
                            'Aluguel'}
                        </DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.propertyType && (
                      <DataItem>
                        <DataLabel>Tipo de Imóvel</DataLabel>
                        <DataValue>
                          {analysis.extractedData.propertyType}
                        </DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.location && (
                      <DataItem>
                        <DataLabel>Localização</DataLabel>
                        <DataValue>{analysis.extractedData.location}</DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.budget && (
                      <DataItem>
                        <DataLabel>Orçamento</DataLabel>
                        <DataValue>
                          {formatCurrency(analysis.extractedData.budget)}
                        </DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.urgency && (
                      <DataItem>
                        <DataLabel>Urgência</DataLabel>
                        <DataValue>
                          {analysis.extractedData.urgency === 'high' && 'Alta'}
                          {analysis.extractedData.urgency === 'medium' &&
                            'Média'}
                          {analysis.extractedData.urgency === 'low' && 'Baixa'}
                        </DataValue>
                      </DataItem>
                    )}
                    {analysis.extractedData.confidence !== undefined && (
                      <DataItem>
                        <DataLabel>Confiança</DataLabel>
                        <DataValue>
                          {Math.round(analysis.extractedData.confidence * 100)}%
                        </DataValue>
                      </DataItem>
                    )}
                  </DataGrid>
                </Section>

                {analysis.priority && (
                  <Section>
                    <SectionTitle>Prioridade Sugerida</SectionTitle>
                    <PriorityBadge $priority={analysis.priority}>
                      {translatePriority(analysis.priority)}
                    </PriorityBadge>
                  </Section>
                )}

                {analysis.suggestedResponse && (
                  <Section>
                    <SectionTitle>Resposta Sugerida pela IA</SectionTitle>
                    <SuggestedResponse>
                      <SuggestedResponseText>
                        {analysis.suggestedResponse}
                      </SuggestedResponseText>
                    </SuggestedResponse>
                  </Section>
                )}
              </>
            )}
          </ModalContent>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};
