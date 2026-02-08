import { useState, useEffect } from 'react';

export const useDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Salvar estado no localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('dream_keys_drawer_open');
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, []);

  // Atualizar localStorage quando estado muda
  useEffect(() => {
    localStorage.setItem('dream_keys_drawer_open', JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleDrawer = () => {
    setIsOpen(prev => !prev);
  };

  const openDrawer = () => {
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };
};
