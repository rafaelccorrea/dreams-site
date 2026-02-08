import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalPadrão } from '../common/ModalPadrão';
import { MdWaterDrop, MdCheckCircle, MdArrowForward } from 'react-icons/md';
import styled from 'styled-components';

interface WatermarkInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export const WatermarkInfoModal: React.FC<WatermarkInfoModalProps> = ({
  isOpen,
  onClose,
  companyId,
}) => {
  const navigate = useNavigate();

  const handleConfigure = () => {
    onClose();
    navigate(`/companies/${companyId}/edit`);
    // Scroll para a seção de marca d'água após navegar
    setTimeout(() => {
      const watermarkSection = document.getElementById('watermark-section');
      if (watermarkSection) {
        watermarkSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1000);
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={onClose}
      title="Marca d'Água nas Imagens"
      subtitle="Configure sua marca d'água para proteger suas imagens"
      icon={<MdWaterDrop size={24} />}
      maxWidth='600px'
      footer={
        <ModalFooter>
          <ButtonSecondary onClick={onClose}>
            Continuar sem configurar
          </ButtonSecondary>
          <ButtonPrimary onClick={handleConfigure}>
            Configurar Marca d'Água
            <MdArrowForward size={20} />
          </ButtonPrimary>
        </ModalFooter>
      }
    >
      <ModalContent>
        <InfoSection>
          <InfoIcon>
            <MdWaterDrop size={48} />
          </InfoIcon>
          <InfoTitle>Proteja suas imagens com marca d'água</InfoTitle>
          <InfoDescription>
            Configure uma marca d'água que será aplicada automaticamente de
            forma centralizada em todas as imagens das propriedades durante o
            upload.
          </InfoDescription>
        </InfoSection>

        <BenefitsList>
          <BenefitItem>
            <MdCheckCircle size={20} />
            <span>Proteção automática das imagens</span>
          </BenefitItem>
          <BenefitItem>
            <MdCheckCircle size={20} />
            <span>Aplicação centralizada em todas as imagens</span>
          </BenefitItem>
          <BenefitItem>
            <MdCheckCircle size={20} />
            <span>Configuração única e permanente</span>
          </BenefitItem>
          <BenefitItem>
            <MdCheckCircle size={20} />
            <span>Formato PNG com fundo transparente</span>
          </BenefitItem>
        </BenefitsList>

        <NoteBox>
          <NoteTitle>💡 Dica</NoteTitle>
          <NoteText>
            Você pode configurar a marca d'água agora ou depois. Ela será
            aplicada automaticamente em todas as novas imagens enviadas.
          </NoteText>
        </NoteBox>
      </ModalContent>
    </ModalPadrão>
  );
};

// Styled Components
const ModalContent = styled.div`
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 20px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
`;

const InfoIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const InfoDescription = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 20px;
  border-radius: 12px;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};

  svg {
    color: ${props => props.theme.colors.success};
    flex-shrink: 0;
  }
`;

const NoteBox = styled.div`
  background: ${props => props.theme.colors.primary}10;
  border-left: 3px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NoteTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const NoteText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 16px 24px;
  }
`;

const ButtonSecondary = styled.button`
  padding: 12px 24px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ButtonPrimary = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;
