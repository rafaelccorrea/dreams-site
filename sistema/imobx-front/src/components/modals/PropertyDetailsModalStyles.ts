import styled from 'styled-components';

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background);
    color: var(--color-text);
  }
`;

export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PropertyImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PropertyInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

export const PropertySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PropertySectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PropertyField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PropertyFieldLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PropertyFieldValue = styled.span`
  font-size: 1rem;
  color: var(--color-text);
  word-break: break-word;
`;

export const PropertyFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PropertyFeatureTag = styled.span`
  background: var(--color-primary);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const PropertyActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
`;

export const PropertyActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: var(--color-primary);
          color: white;
          
          &:hover {
            background: var(--color-primary-dark);
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: #EF4444;
          color: white;
          
          &:hover {
            background: #DC2626;
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
      default:
        return `
          background: var(--color-background-secondary);
          color: var(--color-text);
          border: 1px solid var(--color-border);
          
          &:hover {
            background: var(--color-background);
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;
