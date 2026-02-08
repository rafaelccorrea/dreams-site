import React from 'react';
import styled from 'styled-components';
import { MdEmail, MdPhone } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.primary};
    transform: translateX(2px);
  }

  svg {
    flex-shrink: 0;
  }
`;

const WhatsAppLink = styled(ContactLink)`
  &:hover {
    color: #25d366;
    background: #25d36610;
  }
`;

const EmailLink = styled(ContactLink)`
  &:hover {
    color: #ea4335;
    background: #ea433510;
  }
`;

interface ClickableEmailProps {
  email: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

interface ClickablePhoneProps {
  phone: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const ClickableEmail: React.FC<ClickableEmailProps> = ({
  email,
  showIcon = true,
  children,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
      '_blank'
    );
  };

  return (
    <EmailLink
      href={`mailto:${email}`}
      onClick={handleClick}
      title={`Enviar email para ${email}`}
    >
      {showIcon && <MdEmail size={16} />}
      {children || email}
    </EmailLink>
  );
};

export const ClickablePhone: React.FC<ClickablePhoneProps> = ({
  phone,
  showIcon = true,
  children,
}) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${cleanPhone}`;

  return (
    <WhatsAppLink
      href={whatsappUrl}
      target='_blank'
      rel='noopener noreferrer'
      title={`Abrir WhatsApp com ${phone}`}
    >
      {showIcon && <FaWhatsapp size={16} />}
      {children || phone}
    </WhatsAppLink>
  );
};

// Componente composto para exibir email e telefone juntos
interface ContactInfoProps {
  email?: string;
  phone?: string;
  layout?: 'horizontal' | 'vertical';
}

const ContactInfoContainer = styled.div<{ $layout: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${props => (props.$layout === 'vertical' ? 'column' : 'row')};
  gap: ${props => (props.$layout === 'vertical' ? '8px' : '16px')};
  align-items: ${props =>
    props.$layout === 'vertical' ? 'flex-start' : 'center'};
  flex-wrap: wrap;
`;

export const ContactInfo: React.FC<ContactInfoProps> = ({
  email,
  phone,
  layout = 'horizontal',
}) => {
  return (
    <ContactInfoContainer $layout={layout}>
      {email && <ClickableEmail email={email} />}
      {phone && <ClickablePhone phone={phone} />}
    </ContactInfoContainer>
  );
};
