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

  /* Dark theme styles */
  .dark & .input {
    background-color: rgb(20, 20, 19);
    border: none;
    padding: 10px;
    padding-left: var(--size-button);
    border-radius: 50px;
    outline: none;
    color: white;
    height: var(--size-button);
    font-size: 15px;
    width: var(--size-button);
    transition: all ease 0.3s;
    cursor: pointer;
  }

  .dark & .input:hover {
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
  }

  .dark & .input:focus,
  .dark & .input:not(:invalid) {
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
    width: 360px;
    cursor: text;
  }

  .dark & .input:focus {
    animation: rgbShadow 2s infinite linear;
    transform: translateY(-2px);
  }

  @keyframes rgbShadow {
    0% { box-shadow: -2px -2px 15px #ff0000, 2px 2px 15px #0000ff; }
    33% { box-shadow: -2px -2px 15px #00ff00, 2px 2px 15px #ff0000; }
    66% { box-shadow: -2px -2px 15px #0000ff, 2px 2px 15px #00ff00; }
    100% { box-shadow: -2px -2px 15px #ff0000, 2px 2px 15px #0000ff; }
  }

  /* Light theme styles */
  .light & .input {
    background-color: #F4F4F4;
    border: none;
    border-radius: 50px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #333;
    font-family: "Helvetica Neue", sans-serif;
    padding: 10px;
    padding-left: var(--size-button);
    outline: none;
    height: var(--size-button);
    font-size: 15px;
    width: var(--size-button);
    transition: all ease 0.3s;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .light & .input:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .light & .input:focus,
  .light & .input:not(:invalid) {
    background-color: #EAEAEA;
    width: 360px;
    cursor: text;
    transform: translateY(-1px);
  }

  .input:focus + .icon,
  .input:not(:invalid) + .icon {
    pointer-events: all;
    cursor: pointer;
    color: var(--button-primary);
  }
`;

export default Input;
