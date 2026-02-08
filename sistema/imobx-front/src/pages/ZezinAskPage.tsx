import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdArrowBack, MdSend, MdSmartToy } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { zezinApi } from '../services/zezinApi';
import { showError } from '../utils/notifications';
import type { ZezinSuggestedQuestion, ZezinHistoryItem } from '../types/zezin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageHeader = styled.header`
  flex-shrink: 0;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground || '#fff'};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const BackButton = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;

  @media (max-width: 768px) {
    padding: 16px 20px 12px;
  }
`;

const MessageBubble = styled.div<{ $isUser?: boolean }>`
  max-width: 85%;
  align-self: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  padding: 14px 20px;
  border-radius: 18px;
  font-size: 0.9375rem;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${props =>
    props.$isUser
      ? `
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    color: white;
    border-bottom-right-radius: 4px;
  `
      : `
    background: ${props.theme.colors.cardBackground || '#fff'};
    border: 1px solid ${props.theme.colors.border};
    color: ${props.theme.colors.text};
    border-bottom-left-radius: 4px;
  `}
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.8125rem;
`;

const Avatar = styled.div<{ $isUser?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${props =>
    props.$isUser
      ? 'background: rgba(255,255,255,0.3); color: white;'
      : 'background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white;'}
`;

const InputArea = styled.div`
  flex-shrink: 0;
  padding: 16px 24px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground || '#fff'};
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 48px;
  max-height: 160px;
  padding: 14px 18px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 14px;
  font-size: 1rem;
  font-family: inherit;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  resize: none;
  transition: border-color 0.2s;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  min-height: 48px;
  min-width: 120px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuggestionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const SuggestionsBlock = styled.div<{ $visible: boolean }>`
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  opacity: ${props => (props.$visible ? 1 : 0)};
  max-height: ${props => (props.$visible ? '160px' : '0')};
  margin-top: ${props => (props.$visible ? '12px' : '0')};
  pointer-events: ${props => (props.$visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease, max-height 0.35s ease, margin-top 0.3s ease;
`;

const SuggestionsLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${props => props.theme.colors.textSecondary};
  display: block;
  margin-bottom: 8px;
`;

const EmptyStateSuggestions = styled.div<{ $visible: boolean }>`
  margin-top: 24px;
  padding: 20px 0 0;
  border-top: 1px dashed ${props => props.theme.colors.border};
  opacity: ${props => (props.$visible ? 1 : 0)};
  pointer-events: ${props => (props.$visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

const EmptyStateSuggestionsTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 14px;
`;

const SuggestionChip = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.08);
    color: #8b5cf6;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingDots = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: bounce 1.2s ease-in-out infinite both;
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.3s; }
  }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}30;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 8px;
`;

const ZezinIcon = () => <span style={{ fontSize: '1.25rem' }} title="Zezin">🤖</span>;

/** Resposta do backend quando nenhuma API de IA está configurada */
const isNoApiConfiguredAnswer = (answer: string): boolean =>
  answer.includes('chave de IA') ||
  answer.includes('GROQ_API_KEY') ||
  answer.includes('OPENAI_API_KEY') ||
  answer.includes('HUGGING_FACE_API_KEY') ||
  answer.includes('não estou pronto para responder') ||
  answer.includes('administrador do sistema precisa configurar');

function historyToMessages(history: ZezinHistoryItem[]): ChatMessage[] {
  const list: ChatMessage[] = [];
  const reversed = [...(history || [])].reverse();
  reversed.forEach(item => {
    list.push({ id: `user-${item.id}`, role: 'user', content: item.message });
    list.push({ id: `assistant-${item.id}`, role: 'assistant', content: item.answer });
  });
  return list;
}

const ZezinAskPage: React.FC = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ZezinSuggestedQuestion[]>([]);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<ZezinSuggestedQuestion[]>([]);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean } | null>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const checkAvailability = useCallback(async () => {
    try {
      const data = await zezinApi.getAvailability();
      setAvailability(data);
      if (!data.available) return;
    } catch {
      setAvailability({ available: false });
    }
  }, []);

  const loadSuggestions = useCallback(async () => {
    try {
      const data = await zezinApi.getSuggestedQuestions();
      setSuggestions(data.questions || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const data = await zezinApi.getHistory(50, 0);
      setMessages(historyToMessages(data.items || []));
    } catch {
      setMessages([]);
    }
  }, []);

  const loadFollowUpSuggestions = useCallback(async () => {
    setFollowUpLoading(true);
    try {
      const data = await zezinApi.getSuggestedQuestionsFollowUp();
      setFollowUpSuggestions(data.questions || []);
    } catch {
      setFollowUpSuggestions([]);
    } finally {
      setFollowUpLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  useEffect(() => {
    if (availability?.available) {
      loadSuggestions();
      loadHistory();
    }
  }, [availability?.available, loadSuggestions, loadHistory]);

  useEffect(() => {
    if (!availability?.available) return;
    const hasConversation = messages.length >= 2;
    if (hasConversation) loadFollowUpSuggestions();
    else setFollowUpSuggestions([]);
  }, [availability?.available, messages.length, loadFollowUpSuggestions]);

  const handleSend = useCallback(
    async (text?: string) => {
      const toSend = (text ?? input).trim();
      if (!toSend || loading) return;

      setError(null);
      setInput('');
      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        { id: userMsgId, role: 'user', content: toSend },
        { id: assistantMsgId, role: 'assistant', content: '' },
      ]);
      setLoading(true);

      zezinApi.askStream(toSend, {
        onChunk: chunk => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        },
        onDone: () => {
          setLoading(false);
          loadFollowUpSuggestions();
        },
        onError: err => {
          const msg = err.message || 'Não foi possível obter resposta do Zezin.';
          setError(msg);
          showError(msg);
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, content: `[Erro: ${msg}]` } : m,
            ),
          );
          setLoading(false);
        },
      });
    },
    [input, loading, loadFollowUpSuggestions],
  );

  const handleSuggestionClick = (s: ZezinSuggestedQuestion) => {
    setInput(s.message);
    handleSend(s.message);
  };

  if (availability && !availability.available) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader>
            <BackButton onClick={() => navigate('/integrations')}>
              <MdArrowBack size={18} />
              Voltar para Integrações
            </BackButton>
          </PageHeader>
          <ChatArea>
            <ErrorMessage>
              O Zezin não está disponível para sua conta. É exclusivo para administradores no plano Pro com o módulo Assistente de IA.
            </ErrorMessage>
          </ChatArea>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <Title>
              <ZezinIcon />
              Chat com o Zezin
            </Title>
            <BackButton onClick={() => navigate('/integrations')}>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </HeaderTop>
        </PageHeader>

        <ChatArea>
          {messages.length === 0 && !loading && (
            <>
              <MessageBubble $isUser={false}>
                <MessageHeader>
                  <Avatar>
                    <MdSmartToy size={16} />
                  </Avatar>
                  Zezin
                </MessageHeader>
                Oi! Pode me perguntar o que quiser sobre vendas, metas, leads, imóveis ou clientes — eu uso os dados da empresa e respondo na hora. Se preferir, também atendo pelo WhatsApp no número que você configurou em Integrações.
              </MessageBubble>
              {suggestions.length > 0 && (
                <EmptyStateSuggestions $visible={!loading}>
                  <EmptyStateSuggestionsTitle>Sugestões de perguntas</EmptyStateSuggestionsTitle>
                  <SuggestionsRow style={{ marginTop: 0 }}>
                    {suggestions.slice(0, 10).map(s => (
                      <SuggestionChip
                        key={s.id}
                        type="button"
                        onClick={() => handleSuggestionClick(s)}
                        disabled={loading}
                      >
                        {s.label}
                      </SuggestionChip>
                    ))}
                  </SuggestionsRow>
                </EmptyStateSuggestions>
              )}
            </>
          )}
          {messages.map(msg => (
            <MessageBubble key={msg.id} $isUser={msg.role === 'user'}>
              {msg.role === 'assistant' && (
                <MessageHeader>
                  <Avatar>
                    <MdSmartToy size={16} />
                  </Avatar>
                  Zezin
                </MessageHeader>
              )}
              {msg.role === 'assistant' && msg.content === '' && loading ? (
                <LoadingDots>
                  <span />
                  <span />
                  <span />
                </LoadingDots>
              ) : msg.role === 'assistant' && isNoApiConfiguredAnswer(msg.content) ? (
                <>
                  <strong style={{ color: '#b45309' }}>Configuração pendente no servidor</strong>
                  <br />
                  {msg.content}
                  <br />
                  <small style={{ opacity: 0.9 }}>
                    O administrador precisa configurar no servidor uma das chaves: GROQ_API_KEY, OPENAI_API_KEY ou HUGGING_FACE_API_KEY. Se usar só Hugging Face, deixe apenas HUGGING_FACE_API_KEY no .env e reinicie o servidor.
                  </small>
                </>
              ) : (
                msg.content
              )}
            </MessageBubble>
          ))}
          <div ref={chatEndRef} />
        </ChatArea>

        <InputArea>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InputRow>
            <TextArea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Pergunte algo ao Zezin..."
              disabled={loading}
              rows={1}
            />
            <SendButton
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <LoadingDots>
                  <span />
                  <span />
                  <span />
                </LoadingDots>
              ) : (
                <>
                  <MdSend size={20} />
                  Enviar
                </>
              )}
            </SendButton>
          </InputRow>
          {messages.length > 0 &&
          (() => {
            const useFollowUp = messages.length >= 2 && followUpSuggestions.length > 0;
            const list = useFollowUp ? followUpSuggestions : suggestions;
            const label =
              useFollowUp
                ? 'Sugestões com base na conversa'
                : followUpLoading && messages.length >= 2
                  ? 'Carregando sugestões...'
                  : 'Sugestões de perguntas';
            const hasSuggestions = list.length > 0 || followUpLoading;
            const visible = !loading && hasSuggestions;
            if (!hasSuggestions) return null;
            return (
              <SuggestionsBlock $visible={visible}>
                <SuggestionsLabel>{label}</SuggestionsLabel>
                <SuggestionsRow>
                  {(followUpLoading && messages.length >= 2 ? [] : list)
                    .slice(0, 8)
                    .map(s => (
                      <SuggestionChip
                        key={s.id}
                        type="button"
                        onClick={() => handleSuggestionClick(s)}
                        disabled={loading}
                      >
                        {s.label}
                      </SuggestionChip>
                    ))}
                </SuggestionsRow>
              </SuggestionsBlock>
            );
          })()}
        </InputArea>
      </PageContainer>
    </Layout>
  );
};

export default ZezinAskPage;
