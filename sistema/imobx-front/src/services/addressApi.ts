// Serviço para integração com APIs de endereço

/**
 * Busca endereço por CEP usando ViaCEP
 * @param zipCode - CEP para busca (com ou sem formatação)
 * @returns Promise com dados do endereço
 */
export const fetchAddressByZipCode = async (zipCode: string) => {
  const cleanZipCode = zipCode.replace(/\D/g, '');

  if (cleanZipCode.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanZipCode}/json/`
    );
    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      zipCode: cleanZipCode,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      ibge: data.ibge || '',
      gia: data.gia || '',
      ddd: data.ddd || '',
      siafi: data.siafi || '',
    };
  } catch (error) {
    throw new Error('Erro ao buscar CEP');
  }
};

/**
 * Busca CEPs por endereço usando ViaCEP
 * @param state - Estado (UF)
 * @param city - Cidade
 * @param street - Logradouro
 * @returns Promise com lista de CEPs
 */
export const fetchZipCodesByAddress = async (
  state: string,
  city: string,
  street: string
) => {
  if (!state || !city || !street) {
    throw new Error('Estado, cidade e logradouro são obrigatórios');
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${state}/${city}/${street}/json/`
    );
    const data = await response.json();

    if (data.erro) {
      throw new Error('Endereço não encontrado');
    }

    return Array.isArray(data) ? data : [data];
  } catch (error) {
    throw new Error('Erro ao buscar endereços');
  }
};

/**
 * Valida se um CEP é válido
 * @param zipCode - CEP para validação
 * @returns true se válido
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  return cleanZipCode.length === 8;
};

/**
 * Formata CEP para exibição
 * @param zipCode - CEP sem formatação
 * @returns CEP formatado (00000-000)
 */
export const formatZipCode = (zipCode: string): string => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  return cleanZipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Busca ruas por cidade e estado usando ViaCEP
 * @param state - Estado (UF)
 * @param city - Cidade
 * @param street - Início do nome da rua (mínimo 3 caracteres)
 * @returns Promise com lista de ruas
 */
export const fetchStreetsByCity = async (
  state: string,
  city: string,
  street: string
) => {
  if (!state || !city || !street || street.length < 3) {
    throw new Error(
      'Estado, cidade e pelo menos 3 caracteres da rua são obrigatórios'
    );
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${state}/${city}/${street}/json/`
    );
    const data = await response.json();

    if (data.erro) {
      return []; // Retorna array vazio se não encontrar
    }

    const results = Array.isArray(data) ? data : [data];

    // Filtrar e mapear apenas os logradouros únicos
    const uniqueStreets = [
      ...new Set(results.map(item => item.logradouro).filter(Boolean)),
    ];

    return uniqueStreets.map(streetName => ({
      street: streetName,
      neighborhood:
        results.find(item => item.logradouro === streetName)?.bairro || '',
      zipCode: results.find(item => item.logradouro === streetName)?.cep || '',
    }));
  } catch (error) {
    console.warn('Erro ao buscar ruas:', error);
    return []; // Retorna array vazio em caso de erro
  }
};

/**
 * Remove formatação do CEP
 * @param formattedZipCode - CEP formatado
 * @returns CEP apenas com números
 */
export const cleanZipCode = (formattedZipCode: string): string => {
  return formattedZipCode.replace(/\D/g, '');
};

/**
 * Busca cidades de um estado usando ViaCEP
 * ViaCEP não tem endpoint direto para listar cidades, então fazemos buscas genéricas
 * com diferentes termos para obter o máximo de cidades possíveis
 * @param state - Estado (UF) - ex: 'SP', 'RJ'
 * @returns Promise com lista de cidades únicas do estado
 */
export const fetchCitiesByState = async (
  state: string
): Promise<Array<{ nome: string }>> => {
  if (!state || state.length !== 2) {
    throw new Error('Estado (UF) deve ter 2 caracteres');
  }

  try {
    const allCities = new Set<string>();
    const stateUpper = state.toUpperCase();

    // ViaCEP permite buscar por estado/cidade/rua
    // Fazendo buscas com termos comuns para obter várias cidades
    // Usando termos que tendem a retornar muitas cidades
    const searchTerms = [
      'a',
      'e',
      'i',
      'o',
      'u', // Vogais comuns
      'r',
      's',
      't',
      'n',
      'm', // Consoantes comuns
      'centro',
      'vila',
      'santa',
      'sao',
      'nova', // Termos comuns em nomes de cidades
    ];

    // Buscar com diferentes termos de forma paralela para acelerar
    const promises = searchTerms.map(async term => {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${stateUpper}/${term}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          const results = Array.isArray(data) ? data : [data];
          results.forEach((item: any) => {
            if (item.localidade) {
              allCities.add(item.localidade);
            }
          });
        }
      } catch (error) {
        // Ignorar erros individuais e continuar
        return;
      }
    });

    // Aguardar todas as buscas
    await Promise.all(promises);

    // Converter para array e ordenar alfabeticamente
    const cities = Array.from(allCities)
      .map(nome => ({ nome }))
      .sort((a, b) => a.nome.localeCompare(b.nome));

    return cities;
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    throw new Error('Erro ao buscar cidades do estado');
  }
};
