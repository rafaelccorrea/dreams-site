import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação de shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Componente base do shimmer
const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover || props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$radius || '8px'};
`;

const PageContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const SidebarContainer = styled.div`
  width: 480px;
  min-width: 420px;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 400px;
    min-width: 350px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 16px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 12px 16px 12px 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 10px 12px 10px 10px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 28px;

  @media (max-width: 768px) {
    width: 180px;
    height: 26px;
  }

  @media (max-width: 480px) {
    width: 160px;
    height: 24px;
  }
`;

const SearchShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 40px;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 38px;
  }

  @media (max-width: 480px) {
    height: 36px;
  }
`;

const ControlsShimmer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const FiltersShimmer = styled(ShimmerBase)`
  flex: 0 0 70%;
  height: 40px;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex: 0 0 65%;
    height: 38px;
  }

  @media (max-width: 480px) {
    flex: 0 0 60%;
    height: 36px;
  }
`;

const RefreshButtonShimmer = styled(ShimmerBase)`
  flex: 0 0 30%;
  max-width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-left: auto;

  @media (max-width: 768px) {
    flex: 0 0 35%;
    max-width: 38px;
    height: 38px;
  }

  @media (max-width: 480px) {
    flex: 0 0 40%;
    max-width: 36px;
    height: 36px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 10px 12px 10px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px 8px 10px;
  }
`;

const ConversationCardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 16px 20px;
  margin: 0 0 12px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ConversationTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const ContactNameShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 18px;
  flex: 1;
`;

const TimeShimmer = styled(ShimmerBase)`
  width: 60px;
  height: 14px;
  flex-shrink: 0;
`;

const MessagePreviewShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 16px;

  &:nth-child(2) {
    width: 80%;
  }
`;

const EmptyChatShimmer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  text-align: center;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const EmptyTextShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 20px;
`;

interface WhatsAppShimmerProps {
  /** Se true, mostra apenas a lista de conversas (sem sidebar e chat) */
  listOnly?: boolean;
}

export const WhatsAppShimmer: React.FC<WhatsAppShimmerProps> = ({
  listOnly = false,
}) => {
  // Se for apenas lista, retorna apenas os cards de conversas
  if (listOnly) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <ConversationCardShimmer key={index}>
            <ConversationTopRow>
              <ContactNameShimmer />
              <TimeShimmer />
            </ConversationTopRow>
            <MessagePreviewShimmer />
            <MessagePreviewShimmer />
          </ConversationCardShimmer>
        ))}
      </>
    );
  }

  // Layout completo da página
  return (
    <PageContainer>
      <SidebarContainer>
        <SidebarHeader>
          <HeaderTop>
            <TitleShimmer />
          </HeaderTop>
          <SearchShimmer />
          <ControlsShimmer>
            <FiltersShimmer />
            <RefreshButtonShimmer />
          </ControlsShimmer>
        </SidebarHeader>

        <MessagesContainer>
          {Array.from({ length: 6 }).map((_, index) => (
            <ConversationCardShimmer key={index}>
              <ConversationTopRow>
                <ContactNameShimmer />
                <TimeShimmer />
              </ConversationTopRow>
              <MessagePreviewShimmer />
              <MessagePreviewShimmer />
            </ConversationCardShimmer>
          ))}
        </MessagesContainer>
      </SidebarContainer>

      <ChatContainer>
        <EmptyChatShimmer>
          <IconShimmer />
          <EmptyTextShimmer />
        </EmptyChatShimmer>
      </ChatContainer>
    </PageContainer>
  );
};
