import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  MdAdd,
  MdSearch,
  MdCalendarToday,
  MdPersonAdd,
  MdNotifications,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useAppointments } from '../hooks/useAppointments';
import { useAppointmentInvites } from '../hooks/useAppointmentInvites';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PermissionButton } from '../components/common/PermissionButton';
import { usePermissions } from '../hooks/usePermissions';
import { CalendarShimmer } from '../components/shimmer/CalendarShimmer';
import { ModalPadrão } from '../components/common/ModalPadrão';
import { InviteModal } from '../components/modals/InviteModal';
import { InvitesList } from '../components/lists/InvitesList';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptLocale from '@fullcalendar/core/locales/pt-br';
import * as S from '../styles/pages/CalendarPageStyles';

// Tipos importados do hook
import type { Appointment } from '../hooks/useAppointments';

// Hook para detectar tamanho da tela
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    // Atualizar estado inicial
    setMatches(media.matches);

    // Adicionar listener
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const { appointments, isLoading, error, loadAppointments } =
    useAppointments();

  const {
    pendingInvites,
    loadPendingInvites,
    respondToInvite,
    isLoading: isInvitesLoading,
  } = useAppointmentInvites();

  const { hasPermission } = usePermissions();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados do modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInvitesList, setShowInvitesList] = useState(false);
  const [inviteAppointment, setInviteAppointment] =
    useState<Appointment | null>(null);

  // Filtrar agendamentos
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;

    return appointments.filter(
      appointment =>
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  // Função helper para converter data para formato que o FullCalendar entende corretamente
  // A API retorna datas que representam horários locais de São Paulo
  // Como removemos o timeZone do FullCalendar, ele usará o timezone local do navegador
  // Precisamos extrair os componentes da data diretamente da string para manter o horário correto
  const formatDateForCalendar = useCallback((dateString: string): string => {
    // Extrair ano, mês, dia, hora, minuto e segundo diretamente da string
    // Isso garante que mantenhamos o horário exato que a API enviou
    const match = dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      // Retornar como string ISO local (sem timezone) - FullCalendar interpretará como horário local
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    // Fallback: remover timezone e milissegundos
    return dateString
      .replace(/Z$/, '')
      .replace(/[+-]\d{2}:\d{2}$/, '')
      .split('.')[0];
  }, []);

  // Eventos do calendário
  const calendarEvents = useMemo(() => {
    const events: any[] = [];

    filteredAppointments.forEach(appointment => {
      const startDate = new Date(appointment.startDate);
      const endDate = new Date(appointment.endDate);

      // Verificar se o evento dura múltiplos dias (ignorando horas)
      const startDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const endDay = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );
      const daysDifference = Math.ceil(
        (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Se o evento dura mais de um dia, criar um evento para cada dia
      if (daysDifference > 0) {
        const currentDate = new Date(startDay);

        while (currentDate <= endDay) {
          const dayStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          const dayEnd = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          );

          events.push({
            id: `${appointment.id}-${currentDate.toISOString().split('T')[0]}`, // ID único para cada dia
            groupId: appointment.id, // ID do grupo para associar os eventos
            title: appointment.title, // Mostrar título em todos os dias
            start: formatDateForCalendar(dayStart.toISOString()),
            end: formatDateForCalendar(dayEnd.toISOString()),
            allDay: true,
            color: appointment.color,
            extendedProps: {
              type: appointment.type,
              status: appointment.status,
              visibility: appointment.visibility,
              location: appointment.location,
              description: appointment.description,
              notes: appointment.notes,
              property: appointment.property,
              client: appointment.client,
              user: appointment.user,
              isRecurring: appointment.isRecurring,
              originalAppointmentId: appointment.id,
            },
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // Evento de um dia apenas - usar as datas formatadas corretamente
        events.push({
          id: appointment.id,
          title: appointment.title,
          start: formatDateForCalendar(appointment.startDate),
          end: formatDateForCalendar(appointment.endDate),
          allDay: false,
          color: appointment.color,
          extendedProps: {
            type: appointment.type,
            status: appointment.status,
            visibility: appointment.visibility,
            location: appointment.location,
            description: appointment.description,
            notes: appointment.notes,
            property: appointment.property,
            client: appointment.client,
            user: appointment.user,
            isRecurring: appointment.isRecurring,
          },
        });
      }
    });

    return events;
  }, [filteredAppointments, formatDateForCalendar]);

  // Handlers
  const handleCreateAppointment = () => {
    navigate('/calendar/create');
  };

  const handleEventClick = (info: any) => {
    // Se o evento tem originalAppointmentId, usar ele; senão usar o id normal
    const appointmentId =
      info.event.extendedProps?.originalAppointmentId || info.event.id;
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      // Navegar para página de detalhes
      navigate(`/calendar/details/${appointment.id}`);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    // Usar a data selecionada, mas com horário 1h à frente da hora atual de Brasília
    const selectedDate = new Date(selectInfo.start);
    const now = new Date();
    const brasiliaTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    );
    const nextHour = brasiliaTime.getHours() + 1;
    const nextTwoHours = brasiliaTime.getHours() + 2;

    // Configurar horário de início: 1h à frente
    const startDate = new Date(selectedDate);
    if (nextHour >= 24) {
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setHours(nextHour, 0, 0, 0);
    }

    // Configurar horário de fim: 2h à frente
    const endDate = new Date(selectedDate);
    if (nextTwoHours >= 24) {
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(nextTwoHours - 24, 0, 0, 0);
    } else {
      endDate.setHours(nextTwoHours, 0, 0, 0);
    }

    // Navegar para página de criação com as datas como query params
    const startDateISO = startDate.toISOString().slice(0, 16);
    const endDateISO = endDate.toISOString().slice(0, 16);
    navigate(
      `/calendar/create?startDate=${encodeURIComponent(startDateISO)}&endDate=${encodeURIComponent(endDateISO)}`
    );
  };

  // Handlers para convites
  const handleInviteAppointment = (appointment: Appointment) => {
    setInviteAppointment(appointment);
    setShowInviteModal(true);
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await respondToInvite(inviteId, { status: 'accepted' });
      // Fechar modal após aceitar com sucesso
      setShowInvitesList(false);
      // Recarregar calendário para atualizar os dados com loading sutil
      setIsRefreshing(true);
      await loadAppointments();
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await respondToInvite(inviteId, { status: 'declined' });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setInviteAppointment(null);
  };

  const handleCloseInvitesList = () => {
    setShowInvitesList(false);
  };

  // Carregar convites pendentes
  useEffect(() => {
    loadPendingInvites();
  }, [loadPendingInvites]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = appointments.length;
    // Usar horário de Brasília para calcular estatísticas
    const now = new Date();
    const brasiliaTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    );
    const today = brasiliaTime.toDateString();

    const todayAppointments = appointments.filter(
      a => new Date(a.startDate).toDateString() === today
    ).length;

    const thisWeek = appointments.filter(a => {
      const appointmentDate = new Date(a.startDate);
      const weekStart = new Date(brasiliaTime);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    }).length;

    const completed = appointments.filter(a => a.status === 'completed').length;

    return { total, today: todayAppointments, thisWeek, completed };
  }, [appointments]);

  if (isLoading) {
    return (
      <Layout>
        <CalendarShimmer />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <S.CalendarPageContainer>
          <S.ErrorContainer>
            <S.ErrorTitle>Erro ao carregar calendário</S.ErrorTitle>
            <S.ErrorMessage>{error}</S.ErrorMessage>
            <S.RetryButton onClick={loadAppointments}>
              Tentar novamente
            </S.RetryButton>
          </S.ErrorContainer>
        </S.CalendarPageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <S.CalendarPageContainer>
        <S.CalendarHeader>
          <S.CalendarTitle>
            <h1>Calendário de Agendamentos</h1>
            <p>Gerencie seus compromissos e agendamentos</p>
            <S.StatsContainer>
              <S.StatCard $type='total'>
                <S.StatValue $type='total'>{stats.total}</S.StatValue>
                <S.StatLabel>Total</S.StatLabel>
              </S.StatCard>
              <S.StatCard $type='today'>
                <S.StatValue $type='today'>{stats.today}</S.StatValue>
                <S.StatLabel>Hoje</S.StatLabel>
              </S.StatCard>
              <S.StatCard $type='week'>
                <S.StatValue $type='week'>{stats.thisWeek}</S.StatValue>
                <S.StatLabel>Esta Semana</S.StatLabel>
              </S.StatCard>
              <S.StatCard $type='completed'>
                <S.StatValue $type='completed'>{stats.completed}</S.StatValue>
                <S.StatLabel>Concluídos</S.StatLabel>
              </S.StatCard>
            </S.StatsContainer>
          </S.CalendarTitle>
          <S.HeaderActions>
            {pendingInvites.length > 0 && (
              <S.InvitesButton onClick={() => setShowInvitesList(true)}>
                <MdNotifications size={18} />
                Convites ({pendingInvites.length})
              </S.InvitesButton>
            )}
            <PermissionButton
              permission='calendar:create'
              onClick={handleCreateAppointment}
              variant='primary'
              size='medium'
            >
              <MdAdd size={18} />
              Novo Agendamento
            </PermissionButton>
          </S.HeaderActions>
        </S.CalendarHeader>

        <S.CalendarControls>
          <S.SearchContainer>
            <S.SearchIcon>
              <MdSearch size={20} />
            </S.SearchIcon>
            <S.SearchInput
              type='text'
              placeholder='Buscar agendamentos...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </S.SearchContainer>
        </S.CalendarControls>

        <S.CalendarContainer>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            locale={ptLocale}
            headerToolbar={
              isMobile
                ? {
                    left: 'prev,next',
                    center: 'title',
                    right: 'today',
                  }
                : isTablet
                  ? {
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek',
                    }
                  : {
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }
            }
            events={calendarEvents}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateSelect}
            height='auto'
            eventDisplay='block'
            displayEventTime={false}
            displayEventEnd={false}
            dayMaxEvents={false}
            moreLinkClick='popover'
            eventOverlap={false}
            eventConstraint={{
              start: '00:00',
              end: '24:00',
            }}
            eventContent={eventInfo => (
              <div
                style={{
                  padding: isMobile ? '1px 2px' : '2px 4px',
                  fontSize: isMobile ? '10px' : isTablet ? '11px' : '12px',
                  backgroundColor: eventInfo.backgroundColor,
                  color: 'white',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {eventInfo.event.title}
              </div>
            )}
          />
          {isRefreshing && (
            <S.CalendarLoadingOverlay>
              <S.LoadingSpinner />
            </S.CalendarLoadingOverlay>
          )}
        </S.CalendarContainer>

        {/* Modal de Convites */}
        {inviteAppointment && (
          <InviteModal
            isOpen={showInviteModal}
            onClose={handleCloseInviteModal}
            appointmentId={inviteAppointment.id}
            appointmentTitle={inviteAppointment.title}
          />
        )}

        {/* Modal de Lista de Convites */}
        <ModalPadrão
          isOpen={showInvitesList}
          onClose={handleCloseInvitesList}
          title='Convites Pendentes'
          subtitle='Gerencie seus convites de agendamento'
          icon={<MdNotifications size={24} />}
          maxWidth='800px'
          footer={
            <div
              style={{
                display: 'flex',
                gap: '12px',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <S.Button $variant='secondary' onClick={handleCloseInvitesList}>
                Fechar
              </S.Button>
            </div>
          }
        >
          <InvitesList
            invites={pendingInvites}
            onAccept={handleAcceptInvite}
            onDecline={handleDeclineInvite}
            isLoading={isInvitesLoading}
          />
        </ModalPadrão>
      </S.CalendarPageContainer>
    </Layout>
  );
};

export default CalendarPage;
