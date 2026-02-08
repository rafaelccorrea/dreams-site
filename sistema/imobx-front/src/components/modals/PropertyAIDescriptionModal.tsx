import React from 'react';
import styled from 'styled-components';
import type { GeneratedDescription } from '../../types/ai';

interface PropertyAIDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: GeneratedDescription[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onAccept: (variant: GeneratedDescription) => void;
}

export const PropertyAIDescriptionModal: React.FC<
  PropertyAIDescriptionModalProps
> = ({ isOpen, onClose, variants, selectedIndex, onSelectIndex, onAccept }) => {
  if (!isOpen) return null;

  const current = variants[selectedIndex];

  return (
    <Overlay>
      <Container>
        <Header>
          <Title>Preview da Descrição Gerada</Title>
          <CloseButton onClick={onClose} aria-label='Fechar'>
            ×
          </CloseButton>
        </Header>

        <Content>
          <Sidebar>
            <SidebarTitle>Gerações ({variants.length}/3)</SidebarTitle>
            <VariantsList>
              {variants.map((v, i) => (
                <VariantItem
                  key={i}
                  $active={i === selectedIndex}
                  onClick={() => onSelectIndex(i)}
                  title={`Ver variação ${i + 1}`}
                >
                  <VariantIndex>#{i + 1}</VariantIndex>
                  <VariantTitle>
                    {v.title.slice(0, 40)}
                    {v.title.length > 40 ? '…' : ''}
                  </VariantTitle>
                </VariantItem>
              ))}
            </VariantsList>
          </Sidebar>

          <Preview>
            <Section>
              <SectionLabel>Título</SectionLabel>
              <PreviewTitle>{current.title}</PreviewTitle>
            </Section>

            <Section>
              <SectionLabel>Descrição</SectionLabel>
              <PreviewDescription>{current.description}</PreviewDescription>
            </Section>

            {!!current.highlights?.length && (
              <Section>
                <SectionLabel>Destaques</SectionLabel>
                <Highlights>
                  {current.highlights.map((h, idx) => (
                    <Highlight key={idx}>{h}</Highlight>
                  ))}
                </Highlights>
              </Section>
            )}
          </Preview>
        </Content>

        <Footer>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton onClick={() => onAccept(current)}>
            Usar esta descrição
          </PrimaryButton>
        </Footer>
      </Container>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 8px;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 420px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 16px;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const SidebarTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const VariantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VariantItem = styled.button<{ $active?: boolean }>`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  text-align: left;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props =>
    props.$active
      ? props.theme.colors.backgroundSecondary
      : props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const VariantIndex = styled.span`
  font-weight: 800;
  color: ${props => props.theme.colors.primary};
`;

const VariantTitle = styled.span`
  font-weight: 600;
`;

const Preview = styled.div`
  padding: 20px;
  overflow: auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
`;

const PreviewTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const PreviewDescription = styled.pre`
  white-space: pre-wrap;
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  line-height: 1.5;
  font-size: 14px;
`;

const Highlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Highlight = styled.span`
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}40;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

const Footer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  cursor: pointer;
`;
