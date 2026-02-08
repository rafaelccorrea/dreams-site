import { useState } from 'react';
import { propertyApi } from '../services/propertyApi';
import { toast } from 'react-toastify';
import type { PropertyStatus } from '../types/property';

interface UsePropertyPublicFlagReturn {
  isPublic: boolean;
  loading: boolean;
  error: string | null;
  togglePublic: () => Promise<void>;
  setPublic: (value: boolean) => Promise<void>;
}

export const usePropertyPublicFlag = (
  propertyId: string,
  initialValue: boolean,
  propertyStatus?: PropertyStatus
): UsePropertyPublicFlagReturn => {
  const [isPublic, setIsPublic] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPublic = async (value: boolean) => {
    setLoading(true);
    setError(null);

    // Validar se está tentando ativar publicação
    if (value) {
      // Validar se o status é disponível
      if (propertyStatus && propertyStatus !== 'available') {
        const errorMsg =
          'Apenas propriedades com status "Disponível" podem ser publicadas no site Dream Keys.';
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }

      // Validar se tem pelo menos 5 imagens válidas antes de publicar
      try {
        const property = await propertyApi.getPropertyById(propertyId);

        // Validar se a propriedade está ativa
        if (!property.isActive) {
          const errorMsg =
            'Apenas propriedades ativas podem ser publicadas no site Dream Keys.';
          setError(errorMsg);
          setLoading(false);
          throw new Error(errorMsg);
        }

        const validImages =
          property.images?.filter(
            img => img && img.url && img.url.trim() !== ''
          ) || [];

        if (validImages.length < 5) {
          const errorMsg = `A propriedade precisa ter no mínimo 5 imagens válidas para ser publicada no site. Atualmente possui ${validImages.length} imagem(ns).`;
          setError(errorMsg);
          setLoading(false);
          throw new Error(errorMsg);
        }
      } catch (err: any) {
        // Se o erro já foi tratado acima (validação de imagens ou isActive), apenas propagar
        if (
          err.message &&
          (err.message.includes('imagens válidas') ||
            err.message.includes('propriedades ativas') ||
            err.message.includes('status "Disponível"'))
        ) {
          throw err;
        }
        // Se for erro ao buscar propriedade, não permitir publicação
        const errorMsg =
          'Não foi possível validar as imagens da propriedade. Tente novamente.';
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    }

    try {
      const response = await propertyApi.updateProperty(propertyId, {
        isAvailableForSite: value,
      });

      setIsPublic(response.isAvailableForSite || false);

      if (value) {
        toast.success(
          '✅ Propriedade adicionada ao site Dream Keys com sucesso!'
        );
      } else {
        toast.info('🔒 Propriedade removida do site Dream Keys.');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao atualizar propriedade';
      setError(errorMessage);

      // Verificar se é erro de plano Basic
      if (err.response?.status === 403) {
        const message = errorMessage.toLowerCase();

        if (message.includes('seu plano não permite')) {
          // Disparar evento para mostrar modal de upgrade
          window.dispatchEvent(
            new CustomEvent('property-public-upgrade-required', {
              detail: {
                title: 'Upgrade Necessário',
                message:
                  'Esta funcionalidade está disponível apenas no plano Professional.',
                errorMessage,
              },
            })
          );
          toast.error(
            'Seu plano não permite disponibilizar propriedades no site Dream Keys.'
          );
        } else if (message.includes('limite de propriedades públicas')) {
          // Disparar evento para mostrar modal de limite atingido
          window.dispatchEvent(
            new CustomEvent('property-public-limit-reached', {
              detail: {
                title: 'Limite Atingido',
                message: errorMessage,
                suggestions: [
                  'Remover algumas propriedades do site Dream Keys',
                  'Fazer upgrade para plano Custom (ilimitado)',
                ],
              },
            })
          );
          toast.error('Limite de propriedades no site Dream Keys atingido.');
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePublic = async () => {
    await setPublic(!isPublic);
  };

  return { isPublic, loading, error, togglePublic, setPublic };
};
