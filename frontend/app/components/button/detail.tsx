import React from 'react';
import styled from 'styled-components';

interface DetailButtonProps {
  onClick?: () => void;
  isBulk?: boolean;
  count?: number;
}

const DetailButton: React.FC<DetailButtonProps> = ({ onClick, isBulk, count }) => {
  return (
    <StyledWrapper>
      <button className="DetailBtn" onClick={onClick}>
        <span className="IconContainer"> 
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="detail-icon">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </span>
        <p className="text">
          {isBulk ? `ดูรายละเอียด ${count}` : 'ดูรายละเอียด'}
        </p>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .DetailBtn {
    width: 100%;
    height: 45px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.5s ease;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
    position: relative;
  }

  .IconContainer {
    position: relative;
    width: 30px;
    height: 30px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: 0.5s ease;
  }

  .detail-icon {
    fill: white;
    width: 20px;
    height: 20px;
    transition: transform 0.5s ease;
  }

  .text {
    color: white;
    font-size: 1.04em;
    font-weight: 600;
    z-index: 1;
    transition: 0.5s ease;
  }

  .DetailBtn::before {
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

  .DetailBtn:hover::before {
    left: 100%;
  }

  .DetailBtn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3);
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  }

  .DetailBtn:hover .detail-icon {
    transform: scale(1.2) rotate(-15deg);
  }

  .DetailBtn:active {
    transform: scale(0.95) translateY(-2px);
  }

  .DetailBtn:hover .text {
    transform: translateX(5px);
  }
`;

export default DetailButton;
