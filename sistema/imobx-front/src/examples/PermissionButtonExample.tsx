import React from 'react';
import { PermissionButton } from '../components/common/PermissionButton';
import { MdAdd, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';

/**
 * Exemplo de uso do PermissionButton
 *
 * Este componente demonstra como usar o PermissionButton
 * que sempre fica visível mas desabilitado quando não há permissão
 */
export const PermissionButtonExample: React.FC = () => {
  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <h3>Exemplos de PermissionButton:</h3>

      {/* Botão com permissão */}
      <PermissionButton
        permission='inspection:view'
        variant='primary'
        size='medium'
        onClick={() => console.log('Visualizar vistoria')}
      >
        <MdVisibility size={16} />
        Visualizar Vistoria
      </PermissionButton>

      {/* Botão sem permissão */}
      <PermissionButton
        permission='inspection:create'
        variant='primary'
        size='medium'
        onClick={() => console.log('Criar vistoria')}
        tooltip='Você precisa de permissão para criar vistorias'
      >
        <MdAdd size={16} />
        Nova Vistoria
      </PermissionButton>

      {/* Botão de edição */}
      <PermissionButton
        permission='inspection:update'
        variant='secondary'
        size='medium'
        onClick={() => console.log('Editar vistoria')}
      >
        <MdEdit size={16} />
        Editar
      </PermissionButton>

      {/* Botão de exclusão */}
      <PermissionButton
        permission='inspection:delete'
        variant='danger'
        size='small'
        onClick={() => console.log('Excluir vistoria')}
      >
        <MdDelete size={14} />
        Excluir
      </PermissionButton>

      {/* Botão desabilitado manualmente */}
      <PermissionButton
        permission='inspection:view'
        variant='primary'
        size='large'
        disabled={true}
        onClick={() => console.log('Este não vai executar')}
      >
        <MdVisibility size={18} />
        Botão Desabilitado
      </PermissionButton>
    </div>
  );
};

/**
 * Como usar na página de Vistorias:
 *
 * // Antes (botão desaparecia):
 * <PermissionWrapper permission="inspection:create">
 *   <CreateButton onClick={handleCreate}>
 *     Nova Vistoria
 *   </CreateButton>
 * </PermissionWrapper>
 *
 * // Depois (botão sempre visível, desabilitado sem permissão):
 * <PermissionButton
 *   permission="inspection:create"
 *   variant="primary"
 *   onClick={handleCreate}
 * >
 *   <MdAdd size={16} />
 *   Nova Vistoria
 * </PermissionButton>
 */
