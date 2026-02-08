import { api } from './api';
import * as XLSX from 'xlsx';
import type { ClientFilters } from '../types/filters';
import type { ClientInteraction } from '../types/client';

export interface BulkImportResult {
  success: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

class ClientsApiService {
  async getClients(filters?: ClientFilters) {
    const response = await api.get('/clients', { params: filters });
    return response.data;
  }

  async createClient(clientData: any) {
    const response = await api.post('/clients', clientData);
    return response.data;
  }

  async updateClient(id: string, clientData: any) {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  }

  async deleteClient(id: string) {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  }

  async getClient(id: string) {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  }

  async transferClient(clientId: string, newResponsibleUserId: string) {
    const response = await api.put(`/clients/${clientId}/transfer`, {
      newResponsibleUserId,
    });
    return response.data;
  }

  async getCompanyUsersForTransfer() {
    const response = await api.get('/clients/users-for-transfer');
    return response.data;
  }

  async bulkImport(formData: FormData): Promise<any> {
    const response = await api.post('/clients/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async bulkImportFromData(clientsData: any[]): Promise<BulkImportResult> {
    // Criar um arquivo Excel temporário para enviar
    const workbook = this.createWorkbookFromData(clientsData);
    const excelBuffer = this.workbookToBuffer(workbook);

    // Criar FormData para upload
    const formData = new FormData();
    const fileName = `clientes_importacao_${Date.now()}.xlsx`;
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    formData.append('file', blob, fileName);

    const response = await api.post('/clients/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  private createWorkbookFromData(data: any[]) {
    // Criar worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Criar workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

    return wb;
  }

  private workbookToBuffer(workbook: any): ArrayBuffer {
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  }

  // Métodos para o sistema assíncrono
  async getImportJobs(): Promise<any[]> {
    const response = await api.get('/clients/import-jobs');
    return response.data;
  }

  async getImportJobStatus(jobId: string): Promise<any> {
    const response = await api.get(`/clients/import-jobs/${jobId}`);
    return response.data;
  }

  async downloadErrorSpreadsheet(jobId: string): Promise<Blob> {
    const response = await api.get(`/clients/import-jobs/${jobId}/errors`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportClientsViaAPI(): Promise<any> {
    const response = await api.get('/clients/export');
    return response.data;
  }

  // Exportação em lotes para grandes volumes
  async exportClientsBulk(
    page: number = 1,
    pageSize: number = 1000
  ): Promise<any> {
    const response = await api.get(
      `/clients/export-bulk?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getAllClientsForExport(): Promise<any[]> {
    const allClients = [];
    let currentPage = 1;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const batch = await this.exportClientsBulk(currentPage, pageSize);

      if (batch.data && batch.data.length > 0) {
        allClients.push(...batch.data);

        // Verifica se há mais páginas
        hasMore = batch.data.length === pageSize;
        currentPage++;
      } else {
        hasMore = false;
      }

      // Pequeno delay para não sobrecarregar o servidor
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return allClients;
  }

  async getClientInteractions(clientId: string): Promise<ClientInteraction[]> {
    const response = await api.get(`/clients/${clientId}/interactions`);
    return response.data;
  }

  async createClientInteraction(
    clientId: string,
    formData: FormData
  ): Promise<ClientInteraction> {
    // O interceptor do axios remove automaticamente o Content-Type para FormData
    // permitindo que o navegador defina com o boundary correto
    const response = await api.post(
      `/clients/${clientId}/interactions`,
      formData
    );
    return response.data;
  }

  async updateClientInteraction(
    clientId: string,
    interactionId: string,
    formData: FormData
  ): Promise<ClientInteraction> {
    // O interceptor do axios remove automaticamente o Content-Type para FormData
    // permitindo que o navegador defina com o boundary correto
    const response = await api.put(
      `/clients/${clientId}/interactions/${interactionId}`,
      formData
    );
    return response.data;
  }

  async deleteClientInteraction(
    clientId: string,
    interactionId: string
  ): Promise<void> {
    await api.delete(`/clients/${clientId}/interactions/${interactionId}`);
  }
}

export const clientsApi = new ClientsApiService();
