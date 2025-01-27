import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface FormBoxProps {
  children: React.ReactNode;
  header?: string;
  rightHeaderContent?: React.ReactNode;
}

const FormBox: React.FC<FormBoxProps> = ({ children, header, rightHeaderContent }) => {
  return (
    <StyledWrapper>
      <motion.div 
        className="box-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {(header || rightHeaderContent) && (
          <div className="box-header">
            {header && <h4 className="header-text">{header}</h4>}
            {rightHeaderContent && (
              <div className="header-right">
                {rightHeaderContent}
              </div>
            )}
          </div>
        )}
        <div className="box-content">
          {children}
        </div>
      </motion.div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .box-container {
    background-color: rgb(32, 32, 31);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: rgb(27, 27, 26);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .header-text {
    font-size: 1rem;
    font-weight: 500;
    color: white;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .box-content {
    padding: 1.5rem;
    background-color: rgb(32, 32, 31);
  }
`;

export default FormBox;
