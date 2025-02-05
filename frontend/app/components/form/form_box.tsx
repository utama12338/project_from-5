import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

interface FormBoxProps {
  children: React.ReactNode;
  header?: string;
  rightHeaderContent?: React.ReactNode;
  hasExpandableContent?: boolean;
  expandableContent?: React.ReactNode;
  initialContent?: React.ReactNode;
  totalItems?: number;
}

const FormBox: React.FC<FormBoxProps> = ({
  children,
  header,
  rightHeaderContent,
  hasExpandableContent,
  expandableContent,
  initialContent,
  totalItems = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
          {initialContent}  {/* Move this outside the conditional */}
          {hasExpandableContent && (
            <>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {expandableContent}
                  </motion.div>
                )}
              </AnimatePresence>
              {totalItems > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleExpand}
                  className="expand-button"
                >
                  {isExpanded ? 'แสดงน้อยลง' : `แสดงเพิ่มเติม ${totalItems - 1}`}
                </motion.button>
              )}
            </>
          )}
          {children}
        </div>
      </motion.div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .box-container {
    background-color: ${colors.background.secondary};
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: ${colors.shadows?.primary || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: ${colors.background.tertiary};
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .header-text {
    font-size: 1rem;
    font-weight: 500;
    color: ${colors.text.primary};
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .box-content {
    padding: 1.5rem;
    background-color: ${colors.background.secondary};
  }

  .expand-button {
    display: flex;
    margin: auto; // Center the button
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    color: ${colors.text.primary};
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    background: ${colors.background.tertiary};
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: fit-content;
    
    &:hover {
      background: ${colors.background.hover || 'rgba(96, 165, 250, 0.15)'};
      color: ${colors.text.hover || '#93c5fd'};
    }
  }
`;

export default FormBox;
