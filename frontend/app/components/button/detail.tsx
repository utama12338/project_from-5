import React from 'react';
import styled from 'styled-components';

interface DetailButtonProps {
  onClick?: () => void;
  isBulk?: boolean;
  count?: number;
}

const DetailButton: React.FC<DetailButtonProps> = ({ onClick }) => {
  return (
    <StyledWrapper className="theme-transition">
      <button className="DetailBtn" onClick={onClick}>
        <span className="IconContainer"> 
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="detail-icon">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .DetailBtn {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    border: none;
    background-color: var(--background-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .IconContainer {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detail-icon {
    fill: var(--text-primary);
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  .DetailBtn:hover {
    background-color: var(--background-secondary);
    transform: translateY(-4px);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);

    .detail-icon {
      fill: var(--text-secondary);
      transform: rotate(-12deg) scale(1.1);
    }
  }

  .DetailBtn:active {
    transform: translateY(-2px) scale(0.98);
  }
  
  /* Dark mode specific styles */
  :root.dark & {
    .DetailBtn {
      background-color: var(--background-secondary);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .DetailBtn:hover {
      background-color: var(--background-tertiary);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);

      .detail-icon {
        fill: var(--text-hover, var(--text-primary));
        transform: rotate(-12deg) scale(1.1);
      }
    }

    .detail-icon {
      fill: var(--text-primary);
    }

    .text {
      color: var(--text-primary);
    }
  }
`;

export default DetailButton;
