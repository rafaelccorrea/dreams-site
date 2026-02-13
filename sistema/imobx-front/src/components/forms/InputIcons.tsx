import React from 'react';

// Ícones minimalistas em SVG, usando a cor primária do tema via currentColor
export const MailIcon: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
    <rect x='3' y='5' width='18' height='14' rx='2' stroke='currentColor' strokeWidth='1.6' />
    <path
      d='M4 7l8 6 8-6'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const LockIcon: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
    <rect x='5' y='10' width='14' height='10' rx='2' stroke='currentColor' strokeWidth='1.6' />
    <path
      d='M9 10V8a3 3 0 0 1 6 0v2'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const UserIcon: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
    <circle cx='12' cy='9' r='3.5' stroke='currentColor' strokeWidth='1.6' />
    <path
      d='M5 19.5C6.5 17.5 8.9 16 12 16s5.5 1.5 7 3.5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const PhoneIcon: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
    <path
      d='M8 3h3l1 4-2 1a10 10 0 0 0 5 5l1-2 4 1v3c0 1.1-.9 2-2 2A14 14 0 0 1 4 5c0-1.1.9-2 2-2z'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const DocumentIcon: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
    <rect x='5' y='3' width='12' height='18' rx='2' stroke='currentColor' strokeWidth='1.6' />
    <path d='M9 8h6M9 12h6M9 16h4' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
  </svg>
);

