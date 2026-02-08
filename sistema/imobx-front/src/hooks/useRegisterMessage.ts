import { useState, useEffect } from 'react';

interface WelcomeMessage {
  title: string;
  subtitle: string;
}

export const useRegisterMessage = (): WelcomeMessage => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Verificar se é a primeira visita
    const hasVisited = localStorage.getItem('dream_keys_has_visited');
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem('dream_keys_has_visited', 'true');
    }
  }, []);

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const getRegisterMessage = (): WelcomeMessage => {
    const greeting = getTimeBasedGreeting();

    if (isFirstVisit) {
      return {
        title: `${greeting}! Bem-vindo ao Dream Keys`,
        subtitle:
          'Sua primeira experiência conosco. Crie sua conta e comece a gerenciar suas propriedades de forma profissional.',
      };
    } else {
      return {
        title: `${greeting}! Criar Nova Conta`,
        subtitle:
          'Que bom te ver novamente! Crie uma nova conta para acessar todas as funcionalidades do Dream Keys.',
      };
    }
  };

  return getRegisterMessage();
};
