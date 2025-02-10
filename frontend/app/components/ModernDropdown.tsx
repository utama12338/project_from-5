'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import styled from 'styled-components';

const NeonWrapper = styled.div`
  /* Dark theme styles */
  .dark & .dropdown-trigger {
    background-color: rgb(20, 20, 19);
    border: none;
    border-radius: 10px;
   
    
    &:hover {
      box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
      transform: translateY(-1px);
    }
    
    &:focus-within {
      animation: rgbShadow 2s infinite linear;
      transform: translateY(-2px);
    }
  }

  .dark & .dropdown-options {
    background-color: rgb(20, 20, 19);
    border: none;
    border-radius: 10px;
  }

  .dark & .dropdown-option {
    &:hover {
      background: linear-gradient(45deg, #ff00ff20, #00ffff20);
      box-shadow: inset 0 0 15px rgba(255, 0, 255, 0.2);
    }
  }

  /* Light theme styles (modified) */
  .light & .dropdown-trigger {
    background-color: #F4F4F4;
    border: none;
    border-radius: 10px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #333;
    padding: 8px;  /* ลดขนาด padding */
    outline: none;
    
    
    /* ควบคุมขนาดของ trigger container */
    & > div {
      padding: 0;  /* ลบ padding เดิม */
      
      /* จัดการกับ flex container */
      & > div {
        padding: 0 8px;  /* ใส่ padding แค่ซ้าย-ขวา */
        min-height: unset;  /* ลบความสูงขั้นต่ำ */
        height: 24px;  /* กำหนดความสูงแน่นอน */
        display: flex;
        align-items: center;
      }
    }

    /* จัดการสีข้อความใน trigger */
    span {
      color: #333;
      &.placeholder {
        color: #666;
      }
    }
    
    /* ปรับสีไอคอน */
    svg {
      color: #666;
    }
  }

  .light & .dropdown-options {
    background-color: #F4F4F4;
    border: none;
    border-radius: 10px;
    box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.2);
    margin-top: 4px;  /* ลดระยะห่างระหว่าง trigger กับ options */
    
    /* ควบคุมขนาดของ options */
    & > div {
      max-height: 300px;  /* จำกัดความสูงสูงสุด */
    }
  }

  .light & .dropdown-option {
    color: #333;
    padding: 8px 12px;  /* ลด padding */
    font-size: 16px;  /* ควบคุมขนาดตัวอักษร */
    height: 40px;  /* กำหนดความสูงแน่นอน */
    display: flex;
    align-items: center;
    
    &:hover {
      background-color: #EAEAEA;
    }
  }

  .dropdown-container {
    position: relative;
    z-index: 10;
    
    &:focus-within {
      z-index: 50;
    }
    
    &:hover {
      z-index: 50;
    }
  }

  .options-container {
    position: relative;
    z-index: 101;
  }

  @keyframes rgbShadow {
    0% {
      box-shadow: -2px -2px 15px #ff0000, 2px 2px 15px #0000ff;
    }
    33% {
      box-shadow: -2px -2px 15px #00ff00, 2px 2px 15px #ff0000;
    }
    66% {
      box-shadow: -2px -2px 15px #0000ff, 2px 2px 15px #00ff00;
    }
    100% {
      box-shadow: -2px -2px 15px #ff0000, 2px 2px 15px #0000ff;
    }
  }
`;

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  className?: string;
}

const ModernDropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.2,
      },
    }),
  };

  return (
    <NeonWrapper>
      <div ref={dropdownRef} className="dropdown-container">
        {label && (
          <label className={`block text-sm font-medium mb-1 ${className}`}>
            {label}
            {required && <span className="text-pink-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`relative cursor-pointer ${className}`}
          >
            <div className="dropdown-trigger">
              <div className="flex items-center justify-between px-4 py-2">
                <span className={`block truncate ${value ? '' : 'placeholder'}`}>
                  {value || placeholder}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="dropdown-options mt-1"
                style={{
                  position: 'absolute',
                  width: '100%',
                  zIndex: 1000
                }}
              >
                <div className="options-container max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-700">
                  {options.map((option, index) => (
                    <motion.div
                      key={option}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      onClick={(e) => {
                        e.stopPropagation(); // Add this to prevent event bubbling
                        onChange(option);
                        setIsOpen(false);
                      }}
                      className="dropdown-option px-4 py-2 cursor-pointer"
                    >
                      {option}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </NeonWrapper>
  );
};

export default ModernDropdown;
