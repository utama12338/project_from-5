import React from "react";

interface ButtonProps {
  onClick?: () => void | Promise<void>;
}

const Button_v2: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button
      className="group relative flex h-9 w-9 flex-col items-center justify-center overflow-hidden rounded-xl border-2"
      onClick={onClick}
      style={{
        borderColor: "rgb(220, 38, 38)", // red-800
        backgroundColor: "rgb(255, 0, 0)", // red-400
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(220, 38, 38)")} // hover:bg-red-600
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(234, 0, 0)")} // กลับเป็น red-400
    >
      {/* SVG Animation */}
      <svg
        viewBox="0 0 1.625 1.625"
        className="absolute -top-7 delay-100 group-hover:top-3 group-hover:animate-spin group-hover:duration-1000"
        height={15}
        width={15}
        fill="rgb(255, 255, 255)" // white
      >
        
        <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195" />
        <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033" />
        <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016" />
       
      </svg>

      {/* Line Animation */}
      <svg
        width={16}
        fill="none"
        viewBox="0 0 39 7"
        className="origin-right duration-500 group-hover:rotate-90"
      >
        <line strokeWidth={4} stroke="rgb(255, 255, 255)" y2={5} x2={39} y1={5} />
        <line strokeWidth={3} stroke="rgb(255, 255, 255)" y2="1.5" x2="20.0357" y1="1.5" x1={12} />
      </svg>

      {/* Box Animation */}
      <svg width={16} fill="none" viewBox="0 0 33 39">
        <mask fill="white" id="path-1-inside-1_8_19">
          <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
        </mask>
        <path
          mask="url(#path-1-inside-1_8_19)"
          fill="rgb(255, 255, 255)"
          d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
        />
        <path strokeWidth={4} stroke="rgb(255, 255, 255)" d="M12 6L12 29" />
        <path strokeWidth={4} stroke="rgb(255, 255, 255)" d="M21 6V29" />
      </svg>
    </button>
  );
};

export default Button_v2;
