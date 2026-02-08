/**
 * Página de Detalhes da Solicitação de Aprovação
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdInfo,
  MdCheck,
  MdClose,
  MdAccessTime,
  MdPerson,
  MdHome,
  MdCalendarToday,
  MdEdit,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Layout } from '../components/layout/Layout';
import { Spinner } from '../components/common/Spinner';
import { PermissionButton } from '../components/common/PermissionButton';
import { useFinancialApprovals } from '../hooks/useFinancialApprovals';
import type { FinancialApprovalRequest } from '../types/financial';
import {
  formatCurrency,
  getApprovalStatusLabel,
  getApprovalStatusColor,
} from '../types/financial';
import { ApproveApprovalModal } from '../components/modals/ApproveApprovalModal';
import { RejectApprovalModal } from '../components/modals/RejectApprovalModal';
import {
  PageContainer,
  PageHeader,
  BackButton,
  PageTitle,
  HeaderActions,
  Card,
  CardHeader,
  CardTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  StatusBadge,
  TypeBadge,
  ValuesGrid,
  ValueCard,
  ValueLabel,
  ValueAmount,
  ValueNote,
  NotesSection,
  NoteItem,
  NoteLabel,
  NoteText,
  ActionsContainer,
  ActionButton,
  TimelineSection,
  TimelineItem,
  TimelineIcon,
  TimelineContent,
  TimelineTitle,
  TimelineDate,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '../styles/pages/ApprovalDetailsPageStyles';

export default function ApprovalDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    approvals,
    loading: approvalsLoading,
    refreshApprovals,
    approveRequest,
    rejectRequest,
  } = useFinancialApprovals();
  const [approval, setApproval] = useState<FinancialApprovalRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id && approvals.length > 0) {
      const found = approvals.find(a => a.id === id);
      if (found) {
        setApproval(found);
      }
      setLoading(false);
    } else if (!approvalsLoading && approvals.length === 0) {
      setLoading(false);
    }
  }, [id, approvals, approvalsLoading]);

  useEffect(() => {
    refreshApprovals();
  }, []);

  const handleApprove = async (data: {
    notes?: string;
    editedBaseValue?: number;
    editedCommissionValue?: number;
  }) => {
    if (!approval) return;
    setProcessing(true);
    try {
      await approveRequest(approval.id, data);
      toast.success('Solicitação aprovada com sucesso!');
      setApproveModalOpen(false);
      navigate('/financial');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao aprovar solicitação');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (data: { reason: string }) => {
    if (!approval) return;
    setProcessing(true);
    try {
      await rejectRequest(approval.id, data);
      toast.success('Solicitação rejeitada!');
      setRejectModalOpen(false);
      navigate('/financial');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao rejeitar solicitação');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || approvalsLoading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingContainer>
            <Spinner size={32} />
            <span>Carregando detalhes...</span>
          </LoadingContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (!approval) {
    return (
      <Layout>
        <PageContainer>
          <BackButton onClick={() => navigate('/financial')}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyTitle>Solicitação não encontrada</EmptyTitle>
            <EmptyDescription>
              A solicitação de aprovação que você está procurando não existe ou
              foi removida.
            </EmptyDescription>
          </EmptyState>
        </PageContainer>
      </Layout>
    );
  }

  const isPending = approval.status === 'pending';

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <div>
            <BackButton onClick={() => navigate('/financial')}>
              <MdArrowBack size={20} />
              Voltar para Financeiro
            </BackButton>
            <PageTitle>
              <MdInfo style={{ color: '#6366f1' }} />
              Detalhes da Solicitação
            </PageTitle>
          </div>
          {isPending && (
            <HeaderActions>
              <PermissionButton
                permission='financial:approval:approve'
                variant='primary'
                onClick={() => setApproveModalOpen(true)}
                disabled={processing}
              >
                <MdCheck size={18} />
                Aprovar
              </PermissionButton>
              <PermissionButton
                permission='financial:approval:reject'
                variant='danger'
                onClick={() => setRejectModalOpen(true)}
                disabled={processing}
              >
                <MdClose size={18} />
                Rejeitar
              </PermissionButton>
            </HeaderActions>
          )}
        </PageHeader>

        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>
              <MdInfo size={20} />
              Informações Gerais
            </CardTitle>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TypeBadge $type={approval.type}>
                {approval.type === 'sale' ? '💰 Venda' : '🏠 Aluguel'}
              </TypeBadge>
              <StatusBadge $status={approval.status}>
                {getApprovalStatusLabel(approval.status)}
              </StatusBadge>
            </div>
          </CardHeader>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>
                {approval.approvalType === 'inspection'
                  ? 'Vistoria'
                  : 'Propriedade'}
              </InfoLabel>
              <InfoValue>
                {approval.approvalType === 'inspection'
                  ? approval.inspectionTitle || 'Vistoria sem título'
                  : approval.property?.title || 'Propriedade não informada'}
              </InfoValue>
            </InfoItem>
            {approval.property?.code && (
              <InfoItem>
                <InfoLabel>Código</InfoLabel>
                <InfoValue>{approval.property.code}</InfoValue>
              </InfoItem>
            )}
            {approval.approvalType === 'inspection' &&
              approval.propertyCode && (
                <InfoItem>
                  <InfoLabel>Código da Propriedade</InfoLabel>
                  <InfoValue>{approval.propertyCode}</InfoValue>
                </InfoItem>
              )}
            <InfoItem>
              <InfoLabel>
                {approval.approvalType === 'inspection'
                  ? 'Solicitante'
                  : 'Corretor'}
              </InfoLabel>
              <InfoValue>
                {approval.approvalType === 'inspection'
                  ? approval.requesterName || 'Não informado'
                  : approval.requestedBy?.name || 'Não informado'}
              </InfoValue>
            </InfoItem>
            {approval.reviewedBy && (
              <InfoItem>
                <InfoLabel>Analisado por</InfoLabel>
                <InfoValue>{approval.reviewedBy.name}</InfoValue>
              </InfoItem>
            )}
            {approval.reviewedAt && (
              <InfoItem>
                <InfoLabel>Data da Análise</InfoLabel>
                <InfoValue>
                  {dayjs(approval.reviewedAt).format('DD/MM/YYYY HH:mm')}
                </InfoValue>
              </InfoItem>
            )}
          </InfoGrid>
        </Card>

        {/* Valores */}
        <Card>
          <CardHeader>
            <CardTitle>
              <MdHome size={20} />
              Valores
            </CardTitle>
          </CardHeader>
          {approval.approvalType === 'inspection' ? (
            <ValuesGrid>
              <ValueCard>
                <ValueLabel>Valor da Vistoria</ValueLabel>
                <ValueAmount $color='#10b981'>
                  {formatCurrency(
                    typeof approval.amount === 'string'
                      ? parseFloat(approval.amount)
                      : (approval as any).amount || 0
                  )}
                </ValueAmount>
              </ValueCard>
            </ValuesGrid>
          ) : (
            <ValuesGrid>
              <ValueCard>
                <ValueLabel>Valor Base</ValueLabel>
                <ValueAmount>
                  {formatCurrency(approval.baseValue || 0)}
                </ValueAmount>
                {approval.editedBaseValue &&
                  approval.editedBaseValue !== approval.baseValue && (
                    <ValueNote>
                      Ajustado para {formatCurrency(approval.editedBaseValue)}
                    </ValueNote>
                  )}
              </ValueCard>
              <ValueCard>
                <ValueLabel>
                  Comissão ({approval.commissionPercentage}%)
                </ValueLabel>
                <ValueAmount $color='#10b981'>
                  {formatCurrency(approval.commissionValue)}
                </ValueAmount>
                {approval.editedCommissionValue &&
                  approval.editedCommissionValue !==
                    approval.commissionValue && (
                    <ValueNote>
                      Ajustado para{' '}
                      {formatCurrency(approval.editedCommissionValue)}
                    </ValueNote>
                  )}
              </ValueCard>
              <ValueCard>
                <ValueLabel>
                  Lucro da Empresa ({approval.companyProfitPercentage || 0}%)
                </ValueLabel>
                <ValueAmount $color='#6366f1'>
                  {formatCurrency(approval.companyProfitValue || 0)}
                </ValueAmount>
              </ValueCard>
              <ValueCard>
                <ValueLabel>Valor Líquido</ValueLabel>
                <ValueAmount $color='#3b82f6'>
                  {formatCurrency(approval.companyNetValue || 0)}
                </ValueAmount>
              </ValueCard>
            </ValuesGrid>
          )}
        </Card>

        {/* Observações */}
        {(approval.notes || approval.financialNotes) && (
          <Card>
            <CardHeader>
              <CardTitle>
                <MdEdit size={20} />
                Observações
              </CardTitle>
            </CardHeader>
            <NotesSection>
              {approval.notes && (
                <NoteItem>
                  <NoteLabel>Do Corretor</NoteLabel>
                  <NoteText>"{approval.notes}"</NoteText>
                </NoteItem>
              )}
              {approval.financialNotes && (
                <NoteItem>
                  <NoteLabel>Do Financeiro</NoteLabel>
                  <NoteText>"{approval.financialNotes}"</NoteText>
                </NoteItem>
              )}
            </NotesSection>
          </Card>
        )}

        {/* Cronologia */}
        <Card>
          <CardHeader>
            <CardTitle>
              <MdCalendarToday size={20} />
              Cronologia
            </CardTitle>
          </CardHeader>
          <TimelineSection>
            <TimelineItem>
              <TimelineIcon>
                <MdAccessTime size={18} />
              </TimelineIcon>
              <TimelineContent>
                <TimelineTitle>Solicitação criada</TimelineTitle>
                <TimelineDate>
                  {dayjs(approval.createdAt).format('DD/MM/YYYY [às] HH:mm')}
                </TimelineDate>
              </TimelineContent>
            </TimelineItem>
            {approval.updatedAt !== approval.createdAt && (
              <TimelineItem>
                <TimelineIcon>
                  <MdEdit size={18} />
                </TimelineIcon>
                <TimelineContent>
                  <TimelineTitle>Última atualização</TimelineTitle>
                  <TimelineDate>
                    {dayjs(approval.updatedAt).format('DD/MM/YYYY [às] HH:mm')}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            )}
            {approval.reviewedAt && (
              <TimelineItem>
                <TimelineIcon>
                  {approval.status === 'approved' ? (
                    <MdCheck size={18} />
                  ) : (
                    <MdClose size={18} />
                  )}
                </TimelineIcon>
                <TimelineContent>
                  <TimelineTitle>
                    {approval.status === 'approved' ? 'Aprovada' : 'Rejeitada'}{' '}
                    por {approval.reviewedBy?.name || 'usuário'}
                  </TimelineTitle>
                  <TimelineDate>
                    {dayjs(approval.reviewedAt).format('DD/MM/YYYY [às] HH:mm')}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            )}
          </TimelineSection>
        </Card>

        {/* Ações */}
        {isPending && (
          <ActionsContainer>
            <ActionButton
              $variant='approve'
              onClick={() => setApproveModalOpen(true)}
              disabled={processing}
            >
              <MdCheck size={18} />
              Aprovar Solicitação
            </ActionButton>
            <ActionButton
              $variant='reject'
              onClick={() => setRejectModalOpen(true)}
              disabled={processing}
            >
              <MdClose size={18} />
              Rejeitar Solicitação
            </ActionButton>
            <ActionButton
              $variant='secondary'
              onClick={() => navigate('/financial')}
            >
              Voltar
            </ActionButton>
          </ActionsContainer>
        )}
      </PageContainer>

      {/* Modais */}
      {approveModalOpen && approval && (
        <ApproveApprovalModal
          isOpen={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={handleApprove}
          approval={approval}
          loading={processing}
        />
      )}

      {rejectModalOpen && approval && (
        <RejectApprovalModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleReject}
          approval={approval}
          loading={processing}
        />
      )}
    </Layout>
  );
}
