import React from 'react';
import styled from 'styled-components';
import type { Match } from '../../types/match';

type MatchAction = 'accept' | 'ignore';

interface MatchActionConfirmationModalProps {
  isOpen: boolean;
  action: MatchAction;
  match: Match | null;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const MatchActionConfirmationModal: React.FC<
  MatchActionConfirmationModalProps
> = ({ isOpen, action, match, onConfirm, onCancel, isProcessing = false }) => {
  if (!isOpen || !match) {
    return null;
  }

  const isAccept = action === 'accept';

  const title = isAccept
    ? 'Confirmar aceite do match?'
    : 'Tem certeza que deseja ignorar este match?';

  const description = isAccept
    ? 'Ao aceitar o match, criamos automaticamente uma task e uma nota no seu workspace pessoal para acompanhar esse cliente.'
    : 'Ao ignorar o match, ele sairá da lista de pendentes. Você poderá registrar o motivo na próxima etapa para melhorar futuras recomendações.';

  const primaryLabel = isAccept ? 'Aceitar match' : 'Continuar e ignorar';
  const primaryIcon = isAccept ? '✅' : '⚠️';

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <IconBubble $variant={isAccept ? 'success' : 'warning'}>
            {primaryIcon}
          </IconBubble>
          <Title>{title}</Title>
        </Header>

        <Content>
          <Summary>
            <SummaryItem>
              <Label>Cliente</Label>
              <Value>{match.client?.name || 'Cliente sem nome'}</Value>
            </SummaryItem>
            <SummaryItem>
              <Label>Imóvel</Label>
              <Value>{match.property?.title || 'Imóvel sem título'}</Value>
            </SummaryItem>
          </Summary>

          <Description>{description}</Description>

          {isAccept ? (
            <Highlights>
              <Highlight>
                📋 Task e nota criadas automaticamente no workspace.
              </Highlight>
              <Highlight>
                🗂️ Match ficará marcado como aceito para consultas futuras.
              </Highlight>
              <Highlight>
                🚀 Você pode ajustar os próximos passos diretamente no Kanban.
              </Highlight>
            </Highlights>
          ) : (
            <Highlights>
              <Highlight>
                🧠 Registrar o motivo ajuda a refinar os próximos matches.
              </Highlight>
              <Highlight>
                📥 Você poderá recuperar este match na aba de ignorados.
              </Highlight>
              <Highlight>
                ✅ Nada será enviado ao cliente automaticamente.
              </Highlight>
            </Highlights>
          )}
        </Content>

        <Footer>
          <SecondaryButton onClick={onCancel} disabled={isProcessing}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            disabled={isProcessing}
            $variant={isAccept ? 'accept' : 'ignore'}
          >
            {isProcessing ? 'Processando...' : primaryLabel}
          </PrimaryButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const IconBubble = styled.div<{ $variant: 'success' | 'warning' }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: ${props =>
    props.$variant === 'success'
      ? props.theme.colors.successBackground
      : props.theme.colors.warningBackground};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const SummaryItem = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px;
`;

const Label = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Value = styled.p`
  margin: 4px 0 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const Highlights = styled.ul`
  padding-left: 18px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${props => props.theme.colors.text};
`;

const Highlight = styled.li`
  font-size: 0.95rem;
  line-height: 1.4;
`;

const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.hover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled.button<{ $variant: 'accept' | 'ignore' }>`
  background: ${props =>
    props.$variant === 'accept'
      ? props.theme.colors.primary
      : props.theme.colors.warning};
  color: ${props => (props.$variant === 'accept' ? '#ffffff' : '#111827')};
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
