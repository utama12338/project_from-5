import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeProvider/Theme';

interface DeleteButtonProps {
  onClick?: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  const { isDark } = useTheme();

  return (
    <StyledWrapper $isDark={isDark}>
      {isDark ? (
        <button className="button" onClick={onClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 14" className="svgIcon bin-top">
            <g clipPath="url(#clip0_35_24)">
              <path fill="black" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z" />
            </g>
            <defs>
              <clipPath id="clip0_35_24">
                <rect fill="white" height={14} width={69} />
              </clipPath>
            </defs>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 57" className="svgIcon bin-bottom">
            <g clipPath="url(#clip0_35_22)">
              <path fill="black" d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z" />
            </g>
            <defs>
              <clipPath id="clip0_35_22">
                <rect fill="white" height={57} width={69} />
              </clipPath>
            </defs>
          </svg>
        </button>
      ) : (
        <button className="bin-button" onClick={onClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 39 7" className="bin-top">
            <line strokeWidth={4} stroke="white" y2={5} x2={39} y1={5} />
            <line strokeWidth={3} stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1={12} />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 39" className="bin-bottom">
            <mask fill="white" id="path-1-inside-1_8_19">
              <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
            </mask>
            <path mask="url(#path-1-inside-1_8_19)" fill="white" d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" />
            <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
            <path strokeWidth={4} stroke="white" d="M21 6V29" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 89 80" className="garbage">
            <path fill="white" d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z" />
          </svg>
        </button>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $isDark: boolean }>`
  ${props => props.$isDark ? `
    .button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgb(20, 20, 20);
      border: none;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
      cursor: pointer;
      transition-duration: 0.3s;
      overflow: hidden;
      position: relative;
      gap: 1px;
    }

    .svgIcon {
      width: 12px;
      transition-duration: 0.3s;
    }

    .svgIcon path {
      fill: white;
    }

    .button:hover {
      width: 140px;
      border-radius: 50px;
      transition-duration: 0.3s;
      background-color: rgb(255, 69, 69);
      align-items: center;
      gap: 0;
    }

    .button:hover .bin-bottom {
      width: 50px;
      transition-duration: 0.3s;
      transform: translateY(60%);
    }

    .bin-top {
      transform-origin: bottom right;
    }

    .button:hover .bin-top {
      width: 50px;
      transition-duration: 0.3s;
      transform: translateY(60%) rotate(160deg);
    }

    .button::before {
      position: absolute;
      top: -20px;
      content: "Delete";
      color: white;
      transition-duration: 0.3s;
      font-size: 2px;
    }

    .button:hover::before {
      font-size: 13px;
      opacity: 1;
      transform: translateY(35px);
      transition-duration: 0.3s;
    }
  ` : `
    .bin-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 55px;
      height: 55px;
      border-radius: 30%;
      background-color: rgb(255, 0, 0);
      cursor: pointer;
      border: none;
      transition-duration: 0.3s;
      position: relative;
      overflow: hidden;
    }
    .bin-bottom {
      width: 15px;
      z-index: 2;
    }
    .bin-top {
      width: 17px;
      transform-origin: right;
      transition-duration: 0.3s;
      z-index: 2;
    }
    .bin-button:hover .bin-top {
      transform: rotate(45deg);
    }
    .bin-button:hover {
      background-color: rgb(187, 0, 0);
    }
    .bin-button:active {
      transform: scale(0.9);
    }
    .garbage {
      position: absolute;
      width: 14px;
      height: auto;
      z-index: 1;
      opacity: 0;
      transition: all 0.3s;
    }
    .bin-button:hover .garbage {
      animation: throw 0.4s linear;
    }
    @keyframes throw {
      from {
        transform: translate(-400%, -700%);
        opacity: 0;
      }
      to {
        transform: translate(0%, 0%);
        opacity: 1;
      }
    }
  `}
`;

export default DeleteButton;
