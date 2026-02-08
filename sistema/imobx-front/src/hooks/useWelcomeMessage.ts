import { useState, useEffect } from 'react';

interface WelcomeMessage {
  title: string;
  subtitle: string;
}

export const useWelcomeMessage = (): WelcomeMessage => {
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

  const getWelcomeMessage = (): WelcomeMessage => {
    const greeting = getTimeBasedGreeting();

    if (isFirstVisit) {
      return {
        title: `${greeting}! Bem-vindo ao Dream Keys`,
        subtitle:
          'Sua primeira experiência conosco. Faça login para acessar sua conta e começar a gerenciar suas propriedades.',
      };
    } else {
      return {
        title: `${greeting}! Bem-vindo de volta`,
        subtitle:
          'Que bom te ver novamente! Faça login para continuar gerenciando suas propriedades no Dream Keys.',
      };
    }
  };

  return getWelcomeMessage();
};
