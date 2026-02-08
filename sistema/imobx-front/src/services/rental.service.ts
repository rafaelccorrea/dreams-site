import { api } from './api';
import type {
  Rental,
  CreateRentalRequest,
  UpdateRentalRequest,
  RentalListResponse,
  RentalStatus,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  RentalPayment,
} from '../types/rental.types';
import type { RentalFilters } from '../types/filters';

export const rentalService = {
  // CRUD de Aluguéis
  async create(data: CreateRentalRequest): Promise<Rental> {
    const response = await api.post<Rental>('/rental', data);
    return response.data;
  },

  async getAll(filters?: RentalFilters): Promise<RentalListResponse> {
    const response = await api.get<RentalListResponse>('/rental', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Rental> {
    const response = await api.get<Rental>(`/rental/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateRentalRequest): Promise<Rental> {
    const response = await api.put<Rental>(`/rental/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rental/${id}`);
  },

  async updateStatus(id: string, status: RentalStatus): Promise<Rental> {
    const response = await api.put<Rental>(`/rental/${id}/status`, { status });
    return response.data;
  },

  // Gestão de Pagamentos
  async generatePayments(rentalId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/rental/${rentalId}/payments/generate`
    );
    return response.data;
  },

  async getPayments(rentalId: string): Promise<RentalPayment[]> {
    const response = await api.get<RentalPayment[]>(
      `/rental/${rentalId}/payments`
    );
    return response.data;
  },

  async addPayment(
    rentalId: string,
    data: CreatePaymentRequest
  ): Promise<Rental> {
    const response = await api.post<Rental>(
      `/rental/${rentalId}/payments`,
      data
    );
    return response.data;
  },

  async updatePayment(
    rentalId: string,
    paymentId: string,
    data: UpdatePaymentRequest
  ): Promise<Rental> {
    const response = await api.put<Rental>(
      `/rental/${rentalId}/payments/${paymentId}`,
      data
    );
    return response.data;
  },

  async deletePayment(rentalId: string, paymentId: string): Promise<void> {
    await api.delete(`/rental/${rentalId}/payments/${paymentId}`);
  },
};
