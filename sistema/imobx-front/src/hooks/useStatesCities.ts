import { useState, useEffect, useCallback } from 'react';
import { viaCepApi } from '../services/viaCepApi';

export interface State {
  id: string;
  sigla: string;
  nome: string;
}

export interface City {
  id: string;
  nome: string;
}

export interface UseStatesCitiesReturn {
  states: State[];
  cities: City[];
  selectedState: State | null;
  selectedCity: City | null;
  loadingStates: boolean;
  loadingCities: boolean;
  setSelectedState: (state: State | null) => void;
  setSelectedCity: (city: City | null) => void;
  handleSetSelectedState: (state: State | null) => void;
  handleSetSelectedCity: (city: City | null) => void;
  getCityDisplayName: () => string;
}

export const useStatesCities = (): UseStatesCitiesReturn => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedStateInternal] = useState<State | null>(
    null
  );
  const [selectedCity, setSelectedCityInternal] = useState<City | null>(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Carregar estados na inicialização
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesData = await viaCepApi.getStates();
        setStates(statesData);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Carregar cidades quando estado for selecionado
  useEffect(() => {
    if (selectedState) {
      const loadCities = async () => {
        setLoadingCities(true);
        setCities([]);
        setSelectedCityInternal(null);

        try {
          const citiesData = await viaCepApi.getCitiesByState(
            selectedState.sigla
          );
          setCities(citiesData);
        } catch (error) {
          console.error('Erro ao carregar cidades:', error);
        } finally {
          setLoadingCities(false);
        }
      };

      loadCities();
    } else {
      setCities([]);
      setSelectedCityInternal(null);
    }
  }, [selectedState]);

  const handleSetSelectedState = useCallback((state: State | null) => {
    setSelectedStateInternal(state);
    setSelectedCityInternal(null);
  }, []);

  const handleSetSelectedCity = useCallback((city: City | null) => {
    setSelectedCityInternal(city);
  }, []);

  const getCityDisplayName = useCallback(() => {
    if (selectedCity && selectedState) {
      return `${selectedCity.nome} - ${selectedState.sigla}`;
    }
    return '';
  }, [selectedCity, selectedState]);

  return {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    setSelectedState: handleSetSelectedState,
    setSelectedCity: handleSetSelectedCity,
    handleSetSelectedState,
    handleSetSelectedCity,
    getCityDisplayName,
  };
};
