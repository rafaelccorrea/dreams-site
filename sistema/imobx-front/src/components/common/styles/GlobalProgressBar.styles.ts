import styled from 'styled-components';

export const ProgressContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 80px;
  left: 20px;
  width: 350px;
  background-color: var(
    --theme-surface,
    ${props => props.theme.colors.surface}
  );
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transition: all 0.3s ease;
  transform: translateY(${props => (props.$show ? '0' : '-100%')});
  opacity: ${props => (props.$show ? '1' : '0')};
  overflow: hidden;
`;

export const ProgressHeader = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid
    var(--theme-border, ${props => props.theme.colors.border});
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProgressContent = styled.div`
  padding: 16px;
`;

export const ProgressFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid
    var(--theme-border, ${props => props.theme.colors.border});
  display: flex;
  justify-content: flex-end;
`;

export const ProgressList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

export const ProgressItem = styled.div<{ $status: string }>`
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 6px;
  background-color: var(
    --theme-background-secondary,
    ${props => props.theme.colors.backgroundSecondary}
  );
  border-left: 3px solid
    ${props => {
      switch (props.$status) {
        case 'completed':
          return 'var(--theme-success, #52c41a)';
        case 'failed':
          return 'var(--theme-error, #ff4d4f)';
        case 'processing':
          return 'var(--theme-primary, #1890ff)';
        default:
          return 'var(--theme-warning, #faad14)';
      }
    }};
`;

export const IconContainer = styled.div<{ $status: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch (props.$status) {
      case 'completed':
        return 'var(--theme-success-background, #f6ffed)';
      case 'failed':
        return 'var(--theme-error-background, #fff1f0)';
      case 'processing':
        return 'var(--theme-primary-background, #e6f7ff)';
      default:
        return 'var(--theme-warning-background, #fffbe6)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed':
        return 'var(--theme-success, #52c41a)';
      case 'failed':
        return 'var(--theme-error, #ff4d4f)';
      case 'processing':
        return 'var(--theme-primary, #1890ff)';
      default:
        return 'var(--theme-warning, #faad14)';
    }
  }};
`;
