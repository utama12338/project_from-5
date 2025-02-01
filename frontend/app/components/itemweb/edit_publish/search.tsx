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
    color: white;
  }

  .input {
    padding-left: var(--size-button);
    height: var(--size-button);
    font-size: 15px;
    border: none;
    color: #fff;
    outline: none;
    width: var(--size-button);
    transition: all ease 0.3s;
    background-color: rgb(20, 20, 19);
    box-shadow: 1.5px 1.5px 3px #0e0e0e, -1.5px -1.5px 3px rgb(95 94 94 / 25%);
    border-radius: 50px;
    cursor: pointer;
  }

  .input:focus,
  .input:not(:invalid) {
    width: 400px;
    cursor: text;
    animation: rgbShadow 2s infinite linear;
  }

  .input:hover {
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
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

  .input:focus + .icon,
  .input:not(:invalid) + .icon {
    pointer-events: all;
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(255, 0, 255, 0.5));
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
  }

  .container .icon svg {
    width: 100%;
    height: 100%;
  }
`;

export default Input;
