import React from 'react';
import { Layout } from '../components/layout/Layout';

export const ClientsPageSimple: React.FC = () => {
  return (
    <Layout>
      <div style={{ padding: '24px', color: 'white' }}>
        <h1>Clientes - Versão Simples</h1>
        <p>
          Esta é uma versão simplificada para testar se o problema é com o hook
          useClients.
        </p>
      </div>
    </Layout>
  );
};

export default ClientsPageSimple;
