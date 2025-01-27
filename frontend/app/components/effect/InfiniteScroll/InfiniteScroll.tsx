import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

interface InfiniteScrollProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ 
  children, 
  maxHeight = '300px',
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > parseInt(maxHeight));
    }
  }, [children, maxHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <StyledWrapper $maxHeight={maxHeight}>
      <motion.div
        className={`scroll-content ${className}`}
        ref={contentRef}
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : maxHeight,
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        {children}
        
        {!isExpanded && showButton && (
          <div className="gradient-overlay" />
        )}
      </motion.div>

      {showButton && (
        <motion.button
          className="scroll-button"
          onClick={toggleExpand}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            rotate: isExpanded ? 180 : 0
          }}
        >
          <div className="button-content">
            <span>{isExpanded ? 'แสดงน้อยลง' : 'แสดงเพิ่มเติม'}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              className="arrow-icon"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
          <div className="button-blur" />
        </motion.button>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $maxHeight: string }>`
  position: relative;
  width: 100%;
  
  .scroll-content {
    position: relative;
    overflow: hidden;
    transition: height 0.5s ease;
  }

  .gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      to bottom,
      rgba(32, 32, 31, 0),
      rgba(32, 32, 31, 0.8) 50%,
      rgba(32, 32, 31, 1)
    );
    pointer-events: none;
  }

  .scroll-button {
    position: relative;
    width: 100%;
    padding: 12px;
    margin-top: -20px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 500;
    overflow: hidden;
    z-index: 10;
  }

  .button-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 2;
  }

  .arrow-icon {
    fill: currentColor;
    transition: transform 0.3s ease;
  }

  .button-blur {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(236, 72, 153, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    z-index: 1;
  }

  .scroll-button:hover {
    color: #EC4899;
    .button-blur {
      background: rgba(236, 72, 153, 0.2);
    }
  }
`;

export default InfiniteScroll;
