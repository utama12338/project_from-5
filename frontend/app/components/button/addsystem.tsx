import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="CartBtn">
        <span className="IconContainer"> 
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="rgb(17, 17, 17)" className="cart">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
          </svg>
        </span>
        <p className="text">เพิ่มระบบใหม่</p>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .CartBtn {
    width: 160px;
    height: 45px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
    position: relative;
  }

  .CartBtn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  .CartBtn:hover::before {
    left: 100%;
  }

  .CartBtn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.3);
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  }

  .IconContainer {
    position: absolute;
    left: -50px;
    width: 30px;
    height: 30px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: 0.5s ease;
  }

  .cart {
    fill: white;
    transition: transform 0.5s ease;
  }

  .text {
    height: 100%;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 1;
    transition: 0.5s ease;
    font-size: 1.04em;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .CartBtn:hover .IconContainer {
    transform: translateX(58px) rotate(360deg);
    transition: 0.5s ease;
  }

  .CartBtn:hover .text {
    transform: translateX(10px);
  }

  .CartBtn:active {
    transform: scale(0.95) translateY(-2px);
  }

  .CartBtn::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    opacity: 0;
    transition: 0.5s ease;
    pointer-events: none;
  }

  .CartBtn:hover::after {
    opacity: 1;
    transform: scale(1.2);
  }
`;

export default Button;
