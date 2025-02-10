import React from 'react';
import styled from 'styled-components';

interface EditButtonProps {
  onClick?: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
    return (
      <StyledWrapper className="theme-transition">
        <button className="EditBtn" onClick={onClick}>
          <span className="IconContainer"> 
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="edit-icon">
              <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
            </svg>
          </span>
        </button>
      </StyledWrapper>
    );
  }

const StyledWrapper = styled.div`
  .EditBtn {
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

  .edit-icon {
    fill: var(--text-primary);
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  .EditBtn:hover {
    background-color: var(--background-secondary);
    transform: translateY(-4px);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);

    .edit-icon {
      fill: var(--text-secondary);
      transform: rotate(-12deg) scale(1.1);
    }
  }

  .EditBtn:active {
    transform: translateY(-2px) scale(0.98);
  }
  
  /* Dark mode specific styles */
  :root.dark & {
    .EditBtn {
      background-color: var(--background-secondary);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .EditBtn:hover {
      background-color: var(--background-tertiary);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);

      .edit-icon {
        fill: var(--text-hover, var(--text-primary));
        transform: rotate(-12deg) scale(1.1);
      }
    }

    .edit-icon {
      fill: var(--text-primary);
    }

    .text {
      color: var(--text-primary);
    }
  }
`;

export default EditButton;
