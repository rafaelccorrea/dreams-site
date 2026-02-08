import styled from 'styled-components';
import { Modal } from 'antd';

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: var(
      --theme-surface,
      ${props => props.theme.colors.surface}
    ) !important;
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
    overflow: hidden;
  }
  .ant-modal-header {
    background-color: var(
      --theme-surface,
      ${props => props.theme.colors.surface}
    ) !important;
    border-bottom: 1px solid
      var(--theme-border, ${props => props.theme.colors.border});
    border-radius: 16px 16px 0 0;
    padding: 24px 32px 20px;
  }
  .ant-modal-title {
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
  .ant-modal-close-x {
    color: var(
      --theme-text-secondary,
      ${props => props.theme.colors.textSecondary}
    ) !important;
    font-size: 20px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(
        --theme-background-secondary,
        ${props => props.theme.colors.backgroundSecondary}
      );
      color: var(--theme-text, ${props => props.theme.colors.text});
    }
  }
  .ant-modal-body {
    background-color: var(
      --theme-surface,
      ${props => props.theme.colors.surface}
    ) !important;
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    padding: 32px;
  }
  .ant-upload-wrapper .ant-upload-drag {
    background-color: var(
      --theme-background-secondary,
      ${props => props.theme.colors.backgroundSecondary}
    ) !important;
    border: 2px dashed
      var(--theme-border, ${props => props.theme.colors.border}) !important;
    border-radius: 16px;
    padding: 48px 24px;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(
        --theme-primary,
        ${props => props.theme.colors.primary}
      ) !important;
      background-color: var(
        --theme-primary-background,
        ${props => props.theme.colors.primaryBackground}
      ) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
  }
  .ant-upload-drag-icon {
    font-size: 48px !important;
    color: var(
      --theme-primary,
      ${props => props.theme.colors.primary}
    ) !important;
    margin-bottom: 16px !important;
  }
  .ant-upload-text {
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    margin-bottom: 8px !important;
  }
  .ant-upload-hint {
    color: var(
      --theme-text-secondary,
      ${props => props.theme.colors.textSecondary}
    ) !important;
    font-size: 14px !important;
  }
  .ant-btn-primary {
    background-color: var(
      --theme-primary,
      ${props => props.theme.colors.primary}
    ) !important;
    border-color: var(
      --theme-primary,
      ${props => props.theme.colors.primary}
    ) !important;
    border-radius: 12px !important;
    padding: 12px 24px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    height: auto !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;

    &:hover {
      background-color: var(
        --theme-primary-dark,
        ${props => props.theme.colors.primaryDark}
      ) !important;
      border-color: var(
        --theme-primary-dark,
        ${props => props.theme.colors.primaryDark}
      ) !important;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
    }
  }
  .ant-btn-default {
    background-color: var(
      --theme-background,
      ${props => props.theme.colors.background}
    ) !important;
    border-color: var(
      --theme-border,
      ${props => props.theme.colors.border}
    ) !important;
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    border-radius: 12px !important;
    padding: 12px 24px !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    height: auto !important;

    &:hover {
      background-color: var(
        --theme-background-secondary,
        ${props => props.theme.colors.backgroundSecondary}
      ) !important;
      border-color: var(
        --theme-text-secondary,
        ${props => props.theme.colors.textSecondary}
      ) !important;
      color: var(--theme-text, ${props => props.theme.colors.text}) !important;
      transform: translateY(-1px);
    }
  }
  .ant-alert-info {
    background-color: var(
      --theme-info-background,
      ${props => props.theme.colors.infoBackground}
    ) !important;
    border-color: var(
      --theme-info-border,
      ${props => props.theme.colors.infoBorder}
    ) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 24px 0 !important;

    .ant-alert-message,
    .ant-alert-description {
      color: var(
        --theme-info-text,
        ${props => props.theme.colors.infoText}
      ) !important;
      font-size: 15px !important;
    }
  }
  .ant-typography {
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
  }
  .ant-typography-secondary {
    color: var(
      --theme-text-secondary,
      ${props => props.theme.colors.textSecondary}
    ) !important;
  }
  .ant-list {
    background-color: var(
      --theme-surface,
      ${props => props.theme.colors.surface}
    ) !important;
    border-radius: 12px !important;
    border: 1px solid var(--theme-border, ${props => props.theme.colors.border}) !important;
    padding: 16px !important;
  }
  .ant-list-item {
    border-bottom: 1px solid
      var(--theme-border, ${props => props.theme.colors.border}) !important;
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    padding: 16px 0 !important;

    &:hover {
      background-color: var(
        --theme-background-secondary,
        ${props => props.theme.colors.backgroundSecondary}
      ) !important;
      border-radius: 8px !important;
      margin: 0 -8px !important;
      padding: 16px 8px !important;
    }

    &:last-child {
      border-bottom: none !important;
    }
  }
  .ant-list-item-meta-title {
    color: var(--theme-text, ${props => props.theme.colors.text}) !important;
    font-size: 16px !important;
    font-weight: 600 !important;
  }
  .ant-list-item-meta-description {
    color: var(
      --theme-text-secondary,
      ${props => props.theme.colors.textSecondary}
    ) !important;
    font-size: 14px !important;
  }
`;

export const StepContainer = styled.div`
  margin: 32px 0;
`;

export const StepTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StepNumber = styled.span`
  background: var(--theme-primary, ${props => props.theme.colors.primary});
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
`;

export const StepDescription = styled.p`
  font-size: 16px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid
    var(--theme-border, ${props => props.theme.colors.border});
`;

export const PreviewContainer = styled.div`
  background: var(
    --theme-background-secondary,
    ${props => props.theme.colors.backgroundSecondary}
  );
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border-radius: 12px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  margin-bottom: 20px;
`;

export const FileIcon = styled.div`
  font-size: 24px;
  color: var(--theme-primary, ${props => props.theme.colors.primary});
`;

export const FileDetails = styled.div`
  flex: 1;
`;

export const FileName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin-bottom: 4px;
`;

export const FileSize = styled.div`
  font-size: 14px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
`;

export const ResponsibleConfigContainer = styled.div`
  color: var(--color-text, ${props => props.theme.colors.text});

  p {
    color: var(--color-text, ${props => props.theme.colors.text});
    margin: 0 0 12px 0;
  }
`;

export const ResponsibleOptionLabel = styled.label<{ $isFirst?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--color-text, ${props => props.theme.colors.text});
  margin-top: ${props => (props.$isFirst ? '0' : '8px')};

  input[type='radio'] {
    margin-right: 8px;
    cursor: pointer;
    accent-color: var(--color-primary, ${props => props.theme.colors.primary});
  }

  span {
    color: var(--color-text, ${props => props.theme.colors.text});

    strong {
      color: var(--color-text, ${props => props.theme.colors.text});
      font-weight: 600;
    }
  }
`;
