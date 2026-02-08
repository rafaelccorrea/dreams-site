import React from 'react';
import { useParams } from 'react-router-dom';

export const PublicDocumentUploadPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
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
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>🔗 Página Pública de Upload</h1>
        <p style={{ marginBottom: '10px' }}>
          <strong>Token:</strong> {token || 'Não encontrado'}
        </p>
        <p style={{ color: '#22c55e', fontWeight: 'bold' }}>
          ✅ Se você está vendo isso, a página está funcionando!
        </p>
        <hr
          style={{
            margin: '20px 0',
            border: 'none',
            borderTop: '1px solid #ddd',
          }}
        />
        <p style={{ fontSize: '16px', color: '#666' }}>
          Esta é uma versão de teste. A funcionalidade completa será restaurada
          em breve.
        </p>
      </div>
    </div>
  );
};
