import styled from 'styled-components';

const StyledWrapper = styled.div`
  .input,
  select,
  input[type="date"],
  input[type="text"] {  
    background-color: rgb(20, 20, 19);
    border: none;
    padding: 10px;
    border-radius: 10px;
    outline: none;
    color: white;
    transition: all 0.3s ease;
  }

  .input:hover,
  select:hover,
  input[type="date"]:hover,
  input[type="text"]:hover {
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
    transform: translateY(-1px);
  }

  .input:focus,
  select:focus,
  input[type="date"]:focus,
  input[type="text"]:focus {
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
  select option {
    background-color: rgb(20, 20, 19);
    color: white;
  }

  /* เพิ่มเอฟเฟกต์สำหรับ date input */
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.8;
    cursor: pointer;
  }

  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
`;

export default StyledWrapper;

