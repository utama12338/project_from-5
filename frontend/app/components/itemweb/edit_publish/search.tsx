import React from 'react';
import styled from 'styled-components';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="container">
        <input 
          type="text" 
          name="text" 
          className="input" 
          required 
          placeholder="Servername, IP, Serverole" 
          value={value}
          onChange={onChange}
          autoComplete='off'
        />
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
            <title>Search</title>
            <path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={32} />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={32} d="M338.29 338.29L448 448" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    position: relative;
    --size-button: 40px;
  }

  .input {
    padding-left: var(--size-button);
    height: var(--size-button);
    font-size: 15px;
    border: none;
    outline: none;
    width: var(--size-button);
    transition: all ease 0.3s;
    border-radius: 50px;
    cursor: pointer;

    /* Light theme styles */
    .light & {
      color: var(--text-primary);
      background-color: var(--card-background);
      box-shadow: var(--shadow-primary);
      
      &::placeholder {
        color: var(--text-muted);
      }

      &:focus,
      &:not(:invalid) {
        background-color: var(--background-secondary);
        box-shadow: 0 0 15px rgba(236, 72, 153, 0.2);
      }
    }

    /* Dark theme styles */
    .dark & {
      color: var(--text-primary);
      background-color: var(--card-background);
      box-shadow: var(--shadow-primary);
      
      &::placeholder {
        color: var(--text-muted);
      }

      &:focus,
      &:not(:invalid) {
        background-color: var(--background-secondary);
        box-shadow: 0 0 15px rgba(236, 72, 153, 0.3);
      }
    }
  }

  .input:focus,
  .input:not(:invalid) {
    width: 360px;
    cursor: text;
  }

  .input:hover {
    /* Common hover effect for both themes */
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.25);
  }

  /* Remove theme-specific animations and use consistent effects */
  .input:focus {
    box-shadow: 0 0 25px rgba(236, 72, 153, 0.35);
  }

  .input:focus + .icon,
  .input:not(:invalid) + .icon {
    pointer-events: all;
    cursor: pointer;
    color: var(--button-primary);
  }

  .container .icon {
    position: absolute;
    width: var(--size-button);
    height: var(--size-button);
    top: 0;
    left: 0;
    padding: 8px;
    pointer-events: none;
    transition: all 0.3s ease;
    color: var(--text-muted);
  }

  .container .icon svg {
    width: 100%;
    height: 100%;
  }
`;

export default Input;
