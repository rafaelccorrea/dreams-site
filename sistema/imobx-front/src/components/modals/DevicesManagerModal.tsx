import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdDevices, MdDelete } from 'react-icons/md';

interface DeviceItem {
  deviceId: string;
  name: string;
  ip?: string;
  lastActive: string;
  current?: boolean;
}

interface DevicesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDevices: () => Promise<DeviceItem[]>;
  onRevoke: (deviceId: string) => Promise<void>;
}

export const DevicesManagerModal: React.FC<DevicesManagerModalProps> = ({
  isOpen,
  onClose,
  onLoadDevices,
  onRevoke,
}) => {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isOpen) return;
      setLoading(true);
      setError(null);
      try {
        const list = await onLoadDevices();
        setDevices(list);
      } catch (e: any) {
        setError(e?.message || 'Não foi possível carregar dispositivos.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, onLoadDevices]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <MdDevices /> Dispositivos
          </Title>
          <CloseBtn onClick={onClose}>
            <MdClose size={20} />
          </CloseBtn>
        </Header>
        <Body>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : devices.length === 0 ? (
            <Empty>Sem dispositivos cadastrados.</Empty>
          ) : (
            <List>
              {devices.map(d => (
                <Item key={d.deviceId}>
                  <Info>
                    <Name>
                      {d.name} {d.current && <CurrentTag>Atual</CurrentTag>}
                    </Name>
                    <Meta>
                      IP: {d.ip || '-'} • Último acesso:{' '}
                      {new Date(d.lastActive).toLocaleString('pt-BR')}
                    </Meta>
                  </Info>
                  <Actions>
                    <RevokeBtn
                      disabled={!!d.current}
                      onClick={async () => {
                        await onRevoke(d.deviceId);
                        setDevices(prev =>
                          prev.filter(x => x.deviceId !== d.deviceId)
                        );
                      }}
                    >
                      <MdDelete /> Revogar
                    </RevokeBtn>
                  </Actions>
                </Item>
              ))}
            </List>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  width: 100%;
  max-width: 720px;
  max-height: 85vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  margin: 0;
  display: flex;
  gap: 8px;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  border-radius: 6px;
  padding: 6px;
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const Body = styled.div`
  padding: 16px 18px 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
`;

const Info = styled.div``;

const Name = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RevokeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CurrentTag = styled.span`
  background: #10b98120;
  color: #10b981;
  border: 1px solid #10b98155;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.75rem;
  margin-left: 6px;
`;

const ErrorText = styled.div`
  color: #ef4444;
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;
