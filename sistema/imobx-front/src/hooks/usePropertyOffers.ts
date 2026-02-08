import { useState, useCallback } from 'react';
import { propertyOffersApi } from '../services/propertyOffersApi';
import type {
  PropertyOffer,
  UpdateOfferStatusRequest,
} from '../types/propertyOffer';
import type { OfferFilters } from '../services/propertyOffersApi';

export interface UsePropertyOffersReturn {
  // Estado
  offers: PropertyOffer[];
  loading: boolean;
  error: string | null;

  // Ações
  fetchPropertyOffers: (propertyId: string) => Promise<void>;
  fetchAllOffers: (filters?: OfferFilters) => Promise<void>;
  fetchOfferById: (offerId: string) => Promise<PropertyOffer>;
  acceptOffer: (offerId: string, responseMessage?: string) => Promise<void>;
  rejectOffer: (offerId: string, responseMessage?: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook para gerenciar ofertas de propriedades
 * Para uso por imobiliárias e responsáveis por propriedades
 */
export const usePropertyOffers = (
  propertyId?: string
): UsePropertyOffersReturn => {
  const [offers, setOffers] = useState<PropertyOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchPropertyOffers = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOffers = await propertyOffersApi.getPropertyOffers(id);
      setOffers(fetchedOffers);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar ofertas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllOffers = useCallback(async (filters?: OfferFilters) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOffers = await propertyOffersApi.getAllOffers(filters);
      setOffers(fetchedOffers);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar ofertas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOfferById = useCallback(
    async (offerId: string): Promise<PropertyOffer> => {
      setLoading(true);
      setError(null);
      try {
        const offer = await propertyOffersApi.getOfferById(offerId);
        // Atualizar oferta na lista se existir
        setOffers(prev => prev.map(o => (o.id === offerId ? offer : o)));
        return offer;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao buscar oferta';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const acceptOffer = useCallback(
    async (offerId: string, responseMessage?: string) => {
      setLoading(true);
      setError(null);
      try {
        const data: UpdateOfferStatusRequest = {
          status: 'accepted',
          responseMessage,
        };
        const updatedOffer = await propertyOffersApi.updateOfferStatus(
          offerId,
          data
        );
        // Atualizar oferta na lista
        setOffers(prev => prev.map(o => (o.id === offerId ? updatedOffer : o)));
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao aceitar oferta';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const rejectOffer = useCallback(
    async (offerId: string, responseMessage?: string) => {
      setLoading(true);
      setError(null);
      try {
        const data: UpdateOfferStatusRequest = {
          status: 'rejected',
          responseMessage,
        };
        const updatedOffer = await propertyOffersApi.updateOfferStatus(
          offerId,
          data
        );
        // Atualizar oferta na lista
        setOffers(prev => prev.map(o => (o.id === offerId ? updatedOffer : o)));
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao rejeitar oferta';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    offers,
    loading,
    error,
    fetchPropertyOffers,
    fetchAllOffers,
    fetchOfferById,
    acceptOffer,
    rejectOffer,
    clearError,
  };
};
