import React from 'react';
import {
  MdCalendarToday,
  MdLocationOn,
  MdPerson,
  MdCameraAlt,
  MdEdit,
  MdDelete,
} from 'react-icons/md';
import type { Inspection } from '@/types/vistoria-types';
import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE_LABELS,
  INSPECTION_STATUS_COLORS,
} from '@/types/vistoria-types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CardContainer,
  Card,
  CardHeader,
  CardHeaderTop,
  CardTitle,
  StatusBadge,
  TypeBadge,
  CardContent,
  DescriptionContainer,
  DescriptionText,
  InfoContainer,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue,
  ValueContainer,
  ValueContent,
  ValueInfo,
  ValueLabel,
  ValueAmount,
  ValueIcon,
  ActionsContainer,
  ActionButton,
} from '../../styles/components/VistoriaCardStyles';

interface InspectionCardProps {
  inspection: Inspection;
  onEdit?: (inspection: Inspection) => void;
  onDelete?: (inspection: Inspection) => void;
  onView?: (inspection: Inspection) => void;
  showActions?: boolean;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({
  inspection,
  onEdit,
  onDelete,
  onView,
  showActions = true,
}) => {
  const statusColor =
    INSPECTION_STATUS_COLORS[
      inspection.status as keyof typeof INSPECTION_STATUS_COLORS
    ] || 'blue';

  return (
    <CardContainer onClick={() => onView?.(inspection)}>
      <Card>
        <CardHeader>
          <CardHeaderTop>
            <CardTitle>{inspection.title}</CardTitle>
            <StatusBadge $variant={statusColor}>
              {INSPECTION_STATUS_LABELS[
                inspection.status as keyof typeof INSPECTION_STATUS_LABELS
              ] || inspection.status}
            </StatusBadge>
          </CardHeaderTop>
          <TypeBadge>
            {INSPECTION_TYPE_LABELS[
              inspection.type as keyof typeof INSPECTION_TYPE_LABELS
            ] || inspection.type}
          </TypeBadge>
        </CardHeader>

        <CardContent>
          {inspection.description && (
            <DescriptionContainer>
              <DescriptionText>{inspection.description}</DescriptionText>
            </DescriptionContainer>
          )}

          <InfoContainer>
            <InfoItem $color='blue'>
              <InfoIcon $color='blue'>
                <MdCalendarToday />
              </InfoIcon>
              <InfoContent>
                <InfoLabel $color='blue'>Data Agendada</InfoLabel>
                <InfoValue>
                  {format(
                    new Date(inspection.scheduledDate),
                    'dd/MM/yyyy HH:mm',
                    { locale: ptBR }
                  )}
                </InfoValue>
              </InfoContent>
            </InfoItem>

            {inspection.property && (
              <InfoItem $color='green'>
                <InfoIcon $color='green'>
                  <MdLocationOn />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel $color='green'>Propriedade</InfoLabel>
                  <InfoValue>{inspection.property.title}</InfoValue>
                </InfoContent>
              </InfoItem>
            )}

            {inspection.inspector && (
              <InfoItem $color='purple'>
                <InfoIcon $color='purple'>
                  <MdPerson />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel $color='purple'>Inspetor</InfoLabel>
                  <InfoValue>{inspection.inspector.name}</InfoValue>
                </InfoContent>
              </InfoItem>
            )}

            {inspection.photos && inspection.photos.length > 0 && (
              <InfoItem $color='orange'>
                <InfoIcon $color='orange'>
                  <MdCameraAlt />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel $color='orange'>Fotos</InfoLabel>
                  <InfoValue>{inspection.photos.length} foto(s)</InfoValue>
                </InfoContent>
              </InfoItem>
            )}
          </InfoContainer>

          {inspection.value && (
            <ValueContainer>
              <ValueContent>
                <ValueInfo>
                  <ValueLabel>Valor da Inspeção</ValueLabel>
                  <ValueAmount>
                    R${' '}
                    {inspection.value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </ValueAmount>
                </ValueInfo>
                <ValueIcon>R$</ValueIcon>
              </ValueContent>
            </ValueContainer>
          )}

          {showActions && (
            <ActionsContainer>
              <ActionButton
                $variant='edit'
                onClick={e => {
                  e.stopPropagation();
                  onEdit?.(inspection);
                }}
              >
                <MdEdit />
                Editar
              </ActionButton>
              <ActionButton
                $variant='delete'
                onClick={e => {
                  e.stopPropagation();
                  onDelete?.(inspection);
                }}
              >
                <MdDelete />
                Excluir
              </ActionButton>
            </ActionsContainer>
          )}
        </CardContent>
      </Card>
    </CardContainer>
  );
};

// Manter compatibilidade com código existente
export const VistoriaCard = InspectionCard;
