import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import {
  MdSave,
  MdArrowBack,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
  MdInfo,
  MdLock,
  MdCheckCircle,
  MdWarning,
  MdContentCopy,
  MdAdd,
  MdRemove,
  MdSupport,
  MdSmartToy,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { Layout } from '../components/layout/Layout';
import { whatsappApi } from '../services/whatsappApi';
import { projectsApi } from '../services/projectsApi';
import { showSuccess, showError } from '../utils/notifications';
import {
  normalizeTokenForIntegration,
  normalizeTokenForSave,
} from '../utils/integrationTokenUtils';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { maskPhoneAuto } from '../utils/masks';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { WhatsAppConfigShimmer } from '../components/shimmer/WhatsAppConfigShimmer';
import { getApiUrl } from '../config/apiConfig';
import type {
  WhatsAppConfig,
  CreateWhatsAppConfigRequest,
} from '../types/whatsapp';
import type { KanbanProject } from '../types/kanban';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: #ffffff;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  @media (max-width: 480px) {
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const BackButton = styled.button`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #111827;
  cursor: pointer;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 12px 14px;
  }
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.35rem;
    gap: 8px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  @media (max-width: 480px) {
    gap: 24px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  @media (max-width: 480px) {
    margin-bottom: 24px;
    padding: 16px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  margin-top: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  @media (max-width: 480px) {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  margin-top: 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Input = styled.input`
  padding: 12px 16px;
  min-height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #f9fafb;
  color: #111827;
  width: 100%;
  transition: all 0.2s ease;
  box-sizing: border-box;
  @media (max-width: 480px) {
    min-height: 48px;
  }
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
    background: #ffffff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  min-height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #f9fafb;
  color: #111827;
  width: 100%;
  transition: all 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
  @media (max-width: 480px) {
    min-height: 48px;
  }
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
    background: #ffffff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #111827;
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 4px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    opacity: 0.7;
  }
`;

const InfoBox = styled.div<{ $variant?: 'info' | 'success' | 'warning' }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 20px;

  ${props => {
    if (props.$variant === 'success') {
      return `
        background: ${props.theme.colors.success}15;
        border: 1px solid ${props.theme.colors.success}30;
        color: ${props.theme.colors.success};
      `;
    } else if (props.$variant === 'warning') {
      return `
        background: ${props.theme.colors.warning}15;
        border: 1px solid ${props.theme.colors.warning}30;
        color: ${props.theme.colors.warning};
      `;
    }
    return `
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #6b7280;
    `;
  }}
`;

const FormLabelText = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: #111827;
`;

const FormHintText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
`;

const FormWarningStrong = styled.strong`
  display: block;
  margin-top: 4px;
  color: ${p => p.theme.colors.warning};
`;

const ChatbotSection = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
`;

const ChatbotMessageRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ChatbotMessageInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: #f9fafb;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }
`;

const ChatbotAddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 4px;

  &:hover {
    background: #f3f4f6;
  }
`;

const ChatbotRemoveBtn = styled.button`
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${p => p.theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${p => p.theme.colors.error}20;
    color: ${p => p.theme.colors.error};
  }
`;

const PredefinedMessageItem = styled.button<{ $selected?: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid ${p => (p.$selected ? p.theme.colors.primary : '#e5e7eb')};
  background: ${p => (p.$selected ? p.theme.colors.primary + '12' : '#ffffff')};
  color: #111827;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: ${p => p.theme.colors.primary + '08'};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ChatbotTemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const ChatbotTemplateCard = styled.button<{ $selected?: boolean }>`
  display: block;
  text-align: left;
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid ${p => (p.$selected ? p.theme.colors.primary : '#e5e7eb')};
  background: ${p => (p.$selected ? p.theme.colors.primary + '12' : '#ffffff')};
  color: #111827;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: ${p => p.theme.colors.primary + '08'};
  }
`;

const ChatbotTemplateCardSub = styled.span`
  display: block;
  font-weight: normal;
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
`;

const ChatbotSlotRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const ChatbotSlotLabel = styled.span`
  flex-shrink: 0;
  font-weight: 600;
  font-size: 0.8rem;
  color: #6b7280;
  min-width: 36px;
`;

const ChatbotSlotText = styled.div`
  flex: 1;
  font-size: 0.875rem;
  color: #111827;
  line-height: 1.4;
`;

const ChatbotReplaceBtn = styled.button`
  flex-shrink: 0;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.colors.primary};
  background: transparent;
  color: ${p => p.theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${p => p.theme.colors.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChatbotReplaceDropdown = styled.div`
  margin-top: 8px;
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  max-height: 220px;
  overflow-y: auto;
`;

const ChatbotReplaceOption = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #111827;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${p => p.theme.colors.primary + '15'};
    border-color: #e5e7eb;
  }
`;

const PreAttendOptionCard = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
`;

const AIPreAttendScheduleCard = styled.div`
  margin-top: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const ScheduleSectionLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  letter-spacing: 0.01em;
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const ScheduleTimeInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #ffffff;
  color: #111827;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
    box-shadow: 0 0 0 2px ${p => p.theme.colors.primary}18;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ScheduleSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #ffffff;
  color: #111827;
  min-width: 180px;
  transition: all 0.2s;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
    box-shadow: 0 0 0 2px ${p => p.theme.colors.primary}18;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DayChip = styled.label<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  border: 1px solid ${p => (p.$selected ? p.theme.colors.primary : '#e5e7eb')};
  background: ${p => (p.$selected ? p.theme.colors.primary + '12' : '#ffffff')};
  color: ${p => (p.$selected ? p.theme.colors.primary : '#6b7280')};
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: ${p => (p.$selected ? p.theme.colors.primary + '18' : p.theme.colors.primary + '08')};
  }
`;

const DayChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const ScheduleHint = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const SupportChatBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.colors.primary};
  background: ${p => p.theme.colors.primary};
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
`;

const MAX_CHATBOT_MESSAGES = 5;

/**
 * Config pronta "Ver imóveis": backend envia 3 imóveis por vez, até 12 no total,
 * depois oferece contato direto com corretor (SDR). Alinhado a WHATSAPP_AI_PROPERTY_BATCH_SIZE=3 e WHATSAPP_AI_MAX_PROPERTIES=12.
 */
const VER_IMOVEIS_BATCH_SIZE = 3;
const VER_IMOVEIS_MAX_TOTAL = 12;

/** Opções disponíveis para colocar em cada posição (trocar mensagem mantendo a ordem). Inclui "Ver imóveis" com a config pronta (3 em 3, até 12, depois SDR). */
const CHATBOT_OPTIONS_FOR_REPLACE: string[] = [
  'Olá! Obrigado pelo contato. Em breve nossa equipe responderá.',
  'Recebemos sua mensagem. Um de nossos corretores vai retornar em breve.',
  'Olá! Para te atender melhor, você está buscando imóvel para comprar ou alugar?',
  'Obrigado pelo interesse! Estamos analisando e em breve entraremos em contato.',
  'Oi! Em que bairro ou cidade você tem interesse?',
  'Agradecemos o contato. Nossa equipe está disponível em horário comercial.',
  'Olá! Como podemos te ajudar hoje?',
  'Recebemos seu contato. Retornaremos o mais breve possível.',
  'Obrigado por falar conosco. Em instantes um corretor irá te atender.',
  'Olá! Estamos aqui para ajudar. Em breve responderemos.',
  `Quer ver opções? Responda *Ver imóveis* — enviamos ${VER_IMOVEIS_BATCH_SIZE} por vez, até ${VER_IMOVEIS_MAX_TOTAL}, e depois você fala direto com um corretor.`,
  'Enquanto analisamos, quer que eu já te envie opções? Responda *Ver imóveis* (enviamos de 3 em 3, até 12, e aí um corretor te atende).',
];

/** Templates prontos com ordem das mensagens. O usuário escolhe um e depois pode só trocar uma mensagem por outra na mesma posição. */
const CHATBOT_TEMPLATES: { id: string; name: string; messages: string[] }[] = [
  {
    id: 'rapido',
    name: 'Atendimento rápido',
    messages: [
      'Olá! Obrigado pelo contato. Em breve nossa equipe responderá.',
      'Recebemos sua mensagem. Um de nossos corretores vai retornar em breve.',
    ],
  },
  {
    id: 'qualificacao',
    name: 'Qualificação (compra/aluguel e local)',
    messages: [
      'Olá! Obrigado pelo contato.',
      'Para te atender melhor, você está buscando imóvel para comprar ou alugar?',
      'Oi! Em que bairro ou cidade você tem interesse?',
      'Obrigado pelo interesse! Estamos analisando e em breve entraremos em contato.',
    ],
  },
  {
    id: 'completo',
    name: 'Completo (Ver imóveis: 3 por vez, até 12, depois SDR)',
    messages: [
      'Olá! Obrigado pelo contato.',
      'Para te atender melhor, você está buscando imóvel para comprar ou alugar?',
      'Oi! Em que bairro ou cidade você tem interesse?',
      `Quer ver opções? Responda *Ver imóveis* — enviamos ${VER_IMOVEIS_BATCH_SIZE} por vez, até ${VER_IMOVEIS_MAX_TOTAL}, e depois você fala direto com um corretor.`,
      'Obrigado! Em breve nossa equipe também entrará em contato.',
    ],
  },
  {
    id: 'cinco-generico',
    name: 'Cinco mensagens genéricas',
    messages: [
      'Olá! Obrigado pelo contato. Em breve nossa equipe responderá.',
      'Recebemos sua mensagem. Um de nossos corretores vai retornar em breve.',
      'Olá! Como podemos te ajudar hoje?',
      'Obrigado por falar conosco. Em instantes um corretor irá te atender.',
      'Agradecemos o contato. Nossa equipe está disponível em horário comercial.',
    ],
  },
];

const AutoActionsSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
`;

const AutoActionsTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const OptionalLabel = styled.span`
  color: #6b7280;
  font-weight: normal;
`;

const ValidationWarningBox = styled.div`
  margin-top: 12px;
  padding: 8px;
  border-radius: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  strong { color: #d97706; font-size: 0.875rem; }
  ul { margin: 4px 0 0 0; padding-left: 20px; font-size: 0.875rem; color: #6b7280; }
  li { margin-bottom: 4px; }
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;

  ${props =>
    props.$isActive
      ? `
    background: #10B98120;
    color: #10B981;
  `
      : `
    background: #6B728020;
    color: #6B7280;
  `}
`;

const ValidationResult = styled.div<{ $isValid: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => (props.$isValid ? props.theme.colors.success : props.theme.colors.error)};
  background: ${props => (props.$isValid ? props.theme.colors.success + '15' : props.theme.colors.error + '15')};
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: #111827;
`;

const DangerZone = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.colors.error}30;
`;

const DangerZoneTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.error};
  margin-bottom: 12px;
`;

const DangerZoneDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 24px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
  @media (max-width: 480px) {
    min-height: 48px;
  }

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.colors.error}20;
        color: ${props.theme.colors.error};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.error}30;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.error}30;
        }
      `;
    } else if (props.$variant === 'secondary') {
      return `
        background: #f3f4f6;
        color: #111827;
        border: 1px solid #e5e7eb;
        
        &:hover:not(:disabled) {
          background: #e5e7eb;
          transform: translateY(-1px);
        }
      `;
    }
    return `
      background: ${props.theme.colors.primary};
      color: white;
      
      &:hover:not(:disabled) {
        background: ${props.theme.colors.primaryDark};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${props.theme.colors.primary}30;
      }
    `;
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.error};
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  margin-bottom: 20px;
`;

const UrlCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 8px;
`;
const UrlText = styled.code`
  flex: 1;
  font-size: 0.8125rem;
  word-break: break-all;
  color: #111827;
`;
const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  white-space: nowrap;
  &:hover {
    background: #f3f4f6;
  }
`;
const UrlHowItWorks = styled.p`
  margin: 10px 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.45;
`;

const PermissionDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
`;

const PermissionDeniedIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const PermissionDeniedTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
`;

const PermissionDeniedText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
`;

const WhatsAppConfigPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const [config, setConfig] = useState<CreateWhatsAppConfigRequest>({
    phoneNumberId: '',
    isActive: true,
    autoCreateClient: false,
    autoCreateTask: false,
    enableAIPreAttend: false,
    chatbotEnabled: true,
    chatbotMessages: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [existingConfig, setExistingConfig] = useState<WhatsAppConfig | null>(
    null
  );
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  /** Índice da posição em que o dropdown "Trocar mensagem" está aberto (null = fechado). */
  const [chatbotReplaceSlot, setChatbotReplaceSlot] = useState<number | null>(null);

  const canManageConfig =
    permissionsContext?.hasPermission('whatsapp:manage_config') ?? false;
  const canViewConfig =
    permissionsContext?.hasPermission('whatsapp:view') ?? false;
  const hasAccess = canManageConfig || canViewConfig;

  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedRef = useRef<{
    apiToken: string;
    phoneNumberId: string;
  } | null>(null);
  const isValidationInProgressRef = useRef(false);

  const loadConfig = useCallback(async () => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await whatsappApi.getConfig();
      setExistingConfig(data);
      setConfig({
        apiToken: '',
        phoneNumberId: data.phoneNumberId || '',
        phoneNumber: data.phoneNumber || '',
        businessName: data.businessName || '',
        webhookVerifyToken: normalizeTokenForIntegration(
          data.webhookVerifyToken || ''
        ),
        defaultProjectId: data.defaultProjectId || undefined,
        isActive: data.isActive !== false,
        autoCreateClient: data.autoCreateClient ?? false,
        autoCreateTask: data.autoCreateTask ?? false,
        enableAIPreAttend: data.enableAIPreAttend ?? false,
        aiPreAttendScheduleEnabled: data.aiPreAttendScheduleEnabled ?? false,
        aiPreAttendStartTime: data.aiPreAttendStartTime ?? null,
        aiPreAttendEndTime: data.aiPreAttendEndTime ?? null,
        aiPreAttendDays: data.aiPreAttendDays ?? null,
        aiPreAttendTimezone: data.aiPreAttendTimezone ?? null,
        chatbotEnabled: data.chatbotEnabled !== false,
        chatbotMessages: Array.isArray(data.chatbotMessages) ? data.chatbotMessages : [],
      });
    } catch (error: any) {
      if (error.response?.status === 403) {
        setExistingConfig(null);
        setError('Você não tem permissão para acessar esta funcionalidade.');
      } else if (error.response?.status === 404) {
        setExistingConfig(null);
        setConfig(prev => ({
          ...prev,
          apiToken: '',
          phoneNumberId: '',
          webhookVerifyToken: '',
          defaultProjectId: undefined,
          isActive: true,
          autoCreateClient: false,
          autoCreateTask: false,
          enableAIPreAttend: false,
          aiPreAttendScheduleEnabled: false,
          aiPreAttendStartTime: null,
          aiPreAttendEndTime: null,
          aiPreAttendDays: null,
          aiPreAttendTimezone: null,
          chatbotEnabled: true,
          chatbotMessages: [],
        }));
      } else {
        console.error('Erro ao carregar configuração:', error);
        if (error.response?.status !== 404) {
          setError(error.message || 'Erro ao carregar configuração');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [hasAccess]);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const teamId = localStorage.getItem('selectedTeamId') || '';
      let allProjects: KanbanProject[] = [];

      if (teamId) {
        try {
          const teamProjects = await projectsApi.getProjectsByTeam(teamId);
          allProjects = teamProjects;
        } catch (error) {
          console.warn('Erro ao buscar projetos da equipe:', error);
        }
      }

      // Se não encontrou, buscar todos com filtros
      if (allProjects.length === 0) {
        try {
          const response = await projectsApi.getFilteredProjects({
            limit: '100',
            status: 'active',
          });
          allProjects = response.data || [];
        } catch (error) {
          console.error('Erro ao buscar projetos filtrados:', error);
        }
      }

      setProjects(allProjects);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    if (hasAccess) {
      loadConfig();
      loadProjects();
    }
  }, [hasAccess, loadConfig, loadProjects]);

  const handleValidateCredentials = useCallback(async () => {
    const currentToken = config.apiToken?.trim() || '';
    const currentPhoneId = config.phoneNumberId?.trim() || '';

    if (!currentToken || !currentPhoneId) {
      return;
    }

    if (isValidationInProgressRef.current || saving || deleting) {
      return;
    }

    if (
      lastValidatedRef.current &&
      lastValidatedRef.current.apiToken === currentToken &&
      lastValidatedRef.current.phoneNumberId === currentPhoneId
    ) {
      return;
    }

    isValidationInProgressRef.current = true;
    setValidating(true);
    setError(null);

    try {
      const result = await whatsappApi.validateCredentials({
        apiToken: currentToken,
        phoneNumberId: currentPhoneId,
      });

      setValidationResult(result);
      lastValidatedRef.current = {
        apiToken: currentToken,
        phoneNumberId: currentPhoneId,
      };
    } catch (err: any) {
      console.error('Erro ao validar credenciais:', err);
      const errorData = err.response?.data || {};
      const validationError = {
        isValid: false,
        errors: errorData.errors || [
          errorData.message || 'Erro ao validar credenciais',
        ],
        warnings: errorData.warnings || [],
        phoneNumberInfo: errorData.phoneNumberInfo || null,
      };
      setValidationResult(validationError);
      lastValidatedRef.current = {
        apiToken: currentToken,
        phoneNumberId: currentPhoneId,
      };
    } finally {
      setValidating(false);
      isValidationInProgressRef.current = false;
    }
  }, [config.apiToken, config.phoneNumberId, saving, deleting]);

  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    if (
      config.apiToken?.trim() &&
      config.phoneNumberId?.trim() &&
      !saving &&
      !deleting &&
      !validating
    ) {
      validationTimeoutRef.current = setTimeout(() => {
        handleValidateCredentials();
      }, 1000);
    } else {
      if (!config.apiToken?.trim() || !config.phoneNumberId?.trim()) {
        setValidationResult(null);
      }
    }

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [
    config.apiToken,
    config.phoneNumberId,
    saving,
    deleting,
    validating,
    handleValidateCredentials,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const configToSend: CreateWhatsAppConfigRequest = { ...config };
    if (typeof configToSend.webhookVerifyToken === 'string') {
      configToSend.webhookVerifyToken =
        normalizeTokenForSave(configToSend.webhookVerifyToken) || '';
    }
    if (existingConfig && (!config.apiToken || !config.apiToken.trim())) {
      delete configToSend.apiToken;
    }

    if (!configToSend.apiToken && !existingConfig) {
      setError('Chave de acesso é obrigatória');
      return;
    }

    if (!config.phoneNumberId || !config.phoneNumberId.trim()) {
      setError('Código do número é obrigatório');
      return;
    }

    // Verificar permissão antes de chamar API
    if (!canManageConfig) {
      setError('Você não tem permissão para salvar configurações WhatsApp.');
      setSaving(false);
      return;
    }

    // Só validar de novo se tiver token novo para testar (nunca usar token mascarado da API)
    const hasNewTokenToValidate =
      configToSend.apiToken && configToSend.apiToken.trim().length > 0;

    if (!validationResult || validationResult.isValid === undefined) {
      // Config existente e usuário deixou token em branco = não chamar validate (evita enviar token mascarado)
      if (existingConfig && !hasNewTokenToValidate) {
        // Manter resultado anterior se existir e era válido; senão seguir para salvar (backend não revalida sem token novo)
        if (validationResult && validationResult.isValid === false) {
          setError('Os dados estão incorretos. Corrija antes de salvar.');
          return;
        }
        // Segue para o save; backend não revalida quando token não é enviado
      } else if (hasNewTokenToValidate) {
        try {
          setValidating(true);
          const result = await whatsappApi.validateCredentials({
            apiToken: configToSend.apiToken!,
            phoneNumberId: config.phoneNumberId,
          });
          setValidationResult(result);

          if (!result.isValid) {
            setError('Os dados estão incorretos. Corrija antes de salvar.');
            showError('Os dados estão incorretos. Corrija antes de salvar.');
            setValidating(false);
            return;
          }
        } catch (err: any) {
          const errorData = err.response?.data || {};
          const validationError = {
            isValid: false,
            errors: errorData.errors || [
              errorData.message || 'Erro ao validar credenciais',
            ],
            warnings: errorData.warnings || [],
            phoneNumberInfo: errorData.phoneNumberInfo || null,
          };
          setValidationResult(validationError);
          const errorMessage =
            errorData.errors?.join('\n') ||
            errorData.message ||
            'Os dados estão incorretos. Corrija antes de salvar.';
          setError(errorMessage);
          showError(errorMessage);
          setValidating(false);
          return;
        } finally {
          setValidating(false);
        }
      } else if (!existingConfig) {
        setError('Chave de acesso é obrigatória');
        return;
      }
    } else if (
      !validationResult.isValid &&
      (hasNewTokenToValidate || !existingConfig)
    ) {
      setError('Os dados estão incorretos. Corrija antes de salvar.');
      showError('Os dados estão incorretos. Corrija antes de salvar.');
      return;
    }

    // Verificar permissão antes de chamar API
    if (!canManageConfig) {
      setError('Você não tem permissão para salvar configurações WhatsApp.');
      setSaving(false);
      return;
    }

    setSaving(true);
    try {
      await whatsappApi.createOrUpdateConfig(configToSend);
      showSuccess('Configuração salva com sucesso!');
      loadConfig();
    } catch (err: any) {
      console.error('Erro ao salvar configuração:', err);
      if (err.response?.status === 403) {
        const errorMsg = 'Você não tem permissão para realizar esta ação.';
        setError(errorMsg);
        showError(errorMsg);
      } else {
        const errorData = err.response?.data || {};
        const errorMessage =
          errorData.errors?.join('\n') ||
          errorData.message ||
          err.message ||
          'Erro ao salvar configuração';
        setError(errorMessage);
        showError(errorMessage);

        if (errorData.validation) {
          setValidationResult({
            isValid: false,
            errors: errorData.errors || [],
            warnings: errorData.warnings || [],
            phoneNumberInfo: errorData.validation.phoneNumberInfo || null,
          });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess(`${label} copiado.`);
    } catch {
      showError('Não foi possível copiar.');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!existingConfig) return;

    // Verificar permissão antes de chamar API
    if (!canManageConfig) {
      setError('Você não tem permissão para remover configurações WhatsApp.');
      setShowDeleteModal(false);
      return;
    }

    setDeleting(true);
    setError(null);
    setShowDeleteModal(false);
    try {
      await whatsappApi.deleteConfig();
      showSuccess('Configuração removida com sucesso!');
      setExistingConfig(null);
      setConfig({
        apiToken: '',
        phoneNumberId: '',
        webhookVerifyToken: '',
        isActive: true,
        autoCreateClient: false,
        autoCreateTask: false,
        enableAIPreAttend: false,
      });
      loadConfig();
    } catch (err: any) {
      console.error('Erro ao remover configuração:', err);
      if (err.response?.status === 403) {
        const errorMsg = 'Você não tem permissão para realizar esta ação.';
        setError(errorMsg);
        showError(errorMsg);
      } else {
        setError(err.message || 'Erro ao remover configuração');
        showError(err.message || 'Erro ao remover configuração');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (!hasAccess) {
    return (
      <Layout>
        <PageContainer>
          <PermissionDeniedContainer>
            <PermissionDeniedIcon>
              <MdLock size={64} color='#EF4444' />
            </PermissionDeniedIcon>
            <PermissionDeniedTitle>Acesso Negado</PermissionDeniedTitle>
            <PermissionDeniedText>
              Você não tem permissão para acessar esta funcionalidade.
              <br />
              <br />
              Entre em contato com o administrador do sistema para solicitar
              acesso.
            </PermissionDeniedText>
            <BackButton
              onClick={() => navigate('/integrations')}
              style={{ marginTop: '24px' }}
            >
              <MdArrowBack size={18} />
              Voltar para Integrações
            </BackButton>
          </PermissionDeniedContainer>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <TitleSection>
              <Title>
                <FaWhatsapp size={32} color='#25D366' />
                Configuração do WhatsApp
              </Title>
              <Subtitle>
                Conecte sua conta do WhatsApp para receber e enviar mensagens
                pelo sistema
              </Subtitle>
            </TitleSection>
            <BackButton onClick={() => navigate('/integrations')}>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </HeaderTop>
        </PageHeader>

        <PageBody>
          {loading ? (
            <WhatsAppConfigShimmer />
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}

              {existingConfig && (
                <InfoBox $variant='success' style={{ marginBottom: '40px' }}>
                  <StatusBadge $isActive={existingConfig.isActive}>
                    {existingConfig.isActive ? (
                      <>
                        <MdCheckCircle size={16} />
                        Configuração Ativa
                      </>
                    ) : (
                      <>
                        <MdWarning size={16} />
                        Configuração Inativa
                      </>
                    )}
                  </StatusBadge>
                </InfoBox>
              )}

              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FaWhatsapp size={20} />
                  </SectionIcon>
                  <SectionTitle>Conectar sua conta WhatsApp</SectionTitle>
                </SectionHeader>

                <FormGroup>
                  <Label>
                    Chave de acesso{' '}
                    {!existingConfig && <span style={{ color: 'red' }}>*</span>}
                  </Label>
                  <HelpText style={{ marginTop: 0, marginBottom: 8 }}>
                    <MdInfo size={14} />
                    <span>
                      É a senha que liga sua conta do WhatsApp Business ao
                      sistema. Sem ela, não conseguimos enviar nem receber
                      mensagens por você. No painel do Facebook
                      (business.facebook.com), vá em Configurações do sistema →
                      WhatsApp e copie a &quot;chave de acesso permanente&quot;.
                      Cole aqui e não compartilhe com ninguém.
                    </span>
                  </HelpText>
                  <PasswordInputWrapper>
                    <Input
                      type={showToken ? 'text' : 'password'}
                      value={config.apiToken || ''}
                      onChange={e => {
                        setConfig({ ...config, apiToken: e.target.value });
                        setValidationResult(null);
                        lastValidatedRef.current = null;
                      }}
                      placeholder={
                        existingConfig
                          ? 'Deixe em branco para não alterar'
                          : 'Cole aqui a chave que você copiou'
                      }
                      required={!existingConfig}
                      disabled={saving || deleting || validating}
                    />
                    <PasswordToggle
                      type='button'
                      onClick={() => setShowToken(!showToken)}
                      disabled={saving || deleting}
                    >
                      {showToken ? (
                        <MdVisibilityOff size={18} />
                      ) : (
                        <MdVisibility size={18} />
                      )}
                    </PasswordToggle>
                  </PasswordInputWrapper>
                  <HelpText>
                    <MdInfo size={14} />
                    {existingConfig &&
                      'Deixe em branco para não alterar a chave atual.'}
                  </HelpText>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Código do seu número <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <HelpText style={{ marginTop: 0, marginBottom: 8 }}>
                    <MdInfo size={14} />
                    <span>
                      É o código que identifica o número do WhatsApp da sua
                      empresa (só números). Sem ele, as mensagens não chegam no
                      lugar certo. No painel do Facebook, em WhatsApp → Números
                      de telefone, clique no seu número e copie o &quot;ID do
                      número&quot;. Cole aqui.
                    </span>
                  </HelpText>
                  <Input
                    type='text'
                    value={config.phoneNumberId || ''}
                    onChange={e => {
                      setConfig({ ...config, phoneNumberId: e.target.value });
                      setValidationResult(null);
                      lastValidatedRef.current = null;
                      if (validationTimeoutRef.current) {
                        clearTimeout(validationTimeoutRef.current);
                        validationTimeoutRef.current = null;
                      }
                    }}
                    placeholder='Ex: 123456789012345'
                    required
                    disabled={saving || deleting || validating}
                  />
                  {validating && (
                    <FormHintText style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <LoadingSpinner
                        style={{
                          width: '14px',
                          height: '14px',
                          borderWidth: '2px',
                        }}
                      />
                      Verificando...
                    </FormHintText>
                  )}
                </FormGroup>

                {validationResult && (
                  <ValidationResult $isValid={validationResult.isValid}>
                    {validationResult.isValid ? (
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>✅</span>
                          <strong
                            style={{ color: theme.colors?.success || '#10B981', fontSize: '1rem' }}
                          >
                            Dados corretos
                          </strong>
                        </div>
                        {validationResult.phoneNumberInfo && (
                          <div
                            style={{
                              marginTop: '12px',
                              fontSize: '0.875rem',
                              color: theme.colors?.textSecondary || '#666',
                            }}
                          >
                            <div style={{ marginBottom: '6px' }}>
                              <strong>Nome aprovado:</strong>{' '}
                              {validationResult.phoneNumberInfo.verifiedName ||
                                'Não disponível'}
                            </div>
                            <div style={{ marginBottom: '6px' }}>
                              <strong>Número:</strong>{' '}
                              {validationResult.phoneNumberInfo
                                .displayPhoneNumber || 'Não disponível'}
                            </div>
                            <div>
                              <strong>Qualidade do número:</strong>{' '}
                              <span
                                style={{
                                  color:
                                    validationResult.phoneNumberInfo
                                      .qualityRating === 'HIGH'
                                      ? (theme.colors?.success || '#10B981')
                                      : validationResult.phoneNumberInfo
                                            .qualityRating === 'MEDIUM'
                                        ? (theme.colors?.warning || '#F59E0B')
                                        : (theme.colors?.error || '#EF4444'),
                                  fontWeight: '600',
                                }}
                              >
                                {validationResult.phoneNumberInfo
                                  .qualityRating || 'Não disponível'}
                              </span>
                            </div>
                          </div>
                        )}
                        {validationResult.warnings &&
                          validationResult.warnings.length > 0 && (
                            <ValidationWarningBox>
                              <strong>⚠️ Avisos:</strong>
                              <ul>
                                {validationResult.warnings.map(
                                  (warning: string, idx: number) => (
                                    <li key={idx}>{warning}</li>
                                  )
                                )}
                              </ul>
                            </ValidationWarningBox>
                          )}
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>❌</span>
                          <strong
                            style={{ color: theme.colors?.error || '#EF4444', fontSize: '1rem' }}
                          >
                            Dados incorretos
                          </strong>
                        </div>
                        {validationResult.errors &&
                          validationResult.errors.length > 0 && (
                            <ul
                              style={{
                                margin: '8px 0 0 0',
                                paddingLeft: '20px',
                                fontSize: '0.875rem',
                                color: theme.colors?.error || '#EF4444',
                              }}
                            >
                              {validationResult.errors.map(
                                (error: string, idx: number) => (
                                  <li key={idx} style={{ marginBottom: '4px' }}>
                                    {error}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        {validationResult.warnings &&
                          validationResult.warnings.length > 0 && (
                            <ValidationWarningBox>
                              <strong>⚠️ Avisos:</strong>
                              <ul>
                                {validationResult.warnings.map(
                                  (warning: string, idx: number) => (
                                    <li key={idx}>{warning}</li>
                                  )
                                )}
                              </ul>
                            </ValidationWarningBox>
                          )}
                      </div>
                    )}
                  </ValidationResult>
                )}
              </Section>

              {(existingConfig || config.phoneNumberId) && (
                <Section>
                  <SectionHeader>
                    <SectionIcon>
                      <FaWhatsapp size={20} />
                    </SectionIcon>
                    <SectionTitle>Cadastrar no painel do Facebook</SectionTitle>
                  </SectionHeader>
                  <HelpText style={{ paddingLeft: 0, marginBottom: 16 }}>
                    <MdInfo size={14} />
                    Para as mensagens do WhatsApp aparecerem aqui, você precisa
                    cadastrar os dados abaixo no painel do Facebook onde está
                    seu WhatsApp (Configuração do app → Webhook).
                  </HelpText>
                  <FormGroup>
                    <Label>Endereço para receber mensagens</Label>
                    <HelpText style={{ marginTop: 0, marginBottom: 8 }}>
                      <MdInfo size={14} />
                      <span>
                        É o endereço que o WhatsApp usa para enviar as mensagens
                        que chegam no seu número para cá. Sem cadastrar no
                        painel do Facebook, as mensagens não aparecem aqui. No
                        painel do Facebook, vá em WhatsApp → Configuração do app
                        → Webhook. No campo &quot;URL de callback&quot;, cole o
                        endereço abaixo e clique em Verificar (use a senha de
                        verificação logo abaixo).
                      </span>
                    </HelpText>
                    <UrlCard>
                      <UrlText>{getApiUrl('whatsapp/webhook')}</UrlText>
                      <CopyButton
                        type='button'
                        onClick={() =>
                          copyToClipboard(
                            getApiUrl('whatsapp/webhook'),
                            'Endereço'
                          )
                        }
                        title='Copiar endereço'
                      >
                        <MdContentCopy size={16} /> Copiar
                      </CopyButton>
                    </UrlCard>
                  </FormGroup>
                  <FormGroup>
                    <Label>Senha de verificação</Label>
                    <HelpText style={{ marginTop: 0, marginBottom: 8 }}>
                      <MdInfo size={14} />
                      <span>
                        É uma senha que você inventa para o Facebook confirmar
                        que é você. Cada empresa usa a sua. Escolha uma senha
                        (ex: minha-senha-whatsapp), salve aqui. No painel do
                        Facebook, em Webhook, no campo &quot;Token de
                        verificação&quot;, cole exatamente a mesma senha e
                        clique em Verificar e salvar.
                      </span>
                    </HelpText>
                    {(existingConfig?.webhookVerifyToken ??
                    config.webhookVerifyToken) ? (
                      <>
                        <UrlCard>
                          <UrlText>
                            {(existingConfig?.webhookVerifyToken ??
                              config.webhookVerifyToken) ||
                              ''}
                          </UrlText>
                          <CopyButton
                            type='button'
                            onClick={() =>
                              copyToClipboard(
                                (existingConfig?.webhookVerifyToken ??
                                  config.webhookVerifyToken) ||
                                  '',
                                'Senha de verificação'
                              )
                            }
                          >
                            <MdContentCopy size={16} /> Copiar
                          </CopyButton>
                        </UrlCard>
                        <UrlHowItWorks>
                          No painel do Facebook (Webhook → Editar), no campo
                          &quot;Token de verificação&quot;, cole exatamente o
                          valor acima e clique em Verificar e salvar.
                        </UrlHowItWorks>
                      </>
                    ) : (
                      <>
                        <Input
                          type='text'
                          value={config.webhookVerifyToken || ''}
                          onChange={e =>
                            setConfig({
                              ...config,
                              webhookVerifyToken: normalizeTokenForIntegration(
                                e.target.value
                              ),
                            })
                          }
                          placeholder='Ex: minha-senha-whatsapp'
                          disabled={saving || deleting}
                        />
                        <HelpText>
                          <MdInfo size={14} />
                          Escolha uma senha e salve aqui. Depois use exatamente
                          a mesma senha no painel do Facebook, no campo
                          &quot;Token de verificação&quot;. Cada empresa tem a
                          sua.
                        </HelpText>
                      </>
                    )}
                  </FormGroup>
                </Section>
              )}

              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <MdInfo size={20} />
                  </SectionIcon>
                  <SectionTitle>Outras informações</SectionTitle>
                </SectionHeader>

                <FormGroup>
                  <Label>
                    Número de Telefone{' '}
                    <OptionalLabel>(opcional)</OptionalLabel>
                  </Label>
                  <Input
                    type='text'
                    value={config.phoneNumber || ''}
                    onChange={e => {
                      const masked = maskPhoneAuto(e.target.value);
                      setConfig({ ...config, phoneNumber: masked });
                    }}
                    placeholder='(11) 99999-9999'
                    disabled={saving || deleting}
                    maxLength={15}
                  />
                  <HelpText>
                    <MdInfo size={14} />
                    Só para você identificar na lista (não é usado para enviar
                    mensagens).
                  </HelpText>
                </FormGroup>

                <FormGroup>
                  <Label>
                    Nome do negócio{' '}
                    <OptionalLabel>(opcional)</OptionalLabel>
                  </Label>
                  <Input
                    type='text'
                    value={config.businessName || ''}
                    onChange={e =>
                      setConfig({ ...config, businessName: e.target.value })
                    }
                    placeholder='Minha Imobiliária'
                    disabled={saving || deleting}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    Funil para novas conversas{' '}
                    <span style={{ color: 'red', fontWeight: 'normal' }}>
                      *
                    </span>
                  </Label>
                  <Select
                    value={config.defaultProjectId || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const value = e.target.value || undefined;
                      setConfig(prev => ({ ...prev, defaultProjectId: value }));
                    }}
                    disabled={saving || deleting || loadingProjects}
                    required
                  >
                    <option value=''>Selecione o funil</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                  <HelpText>
                    <MdInfo size={14} />
                    <div>
                      <strong>Importante:</strong> O sistema usa este funil para
                      criar as tarefas que vêm do WhatsApp.
                      <br />
                      <strong style={{ display: 'block', marginTop: '4px' }}>
                        Sem um funil escolhido, não é possível criar tarefas a
                        partir das mensagens.
                      </strong>
                      <br />A nova tarefa aparece automaticamente no início do
                      funil.
                    </div>
                  </HelpText>
                  {loadingProjects && (
                    <FormHintText style={{ marginTop: '8px' }}>
                      Carregando funis...
                    </FormHintText>
                  )}
                </FormGroup>

                <AutoActionsSection>
                  <AutoActionsTitle>Pré-atendimento</AutoActionsTitle>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '16px', padding: '16px', borderRadius: '12px', background: (config.chatbotEnabled || config.enableAIPreAttend) ? 'rgba(37, 211, 102, 0.08)' : '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <input
                      type='checkbox'
                      checked={config.chatbotEnabled === true || config.enableAIPreAttend === true}
                      onChange={e => {
                        const want = e.target.checked;
                        if (want) {
                          setConfig({ ...config, chatbotEnabled: true, enableAIPreAttend: false });
                        } else {
                          setConfig({ ...config, chatbotEnabled: false, enableAIPreAttend: false });
                        }
                      }}
                      disabled={saving || deleting}
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>Quer ativar pré-atendimento automático?</span>
                      <FormHintText style={{ marginTop: '4px', marginBottom: 0 }}>
                        Se sim, é obrigatório escolher um: Chatbot (padrão) ou Pré-atendimento com IA. Por padrão usamos Chatbot.
                      </FormHintText>
                    </div>
                  </label>

                  {(config.chatbotEnabled || config.enableAIPreAttend) && (
                  <>
                  <PreAttendOptionCard>
                    <FormLabelText style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <MdSmartToy size={20} />
                      Chatbot
                    </FormLabelText>
                    <FormHintText style={{ marginBottom: '12px' }}>
                      Resposta automática com mensagens em ordem fixa. Escolha um template e, se quiser, troque uma mensagem por outra na mesma posição (a ordem não muda).
                    </FormHintText>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
                      <input
                        type='checkbox'
                        checked={config.chatbotEnabled === true}
                        onChange={e => setConfig({ ...config, chatbotEnabled: e.target.checked })}
                        disabled={saving || deleting || config.enableAIPreAttend === true}
                      />
                      <span style={{ fontWeight: 500 }}>Usar Chatbot (padrão)</span>
                    </label>

                    <FormHintText style={{ marginBottom: '8px' }}>Template (ordem pronta):</FormHintText>
                    <ChatbotTemplateGrid>
                      {CHATBOT_TEMPLATES.map(tpl => {
                        const current = config.chatbotMessages || [];
                        const isSelected =
                          current.length === tpl.messages.length &&
                          tpl.messages.every((msg, i) => (current[i]?.text || '').trim() === msg.trim());
                        return (
                          <ChatbotTemplateCard
                            key={tpl.id}
                            type='button'
                            $selected={isSelected}
                            disabled={saving || deleting}
                            onClick={() => {
                              setConfig({
                                ...config,
                                chatbotMessages: tpl.messages.slice(0, MAX_CHATBOT_MESSAGES).map(text => ({ text })),
                              });
                              setChatbotReplaceSlot(null);
                            }}
                          >
                            {tpl.name}
                            <ChatbotTemplateCardSub>{tpl.messages.length} mensagens</ChatbotTemplateCardSub>
                          </ChatbotTemplateCard>
                        );
                      })}
                    </ChatbotTemplateGrid>

                    <FormHintText style={{ marginBottom: '8px' }}>
                      Mensagens na ordem de envio. Para alterar, use &quot;Trocar&quot; na posição (a ordem é mantida).
                    </FormHintText>
                    <div style={{ marginBottom: '10px' }}>
                      {(config.chatbotMessages || []).map((item, index) => (
                        <div key={index}>
                          <ChatbotSlotRow>
                            <ChatbotSlotLabel>{index + 1}ª</ChatbotSlotLabel>
                            <ChatbotSlotText>{item.text || ''}</ChatbotSlotText>
                            <ChatbotReplaceBtn
                              type='button'
                              onClick={() => setChatbotReplaceSlot(chatbotReplaceSlot === index ? null : index)}
                              disabled={saving || deleting}
                              title='Trocar esta mensagem por outra (mesma posição)'
                            >
                              Trocar
                            </ChatbotReplaceBtn>
                          </ChatbotSlotRow>
                          {chatbotReplaceSlot === index && (
                            <ChatbotReplaceDropdown>
                              {CHATBOT_OPTIONS_FOR_REPLACE.map((text, idx) => (
                                <ChatbotReplaceOption
                                  key={idx}
                                  type='button'
                                  onClick={() => {
                                    const list = [...(config.chatbotMessages || [])];
                                    if (list[index]) {
                                      list[index] = { text };
                                      setConfig({ ...config, chatbotMessages: list });
                                    }
                                    setChatbotReplaceSlot(null);
                                  }}
                                >
                                  {text}
                                </ChatbotReplaceOption>
                              ))}
                            </ChatbotReplaceDropdown>
                          )}
                        </div>
                      ))}
                    </div>
                    {(config.chatbotMessages?.length ?? 0) === 0 && (
                      <FormHintText style={{ marginTop: '8px' }}>
                        Escolha um template acima. Se não houver mensagens, o sistema envia: &quot;Obrigado pelo contato. Em breve nossa equipe responderá.&quot;
                      </FormHintText>
                    )}
                  </PreAttendOptionCard>

                  <PreAttendOptionCard>
                    <FormLabelText style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <MdSmartToy size={20} style={{ opacity: 0.9 }} />
                      Pré-atendimento com IA
                    </FormLabelText>
                    <FormHintText style={{ marginBottom: '8px' }}>
                      A IA qualifica o lead, responde 24/7 no WhatsApp e pode enviar sugestões de imóveis (Ver imóveis) com botões para falar com atendente. Menos leads perdidos e primeiro contato sempre humanizado. Se a IA estiver ativa, o Chatbot fica desativado.
                    </FormHintText>
                    {config.enableAIPreAttend ? (
                      <>
                        <FormHintText style={{ color: '#059669', fontWeight: 500, marginBottom: '16px' }}>
                          Pré-atendimento com IA está ativo para sua empresa.
                        </FormHintText>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '16px' }}>
                          <input
                            type='checkbox'
                            checked={config.aiPreAttendScheduleEnabled === true}
                            onChange={e => setConfig({
                              ...config,
                              aiPreAttendScheduleEnabled: e.target.checked,
                              ...(e.target.checked && {
                                aiPreAttendStartTime: config.aiPreAttendStartTime || '09:00',
                                aiPreAttendEndTime: config.aiPreAttendEndTime || '18:00',
                                aiPreAttendDays: (config.aiPreAttendDays?.length ? config.aiPreAttendDays : [1, 2, 3, 4, 5]),
                                aiPreAttendTimezone: config.aiPreAttendTimezone || 'America/Sao_Paulo',
                              }),
                            })}
                            disabled={saving || deleting}
                            style={{ marginTop: '2px' }}
                          />
                          <span style={{ fontWeight: 500 }}>Restringir horário e dias de atendimento da IA</span>
                        </label>
                        {config.aiPreAttendScheduleEnabled && (
                          <AIPreAttendScheduleCard>
                            <ScheduleSectionLabel>Horário de atendimento (sua região)</ScheduleSectionLabel>
                            <ScheduleRow>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#374151' }}>
                                <span>Das</span>
                                <ScheduleTimeInput
                                  type='time'
                                  value={config.aiPreAttendStartTime || '09:00'}
                                  onChange={e => setConfig({ ...config, aiPreAttendStartTime: e.target.value || null })}
                                  disabled={saving || deleting}
                                />
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#374151' }}>
                                <span>às</span>
                                <ScheduleTimeInput
                                  type='time'
                                  value={config.aiPreAttendEndTime || '18:00'}
                                  onChange={e => setConfig({ ...config, aiPreAttendEndTime: e.target.value || null })}
                                  disabled={saving || deleting}
                                />
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#374151' }}>
                                <span>Fuso</span>
                                <ScheduleSelect
                                  value={config.aiPreAttendTimezone || 'America/Sao_Paulo'}
                                  onChange={e => setConfig({ ...config, aiPreAttendTimezone: e.target.value || null })}
                                  disabled={saving || deleting}
                                >
                                  <option value='America/Sao_Paulo'>São Paulo (BR)</option>
                                  <option value='America/Manaus'>Manaus (BR)</option>
                                  <option value='America/Fortaleza'>Fortaleza (BR)</option>
                                  <option value='America/Recife'>Recife (BR)</option>
                                  <option value='America/Noronha'>Fernando de Noronha (BR)</option>
                                </ScheduleSelect>
                              </label>
                            </ScheduleRow>
                            <ScheduleSectionLabel>Dias em que a IA atende</ScheduleSectionLabel>
                            <DayChipsWrap>
                              {[
                                { value: 0, label: 'Dom' },
                                { value: 1, label: 'Seg' },
                                { value: 2, label: 'Ter' },
                                { value: 3, label: 'Qua' },
                                { value: 4, label: 'Qui' },
                                { value: 5, label: 'Sex' },
                                { value: 6, label: 'Sáb' },
                              ].map(({ value, label }) => {
                                const days = config.aiPreAttendDays ?? [];
                                const selected = days.includes(value);
                                return (
                                  <DayChip key={value} $selected={selected}>
                                    <input
                                      type='checkbox'
                                      checked={selected}
                                      onChange={() => {
                                        const next = selected ? days.filter(d => d !== value) : [...days, value].sort((a, b) => a - b);
                                        setConfig({ ...config, aiPreAttendDays: next.length ? next : null });
                                      }}
                                      disabled={saving || deleting}
                                    />
                                    {label}
                                  </DayChip>
                                );
                              })}
                            </DayChipsWrap>
                            <ScheduleHint>
                              Fora do horário e dos dias selecionados, a IA não responderá; o chatbot ou o atendimento humano podem atender.
                            </ScheduleHint>
                          </AIPreAttendScheduleCard>
                        )}
                      </>
                    ) : (
                      <>
                        <FormHintText>
                          Quer conhecer melhor? A mensagem abaixo será enviada no chat para nossa equipe.
                        </FormHintText>
                        <SupportChatBtn
                          type='button'
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent('open-chat', {
                                detail: {
                                  initialMessage:
                                    'Olá! Gostaria de conhecer o pré-atendimento com IA no WhatsApp: qualificação de leads, respostas automáticas e envio de imóveis com botão para falar com atendente. Podem me contar como funciona?',
                                },
                              })
                            );
                          }}
                        >
                          <MdSupport size={20} />
                          Quero saber mais sobre a IA
                        </SupportChatBtn>
                      </>
                    )}
                  </PreAttendOptionCard>
                  </>
                  )}

                  <AutoActionsTitle style={{ marginTop: '24px' }}>⚙️ O que o sistema pode fazer sozinho</AutoActionsTitle>

                  <FormGroup style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type='checkbox'
                        checked={config.autoCreateClient ?? false}
                        onChange={e => setConfig({ ...config, autoCreateClient: e.target.checked })}
                        disabled={saving || deleting}
                        style={{ marginTop: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <FormLabelText>Criar cliente automaticamente</FormLabelText>
                        <FormHintText>
                          Se ativado, ao receber uma mensagem o sistema cria um cliente sozinho, usando os dados da conversa.
                          <FormWarningStrong>Recomendado: deixar desativado para você decidir quando cadastrar cada cliente.</FormWarningStrong>
                        </FormHintText>
                      </div>
                    </label>
                  </FormGroup>

                  <FormGroup style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type='checkbox'
                        checked={config.autoCreateTask ?? false}
                        onChange={e => setConfig({ ...config, autoCreateTask: e.target.checked })}
                        disabled={saving || deleting}
                        style={{ marginTop: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <FormLabelText>Criar tarefa no funil automaticamente</FormLabelText>
                        <FormHintText>
                          Se ativado, ao receber uma mensagem o sistema cria uma tarefa no funil sozinho.
                          <FormWarningStrong>Recomendado: deixar desativado para você decidir quando criar cada tarefa.</FormWarningStrong>
                        </FormHintText>
                      </div>
                    </label>
                  </FormGroup>

                </AutoActionsSection>

                <FormGroup>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={config.isActive !== false}
                      onChange={e =>
                        setConfig({ ...config, isActive: e.target.checked })
                      }
                      disabled={saving || deleting}
                    />
                    <span>Configuração ativa</span>
                  </label>
                </FormGroup>
              </Section>

              {existingConfig && canManageConfig && (
                <DangerZone>
                  <DangerZoneTitle>Zona de Perigo</DangerZoneTitle>
                  <DangerZoneDescription>
                    Esta ação é irreversível. Ao remover a configuração, você
                    perderá todas as integrações do WhatsApp e precisará
                    configurar novamente.
                  </DangerZoneDescription>
                  <Button
                    type='button'
                    $variant='danger'
                    onClick={handleDeleteClick}
                    disabled={deleting || saving}
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '14px 24px',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    {deleting ? (
                      <>
                        <LoadingSpinner
                          style={{
                            width: '18px',
                            height: '18px',
                            borderWidth: '2.5px',
                          }}
                        />
                        Removendo...
                      </>
                    ) : (
                      <>
                        <MdDelete size={20} />
                        Remover Configuração
                      </>
                    )}
                  </Button>
                </DangerZone>
              )}

                <FooterActions>
                  <Button
                    type='button'
                    $variant='secondary'
                    onClick={() => navigate('/integrations')}
                    disabled={saving || deleting}
                  >
                    Cancelar
                  </Button>
                  {canManageConfig ? (
                    <Button
                      type='submit'
                      $variant='primary'
                      disabled={
                        saving ||
                        deleting ||
                        validating ||
                        (!existingConfig &&
                          (!config.apiToken || !config.apiToken.trim())) ||
                        !config.phoneNumberId ||
                        !config.phoneNumberId.trim() ||
                        (existingConfig
                          ? (config.phoneNumberId !==
                              existingConfig.phoneNumberId ||
                              !!config.apiToken?.trim()) &&
                            (!validationResult || !validationResult.isValid)
                          : !validationResult || !validationResult.isValid)
                      }
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner
                            style={{
                              width: '16px',
                              height: '16px',
                              borderWidth: '2px',
                            }}
                          />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <MdSave size={18} />
                          {existingConfig
                            ? 'Atualizar Configuração'
                            : 'Salvar Configuração'}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type='button'
                      $variant='secondary'
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      <MdLock size={18} />
                      Sem Permissão
                    </Button>
                  )}
                </FooterActions>
            </form>
          )}
        </PageBody>

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title='Remover Configuração WhatsApp'
          message='Tem certeza que deseja remover a configuração do WhatsApp? Esta ação não pode ser desfeita.'
          isLoading={deleting}
          confirmLabel='Remover Configuração'
          loadingLabel='Removendo...'
        />
      </PageContainer>
    </Layout>
  );
};

export default WhatsAppConfigPage;
