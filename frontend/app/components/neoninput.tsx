'use client'
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .dark & .input,
  .dark & select,
  .dark & input[type="date"],
  .dark & input[type="text"] {  
    background-color: rgb(20, 20, 19);
    border: none;
    padding: 10px;
    border-radius: 10px;
    outline: none;
    color: white;

  }

  .dark & .input:hover,
  .dark & select:hover,
  .dark & input[type="date"]:hover,
  .dark & input[type="text"]:hover {
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
  }

  .dark & .input:focus,
  .dark & select:focus,
  .dark & input[type="date"]:focus,
  .dark & input[type="text"]:focus {
    animation: rgbShadow 2s infinite linear;
    transform: translateY(-2px);
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

  /* เพิ่มเอฟเฟกต์สำหรับ select options */
  .dark & select option {
    background-color: rgb(20, 20, 19);
    color: white;
  }

  /* เพิ่มเอฟเฟกต์สำหรับ date input */
  .dark & input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.8;
    cursor: pointer;
  }

  .dark & input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  /* From Uiverse.io by ErzenXz (modified) */
  .light & .input,
  .light & select,
  .light & input[type="date"],
  .light & input[type="text"] {
    background-color: #F4F4F4;
    border: none;
    border-radius: 10px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #333;
    font-family: "Helvetica Neue", sans-serif;
    padding: 10px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
  }

  .light & .input:focus,
  .light & select:focus,
  .light & input[type="date"]:focus,
  .light & input[type="text"]:focus {
    background-color: #EAEAEA;
  }

  .light & .input:disabled,
  .light & select:disabled,
  .light & input[type="date"]:disabled,
  .light & input[type="text"]:disabled {
    background-color: #DADADA;
    color: #A3A3A3;
  }

  .light & .input:read-only,
  .light & select:read-only,
  .light & input[type="date"]:read-only,
  .light & input[type="text"]:read-only {
    background-color: #F4F4F4;
    color: #A3A3A3;
    cursor: not-allowed;
  }
`;

export default StyledWrapper;

