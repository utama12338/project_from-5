
import styled from 'styled-components';



const StyledWrapper = styled.div`
  .input {  

    background-color:rgb(83, 83, 83);
    border: none;
    padding: 10px;
    border-radius: 10px;
    outline: none;
    color: white;
  }

  .input:focus {
    animation: rotateShadow 2s infinite linear;
  }

  @keyframes rotateShadow {
    0% {
      box-shadow: -2px -2px 8px 1px #aa00ff, 2px 2px 8px 1px #3700ff;
    }
    25% {
      box-shadow: -2px 2px 8px 1px #aa00ff, 2px -2px 8px 1px #3700ff;
    }
    50% {
      box-shadow: 2px 2px 8px 1px #aa00ff, -2px -2px 8px 1px #3700ff;
    }
    75% {
      box-shadow: 2px -2px 8px 1px #aa00ff, -2px 2px 8px 1px #3700ff;
    }
    100% {
      box-shadow: -2px -2px 8px 1px #aa00ff, 2px 2px 8px 1px #3700ff;
    }
  }`;


  export default StyledWrapper

