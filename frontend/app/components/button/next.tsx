import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeProvider/Theme';

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
  const { isDark } = useTheme();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      if (currentStep === totalSteps) {
        // เมื่อถึงขั้นตอนสุดท้ายจึงจะทำการ submit
        const result = onClick(e);
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
    <StyledWrapper $isSubmit={isSubmit} $isDark={isDark}>
      <div className="btn-conteiner">
        <button 
          onClick={handleClick} 
          disabled={disabled || isLoading}
          type={currentStep === totalSteps ? "submit" : "button"}
          className="btn-content"
        >
          {isLoading ? 'กำลังบันทึก...' : children || 'ถัดไป'}
          {isDark && (
            <span className="icon-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 66 43"
                height="30px"
                width="30px"
              >
                <g
                  fillRule="evenodd"
                  fill="none"
                  strokeWidth="1"
                  stroke="none"
                  id="arrow"
                >
                  <path
                    fill="#9ee5fa"
                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                    id="arrow-icon-one"
                  ></path>
                  <path
                    fill="#9ee5fa"
                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                    id="arrow-icon-two"
                  ></path>
                  <path
                    fill="#9ee5fa"
                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                    id="arrow-icon-three"
                  ></path>
                </g>
              </svg>
            </span>
          )}
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $isSubmit?: boolean; $isDark?: boolean }>`
  ${props => props.$isDark ? `
    .btn-conteiner {
      display: flex;
      justify-content: center;
      --color-text: #9ee5fa;
      --color-background: #353535;
      --color-outline: #9ee5fa80;
      --color-shadow: #00000080;
    }

    .btn-content {
      display: flex;
      align-items: center;
      padding: 17px 40px;
      text-decoration: none;
      font-family: "Poppins", sans-serif;
      font-size: 15px;
      color: var(--color-text);
      background: var(--color-background);
      transition: 1s;
      border-radius: 100px;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 0.2em 0 var(--color-background);
      
      &:hover {
        transition: 0.5s;
        animation: btn-content 1s;
        outline: 0.1em solid transparent;
        outline-offset: 0.2em;
        box-shadow: 0 0 0.4em 0 var(--color-background);
      }

      &:hover .icon-arrow {
        transform: translateX(0.2em);
      }

      &:hover #arrow-icon-three {
        animation: color_anim 1s infinite 0.2s;
      }

      &:hover #arrow-icon-one {
        transform: translateX(0%);
        animation: color_anim 1s infinite 0.6s;
      }

      &:hover #arrow-icon-two {
        transform: translateX(0%);
        animation: color_anim 1s infinite 0.4s;
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .icon-arrow {
      display: flex;
      align-items: center;
      margin-left: 15px;
      transition: 0.5s;
      transform: translateX(-0.2em);
    }
  ` : `
    button {
      padding: 17px 40px;
      border-radius: 50px;
      cursor: pointer;
      border: 0;
      background-color: ${props.$isSubmit ? '#22c55e' : '#EC4899'};
      color: white;
      box-shadow: ${props.$isSubmit ? 
        'rgba(34, 197, 94, 0.1) 0 0 8px' : 
        'rgba(236, 72, 153, 0.1) 0 0 8px'};
      letter-spacing: -0.5px;
      text-transform: uppercase;
      font-size: 15px;
      transition: all 0.5s ease;

      &:hover {
        letter-spacing: 3px;
        background-color: ${props.$isSubmit ? '#16a34a' : '#DB2777'};
        color: white;
        box-shadow: ${props.$isSubmit ? 
          'rgba(34, 197, 94, 0.4) 0px 7px 29px 0px' : 
          'rgba(236, 72, 153, 0.4) 0px 7px 29px 0px'};
      }

      &:active {
        letter-spacing: 3px;
        background-color: #BE185D;
        color: white;
        box-shadow: rgba(236, 72, 153, 0.2) 0px 0px 0px 0px;
        transform: translateY(10px);
        transition: 100ms;
      }

      &:disabled {
        background-color: ${props.$isSubmit ? '#86efac' : '#F9A8D4'};
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  `}

  @keyframes color_anim {
    0% { fill: white; }
    50% { fill: var(--color-background); }
    100% { fill: #9ee5fa; }
  }

  @keyframes btn-content {
    0% {
      outline: 0.2em solid var(--color-background);
      outline-offset: 0;
    }
  }
`;

export default Button;
