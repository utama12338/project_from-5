import React from 'react';
import styled from 'styled-components';

interface EditButtonProps {
  onClick?: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
    return (
      <StyledWrapper>
        <button className="EditBtn" onClick={onClick}>
          <span className="IconContainer"> 
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="edit-icon">
              <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
            </svg>
          </span>
          <p className="text">แก้ไขข้อมูล</p>
        </button>
      </StyledWrapper>
    );
  }

const StyledWrapper = styled.div`
  .EditBtn {
    width: 100%;
    height: 45px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.5s ease;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(251, 191, 36, 0.2);
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

  .edit-icon {
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

  .EditBtn::before {
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

  .EditBtn:hover::before {
    left: 100%;
  }

  .EditBtn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(251, 191, 36, 0.3);
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  }

  .EditBtn:hover .edit-icon {
    transform: rotate(15deg) scale(1.2);
  }

  .EditBtn:active {
    transform: scale(0.95) translateY(-2px);
  }
`;

export default EditButton;
