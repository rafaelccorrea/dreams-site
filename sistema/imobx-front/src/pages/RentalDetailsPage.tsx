import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { rentalService } from '@/services/rental.service';
import type {
  Rental,
  RentalPayment,
  UpdatePaymentRequest,
} from '@/types/rental.types';
import {
  PaymentStatus,
  PaymentStatusLabels,
  PaymentStatusColors,
  RentalStatusLabels,
  RentalStatusColors,
  PaymentMethodLabels as PMLabels,
} from '@/types/rental.types';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdEdit,
  MdPayment,
  MdCheck,
  MdHome,
  MdContactMail,
  MdPhone,
  MdCalendarToday,
  MdDescription,
  MdLocationOn,
  MdBed,
  MdWc,
  MdDirectionsCar,
  MdSquareFoot,
} from 'react-icons/md';
import { RentalDetailsShimmer } from '@/components/shimmer/RentalDetailsShimmer';
import { maskCPF, maskCNPJ, maskPhone } from '@/utils/masks';
import { PermissionButton } from '@/components/common/PermissionButton';

export const RentalDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayments, setProcessingPayments] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    loadRental();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRental = async () => {
    if (!id) return;
    try {
      const data = await rentalService.getById(id);
      setRental(data);
    } catch {
      toast.error('Erro ao carregar aluguel');
      navigate('/rentals');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async (
    paymentId: string,
    data: UpdatePaymentRequest
  ) => {
    if (!id) return;

    // Adicionar paymentId ao set de processamento
    setProcessingPayments(prev => new Set(prev).add(paymentId));

    try {
      await rentalService.updatePayment(id, paymentId, data);
      toast.success('Pagamento atualizado com sucesso');
      loadRental();
    } catch {
      toast.error('Erro ao atualizar pagamento');
    } finally {
      // Remover paymentId do set de processamento
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const handleMarkAsPaid = (payment: RentalPayment) => {
    handlePaymentUpdate(payment.id, {
      status: PaymentStatus.PAID,
      paymentDate: new Date().toISOString().split('T')[0],
      paidValue: payment.value,
    });
  };

  const getStatusLabel = (status: string) => {
    return (
      PaymentStatusLabels[status as keyof typeof PaymentStatusLabels] || status
    );
  };

  const getStatusColor = (status: string) => {
    return (
      PaymentStatusColors[status as keyof typeof PaymentStatusColors] ||
      '#6b7280'
    );
  };

  const getRentalStatusLabel = (status: string) => {
    return (
      RentalStatusLabels[status as keyof typeof RentalStatusLabels] || status
    );
  };

  const getRentalStatusColor = (status: string) => {
    return (
      RentalStatusColors[status as keyof typeof RentalStatusColors] || '#6b7280'
    );
  };

  const formatPhone = (phone: string) => {
    if (!phone) return 'N/A';
    return maskPhone(phone);
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatMonth = (referenceMonth: string) => {
    if (!referenceMonth) return 'N/A';
    const [year, month] = referenceMonth.split('-');
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const formatDocument = (document: string) => {
    if (!document) return 'N/A';

    const cleaned = document.replace(/[^A-Za-z0-9]/g, '');
    const hasLetters = /[A-Za-z]/.test(cleaned);

    if (hasLetters) {
      return maskCNPJ(document);
    } else if (cleaned.length <= 11) {
      return maskCPF(document);
    } else {
      return maskCNPJ(document);
    }
  };

  if (loading)
    return (
      <Layout>
        <RentalDetailsShimmer />
      </Layout>
    );
  if (!rental)
    return (
      <Layout>
        <ErrorContainer>Aluguel não encontrado</ErrorContainer>
      </Layout>
    );

  return (
    <Layout>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/rentals')}>
            <MdArrowBack /> Voltar
          </BackButton>
          <PermissionButton
            permission='rental:update'
            onClick={() => navigate(`/rentals/${id}/edit`)}
            variant='primary'
            tooltip='Editar aluguel'
          >
            <MdEdit /> Editar
          </PermissionButton>
        </Header>

        {/* Status Card */}
        <StatusCard>
          <StatusInfo>
            <StatusLabel>Status do Contrato</StatusLabel>
            <StatusBadge $color={getRentalStatusColor(rental.status)}>
              {getRentalStatusLabel(rental.status)}
            </StatusBadge>
          </StatusInfo>
          <StatusInfo>
            <StatusLabel>Geração Automática</StatusLabel>
            <StatusBadge
              $color={rental.autoGeneratePayments ? '#10b981' : '#6b7280'}
            >
              {rental.autoGeneratePayments ? 'Ativada' : 'Desativada'}
            </StatusBadge>
          </StatusInfo>
        </StatusCard>

        {/* Main Info Grid */}
        <MainGrid>
          {/* Tenant Information */}
          <Card>
            <CardTitle>
              <MdContactMail /> Informações do Inquilino
            </CardTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Nome Completo</InfoLabel>
                <InfoValue>{rental.tenantName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Documento</InfoLabel>
                <InfoValue>{formatDocument(rental.tenantDocument)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <MdPhone /> Telefone
                </InfoLabel>
                <InfoValue>{formatPhone(rental.tenantPhone || '')}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <MdContactMail /> E-mail
                </InfoLabel>
                <InfoValue>{rental.tenantEmail || 'N/A'}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardTitle>
              <MdCalendarToday /> Informações do Contrato
            </CardTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Valor Mensal</InfoLabel>
                <InfoValue style={{ fontSize: '1.25rem', color: '#10b981' }}>
                  R$ {rental.monthlyValue.toFixed(2)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Valor do Depósito</InfoLabel>
                <InfoValue>
                  R$ {(rental.depositValue || 0).toFixed(2)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Data de Início</InfoLabel>
                <InfoValue>{formatDate(rental.startDate)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Data de Término</InfoLabel>
                <InfoValue>{formatDate(rental.endDate)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Dia de Vencimento</InfoLabel>
                <InfoValue>Dia {rental.dueDay}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Período</InfoLabel>
                <InfoValue>
                  {formatDate(rental.startDate)} até{' '}
                  {formatDate(rental.endDate)}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </Card>
        </MainGrid>

        {/* Property Information */}
        {rental.property && (
          <Card>
            <CardTitle>
              <MdHome /> Informações da Propriedade
            </CardTitle>
            <PropertyContainer>
              {rental.property.mainImage && (
                <PropertyImage
                  src={rental.property.mainImage.fileUrl}
                  alt={rental.property.title}
                />
              )}
              <PropertyInfo>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Nome</InfoLabel>
                    <InfoValue>{rental.property.title}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Código</InfoLabel>
                    <InfoValue>{rental.property.code}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Tipo</InfoLabel>
                    <InfoValue>
                      {rental.property.type === 'house'
                        ? 'Casa'
                        : 'Apartamento'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem style={{ gridColumn: 'span 2' }}>
                    <InfoLabel>
                      <MdLocationOn /> Endereço
                    </InfoLabel>
                    <InfoValue>{rental.property.address}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Bairro</InfoLabel>
                    <InfoValue>{rental.property.neighborhood}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Cidade / UF</InfoLabel>
                    <InfoValue>
                      {rental.property.city} / {rental.property.state}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>
                      <MdBed /> Quartos
                    </InfoLabel>
                    <InfoValue>{rental.property.bedrooms}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>
                      <MdWc /> Banheiros
                    </InfoLabel>
                    <InfoValue>{rental.property.bathrooms}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>
                      <MdDirectionsCar /> Vagas
                    </InfoLabel>
                    <InfoValue>{rental.property.parkingSpaces}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>
                      <MdSquareFoot /> Área Total
                    </InfoLabel>
                    <InfoValue>{rental.property.totalArea} m²</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </PropertyInfo>
            </PropertyContainer>
          </Card>
        )}

        {/* Observations */}
        {rental.observations && (
          <Card>
            <CardTitle>
              <MdDescription /> Observações
            </CardTitle>
            <ObservationsText>{rental.observations}</ObservationsText>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <GenerateButton
              onClick={() => {
                if (window.confirm('Gerar pagamentos automáticos?')) {
                  rentalService.generatePayments(id!).then(() => {
                    toast.success('Pagamentos gerados!');
                    loadRental();
                  });
                }
              }}
            >
              <MdPayment /> Gerar Pagamentos
            </GenerateButton>
          </CardHeader>

          <PaymentsTable>
            <thead>
              <tr>
                <th>Referência</th>
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Valor Pago</th>
                <th>Método</th>
                <th>Data Pagamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rental.payments && rental.payments.length > 0 ? (
                rental.payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{formatMonth(payment.referenceMonth)}</td>
                    <td>{formatDate(payment.dueDate)}</td>
                    <td>R$ {payment.value.toFixed(2)}</td>
                    <td>R$ {(payment.paidValue || 0).toFixed(2)}</td>
                    <td>
                      {payment.paymentMethod
                        ? PMLabels[payment.paymentMethod]
                        : '-'}
                    </td>
                    <td>{formatDate(payment.paymentDate || '')}</td>
                    <td>
                      <StatusBadge $color={getStatusColor(payment.status)}>
                        {getStatusLabel(payment.status)}
                      </StatusBadge>
                    </td>
                    <td>
                      {payment.status !== PaymentStatus.PAID && (
                        <SmallButton
                          onClick={() => handleMarkAsPaid(payment)}
                          disabled={processingPayments.has(payment.id)}
                          $isProcessing={processingPayments.has(payment.id)}
                        >
                          {processingPayments.has(payment.id) ? (
                            <>
                              <LoadingSpinner />
                              Processando...
                            </>
                          ) : (
                            <>
                              <MdCheck /> Marcar como Pago
                            </>
                          )}
                        </SmallButton>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#6b7280',
                    }}
                  >
                    Nenhum pagamento encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </PaymentsTable>
        </Card>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const PaymentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }

  td {
    color: ${props => props.theme.colors.text};
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const SmallButton = styled.button<{ $isProcessing?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: ${props =>
    props.$isProcessing
      ? props.theme.colors.textSecondary
      : props.theme.colors.success};
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: ${props => (props.$isProcessing ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  opacity: ${props => (props.$isProcessing ? 0.7 : 1)};

  &:hover {
    opacity: ${props => (props.$isProcessing ? 0.7 : 0.9)};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const LoadingSpinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: ${props => props.theme.colors.error};
`;

const StatusCard = styled.div`
  display: flex;
  gap: 2rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`;

const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyContainer = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PropertyImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const PropertyInfo = styled.div`
  flex: 1;
`;

const ObservationsText = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export default RentalDetailsPage;
