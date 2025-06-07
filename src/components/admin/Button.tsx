import React from 'react';
import { ButtonProps } from './ButtonProps'; 

const Button: React.FC<ButtonProps> = ({ children, onClick, type, className, disabled, size, variant }) => {
  const buttonClasses = [
    'rounded',
    size && `text-${size}`,
    variant && `bg-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
