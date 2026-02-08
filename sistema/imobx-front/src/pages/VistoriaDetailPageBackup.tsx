import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VistoriaForm } from '@/components/vistoria';
import { useVistoriaById, useVistoria } from '@/hooks/useVistoria';
import { useProperties } from '@/hooks/useProperties';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';
import { usePermissions } from '@/hooks/usePermissions';
import { Layout } from '@/components/layout/Layout';
import { VistoriaDetailShimmer } from '@/components/common/Shimmer';
import type { Vistoria, UpdateVistoriaRequest } from '@/types/vistoria-types';
import {
  VISTORIA_STATUS_LABELS,
  VISTORIA_TIPO_LABELS,
  VISTORIA_STATUS_COLORS,
} from '@/types/vistoria-types';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  Camera,
  DollarSign,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import { formatPhoneDisplay } from '@/utils/masks';
import { ptBR } from 'date-fns/locale';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

export const VistoriaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    inspection: vistoria,
    loading,
    error,
    refetch,
  } = useVistoriaById(id || null);

  const { updateVistoria, deleteVistoria, uploadFoto, removeFoto } =
    useVistoria();
  const { properties } = useProperties();
  const { users } = useUsers();
  const { getCurrentUser } = useAuth();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissions();

  const vistoriadores =
    users?.filter(user => user.role === 'inspector' || user.role === 'admin') ||
    [];

  // Verificar permissões
  const canEditVistoria =
    hasPermission('inspection:update') ||
    getCurrentUser()?.role === 'admin' ||
    getCurrentUser()?.role === 'master';

  const canDeleteVistoria =
    hasPermission('inspection:delete') ||
    getCurrentUser()?.role === 'admin' ||
    getCurrentUser()?.role === 'master';

  const handleUpdateVistoria = async (data: UpdateVistoriaRequest) => {
    if (!vistoria) return;

    try {
      await updateVistoria(vistoria.id, data);
      setShowEditForm(false);
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar inspection:', error);
    }
  };

  const handleDeleteVistoria = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!vistoria) return;

    setIsDeleting(true);
    try {
      await deleteVistoria(vistoria.id);
      navigate('/inspection');
    } catch (error) {
      console.error('Erro ao excluir inspection:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
  };

  const handleUploadFoto = async (file: File) => {
    if (!vistoria) return;

    try {
      await uploadFoto(vistoria.id, file);
      refetch();
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
  };

  const handleRemoveFoto = async (fotoUrl: string) => {
    if (!vistoria) return;

    try {
      await removeFoto(vistoria.id, fotoUrl);
      refetch();
    } catch (error) {
      console.error('Erro ao remover foto:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className='p-8 max-w-7xl mx-auto'>
          <VistoriaDetailShimmer />
        </div>
      </Layout>
    );
  }

  if (error || !vistoria) {
    return (
      <Layout>
        <div className='p-8 max-w-7xl mx-auto'>
          <Card>
            <CardContent className='p-6'>
              <div className='text-center text-red-500'>
                <p>Erro ao carregar inspection: {error}</p>
                <Button
                  onClick={() => navigate('/inspection')}
                  className='mt-4'
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const statusColor = VISTORIA_STATUS_COLORS[vistoria.status];

  return (
    <Layout>
      <div className='p-8 max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-4'>
            <Button variant='outline' onClick={() => navigate('/inspection')}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Voltar
            </Button>
            <div>
              <h1 className='text-3xl font-bold'>{vistoria.title}</h1>
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant={statusColor as any}>
                  {VISTORIA_STATUS_LABELS[vistoria.status]}
                </Badge>
                <Badge variant='outline'>
                  {VISTORIA_TIPO_LABELS[vistoria.type]}
                </Badge>
              </div>
            </div>
          </div>

          <div className='flex gap-2'>
            {canEditVistoria && (
              <Button variant='outline' onClick={() => setShowEditForm(true)}>
                <Edit className='h-4 w-4 mr-2' />
                Editar
              </Button>
            )}
            {canDeleteVistoria && (
              <Button variant='outline' onClick={handleDeleteVistoria}>
                <Trash2 className='h-4 w-4 mr-2' />
                Excluir
              </Button>
            )}
          </div>
        </div>

        {/* Informações principais */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Informações da Vistoria</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {vistoria.description && (
                  <div>
                    <h4 className='font-medium mb-2'>Descrição</h4>
                    <p className='text-muted-foreground'>
                      {vistoria.description}
                    </p>
                  </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>Data Agendada</p>
                      <p className='text-sm text-muted-foreground'>
                        {format(
                          new Date(vistoria.scheduledDate),
                          'dd/MM/yyyy HH:mm',
                          { locale: ptBR }
                        )}
                      </p>
                    </div>
                  </div>

                  {vistoria.startDate && (
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium'>Data de Início</p>
                        <p className='text-sm text-muted-foreground'>
                          {format(
                            new Date(vistoria.startDate),
                            'dd/MM/yyyy HH:mm',
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {vistoria.completionDate && (
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium'>Data de Conclusão</p>
                        <p className='text-sm text-muted-foreground'>
                          {format(
                            new Date(vistoria.completionDate),
                            'dd/MM/yyyy HH:mm',
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {vistoria.observations && (
                  <div>
                    <h4 className='font-medium mb-2'>Observações</h4>
                    <p className='text-muted-foreground'>
                      {vistoria.observations}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            {/* Propriedade */}
            {vistoria.property && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4' />
                    Propriedade
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <p className='font-medium'>{vistoria.property.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {vistoria.property.address}
                    </p>
                    {vistoria.property.code && (
                      <p className='text-sm text-muted-foreground'>
                        Código: {vistoria.property.code}
                      </p>
                    )}
                  </div>

                  {/* Galeria de Imagens da Propriedade */}
                  {vistoria.property.images &&
                    vistoria.property.images.length > 0 && (
                      <div>
                        <h4 className='font-medium mb-3 flex items-center gap-2'>
                          <Camera className='h-4 w-4' />
                          Imagens da Propriedade (
                          {vistoria.property.images.length})
                        </h4>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                          {vistoria.property.images
                            .slice(0, 8)
                            .map((image, index) => (
                              <div
                                key={image.id || index}
                                className='relative group'
                              >
                                <img
                                  src={image.url}
                                  alt={`Imagem ${index + 1} da propriedade`}
                                  className='w-full h-24 object-cover rounded-lg border border-border'
                                  onError={e => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                {image.isMain && (
                                  <div className='absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded'>
                                    Principal
                                  </div>
                                )}
                              </div>
                            ))}
                          {vistoria.property.images.length > 8 && (
                            <div className='w-full h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm'>
                              +{vistoria.property.images.length - 8} mais
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Vistoriador */}
            {vistoria.inspector && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Vistoriador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='font-medium'>{vistoria.inspector.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {vistoria.inspector.email}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Valor */}
            {vistoria.value && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <DollarSign className='h-4 w-4' />
                    Valor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold text-green-600'>
                    R${' '}
                    {vistoria.value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Responsável */}
            {vistoria.responsibleName && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsável</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <p className='font-medium'>{vistoria.responsibleName}</p>
                  {vistoria.responsibleDocument && (
                    <p className='text-sm text-muted-foreground'>
                      Documento: {vistoria.responsibleDocument}
                    </p>
                  )}
                  {vistoria.responsiblePhone && (
                    <p className='text-sm text-muted-foreground'>
                      Telefone: {formatPhoneDisplay(vistoria.responsiblePhone)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs para fotos e checklist */}
        <Tabs defaultValue='fotos' className='w-full'>
          <TabsList>
            <TabsTrigger value='fotos' className='flex items-center gap-2'>
              <Camera className='h-4 w-4' />
              Fotos ({vistoria.photos?.length || 0})
            </TabsTrigger>
            <TabsTrigger value='checklist' className='flex items-center gap-2'>
              <CheckSquare className='h-4 w-4' />
              Checklist
            </TabsTrigger>
          </TabsList>

          <TabsContent value='fotos' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Fotos da Vistoria</CardTitle>
              </CardHeader>
              <CardContent>
                {vistoria.photos && vistoria.photos.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {vistoria.photos.map((foto, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={foto}
                          alt={`Foto ${index + 1}`}
                          className='w-full h-48 object-cover rounded-lg'
                        />
                        <Button
                          variant='destructive'
                          size='sm'
                          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                          onClick={() => handleRemoveFoto(foto)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <Camera className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Nenhuma foto adicionada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='checklist' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Checklist da Vistoria</CardTitle>
              </CardHeader>
              <CardContent>
                {vistoria.checklist ? (
                  <div className='space-y-2'>
                    {Object.entries(vistoria.checklist).map(([key, value]) => (
                      <div
                        key={key}
                        className='flex items-center justify-between p-3 border rounded-lg'
                      >
                        <span className='font-medium'>{key}</span>
                        <Badge variant={value ? 'default' : 'secondary'}>
                          {value ? 'Concluído' : 'Pendente'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <CheckSquare className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>Nenhum checklist definido</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de edição */}
        {showEditForm && canEditVistoria && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <VistoriaForm
                vistoria={vistoria}
                onSubmit={handleUpdateVistoria}
                onCancel={() => setShowEditForm(false)}
                properties={properties || []}
                vistoriadores={vistoriadores}
                isEdit={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title='Excluir Vistoria'
        message='Tem certeza que deseja excluir a vistoria:'
        itemName={vistoria?.title || ''}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default VistoriaDetailPage;
