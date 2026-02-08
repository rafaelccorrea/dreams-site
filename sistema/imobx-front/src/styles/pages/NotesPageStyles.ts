import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

// Container principal
export const NotesPageContainer = styled.div`
  padding: 32px;
  width: 100%;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

// Header moderno
export const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    margin-bottom: 32px;
  }
`;

export const NotesTitle = styled.div`
  flex: 1;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
    margin: 0 0 12px 0;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0;
    font-weight: 400;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }
`;

// Estatísticas modernas
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin: 32px 0 0 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 24px 0 0 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 20px 0 0 0;
  }
`;

export const StatCard = styled.div<{
  $type?: 'total' | 'pinned' | 'archived' | 'recent';
}>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.06)'};
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch (props.$type) {
        case 'total':
          return 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)';
        case 'pinned':
          return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
        case 'archived':
          return 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';
        case 'recent':
          return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        default:
          return `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)`;
      }
    }};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: 100px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
    min-height: 85px;
  }
`;

export const StatValue = styled.div<{
  $type?: 'total' | 'pinned' | 'archived' | 'recent';
}>`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${props => {
    switch (props.$type) {
      case 'total':
        return '#3b82f6';
      case 'pinned':
        return '#f59e0b';
      case 'archived':
        return '#6b7280';
      case 'recent':
        return '#10b981';
      default:
        return props.theme.colors.primary;
    }
  }};
  margin-bottom: 6px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

// Controles modernos
export const NotesControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 24px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 16px ${props => props.theme.colors.primary}20;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 14px 18px 14px 46px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 12px 16px 12px 44px;
    font-size: 16px; /* Evita zoom no iOS */
    border-radius: 10px;
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  pointer-events: none;
`;

export const FilterToggle = styled.button<{
  $hasActiveFilters?: boolean;
  disabled?: boolean;
}>`
  background: ${props =>
    props.$hasActiveFilters
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props =>
    props.$hasActiveFilters ? 'white' : props.theme.colors.text};
  border: 2px solid
    ${props =>
      props.$hasActiveFilters
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;

    &:hover {
      background: ${props =>
        props.$hasActiveFilters
          ? props.theme.colors.primary
          : props.theme.colors.cardBackground};
      color: ${props =>
        props.$hasActiveFilters ? 'white' : props.theme.colors.text};
      border-color: ${props =>
        props.$hasActiveFilters
          ? props.theme.colors.primary
          : props.theme.colors.border};
      box-shadow: 0 2px 8px
        ${props =>
          props.theme.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(0, 0, 0, 0.05)'};
    }
  }

  @media (max-width: 768px) {
    min-width: 100%;
    padding: 14px 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.875rem;
  }
`;

export const CreateNoteButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 28px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px ${props => props.theme.colors.primary}30;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 0.875rem;
  }
`;

// Grid de anotações moderno
export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    gap: 16px;
    margin-bottom: 24px;
  }
`;

// Container para visualização em lista
export const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 24px;
  }
`;

// Item de lista
export const NoteListItem = styled.div<{
  $color?: string;
  $isPinned?: boolean;
}>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  border-radius: 12px;
  padding: 20px 24px;
  transition: all 0.3s ease;
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;

  ${props =>
    props.$isPinned &&
    `
    box-shadow: 0 2px 8px ${props.theme.colors.primary}20;
    border-color: ${props.theme.colors.primary};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.12)'};
    border-left-width: 6px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 20px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 14px 16px;
    border-radius: 10px;
  }
`;

export const NoteListIcon = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props =>
    props.$color ? `${props.$color}20` : `${props.theme.colors.primary}20`};
  border: 2px solid ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: ${props => props.$color || props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }
`;

export const NoteListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const NoteListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const NoteListTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const NoteListMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    gap: 12px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    gap: 10px;
    font-size: 0.75rem;
  }
`;

export const NoteListActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`;

export const NoteCard = styled.div<{ $color?: string; $isPinned?: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color || props.theme.colors.primary};
  }

  ${props =>
    props.$isPinned &&
    `
    border-color: #f59e0b;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.2);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.12)'};
    border-color: ${props => props.$color || props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

export const NoteCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }
`;

export const NoteType = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.$type) {
      case 'personal':
        return `
          background: ${props.theme.mode === 'dark' ? '#1e3a8a' : '#dbeafe'};
          color: ${props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af'};
        `;
      case 'work':
        return `
          background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
          color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
        `;
      case 'meeting':
        return `
          background: ${props.theme.mode === 'dark' ? '#7c2d12' : '#fed7aa'};
          color: ${props.theme.mode === 'dark' ? '#fdba74' : '#9a3412'};
        `;
      case 'reminder':
        return `
          background: ${props.theme.mode === 'dark' ? '#7c3aed' : '#e0e7ff'};
          color: ${props.theme.mode === 'dark' ? '#a78bfa' : '#5b21b6'};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}

  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 0.75rem;
    gap: 4px;
  }
`;

export const NotePriority = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch (props.$priority) {
      case 'urgent':
        return `
          background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
          color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        `;
      case 'high':
        return `
          background: ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'};
          color: ${props.theme.mode === 'dark' ? '#fbbf24' : '#92400e'};
        `;
      case 'medium':
        return `
          background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
          color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
        `;
      case 'low':
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 0.7rem;
    gap: 3px;
  }
`;

export const NoteContent = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 12px 0;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 1.125rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 768px) {
      font-size: 0.9375rem;
    }

    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

export const NoteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.75rem;
    margin-bottom: 12px;
  }
`;

export const NoteActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}>`
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  min-width: 36px;
  height: 36px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: scale(1.05);
        }
      `;
    } else if (props.$variant === 'warning') {
      return `
        background: ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'};
        color: ${props.theme.mode === 'dark' ? '#fbbf24' : '#92400e'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#a16207' : '#fde68a'};
          transform: scale(1.05);
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: scale(1.05);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: scale(1.05);
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8125rem;
    min-width: 32px;
    height: 32px;
  }
`;

// Estados vazios e de erro
export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 2px dashed ${props => props.theme.colors.border};
  margin: 40px 0;

  @media (max-width: 768px) {
    padding: 60px 16px;
    margin: 32px 0;
  }

  @media (max-width: 480px) {
    padding: 40px 12px;
    margin: 24px 0;
    border-radius: 16px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const EmptyMessage = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 20px 0;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    margin: 0 0 16px 0;
  }
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  margin: 40px 0;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.error};
  margin: 0 0 12px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const RetryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

// Modal moderno
export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 90vh;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 12px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    gap: 8px;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const FormContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 480px) {
    padding: 14px 18px;
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 480px) {
    padding: 14px 18px;
    font-size: 16px; /* Evita zoom no iOS */
    min-height: 100px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  @media (max-width: 480px) {
    padding: 14px 18px;
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

export const ColorPicker = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ColorOption = styled.button<{
  $color: string;
  $isSelected?: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 3px solid
    ${props => (props.$isSelected ? props.theme.colors.text : 'transparent')};
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    padding: 16px 20px;
    gap: 10px;
  }
`;

export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 16px ${props.theme.colors.primary}30;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${props.theme.colors.primary}40;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        box-shadow: 0 4px 16px #EF444430;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px #EF444440;
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 0.9375rem;
  }
`;

// Componentes adicionais
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

export const ImageContainer = styled.div`
  margin-top: 16px;

  img {
    width: 100%;
    border-radius: 12px;
    max-height: 200px;
    object-fit: cover;
  }
`;

export const ClientInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const ReminderInfo = styled.div`
  background: ${props => (props.theme.mode === 'dark' ? '#7c3aed' : '#e0e7ff')};
  color: ${props => (props.theme.mode === 'dark' ? '#a78bfa' : '#5b21b6')};
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

// Toast moderno
export const ToastContainer = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => (props.$type === 'success' ? '#10b981' : '#ef4444')};
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToastMessage = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;
