import { useState, useCallback, useRef, useEffect } from 'react';

interface UseOptimizedModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
  preventBodyScroll?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

export const useOptimizedModal = (options: UseOptimizedModalOptions = {}) => {
  const {
    onOpen,
    onClose,
    preventBodyScroll = true,
    closeOnEscape = true,
    closeOnOverlayClick = true,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função para abrir modal com otimização
  const openModal = useCallback(() => {
    if (isOpen) return;

    setIsAnimating(true);
    setIsOpen(true);

    // Prevenir scroll do body
    if (preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }

    // Callback de abertura
    onOpen?.();

    // Limpar animação após um frame
    requestAnimationFrame(() => {
      setIsAnimating(false);
    });
  }, [isOpen, preventBodyScroll, onOpen]);

  // Função para fechar modal com otimização
  const closeModal = useCallback(() => {
    if (!isOpen) return;

    setIsAnimating(true);

    // Callback de fechamento
    onClose?.();

    // Delay para animação de saída
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);

      // Restaurar scroll do body
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    }, 150); // Tempo da animação de saída
  }, [isOpen, preventBodyScroll, onClose]);

  // Toggle do modal
  const toggleModal = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  // Handler para clique no overlay
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeOnOverlayClick, closeModal]
  );

  // Handler para tecla Escape
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, closeModal]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Restaurar scroll do body
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [preventBodyScroll]);

  return {
    isOpen,
    isAnimating,
    modalRef,
    openModal,
    closeModal,
    toggleModal,
    handleOverlayClick,
  };
};

// Hook para otimizar performance de listas
export const useOptimizedList = <T>(
  items: T[],
  options: {
    pageSize?: number;
    initialPage?: number;
    searchTerm?: string;
    searchFields?: (keyof T)[];
  } = {}
) => {
  const {
    pageSize = 20,
    initialPage = 1,
    searchTerm = '',
    searchFields = [],
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar itens com debounce
  const filteredItems = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) {
      return items;
    }

    const searchLower = searchTerm.toLowerCase();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchLower);
      })
    );
  }, [items, searchTerm, searchFields]);

  // Paginação
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  // Função para mudar página
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Função para próxima página
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // Função para página anterior
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    totalItems: filteredItems.length,
    isLoading,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Hook para otimizar performance de formulários
export const useOptimizedForm = <T extends Record<string, any>>(
  initialData: T,
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    debounceMs?: number;
  } = {}
) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300,
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função para atualizar campo
  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setData(prev => ({ ...prev, [field]: value }));
      setIsDirty(true);

      // Limpar erro do campo
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // Função para validar campo
  const validateField = useCallback(
    (field: keyof T, value: any, validator?: (value: any) => string | null) => {
      if (!validator) return;

      const error = validator(value);
      setErrors(prev => ({
        ...prev,
        [field]: error || undefined,
      }));
    },
    []
  );

  // Função para validar todos os campos
  const validateAll = useCallback(
    (validators: Partial<Record<keyof T, (value: any) => string | null>>) => {
      const newErrors: Partial<Record<keyof T, string>> = {};

      Object.entries(validators).forEach(([field, validator]) => {
        if (validator) {
          const error = validator(data[field as keyof T]);
          if (error) {
            newErrors[field as keyof T] = error;
          }
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [data]
  );

  // Função para resetar formulário
  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialData]);

  // Função para submeter formulário
  const submitForm = useCallback(
    async (
      onSubmit: (data: T) => Promise<void>,
      validators?: Partial<Record<keyof T, (value: any) => string | null>>
    ) => {
      if (isSubmitting) return;

      // Validar se necessário
      if (validators && !validateAll(validators)) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, isSubmitting, validateAll]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    validateField,
    validateAll,
    resetForm,
    submitForm,
  };
};

// Hook para otimizar performance de busca
export const useOptimizedSearch = (
  options: {
    debounceMs?: number;
    minLength?: number;
  } = {}
) => {
  const { debounceMs = 300, minLength = 2 } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce do termo de busca
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debounceMs]);

  // Função para atualizar busca
  const updateSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Função para limpar busca
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  // Verificar se busca é válida
  const isValidSearch = debouncedSearchTerm.length >= minLength;

  return {
    searchTerm,
    debouncedSearchTerm,
    isValidSearch,
    updateSearch,
    clearSearch,
  };
};
