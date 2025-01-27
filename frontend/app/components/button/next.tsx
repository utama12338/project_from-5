import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick?: ((e: React.FormEvent) => Promise<void>) | (() => void);
  disabled?: boolean;
  children?: React.ReactNode;
  isSubmit?: boolean;
  isLoading?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled, 
  children, 
  isSubmit, 
  isLoading,
  currentStep = 1,
  totalSteps = 4
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      if (currentStep === totalSteps) {
        // เมื่อถึงขั้นตอนสุดท้ายจึงจะทำการ submit
        const result = onClick(e as any);
        if (result instanceof Promise) {
          result.catch(console.error);
        }
      } else {
        // ถ้ายังไม่ถึงขั้นตอนสุดท้าย ให้เรียก onClick แบบปกติ
        onClick(e);
      }
    }
  };

  return (
    <StyledWrapper $isSubmit={isSubmit}>
      <button 
        onClick={handleClick} 
        disabled={disabled || isLoading}
        type={currentStep === totalSteps ? "submit" : "button"}
      >
        {isLoading ? 'กำลังบันทึก...' : children || 'ถัดไป'}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $isSubmit?: boolean }>`
  button {
    padding: 17px 40px;
    border-radius: 50px;
    cursor: pointer;
    border: 0;
    background-color: ${props => props.$isSubmit ? '#22c55e' : '#EC4899'};
    color: white;
    box-shadow: ${props => props.$isSubmit ? 
      'rgba(34, 197, 94, 0.1) 0 0 8px' : 
      'rgba(236, 72, 153, 0.1) 0 0 8px'};
    letter-spacing: -0.5px; // Changed: tighter letter spacing in default state
    text-transform: uppercase;
    font-size: 15px;
    transition: all 0.5s ease;
  }

  button:hover {
    letter-spacing: 3px; // Expands on hover
    background-color: ${props => props.$isSubmit ? '#16a34a' : '#DB2777'};
    color: white;
    box-shadow: ${props => props.$isSubmit ? 
      'rgba(34, 197, 94, 0.4) 0px 7px 29px 0px' : 
      'rgba(236, 72, 153, 0.4) 0px 7px 29px 0px'};
  }

  button:active {
    letter-spacing: 3px;
    background-color: #BE185D; // Even Darker Pink
    color: white;
    box-shadow: rgba(236, 72, 153, 0.2) 0px 0px 0px 0px;
    transform: translateY(10px);
    transition: 100ms;
  }

  button:disabled {
    background-color: ${props => props.$isSubmit ? '#86efac' : '#F9A8D4'};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default Button;
