import React, { useState } from 'react';
import { Button } from '../../styles/components/CommonStyles';
import { LoadingSpinner } from '../../styles/components/AlertStyles';

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  disabled?: boolean;
  type?: 'submit' | 'button';
  onClick?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingText,
  defaultText,
  disabled = false,
  type = 'submit',
  onClick,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isLoading && !disabled && onClick) {
      setIsAnimating(true);
      onClick();

      // Reset animation after 300ms
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <Button type={type} disabled={isLoading || disabled} onClick={handleClick}>
      {isLoading ? (
        <>
          <LoadingSpinner />
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </Button>
  );
};
