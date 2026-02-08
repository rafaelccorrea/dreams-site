import { useState, useCallback } from 'react';
import {
  fetchAddressByZipCode,
  fetchZipCodesByAddress,
  fetchStreetsByCity,
  isValidZipCode,
} from '../services/addressApi';

export interface AddressData {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}

export interface StreetOption {
  street: string;
  neighborhood: string;
  zipCode: string;
}

export interface UseAddressReturn {
  // Estados
  isLoading: boolean;
  error: string | null;
  addressData: AddressData | null;
  streetOptions: StreetOption[];

  // Funções
  searchByZipCode: (zipCode: string) => Promise<void>;
  searchByAddress: (
    state: string,
    city: string,
    street: string
  ) => Promise<AddressData[]>;
  searchStreets: (state: string, city: string, street: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
  clearStreetOptions: () => void;

  // Utilitários
  isValidZipCode: (zipCode: string) => boolean;
}

export const useAddress = (): UseAddressReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [streetOptions, setStreetOptions] = useState<StreetOption[]>([]);

  const searchByZipCode = useCallback(async (zipCode: string) => {
    if (!isValidZipCode(zipCode)) {
      setError('CEP deve ter 8 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAddressByZipCode(zipCode);
      setAddressData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao buscar CEP';
      setError(errorMessage);
      setAddressData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByAddress = useCallback(
    async (state: string, city: string, street: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchZipCodesByAddress(state, city, street);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao buscar endereços';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const searchStreets = useCallback(
    async (state: string, city: string, street: string) => {
      if (!state || !city || !street || street.length < 3) {
        setStreetOptions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const streets = await fetchStreetsByCity(state, city, street);
        setStreetOptions(streets);
      } catch (err) {
        console.warn('Erro ao buscar ruas:', err);
        setStreetOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearStreetOptions = useCallback(() => {
    setStreetOptions([]);
  }, []);

  const clearData = useCallback(() => {
    setAddressData(null);
    setStreetOptions([]);
    setError(null);
  }, []);

  return {
    // Estados
    isLoading,
    error,
    addressData,
    streetOptions,

    // Funções
    searchByZipCode,
    searchByAddress,
    searchStreets,
    clearError,
    clearData,
    clearStreetOptions,

    // Utilitários
    isValidZipCode,
  };
};
