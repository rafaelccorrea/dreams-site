import React from 'react';
import { MdQrCode, MdKey, MdEdit, MdShare, MdPrint } from 'react-icons/md';
import {
  ActionsContainer,
  ActionButton,
  ActionGroup,
  ActionTitle,
} from './PropertyActionsStyles';

interface PropertyActionsProps {
  property: any;
  keyStatus?: any;
  onManageKeys?: () => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  property,
  keyStatus,
  onManageKeys,
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira esta propriedade: ${property.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleQRCode = () => {
    // Gerar QR Code com link da propriedade
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`;

    // Abrir em nova janela
    window.open(qrCodeUrl, '_blank', 'width=400,height=400');
  };

  return (
    <ActionsContainer>
      <ActionGroup>
        <ActionTitle>Ações Rápidas</ActionTitle>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Gerenciar Chaves */}
          <ActionButton
            onClick={onManageKeys}
            style={{
              background: keyStatus ? '#10B981' : '#6B7280',
              color: 'white',
            }}
          >
            <MdKey size={18} />
            {keyStatus ? 'Chaves Ativas' : 'Gerenciar Chaves'}
          </ActionButton>

          {/* Compartilhar */}
          <ActionButton
            onClick={handleShare}
            style={{
              background: '#3B82F6',
              color: 'white',
            }}
          >
            <MdShare size={18} />
            Compartilhar
          </ActionButton>

          {/* QR Code */}
          <ActionButton
            onClick={handleQRCode}
            style={{
              background: '#8B5CF6',
              color: 'white',
            }}
          >
            <MdQrCode size={18} />
            QR Code
          </ActionButton>

          {/* Imprimir */}
          <ActionButton
            onClick={handlePrint}
            style={{
              background: '#F59E0B',
              color: 'white',
            }}
          >
            <MdPrint size={18} />
            Imprimir
          </ActionButton>
        </div>
      </ActionGroup>

      {/* Informações da Chave */}
      {keyStatus && (
        <ActionGroup>
          <ActionTitle>🔑 Informações da Chave</ActionTitle>
          <div
            style={{
              background: '#10B98120',
              border: '1px solid #10B981',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
            }}
          >
            <div
              style={{
                fontWeight: '600',
                color: '#10B981',
                marginBottom: '4px',
              }}
            >
              ✅ Chave Disponível
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              Status:{' '}
              {keyStatus.status === 'available' ? 'Disponível' : 'Em uso'}
              <br />
              Última atualização:{' '}
              {new Date(keyStatus.updatedAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </ActionGroup>
      )}

      {/* Informações do Sistema */}
      <ActionGroup>
        <ActionTitle>ℹ️ Dados Técnicos</ActionTitle>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div>
            <strong>ID:</strong> {property.id.substring(0, 8)}...
          </div>
          <div>
            <strong>Empresa:</strong> {property.companyId?.substring(0, 8)}...
          </div>
          <div>
            <strong>Criado:</strong>{' '}
            {new Date(property.createdAt).toLocaleDateString('pt-BR')}
          </div>
          <div>
            <strong>Atualizado:</strong>{' '}
            {new Date(property.updatedAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </ActionGroup>
    </ActionsContainer>
  );
};

export default PropertyActions;
