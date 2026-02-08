import React from 'react';
import { Modal, Button, ConfigProvider, theme } from 'antd';
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import type {
  ValidationResult,
  ActionResult,
} from '../../types/kanbanValidations';

interface ValidationFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResults: ValidationResult[];
  actionResults?: ActionResult[];
  warnings?: string[];
  blocked: boolean;
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.text};
`;

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResultItem = styled.div<{ passed?: boolean; success?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: ${props =>
    props.passed === false
      ? props.theme.colors.errorBackground
      : props.success === true
        ? props.theme.colors.successBackground
        : props.theme.colors.warningBackground};
  border-radius: 8px;
  border-left: 3px solid
    ${props =>
      props.passed === false
        ? props.theme.colors.error
        : props.success === true
          ? props.theme.colors.success
          : props.theme.colors.warning};
`;

const ResultIcon = styled.div<{ passed?: boolean; success?: boolean }>`
  flex-shrink: 0;
  color: ${props =>
    props.passed === false
      ? props.theme.colors.error
      : props.success === true
        ? props.theme.colors.success
        : props.theme.colors.warning};
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultMessage = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ResultDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WarningItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.warningBackground};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.warningText};
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

export const ValidationFeedbackModal: React.FC<
  ValidationFeedbackModalProps
> = ({
  isOpen,
  onClose,
  validationResults,
  actionResults = [],
  warnings = [],
  blocked,
}) => {
  const { theme: currentTheme } = useTheme();
  const failedValidations = validationResults.filter(v => !v.passed);
  const passedValidations = validationResults.filter(v => v.passed);
  const successfulActions = actionResults.filter(
    a => a.success && !a.alreadyExecuted
  );
  const failedActions = actionResults.filter(a => !a.success);
  // ⚠️ NOVO: Ações que já foram executadas (bypass)
  const bypassedActions = actionResults.filter(a => a.alreadyExecuted);

  // Configurar tema do Ant Design
  const antdTheme = {
    token: {
      colorBgContainer: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#374151' : '#e1e5e9',
      colorText: currentTheme === 'dark' ? '#f9fafb' : '#4B5563',
      colorTextSecondary: currentTheme === 'dark' ? '#ffffff' : '#6B7280',
      colorPrimary: currentTheme === 'dark' ? '#60a5fa' : '#1c4eff',
    },
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : undefined,
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={
          <Button type='primary' onClick={onClose}>
            Fechar
          </Button>
        }
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {blocked ? (
              <>
                <XCircle style={{ color: 'var(--color-error)' }} />
                <span>Movimento Bloqueado</span>
              </>
            ) : (
              <>
                <CheckCircle2 style={{ color: 'var(--color-success)' }} />
                <span>Tarefa Movida</span>
              </>
            )}
          </div>
        }
        width={600}
      >
        <ModalContent>
          {/* Validações que falharam */}
          {blocked && failedValidations.length > 0 && (
            <Section>
              <SectionTitle>
                <XCircle style={{ color: 'var(--color-error)' }} />
                Validações que Falharam
              </SectionTitle>
              <ResultList>
                {failedValidations.map((validation, index) => (
                  <ResultItem key={index} passed={false}>
                    <ResultIcon passed={false}>
                      <XCircle size={20} />
                    </ResultIcon>
                    <ResultContent>
                      <ResultMessage>{validation.message}</ResultMessage>
                      {(validation.fieldName || validation.customFieldId) && (
                        <ResultDetails>
                          Campo afetado:{' '}
                          {validation.fieldName || 'Campo customizado'}
                        </ResultDetails>
                      )}
                      {validation.details &&
                        Object.keys(validation.details).length > 0 && (
                          <ResultDetails>
                            {JSON.stringify(validation.details, null, 2)}
                          </ResultDetails>
                        )}
                    </ResultContent>
                  </ResultItem>
                ))}
              </ResultList>
            </Section>
          )}

          {/* Validações que passaram */}
          {!blocked && passedValidations.length > 0 && (
            <Section>
              <SectionTitle>
                <CheckCircle2 style={{ color: 'var(--color-success)' }} />
                Validações Aprovadas
              </SectionTitle>
              <ResultList>
                {passedValidations.map((validation, index) => (
                  <ResultItem key={index} passed={true}>
                    <ResultIcon passed={true}>
                      <CheckCircle2 size={20} />
                    </ResultIcon>
                    <ResultContent>
                      <ResultMessage>{validation.message}</ResultMessage>
                    </ResultContent>
                  </ResultItem>
                ))}
              </ResultList>
            </Section>
          )}

          {/* Avisos */}
          {warnings.length > 0 && (
            <Section>
              <SectionTitle>
                <AlertTriangle style={{ color: 'var(--color-warning)' }} />
                Avisos
              </SectionTitle>
              <WarningList>
                {warnings.map((warning, index) => (
                  <WarningItem key={index}>
                    <AlertTriangle size={16} />
                    <span>{warning}</span>
                  </WarningItem>
                ))}
              </WarningList>
            </Section>
          )}

          {/* Ações executadas com sucesso */}
          {!blocked && successfulActions.length > 0 && (
            <Section>
              <SectionTitle>
                <CheckCircle2 style={{ color: 'var(--color-success)' }} />
                Ações Executadas
              </SectionTitle>
              <ResultList>
                {successfulActions.map((action, index) => (
                  <ResultItem key={index} success={true}>
                    <ResultIcon success={true}>
                      <CheckCircle2 size={20} />
                    </ResultIcon>
                    <ResultContent>
                      <ResultMessage>{action.message}</ResultMessage>
                      {action.createdEntityId && action.createdEntityType && (
                        <ResultDetails>
                          {action.createdEntityType} criado:{' '}
                          {action.createdEntityId}
                        </ResultDetails>
                      )}
                    </ResultContent>
                  </ResultItem>
                ))}
              </ResultList>
            </Section>
          )}

          {/* ⚠️ NOVO: Ações que já foram executadas (bypass) */}
          {!blocked && bypassedActions.length > 0 && (
            <Section>
              <SectionTitle>
                <Info style={{ color: 'var(--color-info)' }} />
                Ações Já Executadas Anteriormente
              </SectionTitle>
              <ResultList>
                {bypassedActions.map((action, index) => (
                  <ResultItem key={index} success={true}>
                    <ResultIcon success={true}>
                      <Info size={20} />
                    </ResultIcon>
                    <ResultContent>
                      <ResultMessage>
                        {action.entityName || 'Entidade'} já foi criado
                        anteriormente
                      </ResultMessage>
                      <ResultDetails>
                        {action.message}
                        {action.createdEntityId && (
                          <>
                            <br />
                            Entidade existente: {
                              action.createdEntityType
                            } (ID: {action.createdEntityId})
                          </>
                        )}
                      </ResultDetails>
                    </ResultContent>
                  </ResultItem>
                ))}
              </ResultList>
            </Section>
          )}

          {/* Ações que falharam */}
          {!blocked && failedActions.length > 0 && (
            <Section>
              <SectionTitle>
                <XCircle style={{ color: 'var(--color-error)' }} />
                Ações com Erro
              </SectionTitle>
              <ResultList>
                {failedActions.map((action, index) => (
                  <ResultItem key={index} success={false}>
                    <ResultIcon success={false}>
                      <XCircle size={20} />
                    </ResultIcon>
                    <ResultContent>
                      <ResultMessage>{action.message}</ResultMessage>
                      {action.error && (
                        <ResultDetails style={{ color: 'var(--color-error)' }}>
                          Erro: {action.error}
                        </ResultDetails>
                      )}
                    </ResultContent>
                  </ResultItem>
                ))}
              </ResultList>
            </Section>
          )}

          {/* Estado vazio */}
          {!blocked &&
            validationResults.length === 0 &&
            actionResults.length === 0 &&
            warnings.length === 0 && (
              <EmptyState>
                <Info
                  size={48}
                  style={{
                    color: 'var(--color-text-light)',
                    marginBottom: '12px',
                  }}
                />
                <div>
                  Nenhuma validação ou ação configurada para esta coluna.
                </div>
              </EmptyState>
            )}
        </ModalContent>
      </Modal>
    </ConfigProvider>
  );
};
