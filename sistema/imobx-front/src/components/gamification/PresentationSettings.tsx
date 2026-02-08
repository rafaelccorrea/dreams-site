import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdCheckCircle, MdFullscreen } from 'react-icons/md';

interface PresentationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (settings: PresentationConfig) => void;
}

export interface PresentationConfig {
  showOverview: boolean;
  showTopPerformers: boolean;
  showTeams: boolean;
  autoPlay: boolean;
  slideDuration: number; // em segundos
}

export const PresentationSettings: React.FC<PresentationSettingsProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const [config, setConfig] = useState<PresentationConfig>({
    showOverview: true,
    showTopPerformers: true,
    showTeams: true,
    autoPlay: false,
    slideDuration: 10,
  });

  const handleStart = () => {
    // Validar que pelo menos um slide está selecionado
    if (
      !config.showOverview &&
      !config.showTopPerformers &&
      !config.showTeams
    ) {
      alert('Selecione pelo menos um slide para apresentar');
      return;
    }
    onStart(config);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdFullscreen />
            Configurar Apresentação
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <Section>
            <SectionTitle>Slides a Apresentar</SectionTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <Checkbox
                  type='checkbox'
                  checked={config.showOverview}
                  onChange={e =>
                    setConfig({ ...config, showOverview: e.target.checked })
                  }
                />
                <CheckboxText>
                  <CheckboxTitle>📊 Visão Geral</CheckboxTitle>
                  <CheckboxDescription>
                    Métricas gerais e distribuição de pontos
                  </CheckboxDescription>
                </CheckboxText>
              </CheckboxLabel>

              <CheckboxLabel>
                <Checkbox
                  type='checkbox'
                  checked={config.showTopPerformers}
                  onChange={e =>
                    setConfig({
                      ...config,
                      showTopPerformers: e.target.checked,
                    })
                  }
                />
                <CheckboxText>
                  <CheckboxTitle>🏆 Top Performers</CheckboxTitle>
                  <CheckboxDescription>
                    Ranking individual dos melhores colaboradores
                  </CheckboxDescription>
                </CheckboxText>
              </CheckboxLabel>

              <CheckboxLabel>
                <Checkbox
                  type='checkbox'
                  checked={config.showTeams}
                  onChange={e =>
                    setConfig({ ...config, showTeams: e.target.checked })
                  }
                />
                <CheckboxText>
                  <CheckboxTitle>👥 Ranking de Equipes</CheckboxTitle>
                  <CheckboxDescription>
                    Desempenho das equipes
                  </CheckboxDescription>
                </CheckboxText>
              </CheckboxLabel>
            </CheckboxGroup>
          </Section>

          <Section>
            <SectionTitle>Configurações de Reprodução</SectionTitle>

            <CheckboxLabel>
              <Checkbox
                type='checkbox'
                checked={config.autoPlay}
                onChange={e =>
                  setConfig({ ...config, autoPlay: e.target.checked })
                }
              />
              <CheckboxText>
                <CheckboxTitle>▶️ Reprodução Automática</CheckboxTitle>
                <CheckboxDescription>
                  Os slides mudarão automaticamente
                </CheckboxDescription>
              </CheckboxText>
            </CheckboxLabel>

            {config.autoPlay && (
              <SliderGroup>
                <SliderLabel>
                  Duração de cada slide:{' '}
                  <strong>{config.slideDuration}s</strong>
                </SliderLabel>
                <Slider
                  type='range'
                  min='5'
                  max='30'
                  step='5'
                  value={config.slideDuration}
                  onChange={e =>
                    setConfig({
                      ...config,
                      slideDuration: Number(e.target.value),
                    })
                  }
                />
                <SliderHints>
                  <span>5s</span>
                  <span>30s</span>
                </SliderHints>
              </SliderGroup>
            )}
          </Section>

          <InfoBox>
            <MdCheckCircle />
            <InfoText>
              Use as setas do teclado (← →) ou os botões na tela para navegar
              entre os slides. Pressione ESC para sair do modo apresentação.
            </InfoText>
          </InfoBox>
        </ModalContent>

        <ModalFooter>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <StartButton onClick={handleStart}>
            <MdFullscreen />
            Iniciar Apresentação
          </StartButton>
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  padding: 1rem;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 1.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.75rem;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.5rem;
  }

  &:hover {
    background: ${props => props.theme.colors.danger}20;
    color: ${props => props.theme.colors.danger};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 10px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:has(input:checked) {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
  margin-top: 2px;
  flex-shrink: 0;
`;

const CheckboxText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const CheckboxTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CheckboxDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SliderGroup = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: 0.75rem;
  margin-top: 0.5rem;
`;

const SliderLabel = styled.div`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;

  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.colors.border};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

const SliderHints = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoBox = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 0.75rem;

  svg {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}50;
  }
`;
