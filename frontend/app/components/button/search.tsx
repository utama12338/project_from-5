import React from 'react';
import styled from 'styled-components';

interface SearchButtonProps {
  onClick?: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <span>
          <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg"><path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" /></svg>
        </span>
        <span className="text-sm text-white">กรองการค้นหา</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    width: 160px;
    height: 45px;
    border: none;
    background: linear-gradient(45deg, #EC4899, #DB2777);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2);
    cursor: pointer;
    overflow: hidden;
  }

  .button span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 1;
  }

  .button svg {
    width: 20px;
    height: 20px;
    fill: white;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .button::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%);
    top: -50%;
    left: -50%;
    transition: all 0.5s ease;
    opacity: 0;
    z-index: 0;
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(236, 72, 153, 0.3);
    background: linear-gradient(45deg, #DB2777, #BE185D);
  }

  .button:hover::before {
    opacity: 1;
    animation: ripple 1.5s infinite;
  }

  .button:hover svg {
    animation: searchAnimation 1.5s infinite;
    transform-origin: center;
  }

  .button:active {
    transform: scale(0.95);
  }

  @keyframes searchAnimation {
    0% {
      transform: rotate(0deg) scale(1);
    }
    25% {
      transform: rotate(-20deg) scale(1.1);
    }
    50% {
      transform: rotate(0deg) scale(1);
    }
    75% {
      transform: rotate(20deg) scale(1.1);
    }
    100% {
      transform: rotate(0deg) scale(1);
    }
  }

  @keyframes ripple {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Add pulsing effect for the text */
  .button:hover span {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default SearchButton;
