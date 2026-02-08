import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { showSuccess, showError } from '../../utils/notifications';
import { validateEmail } from '../../utils/masks';
import {
  ModernModalOverlay,
  ModernModalContainer,
  ModernModalHeader,
  ModernModalHeaderContent,
  ModernModalTitle,
  ModernModalSubtitle,
  ModernModalCloseButton,
  ModernModalContent,
  ModernModalFooter,
  ModernFormSection,
  ModernFormSectionTitle,
  ModernFormGrid,
  ModernFormGroup,
  ModernFormLabel,
  ModernRequiredIndicator,
  ModernFormInput,
  ModernFormTextarea,
  ModernFormSelect,
  ModernErrorMessage,
  ModernButton,
  ModernInfoBox,
  ModernInfoText,
} from '../../styles/components/ModernModalStyles';
import {
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBadge,
  MdSecurity,
  MdSave,
  MdEdit,
  MdAdd,
  MdInfo,
} from 'react-icons/md';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => Promise<void>;
  user?: any;
  isLoading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          document: user.document || '',
          phone: user.phone || '',
          role: user.role || 'user',
          password: '',
          confirmPassword: '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          document: '',
          phone: '',
          role: 'user',
          password: '',
          confirmPassword: '',
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.document.trim()) {
      newErrors.document = 'CPF/CNPJ é obrigatório';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Senha é obrigatória para novos usuários';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        document: formData.document.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        ...(formData.password && { password: formData.password }),
      };

      await onSave(userData);
      showSuccess(
        user ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!'
      );
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      showError(error.message || 'Erro ao salvar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModernModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModernModalContainer $isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModernModalHeader>
          <ModernModalHeaderContent>
            <div>
              <ModernModalTitle>
                {user ? <MdEdit /> : <MdAdd />}
                {user ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </ModernModalTitle>
              <ModernModalSubtitle>
                {user
                  ? 'Atualize as informações do usuário'
                  : 'Preencha as informações para criar um novo usuário'}
              </ModernModalSubtitle>
            </div>
            <ModernModalCloseButton
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <MdClose />
            </ModernModalCloseButton>
          </ModernModalHeaderContent>
        </ModernModalHeader>

        <ModernModalContent>
          <form onSubmit={handleSubmit}>
            <ModernFormSection>
              <ModernFormSectionTitle>
                <MdPerson />
                Informações Pessoais
              </ModernFormSectionTitle>

              <ModernFormGrid>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Nome Completo
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder='Digite o nome completo'
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <ModernErrorMessage>{errors.name}</ModernErrorMessage>
                  )}
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    Email
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='email@exemplo.com'
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <ModernErrorMessage>{errors.email}</ModernErrorMessage>
                  )}
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    CPF/CNPJ
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.document}
                    onChange={e =>
                      handleInputChange('document', e.target.value)
                    }
                    placeholder='000.000.000-00 ou 00.000.000/0000-00'
                    maxLength={18}
                    disabled={isSubmitting}
                  />
                  {errors.document && (
                    <ModernErrorMessage>{errors.document}</ModernErrorMessage>
                  )}
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>Telefone</ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder='(00) 00000-0000'
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <ModernErrorMessage>{errors.phone}</ModernErrorMessage>
                  )}
                </ModernFormGroup>
              </ModernFormGrid>
            </ModernFormSection>

            <ModernFormSection>
              <ModernFormSectionTitle>
                <MdSecurity />
                Configurações de Acesso
              </ModernFormSectionTitle>

              <ModernFormGrid>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Função
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormSelect
                    value={formData.role}
                    onChange={e => handleInputChange('role', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value='user'>Usuário</option>
                    <option value='admin'>Administrador</option>
                  </ModernFormSelect>
                  {errors.role && (
                    <ModernErrorMessage>{errors.role}</ModernErrorMessage>
                  )}
                </ModernFormGroup>

                {!user && (
                  <>
                    <ModernFormGroup>
                      <ModernFormLabel>
                        Senha
                        <ModernRequiredIndicator>*</ModernRequiredIndicator>
                      </ModernFormLabel>
                      <ModernFormInput
                        type='password'
                        value={formData.password}
                        onChange={e =>
                          handleInputChange('password', e.target.value)
                        }
                        placeholder='Digite uma senha segura'
                        disabled={isSubmitting}
                      />
                      {errors.password && (
                        <ModernErrorMessage>
                          {errors.password}
                        </ModernErrorMessage>
                      )}
                    </ModernFormGroup>

                    <ModernFormGroup>
                      <ModernFormLabel>
                        Confirmar Senha
                        <ModernRequiredIndicator>*</ModernRequiredIndicator>
                      </ModernFormLabel>
                      <ModernFormInput
                        type='password'
                        value={formData.confirmPassword}
                        onChange={e =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        placeholder='Confirme a senha'
                        disabled={isSubmitting}
                      />
                      {errors.confirmPassword && (
                        <ModernErrorMessage>
                          {errors.confirmPassword}
                        </ModernErrorMessage>
                      )}
                    </ModernFormGroup>
                  </>
                )}
              </ModernFormGrid>
            </ModernFormSection>

            {user && (
              <ModernInfoBox>
                <MdInfo size={20} />
                <ModernInfoText>
                  Para alterar a senha do usuário, use a opção "Redefinir Senha"
                  no menu de ações.
                </ModernInfoText>
              </ModernInfoBox>
            )}
          </form>
        </ModernModalContent>

        <ModernModalFooter>
          <ModernButton
            type='button'
            $variant='secondary'
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </ModernButton>

          <ModernButton
            type='submit'
            $variant='primary'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ccc',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                {user ? 'Atualizando...' : 'Criando...'}
              </>
            ) : (
              <>
                <MdSave />
                {user ? 'Atualizar Usuário' : 'Criar Usuário'}
              </>
            )}
          </ModernButton>
        </ModernModalFooter>
      </ModernModalContainer>
    </ModernModalOverlay>
  );
};

export default UserModal;
