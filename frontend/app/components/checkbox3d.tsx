'use client'
import styled from 'styled-components';
import { ReactNode } from 'react';
import { useTheme } from './ThemeProvider/Theme';

interface StyledWrapperProps {
  $isDark: boolean;
}

const Checkbox3d = styled.div<StyledWrapperProps>`
  ${props => props.$isDark ? `
    .checkbox-wrapper-33 {
      --s-xsmall: 0.625em;
      --s-small: 1.2em;
      --border-width: 1px;
      --c-primary: #5f11e8;
      --c-primary-20-percent-opacity: rgb(95 17 232 / 20%);
      --c-primary-10-percent-opacity: rgb(95 17 232 / 10%);
      --t-base: 0.4s;
      --t-fast: 0.2s;
      --e-in: ease-in;
      --e-out: cubic-bezier(0.11, 0.29, 0.18, 0.98);
    }

    .checkbox-wrapper-33 .visuallyhidden {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    .checkbox-wrapper-33 .checkbox {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: white;
      gap: 0.5rem;  /* Add gap to match light theme spacing */
    }

    .checkbox-wrapper-33 .checkbox + .checkbox {
      margin-top: var(--s-small);
    }

    .checkbox-wrapper-33 .checkbox__symbol {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;     /* Match light theme size */
      height: 24px;    /* Match light theme size */
      margin-right: 0; /* Remove margin since we're using gap */
      border: var(--border-width) solid var(--c-primary);
      position: relative;
      border-radius: 0.1em;
      transition: box-shadow var(--t-base) var(--e-out),
        background-color var(--t-base);
      box-shadow: 0 0 0 0 var(--c-primary-10-percent-opacity);
    }

    .checkbox-wrapper-33 .checkbox__symbol:after {
      content: "";
      position: absolute;
      top: 0.5em;
      left: 0.5em;
      width: 0.25em;
      height: 0.25em;
      background-color: var(--c-primary-20-percent-opacity);
      opacity: 0;
      border-radius: 3em;
      transform: scale(1);
      transform-origin: 50% 50%;
    }

    .checkbox-wrapper-33 .checkbox .icon-checkbox {
      width: 16px;     /* Adjust icon size */
      height: 16px;    /* Adjust icon size */
      margin: auto;
      fill: none;
      stroke-width: 3;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
      color: var(--c-primary);
      display: inline-block;
    }

    .checkbox-wrapper-33 .checkbox .icon-checkbox path {
      transition: stroke-dashoffset var(--t-fast) var(--e-in);
      stroke-dasharray: 30px, 31px;
      stroke-dashoffset: 31px;
    }

    .checkbox-wrapper-33 .checkbox__textwrapper {
      margin: 0;
      display: flex;
      align-items: center;
    }

    .checkbox-wrapper-33 .checkbox__trigger:checked + .checkbox__symbol:after {
      animation: ripple-33 1.5s var(--e-out);
    }

    .checkbox-wrapper-33 .checkbox__trigger:checked + .checkbox__symbol .icon-checkbox path {
      transition: stroke-dashoffset var(--t-base) var(--e-out);
      stroke-dashoffset: 0px;
    }

    .checkbox-wrapper-33 .checkbox__trigger:focus + .checkbox__symbol {
      box-shadow: 0 0 0 0.25em var(--c-primary-20-percent-opacity);
    }

    @keyframes ripple-33 {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        opacity: 0;
        transform: scale(20);
      }
    }
  ` : `
    .container {
      cursor: pointer;
    }

    .container input {
      display: none;
    }

    .container svg {
      overflow: visible;
    }

    .path {
      fill: none;
      stroke: var(--text-primary);
      stroke-width: 6;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
      stroke-dasharray: 241 9999999;
      stroke-dashoffset: 0;
    }

    .container input:checked ~ svg .path {
      stroke-dasharray: 70.5096664428711 9999999;
      stroke-dashoffset: -262.2723388671875;
    }
  `}
`;

interface CheckboxItemProps {
  checked: boolean;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

export const CheckboxItem = ({ checked, onChangeAction, children }: CheckboxItemProps) => {
  const { isDark } = useTheme();

  return (
    <Checkbox3d $isDark={isDark}>
      {isDark ? (
        <div className="checkbox-wrapper-33">
          <label className="checkbox">
            <input 
              className="checkbox__trigger visuallyhidden" 
              type="checkbox"
              checked={checked}
              onChange={onChangeAction}
            />
            <span className="checkbox__symbol">
              <svg 
                aria-hidden="true" 
                className="icon-checkbox" 
                width="28px" 
                height="28px" 
                viewBox="0 0 28 28" 
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 14l8 7L24 7" />
              </svg>
            </span>
            <p className="checkbox__textwrapper">{children}</p>
          </label>
        </div>
      ) : (
        <label className="container flex items-center space-x-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChangeAction}
          />
          <svg viewBox="0 0 64 64" height="24" width="24">
            <path
              d="M 0 16 V 56 A 8 8 0 0 0 8 64 H 56 A 8 8 0 0 0 64 56 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 0 0 0 56 0 H 8 A 8 8 0 0 0 0 8 V 16"
              className="path"
            />
          </svg>
          {children}
        </label>
      )}
    </Checkbox3d>
  );
};

export default Checkbox3d;
