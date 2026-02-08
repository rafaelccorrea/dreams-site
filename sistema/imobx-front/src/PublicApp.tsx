import React, { useState, useEffect } from 'react';
import {
  uploadMultiplePublicDocuments,
  validateClientCpf,
} from './services/uploadTokenApi';
import { getPublicSignature } from './services/publicSignatureApi';
import { getAssetPath } from './utils/pathUtils';

export default function PublicApp() {
  // Verificar se é rota de assinatura
  const path = window.location.pathname;
  const isSignatureRoute = path.includes('/assinar/');

  if (isSignatureRoute) {
    // Extrair ID da assinatura da URL
    const parts = path.split('/assinar/');
    const signatureId = parts[1]?.split('/')[0] || parts[1];
    return <PublicSignaturePage signatureId={signatureId} />;
  }

  // Se não for rota de assinatura, renderizar página de upload
  return <DocumentUpload />;
}

function PublicSignaturePage({ signatureId }: { signatureId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToSignature = async () => {
      if (!signatureId) {
        setError('ID de assinatura não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const signature = await getPublicSignature(signatureId);

        if (signature?.signatureUrl) {
          // Redirecionar diretamente para o Assinafy
          window.location.href = signature.signatureUrl;
        } else {
          setError('URL de assinatura não disponível');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Erro ao buscar assinatura:', err);
        setError(err.response?.data?.message || 'Erro ao carregar assinatura');
        setLoading(false);
      }
    };

    redirectToSignature();
  }, [signatureId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #A63126 0%, #8B251C 50%, #6B1D15 100%)',
          color: 'white',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '48px' }}>⏳</div>
        <div style={{ fontSize: '18px' }}>
          Redirecionando para assinatura...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #A63126 0%, #8B251C 50%, #6B1D15 100%)',
          color: 'white',
          padding: '20px',
        }}
      >
        <div
          style={{
            background: 'white',
            color: '#333',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h1 style={{ marginBottom: '20px', color: '#e74c3c' }}>Erro</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            {error}
          </p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Por favor, verifique o link ou entre em contato com o responsável.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function DocumentUpload() {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'validate' | 'upload' | 'success'>(
    'validate'
  );
  const [clientName, setClientName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState('identity');
  const [title, setTitle] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const [cpfValidated, setCpfValidated] = useState(false);
  const [validatedCpf, setValidatedCpf] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Obter token da URL
  const getTokenFromUrl = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1] || '';
  };

  const handleCpfChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';

    if (cleaned.length <= 11) {
      // Formatação de CPF: 000.000.000-00
      formatted = cleaned
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        .slice(0, 14);
    } else if (cleaned.length <= 14) {
      // Formatação de CNPJ: 00.000.000/0000-00
      formatted = cleaned
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        .slice(0, 18);
    } else {
      // Limitar a 14 dígitos numéricos
      formatted = cleaned
        .slice(0, 14)
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    setCpf(formatted);
  };

  const validateCpfFormat = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    // Validação pelo length: CPF tem exatamente 11 dígitos, CNPJ tem exatamente 14 dígitos
    return cleanCpf.length === 11 || cleanCpf.length === 14;
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Remove formatação para validar
    const cleanCpf = cpf.replace(/\D/g, '');

    // Validação pelo length: deve ser exatamente 11 (CPF) ou 14 (CNPJ)
    if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
      if (cleanCpf.length === 0) {
        setValidationError('Por favor, informe seu Documento (CPF ou CNPJ).');
      } else if (cleanCpf.length < 11) {
        setValidationError(
          `Documento incompleto. Faltam ${11 - cleanCpf.length} dígito(s) para um CPF válido.`
        );
      } else if (cleanCpf.length > 11 && cleanCpf.length < 14) {
        setValidationError(
          `Documento incompleto. Faltam ${14 - cleanCpf.length} dígito(s) para um CNPJ válido.`
        );
      } else {
        setValidationError(
          'Documento inválido. Digite um CPF (11 dígitos) ou CNPJ (14 dígitos).'
        );
      }
      return;
    }

    setLoading(true);

    try {
      const token = getTokenFromUrl();
      if (!token) {
        setValidationError('Token não encontrado na URL');
        setLoading(false);
        return;
      }

      // Chamar API para validar documento
      const validationResult = await validateClientCpf(token, cleanCpf);

      if (validationResult.valid) {
        // Documento validado com sucesso
        setCpfValidated(true);
        setValidatedCpf(cleanCpf);
        setClientName(validationResult.clientName || 'Cliente');
        setStep('upload');
        setValidationError(null);
      } else {
        // Documento não corresponde ao cliente
        let errorMessage =
          validationResult.message ||
          'O Documento informado não corresponde ao cliente vinculado a este link. Verifique se digitou corretamente.';

        // Substituir referências específicas por "Documento" (com D maiúsculo)
        errorMessage = errorMessage.replace(/CPF/gi, 'Documento');
        errorMessage = errorMessage.replace(/CNPJ/gi, 'Documento');
        errorMessage = errorMessage.replace(/cpf/gi, 'Documento');
        errorMessage = errorMessage.replace(/cnpj/gi, 'Documento');
        // Garantir que "Documento" sempre comece com maiúscula
        errorMessage = errorMessage.replace(
          /\bdocumento\b/gi,
          (match: string) => {
            return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
          }
        );

        setValidationError(errorMessage);
        setCpfValidated(false);
        setValidatedCpf('');
        setClientName('');
      }
    } catch (error: any) {
      console.error('Erro na validação:', error);
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao validar o Documento. Por favor, tente novamente.';

      // Substituir referências específicas por "Documento" (com D maiúsculo)
      errorMessage = errorMessage.replace(/CPF/gi, 'Documento');
      errorMessage = errorMessage.replace(/CNPJ/gi, 'Documento');
      errorMessage = errorMessage.replace(/cpf/gi, 'Documento');
      errorMessage = errorMessage.replace(/cnpj/gi, 'Documento');
      // Garantir que "Documento" sempre comece com maiúscula
      errorMessage = errorMessage.replace(
        /\bdocumento\b/gi,
        (match: string) => {
          return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
        }
      );

      setValidationError(errorMessage);
      setCpfValidated(false);
      setValidatedCpf('');
      setClientName('');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles.slice(0, 10));
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDAÇÃO CRÍTICA: Não permitir upload sem validação de documento
    if (!cpfValidated || !validatedCpf) {
      alert(
        'Por favor, valide seu Documento antes de fazer upload dos arquivos.'
      );
      setStep('validate');
      return;
    }

    if (files.length === 0) {
      alert('Selecione pelo menos um arquivo');
      return;
    }

    setLoading(true);
    setValidationError(null);

    try {
      const token = getTokenFromUrl();
      if (!token) {
        alert('Token não encontrado na URL');
        setLoading(false);
        return;
      }

      // Usar o CPF validado (sem formatação)
      const uploadData = {
        files,
        cpf: validatedCpf, // Usar o CPF já validado
        type: documentType as any,
        title: title || undefined,
      };

      const result = await uploadMultiplePublicDocuments(token, uploadData);

      setUploadedCount(result.documents?.length || files.length);
      setStep('success');
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      const errorMessage =
        error.response?.data?.message || 'Erro ao fazer upload dos documentos';
      alert(errorMessage);

      // Se o erro for relacionado a documento não validado, voltar para validação
      if (
        errorMessage.includes('documento') ||
        errorMessage.includes('não corresponde')
      ) {
        setCpfValidated(false);
        setValidatedCpf('');
        setStep('validate');
      }
    } finally {
      setLoading(false);
    }
  };

  // Proteção adicional: Se tentar acessar upload sem validação, redirecionar
  useEffect(() => {
    if (step === 'upload' && !cpfValidated) {
      setStep('validate');
      setValidationError(
        'Por favor, valide seu Documento primeiro para continuar.'
      );
    }
  }, [step, cpfValidated]);

  return (
    <div style={styles.container}>
      <style>{keyframesCSS}</style>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.logoContainer}>
            <img
              src={getAssetPath('intellisys.png')}
              alt='Intellisys Logo'
              style={styles.logoImage}
            />
          </div>
          <h1 style={styles.title}>📄 Envio de Documentos</h1>
          <p style={styles.subtitle}>Sistema Seguro e Rápido</p>
        </div>

        <div style={styles.cardContent}>
          {step === 'validate' ? (
            <>
              <div style={styles.header}>
                <div style={styles.headerIcon}>🔐</div>
                <h2 style={styles.headerTitle}>Validação de Acesso</h2>
                <p style={styles.headerDesc}>
                  Precisamos validar seu Documento (CPF ou CNPJ) para prosseguir
                  com segurança
                </p>
              </div>

              <form onSubmit={handleValidate} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Documento (CPF/CNPJ)</label>
                  <input
                    type='text'
                    placeholder='000.000.000-00 ou 00.000.000/0000-00'
                    value={cpf}
                    onChange={e => handleCpfChange(e.target.value)}
                    maxLength={18}
                    required
                    style={{
                      ...styles.input,
                      borderColor: validationError ? '#ef4444' : '#e5e7eb',
                    }}
                  />
                  {validationError && (
                    <div
                      style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        marginTop: '4px',
                        fontWeight: 500,
                      }}
                    >
                      ⚠️ {validationError}
                    </div>
                  )}
                </div>
                <button
                  type='submit'
                  disabled={loading || !validateCpfFormat(cpf)}
                  style={{
                    ...styles.button,
                    opacity: loading || !validateCpfFormat(cpf) ? 0.6 : 1,
                  }}
                >
                  {loading ? '⏳ Validando...' : '✅ Validar e Continuar'}
                </button>
                {(() => {
                  const cleanCpf = cpf.replace(/\D/g, '');
                  if (cleanCpf.length > 0 && cleanCpf.length < 11) {
                    return (
                      <small
                        style={{
                          ...styles.helpText,
                          color: '#6b7280',
                          marginTop: '8px',
                        }}
                      >
                        Digite {11 - cleanCpf.length} dígito(s) para CPF ou{' '}
                        {14 - cleanCpf.length} dígito(s) para CNPJ
                      </small>
                    );
                  }
                  return null;
                })()}
              </form>
            </>
          ) : step === 'upload' && cpfValidated ? (
            <>
              <div style={styles.header}>
                <div style={styles.headerIcon}>🎉</div>
                <h2 style={styles.headerTitle}>Bem-vindo, {clientName}! 👋</h2>
                <p style={styles.headerDesc}>
                  Agora você pode enviar seus documentos de forma rápida e
                  segura
                </p>
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#fef2f2',
                    borderRadius: '8px',
                    border: '1px solid #A63126',
                    fontSize: '14px',
                    color: '#8B251C',
                  }}
                >
                  ✅ Documento validado com sucesso! Você pode prosseguir com o
                  envio.
                </div>
              </div>

              <form onSubmit={handleUpload} style={styles.form}>
                <div style={styles.grid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tipo de Documento</label>
                    <select
                      value={documentType}
                      onChange={e => setDocumentType(e.target.value)}
                      style={styles.select}
                    >
                      <option value='identity'>RG / CNH</option>
                      <option value='proof_of_address'>
                        Comprovante de Residência
                      </option>
                      <option value='proof_of_income'>
                        Comprovante de Renda
                      </option>
                      <option value='contract'>Contrato</option>
                      <option value='other'>Outro</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Título (opcional)</label>
                    <input
                      type='text'
                      placeholder='Ex: RG - Frente'
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Selecionar Arquivos</label>
                  <label style={styles.fileInputLabel}>
                    📁 Clique para selecionar ou arraste aqui
                    <input
                      type='file'
                      multiple
                      onChange={handleFileChange}
                      accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
                      style={{ display: 'none' }}
                    />
                  </label>
                  <small style={styles.helpText}>
                    PDF, DOC, DOCX, JPG, PNG (máximo 10 arquivos de 10MB cada)
                  </small>
                </div>

                {files.length > 0 && (
                  <div style={styles.fileListContainer}>
                    <h4 style={styles.fileListTitle}>
                      Arquivos Selecionados ({files.length})
                    </h4>
                    {files.map((file, idx) => (
                      <div key={idx} style={styles.fileItem}>
                        <span style={styles.fileIcon}>📄</span>
                        <div style={styles.fileInfo}>
                          <div style={styles.fileName}>{file.name}</div>
                          <div style={styles.fileSize}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeFile(idx)}
                          style={{
                            ...styles.removeButton,
                          }}
                          title='Remover arquivo'
                          onMouseEnter={e => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.opacity = '0.7';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={loading || files.length === 0}
                  style={{
                    ...styles.button,
                    opacity: loading || files.length === 0 ? 0.6 : 1,
                  }}
                >
                  {loading
                    ? '⏳ Enviando...'
                    : `📤 Enviar ${files.length} Documento(s)`}
                </button>
              </form>
            </>
          ) : step === 'success' ? (
            <>
              <div style={styles.header}>
                <div style={styles.headerIcon}>🎉</div>
                <h2 style={styles.headerTitle}>
                  Upload Realizado com Sucesso!
                </h2>
                <p style={styles.headerDesc}>
                  Parabéns! {uploadedCount} documento(s) foram enviados com
                  segurança.
                </p>
              </div>

              <div style={styles.successContent}>
                <div style={styles.successCard}>
                  <div style={styles.successIcon}>✅</div>
                  <h3 style={styles.successTitle}>Documentos Recebidos</h3>
                  <p style={styles.successText}>
                    Seus documentos foram processados e estão seguros em nosso
                    sistema. O link de upload expirou automaticamente para
                    garantir a segurança.
                  </p>
                  <div style={styles.successDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        📄 Documentos enviados:
                      </span>
                      <span style={styles.detailValue}>{uploadedCount}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>👤 Cliente:</span>
                      <span style={styles.detailValue}>{clientName}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>⏰ Data/Hora:</span>
                      <span style={styles.detailValue}>
                        {new Date().toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.warningCard}>
                  <div style={styles.warningIcon}>🔒</div>
                  <h4 style={styles.warningTitle}>Link Expirado</h4>
                  <p style={styles.warningText}>
                    Este link de upload expirou automaticamente após o envio dos
                    documentos para garantir a segurança das informações.
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const keyframesCSS = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #A63126 0%, #8B251C 50%, #6B1D15 100%)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(30px)',
    borderRadius: '24px',
    boxShadow:
      '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    width: '100%',
    maxWidth: '900px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    animation: 'slideInUp 0.6s ease-out',
  },
  cardHeader: {
    padding: '40px 32px',
    background:
      'linear-gradient(135deg, #A63126 0%, #8B251C 50%, #6B1D15 100%)',
    color: 'white',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    position: 'relative' as const,
    zIndex: 1,
  },
  logoImage: {
    height: '80px',
    width: 'auto',
    filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))',
    transition: 'transform 0.3s ease',
    animation: 'fadeIn 0.8s ease-out',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  subtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0,
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  cardContent: {
    padding: '40px 32px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
    animation: 'fadeIn 0.8s ease-out 0.1s both',
  },
  headerIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
  },
  headerTitle: {
    fontSize: '28px',
    color: '#1f2937',
    marginBottom: '8px',
    fontWeight: 700,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  headerDesc: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.6',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    animation: 'fadeIn 0.8s ease-out 0.2s both',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1f2937',
    letterSpacing: '-0.3px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  input: {
    padding: '16px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    background: '#f9fafb',
    transition: 'all 0.3s ease',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    cursor: 'text',
  },
  select: {
    padding: '16px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    background: '#f9fafb',
    transition: 'all 0.3s ease',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    cursor: 'pointer',
  },
  fileInputLabel: {
    display: 'block',
    padding: '24px 20px',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    textAlign: 'center' as const,
    background: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    fontWeight: 500,
    color: '#6b7280',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  helpText: {
    display: 'block',
    marginTop: '8px',
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: '1.4',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  fileListContainer: {
    marginTop: '16px',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    maxHeight: '240px',
    overflowY: 'auto' as const,
  },
  fileListTitle: {
    margin: '0 0 12px 0',
    fontSize: '13px',
    color: '#374151',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #e5e7eb',
    animation: 'fadeIn 0.3s ease-out',
  },
  fileIcon: {
    fontSize: '18px',
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: '13px',
    color: '#1f2937',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fileSize: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '2px',
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    opacity: 0.7,
  },
  button: {
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #A63126 0%, #8B251C 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(166, 49, 38, 0.3)',
    letterSpacing: '-0.3px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  successContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    animation: 'fadeIn 0.8s ease-out 0.2s both',
  },
  successCard: {
    background: '#fef2f2',
    border: '2px solid #A63126',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#8B251C',
    marginBottom: '12px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  successText: {
    fontSize: '16px',
    color: '#8B251C',
    lineHeight: '1.6',
    marginBottom: '24px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  successDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    textAlign: 'left' as const,
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '8px',
    border: '1px solid rgba(166, 49, 38, 0.2)',
  },
  detailLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#8B251C',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  detailValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#A63126',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  warningCard: {
    background: '#fef3c7',
    border: '2px solid #f59e0b',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  warningIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  warningTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#92400e',
    marginBottom: '4px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  warningText: {
    fontSize: '14px',
    color: '#92400e',
    lineHeight: '1.5',
    margin: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
};
