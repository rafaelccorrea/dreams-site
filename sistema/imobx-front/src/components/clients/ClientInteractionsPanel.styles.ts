import styled from 'styled-components';

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}25;
  }
`;

export const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}30;
  color: ${props => props.theme.colors.error};
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  margin-bottom: 16px;
`;

export const InteractionForm = styled.form`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const CloseFormButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.error};
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    outline: none;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  line-height: 1.6;
  resize: vertical;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    outline: none;
  }
`;

export const AttachmentsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FilePickerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  font-size: 0.813rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const SelectedFilesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

export const SelectedFileCard = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SelectedFileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SelectedFileFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  width: 100%;
  height: 100%;
  padding: 8px;
  text-align: center;
`;

export const SelectedFileOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 4px 6px;
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SelectedFileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SelectedFileMeta = styled.span`
  opacity: 0.85;
`;

export const SelectedFileRemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ExistingAttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

export const ExistingAttachmentNotice = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ExistingAttachmentGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ExistingAttachmentCard = styled.div`
  width: 220px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ExistingAttachmentPreview = styled.div`
  position: relative;
  width: 100%;
  padding-top: 70%;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

export const ExistingAttachmentImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ExistingAttachmentIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.4rem;
`;

export const ExistingAttachmentCheckbox = styled.input`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 18px;
  height: 18px;
`;

export const ExistingAttachmentInfo = styled.div`
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ExistingAttachmentLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

export const ExistingAttachmentMeta = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ExistingAttachmentActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ExistingAttachmentLink = styled.a`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const ExistingAttachmentHint = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid ${props => props.theme.colors.border};
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const SmallHint = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const LoadingState = styled.div`
  padding: 20px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  font-size: 0.875rem;
`;

export const EmptyState = styled.div`
  padding: 24px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const InteractionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InteractionItem = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InteractionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const InteractionTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const InteractionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InteractionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.813rem;
`;

export const InteractionMetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${props => props.theme.colors.border};

  span {
    font-weight: 500;
  }
`;

export const InteractionNotes = styled.p`
  margin: 0;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const InteractionAttachmentGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const InteractionAttachmentItem = styled.a`
  display: flex;
  flex-direction: column;
  width: 140px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  text-decoration: none;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
  }
`;

export const InteractionAttachmentPreview = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

export const InteractionAttachmentImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InteractionAttachmentIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.6rem;
`;

export const InteractionAttachmentInfo = styled.div`
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InteractionAttachmentName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const InteractionAttachmentMeta = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;
