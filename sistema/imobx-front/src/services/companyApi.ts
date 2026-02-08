import { api } from './api';

export interface CreateCompanyData {
  name: string;
  cnpj: string;
  corporateName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: File; // Logo como arquivo File
  description?: string;
  website?: string;
  planType?: string;
  maxCompanies?: number;
  subscriptionPrice?: number;
  availableModules?: string[];
  planFeatures?: Record<string, any>;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  corporateName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
  logoUrl?: string; // Backend pode retornar logoUrl
  watermark?: string | null; // URL da marca d'água ou null
  description?: string;
  website?: string;
  isActive: boolean;
  planType: string;
  maxCompanies: number;
  subscriptionPrice: number;
  availableModules: string[];
  planFeatures: Record<string, any>;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionStatus: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

class CompanyApiService {
  // Helper para normalizar dados da empresa (mapear logoUrl para logo)
  private normalizeCompany(company: any): Company {
    return {
      ...company,
      logo: company.logo || company.logoUrl || undefined,
    };
  }

  // Helper para normalizar array de empresas
  private normalizeCompanies(companies: any[]): Company[] {
    return companies.map(company => this.normalizeCompany(company));
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    try {
      // console.log('Criando empresa:', data);

      // CORREÇÃO: Usar FormData para multipart/form-data quando há logo
      const hasLogo = data.logo instanceof File;

      if (hasLogo) {
        const formData = new FormData();

        // Campos obrigatórios
        formData.append('name', data.name);
        formData.append('cnpj', data.cnpj);
        formData.append('corporateName', data.corporateName);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('zipCode', data.zipCode);

        // Logo como arquivo
        if (data.logo) {
          formData.append('logo', data.logo);
        }

        // Campos opcionais
        if (data.description) {
          formData.append('description', data.description);
        }
        if (data.website) {
          formData.append('website', data.website);
        }
        if (data.planType) {
          formData.append('planType', data.planType);
        }
        if (data.maxCompanies !== undefined) {
          formData.append('maxCompanies', data.maxCompanies.toString());
        }
        if (data.subscriptionPrice !== undefined) {
          formData.append(
            'subscriptionPrice',
            data.subscriptionPrice.toString()
          );
        }
        if (data.availableModules && Array.isArray(data.availableModules)) {
          formData.append(
            'availableModules',
            JSON.stringify(data.availableModules)
          );
        }
        if (data.planFeatures) {
          formData.append('planFeatures', JSON.stringify(data.planFeatures));
        }

        // Não definir Content-Type manualmente - o axios remove automaticamente para FormData
        // e o browser define com o boundary correto
        const response = await api.post('/companies', formData);

        return this.normalizeCompany(response.data);
      } else {
        // Se não tem logo, enviar como JSON normal (compatibilidade)
        const { logo, ...jsonData } = data;
        const response = await api.post('/companies', jsonData);
        return this.normalizeCompany(response.data);
      }
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  }

  async getCompanies(): Promise<Company[]> {
    try {
      // console.log('Buscando empresas...');
      const response = await api.get('/companies');
      // console.log('Empresas encontradas:', response.data);
      return this.normalizeCompanies(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  async hasCompanies(): Promise<boolean> {
    try {
      // console.log('Verificando se usuário tem empresas...');
      const response = await api.get('/companies/has-companies');
      // console.log('Status de empresas:', response.data);
      return response.data.hasCompanies;
    } catch (error: any) {
      console.error('Erro ao verificar empresas:', error);
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<Company> {
    try {
      // console.log(`Buscando empresa ${id}...`);
      const response = await api.get(`/companies/${id}`);
      // console.log('Empresa encontrada:', response.data);
      return this.normalizeCompany(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar empresa:', error);
      throw error;
    }
  }

  async updateCompany(
    id: string,
    data: Partial<CreateCompanyData & { logo?: string | null }>
  ): Promise<Company> {
    try {
      // console.log(`Atualizando empresa ${id}:`, data);
      const response = await api.put(`/companies/${id}`, data);
      // console.log('Empresa atualizada com sucesso:', response.data);
      return this.normalizeCompany(response.data);
    } catch (error: any) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  }

  async uploadLogo(
    companyId: string,
    formData: FormData
  ): Promise<{ logoUrl: string; message: string }> {
    try {
      // console.log('Fazendo upload do logo...');
      const response = await api.post(
        `/companies/${companyId}/upload-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // console.log('Logo enviado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao fazer upload do logo:', error);
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      // console.log(`Deletando empresa ${id}...`);
      await api.delete(`/companies/${id}`);
      // console.log('Empresa deletada com sucesso');
    } catch (error: any) {
      console.error('Erro ao deletar empresa:', error);
      throw error;
    }
  }
}

export const companyApi = new CompanyApiService();
