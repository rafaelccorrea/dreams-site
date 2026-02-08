import { useState, useEffect, useCallback } from 'react';
import { rentalService } from '@/services/rental.service';
import type {
  Rental,
  RentalFilter,
  RentalListResponse,
  CreateRentalRequest,
  UpdateRentalRequest,
  RentalStatus,
} from '@/types/rental.types';
import { toast } from 'react-toastify';

export const useRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRentals = useCallback(async (filters?: RentalFilter) => {
    try {
      setLoading(true);
      setError(null);
      const data = await rentalService.getAll(filters);
      setRentals(data.rentals);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar aluguéis';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRental = useCallback(async (data: CreateRentalRequest) => {
    try {
      const rental = await rentalService.create(data);
      toast.success('Aluguel criado com sucesso!');
      return rental;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao criar aluguel';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateRental = useCallback(
    async (id: string, data: UpdateRentalRequest) => {
      try {
        const rental = await rentalService.update(id, data);
        toast.success('Aluguel atualizado com sucesso!');
        return rental;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao atualizar aluguel';
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteRental = useCallback(async (id: string) => {
    try {
      await rentalService.delete(id);
      setRentals(prev => prev.filter(r => r.id !== id));
      toast.success('Aluguel excluído com sucesso!');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao excluir aluguel';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: RentalStatus) => {
    try {
      const rental = await rentalService.updateStatus(id, status);
      setRentals(prev => prev.map(r => (r.id === id ? rental : r)));
      toast.success('Status atualizado com sucesso!');
      return rental;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao atualizar status';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const generatePayments = useCallback(async (id: string) => {
    try {
      await rentalService.generatePayments(id);
      toast.success('Pagamentos gerados com sucesso!');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao gerar pagamentos';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    rentals,
    loading,
    error,
    fetchRentals,
    createRental,
    updateRental,
    deleteRental,
    updateStatus,
    generatePayments,
  };
};

export const useRentalDetails = (id: string | undefined) => {
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRental = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await rentalService.getById(id);
      setRental(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar aluguel';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRental();
  }, [fetchRental]);

  return {
    rental,
    loading,
    error,
    refetch: fetchRental,
  };
};
